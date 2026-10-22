import React, { useState, useEffect } from 'react';
import { Building2, X, Plus, Check, ShieldCheck, MapPin, Phone, Mail, Edit2 } from 'lucide-react';
import { EQUIPMENT_CATEGORIES, RENTAL_CITIES } from '../../../data/equipmentRentalData';

export default function AddVendorModal({
  isOpen,
  onClose,
  onAddVendor,
  onEditVendor,
  vendorToEdit = null
}) {
  const isEdit = !!vendorToEdit;

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    contact: '+91 ',
    email: '',
    address: '',
    city: 'Mysore',
    serviceArea: '',
    serviceAreas: ['Gokulam', 'Jayalakshmipuram'],
    equipmentCategories: ['Wheelchair', 'Hospital Bed'],
    equipmentStock: { 'Wheelchair': 10, 'Hospital Bed': 5 },
    verificationStatus: 'Verified',
    status: 'Active'
  });

  const [serviceAreaInput, setServiceAreaInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vendorToEdit) {
      setFormData({
        name: vendorToEdit.name || '',
        businessName: vendorToEdit.businessName || '',
        contact: vendorToEdit.contact || '+91 ',
        email: vendorToEdit.email || '',
        address: vendorToEdit.address || '',
        city: vendorToEdit.city || 'Mysore',
        serviceArea: vendorToEdit.serviceArea || '',
        serviceAreas: vendorToEdit.serviceAreas || (vendorToEdit.serviceArea ? [vendorToEdit.serviceArea] : ['City Center']),
        equipmentCategories: vendorToEdit.equipmentCategories || ['Wheelchair'],
        equipmentStock: vendorToEdit.equipmentStock || { 'Wheelchair': 10 },
        verificationStatus: vendorToEdit.verificationStatus || 'Verified',
        status: vendorToEdit.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        businessName: '',
        contact: '+91 ',
        email: '',
        address: '',
        city: 'Mysore',
        serviceArea: '',
        serviceAreas: ['Gokulam', 'Jayalakshmipuram'],
        equipmentCategories: ['Wheelchair', 'Hospital Bed'],
        equipmentStock: { 'Wheelchair': 10, 'Hospital Bed': 5 },
        verificationStatus: 'Verified',
        status: 'Active'
      });
    }
    setErrors({});
  }, [vendorToEdit, isOpen]);

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

  const handleAddServiceArea = () => {
    const trimmed = serviceAreaInput.trim();
    if (trimmed && !formData.serviceAreas.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        serviceAreas: [...prev.serviceAreas, trimmed],
        serviceArea: [...prev.serviceAreas, trimmed].join(', ')
      }));
      setServiceAreaInput('');
    }
  };

  const handleRemoveServiceArea = (areaToRemove) => {
    setFormData((prev) => {
      const nextAreas = prev.serviceAreas.filter((a) => a !== areaToRemove);
      return {
        ...prev,
        serviceAreas: nextAreas,
        serviceArea: nextAreas.join(', ')
      };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Contact person / owner name is required';
    if (!formData.businessName.trim()) errs.businessName = 'Vendor / Business name is required';
    if (!formData.contact.trim() || formData.contact.replace(/\D/g, '').length < 10) {
      errs.contact = 'Valid contact phone number (10+ digits) is required';
    }
    if (!formData.address.trim()) errs.address = 'Business address is required';
    if (formData.serviceAreas.length === 0) errs.serviceAreas = 'At least one service area is required';
    if (formData.equipmentCategories.length === 0) errs.categories = 'Select at least one equipment category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit && onEditVendor) {
      const updatedVendor = {
        ...vendorToEdit,
        name: formData.name.trim(),
        businessName: formData.businessName.trim(),
        contact: formData.contact.trim(),
        email: formData.email.trim() || `contact@${formData.businessName.toLowerCase().replace(/\s+/g, '')}.in`,
        address: formData.address.trim(),
        city: formData.city,
        location: `${formData.city} (${formData.serviceAreas[0] || 'Center'})`,
        serviceArea: formData.serviceAreas.join(', '),
        serviceAreas: formData.serviceAreas,
        equipmentCategories: formData.equipmentCategories,
        equipmentStock: formData.equipmentStock,
        verificationStatus: formData.verificationStatus,
        status: formData.status
      };
      onEditVendor(updatedVendor);
    } else if (onAddVendor) {
      const newVendor = {
        id: `VEND-0${Math.floor(11 + Math.random() * 88)}`,
        name: formData.name.trim(),
        businessName: formData.businessName.trim(),
        contact: formData.contact.trim(),
        email: formData.email.trim() || `contact@${formData.businessName.toLowerCase().replace(/\s+/g, '')}.in`,
        address: formData.address.trim(),
        city: formData.city,
        location: `${formData.city} (${formData.serviceAreas[0] || 'Center'})`,
        serviceArea: formData.serviceAreas.join(', '),
        serviceAreas: formData.serviceAreas,
        equipmentCategories: formData.equipmentCategories,
        equipmentStock: formData.equipmentStock,
        registrationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        verificationStatus: formData.verificationStatus,
        status: formData.status,
        rejectionReason: null,
        totalRentalRequests: 0,
        totalRecordedRentalValue: 0,
        documents: [
          { name: 'Business Trade License (GST/MSME)', type: 'PDF Document', size: '1.8 MB', status: formData.verificationStatus === 'Verified' ? 'Verified' : 'Under Review' },
          { name: 'Medical Equipment Dealership Proof', type: 'PDF Document', size: '1.4 MB', status: formData.verificationStatus === 'Verified' ? 'Verified' : 'Under Review' }
        ],
        rentalActivity: {
          totalRequests: 0,
          acceptedRequests: 0,
          completedRentals: 0,
          cancelledRentals: 0
        }
      };
      onAddVendor(newVendor);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-brand-slate-100 flex items-center justify-between bg-brand-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200">
              {isEdit ? <Edit2 className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-brand-navy-900 text-sm sm:text-base">
                {isEdit ? 'Edit Equipment Vendor' : 'Add Equipment Vendor'}
              </h3>
              <p className="text-[11px] text-brand-slate-500">
                {isEdit
                  ? `Update profile, service areas & status for ${vendorToEdit?.businessName || vendorToEdit?.id}`
                  : 'Register a new equipment rental vendor in the directory'}
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
          {/* Section 1: Business & Contact Info */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-slate-400">
              Business & Contact Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Business / Company Name *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Sri Sai Medical Rentals"
                  className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 ${
                    errors.businessName ? 'border-rose-500 bg-rose-50/20' : 'border-brand-slate-200'
                  }`}
                />
                {errors.businessName && <p className="text-[10px] text-rose-600 mt-0.5">{errors.businessName}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Contact Person / Owner *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Suresh Babu"
                  className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 ${
                    errors.name ? 'border-rose-500 bg-rose-50/20' : 'border-brand-slate-200'
                  }`}
                />
                {errors.name && <p className="text-[10px] text-rose-600 mt-0.5">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="+91 98450 11223"
                  className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 ${
                    errors.contact ? 'border-rose-500 bg-rose-50/20' : 'border-brand-slate-200'
                  }`}
                />
                {errors.contact && <p className="text-[10px] text-rose-600 mt-0.5">{errors.contact}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@srisaimedical.in"
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Business Address & Service Areas */}
          <div className="space-y-3 pt-2 border-t border-brand-slate-100">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-slate-400">
              Address & Service Coverage
            </h4>

            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Business Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="#42, 5th Cross, Gokulam 2nd Stage"
                className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 ${
                  errors.address ? 'border-rose-500 bg-rose-50/20' : 'border-brand-slate-200'
                }`}
              />
              {errors.address && <p className="text-[10px] text-rose-600 mt-0.5">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Base City *
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
                  Add Service Area / Locality
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={serviceAreaInput}
                    onChange={(e) => setServiceAreaInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddServiceArea();
                      }
                    }}
                    placeholder="e.g. Gokulam, Kuvempunagar"
                    className="flex-1 px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                  />
                  <button
                    type="button"
                    onClick={handleAddServiceArea}
                    className="px-3 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white rounded-xl font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Service Area Tags */}
            <div>
              <span className="text-[11px] font-semibold text-brand-slate-500 block mb-1.5">
                Covered Service Localities:
              </span>
              <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-brand-slate-50 border border-brand-slate-200 min-h-[38px]">
                {formData.serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200"
                  >
                    <MapPin className="w-3 h-3 text-brand-teal-600" />
                    <span>{area}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveServiceArea(area)}
                      className="ml-0.5 text-brand-teal-600 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {formData.serviceAreas.length === 0 && (
                  <span className="text-brand-slate-400 text-xs italic">No service areas added yet.</span>
                )}
              </div>
              {errors.serviceAreas && <p className="text-[10px] text-rose-600 mt-0.5">{errors.serviceAreas}</p>}
            </div>
          </div>

          {/* Section 3: Equipment Categories & Unit Stock */}
          <div className="space-y-3 pt-2 border-t border-brand-slate-100">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-slate-400">
              Equipment Categories Offered *
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200">
              {EQUIPMENT_CATEGORIES.map((cat) => {
                const isSelected = formData.equipmentCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryToggle(cat)}
                    className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] font-semibold transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-brand-teal-600 text-white border-brand-teal-600 shadow-2xs'
                        : 'bg-white text-brand-slate-700 border-brand-slate-200 hover:border-brand-teal-300'
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {isSelected && <Check className="w-3 h-3 flex-shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
            {errors.categories && <p className="text-[10px] text-rose-600">{errors.categories}</p>}

            {/* Declared Stock Units */}
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

          {/* Section 4: Verification & Operational Status */}
          <div className="space-y-3 pt-2 border-t border-brand-slate-100">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-slate-400">
              Verification & Account Status
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Verification Status *
                </label>
                <select
                  value={formData.verificationStatus}
                  onChange={(e) => setFormData({ ...formData, verificationStatus: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                >
                  <option value="Verified">Verified (Accredited Supplier)</option>
                  <option value="Under Review">Under Review (Pending Docs)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Operational Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                >
                  <option value="Active">Active (Accepting Inquiries)</option>
                  <option value="Inactive">Inactive (Deactivated)</option>
                  <option value="Pending">Pending (Awaiting Activation)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-brand-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-brand-slate-600 hover:bg-brand-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-teal-700 hover:bg-brand-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5 active:scale-95"
            >
              {isEdit ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isEdit ? 'Save Changes' : 'Add Vendor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
