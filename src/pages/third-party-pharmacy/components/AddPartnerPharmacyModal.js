import React, { useState, useEffect } from 'react';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Building2,
  CreditCard,
  FileText,
  Clock
} from 'lucide-react';
import Modal from '../../../components/common/Modal';

const CATEGORY_OPTIONS = [
  'Cold Chain / Insulin',
  'Cardiac & Hypertension',
  'Diabetic Care',
  'Specialty Oncology',
  'Critical Injections',
  'Dermatology',
  'Generic Replacements',
  'Pediatric Formulations',
  'Emergency Antibiotics',
  'Respiratory Inhalers'
];

export default function AddPartnerPharmacyModal({
  isOpen,
  onClose,
  onSavePartner,
  editingPartner = null
}) {
  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    licenseNumber: '',
    gstin: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    area: 'Kuvempunagar',
    pincode: '570023',
    deliveryRadiusKm: 6.0,
    distanceFromHubKm: 3.0,
    maxDailyCapacity: 40,
    verificationStatus: 'Verified',
    operationalStatus: 'Active',
    categoriesSupported: ['Cold Chain / Insulin', 'Diabetic Care'],
    bankAccountName: '',
    bankAccountNumber: '',
    bankIfsc: '',
    bankName: ''
  });

  useEffect(() => {
    if (editingPartner) {
      setFormData({
        name: editingPartner.name || '',
        shortCode: editingPartner.shortCode || '',
        licenseNumber: editingPartner.licenseNumber || '',
        gstin: editingPartner.gstin || '',
        contactPerson: editingPartner.contactPerson || '',
        phone: editingPartner.phone || '',
        email: editingPartner.email || '',
        address: editingPartner.address || '',
        area: editingPartner.area || 'Kuvempunagar',
        pincode: editingPartner.pincode || '570023',
        deliveryRadiusKm: editingPartner.deliveryRadiusKm || 6.0,
        distanceFromHubKm: editingPartner.distanceFromHubKm || 3.0,
        maxDailyCapacity: editingPartner.maxDailyCapacity || 40,
        verificationStatus: editingPartner.verificationStatus || 'Verified',
        operationalStatus: editingPartner.operationalStatus || 'Active',
        categoriesSupported: editingPartner.categoriesSupported || [],
        bankAccountName: editingPartner.bankDetails?.accountName || '',
        bankAccountNumber: editingPartner.bankDetails?.accountNumber || '',
        bankIfsc: editingPartner.bankDetails?.ifsc || '',
        bankName: editingPartner.bankDetails?.bank || ''
      });
    } else {
      setFormData({
        name: '',
        shortCode: '',
        licenseNumber: '',
        gstin: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        area: 'Kuvempunagar',
        pincode: '570023',
        deliveryRadiusKm: 6.0,
        distanceFromHubKm: 3.0,
        maxDailyCapacity: 40,
        verificationStatus: 'Verified',
        operationalStatus: 'Active',
        categoriesSupported: ['Cold Chain / Insulin', 'Diabetic Care'],
        bankAccountName: '',
        bankAccountNumber: '',
        bankIfsc: '',
        bankName: ''
      });
    }
  }, [editingPartner, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleCategory = (cat) => {
    setFormData((prev) => {
      const exists = prev.categoriesSupported.includes(cat);
      return {
        ...prev,
        categoriesSupported: exists
          ? prev.categoriesSupported.filter((c) => c !== cat)
          : [...prev.categoriesSupported, cat]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.licenseNumber) return;

    const partnerPayload = {
      ...(editingPartner || {}),
      name: formData.name,
      shortCode:
        formData.shortCode ||
        formData.name
          .replace(/[^a-zA-Z]/g, '')
          .slice(0, 6)
          .toUpperCase(),
      licenseNumber: formData.licenseNumber,
      gstin: formData.gstin || '29ABCDE1234F1Z5',
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      area: formData.area,
      city: 'Mysore',
      pincode: formData.pincode,
      deliveryRadiusKm: Number(formData.deliveryRadiusKm) || 5,
      distanceFromHubKm: Number(formData.distanceFromHubKm) || 2.5,
      rating: editingPartner?.rating || 4.8,
      reviewsCount: editingPartner?.reviewsCount || 42,
      fulfillmentRate: editingPartner?.fulfillmentRate || 98.0,
      avgDeliveryMins: editingPartner?.avgDeliveryMins || 30,
      activeOrdersLoad: editingPartner?.activeOrdersLoad || 0,
      maxDailyCapacity: Number(formData.maxDailyCapacity) || 40,
      verificationStatus: formData.verificationStatus,
      operationalStatus: formData.operationalStatus,
      joinedDate: editingPartner?.joinedDate || 'Today',
      categoriesSupported: formData.categoriesSupported,
      bankDetails: {
        accountName: formData.bankAccountName || formData.name,
        accountNumber: formData.bankAccountNumber || '••••••••5512',
        ifsc: formData.bankIfsc || 'HDFC0001248',
        bank: formData.bankName || 'HDFC Bank, Mysore'
      }
    };

    onSavePartner(partnerPayload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPartner ? 'Edit Partner Pharmacy' : 'Register New Partner Pharmacy'}
      subtitle="Onboard accredited retail and specialty pharmacies to fulfill unavailable medicines"
      maxWidth="max-w-3xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{editingPartner ? 'Save Changes' : 'Register Partner'}</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Business & License Information */}
        <div className="bg-brand-slate-50/70 p-4 rounded-2xl border border-brand-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-navy-900">
            <Store className="w-4 h-4 text-brand-teal-600" />
            <span>Pharmacy Business & Regulatory Credentials</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
                Pharmacy / Business Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. MedPlus Pharmacy (Gokulam)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
                Short Identifier Code
              </label>
              <input
                type="text"
                name="shortCode"
                value={formData.shortCode}
                onChange={handleChange}
                placeholder="e.g. MEDPLUS-GOK"
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
                Drug License Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="licenseNumber"
                required
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="e.g. KA-MYS-20B-89104"
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
                GSTIN Number
              </label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                placeholder="e.g. 29ABCDE1234F1Z5"
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Pharmacist in Charge */}
        <div className="bg-brand-slate-50/70 p-4 rounded-2xl border border-brand-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-navy-900">
            <Building2 className="w-4 h-4 text-brand-teal-600" />
            <span>Contact & Pharmacist in Charge</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
                Pharmacist / Contact Person
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="e.g. Rajesh Sharma, B.Pharm"
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98450 12345"
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
                Partner Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="partner@pharmacy.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
              Store Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="#45, Main Road, Area, Mysore"
              className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
                Area / Locality
              </label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. Jayalakshmipuram"
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="570012"
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
                Delivery Radius (km)
              </label>
              <input
                type="number"
                step="0.5"
                name="deliveryRadiusKm"
                value={formData.deliveryRadiusKm}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
                Hub Distance (km)
              </label>
              <input
                type="number"
                step="0.1"
                name="distanceFromHubKm"
                value={formData.distanceFromHubKm}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Status & Verification */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
              Verification Status
            </label>
            <select
              name="verificationStatus"
              value={formData.verificationStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500 font-semibold"
            >
              <option value="Verified">Verified (Active in Router)</option>
              <option value="Under Review">Under Review (Document check)</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
              Operational Status
            </label>
            <select
              name="operationalStatus"
              value={formData.operationalStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500 font-semibold"
            >
              <option value="Active">Active (Accepting Orders)</option>
              <option value="Inactive">Inactive (Paused)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
              Daily Order Capacity
            </label>
            <input
              type="number"
              name="maxDailyCapacity"
              value={formData.maxDailyCapacity}
              onChange={handleChange}
              placeholder="40"
              className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500 font-mono"
            />
          </div>
        </div>

        {/* Section 4: Specialities / Supported Categories */}
        <div>
          <label className="block text-[11px] font-bold text-brand-slate-700 mb-1.5">
            Supported Medicine Formulations & Categories
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_OPTIONS.map((cat) => {
              const active = formData.categoriesSupported.includes(cat);
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all ${
                    active
                      ? 'bg-brand-teal-50 border-brand-teal-300 text-brand-teal-800 font-bold'
                      : 'bg-white border-brand-slate-200 text-brand-slate-600 hover:border-brand-slate-300'
                  }`}
                >
                  {cat} {active && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: Payout Bank Details */}
        <div className="bg-brand-teal-50/30 p-3.5 rounded-2xl border border-brand-teal-100 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-teal-900">
            <CreditCard className="w-3.5 h-3.5 text-brand-teal-600" />
            <span>Settlement & Bank Details (For Payouts)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-brand-slate-600 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                name="bankAccountName"
                value={formData.bankAccountName}
                onChange={handleChange}
                placeholder="MedPlus Enterprises"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-brand-slate-200 bg-white font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-brand-slate-600 mb-1">
                Bank & Branch
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="HDFC Bank, Kuvempunagar"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-brand-slate-200 bg-white font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-brand-slate-600 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                name="bankIfsc"
                value={formData.bankIfsc}
                onChange={handleChange}
                placeholder="HDFC0001248"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-brand-slate-200 bg-white font-mono"
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
