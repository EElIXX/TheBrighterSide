import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MonarchButterfly } from './MonarchButterfly';

interface ButterflyData {
  id: number;
  startX: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  flutterSpeed: number;
  pathKey: number;
}

interface SparkleItem {
  id: number;
  x: number;
  y: number;
}

export const MonarchSanctuary: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const [sparkles, setSparkles] = useState<SparkleItem[]>([]);
  const sparkleCounterRef = useRef(0);

  // Base drifting butterflies in peaceful natural flight paths across the screen
  const baseButterflies: ButterflyData[] = [
    { id: 1, startX: 10, startY: 20, size: 52, duration: 22, delay: 0, flutterSpeed: 0.32, pathKey: 1 },
    { id: 2, startX: 85, startY: 35, size: 44, duration: 26, delay: 4, flutterSpeed: 0.28, pathKey: 2 },
    { id: 3, startX: 25, startY: 65, size: 38, duration: 19, delay: 8, flutterSpeed: 0.35, pathKey: 3 },
    { id: 4, startX: 70, startY: 75, size: 48, duration: 24, delay: 2, flutterSpeed: 0.3, pathKey: 4 },
    { id: 5, startX: 45, startY: 15, size: 36, duration: 28, delay: 11, flutterSpeed: 0.38, pathKey: 1 },
  ];

  // Handle clicking a butterfly to spawn a playful golden sparkle burst
  const handleButterflyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    sparkleCounterRef.current += 1;
    const newSparkleId = sparkleCounterRef.current;
    setSparkles((prev) => [...prev.slice(-8), { id: newSparkleId, x, y }]);
  };

  useEffect(() => {
    if (sparkles.length === 0) return;
    const timer = setTimeout(() => {
      setSparkles((prev) => prev.slice(1));
    }, 1100);
    return () => clearTimeout(timer);
  }, [sparkles]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {/* Drifting Monarch Butterflies */}
      {baseButterflies.map((b) => {
        // Distinct curved floating paths
        const xOffset = b.pathKey % 2 === 0 ? [0, 40, -30, 60, 0] : [0, -50, 35, -20, 0];
        const yOffset = [0, -35, 20, -50, 0];
        const rotOffset = [0, 15, -12, 18, 0];

        return (
          <motion.div
            key={b.id}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${b.startX}%`,
              top: `${b.startY}%`,
            }}
            animate={{
              x: xOffset,
              y: yOffset,
              rotate: rotOffset,
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.25, transition: { duration: 0.2 } }}
            onClick={handleButterflyClick}
            title="A monarch butterfly bringing hope & transformation ✨"
          >
            <MonarchButterfly
              size={b.size}
              flutterSpeed={b.flutterSpeed}
              glow={true}
            />
          </motion.div>
        );
      })}

      {/* Sparkles on Butterfly interaction */}
      <AnimatePresence>
        {sparkles.map((sp) => (
          <motion.div
            key={sp.id}
            initial={{ opacity: 1, scale: 0.4 }}
            animate={{ opacity: 0, scale: 1.8, y: -40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="fixed pointer-events-none z-50 flex items-center justify-center"
            style={{ left: sp.x - 20, top: sp.y - 20 }}
          >
            <div className="relative">
              <span className="text-xl">✨</span>
              <span className="absolute -top-3 -right-2 text-xs">🧡</span>
              <span className="absolute -bottom-2 -left-3 text-xs">☀️</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
