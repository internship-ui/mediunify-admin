import React from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Activity,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Share2,
  Clock,
  Edit2,
  Power,
  ShieldCheck,
  Star,
  Users
} from 'lucide-react';
import Modal from '../../../components/common/Modal';

export default function HospitalDetailsModal({
  isOpen,
  onClose,
  hospital,
  onEdit,
  onToggleStatus,
  referredPatients = []
}) {
  if (!hospital) return null;

  const isActive = hospital.status === 'Active';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={hospital.name}
      subtitle={`Hospital ID: ${hospital.id} • Registered On: ${hospital.onboardedDate || '2025-04-10'}`}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={() => {
              onClose();
              onToggleStatus(hospital);
            }}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-colors ${
              isActive
                ? 'text-red-700 bg-red-50 hover:bg-red-100 border-red-200'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isActive ? 'Deactivate Hospital' : 'Activate Hospital'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(hospital);
              }}
              className="px-4 py-2 text-xs font-bold text-brand-slate-700 hover:text-brand-navy-950 bg-brand-slate-100 hover:bg-brand-slate-200 border border-brand-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-brand-teal-600" />
              <span>Edit Details</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs sm:text-sm">
        {/* Banner with Hospital Header & Status */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-slate-50 to-brand-teal-50/40 border border-brand-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-black text-brand-navy-950">{hospital.name}</span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-200 text-slate-700 border border-slate-300'
                }`}
              >
                {isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-slate-500" />}
                {hospital.status}
              </span>
            </div>
            <div className="text-xs text-brand-slate-600 mt-1 font-semibold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-brand-teal-600" />
              <span>{hospital.type}</span>
              <span>•</span>
              <span className="text-brand-slate-500">{hospital.city}, {hospital.state}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hospital.rating && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-500 font-extrabold text-sm justify-end">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{hospital.rating}</span>
                </div>
                <span className="text-[10px] text-brand-slate-500">Quality Rating</span>
              </div>
            )}
            {hospital.totalSurgeriesCompleted && (
              <div className="text-right pl-3 border-l border-brand-slate-200">
                <div className="font-black text-brand-navy-950 text-sm">
                  {hospital.totalSurgeriesCompleted}+
                </div>
                <span className="text-[10px] text-brand-slate-500">Surgeries Done</span>
              </div>
            )}
          </div>
        </div>

        {/* If Inactive, show warning alert */}
        {!isActive && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <XCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold">Hospital is Inactive</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {hospital.statusReason ||
                  'This hospital will remain visible in the directory, but is currently excluded from new patient surgery referral suggestions.'}
              </p>
            </div>
          </div>
        )}

        {/* Location & Physical Address */}
        <div className="bg-white p-3.5 rounded-xl border border-brand-slate-200">
          <span className="text-brand-slate-400 text-[10px] uppercase font-bold tracking-wider block">
            Physical Address & Location
          </span>
          <div className="flex items-start gap-2 font-semibold text-brand-navy-900 mt-1">
            <MapPin className="w-4 h-4 text-brand-coral-600 flex-shrink-0 mt-0.5" />
            <div>
              <p>{hospital.address}</p>
              <p className="text-xs text-brand-slate-500 mt-0.5">
                {hospital.city}, {hospital.state} — PIN {hospital.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Details & Notification Config */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Contact Person */}
          <div className="bg-brand-slate-50 p-3.5 rounded-xl border border-brand-slate-200/80 space-y-2">
            <span className="text-brand-slate-500 text-[11px] font-bold uppercase tracking-wider block">
              Contact Person
            </span>
            <div className="font-extrabold text-brand-navy-950 text-sm">
              {hospital.contactPerson}
            </div>
            <div className="space-y-1 text-xs">
              <a
                href={`tel:${hospital.contactMobile}`}
                className="flex items-center gap-1.5 text-brand-teal-700 hover:underline font-semibold"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{hospital.contactMobile}</span>
              </a>
              <a
                href={`mailto:${hospital.contactEmail}`}
                className="flex items-center gap-1.5 text-brand-slate-600 hover:text-brand-navy-900 hover:underline"
              >
                <Mail className="w-3.5 h-3.5 text-brand-slate-400" />
                <span className="truncate">{hospital.contactEmail}</span>
              </a>
            </div>
          </div>

          {/* Request Forwarding Config */}
          <div className="bg-brand-slate-50 p-3.5 rounded-xl border border-brand-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-brand-slate-500 text-[11px] font-bold uppercase tracking-wider">
                Lead Forwarding Config
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200">
                {hospital.preferredNotification}
              </span>
            </div>

            {(hospital.preferredNotification === 'WhatsApp' || hospital.preferredNotification === 'Both') && (
              <div className="flex items-center gap-1.5 text-xs">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="font-mono font-bold text-emerald-800">
                  {hospital.whatsappNumber || hospital.contactMobile}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">(WhatsApp)</span>
              </div>
            )}

            {(hospital.preferredNotification === 'Email' || hospital.preferredNotification === 'Both') && (
              <div className="flex items-center gap-1.5 text-xs">
                <Mail className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span className="font-bold text-blue-800 truncate">
                  {hospital.notificationEmail || hospital.contactEmail}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Surgery Specializations */}
        <div className="bg-white p-4 rounded-xl border border-brand-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-brand-navy-900 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-brand-teal-600" />
              <span>Registered Surgery Specializations</span>
            </span>
            <span className="text-xs font-bold text-brand-slate-500">
              {hospital.specializations?.length || 0} Specialties
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {hospital.specializations?.map((spec) => (
              <span
                key={spec}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200 flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal-500" />
                <span>{spec}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Recent Forwarded Cases to this hospital */}
        <div className="bg-brand-slate-50 p-4 rounded-xl border border-brand-slate-200 space-y-2.5">
          <span className="text-brand-navy-900 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-teal-600" />
            <span>Patient Cases Referred to {hospital.name} ({referredPatients.length})</span>
          </span>

          {referredPatients.length === 0 ? (
            <p className="text-xs text-brand-slate-500 italic">
              No surgery patient cases currently referred to this hospital.
            </p>
          ) : (
            <div className="space-y-2">
              {referredPatients.map((pat) => (
                <div
                  key={pat.patientId}
                  className="p-2.5 rounded-xl bg-white border border-brand-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-brand-navy-950">{pat.patientName}</div>
                    <div className="text-[11px] text-brand-slate-500">
                      {pat.neededSurgery} • {pat.cityName}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200">
                      {pat.hospitalResponse || 'Forwarded'}
                    </span>
                    <div className="text-[10px] text-brand-slate-400 mt-0.5">
                      {pat.forwardedHospital?.sentAt || pat.requestedDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
