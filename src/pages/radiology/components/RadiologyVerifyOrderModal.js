import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Server,
  Calendar,
  Clock,
  ShieldCheck,
  User
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function RadiologyVerifyOrderModal({
  isOpen,
  onClose,
  order,
  onConfirmVerify,
  onCancelOrder
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);
  const [fastingVerified, setFastingVerified] = useState(true);
  const [contrastClearance, setContrastClearance] = useState(true);
  const [metalScreeningDone, setMetalScreeningDone] = useState(true);
  const [verificationNotes, setVerificationNotes] = useState(
    'Clinical history reviewed. Machine gantry and technician slot confirmed.'
  );

  if (!isOpen || !order) return null;

  const handleVerify = () => {
    if (order.scan?.fastingRequired && !fastingVerified) {
      addToast('Please confirm fasting protocol before approving order.', 'warning');
      return;
    }
    if (order.scan?.contrastRequired && !contrastClearance) {
      addToast('Contrast renal safety clearance is required.', 'warning');
      return;
    }

    onConfirmVerify(order.orderId, verificationNotes);
    addToast(`Order ${order.orderId} verified and confirmed for scheduled slot.`, 'success');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-brand-slate-100 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-teal-50 text-brand-teal-700 rounded-lg border border-brand-teal-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">Verify Imaging Booking & Machine Slot</h3>
              <p className="text-xs text-brand-slate-500">Order ID: <strong className="font-mono text-brand-teal-700">{order.orderId}</strong></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 rounded-lg hover:bg-brand-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Order Summary Card */}
          <div className="p-4 bg-brand-slate-50 rounded-xl border border-brand-slate-200 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-brand-slate-400 text-[11px]">Patient:</p>
                <p className="font-bold text-brand-navy-900 text-sm">{order.patient?.name}</p>
                <p className="text-brand-slate-500">{order.patient?.age}Y, {order.patient?.gender} • {order.patient?.phone}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-brand-teal-800 text-sm">₹{order.totalAmount}</span>
                <p className="text-[10px] text-emerald-600 font-bold uppercase">{order.paymentStatus}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-brand-slate-200 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-brand-slate-400 block">Requested Scan:</span>
                <strong className="text-brand-navy-900">{order.scan?.name}</strong>
              </div>
              <div>
                <span className="text-brand-slate-400 block">Assigned Machine:</span>
                <strong className="text-brand-navy-900 truncate block">{order.machine}</strong>
              </div>
              <div>
                <span className="text-brand-slate-400 block">Center:</span>
                <span className="text-brand-slate-700 truncate block">{order.center?.split('-')[0]}</span>
              </div>
              <div>
                <span className="text-brand-slate-400 block">Slot Time:</span>
                <span className="text-brand-teal-700 font-bold">{order.appointmentDate} ({order.appointmentTime})</span>
              </div>
            </div>
          </div>

          {/* Clinical Checklists */}
          <div className="space-y-2.5 p-3.5 bg-brand-teal-50/40 rounded-xl border border-brand-teal-100">
            <h4 className="font-bold text-brand-navy-900 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-teal-600" />
              Pre-Scan Clinical & Safety Checklist
            </h4>

            {order.scan?.fastingRequired && (
              <label className="flex items-center gap-2 text-brand-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={fastingVerified}
                  onChange={(e) => setFastingVerified(e.target.checked)}
                  className="rounded text-brand-teal-600 focus:ring-brand-teal-500"
                />
                <span>Patient notified of 4 - 6 hours dietary fasting for abdominal/contrast study</span>
              </label>
            )}

            {order.scan?.contrastRequired && (
              <label className="flex items-center gap-2 text-brand-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={contrastClearance}
                  onChange={(e) => setContrastClearance(e.target.checked)}
                  className="rounded text-brand-teal-600 focus:ring-brand-teal-500"
                />
                <span>Renal safety confirmed (Serum Creatinine & eGFR within acceptable limit)</span>
              </label>
            )}

            <label className="flex items-center gap-2 text-brand-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={metalScreeningDone}
                onChange={(e) => setMetalScreeningDone(e.target.checked)}
                className="rounded text-brand-teal-600 focus:ring-brand-teal-500"
              />
              <span>No metallic foreign bodies, pacemaker, or pregnancy contraindications</span>
            </label>
          </div>

          {/* Verification Notes */}
          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">
              Admin Verification Remarks & Preparation Notes:
            </label>
            <textarea
              rows={2}
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 text-xs font-medium"
              placeholder="Add clinical instructions or verification notes..."
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-brand-slate-100 bg-brand-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              const reason = window.prompt('Please enter cancellation reason for patient:');
              if (reason) {
                onCancelOrder(order.orderId, reason);
                onClose();
              }
            }}
            className="text-xs font-bold text-brand-coral-600 hover:underline"
          >
            Reject / Cancel Booking
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-brand-slate-600 font-semibold rounded-xl border border-brand-slate-200 hover:bg-brand-slate-100 text-xs"
            >
              Close
            </button>
            <button
              onClick={handleVerify}
              className="px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm & Verify Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
