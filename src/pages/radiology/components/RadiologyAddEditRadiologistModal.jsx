import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  Building2,
  CheckCircle2,
  Award
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { RADIOLOGY_CENTERS } from '../../../data/radiologyData';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function RadiologyAddEditRadiologistModal({
  isOpen,
  onClose,
  radiologist,
  onSaveRadiologist,
  allCenters = RADIOLOGY_CENTERS
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);

  const [formData, setFormData] = useState({
    name: '',
    radiologistId: '',
    specialization: 'Neuro-Radiology & Stroke Imaging',
    center: allCenters[0]?.name || 'MediUnify Advanced Imaging & Reference Hub',
    experience: '10 Years',
    phone: '+91 98450 ',
    email: 'radiologist@mediunify.com',
    availability: 'Available', // 'Available' | 'Busy' | 'Offline' | 'Inactive'
    status: 'Active',
    rating: '4.9/5.0'
  });

  useEffect(() => {
    if (radiologist) {
      setFormData({ ...radiologist });
    } else {
      setFormData({
        name: '',
        radiologistId: `RAD-DOC-${Math.floor(10 + Math.random() * 90)}`,
        specialization: 'Neuro-Radiology & Stroke Imaging',
        center: allCenters[0]?.name || 'MediUnify Advanced Imaging & Reference Hub',
        experience: '10 Years',
        phone: '+91 98450 ',
        email: 'radiologist@mediunify.com',
        availability: 'Available',
        status: 'Active',
        rating: '4.9/5.0'
      });
    }
  }, [radiologist, isOpen, allCenters]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.radiologistId) {
      addToast('Please enter Radiologist Name and ID.', 'warning');
      return;
    }

    onSaveRadiologist({
      ...formData,
      id: radiologist?.id || `RAD-DOC-${Date.now().toString().slice(-4)}`,
      pendingReports: radiologist?.pendingReports || 0,
      completedReports: radiologist?.completedReports || 0
    });

    addToast(`Radiologist ${formData.name} saved successfully.`, 'success');
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
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-200">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">
                {radiologist ? 'Edit Radiologist Profile' : 'Onboard New Consultant Radiologist'}
              </h3>
              <p className="text-xs text-brand-slate-500">Configure medical credentials, modality sub-specialization and center assignment</p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Radiologist Full Name & Degrees:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Ramesh Rao, MD, FRCR"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Radiologist ID / Registration Code:</label>
              <input
                type="text"
                value={formData.radiologistId}
                onChange={(e) => setFormData({ ...formData, radiologistId: e.target.value })}
                placeholder="e.g. RAD-MYS-05"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Sub-Specialization:</label>
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
              >
                <option value="Neuro-Radiology & Stroke Imaging">Neuro-Radiology & Stroke Imaging</option>
                <option value="Musculoskeletal & Joint MRI">Musculoskeletal & Joint MRI</option>
                <option value="Chest & Body CT Imaging">Chest & Body CT Imaging</option>
                <option value="Women's Imaging & Fetal Sonology">Women's Imaging & Fetal Sonology</option>
                <option value="Cardiovascular & Thoracic Imaging">Cardiovascular & Thoracic Imaging</option>
                <option value="General Diagnostics & Ultrasound">General Diagnostics & Ultrasound</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Primary Base Center:</label>
              <select
                value={formData.center}
                onChange={(e) => setFormData({ ...formData, center: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
              >
                {allCenters.map((c) => (
                  <option key={c.id} value={c.name}>{c.name.split('-')[0]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Experience:</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g. 12 Years"
                className="w-full p-2 rounded-xl border border-brand-slate-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Availability Status:</label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full p-2 rounded-xl border border-brand-slate-200 text-xs font-bold"
              >
                <option value="Available">Available (Accepting Scans)</option>
                <option value="Busy">Busy (Heavy Queue)</option>
                <option value="Offline">Offline / On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Phone Number:</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 rounded-xl border border-brand-slate-200 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Institutional Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 rounded-xl border border-brand-slate-200 text-xs font-medium"
                required
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
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {radiologist ? 'Update Radiologist Profile' : 'Onboard Radiologist'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
