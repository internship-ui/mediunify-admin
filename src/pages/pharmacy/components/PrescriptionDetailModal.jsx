import React from 'react';
import {
  FileCheck,
  X,
  User,
  Phone,
  Building2,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Package
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function PrescriptionDetailModal({
  isOpen,
  onClose,
  prescription
}) {
  if (!isOpen || !prescription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-brand-slate-100 flex items-center justify-between bg-gradient-to-r from-brand-navy-900 to-brand-teal-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-brand-teal-300 border border-white/15">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">{prescription.prescriptionId}</h3>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-white/10 rounded-md border border-white/20">
                  {prescription.verificationStatus}
                </span>
              </div>
              <p className="text-xs text-brand-teal-100/80">
                Prescribed on {prescription.prescriptionDate} • Related Order: {prescription.relatedOrderId || 'Direct Upload'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-brand-slate-700">
          {/* Operational Monitoring Mode Alert (Requirement 16) */}
          <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-teal-950 block">
                Prescription Verification Status Monitor
              </span>
              <p className="text-[11px] text-teal-900 mt-0.5 leading-relaxed">
                Prescription clinical review and dispensing approval are legally executed by certified pharmacists in the Pharmacy Hub Application. The admin interface is in read-only audit mode.
              </p>
            </div>
          </div>

          {/* Section 1: Patient & Doctor Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Info */}
            <div className="p-4 rounded-xl bg-white border border-brand-slate-200 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 flex items-center gap-1.5 pb-2 border-b border-brand-slate-100">
                <User className="w-4 h-4 text-brand-teal-600" />
                Patient Details
              </h4>
              <div className="space-y-1.5 pt-1">
                <div>
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Patient Name</span>
                  <p className="font-bold text-brand-navy-900">{prescription.patientName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Patient ID</span>
                  <p className="font-mono text-brand-slate-700">{prescription.patientId || 'PID-9012'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Phone Number</span>
                  <p className="font-semibold text-brand-slate-800 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-brand-teal-600" />
                    <span>{prescription.patientPhone || '+91 98450 67890'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Prescribing Doctor Info */}
            <div className="p-4 rounded-xl bg-white border border-brand-slate-200 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 flex items-center gap-1.5 pb-2 border-b border-brand-slate-100">
                <Building2 className="w-4 h-4 text-brand-teal-600" />
                Prescribing Practitioner
              </h4>
              <div className="space-y-1.5 pt-1">
                <div>
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Doctor Name</span>
                  <p className="font-bold text-brand-navy-900">{prescription.doctorName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Medical Council Reg No</span>
                  <p className="font-mono font-bold text-brand-teal-700">{prescription.doctorRegNo || 'MCI-88219'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Clinic / Hospital</span>
                  <p className="font-semibold text-brand-slate-800">{prescription.hospital || 'Care Health Hospital'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Prescribed Items Extracted */}
          <div className="p-4 rounded-xl bg-brand-slate-50 border border-brand-slate-200/90 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-brand-teal-600" />
              Prescribed Medications & Dosages
            </h4>
            <div className="space-y-1.5">
              {(prescription.extractedItems || [
                'Paracetamol 500mg (TID x 5 days)',
                'Amoxicillin 500mg (BD x 5 days)'
              ]).map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-white rounded-lg border border-brand-slate-200 text-xs font-semibold text-brand-navy-900 flex items-center gap-2 shadow-2xs"
                >
                  <span className="w-5 h-5 rounded-full bg-brand-teal-50 text-brand-teal-700 font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Pharmacist Notes */}
          <div className="p-3.5 rounded-xl bg-brand-slate-50 border border-brand-slate-200 text-xs space-y-1">
            <span className="font-bold text-brand-navy-900 block">Pharmacist Review & Verification Log:</span>
            <p className="text-brand-slate-700 leading-relaxed font-medium">
              {prescription.notes || 'Reviewed and validated by Central Hub Pharmacist queue.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-brand-slate-50 border-t border-brand-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-brand-slate-500 font-medium">
            Central Pharmacy Hub Verification Queue • Read-Only Oversight
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-brand-slate-700 bg-white border border-brand-slate-300 rounded-xl hover:bg-brand-slate-100 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
