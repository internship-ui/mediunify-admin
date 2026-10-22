import React, { useState } from 'react';
import {
  X,
  Phone,
  MapPin,
  Calendar,
  Building2,
  TestTube2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Send,
  UserCheck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Truck,
  Upload,
  ArrowRight,
  Check,
  AlertCircle,
  Pipette,
  Layers,
  Star,
  Sparkles
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import OrderTimeline from './OrderTimeline';
import { MASTER_TESTS, COLLECTION_STAFF } from '../../../data/labData';
import { useToast } from '../../../context/ToastContext';
import TubeColorDot, { getTubeColorInfo } from './TubeColorBadge';

// 5 Crystal-Clear Stages for the Real Administrative Workflow
const WORKFLOW_STAGES = [
  { key: 'NEW', title: '1. Verify', desc: 'Admin review' },
  { key: 'VERIFIED', title: '2. Assign', desc: 'Assign phlebotomist' },
  { key: 'ASSIGNED', title: '3. Sample', desc: 'Collection & lab desk' },
  { key: 'REPORT', title: '4. Report', desc: 'Testing & upload' },
  { key: 'COMPLETED', title: '5. Deliver', desc: 'Patient delivery' }
];

export default function OrderDetailDrawer({
  isOpen,
  onClose,
  order,
  orders = [],
  onSelectOrder,
  allTests = MASTER_TESTS,
  availableStaff = COLLECTION_STAFF,
  onVerifyOrder,
  onScheduleCollection,
  onConfirmScheduleCollection,
  onMarkSampleReceived,
  onUploadReport,
  onSendToPatient,
  onPreviewReport,
  onCancelOrder,
  onTriggerRecollection,
  onAdvanceDemoStep,
  onResetOrderDemo
}) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('flow'); // 'flow' | 'tests' | 'timeline'
  const [recollectionModalOpen, setRecollectionModalOpen] = useState(false);
  const [issueReason, setIssueReason] = useState('Insufficient Sample');
  const [issueNotes, setIssueNotes] = useState('');

  if (!isOpen || !order) return null;

  const currentStatus = (order.orderStatus || 'NEW').toUpperCase();

  // Multi-patient pager
  const orderList = Array.isArray(orders) && orders.length > 0 ? orders : [order];
  const currentIdx = orderList.findIndex((o) => o.orderId === order.orderId);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx >= 0 && currentIdx < orderList.length - 1;

  const handlePrevPatient = () => {
    if (hasPrev && onSelectOrder) onSelectOrder(orderList[currentIdx - 1]);
  };

  const handleNextPatient = () => {
    if (hasNext && onSelectOrder) onSelectOrder(orderList[currentIdx + 1]);
  };

  const bookedItem = order.bookedItem || {
    name: order.testOrPackage?.name || 'Complete Health Screening Package',
    code: order.testOrPackage?.code || 'PKG-CHS-01',
    type: order.testOrPackage?.type === 'package' ? 'Package' : 'Package',
    category: order.testOrPackage?.category || 'Full Body Health Screening',
    description: order.testOrPackage?.description || 'Comprehensive 7-panel screening package.',
    price: order.totalAmount || 3499,
    tat: order.testOrPackage?.tat || '8 - 12 Hours',
    fastingRequired: order.testOrPackage?.fastingRequired ?? true
  };

  const detailedTests = (order.includedTests && order.includedTests.length > 0)
    ? order.includedTests
    : allTests.slice(0, 7);

  // Clinical Test Tube Definitions with Colors & Target Tests
  const requiredTubes = [
    {
      id: 'tube-purple',
      name: 'Lavender / EDTA Tube',
      colorName: 'Lavender / Purple',
      hex: '#9333ea',
      capBg: 'bg-purple-600',
      badgeBg: 'bg-purple-50 text-purple-900 border-purple-200',
      dotBg: 'bg-purple-500',
      volume: '2ml',
      sampleType: 'Blood',
      specimenType: 'Whole Blood (EDTA)',
      tests: 'Complete Blood Count (CBC), HbA1c',
      instructions: 'Gently invert 8-10 times to prevent micro-clots.'
    },
    {
      id: 'tube-grey',
      name: 'Grey / Sodium Fluoride Tube',
      colorName: 'Grey / Fluoride',
      hex: '#94a3b8',
      capBg: 'bg-slate-400',
      badgeBg: 'bg-slate-50 text-slate-800 border-slate-200',
      dotBg: 'bg-slate-400',
      volume: '2ml',
      sampleType: 'Blood',
      specimenType: 'Fluoride Plasma',
      tests: 'Fasting Blood Glucose',
      instructions: 'Invert gently 5-6 times to inhibit glycolysis.'
    },
    {
      id: 'tube-gold',
      name: 'Gold / SST Gel Separator Tube',
      colorName: 'Gold / Yellow',
      hex: '#f59e0b',
      capBg: 'bg-amber-400',
      badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
      dotBg: 'bg-amber-400',
      volume: '4ml',
      sampleType: 'Blood',
      specimenType: 'Serum with Gel Separator',
      tests: 'Lipid Profile, Liver Function (LFT), Kidney Function (KFT)',
      instructions: 'Allow 30 min clotting before centrifugation.'
    },
    {
      id: 'tube-urine',
      name: 'Sterile Urine Container',
      colorName: 'Teal / Clear',
      hex: '#0d9488',
      capBg: 'bg-teal-600',
      badgeBg: 'bg-teal-50 text-teal-900 border-teal-200',
      dotBg: 'bg-teal-500',
      volume: '50ml',
      sampleType: 'Urine',
      specimenType: 'Midstream Clean-Catch',
      tests: 'Routine Urine Examination',
      instructions: 'First morning midstream clean-catch in sterile cup.'
    }
  ];

  // Stage Index (0: Verify, 1: Assign, 2: Sample, 3: Report, 4: Completed)
  const getStageIndex = () => {
    if (currentStatus === 'CANCELLED') return -1;
    if (currentStatus === 'NEW' || currentStatus === 'BOOKED') return 0;
    if (currentStatus === 'VERIFIED' || currentStatus === 'ADMIN VERIFIED' || currentStatus === 'PENDING VERIFICATION') return 1;
    if (
      currentStatus === 'PHLEBOTOMIST ASSIGNED' ||
      currentStatus === 'COLLECTOR ASSIGNED' ||
      currentStatus === 'COLLECTION SCHEDULED' ||
      currentStatus === 'ACCEPTED' ||
      currentStatus === 'ON THE WAY' ||
      currentStatus === 'ARRIVED' ||
      currentStatus === 'PATIENT VERIFIED' ||
      currentStatus === 'COLLECTION STARTED'
    ) return 2;
    if (
      currentStatus === 'SAMPLE COLLECTED' ||
      currentStatus === 'COLLECTED' ||
      currentStatus === 'SAMPLE RECEIVED' ||
      currentStatus === 'RECEIVED' ||
      currentStatus === 'SAMPLE VERIFIED' ||
      currentStatus === 'PROCESSING' ||
      currentStatus === 'IN LAB / PROCESSING' ||
      currentStatus === 'REPORT PENDING'
    ) return 3;
    if (currentStatus === 'REPORT UPLOADED' || currentStatus === 'REPORT READY' || currentStatus === 'REPORT VERIFIED' || currentStatus === 'VERIFIED REPORT') return 4;
    if (currentStatus === 'COMPLETED' || currentStatus === 'REPORT DELIVERED') return 5;
    return 0;
  };

  const stageIdx = getStageIndex();

  const isCollectorAssigned = Boolean(
    order.assignedStaffDetails?.name ||
    order.collection?.assignedCollector?.name ||
    (order.assignedStaff && order.assignedStaff !== 'Unassigned')
  ) && stageIdx >= 2;

  const collector = isCollectorAssigned
    ? (order.assignedStaffDetails || order.collection?.assignedCollector || {
        name: order.assignedStaff,
        id: order.assignedStaffId || 'PH1004',
        phone: order.assignedStaffPhone || '+91 98765 43211',
        vehicle: order.assignedStaffVehicle || 'KA-04-SK-1004',
        status: 'Assigned',
        location: 'Assigned to Patient'
      })
    : null;

  // Direct Staff Assignment by Admin clicking any available phlebotomist
  const handleAssignStaff = (staffMember) => {
    if (onConfirmScheduleCollection) {
      onConfirmScheduleCollection(order.orderId, {
        staff: staffMember.name,
        staffId: staffMember.staffId,
        staffPhone: staffMember.phone,
        staffLocation: staffMember.serviceArea,
        vehicle: staffMember.vehicleNumber,
        date: order.collection?.scheduledDate || order.preferredDate || '02 October 2026',
        timeSlot: order.collection?.scheduledTime || order.preferredTimeSlot || '10:00 AM',
        instructions: 'Carry required Purple EDTA, Grey Fluoride, Gold SST tubes, and Urine container.'
      });
      addToast(`Assigned ${staffMember.name} (${staffMember.staffId}) to Order #${order.orderId}`, 'success');
    } else if (onAdvanceDemoStep) {
      onAdvanceDemoStep(order.orderId);
    }
  };

  const handleIssueSubmit = () => {
    if (onTriggerRecollection) {
      onTriggerRecollection(order.orderId, {
        issueReason,
        issueNotes: issueNotes || `Flagged ${issueReason} during lab accessioning. Sample recollection triggered.`
      });
    } else {
      addToast(`Recollection triggered for ${order.orderId}: ${issueReason}`, 'warning');
    }
    setRecollectionModalOpen(false);
  };

  // Next Action Details
  const getNextAction = () => {
    if (stageIdx === 0) {
      return {
        stepNumber: 1,
        title: 'Verify Patient Request',
        description: 'Review tests, verify fasting confirmation, and confirm patient collection address.',
        buttonText: 'Verify Order',
        icon: CheckCircle2,
        actionColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        onExecute: () => (onAdvanceDemoStep ? onAdvanceDemoStep(order.orderId) : onVerifyOrder && onVerifyOrder(order))
      };
    }
    if (stageIdx === 1) {
      return {
        stepNumber: 2,
        title: 'Assign Phlebotomist',
        description: 'Click any available phlebotomist below to assign them for doorstep collection.',
        buttonText: 'Assign Suresh Kumar',
        icon: UserCheck,
        actionColor: 'bg-brand-teal-600 hover:bg-brand-teal-700 text-white',
        onExecute: () => {
          const defaultStaff = availableStaff.find(s => s.staffId === 'PH1004') || availableStaff[0];
          handleAssignStaff(defaultStaff);
        }
      };
    }
    if (stageIdx === 2) {
      return {
        stepNumber: 3,
        title: 'Sample Received at Lab',
        description: 'Confirm collector delivered intact specimen tubes to lab accession desk.',
        buttonText: 'Sample Reached Lab',
        icon: Building2,
        actionColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        onExecute: () => (onAdvanceDemoStep ? onAdvanceDemoStep(order.orderId) : onMarkSampleReceived && onMarkSampleReceived(order.orderId))
      };
    }
    if (stageIdx === 3) {
      return {
        stepNumber: 4,
        title: 'Upload Certified Diagnostic Report',
        description: 'Upload certified diagnostic report after laboratory testing is complete.',
        buttonText: 'Upload Report',
        icon: Upload,
        actionColor: 'bg-brand-teal-600 hover:bg-brand-teal-700 text-white',
        onExecute: () => (onAdvanceDemoStep ? onAdvanceDemoStep(order.orderId) : onUploadReport && onUploadReport(order))
      };
    }
    if (stageIdx === 4) {
      return {
        stepNumber: 5,
        title: 'Send Report to Patient',
        description: 'Dispatch official signed report directly to patient via WhatsApp & Email.',
        buttonText: 'Send to Patient',
        icon: Send,
        actionColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        onExecute: () => (onAdvanceDemoStep ? onAdvanceDemoStep(order.orderId) : onSendToPatient && onSendToPatient(order.orderId))
      };
    }
    return {
      stepNumber: 5,
      title: 'Order Completed',
      description: 'Report delivered successfully to patient. Lifecycle complete!',
      buttonText: 'View Final Report',
      icon: FileText,
      actionColor: 'bg-brand-teal-50 hover:bg-brand-teal-100 text-brand-teal-800 border border-brand-teal-300',
      isCompleted: true,
      onExecute: () => onPreviewReport && onPreviewReport(order)
    };
  };

  const nextAction = getNextAction();
  const NextActionIcon = nextAction.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white rounded-2xl max-h-[92vh] shadow-2xl flex flex-col border border-brand-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-brand-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-teal-50 text-brand-teal-700 rounded-xl border border-brand-teal-200">
              <TestTube2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded bg-brand-navy-900 text-white">
                  ORDER #{order.orderId}
                </span>
                <StatusBadge status={order.orderStatus} size="sm" />
                <span className="text-[11px] font-semibold text-brand-slate-500 hidden sm:inline">
                  • {order.patient?.name} ({order.patient?.age}Y, {order.patient?.gender})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Multi-patient pager */}
            {orderList.length > 1 && (
              <div className="flex items-center bg-brand-slate-100 rounded-xl p-0.5 border border-brand-slate-200 text-xs">
                <button
                  onClick={handlePrevPatient}
                  disabled={!hasPrev}
                  className="p-1 rounded-lg hover:bg-white text-brand-slate-600 disabled:opacity-30 cursor-pointer"
                  title="Previous Request"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-semibold text-brand-slate-700 select-none text-[11px]">
                  {currentIdx + 1} / {orderList.length}
                </span>
                <button
                  onClick={handleNextPatient}
                  disabled={!hasNext}
                  className="p-1 rounded-lg hover:bg-white text-brand-slate-600 disabled:opacity-30 cursor-pointer"
                  title="Next Request"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Reset Order Demo */}
            {onResetOrderDemo && (
              <button
                onClick={() => onResetOrderDemo(order.orderId)}
                className="p-1.5 text-brand-slate-400 hover:text-brand-teal-700 hover:bg-brand-teal-50 rounded-xl transition-colors cursor-pointer"
                title="Reset order to initial NEW state"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 5-Step Progress Stepper */}
        <div className="bg-brand-slate-50/80 border-b border-brand-slate-200 px-6 py-2.5 flex-shrink-0">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            {WORKFLOW_STAGES.map((s, idx) => {
              const isPassed = currentStatus !== 'CANCELLED' && stageIdx > idx;
              const isCurrent = currentStatus !== 'CANCELLED' && (stageIdx === idx || (idx === 4 && stageIdx >= 4));

              return (
                <div key={s.key} className="flex flex-col items-center relative z-10 flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all shadow-2xs ${
                      isCurrent
                        ? 'bg-brand-teal-600 text-white ring-3 ring-brand-teal-100 font-black'
                        : isPassed
                        ? 'bg-brand-teal-600 text-white'
                        : 'bg-white border-2 border-brand-slate-300 text-brand-slate-400'
                    }`}
                  >
                    {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-semibold ${
                      isCurrent
                        ? 'text-brand-teal-900 font-bold'
                        : isPassed
                        ? 'text-brand-slate-700'
                        : 'text-brand-slate-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-brand-slate-200 bg-white gap-4 text-xs font-bold flex-shrink-0">
          <button
            onClick={() => setActiveTab('flow')}
            className={`py-2.5 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'flow'
                ? 'border-brand-teal-600 text-brand-teal-700'
                : 'border-transparent text-brand-slate-500 hover:text-brand-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-teal-600" />
            Workflow & Assignment
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`py-2.5 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tests'
                ? 'border-brand-teal-600 text-brand-teal-700'
                : 'border-transparent text-brand-slate-500 hover:text-brand-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-brand-teal-600" />
            Clinical Tests & Tubes ({detailedTests.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-2.5 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-brand-teal-600 text-brand-teal-700'
                : 'border-transparent text-brand-slate-500 hover:text-brand-slate-800'
            }`}
          >
            Audit Trail
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs bg-brand-slate-50/40">

          {/* TAB 1: WORKFLOW & ASSIGNMENT */}
          {activeTab === 'flow' && (
            <div className="space-y-4 max-w-3xl mx-auto">

              {/* 1. Essential Patient & Booking Snapshot */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* Patient Card */}
                <div className="p-3.5 bg-white rounded-xl border border-brand-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-brand-slate-400 uppercase">Patient Details</span>
                  <p className="font-extrabold text-brand-navy-900 text-sm">{order.patient?.name}</p>
                  <p className="text-[11px] text-brand-slate-600">
                    {order.patient?.patientId} • {order.patient?.age}Y • {order.patient?.gender}
                  </p>
                  <p className="text-[11px] font-mono text-brand-teal-700 flex items-center gap-1 pt-0.5">
                    <Phone className="w-3 h-3 text-brand-teal-600" />
                    {order.patient?.phone}
                  </p>
                </div>

                {/* Booking & Package */}
                <div className="p-3.5 bg-white rounded-xl border border-brand-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-brand-slate-400 uppercase">Booked Item</span>
                  <p className="font-bold text-brand-navy-900 text-sm truncate" title={bookedItem.name}>
                    {bookedItem.name}
                  </p>
                  <p className="text-[11px] text-brand-teal-700 font-semibold">
                    {detailedTests.length} Tests Included
                  </p>
                  <p className="text-[11px] font-bold text-brand-slate-800">
                    ₹{order.totalAmount || bookedItem.price || 3499} • <span className="text-emerald-700">{order.paymentStatus || 'Paid'}</span>
                  </p>
                </div>

                {/* Collection Slot & Address */}
                <div className="p-3.5 bg-white rounded-xl border border-brand-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-brand-slate-400 uppercase">Collection Slot</span>
                  <p className="font-bold text-brand-navy-900 text-sm">
                    {order.bookingType || order.collection?.method || 'Home Collection'}
                  </p>
                  <p className="text-[11px] text-brand-slate-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-brand-slate-400" />
                    {order.collection?.scheduledDate || order.preferredDate || '02 Oct 2026'} ({order.collection?.scheduledTime || order.preferredTimeSlot || '10:00 AM'})
                  </p>
                  <p className="text-[11px] text-brand-slate-500 truncate flex items-center gap-1" title={order.patient?.address || 'Vijayanagar, Bengaluru'}>
                    <MapPin className="w-3 h-3 text-brand-slate-400 flex-shrink-0" />
                    {order.patient?.address || 'Vijayanagar, Bengaluru'}
                  </p>
                </div>

              </div>

              {/* Fasting Notice Banner if required */}
              {bookedItem.fastingRequired && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span><strong>Pre-analytical requirement:</strong> Strict 10 - 12 hours overnight fasting required. Water is permitted.</span>
                  </div>
                  <span className="font-bold text-[10px] bg-amber-200/60 px-2 py-0.5 rounded text-amber-900 whitespace-nowrap ml-2">
                    Fasting Confirmed
                  </span>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 2. REQUIRED SPECIMEN TUBES & CLINICAL COLOUR GUIDE (HIGH PRIORITY)        */}
              {/* ========================================================================= */}
              <div className="p-4 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-brand-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-50 text-purple-700 rounded-lg border border-purple-200">
                      <Pipette className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-brand-navy-900 text-xs uppercase tracking-wide">
                        Required Specimen Tubes & Color Guide ({requiredTubes.length} Tubes Needed)
                      </h4>
                      <p className="text-[10px] text-brand-slate-500">
                        Phlebotomist must carry these exact vacutainer tube colors for sample draw
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200">
                    Cold Chain: 2°C - 8°C
                  </span>
                </div>

                {/* Tubes Color Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {requiredTubes.map((tube) => (
                    <div
                      key={tube.id}
                      className="p-3 rounded-xl border border-brand-slate-200 bg-brand-slate-50/60 hover:bg-white hover:border-brand-teal-300 hover:shadow-2xs transition-all text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`font-black text-[11px] px-2 py-0.5 rounded-md border flex items-center gap-1.5 ${tube.badgeBg}`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block shadow-2xs flex-shrink-0"
                            style={{ backgroundColor: tube.hex }}
                          />
                          {tube.colorName} ({tube.volume})
                        </span>
                        <span className="text-[10px] font-bold text-brand-slate-500 font-mono">
                          {tube.sampleType}
                        </span>
                      </div>

                      <p className="font-bold text-brand-navy-900 text-xs truncate" title={tube.tests}>
                        {tube.tests}
                      </p>
                      <p className="text-[10px] text-brand-slate-500 line-clamp-1 italic">
                        {tube.instructions}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 3. ACTIVE STAGE ACTION CARD                                              */}
              {/* ========================================================================= */}
              <div className="p-5 bg-white rounded-2xl border-2 border-brand-teal-500/30 shadow-xs space-y-4">
                
                {/* Action Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-brand-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-teal-50 border border-brand-teal-200 text-brand-teal-700 flex items-center justify-center shadow-2xs">
                      <NextActionIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-teal-100 text-brand-teal-800">
                          Step {nextAction.stepNumber} of 5
                        </span>
                        <h3 className="font-extrabold text-brand-navy-900 text-sm">
                          {nextAction.title}
                        </h3>
                      </div>
                      <p className="text-xs text-brand-slate-500 mt-0.5">
                        {nextAction.description}
                      </p>
                    </div>
                  </div>

                  {/* Primary Workflow Advance Button */}
                  <div className="flex items-center gap-2">
                    {stageIdx === 0 && onCancelOrder && (
                      <button
                        onClick={() => onCancelOrder(order)}
                        className="px-3 py-2 text-brand-coral-700 hover:bg-brand-coral-50 font-bold text-xs rounded-xl border border-brand-coral-200 transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    )}

                    <button
                      onClick={nextAction.onExecute}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 ${nextAction.actionColor} font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer`}
                    >
                      <NextActionIcon className="w-4 h-4" />
                      <span>{nextAction.buttonText}</span>
                      {!nextAction.isCompleted && <ArrowRight className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                  </div>
                </div>

                {/* STAGE 1: VERIFY (NEW) */}
                {stageIdx === 0 && (
                  <div className="p-3.5 bg-brand-slate-50 rounded-xl border border-brand-slate-200/80 space-y-2 text-xs">
                    <span className="text-[11px] font-bold text-brand-slate-700 block">Verification Checklist:</span>
                    <div className="space-y-1.5 text-brand-slate-600">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        <span>7 Clinical tests verified with correct vacutainer tube containers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        <span>Patient contact (<strong>{order.patient?.phone}</strong>) & address confirmed for doorstep collection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        <span>Payment received (₹{order.totalAmount || 3499} via {order.paymentMethod || 'Online UPI'})</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* STAGE 2: ASSIGN PHLEBOTOMIST (ADMIN CLICKS AVAILABLE PHLEBOTOMIST)       */}
                {/* ========================================================================= */}
                {stageIdx === 1 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-brand-navy-900 text-xs uppercase tracking-wider block">
                          Available Phlebotomists (Click to Assign):
                        </span>
                        <p className="text-[11px] text-brand-slate-500">
                          Click any phlebotomist card below to directly allocate & dispatch them.
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {availableStaff.filter(s => s.availability === 'Available').length} Phlebotomists Online
                      </span>
                    </div>

                    {/* Interactive Click-to-Assign Phlebotomists Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {availableStaff.map((staffMember) => {
                        const isAvailable = staffMember.availability === 'Available';

                        return (
                          <div
                            key={staffMember.staffId}
                            onClick={() => handleAssignStaff(staffMember)}
                            className="p-3.5 rounded-xl border-2 border-brand-slate-200 bg-white hover:border-brand-teal-500 hover:bg-brand-teal-50/30 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between gap-3 text-xs"
                          >
                            <div className="space-y-2">
                              {/* Phlebotomist Header */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-brand-teal-100 text-brand-teal-800 font-bold flex items-center justify-center text-xs shadow-2xs group-hover:bg-brand-teal-600 group-hover:text-white transition-colors">
                                    {staffMember.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-brand-navy-900 text-xs group-hover:text-brand-teal-800 transition-colors">
                                      {staffMember.name}
                                    </h4>
                                    <span className="font-mono text-[10px] text-brand-slate-400 font-semibold block">
                                      {staffMember.staffId}
                                    </span>
                                  </div>
                                </div>

                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                                  isAvailable
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-brand-slate-100 text-brand-slate-600'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-brand-slate-400'}`} />
                                  {staffMember.availability}
                                </span>
                              </div>

                              {/* Details */}
                              <div className="space-y-1 text-[11px] text-brand-slate-600 pt-1 border-t border-brand-slate-100">
                                <p className="truncate flex items-center gap-1" title={staffMember.serviceArea}>
                                  <MapPin className="w-3 h-3 text-brand-slate-400 flex-shrink-0" />
                                  {staffMember.serviceArea}
                                </p>
                                <p className="flex items-center gap-1 font-mono text-brand-slate-700">
                                  <Phone className="w-3 h-3 text-brand-slate-400 flex-shrink-0" />
                                  {staffMember.phone}
                                </p>
                                <p className="flex items-center justify-between text-[10px] text-brand-slate-500 pt-0.5">
                                  <span>🛵 {staffMember.vehicleNumber}</span>
                                  <span className="font-bold text-brand-teal-700 flex items-center gap-0.5">
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    {staffMember.rating}
                                  </span>
                                </p>
                              </div>
                            </div>

                            {/* Direct One-Click Assignment Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignStaff(staffMember);
                              }}
                              className="w-full py-1.5 px-2 bg-brand-teal-50 group-hover:bg-brand-teal-600 text-brand-teal-800 group-hover:text-white font-bold text-[11px] rounded-lg border border-brand-teal-200 group-hover:border-transparent transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Assign {staffMember.name.split(' ')[0]}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STAGE 3: SAMPLE IN TRANSIT / COLLECTED */}
                {stageIdx === 2 && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-indigo-600" />
                          Phlebotomist {collector?.name || 'Suresh Kumar'} is out collecting samples
                        </span>
                        <p className="text-indigo-800 text-[11px] mt-0.5">
                          Phone: <a href={`tel:${collector?.phone || '+919876543211'}`} className="font-mono underline">{collector?.phone || '+91 98765 43211'}</a> • Vehicle: {collector?.vehicle || 'KA-04-SK-1004'}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900">
                        🛵 Out for Collection
                      </span>
                    </div>

                    <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200 text-xs text-brand-slate-600 flex items-center justify-between">
                      <span>Collector bringing Lavender, Grey, Gold tubes & Urine cup back to lab.</span>
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 font-mono">
                        In Transit
                      </span>
                    </div>
                  </div>
                )}

                {/* STAGE 4: TESTING & UPLOAD REPORT */}
                {stageIdx === 3 && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-brand-teal-50/60 rounded-xl border border-brand-teal-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-bold text-brand-teal-950 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          All specimen tubes accessioned & verified at central lab
                        </span>
                        <p className="text-brand-teal-800 text-[11px] mt-0.5">
                          Analyzers (Beckman Coulter AU480 & Sysmex XN-550) processed samples. Ready for certified report upload.
                        </p>
                      </div>
                      <button
                        onClick={() => setRecollectionModalOpen(true)}
                        className="px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Flag Issue / Recollect
                      </button>
                    </div>
                  </div>
                )}

                {/* STAGE 5: REPORT READY / DELIVER */}
                {stageIdx === 4 && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                          Certified Diagnostic Report Ready (#{order.reportId || 'REP10001'})
                        </span>
                        <p className="text-emerald-800 text-[11px] mt-0.5">
                          Signed by Dr. Ramesh S. Rao, MD. Ready to deliver to patient via WhatsApp & Email.
                        </p>
                      </div>
                      {onPreviewReport && (
                        <button
                          onClick={() => onPreviewReport(order)}
                          className="px-3 py-1.5 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-xl border border-emerald-300 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          Preview PDF
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* STAGE 6: COMPLETED */}
                {stageIdx === 5 && (
                  <div className="p-3.5 bg-brand-teal-50/60 rounded-xl border border-brand-teal-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-brand-teal-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Report Successfully Delivered to Patient!
                      </span>
                      <p className="text-brand-teal-800 text-[11px] mt-0.5">
                        Delivered to WhatsApp (+91 {order.patient?.phone}) & Email ({order.patient?.email}). Lifecycle complete.
                      </p>
                    </div>
                    {onPreviewReport && (
                      <button
                        onClick={() => onPreviewReport(order)}
                        className="px-3.5 py-2 bg-white text-brand-teal-800 hover:bg-brand-teal-50 font-bold text-xs rounded-xl border border-brand-teal-300 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-brand-teal-600" />
                        View Final Report
                      </button>
                    )}
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 2: CLINICAL TESTS & SPECIMEN TUBES */}
          {activeTab === 'tests' && (
            <div className="p-4 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-3 max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-brand-slate-100 pb-2">
                <div>
                  <h3 className="font-bold text-brand-navy-900 text-sm flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-brand-teal-600" />
                    Clinical Panel Tests ({detailedTests.length})
                  </h3>
                  <p className="text-[11px] text-brand-slate-500">Specimen tubes, turnaround times, and parameters</p>
                </div>
                <span className="font-mono text-xs font-bold text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                  {bookedItem.code}
                </span>
              </div>

              <div className="space-y-2">
                {detailedTests.map((t, idx) => (
                  <div key={idx} className="p-3 bg-brand-slate-50/70 rounded-xl border border-brand-slate-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-brand-teal-600 text-white flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-brand-navy-900">{t.name}</p>
                        <p className="text-[10px] text-brand-slate-500">{t.category} • Code: {t.code}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div className="flex items-center gap-1.5">
                        <TubeColorDot tube={t.tubeContainer || t.tubeIdentifier} testCode={t.code} size="sm" />
                        <span className="text-[11px] text-brand-slate-700 font-semibold">{t.tubeContainer || t.sampleRequired}</span>
                      </div>
                      <span className="text-[10px] font-mono text-brand-slate-400 hidden sm:inline">{t.tat || bookedItem.tat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT TRAIL */}
          {activeTab === 'timeline' && (
            <div className="max-w-3xl mx-auto">
              <OrderTimeline order={order} />
            </div>
          )}

        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="px-6 py-3 border-t border-brand-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shadow-lg flex-shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-brand-slate-400">Order State:</span>
            <span className="font-mono font-bold text-brand-navy-900 bg-brand-slate-100 px-2 py-0.5 rounded border border-brand-slate-200">
              {currentStatus}
            </span>
            <span className="text-brand-slate-500 hidden sm:inline">
              • Patient: <strong className="text-brand-navy-900">{order.patient?.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeTab !== 'flow' && nextAction && (
              <button
                onClick={nextAction.onExecute}
                className={`inline-flex items-center gap-1.5 px-4 py-2 ${nextAction.actionColor} font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer`}
              >
                <NextActionIcon className="w-4 h-4" />
                <span>{nextAction.buttonText}</span>
                {!nextAction.isCompleted && <ArrowRight className="w-3.5 h-3.5 ml-0.5" />}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Recollection / Issue Modal */}
        {recollectionModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-amber-300 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-brand-slate-100 pb-2">
                <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Flag Pre-Analytical Problem & Trigger Recollection
                </h4>
                <button
                  onClick={() => setRecollectionModalOpen(false)}
                  className="p-1 text-brand-slate-400 hover:text-brand-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-brand-slate-700 block mb-1">Issue Reason:</label>
                  <select
                    value={issueReason}
                    onChange={(e) => setIssueReason(e.target.value)}
                    className="w-full p-2 rounded-xl border border-brand-slate-200 font-medium"
                  >
                    <option value="Insufficient Sample">Insufficient Sample</option>
                    <option value="Wrong Container">Wrong Container</option>
                    <option value="Damaged Container">Damaged Container</option>
                    <option value="Leaking Container">Leaking Container</option>
                    <option value="Incorrect Label">Incorrect Label</option>
                    <option value="Sample Not Suitable">Sample Not Suitable</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-brand-slate-700 block mb-1">Remarks:</label>
                  <textarea
                    rows={3}
                    value={issueNotes}
                    onChange={(e) => setIssueNotes(e.target.value)}
                    placeholder="Enter details on why the sample cannot be accepted."
                    className="w-full p-2.5 rounded-xl border border-brand-slate-200 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-slate-100">
                <button
                  onClick={() => setRecollectionModalOpen(false)}
                  className="px-3.5 py-2 bg-brand-slate-100 text-brand-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleIssueSubmit}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Trigger Recollection
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
