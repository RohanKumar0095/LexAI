import React, { useState } from 'react';
import { 
  Shield, Car, ShoppingBag, Laptop, Briefcase, HeartHandshake, 
  Home, Users, BookOpen, CreditCard, DollarSign, Key, Leaf,
  Layers, ArrowLeft, Star, MessageSquare 
} from 'lucide-react';
import type { LawCategory, MockArticle } from '../../types/legal';

interface LawCategoriesPanelProps {
  categories: LawCategory[];
  onAskLex: (prompt: string) => void;
  savedArticleIds: string[];
  onToggleBookmarkArticle: (articleId: string) => void;
}

export const LawCategoriesPanel: React.FC<LawCategoriesPanelProps> = ({
  categories,
  onAskLex,
  savedArticleIds,
  onToggleBookmarkArticle
}) => {
  const [selectedCategory, setSelectedCategory] = useState<LawCategory | null>(null);

  const iconMap: Record<string, any> = {
    Shield,
    Car,
    ShoppingBag,
    Laptop,
    Briefcase,
    HeartHandshake,
    Home,
    Users,
    BookOpen,
    CreditCard,
    DollarSign,
    Key,
    Leaf
  };

  const handleSelectCategory = (cat: LawCategory) => {
    setSelectedCategory(cat);
  };

  const handleAskAboutArticle = (art: MockArticle) => {
    onAskLex(`Regarding ${art.section} - "${art.title}": can you explain this law in detail and give examples of its application in India?`);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      
      {!selectedCategory ? (
        // Category Grid View
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Law Categorization
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              Explore Indian Laws by Category
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Select a domain to read mock statutory breakdowns and legal guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {categories.map((cat) => {
              const IconComp = iconMap[cat.icon] || BookOpen;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className="group w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-850 hover:shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold-550/10 text-brand-gold-550 group-hover:bg-brand-gold-550 group-hover:text-slate-950 transition-colors">
                      <IconComp className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 group-hover:text-brand-gold-550 dark:group-hover:text-brand-gold-300 transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between w-full border-t border-slate-100 dark:border-slate-800 pt-2 text-[10px] font-semibold text-slate-400">
                    <span>{cat.articleCount} Mock Sections</span>
                    <span className="text-brand-gold-550 dark:text-brand-gold-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read List →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        // Category Reading List Details
        <div className="space-y-4 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <button 
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-1 text-[10px] font-bold text-slate-450 hover:text-slate-650"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>ALL CATEGORIES</span>
            </button>
            <span className="text-[10px] font-bold uppercase text-brand-gold-550 dark:text-brand-gold-300">
              {selectedCategory.name} reading list
            </span>
          </div>

          <div className="pt-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {selectedCategory.name}
            </h3>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-1">
              {selectedCategory.description}
            </p>
          </div>

          {/* Reading Articles list */}
          <div className="flex-1 overflow-y-auto space-y-4.5 pt-3 pr-1">
            {selectedCategory.articles && selectedCategory.articles.length > 0 ? (
              selectedCategory.articles.map((art) => {
                const isBookmarked = savedArticleIds.includes(art.id);
                return (
                  <div 
                    key={art.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm space-y-2 relative"
                  >
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="rounded bg-brand-gold-550/10 px-2 py-0.5 text-[9px] font-bold text-brand-gold-550 dark:text-brand-gold-300">
                        {art.section}
                      </span>
                      
                      {/* Bookmark button */}
                      <button
                        onClick={() => onToggleBookmarkArticle(art.id)}
                        className={`text-slate-450 hover:text-slate-750 dark:hover:text-slate-200 transition-colors ${
                          isBookmarked ? 'text-brand-gold-550 dark:text-brand-gold-300' : ''
                        }`}
                        title={isBookmarked ? 'Remove Bookmark' : 'Save Article'}
                      >
                        <Star className={`h-4 w-4 ${isBookmarked ? 'fill-brand-gold-550/20' : ''}`} />
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">
                      {art.title}
                    </h4>

                    <p className="text-[11px] leading-relaxed text-slate-550 dark:text-slate-400">
                      {art.description}
                    </p>

                    {/* Quick Ask tool */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleAskAboutArticle(art)}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-950 px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-slate-850 dark:bg-brand-gold-550 dark:text-slate-950 dark:hover:bg-brand-gold-400 transition-colors"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>Explain with LexAI</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-xs text-slate-450 space-y-2">
                <Layers className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto" />
                <p>No mock articles compiled for this category yet.</p>
                <button
                  onClick={() => onAskLex(`Can you tell me about key provisions under the category: "${selectedCategory.name}"?`)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-755 dark:border-slate-800 dark:bg-slate-900"
                >
                  Ask LexAI to Research
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
export default LawCategoriesPanel;
