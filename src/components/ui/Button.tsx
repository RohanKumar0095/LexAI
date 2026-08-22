import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'ai';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {

  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-midnight-base disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-sm gap-1.5 font-medium",
    md: "px-5 py-2.5 text-sm rounded-md gap-2 font-medium",
    lg: "px-7 py-3.5 text-base rounded-lg gap-2.5 font-semibold",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-saffron hover:bg-saffron-600 active:bg-saffron/80 text-midnight-base font-semibold shadow-md shadow-saffron-glow hover:shadow-saffron-glow/80 focus-visible:ring-saffron",
    secondary: "bg-midnight-card hover:bg-midnight-elevated active:bg-midnight-base text-text-primary border border-midnight-border hover:border-text-muted focus-visible:ring-slate-400",
    ghost: "bg-transparent hover:bg-white/5 active:bg-white/10 text-text-secondary hover:text-text-primary focus-visible:ring-saffron",
    danger: "bg-crimson hover:bg-crimson-600 active:bg-crimson/80 text-white shadow-md shadow-crimson-glow focus-visible:ring-crimson",
    success: "bg-emerald hover:bg-emerald-600 active:bg-emerald/80 text-midnight-base font-semibold shadow-md shadow-emerald-glow focus-visible:ring-emerald",
    ai: "relative bg-electric hover:bg-electric-600 active:bg-electric/80 text-white shadow-lg shadow-electric-glow focus-visible:ring-electric border border-electric/30 group overflow-hidden",
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {variant === 'ai' && (
        <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
      
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}

      <span className="relative z-10">{children}</span>

      {!isLoading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
