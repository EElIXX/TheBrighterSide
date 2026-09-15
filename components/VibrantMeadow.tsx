import React from 'react';
import { motion } from 'motion/react';
import { MonarchButterfly } from './MonarchButterfly';

export const VibrantMeadow: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-44 z-0 pointer-events-none overflow-hidden select-none">
      {/* Radiant Meadow Glow Backdrop */}
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-emerald-600/35 via-lime-500/25 to-transparent blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 left-[15%] w-[70%] h-28 bg-gradient-to-t from-amber-500/30 via-orange-400/20 to-transparent blur-3xl pointer-events-none" />

      {/* Back Layer Hill - Golden Sunlit Slope */}
      <svg
        viewBox="0 0 1440 220"
        className="absolute bottom-0 left-0 right-0 w-full h-36 opacity-70 preserve-3d"
        preserveAspectRatio="none"
      >
        <path
          d="M0,130 C320,80 540,160 880,100 C1140,50 1320,110 1440,80 L1440,220 L0,220 Z"
          fill="url(#backHillGrad)"
        />
        <defs>
          <linearGradient id="backHillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#84cc16" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>

      {/* Front Layer Hill - Vibrant Emerald & Meadow Gold */}
      <svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 left-0 right-0 w-full h-28 opacity-85 preserve-3d"
        preserveAspectRatio="none"
      >
        <path
          d="M0,110 C240,60 480,140 760,80 C1080,20 1280,100 1440,60 L1440,200 L0,200 Z"
          fill="url(#frontHillGrad)"
        />
        <defs>
          <linearGradient id="frontHillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#10b981" stopOpacity="0.65" />
            <stop offset="80%" stopColor="#65a30d" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>

      {/* Wildflower blooms scattered across the hills (Poppies, Sunflowers, Lavender) */}
      <div className="absolute bottom-2 left-[6%] flex items-end gap-1.5 opacity-90">
        <span className="text-2xl drop-shadow-md animate-pulse">🌺</span>
        <span className="text-xl -mb-1">🌿</span>
        <span className="text-2xl drop-shadow-md">🌼</span>
      </div>

      <div className="absolute bottom-4 left-[22%] flex items-end gap-1 opacity-90">
        <span className="text-2xl drop-shadow-md">🌻</span>
        <span className="text-xl">🌸</span>
        <span className="text-2xl drop-shadow-md">🪴</span>
      </div>

      <div className="absolute bottom-3 left-[48%] flex items-end gap-2 opacity-85">
        <span className="text-2xl drop-shadow-md">🌼</span>
        <span className="text-2xl drop-shadow-md">🌺</span>
        <span className="text-xl">🌿</span>
      </div>

      <div className="absolute bottom-5 right-[24%] flex items-end gap-1.5 opacity-90">
        <span className="text-2xl drop-shadow-md">🌻</span>
        <span className="text-xl">🌸</span>
        <span className="text-2xl drop-shadow-md">🌼</span>
      </div>

      <div className="absolute bottom-2 right-[8%] flex items-end gap-1 opacity-90">
        <span className="text-2xl drop-shadow-md">🌺</span>
        <span className="text-xl">🌿</span>
        <span className="text-2xl drop-shadow-md">🌻</span>
      </div>

      {/* Perched & Gently Hovering Monarch Butterflies on the Meadow Flowers */}
      {/* Left Perched Butterfly */}
      <motion.div
        className="absolute bottom-11 left-[9%] pointer-events-auto"
        animate={{ y: [0, -6, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MonarchButterfly size={42} flutterSpeed={0.45} isResting={true} angle={-12} />
      </motion.div>

      {/* Center Meadow Fluttering Butterfly */}
      <motion.div
        className="absolute bottom-14 left-[44%] pointer-events-auto"
        animate={{ y: [0, -12, 0], x: [0, 8, 0], rotate: [5, -4, 5] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MonarchButterfly size={36} flutterSpeed={0.3} isResting={false} angle={15} />
      </motion.div>

      {/* Right Perched Butterfly on Flower */}
      <motion.div
        className="absolute bottom-12 right-[12%] pointer-events-auto"
        animate={{ y: [0, -8, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <MonarchButterfly size={40} flutterSpeed={0.4} isResting={true} angle={18} />
      </motion.div>
    </div>
  );
};
