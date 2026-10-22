import React, { useState, useEffect } from 'react';
import {
  X,
  Layers,
  Clock,
  Building2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { RADIOLOGY_CENTERS } from '../../../data/radiologyData';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function RadiologyAddEditMachineModal({
  isOpen,
  onClose,
  subScan,
  machine,
  onSaveSubScan,
  onSaveMachine,
  allCenters = RADIOLOGY_CENTERS
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);

  const targetItem = subScan || machine;

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    modality: 'MRI',
    bodyPart: '',
    duration: '25 - 30 min',
    preparation: 'No special preparation required.',
    centers: ['All Centers'],
    fastingRequired: false,
    status: 'Active'
  });

  useEffect(() => {
    if (targetItem) {
      setFormData({
        id: targetItem.id,
        name: targetItem.name || '',
        code: targetItem.code || `SUB-${(targetItem.modality || 'SCAN').slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
        modality: targetItem.modality || 'MRI',
        bodyPart: targetItem.bodyPart || '',
        duration: targetItem.duration || '25 - 30 min',
        preparation: targetItem.preparation || 'No special preparation required.',
        centers: Array.isArray(targetItem.centers) ? targetItem.centers : ['All Centers'],
        fastingRequired: Boolean(targetItem.fastingRequired),
        status: targetItem.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        code: `SUB-MRI-${Math.floor(10 + Math.random() * 90)}`,
        modality: 'MRI',
        bodyPart: '',
        duration: '25 - 30 min',
        preparation: 'No special preparation required.',
        centers: ['All Centers'],
        fastingRequired: false,
        status: 'Active'
      });
    }
  }, [targetItem, isOpen]);

  if (!isOpen) return null;

  const handleModalityChange = (e) => {
    const nextMod = e.target.value;
    const prefix = nextMod.replace(/\s+/g, '').slice(0, 4).toUpperCase();
    setFormData((prev) => ({
      ...prev,
      modality: nextMod,
      code: prev.id ? prev.code : `SUB-${prefix}-${Math.floor(10 + Math.random() * 90)}`
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      addToast('Please provide a Sub Scan Name (e.g. MRI Brain, MRI Spine, etc.).', 'warning');
      return;
    }
    if (!formData.bodyPart?.trim()) {
      addToast('Please provide a Target Body Part (e.g. Brain, Spine, Knee, etc.).', 'warning');
      return;
    }

    const payload = {
      ...formData,
      id: targetItem?.id || `SUB-${Date.now().toString().slice(-4)}`
    };

    if (onSaveSubScan) {
      onSaveSubScan(payload);
    } else if (onSaveMachine) {
      onSaveMachine(payload);
    }

    addToast(`Sub Scan "${formData.name}" saved successfully.`, 'success');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in-50 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-100 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-teal-50 text-brand-teal-700 rounded-lg border border-brand-teal-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">
                {targetItem ? 'Edit Sub Scan' : 'Add New Sub Scan'}
              </h3>
              <p className="text-xs text-brand-slate-500">
                Configure scan target region (e.g. Brain, Spine, Legs) and preparation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 rounded-lg hover:bg-brand-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">
                Parent Modality:
              </label>
              <select
                value={formData.modality}
                onChange={handleModalityChange}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-semibold cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500"
              >
                <option value="MRI">MRI</option>
                <option value="CT Scan">CT Scan</option>
                <option value="X-Ray">X-Ray</option>
                <option value="Ultrasound">Ultrasound</option>
                <option value="Mammography">Mammography</option>
                <option value="DEXA">DEXA / BMD</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">
                Sub Scan Code:
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. SUB-MRI-01"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-mono font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">
              Sub Scan Name:
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. MRI Brain, MRI Spine, MRI Legs, CT Chest"
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">
                Target Body Part / Region:
              </label>
              <input
                type="text"
                value={formData.bodyPart}
                onChange={(e) => setFormData({ ...formData, bodyPart: e.target.value })}
                placeholder="e.g. Brain & Cranium, Spine, Knee / Legs"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">
                Typical Scan Duration:
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 25 - 35 min, 10 min"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">
              Clinical Preparation Instructions:
            </label>
            <textarea
              rows={2}
              value={formData.preparation}
              onChange={(e) => setFormData({ ...formData, preparation: e.target.value })}
              placeholder="e.g. 4 hours fasting if contrast indicated. Remove metallic items."
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">
                Operational Status:
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-semibold cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500"
              >
                <option value="Active">Active / Available</option>
                <option value="Inactive">Inactive / Suspended</option>
              </select>
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.fastingRequired}
                  onChange={(e) => setFormData({ ...formData, fastingRequired: e.target.checked })}
                  className="rounded text-brand-teal-600 focus:ring-brand-teal-500 h-4 w-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-brand-slate-700">
                  Fasting Required (4 - 6 hours)
                </span>
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-brand-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-brand-slate-200 hover:bg-brand-slate-50 text-brand-slate-600 rounded-xl font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-navy-900 hover:bg-brand-navy-800 text-white rounded-xl font-bold shadow-xs cursor-pointer transition-colors"
            >
              {targetItem ? 'Update Sub Scan' : 'Add Sub Scan'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
