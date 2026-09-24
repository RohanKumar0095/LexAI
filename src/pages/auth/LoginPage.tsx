import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, AuthApiError } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { SocialLoginButton } from '../../components/auth/SocialLoginButton';
import { Mail, ArrowRight, ShieldCheck, Briefcase, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

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

  return (
    <AuthLayout
      title={persona === 'citizen' ? "Welcome Back to LexAI" : "Lawyer Access Portal"}
      subtitle={
        persona === 'citizen'
          ? "Access your personalized Indian legal literacy suite, chat agent, and rights simulator."
          : "Secure access point for bar-verified advocates and legal representatives."
      }
      badgeText={persona === 'citizen' ? "Citizen Access Portal" : "Legal Professional Space"}
      badgeVariant={persona === 'citizen' ? "saffron" : "electric"}
    >
      {/* Persona Selector Tabs (Disable lawyer flow cleanly) */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#070A12] rounded-xl border border-slate-800 mb-6">
        <button
          type="button"
          onClick={() => setPersona('citizen')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            persona === 'citizen'
              ? 'bg-[#FF9933] text-[#070A12] shadow-md shadow-saffron-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Citizen Portal</span>
        </button>

        <button
          type="button"
          onClick={() => setPersona('lawyer')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            persona === 'lawyer'
              ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Lawyer / Advocate</span>
        </button>
      </div>

      {persona === 'lawyer' ? (
        /* Disabled Lawyer login display */
        <div className="space-y-4 p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-center animate-in fade-in">
          <Briefcase className="w-10 h-10 text-indigo-400 mx-auto" />
          <h3 className="text-sm font-semibold text-white">Lawyer Registration & Dashboard Coming Soon</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The Bar Council Verification module and Case Management workflows are scheduled for the Phase 4 release.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPersona('citizen')}
              className="w-full text-xs"
            >
              Sign In as Citizen Instead
            </Button>
          </div>
        </div>
      ) : (
        /* Active Citizen login form */
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
            }}
            errorText={emailError}
            leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
            required
          />

          <PasswordInput
            label="Password"
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

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-indigo-500"
              />
              <span>Remember me</span>
            </label>
            <Link 
              to="/forgot-password" 
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Secure indicator badge in form */}
          <div className="flex items-center gap-2 justify-center py-2 px-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure 256-bit Encrypted Authentication Active</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4 text-[#070A12]" />}
          >
            Sign In
          </Button>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 bg-[#080B14] text-[10px] text-slate-500 uppercase tracking-widest">
              Or continue with
            </span>
          </div>

          {/* Google OAuth Button */}
          <SocialLoginButton 
            onClick={() => {
              setEmailError('Google sign-in is currently unavailable. Please sign in with email and password.');
            }} 
          />

          {/* Bottom link to signup */}
          <p className="text-center text-xs text-slate-400 pt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#FF9933] hover:text-[#FFAA54] font-semibold transition-colors">
              Create Account
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};
