import React from 'react';

export type GradientVariant = 'signature' | 'saffron' | 'electric' | 'emerald' | 'crimson' | 'primary';

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
    signature: 'bg-gradient-to-r from-white via-[#C084FC] to-[#A855F7] bg-clip-text text-transparent font-bold',
    primary: 'bg-gradient-to-r from-[#C084FC] to-[#A855F7] bg-clip-text text-transparent font-bold',
    saffron: 'bg-gradient-to-r from-[#C084FC] to-[#A855F7] bg-clip-text text-transparent font-bold',
    electric: 'bg-gradient-to-r from-white to-[#C084FC] bg-clip-text text-transparent font-bold',
    emerald: 'bg-gradient-to-r from-[#6EE7B7] to-[#10B981] bg-clip-text text-transparent font-bold',
    crimson: 'bg-gradient-to-r from-[#FCA5A5] to-[#EF4444] bg-clip-text text-transparent font-bold',
  };

  return (
    <Component className={`${gradientStyles[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
};
