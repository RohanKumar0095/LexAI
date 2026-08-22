import React from 'react';
import { statesAndDistricts } from '../../data/statesAndDistricts';
import { MapPin } from 'lucide-react';

interface StateDistrictSelectorProps {
  selectedState: string;
  selectedDistrict: string;
  onStateChange: (state: string) => void;
  onDistrictChange: (district: string) => void;
  stateError?: string;
  districtError?: string;
}

export const StateDistrictSelector: React.FC<StateDistrictSelectorProps> = ({
  selectedState,
  selectedDistrict,
  onStateChange,
  onDistrictChange,
  stateError,
  districtError,
}) => {
  // Find currently selected state's districts
  const currentStatesObj = statesAndDistricts.find(
    (s) => s.name === selectedState
  );
  const districts = currentStatesObj ? currentStatesObj.districts : [];

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    onStateChange(newState);
    // Clear district when state changes
    onDistrictChange('');
  };

  const selectContainerClass = (hasError: boolean) => 
    `relative flex items-center bg-[#070A12]/90 rounded-md border ${
      hasError 
        ? 'border-rose-600/80 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20' 
        : 'border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
    } transition-all duration-200 hover:border-slate-700 w-full`;

  const selectElementClass = 
    "w-full bg-transparent px-3.5 py-2.5 text-sm text-[#F8FAFC] focus:outline-none appearance-none cursor-pointer pr-10";

  return (
    <div className="space-y-4">
      {/* State Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wider text-slate-300">
          State / Union Territory
        </label>
        
        <div className={selectContainerClass(!!stateError)}>
          <div className="pl-3.5 text-slate-400 shrink-0 select-none">
            <MapPin className="w-4 h-4" />
          </div>
          
          <select
            value={selectedState}
            onChange={handleStateChange}
            className={selectElementClass}
          >
            <option value="" className="bg-[#080B14] text-slate-500">Select State/UT</option>
            {statesAndDistricts.map((state) => (
              <option key={state.code} value={state.name} className="bg-[#080B14] text-[#F8FAFC]">
                {state.name}
              </option>
            ))}
          </select>

          {/* Custom Chevron Indicator */}
          <div className="absolute right-3.5 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {stateError && (
          <p className="text-xs text-rose-400 font-medium mt-0.5">{stateError}</p>
        )}
      </div>

      {/* District Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wider text-slate-300">
          District
        </label>
        
        <div 
          className={`${selectContainerClass(!!districtError)} ${
            !selectedState ? 'opacity-50 cursor-not-allowed bg-slate-900/50' : ''
          }`}
        >
          <div className="pl-3.5 text-slate-400 shrink-0 select-none">
            <MapPin className="w-4 h-4" />
          </div>
          
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            disabled={!selectedState}
            className={selectElementClass}
          >
            <option value="" className="bg-[#080B14] text-slate-500">
              {selectedState ? "Select District" : "Select State First"}
            </option>
            {districts.map((district) => (
              <option key={district} value={district} className="bg-[#080B14] text-[#F8FAFC]">
                {district}
              </option>
            ))}
          </select>

          {/* Custom Chevron Indicator */}
          <div className="absolute right-3.5 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {districtError && (
          <p className="text-xs text-rose-400 font-medium mt-0.5">{districtError}</p>
        )}
      </div>
    </div>
  );
};
