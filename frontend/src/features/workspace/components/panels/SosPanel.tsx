import React, { useState } from 'react';
import { Phone, ShieldAlert, MapPin, Landmark, Clock, CheckSquare } from 'lucide-react';

interface SosPanelProps {
  activeState: string;
  activeDistrict: string;
}

export const SosPanel: React.FC<SosPanelProps> = ({ activeState, activeDistrict }) => {
  const [callSimulated, setCallSimulated] = useState<string | null>(null);

  const helplines = [
    { name: 'Police / Emergency Response', number: '112', description: 'All-in-one national emergency response' },
    { name: 'Cyber Crime Helpline', number: '1930', description: 'Immediate report of financial transaction fraud' },
    { name: 'Women\'s Helpline', number: '1091', description: 'Support for women facing domestic abuse or harassment' },
    { name: 'Ambulance Medical Aid', number: '108', description: 'Critical healthcare and emergency vehicle transport' },
    { name: 'Fire Department Control', number: '101', description: 'Accidental fire outbreaks' },
  ];

  const handleSimulateCall = (number: string) => {
    setCallSimulated(number);
    setTimeout(() => {
      setCallSimulated(null);
    }, 3000);
  };

  const checklistItems = [
    'Stay Calm & Secure Your Safety: Move to a well-lit, public location if under immediate threat.',
    'Do Not Delete Evidence: Keep all call logs, SMS, WhatsApp texts, emails, or links intact.',
    'Note down details: Capture officer badge numbers, vehicle license plates, or names immediately.',
    'Identify Witnesses: Look around for cameras or citizens who observed the incident.',
    'Seek Professional Legal Aid: Call a helpline or contact a registered DLSA advocate.'
  ];

  // Dynamic nearby stations based on mock coordinates
  const getMockLocations = () => {
    switch (activeState) {
      case 'Karnataka':
        return {
          station: 'Bengaluru Central Police Station (0.6 km)',
          stationPhone: '+91 80 2294 2200',
          hospital: 'St. John\'s Emergency Care Hub (1.4 km)',
          hospitalPhone: '+91 80 2206 5000'
        };
      case 'Maharashtra':
        return {
          station: 'Colaba Police Division HQ (0.9 km)',
          stationPhone: '+91 22 2285 6817',
          hospital: 'KEM Emergency Medical Facility (1.8 km)',
          hospitalPhone: '+91 22 2410 7000'
        };
      default:
        return {
          station: 'Connaught Place Police Station (0.8 km)',
          stationPhone: '+91 11 2335 1500',
          hospital: 'Dr. RML Central Emergency Hospital (1.2 km)',
          hospitalPhone: '+91 11 2336 5525'
        };
    }
  };

  const localPlaces = getMockLocations();

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* Visual Priority Callout Warning */}
      <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-4.5 text-red-700 dark:border-red-900/40 dark:bg-red-950/10 dark:text-red-400">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5.5 w-5.5 shrink-0 mt-0.5 animate-pulse-slow text-red-500" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Emergency SOS Assistance
            </h4>
            <p className="text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400 mt-1">
              **DEMO MODE ONLY:** LexAI does not directly trigger emergency services. If you are experiencing a life-threatening crisis, dial the national numbers using a cellular link.
            </p>
          </div>
        </div>
      </div>

      {/* Helplines List */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 px-1">
          National Emergency Hotlines
        </h4>
        
        <div className="grid grid-cols-1 gap-2.5">
          {helplines.map((hp) => (
            <div 
              key={hp.number}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-sm"
            >
              <div className="flex items-start gap-3 overflow-hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 shrink-0">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-850 dark:text-slate-100">
                    {hp.name}
                  </h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-450 line-clamp-1 mt-0.5">
                    {hp.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSimulateCall(hp.number)}
                className="flex items-center gap-1.5 rounded-lg bg-red-500 text-white font-bold text-xs py-1.8 px-3 hover:bg-red-650 transition-colors shadow-sm ml-2"
              >
                <span>{hp.number}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Call simulation feedback banner */}
      {callSimulated && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 text-white p-4 shadow-xl border border-slate-850 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
          <div className="text-xs">
            Simulating dialer redirect to **{callSimulated}**...
          </div>
        </div>
      )}

      {/* Nearby authorities based on configuration */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 px-1">
          Nearest Assistance ({activeDistrict})
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Police Station */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-250 flex items-center gap-1.5">
              <Landmark className="h-4 w-4 text-brand-gold-550 shrink-0" />
              <span>Police Station</span>
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-tight">
              {localPlaces.station}
            </p>
            <div className="text-[10px] text-slate-450 flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{localPlaces.stationPhone}</span>
            </div>
          </div>

          {/* Hospital */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-250 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-brand-gold-550 shrink-0" />
              <span>Trauma Hospital</span>
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-tight">
              {localPlaces.hospital}
            </p>
            <div className="text-[10px] text-slate-450 flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{localPlaces.hospitalPhone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Checklist */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900/60 space-y-3.5">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <Clock className="h-4.5 w-4.5 text-brand-gold-550" />
          <span>Emergency Legal Checklist</span>
        </h4>

        <div className="space-y-2.5">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <CheckSquare className="h-3.5 w-3.5 text-brand-gold-550 shrink-0 mt-0.5" />
              <span className="text-slate-600 dark:text-slate-350 leading-relaxed">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
export default SosPanel;
