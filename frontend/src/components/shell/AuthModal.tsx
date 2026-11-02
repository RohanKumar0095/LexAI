import React, { useState } from 'react';
import { X, User, Briefcase, Eye, EyeOff, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useAuth, AuthApiError } from '../../context';

export type UserPersona = 'citizen' | 'lawyer';
export type AuthTab = 'signin' | 'signup';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPersona?: UserPersona;
  onSuccessLogin?: (persona: UserPersona, email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialPersona = 'citizen',
  onSuccessLogin,
}) => {
  const { login, signup } = useAuth();

  const [persona, setPersona] = useState<UserPersona>(initialPersona);
  const [authTab, setAuthTab] = useState<AuthTab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [barNumber, setBarNumber] = useState('');
  const [stateBar, setStateBar] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (persona === 'lawyer') {
      setError('Lawyer portal registration is scheduled for a future release. Please sign in as a Citizen.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (authTab === 'signin') {
        await login(email, password);
      } else {
        await signup({ email, password });
      }
      onSuccessLogin?.(persona, email);
      onClose();
    } catch (err: unknown) {
      if (err instanceof AuthApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#15111F] rounded-3xl p-6 sm:p-8 border border-[#30243F] shadow-2xl shadow-purple-950/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glows inside modal */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#A855F7]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#AAA3BB] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close authentication dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <Badge variant={persona === 'citizen' ? 'primary' : 'electric'} icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              {persona === 'citizen' ? 'Citizen Access Portal' : 'Legal Advocate Portal'}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            {authTab === 'signin' ? 'Welcome Back to LexAI' : 'Join LexAI-India'}
          </h2>
          <p className="text-xs text-[#AAA3BB]">
            {persona === 'citizen' 
              ? 'Access your personalized legal chat, rights guides, and learning progress.' 
              : 'Sign in to access lawyer tools, case document workflows, and referral network.'}
          </p>
        </div>

        {/* Persona Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#100D18] rounded-2xl border border-[#30243F] mb-6">
          <button
            type="button"
            onClick={() => {
              setPersona('citizen');
              setError('');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              persona === 'citizen'
                ? 'bg-[#A855F7] text-white shadow-md shadow-purple-500/25'
                : 'text-[#AAA3BB] hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Citizen / Public</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPersona('lawyer');
              setError('');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              persona === 'lawyer'
                ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-600/25'
                : 'text-[#AAA3BB] hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Lawyer / Advocate</span>
          </button>
        </div>

        {/* Sign In vs Sign Up Tab */}
        <div className="flex items-center justify-center gap-6 border-b border-[#30243F] mb-6 pb-2 text-sm font-medium">
          <button
            onClick={() => {
              setAuthTab('signin');
              setError('');
            }}
            className={`pb-2 transition-colors relative cursor-pointer ${
              authTab === 'signin' ? 'text-white font-semibold' : 'text-[#AAA3BB] hover:text-white'
            }`}
          >
            Sign In
            {authTab === 'signin' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A855F7] rounded-full" />
            )}
          </button>
          <button
            onClick={() => {
              setAuthTab('signup');
              setError('');
            }}
            className={`pb-2 transition-colors relative cursor-pointer ${
              authTab === 'signup' ? 'text-white font-semibold' : 'text-[#AAA3BB] hover:text-white'
            }`}
          >
            Create Account
            {authTab === 'signup' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A855F7] rounded-full" />
            )}
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-xs text-rose-400 font-medium text-center bg-rose-500/10 border border-rose-500/20 py-2 px-3 rounded-xl">
              {error}
            </p>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder={persona === 'citizen' ? "name@example.com" : "advocate@barassociation.in"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {persona === 'lawyer' && authTab === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Bar Council Enrollment No."
                placeholder="e.g. D/1234/2020"
                value={barNumber}
                onChange={(e) => setBarNumber(e.target.value)}
                required
              />
              <Input
                label="State Bar Council"
                placeholder="e.g. Bar Council of Delhi"
                value={stateBar}
                onChange={(e) => setStateBar(e.target.value)}
                required
              />
            </div>
          )}

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-[#AAA3BB]" /> : <Eye className="w-4 h-4 text-[#AAA3BB]" />}
                </button>
              }
            />
          </div>

          {authTab === 'signin' && (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#AAA3BB] cursor-pointer">
                <input type="checkbox" className="rounded bg-[#100D18] border-[#30243F] accent-[#A855F7] text-[#A855F7] focus:ring-[#A855F7]" />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-[#C084FC] hover:text-[#D8B4FE] transition-colors cursor-pointer">
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
          >
            {authTab === 'signin' 
              ? `Sign In as ${persona === 'citizen' ? 'Citizen' : 'Advocate'}`
              : `Register Account as ${persona === 'citizen' ? 'Citizen' : 'Advocate'}`}
          </Button>

          {/* OAuth Placeholder */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#30243F]" />
            </div>
            <span className="relative px-3 bg-[#15111F] text-[11px] text-[#AAA3BB] uppercase tracking-widest">
              Or continue with
            </span>
          </div>

          <button
            type="button"
            onClick={() => setError('Google OAuth is currently simulated. Please use email and password.')}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-[#100D18] hover:bg-[#1C1728] border border-[#30243F] text-sm font-medium text-[#F8F7FC] transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        {/* Footnote */}
        <p className="text-[11px] text-[#AAA3BB] text-center mt-6">
          <Lock className="w-3 h-3 inline mr-1 text-[#10B981]" />
          LexAI protects user privacy in compliance with Indian DPDP Act 2023 guidelines.
        </p>
      </div>
    </div>
  );
};
export default AuthModal;
