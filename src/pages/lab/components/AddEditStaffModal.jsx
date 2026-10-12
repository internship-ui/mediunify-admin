import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Car,
  Briefcase
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function AddEditStaffModal({
  isOpen,
  onClose,
  staff,
  onSaveStaff
}) {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    staffId: '',
    phone: '',
    email: '',
    serviceArea: 'Kuvempunagar & Saraswathipuram',
    specialization: 'Senior Phlebotomist & Pediatric Draw',
    workingHours: '06:00 AM - 03:00 PM',
    availability: 'AVAILABLE',
    vehicleNumber: 'KA-09-EM-4821',
    status: 'Active'
  });

  useEffect(() => {
    if (staff) {
      setFormData({ ...staff });
    } else {
      setFormData({
        name: '',
        staffId: `PHL-MYS-${Math.floor(10 + Math.random() * 90)}`,
        phone: '+91 9',
        email: '',
        serviceArea: 'Kuvempunagar & Saraswathipuram',
        specialization: 'Senior Phlebotomist',
        workingHours: '06:00 AM - 03:00 PM',
        availability: 'AVAILABLE',
        vehicleNumber: 'KA-09-XX-0000',
        status: 'Active'
      });
    }
  }, [staff, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      addToast('Please enter Staff Name and Phone Number', 'warning');
      return;
    }

    const payload = {
      ...formData,
      id: staff?.id || `STF-${Date.now().toString().slice(-4)}`,
      todaysAssignments: staff?.todaysAssignments || 0,
      completedCollections: staff?.completedCollections || 0,
      rating: staff?.rating || '4.8/5.0'
    };

    onSaveStaff(payload);
    addToast(
      staff ? `Updated staff member: ${formData.name}` : `Registered new phlebotomist: ${formData.name}`,
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
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy-900">
                {staff ? 'Edit Phlebotomist Profile' : 'Register New Phlebotomist'}
              </h3>
              <p className="text-xs text-brand-slate-500 font-mono">
                {formData.staffId}
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
              <label className="block font-bold text-brand-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Vikram Singh"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Staff Code *</label>
              <input
                type="text"
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Contact Phone *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98450 12345"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-mono"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-brand-slate-700 mb-1">Service Area (Mysuru Zones) *</label>
              <input
                type="text"
                value={formData.serviceArea}
                onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                placeholder="e.g., Kuvempunagar & Saraswathipuram"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-brand-slate-700 mb-1">Clinical Specialization</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g., Senior Phlebotomist & Pediatric Draw"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Duty Shift Hours</label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                placeholder="06:00 AM - 03:00 PM"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Transport Vehicle No.</label>
              <input
                type="text"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                placeholder="KA-09-EM-4821"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Current Availability</label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-bold"
              >
                <option value="AVAILABLE">AVAILABLE (Accepting Orders)</option>
                <option value="BUSY">BUSY (On Active Route)</option>
                <option value="OFFLINE">OFFLINE (Off Duty)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Staff Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-bold text-brand-teal-700"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
              {staff ? 'Save Staff Changes' : 'Register Phlebotomist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
