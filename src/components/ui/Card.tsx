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
    glass: 'lexai-surface-glass rounded-xl p-6',
    elevated: 'lexai-surface-elevated rounded-xl p-6',
    card: 'lexai-surface-card rounded-lg p-5',
    modal: 'lexai-surface-modal rounded-hero p-8',
  };

  const hoverEffect = hoverable ? 'cursor-pointer hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300' : '';

  return (
    <div
      className={`${variantStyles[variant]} ${hoverEffect} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
