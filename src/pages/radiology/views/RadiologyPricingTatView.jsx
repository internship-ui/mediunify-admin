import React, { useState } from 'react';
import {
  DollarSign,
  Clock,
  Search,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ScanLine
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function RadiologyPricingTatView({
  catalogue = [],
  onOpenEditPricing,
  onToggleStatus
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const CATEGORIES = ['ALL', 'MRI', 'CT Scan', 'X-Ray', 'Ultrasound', 'Mammography', 'Other'];

  const filteredItems = catalogue.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.bodyPart?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-brand-navy-900 tracking-tight">
            Radiology Pricing & Turnaround Time (TAT) Matrix
          </h1>
          <p className="text-xs text-brand-slate-500">
            Configure base scan rates, contrast add-ons, emergency priority pricing and report delivery TAT commitments
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const count = cat === 'ALL' ? catalogue.length : catalogue.filter((c) => c.category === cat).length;
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

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search scan, modality, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 font-medium"
          />
        </div>
      </div>

      {/* Pricing Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-brand-slate-100/90 text-brand-slate-700 font-bold border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-3.5">Scan Code</th>
                <th className="py-3 px-3">Imaging Scan Name</th>
                <th className="py-3 px-3">Modality Category</th>
                <th className="py-3 px-3">Target Body Region</th>
                <th className="py-3 px-3 text-right">Base Price (₹)</th>
                <th className="py-3 px-3 text-right">Contrast Add-on (₹)</th>
                <th className="py-3 px-3 text-center">Guaranteed TAT</th>
                <th className="py-3 px-3 text-center">Catalogue Status</th>
                <th className="py-3 px-3.5 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-brand-slate-50 transition-colors">
                  
                  {/* Code */}
                  <td className="py-3 px-3.5 font-mono font-bold text-brand-navy-900">
                    {item.code}
                  </td>

                  {/* Name */}
                  <td className="py-3 px-3 font-semibold text-brand-navy-900 max-w-xs truncate">
                    {item.name}
                  </td>

                  {/* Modality */}
                  <td className="py-3 px-3">
                    <span className="font-bold text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                      {item.category}
                    </span>
                  </td>

                  {/* Body Part */}
                  <td className="py-3 px-3 text-brand-slate-600 font-medium">
                    {item.bodyPart}
                  </td>

                  {/* Base Price */}
                  <td className="py-3 px-3 text-right font-extrabold text-brand-navy-900 text-sm">
                    ₹{item.suggestedPrice?.toLocaleString()}
                  </td>

                  {/* Contrast */}
                  <td className="py-3 px-3 text-right font-semibold text-purple-800">
                    {item.contrastAddon > 0 ? `+₹${item.contrastAddon.toLocaleString()}` : '—'}
                  </td>

                  {/* TAT */}
                  <td className="py-3 px-3 text-center font-bold text-brand-slate-700">
                    <span className="inline-flex items-center gap-1 bg-brand-slate-50 px-2 py-0.5 rounded-md border border-brand-slate-200">
                      <Clock className="w-3 h-3 text-brand-teal-600" />
                      {item.tat}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center">
                    <StatusBadge status={item.status} size="xs" />
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3.5 text-center">
                    <button
                      onClick={() => onOpenEditPricing(item)}
                      className="p-1.5 text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100 rounded-lg border border-brand-slate-200 transition-colors"
                      title="Edit Price & TAT"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
