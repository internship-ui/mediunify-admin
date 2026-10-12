import React, { useState } from 'react';
import {
  Clock4,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Calendar,
  Building2,
  Package,
  ShieldCheck,
  Tag
} from 'lucide-react';
import RequestDetails from '../components/RequestDetails';

export default function ActiveRentalsView({
  requests = [],
  onOpenRequest
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequestForModal, setSelectedRequestForModal] = useState(null);

  // Filter active rentals (Active status)
  const activeRentals = requests.filter((r) => {
    const s = (r.status || '').toLowerCase();
    return s === 'active' || s === 'rental active' || s === 'vendor confirmed';
  });

  const filteredRentals = activeRentals.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      (r.id || '').toLowerCase().includes(q) ||
      (r.equipment || '').toLowerCase().includes(q) ||
      (r.assignedVendor || '').toLowerCase().includes(q) ||
      (r.patientName || '').toLowerCase().includes(q) ||
      (r.patientLocation || '').toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
      case 'Rental Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Vendor Confirmed':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-navy-900 tracking-tight flex items-center gap-2.5">
            <Clock4 className="w-7 h-7 text-brand-teal-700" />
            Active Rentals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Live monitoring of ongoing equipment deployments with patients. (Automated vendor fulfillment)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <strong>{activeRentals.length}</strong> Active Deployments
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by rental ID, equipment, vendor, or patient..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Table Section (Section 10: Rental ID, Equipment, Vendor, Rental Start, Rental End, Status, Action) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/90 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Rental ID</th>
                <th className="px-4 py-3.5">Equipment</th>
                <th className="px-4 py-3.5">Vendor</th>
                <th className="px-4 py-3.5">Rental Start</th>
                <th className="px-4 py-3.5">Rental End</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRentals.length > 0 ? (
                filteredRentals.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                      {r.id}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-brand-teal-700 transition-colors">
                        <Package className="w-3.5 h-3.5 text-brand-teal-600 shrink-0" />
                        <span>{r.equipment}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">Qty: {r.quantity || 1}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-teal-800 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{r.assignedVendor || 'Assigned Vendor Partner'}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-slate-700 whitespace-nowrap">
                      {r.rentalStartDate}
                    </td>

                    <td className="px-4 py-3.5 font-medium text-slate-700 whitespace-nowrap">
                      {r.rentalEndDate}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusBadge(r.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {r.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedRequestForModal(r)}
                        className="px-3 py-1.5 bg-brand-teal-50 hover:bg-brand-teal-600 text-brand-teal-700 hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-slate-400">
                    <Clock4 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No active rentals matching search</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Active rentals will appear here when patient requests are confirmed.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequestForModal && (
        <RequestDetails
          isOpen={!!selectedRequestForModal}
          request={selectedRequestForModal}
          onClose={() => setSelectedRequestForModal(null)}
        />
      )}
    </div>
  );
}
