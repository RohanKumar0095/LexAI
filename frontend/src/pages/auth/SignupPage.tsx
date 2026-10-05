import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, AuthApiError } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { Mail, User, Phone, ArrowRight, ShieldCheck, Briefcase, Compass } from 'lucide-react';

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
          setErrors({ email: err.message });
        } else {
          setErrors({ form: err.message });
        }
      } else if (err instanceof Error) {
        setErrors({ form: err.message });
      } else {
        setErrors({ form: 'Sign up failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    continueAsGuest();
    navigate('/app');
  };

  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName] || errors.form) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        delete next.form;
        return next;
      });
    }
  };

  return (
    <AuthLayout
      title={persona === 'citizen' ? "Create Citizen Account" : "Lawyer Pre-Access Registration"}
      subtitle={
        persona === 'citizen'
          ? "Join LexAI-India and unlock a customized workspace, state-specific legal answers, and case simulation tools."
          : "Register your practice and request verification access for the upcoming lawyer platform."
      }
      badgeText={persona === 'citizen' ? "Citizen Onboarding Portal" : "Advocate Enrollment Space"}
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
        /* Disabled Lawyer registration view */
        <div className="space-y-4 p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-center animate-in fade-in">
          <Briefcase className="w-10 h-10 text-indigo-400 mx-auto animate-pulse" />
          <h3 className="text-sm font-semibold text-white">Advocate Registration Coming in Phase 4</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Lawyer verification requires integration with State Bar Councils. This module is currently closed for development.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPersona('citizen')}
              className="w-full text-xs"
            >
              Sign Up as Citizen Instead
            </Button>
          </div>
        </div>
      ) : (
        /* Citizen registration form */
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
          {errors.form && (
            <p className="text-xs text-rose-400 font-medium text-center">{errors.form}</p>
          )}

          <Input
            label="Full Name"
            type="text"
            placeholder="Rohan Kumar"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError('name');
            }}
            errorText={errors.name}
            leftIcon={<User className="w-4 h-4 text-slate-500" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError('email');
            }}
            errorText={errors.email}
            leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
            required
          />

          <Input
            label="Phone Number (Optional)"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              clearFieldError('phone');
            }}
            errorText={errors.phone}
            leftIcon={<Phone className="w-4 h-4 text-slate-500" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordInput
              label="Password"
              placeholder="Min 6 chars"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError('password');
              }}
              errorText={errors.password}
              helperText="Must be at least 6 characters"
              required
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFieldError('confirmPassword');
              }}
              errorText={errors.confirmPassword}
              required
            />
          </div>

          {/* Secure indicator badge */}
          <div className="flex items-center gap-2 justify-center py-2 px-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPDP-compliant encrypted authentication</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4 text-[#070A12]" />}
          >
            Create Account
          </Button>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 bg-[#080B14] text-[10px] text-slate-500 uppercase tracking-widest">
              Or explore without account
            </span>
          </div>

          {/* Guest Mode Option */}
          <button
            type="button"
            onClick={handleGuestAccess}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-slate-800 text-sm font-semibold text-slate-200 transition-all duration-200 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#FF9933]" />
            <span>Continue in Guest Mode</span>
          </button>

          {/* Bottom Link */}
          <p className="text-center text-xs text-slate-400 pt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FF9933] hover:text-[#FFAA54] font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};
