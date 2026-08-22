import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';

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
      title="Reset Your Password"
      subtitle="Enter your registered email address and we will simulate sending you recovery instructions."
      badgeText="Security Center"
      badgeVariant="glass"
    >
      {isSent ? (
        <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">Instructions Dispatched</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              We've simulated sending password reset instructions to: <br />
              <strong className="text-slate-200">{email}</strong>
            </p>
          </div>
          
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[11px] text-slate-400">
            <span className="text-[#FF9933] font-semibold block mb-0.5">Demo Simulation Info:</span>
            In a live system, this sends a secure cryptographic reset link. For this demo, you can directly access the reset screen below.
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link to="/reset-password">
              <Button variant="primary" className="w-full text-xs">
                Proceed to Reset Password Form
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" className="w-full text-xs flex items-center justify-center gap-1.5 text-slate-400">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            errorText={emailError}
            leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            rightIcon={<Send className="w-4 h-4 text-[#070A12]" />}
          >
            Send Reset Instructions
          </Button>

          <div className="text-center pt-2">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
