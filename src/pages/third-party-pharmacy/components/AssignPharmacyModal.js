import React, { useState } from 'react';
import {
  Store,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package
} from 'lucide-react';
import Modal from '../../../components/common/Modal';

export default function AssignPharmacyModal({
  isOpen,
  onClose,
  order,
  partners = [],
  onAssign
}) {
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');

  if (!order) return null;

  const handleConfirm = () => {
    if (!selectedPartnerId) return;
    const partner = partners.find((p) => p.id === selectedPartnerId);
    onAssign(order.orderId, partner, assignmentNote);
    onClose();
  };

  const activePartners = partners.filter((p) => p.operationalStatus === 'Active');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Third-Party Pharmacy"
      subtitle={`Routing unavailable medicines for ${order.orderId} (Parent: ${order.parentOrderId})`}
      maxWidth="max-w-2xl"
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
            disabled={!selectedPartnerId}
            onClick={handleConfirm}
            className="px-5 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Dispatch Order</span>
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Order Context Banner */}
        <div className="p-3.5 rounded-2xl bg-brand-teal-50/70 border border-brand-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-brand-teal-900 block">
              Patient: {order.patientName} • {order.patientArea} ({order.patientPincode})
            </span>
            <span className="text-brand-teal-700 text-[11px]">
              Delivery Address: {order.patientDeliveryAddress}
            </span>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-brand-teal-200 font-mono font-bold text-brand-teal-800 text-right">
            ₹{order.orderAmount?.toLocaleString()}
          </div>
        </div>

        {/* Unavailable Medicines Summary */}
        <div className="border border-brand-slate-200 rounded-2xl p-4 bg-brand-slate-50/50">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-brand-slate-700">
            <Package className="w-4 h-4 text-amber-600" />
            <span>Unavailable Medicines to Fulfill ({order.unavailableMedicines?.length || 0}):</span>
          </div>
          <div className="space-y-1.5">
            {order.unavailableMedicines?.map((med, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-brand-slate-200/80"
              >
                <div>
                  <span className="font-bold text-brand-navy-900">{med.name}</span>
                  <span className="text-[11px] text-brand-slate-500 block">
                    {med.genericName} • {med.strength} • Qty: {med.quantity}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-brand-slate-800 font-mono">₹{med.total?.toFixed(2)}</span>
                  <span className="text-[10px] text-amber-700 block font-medium">Out of stock in Hub</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Select Partner Pharmacy */}
        <div>
          <label className="block text-xs font-bold text-brand-slate-700 mb-2">
            Select Verified External Pharmacy Partner *
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {activePartners.map((partner) => {
              const isSelected = selectedPartnerId === partner.id;
              return (
                <div
                  key={partner.id}
                  onClick={() => setSelectedPartnerId(partner.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-brand-teal-500 bg-brand-teal-50/50 ring-2 ring-brand-teal-500/20'
                      : 'border-brand-slate-200 bg-white hover:border-brand-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl mt-0.5 ${
                        isSelected ? 'bg-brand-teal-600 text-white' : 'bg-brand-slate-100 text-brand-slate-600'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-brand-navy-900">{partner.name}</span>
                        {partner.verificationStatus === 'Verified' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-teal-700 bg-brand-teal-50 border border-brand-teal-200 px-1.5 py-0.5 rounded-md">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-brand-slate-500 flex items-center gap-2 mt-1">
                        <span><MapPin className="w-3 h-3 inline text-brand-slate-400" /> {partner.area} ({partner.distanceFromHubKm} km)</span>
                        <span>•</span>
                        <span><Clock className="w-3 h-3 inline text-brand-slate-400" /> ~{partner.avgDeliveryMins} mins TAT</span>
                        <span>•</span>
                        <span><Star className="w-3 h-3 inline text-amber-500 fill-amber-500" /> {partner.rating}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-[11px] font-semibold text-brand-slate-500 block">
                      Active: {partner.activeOrdersLoad} orders
                    </span>
                    <input
                      type="radio"
                      name="partnerSelect"
                      checked={isSelected}
                      onChange={() => setSelectedPartnerId(partner.id)}
                      className="mt-1 text-brand-teal-600 focus:ring-brand-teal-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Special Instructions Note */}
        <div>
          <label className="block text-xs font-bold text-brand-slate-700 mb-1.5">
            Dispatch Instructions for External Partner (Optional)
          </label>
          <textarea
            value={assignmentNote}
            onChange={(e) => setAssignmentNote(e.target.value)}
            rows={2}
            placeholder="e.g. Ensure cold-chain insulation pack is used. Priority delivery within 45 minutes."
            className="w-full text-xs rounded-xl border border-brand-slate-200 p-2.5 focus:border-brand-teal-500 focus:ring-1 focus:ring-brand-teal-500 outline-none"
          />
        </div>
      </div>
    </Modal>
  );
}
