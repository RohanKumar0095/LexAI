import React from 'react';

export type BadgeVariant = 'saffron' | 'electric' | 'emerald' | 'crimson' | 'glass' | 'neutral' | 'primary';

export interface BadgeProps {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  icon,
  children,
  pulse = false,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    primary: 'bg-[#A855F7]/15 text-[#C084FC] border-[#A855F7]/30',
    saffron: 'bg-[#A855F7]/15 text-[#C084FC] border-[#A855F7]/30',
    electric: 'bg-[#7C3AED]/20 text-[#D8B4FE] border-[#C084FC]/30',
    emerald: 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30',
    crimson: 'bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30',
    glass: 'bg-[#15111F]/80 text-[#F8F7FC] border-[#30243F] backdrop-blur-md',
    neutral: 'bg-[#1C1728] text-[#AAA3BB] border-[#30243F]',
  };

  const pulseColors: Record<BadgeVariant, string> = {
    primary: 'bg-[#A855F7]',
    saffron: 'bg-[#A855F7]',
    electric: 'bg-[#C084FC]',
    emerald: 'bg-[#10B981]',
    crimson: 'bg-[#EF4444]',
    glass: 'bg-[#C084FC]',
    neutral: 'bg-[#AAA3BB]',
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
