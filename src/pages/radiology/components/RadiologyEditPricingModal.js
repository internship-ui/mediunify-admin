import React, { useState, useEffect } from 'react';
import {
  X,
  DollarSign,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function RadiologyEditPricingModal({
  isOpen,
  onClose,
  scan,
  onSavePricing
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);

  const [price, setPrice] = useState(scan?.suggestedPrice || 4500);
  const [contrastAddon, setContrastAddon] = useState(scan?.contrastAddon || 0);
  const [tat, setTat] = useState(scan?.tat || '4 - 6 Hours');
  const [status, setStatus] = useState(scan?.status || 'Active');

  useEffect(() => {
    if (scan) {
      setPrice(scan.suggestedPrice || 0);
      setContrastAddon(scan.contrastAddon || 0);
      setTat(scan.tat || '4 - 6 Hours');
      setStatus(scan.status || 'Active');
    }
  }, [scan, isOpen]);

  if (!isOpen || !scan) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSavePricing(scan.id, {
      ...scan,
      suggestedPrice: Number(price),
      contrastAddon: Number(contrastAddon),
      tat,
      status
    });
    addToast(`Pricing & TAT for ${scan.name} updated successfully.`, 'success');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-100 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-teal-50 text-brand-teal-700 rounded-lg border border-brand-teal-200">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">Edit Scan Pricing & TAT</h3>
              <p className="text-xs text-brand-slate-500 font-mono">{scan.code}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 rounded-lg hover:bg-brand-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200">
            <p className="font-bold text-brand-navy-900 text-sm">{scan.name}</p>
            <p className="text-[11px] text-brand-slate-500">{scan.category} • {scan.bodyPart}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Base Price (₹):</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-bold text-brand-teal-800"
                required
              />
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Contrast Addon (₹):</label>
              <input
                type="number"
                value={contrastAddon}
                onChange={(e) => setContrastAddon(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Reporting Turnaround Time (TAT):</label>
            <input
              type="text"
              value={tat}
              onChange={(e) => setTat(e.target.value)}
              placeholder="e.g. 2 - 4 Hours"
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
              required
            />
          </div>

          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Catalogue Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-bold"
            >
              <option value="Active">Active (Bookable)</option>
              <option value="Inactive">Inactive (Disabled)</option>
            </select>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-brand-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-brand-slate-600 font-semibold rounded-xl border border-brand-slate-200 hover:bg-brand-slate-100 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Pricing & TAT
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
