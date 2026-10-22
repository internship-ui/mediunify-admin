import React, { useState } from 'react';
import { Package, X, Plus, Check, Boxes, Layers, IndianRupee } from 'lucide-react';
import { EQUIPMENT_CATEGORIES } from '../../../data/equipmentRentalData';

export default function AddEquipmentModal({
  isOpen,
  onClose,
  vendors = [],
  onAddEquipment
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Wheelchair',
    vendor: vendors[0]?.name || 'Sri Sai Medical Rentals',
    rentalPrice: 1500,
    dailyRate: 100,
    stockTotal: 10,
    condition: 'Excellent',
    features: ''
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Equipment name is required';
    if (!formData.rentalPrice || formData.rentalPrice <= 0) errs.price = 'Valid rental price is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const matchedVendor = vendors.find((v) => v.name === formData.vendor);

    const newEquipment = {
      id: `EQ-${Math.floor(220 + Math.random() * 80)}`,
      name: formData.name.trim(),
      category: formData.category,
      vendor: formData.vendor,
      vendorId: matchedVendor?.id || 'VEND-001',
      dailyRate: Number(formData.dailyRate) || Math.round(Number(formData.rentalPrice) / 15),
      rentalPrice: Number(formData.rentalPrice),
      unit: 'Per Month',
      availability: 'Available',
      stockTotal: Number(formData.stockTotal) || 10,
      stockRented: 0,
      condition: formData.condition,
      features: formData.features.trim() || 'Medical-grade standard certified equipment with full sanitization protocol.',
      status: 'Active'
    };

    if (onAddEquipment) onAddEquipment(newEquipment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between bg-brand-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-brand-navy-900 text-sm">Add Equipment to Inventory</h3>
              <p className="text-[11px] text-brand-slate-500">
                Register new medical equipment item for patient rental catalog
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
          {/* Equipment Name */}
          <div>
            <label className="text-xs font-bold text-brand-slate-700 block mb-1">
              Equipment Name & Model *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. 5-Function Motorized ICU Bed"
              className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 ${
                errors.name ? 'border-brand-coral-500 bg-coral-50/20' : 'border-brand-slate-200'
              }`}
            />
            {errors.name && <p className="text-[10px] text-brand-coral-600 mt-0.5">{errors.name}</p>}
          </div>

          {/* Category & Supplying Vendor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Equipment Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
              >
                {EQUIPMENT_CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Supplying Vendor Partner *
              </label>
              <select
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name} ({v.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Stock Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Rental Price (₹/mo) *
              </label>
              <input
                type="number"
                value={formData.rentalPrice}
                onChange={(e) => setFormData({ ...formData, rentalPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-bold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Daily Rate (₹/day)
              </label>
              <input
                type="number"
                value={formData.dailyRate}
                onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-bold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Initial Stock Qty
              </label>
              <input
                type="number"
                value={formData.stockTotal}
                onChange={(e) => setFormData({ ...formData, stockTotal: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-bold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
              />
            </div>
          </div>

          {/* Condition & Features */}
          <div>
            <label className="text-xs font-bold text-brand-slate-700 block mb-1">
              Unit Condition & Certifications
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            >
              <option value="Sterilized / Certified">Sterilized / Certified</option>
              <option value="Excellent">Excellent</option>
              <option value="Like New">Like New</option>
              <option value="Calibrated">Calibrated</option>
              <option value="Sanitized & Tested">Sanitized & Tested</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate-700 block mb-1">
              Key Features / Technical Specifications
            </label>
            <textarea
              rows={2}
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="e.g. Remote control backrest elevation, high purity oxygen sensor, whisper quiet pump."
              className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            />
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
              <span>Add Equipment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
