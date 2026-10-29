import React from 'react';

export type CardVariant = 'glass' | 'elevated' | 'card' | 'modal';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'card',
  hoverable = false,
  children,
  className = '',
  ...props
}) => {
  const variantStyles: Record<CardVariant, string> = {
    glass: 'lexai-surface-glass rounded-2xl p-6 border border-[#30243F]',
    elevated: 'lexai-surface-elevated rounded-2xl p-6 border border-[#30243F]',
    card: 'lexai-surface-card rounded-xl p-5 border border-[#30243F]',
    modal: 'lexai-surface-modal rounded-3xl p-8 border border-[#30243F]',
  };

  const hoverEffect = hoverable ? 'cursor-pointer hover:border-[#A855F7]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/20 transition-all duration-300' : '';

  return (
    <div
      className={`${variantStyles[variant]} ${hoverEffect} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
