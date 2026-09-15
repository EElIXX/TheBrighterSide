import React from 'react';

interface MonarchButterflyProps {
  size?: number;
  className?: string;
  flutterSpeed?: number; // duration in seconds
  isResting?: boolean;
  angle?: number;
  glow?: boolean;
  onClick?: () => void;
}

export const MonarchButterfly: React.FC<MonarchButterflyProps> = ({
  size = 48,
  className = '',
  flutterSpeed = 0.35,
  isResting = false,
  angle = 0,
  glow = true,
  onClick,
}) => {
  // Unique gradient and clip IDs to avoid collision if multiple butterflies render
  const id = React.useId().replace(/:/g, '');

  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size * 0.8,
        transform: `rotate(${angle}deg)`,
      }}
      className={`relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
    >
      {/* Optional warm golden aura glow */}
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-40 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(251,146,60,0.8) 0%, rgba(245,158,11,0.4) 60%, transparent 80%)',
          }}
        />
      )}

      {/* 3D Flutter Container */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ perspective: 600, transformStyle: 'preserve-3d' }}
      >
        {/* LEFT WING */}
        <div
          className="absolute right-1/2 top-0 bottom-0 w-[48%] h-full origin-right"
          style={{
            animation: isResting
              ? `monarchRest 3.5s ease-in-out infinite alternate`
              : `monarchFlutterLeft ${flutterSpeed}s ease-in-out infinite alternate`,
            transformStyle: 'preserve-3d',
          }}
        >
          <svg
            viewBox="0 0 100 80"
            className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`wingGradLeft-${id}`} x1="100%" y1="50%" x2="0%" y2="20%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="25%" stopColor="#fb923c" />
                <stop offset="70%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
            </defs>

            {/* Forewing & Hindwing Base Fill */}
            <path
              d="M96 44 C88 28 65 6 36 2 C18 0 4 10 2 24 C0 35 12 48 30 52 C22 58 14 68 22 75 C30 82 52 80 72 68 C86 60 94 50 96 44 Z"
              fill={`url(#wingGradLeft-${id})`}
            />

            {/* Bold Black Monarch Wing Borders & Tips */}
            <path
              d="M96 44 C88 28 65 6 36 2 C28 1 18 4 10 11 C18 16 32 16 48 22 C34 24 16 28 4 33 C6 41 15 48 30 52 C24 57 18 64 22 75 C25 78 33 80 44 79 C42 72 42 66 48 62 C38 66 28 72 32 75 C28 73 26 69 30 65 C40 68 58 66 72 68 C86 60 94 50 96 44 Z"
              fill="#0f172a"
              opacity="0.95"
            />
            {/* Outer margin dark band */}
            <path
              d="M36 2 C18 0 4 10 2 24 C0 35 12 48 30 52 C22 58 14 68 22 75 C12 68 1 54 2 34 C3 18 16 3 36 2 Z"
              fill="#090d16"
            />

            {/* Intricate Monarch Veins */}
            <path
              d="M95 44 C75 36 50 26 28 16 M95 44 C70 42 42 38 16 34 M95 44 C78 50 50 56 32 64 M72 40 C56 30 38 24 20 22 M78 48 C62 58 46 66 32 72"
              stroke="#0f172a"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* Signature Crisp White Margin Dots */}
            <circle cx="8" cy="18" r="1.6" fill="#ffffff" />
            <circle cx="5" cy="26" r="1.5" fill="#ffffff" />
            <circle cx="6" cy="34" r="1.5" fill="#ffffff" />
            <circle cx="11" cy="42" r="1.6" fill="#ffffff" />
            <circle cx="18" cy="50" r="1.7" fill="#ffffff" />
            <circle cx="18" cy="62" r="1.5" fill="#ffffff" />
            <circle cx="24" cy="71" r="1.6" fill="#ffffff" />
            <circle cx="34" cy="76" r="1.6" fill="#ffffff" />
            <circle cx="48" cy="74" r="1.5" fill="#ffffff" />
            <circle cx="62" cy="67" r="1.5" fill="#ffffff" />
            {/* Inner tiny white accent specks */}
            <circle cx="12" cy="14" r="1.1" fill="#ffffff" opacity="0.9" />
            <circle cx="9" cy="22" r="1.1" fill="#ffffff" opacity="0.9" />
            <circle cx="16" cy="46" r="1.2" fill="#ffffff" opacity="0.9" />
          </svg>
        </div>

        {/* RIGHT WING */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-[48%] h-full origin-left"
          style={{
            animation: isResting
              ? `monarchRest 3.5s ease-in-out infinite alternate`
              : `monarchFlutterRight ${flutterSpeed}s ease-in-out infinite alternate`,
            transformStyle: 'preserve-3d',
          }}
        >
          <svg
            viewBox="0 0 100 80"
            className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`wingGradRight-${id}`} x1="0%" y1="50%" x2="100%" y2="20%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="25%" stopColor="#fb923c" />
                <stop offset="70%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
            </defs>

            {/* Forewing & Hindwing Base Fill */}
            <path
              d="M4 44 C12 28 35 6 64 2 C82 0 96 10 98 24 C100 35 88 48 70 52 C78 58 86 68 78 75 C70 82 48 80 28 68 C14 60 6 50 4 44 Z"
              fill={`url(#wingGradRight-${id})`}
            />

            {/* Bold Black Monarch Wing Borders & Tips */}
            <path
              d="M4 44 C12 28 35 6 64 2 C72 1 82 4 90 11 C82 16 68 16 52 22 C66 24 84 28 96 33 C94 41 85 48 70 52 C76 57 82 64 78 75 C75 78 67 80 56 79 C58 72 58 66 52 62 C62 66 72 72 68 75 C72 73 74 69 70 65 C60 68 42 66 28 68 C14 60 6 50 4 44 Z"
              fill="#0f172a"
              opacity="0.95"
            />
            {/* Outer margin dark band */}
            <path
              d="M64 2 C82 0 96 10 98 24 C100 35 88 48 70 52 C78 58 86 68 78 75 C88 68 99 54 98 34 C97 18 84 3 64 2 Z"
              fill="#090d16"
            />

            {/* Intricate Monarch Veins */}
            <path
              d="M5 44 C25 36 50 26 72 16 M5 44 C30 42 58 38 84 34 M5 44 C22 50 50 56 68 64 M28 40 C44 30 62 24 80 22 M22 48 C38 58 54 66 68 72"
              stroke="#0f172a"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* Signature Crisp White Margin Dots */}
            <circle cx="92" cy="18" r="1.6" fill="#ffffff" />
            <circle cx="95" cy="26" r="1.5" fill="#ffffff" />
            <circle cx="94" cy="34" r="1.5" fill="#ffffff" />
            <circle cx="89" cy="42" r="1.6" fill="#ffffff" />
            <circle cx="82" cy="50" r="1.7" fill="#ffffff" />
            <circle cx="82" cy="62" r="1.5" fill="#ffffff" />
            <circle cx="76" cy="71" r="1.6" fill="#ffffff" />
            <circle cx="66" cy="76" r="1.6" fill="#ffffff" />
            <circle cx="52" cy="74" r="1.5" fill="#ffffff" />
            <circle cx="38" cy="67" r="1.5" fill="#ffffff" />
            {/* Inner tiny white accent specks */}
            <circle cx="88" cy="14" r="1.1" fill="#ffffff" opacity="0.9" />
            <circle cx="91" cy="22" r="1.1" fill="#ffffff" opacity="0.9" />
            <circle cx="84" cy="46" r="1.2" fill="#ffffff" opacity="0.9" />
          </svg>
        </div>

        {/* BUTTERFLY CENTRAL BODY & CURVED ANTENNAE */}
        <div
          className="absolute z-10 w-[8%] h-[75%] flex flex-col items-center justify-center pointer-events-none"
          style={{ transform: 'translateZ(2px)' }}
        >
          <svg viewBox="0 0 16 60" className="w-full h-full" fill="none">
            {/* Antennae */}
            <path
              d="M7 16 C5 10 1 6 0 3 M9 16 C11 10 15 6 16 3"
              stroke="#090d16"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="0" cy="3" r="1.2" fill="#ea580c" />
            <circle cx="16" cy="3" r="1.2" fill="#ea580c" />
            {/* Head */}
            <ellipse cx="8" cy="18" rx="2.4" ry="2.2" fill="#090d16" />
            {/* Thorax */}
            <ellipse cx="8" cy="26" rx="3.2" ry="5.5" fill="#1e293b" />
            {/* White thorax specks */}
            <circle cx="8" cy="24" r="0.7" fill="#ffffff" />
            <circle cx="8" cy="28" r="0.7" fill="#ffffff" />
            {/* Abdomen with segments */}
            <ellipse cx="8" cy="42" rx="2.5" ry="11" fill="#090d16" />
            <path
              d="M6 36 H10 M6 40 H10 M6 44 H10 M6 48 H10"
              stroke="#fb923c"
              strokeWidth="0.8"
              opacity="0.8"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
