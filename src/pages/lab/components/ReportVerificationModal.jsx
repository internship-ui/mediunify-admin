import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  FileCheck,
  ShieldCheck,
  User,
  TestTube2,
  Pipette,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function ReportVerificationModal({
  isOpen,
  onClose,
  report,
  order,
  onConfirmVerification,
  onRejectReport
}) {
  const { addToast } = useToast();

  const [verifiedBy, setVerifiedBy] = useState('Dr. Ramesh S. Rao, MD (Path)');
  const [verificationNotes, setVerificationNotes] = useState(
    'Clinical correlation verified. Biological reference intervals valid for age and gender. Approved for digital sign-off and immediate patient release.'
  );
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  if (!isOpen || !report) return null;

  const handleApprove = () => {
    onConfirmVerification(report.reportId, {
      verifiedBy,
      verificationNotes,
      verificationDate: new Date().toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    });

    addToast(`Report ${report.reportId} verified and signed by ${verifiedBy}`, 'success');
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      addToast('Please enter a clinical rejection reason', 'warning');
      return;
    }

    onRejectReport(report.reportId, {
      rejectionReason,
      rejectedBy: verifiedBy
    });

    addToast(`Report ${report.reportId} rejected for re-testing: ${rejectionReason}`, 'error');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-brand-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy-900">
                Pathologist Clinical Verification & Sign-Off
              </h3>
              <p className="text-xs text-brand-slate-500 font-mono">
                Report ID: {report.reportId} | Sample ID: {report.sampleId}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Tri-Grid Information Section (Patient, Test, Sample) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Patient Info */}
            <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-slate-400 block mb-1">
                Patient Info
              </span>
              <p className="font-bold text-brand-navy-900 text-sm">{report.patientName}</p>
              <p className="text-brand-slate-600 mt-0.5">
                {report.patientAge} Years / {report.gender}
              </p>
              <p className="text-brand-slate-500 text-[11px]">Order: {report.orderId}</p>
            </div>

            {/* Test Info */}
            <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-slate-400 block mb-1">
                Investigation Info
              </span>
              <p className="font-bold text-brand-teal-800 text-sm">{report.testOrPackageName}</p>
              <p className="text-brand-slate-600 mt-0.5">Automated Clinical Assay</p>
              <p className="text-brand-slate-500 text-[11px]">Department of Pathology</p>
            </div>

            {/* Sample Info */}
            <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-slate-400 block mb-1">
                Sample Barcode & Accession
              </span>
              <p className="font-bold text-brand-navy-900 font-mono text-sm">{report.sampleId}</p>
              <p className="text-brand-slate-600 mt-0.5">Serum / EDTA Vacutainer</p>
              <p className="text-emerald-700 font-semibold text-[11px]">Quality Check: Passed</p>
            </div>
          </div>

          {/* Test Parameters Preview Table */}
          <div>
            <h4 className="font-bold text-brand-slate-800 mb-2 flex items-center justify-between">
              <span>Analyte Results & Reference Evaluation</span>
              <span className="text-brand-slate-400 font-normal">
                {report.parameters?.length || 0} Parameters Recorded
              </span>
            </h4>
            <div className="border border-brand-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-slate-100/80 text-brand-slate-700 font-bold border-b border-brand-slate-200">
                  <tr>
                    <th className="p-2.5">Parameter</th>
                    <th className="p-2.5 text-center">Observed Result</th>
                    <th className="p-2.5">Units</th>
                    <th className="p-2.5">Reference Interval</th>
                    <th className="p-2.5 text-center">Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100">
                  {report.parameters && report.parameters.length > 0 ? (
                    report.parameters.map((param, idx) => (
                      <tr key={idx} className="hover:bg-brand-slate-50">
                        <td className="p-2.5 font-semibold text-brand-navy-900">{param.name}</td>
                        <td className="p-2.5 text-center font-bold text-brand-navy-900">{param.value}</td>
                        <td className="p-2.5 text-brand-slate-500 font-mono text-[11px]">{param.unit}</td>
                        <td className="p-2.5 text-brand-slate-600">{param.normalRange}</td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              param.flag === 'High'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : param.flag === 'Low'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {param.flag}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-brand-slate-400">
                        No parameters recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification Section */}
          <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-3">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Pathologist Sign-Off Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-brand-slate-700 mb-1">Verified By *</label>
                <input
                  type="text"
                  value={verifiedBy}
                  onChange={(e) => setVerifiedBy(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-brand-slate-200 font-semibold text-brand-navy-900"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-slate-700 mb-1">Verification Timestamp</label>
                <input
                  type="text"
                  readOnly
                  value={new Date().toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  className="w-full p-2 bg-brand-slate-100 rounded-lg border border-brand-slate-200 text-brand-slate-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">
                Clinical Interpretation & Pathologist Notes
              </label>
              <textarea
                rows={2}
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-brand-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Rejection Mode Toggle Box */}
          {isRejecting && (
            <div className="p-4 bg-brand-coral-50/50 rounded-xl border border-brand-coral-200 space-y-2 animate-in fade-in-50">
              <label className="block font-bold text-brand-coral-800">
                Clinical Rejection Reason & Re-Test Order *
              </label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2 rounded-lg border border-brand-coral-300 text-xs font-medium"
              >
                <option value="">Select reason for report rejection...</option>
                <option value="Values inconsistent with clinical presentation (Delta check alert)">
                  Values inconsistent with clinical presentation (Delta check alert)
                </option>
                <option value="QC failure on analyzer batch during analyte run">
                  QC failure on analyzer batch during analyte run
                </option>
                <option value="Specimen interference / Lipemia or hemolysis detected post-run">
                  Specimen interference / Lipemia or hemolysis detected post-run
                </option>
                <option value="Parameter calculation mismatch / Re-run required on dilution">
                  Parameter calculation mismatch / Re-run required on dilution
                </option>
                <option value="Other clinical discrepancy">Other clinical discrepancy</option>
              </select>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsRejecting(!isRejecting)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-colors ${
              isRejecting
                ? 'bg-brand-coral-50 text-brand-coral-700 border-brand-coral-200'
                : 'bg-white text-brand-slate-600 hover:text-brand-coral-700 border-brand-slate-200'
            }`}
          >
            {isRejecting ? 'Cancel Rejection' : 'Reject Report / Request Re-Run'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-brand-slate-100 text-brand-slate-700 text-xs font-semibold rounded-xl border border-brand-slate-200 transition-colors"
            >
              Close
            </button>
            {isRejecting ? (
              <button
                onClick={handleReject}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-coral-600 hover:bg-brand-coral-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Confirm Report Rejection
              </button>
            ) : (
              <button
                onClick={handleApprove}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Verify, Sign & Authorize Release
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
