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
            Diagnostic Scan Catalogue Master
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
            className="p-5 bg-white rounded-2xl border border-brand-slate-200/90 shadow-2xs hover:shadow-md hover:border-brand-teal-300 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Header: Modality + Code on left, Star + Status on right */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-200 uppercase tracking-wider">
                    {scan.category}
                  </span>
                  <span className="text-[11px] font-mono text-brand-slate-400 font-semibold">
                    {scan.code}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onTogglePopularScan?.(scan.id)}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      scan.isPopular
                        ? 'text-amber-500 hover:text-amber-600'
                        : 'text-brand-slate-300 hover:text-amber-400'
                    }`}
                    title={scan.isPopular ? "Featured Popular Scan" : "Mark as Popular Scan"}
                  >
                    <Star className={`w-4 h-4 ${scan.isPopular ? 'fill-amber-400' : ''}`} />
                  </button>
                  <StatusBadge status={scan.status} size="xs" />
                </div>
              </div>

              {/* Title & Anatomical Target */}
              <h3 className="text-sm font-extrabold text-brand-navy-900 group-hover:text-brand-teal-800 transition-colors mt-2.5 leading-snug">
                {scan.name}
              </h3>
              <p className="text-xs text-brand-slate-500 font-medium mt-1">
                {scan.bodyPart}
              </p>

              {/* Specs & Preparation Strip */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 pt-3 mt-3 border-t border-brand-slate-100 text-[11px] text-brand-slate-600">
                <div className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-brand-slate-400" />
                  <span>{scan.approximateDuration}</span>
                </div>
                <span className="text-brand-slate-300">•</span>
                <div className="flex items-center gap-1">
                  <span className="text-brand-slate-400">TAT:</span>
                  <span className="font-semibold text-brand-slate-700">{scan.tat}</span>
                </div>
                {(scan.fastingRequired || scan.contrastRequired) && (
                  <>
                    <span className="text-brand-slate-300">•</span>
                    <div className="flex items-center gap-1">
                      {scan.fastingRequired && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                          Fasting
                        </span>
                      )}
                      {scan.contrastRequired && (
                        <span
                          className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold"
                          title={`Contrast Add-on +₹${scan.contrastAddon}`}
                        >
                          Contrast {scan.contrastAddon ? `(+₹${scan.contrastAddon})` : ''}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Pricing & Actions */}
            <div className="pt-3.5 mt-3.5 border-t border-brand-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-slate-400 block tracking-wider">
                  Price
                </span>
                <span className="text-base font-extrabold text-brand-navy-900 tracking-tight">
                  ₹{Number(scan.suggestedPrice || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onToggleScanStatus(scan.id)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    scan.status === 'Active'
                      ? 'bg-white hover:bg-brand-slate-50 text-brand-slate-600 border-brand-slate-200'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {scan.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={() => onOpenEditScan(scan)}
                  className="p-1.5 text-brand-slate-600 hover:text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg border border-brand-slate-200 transition-colors cursor-pointer"
                  title="Edit Scan"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
