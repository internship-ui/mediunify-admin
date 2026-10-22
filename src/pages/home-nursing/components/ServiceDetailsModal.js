import React from 'react';
import {
  X,
  Stethoscope,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Award,
  Layers,
  Power,
  Calendar,
  Users,
  Eye,
  Check,
  Ban
} from 'lucide-react';
import Modal from '../../../components/common/Modal';

export default function ServiceDetailsModal({
  isOpen,
  onClose,
  service,
  onToggleServiceActive,
  associatedRequests = [],
  onViewRequest
}) {
  if (!isOpen || !service) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Service Details — ${service.name}`}
      subtitle={`Category: ${service.category}`}
      maxWidth="max-w-3xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => onToggleServiceActive(service.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all ${
              service.isActive
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : 'bg-brand-teal-50 text-brand-teal-800 border-brand-teal-200 hover:bg-brand-teal-100'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{service.isActive ? 'Deactivate Service' : 'Activate Service'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-xs"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-5 text-xs sm:text-sm text-brand-navy-900 max-h-[70vh] overflow-y-auto pr-1">
        {/* Service Header Info */}
        <div className="p-4 rounded-2xl bg-brand-slate-50 border border-brand-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-brand-navy-950">
                {service.name}
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  service.isActive
                    ? 'bg-brand-green-50 text-brand-green-800 border-brand-green-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {service.isActive ? 'Active Service' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-brand-slate-600 mt-1 leading-relaxed">
              {service.description}
            </p>
          </div>

          {service.baseRate > 0 && (
            <div className="text-right">
              <span className="text-[10px] text-brand-slate-500 uppercase font-bold block">Base Rate</span>
              <span className="text-lg font-black text-brand-teal-700 font-mono">₹{service.baseRate}</span>
            </div>
          )}
        </div>

        {/* Section 2: Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-xl border border-brand-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-brand-slate-500 uppercase block">Total Requests</span>
            <span className="text-xl font-black text-brand-navy-950">{service.totalRequests}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-amber-200 bg-amber-50/40 shadow-2xs">
            <span className="text-[10px] font-bold text-amber-700 uppercase block">Pending Review</span>
            <span className="text-xl font-black text-amber-900">{service.pendingRequests}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-purple-200 bg-purple-50/40 shadow-2xs">
            <span className="text-[10px] font-bold text-purple-700 uppercase block">Scheduled Visits</span>
            <span className="text-xl font-black text-purple-900">{service.scheduledVisits}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-brand-green-200 bg-brand-green-50/40 shadow-2xs">
            <span className="text-[10px] font-bold text-brand-green-700 uppercase block">Completed</span>
            <span className="text-xl font-black text-brand-green-950">{service.completedRequests}</span>
          </div>
        </div>

        {/* Operational Specifications */}
        <div className="p-4 rounded-2xl bg-white border border-brand-slate-200 space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-slate-500 block">
            Clinical Specifications & Availability
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-brand-slate-50 p-2.5 rounded-xl border border-brand-slate-200">
              <span className="text-[10px] font-bold text-brand-slate-500 uppercase block">Operating Availability</span>
              <span className="font-bold text-brand-navy-900 text-xs">{service.availability}</span>
            </div>

            <div className="bg-brand-slate-50 p-2.5 rounded-xl border border-brand-slate-200">
              <span className="text-[10px] font-bold text-brand-slate-500 uppercase block">Typical Visit Duration</span>
              <span className="font-bold text-brand-navy-900 text-xs">{service.typicalDuration}</span>
            </div>

            <div className="bg-brand-slate-50 p-2.5 rounded-xl border border-brand-slate-200">
              <span className="text-[10px] font-bold text-brand-slate-500 uppercase block">Required Nurse Qualification</span>
              <span className="font-bold text-brand-navy-900 text-xs">{service.requiredQualification}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Associated Requests Summary */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-slate-500 block">
              Recent Care Requests for {service.name} ({associatedRequests.length})
            </span>
          </div>

          {associatedRequests.length === 0 ? (
            <div className="p-6 text-center text-brand-slate-500 bg-brand-slate-50 rounded-xl border border-brand-slate-200">
              No recent requests found for this service.
            </div>
          ) : (
            <div className="space-y-2">
              {associatedRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => onViewRequest && onViewRequest(req)}
                  className="p-3 rounded-xl bg-white hover:bg-brand-slate-50 border border-brand-slate-200 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-brand-navy-950 text-xs">{req.patientName}</span>
                      <span className="font-mono text-[10px] text-brand-slate-500">({req.id})</span>
                    </div>
                    <p className="text-[11px] text-brand-slate-500 mt-0.5">
                      {req.preferredDate} • {req.location} • Staff: {req.assignedStaff || 'Unassigned'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-brand-slate-100 text-brand-navy-900 border border-brand-slate-200">
                      {req.status}
                    </span>
                    <button className="p-1 hover:text-brand-teal-600">
                      <Eye className="w-3.5 h-3.5 text-brand-slate-400" />
                    </button>
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
