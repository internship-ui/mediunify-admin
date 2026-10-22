import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Activity,
  Plus,
  X,
  Check,
  Share2,
  MessageSquare,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/forms/FormInput';
import SelectInput from '../../../components/forms/SelectInput';
import {
  DEFAULT_SURGERY_SPECIALIZATIONS,
  HOSPITAL_TYPES,
  SURGERY_CITIES
} from '../../../data/surgeryData';

export default function AddEditHospitalModal({
  isOpen,
  onClose,
  onSave,
  hospitalToEdit = null
}) {
  const isEditing = Boolean(hospitalToEdit);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: HOSPITAL_TYPES[0],
    address: '',
    city: 'Mysore',
    state: 'Karnataka',
    pincode: '',
    contactPerson: '',
    contactMobile: '',
    contactEmail: '',
    specializations: [
      'Knee Replacement',
      'Hip Replacement',
      'Joint Replacement',
      'Orthopaedic Surgery'
    ],
    preferredNotification: 'Both', // 'WhatsApp' | 'Email' | 'Both'
    whatsappNumber: '',
    notificationEmail: '',
    status: 'Active', // 'Active' | 'Inactive'
    statusReason: '',
    bedCount: '',
    establishedYear: ''
  });

  // Custom specialization tag input state
  const [customSpecInput, setCustomSpecInput] = useState('');
  const [availableSpecs, setAvailableSpecs] = useState(DEFAULT_SURGERY_SPECIALIZATIONS);
  const [errors, setErrors] = useState({});

  // Sync form when hospitalToEdit changes
  useEffect(() => {
    if (hospitalToEdit) {
      setFormData({
        name: hospitalToEdit.name || '',
        type: hospitalToEdit.type || HOSPITAL_TYPES[0],
        address: hospitalToEdit.address || '',
        city: hospitalToEdit.city || 'Mysore',
        state: hospitalToEdit.state || 'Karnataka',
        pincode: hospitalToEdit.pincode || '',
        contactPerson: hospitalToEdit.contactPerson || '',
        contactMobile: hospitalToEdit.contactMobile || '',
        contactEmail: hospitalToEdit.contactEmail || '',
        specializations: hospitalToEdit.specializations || [],
        preferredNotification: hospitalToEdit.preferredNotification || 'Both',
        whatsappNumber: hospitalToEdit.whatsappNumber || '',
        notificationEmail: hospitalToEdit.notificationEmail || '',
        status: hospitalToEdit.status || 'Active',
        statusReason: hospitalToEdit.statusReason || '',
        bedCount: hospitalToEdit.bedCount || '',
        establishedYear: hospitalToEdit.establishedYear || ''
      });

      // Merge any existing specializations not in default list
      if (hospitalToEdit.specializations) {
        setAvailableSpecs((prev) => {
          const set = new Set([...prev, ...hospitalToEdit.specializations]);
          return Array.from(set);
        });
      }
    } else {
      // Reset form
      setFormData({
        name: '',
        type: HOSPITAL_TYPES[0],
        address: '',
        city: 'Mysore',
        state: 'Karnataka',
        pincode: '',
        contactPerson: '',
        contactMobile: '',
        contactEmail: '',
        specializations: [
          'Knee Replacement',
          'Hip Replacement',
          'Joint Replacement',
          'Orthopaedic Surgery'
        ],
        preferredNotification: 'Both',
        whatsappNumber: '',
        notificationEmail: '',
        status: 'Active',
        statusReason: '',
        bedCount: '',
        establishedYear: ''
      });
    }
    setErrors({});
    setCustomSpecInput('');
  }, [hospitalToEdit, isOpen]);

  // Toggle specialization selection
  const handleToggleSpec = (spec) => {
    setFormData((prev) => {
      const exists = prev.specializations.includes(spec);
      const updated = exists
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec];
      return { ...prev, specializations: updated };
    });
    if (errors.specializations) {
      setErrors((prev) => ({ ...prev, specializations: null }));
    }
  };

  // Add custom specialization
  const handleAddCustomSpec = (e) => {
    e.preventDefault();
    const trimmed = customSpecInput.trim();
    if (!trimmed) return;

    // Capitalize appropriately
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

    if (!availableSpecs.includes(formatted)) {
      setAvailableSpecs((prev) => [...prev, formatted]);
    }
    if (!formData.specializations.includes(formatted)) {
      setFormData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, formatted]
      }));
    }
    setCustomSpecInput('');
    if (errors.specializations) {
      setErrors((prev) => ({ ...prev, specializations: null }));
    }
  };

  // Validation according to selected notification method & hospital details
  const validateForm = () => {
    const errs = {};

    if (!formData.name.trim()) errs.name = 'Hospital name is required';
    if (!formData.address.trim()) errs.address = 'Hospital address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.pincode.trim()) {
      errs.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.replace(/\s+/g, ''))) {
      errs.pincode = 'Enter a valid 6-digit pincode';
    }

    if (!formData.contactPerson.trim()) errs.contactPerson = 'Contact person name is required';
    if (!formData.contactMobile.trim()) {
      errs.contactMobile = 'Contact mobile is required';
    } else if (formData.contactMobile.replace(/\D/g, '').length < 10) {
      errs.contactMobile = 'Enter a valid mobile number (min 10 digits)';
    }

    if (!formData.contactEmail.trim()) {
      errs.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      errs.contactEmail = 'Enter a valid email address';
    }

    if (formData.specializations.length === 0) {
      errs.specializations = 'Select at least one surgery specialization';
    }

    // Validation for Notification Forwarding fields based on Preferred Notification Method
    const method = formData.preferredNotification;
    if (method === 'WhatsApp' || method === 'Both') {
      if (!formData.whatsappNumber.trim()) {
        errs.whatsappNumber = 'WhatsApp number is required for WhatsApp forwarding';
      } else if (formData.whatsappNumber.replace(/\D/g, '').length < 10) {
        errs.whatsappNumber = 'Enter a valid 10-digit WhatsApp number';
      }
    }

    if (method === 'Email' || method === 'Both') {
      if (!formData.notificationEmail.trim()) {
        errs.notificationEmail = 'Notification email is required for Email forwarding';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.notificationEmail)) {
        errs.notificationEmail = 'Enter a valid email format for notification';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      ...formData,
      id: hospitalToEdit ? hospitalToEdit.id : undefined
    });
  };

  // Quick fill helper for WhatsApp and Email from contact details
  const handleCopyMobileToWhatsApp = () => {
    if (formData.contactMobile) {
      setFormData((prev) => ({ ...prev, whatsappNumber: prev.contactMobile }));
    }
  };

  const handleCopyEmailToNotification = () => {
    if (formData.contactEmail) {
      setFormData((prev) => ({ ...prev, notificationEmail: prev.contactEmail }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Hospital — ${formData.name || 'Hospital'}` : 'Onboard New Hospital'}
      subtitle="Register surgical hospital partner, surgery specializations & patient request forwarding details"
      maxWidth="max-w-3xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-edit-hospital-form"
            className="px-5 py-2.5 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{isEditing ? 'Save Hospital Changes' : 'Save & Onboard Hospital'}</span>
          </button>
        </div>
      }
    >
      <form id="add-edit-hospital-form" onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
        {/* SECTION 1: HOSPITAL DETAILS */}
        <div className="bg-brand-slate-50/70 p-4 sm:p-5 rounded-2xl border border-brand-slate-200/90 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-brand-slate-200">
            <span className="p-1.5 rounded-lg bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200">
              <Building2 className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-brand-navy-950 uppercase tracking-wide">
                1. Hospital Details
              </h4>
              <p className="text-[11px] text-brand-slate-500">
                Official institution identification, category and physical location
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <FormInput
                label="Hospital Name"
                id="hospitalName"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                placeholder="e.g. A R Hospital"
                required
                error={errors.name}
              />
            </div>

            <div className="sm:col-span-2">
              <SelectInput
                label="Hospital Type"
                id="hospitalType"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                options={HOSPITAL_TYPES}
              />
            </div>

            <div className="sm:col-span-2">
              <FormInput
                label="Street Address / Landmark"
                id="hospitalAddress"
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: null });
                }}
                placeholder="e.g. #42 Sayyaji Rao Road, Near Fountain Circle"
                icon={MapPin}
                required
                error={errors.address}
              />
            </div>

            <div>
              <SelectInput
                label="City Hub"
                id="hospitalCity"
                value={formData.city}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value });
                  if (errors.city) setErrors({ ...errors, city: null });
                }}
                options={SURGERY_CITIES.filter((c) => c !== 'All Cities')}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FormInput
                label="State"
                id="hospitalState"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Karnataka"
                required
              />
              <FormInput
                label="Pincode"
                id="hospitalPincode"
                value={formData.pincode}
                onChange={(e) => {
                  setFormData({ ...formData, pincode: e.target.value });
                  if (errors.pincode) setErrors({ ...errors, pincode: null });
                }}
                placeholder="570020"
                required
                error={errors.pincode}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTACT DETAILS */}
        <div className="bg-brand-slate-50/70 p-4 sm:p-5 rounded-2xl border border-brand-slate-200/90 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-brand-slate-200">
            <span className="p-1.5 rounded-lg bg-brand-navy-50 text-brand-navy-700 border border-brand-navy-200">
              <Phone className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-brand-navy-950 uppercase tracking-wide">
                2. Contact Details
              </h4>
              <p className="text-[11px] text-brand-slate-500">
                Primary hospital coordinator or administrative manager
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <FormInput
                label="Contact Person Name"
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => {
                  setFormData({ ...formData, contactPerson: e.target.value });
                  if (errors.contactPerson) setErrors({ ...errors, contactPerson: null });
                }}
                placeholder="e.g. Dr. Arvind Rao"
                required
                error={errors.contactPerson}
              />
            </div>

            <div>
              <FormInput
                label="Contact Mobile Number"
                id="contactMobile"
                value={formData.contactMobile}
                onChange={(e) => {
                  setFormData({ ...formData, contactMobile: e.target.value });
                  if (errors.contactMobile) setErrors({ ...errors, contactMobile: null });
                }}
                placeholder="+91 98450 11223"
                icon={Phone}
                required
                error={errors.contactMobile}
              />
            </div>

            <div>
              <FormInput
                label="Contact Email Address"
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => {
                  setFormData({ ...formData, contactEmail: e.target.value });
                  if (errors.contactEmail) setErrors({ ...errors, contactEmail: null });
                }}
                placeholder="admissions@arhospital.org"
                icon={Mail}
                required
                error={errors.contactEmail}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: SURGERY SPECIALIZATIONS */}
        <div className="bg-brand-slate-50/70 p-4 sm:p-5 rounded-2xl border border-brand-slate-200/90 space-y-4">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-brand-slate-200 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Activity className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-brand-navy-950 uppercase tracking-wide">
                  3. Surgery Specializations
                </h4>
                <p className="text-[11px] text-brand-slate-500">
                  Select all surgery types performed at this hospital ({formData.specializations.length} selected)
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-brand-teal-800 bg-brand-teal-50 px-2.5 py-1 rounded-lg border border-brand-teal-200">
              Multiple Selectable
            </span>
          </div>

          {errors.specializations && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.specializations}</span>
            </div>
          )}

          {/* Specialization Chips Selection */}
          <div className="flex flex-wrap gap-2">
            {availableSpecs.map((spec) => {
              const isSelected = formData.specializations.includes(spec);
              return (
                <button
                  type="button"
                  key={spec}
                  onClick={() => handleToggleSpec(spec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-brand-teal-600 text-white border-brand-teal-600 shadow-2xs'
                      : 'bg-white text-brand-slate-700 border-brand-slate-200 hover:border-brand-teal-300 hover:bg-brand-teal-50/40'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-md flex items-center justify-center text-[10px] ${
                    isSelected ? 'bg-white text-brand-teal-700 font-black' : 'border border-brand-slate-300'
                  }`}>
                    {isSelected ? '✓' : ''}
                  </span>
                  <span>{spec}</span>
                </button>
              );
            })}
          </div>

          {/* Add Custom Specialization Input */}
          <div className="pt-2 border-t border-brand-slate-200/80">
            <label className="block text-xs font-bold text-brand-navy-900 mb-1.5">
              Add Custom Specialization
            </label>
            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                value={customSpecInput}
                onChange={(e) => setCustomSpecInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSpec(e);
                  }
                }}
                placeholder="e.g. Robotic Bariatric Surgery, Pediatric Cardiac..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 text-brand-navy-900"
              />
              <button
                type="button"
                onClick={handleAddCustomSpec}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-navy-900 border border-brand-slate-300 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-brand-teal-600" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: REQUEST FORWARDING DETAILS */}
        <div className="bg-brand-slate-50/70 p-4 sm:p-5 rounded-2xl border border-brand-slate-200/90 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-brand-slate-200">
            <span className="p-1.5 rounded-lg bg-brand-coral-50 text-brand-coral-700 border border-brand-coral-200">
              <Share2 className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-brand-navy-950 uppercase tracking-wide">
                4. Request Forwarding Details
              </h4>
              <p className="text-[11px] text-brand-slate-500">
                Configure preferred channel and notification recipient endpoints for patient leads
              </p>
            </div>
          </div>

          {/* Preferred Notification Method Radio/Buttons */}
          <div>
            <label className="block text-xs font-bold text-brand-navy-900 mb-2">
              Preferred Notification Method
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'WhatsApp', label: 'WhatsApp', icon: MessageSquare, desc: 'Instant WhatsApp dispatch' },
                { id: 'Email', label: 'Email', icon: Mail, desc: 'Official email referral' },
                { id: 'Both', label: 'Both (WhatsApp + Email)', icon: Share2, desc: 'Dual notification' }
              ].map((method) => {
                const isSelected = formData.preferredNotification === method.id;
                const Icon = method.icon;
                return (
                  <button
                    type="button"
                    key={method.id}
                    onClick={() => {
                      setFormData({ ...formData, preferredNotification: method.id });
                      // Clear method-specific errors when user changes method
                      setErrors((prev) => ({
                        ...prev,
                        whatsappNumber: null,
                        notificationEmail: null
                      }));
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-white border-brand-teal-600 ring-2 ring-brand-teal-500/20 shadow-xs'
                        : 'bg-white/60 border-brand-slate-200 hover:bg-white text-brand-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-teal-600' : 'text-brand-slate-400'}`} />
                      <span className={`text-xs font-black ${isSelected ? 'text-brand-navy-950' : 'text-brand-slate-700'}`}>
                        {method.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-brand-slate-500 mt-1">{method.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notification Endpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {/* WhatsApp Number Field */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              formData.preferredNotification === 'WhatsApp' || formData.preferredNotification === 'Both'
                ? 'bg-emerald-50/50 border-emerald-200'
                : 'bg-brand-slate-100/60 border-brand-slate-200 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-brand-navy-900 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Number</span>
                  {(formData.preferredNotification === 'WhatsApp' || formData.preferredNotification === 'Both') && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                {formData.contactMobile && (
                  <button
                    type="button"
                    onClick={handleCopyMobileToWhatsApp}
                    className="text-[10px] font-bold text-emerald-700 hover:underline"
                  >
                    Use Contact Mobile
                  </button>
                )}
              </div>
              <FormInput
                id="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={(e) => {
                  setFormData({ ...formData, whatsappNumber: e.target.value });
                  if (errors.whatsappNumber) setErrors({ ...errors, whatsappNumber: null });
                }}
                placeholder="+91 98450 11223"
                error={errors.whatsappNumber}
                disabled={formData.preferredNotification === 'Email'}
              />
              <p className="text-[10px] text-brand-slate-500 mt-1">
                {formData.preferredNotification === 'Email'
                  ? 'Disabled (Email-only method selected)'
                  : 'Patient inquiries will be previewed and formatted for WhatsApp dispatch'}
              </p>
            </div>

            {/* Notification Email Field */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              formData.preferredNotification === 'Email' || formData.preferredNotification === 'Both'
                ? 'bg-blue-50/50 border-blue-200'
                : 'bg-brand-slate-100/60 border-brand-slate-200 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-brand-navy-900 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>Notification Email Address</span>
                  {(formData.preferredNotification === 'Email' || formData.preferredNotification === 'Both') && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                {formData.contactEmail && (
                  <button
                    type="button"
                    onClick={handleCopyEmailToNotification}
                    className="text-[10px] font-bold text-blue-700 hover:underline"
                  >
                    Use Contact Email
                  </button>
                )}
              </div>
              <FormInput
                id="notificationEmail"
                type="email"
                value={formData.notificationEmail}
                onChange={(e) => {
                  setFormData({ ...formData, notificationEmail: e.target.value });
                  if (errors.notificationEmail) setErrors({ ...errors, notificationEmail: null });
                }}
                placeholder="surgery-leads@arhospital.org"
                error={errors.notificationEmail}
                disabled={formData.preferredNotification === 'WhatsApp'}
              />
              <p className="text-[10px] text-brand-slate-500 mt-1">
                {formData.preferredNotification === 'WhatsApp'
                  ? 'Disabled (WhatsApp-only method selected)'
                  : 'Clinical summaries and patient contacts will be routed to this email'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 5: HOSPITAL STATUS */}
        <div className="bg-brand-slate-50/70 p-4 sm:p-5 rounded-2xl border border-brand-slate-200/90 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-brand-slate-200">
            <span className="p-1.5 rounded-lg bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-300">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-brand-navy-950 uppercase tracking-wide">
                5. Hospital Status
              </h4>
              <p className="text-[11px] text-brand-slate-500">
                Active hospitals are recommended for new patient surgery inquiries. Inactive hospitals remain in the directory for auditing but cannot receive new referrals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: 'Active', statusReason: '' })}
              className={`p-4 rounded-xl border text-left transition-all ${
                formData.status === 'Active'
                  ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-white border-brand-slate-200 hover:bg-brand-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-emerald-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
                {formData.status === 'Active' && (
                  <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-slate-600 mt-1">
                Hospital is operational and eligible for surgery patient inquiry matching & referrals.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: 'Inactive' })}
              className={`p-4 rounded-xl border text-left transition-all ${
                formData.status === 'Inactive'
                  ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400/20 shadow-xs'
                  : 'bg-white border-brand-slate-200 hover:bg-brand-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-brand-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  Inactive
                </span>
                {formData.status === 'Inactive' && (
                  <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-300">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-slate-600 mt-1">
                Remains listed in directory, but excluded from surgery request matching suggestions.
              </p>
            </button>
          </div>

          {formData.status === 'Inactive' && (
            <div className="pt-2">
              <FormInput
                label="Reason for Inactive Status (Optional)"
                id="statusReason"
                value={formData.statusReason}
                onChange={(e) => setFormData({ ...formData, statusReason: e.target.value })}
                placeholder="e.g. Renovation of modular OT suites, license renewal in progress..."
              />
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}
