import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from '../ui/Input';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorText?: string;
  helperText?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({
  label = "Password",
  errorText,
  helperText,
  className = "",
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Input
      ref={ref}
      label={label}
      type={showPassword ? "text" : "password"}
      errorText={errorText}
      helperText={helperText}
      leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
      rightIcon={
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      }
      className={className}
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';
