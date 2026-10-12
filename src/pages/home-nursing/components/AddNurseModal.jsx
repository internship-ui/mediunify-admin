import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Award,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Upload,
  CheckCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function AddNurseModal({
  isOpen,
  onClose,
  onAddNurse,
  serviceTypes = []
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    qualification: 'B.Sc Nursing',
    specialization: 'Wound Care & Post-Op',
    selectedServices: ['Wound Dressing', 'Vital Monitoring', 'Injection'],
    street: '',
    locality: 'Kuvempunagar',
    city: 'Mysuru',
    pincode: '570023',
    experience: '5 Years',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHoursStart: '08:00 AM',
    workingHoursEnd: '08:00 PM',
    accountStatus: 'Active',
    status: 'AVAILABLE',
    uploadedDocs: ['Aadhaar Card', 'KNC Nursing Reg Card']
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Mysuru Localities with default GPS coordinates
  const MYSURU_LOCALITIES = [
    { name: 'Kuvempunagar', lat: 12.2890, lng: 76.6240, pincode: '570023' },
    { name: 'Jayalakshmipuram', lat: 12.3214, lng: 76.6278, pincode: '570012' },
    { name: 'Saraswathipuram', lat: 12.3025, lng: 76.6345, pincode: '570009' },
    { name: 'Gokulam', lat: 12.3350, lng: 76.6290, pincode: '570002' },
    { name: 'Vijayanagar', lat: 12.3395, lng: 76.6020, pincode: '570017' },
    { name: 'Ramakrishnanagar', lat: 12.2780, lng: 76.6150, pincode: '570022' },
    { name: 'Hebbal', lat: 12.3510, lng: 76.6110, pincode: '570016' },
    { name: 'JP Nagar', lat: 12.2680, lng: 76.6380, pincode: '570008' },
    { name: 'VV Mohalla', lat: 12.3180, lng: 76.6410, pincode: '570002' },
    { name: 'Siddhartha Layout', lat: 12.3050, lng: 76.6820, pincode: '570011' }
  ];

  const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleToggleService = (srvName) => {
    setFormData((prev) => {
      const exists = prev.selectedServices.includes(srvName);
      return {
        ...prev,
        selectedServices: exists
          ? prev.selectedServices.filter((s) => s !== srvName)
          : [...prev.selectedServices, srvName]
      };
    });
  };

  const handleToggleDay = (day) => {
    setFormData((prev) => {
      const exists = prev.workingDays.includes(day);
      return {
        ...prev,
        workingDays: exists ? prev.workingDays.filter((d) => d !== day) : [...prev.workingDays, day]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Nurse Full Name is required.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Nurse Phone Number is required.');
      return;
    }
    if (formData.selectedServices.length === 0) {
      setError('Please select at least one provided service.');
      return;
    }

    const localityObj = MYSURU_LOCALITIES.find((l) => l.name === formData.locality) || MYSURU_LOCALITIES[0];
    const fullAddress = `${formData.street || '#14, Main Road'}, ${formData.locality}, Mysuru, Karnataka - ${localityObj.pincode}`;

    const newNurse = {
      name: formData.name.startsWith('Nurse') ? formData.name : `Nurse ${formData.name}`,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/[^a-z]/g, '')}.nurse@mediunify.care`,
      qualification: `${formData.qualification} - KNC-${Math.floor(60000 + Math.random() * 39000)}`,
      specialization: formData.specialization,
      services: formData.selectedServices,
      experience: formData.experience,
      rating: 5.0,
      completedVisits: 0,
      accountStatus: formData.accountStatus,
      status: formData.status,
      address: fullAddress,
      locality: formData.locality,
      city: 'Mysuru',
      lat: localityObj.lat + (Math.random() * 0.004 - 0.002),
      lng: localityObj.lng + (Math.random() * 0.004 - 0.002),
      workingDays: formData.workingDays,
      workingHours: `${formData.workingHoursStart} - ${formData.workingHoursEnd}`,
      nextBooking: null,
      upcomingBookings: [],
      documents: formData.uploadedDocs
    };

    onAddNurse(newNurse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-teal-600 text-white font-extrabold flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-slate-900">Add New Registered Nurse</h2>
              <p className="text-xs text-brand-slate-500">
                Register nurse profile, service capability, home address and availability schedule.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-brand-slate-700">
          {error && (
            <div className="p-3 rounded-xl bg-brand-coral-50 border border-brand-coral-200 text-brand-coral-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Personal Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-900 flex items-center gap-1.5 pb-2 border-b border-brand-slate-100">
              <User className="w-4 h-4 text-brand-teal-600" />
              1. Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-brand-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  placeholder="+91 98450 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="nurse@mediunify.care"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Professional Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-900 flex items-center gap-1.5 pb-2 border-b border-brand-slate-100">
              <Award className="w-4 h-4 text-brand-teal-600" />
              2. Professional Information & Services Provided
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-brand-slate-700 mb-1">
                  Nursing Qualification
                </label>
                <select
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                >
                  <option value="B.Sc Nursing">B.Sc Nursing</option>
                  <option value="GNM (General Nursing & Midwifery)">GNM (General Nursing)</option>
                  <option value="M.Sc Nursing (Critical / Palliative)">M.Sc Nursing</option>
                  <option value="Post-Basic B.Sc Nursing">Post-Basic B.Sc</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-slate-700 mb-1">
                  Primary Specialization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wound Care & Geriatrics"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-slate-700 mb-1">
                  Experience
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                >
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                  <option value="5 Years">5 Years</option>
                  <option value="7 Years">7 Years</option>
                  <option value="10+ Years">10+ Years</option>
                </select>
              </div>
            </div>

            {/* Services Provided Multi-select Badges */}
            <div>
              <label className="block text-xs font-semibold text-brand-slate-700 mb-1.5">
                Services Provided (Used for Automatic Matching) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {serviceTypes.map((srv) => {
                  const isChecked = formData.selectedServices.includes(srv.name);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => handleToggleService(srv.name)}
                      className={`p-2 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-brand-teal-50 border-brand-teal-400 text-brand-teal-900 font-bold shadow-2xs'
                          : 'bg-white border-brand-slate-200 text-brand-slate-600 hover:bg-brand-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-brand-teal-600 focus:ring-brand-teal-500"
                      />
                      <span className="truncate">{srv.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Location Information (Mysuru) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-900 flex items-center gap-1.5 pb-2 border-b border-brand-slate-100">
              <MapPin className="w-4 h-4 text-brand-teal-600" />
              3. Registered Home Location (Mysuru)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-brand-slate-700 mb-1">
                  Mysuru Locality *
                </label>
                <select
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                >
                  {MYSURU_LOCALITIES.map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name} ({loc.pincode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-brand-slate-700 mb-1">
                  Street / House Address
                </label>
                <input
                  type="text"
                  placeholder="#112, 8th Block, Double Road"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Availability & Working Hours */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-900 flex items-center gap-1.5 pb-2 border-b border-brand-slate-100">
              <Calendar className="w-4 h-4 text-brand-teal-600" />
              4. Availability & Working Schedule
            </h3>

            <div>
              <label className="block text-xs font-semibold text-brand-slate-700 mb-1.5">
                Working Days
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = formData.workingDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => handleToggleDay(day)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-brand-teal-600 text-white shadow-xs'
                          : 'bg-brand-slate-100 text-brand-slate-600 hover:bg-brand-slate-200'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-brand-slate-700 mb-1">
                  Start Time
                </label>
                <select
                  value={formData.workingHoursStart}
                  onChange={(e) => setFormData({ ...formData, workingHoursStart: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                >
                  <option value="07:00 AM">07:00 AM</option>
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="09:00 AM">09:00 AM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-slate-700 mb-1">
                  End Time
                </label>
                <select
                  value={formData.workingHoursEnd}
                  onChange={(e) => setFormData({ ...formData, workingHoursEnd: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                >
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="07:00 PM">07:00 PM</option>
                  <option value="08:00 PM">08:00 PM</option>
                  <option value="09:00 PM">09:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-slate-700 mb-1">
                  Account Status
                </label>
                <select
                  value={formData.accountStatus}
                  onChange={(e) => setFormData({ ...formData, accountStatus: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                >
                  <option value="Active">Active (Eligible for matching)</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. Mock Document Uploads */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-900 flex items-center gap-1.5 pb-2 border-b border-brand-slate-100">
              <Upload className="w-4 h-4 text-brand-teal-600" />
              5. Verification Documents (Mock Upload)
            </h3>

            <div className="p-4 rounded-xl border border-dashed border-brand-teal-300 bg-brand-teal-50/40 text-center space-y-2">
              <Upload className="w-6 h-6 text-brand-teal-600 mx-auto" />
              <p className="text-xs font-semibold text-brand-slate-700">
                Uploaded: Aadhaar Card, Karnataka Nursing Council (KNC) Reg, Nursing Degree
              </p>
              <p className="text-[11px] text-brand-slate-500">
                Mock document upload for compliance and admin verification.
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-brand-slate-300 text-brand-slate-700 hover:bg-brand-slate-100 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Save & Register Nurse</span>
          </button>
        </div>
      </div>
    </div>
  );
}
