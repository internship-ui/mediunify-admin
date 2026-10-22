import React, { useState } from 'react';
import { Phone, PhoneCall, Building2, MapPin, CheckCircle2, ShieldCheck, Clock, Check, X, AlertCircle } from 'lucide-react';

export default function ContactVendorModal({
  isOpen,
  onClose,
  vendor,
  request,
  onConfirmSelection
}) {
  const [checklist, setChecklist] = useState({
    stockAvailable: true,
    deliveryConfirmed: true,
    sanitized: true,
    pricingAgreed: true
  });
  const [adminNotes, setAdminNotes] = useState('');

  if (!isOpen || !vendor) return null;

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between bg-brand-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-brand-navy-900 text-sm">Vendor Phone Coordination</h3>
              <p className="text-[11px] text-brand-slate-500">
                Confirm stock availability & SLA before assigning vendor
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

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Vendor Card Snapshot */}
          <div className="p-4 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-navy-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-brand-navy-900 text-sm flex items-center gap-1.5">
                  {vendor.name}
                  {vendor.verified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-teal-600" />
                  )}
                </h4>
                <p className="text-xs text-brand-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{vendor.location}</span>
                </p>
              </div>
            </div>

            {/* Dial Button */}
            <a
              href={`tel:${vendor.contact}`}
              className="px-3 py-2 bg-brand-green-600 hover:bg-brand-green-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all inline-flex items-center gap-1.5 active:scale-95 flex-shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call {vendor.contact}</span>
            </a>
          </div>

          {/* Request Requirements to Discuss */}
          {request && (
            <div className="p-3.5 rounded-xl bg-teal-50/50 border border-brand-teal-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-navy-900">Request #{request.id} Requirements</span>
                <span className="font-bold text-brand-teal-800">Qty: {request.quantity || 1} unit(s)</span>
              </div>
              <p className="text-brand-slate-700 font-semibold">
                Equipment: <span className="text-brand-navy-900 font-bold">{request.equipment}</span>
              </p>
              <p className="text-brand-slate-600 text-[11px]">
                Delivery Location: {request.deliveryAddress || request.deliveryLocation}
              </p>
              <p className="text-brand-slate-600 text-[11px]">
                Rental Period: {request.rentalStartDate} to {request.rentalEndDate} ({request.rentalDays || 7} days)
              </p>
            </div>
          )}

          {/* Discussion Checklist */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-brand-slate-700 mb-2">
              Admin Verification Checklist
            </h5>
            <div className="space-y-2 text-xs">
              <label
                onClick={() => toggleCheck('stockAvailable')}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  checklist.stockAvailable
                    ? 'bg-brand-green-50/60 border-brand-green-300 text-brand-green-900'
                    : 'bg-white border-brand-slate-200 text-brand-slate-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    checklist.stockAvailable
                      ? 'bg-brand-green-600 border-brand-green-600 text-white'
                      : 'border-brand-slate-300'
                  }`}
                >
                  {checklist.stockAvailable && <Check className="w-3 h-3" />}
                </div>
                <span className="font-semibold">Vendor confirmed equipment is physically in stock & ready</span>
              </label>

              <label
                onClick={() => toggleCheck('deliveryConfirmed')}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  checklist.deliveryConfirmed
                    ? 'bg-brand-green-50/60 border-brand-green-300 text-brand-green-900'
                    : 'bg-white border-brand-slate-200 text-brand-slate-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    checklist.deliveryConfirmed
                      ? 'bg-brand-green-600 border-brand-green-600 text-white'
                      : 'border-brand-slate-300'
                  }`}
                >
                  {checklist.deliveryConfirmed && <Check className="w-3 h-3" />}
                </div>
                <span className="font-semibold">Vendor agreed to delivery SLA ({vendor.deliverySLA || '2-4 hours'})</span>
              </label>

              <label
                onClick={() => toggleCheck('sanitized')}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  checklist.sanitized
                    ? 'bg-brand-green-50/60 border-brand-green-300 text-brand-green-900'
                    : 'bg-white border-brand-slate-200 text-brand-slate-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    checklist.sanitized
                      ? 'bg-brand-green-600 border-brand-green-600 text-white'
                      : 'border-brand-slate-300'
                  }`}
                >
                  {checklist.sanitized && <Check className="w-3 h-3" />}
                </div>
                <span className="font-semibold">Equipment sanitized and calibrated according to medical standard</span>
              </label>

              <label
                onClick={() => toggleCheck('pricingAgreed')}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  checklist.pricingAgreed
                    ? 'bg-brand-green-50/60 border-brand-green-300 text-brand-green-900'
                    : 'bg-white border-brand-slate-200 text-brand-slate-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    checklist.pricingAgreed
                      ? 'bg-brand-green-600 border-brand-green-600 text-white'
                      : 'border-brand-slate-300'
                  }`}
                >
                  {checklist.pricingAgreed && <Check className="w-3 h-3" />}
                </div>
                <span className="font-semibold">Rental rate and delivery charge verified</span>
              </label>
            </div>
          </div>

          {/* Admin Note Input */}
          <div>
            <label className="text-[11px] font-bold text-brand-slate-600 block mb-1">
              Call Log / Discussion Notes (Optional)
            </label>
            <input
              type="text"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g., Spoke with Mr. Ramesh, unit will be dispatched by 2 PM."
              className="w-full px-3 py-2 text-xs border border-brand-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-brand-slate-50 border-t border-brand-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-brand-slate-600 hover:bg-brand-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              if (onConfirmSelection) onConfirmSelection(vendor, adminNotes);
              onClose();
            }}
            disabled={!allChecked}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 ${
              allChecked
                ? 'bg-brand-teal-700 hover:bg-brand-teal-800 text-white active:scale-95'
                : 'bg-brand-slate-200 text-brand-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Select Vendor</span>
          </button>
        </div>
      </div>
    </div>
  );
}
