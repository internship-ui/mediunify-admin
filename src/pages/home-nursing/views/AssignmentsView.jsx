import React, { useState } from 'react';
import {
  HeartHandshake,
  Search,
  UserCheck,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  ArrowRight
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function AssignmentsView({
  requests = [],
  onOpenRequest
}) {
  const assignedRequests = requests.filter(r => r.assignedNurse !== null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssignments = assignedRequests.filter((r) => {
    return (
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.assignedNurse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.serviceRequired.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <HeartHandshake className="w-7 h-7 text-brand-green-700" />
            Active Nurse Assignments
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tracking patient requests with confirmed nurse allocations and upcoming home visits.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search assigned patient, nurse, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 focus:border-brand-green-500"
          />
        </div>
        <div className="text-xs text-gray-500">
          Total Assigned: <span className="font-bold text-gray-800">{filteredAssignments.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-3.5 py-3">Request ID</th>
                <th className="px-3.5 py-3">Patient Details</th>
                <th className="px-3.5 py-3">Assigned Nurse</th>
                <th className="px-3.5 py-3">Specialization</th>
                <th className="px-3.5 py-3">Nurse Phone</th>
                <th className="px-3.5 py-3">Visit Schedule</th>
                <th className="px-3.5 py-3">Price (₹)</th>
                <th className="px-3.5 py-3">Payment Mode</th>
                <th className="px-3.5 py-3">Status</th>
                <th className="px-3.5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-3.5 py-3 font-mono font-bold text-brand-navy-900">
                      {req.id}
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="font-semibold text-gray-900">{req.patientName}</div>
                      <div className="text-[11px] text-gray-400">{req.address}</div>
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-1.5 font-bold text-gray-900">
                        <UserCheck className="w-3.5 h-3.5 text-brand-green-700 flex-shrink-0" />
                        <span>{req.assignedNurse.name}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                        <span className="truncate max-w-[200px]" title={req.assignedNurse.address || req.assignedNurse.serviceArea}>
                          {req.assignedNurse.address || req.assignedNurse.serviceArea || 'Registered Area'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3.5 py-3 text-gray-700 font-medium">
                      {req.assignedNurse.specialization}
                    </td>
                    <td className="px-3.5 py-3 text-gray-600 font-mono font-semibold">
                      {req.assignedNurse.phone}
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap text-gray-700">
                      <div>{req.preferredDate || req.requestedDate || '26 Sep 2026'}</div>
                      <div className="text-[10px] text-gray-400">{req.preferredTime || req.requestedTime || '10:00 AM'}</div>
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span className="font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded border border-gray-200 font-mono">
                        ₹{req.price || 750}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-blue-50 text-blue-700 border-blue-200">
                        Online
                      </span>
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <StatusBadge status={req.status} size="xs" />
                    </td>
                    <td className="px-3.5 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onOpenRequest && onOpenRequest(req.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:text-brand-navy-900 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-gray-400">
                    <HeartHandshake className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-base font-semibold text-gray-700">No active nurse assignments found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
