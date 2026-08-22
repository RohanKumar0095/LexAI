import React from 'react';

export type BadgeVariant = 'saffron' | 'electric' | 'emerald' | 'crimson' | 'glass' | 'neutral';

export interface BadgeProps {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'saffron',
  icon,
  children,
  pulse = false,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    saffron: 'bg-saffron/10 text-saffron border-saffron/30',
    electric: 'bg-electric/10 text-electric border-electric/30',
    emerald: 'bg-emerald/10 text-emerald border-emerald/30',
    crimson: 'bg-crimson/10 text-crimson border-crimson/30',
    glass: 'bg-white/5 text-text-primary border-white/10 backdrop-blur-md',
    neutral: 'bg-slate-800/80 text-slate-300 border-slate-700',
  };

  const pulseColors: Record<BadgeVariant, string> = {
    saffron: 'bg-saffron',
    electric: 'bg-electric',
    emerald: 'bg-emerald',
    crimson: 'bg-crimson',
    glass: 'bg-white',
    neutral: 'bg-slate-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${variantStyles[variant]} ${className}`}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColors[variant]}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${pulseColors[variant]}`}></span>
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
