import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  Award,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';

export default function StaffAssignmentView({
  requests,
  customQuotes,
  staffList,
  onOpenAssignStaff,
  onViewRequest
}) {
  const [activeTab, setActiveTab] = useState('unassigned'); // 'unassigned' | 'assigned' | 'staff-roster'
  const [searchTerm, setSearchTerm] = useState('');

  // Unassigned requests
  const unassignedCareRequests = requests.filter(
    (r) => (!r.assignedStaff || r.assignedStaff === 'Unassigned') && r.status !== 'Cancelled' && r.status !== 'Completed'
  );

  const unassignedQuotes = customQuotes.filter(
    (q) => q.quoteStatus === 'Quote Accepted' || q.quoteStatus === 'Staff Assignment Pending'
  );

  const assignedRequests = requests.filter(
    (r) => r.assignedStaff && r.assignedStaff !== 'Unassigned' && r.status !== 'Cancelled'
  );

  return (
    <div className="space-y-6 animate-fade-in text-brand-navy-900">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight">
              Clinical Staff Assignment Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-brand-green-50 text-brand-green-800 border border-brand-green-200">
              {unassignedCareRequests.length + unassignedQuotes.length} Pending Dispatches
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate-600 mt-1">
            Section 11: Match registered nurses and caregivers with patient clinical requirements based on verified capabilities, area proximity, and schedule availability.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-brand-slate-100 rounded-xl border border-brand-slate-200">
          <button
            onClick={() => setActiveTab('unassigned')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'unassigned'
                ? 'bg-white text-brand-navy-950 shadow-xs'
                : 'text-brand-slate-600 hover:text-brand-navy-900'
            }`}
          >
            Needs Assignment ({unassignedCareRequests.length + unassignedQuotes.length})
          </button>
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'assigned'
                ? 'bg-white text-brand-navy-950 shadow-xs'
                : 'text-brand-slate-600 hover:text-brand-navy-900'
            }`}
          >
            Active Assignments ({assignedRequests.length})
          </button>
        </div>
      </div>

      {/* Unassigned Queue */}
      {activeTab === 'unassigned' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-brand-navy-900 uppercase tracking-wider">
              Pending Patient Requests Requiring Staff Dispatch
            </h3>
          </div>

          {unassignedCareRequests.length === 0 && unassignedQuotes.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-brand-slate-200 shadow-subtle text-brand-slate-500">
              <CheckCircle2 className="w-8 h-8 text-brand-green-600 mx-auto mb-2" />
              <p className="font-bold text-sm text-brand-navy-950">All active care requests have assigned staff!</p>
              <p className="text-xs text-brand-slate-500 mt-1">New patient requests will appear here immediately for triage.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Standard Care Requests */}
              {unassignedCareRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-5 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                        {req.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                        {req.status}
                      </span>
                    </div>

                    <h4 className="font-black text-brand-navy-950 text-base">
                      {req.patientName}
                    </h4>
                    <p className="text-xs font-bold text-brand-green-700 mt-0.5">
                      {req.serviceName}
                    </p>

                    <div className="mt-3 space-y-1.5 text-xs text-brand-slate-600 bg-brand-slate-50 p-3 rounded-xl border border-brand-slate-200/80">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-slate-400" />
                        <span>Date: <strong className="text-brand-navy-900">{req.preferredDate} ({req.preferredTime})</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-coral-600" />
                        <span>Locality: <strong className="text-brand-navy-900">{req.location}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-slate-400" />
                        <span>Duration: {req.visitDuration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-brand-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onViewRequest(req)}
                      className="text-xs font-bold text-brand-slate-600 hover:text-brand-navy-950"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => onOpenAssignStaff(req)}
                      className="px-4 py-2 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Select & Assign Nurse</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Custom Quotes Pending Staff */}
              {unassignedQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="bg-white p-5 rounded-2xl border border-brand-teal-200/90 shadow-subtle flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                        {quote.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-300 font-bold">
                        Quote Approved
                      </span>
                    </div>

                    <h4 className="font-black text-brand-navy-950 text-base">
                      {quote.patientName}
                    </h4>
                    <p className="text-xs font-bold text-brand-teal-800 mt-0.5">
                      {quote.requirementTitle}
                    </p>

                    <div className="mt-3 space-y-1.5 text-xs text-brand-slate-600 bg-brand-slate-50 p-3 rounded-xl border border-brand-slate-200/80">
                      <div>Required: <strong className="text-brand-navy-900">{quote.quoteDetails?.staffType || 'Specialist Nurse'}</strong></div>
                      <div>Start: <strong>{quote.preferredDate}</strong> ({quote.duration})</div>
                      <div>Area: <strong>{quote.location}</strong></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-brand-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onOpenAssignStaff(quote)}
                      className="px-4 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Assign Specialist Staff</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Assignments View */}
      {activeTab === 'assigned' && (
        <div className="bg-white rounded-2xl border border-brand-slate-200/90 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-brand-slate-50 border-b border-brand-slate-200/80 text-[11px] font-bold text-brand-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Assigned Nurse / Staff</th>
                  <th className="py-3 px-4">Schedule Date & Shift</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100">
                {assignedRequests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => onViewRequest(req)}
                    className="hover:bg-brand-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-teal-700 text-xs">
                      {req.id}
                    </td>
                    <td className="py-3.5 px-4 font-black text-brand-navy-950">
                      {req.patientName}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-navy-900">
                      {req.serviceName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-brand-teal-800 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-brand-teal-600" />
                        {req.assignedStaff}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-brand-slate-700">
                      {req.preferredDate} ({req.preferredTime})
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {req.location}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-green-50 text-brand-green-800 border border-brand-green-200">
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAssignStaff(req);
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-brand-slate-700 bg-brand-slate-100 hover:bg-brand-slate-200 border border-brand-slate-200 rounded-lg"
                      >
                        Reassign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
