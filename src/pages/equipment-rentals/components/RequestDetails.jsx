import React from 'react';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Lock,
  Eye,
  AlertCircle,
  FileText
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function RequestDetails({
  request,
  onBack
}) {
  if (!request) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100 rounded-xl transition-colors border border-brand-slate-200 shadow-2xs"
            title="Back to Requests Table"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy-900 font-mono">
                {request.id}
              </h1>
              <StatusBadge status={request.status} size="md" />
            </div>
            <p className="text-xs text-brand-slate-500 mt-1">
              Automated patient equipment request • Requested on {request.requestDate}
            </p>
          </div>
        </div>

        {/* Informative Monitoring Badge */}
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-teal-800 bg-brand-teal-50 px-3 py-1.5 rounded-xl border border-brand-teal-200">
          <Eye className="w-4 h-4 text-brand-teal-600" />
          <span>Admin Monitoring Mode (Automated Flow)</span>
        </div>
      </div>

      {/* Patient Privacy Protection Notice (Requirement 12) */}
      <div className="p-4 rounded-2xl bg-teal-50/50 border border-brand-teal-200 flex items-start gap-3 text-xs">
        <div className="w-7 h-7 rounded-xl bg-brand-teal-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-brand-teal-950 block text-xs sm:text-sm">
            Strict Patient Privacy & Identity Shield Active
          </span>
          <p className="text-brand-teal-900 mt-0.5 leading-relaxed text-[11px] sm:text-xs">
            Registered vendors receive <strong>only equipment specifications and rental dates</strong>. Patient personal information (Name, Phone, Email, ID, Address) is strictly restricted to the authorized Admin Hub.
          </p>
        </div>
      </div>

      {/* Main Grid: Patient Details & Equipment Request */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Patient Details (Admin Only) */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-brand-teal-700 border border-brand-teal-200">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900">
                  Patient Details
                </h3>
                <p className="text-[11px] text-brand-slate-500">Authorized Admin View Only</p>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold text-brand-slate-500 bg-brand-slate-100 px-2 py-0.5 rounded">
              {request.patientId || 'PID-8842'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100 space-y-1">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Patient Name</span>
              <p className="font-bold text-brand-navy-900 text-sm">{request.patientName}</p>
            </div>

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100 space-y-1">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Phone Number</span>
              <p className="font-bold text-brand-slate-800 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-brand-teal-600" />
                <span>{request.patientPhone}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100 space-y-1 sm:col-span-2">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Email Address</span>
              <p className="font-semibold text-brand-slate-800 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-brand-teal-600" />
                <span>{request.patientEmail}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100 space-y-1 sm:col-span-2">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Delivery Address & Zone</span>
              <p className="font-semibold text-brand-slate-800 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                <span>{request.patientAddress}</span>
              </p>
              <p className="text-[11px] text-brand-slate-500 pl-5">
                Location Zone: <strong>{request.patientLocation}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* 2. Equipment Request */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-brand-teal-700 border border-brand-teal-200">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900">
                  Equipment Request
                </h3>
                <p className="text-[11px] text-brand-slate-500">Shared automatically with vendors</p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-brand-slate-100 text-brand-slate-700 text-xs font-bold">
              {request.equipmentCategory}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Equipment Name</span>
              <p className="font-bold text-brand-navy-900 mt-0.5 truncate">{request.equipment}</p>
            </div>

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Quantity</span>
              <p className="font-bold text-brand-navy-900 mt-0.5">{request.quantity || 1} Unit(s)</p>
            </div>

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Rental Start Date</span>
              <p className="font-bold text-brand-navy-900 mt-0.5">{request.rentalStartDate}</p>
            </div>

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Rental End Date</span>
              <p className="font-bold text-brand-navy-900 mt-0.5">{request.rentalEndDate}</p>
            </div>
          </div>

          {/* Additional Requirements */}
          <div className="p-3.5 rounded-xl bg-brand-slate-50 border border-brand-slate-200 text-xs space-y-1">
            <span className="font-bold text-brand-navy-900 block">Additional Requirements:</span>
            <p className="text-brand-slate-700 leading-relaxed font-medium">
              {request.additionalRequirements || 'Standard sanitized medical equipment requirement.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Vendor Response Monitor (Requirement 4) */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brand-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-brand-teal-700 border border-brand-teal-200">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900">
                Vendor Response & Availability Status
              </h3>
              <p className="text-[11px] text-brand-slate-500">
                System automatically polls relevant registered vendors in the patient's area
              </p>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-brand-slate-500">
            {request.vendorResponses?.length || 0} Vendor Response(s) Logged
          </span>
        </div>

        {/* Vendor Response Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          {(request.vendorResponses || []).map((resp, idx) => {
            const isAvailable = resp.status === 'Available';
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isAvailable
                    ? 'bg-brand-green-50/40 border-brand-green-300'
                    : 'bg-brand-slate-50 border-brand-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-2xs ${
                        isAvailable
                          ? 'bg-brand-green-600 text-white'
                          : 'bg-brand-slate-300 text-brand-slate-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-navy-900">{resp.vendorName}</h4>
                      <span className="text-[10px] text-brand-slate-400">{resp.responseTime}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full font-bold text-xs inline-flex items-center gap-1 ${
                      isAvailable
                        ? 'bg-brand-green-100 text-brand-green-800 border border-brand-green-300'
                        : 'bg-brand-coral-50 text-brand-coral-700 border border-brand-coral-200'
                    }`}
                  >
                    {isAvailable ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-green-600" />
                        <span>Available</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-brand-coral-600" />
                        <span>Not Available</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-brand-slate-200/60 text-[11px] text-brand-slate-600 font-medium">
                  {resp.notes}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
