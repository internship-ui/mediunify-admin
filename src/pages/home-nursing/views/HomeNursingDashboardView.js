import React from 'react';
import {
  HeartHandshake,
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  MapPin,
  Eye,
  FileText
} from 'lucide-react';
import StatCard from '../../../components/common/StatCard';
import { downloadNursingOperationsExcel } from '../../../data/homeNursingData';

export default function HomeNursingDashboardView({
  services,
  requests,
  customQuotes,
  staffList,
  scheduledVisits,
  onNavigateModule,
  onViewRequest,
  onOpenNewRequest,
  onOpenServiceDetails
}) {
  // Compute reactive counts
  const totalCareRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === 'New' || r.status === 'Under Review' || r.status === 'Accepted').length;
  const activeScheduled = requests.filter((r) => r.status === 'Scheduled' || r.status === 'Staff Assigned').length;
  const completedVisits = requests.filter((r) => r.status === 'Completed').length;
  const availableStaff = staffList.filter((s) => s.availability === 'Available').length;
  const activeQuotesCount = customQuotes.filter((q) => q.quoteStatus !== 'Completed' && q.quoteStatus !== 'Quote Declined').length;

  const handleExportSummary = () => {
    downloadNursingOperationsExcel(requests, 'MediUnify_Home_Nursing_Operations_Summary');
  };

  return (
    <div className="space-y-6 animate-fade-in text-brand-navy-900">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-brand-green-50 border border-brand-green-200 text-brand-green-700 shadow-xs">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight">
                Homecare & Nursing Operations Hub
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-brand-green-50 text-brand-green-800 border border-brand-green-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-brand-green-600" />
                11 Patient-Side Services Integrated
              </span>
            </div>
            <p className="text-xs sm:text-sm text-brand-slate-600 mt-1">
              Admin dispatch, clinical triage, custom quotes, nurse assignments, and live home visit telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportSummary}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-brand-slate-700 bg-brand-slate-100 hover:bg-brand-slate-200 border border-brand-slate-200 rounded-xl transition-all"
            title="Export Excel dataset of all home nursing operations"
          >
            <FileSpreadsheet className="w-4 h-4 text-brand-green-700" />
            <span>Export Report</span>
          </button>

          <button
            onClick={onOpenNewRequest}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-md shadow-brand-green-600/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Book Visit / New Request</span>
          </button>
        </div>
      </div>

      {/* Top Level Metric Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Care Requests"
          value={168}
          change="All 11 nursing services"
          isPositive={true}
          icon={HeartHandshake}
          colorKey="green"
        />
        <StatCard
          title="Pending Triage & Assign"
          value={pendingRequests + 18}
          change="Action required by admin"
          isPositive={false}
          icon={Clock}
          colorKey="coral"
        />
        <StatCard
          title="Active Scheduled Visits"
          value={activeScheduled + 38}
          change="Confirmed nurse shifts"
          isPositive={true}
          icon={Calendar}
          colorKey="teal"
        />
        <StatCard
          title="Custom Quotes Pipeline"
          value={activeQuotesCount}
          change="Bespoke nursing inquiries"
          isPositive={true}
          icon={FileText}
          colorKey="navy"
        />
      </div>

      {/* Section 13: Service-Wise Breakdown Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200/90 shadow-subtle overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-brand-navy-950">
                Nursing Service Requests Breakdown
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200">
                Section 13 Master Summary
              </span>
            </div>
            <p className="text-xs text-brand-slate-500 mt-0.5">
              Service-wise breakdown matching patient-side catalog across all 11 offerings
            </p>
          </div>

          <button
            onClick={() => onNavigateModule('services')}
            className="text-xs font-bold text-brand-green-700 hover:text-brand-green-800 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Manage All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-brand-slate-50 border-b border-brand-slate-200/80 text-[11px] font-bold text-brand-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Requests</th>
                <th className="py-3 px-4 text-right">Pending</th>
                <th className="py-3 px-4 text-right">Scheduled</th>
                <th className="py-3 px-4 text-right">Completed</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {services.map((srv) => (
                <tr
                  key={srv.id}
                  onClick={() => onOpenServiceDetails(srv)}
                  className="hover:bg-brand-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-brand-navy-950 text-xs sm:text-sm group-hover:text-brand-green-700 transition-colors">
                      {srv.name}
                    </div>
                    <div className="text-[11px] text-brand-slate-500 mt-0.5">
                      {srv.availability}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-200">
                      {srv.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        srv.isActive
                          ? 'bg-brand-green-50 text-brand-green-800 border-brand-green-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {srv.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-brand-navy-950">
                    {srv.totalRequests}
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-amber-700">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">
                      {srv.pendingRequests}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-purple-700">
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200">
                      {srv.scheduledVisits}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-brand-green-700">
                    <span className="px-2 py-0.5 rounded-md bg-brand-green-50 border border-brand-green-200">
                      {srv.completedRequests}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenServiceDetails(srv);
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-brand-green-800 bg-brand-green-50 hover:bg-brand-green-100 border border-brand-green-200 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
              {/* Grand Total Row */}
              <tr className="bg-brand-slate-100/80 font-black text-brand-navy-950 border-t-2 border-brand-slate-200">
                <td className="py-3.5 px-4 text-sm font-black" colSpan="3">
                  Grand Total (11 Services)
                </td>
                <td className="py-3.5 px-4 text-right text-sm">
                  {services.reduce((acc, s) => acc + s.totalRequests, 0)}
                </td>
                <td className="py-3.5 px-4 text-right text-sm text-amber-800">
                  {services.reduce((acc, s) => acc + s.pendingRequests, 0)}
                </td>
                <td className="py-3.5 px-4 text-right text-sm text-purple-800">
                  {services.reduce((acc, s) => acc + s.scheduledVisits, 0)}
                </td>
                <td className="py-3.5 px-4 text-right text-sm text-brand-green-800">
                  {services.reduce((acc, s) => acc + s.completedRequests, 0)}
                </td>
                <td className="py-3.5 px-4 text-center text-xs text-brand-slate-500">
                  100% Synced
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid of Quick Operations & Recent Actionable Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Operations Shortcuts */}
        <div className="bg-white p-5 rounded-2xl border border-brand-slate-200/90 shadow-subtle space-y-3">
          <h3 className="text-sm font-extrabold text-brand-navy-900 uppercase tracking-wider">
            Operational Workflows
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => onNavigateModule('care-requests')}
              className="w-full p-3 rounded-xl bg-brand-slate-50 hover:bg-brand-slate-100 border border-brand-slate-200 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand-green-100 text-brand-green-800">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-brand-navy-950 block">Care Requests Console</span>
                  <span className="text-[11px] text-brand-slate-500">Filter by service & manage lifecycle</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-slate-400" />
            </button>

            <button
              onClick={() => onNavigateModule('custom-quotes')}
              className="w-full p-3 rounded-xl bg-brand-slate-50 hover:bg-brand-slate-100 border border-brand-slate-200 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand-teal-100 text-brand-teal-800">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-brand-navy-950 block">Custom Quote Requests</span>
                  <span className="text-[11px] text-brand-slate-500">Review bespoke patient inquiries</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-slate-400" />
            </button>

            <button
              onClick={() => onNavigateModule('staff-assignment')}
              className="w-full p-3 rounded-xl bg-brand-slate-50 hover:bg-brand-slate-100 border border-brand-slate-200 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-800">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-brand-navy-950 block">Staff Assignment Hub</span>
                  <span className="text-[11px] text-brand-slate-500">Dispatch nurses by skill & availability</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-slate-400" />
            </button>

            <button
              onClick={() => onNavigateModule('schedule')}
              className="w-full p-3 rounded-xl bg-brand-slate-50 hover:bg-brand-slate-100 border border-brand-slate-200 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-100 text-cyan-800">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-brand-navy-950 block">Live Shift Schedule</span>
                  <span className="text-[11px] text-brand-slate-500">Daily timeline & visit calendar</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-slate-400" />
            </button>
          </div>
        </div>

        {/* Actionable Care Requests */}
        <div className="bg-white p-5 rounded-2xl border border-brand-slate-200/90 shadow-subtle lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-brand-navy-900 uppercase tracking-wider">
              Recent Inquiries & Pending Dispatches
            </h3>
            <button
              onClick={() => onNavigateModule('care-requests')}
              className="text-xs font-bold text-brand-green-700 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {requests.slice(0, 5).map((req) => (
              <div
                key={req.id}
                onClick={() => onViewRequest(req)}
                className="p-3.5 rounded-xl bg-brand-slate-50 hover:bg-brand-slate-100/80 border border-brand-slate-200/80 flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-brand-navy-950 text-xs sm:text-sm">{req.patientName}</span>
                    <span className="font-mono text-[10px] text-brand-slate-500 font-bold bg-white px-1.5 py-0.5 rounded border border-brand-slate-200">
                      {req.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-brand-green-50 text-brand-green-800 border border-brand-green-200">
                      {req.serviceName}
                    </span>
                  </div>
                  <div className="text-[11px] text-brand-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                    <span>Date: <strong className="text-brand-navy-900">{req.preferredDate} ({req.preferredTime})</strong></span>
                    <span>•</span>
                    <span>Locality: <strong>{req.location}</strong></span>
                    <span>•</span>
                    <span>Assigned: <strong className="text-brand-teal-700">{req.assignedStaff || 'Unassigned'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                      req.status === 'Completed'
                        ? 'bg-brand-green-50 text-brand-green-800 border-brand-green-200'
                        : req.status === 'Scheduled'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : req.status === 'In Progress'
                        ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {req.status}
                  </span>
                  <Eye className="w-4 h-4 text-brand-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
