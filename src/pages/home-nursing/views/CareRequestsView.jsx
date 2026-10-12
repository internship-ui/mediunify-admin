import React, { useState, useMemo } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Eye,
  UserCheck,
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Plus,
  ArrowUpDown,
  Stethoscope,
  Activity,
  Syringe,
  Pill,
  Bandage,
  ShieldAlert,
  Bed,
  HeartHandshake,
  Hospital
} from 'lucide-react';
import { NURSING_SERVICE_NAMES, downloadNursingOperationsExcel } from '../../../data/homeNursingData';

export default function CareRequestsView({
  requests,
  onViewRequest,
  onOpenAssignStaff,
  onOpenNewRequest,
  onUpdateStatus
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('All Services');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch =
        r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone.includes(searchTerm) ||
        r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesService =
        selectedService === 'All Services' || r.serviceName === selectedService;

      const matchesStatus =
        selectedStatus === 'All Statuses' || r.status === selectedStatus;

      return matchesSearch && matchesService && matchesStatus;
    });
  }, [requests, searchTerm, selectedService, selectedStatus]);

  const handleExport = () => {
    downloadNursingOperationsExcel(filteredRequests, 'MediUnify_Care_Requests');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Accepted':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Staff Assigned':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Scheduled':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'In Progress':
        return 'bg-cyan-50 text-cyan-800 border-cyan-300 font-extrabold';
      case 'Completed':
        return 'bg-brand-green-50 text-brand-green-800 border-brand-green-200 font-bold';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-brand-slate-100 text-brand-slate-700 border-brand-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-brand-navy-900">
      {/* Top Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight">
              Care Requests Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-brand-green-50 text-brand-green-800 border border-brand-green-200">
              {filteredRequests.length} of {requests.length} Requests
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate-600 mt-1">
            Track nursing care inquiries, triage patient medical instructions, dispatch verified staff, and monitor visit progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-brand-slate-700 bg-brand-slate-100 hover:bg-brand-slate-200 border border-brand-slate-200 rounded-xl transition-all"
            title="Download Excel sheet of care requests"
          >
            <FileSpreadsheet className="w-4 h-4 text-brand-green-700" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={onOpenNewRequest}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-md shadow-brand-green-600/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>New Care Request</span>
          </button>
        </div>
      </div>

      {/* Section 12: Search & Service Filters */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name, request ID (e.g. HC-WD-001), phone, locality..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 text-brand-navy-900"
          />
        </div>

        {/* Section 12: Service Type Filter & Status Filter */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Service Type Filter */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            aria-label="Filter by Service Type"
            className="w-full sm:w-auto px-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none"
          >
            {NURSING_SERVICE_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter by Status"
            className="w-full sm:w-auto px-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Accepted">Accepted</option>
            <option value="Staff Assigned">Staff Assigned</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Section 3: Standard Care Requests Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200/90 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-brand-slate-50 border-b border-brand-slate-200/80 text-[11px] font-bold text-brand-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Selected Nursing Service</th>
                <th className="py-3 px-4">Preferred Date & Time</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-brand-slate-500">
                    <Inbox className="w-8 h-8 text-brand-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">No care requests match your filter criteria.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedService('All Services');
                        setSelectedStatus('All Statuses');
                      }}
                      className="mt-2 text-xs font-bold text-brand-green-700 hover:underline"
                    >
                      Reset all filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => onViewRequest(req)}
                    className="hover:bg-brand-slate-50/80 transition-colors group cursor-pointer"
                  >
                    {/* Request ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-brand-teal-700 whitespace-nowrap">
                      {req.id}
                    </td>

                    {/* Patient Profile */}
                    <td className="py-3.5 px-4">
                      <div className="font-black text-brand-navy-950 text-xs sm:text-sm group-hover:text-brand-green-700 transition-colors">
                        {req.patientName}
                      </div>
                      <div className="text-[11px] text-brand-slate-500 mt-0.5 flex items-center gap-1">
                        <span>{req.age}y ({req.gender})</span>
                        <span>•</span>
                        <a
                          href={`tel:${req.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:underline text-brand-slate-600"
                        >
                          {req.phone}
                        </a>
                      </div>
                    </td>

                    {/* Section 3: Selected Service Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-brand-navy-900 leading-snug">
                        {req.serviceName}
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-green-50 text-brand-green-800 border border-brand-green-200">
                        {req.serviceCategory}
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-brand-navy-900 text-xs flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-slate-400" />
                        {req.preferredDate}
                      </div>
                      <div className="text-[11px] text-brand-slate-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-brand-slate-400" />
                        {req.preferredTime}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-xs font-semibold text-brand-navy-900 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-coral-600" />
                        {req.location}
                      </div>
                    </td>

                    {/* Assigned Staff */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {req.assignedStaff && req.assignedStaff !== 'Unassigned' ? (
                        <div className="text-xs font-bold text-brand-teal-800 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-brand-teal-600" />
                          <span>{req.assignedStaff}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onViewRequest(req)}
                          className="px-2.5 py-1 text-xs font-bold text-brand-green-800 bg-brand-green-50 hover:bg-brand-green-100 border border-brand-green-200 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Details</span>
                        </button>

                        {(req.status === 'Accepted' || req.status === 'Under Review' || req.assignedStaff === 'Unassigned') && req.status !== 'Completed' && req.status !== 'Cancelled' && (
                          <button
                            onClick={() => onOpenAssignStaff(req)}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-lg transition-colors inline-flex items-center gap-1"
                            title="Assign Nurse or Caregiver"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Assign</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
