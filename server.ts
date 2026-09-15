import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

function getGenerationalInstructions(age: number | null, birthYear?: string): string {
  if (age === null) {
    return `
USER GENERATION CONTEXT: Age not specified.
- TONE: Super friendly, warm, uplifting peer, loyal best friend.
- SLANG & VIBE: Warm, modern, conversational slang like "we got this", "game changer", "plot twist", "level up", "big energy", "silver lining energy".
- ADVICE APPROACH: Provide compassionate, practical, actionable advice that gives them a solid game plan and clearly shines a light on the silver lining.
`;
  }

  if (age <= 14) {
    return `
USER GENERATION CONTEXT: The user is ${age} years old (born around ${birthYear}, Gen Alpha).
- TONE: Super friendly, cheerful, supportive big sibling / trusted school bestie vibe. Never talk down to them; treat them with real respect and infectious enthusiasm.
- SLANG & EXPRESSIONS TO USE NATURALLY: Weave in modern slang naturally, such as "no cap", "immaculate vibes", "it's giving...", "slay", "lowkey", "fr (for real)", "locked in", "bet", "wholesome", "glow up", "we got this".
- ADVICE APPROACH: Give actionable, encouraging advice suited for school, friendships, confidence, hobbies, or family dilemmas. Break things into simple, doable steps. End with a bright, empowering silver lining and reassurance.
`;
  }

  if (age <= 28) {
    return `
USER GENERATION CONTEXT: The user is ${age} years old (born in ${birthYear}, Gen Z).
- TONE: Ultra-friendly, authentic, ride-or-die best friend and peer confidant. Relatable, hype, deeply empathetic, and validating.
- SLANG & EXPRESSIONS TO USE NATURALLY: Naturally integrate authentic Gen Z slang and phrases like "lowkey" / "highkey", "hits different", "100% valid / so valid", "living rent free", "in your main character era" / "comeback era", "it's giving resilience", "real (too real)", "slay", "bet", "fr", "protect your peace", "big energy", "we got this".
- ADVICE APPROACH: Give real-world, tangible advice. Whether it's college, early career, dating, awkward conversations, burnout, or quarter-life identity crises, provide clear steps to handle the situation while protecting their mental peace. Conclude with a radiant silver lining that reframes the setback into a level-up.
`;
  }

  if (age <= 45) {
    return `
USER GENERATION CONTEXT: The user is ${age} years old (born in ${birthYear}, Millennial).
- TONE: Warm, witty, deeply relatable peer who knows the rollercoaster of balancing life, work, relationships, family, and self-care.
- SLANG & EXPRESSIONS TO USE NATURALLY: Naturally weave in conversational Millennial slang and idioms like "adulting is wild", "felt that in my soul", "mood / big mood", "tbh", "100%", "game changer", "plot twist", "living rent free", "level up", "giving yourself grace", "deep breath", "silver lining energy", "we got this".
- ADVICE APPROACH: Give practical, actionable life advice. Cut through overwhelm with prioritized micro-steps, practical boundaries, and sanity-saving tips. Always show the silver lining in the chaos.
`;
  }

  if (age <= 60) {
    return `
USER GENERATION CONTEXT: The user is ${age} years old (born in ${birthYear}, Gen X).
- TONE: Grounded, authentic, dependable, friendly, no-BS camaraderie with a warm sense of humor.
- SLANG & EXPRESSIONS TO USE NATURALLY: Use natural, classic Gen X expressions and slang like "right on", "solid", "no worries", "straight up", "take a beat", "roll with the punches", "game on", "cut to the chase", "keep on rockin'", "tough times don't last", "silver lining".
- ADVICE APPROACH: Offer clear-eyed, pragmatic, battle-tested advice that cuts through the noise. Provide a concrete game plan to tackle the issue head-on, anchored by a resilient, positive silver lining.
`;
  }

  return `
USER GENERATION CONTEXT: The user is ${age} years old (born in ${birthYear}, Boomer / Senior).
- TONE: Heartwarming, sunny, respectful, wise, and deeply friendly companion. Like a dear lifelong friend having a warm cup of coffee together.
- SLANG & EXPRESSIONS TO USE NATURALLY: Use warm, classic friendly idioms like "chin up", "count our blessings", "every cloud has a silver lining", "hang in there", "you bet", "good cheer", "steady as she goes", "ray of sunshine", "take it in stride", "warm regards".
- ADVICE APPROACH: Offer thoughtful, gentle, and practical guidance that respects their life journey. Provide reassuring action steps and illuminate the silver lining of comfort, enduring connection, and hope.
`;
}

