import React, { useState, useEffect, useMemo } from 'react';
import { Search, ArrowRight, X, Sparkles, Filter } from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import { useAuth } from '../../context/AuthContext';
import { getPortalSearchIndex } from '../../utils/portalSearchEngine';

export default function CommandPalette({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { currentService, setActiveModule } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveCategory('All');
    }
  }, [isOpen]);

  // 1. Build the full searchable index strictly for currentService
  const allSearchableItems = useMemo(() => {
    if (!isOpen || !currentService) return [];
    return getPortalSearchIndex(currentService, setActiveModule, onNavigate, onClose);
  }, [isOpen, currentService, setActiveModule, onNavigate, onClose]);

  // 2. Filter items based on query & category
  const filteredItems = useMemo(() => {
    const cleanQ = query.trim().toLowerCase();
    return allSearchableItems.filter((item) => {
      const matchCategory = activeCategory === 'All' || item.category === activeCategory;
      if (!matchCategory) return false;

      if (!cleanQ) return true;

      const titleMatch = item.title?.toLowerCase().includes(cleanQ);
      const subtitleMatch = item.subtitle?.toLowerCase().includes(cleanQ);
      const keywordsMatch = item.keywords?.toLowerCase().includes(cleanQ);
      const badgeMatch = item.badge?.toLowerCase().includes(cleanQ);

      return titleMatch || subtitleMatch || keywordsMatch || badgeMatch;
    });
  }, [allSearchableItems, query, activeCategory]);

  // 3. Extract available categories and counts
  const categories = useMemo(() => {
    const catMap = { All: allSearchableItems.length };
    allSearchableItems.forEach((item) => {
      const cat = item.category || 'General';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    return Object.entries(catMap).map(([name, count]) => ({ name, count }));
  }, [allSearchableItems]);

  if (!isOpen || !currentService) return null;

  // Helper to highlight matching text
  const highlightText = (text, highlight) => {
    if (!highlight || !highlight.trim()) return text;
    const parts = String(text).split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="bg-amber-100 text-amber-900 font-bold px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 sm:px-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-navy-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-brand-slate-200 shadow-2xl overflow-hidden z-10 animate-slide-up flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-brand-slate-100 bg-white">
          <Search className="w-5 h-5 text-brand-teal-600 mr-3 shrink-0" />
          <input
            type="text"
            placeholder={`Search ${currentService.name} patients, staff, services, records or modules...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base text-brand-navy-900 placeholder:text-brand-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-brand-slate-400 hover:text-brand-slate-600 p-1 mr-1 text-xs"
              title="Clear search"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-brand-slate-400 hover:text-brand-slate-600 p-1 rounded-lg hover:bg-brand-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 2 && (
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-brand-slate-100 bg-brand-slate-50/70 overflow-x-auto scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-brand-slate-400 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                  activeCategory === cat.name
                    ? 'bg-brand-navy-900 text-white shadow-xs'
                    : 'bg-white text-brand-slate-600 hover:bg-brand-slate-200/60 border border-brand-slate-200'
                }`}
              >
                {cat.name}
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeCategory === cat.name ? 'bg-white/20 text-white' : 'bg-brand-slate-100 text-brand-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-brand-slate-100/80">
          {filteredItems.length === 0 ? (
            <div className="py-14 text-center px-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-slate-100 text-brand-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-brand-navy-900">
                No matching results in {currentService.name}
              </p>
              <p className="text-xs text-brand-slate-400 mt-1 max-w-sm mx-auto">
                We couldn&apos;t find anything matching &quot;{query}&quot; in {currentService.name}. Try searching by patient name, staff, service name, or ID.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-start sm:items-center justify-between p-3 rounded-xl hover:bg-brand-teal-50/70 text-left transition-colors group gap-3"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-brand-slate-100 group-hover:bg-brand-teal-100 text-brand-slate-700 group-hover:text-brand-teal-700 transition-colors shrink-0 mt-0.5 sm:mt-0">
                    <DynamicIcon name={item.iconName} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-brand-navy-900 group-hover:text-brand-teal-900 truncate">
                        {highlightText(item.title, query)}
                      </p>
                      <span className="text-[10px] font-bold text-brand-slate-400 uppercase tracking-wider hidden sm:inline">
                        • {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-brand-slate-500 mt-0.5 line-clamp-1 leading-relaxed">
                      {highlightText(item.subtitle, query)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-center">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${item.badgeColor || 'bg-brand-slate-100 text-brand-slate-600'}`}>
                    {item.badge}
                  </span>
                  <ArrowRight className="w-4 h-4 text-brand-slate-300 group-hover:text-brand-teal-600 transition-colors hidden sm:block" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-brand-slate-50 border-t border-brand-slate-100 flex items-center justify-between text-[11px] text-brand-slate-500">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-brand-teal-700">
              <Sparkles className="w-3.5 h-3.5 text-brand-teal-600" />
              {filteredItems.length} {currentService.name} results
            </span>
            <span className="hidden sm:inline text-brand-slate-300">|</span>
            <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 bg-white border border-brand-slate-200 rounded font-mono text-[10px]">ESC</kbd> to exit</span>
          </div>
          <span className="font-semibold text-brand-navy-900">{currentService.fullName || currentService.name}</span>
        </div>
      </div>
    </div>
  );
}

