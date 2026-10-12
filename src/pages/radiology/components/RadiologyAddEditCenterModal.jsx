import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function RadiologyAddEditCenterModal({
  isOpen,
  onClose,
  center,
  onSaveCenter
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: 'Mysuru',
    contactNumber: '',
    email: '',
    operatingHours: '07:00 AM - 09:00 PM',
    availableServices: ['CT Scan', 'X-Ray', 'Ultrasound'],
    totalMachines: 3,
    status: 'Active',
    accreditation: 'AERB & NABL Certified'
  });

  const ALL_SERVICES = ['MRI', 'CT Scan', 'X-Ray', 'Ultrasound', 'Mammography', 'DEXA'];

  useEffect(() => {
    if (center) {
      setFormData({ ...center });
    } else {
      setFormData({
        name: '',
        code: `RAD-CTR-MYS${Math.floor(10 + Math.random() * 90)}`,
        address: '',
        city: 'Mysuru',
        contactNumber: '+91 821 ',
        email: 'imaging@mediunify.com',
        operatingHours: '07:00 AM - 09:00 PM',
        availableServices: ['CT Scan', 'X-Ray', 'Ultrasound'],
        totalMachines: 3,
        status: 'Active',
        accreditation: 'AERB & NABL Certified'
      });
    }
  }, [center, isOpen]);

  if (!isOpen) return null;

  const toggleService = (svc) => {
    setFormData((prev) => {
      const exists = prev.availableServices.includes(svc);
      if (exists) {
        return { ...prev, availableServices: prev.availableServices.filter((s) => s !== svc) };
      }
      return { ...prev, availableServices: [...prev.availableServices, svc] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code || formData.availableServices.length === 0) {
      addToast('Please provide Center Name, Code and at least one enabled service.', 'warning');
      return;
    }

    onSaveCenter({
      ...formData,
      id: center?.id || `CTR-${Date.now().toString().slice(-4)}`
    });

    addToast(`Radiology center ${formData.name} saved successfully.`, 'success');
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
            <div className="p-2 bg-brand-navy-50 text-brand-navy-900 rounded-lg border border-brand-navy-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">
                {center ? 'Edit Radiology Center' : 'Register New Radiology & Imaging Center'}
              </h3>
              <p className="text-xs text-brand-slate-500">Configure center details, enabled imaging modalities and operating hours</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 rounded-lg hover:bg-brand-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Center Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. MediUnify Imaging Suite - Saraswathipuram"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Center Code:</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. RAD-CTR-MYS01"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">City Location:</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Mysuru / Bengaluru"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Contact Phone:</label>
              <input
                type="text"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="+91 821 2548900"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Full Physical Address:</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Building No, Street, Landmark, Pincode..."
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Email Helpline:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 rounded-xl border border-brand-slate-200 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Operating Hours:</label>
              <input
                type="text"
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                placeholder="06:00 AM - 11:00 PM"
                className="w-full p-2 rounded-xl border border-brand-slate-200 text-xs font-medium"
                required
              />
            </div>
          </div>

          {/* Enabled Modalities Pill Select */}
          <div>
            <label className="font-bold text-brand-slate-700 block mb-1.5">
              Available Imaging Modalities at this Center:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_SERVICES.map((svc) => {
                const isSelected = formData.availableServices.includes(svc);
                return (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => toggleService(svc)}
                    className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-brand-navy-900 text-white border-brand-navy-900 shadow-xs'
                        : 'bg-brand-slate-50 text-brand-slate-600 border-brand-slate-200 hover:bg-brand-slate-100'
                    }`}
                  >
                    <span>{svc}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal-300" />}
                  </button>
                );
              })}
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
              className="px-4 py-2 bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {center ? 'Update Center Details' : 'Register Center'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
