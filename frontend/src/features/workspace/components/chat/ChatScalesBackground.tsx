import React from 'react';

/**
 * ChatScalesBackground
 * Feature B: A large, elegant scales-of-justice symbol positioned in the chat background.
 * The symbol glows softly in white & violet, repeating a smooth, calming breathing pulse.
 * Layered strictly behind messages, input composer, and buttons (pointer-events: none).
 */
export const ChatScalesBackground: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Centered Glowing Scales of Justice Container with slow breathing pulse */}
      <div className="scales-glowing-pulse flex items-center justify-center p-4">
        <svg 
          className="w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] max-w-[85vw] max-h-[85vh] transition-all"
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Soft luminous radial gradient for central pillar & pans */}
            <radialGradient id="scales-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#E9D5FF" stopOpacity="0.75" />
              <stop offset="75%" stopColor="#C084FC" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.1" />
            </radialGradient>

            {/* Linear gradient for beams and cords */}
            <linearGradient id="scales-beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C084FC" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0.5" />
            </linearGradient>

            {/* Violet Outer Aura Filter */}
            <filter id="scales-aura-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Central Scales Group with Aura Filter */}
          <g filter="url(#scales-aura-glow)" strokeLinecap="round" strokeLinejoin="round">
            
            {/* Top Finial / Spire Tip */}
            <circle cx="100" cy="24" r="3.5" fill="url(#scales-core-glow)" />
            <path d="M 100 27.5 L 100 38" stroke="#FFFFFF" strokeWidth="2.2" />

            {/* Center Pivot Point & Ring */}
            <circle cx="100" cy="42" r="5" stroke="url(#scales-beam-grad)" strokeWidth="2" fill="#15111F" />
            <circle cx="100" cy="42" r="2" fill="#FFFFFF" />

            {/* Horizontal Balance Beam with elegant taper */}
            <path 
              d="M 38 42 Q 100 37 162 42" 
              stroke="url(#scales-beam-grad)" 
              strokeWidth="2.8" 
              fill="none" 
            />

            {/* Left Balance Beam Pivot & Hooks */}
            <circle cx="38" cy="42" r="2.8" fill="#FFFFFF" />
            {/* Right Balance Beam Pivot & Hooks */}
            <circle cx="162" cy="42" r="2.8" fill="#FFFFFF" />

            {/* Central Vertical Pillar with fluted base */}
            <line x1="100" y1="47" x2="100" y2="152" stroke="#FFFFFF" strokeWidth="3" strokeOpacity="0.9" />
            <line x1="97" y1="58" x2="97" y2="148" stroke="#C084FC" strokeWidth="0.8" strokeOpacity="0.6" />
            <line x1="103" y1="58" x2="103" y2="148" stroke="#C084FC" strokeWidth="0.8" strokeOpacity="0.6" />

            {/* Central Decorative Column Nodes */}
            <circle cx="100" cy="85" r="3.5" fill="#C084FC" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="100" cy="120" r="3.5" fill="#C084FC" stroke="#FFFFFF" strokeWidth="1" />

            {/* Plinth / Tiered Base of Justice */}
            <path d="M 86 152 L 114 152" stroke="#FFFFFF" strokeWidth="3.5" />
            <path d="M 76 160 L 124 160" stroke="url(#scales-beam-grad)" strokeWidth="4" />
            <path d="M 66 168 L 134 168" stroke="#C084FC" strokeWidth="3.5" strokeOpacity="0.8" />

            {/* --- LEFT SCALE PAN ASSEMBLY --- */}
            {/* Suspension Cords */}
            <line x1="38" y1="44" x2="18" y2="92" stroke="#E9D5FF" strokeWidth="1.2" strokeOpacity="0.75" />
            <line x1="38" y1="44" x2="38" y2="92" stroke="#E9D5FF" strokeWidth="1.2" strokeOpacity="0.85" />
            <line x1="38" y1="44" x2="58" y2="92" stroke="#E9D5FF" strokeWidth="1.2" strokeOpacity="0.75" />

            {/* Left Weighing Pan (Arc Bowl) */}
            <path 
              d="M 14 92 C 14 116 62 116 62 92 Z" 
              stroke="#FFFFFF" 
              strokeWidth="2.2" 
              fill="url(#scales-core-glow)" 
              fillOpacity="0.2" 
            />
            {/* Rim of left bowl */}
            <line x1="14" y1="92" x2="62" y2="92" stroke="#FFFFFF" strokeWidth="2.2" />

            {/* --- RIGHT SCALE PAN ASSEMBLY --- */}
            {/* Suspension Cords */}
            <line x1="162" y1="44" x2="142" y2="92" stroke="#E9D5FF" strokeWidth="1.2" strokeOpacity="0.75" />
            <line x1="162" y1="44" x2="162" y2="92" stroke="#E9D5FF" strokeWidth="1.2" strokeOpacity="0.85" />
            <line x1="162" y1="44" x2="182" y2="92" stroke="#E9D5FF" strokeWidth="1.2" strokeOpacity="0.75" />

            {/* Right Weighing Pan (Arc Bowl) */}
            <path 
              d="M 138 92 C 138 116 186 116 186 92 Z" 
              stroke="#FFFFFF" 
              strokeWidth="2.2" 
              fill="url(#scales-core-glow)" 
              fillOpacity="0.2" 
            />
            {/* Rim of right bowl */}
            <line x1="138" y1="92" x2="186" y2="92" stroke="#FFFFFF" strokeWidth="2.2" />

          </g>
        </svg>
      </div>
    </div>
  );
};
export default ChatScalesBackground;