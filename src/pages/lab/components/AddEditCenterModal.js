import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function AddEditCenterModal({
  isOpen,
  onClose,
  center,
  onSaveCenter
}) {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: 'Mysuru',
    contactPhone: '',
    contactEmail: '',
    operatingHours: '06:30 AM - 09:00 PM (Mon - Sun)',
    availableTestsCount: 120,
    homeCollectionHub: true,
    managerName: '',
    status: 'Active'
  });

  useEffect(() => {
    if (center) {
      setFormData({ ...center });
    } else {
      setFormData({
        name: '',
        code: `MYS-CL-${Math.floor(10 + Math.random() * 90)}`,
        address: '',
        city: 'Mysuru',
        contactPhone: '+91 821 2',
        contactEmail: '',
        operatingHours: '06:30 AM - 09:00 PM (Mon - Sun)',
        availableTestsCount: 120,
        homeCollectionHub: true,
        managerName: '',
        status: 'Active'
      });
    }
  }, [center, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      addToast('Please provide Center Name and Address', 'warning');
      return;
    }

    const payload = {
      ...formData,
      id: center?.id || `CTR-${Date.now().toString().slice(-4)}`,
      availableTestsCount: Number(formData.availableTestsCount || 100)
    };

    onSaveCenter(payload);
    addToast(
      center ? `Updated center: ${formData.name}` : `Registered new lab center: ${formData.name}`,
      'success'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-teal-50 text-brand-teal-700 rounded-lg border border-brand-teal-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy-900">
                {center ? 'Edit Lab / Collection Center' : 'Add New Lab Center in Mysuru'}
              </h3>
              <p className="text-xs text-brand-slate-500 font-mono">
                {formData.code}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-brand-slate-700 mb-1">Center Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., MediUnify Diagnostics & Collection Hub - Jayalakshmipuram"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Center Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-brand-slate-700 mb-1">Full Street Address *</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address, landmarks and pincode in Mysuru..."
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Helpdesk Contact Phone *</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+91 821 2548900"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Center Manager Name</label>
              <input
                type="text"
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                placeholder="e.g., Anil Deshmukh"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-brand-slate-700 mb-1">Operating Hours *</label>
              <input
                type="text"
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                placeholder="e.g., 06:30 AM - 09:30 PM (Mon - Sun)"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Home Collection Hub?</label>
              <select
                value={formData.homeCollectionHub ? 'yes' : 'no'}
                onChange={(e) => setFormData({ ...formData, homeCollectionHub: e.target.value === 'yes' })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
              >
                <option value="yes">Yes (Phlebotomy Fleet Base)</option>
                <option value="no">No (Walk-in Sample Point Only)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Operational Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-bold text-brand-teal-700"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Temporarily Closed">Temporarily Closed</option>
              </select>
            </div>
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
              {center ? 'Save Center Changes' : 'Register Lab Center'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
