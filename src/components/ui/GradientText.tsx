import React from 'react';

export type GradientVariant = 'signature' | 'saffron' | 'electric' | 'emerald' | 'crimson';

export interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: GradientVariant;
  children: React.ReactNode;
  as?: React.ElementType;
}

export const GradientText: React.FC<GradientTextProps> = ({
  variant = 'signature',
  children,
  as: Component = 'span',
  className = '',
  ...props
}) => {
  const gradientStyles: Record<GradientVariant, string> = {
    signature: 'text-white font-bold',
    saffron: 'text-saffron font-bold',
    electric: 'text-electric font-bold',
    emerald: 'text-emerald font-bold',
    crimson: 'text-crimson font-bold',
  };

  return (
    <Component className={`${gradientStyles[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
};
