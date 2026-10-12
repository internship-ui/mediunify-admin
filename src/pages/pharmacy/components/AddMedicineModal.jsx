import React, { useState, useRef } from 'react';
import {
  Pill,
  X,
  Plus,
  Check,
  Upload,
  Image as ImageIcon,
  Camera,
  Trash2,
  Sparkles,
  Link2,
  AlertCircle
} from 'lucide-react';
import {
  PHARMACY_CATEGORIES,
  DOSAGE_FORMS,
  PHARMACY_SUPPLIERS,
  MEDICINE_PHOTO_PRESETS
} from '../../../data/pharmacyData';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function AddMedicineModal({
  isOpen,
  onClose,
  onSave,
  onSaveMedicine,
  suppliers = PHARMACY_SUPPLIERS,
  initialData = null
}) {
  const fileInputRef = useRef(null);
  useLockBodyScroll(isOpen, onClose);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    genericName: initialData?.genericName || '',
    category: initialData?.category || PHARMACY_CATEGORIES[0],
    medicineType: initialData?.medicineType || 'Allopathic',
    strength: initialData?.strength || '',
    dosageForm: initialData?.dosageForm || 'Tablet',
    manufacturer: initialData?.manufacturer || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    prescriptionRequired: initialData ? initialData.prescriptionRequired : false,
    availableStock: initialData?.availableStock !== undefined ? initialData.availableStock : 100,
    minimumStock: initialData?.minimumStock || 50,
    reorderLevel: initialData?.reorderLevel || 100,
    supplier: initialData?.supplier || (suppliers[0]?.name || 'ABC Pharma Distributors'),
    purchasePrice: initialData?.purchasePrice || '',
    sellingPrice: initialData?.sellingPrice || '',
    batchNumber: initialData?.batchNumber || `BAT26-${Math.floor(100 + Math.random() * 900)}`,
    expiryDate: initialData?.expiryDate || 'Dec 2027'
  });

  const [errors, setErrors] = useState({});
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  // Handle local file upload (converts to base64)
  const handleFileUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Please select a valid image file (PNG, JPG, WEBP)' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image size should be below 5MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({ ...prev, image: e.target?.result }));
      setErrors((prev) => ({ ...prev, image: null }));
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Medicine Name is required';
    if (!formData.genericName.trim()) errs.genericName = 'Generic Name is required';
    if (!formData.strength.trim()) errs.strength = 'Strength is required (e.g. 500mg)';
    if (!formData.sellingPrice || Number(formData.sellingPrice) <= 0) errs.sellingPrice = 'Valid selling price is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const stock = Number(formData.availableStock || 0);
    const minStock = Number(formData.minimumStock || 50);
    let status = 'In Stock';
    if (stock === 0) status = 'Out of Stock';
    else if (stock <= minStock) status = 'Low Stock';

    const medicineObj = {
      ...formData,
      id: initialData?.id || `MED0${Math.floor(10 + Math.random() * 90)}`,
      availableStock: stock,
      minimumStock: minStock,
      reorderLevel: Number(formData.reorderLevel || 100),
      purchasePrice: Number(formData.purchasePrice || 0),
      sellingPrice: Number(formData.sellingPrice || 0),
      status
    };

    const saveFn = onSave || onSaveMedicine;
    if (saveFn) {
      saveFn(medicineObj);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-brand-slate-100 flex items-center justify-between bg-brand-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-green-50 text-brand-green-700 border border-brand-green-200">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-brand-navy-900 text-sm sm:text-base">
                {initialData ? 'Edit Medicine SKU' : 'Add New Medicine SKU'}
              </h3>
              <p className="text-[11px] text-brand-slate-500">
                Register pharmaceutical item with packaging photos & verification data
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[78vh] overflow-y-auto text-xs">
          
          {/* Section: Medicine Packaging Photo */}
          <div className="p-4 rounded-xl bg-brand-slate-50 border border-brand-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-navy-900 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-brand-teal-600" />
                  Medicine Packaging Photo *
                </h4>
                <p className="text-[11px] text-brand-slate-500">
                  Required for visual verification during picking, packing, and patient cart delivery
                </p>
              </div>

              {formData.image && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: '' })}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Photo</span>
                </button>
              )}
            </div>

            {/* Photo Preview / Upload Dropzone */}
            {formData.image ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-white rounded-xl border border-brand-slate-200">
                <div className="relative group shrink-0">
                  <img
                    src={formData.image}
                    alt="Medicine Packaging Preview"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-brand-slate-200 shadow-xs"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 bg-white text-brand-navy-900 rounded-lg text-xs font-bold shadow-xs hover:bg-brand-slate-100"
                      title="Replace Photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-1.5 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Photo Attached & Verified
                  </div>
                  <p className="font-bold text-brand-navy-900 text-xs">
                    {formData.name || 'New Medicine Packaging Image'}
                  </p>
                  <p className="text-[11px] text-brand-slate-500 leading-tight">
                    This photo will be displayed on the inventory table, cart details, and pick/pack verification checklist.
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] font-bold text-brand-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" /> Change Photo
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-5 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer ${
                  isDragging
                    ? 'border-brand-teal-500 bg-brand-teal-50/60'
                    : 'border-brand-slate-300 hover:border-brand-teal-500 bg-white hover:bg-brand-teal-50/20'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-brand-teal-50 text-brand-teal-600 mx-auto flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="font-bold text-brand-navy-900 text-xs">
                  Click to upload medicine photo or drag and drop
                </p>
                <p className="text-[11px] text-brand-slate-400 mt-0.5">
                  Supports PNG, JPG, or WEBP up to 5MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files?.[0])}
            />

            {errors.image && (
              <p className="text-[10px] text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.image}
              </p>
            )}

            {/* Quick Packaging Presets */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-slate-500 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Or Select Quick Packaging Preset:
                </span>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-[10px] text-brand-teal-700 hover:underline font-semibold flex items-center gap-0.5"
                >
                  <Link2 className="w-3 h-3" /> {showUrlInput ? 'Hide URL' : 'Paste Image URL'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MEDICINE_PHOTO_PRESETS.map((preset) => {
                  const isSelected = formData.image === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, image: preset.url });
                        setErrors((prev) => ({ ...prev, image: null }));
                      }}
                      className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-brand-teal-600 bg-brand-teal-50/70 ring-1 ring-brand-teal-600'
                          : 'border-brand-slate-200 bg-white hover:border-brand-slate-300 hover:bg-brand-slate-50'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-7 h-7 rounded-md object-cover border border-brand-slate-200 shrink-0"
                      />
                      <span className="text-[10px] font-bold text-brand-navy-900 truncate">
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Optional Custom URL Input */}
              {showUrlInput && (
                <div className="flex items-center gap-2 pt-1.5">
                  <input
                    type="url"
                    placeholder="https://example.com/medicine-photo.jpg"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-brand-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customImageUrl.trim()) {
                        setFormData({ ...formData, image: customImageUrl.trim() });
                        setCustomImageUrl('');
                        setShowUrlInput(false);
                      }
                    }}
                    className="px-3 py-1.5 bg-brand-navy-900 text-white rounded-lg text-xs font-bold hover:bg-brand-navy-800"
                  >
                    Apply URL
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Basic Details */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-slate-400 mb-2">
              Medicine Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Paracetamol 500mg"
                  className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 ${
                    errors.name ? 'border-brand-coral-500 bg-coral-50/20' : 'border-brand-slate-200'
                  }`}
                />
                {errors.name && <p className="text-[10px] text-brand-coral-600 mt-0.5">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Generic Name / Formula *
                </label>
                <input
                  type="text"
                  value={formData.genericName}
                  onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                  placeholder="e.g. Paracetamol (Acetaminophen)"
                  className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 ${
                    errors.genericName ? 'border-brand-coral-500 bg-coral-50/20' : 'border-brand-slate-200'
                  }`}
                />
                {errors.genericName && <p className="text-[10px] text-brand-coral-600 mt-0.5">{errors.genericName}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Medicine Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                >
                  {PHARMACY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Dosage Form *
                </label>
                <select
                  value={formData.dosageForm}
                  onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                >
                  {DOSAGE_FORMS.map((form) => (
                    <option key={form} value={form}>
                      {form}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Strength *
                </label>
                <input
                  type="text"
                  value={formData.strength}
                  onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                  placeholder="e.g. 500mg, 100 IU/ml"
                  className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 ${
                    errors.strength ? 'border-brand-coral-500 bg-coral-50/20' : 'border-brand-slate-200'
                  }`}
                />
                {errors.strength && <p className="text-[10px] text-brand-coral-600 mt-0.5">{errors.strength}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Medicine Type
                </label>
                <select
                  value={formData.medicineType}
                  onChange={(e) => setFormData({ ...formData, medicineType: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                >
                  <option value="Allopathic">Allopathic</option>
                  <option value="Generic">Generic</option>
                  <option value="Ayurvedic / Herbal">Ayurvedic / Herbal</option>
                  <option value="OTC / Wellness">OTC / Wellness</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Manufacturer / Brand House
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="e.g. Micro Labs Ltd, Cipla, Sun Pharma"
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Description / Clinical Indication
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Analgesic and antipyretic for fever, headache, and body aches."
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                />
              </div>
            </div>
          </div>

          {/* Prescription & Inventory Configuration */}
          <div className="pt-2 border-t border-brand-slate-100">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-slate-400 mb-2">
              Inventory & Reorder Levels
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Initial Available Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.availableStock}
                  onChange={(e) => setFormData({ ...formData, availableStock: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Minimum Stock Level *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumStock}
                  onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Reorder Level *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                />
              </div>
            </div>
          </div>

          {/* Supplier & Pricing */}
          <div className="pt-2 border-t border-brand-slate-100">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-slate-400 mb-2">
              Supplier & Commercial Pricing
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Primary Supplier *
                </label>
                <select
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                >
                  {suppliers.map((s) => (
                    <option key={s.id || s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Purchase Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  placeholder="e.g. 1.20"
                  className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  placeholder="e.g. 2.00"
                  className={`w-full px-3 py-2 bg-brand-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 ${
                    errors.sellingPrice ? 'border-brand-coral-500 bg-coral-50/20' : 'border-brand-slate-200'
                  }`}
                />
                {errors.sellingPrice && <p className="text-[10px] text-brand-coral-600 mt-0.5">{errors.sellingPrice}</p>}
              </div>
            </div>
          </div>

          {/* Schedule H / Prescription Required Toggle */}
          <div className="pt-2 border-t border-brand-slate-100 flex items-center justify-between p-3 bg-brand-slate-50 rounded-xl">
            <div>
              <span className="text-xs font-bold text-brand-navy-900 block">
                Prescription Required (Schedule H / H1 / X)
              </span>
              <span className="text-[11px] text-brand-slate-500">
                Requires digital pharmacist verification before picking in Central Hub
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.prescriptionRequired}
                onChange={(e) => setFormData({ ...formData, prescriptionRequired: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-brand-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green-600" />
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-brand-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-brand-slate-600 hover:bg-brand-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-green-600 hover:bg-brand-green-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Medicine SKU</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
