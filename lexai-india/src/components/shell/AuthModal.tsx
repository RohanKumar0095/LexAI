import React, { useState } from 'react';
import { X, User, Briefcase, Eye, EyeOff, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

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
  const [persona, setPersona] = useState<UserPersona>(initialPersona);
  const [authTab, setAuthTab] = useState<AuthTab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [barNumber, setBarNumber] = useState('');
  const [stateBar, setStateBar] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccessLogin?.(persona, email);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in">
      <div 
        className="relative w-full max-w-lg lexai-surface-modal rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glows inside modal */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close authentication dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <Badge variant={persona === 'citizen' ? 'saffron' : 'electric'} icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              {persona === 'citizen' ? 'Citizen Access Portal' : 'Legal Advocate Portal'}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            {authTab === 'signin' ? 'Welcome Back to LexAI' : 'Join LexAI-India'}
          </h2>
          <p className="text-xs text-slate-400">
            {persona === 'citizen' 
              ? 'Access your personalized legal chat, rights guides, and learning progress.' 
              : 'Sign in to access lawyer tools, case document workflows, and referral network.'}
          </p>
        </div>

        {/* Persona Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#070A12] rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => setPersona('citizen')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              persona === 'citizen'
                ? 'bg-[#FF9933] text-[#070A12] shadow-md shadow-saffron-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Citizen / Public</span>
          </button>

          <button
            type="button"
            onClick={() => setPersona('lawyer')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              persona === 'lawyer'
                ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Lawyer / Advocate</span>
          </button>
        </div>

        {/* Sign In vs Sign Up Tab */}
        <div className="flex items-center justify-center gap-6 border-b border-slate-800 mb-6 pb-2 text-sm font-medium">
          <button
            onClick={() => setAuthTab('signin')}
            className={`pb-2 transition-colors relative ${
              authTab === 'signin' ? 'text-white font-semibold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Sign In
            {authTab === 'signin' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setAuthTab('signup')}
            className={`pb-2 transition-colors relative ${
              authTab === 'signup' ? 'text-white font-semibold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Create Account
            {authTab === 'signup' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          {authTab === 'signin' && (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-indigo-500" />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            variant={persona === 'citizen' ? 'primary' : 'ai'}
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {authTab === 'signin' 
              ? `Sign In as ${persona === 'citizen' ? 'Citizen' : 'Advocate'}`
              : `Register Account as ${persona === 'citizen' ? 'Citizen' : 'Advocate'}`}
          </Button>

          {/* OAuth Placeholder */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 bg-[#080B14] text-[11px] text-slate-500 uppercase tracking-widest">
              Or continue with
            </span>
          </div>

          <button
            type="button"
            onClick={() => alert("Google OAuth Integration will be enabled in Phase 3 backend integration.")}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-slate-800 text-sm font-medium text-slate-200 transition-colors"
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
        <p className="text-[11px] text-slate-500 text-center mt-6">
          <Lock className="w-3 h-3 inline mr-1 text-emerald-400" />
          LexAI protects user privacy in compliance with Indian DPDP Act 2023 guidelines.
        </p>
      </div>
    </div>
  );
};
