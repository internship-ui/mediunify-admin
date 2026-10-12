import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  ScanLine,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  Star
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function RadiologyCatalogueView({
  catalogue = [],
  onOpenAddScan,
  onOpenEditScan,
  onToggleScanStatus,
  onTogglePopularScan
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const CATEGORIES = ['ALL', '⭐ Popular Scans', 'MRI', 'CT Scan', 'X-Ray', 'Ultrasound', 'Mammography', 'Other'];

  const filteredScans = useMemo(() => {
    return catalogue.filter((item) => {
      if (selectedCategory === '⭐ Popular Scans') {
        if (!item.isPopular) return false;
      } else if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        const matchPart = item.bodyPart?.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchPart) return false;
      }
      return true;
    });
  }, [catalogue, selectedCategory, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-brand-navy-900 tracking-tight">
            Diagnostic Imaging Scan Catalogue Master
          </h1>
          <p className="text-xs text-brand-slate-500">
            Configure MRI, CT, High-Frequency X-Ray, Sonography and Mammography scan specifications & clinical preparation
          </p>
        </div>

        <button
          onClick={onOpenAddScan}
          className="px-4 py-2 bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Scan
        </button>
      </div>

      {/* Categories & Search Filter */}
      <div className="p-4 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const count = cat === 'ALL'
                ? catalogue.length
                : cat === '⭐ Popular Scans'
                ? catalogue.filter((c) => c.isPopular).length
                : catalogue.filter((c) => c.category === cat).length;
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-brand-teal-600 text-white shadow-xs'
                      : 'bg-brand-slate-50 text-brand-slate-600 hover:bg-brand-slate-100'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-brand-slate-200 text-brand-slate-700'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search scan name, code, body part..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Scans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScans.map((scan) => (
          <div
            key={scan.id}
            className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              
              {/* Scan Top Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-200">
                      {scan.code}
                    </span>
                    {scan.isPopular && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                        ⭐ Popular
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-brand-navy-900 mt-1.5 leading-snug group-hover:text-brand-teal-800 transition-colors">
                    {scan.name}
                  </h3>
                </div>

                <StatusBadge status={scan.status} size="xs" />
              </div>

              {/* Modality & Target Part */}
              <div className="flex items-center gap-2 text-[11px] text-brand-slate-500">
                <span className="font-bold text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                  {scan.category}
                </span>
                <span>• Target: <strong>{scan.bodyPart}</strong></span>
              </div>

              {/* Description */}
              <p className="text-xs text-brand-slate-600 line-clamp-2 leading-relaxed">
                {scan.description}
              </p>

              {/* Badges for Fasting and Contrast */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                {scan.fastingRequired && (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded border border-amber-200">
                    Fasting Required (4 - 6h)
                  </span>
                )}
                {scan.contrastRequired && (
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-800 rounded border border-purple-200">
                    Contrast +₹{scan.contrastAddon}
                  </span>
                )}
                <span className="px-2 py-0.5 bg-brand-slate-100 text-brand-slate-700 rounded">
                  Duration: {scan.approximateDuration}
                </span>
              </div>
            </div>

            {/* Bottom Pricing & Actions */}
            <div className="pt-4 mt-4 border-t border-brand-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-brand-slate-400 block font-medium">Standard Price / TAT</span>
                <div className="flex items-center gap-1.5">
                  <strong className="text-base font-extrabold text-brand-navy-900">₹{scan.suggestedPrice}</strong>
                  <span className="text-[11px] text-brand-slate-500">({scan.tat})</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onTogglePopularScan?.(scan.id)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    scan.isPopular
                      ? 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200'
                      : 'text-brand-slate-400 border-brand-slate-200 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                  title={scan.isPopular ? "Remove from Popular Scans" : "Mark as Popular Scan"}
                >
                  <Star className={`w-3.5 h-3.5 ${scan.isPopular ? 'fill-amber-500 text-amber-500' : ''}`} />
                </button>

                <button
                  onClick={() => onToggleScanStatus(scan.id)}
                  className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg border transition-colors ${
                    scan.status === 'Active'
                      ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {scan.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={() => onOpenEditScan(scan)}
                  className="p-1.5 text-brand-slate-500 hover:text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg border border-brand-slate-200 transition-colors"
                  title="Edit Scan"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
