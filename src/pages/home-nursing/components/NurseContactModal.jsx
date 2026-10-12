import React, { useState } from 'react';
import {
  X,
  Phone,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  MapPin,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function NurseContactModal({
  isOpen,
  onClose,
  nurse,
  patient,
  onSaveConfirmation
}) {
  if (!isOpen || !nurse) return null;

  const [availabilityConfirmed, setAvailabilityConfirmed] = useState('yes'); // 'yes' | 'no'
  const [adminNotes, setAdminNotes] = useState(
    `Spoke with ${nurse.name} on call. She confirmed availability for ${patient?.preferredDate || 'requested date'} at ${patient?.preferredTime || 'requested time'}.`
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSaveConfirmation) {
      onSaveConfirmation({
        nurseId: nurse.id,
        nurseName: nurse.name,
        specialization: nurse.specialization,
        phone: nurse.phone,
        distanceKm: nurse.distanceToPatientKm || 1.5,
        availabilityConfirmed: availabilityConfirmed === 'yes',
        notes: adminNotes.trim(),
        contactedAt: new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-brand-slate-900 to-brand-navy-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-green-500/20 border border-brand-green-400/30 flex items-center justify-center text-brand-green-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Record Nurse Contact</h3>
              <p className="text-xs text-brand-slate-300">Step 3: Call nurse and record manual availability confirmation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-gray-700">
          {/* Nurse Card Overview */}
          <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                {nurse.name.replace('Nurse ', '')[0]}
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-sm">{nurse.name}</h4>
                <div className="text-[11px] font-semibold text-emerald-800">{nurse.specialization}</div>
                <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                  Distance to Patient: <strong>{nurse.distanceToPatientKm || 1.5} km</strong>
                </div>
              </div>
            </div>

            {/* Direct Call Trigger */}
            <a
              href={`tel:${nurse.phone}`}
              className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call {nurse.phone}</span>
            </a>
          </div>

          {/* Patient Requirement Reminder */}
          {patient && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] space-y-1">
              <div className="font-bold text-gray-800">
                Patient: <span className="text-gray-900 font-extrabold">{patient.patientName}</span>
              </div>
              <div className="text-gray-600">
                Service: <strong>{patient.serviceRequired}</strong> • Schedule: <strong>{patient.preferredDate || '26 Sep'} at {patient.preferredTime || '10:00 AM'}</strong>
              </div>
            </div>
          )}

          {/* Availability Confirmed Question */}
          <div className="space-y-1.5 pt-1">
            <label className="block font-bold text-gray-900 text-xs">
              Did the nurse confirm availability for this visit? <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAvailabilityConfirmed('yes')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  availabilityConfirmed === 'yes'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 shadow-2xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${availabilityConfirmed === 'yes' ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span>Yes — Confirmed Available</span>
              </button>

              <button
                type="button"
                onClick={() => setAvailabilityConfirmed('no')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  availabilityConfirmed === 'no'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 shadow-2xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <XCircle className={`w-4 h-4 ${availabilityConfirmed === 'no' ? 'text-rose-600' : 'text-gray-400'}`} />
                <span>No — Unavailable / Busy</span>
              </button>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="space-y-1">
            <label className="block font-bold text-gray-900 text-xs">
              Admin Notes & Call Summary <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Spoke with nurse, confirmed she has requisite dressing kit and will arrive by 10 AM..."
              className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 text-gray-900"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-green-700 hover:bg-brand-green-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Mark Nurse Contacted</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
