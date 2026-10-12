import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  TestTube2,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { LAB_CATEGORIES } from '../../../data/labData';
import { useToast } from '../../../context/ToastContext';

export default function AddEditTestModal({
  isOpen,
  onClose,
  test,
  onSaveTest
}) {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Clinical Biochemistry',
    panelType: 'Automated Quantitative Assay',
    sampleRequired: 'Serum',
    tubeContainer: 'Clot Activator Vacutainer (Red / Gold Top - 4ml)',
    preparation: 'Overnight fasting of 8 - 10 hours required. Water allowed.',
    tat: '4 - 6 Hours',
    price: '',
    cptCode: '',
    clinicalNotes: '',
    status: 'Active',
    parameters: [
      { name: '', unit: '', normalRange: '', defaultVal: '' }
    ]
  });

  useEffect(() => {
    if (test) {
      setFormData({
        ...test,
        price: test.price || '',
        cptCode: test.cptCode || '',
        parameters: test.parameters?.length ? test.parameters : [{ name: '', unit: '', normalRange: '', defaultVal: '' }]
      });
    } else {
      setFormData({
        name: '',
        code: `TST-${Math.floor(100 + Math.random() * 900)}`,
        category: 'Clinical Biochemistry',
        panelType: 'Automated Quantitative Assay',
        sampleRequired: 'Serum',
        tubeContainer: 'Clot Activator Vacutainer (Red / Gold Top - 4ml)',
        preparation: 'Overnight fasting of 8 - 10 hours required. Water allowed.',
        tat: '4 - 6 Hours',
        price: '',
        cptCode: '',
        clinicalNotes: '',
        status: 'Active',
        parameters: [
          { name: 'Analyte 1', unit: 'mg/dL', normalRange: 'Normal biological range', defaultVal: '10.0' }
        ]
      });
    }
  }, [test, isOpen]);

  if (!isOpen) return null;

  const handleParamChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.parameters];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, parameters: updated };
    });
  };

  const handleAddParam = () => {
    setFormData((prev) => ({
      ...prev,
      parameters: [...prev.parameters, { name: '', unit: '', normalRange: '', defaultVal: '' }]
    }));
  };

  const handleRemoveParam = (index) => {
    setFormData((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      addToast('Please provide Test Name and Suggested Mysuru Price', 'warning');
      return;
    }

    const testPayload = {
      ...formData,
      id: test?.id || `TST-${Date.now().toString().slice(-4)}`,
      price: Number(formData.price),
      cptCode: formData.cptCode ? String(formData.cptCode) : '—',
      parameters: formData.parameters.filter((p) => p.name.trim())
    };

    onSaveTest(testPayload);
    addToast(
      test ? `Updated diagnostic test: ${formData.name}` : `Added new test: ${formData.name}`,
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
              <TestTube2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy-900">
                {test ? 'Edit Diagnostic Test Record' : 'Add New Diagnostic Test to Catalogue'}
              </h3>
              <p className="text-xs text-brand-slate-500">
                Configure basic parameters, sample tubes, preparation guidance and Mysuru pricing
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 border-b border-brand-teal-100 pb-1">
              1. Basic Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-bold text-brand-slate-700 mb-1">Test Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Complete Blood Count (CBC) with ESR"
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-brand-slate-700 mb-1">Test Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., HEM-CBC-01"
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-brand-slate-700 mb-1">Department / Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
                >
                  {LAB_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-brand-slate-700 mb-1">Test / Panel Type</label>
                <input
                  type="text"
                  value={formData.panelType}
                  onChange={(e) => setFormData({ ...formData, panelType: e.target.value })}
                  placeholder="e.g., Automated 5-Part Differential / CLIA Immunoassay"
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical & Sample Requirements */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 border-b border-brand-teal-100 pb-1">
              2. Clinical & Sample Requirements
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-brand-slate-700 mb-1">Sample Required *</label>
                <input
                  type="text"
                  value={formData.sampleRequired}
                  onChange={(e) => setFormData({ ...formData, sampleRequired: e.target.value })}
                  placeholder="e.g., Whole Blood / Serum / Midstream Urine"
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-brand-slate-700 mb-1">Tube / Container *</label>
                <input
                  type="text"
                  value={formData.tubeContainer}
                  onChange={(e) => setFormData({ ...formData, tubeContainer: e.target.value })}
                  placeholder="e.g., EDTA Lavender Top (2ml) / Clot Activator Gold Top"
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-brand-slate-700 mb-1">
                  Patient Preparation Instructions *
                </label>
                <textarea
                  rows={2}
                  value={formData.preparation}
                  onChange={(e) => setFormData({ ...formData, preparation: e.target.value })}
                  placeholder="e.g., Strict overnight fasting of 8 - 10 hours. Water permitted."
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-brand-slate-700 mb-1">Turnaround Time (TAT) *</label>
                <input
                  type="text"
                  value={formData.tat}
                  onChange={(e) => setFormData({ ...formData, tat: e.target.value })}
                  placeholder="e.g., 2 - 4 Hours / Same Day / 24 Hours"
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-brand-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-bold text-brand-teal-700"
                >
                  <option value="Active">Active (Available for Booking)</option>
                  <option value="Inactive">Inactive (Disabled)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-brand-slate-700 mb-1">Clinical / Diagnostic Notes</label>
                <textarea
                  rows={2}
                  value={formData.clinicalNotes}
                  onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
                  placeholder="Clinical significance and organ diagnostic relevance..."
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Commercial & CPT Pricing */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal-700 border-b border-brand-teal-100 pb-1">
              3. Pricing & Reference Codes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-brand-slate-700 mb-1">
                  Suggested Mysuru Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 350"
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-bold text-brand-navy-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-brand-slate-700 mb-1">
                  Approx. CPT Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.cptCode}
                  onChange={(e) => setFormData({ ...formData, cptCode: e.target.value })}
                  placeholder="e.g., 85025 (or leave blank for —)"
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Parameters Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-brand-teal-100 pb-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal-700">
                4. Included Parameters ({formData.parameters.length})
              </h4>
              <button
                type="button"
                onClick={handleAddParam}
                className="flex items-center gap-1 text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800 bg-brand-teal-50 px-2.5 py-1 rounded-lg border border-brand-teal-200"
              >
                <Plus className="w-3 h-3" /> Add Parameter
              </button>
            </div>

            <div className="space-y-2">
              {formData.parameters.map((param, index) => (
                <div key={index} className="flex items-center gap-2 bg-brand-slate-50 p-2 rounded-xl border border-brand-slate-200">
                  <input
                    type="text"
                    value={param.name}
                    onChange={(e) => handleParamChange(index, 'name', e.target.value)}
                    placeholder="Parameter Name"
                    className="flex-2 p-2 bg-white rounded-lg border border-brand-slate-200 font-medium"
                    required
                  />
                  <input
                    type="text"
                    value={param.unit}
                    onChange={(e) => handleParamChange(index, 'unit', e.target.value)}
                    placeholder="Unit (e.g. g/dL)"
                    className="flex-1 p-2 bg-white rounded-lg border border-brand-slate-200 font-mono text-[11px]"
                  />
                  <input
                    type="text"
                    value={param.normalRange}
                    onChange={(e) => handleParamChange(index, 'normalRange', e.target.value)}
                    placeholder="Normal Range"
                    className="flex-2 p-2 bg-white rounded-lg border border-brand-slate-200 text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveParam(index)}
                    disabled={formData.parameters.length <= 1}
                    className="p-1.5 text-brand-slate-400 hover:text-brand-coral-600 disabled:opacity-40 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
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
              {test ? 'Save Changes' : 'Create Diagnostic Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
