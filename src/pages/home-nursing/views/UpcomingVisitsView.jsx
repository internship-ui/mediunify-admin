import React from 'react';
import {
  Clock,
  Calendar,
  UserCheck,
  MapPin,
  CheckCircle2,
  Activity,
  Play,
  Eye,
  AlertCircle
} from 'lucide-react';

export default function UpcomingVisitsView({
  requests,
  onViewRequest,
  onUpdateStatus
}) {
  const upcomingList = requests.filter(
    (r) => r.status === 'Scheduled' || r.status === 'In Progress' || r.status === 'Staff Assigned'
  );

  return (
    <div className="space-y-6 animate-fade-in text-brand-navy-900">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight">
              Upcoming & Active Clinical Visits
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-brand-green-50 text-brand-green-800 border border-brand-green-200">
              {upcomingList.length} Active Shifts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate-600 mt-1">
            Monitor real-time caregiver check-ins, transit tracking, visit starts, and field clinical progress.
          </p>
        </div>
      </div>

      {/* Visits Cards */}
      <div className="space-y-3">
        {upcomingList.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-brand-slate-200 text-brand-slate-500 shadow-subtle">
            <Clock className="w-8 h-8 text-brand-slate-300 mx-auto mb-2" />
            <p className="font-bold text-sm text-brand-navy-950">No upcoming visits currently queued.</p>
          </div>
        ) : (
          upcomingList.map((req) => (
            <div
              key={req.id}
              className="bg-white p-5 rounded-2xl border border-brand-slate-200/90 shadow-subtle hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center flex-shrink-0 ${
                    req.status === 'In Progress'
                      ? 'bg-cyan-50 border-cyan-300 text-cyan-800 animate-pulse'
                      : 'bg-purple-50 border-purple-200 text-purple-800'
                  }`}
                >
                  <Activity className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-extrabold uppercase">{req.status}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-brand-navy-950 text-base">
                      {req.patientName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                      {req.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-green-50 text-brand-green-800 border border-brand-green-200">
                      {req.serviceName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-brand-slate-600 mt-2 flex-wrap">
                    <span className="font-bold text-brand-navy-900 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-slate-400" />
                      {req.preferredDate} ({req.preferredTime})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-bold text-brand-teal-800">
                      <UserCheck className="w-3.5 h-3.5 text-brand-teal-600" />
                      {req.assignedStaff}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-coral-600" />
                      {req.address} ({req.location})
                    </span>
                  </div>

                  <p className="text-xs text-brand-slate-500 mt-2 bg-brand-slate-50 p-2.5 rounded-xl border border-brand-slate-200/80">
                    <strong className="text-brand-navy-900">Clinical Requirement:</strong> {req.patientRequirement || req.additionalNotes}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap self-end lg:self-center">
                <button
                  onClick={() => onViewRequest(req)}
                  className="px-3 py-2 text-xs font-bold text-brand-slate-700 bg-brand-slate-100 hover:bg-brand-slate-200 border border-brand-slate-200 rounded-xl transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Details</span>
                </button>

                {req.status === 'Scheduled' && (
                  <button
                    onClick={() => onUpdateStatus(req.id, 'In Progress')}
                    className="px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Visit</span>
                  </button>
                )}

                {req.status === 'In Progress' && (
                  <button
                    onClick={() => onUpdateStatus(req.id, 'Completed')}
                    className="px-4 py-2 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Completed</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
