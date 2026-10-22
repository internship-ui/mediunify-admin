import React, { useState, useEffect } from 'react';
import { Building2, Phone, CheckCircle, AlertCircle, ShieldCheck, ChevronDown, Check, CreditCard, Banknote } from 'lucide-react';

export default function VendorSelector({
  vendors = [],
  selectedVendorName,
  onVendorChange,
  request,
  onConfirmVendor,
  rentalPrice = 1500,
  deliveryCharge = 200,
  additionalCharges = 0,
  discount = 0,
  onPriceChange
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);

  // Synchronize chosen vendor object
  useEffect(() => {
    const found = vendors.find((v) => v.name === selectedVendorName) || vendors[0];
    setCurrentVendor(found || null);
  }, [selectedVendorName, vendors]);

  const totalAmount = Number(rentalPrice) + Number(deliveryCharge) + Number(additionalCharges) - Number(discount);

  const handleSelect = (e) => {
    const name = e.target.value;
    if (onVendorChange) onVendorChange(name);
    const matched = vendors.find((v) => v.name === name);
    setCurrentVendor(matched || null);
  };

  const handleConfirmAction = () => {
    if (onConfirmVendor && currentVendor) {
      onConfirmVendor(currentVendor.name, totalAmount);
    }
    setShowConfirmModal(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-50 text-brand-teal-700 border border-brand-teal-200">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900">
              Confirmed Vendor Selection
            </h3>
            <p className="text-[11px] text-brand-slate-500">
              Select verified vendor to assign for fulfillment
            </p>
          </div>
        </div>

        {request?.status === 'Vendor Confirmed' && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-green-700 bg-brand-green-50 px-2.5 py-1 rounded-full border border-brand-green-200">
            <CheckCircle className="w-3.5 h-3.5" /> Vendor Confirmed
          </span>
        )}
      </div>

      {/* Vendor Selection Dropdown */}
      <div>
        <label className="text-xs font-bold text-brand-slate-700 block mb-1.5">
          Select Vendor from Registered Directory
        </label>
        <div className="relative">
          <select
            value={currentVendor?.name || ''}
            onChange={handleSelect}
            className="w-full pl-3.5 pr-9 py-2.5 bg-brand-slate-50 border border-brand-slate-200 rounded-xl text-xs font-bold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:bg-white transition-all appearance-none cursor-pointer"
          >
            {vendors.map((v) => (
              <option key={v.id} value={v.name}>
                {v.name} — {v.city} ({v.deliverySLA || '2-4 hrs'})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-brand-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Live Breakdown Details */}
      {currentVendor && (
        <div className="p-4 rounded-xl bg-brand-slate-50/80 border border-brand-slate-200/90 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-brand-slate-200/70">
            <div>
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Vendor Name</span>
              <span className="font-bold text-brand-navy-900 text-sm flex items-center gap-1.5 mt-0.5">
                {currentVendor.name}
                {currentVendor.verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-teal-600" />
                )}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Vendor Phone</span>
              <a
                href={`tel:${currentVendor.contact}`}
                className="font-bold text-brand-teal-700 hover:underline flex items-center gap-1 mt-0.5"
              >
                <Phone className="w-3 h-3 text-brand-teal-600" />
                <span>{currentVendor.contact}</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-white border border-brand-slate-200/60">
              <span className="text-[10px] text-brand-slate-400 font-semibold uppercase block">Equipment</span>
              <span className="font-bold text-brand-slate-800 truncate block mt-0.5">
                {request?.equipment || 'Equipment'}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-brand-slate-200/60">
              <span className="text-[10px] text-brand-slate-400 font-semibold uppercase block">Quantity</span>
              <span className="font-bold text-brand-slate-800 block mt-0.5">
                {request?.quantity || 1} Unit(s)
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-brand-slate-200/60">
              <span className="text-[10px] text-brand-slate-400 font-semibold uppercase block">Rental Period</span>
              <span className="font-bold text-brand-slate-800 block mt-0.5 truncate">
                {request?.rentalStartDate} - {request?.rentalEndDate}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-brand-slate-200/60">
              <span className="text-[10px] text-brand-slate-400 font-semibold uppercase block">Delivery SLA</span>
              <span className="font-bold text-brand-green-700 block mt-0.5 truncate">
                {currentVendor.deliverySLA || '2-4 Hours'}
              </span>
            </div>
          </div>

          {/* Pricing Summary Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-brand-slate-600 font-medium">
              <span>Rental: <strong className="text-brand-slate-900">₹{Number(rentalPrice).toLocaleString()}</strong></span>
              <span>Delivery: <strong className="text-brand-slate-900">₹{Number(deliveryCharge).toLocaleString()}</strong></span>
              {discount > 0 && <span>Discount: <strong className="text-brand-green-700">-₹{Number(discount).toLocaleString()}</strong></span>}
            </div>

            <div className="text-right">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Total Amount</span>
              <span className="text-base font-extrabold text-brand-teal-700">
                ₹{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Vendor Trigger Button */}
      <div className="pt-1 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          disabled={!currentVendor}
          className="px-5 py-2.5 bg-brand-teal-700 hover:bg-brand-teal-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2 active:scale-98"
        >
          <Check className="w-4 h-4" />
          <span>Confirm Vendor</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
            <div className="p-5 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200 mx-auto flex items-center justify-center shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-brand-navy-900">
                Confirm Vendor Assignment
              </h3>
              <p className="text-xs text-brand-slate-600 leading-relaxed px-4">
                Are you sure you want to confirm <strong className="text-brand-navy-900">{currentVendor?.name}</strong> for this rental request #{request?.id}?
              </p>
              <div className="p-3 bg-brand-slate-50 rounded-xl text-xs text-brand-slate-700 text-left border border-brand-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span>Vendor:</span>
                  <span className="font-bold text-brand-navy-900">{currentVendor?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contact:</span>
                  <span className="font-bold text-brand-teal-700">{currentVendor?.contact}</span>
                </div>
                <div className="flex justify-between">
                  <span>Equipment:</span>
                  <span className="font-bold text-brand-navy-900">{request?.equipment}</span>
                </div>
                <div className="flex justify-between border-t border-brand-slate-200/80 pt-1 font-bold">
                  <span>Total Amount:</span>
                  <span className="text-brand-teal-700">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-brand-slate-50 border-t border-brand-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-bold text-brand-slate-600 hover:bg-brand-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-4 py-2 text-xs font-bold bg-brand-teal-700 hover:bg-brand-teal-800 text-white rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Vendor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