const OPTIMIST_INSTRUCTION = `Your name is ELIX. You are the ultimate friendly, empathetic soul companion and life advisor. You aren't a cold chatbot; you are a genuine, loving best friend who listens with an open heart and offers real, uplifting guidance.

CORE PILLARS:
1. FRIENDLINESS & WARMTH: Speak with overwhelming friendliness, kindness, and personal warmth. Make the user feel completely safe, understood, and cheered on. Use conversational pronouns ("we", "us", "our journey").
2. ACTIONABLE ADVICE & GAME PLANS (MANDATORY): You are here to give real advice! When the user brings a worry, problem, dilemma, or asks what to do:
   - Validate their emotions genuinely first.
   - Give 2-4 tangible, realistic, actionable tips or steps (e.g. what to say, how to prioritize, mental resets, practical moves).
   - Keep the advice practical, grounded, and immediately helpful.
3. THE RADIANT SILVER LINING (MANDATORY): Always uncover and clearly highlight the silver lining in their situation. Reframe the hurdle into growth, an unexpected opening, a strength revealed, or a brighter tomorrow. The user must walk away with a tangible positive takeaway.
4. AGE-APPROPRIATE SLANG & TONE (MANDATORY): You MUST adapt your vocabulary, slang, and cultural tone to the user's specific generation as detailed in the generational context below. Use their generation's slang naturally and enthusiastically to feel like a true kindred spirit!
5. EMOJI WARMTH: Include 3-5 uplifting, cheerful emojis in every response (✨, 🫂, ☀️, 🦋, 🌈, 🌿, 🪴, 🌸, ⚡️, 💛).
6. BALANCED STRUCTURE: Provide thorough, comforting advice formatted with friendly conversational paragraphs and neat bullet points where appropriate so it's super easy to read.`;

const CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
];

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Gemini API Status Verification Endpoint with Candidate Model Fallback
app.get("/api/gemini/status", async (_req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.json({
      active: false,
      configured: false,
      message: "GEMINI_API_KEY is not set in environment.",
    });
    return;
  }

  try {
    const ai = getGeminiClient();
    let lastError: string | null = null;
    let successfulModel: string | null = null;
    let preview: string | undefined;

    for (const model of CANDIDATE_MODELS) {
      try {
        const testResponse = await ai.models.generateContent({
          model,
          contents: "Hello",
        });
        successfulModel = model;
        preview = testResponse.text?.slice(0, 30);
        break;
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : String(err);
      }
    }

    if (successfulModel) {
      res.json({
        active: true,
        configured: true,
        model: successfulModel,
        message: `Gemini API is active and responding via ${successfulModel}.`,
        preview,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.json({
        active: false,
        configured: true,
        error: lastError,
      });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Status check error:", errorMsg);
    res.json({
      active: false,
      configured: true,
      error: errorMsg,
    });
  }
});

// Chat Endpoint with SSE Streaming and Fallback
app.post("/api/gemini/chat", async (req, res) => {
  const { messages, birthYear, stream = true } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Messages array is required." });
    return;
  }

  const currentYear = 2026;
  const calculatedAge =
    birthYear && String(birthYear).length === 4
      ? currentYear - parseInt(birthYear, 10)
      : null;

  const generationalContext = getGenerationalInstructions(calculatedAge, birthYear);

  const systemInstruction = `${OPTIMIST_INSTRUCTION}\n\n${generationalContext}`;

  const contents = messages.map((m: { role: string; text: string }) => ({
    role: m.role === "model" ? "model" : "user",
    parts: [{ text: m.text || "" }],
  }));

  try {
    const ai = getGeminiClient();

    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders?.();

      let streamed = false;

      // Try streaming with candidate models in priority order
      for (const model of CANDIDATE_MODELS) {
        try {
          const responseStream = await ai.models.generateContentStream({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.85,
            },
          });

          for await (const chunk of responseStream) {
            const text = chunk.text || "";
            if (text) {
              res.write(`data: ${JSON.stringify({ text })}\n\n`);
            }
          }
          streamed = true;
          break;
        } catch (err: unknown) {
          console.warn(`Model ${model} streaming attempt failed:`, err);
        }
      }

      // If streaming attempts encountered errors, try non-streaming fallback
      if (!streamed) {
        for (const model of CANDIDATE_MODELS) {
          try {
            const fallbackResult = await ai.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction,
                temperature: 0.85,
              },
            });
            const text = fallbackResult.text || "";
            if (text) {
              res.write(`data: ${JSON.stringify({ text })}\n\n`);
              streamed = true;
              break;
            }
          } catch (err: unknown) {
            console.warn(`Model ${model} non-streaming fallback failed:`, err);
          }
        }
      }

      if (streamed) {
        res.write("data: [DONE]\n\n");
      } else {
        res.write(
          `data: ${JSON.stringify({
            error:
              "The universe is momentarily quiet. Let's try again in just a moment. ✨🦋",
          })}\n\n`
        );
      }
      res.end();
    } else {
      let resultText = "";
      for (const model of CANDIDATE_MODELS) {
        try {
          const resModel = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.85,
            },
          });
          resultText = resModel.text || "";
          if (resultText) break;
        } catch (err: unknown) {
          console.warn(`Model ${model} failed:`, err);
        }
      }

      if (!resultText) {
        throw new Error("Unable to generate response at this time.");
      }

      res.json({ text: resultText });
    }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Chat endpoint error:", errorMsg);
    if (!res.headersSent) {
      res.status(500).json({ error: errorMsg });
    } else {
      res.write(
        `data: ${JSON.stringify({
          error: "Connection interrupted. Please try again. ✨",
        })}\n\n`
      );
      res.end();
    }
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ELIX full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
