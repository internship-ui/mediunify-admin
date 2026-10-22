import React, { useState, useEffect } from 'react';
import {
  X,
  Boxes,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react';
import { MASTER_TESTS } from '../../../data/labData';
import { useToast } from '../../../context/ToastContext';

export default function AddEditPackageModal({
  isOpen,
  onClose,
  packageData,
  onSavePackage,
  packageType = 'popular', // 'popular' | 'curated'
  allTests = MASTER_TESTS
}) {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: packageType === 'popular' ? 'Executive Health Checkup' : 'Lifestyle & Wellness',
    description: '',
    suggestedPrice: '',
    originalPrice: '',
    clinicalNotes: '',
    prepSummary: 'Strict overnight fasting of 8 - 10 hours.',
    tat: 'Same Day (8 - 12 Hours)',
    status: 'Active',
    testCodes: ['HEM-CBC-01', 'BIO-GLU-01', 'BIO-LIP-04']
  });

  useEffect(() => {
    if (packageData) {
      setFormData({
        ...packageData,
        suggestedPrice: packageData.suggestedPrice || '',
        originalPrice: packageData.originalPrice || '',
        testCodes: packageData.testCodes || []
      });
    } else {
      setFormData({
        name: '',
        code: packageType === 'popular' ? `POP-${Math.floor(100 + Math.random() * 900)}` : `CUR-${Math.floor(100 + Math.random() * 900)}`,
        category: packageType === 'popular' ? 'Executive Health Checkup' : 'Lifestyle & Wellness',
        description: '',
        suggestedPrice: '',
        originalPrice: '',
        clinicalNotes: '',
        prepSummary: 'Strict overnight fasting of 8 - 10 hours.',
        tat: 'Same Day (8 - 12 Hours)',
        status: 'Active',
        testCodes: ['HEM-CBC-01', 'BIO-GLU-01', 'BIO-LIP-04']
      });
    }
  }, [packageData, packageType, isOpen]);

  if (!isOpen) return null;

  const handleToggleTest = (code) => {
    setFormData((prev) => {
      const exists = prev.testCodes.includes(code);
      const updated = exists
        ? prev.testCodes.filter((c) => c !== code)
        : [...prev.testCodes, code];
      return { ...prev, testCodes: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.suggestedPrice) {
      addToast('Please enter Package Name and Suggested Mysuru Price', 'warning');
      return;
    }
    if (formData.testCodes.length === 0) {
      addToast('Please select at least one diagnostic test for this package', 'warning');
      return;
    }

    const payload = {
      ...formData,
      id: packageData?.id || `PKG-${Date.now().toString().slice(-4)}`,
      suggestedPrice: Number(formData.suggestedPrice),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Math.round(Number(formData.suggestedPrice) * 1.8),
      includedPackagesCount: formData.testCodes.length,
      includedParametersCount: formData.testCodes.length * 8
    };

    onSavePackage(payload, packageType);
    addToast(
      packageData ? `Updated checkup package: ${formData.name}` : `Created checkup package: ${formData.name}`,
      'success'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-brand-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-teal-50 text-brand-teal-700 rounded-lg border border-brand-teal-200">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy-900">
                {packageData ? 'Edit Checkup Package' : `Add New ${packageType === 'popular' ? 'Popular' : 'Curated'} Checkup Package`}
              </h3>
              <p className="text-xs text-brand-slate-500">
                Configure package name, bundled tests, Mysuru price, and clinical notes
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-brand-slate-700 mb-1">Package Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., MediUnify Executive Essentials"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Package Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., POP-EXE-01"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-mono uppercase"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Category *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Executive Health Checkup"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Suggested Mysuru Price (₹) *</label>
              <input
                type="number"
                value={formData.suggestedPrice}
                onChange={(e) => setFormData({ ...formData, suggestedPrice: e.target.value })}
                placeholder="e.g., 2499"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-bold text-brand-navy-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Original Rack Price (₹)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="e.g., 5200"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-slate-700 mb-1">Package Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of package scope and target demographic..."
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Patient Preparation Guidance</label>
              <input
                type="text"
                value={formData.prepSummary}
                onChange={(e) => setFormData({ ...formData, prepSummary: e.target.value })}
                placeholder="e.g., 10-12 hours strict fasting. Water allowed."
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Turnaround Time (TAT)</label>
              <input
                type="text"
                value={formData.tat}
                onChange={(e) => setFormData({ ...formData, tat: e.target.value })}
                placeholder="e.g., Same Day (8 - 12 Hours)"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-slate-700 mb-1">Clinical / Pricing Note</label>
            <textarea
              rows={2}
              value={formData.clinicalNotes}
              onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
              placeholder="Clinical significance and package bundling rationale..."
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
            />
          </div>

          {/* Test Selector from Catalogue */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-brand-slate-800 text-xs">
                Select Included Diagnostic Tests ({formData.testCodes.length} Selected)
              </label>
              <span className="text-[11px] text-brand-teal-700 font-medium">
                Click any test to toggle inclusion
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-2 bg-brand-slate-50 rounded-xl border border-brand-slate-200">
              {allTests.map((t) => {
                const isSelected = formData.testCodes.includes(t.code);
                return (
                  <div
                    key={t.id}
                    onClick={() => handleToggleTest(t.code)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-teal-50 border-brand-teal-300 text-brand-teal-900 shadow-2xs'
                        : 'bg-white border-brand-slate-200 text-brand-slate-700 hover:border-brand-slate-300'
                    }`}
                  >
                    <div className="overflow-hidden pr-2">
                      <p className="font-bold text-xs truncate">{t.name}</p>
                      <p className="text-[11px] text-brand-slate-400 font-mono">
                        {t.code} • ₹{t.price}
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isSelected
                          ? 'bg-brand-teal-600 border-brand-teal-600 text-white'
                          : 'border-brand-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-brand-slate-200 flex items-center justify-end gap-2.5">
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
              {packageData ? 'Save Changes' : 'Create Checkup Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
