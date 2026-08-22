import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { OnboardingStepIndicator } from '../../components/auth/OnboardingStepIndicator';
import { StateDistrictSelector } from '../../components/auth/StateDistrictSelector';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { User, Mail, Phone, ChevronRight, ChevronLeft, Sparkles, Languages, CheckCircle, Scale } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, isAuthenticated } = useAuth();

  // Guard: If not authenticated, go to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [step, setStep] = useState<number>(1);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Error States
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [locationErrors, setLocationErrors] = useState<Record<string, string>>({});

  // Populate from Context user data if available
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      if (user.state) setState(user.state);
      if (user.district) setDistrict(user.district);
      if (user.language) setLanguage(user.language);
    }
  }, [user]);

  const handleNextStep = () => {
    if (step === 1) {
      // Validate profile
      const errors: Record<string, string> = {};
      if (!name.trim()) errors.name = 'Full name is required';
      if (!email.trim()) errors.email = 'Email is required';
      if (phone && !/^\+?[0-9\s-]{10,15}$/.test(phone.trim())) {
        errors.phone = 'Invalid phone number format';
      }
      
      if (Object.keys(errors).length > 0) {
        setProfileErrors(errors);
        return;
      }
      setProfileErrors({});
    }

    if (step === 2) {
      // Validate state selection
      if (!state) {
        setLocationErrors({ state: 'Please select your state/union territory' });
        return;
      }
      setLocationErrors({});
    }

    if (step === 3) {
      // Validate district selection
      if (!district) {
        setLocationErrors({ district: 'Please select your district' });
        return;
      }
      setLocationErrors({});
    }

    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinishOnboarding = () => {
    // Save onboarding details to context
    updateProfile({
      name,
      email,
      phone: phone || undefined,
      state,
      district,
      language,
    });
    
    // Redirect to Temporary Workspace
    navigate('/app');
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-sm font-semibold text-slate-200">Confirm Your Identity</h2>
            <p className="text-xs text-slate-400">Please verify or update your primary identity fields to help customize rights lookup guides.</p>
            
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              errorText={profileErrors.name}
              leftIcon={<User className="w-4 h-4 text-slate-500" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              errorText={profileErrors.email}
              disabled // Keep email lock for identifier integrity
              leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              errorText={profileErrors.phone}
              leftIcon={<Phone className="w-4 h-4 text-slate-500" />}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-sm font-semibold text-slate-200">Select Your State / UT</h2>
            <p className="text-xs text-slate-400">Indian legal jurisdiction varies slightly by state. Choose your state to tailor municipal & state laws.</p>
            
            <StateDistrictSelector
              selectedState={state}
              selectedDistrict={district}
              onStateChange={setState}
              onDistrictChange={setDistrict}
              stateError={locationErrors.state}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-sm font-semibold text-slate-200">Select Your District</h2>
            <p className="text-xs text-slate-400">Select your active district to enable local legal help network referrals and municipal awareness.</p>
            
            <StateDistrictSelector
              selectedState={state}
              selectedDistrict={district}
              onStateChange={setState}
              onDistrictChange={setDistrict}
              districtError={locationErrors.district}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-sm font-semibold text-slate-200">Choose Language Preference</h2>
            <p className="text-xs text-slate-400">LexAI supports bilingual English and Hindi legal translations. Select your primary language.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-[#070A12]/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Languages className={`w-5 h-5 ${language === 'en' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  {language === 'en' && <Badge variant="electric">Active</Badge>}
                </div>
                <h3 className="text-sm font-bold">English</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Standard legal documents, chat responses, and scenario definitions.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  language === 'hi'
                    ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-[#070A12]/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-base font-bold leading-none ${language === 'hi' ? 'text-indigo-400' : 'text-slate-500'}`}>अ</span>
                  {language === 'hi' && <Badge variant="saffron">सक्रिय</Badge>}
                </div>
                <h3 className="text-sm font-bold">हिन्दी (Hindi)</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  कानूनी अधिकार गाइड और बातचीत का हिंदी अनुवाद।
                </p>
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF9933] via-[#E11D48] to-[#6366F1] flex items-center justify-center shadow-lg shadow-indigo-500/25 mx-auto">
              <Scale className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold font-display text-white">Welcome to LexAI-India!</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Your personalized legal awareness workspace is ready.
              </p>
            </div>

            {/* Profile Summary Card */}
            <Card variant="glass" className="text-left text-xs space-y-2.5 max-w-sm mx-auto bg-slate-950/60 border border-white/5">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="font-semibold text-slate-300">Setup Summary</span>
                <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  All Steps Complete
                </span>
              </div>
              <div className="grid grid-cols-3 gap-y-1.5 text-slate-400">
                <span className="col-span-1">Name:</span>
                <span className="col-span-2 text-slate-200 font-medium">{name}</span>
                
                <span className="col-span-1">Location:</span>
                <span className="col-span-2 text-slate-200 font-medium">{district}, {state}</span>
                
                <span className="col-span-1">Language:</span>
                <span className="col-span-2 text-slate-200 font-medium uppercase">{language}</span>
              </div>
            </Card>

            <p className="text-[10px] text-slate-500 leading-normal max-w-xs mx-auto">
              You are ready to enter your educational sandbox. Chat capabilities and rights simulations will run using your state location constraints.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout
      title="Complete Citizen Onboarding"
      subtitle="Customize your experience by verifying details and selecting regional jurisdictions."
      badgeText={`Step ${step} of 5`}
      badgeVariant="saffron"
    >
      {/* 5-step Indicator Progress */}
      <OnboardingStepIndicator currentStep={step} />

      {/* Render Step Content */}
      <div className="my-6 min-h-[220px]">
        {renderStepContent()}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
        {step > 1 && step < 5 ? (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handlePrevStep}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Back
          </Button>
        ) : (
          <div /> // Spacer
        )}

        {step < 5 ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleNextStep}
            rightIcon={<ChevronRight className="w-4 h-4 text-[#070A12]" />}
          >
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            variant="ai"
            size="lg"
            className="w-full"
            onClick={handleFinishOnboarding}
            rightIcon={<Sparkles className="w-4 h-4 text-white" />}
          >
            Enter LexAI
          </Button>
        )}
      </div>
    </AuthLayout>
  );
};
