import React, { useState } from 'react';
import { Plus, UserCheck, Award, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/forms/FormInput';
import SelectInput from '../../../components/forms/SelectInput';
import { NURSING_SERVICES_CATALOG } from '../../../data/homeNursingData';

export default function AddStaffModal({ isOpen, onClose, onSaveStaff }) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Registered Nurse',
    qualification: 'B.Sc Nursing',
    experience: '5 Years',
    location: 'Mysore - Gokulam',
    phone: '',
    email: '',
    capabilities: ['Injection Administration', 'Wound Dressing', 'Vital Monitoring']
  });

  if (!isOpen) return null;

  const handleToggleCapability = (cap) => {
    setFormData((prev) => ({
      ...prev,
      capabilities: prev.capabilities.includes(cap)
        ? prev.capabilities.filter((c) => c !== cap)
        : [...prev.capabilities, cap]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const newStaff = {
      ...formData,
      id: `STF-${formData.role.includes('Nurse') ? 'NUR' : 'CG'}-${Math.floor(110 + Math.random() * 880)}`,
      availability: 'Available',
      currentAssignments: 0,
      rating: 5.0,
      avatarColor: 'bg-emerald-500'
    };

    onSaveStaff(newStaff);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Clinical Staff / Caregiver"
      subtitle="Register a new nurse, attendant, or specialist to Homecare operations"
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-staff-form"
            className="px-5 py-2 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Save Staff Profile</span>
          </button>
        </div>
      }
    >
      <form id="add-staff-form" onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm text-brand-navy-900 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Staff Full Name"
            id="staffName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Sister Kavitha Gowda"
            required
          />
          <SelectInput
            label="Staff Role"
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              'Registered Nurse',
              'Homecare Nurse',
              'Critical Care Specialist Nurse',
              'Certified Geriatric Attendant',
              'Senior Caregiver'
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Qualifications & Certifications"
            id="qualification"
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            placeholder="e.g. B.Sc Nursing, Wound Care Certified"
            required
          />
          <FormInput
            label="Clinical Experience"
            id="experience"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            placeholder="e.g. 6 Years"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormInput
            label="Contact Mobile"
            id="staffPhone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98450 11223"
            icon={Phone}
            required
          />
          <FormInput
            label="Email Address"
            id="staffEmail"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="nurse@mediunify.com"
            icon={Mail}
          />
          <FormInput
            label="Operational Locality"
            id="staffLocation"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. Mysore - Gokulam & Vijayanagar"
            icon={MapPin}
          />
        </div>

        {/* Nursing Capabilities Multi-Select */}
        <div>
          <label className="block text-xs font-bold text-brand-navy-900 mb-2">
            Clinical Service Capabilities & Skills (Select all applicable)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {NURSING_SERVICES_CATALOG.map((srv) => {
              const isChecked = formData.capabilities.includes(srv.name);
              return (
                <div
                  key={srv.id}
                  onClick={() => handleToggleCapability(srv.name)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                    isChecked
                      ? 'bg-brand-green-50 border-brand-green-500 text-brand-green-900 shadow-2xs'
                      : 'bg-white border-brand-slate-200 text-brand-slate-600 hover:bg-brand-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-3.5 h-3.5 rounded text-brand-green-600 focus:ring-brand-green-500 pointer-events-none"
                  />
                  <span className="truncate">{srv.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </Modal>
  );
}
