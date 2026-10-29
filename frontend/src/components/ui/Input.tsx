import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  errorText,
  successText,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  id,
  ...props
}, ref) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  const isError = Boolean(errorText);
  const isSuccess = Boolean(successText);

  let borderStateStyles = "border-[#30243F] focus-within:border-[#A855F7] focus-within:ring-2 focus-within:ring-[#A855F7]/25";
  if (isError) {
    borderStateStyles = "border-rose-500/80 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20";
  } else if (isSuccess) {
    borderStateStyles = "border-emerald-500/80 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20";
  }

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium uppercase tracking-wider text-[#D4CFE2]">
          {label}
        </label>
      )}

      <div className={`relative flex items-center bg-[#100D18] rounded-xl border ${borderStateStyles} transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed bg-[#15111F]' : 'hover:border-[#30243F]/80'} ${className}`}>
        {leftIcon && (
          <div className="pl-3.5 text-[#AAA3BB] shrink-0 select-none">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          style={{ colorScheme: 'dark' }}
          className="w-full bg-transparent px-3.5 py-2.5 text-sm text-[#F8F7FC] placeholder-[#AAA3BB]/60 focus:outline-none focus:bg-transparent active:bg-transparent disabled:cursor-not-allowed"
          {...props}
        />

        {rightIcon && (
          <div className="pr-3 text-[#AAA3BB] shrink-0 select-none">
            {rightIcon}
          </div>
        )}
      </div>

      {isError && (
        <p className="text-xs text-rose-400 font-medium mt-0.5 animate-in fade-in duration-200">
          {errorText}
        </p>
      )}

      {isSuccess && (
        <p className="text-xs text-emerald-400 font-medium mt-0.5 animate-in fade-in duration-200">
          {successText}
        </p>
      )}

      {helperText && !isError && !isSuccess && (
        <p className="text-xs text-[#AAA3BB] mt-0.5">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
