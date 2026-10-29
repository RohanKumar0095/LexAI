/**
 * LexAI Design Token Registry
 * Primary Source of Truth for Visual Foundation
 * Theme: Black with Luminous Purple Accents
 */

export const LEXAI_COLORS = {
  midnight: {
    base: '#08070D',
    surface: '#15111F',
    card: '#15111F',
    elevated: '#1C1728',
    border: '#30243F',
  },
  primary: {
    default: '#A855F7',
    bright: '#C084FC',
    deep: '#7C3AED',
    glow: 'rgba(168, 85, 247, 0.25)',
    subtle: 'rgba(168, 85, 247, 0.10)',
  },
  // Legacy aliases mapped to luminous purple for backward compatibility
  saffron: {
    default: '#A855F7',
    hover: '#C084FC',
    active: '#7C3AED',
    glow: 'rgba(168, 85, 247, 0.25)',
    subtle: 'rgba(168, 85, 247, 0.10)',
  },
  electricIndigo: {
    default: '#C084FC',
    hover: '#D8B4FE',
    active: '#A855F7',
    glow: 'rgba(192, 132, 252, 0.25)',
    subtle: 'rgba(192, 132, 252, 0.10)',
  },
  emerald: {
    default: '#10B981',
    hover: '#34D399',
    active: '#059669',
    glow: 'rgba(16, 185, 129, 0.25)',
    subtle: 'rgba(16, 185, 129, 0.10)',
  },
  crimson: {
    default: '#EF4444',
    hover: '#F87171',
    active: '#DC2626',
    glow: 'rgba(239, 68, 68, 0.25)',
    subtle: 'rgba(239, 68, 68, 0.10)',
  },
  text: {
    primary: '#F8F7FC',
    secondary: '#D4CFE2',
    muted: '#AAA3BB',
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
  signature: 'linear-gradient(135deg, #F8F7FC 0%, #C084FC 50%, #A855F7 100%)',
  accentText: 'linear-gradient(135deg, #C084FC 0%, #A855F7 100%)',
  saffron: 'linear-gradient(135deg, #C084FC 0%, #A855F7 100%)',
  electric: 'linear-gradient(135deg, #E9D5FF 0%, #C084FC 100%)',
  surfaceGlass: 'rgba(21, 17, 31, 0.85)',
} as const;

export const LEXAI_MOTION = {
  transitionFast: { duration: 0.15, ease: 'easeOut' },
  transitionStandard: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  transitionSmooth: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  hoverScale: { scale: 1.02, transition: { duration: 0.2 } },
  tapScale: { scale: 0.98 },
} as const;
