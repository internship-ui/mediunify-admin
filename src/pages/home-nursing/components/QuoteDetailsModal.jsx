import React, { useState } from 'react';
import {
  X,
  FileText,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  Calculator,
  UserCheck,
  Download,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/forms/FormInput';
import SelectInput from '../../../components/forms/SelectInput';

export default function QuoteDetailsModal({
  isOpen,
  onClose,
  quoteRequest,
  onSendQuote,
  onSimulatePatientDecision,
  onOpenAssignStaff
}) {
  if (!isOpen || !quoteRequest) return null;

  const [quoteForm, setQuoteForm] = useState(() => ({
    workDescription: quoteRequest.quoteDetails?.workDescription || '',
    estimatedDuration: quoteRequest.quoteDetails?.estimatedDuration || quoteRequest.duration || '14 Days',
    staffType: quoteRequest.quoteDetails?.staffType || 'Registered Nurse (ICU Specialist)',
    visitCharge: quoteRequest.quoteDetails?.visitCharge || 15000,
    additionalCharges: quoteRequest.quoteDetails?.additionalCharges || 2500,
    quoteValidUntil: quoteRequest.quoteDetails?.quoteValidUntil || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    adminNotes: quoteRequest.quoteDetails?.adminNotes || ''
  }));

  const [isConfirmSendOpen, setIsConfirmSendOpen] = useState(false);

  const totalCalculated = Number(quoteForm.visitCharge || 0) + Number(quoteForm.additionalCharges || 0);

  const handleTriggerSendQuote = (e) => {
    e.preventDefault();
    setIsConfirmSendOpen(true);
  };

  const handleFinalConfirmSend = () => {
    setIsConfirmSendOpen(false);
    onSendQuote(quoteRequest.id, {
      ...quoteForm,
      totalQuote: totalCalculated
    });
  };

  const getQuoteStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Quote Preparation':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Quote Sent':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Quote Accepted':
      case 'Staff Assignment Pending':
        return 'bg-brand-teal-50 text-brand-teal-800 border-brand-teal-300 font-bold';
      case 'Quote Declined':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Scheduled':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Completed':
        return 'bg-brand-green-50 text-brand-green-800 border-brand-green-200';
      default:
        return 'bg-brand-slate-100 text-brand-slate-700 border-brand-slate-200';
    }
  };

  // Timeline steps for custom quote (Section 15)
  const customQuoteSteps = [
    'Request Submitted',
    'Under Review',
    'Quote Prepared',
    'Quote Sent',
    'Quote Accepted',
    'Staff Assigned',
    'Scheduled',
    'Completed'
  ];

  const getCustomStepIdx = (status) => {
    switch (status) {
      case 'New':
        return 0;
      case 'Under Review':
        return 1;
      case 'Quote Preparation':
        return 2;
      case 'Quote Sent':
        return 3;
      case 'Quote Accepted':
      case 'Staff Assignment Pending':
        return 4;
      case 'Scheduled':
        return 6;
      case 'Completed':
        return 7;
      default:
        return 1;
    }
  };

  const currentStep = getCustomStepIdx(quoteRequest.quoteStatus);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Custom Quote — ${quoteRequest.id}`}
        subtitle={`${quoteRequest.patientName} • Other Nursing Service (Custom Quote)`}
        maxWidth="max-w-4xl"
        footer={
          <div className="flex items-center justify-between w-full flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Simulation buttons for demoing patient decision */}
              {quoteRequest.quoteStatus === 'Quote Sent' && (
                <>
                  <button
                    onClick={() => onSimulatePatientDecision(quoteRequest.id, 'Quote Accepted')}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-xs flex items-center gap-1.5"
                    title="Simulate patient accepting the quote"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Simulate: Patient Accepts</span>
                  </button>

                  <button
                    onClick={() => onSimulatePatientDecision(quoteRequest.id, 'Quote Declined')}
                    className="px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-1.5"
                    title="Simulate patient declining the quote"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Simulate: Patient Declines</span>
                  </button>
                </>
              )}

              {(quoteRequest.quoteStatus === 'Quote Accepted' || quoteRequest.quoteStatus === 'Staff Assignment Pending') && (
                <button
                  onClick={() => onOpenAssignStaff(quoteRequest)}
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Assign Staff</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl"
              >
                Close
              </button>

              {(quoteRequest.quoteStatus === 'New' ||
                quoteRequest.quoteStatus === 'Under Review' ||
                quoteRequest.quoteStatus === 'Quote Preparation' ||
                quoteRequest.quoteStatus === 'Quote Sent') && (
                <button
                  type="button"
                  onClick={handleTriggerSendQuote}
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-md shadow-brand-teal-600/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{quoteRequest.quoteStatus === 'Quote Sent' ? 'Update & Resend Quote' : 'Send Quote to Patient'}</span>
                </button>
              )}
            </div>
          </div>
        }
      >
        <div className="space-y-5 text-xs sm:text-sm text-brand-navy-900 max-h-[75vh] overflow-y-auto pr-1">
          {/* Header Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-slate-50 to-brand-teal-50/60 border border-brand-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-brand-teal-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-teal-600" />
                Custom Requirement Quote Flow
              </div>
              <h3 className="text-base font-black text-brand-navy-950 mt-0.5">
                {quoteRequest.requirementTitle}
              </h3>
              <p className="text-xs text-brand-slate-600 mt-0.5">
                Location: <span className="font-bold text-brand-navy-900">{quoteRequest.location}</span> • Duration: <span className="font-semibold text-brand-teal-700">{quoteRequest.duration}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getQuoteStatusBadge(quoteRequest.quoteStatus)}`}>
                Quote Status: {quoteRequest.quoteStatus}
              </span>
            </div>
          </div>

          {/* Section 15: Custom Quote Progress Timeline */}
          {quoteRequest.quoteStatus !== 'Quote Declined' && quoteRequest.quoteStatus !== 'Cancelled' ? (
            <div className="p-4 rounded-2xl bg-white border border-brand-slate-200/90 shadow-xs">
              <span className="text-[11px] font-bold text-brand-slate-500 uppercase block mb-3">
                Custom Quote Lifecycle Tracker
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center">
                {customQuoteSteps.map((stepName, idx) => {
                  const isPassed = currentStep >= idx;
                  const isCurrent = currentStep === idx;
                  return (
                    <div
                      key={stepName}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-brand-teal-50 border-brand-teal-400 text-brand-teal-900 font-extrabold ring-2 ring-brand-teal-400/20'
                          : isPassed
                          ? 'bg-brand-slate-50 border-brand-slate-200 text-brand-slate-700 font-bold'
                          : 'bg-white border-brand-slate-100 text-brand-slate-400 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] mb-1 font-bold ${
                          isCurrent
                            ? 'bg-brand-teal-600 text-white'
                            : isPassed
                            ? 'bg-brand-green-600 text-white'
                            : 'bg-brand-slate-200 text-brand-slate-500'
                        }`}
                      >
                        {isPassed ? <Check className="w-3 h-3" /> : idx + 1}
                      </div>
                      <span className="text-[10px] leading-tight line-clamp-2">{stepName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-xs block">Quote Declined / Closed</span>
                <p className="text-xs text-rose-700 mt-0.5">{quoteRequest.cancellationReason || 'Patient declined custom quote estimation.'}</p>
              </div>
            </div>
          )}

          {/* Section 9: Patient Information */}
          <div className="p-4 rounded-2xl bg-brand-slate-50/80 border border-brand-slate-200/90 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-slate-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-slate-600" />
              Patient Profile & Contact
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-brand-slate-200">
                <span className="text-[10px] font-bold text-brand-slate-500 uppercase block">Patient Name</span>
                <p className="font-black text-brand-navy-950 mt-0.5">{quoteRequest.patientName}</p>
                <span className="text-[10px] font-mono text-brand-slate-500">{quoteRequest.patientId}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-brand-slate-200">
                <span className="text-[10px] font-bold text-brand-slate-500 uppercase block">Phone Contact</span>
                <a href={`tel:${quoteRequest.phone}`} className="font-bold text-brand-green-700 hover:underline flex items-center gap-1 mt-1 text-xs">
                  <Phone className="w-3.5 h-3.5" />
                  {quoteRequest.phone}
                </a>
              </div>
              <div className="bg-white p-3 rounded-xl border border-brand-slate-200">
                <span className="text-[10px] font-bold text-brand-slate-500 uppercase block">Emergency Contact</span>
                <p className="font-bold text-brand-navy-900 text-xs mt-1">{quoteRequest.emergencyContact || 'Not specified'}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-brand-slate-200 sm:col-span-3">
                <span className="text-[10px] font-bold text-brand-slate-500 uppercase block">Service Address</span>
                <p className="font-semibold text-brand-navy-900 text-xs mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-coral-600" />
                  {quoteRequest.address} ({quoteRequest.location})
                </p>
              </div>
            </div>
          </div>

          {/* Section 9: Custom Requirement Details */}
          <div className="p-4 rounded-2xl bg-brand-slate-50/80 border border-brand-slate-200/90 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-slate-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-brand-teal-600" />
              Patient Custom Care Requirement
            </span>
            <div className="bg-white p-3.5 rounded-xl border border-brand-slate-200 space-y-2">
              <div>
                <span className="text-[10px] font-bold text-brand-slate-500 uppercase block">Detailed Clinical Description</span>
                <p className="text-xs text-brand-navy-900 leading-relaxed mt-1 font-medium">
                  {quoteRequest.detailedDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-brand-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-brand-slate-500 uppercase block">Requested Start</span>
                  <span className="font-bold text-brand-navy-900 text-xs">{quoteRequest.preferredDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-slate-500 uppercase block">Shift / Timing</span>
                  <span className="font-bold text-brand-navy-900 text-xs">{quoteRequest.preferredTime}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-slate-500 uppercase block">Required Duration</span>
                  <span className="font-bold text-brand-teal-700 text-xs">{quoteRequest.duration}</span>
                </div>
              </div>

              {quoteRequest.additionalNotes && (
                <div className="pt-2 border-t border-brand-slate-100">
                  <span className="text-[10px] font-bold text-brand-slate-500 uppercase block">Additional Family Notes</span>
                  <p className="text-xs text-brand-slate-700 mt-0.5">{quoteRequest.additionalNotes}</p>
                </div>
              )}

              {quoteRequest.documents && quoteRequest.documents.length > 0 && (
                <div className="pt-2 border-t border-brand-slate-100">
                  <span className="text-[10px] font-bold text-brand-slate-500 uppercase block mb-1">Supporting Medical Records</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {quoteRequest.documents.map((doc, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-brand-slate-50 border border-brand-slate-200 text-xs font-bold text-brand-slate-700 flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3 text-brand-teal-600" />
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 9: Quote Section Form */}
          <div className="p-4 rounded-2xl bg-white border border-brand-teal-200/90 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-teal-800 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-brand-teal-600" />
                Administrative Custom Quote Formulation
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200">
                Official Estimate
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                  Service / Work Description (Visible to Patient)
                </label>
                <textarea
                  rows="2"
                  value={quoteForm.workDescription}
                  onChange={(e) => setQuoteForm({ ...quoteForm, workDescription: e.target.value })}
                  placeholder="Specify clinical deliverables, nursing qualifications, shift schedules and protocol guarantees..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 text-brand-navy-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput
                  label="Estimated Duration"
                  id="estimatedDuration"
                  value={quoteForm.estimatedDuration}
                  onChange={(e) => setQuoteForm({ ...quoteForm, estimatedDuration: e.target.value })}
                  placeholder="e.g. 21 Days (24x7 Rotation)"
                  required
                />
                <SelectInput
                  label="Staff Type Required"
                  id="staffType"
                  value={quoteForm.staffType}
                  onChange={(e) => setQuoteForm({ ...quoteForm, staffType: e.target.value })}
                  options={[
                    'Dual Registered Nurse (ICU Specialist)',
                    'Senior Palliative Registered Nurse',
                    'Wound Care Certified Specialist Nurse',
                    'Pediatric Registered Nurse',
                    'Registered Nurse (RN)',
                    'Homecare Nurse (GNM)',
                    'Senior Caregiver',
                    'Multidisciplinary Care Team'
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormInput
                  label="Visit / Service Charge (₹)"
                  id="visitCharge"
                  type="number"
                  value={quoteForm.visitCharge}
                  onChange={(e) => setQuoteForm({ ...quoteForm, visitCharge: Number(e.target.value) })}
                  placeholder="Base service fee"
                  required
                />
                <FormInput
                  label="Additional / Consumables (₹)"
                  id="additionalCharges"
                  type="number"
                  value={quoteForm.additionalCharges}
                  onChange={(e) => setQuoteForm({ ...quoteForm, additionalCharges: Number(e.target.value) })}
                  placeholder="Equipment & supplies"
                />
                <FormInput
                  label="Quote Valid Until"
                  id="quoteValidUntil"
                  type="date"
                  value={quoteForm.quoteValidUntil}
                  onChange={(e) => setQuoteForm({ ...quoteForm, quoteValidUntil: e.target.value })}
                  required
                />
              </div>

              {/* Total Calculation Highlight Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-brand-teal-500 to-brand-aqua-600 text-white flex items-center justify-between shadow-md">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold opacity-90 block">
                    Total Estimated Quote Amount
                  </span>
                  <p className="text-[11px] opacity-80">Includes base nurse shift fee + clinical consumables</p>
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight font-mono">
                  ₹{totalCalculated.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                  Admin Internal Notes / Staff Allocation Strategy
                </label>
                <input
                  type="text"
                  value={quoteForm.adminNotes}
                  onChange={(e) => setQuoteForm({ ...quoteForm, adminNotes: e.target.value })}
                  placeholder="Internal logistics notes, assigned nurse preference, or doctor coordination..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 text-brand-navy-900"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal before Sending Quote */}
      <Modal
        isOpen={isConfirmSendOpen}
        onClose={() => setIsConfirmSendOpen(false)}
        title="Confirm Custom Quote Dispatch"
        subtitle={`Sending quotation to ${quoteRequest.patientName}`}
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              onClick={() => setIsConfirmSendOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleFinalConfirmSend}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-md shadow-brand-teal-600/20 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Confirm & Dispatch Quote</span>
            </button>
          </div>
        }
      >
        <div className="space-y-3 text-xs sm:text-sm text-brand-navy-900">
          <div className="p-3.5 rounded-xl bg-brand-teal-50 border border-brand-teal-200 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-brand-slate-600">Patient:</span>
              <span className="font-black text-brand-navy-950">{quoteRequest.patientName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-brand-slate-600">Total Quotation:</span>
              <span className="font-black text-brand-teal-700 text-sm">₹{totalCalculated.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-brand-slate-600">Valid Until:</span>
              <span className="font-bold text-brand-navy-900">{quoteForm.quoteValidUntil}</span>
            </div>
          </div>

          <p className="text-xs text-brand-slate-600 leading-relaxed">
            The patient will receive a notification with this quote summary. The request status will transition to <strong className="text-brand-navy-950">Quote Sent</strong> until the patient approves.
          </p>
        </div>
      </Modal>
    </>
  );
}
