import React from 'react';

/**
 * CelestialBackground - Space-inspired purple atmosphere inspired by
 * "Dark UI Login Concept by Monty Hayton"
 *
 * Features:
 * - Deep midnight-space base: #08070D
 * - Gigantic luminous purple celestial sphere on the right extending beyond viewport
 * - High-intensity illuminated crescent limb in vivid violet & magenta (#C084FC / #E879F9 / #A855F7)
 * - Deep dark purple planetary interior (#1A0F2E -> #0D0717)
 * - Soft atmospheric planetary bloom & outer corona
 * - Subtle ambient cosmic dust / distant pinprick stars
 * - Fully responsive and pointer-events-none so it never intercepts clicks
 */
export const CelestialBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0 bg-[#08070D]"
      aria-hidden="true"
    >
      {/* Deep cosmic radial gradient base */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 75% 45%, rgba(124, 34, 232, 0.18) 0%, rgba(30, 16, 56, 0.35) 45%, transparent 75%),
            radial-gradient(circle at 20% 80%, rgba(90, 20, 170, 0.08) 0%, transparent 60%),
            #08070D
          `
        }}
      />

      {/* Subtle Starfield / Cosmic Dust (ultra-lightweight CSS radial dots) */}
      <div 
        className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 15% 20%, #FAF8FF 100%, transparent),
            radial-gradient(1.5px 1.5px at 30% 70%, #E9D5FF 100%, transparent),
            radial-gradient(1px 1px at 45% 15%, #C084FC 100%, transparent),
            radial-gradient(1.5px 1.5px at 60% 85%, #FAF8FF 100%, transparent),
            radial-gradient(1px 1px at 80% 25%, #E9D5FF 100%, transparent),
            radial-gradient(1px 1px at 25% 40%, rgba(192, 132, 252, 0.8) 100%, transparent),
            radial-gradient(1.5px 1.5px at 70% 60%, rgba(247, 244, 252, 0.9) 100%, transparent),
            radial-gradient(1px 1px at 90% 75%, #C084FC 100%, transparent),
            radial-gradient(1px 1px at 10% 90%, #FAF8FF 100%, transparent)
          `,
          backgroundSize: '450px 450px'
        }}
      />

      {/* Atmospheric planetary outer glow / bloom */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          right: '-15vw',
          width: 'min(1100px, 95vw)',
          height: 'min(1100px, 95vw)',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(124, 34, 232, 0.15) 40%, rgba(232, 121, 249, 0.08) 60%, transparent 75%)',
          filter: 'blur(70px)',
          opacity: 0.9,
        }}
      />

      {/* Extra high-intensity magenta-violet rim corona behind the card */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          right: '5vw',
          width: 'min(750px, 75vw)',
          height: 'min(750px, 75vw)',
          background: 'radial-gradient(circle, rgba(232, 121, 249, 0.22) 0%, rgba(168, 85, 247, 0.20) 35%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />

      {/* GIGANTIC LUMINOUS PURPLE PLANETARY SPHERE (Monty Hayton Reference Signature) */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 rounded-full"
        style={{
          right: '-20vw',
          width: 'min(980px, 92vw)',
          height: 'min(980px, 92vw)',
          /* Spherical 3D lighting: illuminated bright magenta/violet rim on left/top-left fading into deep void on the right */
          background: `
            radial-gradient(circle at 18% 30%, 
              rgba(255, 230, 255, 0.95) 0%, 
              rgba(232, 121, 249, 0.85) 8%, 
              rgba(192, 132, 252, 0.70) 18%, 
              rgba(168, 85, 247, 0.45) 32%, 
              rgba(124, 34, 232, 0.25) 50%, 
              rgba(38, 16, 68, 0.90) 70%, 
              rgba(13, 7, 23, 0.98) 85%, 
              #08070D 100%
            )
          `,
          boxShadow: `
            inset 35px 20px 80px -10px rgba(255, 255, 255, 0.5),
            inset 70px 40px 140px 0px rgba(232, 121, 249, 0.45),
            inset -40px -40px 100px rgba(8, 7, 13, 0.95),
            -20px 0 80px rgba(192, 132, 252, 0.35),
            -40px -10px 140px rgba(124, 34, 232, 0.25)
          `,
          border: '1px solid rgba(232, 121, 249, 0.25)',
        }}
      >
        {/* Subtle planetary atmospheric layer / limb gradient */}
        <div 
          className="w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(circle at 25% 25%, transparent 60%, rgba(8, 7, 13, 0.6) 90%, #08070D 100%)',
          }}
        />
      </div>

      {/* Front Ambient Vignette to keep card reading effortless */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(8, 7, 13, 0.85) 0%, rgba(8, 7, 13, 0.45) 50%, rgba(8, 7, 13, 0.7) 100%)',
        }}
      />
    </div>
  );
};
export default CelestialBackground;