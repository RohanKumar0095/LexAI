import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, AuthApiError } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { Mail, ArrowRight, ShieldCheck, Briefcase, User, Compass, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, continueAsGuest, isAuthenticated } = useAuth();

  const [persona, setPersona] = useState<'citizen' | 'lawyer'>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (persona === 'lawyer') return; // Disallow lawyer submissions
    
    if (!validate()) return;

    setIsLoading(true);
    setEmailError('');
    setPasswordError('');

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/app');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      if (err instanceof AuthApiError) {
        setEmailError(err.message);
      } else if (err instanceof Error) {
        setEmailError(err.message);
      } else {
        setEmailError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    continueAsGuest();
    navigate('/app');
  };

  return (
    <AuthLayout
      title={persona === 'citizen' ? "Sign In" : "Advocate Portal"}
      subtitle={
        persona === 'citizen'
          ? "Enter your credentials to access your LexAI account."
          : "Secure access point for bar-verified advocates and legal representatives."
      }
      cardWidth="max-w-[420px]"
    >
      {/* Persona Selector Tabs — Compact Dark Pill */}
      <div 
        className="grid grid-cols-2 gap-1.5 p-1 rounded-xl border mb-6"
        style={{
          backgroundColor: 'rgba(10, 8, 16, 0.92)',
          borderColor: 'rgba(192, 132, 252, 0.16)'
        }}
      >
        <button
          type="button"
          onClick={() => setPersona('citizen')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            persona === 'citizen'
              ? 'bg-[#7C22E8] text-white shadow-md shadow-purple-600/30'
              : 'text-[#B8AEC9] hover:text-[#FAF8FF] hover:bg-white/5'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Citizen</span>
        </button>

        <button
          type="button"
          onClick={() => setPersona('lawyer')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            persona === 'lawyer'
              ? 'bg-[#7C22E8] text-white shadow-md shadow-purple-600/30'
              : 'text-[#B8AEC9] hover:text-[#FAF8FF] hover:bg-white/5'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Advocate</span>
        </button>
      </div>

      {persona === 'lawyer' ? (
        /* Disabled Lawyer login display */
        <div 
          className="space-y-4 p-5 rounded-xl border text-center animate-in fade-in"
          style={{
            backgroundColor: 'rgba(12, 10, 20, 0.95)',
            borderColor: 'rgba(192, 132, 252, 0.18)'
          }}
        >
          <Briefcase className="w-9 h-9 text-[#C084FC] mx-auto" />
          <h3 className="text-sm font-semibold text-white">Advocate Verification Coming Soon</h3>
          <p className="text-xs text-[#B8AEC9] leading-relaxed">
            The Bar Council Verification module and Case Management workflows are scheduled for the Phase 4 release.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setPersona('citizen')}
              className="w-full py-2.5 px-4 rounded-xl border border-[#30243F] hover:border-[#A855F7]/50 bg-[#151020] hover:bg-[#1C1530] text-xs font-medium text-[#FAF8FF] transition-all cursor-pointer"
            >
              Sign In as Citizen Instead
            </button>
          </div>
        </div>
      ) : (
        /* Active Citizen login form — Matches Monty Hayton Reference */
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in text-left">
          
          {/* Email Field */}
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
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs text-[#F7F4FC] placeholder-[#B8AEC9]/50 transition-all duration-200 outline-none focus:ring-1 focus:ring-[#A855F7] ${
                  emailError ? 'border-red-500' : 'border'
                }`}
                style={{
                  backgroundColor: 'rgba(10, 8, 16, 0.92)',
                  borderColor: emailError ? '#EF4444' : 'rgba(192, 132, 252, 0.22)',
                }}
                required
              />
            </div>
            {emailError && (
              <p className="text-[11px] text-red-400 mt-1">{emailError}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-[#B8AEC9]">
                Password
              </label>
              <Link 
                to="/forgot-password" 
                className="text-[11px] text-[#C084FC] hover:text-[#D8B4FE] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <PasswordInput
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
                if (emailError) setEmailError('');
              }}
              errorText={passwordError}
              required
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 text-[#B8AEC9] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded w-3.5 h-3.5 bg-[#0A0810] border-[#30243F] accent-[#7C22E8] text-[#7C22E8] focus:ring-[#7C22E8]"
              />
              <span className="text-[11px]">Remember me</span>
            </label>
            <span className="text-[10px] text-[#B8AEC9]/70 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#C084FC]" />
              <span>Encrypted Session</span>
            </span>
          </div>

          {/* PRIMARY SIGN IN BUTTON — Vivid Violet Rectangle (#7C22E8) from Monty Hayton Reference */}
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
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </>
            )}
          </button>

          {/* Minimal Separator */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-[#30243F]/60 w-full" />
            <span 
              className="px-3 text-[10px] text-[#B8AEC9] uppercase tracking-wider shrink-0 font-medium"
              style={{ backgroundColor: 'rgba(15, 12, 24, 0.88)' }}
            >
              or continue without account
            </span>
          </div>

          {/* Instant Guest Mode CTA */}
          <button
            type="button"
            onClick={handleGuestAccess}
            className="w-full py-2.5 px-4 rounded-xl border border-[#30243F] hover:border-[#A855F7]/50 text-xs font-medium text-[#FAF8FF] transition-all cursor-pointer flex items-center justify-center gap-2 hover:bg-white/5"
            style={{
              backgroundColor: 'rgba(10, 8, 16, 0.92)'
            }}
          >
            <Compass className="w-3.5 h-3.5 text-[#C084FC]" />
            <span>Explore as Guest Citizen</span>
          </button>

          {/* Footer Navigation to Signup */}
          <div className="text-center pt-2 text-xs text-[#B8AEC9]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#C084FC] hover:text-[#D8B4FE] font-medium transition-colors">
              Sign Up
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
export default LoginPage;