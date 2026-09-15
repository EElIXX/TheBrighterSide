
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sun, History, Trash2, Download, Menu, X, Copy, Check, RefreshCw, UserCircle, Share2, Lock, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import { checkApiStatus, streamChatMessage, type ApiStatus } from './services/geminiService';
import { Status } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MonarchButterfly } from './components/MonarchButterfly';
import { MonarchSanctuary } from './components/MonarchSanctuary';
import { VibrantMeadow } from './components/VibrantMeadow';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const MessageBubble: React.FC<{ msg: Message; isError?: boolean; onRetry?: () => void }> = ({ msg, isError, onRetry }) => {
  const isUser = msg.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "flex w-full mb-8 group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "max-w-[92%] sm:max-w-[85%] p-6 sm:p-7 rounded-3xl relative transition-all duration-300",
        isUser 
          ? "bg-gradient-to-br from-amber-100/95 via-orange-50/95 to-amber-200/80 text-stone-900 rounded-tr-none border-2 border-amber-400/60 shadow-lg shadow-amber-900/5" 
          : "glass-vibrant text-stone-950 rounded-tl-none relative shadow-xl shadow-orange-900/10 border-2 border-orange-300/60"
      )}>
        {/* User indicator */}
        {isUser && (
          <div className="absolute -top-3 right-5 flex items-center gap-1.5 px-3 py-0.5 bg-amber-400 text-stone-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-xs border border-white/70">
            <span>You</span>
          </div>
        )}

        {/* Model Silver Lining Badge with Perched Monarch Butterfly */}
        {!isUser && (
          <div className="absolute -top-4 left-4 flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-full shadow-md shadow-orange-500/35 z-10 ring-2 ring-white/90">
            <MonarchButterfly size={20} flutterSpeed={0.3} isResting={false} glow={false} />
            <span>ELIX Advice & Silver Lining</span>
            <Sparkles size={11} className="text-yellow-200 animate-pulse" />
          </div>
        )}

        {/* Message Text - Responsive Markdown for Model, High Contrast for User */}
        {isUser ? (
          <p className="font-sans font-bold text-base sm:text-lg text-stone-900 leading-relaxed whitespace-pre-wrap text-balance">
            {msg.text}
          </p>
        ) : (
          <div className="elix-message font-sans font-medium text-base sm:text-lg text-stone-950 leading-relaxed">
            <Markdown>{msg.text}</Markdown>
          </div>
        )}

        {/* Action button */}
        {!isUser && msg.text && (
          <div className="mt-4 pt-3 border-t border-orange-200/60 flex items-center justify-between">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 hover:bg-amber-200/90 text-orange-950 text-[11px] font-black uppercase tracking-widest rounded-full transition-all border border-orange-300/50 shadow-xs active:scale-95 cursor-pointer"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} className="text-orange-600" />}
              <span>{copied ? 'Saved to Clipboard' : 'Copy Advice & Silver Lining'}</span>
            </button>

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600/70 flex items-center gap-1">
              <span>Friendly Peer Advisor</span>
              <span className="text-orange-500">✨</span>
            </span>
          </div>
        )}
        
        {isError && onRetry && (
          <button 
            onClick={onRetry}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black uppercase tracking-widest rounded-full transition-all shadow-md shadow-orange-500/30"
          >
            <RefreshCw size={14} />
            <span>Reconnect With ELIX</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [problem, setProblem] = useState<string>('');
  const [history, setHistory] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [birthYear, setBirthYear] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [isCheckingApi, setIsCheckingApi] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleVerifyApi = useCallback(async () => {
    setIsCheckingApi(true);
    const res = await checkApiStatus();
    setApiStatus(res);
    setIsCheckingApi(false);
  }, []);

  useEffect(() => {
    let mounted = true;
    checkApiStatus().then((res) => {
      if (mounted) {
        setApiStatus(res);
        setIsCheckingApi(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history, status]);

  const currentYear = 2026;
  const userAge = birthYear && birthYear.length === 4 ? currentYear - parseInt(birthYear, 10) : null;

  const getGenerationTag = (age: number | null) => {
    if (!age) return null;
    if (age <= 14) return 'Gen Alpha Peer';
    if (age <= 28) return 'Gen Z Peer';
    if (age <= 45) return 'Millennial Peer';
    if (age <= 60) return 'Gen X Peer';
    return 'Kindred Spirit';
  };

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;
    setStatus(Status.LOADING);

    const userMessage: Message = { role: 'user', text: messageText };
    const nextHistory: Message[] = [...history, userMessage];

    // Append the user message and an empty placeholder for the streaming response
    setHistory([...nextHistory, { role: 'model', text: '' }]);

    let accumulatedText = '';

    await streamChatMessage(
      nextHistory,
      birthYear,
      (chunk) => {
        accumulatedText += chunk;
        setStatus(Status.SUCCESS);
        setHistory(prev => {
          const copy = [...prev];
          if (copy.length > 0 && copy[copy.length - 1].role === 'model') {
            copy[copy.length - 1] = { role: 'model', text: accumulatedText };
          }
          return copy;
        });
      },
      () => {
        setStatus(Status.SUCCESS);
      },
      (error) => {
        console.error('Chat stream error:', error);
        setStatus(Status.ERROR);
        setHistory(prev => {
          const copy = [...prev];
          if (copy.length > 0 && copy[copy.length - 1].role === 'model') {
            copy[copy.length - 1] = {
              role: 'model',
              text: accumulatedText || "The universe is momentarily quiet, but the light is returning. Let's try once more. ✨🦋"
            };
          }
          return copy;
        });
      }
    );
  }, [history, birthYear]);

  useEffect(() => {
    if (birthYear && birthYear.length === 4 && !isIntroFinished) {
      const timer = setTimeout(() => setIsIntroFinished(true), 700);
      return () => clearTimeout(timer);
    }
  }, [birthYear, isIntroFinished]);

  const handleSubmit = () => {
    if (!birthYear || !problem.trim()) return;
    const msg = problem.trim();
    setProblem('');
    sendMessage(msg);
  };

  const handleClear = () => {
    setProblem('');
    setHistory([]);
    setStatus(Status.IDLE);
    setIsIntroFinished(false);
    setIsMenuOpen(false);
  };

  const handleReset = () => {
    setBirthYear('');
    handleClear();
  };

  const saveJourney = () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    const timestamp = new Date().toLocaleString();
    const divider = "════════════════════════════════════════════════";
    let content = `ELIX | YOUR VIBRANT JOURNAL OF SILVER LININGS 🦋☀️\nSession Date: ${timestamp}\nAge at Session: ${userAge ?? 'Soulmate'}\n${divider}\n\n`;
    history.forEach((m) => {
      content += `[${m.role === 'user' ? 'YOU' : 'ELIX SILVER LINING'}]:\n${m.text}\n\n${divider}\n\n`;
    });
    content += `Keep finding the light. Every challenge is a cocoon for your wings. 🦋✨\nGenerated by ELIX | Silver Linings`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ELIX-Silver-Linings-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsMenuOpen(false);
  };

  const handleShare = () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    if (navigator.share) {
      navigator.share({
        title: 'ELIX | My Silver Linings Journey',
        text: 'Finding vibrant silver linings and strength with my companion ELIX. 🦋☀️',
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert('Your journey has been captured in your heart. You can also save it as a journal entry! ✨🦋');
    }
  };

  // Curated inspiration prompts for advice, perspective & encouragement
  const suggestedPrompts = [
    { label: "Give me advice: I feel stuck on a tough decision", icon: "🧭" },
    { label: "How should I handle feeling burned out this week?", icon: "🌿" },
    { label: "Need friendly advice after an unexpected setback", icon: "🦋" },
    { label: "Help me find the silver lining in today's dilemma", icon: "☀️" }
  ];

  return (
    <div className="h-screen w-screen flex flex-col items-center overflow-hidden relative selection:bg-orange-200 selection:text-orange-950 font-sans">
      {/* Radiant Glowing Atmosphere */}
      <div className="atmosphere" />
      
      {/* Lush Meadow with Wildflowers & Perched Monarchs */}
      <VibrantMeadow />

      {/* Interactive Monarch Butterfly Sanctuary */}
      <MonarchSanctuary active={true} />
      
      {/* Menu Hamburger Toggle */}
      <AnimatePresence>
        {isIntroFinished && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="fixed top-6 left-6 z-[110] p-3.5 glass-vibrant rounded-2xl hover:bg-amber-100/80 transition-all active:scale-95 shadow-md shadow-orange-900/10 border-2 border-orange-300/60"
            title="Open Journal Menu"
          >
            {isMenuOpen ? <X size={22} className="text-orange-950 font-black" /> : <Menu size={22} className="text-orange-950 font-black" />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-black/25 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-84 z-[105] glass-vibrant border-r-2 border-orange-300/60 p-8 sm:p-10 flex flex-col shadow-2xl"
            >
              <div className="mt-14 space-y-10">
                <div className="flex items-center gap-3">
                  <MonarchButterfly size={36} flutterSpeed={0.32} glow={false} />
                  <div>
                    <h2 className="text-xs font-black tracking-[0.4em] text-orange-900 uppercase">Journal Haven</h2>
                    <p className="text-[11px] font-bold text-orange-700/80">Reframing life with grace</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-5">
                  <MenuButton 
                    icon={<Download size={20} />} 
                    label="Save Journey" 
                    onClick={saveJourney} 
                    isLocked={!isPremium}
                  />
                  <MenuButton 
                    icon={<Share2 size={20} />} 
                    label="Share Journey" 
                    onClick={handleShare} 
                    isLocked={!isPremium}
                  />
                  <MenuButton icon={<History size={20} />} label="Update Age" onClick={handleReset} />
                  <MenuButton icon={<Trash2 size={20} />} label="Clear Canvas" onClick={handleClear} />
                  
                  {!isPremium && (
                    <button 
                      onClick={() => {
                        setShowPremiumModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="mt-4 w-full p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-500/30 border-2 border-white/50"
                    >
                      <Sparkles size={18} />
                      <span className="text-sm tracking-wide">Unlock Premium • $5/mo</span>
                    </button>
                  )}
                </nav>
              </div>

              <div className="mt-auto pt-6 border-t border-orange-200/80 flex items-center justify-between">
                <p className="text-[11px] font-black text-orange-950/60 tracking-[0.3em] uppercase">ELIX • Golden Haven</p>
                <MonarchButterfly size={24} flutterSpeed={0.4} isResting={true} glow={false} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Premium Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPremiumModal(false)}
              className="absolute inset-0 bg-stone-900/50 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-vibrant p-8 sm:p-10 rounded-[2.5rem] text-center space-y-6 border-2 border-orange-400 shadow-2xl"
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-orange-500/40 border-2 border-white/80">
                <Lock size={30} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-center mb-1">
                  <MonarchButterfly size={36} flutterSpeed={0.3} glow={true} />
                </div>
                <h3 className="text-3xl font-black tracking-tight text-orange-950">Vibrant Journey</h3>
                <p className="text-stone-800 font-serif font-bold italic text-base leading-relaxed">
                  Preserve your breakthroughs, export your silver linings journal, and share light with those you cherish.
                </p>
                <div className="pt-2">
                  <span className="text-4xl font-black text-orange-950">$5</span>
                  <span className="text-orange-800 text-xs font-black uppercase tracking-widest ml-1.5">/ month</span>
                </div>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setIsPremium(true);
                    setShowPremiumModal(false);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl font-black tracking-wide text-base hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-500/35 border-2 border-white/60"
                >
                  Accept & Subscribe
                </button>
                <p className="text-[10px] font-bold text-orange-950/60 leading-relaxed px-4">
                  Cancel anytime. Your support keeps ELIX vibrant, warm, and freely available to souls seeking light. 🦋
                </p>
              </div>
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="text-xs font-black uppercase tracking-widest text-orange-900/60 hover:text-orange-950 transition-colors"
              >
                Maybe Later
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main App Container */}
      <main className="w-full max-w-2xl mx-auto flex flex-col h-full z-10 px-5 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {!isIntroFinished ? (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-12 pb-16"
            >
              {/* Vibrant Hero Sun with Monarch Butterflies */}
              <div className="space-y-6 relative">
                {/* Radiant Backdrop Pulsing Halo */}
                <motion.div 
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.25, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                    scale: { duration: 7, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-64 h-64 bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 rounded-full blur-3xl opacity-60 mx-auto absolute inset-0 -z-10"
                />

                {/* Sun and Floating Fluttering Monarchs */}
                <div className="relative inline-block">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], rotate: [0, 3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex justify-center"
                  >
                    <Sun size={130} className="text-amber-500 drop-shadow-[0_0_45px_rgba(245,158,11,0.8)]" />
                  </motion.div>

                  {/* Monarch 1 circling the sun */}
                  <motion.div
                    className="absolute -top-3 -right-6"
                    animate={{ y: [0, -12, 0], x: [0, 8, 0], rotate: [12, -8, 12] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <MonarchButterfly size={46} flutterSpeed={0.3} glow={true} angle={15} />
                  </motion.div>

                  {/* Monarch 2 beside the sun */}
                  <motion.div
                    className="absolute -bottom-2 -left-8"
                    animate={{ y: [0, 10, 0], x: [0, -6, 0], rotate: [-10, 14, -10] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  >
                    <MonarchButterfly size={38} flutterSpeed={0.35} glow={true} angle={-20} />
                  </motion.div>
                </div>

                {/* Bold Header Title */}
                <h1 className="text-7xl sm:text-9xl font-black tracking-tighter leading-none bg-gradient-to-r from-stone-950 via-orange-950 to-amber-900 bg-clip-text text-transparent drop-shadow-sm">
                  ELIX
                </h1>

                <p className="text-2xl sm:text-3xl font-serif font-bold italic text-orange-950/90 max-w-lg mx-auto leading-snug">
                  Your soul companion for finding the vibrant silver lining in every moment.
                </p>
              </div>

              {/* Birth Year Input Container */}
              <div className="w-full max-w-xs space-y-6 glass-vibrant p-6 rounded-3xl border-2 border-orange-400/60 shadow-xl">
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-[0.35em] text-orange-900">
                    What year were you born?
                  </p>
                  <p className="text-[11px] font-bold text-orange-800/80">
                    ELIX adapts friendly peer advice & slang to your exact age.
                  </p>
                  <input 
                    type="number"
                    value={birthYear}
                    onChange={(e) => e.target.value.length <= 4 && setBirthYear(e.target.value)}
                    placeholder="YYYY"
                    autoFocus
                    className="w-full text-center bg-transparent border-b-4 border-orange-400 focus:border-orange-600 text-5xl font-black py-2 outline-none transition-all placeholder:text-stone-300 text-stone-950 tracking-widest"
                  />
                </div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: birthYear.length === 4 ? 1 : 0.6 }}
                  className="text-xs font-black tracking-[0.2em] uppercase text-orange-950 flex items-center justify-center gap-2"
                >
                  {birthYear.length === 4 ? (
                    <>
                      <MonarchButterfly size={20} flutterSpeed={0.25} glow={false} />
                      <span>{currentYear - parseInt(birthYear, 10)} Yrs • {getGenerationTag(currentYear - parseInt(birthYear, 10))}</span>
                    </>
                  ) : (
                    <span>Enter 4 Digits to Begin</span>
                  )}
                </motion.div>

                {/* Live API Key Status Pill */}
                <div className="pt-2 flex items-center justify-center">
                  <button
                    onClick={handleVerifyApi}
                    disabled={isCheckingApi}
                    className={cn(
                      "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border shadow-xs transition-all cursor-pointer",
                      apiStatus?.active
                        ? "bg-emerald-100/90 text-emerald-950 border-emerald-400 hover:bg-emerald-200/90"
                        : "bg-amber-100/90 text-amber-950 border-amber-400 hover:bg-amber-200/90"
                    )}
                    title="Click to check Gemini API status"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span
                        className={cn(
                          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                          apiStatus?.active ? "bg-emerald-500" : "bg-amber-500"
                        )}
                      />
                      <span
                        className={cn(
                          "relative inline-flex rounded-full h-2.5 w-2.5",
                          apiStatus?.active ? "bg-emerald-600" : "bg-amber-600"
                        )}
                      />
                    </span>
                    <span>
                      {isCheckingApi
                        ? "Checking API..."
                        : apiStatus?.active
                        ? "Gemini API Active ✨"
                        : "API Connecting..."}
                    </span>
                    <RefreshCw size={11} className={cn("text-stone-700", isCheckingApi && "animate-spin")} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <header className="flex items-center justify-between mb-4 glass-vibrant px-5 py-3 rounded-2xl border-2 border-orange-300/70 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center relative shadow-md shadow-orange-500/30">
                    <Sun size={26} className="text-white" />
                    <div className="absolute -top-2 -right-2">
                      <MonarchButterfly size={22} flutterSpeed={0.35} glow={false} angle={25} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-widest uppercase text-stone-950 flex items-center gap-2">
                      <span>ELIX</span>
                      <Sparkles size={14} className="text-amber-500" />
                    </h2>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Vibrant Soul Companion</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Live API Status indicator */}
                  <button
                    onClick={handleVerifyApi}
                    disabled={isCheckingApi}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider border shadow-xs transition-all cursor-pointer",
                      apiStatus?.active
                        ? "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100"
                        : "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                    )}
                    title="Click to check Gemini API status"
                  >
                    <span className="relative flex h-2 w-2">
                      <span
                        className={cn(
                          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                          apiStatus?.active ? "bg-emerald-400" : "bg-amber-400"
                        )}
                      />
                      <span
                        className={cn(
                          "relative inline-flex rounded-full h-2 w-2",
                          apiStatus?.active ? "bg-emerald-500" : "bg-amber-500"
                        )}
                      />
                    </span>
                    <span className="hidden xs:inline">{apiStatus?.active ? "API Active" : "Connecting"}</span>
                    <RefreshCw size={10} className={cn("text-stone-600", isCheckingApi && "animate-spin")} />
                  </button>

                  {/* Age and generational peer context tag */}
                  <div className="flex items-center gap-1.5 text-xs text-orange-950 font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-amber-200/70 border border-orange-300 shadow-xs">
                    <UserCircle size={15} className="text-orange-600" />
                    <span>{userAge ? `${userAge} yrs • ${getGenerationTag(userAge)}` : `Born in ${birthYear}`}</span>
                  </div>
                </div>
              </header>

              {/* Chat Message Scrollable Area */}
              <div 
                ref={scrollRef}
                className="flex-1 px-1 sm:px-2 space-y-4 overflow-y-auto pb-10 mask-fade"
              >
                {/* Empty State / Welcome */}
                {history.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8 space-y-6">
                    <div className="relative inline-block">
                      <MonarchButterfly size={68} flutterSpeed={0.32} glow={true} />
                      <div className="absolute -bottom-2 -right-3">
                        <Sparkles size={20} className="text-amber-500 animate-spin" />
                      </div>
                    </div>

                    <div className="space-y-2 max-w-md">
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-orange-950">
                        Friendly Advice & Silver Linings.
                      </h3>
                      <p className="text-base sm:text-lg font-serif font-bold italic text-orange-900/80 leading-relaxed">
                        Share what's on your heart. ELIX gives practical peer advice and illuminates the bright silver lining in your corner. ✨
                      </p>
                    </div>

                    {/* Quick suggestion chips */}
                    <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {suggestedPrompts.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setProblem(p.label);
                          }}
                          className="flex items-center gap-2.5 px-4 py-3 bg-white/90 hover:bg-amber-100/90 text-stone-900 font-bold text-xs sm:text-sm text-left rounded-2xl border-2 border-orange-300/60 shadow-sm transition-all hover:scale-[1.02] active:scale-95 group"
                        >
                          <span className="text-base group-hover:scale-125 transition-transform">{p.icon}</span>
                          <span className="line-clamp-1">{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Render Messages */}
                {history.map((msg, i) => (
                  <MessageBubble key={i} msg={msg} />
                ))}
                
                {/* Loading indicator with warm pulsing dots & mini monarch */}
                {status === Status.LOADING && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-6 py-4 glass-vibrant rounded-3xl w-fit border-2 border-orange-300/70 shadow-md"
                  >
                    <MonarchButterfly size={24} flutterSpeed={0.25} glow={false} />
                    <span className="text-xs font-black uppercase tracking-widest text-orange-900">
                      Unfolding your advice & silver lining...
                    </span>
                    <div className="flex gap-1.5 ml-1">
                      {[0, 1, 2].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" 
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="mt-2 pb-2 pt-2 border-t-2 border-orange-200/60">
                <div className="glass-vibrant rounded-3xl p-2.5 flex items-center gap-2 border-2 border-orange-400/70 focus-within:border-orange-600 focus-within:ring-4 focus-within:ring-orange-400/25 shadow-xl shadow-orange-900/10 transition-all">
                  <textarea
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit())}
                    placeholder="Ask for friendly advice, share what's on your mind, or find the silver lining..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-stone-950 placeholder:text-stone-400 p-3 min-h-[56px] max-h-32 resize-none text-base sm:text-lg font-bold outline-none"
                    disabled={status === Status.LOADING}
                    rows={1}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={status === Status.LOADING || !problem.trim()}
                    className="w-13 h-13 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 shadow-lg shadow-orange-500/40 border-2 border-white/60 cursor-pointer"
                    title="Send message"
                  >
                    <Send size={22} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        .mask-fade {
          mask-image: linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%);
        }
      `}</style>
    </div>
  );
}

const MenuButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; isLocked?: boolean }> = ({ icon, label, onClick, isLocked }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-4 text-stone-800 hover:text-orange-950 transition-all group relative w-full text-left cursor-pointer p-2 rounded-2xl hover:bg-amber-200/50"
  >
    <div className="w-11 h-11 glass-vibrant rounded-xl flex items-center justify-center group-hover:bg-amber-300/60 transition-colors border border-orange-300 text-orange-900 shadow-xs">
      {icon}
    </div>
    <span className="text-base font-black tracking-wide">{label}</span>
    {isLocked && (
      <div className="ml-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white p-1.5 rounded-full shadow-xs">
        <Lock size={12} />
      </div>
    )}
  </button>
);

