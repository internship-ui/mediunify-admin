import React from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Award,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Star,
  FileCheck,
  Activity,
  Briefcase
} from 'lucide-react';

export default function NurseDetailsModal({
  nurse,
  onClose,
  onUpdateStatus,
  onToggleAccountStatus
}) {
  if (!nurse) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-teal-600 text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
              {nurse.name.split(' ')[1]?.[0] || 'N'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-brand-slate-900">{nurse.name}</h2>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    nurse.status === 'AVAILABLE'
                      ? 'bg-brand-teal-100 text-brand-teal-800'
                      : nurse.status === 'BUSY'
                      ? 'bg-brand-coral-100 text-brand-coral-800'
                      : nurse.status === 'SCHEDULED'
                      ? 'bg-brand-navy-100 text-brand-navy-800'
                      : 'bg-brand-slate-100 text-brand-slate-600'
                  }`}
                >
                  {nurse.status}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    nurse.accountStatus === 'Active'
                      ? 'bg-brand-green-100 text-brand-green-800'
                      : 'bg-brand-slate-200 text-brand-slate-700'
                  }`}
                >
                  Account: {nurse.accountStatus}
                </span>
              </div>
              <p className="text-xs text-brand-slate-500 mt-0.5">
                {nurse.qualification} • ID: <span className="font-mono text-brand-slate-700">{nurse.id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-brand-slate-700">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block">Rating</span>
              <div className="flex items-center gap-1 mt-1 text-amber-500 font-extrabold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{nurse.rating || 4.9} / 5.0</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block">Visits Completed</span>
              <span className="text-sm font-extrabold text-brand-slate-900 mt-1 block">
                {nurse.completedVisits || 120}+ Home Visits
              </span>
            </div>

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block">Experience</span>
              <span className="text-sm font-extrabold text-brand-slate-900 mt-1 block">
                {nurse.experience || '5 Years'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block">Locality</span>
              <span className="text-sm font-extrabold text-brand-teal-700 mt-1 block">
                {nurse.locality}
              </span>
            </div>
          </div>

          {/* Contact & Registration Information */}
          <div className="bg-white rounded-xl border border-brand-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-900 flex items-center gap-1.5 pb-2 border-b border-brand-slate-100">
              <User className="w-4 h-4 text-brand-teal-600" />
              Contact & Registration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-brand-slate-400 block text-[10px]">Phone Number</span>
                <a href={`tel:${nurse.phone}`} className="font-semibold text-brand-teal-700 hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {nurse.phone}
                </a>
              </div>
              <div>
                <span className="text-brand-slate-400 block text-[10px]">Email Address</span>
                <span className="text-brand-slate-700 font-medium">{nurse.email}</span>
              </div>
              <div>
                <span className="text-brand-slate-400 block text-[10px]">Council Registration</span>
                <span className="font-semibold text-brand-slate-800">{nurse.qualification}</span>
              </div>
            </div>
          </div>

          {/* Professional Details & Services */}
          <div className="bg-white rounded-xl border border-brand-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-900 flex items-center gap-1.5 pb-2 border-b border-brand-slate-100">
              <Award className="w-4 h-4 text-brand-teal-600" />
              Professional Specialization & Services
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-brand-slate-400 block text-[10px]">Primary Specialization</span>
                <span className="font-bold text-brand-slate-900 text-sm">{nurse.specialization}</span>
              </div>

              <div>
                <span className="text-brand-slate-400 block text-[10px] mb-1">Services Provided</span>
                <div className="flex flex-wrap gap-1.5">
                  {nurse.services?.map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200 font-semibold text-xs"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Registered Home Address & Map Location */}
          <div className="bg-white rounded-xl border border-brand-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-900 flex items-center gap-1.5 pb-2 border-b border-brand-slate-100">
              <MapPin className="w-4 h-4 text-brand-teal-600" />
              Registered Home Location (Mysuru)
            </h3>

            <div className="text-xs space-y-1">
              <p className="font-medium text-brand-slate-800 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                {nurse.address}
              </p>
              <p className="text-brand-slate-500 text-[11px] pl-5.5">
                Coordinates: {nurse.lat?.toFixed(4)}, {nurse.lng?.toFixed(4)} • Used for proximity calculation in automatic matching.
              </p>
            </div>
          </div>

          {/* Availability Schedule & Working Hours */}
          <div className="bg-white rounded-xl border border-brand-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-900 flex items-center gap-1.5 pb-2 border-b border-brand-slate-100">
              <Calendar className="w-4 h-4 text-brand-teal-600" />
              Availability & Booking Schedule
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-brand-slate-400 block text-[10px] mb-1">Working Days</span>
                <div className="flex flex-wrap gap-1">
                  {nurse.workingDays?.map((d, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-brand-slate-100 text-brand-slate-700 text-[11px] font-medium">
                      {d.slice(0, 3)}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-brand-slate-400 block text-[10px]">Working Hours</span>
                <span className="font-semibold text-brand-slate-800 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-brand-slate-400" />
                  {nurse.workingHours}
                </span>
              </div>
            </div>

            {/* Next Booking */}
            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-500 block mb-1">
                Current Booking Schedule
              </span>
              {nurse.nextBooking ? (
                <div className="text-xs">
                  <p className="font-bold text-brand-slate-900">{nurse.nextBooking.service}</p>
                  <p className="text-brand-teal-700 font-semibold">{nurse.nextBooking.date}, {nurse.nextBooking.time}</p>
                  <p className="text-brand-slate-500 text-[11px]">Patient: {nurse.nextBooking.patient}</p>
                </div>
              ) : (
                <p className="text-xs text-brand-green-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  No upcoming bookings. Fully Available for future requests.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Status Management */}
        <div className="p-4 sm:p-5 border-t border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-slate-600">Change Status:</span>
            <select
              value={nurse.status}
              onChange={(e) => onUpdateStatus(nurse.id, e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-lg border border-brand-slate-300 bg-white font-bold text-brand-slate-800"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="BUSY">BUSY</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="OFFLINE">OFFLINE</option>
            </select>
          </div>

          <button
            onClick={() => onToggleAccountStatus(nurse.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              nurse.accountStatus === 'Active'
                ? 'bg-brand-coral-50 hover:bg-brand-coral-100 text-brand-coral-700 border border-brand-coral-200'
                : 'bg-brand-green-50 hover:bg-brand-green-100 text-brand-green-700 border border-brand-green-200'
            }`}
          >
            {nurse.accountStatus === 'Active' ? 'Deactivate Nurse' : 'Activate Nurse'}
          </button>
        </div>
      </div>
    </div>
  );
}
