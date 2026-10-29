import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, AuthApiError } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { Mail, User, Phone, ArrowRight, Briefcase, Compass, Loader2 } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, continueAsGuest, isAuthenticated } = useAuth();

  const [persona, setPersona] = useState<'citizen' | 'lawyer'>('citizen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    let isValid = true;

    if (!name.trim()) {
      tempErrors.name = 'Full name is required';
      isValid = false;
    }

    if (!email) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (phone && !/^\+?[0-9\s-]{10,15}$/.test(phone.trim())) {
      tempErrors.phone = 'Invalid phone number format';
      isValid = false;
    }

    if (!password) {
      tempErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (persona === 'lawyer') return;

    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const success = await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });

      if (success) {
        navigate('/onboarding');
      }
    } catch (err: unknown) {
      console.error('Signup error:', err);
      if (err instanceof AuthApiError) {
        if (
          err.statusCode === 409 ||
          err.message.toLowerCase().includes('already exists') ||
          err.message.toLowerCase().includes('registered')
        ) {
          setErrors({ email: 'An account with this email already exists' });
        } else {
          setErrors({ general: err.message });
        }
      } else if (err instanceof Error) {
        setErrors({ general: err.message });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
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
      title={persona === 'citizen' ? "Create Account" : "Advocate Portal"}
      subtitle={
        persona === 'citizen'
          ? "Join LexAI to access statutory guides, complaint drafts & daily laws."
          : "Advocate registration with Bar Council credentials will open soon."
      }
      cardWidth="max-w-[450px]"
    >
      {/* Persona Selector Tabs */}
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
        <div 
          className="space-y-4 p-5 rounded-xl border text-center animate-in fade-in"
          style={{
            backgroundColor: 'rgba(12, 10, 20, 0.95)',
            borderColor: 'rgba(192, 132, 252, 0.18)'
          }}
        >
          <Briefcase className="w-9 h-9 text-[#C084FC] mx-auto" />
          <h3 className="text-sm font-semibold text-white">Advocate Registration Coming Soon</h3>
          <p className="text-xs text-[#B8AEC9] leading-relaxed">
            The Bar Council Verification module and Case Management workflows are scheduled for the Phase 4 release.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setPersona('citizen')}
              className="w-full py-2.5 px-4 rounded-xl border border-[#30243F] hover:border-[#A855F7]/50 bg-[#151020] hover:bg-[#1C1530] text-xs font-medium text-[#FAF8FF] transition-all cursor-pointer"
            >
              Sign Up as Citizen Instead
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5 animate-in fade-in text-left">
          {errors.general && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
              {errors.general}
            </div>
          )}

          {/* Full Name Field */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#B8AEC9]">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#B8AEC9]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Rohit Sharma"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                className={`w-full pl-10 pr-3.5 py-2 rounded-xl text-xs text-[#F7F4FC] placeholder-[#B8AEC9]/50 transition-all outline-none focus:ring-1 focus:ring-[#A855F7] ${
                  errors.name ? 'border-red-500' : 'border'
                }`}
                style={{
                  backgroundColor: 'rgba(10, 8, 16, 0.92)',
                  borderColor: errors.name ? '#EF4444' : 'rgba(192, 132, 252, 0.22)',
                }}
                required
              />
            </div>
            {errors.name && <p className="text-[11px] text-red-400">{errors.name}</p>}
          </div>

          {/* Email Address Field */}
          <div className="space-y-1">
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
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`w-full pl-10 pr-3.5 py-2 rounded-xl text-xs text-[#F7F4FC] placeholder-[#B8AEC9]/50 transition-all outline-none focus:ring-1 focus:ring-[#A855F7] ${
                  errors.email ? 'border-red-500' : 'border'
                }`}
                style={{
                  backgroundColor: 'rgba(10, 8, 16, 0.92)',
                  borderColor: errors.email ? '#EF4444' : 'rgba(192, 132, 252, 0.22)',
                }}
                required
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-400">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#B8AEC9]">
              Phone Number <span className="text-[#B8AEC9]/60 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#B8AEC9]">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                }}
                className={`w-full pl-10 pr-3.5 py-2 rounded-xl text-xs text-[#F7F4FC] placeholder-[#B8AEC9]/50 transition-all outline-none focus:ring-1 focus:ring-[#A855F7] ${
                  errors.phone ? 'border-red-500' : 'border'
                }`}
                style={{
                  backgroundColor: 'rgba(10, 8, 16, 0.92)',
                  borderColor: errors.phone ? '#EF4444' : 'rgba(192, 132, 252, 0.22)',
                }}
              />
            </div>
            {errors.phone && <p className="text-[11px] text-red-400">{errors.phone}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#B8AEC9]">
              Password
            </label>
            <PasswordInput
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
              }}
              errorText={errors.password}
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#B8AEC9]">
              Confirm Password
            </label>
            <PasswordInput
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
              }}
              errorText={errors.confirmPassword}
              required
            />
          </div>

          {/* PRIMARY CREATE ACCOUNT BUTTON — Vivid Purple #7C22E8 */}
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
                <span>Create Free Account</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </>
            )}
          </button>

          {/* Separator */}
          <div className="relative my-3 flex items-center justify-center">
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

          {/* Footer Navigation to Login */}
          <div className="text-center pt-2 text-xs text-[#B8AEC9]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C084FC] hover:text-[#D8B4FE] font-medium transition-colors">
              Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
export default SignupPage;