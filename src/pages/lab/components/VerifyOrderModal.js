import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileCheck,
  User,
  Calendar,
  Building2,
  TestTube2,
  Pipette,
  ShieldCheck,
  MapPin,
  Clock,
  CreditCard,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function VerifyOrderModal({
  isOpen,
  onClose,
  order,
  onConfirmVerify,
  onCancelOrder
}) {
  const { addToast } = useToast();
  const [verificationNote, setVerificationNote] = useState('Prescription & all 7 clinical test requirements verified. Approved for phlebotomy assignment.');
  const [rejectReason, setRejectReason] = useState('');
  const [changeNotes, setChangeNotes] = useState('');
  const [mode, setMode] = useState('verify'); // 'verify' | 'reject' | 'change'

  if (!isOpen || !order) return null;

  const bookedItem = order.bookedItem || {
    name: order.testOrPackage?.name || 'Complete Health Screening Package',
    code: order.testOrPackage?.code || 'PKG-CHS-01',
    type: 'Package',
    category: 'Full Body Health Screening',
    description: 'Comprehensive 7-panel screening package.',
    price: order.totalAmount || 3499,
    tat: '8 - 12 Hours',
    fastingRequired: true,
    preparation: 'Follow the preparation instructions configured for the booked tests/package.'
  };

  const detailedTests = order.includedTests || [];

  const handleVerify = () => {
    onConfirmVerify(order.orderId, verificationNote);
    addToast(`Order ${order.orderId} verified & approved. Ready for Phlebotomist Assignment.`, 'success');
    onClose();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      addToast('Please provide a reason for rejecting the order', 'warning');
      return;
    }
    onCancelOrder(order.orderId, rejectReason);
    addToast(`Order ${order.orderId} rejected / cancelled`, 'info');
    onClose();
  };

  const handleRequestChange = () => {
    if (!changeNotes.trim()) {
      addToast('Please specify the requested change for patient or dispatcher', 'warning');
      return;
    }
    addToast(`Change requested for Order ${order.orderId}: ${changeNotes}`, 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-teal-50 text-brand-teal-700 rounded-lg border border-brand-teal-200">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-brand-navy-900">
                Admin Order Verification & Clinical Approval
              </h3>
              <p className="text-xs text-brand-slate-500 font-mono">
                Order ID: <strong>{order.orderId}</strong> • Status: <span className="font-bold text-brand-teal-700">{order.orderStatus}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Verification Checklist Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          {/* Complete Checklist Visual Summary */}
          <div className="p-4 bg-brand-slate-50 rounded-2xl border border-brand-slate-200 space-y-3">
            
            {/* 1. PATIENT DETAILS */}
            <div className="flex items-start justify-between border-b border-brand-slate-200/70 pb-2">
              <span className="text-brand-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
                <User className="w-3 h-3 text-brand-teal-600" /> 1. Patient Details:
              </span>
              <div className="text-right">
                <strong className="text-brand-navy-900 text-sm block">{order.patient?.name}</strong>
                <span className="text-brand-slate-600 text-[11px] font-mono">{order.patient?.patientId} • {order.patient?.age} Y, {order.patient?.gender} • {order.patient?.phone}</span>
              </div>
            </div>

            {/* 2. BOOKING DETAILS & DATE & TIME */}
            <div className="flex items-start justify-between border-b border-brand-slate-200/70 pb-2">
              <span className="text-brand-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-brand-teal-600" /> 2. Booking Date & Time:
              </span>
              <div className="text-right">
                <strong className="text-brand-navy-900">{order.collection?.scheduledDate || order.preferredDate} ({order.collection?.scheduledTime || order.preferredTimeSlot})</strong>
                <span className="text-brand-slate-500 text-[11px] block">Placed on {order.bookingDate}</span>
              </div>
            </div>

            {/* 3. BOOKED TEST / PACKAGE */}
            <div className="flex items-start justify-between border-b border-brand-slate-200/70 pb-2">
              <span className="text-brand-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
                <TestTube2 className="w-3 h-3 text-brand-teal-600" /> 3. Booked Investigation:
              </span>
              <div className="text-right">
                <strong className="text-brand-teal-800 text-sm block">{bookedItem.name}</strong>
                <span className="text-[11px] text-brand-slate-600 font-mono">Code: {bookedItem.code} • {bookedItem.type}</span>
              </div>
            </div>

            {/* 4. TESTS INCLUDED */}
            <div className="border-b border-brand-slate-200/70 pb-2 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-brand-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
                  <Layers className="w-3 h-3 text-brand-teal-600" /> 4. Tests Included ({detailedTests.length}):
                </span>
                <span className="font-bold text-brand-teal-700 text-[10px]">All {detailedTests.length} Validated</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {detailedTests.map((t, idx) => (
                  <div key={idx} className="p-1.5 bg-white rounded-lg border border-brand-slate-200 text-[11px] flex items-center justify-between">
                    <span className="font-medium text-brand-navy-900">{idx + 1}. {t.name}</span>
                    <span className="font-mono text-[10px] text-brand-slate-400">{t.sampleRequired}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. SAMPLE REQUIREMENTS */}
            <div className="flex items-start justify-between border-b border-brand-slate-200/70 pb-2">
              <span className="text-brand-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
                <Pipette className="w-3 h-3 text-brand-teal-600" /> 5. Required Samples & Containers:
              </span>
              <div className="text-right text-[11px] text-brand-navy-900 space-y-0.5">
                <p>• Blood: <strong>EDTA blood collection tube</strong> (CBC, HbA1c)</p>
                <p>• Blood: <strong>Sodium Fluoride & SST Gel tubes</strong> (Glucose, Lipids, LFT, KFT)</p>
                <p>• Urine: <strong>Sterile Urine specimen container</strong> (Urinalysis)</p>
              </div>
            </div>

            {/* 6. PATIENT PREPARATION */}
            <div className="flex items-start justify-between border-b border-brand-slate-200/70 pb-2">
              <span className="text-brand-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-brand-teal-600" /> 6. Patient Preparation:
              </span>
              <div className="text-right">
                <span className="font-bold text-brand-coral-700 bg-brand-coral-50 px-2 py-0.5 rounded text-[11px] border border-brand-coral-200">
                  Fasting Required: Yes (10 - 12 Hours)
                </span>
                <p className="text-[11px] text-brand-slate-500 mt-0.5">Clean-catch midstream morning urine</p>
              </div>
            </div>

            {/* 7. COLLECTION METHOD & ADDRESS */}
            <div className="flex items-start justify-between border-b border-brand-slate-200/70 pb-2">
              <span className="text-brand-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-brand-teal-600" /> 7. Collection Method & Address:
              </span>
              <div className="text-right">
                <strong className="text-brand-navy-900 block">{order.collection?.method || order.bookingType}</strong>
                <span className="text-brand-slate-600 text-[11px]">{order.patient?.address}</span>
              </div>
            </div>

            {/* 8. PAYMENT */}
            <div className="flex items-start justify-between">
              <span className="text-brand-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-brand-teal-600" /> 8. Payment Status:
              </span>
              <div className="text-right">
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
                  ₹{order.totalAmount} • {order.paymentStatus} ({order.paymentMethod || 'Online'})
                </span>
              </div>
            </div>

          </div>

          {/* Verification Mode Switcher */}
          <div className="flex items-center gap-2 p-1 bg-brand-slate-100 rounded-xl">
            <button
              onClick={() => setMode('verify')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                mode === 'verify'
                  ? 'bg-white text-brand-teal-800 shadow-xs'
                  : 'text-brand-slate-600 hover:text-brand-slate-900'
              }`}
            >
              Verify & Approve Order
            </button>
            <button
              onClick={() => setMode('change')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                mode === 'change'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-brand-slate-600 hover:text-brand-slate-900'
              }`}
            >
              Request Change
            </button>
            <button
              onClick={() => setMode('reject')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                mode === 'reject'
                  ? 'bg-white text-brand-coral-700 shadow-xs'
                  : 'text-brand-slate-600 hover:text-brand-slate-900'
              }`}
            >
              Reject Order
            </button>
          </div>

          {/* Form Fields for Active Mode */}
          {mode === 'verify' && (
            <div>
              <label className="block text-xs font-bold text-brand-slate-700 mb-1">
                Verification Notes & Approval Protocol
              </label>
              <textarea
                rows={2}
                value={verificationNote}
                onChange={(e) => setVerificationNote(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-brand-slate-200 font-medium"
              />
              <p className="text-[11px] text-brand-slate-400 mt-1">
                Status will transition from <strong>NEW</strong> → <strong>VERIFIED</strong>.
              </p>
            </div>
          )}

          {mode === 'change' && (
            <div>
              <label className="block text-xs font-bold text-amber-800 mb-1">
                Notes for Requested Change (Time Slot / Fasting / Address)
              </label>
              <textarea
                rows={2}
                value={changeNotes}
                onChange={(e) => setChangeNotes(e.target.value)}
                placeholder="Specify the requested modification for customer or phlebotomy team..."
                className="w-full p-2.5 text-xs rounded-xl border border-amber-300 font-medium"
              />
            </div>
          )}

          {mode === 'reject' && (
            <div>
              <label className="block text-xs font-bold text-brand-coral-700 mb-1">
                Reason for Rejection / Cancellation
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-brand-coral-300 font-medium"
              >
                <option value="">Select cancellation reason...</option>
                <option value="Customer requested cancellation">Customer requested cancellation</option>
                <option value="Patient outside service coverage area">Patient outside service coverage area</option>
                <option value="Clinical contraindication or invalid prescription">Clinical contraindication or invalid prescription</option>
                <option value="Other administrative reason">Other administrative reason</option>
              </select>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-brand-slate-700 font-semibold text-xs rounded-xl border border-brand-slate-200 hover:bg-brand-slate-100"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {mode === 'verify' && (
              <button
                onClick={handleVerify}
                className="px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                VERIFY ORDER (NEW → VERIFIED)
              </button>
            )}

            {mode === 'change' && (
              <button
                onClick={handleRequestChange}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
              >
                REQUEST CHANGE
              </button>
            )}

            {mode === 'reject' && (
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-brand-coral-600 hover:bg-brand-coral-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
              >
                REJECT ORDER
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
