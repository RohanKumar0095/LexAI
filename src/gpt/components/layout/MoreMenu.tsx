import React, { useState } from 'react';
import { MoreVertical, BookOpen, Scale, Landmark, Layers, Map, FileSearch, PenTool, ExternalLink, MapPin, AlertOctagon, GraduationCap, Bookmark, Bell, Settings } from 'lucide-react';

interface MoreMenuProps {
  onSelectPanel: (panel: string | null) => void;
}

export const MoreMenu: React.FC<MoreMenuProps> = ({ onSelectPanel }) => {
  const [isOpen, setIsOpen] = useState(false);

  const tools = [
    { id: 'daily-law', label: 'Daily Law', icon: BookOpen },
    { id: 'rights-checker', label: 'Rights Checker', icon: Scale },
    { id: 'scenario-simulator', label: 'Scenario Simulator', icon: Landmark },
    { id: 'law-categories', label: 'Law Categories', icon: Layers },
    { id: 'legal-roadmaps', label: 'Legal Roadmaps', icon: Map },
    { id: 'document-ai', label: 'Document AI', icon: FileSearch },
    { id: 'complaint-generator', label: 'Complaint Generator', icon: PenTool },
    { id: 'government-resources', label: 'Gov Resources', icon: ExternalLink },
    { id: 'state-awareness', label: 'State Awareness', icon: MapPin },
    { id: 'sos-help', label: 'SOS Emergency Help', icon: AlertOctagon, highlight: true },
    { id: 'my-learning', label: 'My Learning', icon: GraduationCap },
    { id: 'saved-laws', label: 'Saved Space', icon: Bookmark },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        title="More Tools"
        id="more-menu-trigger"
      >
        <MoreVertical className="h-4.5 w-4.5" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 max-h-[80vh] overflow-y-auto origin-top-right rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-brand-navy-900 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 text-xs font-semibold text-slate-400">
              Quick Menu — Legal Tools
            </div>
            
            {tools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectPanel(tool.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-xs rounded-lg text-left transition-colors duration-150 ${
                    tool.highlight
                      ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20'
                      : 'text-slate-700 hover:bg-slate-105 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${tool.highlight ? 'text-red-500' : 'text-slate-400'}`} />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
export default MoreMenu;
