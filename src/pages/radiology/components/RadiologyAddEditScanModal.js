import React, { useState, useEffect } from 'react';
import {
  X,
  ScanLine,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function RadiologyAddEditScanModal({
  isOpen,
  onClose,
  scan,
  onSaveScan
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'MRI',
    bodyPart: '',
    description: '',
    preparationInstructions: '',
    fastingRequired: false,
    contrastRequired: false,
    isPopular: false,
    approximateDuration: '25 min',
    tat: '4 - 6 Hours',
    suggestedPrice: 4500,
    contrastAddon: 1500,
    status: 'Active'
  });

  useEffect(() => {
    if (scan) {
      setFormData({
        ...scan,
        isPopular: Boolean(scan.isPopular)
      });
    } else {
      setFormData({
        name: '',
        code: `RAD-SCAN-${Math.floor(10 + Math.random() * 90)}`,
        category: 'MRI',
        bodyPart: '',
        description: '',
        preparationInstructions: 'Remove all metallic accessories before entering imaging suite.',
        fastingRequired: false,
        contrastRequired: false,
        isPopular: false,
        approximateDuration: '25 min',
        tat: '4 - 6 Hours',
        suggestedPrice: 4500,
        contrastAddon: 1500,
        status: 'Active'
      });
    }
  }, [scan, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      addToast('Please provide Scan Name and Code.', 'warning');
      return;
    }

    onSaveScan({
      ...formData,
      suggestedPrice: Number(formData.suggestedPrice),
      contrastAddon: Number(formData.contrastAddon || 0),
      isPopular: Boolean(formData.isPopular)
    });

    addToast(`Scan ${formData.name} saved successfully.`, 'success');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in-50 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-100 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-teal-50 text-brand-teal-700 rounded-lg border border-brand-teal-200">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">
                {scan ? 'Edit Imaging Scan Master' : 'Add New Imaging Scan to Catalogue'}
              </h3>
              <p className="text-xs text-brand-slate-500">Configure modality parameters, preparation protocol and pricing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 rounded-lg hover:bg-brand-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Scan Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. MRI Brain (Plain & Contrast)"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Scan Code:</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. MRI-BRAIN-01"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Modality Category:</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
              >
                <option value="MRI">MRI (Magnetic Resonance Imaging)</option>
                <option value="CT Scan">CT Scan (Computed Tomography)</option>
                <option value="X-Ray">X-Ray (Digital Radiography)</option>
                <option value="Ultrasound">Ultrasound / Sonography</option>
                <option value="Mammography">Mammography / Breast Tomosynthesis</option>
                <option value="Other">Other (DEXA / BMD / Special)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Target Body Part:</label>
              <input
                type="text"
                value={formData.bodyPart}
                onChange={(e) => setFormData({ ...formData, bodyPart: e.target.value })}
                placeholder="e.g. Brain, Lumbar Spine, Knee, Chest"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Clinical Description:</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Clinical indication and diagnostic objective..."
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Preparation Instructions for Patient:</label>
            <textarea
              rows={2}
              value={formData.preparationInstructions}
              onChange={(e) => setFormData({ ...formData, preparationInstructions: e.target.value })}
              placeholder="Fasting requirements, metallic screening, clothing advice..."
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
            />
          </div>

          {/* Checkboxes for Fasting, Contrast & Popular Scan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200">
            <label className="flex items-center gap-2 font-bold text-brand-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.fastingRequired}
                onChange={(e) => setFormData({ ...formData, fastingRequired: e.target.checked })}
                className="rounded text-brand-teal-600 cursor-pointer"
              />
              <span>Fasting (4 - 6 Hours)</span>
            </label>

            <label className="flex items-center gap-2 font-bold text-brand-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.contrastRequired}
                onChange={(e) => setFormData({ ...formData, contrastRequired: e.target.checked })}
                className="rounded text-brand-teal-600 cursor-pointer"
              />
              <span>IV / Oral Contrast</span>
            </label>

            <label className="flex items-center gap-2 font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <span>⭐ Popular Scan</span>
            </label>
          </div>

          {/* Duration, TAT, Pricing */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Scan Duration:</label>
              <input
                type="text"
                value={formData.approximateDuration}
                onChange={(e) => setFormData({ ...formData, approximateDuration: e.target.value })}
                placeholder="25 min"
                className="w-full p-2 rounded-xl border border-brand-slate-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Turnaround (TAT):</label>
              <input
                type="text"
                value={formData.tat}
                onChange={(e) => setFormData({ ...formData, tat: e.target.value })}
                placeholder="4 - 6 Hours"
                className="w-full p-2 rounded-xl border border-brand-slate-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Base Price (₹):</label>
              <input
                type="number"
                value={formData.suggestedPrice}
                onChange={(e) => setFormData({ ...formData, suggestedPrice: e.target.value })}
                className="w-full p-2 rounded-xl border border-brand-slate-200 text-xs font-bold text-brand-teal-800"
                required
              />
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Contrast Addon (₹):</label>
              <input
                type="number"
                value={formData.contrastAddon}
                onChange={(e) => setFormData({ ...formData, contrastAddon: e.target.value })}
                className="w-full p-2 rounded-xl border border-brand-slate-200 text-xs font-bold"
              />
            </div>
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
              <CheckCircle2 className="w-4 h-4" />
              {scan ? 'Update Scan Master' : 'Add Scan to Catalogue'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
