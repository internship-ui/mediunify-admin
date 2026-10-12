import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  XCircle,
  Pipette,
  RefreshCw,
  FileWarning
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function SampleRejectModal({
  isOpen,
  onClose,
  sample,
  onConfirmReject
}) {
  const { addToast } = useToast();

  const [reason, setReason] = useState('Hemolysed sample');
  const [customNote, setCustomNote] = useState('');
  const [scheduleRecollect, setScheduleRecollect] = useState(true);

  if (!isOpen || !sample) return null;

  const handleReject = (e) => {
    e.preventDefault();
    if (!reason) {
      addToast('Please select a rejection reason', 'warning');
      return;
    }

    const fullReason = customNote ? `${reason}: ${customNote}` : reason;

    onConfirmReject(sample.sampleId, {
      reason: fullReason,
      scheduleRecollect
    });

    addToast(
      `Sample ${sample.sampleId} marked as REJECTED. ${scheduleRecollect ? 'Re-collection scheduled.' : ''}`,
      'error'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-brand-coral-200 overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-coral-100 bg-brand-coral-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-coral-100 text-brand-coral-700 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy-900">
                Reject Biological Sample
              </h3>
              <p className="text-xs text-brand-slate-500 font-mono">
                Sample ID: {sample.sampleId} | Barcode: {sample.barcode || 'BC-N/A'}
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

        {/* Form Body */}
        <form onSubmit={handleReject} className="p-6 space-y-4 text-xs">
          {/* Sample Summary */}
          <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-brand-slate-500">Patient:</span>
              <strong className="text-brand-navy-900">{sample.patientName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-slate-500">Test / Investigation:</span>
              <strong className="text-brand-teal-800">{sample.testName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-slate-500">Sample & Container:</span>
              <span className="text-brand-slate-700 font-medium">{sample.sampleType} ({sample.tubeContainer})</span>
            </div>
          </div>

          {/* Rejection Reason Selector */}
          <div>
            <label className="block font-bold text-brand-slate-700 mb-1.5">
              Standard Clinical Rejection Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral-500 font-medium"
              required
            >
              <option value="Insufficient sample volume (QNS - Quantity Not Sufficient)">
                Insufficient sample (Quantity Not Sufficient)
              </option>
              <option value="Wrong container / Incorrect anticoagulant tube">
                Wrong container / Incorrect anticoagulant tube
              </option>
              <option value="Hemolysed sample / Ruptured RBCs">
                Hemolysed sample
              </option>
              <option value="Leakage / Container crack during transit">
                Leakage / Container cracked
              </option>
              <option value="Improper collection / Clotted EDTA sample">
                Improper collection / Clotted EDTA sample
              </option>
              <option value="Lipemic / Icteric sample interfering with assay">
                Lipemic / Icteric sample
              </option>
              <option value="Temperature excursion / Cold chain breach">
                Temperature excursion / Cold chain breach
              </option>
              <option value="Other pre-analytical discrepancy">
                Other pre-analytical discrepancy
              </option>
            </select>
          </div>

          {/* Detailed Lab Note */}
          <div>
            <label className="block font-bold text-brand-slate-700 mb-1.5">
              Technologist Rejection Observations
            </label>
            <textarea
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral-500"
              placeholder="Provide exact details for phlebotomy supervisor and patient..."
            />
          </div>

          {/* Re-collection Checkbox */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3">
            <input
              type="checkbox"
              id="recollect"
              checked={scheduleRecollect}
              onChange={(e) => setScheduleRecollect(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-brand-teal-600 focus:ring-brand-teal-500"
            />
            <label htmlFor="recollect" className="cursor-pointer">
              <span className="font-bold text-amber-900 block">
                Automatically Trigger Urgent Re-Collection Order
              </span>
              <span className="text-[11px] text-amber-700">
                Notifies patient and dispatches an emergency phlebotomist for fresh sample draw at zero additional charge.
              </span>
            </label>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-brand-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-brand-slate-100 text-brand-slate-700 text-xs font-semibold rounded-xl border border-brand-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-coral-600 hover:bg-brand-coral-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Confirm Sample Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
