import React, { useState } from 'react';
import {
  X,
  Phone,
  Send,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Mail,
  FileText,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Sparkles,
  ArrowRight,
  UserCheck,
  Building2,
  Play,
  RotateCcw,
  Ban,
  Activity,
  HeartHandshake
} from 'lucide-react';
import { findEligibleNurses } from '../../../data/homeCareData';

export default function RequestDetailsModal({
  request,
  nurses = [],
  onClose,
  onCallPatient,
  onSendPaymentLink,
  onSimulatePayment,
  onBroadcastNurses,
  onSimulateNurseAccept,
  onStartService,
  onCompleteService,
  onCancelRequest
}) {
  const [callNotes, setCallNotes] = useState('');
  const [showCallModal, setShowCallModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [enteredAmount, setEnteredAmount] = useState(request?.serviceAmount || 750);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Patient requested reschedule/cancellation');

  if (!request) return null;

  // Compute eligible nurses dynamically
  const eligibleNurses = findEligibleNurses(request, nurses);

  // Status timeline steps in order
  const TIMELINE_STEPS = [
    { key: 'New Request', label: 'New Request' },
    { key: 'Patient Contacted', label: 'Patient Contacted' },
    { key: 'Payment Link Sent', label: 'Payment Link Sent' },
    { key: 'Payment Completed', label: 'Payment Completed' },
    { key: 'Nurses Notified', label: 'Nurses Notified' },
    { key: 'Nurse Accepted', label: 'Nurse Accepted' },
    { key: 'Service In Progress', label: 'In Progress' },
    { key: 'Completed', label: 'Completed' }
  ];

  // Calculate current step index for the timeline
  const getCurrentStepIndex = () => {
    if (request.overallStatus === 'Cancelled') return -1;
    const idx = TIMELINE_STEPS.findIndex((s) => s.key === request.overallStatus);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIdx = getCurrentStepIndex();

  const handleConfirmCall = () => {
    onCallPatient(request.id, callNotes || 'Service requirements and appointment time verified with patient on call.');
    setShowCallModal(false);
  };

  const handleConfirmCancel = () => {
    onCancelRequest(request.id, cancelReason);
    setShowCancelModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-teal-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
              {request.id.replace('HCN-', '#')}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-brand-slate-900">{request.patientName}</h2>
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    request.overallStatus === 'Completed'
                      ? 'bg-brand-green-50 text-brand-green-700 border-brand-green-200'
                      : request.overallStatus === 'Cancelled'
                      ? 'bg-brand-coral-50 text-brand-coral-700 border-brand-coral-200'
                      : request.overallStatus === 'New Request'
                      ? 'bg-brand-coral-50 text-brand-coral-700 border-brand-coral-200'
                      : 'bg-brand-teal-50 text-brand-teal-700 border-brand-teal-200'
                  }`}
                >
                  {request.overallStatus}
                </span>
              </div>
              <p className="text-xs text-brand-slate-500 mt-0.5">
                Service: <span className="font-semibold text-brand-teal-700">{request.serviceRequired}</span> • Preferred: {request.requestedDate}, {request.requestedTime}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-brand-slate-700">
          {/* Status Timeline Stepper */}
          <div className="bg-brand-slate-50 rounded-xl p-4 border border-brand-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-600 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-teal-600" />
                Service Status Flow
              </h3>
              {request.overallStatus === 'Cancelled' && (
                <span className="text-xs font-bold text-brand-coral-600 bg-brand-coral-50 px-2 py-0.5 rounded border border-brand-coral-200">
                  Request Cancelled
                </span>
              )}
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex items-center min-w-[650px] justify-between relative">
                {TIMELINE_STEPS.map((step, idx) => {
                  const isPassed = request.overallStatus !== 'Cancelled' && currentStepIdx >= idx;
                  const isCurrent = request.overallStatus !== 'Cancelled' && currentStepIdx === idx;

                  return (
                    <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                          isCurrent
                            ? 'bg-brand-teal-600 text-white ring-4 ring-brand-teal-100 scale-110'
                            : isPassed
                            ? 'bg-brand-teal-500 text-white'
                            : 'bg-white border-2 border-brand-slate-300 text-brand-slate-400'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] mt-2 text-center font-semibold leading-tight max-w-[80px] ${
                          isCurrent
                            ? 'text-brand-teal-900 font-bold'
                            : isPassed
                            ? 'text-brand-slate-700'
                            : 'text-brand-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top 3 Info Cards Grid: Patient, Care Request, Payment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Patient Details */}
            <div className="bg-white rounded-xl border border-brand-slate-200 p-4 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-slate-900 flex items-center gap-1.5 pb-2 border-b border-brand-slate-100">
                <User className="w-4 h-4 text-brand-teal-600" />
                Patient Details
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-brand-slate-400 block text-[10px]">Name</span>
                  <span className="font-bold text-brand-slate-900">{request.patientName}</span>
                </div>
                <div>
                  <span className="text-brand-slate-400 block text-[10px]">Phone</span>
                  <a href={`tel:${request.patientPhone}`} className="font-semibold text-brand-teal-700 hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {request.patientPhone}
                  </a>
                </div>
                {request.patientEmail && (
                  <div>
                    <span className="text-brand-slate-400 block text-[10px]">Email</span>
                    <span className="text-brand-slate-700">{request.patientEmail}</span>
                  </div>
                )}
                <div>
                  <span className="text-brand-slate-400 block text-[10px]">Service Address</span>
                  <span className="text-brand-slate-800 font-medium flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-slate-400 flex-shrink-0 mt-0.5" />
                    {request.address}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Care Request Details */}
            <div className="bg-white rounded-xl border border-brand-slate-200 p-4 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-slate-900 flex items-center gap-1.5 pb-2 border-b border-brand-slate-100">
                <FileText className="w-4 h-4 text-brand-teal-600" />
                Care Request
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-brand-slate-400 block text-[10px]">Service Required</span>
                  <span className="font-bold text-brand-teal-800 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200 inline-block">
                    {request.serviceRequired}
                  </span>
                </div>
                <div>
                  <span className="text-brand-slate-400 block text-[10px]">Patient Requirement</span>
                  <p className="text-brand-slate-700 font-medium bg-brand-slate-50 p-2 rounded-lg border border-brand-slate-200/80">
                    {request.requirement || 'Home nursing care as requested.'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-brand-slate-400 block text-[10px]">Date</span>
                    <span className="font-semibold text-brand-slate-800">{request.requestedDate}</span>
                  </div>
                  <div>
                    <span className="text-brand-slate-400 block text-[10px]">Time</span>
                    <span className="font-semibold text-brand-slate-800">{request.requestedTime}</span>
                  </div>
                </div>
                {request.additionalNotes && (
                  <div>
                    <span className="text-brand-slate-400 block text-[10px]">Notes</span>
                    <span className="text-brand-slate-600 italic text-[11px]">{request.additionalNotes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Payment Details (Directly Editable by Admin before payment) */}
            <div className="bg-white rounded-xl border border-brand-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-brand-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-slate-900 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-brand-teal-600" />
                  Payment Summary
                </h4>
                {request.paymentStatus !== 'Completed' && (
                  <span className="text-[10px] font-bold text-brand-teal-700 bg-brand-teal-50 px-1.5 py-0.5 rounded border border-brand-teal-200">
                    Editable Fee
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs">
                {request.paymentStatus !== 'Completed' ? (
                  <div>
                    <label className="text-brand-slate-500 block text-[10px] mb-1 font-semibold">
                      Enter Amount to be Paid by Patient (₹)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-brand-slate-400 text-sm">
                          ₹
                        </span>
                        <input
                          type="number"
                          min="50"
                          step="50"
                          value={enteredAmount}
                          onChange={(e) => setEnteredAmount(e.target.value)}
                          className="w-full text-sm font-extrabold pl-6 pr-2 py-1.5 rounded-lg border-2 border-brand-teal-400 bg-brand-teal-50/20 text-brand-slate-900 focus:outline-hidden focus:border-brand-teal-600 focus:bg-white"
                          placeholder="750"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const amt = Number(enteredAmount) > 0 ? Number(enteredAmount) : (request.serviceAmount || 750);
                          onSendPaymentLink(request.id, amt, paymentNotes);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                        title="Save & Send Payment Link"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Link</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-brand-slate-400 block text-[10px]">Paid Amount</span>
                    <span className="text-xl font-extrabold text-brand-slate-900">₹{request.serviceAmount}</span>
                  </div>
                )}

                <div>
                  <span className="text-brand-slate-400 block text-[10px]">Payment Status</span>
                  <span
                    className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      request.paymentStatus === 'Completed'
                        ? 'bg-brand-green-100 text-brand-green-800'
                        : request.paymentStatus === 'Link Sent'
                        ? 'bg-brand-aqua-100 text-brand-aqua-800'
                        : request.paymentStatus === 'Refunded'
                        ? 'bg-brand-coral-100 text-brand-coral-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {request.paymentStatus}
                  </span>
                </div>

                <div>
                  <span className="text-brand-slate-400 block text-[10px]">Payment Link Status</span>
                  <span className="text-brand-slate-700 font-medium">{request.paymentLinkStatus}</span>
                </div>

                {request.paymentDetails && (
                  <div className="bg-brand-teal-50/70 p-2 rounded-lg border border-brand-teal-200 text-[11px] space-y-0.5">
                    <p className="font-semibold text-brand-teal-900">
                      Txn: <span className="font-mono text-brand-teal-800">{request.paymentDetails.transactionId}</span>
                    </p>
                    <p className="text-brand-teal-700">Mode: {request.paymentDetails.mode}</p>
                    <p className="text-brand-teal-700">Paid: {request.paymentDetails.paidAt}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compact Admin Workflow Actions Bar */}
          <div className="bg-gradient-to-r from-brand-teal-50/90 via-white to-brand-slate-50 p-3 sm:p-3.5 rounded-xl border border-brand-teal-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-brand-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-brand-slate-900 truncate flex items-center gap-1.5">
                  {request.paymentStatus === 'Completed'
                    ? 'Automated Dispatch Active'
                    : 'Admin Action Required'}
                </p>
                <p className="text-[11px] text-brand-slate-500 truncate">
                  {request.paymentStatus === 'Completed'
                    ? 'Nurse receives notification & updates progress on Nurse Mobile App.'
                    : 'Confirm service with patient and send payment link.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:self-center flex-shrink-0">
              {/* Step 1: Call Patient (Before payment) */}
              {request.overallStatus === 'New Request' && (
                <button
                  onClick={() => setShowCallModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call & Confirm</span>
                </button>
              )}

              {/* Step 2: Set Fee & Send Payment Link (Before payment) */}
              {request.paymentStatus !== 'Completed' && (request.overallStatus === 'Patient Contacted' || request.overallStatus === 'New Request') && (
                <button
                  onClick={() => {
                    setEnteredAmount(request.serviceAmount || 750);
                    setShowPaymentModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-brand-teal-700 hover:bg-brand-teal-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Set Fee & Send Link</span>
                </button>
              )}

              {/* Step 3: Simulate Patient Payment (For demo/testing before paid) */}
              {request.paymentStatus !== 'Completed' && request.overallStatus !== 'Cancelled' && (
                <button
                  onClick={() => onSimulatePayment(request.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-brand-green-300 hover:bg-brand-green-50 text-brand-green-700 font-semibold text-xs flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                  title="Simulate patient paying online via UPI/GPay"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-green-600" />
                  <span>Simulate Paid</span>
                </button>
              )}

              {/* Once Payment is Completed: Compact Nurse App Control Indicator */}
              {request.paymentStatus === 'Completed' && (
                <div className="flex items-center gap-1.5 bg-brand-teal-100/70 border border-brand-teal-300/80 px-2.5 py-1 rounded-lg text-xs font-semibold text-brand-teal-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-teal-600 animate-pulse" />
                  <span>
                    {request.assignedNurse
                      ? `${request.assignedNurse.nurseName} (Nurse App)`
                      : 'Nurse App Notified'}
                  </span>
                </div>
              )}

              {/* Emergency Cancel Option */}
              {request.overallStatus !== 'Completed' && request.overallStatus !== 'Cancelled' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-2.5 py-1.5 rounded-lg text-brand-coral-600 hover:bg-brand-coral-50 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Ban className="w-3.5 h-3.5 text-brand-coral-500" />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 8: Automatic Nurse Assignment & Eligible Nurses Monitoring */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brand-slate-100">
              <div>
                <h3 className="text-sm font-bold text-brand-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-teal-600" />
                  Automatic Nurse Assignment
                </h3>
                <p className="text-xs text-brand-slate-500 mt-0.5">
                  The Admin does NOT manually assign a nurse. After payment confirmation, the system matches eligible registered nurses automatically.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-slate-600 bg-brand-slate-100 px-3 py-1 rounded-full">
                <span>Matching criteria:</span>
                <span className="text-brand-teal-700">Registered • Active • Skill Match • Proximity</span>
              </div>
            </div>

            {/* Assigned Nurse Box (if accepted) */}
            {request.assignedNurse ? (
              <div className="p-4 rounded-xl bg-gradient-to-r from-brand-teal-50 via-brand-aqua-50 to-white border border-brand-teal-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-brand-teal-900 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-brand-teal-600" />
                    Assigned Nurse (Accepted)
                  </span>
                  <span className="text-[11px] font-bold text-brand-green-700 bg-brand-green-100 px-2.5 py-0.5 rounded-full">
                    Booking Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-brand-slate-500 block text-[10px]">Nurse Name</span>
                    <span className="font-bold text-brand-slate-900">{request.assignedNurse.nurseName}</span>
                  </div>
                  <div>
                    <span className="text-brand-slate-500 block text-[10px]">Phone</span>
                    <a href={`tel:${request.assignedNurse.phone}`} className="font-semibold text-brand-teal-700 hover:underline">
                      {request.assignedNurse.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-brand-slate-500 block text-[10px]">Specialization</span>
                    <span className="font-medium text-brand-slate-800">{request.assignedNurse.specialization}</span>
                  </div>
                  <div>
                    <span className="text-brand-slate-500 block text-[10px]">Distance to Patient</span>
                    <span className="font-bold text-brand-teal-800">{request.assignedNurse.distanceKm} km</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-brand-slate-500 block text-[10px]">Registered Address</span>
                    <span className="text-brand-slate-700 font-medium">{request.assignedNurse.registeredLocation}</span>
                  </div>
                  <div>
                    <span className="text-brand-slate-500 block text-[10px]">Accepted Time</span>
                    <span className="font-semibold text-brand-slate-800">{request.assignedNurse.acceptedAt}</span>
                  </div>
                  <div>
                    <span className="text-brand-slate-500 block text-[10px]">Scheduled Visit</span>
                    <span className="font-semibold text-brand-slate-800">{request.assignedNurse.serviceDateTime}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-brand-teal-100 text-[11px] text-brand-teal-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal-600" />
                  System closed notifications for all other candidate nurses once {request.assignedNurse.nurseName} accepted.
                </div>
              </div>
            ) : null}

            {/* Nurses Notified Broadcast Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-slate-700 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-brand-teal-600" />
                  Nurses Notified
                </h4>
                <span className="text-xs text-brand-slate-500">
                  {request.nursesNotified?.length || 0} notified in Mysuru area
                </span>
              </div>

              {request.nursesNotified && request.nursesNotified.length > 0 ? (
                <div className="space-y-2">
                  {request.nursesNotified.map((n, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                        n.responseStatus === 'Accepted'
                          ? 'bg-brand-green-50/60 border-brand-green-300'
                          : n.responseStatus === 'Declined'
                          ? 'bg-brand-slate-50 border-brand-slate-200 text-brand-slate-400'
                          : 'bg-white border-brand-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            n.responseStatus === 'Accepted'
                              ? 'bg-brand-green-600 text-white'
                              : 'bg-brand-teal-100 text-brand-teal-800'
                          }`}
                        >
                          {n.nurseName.split(' ')[1]?.[0] || 'N'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-slate-900">{n.nurseName}</span>
                            <span className="text-[11px] text-brand-slate-500 font-medium">({n.specialization})</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-brand-slate-500 mt-0.5">
                            <span>Distance: <strong className="text-brand-slate-700">{n.distanceKm} km</strong></span>
                            <span>•</span>
                            <span>{n.availabilityStatus}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            n.responseStatus === 'Accepted'
                              ? 'bg-brand-green-100 text-brand-green-800 border border-brand-green-200'
                              : n.responseStatus === 'Declined'
                              ? 'bg-brand-coral-100 text-brand-coral-800 border border-brand-coral-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                          }`}
                        >
                          {n.responseStatus === 'Accepted'
                            ? 'Accepted'
                            : n.responseStatus === 'Declined'
                            ? 'Declined'
                            : 'Waiting for Response'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-brand-slate-300 bg-brand-slate-50 text-center text-xs text-brand-slate-500">
                  <Clock className="w-5 h-5 text-brand-slate-400 mx-auto mb-1" />
                  <span>
                    {request.paymentStatus === 'Completed'
                      ? 'Payment verified. Click "Auto-Notify Eligible Nurses" above to dispatch.'
                      : 'Nurses will be notified automatically once payment is verified.'}
                  </span>
                </div>
              )}
            </div>

            {/* Eligible Matching Pool Preview (Real-time computed) */}
            <div className="pt-3 border-t border-brand-slate-100">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 mb-2">
                Eligible Registered Nurses in Matching Pool ({eligibleNurses.length})
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {eligibleNurses.slice(0, 3).map((en) => (
                  <div key={en.id} className="p-2.5 rounded-lg border border-brand-slate-200 bg-brand-slate-50/60 text-xs">
                    <p className="font-bold text-brand-slate-900">{en.name}</p>
                    <p className="text-[11px] text-brand-slate-500">{en.specialization}</p>
                    <p className="text-[10px] text-brand-teal-700 font-semibold mt-1">
                      {en.distanceKm} km away • {en.locality}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-brand-slate-300 text-brand-slate-700 hover:bg-brand-slate-100 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="text-xs text-brand-slate-500 font-medium">
            Request ID: <span className="font-mono text-brand-slate-800">{request.id}</span>
          </div>
        </div>
      </div>

      {/* Call Confirmation Dialog Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-60 bg-brand-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-teal-100 text-brand-teal-700 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-brand-slate-900">Confirm Patient Call</h4>
                <p className="text-xs text-brand-slate-500">Dial: {request.patientPhone}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-slate-700 mb-1">
                Call Notes / Service Confirmation
              </label>
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="Confirmed patient requirement, address landmark and preferred time slot."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500 focus:ring-1 focus:ring-brand-teal-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCallModal(false)}
                className="px-3.5 py-2 rounded-xl border border-brand-slate-300 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCall}
                className="px-4 py-2 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-500 text-white text-xs font-bold shadow-sm"
              >
                Save & Mark Contacted
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set Payment Amount & Send Payment Link Dialog Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-60 bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-scale-in border border-brand-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-teal-100 text-brand-teal-700 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-slate-900">Enter Payment Amount</h4>
                  <p className="text-xs text-brand-slate-500">
                    Patient: {request.patientName} ({request.patientPhone})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-lg text-brand-slate-400 hover:text-brand-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Service Summary Info */}
            <div className="bg-brand-slate-50 p-3 rounded-xl border border-brand-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-brand-slate-500">Service:</span>
                <span className="font-bold text-brand-slate-800">{request.serviceRequired}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-slate-500">Preferred Slot:</span>
                <span className="font-medium text-brand-slate-700">{request.requestedDate}, {request.requestedTime}</span>
              </div>
            </div>

            {/* Editable Amount Input */}
            <div>
              <label className="block text-xs font-bold text-brand-slate-800 mb-1.5 flex items-center justify-between">
                <span>Amount to be Paid by Patient (₹) *</span>
                <span className="text-[11px] font-normal text-brand-slate-500">Type or adjust fee</span>
              </label>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-extrabold text-brand-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={enteredAmount}
                  onChange={(e) => setEnteredAmount(e.target.value)}
                  placeholder="e.g. 750"
                  className="w-full text-base font-extrabold pl-9 pr-4 py-2.5 rounded-xl border-2 border-brand-teal-400 bg-brand-teal-50/20 text-brand-slate-900 focus:outline-hidden focus:border-brand-teal-600 focus:bg-white"
                  required
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] text-brand-slate-400 font-semibold">Quick adjust:</span>
                <button
                  type="button"
                  onClick={() => setEnteredAmount(Number(enteredAmount || 0) + 100)}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-slate-700 border border-brand-slate-200"
                >
                  +₹100
                </button>
                <button
                  type="button"
                  onClick={() => setEnteredAmount(Number(enteredAmount || 0) + 250)}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-slate-700 border border-brand-slate-200"
                >
                  +₹250
                </button>
                <button
                  type="button"
                  onClick={() => setEnteredAmount(request.serviceAmount || 750)}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-teal-50 hover:bg-brand-teal-100 text-brand-teal-800 border border-brand-teal-200"
                >
                  Reset Default (₹{request.serviceAmount || 750})
                </button>
              </div>
            </div>

            {/* Custom Notes / Remarks */}
            <div>
              <label className="block text-xs font-semibold text-brand-slate-700 mb-1">
                Billing Notes / Specific Inclusions (Optional)
              </label>
              <input
                type="text"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder="e.g. Includes sterile dressing kit + visit charges"
                className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
              />
            </div>

            {/* Channel Options */}
            <div className="pt-2 border-t border-brand-slate-100 text-xs text-brand-slate-600 flex items-center justify-between">
              <span className="font-semibold text-brand-teal-700 flex items-center gap-1">
                <Send className="w-3.5 h-3.5" /> SMS & WhatsApp Link Enabled
              </span>
              <span className="text-[11px] text-brand-slate-400 font-mono">Gateway: Razorpay UPI</span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-3.5 py-2 rounded-xl border border-brand-slate-300 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const amt = Number(enteredAmount) > 0 ? Number(enteredAmount) : (request.serviceAmount || 750);
                  onSendPaymentLink(request.id, amt, paymentNotes);
                  setShowPaymentModal(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Payment Link (₹{Number(enteredAmount) || request.serviceAmount || 750})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Request Dialog Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-60 bg-brand-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-coral-100 text-brand-coral-700 flex items-center justify-center">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-brand-slate-900">Cancel Care Request</h4>
                <p className="text-xs text-brand-slate-500">Request #{request.id}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-slate-700 mb-1">
                Cancellation Reason
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
              >
                <option value="Patient requested cancellation">Patient requested cancellation</option>
                <option value="Hospital emergency admission">Hospital emergency admission</option>
                <option value="Duplicate request created">Duplicate request created</option>
                <option value="Patient unreachable after multiple attempts">Patient unreachable after multiple attempts</option>
                <option value="Location outside Mysuru coverage">Location outside Mysuru coverage</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-3.5 py-2 rounded-xl border border-brand-slate-300 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100"
              >
                Back
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-brand-coral-600 hover:bg-brand-coral-500 text-white text-xs font-bold shadow-sm"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

