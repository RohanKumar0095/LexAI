import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Mail, ArrowLeft, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const validate = () => {
    setEmailError('');
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your registered email address to receive password recovery instructions."
      cardWidth="max-w-[420px]"
    >
      {isSent ? (
        <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-[#A855F7]/15 border border-[#A855F7]/30 flex items-center justify-center text-[#C084FC] mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">Instructions Dispatched</h3>
            <p className="text-xs text-[#B8AEC9] max-w-sm mx-auto leading-relaxed">
              We've simulated sending password reset instructions to: <br />
              <strong className="text-[#F7F4FC]">{email}</strong>
            </p>
          </div>
          
          <div 
            className="p-3.5 border rounded-xl text-[11px] text-[#B8AEC9]"
            style={{
              backgroundColor: 'rgba(10, 8, 16, 0.92)',
              borderColor: 'rgba(192, 132, 252, 0.18)'
            }}
          >
            <span className="text-[#C084FC] font-semibold block mb-0.5">Demo Simulation Info:</span>
            In a live system, this sends a secure cryptographic reset link. For this demo, you can directly access the reset screen below.
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link to="/reset-password">
              <button 
                type="button"
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#7C22E8',
                  boxShadow: '0 8px 24px -4px rgba(124, 34, 232, 0.45)',
                }}
              >
                <span>Proceed to Reset Form</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </Link>
            <Link to="/login">
              <button 
                type="button"
                className="w-full py-2 px-4 rounded-xl text-xs font-medium text-[#B8AEC9] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:bg-white/5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in text-left">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#B8AEC9]">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#B8AEC9]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs text-[#F7F4FC] placeholder-[#B8AEC9]/50 transition-all outline-none focus:ring-1 focus:ring-[#A855F7] ${
                  emailError ? 'border-red-500' : 'border'
                }`}
                style={{
                  backgroundColor: 'rgba(10, 8, 16, 0.92)',
                  borderColor: emailError ? '#EF4444' : 'rgba(192, 132, 252, 0.22)',
                }}
                required
              />
            </div>
            {emailError && <p className="text-[11px] text-red-400 mt-1">{emailError}</p>}
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
                <span>Send Reset Link</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </>
            )}
          </button>

          <div className="text-center pt-2 text-xs text-[#B8AEC9]">
            Remember your credentials?{' '}
            <Link to="/login" className="text-[#C084FC] hover:text-[#D8B4FE] font-medium transition-colors">
              Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
export default ForgotPasswordPage;