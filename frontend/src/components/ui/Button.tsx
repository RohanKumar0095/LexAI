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

  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08070D] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none cursor-pointer";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-lg gap-1.5 font-medium",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2 font-medium",
    lg: "px-7 py-3.5 text-base rounded-xl gap-2.5 font-semibold",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-[#A855F7] hover:bg-[#9333EA] active:bg-[#7C3AED] text-white font-semibold shadow-md shadow-purple-500/30 hover:shadow-purple-500/50 focus-visible:ring-[#A855F7]",
    secondary: "bg-[#15111F] hover:bg-[#1C1728] active:bg-[#100D18] text-[#F8F7FC] border border-[#30243F] hover:border-[#A855F7]/50 focus-visible:ring-[#A855F7]",
    ghost: "bg-transparent hover:bg-white/5 active:bg-white/10 text-[#AAA3BB] hover:text-[#F8F7FC] focus-visible:ring-[#A855F7]",
    danger: "bg-[#EF4444] hover:bg-[#DC2626] active:bg-[#B91C1C] text-white shadow-md shadow-red-500/20 focus-visible:ring-[#EF4444]",
    success: "bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-[#08070D] font-semibold shadow-md shadow-emerald-500/20 focus-visible:ring-[#10B981]",
    ai: "relative bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#6B21A8] hover:to-[#9333EA] text-white shadow-lg shadow-purple-500/30 focus-visible:ring-[#A855F7] border border-[#C084FC]/30 group overflow-hidden",
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
