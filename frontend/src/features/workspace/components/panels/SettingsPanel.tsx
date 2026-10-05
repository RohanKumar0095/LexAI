import React, { useState } from 'react';
import { 
  Globe, Eye, ShieldCheck, 
  Trash2, CheckCircle2 
} from 'lucide-react';
import type { UserSettings } from '../../types/user';

interface SettingsPanelProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [cleared, setCleared] = useState(false);

  const handleClearCache = () => {
    // Clear mock settings and cache
    localStorage.clear();
    setCleared(true);
    setTimeout(() => {
      setCleared(false);
      window.location.reload(); // Reload browser to reset initial states
    }, 1500);
  };

  const textSizes: { id: UserSettings['accessibilityTextSize']; label: string }[] = [
    { id: 'sm', label: 'Small' },
    { id: 'base', label: 'Default' },
    { id: 'lg', label: 'Large' },
    { id: 'xl', label: 'Extra Large' }
  ];

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-5">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            System Preferences
          </span>
          <h3 className="text-sm font-bold text-slate-909 dark:text-white mt-0.5">
            Settings
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Adjust styling, localization, accessibility options, and local privacy logs.
          </p>
        </div>

        {/* Form sections */}
        <div className="space-y-4 pt-1 flex-1 overflow-y-auto pr-1">
          
          {/* General Localization */}
          <div className="rounded-xl border border-slate-200 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900/50 space-y-3.5 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 leading-none">
              <Globe className="h-4 w-4 text-brand-gold-550 shrink-0" />
              <span>Language & Theme</span>
            </h4>
            
            <div className="space-y-2.5">
              {/* Theme switch */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-350">Application Theme</span>
                <select
                  value={settings.theme}
                  onChange={(e) => onUpdateSettings({ theme: e.target.value as any })}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2.5 text-[11px] focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme</option>
                  <option value="system">System Preference</option>
                </select>
              </div>

              {/* Language toggle */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-350">Default Language</span>
                <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => onUpdateSettings({ language: 'en' })}
                    className={`px-2.5 py-1 text-[10px] font-bold ${
                      settings.language === 'en' 
                        ? 'bg-slate-950 text-white dark:bg-brand-gold-550 dark:text-slate-950' 
                        : 'bg-slate-50 text-slate-500 hover:text-slate-700 dark:bg-slate-900'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ language: 'hi' })}
                    className={`px-2.5 py-1 text-[10px] font-bold ${
                      settings.language === 'hi' 
                        ? 'bg-slate-950 text-white dark:bg-brand-gold-550 dark:text-slate-950' 
                        : 'bg-slate-50 text-slate-500 hover:text-slate-700 dark:bg-slate-900'
                    }`}
                  >
                    HI
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="rounded-xl border border-slate-200 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900/50 space-y-3.5 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 leading-none">
              <Eye className="h-4 w-4 text-brand-gold-550 shrink-0" />
              <span>Accessibility Features</span>
            </h4>
            
            <div className="space-y-3">
              {/* Text Size options */}
              <div className="space-y-1">
                <span className="text-xs text-slate-655 dark:text-slate-350 block">Relative Text Size</span>
                <div className="grid grid-cols-4 gap-1 border border-slate-200/80 p-0.5 rounded-lg bg-slate-50 dark:border-slate-805 dark:bg-slate-900">
                  {textSizes.map((sz) => (
                    <button
                      key={sz.id}
                      onClick={() => onUpdateSettings({ accessibilityTextSize: sz.id })}
                      className={`py-1 text-[9px] font-bold rounded ${
                        settings.accessibilityTextSize === sz.id
                          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                          : 'text-slate-450 hover:text-slate-700'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reduced motion toggle */}
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-605 dark:text-slate-350">Reduced Animation Motion</span>
                <input
                  type="checkbox"
                  checked={settings.accessibilityReducedMotion}
                  onChange={(e) => onUpdateSettings({ accessibilityReducedMotion: e.target.checked })}
                  className="rounded border-slate-300 text-brand-gold-550 focus:ring-brand-gold-550 h-4 w-4 dark:border-slate-800 dark:bg-slate-900"
                />
              </div>

              {/* High contrast */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-605 dark:text-slate-350">High Color Contrast Mode</span>
                <input
                  type="checkbox"
                  checked={settings.accessibilityHighContrast}
                  onChange={(e) => onUpdateSettings({ accessibilityHighContrast: e.target.checked })}
                  className="rounded border-slate-300 text-brand-gold-550 focus:ring-brand-gold-550 h-4 w-4 dark:border-slate-800 dark:bg-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Privacy & Storage */}
          <div className="rounded-xl border border-slate-200 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900/50 space-y-3.5 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 leading-none">
              <ShieldCheck className="h-4 w-4 text-brand-gold-550 shrink-0" />
              <span>Privacy & Storage Controls</span>
            </h4>
            
            <div className="space-y-3">
              {/* History saving */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-350">Store Local Chat Logs</span>
                <input
                  type="checkbox"
                  checked={settings.chatHistoryEnabled}
                  onChange={(e) => onUpdateSettings({ chatHistoryEnabled: e.target.checked })}
                  className="rounded border-slate-300 text-brand-gold-550 focus:ring-brand-gold-550 h-4 w-4 dark:border-slate-800 dark:bg-slate-900"
                />
              </div>

              {/* Guest mode warning */}
              <div className="rounded-lg bg-amber-500/10 p-2.5 text-[10px] text-amber-600 dark:text-amber-400">
                You are currently running in **Guest Mode**. All generated files, progress XP levels, and configurations are cached in the browser local storage.
              </div>

              {/* Cache Clear */}
              <button
                onClick={handleClearCache}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-650 hover:bg-red-500/10 text-xs py-2 font-bold transition-colors dark:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
                <span>Reset Application Storage</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {cleared && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>Storage reset! Reloading application...</span>
        </div>
      )}
      
    </div>
  );
};
export default SettingsPanel;
