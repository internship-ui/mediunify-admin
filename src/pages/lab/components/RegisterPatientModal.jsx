import React, { useState } from 'react';
import {
  X,
  UserPlus,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin,
  Building2
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function RegisterPatientModal({ isOpen, onClose, onRegister }) {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: 'Mrs.',
    name: '',
    age: '',
    gender: 'Female',
    phone: '',
    email: '',
    address: '',
    referredBy: 'Dr. Priyadarshini (FAME)',
    refCenter: 'Farookh Medical College & RI (FAME)',
    venue: 'MEDIUNIFY DIAGNOSTIC LABS'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.age) {
      addToast('Please enter Patient Name and Age', 'warning');
      return;
    }

    const regNo = `261000${Math.floor(22 + Math.random() * 80)}`;
    const labNo = `139${Math.floor(16 + Math.random() * 80)}`;

    const newPatient = {
      id: `PT-${Date.now().toString().slice(-4)}`,
      patientId: `PT-${Date.now().toString().slice(-4)}`,
      regNo,
      labNo,
      name: `${formData.title} ${formData.name}`,
      age: Number(formData.age),
      gender: formData.gender,
      phone: formData.phone || '+91 98450 00000',
      email: formData.email || 'patient@mediunify.com',
      address: formData.address || 'Mysuru',
      referredBy: formData.referredBy,
      refCenter: formData.refCenter,
      venue: formData.venue
    };

    onRegister(newPatient);
    addToast(`Patient ${newPatient.name} registered with Reg No ${regNo}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy-900">
                Register New Patient
              </h3>
              <p className="text-xs text-brand-slate-500 font-mono">
                MEDIUNIFY DIAGNOSTICS • Diagnostic Registration
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Prefix / Salutation</label>
              <select
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 font-medium"
              >
                <option value="Mrs.">Mrs.</option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
                <option value="Mrs. Dr">Mrs. Dr</option>
                <option value="Baby of.">Baby of.</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-brand-slate-700 mb-1">Patient Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., JAYASHREE"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 font-bold uppercase text-brand-navy-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Age (Years) *</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g., 30"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 font-medium"
              >
                <option value="Female">Female (♀)</option>
                <option value="Male">Male (♂)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Mobile No.</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98450 12345"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-brand-slate-700 mb-1">Referred Center / Institution</label>
              <input
                type="text"
                value={formData.refCenter}
                onChange={(e) => setFormData({ ...formData, refCenter: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 font-medium"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-brand-slate-700 mb-1">Referred Doctor</label>
              <input
                type="text"
                value={formData.referredBy}
                onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-brand-slate-200 flex items-center justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-brand-slate-100 text-brand-slate-700 font-semibold rounded-xl border border-brand-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Register Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
