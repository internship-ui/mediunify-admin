import React, { useState } from 'react';
import { Building2, X, Plus, Check, ShieldCheck, MapPin, Phone, Mail, Boxes } from 'lucide-react';
import { EQUIPMENT_CATEGORIES, RENTAL_CITIES } from '../../../data/equipmentRentalData';

export default function AddVendorModal({
  isOpen,
  onClose,
  onAddVendor
}) {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    contact: '+91 ',
    email: '',
    address: '',
    city: 'Mysore',
    state: 'Karnataka',
    pincode: '570001',
    location: '',
    equipmentCategories: ['Wheelchair', 'Hospital Bed'],
    equipmentStock: { 'Wheelchair': 10, 'Hospital Bed': 5 },
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleCategoryToggle = (cat) => {
    setFormData((prev) => {
      const exists = prev.equipmentCategories.includes(cat);
      if (exists) {
        const nextStock = { ...prev.equipmentStock };
        delete nextStock[cat];
        return {
          ...prev,
          equipmentCategories: prev.equipmentCategories.filter((c) => c !== cat),
          equipmentStock: nextStock
        };
      } else {
        return {
          ...prev,
          equipmentCategories: [...prev.equipmentCategories, cat],
          equipmentStock: {
            ...prev.equipmentStock,
            [cat]: 10
          }
        };
      }
    });
  };

  const handleStockChange = (cat, count) => {
    const val = Math.max(1, parseInt(count, 10) || 1);
    setFormData((prev) => ({
      ...prev,
      equipmentStock: {
        ...prev.equipmentStock,
        [cat]: val
      }
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Vendor / Owner name is required';
    if (!formData.businessName.trim()) errs.businessName = 'Business / Company name is required';
    if (!formData.contact.trim() || formData.contact.length < 10) errs.contact = 'Valid contact phone number is required';
    if (!formData.location.trim()) errs.location = 'Location / Area is required';
    if (formData.equipmentCategories.length === 0) errs.categories = 'Select at least one equipment category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newVendor = {
      id: `VEND-00${Math.floor(11 + Math.random() * 88)}`,
      name: formData.name.trim(),
      businessName: formData.businessName.trim(),
      contact: formData.contact.trim(),
      email: formData.email.trim() || `contact@${formData.businessName.toLowerCase().replace(/\s+/g, '')}.in`,
      address: formData.address.trim() || `${formData.location.trim()}, ${formData.city}`,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      location: `${formData.city} (${formData.location.trim()})`,
      equipmentCategories: formData.equipmentCategories,
      equipmentStock: formData.equipmentStock,
      registrationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: formData.status,
      rejectionReason: null,
      documents: [
        { name: 'Business Registration Document (Manual)', type: 'PDF Document', size: '1.5 MB', status: 'Verified' },
        { name: 'Medical Equipment Dealership Proof', type: 'PDF Document', size: '1.2 MB', status: 'Verified' }
      ],
      rentalActivity: {
        totalRequests: 0,
        acceptedRequests: 0,
        completedRentals: 0,
        cancelledRentals: 0
      }
    };

    if (onAddVendor) onAddVendor(newVendor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between bg-brand-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-brand-navy-900 text-sm">Add Vendor Manually</h3>
              <p className="text-[11px] text-brand-slate-500">
                Register supplier with equipment categories and declared stock capacity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-brand-slate-400 hover:text-brand-slate-700 p-1.5 rounded-lg hover:bg-brand-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-slate-400">
              Basic Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Vendor / Owner Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 ${
                    errors.name ? 'border-brand-coral-500 bg-coral-50/20' : 'border-brand-slate-200'
                  }`}
                />
                {errors.name && <p className="text-[10px] text-brand-coral-600 mt-0.5">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Business / Company Name *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. CareFirst Medical Equipment"
                  className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 ${
                    errors.businessName ? 'border-brand-coral-500 bg-coral-50/20' : 'border-brand-slate-200'
                  }`}
                />
                {errors.businessName && <p className="text-[10px] text-brand-coral-600 mt-0.5">{errors.businessName}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="+91 98450 12345"
                  className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 ${
                    errors.contact ? 'border-brand-coral-500 bg-coral-50/20' : 'border-brand-slate-200'
                  }`}
                />
                {errors.contact && <p className="text-[10px] text-brand-coral-600 mt-0.5">{errors.contact}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="vendor@company.com"
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Address */}
          <div className="space-y-3 pt-2 border-t border-brand-slate-100">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-slate-400">
              Address & Operating Location
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="#12, Main Market Road, Commercial Complex"
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                >
                  {RENTAL_CITIES.filter((c) => c !== 'All Cities').map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Location / Zone *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Jayalakshmipuram / Whitefield"
                  className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 ${
                    errors.location ? 'border-brand-coral-500 bg-coral-50/20' : 'border-brand-slate-200'
                  }`}
                />
                {errors.location && <p className="text-[10px] text-brand-coral-600 mt-0.5">{errors.location}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="570001"
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Equipment Categories & Unit Quantities (Multi-select) */}
          <div className="space-y-3 pt-2 border-t border-brand-slate-100">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-slate-400">
              Equipment Categories & Declared Stock Units *
            </h4>
            <p className="text-[11px] text-brand-slate-500">
              Select equipment provided and specify available unit stock:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200">
              {EQUIPMENT_CATEGORIES.map((cat) => {
                const isSelected = formData.equipmentCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryToggle(cat)}
                    className={`px-2 py-1.5 rounded-lg text-left text-[11px] font-semibold transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-brand-teal-600 text-white border-brand-teal-600'
                        : 'bg-white text-brand-slate-700 border-brand-slate-200 hover:border-brand-teal-300'
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {isSelected && <Check className="w-3 h-3 flex-shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
            {errors.categories && <p className="text-[10px] text-brand-coral-600">{errors.categories}</p>}

            {/* Selected Categories Stock Unit Inputs */}
            {formData.equipmentCategories.length > 0 && (
              <div className="p-3 bg-teal-50/40 rounded-xl border border-teal-100 space-y-2">
                <span className="text-[11px] font-bold text-teal-900 block">
                  Available Quantity per Category:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formData.equipmentCategories.map((cat) => (
                    <div
                      key={cat}
                      className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-teal-200 text-xs font-semibold text-slate-800"
                    >
                      <span className="truncate">{cat}:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="500"
                          value={formData.equipmentStock?.[cat] || 10}
                          onChange={(e) => handleStockChange(cat, e.target.value)}
                          className="w-16 px-2 py-1 border border-slate-200 rounded text-center text-xs font-mono font-bold text-teal-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                        <span className="text-[10px] text-slate-400 font-normal">units</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Account Status */}
          <div className="space-y-2 pt-2 border-t border-brand-slate-100">
            <label className="text-xs font-bold text-brand-slate-700 block">
              Account Status *
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-brand-slate-800">
                <input
                  type="radio"
                  name="accountStatus"
                  value="Active"
                  checked={formData.status === 'Active'}
                  onChange={() => setFormData({ ...formData, status: 'Active' })}
                  className="accent-brand-teal-600 w-4 h-4"
                />
                <span>Active (Ready for automated requests)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-brand-slate-800">
                <input
                  type="radio"
                  name="accountStatus"
                  value="Inactive"
                  checked={formData.status === 'Inactive'}
                  onChange={() => setFormData({ ...formData, status: 'Inactive' })}
                  className="accent-brand-slate-600 w-4 h-4"
                />
                <span>Inactive</span>
              </label>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-brand-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-brand-slate-600 hover:bg-brand-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-teal-700 hover:bg-brand-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vendor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
