export interface ApiStatus {
  active: boolean;
  configured: boolean;
  model?: string;
  message?: string;
  error?: string;
}

export interface ChatMessageItem {
  role: 'user' | 'model';
  text: string;
}

/**
 * Verifies if the Gemini API key is configured and actively operational.
 */
export const checkApiStatus = async (): Promise<ApiStatus> => {
  try {
    const res = await fetch('/api/gemini/status');
    if (!res.ok) {
      return { active: false, configured: false, error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    return data;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { active: false, configured: false, error: errorMsg };
  }
};

/**
 * Streams conversation responses from the server-side Gemini API.
 */
export const streamChatMessage = async (
  messages: ChatMessageItem[],
  birthYear: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        birthYear,
        stream: true,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) {
      throw new Error('Streaming response body reader unavailable.');
    }

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const dataStr = trimmed.slice(6).trim();

        if (dataStr === '[DONE]') {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.error) {
            onError(parsed.error);
            return;
          }
          if (parsed.text) {
            onChunk(parsed.text);
          }
        } catch {
          // ignore non-json line
        }
      }
    }

    onDone();
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    onError(errorMsg);
  }
};
