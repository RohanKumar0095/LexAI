import React, { useState } from 'react';
import { MapPin, Globe, CheckCircle2 } from 'lucide-react';

interface StateAwarenessPanelProps {
  initialState: string;
  initialDistrict: string;
  initialLanguage: 'en' | 'hi';
  onSave: (state: string, district: string, lang: 'en' | 'hi') => void;
}

export const StateAwarenessPanel: React.FC<StateAwarenessPanelProps> = ({
  initialState,
  initialDistrict,
  initialLanguage,
  onSave
}) => {
  const [selectedState, setSelectedState] = useState(initialState || 'Delhi');
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict || 'Delhi NCR');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>(initialLanguage || 'en');
  const [saved, setSaved] = useState(false);

  const states = [
    'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 
    'Bihar', 'West Bengal', 'Telangana', 'Haryana', 'Punjab', 
    'Rajasthan', 'Gujarat', 'Kerala'
  ];

  const districtsMap: Record<string, string[]> = {
    'Delhi': ['Delhi NCR', 'New Delhi', 'North Delhi', 'South Delhi'],
    'Maharashtra': ['Mumbai City', 'Pune', 'Nagpur', 'Thane'],
    'Karnataka': ['Bengaluru Urban', 'Mysuru', 'Mangaluru', 'Hubballi'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Trichy'],
    'Uttar Pradesh': ['Noida', 'Lucknow', 'Kanpur', 'Agra'],
    'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur'],
    'West Bengal': ['Kolkata', 'Howrah', 'Darjeeling', 'Asansol'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam'],
    'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala'],
    'Punjab': ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    'Kerala': ['Kochi', 'Trivandrum', 'Calicut', 'Thrissur']
  };

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const districts = districtsMap[stateName] || ['General'];
    setSelectedDistrict(districts[0]);
    setSaved(false);
  };

  const handleSave = () => {
    onSave(selectedState, selectedDistrict, selectedLanguage);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const districts = districtsMap[selectedState] || ['General'];

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Location & Language
          </span>
          <h3 className="text-sm font-bold text-slate-905 dark:text-white mt-1">
            State-wise Legal Awareness
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Configure your active region to receive location-sensitive Indian laws and emergency helpline links.
          </p>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3.5 pt-2">
          {/* State Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-450 uppercase flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-brand-gold-550" />
              <span>Select State</span>
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-xs text-slate-800 focus:border-brand-gold-550 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {states.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* District Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-450 uppercase flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-brand-gold-550" />
              <span>Select District</span>
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSaved(false);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-xs text-slate-800 focus:border-brand-gold-550 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {districts.map((dst) => (
                <option key={dst} value={dst}>{dst}</option>
              ))}
            </select>
          </div>

          {/* Language Toggle */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-450 uppercase flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-brand-gold-550" />
              <span>Interface Language</span>
            </label>
            <div className="flex gap-2">
              {(['en', 'hi'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setSaved(false);
                  }}
                  className={`flex-1 rounded-xl py-2 text-xs font-semibold border transition-all ${
                    selectedLanguage === lang
                      ? 'border-brand-gold-550 bg-brand-gold-550/5 text-slate-900 dark:text-white font-bold'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850 text-slate-650 dark:text-slate-350'
                  }`}
                >
                  {lang === 'en' ? 'English' : 'हिंदी (Hindi)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Localized Law Insights */}
        <div className="rounded-xl border border-slate-200 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900/60 mt-2 space-y-3">
          <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">
            {selectedState} Local Insights
          </h4>
          
          <div className="space-y-2">
            <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-350">
              <span className="font-semibold text-brand-gold-550 dark:text-brand-gold-300">Property Stamp Duty:</span> Average residential stamp duty in {selectedState} is 5-7% of property valuation, with a 1-2% discount available for female sole proprietors.
            </div>
            <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-350">
              <span className="font-semibold text-brand-gold-550 dark:text-brand-gold-300">Traffic Rules:</span> Auto-generated speed limit fines and camera tracking are handled under the e-challan systems of the {selectedState} Police.
            </div>
            <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-350">
              <span className="font-semibold text-brand-gold-550 dark:text-brand-gold-300">Consumer Redressal:</span> For disputes in {selectedDistrict}, you will file with the District Consumer Commission located at the regional headquarters.
            </div>
          </div>
        </div>

        {/* Saved Success Notification */}
        {saved && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold animate-in fade-in duration-200">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
            <span>Preferences saved successfully! Welcome to {selectedDistrict}, {selectedState}.</span>
          </div>
        )}
      </div>

      <div className="pt-6">
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-brand-navy-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-850 dark:bg-brand-gold-550 dark:text-slate-950 dark:hover:bg-brand-gold-400 transition-colors"
        >
          Save Location Settings
        </button>
      </div>
    </div>
  );
};
export default StateAwarenessPanel;
