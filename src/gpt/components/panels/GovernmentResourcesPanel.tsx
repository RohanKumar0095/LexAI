import React, { useState } from 'react';
import { ExternalLink, Search, CheckCircle2, ShieldAlert } from 'lucide-react';
import { mockResources, mockResourceCategories } from '../../data/mockResources';

export const GovernmentResourcesPanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockResources.filter(res => {
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.authority.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col space-y-4">
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          Government Resources
        </span>
        <h3 className="text-sm font-bold text-slate-909 dark:text-white mt-1">
          Official Government Portals Directory
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Access verified public channels directly to lodge formal complaints, applications, or checks.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-450" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search government resources..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-gold-550 focus:outline-none focus:ring-1 focus:ring-brand-gold-550/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      {/* Category Pills Slider */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none shrink-0">
        {mockResourceCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-brand-gold-550 text-slate-950 shadow-sm'
                : 'bg-white border border-slate-200 text-slate-650 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resources Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-450">
            No official resources match your search or filter.
          </div>
        ) : (
          filtered.map((res) => (
            <div 
              key={res.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-extrabold text-brand-gold-550 dark:text-brand-gold-300">
                  <span>{res.category.toUpperCase()}</span>
                  <span className="flex items-center gap-0.5 text-slate-400">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    Verified Link
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">
                  {res.name}
                </h4>

                <p className="text-[11px] leading-relaxed text-slate-550 dark:text-slate-400">
                  {res.purpose}
                </p>

                <div className="text-[10px] text-slate-450 italic pt-1">
                  Authority: {res.authority}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[9px] text-amber-600 dark:text-amber-500 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3 shrink-0" />
                  External Portal
                </span>
                
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-950 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-slate-850 dark:bg-brand-gold-550 dark:text-slate-950 dark:hover:bg-brand-gold-400 transition-colors"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
export default GovernmentResourcesPanel;
