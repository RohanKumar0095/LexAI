import React, { useState } from 'react';
import { ChevronRight, Copy, Download, Edit2, RefreshCw, MessageSquare, Loader2 } from 'lucide-react';
import { apiService } from '../../services/apiService';

interface ComplaintGeneratorPanelProps {
  onAskLex: (prompt: string) => void;
}

export const ComplaintGeneratorPanel: React.FC<ComplaintGeneratorPanelProps> = ({ onAskLex }) => {
  const [formData, setFormData] = useState({
    type: 'Consumer Complaint',
    situation: '',
    date: '',
    location: '',
    involvedParty: '',
    description: '',
    desiredAction: ''
  });

  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const docTypes = [
    'Police Complaint',
    'Consumer Complaint',
    'Cyber Complaint',
    'RTI Application',
    'Legal Notice',
    'General Application'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.situation || !formData.involvedParty) return;

    setGenerating(true);
    setDraft(null);
    try {
      const generatedDraft = await apiService.generateComplaint(formData);
      setDraft(generatedDraft);
      setIsEditable(false);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!draft) return;
    // Client-side text file download trigger! Very clean and satisfying.
    const element = document.createElement("a");
    const file = new Blob([draft], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.type.replace(' ', '_')}_Draft.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleDiscussInChat = () => {
    onAskLex(`I have generated a ${formData.type} draft against ${formData.involvedParty}. Can you review this draft and help me refine the legal clauses?`);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Document Draft Generator
          </span>
          <h3 className="text-sm font-bold text-slate-905 dark:text-white mt-1">
            Create a legal or administrative draft
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Fill in the particulars to construct a mock legal notice, complaint petition, or RTI letter.
          </p>
        </div>

        {!draft && !generating && (
          // Form View
          <form onSubmit={handleGenerate} className="space-y-3 pt-2">
            {/* Document Type Selector */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-450 uppercase">Document Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3.5 text-xs text-slate-800 focus:border-brand-gold-550 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                {docTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Involve Party */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-450 uppercase">Opposite Party / Organization</label>
              <input
                type="text"
                name="involvedParty"
                required
                value={formData.involvedParty}
                onChange={handleInputChange}
                placeholder="Name of individual or company (e.g. Acme Tech Pvt Ltd)"
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3.5 text-xs text-slate-800 focus:border-brand-gold-550 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Date & Location Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-450 uppercase">Date of Incident</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3.5 text-xs text-slate-850 focus:border-brand-gold-550 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-450 uppercase">Location (City)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. New Delhi"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3.5 text-xs text-slate-850 focus:border-brand-gold-550 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Brief Situation Subject */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-450 uppercase">Brief Subject / Situation</label>
              <input
                type="text"
                name="situation"
                required
                value={formData.situation}
                onChange={handleInputChange}
                placeholder="e.g. Refusal to refund for damaged laptop delivery"
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3.5 text-xs text-slate-850 focus:border-brand-gold-550 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Detailed Description */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-450 uppercase">Detailed Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the sequence of events clearly..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3.5 text-xs text-slate-850 focus:border-brand-gold-550 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 resize-none"
              />
            </div>

            {/* Desired Action */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-450 uppercase">Desired Action / Remedy</label>
              <input
                type="text"
                name="desiredAction"
                value={formData.desiredAction}
                onChange={handleInputChange}
                placeholder="e.g. Refund purchase value of Rs. 45,000"
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3.5 text-xs text-slate-850 focus:border-brand-gold-550 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!formData.situation || !formData.involvedParty}
                className={`w-full flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                  formData.situation && formData.involvedParty
                    ? 'bg-brand-navy-950 text-white hover:bg-slate-850 dark:bg-brand-gold-550 dark:text-slate-950 dark:hover:bg-brand-gold-400 shadow-sm'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-650 cursor-not-allowed'
                }`}
              >
                <span>Generate Document Draft</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* Loading State */}
        {generating && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900/60 shadow-premium flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 text-brand-gold-550 animate-spin" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-855 dark:text-slate-200">
                Constructing Legal Draft
              </h4>
              <p className="text-[10px] text-slate-400 animate-pulse">
                Applying regulatory structures and jurisdiction parameters...
              </p>
            </div>
          </div>
        )}

        {/* Document Draft Preview Output */}
        {draft && !generating && (
          <div className="space-y-4 animate-in fade-in duration-300 pr-1 flex-1 flex flex-col">
            {/* Header toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
              <span className="rounded bg-brand-gold-550/10 px-2 py-0.5 text-[9px] font-bold text-brand-gold-550 dark:text-brand-gold-300">
                {formData.type} PREVIEW
              </span>
              <button
                onClick={() => setDraft(null)}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-450 hover:text-slate-750"
              >
                <RefreshCw className="h-3 w-3" />
                <span>START NEW</span>
              </button>
            </div>

            {/* Text Draft area */}
            <div className="relative flex-1 min-h-[300px] flex flex-col">
              <textarea
                readOnly={!isEditable}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className={`w-full flex-1 rounded-xl border p-4 text-[11px] font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-brand-gold-550/20 focus:border-brand-gold-550 ${
                  isEditable 
                    ? 'border-brand-gold-550 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100'
                    : 'border-slate-200 bg-slate-50/50 dark:border-slate-850 dark:bg-brand-navy-950/20 text-slate-600 dark:text-slate-350'
                }`}
              />
            </div>

            {/* Actions Bar */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditable(!isEditable)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all ${
                  isEditable
                    ? 'border-brand-gold-550 bg-brand-gold-550/10 text-brand-gold-550'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-brand-navy-900 dark:text-slate-200'
                }`}
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>{isEditable ? 'Finish Editing' : 'Edit Draft'}</span>
              </button>
              
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-brand-navy-900 dark:text-slate-200"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-brand-navy-900 dark:text-slate-200"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{downloaded ? 'Saved!' : 'Download'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {draft && !generating && (
        <div className="pt-4">
          <button
            onClick={handleDiscussInChat}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-brand-navy-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-850 dark:bg-brand-gold-550 dark:text-slate-950 dark:hover:bg-brand-gold-400 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Discuss Draft in Chat</span>
          </button>
        </div>
      )}

    </div>
  );
};
export default ComplaintGeneratorPanel;
