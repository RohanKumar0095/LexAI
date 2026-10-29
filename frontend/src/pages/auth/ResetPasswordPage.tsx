import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    let isValid = true;
    setPasswordError('');
    setConfirmError('');

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError('Must contain lowercase, uppercase and a number');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmError('Please confirm your new password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Establish a new, strong password for your LexAI account."
      cardWidth="max-w-[420px]"
    >
      {isSuccess ? (
        <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-[#A855F7]/15 border border-[#A855F7]/30 flex items-center justify-center text-[#C084FC] mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">Password Updated</h3>
            <p className="text-xs text-[#B8AEC9] max-w-xs mx-auto leading-relaxed">
              Your credentials have been successfully reset. You can now use your new password to sign in.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-3 px-5 rounded-xl font-semibold text-xs tracking-wide text-white transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#7C22E8',
                boxShadow: '0 8px 24px -4px rgba(124, 34, 232, 0.45)',
              }}
            >
              <span>Sign In with New Password</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in text-left">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#B8AEC9]">
              New Password
            </label>
            <PasswordInput
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              errorText={passwordError}
              helperText="Min 8 characters, uppercase, lowercase & number"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#B8AEC9]">
              Confirm New Password
            </label>
            <PasswordInput
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmError) setConfirmError('');
              }}
              errorText={confirmError}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-5 rounded-xl font-semibold text-xs tracking-wide text-white transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#7C22E8',
              boxShadow: '0 8px 24px -4px rgba(124, 34, 232, 0.45)',
            }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </>
            )}
          </button>

          <div className="text-center pt-2 text-xs text-[#B8AEC9]">
            <Link to="/login" className="text-[#C084FC] hover:text-[#D8B4FE] font-medium transition-colors">
              Return to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
export default ResetPasswordPage;