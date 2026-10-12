import React, { useState } from 'react';
import { Building2, X, Plus, Check } from 'lucide-react';

export default function AddSupplierModal({
  isOpen,
  onClose,
  onSaveSupplier,
  initialData = null
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    contactPerson: initialData?.contactPerson || '',
    phone: initialData?.phone || '+91 ',
    email: initialData?.email || '',
    address: initialData?.address || '',
    medicinesSupplied: initialData?.medicinesSupplied?.join(', ') || '',
    status: initialData?.status || 'Active'
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Supplier company name is required';
    if (!formData.contactPerson.trim()) errs.contactPerson = 'Contact person name is required';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = 'Valid phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const supplierObj = {
      id: initialData?.id || `SUP00${Math.floor(10 + Math.random() * 90)}`,
      name: formData.name.trim(),
      contactPerson: formData.contactPerson.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || `contact@${formData.name.toLowerCase().replace(/\s+/g, '')}.in`,
      address: formData.address.trim() || 'Bangalore Industrial Logistics Park',
      medicinesSupplied: formData.medicinesSupplied
        ? formData.medicinesSupplied.split(',').map((s) => s.trim()).filter(Boolean)
        : ['General Pharmaceutical Supplies'],
      status: formData.status
    };

    onSaveSupplier(supplierObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-brand-slate-100 flex items-center justify-between bg-brand-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-brand-navy-900 text-sm sm:text-base">
                {initialData ? 'Edit Pharmaceutical Supplier' : 'Add New Supplier'}
              </h3>
              <p className="text-[11px] text-brand-slate-500">
                Register supplier details for purchase stock receipts
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Supplier / Company Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. ABC Pharma Distributors"
                className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 ${
                  errors.name ? 'border-brand-coral-500 bg-coral-50/20' : 'border-brand-slate-200'
                }`}
              />
              {errors.name && <p className="text-[10px] text-brand-coral-600 mt-0.5">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 ${
                    errors.contactPerson ? 'border-brand-coral-500 bg-coral-50/20' : 'border-brand-slate-200'
                  }`}
                />
                {errors.contactPerson && <p className="text-[10px] text-brand-coral-600 mt-0.5">{errors.contactPerson}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98450 12345"
                  className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 ${
                    errors.phone ? 'border-brand-coral-500 bg-coral-50/20' : 'border-brand-slate-200'
                  }`}
                />
                {errors.phone && <p className="text-[10px] text-brand-coral-600 mt-0.5">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="orders@abcpharma.in"
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Warehouse / Physical Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="#12, Industrial Area, Peenya, Bangalore - 560058"
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Medicines Supplied (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.medicinesSupplied}
                  onChange={(e) => setFormData({ ...formData, medicinesSupplied: e.target.value })}
                  placeholder="e.g. Paracetamol 500mg, Amoxicillin 500mg, Dolo 650mg"
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                />
              </div>
            </div>

            {/* Status */}
            <div className="pt-2 border-t border-brand-slate-100">
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Supplier Account Status
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-brand-slate-800">
                  <input
                    type="radio"
                    name="supplierStatus"
                    value="Active"
                    checked={formData.status === 'Active'}
                    onChange={() => setFormData({ ...formData, status: 'Active' })}
                    className="accent-brand-teal-600 w-4 h-4"
                  />
                  <span>Active (Authorized for restock orders)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-brand-slate-800">
                  <input
                    type="radio"
                    name="supplierStatus"
                    value="Inactive"
                    checked={formData.status === 'Inactive'}
                    onChange={() => setFormData({ ...formData, status: 'Inactive' })}
                    className="accent-brand-slate-600 w-4 h-4"
                  />
                  <span>Inactive</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
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
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Update Supplier' : 'Save Supplier'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
