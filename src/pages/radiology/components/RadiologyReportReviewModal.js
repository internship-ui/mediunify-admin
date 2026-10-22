
import React, { useState } from 'react';
import {
  X,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function RadiologyReportReviewModal({
  isOpen,
  onClose,
  report,
  order,
  onConfirmVerification,
  onRejectReport
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);
  const [verifiedBy, setVerifiedBy] = useState(report?.verifiedBy || 'Dr. Vikramaditya Hegde, MD, FRCR');
  const [verificationNotes, setVerificationNotes] = useState(
    'DICOM image series and cross-sectional findings clinically verified. Signed with digital cryptographic seal.'
  );
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState(
    'Clarification required on lumbar disc height measurement in sagittal T2 sequence.'
  );

  if (!isOpen || !report) return null;

  const handleApprove = () => {
    onConfirmVerification(report.reportId, {
      verifiedBy,
      verificationNotes
    });
    addToast(`Report ${report.reportId} verified & approved for patient delivery.`, 'success');
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      addToast('Please specify a rejection and revision reason.', 'warning');
      return;
    }
    onRejectReport(report.reportId, {
      rejectionReason
    });
    addToast(`Report ${report.reportId} returned to radiologist for correction.`, 'info');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in-50 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-100 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-200">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">Radiology Clinical Report Review & Authorization</h3>
              <p className="text-xs text-brand-slate-500">Report ID: <strong className="font-mono text-purple-700">{report.reportId}</strong></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 rounded-lg hover:bg-brand-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Patient / Scan Summary */}
          <div className="p-3.5 bg-brand-slate-50 rounded-xl border border-brand-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div>
              <span className="text-brand-slate-400 block">Patient Name:</span>
              <strong className="text-brand-navy-900">{report.patientName} ({report.patientAge}Y, {report.gender})</strong>
            </div>
            <div>
              <span className="text-brand-slate-400 block">Scan:</span>
              <strong className="text-brand-navy-900 truncate block">{report.scanName}</strong>
            </div>
            <div>
              <span className="text-brand-slate-400 block">Report Status:</span>
              <span className="text-purple-700 font-bold uppercase">{report.reportStatus}</span>
            </div>
            <div>
              <span className="text-brand-slate-400 block">Assigned Radiologist:</span>
              <strong className="text-brand-teal-700 truncate block">{report.verifiedBy || 'Dr. Vikramaditya Hegde'}</strong>
            </div>
          </div>

          {/* Draft Clinical Findings Preview */}
          <div className="space-y-2 p-3.5 bg-brand-slate-50/70 rounded-xl border border-brand-slate-200">
            <h4 className="font-bold text-brand-navy-900 text-xs">Clinical Findings Summary:</h4>
            {report.findings && report.findings.map((f, idx) => (
              <div key={idx} className="bg-white p-2.5 rounded-lg border border-brand-slate-200 text-xs">
                <p className="font-bold text-brand-teal-800 text-[11px]">{f.section}</p>
                <p className="text-brand-slate-700 mt-0.5 leading-relaxed">{f.text}</p>
              </div>
            ))}

            <div className="bg-purple-50/60 p-3 rounded-lg border border-purple-200 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">Diagnostic Impression:</span>
              <p className="font-bold text-brand-navy-900 whitespace-pre-line mt-1">{report.impression}</p>
            </div>
          </div>

          {/* Verification Details vs Rejection toggle */}
          {!isRejectMode ? (
            <div className="space-y-3 p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Consultant Radiologist Digital Authorization
                </h4>
                <button
                  type="button"
                  onClick={() => setIsRejectMode(true)}
                  className="text-xs font-bold text-brand-coral-600 hover:underline flex items-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Request Revisions / Reject
                </button>
              </div>

              <div>
                <label className="font-bold text-brand-slate-700 block mb-1">Authorizing Consultant Radiologist:</label>
                <input
                  type="text"
                  value={verifiedBy}
                  onChange={(e) => setVerifiedBy(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-brand-slate-700 block mb-1">Clinical Seal & Approval Remarks:</label>
                <input
                  type="text"
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-3.5 bg-brand-coral-50/50 rounded-xl border border-brand-coral-200">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-brand-coral-900 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-brand-coral-600" />
                  Report Revision & Correction Request
                </h4>
                <button
                  type="button"
                  onClick={() => setIsRejectMode(false)}
                  className="text-xs font-bold text-brand-teal-700 hover:underline"
                >
                  Switch Back to Approval
                </button>
              </div>

              <div>
                <label className="font-bold text-brand-coral-900 block mb-1">Specify Findings Correction / Clinical Issue:</label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why the draft is rejected and what needs re-reporting..."
                  className="w-full p-2.5 rounded-xl border border-brand-coral-300 text-xs font-medium"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-brand-slate-100 bg-brand-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-brand-slate-600 font-semibold rounded-xl border border-brand-slate-200 hover:bg-brand-slate-100 text-xs"
          >
            Close
          </button>

          {!isRejectMode ? (
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Digitally Verify & Authorize Report
            </button>
          ) : (
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-brand-coral-600 hover:bg-brand-coral-700 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Return for Radiologist Correction
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
