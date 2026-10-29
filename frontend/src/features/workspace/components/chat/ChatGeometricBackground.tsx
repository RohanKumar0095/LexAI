import React from 'react';

/**
 * ChatGeometricBackground
 * Sophisticated dark atmospheric background with restrained purple geometric patterns,
 * grids, polygons, arcs, and constellation nodes.
 * Designed to sit strictly behind interactive chat content (pointer-events: none).
 */
export const ChatGeometricBackground: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" 
      aria-hidden="true"
    >
      {/* 1. Subtle Radial Violet Lighting */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[420px] rounded-full blur-[140px] opacity-70 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(168, 85, 247, 0.09) 0%, rgba(124, 58, 237, 0.04) 50%, transparent 80%)'
        }}
      />
      
      <div 
        className="absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full blur-[120px] opacity-50 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, transparent 70%)'
        }}
      />

      <div 
        className="absolute top-1/2 left-4 w-[280px] h-[280px] rounded-full blur-[100px] opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(192, 132, 252, 0.04) 0%, transparent 70%)'
        }}
      />

      {/* 2. Scalable Geometric SVG Layer */}
      <svg
        className="w-full h-full absolute inset-0"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Low-Opacity Violet Grid Lines */}
          <pattern
            id="chat-grid-lines"
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 44 0 L 0 0 0 44"
              fill="none"
              stroke="#A855F7"
              strokeWidth="0.6"
              strokeOpacity="0.045"
            />
          </pattern>

          {/* Hexagon Subpattern */}
          <pattern
            id="hex-accent-pattern"
            width="120"
            height="104"
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points="60,4 116,30 116,84 60,110 4,84 4,30"
              fill="none"
              stroke="#C084FC"
              strokeWidth="0.5"
              strokeOpacity="0.04"
            />
          </pattern>
        </defs>

        {/* Base Grid Pattern */}
        <rect width="100%" height="100%" fill="url(#chat-grid-lines)" />

        {/* Masked Hexagon Grid Overlay on Upper Half */}
        <rect width="100%" height="60%" fill="url(#hex-accent-pattern)" opacity="0.6" />

        {/* 3. Large Geometric Arcs (Subtle orbital & legal compass geometry) */}
        <g stroke="#C084FC" fill="none" opacity="0.10">
          {/* Primary Celestial Arc - Top Right */}
          <circle cx="85%" cy="12%" r="280" strokeWidth="0.75" strokeDasharray="3 9" />
          <circle cx="85%" cy="12%" r="380" strokeWidth="0.5" strokeOpacity="0.6" />
          <circle cx="85%" cy="12%" r="480" strokeWidth="0.5" strokeDasharray="1 12" />

          {/* Secondary Counter Arc - Bottom Left */}
          <circle cx="10%" cy="88%" r="220" strokeWidth="0.75" strokeDasharray="2 8" />
          <circle cx="10%" cy="88%" r="320" strokeWidth="0.5" strokeOpacity="0.5" />
        </g>

        {/* 4. Abstract Polygons & Hexagonal Outlines */}
        <g stroke="#A855F7" fill="none" opacity="0.12">
          {/* Hexagon 1: Top Right */}
          <polygon
            points="780,90 820,115 820,165 780,190 740,165 740,115"
            strokeWidth="0.8"
            className="hidden sm:inline"
          />
          <polygon
            points="780,105 808,122 808,158 780,175 752,158 752,122"
            strokeWidth="0.5"
            strokeDasharray="2 4"
            className="hidden sm:inline"
          />

          {/* Hexagon 2: Bottom Center/Right */}
          <polygon
            points="620,680 655,700 655,740 620,760 585,740 585,700"
            strokeWidth="0.7"
            className="hidden md:inline"
          />

          {/* Abstract Polygon (Quadrant Wedge): Top Left */}
          <polygon
            points="60,60 140,80 180,160 110,190 40,140"
            strokeWidth="0.6"
            strokeDasharray="4 6"
            strokeOpacity="0.7"
          />
        </g>

        {/* 5. Sparse Connected Constellation Nodes */}
        <g stroke="#C084FC" fill="#C084FC" opacity="0.15">
          {/* Constellation Cluster Top Left */}
          <line x1="80" y1="180" x2="160" y2="240" strokeWidth="0.6" />
          <line x1="160" y1="240" x2="220" y2="200" strokeWidth="0.6" />
          <line x1="220" y1="200" x2="270" y2="270" strokeWidth="0.6" strokeDasharray="2 4" />
          
          <circle cx="80" cy="180" r="2" />
          <circle cx="160" cy="240" r="2.5" />
          <circle cx="220" cy="200" r="1.8" />
          <circle cx="270" cy="270" r="2" />

          {/* Constellation Cluster Mid Right */}
          <line x1="840" y1="360" x2="900" y2="420" strokeWidth="0.6" />
          <line x1="900" y1="420" x2="870" y2="490" strokeWidth="0.6" />
          
          <circle cx="840" cy="360" r="2" />
          <circle cx="900" cy="420" r="2.5" />
          <circle cx="870" cy="490" r="1.8" />
        </g>
      </svg>
    </div>
  );
};
export default ChatGeometricBackground;
