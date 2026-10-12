import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Building2,
  TestTube2,
  Pipette,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Eye,
  Download,
  Send,
  UserCheck,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Activity,
  Truck,
  Flame,
  CheckSquare,
  HelpCircle,
  RefreshCw,
  ArrowRight,
  Play,
  FileSpreadsheet,
  Check,
  Upload,
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import OrderTimeline from './OrderTimeline';
import { MASTER_TESTS, COLLECTION_STAFF } from '../../../data/labData';
import { useToast } from '../../../context/ToastContext';
import TubeColorDot, { TubeColorGroup } from './TubeColorBadge';

// 6 Practical Milestones for the Real Admin Workflow
const LIFECYCLE_STEPS = [
  { key: 'NEW', label: '1. Booked', short: '1. Booked' },
  { key: 'VERIFIED', label: '2. Verified', short: '2. Verified' },
  { key: 'ASSIGNED', label: '3. Collector Assigned', short: '3. Assigned' },
  { key: 'RECEIVED', label: '4. Sample at Lab', short: '4. Sample at Lab' },
  { key: 'REPORT_UPLOADED', label: '5. Report Uploaded', short: '5. Report Uploaded' },
  { key: 'COMPLETED', label: '6. Completed', short: '6. Completed' }
];

export default function OrderDetailDrawer({
  isOpen,
  onClose,
  order,
  orders = [],
  onSelectOrder,
  allTests = MASTER_TESTS,
  onVerifyOrder,
  onScheduleCollection,
  onPhlebotomistStep,
  onMarkSampleCollected,
  onMarkSampleReceived,
  onVerifySample,
  onStartProcessing,
  onUploadReport,
  onVerifyReport,
  onSendToPatient,
  onPreviewReport,
  onCancelOrder,
  onTriggerRecollection,
  onAdvanceDemoStep,
  onResetOrderDemo
}) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('workspace'); // 'workspace' | 'tests' | 'timeline'
  const [recollectionModalOpen, setRecollectionModalOpen] = useState(false);
  const [issueReason, setIssueReason] = useState('Insufficient Sample');
  const [issueNotes, setIssueNotes] = useState('');
  
  // Phlebotomist checklist state for simulation
  const [checklist, setChecklist] = useState({});

  useEffect(() => {
    if (order?.includedTests) {
      const initialMap = {};
      order.includedTests.forEach((t) => {
        initialMap[t.code] = true;
      });
      setChecklist(initialMap);
    }
  }, [order]);

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

  const bookedItem = order.bookedItem || {
    name: order.testOrPackage?.name || 'Complete Health Screening Package',
    code: order.testOrPackage?.code || 'PKG-CHS-01',
    type: order.testOrPackage?.type === 'package' ? 'Package' : 'Package',
    category: order.testOrPackage?.category || 'Full Body Health Screening',
    description: order.testOrPackage?.description || 'Comprehensive 7-panel health screening package.',
    price: order.totalAmount || 3499,
    tat: order.testOrPackage?.tat || '8 - 12 Hours',
    fastingRequired: order.testOrPackage?.fastingRequired ?? true,
    preparation: order.testOrPackage?.prepSummary || 'Follow the preparation instructions configured for the booked tests/package.'
  };

  // Resolved tests from order or master catalogue
  const detailedTests = (order.includedTests && order.includedTests.length > 0)
    ? order.includedTests
    : allTests.slice(0, 7);

  // Required sample tubes
  const sampleContainers = (order.requiredSamples && order.requiredSamples.length > 0)
    ? order.requiredSamples
    : [
        {
          sampleNumber: 'Sample 01',
          sampleType: 'Blood',
          container: 'EDTA blood collection tube',
          tubeIdentifier: 'Purple / EDTA (2ml)',
          tests: 'Complete Blood Count (CBC)',
          status: currentStatus === 'NEW' || currentStatus === 'VERIFIED' ? 'Pending' : 'Collected'
        },
        {
          sampleNumber: 'Sample 02',
          sampleType: 'Blood',
          container: 'Sodium Fluoride & SST Gel Vacutainer tubes',
          tubeIdentifier: 'Grey (2ml) & Gold Top (4ml)',
          tests: 'Fasting Blood Glucose, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test',
          status: currentStatus === 'NEW' || currentStatus === 'VERIFIED' ? 'Pending' : 'Collected'
        },
        {
          sampleNumber: 'Sample 03',
          sampleType: 'Urine',
          container: 'Urine specimen container',
          tubeIdentifier: 'Sterile Urine Container (50ml)',
          tests: 'Routine Urine Examination',
          status: currentStatus === 'NEW' || currentStatus === 'VERIFIED' ? 'Pending' : 'Collected'
        }
      ];

  const collector = order.assignedStaffDetails || order.collection?.assignedCollector || {
    name: order.assignedStaff || 'Suresh Kumar',
    id: 'PH1004',
    phone: '+91 98765 43211',
    vehicle: 'KA-04-SK-1004',
    status: 'Available',
    location: 'Near Patient (Vijayanagar, Bengaluru)'
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

  // Compute Current Stage Index for Stepper (0 to 5)
  const getCurrentStageIndex = () => {
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

  const currentStageIdx = getCurrentStageIndex();

  // Next Milestone Details for Real Practical Admin Flow
  const getNextActionInfo = () => {
    // 1. New Order -> Admin Verifies
    if (currentStatus === 'NEW' || currentStatus === 'BOOKED') {
      return {
        stepLabel: 'Verify Request',
        buttonText: 'Verify Order',
        badge: 'Pending Verification',
        description: 'Verify patient tests, fasting guidelines, and address before dispatching collector.',
        actionColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        icon: CheckCircle2,
        onExecute: () => (onAdvanceDemoStep ? onAdvanceDemoStep(order.orderId) : onVerifyOrder && onVerifyOrder(order))
      };
    }

    // 2. Verified -> Admin Assigns Collector
    if (currentStatus === 'VERIFIED' || currentStatus === 'ADMIN VERIFIED' || currentStatus === 'PENDING VERIFICATION') {
      return {
        stepLabel: 'Assign Collector',
        buttonText: 'Assign Collector',
        badge: 'Verified & Ready for Dispatch',
        description: 'Assign phlebotomist Suresh Kumar (PH1004) to collect blood/urine samples from patient doorstep.',
        actionColor: 'bg-brand-teal-600 hover:bg-brand-teal-700 text-white',
        icon: UserCheck,
        onExecute: () => (onAdvanceDemoStep ? onAdvanceDemoStep(order.orderId) : onScheduleCollection && onScheduleCollection(order))
      };
    }

    // 3. Collector is Out -> Collector brings sample back to lab -> Admin marks Sample at Lab
    if (
      currentStatus === 'PHLEBOTOMIST ASSIGNED' ||
      currentStatus === 'COLLECTOR ASSIGNED' ||
      currentStatus === 'COLLECTION SCHEDULED' ||
      currentStatus === 'ACCEPTED' ||
      currentStatus === 'ON THE WAY' ||
      currentStatus === 'ARRIVED' ||
      currentStatus === 'PATIENT VERIFIED' ||
      currentStatus === 'COLLECTION STARTED' ||
      currentStatus === 'SAMPLE COLLECTED' ||
      currentStatus === 'COLLECTED'
    ) {
      return {
        stepLabel: 'Sample Brought to Lab',
        buttonText: 'Sample Reached Lab',
        badge: 'Collector Dispatched',
        description: 'Collector collects specimen tubes from patient and hands them over at lab reception desk.',
        actionColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        icon: Building2,
        onExecute: () => (onAdvanceDemoStep ? onAdvanceDemoStep(order.orderId) : onMarkSampleReceived && onMarkSampleReceived(order.orderId))
      };
    }

    // 4. Sample is at Lab -> Lab runs tests -> Admin uploads completed report
    if (
      currentStatus === 'SAMPLE RECEIVED' ||
      currentStatus === 'RECEIVED' ||
      currentStatus === 'SAMPLE VERIFIED' ||
      currentStatus === 'PROCESSING' ||
      currentStatus === 'IN LAB / PROCESSING' ||
      currentStatus === 'REPORT PENDING'
    ) {
      return {
        stepLabel: 'Upload Test Report',
        buttonText: 'Upload Ready Report',
        badge: 'Testing in Lab',
        description: 'Lab technicians tested the blood/urine samples. Admin uploads the certified diagnostic report.',
        actionColor: 'bg-brand-teal-600 hover:bg-brand-teal-700 text-white',
        icon: Upload,
        onExecute: () => (onAdvanceDemoStep ? onAdvanceDemoStep(order.orderId) : onUploadReport && onUploadReport(order))
      };
    }

    // 5. Report Uploaded -> Admin sends report to patient
    if (currentStatus === 'REPORT UPLOADED' || currentStatus === 'REPORT READY' || currentStatus === 'REPORT VERIFIED' || currentStatus === 'VERIFIED REPORT') {
      return {
        stepLabel: 'Deliver to Patient',
        buttonText: 'Send to Patient',
        badge: 'Report Ready',
        description: 'Send official signed report directly to patient Rahul Kumar via WhatsApp & Email.',
        actionColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        icon: Send,
        onExecute: () => (onAdvanceDemoStep ? onAdvanceDemoStep(order.orderId) : onSendToPatient && onSendToPatient(order.orderId))
      };
    }

    // 6. Completed
    if (currentStatus === 'COMPLETED' || currentStatus === 'REPORT DELIVERED') {
      return {
        stepLabel: 'Completed',
        buttonText: 'View Final Report',
        badge: 'Completed & Delivered',
        description: 'Diagnostic report delivered successfully to patient. Lifecycle complete!',
        actionColor: 'bg-brand-teal-50 hover:bg-brand-teal-100 text-brand-teal-800 border border-brand-teal-300',
        icon: FileText,
        isCompleted: true,
        onExecute: () => onPreviewReport && onPreviewReport(order)
      };
    }

    return {
      stepLabel: 'Next Step',
      buttonText: 'Advance Step',
      badge: currentStatus,
      description: 'Advance patient request.',
      actionColor: 'bg-brand-teal-600 hover:bg-brand-teal-700 text-white',
      icon: ArrowRight,
      onExecute: () => onAdvanceDemoStep && onAdvanceDemoStep(order.orderId)
    };
  };


  const nextAction = getNextActionInfo();
  const NextActionIcon = nextAction.icon;

  const isPhlebDone = (stepName) => {
    const steps = [
      'NEW',
      'VERIFIED',
      'PHLEBOTOMIST ASSIGNED',
      'ACCEPTED',
      'ON THE WAY',
      'ARRIVED',
      'PATIENT VERIFIED',
      'COLLECTION STARTED',
      'SAMPLE COLLECTED',
      'SAMPLE RECEIVED',
      'SAMPLE VERIFIED',
      'PROCESSING',
      'REPORT PENDING',
      'REPORT UPLOADED',
      'REPORT VERIFIED',
      'REPORT DELIVERED',
      'COMPLETED'
    ];
    const orderIdx = steps.indexOf(currentStatus);
    const stepIdx = steps.indexOf(stepName);
    return orderIdx >= stepIdx && orderIdx !== -1 && stepIdx !== -1;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-white rounded-2xl max-h-[92vh] shadow-2xl flex flex-col border border-brand-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-brand-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shadow-2xs flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-teal-50 text-brand-teal-700 rounded-xl border border-brand-teal-200 shadow-2xs">
              <TestTube2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-brand-navy-900 text-white">
                  LAB ORDER #{order.orderId}
                </span>
                <StatusBadge status={order.orderStatus} size="sm" />
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  {bookedItem.type}: {detailedTests.length} Tests
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200">
                  {order.bookingType || 'Home Collection'}
                </span>
              </div>
              <p className="text-xs text-brand-slate-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span>Patient: <strong className="text-brand-navy-900">{order.patient?.name}</strong> ({order.patient?.patientId} • {order.patient?.age}Y • {order.patient?.gender})</span>
                <span>• Phone: <strong className="font-mono text-brand-navy-900">{order.patient?.phone}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Multi-patient pager */}
            {orderList.length > 1 && (
              <div className="flex items-center bg-brand-slate-100 rounded-xl p-1 border border-brand-slate-200/80 mr-1 text-xs">
                <button
                  onClick={handlePrevPatient}
                  disabled={!hasPrev}
                  className="p-1 rounded-lg hover:bg-white text-brand-slate-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  title="Previous Patient Request"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-semibold text-brand-slate-700 select-none">
                  {currentIdx + 1} / {orderList.length}
                </span>
                <button
                  onClick={handleNextPatient}
                  disabled={!hasNext}
                  className="p-1 rounded-lg hover:bg-white text-brand-slate-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  title="Next Patient Request"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick 1-Click Milestone Action Button */}
            {!nextAction.isCompleted && (
              <button
                onClick={nextAction.onExecute}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 ${nextAction.actionColor} text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer`}
                title={`Advance to ${nextAction.stepLabel}`}
              >
                <NextActionIcon className="w-4 h-4" />
                <span>Next: {nextAction.buttonText}</span>
              </button>
            )}

            {/* Reset Order Workflow Demo */}
            {onResetOrderDemo && (
              <button
                onClick={() => onResetOrderDemo(order.orderId)}
                className="p-2 text-brand-slate-500 hover:text-brand-teal-700 hover:bg-brand-teal-50 rounded-xl transition-colors cursor-pointer"
                title="Reset this patient's workflow to initial NEW state"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Close Workspace"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visual 8-Step Interactive Pipeline Stepper */}
        <div className="bg-brand-slate-50/90 border-b border-brand-slate-200 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-brand-teal-600" />
              Patient Care & Testing Pipeline
            </span>
            <span className="text-[11px] font-bold text-brand-teal-800">
              Stage {Math.min(currentStageIdx + 1, 8)} of 8: <strong className="uppercase">{currentStatus}</strong>
            </span>
          </div>

          <div className="overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center min-w-[700px] justify-between relative">
              {LIFECYCLE_STEPS.map((step, idx) => {
                const isPassed = currentStatus !== 'CANCELLED' && currentStageIdx > idx;
                const isCurrent = currentStatus !== 'CANCELLED' && currentStageIdx === idx;

                return (
                  <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-2xs ${
                        isCurrent
                          ? 'bg-brand-teal-600 text-white ring-4 ring-brand-teal-100 scale-110 font-black'
                          : isPassed
                          ? 'bg-brand-teal-600 text-white'
                          : 'bg-white border-2 border-brand-slate-300 text-brand-slate-400'
                      }`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-1.5 text-center font-semibold leading-tight max-w-[85px] ${
                        isCurrent
                          ? 'text-brand-teal-900 font-extrabold'
                          : isPassed
                          ? 'text-brand-slate-700'
                          : 'text-brand-slate-400'
                      }`}
                    >
                      {step.short}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Prominent Next Action Guidance Banner */}
        <div className="bg-gradient-to-r from-brand-teal-50/80 via-white to-brand-slate-50 px-6 py-3 border-b border-brand-slate-200/80 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-brand-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-slate-900">
                  Current Status: <strong className="text-brand-teal-800">{currentStatus}</strong>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-teal-100/70 text-brand-teal-900">
                  {nextAction.badge}
                </span>
              </div>
              <p className="text-xs text-brand-slate-600 truncate mt-0.5">
                {nextAction.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(currentStatus === 'REPORT UPLOADED' || currentStatus === 'REPORT READY' || currentStatus === 'REPORT VERIFIED' || currentStatus === 'VERIFIED REPORT') && onPreviewReport && (
              <button
                onClick={() => onPreviewReport(order)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-brand-teal-800 border border-brand-teal-300 hover:bg-brand-teal-50 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                title="View complete official ready report before sending to patient"
              >
                <FileText className="w-3.5 h-3.5 text-brand-teal-600" />
                <span>View Ready Report</span>
              </button>
            )}

            <button
              onClick={nextAction.onExecute}
              className={`inline-flex items-center gap-1.5 px-4 py-2 ${nextAction.actionColor} text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer`}
            >
              <NextActionIcon className="w-4 h-4" />
              <span>{nextAction.buttonText}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-brand-slate-200 bg-white gap-2 overflow-x-auto text-xs font-bold scrollbar-none flex-shrink-0">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'workspace'
                ? 'border-brand-teal-600 text-brand-teal-700 bg-brand-teal-50/40'
                : 'border-transparent text-brand-slate-600 hover:text-brand-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-teal-600" />
            Overview & Workspace
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tests'
                ? 'border-brand-teal-600 text-brand-teal-700 bg-brand-teal-50/40'
                : 'border-transparent text-brand-slate-600 hover:text-brand-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-brand-teal-600" />
            Clinical Tests & Tubes ({detailedTests.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-brand-teal-600 text-brand-teal-700 bg-brand-teal-50/40'
                : 'border-transparent text-brand-slate-600 hover:text-brand-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-brand-slate-600" />
            Operational Audit Trail
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs bg-brand-slate-50/50">

          {/* TAB 1: ALL-IN-ONE PATIENT WORKSPACE */}
          {activeTab === 'workspace' && (
            <div className="space-y-6">

              {/* 1. ORDER & PATIENT CARD */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                      Order Summary
                    </span>
                    <h2 className="text-xl font-black text-slate-900 font-mono tracking-tight flex items-center gap-2">
                      LAB ORDER #{order.orderId}
                      <StatusBadge status={order.orderStatus} size="sm" />
                    </h2>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">₹{order.totalAmount || 3499}</span>
                    <span className="block text-xs font-bold text-emerald-700">
                      Payment: {order.paymentStatus || 'Paid'} ({order.paymentMethod || 'Online UPI'})
                    </span>
                  </div>
                </div>

                {/* Patient and Booking Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Patient</span>
                    <p className="font-extrabold text-slate-900 text-sm mt-0.5">{order.patient?.name}</p>
                    <p className="text-[11px] text-slate-600">{order.patient?.patientId} • {order.patient?.age} Years • {order.patient?.gender}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">📞 {order.patient?.phone}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Booked Package</span>
                    <p className="font-extrabold text-slate-900 text-sm mt-0.5">{bookedItem.name}</p>
                    <p className="text-[11px] text-teal-700 font-semibold">{bookedItem.category}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Code: {bookedItem.code}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Collection Slot</span>
                    <p className="font-bold text-slate-900 mt-0.5">{order.collection?.method || order.bookingType || 'Home Collection'}</p>
                    <p className="text-[11px] text-slate-700 font-bold">
                      📅 {order.collection?.scheduledDate || order.preferredDate || '08 Oct 2026'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      ⏰ {order.collection?.scheduledTime || order.preferredTimeSlot || '10:00 AM - 11:00 AM'}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Collector</span>
                    <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                      {collector.name}
                    </p>
                    <p className="text-[11px] text-slate-600 font-mono">ID: {collector.id} • {collector.status || 'Assigned'}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Location: {collector.location || 'Near Patient'}</p>
                  </div>
                </div>

                {/* Patient Address Banner */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center gap-2 text-xs text-slate-700">
                  <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span><strong>Collection Address:</strong> {order.patient?.address || '142, 4th Cross, 2nd Main, Vijayanagar, Bengaluru - 560040'}</span>
                </div>
              </div>

              {/* 2. CLINICAL TESTS & SPECIMEN TUBES */}
              <div className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-teal-600" />
                    <h3 className="font-bold text-brand-navy-900 text-sm">
                      Tests Included in Panel ({detailedTests.length})
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-coral-700 bg-brand-coral-50 px-2.5 py-0.5 rounded-full border border-brand-coral-200">
                      {bookedItem.fastingRequired ? 'Strict Overnight Fasting (10 - 12 Hours)' : 'No Fasting'}
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-brand-teal-50 text-brand-teal-700 rounded border border-brand-teal-200">
                      {bookedItem.code}
                    </span>
                  </div>
                </div>

                {/* Tests Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {detailedTests.map((test, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-brand-slate-200/90 bg-brand-slate-50/70 hover:bg-white hover:border-brand-teal-300 hover:shadow-xs transition-all space-y-2"
                    >
                      <div className="flex items-center gap-2 justify-between">
                        <span className="w-5 h-5 rounded-full bg-brand-teal-600 text-white flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-mono text-[10px] text-brand-slate-400 font-bold">{test.code}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-navy-900 text-xs">{test.name}</h4>
                        <p className="text-[11px] text-teal-700 font-medium">{test.category}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-600 flex items-center justify-between">
                        <span><strong>Sample:</strong> {test.sampleRequired}</span>
                        <div className="flex items-center gap-1.5" title={test.tubeContainer || test.tubeIdentifier}>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Tube</span>
                          <TubeColorDot tube={test.tubeContainer || test.tubeIdentifier} testCode={test.code} size="md" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. PHLEBOTOMY MILESTONES & SPECIMEN CUSTODY */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Assigned Collector / Phlebotomist Status Card */}
                <div className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-brand-slate-100 pb-2">
                    <h3 className="font-bold text-brand-navy-900 text-sm flex items-center gap-2">
                      <Truck className="w-4 h-4 text-brand-teal-600" />
                      Assigned Collector / Phlebotomist
                    </h3>
                    <span className="text-[11px] font-bold text-brand-teal-800 bg-brand-teal-50 px-2.5 py-0.5 rounded-full border border-brand-teal-200">
                      {collector.name}
                    </span>
                  </div>

                  {/* Clean Operational Status Box */}
                  <div className="p-3.5 rounded-xl border border-brand-slate-200 bg-brand-slate-50 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-brand-slate-500 font-medium text-xs">Field Status:</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        currentStageIdx >= 3
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : currentStageIdx >= 2
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-brand-slate-100 text-brand-slate-600'
                      }`}>
                        {currentStageIdx >= 3
                          ? '✓ Samples Delivered to Lab'
                          : currentStageIdx >= 2
                          ? '🛵 Out for Doorstep Collection'
                          : 'Awaiting Collector Assignment'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1.5 border-t border-brand-slate-200/60">
                      <div>
                        <span className="text-[10px] text-brand-slate-400 uppercase font-bold block">Collector ID</span>
                        <span className="font-mono font-bold text-brand-navy-900">{collector.id || 'PH1004'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-brand-slate-400 uppercase font-bold block">Contact Phone</span>
                        <a href={`tel:${collector.phone}`} className="font-mono font-bold text-brand-teal-700 hover:underline">
                          {collector.phone || '+91 98765 43211'}
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] text-brand-slate-400 uppercase font-bold block">Vehicle</span>
                        <span className="font-bold text-brand-slate-800">{collector.vehicle || 'KA-04-SK-1004'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-brand-slate-400 uppercase font-bold block">Status Note</span>
                        <span className="font-medium text-brand-slate-700">
                          {currentStageIdx >= 3 ? 'Brought samples to lab' : 'Out to bring samples'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Direct Action when collector arrives with tubes */}
                  {currentStageIdx === 2 && (
                    <div className="p-3 bg-brand-teal-50/80 rounded-xl border border-brand-teal-200 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-brand-teal-900">
                        <p className="font-bold">Collector arrived with samples?</p>
                        <p className="text-brand-teal-700 text-[10px]">Confirm specimen tubes received at lab reception desk.</p>
                      </div>
                      <button
                        onClick={() => onMarkSampleReceived ? onMarkSampleReceived(order.orderId) : onAdvanceDemoStep && onAdvanceDemoStep(order.orderId)}
                        className="px-3 py-1.5 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Sample Reached Lab
                      </button>
                    </div>
                  )}
                </div>

                {/* Specimen Custody & Barcodes */}
                <div className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-brand-slate-100 pb-2">
                    <h3 className="font-bold text-brand-navy-900 text-sm flex items-center gap-2">
                      <Pipette className="w-4 h-4 text-brand-teal-600" />
                      Specimen Barcodes & Tubes
                    </h3>
                    <button
                      onClick={() => setRecollectionModalOpen(true)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-300 transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Flag Issue
                    </button>
                  </div>

                  <div className="space-y-2">
                    {sampleContainers.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl border border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <TubeColorDot tube={s.container || s.tubeContainer || s.tubeIdentifier} size="md" />
                          <div>
                            <span className="font-mono font-bold text-brand-teal-800 text-xs">
                              {order.sampleDetails?.samples?.[idx]?.sampleId || `SMP1000${idx + 1}`}
                            </span>
                            <p className="text-[10px] text-brand-slate-500">{s.tubeIdentifier || s.container}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              currentStageIdx >= 3
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-brand-slate-100 text-brand-slate-500'
                            }`}
                          >
                            {currentStageIdx >= 3 ? 'Collected' : 'Pending'}
                          </span>
                          <p className="text-[10px] text-brand-slate-400 mt-0.5">{s.sampleType}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-brand-slate-400 italic pt-1">
                    Temperature-controlled cold-chain maintained at 2°C - 8°C.
                  </p>
                </div>

              </div>

              {/* 4. ANALYZERS & REPORT STATUS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                {/* Processing Panel */}
                <div className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-brand-slate-100 pb-2">
                    <h3 className="font-bold text-brand-navy-900 text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4 text-brand-teal-600" />
                      Automated Clinical Analyzers
                    </h3>
                    <StatusBadge status={currentStageIdx >= 5 ? 'Processing' : 'Pending'} size="sm" />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-brand-slate-50 rounded-xl border border-brand-slate-200 flex justify-between">
                      <span className="text-brand-slate-500">Analyzer Platforms:</span>
                      <strong className="text-brand-navy-900">Beckman Coulter AU480 & Sysmex XN-550</strong>
                    </div>
                    <div className="p-2.5 bg-brand-slate-50 rounded-xl border border-brand-slate-200 flex justify-between">
                      <span className="text-brand-slate-500">Accession Reference:</span>
                      <strong className="text-brand-navy-900 font-mono">{order.sampleId || 'SMP10001'}</strong>
                    </div>
                    <div className="p-2.5 bg-brand-slate-50 rounded-xl border border-brand-slate-200 flex justify-between">
                      <span className="text-brand-slate-500">SLA Turnaround Time:</span>
                      <strong className="text-brand-teal-700">{bookedItem.tat || '8 - 12 Hours'}</strong>
                    </div>
                  </div>
                </div>

                {/* Report Panel */}
                <div className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-brand-slate-100 pb-2">
                    <h3 className="font-bold text-brand-navy-900 text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-teal-600" />
                      Certified Diagnostic Report
                    </h3>
                    <span className="font-mono text-xs font-bold text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                      {order.reportId || 'REP10001'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-brand-slate-50 rounded-xl border border-brand-slate-200 flex justify-between">
                      <span className="text-brand-slate-500">Signing Pathologist:</span>
                      <strong className="text-brand-navy-900">Dr. Ramesh S. Rao, MD (Chief Pathologist)</strong>
                    </div>
                    <div className="p-2.5 bg-brand-slate-50 rounded-xl border border-brand-slate-200 flex justify-between">
                      <span className="text-brand-slate-500">Patient Delivery Channels:</span>
                      <strong className="text-brand-navy-900">WhatsApp & Email</strong>
                    </div>
                    
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => onPreviewReport && onPreviewReport(order)}
                        className="flex-1 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview Diagnostic Report PDF
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: DETAILED TESTS CATALOGUE & PREPARATION */}
          {activeTab === 'tests' && (
            <div className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-4">
              <div className="border-b border-brand-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-brand-navy-900 text-base flex items-center gap-2">
                    <Pipette className="w-5 h-5 text-brand-teal-600" />
                    Clinical Panel Test Details
                  </h3>
                  <p className="text-xs text-brand-slate-500 mt-0.5">
                    Specimen handling, tube requirements, and pre-analytical instructions
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-brand-teal-50 text-brand-teal-800 rounded-lg border border-brand-teal-200">
                  {detailedTests.length} Tests Included
                </span>
              </div>

              <div className="space-y-3">
                {detailedTests.map((t, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-brand-slate-200 bg-brand-slate-50/50 space-y-2">
                    <div className="flex justify-between items-center font-bold text-brand-navy-900 border-b border-brand-slate-200/60 pb-1.5">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-teal-600 text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        {t.name}
                      </span>
                      <span className="font-mono text-xs text-brand-teal-700">{t.code}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-brand-slate-400 block text-[10px] uppercase font-bold">Specimen</span>
                        <strong className="text-brand-slate-800">{t.sampleRequired}</strong>
                      </div>
                      <div>
                        <span className="text-brand-slate-400 block text-[10px] uppercase font-bold">Container / Tube</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <TubeColorDot tube={t.tubeContainer || t.tubeIdentifier} size="sm" />
                          <strong className="text-brand-slate-800">{t.tubeContainer}</strong>
                        </div>
                      </div>
                      <div>
                        <span className="text-brand-slate-400 block text-[10px] uppercase font-bold">Category</span>
                        <strong className="text-brand-teal-700">{t.category}</strong>
                      </div>
                      <div>
                        <span className="text-brand-slate-400 block text-[10px] uppercase font-bold">Turnaround</span>
                        <strong className="text-brand-slate-800">{t.tat || bookedItem.tat}</strong>
                      </div>
                    </div>

                    {t.collectionInstructions && (
                      <p className="text-[11px] text-brand-slate-600 pt-1 border-t border-brand-slate-200/50 italic">
                        <strong>Protocol:</strong> {t.collectionInstructions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: OPERATIONAL AUDIT TIMELINE */}
          {activeTab === 'timeline' && (
            <OrderTimeline order={order} />
          )}

        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="px-6 py-4 border-t border-brand-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shadow-lg flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-brand-slate-400">Order State:</span>
            <span className="text-xs font-black font-mono text-brand-navy-900 bg-brand-slate-100 px-2.5 py-1 rounded-lg border border-brand-slate-200">
              {currentStatus}
            </span>
            <span className="hidden sm:inline-block text-xs text-brand-slate-500">
              • Patient: <strong className="text-brand-navy-900">{order.patient?.name}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Contextual Secondary Action Button */}
            {currentStatus === 'NEW' && onCancelOrder && (
              <button
                onClick={() => onCancelOrder(order)}
                className="px-3.5 py-2 text-brand-coral-700 hover:bg-brand-coral-50 font-bold text-xs rounded-xl border border-brand-coral-200 transition-colors cursor-pointer"
              >
                Reject Order
              </button>
            )}

            {(currentStatus === 'VERIFIED' || currentStatus === 'ADMIN VERIFIED') && onScheduleCollection && (
              <button
                onClick={() => onScheduleCollection(order)}
                className="px-3 py-2 bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Choose Collector Modal
              </button>
            )}

            {(currentStatus === 'SAMPLE RECEIVED' || currentStatus === 'RECEIVED') && (
              <button
                onClick={() => setRecollectionModalOpen(true)}
                className="px-3 py-2 bg-amber-50 text-amber-800 border border-amber-300 font-bold text-xs rounded-xl hover:bg-amber-100 cursor-pointer"
              >
                Report Issue / Recollect
              </button>
            )}

            {currentStageIdx >= 4 && onPreviewReport && (
              <button
                onClick={() => onPreviewReport(order)}
                className="px-3.5 py-2 bg-brand-teal-50 text-brand-teal-800 hover:bg-brand-teal-100 font-bold text-xs rounded-xl border border-brand-teal-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="View complete official ready report before sending to patient"
              >
                <FileText className="w-3.5 h-3.5 text-brand-teal-600" />
                View Ready Report
              </button>
            )}

            {/* Primary Workflow Advance Button */}
            <button
              onClick={nextAction.onExecute}
              className={`inline-flex items-center gap-1.5 px-4 py-2 ${nextAction.actionColor} font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer`}
            >
              <NextActionIcon className="w-4 h-4" />
              <span>{nextAction.buttonText}</span>
              {!nextAction.isCompleted && <ArrowRight className="w-3.5 h-3.5 ml-0.5" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Issue & Recollection Modal */}
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
                  <label className="font-bold text-brand-slate-700 block mb-1">Pre-Analytical Issue Reason:</label>
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
                  <label className="font-bold text-brand-slate-700 block mb-1">QC Officer Remarks & Instructions:</label>
                  <textarea
                    rows={3}
                    value={issueNotes}
                    onChange={(e) => setIssueNotes(e.target.value)}
                    placeholder="Enter details on why the sample cannot be accepted. A priority recollection will be initiated."
                    className="w-full p-2.5 rounded-xl border border-brand-slate-200 font-medium"
                  />
                </div>

                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                  <strong>System Action:</strong> The previous attempt will be preserved in the sample audit history. The order status transitions to <strong>RECOLLECTION REQUIRED</strong>.
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
                  Trigger Recollection Flow
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
