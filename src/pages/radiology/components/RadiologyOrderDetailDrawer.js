import React, { useState } from 'react';
import {
  X,
  ScanLine,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Building2,
  Server,
  UserCheck,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Eye,
  Upload,
  Send,
  Printer,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  Check,
  ExternalLink,
  QrCode,
  Layers,
  Activity,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import RadiologyOrderTimeline from './RadiologyOrderTimeline';
import { useToast } from '../../../context/ToastContext';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

// 6 Linear Milestones for the Real Radiology In-Center Patient Flow (NO home sample)
const RADIOLOGY_LIFECYCLE_STEPS = [
  { key: 'BOOKED', label: '1. App Booking', short: '1. Booked' },
  { key: 'CONFIRMED', label: '2. Confirmed', short: '2. Confirmed' },
  { key: 'SCAN_DONE', label: '3. Scan Completed', short: '3. Scan Done' },
  { key: 'REPORT_UPLOADED', label: '4. Report Uploaded', short: '4. Report Ready' },
  { key: 'COMPLETED', label: '5. Shared with Patient', short: '5. Shared' }
];

export default function RadiologyOrderDetailDrawer({
  isOpen,
  onClose,
  order,
  orders = [],
  onSelectOrder,
  onAdvanceDemoStep,
  onResetOrderDemo,
  onVerifyOrder,
  onRescheduleOrder,
  onMarkArrived,
  onStartScan,
  onCompleteScan,
  onAssignRadiologist,
  onUploadReport,
  onReviewReport,
  onPreviewReport,
  onDeliverReport,
  onCancelOrder
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);
  const [activeTab, setActiveTab] = useState('workspace'); // 'workspace' | 'report' | 'timeline'

  if (!isOpen || !order) return null;

  const currentStatus = (order.orderStatus || 'NEW').toUpperCase();

  // Multi-patient pager indices
  const orderList = Array.isArray(orders) && orders.length > 0 ? orders : [order];
  const currentIdx = orderList.findIndex((o) => o.orderId === order.orderId);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx >= 0 && currentIdx < orderList.length - 1;

  const handlePrevPatient = () => {
    if (hasPrev && onSelectOrder) {
      onSelectOrder(orderList[currentIdx - 1]);
    }
  };

  const handleNextPatient = () => {
    if (hasNext && onSelectOrder) {
      onSelectOrder(orderList[currentIdx + 1]);
    }
  };

  // Compute Current Stage Index for 6-Step Center Stepper (0 to 5)
  const getCurrentStageIndex = () => {
    if (currentStatus === 'CANCELLED') return -1;
    if (currentStatus === 'NEW' || currentStatus === 'BOOKED') return 0;
    if (
      currentStatus === 'CONFIRMED' ||
      currentStatus === 'VERIFIED' ||
      currentStatus === 'PATIENT SCHEDULED' ||
      currentStatus === 'PATIENT ARRIVED' ||
      currentStatus === 'SCAN IN PROGRESS'
    ) return 1;
    if (
      currentStatus === 'SCAN COMPLETED' ||
      currentStatus === 'RADIOLOGIST ASSIGNED' ||
      currentStatus === 'REPORT PENDING'
    ) return 2;
    if (
      currentStatus === 'REPORT UPLOADED' ||
      currentStatus === 'REPORT UNDER REVIEW' ||
      currentStatus === 'REPORT VERIFIED'
    ) return 3;
    if (currentStatus === 'COMPLETED' || currentStatus === 'REPORT DELIVERED') return 4;
    return 0;
  };

  const currentStageIdx = getCurrentStageIndex();

  // Next Milestone Details for Streamlined 1-Click Action Flow
  const getNextActionInfo = () => {
    // 1. Booked -> Confirm Booking & Machine Slot
    if (currentStatus === 'NEW' || currentStatus === 'BOOKED') {
      return {
        stepLabel: 'Confirm Booking & Machine Slot',
        buttonText: 'Confirm Booking',
        badge: 'Step 1 of 4: Booking Requisition',
        description: `Patient booked ${order.scan?.name} on ${order.machine}. Review and confirm the appointment.`,
        actionColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        icon: ShieldCheck,
        onExecute: () => (onAdvanceDemoStep ? onAdvanceDemoStep(order.orderId) : onVerifyOrder && onVerifyOrder(order))
      };
    }

    // 2. Confirmed -> Patient Visits Center for Scan -> Scan Completed
    if (
      currentStatus === 'CONFIRMED' ||
      currentStatus === 'VERIFIED' ||
      currentStatus === 'PATIENT SCHEDULED' ||
      currentStatus === 'PATIENT ARRIVED' ||
      currentStatus === 'SCAN IN PROGRESS'
    ) {
      return {
        stepLabel: 'Patient Visits for Scan',
        buttonText: 'Mark Scan Completed',
        badge: 'Step 2 of 4: In-Center Scan Execution',
        description: `Patient arrives at ${order.center} for their appointment (${order.appointmentTime}). Technologist executes the scan and transmits images.`,
        actionColor: 'bg-brand-navy-900 hover:bg-brand-navy-800 text-white',
        icon: Play,
        onExecute: () => (onAdvanceDemoStep ? onAdvanceDemoStep(order.orderId) : onCompleteScan && onCompleteScan(order))
      };
    }

    // 3. Scan Completed -> Upload Report
    if (
      currentStatus === 'SCAN COMPLETED' ||
      currentStatus === 'RADIOLOGIST ASSIGNED' ||
      currentStatus === 'REPORT PENDING'
    ) {
      return {
        stepLabel: 'Upload Scan Report',
        buttonText: 'Upload Diagnostic Report',
        badge: 'Step 3 of 4: Report Upload',
        description: `Scan is completed. Upload the official diagnostic report for patient ${order.patient?.name}.`,
        actionColor: 'bg-brand-teal-600 hover:bg-brand-teal-700 text-white',
        icon: Upload,
        onExecute: () => (onAdvanceDemoStep ? onAdvanceDemoStep(order.orderId) : onUploadReport && onUploadReport(order))
      };
    }

    // 4. Report Uploaded -> Share with Patient
    if (
      currentStatus === 'REPORT UPLOADED' ||
      currentStatus === 'REPORT UNDER REVIEW' ||
      currentStatus === 'REPORT VERIFIED'
    ) {
      return {
        stepLabel: 'Share Report with Patient',
        buttonText: 'Share Report with Patient',
        badge: 'Step 4 of 4: Delivery',
        description: `Send official diagnostic report directly to patient ${order.patient?.name} via WhatsApp (+91 ${order.patient?.phone?.slice(-10)}) and publish to Health Records Vault.`,
        actionColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        icon: Send,
        onExecute: () => (onAdvanceDemoStep ? onAdvanceDemoStep(order.orderId) : onDeliverReport && onDeliverReport(order))
      };
    }

    // 5. Completed
    if (currentStatus === 'COMPLETED' || currentStatus === 'REPORT DELIVERED') {
      return {
        stepLabel: 'Diagnostic Study Completed',
        buttonText: 'View Official MediUnify Report',
        badge: 'Completed & Delivered',
        description: `Scan study complete. Branded MediUnify diagnostic report was transmitted to patient and referring physician.`,
        actionColor: 'bg-brand-teal-700 hover:bg-brand-teal-800 text-white',
        icon: Eye,
        onExecute: () => (onPreviewReport ? onPreviewReport(order) : setActiveTab('report'))
      };
    }

    return null;
  };

  const nextAction = getNextActionInfo();
  const assignedRadiologist = order.radiologist || 'Dr. Vikramaditya Hegde, MD, FRCR';
  const reportId = order.reportId || `RPT-RAD-${order.orderId.replace(/[^0-9]/g, '') || '4001'}`;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ================= TOP HEADER BAR ================= */}
        <div className="px-5 py-4 border-b border-brand-slate-200 bg-brand-slate-50 flex flex-wrap items-center justify-between gap-3">
          
          {/* Order Identity */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-navy-900 text-white rounded-xl shadow-xs">
              <ScanLine className="w-5 h-5 text-brand-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-black text-brand-navy-900 text-base">{order.orderId}</span>
                <StatusBadge status={order.orderStatus} size="sm" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200">
                  🏥 In-Center Scan Visit
                </span>
              </div>
              <p className="text-[11px] text-brand-slate-500 mt-0.5">
                Booked: {order.createdAt} • Channel: <span className="font-semibold text-brand-slate-700">{order.bookingSource || 'Patient App'}</span>
              </p>
            </div>
          </div>

          {/* Patient Switcher / Pager & Close */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 bg-white border border-brand-slate-200 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={handlePrevPatient}
                disabled={!hasPrev}
                className="px-2.5 py-1 text-xs font-bold text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100 rounded-lg disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition-colors"
                title="Previous Patient in Queue"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <span className="text-[11px] font-bold text-brand-slate-500 px-2 py-0.5 border-x border-brand-slate-200">
                {currentIdx >= 0 ? `${currentIdx + 1} of ${orderList.length}` : 'Patient'}
              </span>
              <button
                type="button"
                onClick={handleNextPatient}
                disabled={!hasNext}
                className="px-2.5 py-1 text-xs font-bold text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100 rounded-lg disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition-colors"
                title="Next Patient in Queue"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-200/80 rounded-xl transition-colors"
              title="Close Workspace Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= 6-STAGE OPERATIONAL STEPPER ================= */}
        <div className="px-5 py-3.5 bg-white border-b border-brand-slate-100 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] gap-2">
            {RADIOLOGY_LIFECYCLE_STEPS.map((step, idx) => {
              const isPast = currentStageIdx > idx;
              const isCurrent = currentStageIdx === idx;
              const isPending = currentStageIdx < idx;

              return (
                <div key={step.key} className="flex-1 flex items-center">
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all shrink-0 ${
                        isPast
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-brand-teal-600 text-white ring-4 ring-brand-teal-100 shadow-xs'
                          : 'bg-brand-slate-100 text-brand-slate-400 border border-brand-slate-200'
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-extrabold truncate leading-tight ${
                          isCurrent
                            ? 'text-brand-teal-800'
                            : isPast
                            ? 'text-emerald-800 font-bold'
                            : 'text-brand-slate-400 font-medium'
                        }`}
                      >
                        {step.label}
                      </p>
                      <span className="text-[10px] text-brand-slate-400 block truncate">
                        {isPast ? 'Completed' : isCurrent ? 'Active Stage' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {idx < RADIOLOGY_LIFECYCLE_STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-colors ${
                        isPast ? 'bg-emerald-400' : 'bg-brand-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 1-CLICK NEXT OPERATIONAL MILESTONE BANNER ================= */}
        {nextAction && (
          <div className="px-5 py-3.5 bg-gradient-to-r from-teal-50 via-emerald-50/70 to-slate-50 border-b border-brand-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-xl border border-brand-teal-200 text-brand-teal-700 shadow-2xs mt-0.5">
                <nextAction.icon className="w-5 h-5 text-brand-teal-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-teal-600 text-white">
                    {nextAction.badge}
                  </span>
                  <span className="text-xs font-bold text-brand-navy-900">{nextAction.stepLabel}</span>
                </div>
                <p className="text-xs text-brand-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                  {nextAction.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onResetOrderDemo && currentStageIdx > 0 && (
                <button
                  type="button"
                  onClick={() => onResetOrderDemo(order.orderId)}
                  className="px-3 py-2 text-xs font-bold rounded-xl border border-brand-slate-300 text-brand-slate-600 bg-white hover:bg-brand-slate-50 flex items-center gap-1.5 shadow-2xs transition-colors"
                  title="Reset this order back to Step 1 (Booked) for live demonstration"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
                </button>
              )}

              <button
                type="button"
                onClick={nextAction.onExecute}
                className={`px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-sm flex items-center gap-2 transition-transform active:scale-95 ${nextAction.actionColor}`}
              >
                <nextAction.icon className="w-4 h-4" />
                {nextAction.buttonText}
              </button>
            </div>
          </div>
        )}

        {/* ================= WORKSPACE TABS ================= */}
        <div className="px-5 border-b border-brand-slate-200 bg-white flex items-center gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('workspace')}
            className={`py-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'workspace'
                ? 'border-brand-teal-600 text-brand-teal-800'
                : 'border-transparent text-brand-slate-500 hover:text-brand-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" /> Patient & Center Requisition
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`py-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'report'
                ? 'border-brand-teal-600 text-brand-teal-800'
                : 'border-transparent text-brand-slate-500 hover:text-brand-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" /> MediUnify Branded Diagnostic Report
            {(currentStatus === 'REPORT UPLOADED' || currentStatus === 'REPORT VERIFIED' || currentStatus === 'COMPLETED') && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`py-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-brand-teal-600 text-brand-teal-800'
                : 'border-transparent text-brand-slate-500 hover:text-brand-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" /> Operational Audit Trail
          </button>
        </div>

        {/* ================= SCROLLABLE WORKSPACE CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-brand-slate-50/50 space-y-5 text-xs">
          
          {/* TAB 1: WORKSPACE OVERVIEW */}
          {activeTab === 'workspace' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Row 1: Patient Demographics & Center Appointment Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Patient Demographics */}
                <div className="p-4 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-brand-slate-100 pb-2.5">
                    <h4 className="font-extrabold text-brand-navy-900 text-xs flex items-center gap-2">
                      <User className="w-4 h-4 text-brand-teal-600" />
                      Patient Demographics
                    </h4>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-slate-100 text-brand-slate-700">
                      UHID: {order.patient?.patientId || 'PT-8801'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-brand-slate-400 block text-[11px]">Full Name:</span>
                      <strong className="text-brand-navy-900 text-sm">{order.patient?.name}</strong>
                    </div>
                    <div>
                      <span className="text-brand-slate-400 block text-[11px]">Age & Gender:</span>
                      <span className="font-semibold text-brand-slate-800">
                        {order.patient?.age} Yrs • {order.patient?.gender}
                      </span>
                    </div>
                    <div>
                      <span className="text-brand-slate-400 block text-[11px]">Phone:</span>
                      <span className="font-bold text-brand-slate-800 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-brand-teal-600" /> {order.patient?.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-brand-slate-400 block text-[11px]">Email:</span>
                      <span className="text-brand-slate-600 truncate block font-medium">
                        {order.patient?.email}
                      </span>
                    </div>
                  </div>

                  {order.patient?.address && (
                    <div className="pt-2 border-t border-brand-slate-100 flex items-start gap-1.5 text-[11px] text-brand-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-brand-slate-400 shrink-0 mt-0.5" />
                      <span>{order.patient?.address}</span>
                    </div>
                  )}
                </div>

                {/* Confirmed Center & Machine Slot Card */}
                <div className="p-4 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-brand-slate-100 pb-2.5">
                    <h4 className="font-extrabold text-brand-navy-900 text-xs flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-brand-teal-600" />
                      Booked Center & Machine Slot
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Slot Reserved
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-brand-slate-400 block text-[11px]">Physical Center:</span>
                      <strong className="text-brand-navy-900 text-xs">{order.center}</strong>
                    </div>
                    <div>
                      <span className="text-brand-slate-400 block text-[11px]">Assigned Machine:</span>
                      <strong className="text-brand-teal-800 text-xs">{order.machine}</strong>
                    </div>
                    <div>
                      <span className="text-brand-slate-400 block text-[11px]">Appointment Date:</span>
                      <span className="font-extrabold text-brand-slate-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-teal-600" /> {order.appointmentDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-brand-slate-400 block text-[11px]">Confirmed Slot:</span>
                      <span className="font-extrabold text-brand-teal-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-teal-600" /> {order.appointmentTime}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-brand-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-brand-slate-500">Center Reception Status:</span>
                    <span className="font-extrabold text-brand-navy-900">
                      {order.arrivalTime ? `Checked In (${order.arrivalTime})` : 'Awaiting Patient Arrival'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Row 2: Imaging Procedure & Clinical Indication */}
              <div className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-brand-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-200">
                      {order.scan?.code}
                    </span>
                    <h3 className="text-base font-extrabold text-brand-navy-900 mt-1">
                      {order.scan?.name}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-brand-slate-400 font-medium block">Total Payable</span>
                    <strong className="text-lg font-black text-brand-navy-900">₹{order.totalAmount}</strong>
                    <span className="text-[10px] font-bold text-emerald-700 block">
                      {order.paymentStatus || 'Paid via UPI'}
                    </span>
                  </div>
                </div>

                {/* Modality Badges & Protocol */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-100">
                    <span className="text-brand-slate-400 block text-[10px] font-medium">Modality</span>
                    <strong className="text-brand-teal-800 font-bold">{order.scan?.category || 'MRI'}</strong>
                  </div>
                  <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-100">
                    <span className="text-brand-slate-400 block text-[10px] font-medium">Target Region</span>
                    <strong className="text-brand-navy-900 font-bold">{order.scan?.bodyPart || 'Anatomical'}</strong>
                  </div>
                  <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-100">
                    <span className="text-brand-slate-400 block text-[10px] font-medium">Gantry Duration</span>
                    <strong className="text-brand-slate-800 font-bold">{order.scan?.approximateDuration || '25 min'}</strong>
                  </div>
                  <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-100">
                    <span className="text-brand-slate-400 block text-[10px] font-medium">Reporting TAT</span>
                    <strong className="text-brand-slate-800 font-bold">{order.scan?.tat || '4 - 6 Hours'}</strong>
                  </div>
                </div>

                {/* Clinical Notes & Fasting Checklist */}
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span className="font-extrabold text-amber-900 text-xs">Clinical Indication & Preparation Protocol:</span>
                  </div>
                  <p className="text-amber-900/90 font-medium text-[11px] leading-relaxed">
                    {order.clinicalNotes || 'Diagnostic imaging requisition evaluated according to standard radiological protocols.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-300">
                      ✓ Metallic Contraindication Checked
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-300">
                      ✓ Serum Creatinine Validated (if Contrast)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-300">
                      ✓ Signed Informed Consent
                    </span>
                  </div>
                </div>

                {/* Reporting Radiologist Assignment */}
                <div className="flex flex-wrap items-center justify-between p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200 gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-slate-400 block font-medium">Reporting Radiologist:</span>
                      <strong className="text-brand-navy-900 font-bold">{assignedRadiologist}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                      Report ID: {reportId}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('report')}
                      className="px-3 py-1.5 bg-white border border-brand-slate-200 hover:bg-brand-slate-100 font-bold rounded-lg text-brand-navy-900 text-[11px] flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Report
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: MEDIUNIFY BRANDED DIAGNOSTIC REPORT PREVIEW */}
          {activeTab === 'report' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Report Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-brand-slate-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-navy-900">Official Format:</span>
                  <span className="text-[11px] font-extrabold text-brand-teal-700 bg-brand-teal-50 px-2.5 py-0.5 rounded-full border border-brand-teal-200">
                    MediUnify Verified Diagnostic Report
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onPreviewReport) onPreviewReport(order);
                    }}
                    className="px-3 py-1.5 bg-white border border-brand-slate-200 hover:bg-brand-slate-100 text-brand-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print / PDF
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onDeliverReport) onDeliverReport(order);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Send to Patient (WhatsApp & Vault)
                  </button>
                </div>
              </div>

              {/* Official MediUnify Branded Report Document Container */}
              <div className="bg-white rounded-2xl border-2 border-brand-slate-200 shadow-md p-6 sm:p-8 space-y-6 relative overflow-hidden">
                
                {/* Official MediUnify Header */}
                <div className="border-b-2 border-brand-teal-600 pb-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-navy-900 text-white flex items-center justify-center font-black text-sm">
                          MU
                        </div>
                        <h2 className="text-xl font-black text-brand-navy-900 tracking-tight">
                          MEDIUNIFY
                        </h2>
                        <span className="text-xs font-bold text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                          Presented by MediUnify
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-slate-600 mt-1 font-semibold">
                        Scanned in: <span className="text-brand-navy-900 font-bold">{order.center}</span>
                      </p>
                      <p className="text-[10px] text-brand-slate-400 font-semibold">
                        AERB Licensed • NABL Accredited • Digital PACS Verification
                      </p>
                    </div>

                    <div className="p-3 bg-brand-slate-50 border border-brand-slate-200 rounded-xl text-center">
                      <QrCode className="w-10 h-10 text-brand-navy-900 mx-auto" />
                      <span className="text-[9px] font-mono font-bold text-brand-slate-600 block mt-1">
                        VERIFY AUTHENTICITY
                      </span>
                      <span className="text-[8px] text-brand-teal-700 font-semibold">verify.mediunify.com</span>
                    </div>
                  </div>
                </div>

                {/* Patient & Study Metadata Header Table */}
                <div className="bg-brand-slate-50 rounded-xl p-4 border border-brand-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-brand-slate-400 block font-medium">PATIENT NAME</span>
                    <strong className="text-brand-navy-900 font-extrabold">{order.patient?.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-slate-400 block font-medium">AGE / GENDER</span>
                    <span className="font-bold text-brand-slate-800">{order.patient?.age} Y / {order.patient?.gender}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-slate-400 block font-medium">UHID / PATIENT ID</span>
                    <span className="font-mono font-bold text-brand-teal-700">{order.patient?.patientId || 'PT-8801'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-slate-400 block font-medium">REPORT ID</span>
                    <span className="font-mono font-bold text-purple-700">{reportId}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-brand-slate-400 block font-medium">SCAN CENTER</span>
                    <span className="font-semibold text-brand-slate-800 truncate block">{order.center}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-slate-400 block font-medium">MACHINE / GANTRY</span>
                    <span className="font-semibold text-brand-slate-800">{order.machine}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-slate-400 block font-medium">SCAN DATE & TIME</span>
                    <span className="font-semibold text-brand-slate-800">{order.appointmentDate} ({order.appointmentTime})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-slate-400 block font-medium">REPORT STATUS</span>
                    <span className="font-extrabold text-emerald-700">VERIFIED & AUTHORIZED</span>
                  </div>
                </div>

                {/* Scan Investigation Title */}
                <div className="text-center py-2 bg-brand-navy-900 text-white rounded-lg">
                  <h3 className="font-black text-xs uppercase tracking-wider">
                    {order.scan?.name} ({order.scan?.code})
                  </h3>
                </div>

                {/* Clinical History */}
                <div className="space-y-1">
                  <h4 className="font-bold text-brand-navy-900 text-xs uppercase text-brand-teal-800">
                    Clinical History & Indication
                  </h4>
                  <p className="text-xs text-brand-slate-700 font-medium leading-relaxed bg-brand-slate-50/80 p-2.5 rounded-lg border border-brand-slate-100">
                    {order.clinicalNotes || 'Diagnostic imaging requisition evaluated with standard diagnostic protocol.'}
                  </p>
                </div>

                {/* Protocol */}
                <div className="space-y-1">
                  <h4 className="font-bold text-brand-navy-900 text-xs uppercase text-brand-teal-800">
                    Imaging Technique & Protocol
                  </h4>
                  <p className="text-xs text-brand-slate-700 leading-relaxed font-medium">
                    Volumetric cross-sectional contiguous acquisitions obtained in axial, coronal, and sagittal planes with dedicated high-resolution diagnostic matrix sequences.
                  </p>
                </div>

                {/* Structured Findings */}
                <div className="space-y-3">
                  <h4 className="font-bold text-brand-navy-900 text-xs uppercase text-brand-teal-800 border-b border-brand-slate-200 pb-1">
                    Radiological Observations & Findings
                  </h4>

                  <div className="space-y-2 text-xs text-brand-slate-700 leading-relaxed">
                    <p>
                      <strong>1. Target Anatomical Anatomy: </strong>
                      Diagnostic imaging of the {order.scan?.bodyPart || 'target anatomical region'} demonstrates physiological signal intensity, anatomical continuity, and preserved structural contours. No evidence of focal osteolytic or osteoblastic lesion.
                    </p>
                    <p>
                      <strong>2. Soft Tissue & Neurovascular Planes: </strong>
                      Surrounding muscle compartments, subcutaneous fat planes, and neurovascular bundles appear preserved without infiltration or pathological edema.
                    </p>
                    <p>
                      <strong>3. Contrast Enhancement Characteristics: </strong>
                      No abnormal, asymmetrical, or pathological contrast enhancement observed across any phase of acquisition.
                    </p>
                  </div>
                </div>

                {/* Impression */}
                <div className="p-3.5 bg-brand-teal-50/80 border border-brand-teal-200 rounded-xl space-y-1">
                  <h4 className="font-black text-brand-teal-900 text-xs uppercase">
                    Diagnostic Impression
                  </h4>
                  <p className="text-xs font-bold text-brand-teal-950 leading-relaxed">
                    1. Diagnostic imaging study of {order.scan?.name} within normal limits.<br />
                    2. No acute or focal radiological abnormality identified.
                  </p>
                </div>

                {/* Consultant Signature & Accreditation Footer */}
                <div className="pt-6 border-t border-brand-slate-200 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-brand-slate-400 font-medium block">
                      ELECTRONIC CRYPTOGRAPHIC SIGNATURE
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs font-extrabold text-emerald-800">
                        Cryptographically Verified via MediUnify Core
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-serif italic font-bold text-base text-brand-navy-900 mb-0.5">
                      {assignedRadiologist.split(',')[0]}
                    </div>
                    <strong className="text-xs text-brand-navy-900 block font-bold">{assignedRadiologist}</strong>
                    <span className="text-[10px] text-brand-slate-500 font-medium block">
                      Consultant Radiologist • Reg No: KMC-48291
                    </span>
                    <span className="text-[9px] text-brand-slate-400 block mt-0.5">
                      MediUnify Diagnostic Quality Assurance Bureau
                    </span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: TIMELINE AUDIT TRAIL */}
          {activeTab === 'timeline' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <RadiologyOrderTimeline order={order} />
            </div>
          )}

        </div>

        {/* ================= MODAL FOOTER ================= */}
        <div className="px-6 py-4 border-t border-brand-slate-200 bg-brand-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div>
            {currentStatus !== 'CANCELLED' && currentStatus !== 'COMPLETED' && (
              <button
                type="button"
                onClick={() => {
                  const reason = window.prompt('Enter reason for order cancellation:');
                  if (reason) {
                    onCancelOrder(order.orderId, reason);
                    onClose();
                  }
                }}
                className="text-xs font-bold text-brand-coral-600 hover:text-brand-coral-800 transition-colors"
              >
                Cancel Entire Order
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {currentStatus !== 'COMPLETED' && currentStatus !== 'CANCELLED' && (
              <button
                type="button"
                onClick={() => onRescheduleOrder(order)}
                className="px-3 py-2 bg-white text-amber-800 font-bold rounded-xl border border-amber-300 hover:bg-amber-50 text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reschedule Slot
              </button>
            )}

            {nextAction && (
              <button
                type="button"
                onClick={nextAction.onExecute}
                className={`px-4 py-2 rounded-xl font-extrabold text-xs shadow-xs flex items-center gap-2 transition-transform active:scale-95 ${nextAction.actionColor}`}
              >
                <nextAction.icon className="w-4 h-4" />
                {nextAction.buttonText}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-brand-slate-200 hover:bg-brand-slate-300 text-brand-slate-800 font-bold rounded-xl text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
