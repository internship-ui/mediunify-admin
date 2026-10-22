import React, { useState, useEffect } from 'react';
import {
  X,
  DollarSign,
  Clock,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function EditPricingTatModal({
  isOpen,
  onClose,
  item,
  itemType = 'test', // 'test' | 'package'
  onSave
}) {
  const { addToast } = useToast();

  const [price, setPrice] = useState('');
  const [tat, setTat] = useState('');
  const [cptCode, setCptCode] = useState('');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (item) {
      setPrice(item.suggestedPrice || item.price || '');
      setTat(item.tat || '');
      setCptCode(item.cptCode || '');
      setStatus(item.status || 'Active');
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!price) {
      addToast('Please specify a valid Mysuru price', 'warning');
      return;
    }

    onSave(item.id || item.code, {
      ...item,
      price: Number(price),
      suggestedPrice: Number(price),
      tat: tat || item.tat,
      cptCode: cptCode || item.cptCode || '—',
      status
    });

    addToast(`Updated commercial terms for: ${item.name}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy-900">
                Edit Pricing & TAT Terms
              </h3>
              <p className="text-xs text-brand-slate-500 font-mono">
                {item.code} ({itemType === 'test' ? 'Individual Test' : 'Checkup Package'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200">
            <p className="text-brand-slate-500 font-medium">Test / Package Name:</p>
            <p className="font-bold text-brand-navy-900 text-sm mt-0.5">{item.name}</p>
            <p className="text-brand-teal-700 font-mono text-[11px] mt-0.5 font-semibold">
              Category: {item.category}
            </p>
          </div>

          <div>
            <label className="block font-bold text-brand-slate-700 mb-1">
              Suggested Mysuru Price (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-brand-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-extrabold text-brand-navy-900 text-sm"
                required
              />
            </div>
          </div>

          {itemType === 'test' && (
            <>
              <div>
                <label className="block font-bold text-brand-slate-700 mb-1">
                  Turnaround Time (TAT) *
                </label>
                <input
                  type="text"
                  value={tat}
                  onChange={(e) => setTat(e.target.value)}
                  placeholder="e.g. 2 - 4 Hours"
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-brand-slate-700 mb-1">
                  Approx. CPT Reference Code
                </label>
                <input
                  type="text"
                  value={cptCode}
                  onChange={(e) => setCptCode(e.target.value)}
                  placeholder="e.g. 85025"
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-mono"
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-bold text-brand-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-bold text-brand-teal-700"
            >
              <option value="Active">Active (Live in Booking Engine)</option>
              <option value="Inactive">Inactive (Disabled / Delisted)</option>
            </select>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-brand-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-brand-slate-100 text-brand-slate-700 text-xs font-semibold rounded-xl border border-brand-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Update Commercial Terms
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
