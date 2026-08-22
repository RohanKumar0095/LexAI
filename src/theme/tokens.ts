/**
 * LexAI Design Token Registry
 * Primary Source of Truth for Visual Foundation
 */

export const LEXAI_COLORS = {
  midnight: {
    base: '#0D0F13',
    surface: '#15171C',
    card: '#15171C',
    elevated: '#1A1D23',
    border: '#2A2D34',
  },
  saffron: {
    default: '#0284c7', // Sky Blue Primary Accent
    hover: '#38bdf8',
    active: '#0369a1',
    glow: 'rgba(2, 132, 199, 0.25)',
    subtle: 'rgba(2, 132, 199, 0.10)',
  },
  electricIndigo: {
    default: '#a855f7', // Purple Secondary Accent
    hover: '#c084fc',
    active: '#9333ea',
    glow: 'rgba(168, 85, 247, 0.25)',
    subtle: 'rgba(168, 85, 247, 0.10)',
  },
  emerald: {
    default: '#10B981',
    hover: '#34D399',
    active: '#059669',
    glow: 'rgba(16, 185, 129, 0.25)',
    subtle: 'rgba(16, 185, 129, 0.10)',
  },
  crimson: {
    default: '#ef4444',
    hover: '#f87171',
    active: '#dc2626',
    glow: 'rgba(239, 68, 68, 0.25)',
    subtle: 'rgba(239, 68, 68, 0.10)',
  },
  text: {
    primary: '#F7F8FA',
    secondary: '#98A2B3',
    muted: '#667085',
  }
} as const;

export const LEXAI_RADII = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  hero: '30px',
} as const;

export const LEXAI_GRADIENTS = {
  signature: 'none',
  accentText: 'none',
  saffron: 'none',
  electric: 'none',
  surfaceGlass: 'rgba(21, 23, 28, 0.85)',
} as const;

export const LEXAI_MOTION = {
  transitionFast: { duration: 0.15, ease: 'easeOut' },
  transitionStandard: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  transitionSmooth: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  hoverScale: { scale: 1.02, transition: { duration: 0.2 } },
  tapScale: { scale: 0.98 },
} as const;
