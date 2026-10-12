import React, { useState } from 'react';
import {
  CheckCircle2,
  Search,
  Calendar,
  Package,
  Building2,
  Eye,
  ShieldCheck,
  History
} from 'lucide-react';
import RequestDetails from '../components/RequestDetails';

export default function CompletedRentalsView({
  requests = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequestForModal, setSelectedRequestForModal] = useState(null);

  // Filter completed rentals (status: Completed)
  const completedRentals = requests.filter((r) => {
    const s = (r.status || '').toLowerCase();
    return s.includes('completed') || s.includes('returned');
  });

  const filtered = completedRentals.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      (r.id || '').toLowerCase().includes(q) ||
      (r.equipment || '').toLowerCase().includes(q) ||
      (r.assignedVendor || '').toLowerCase().includes(q) ||
      (r.rentalPeriod || '').toLowerCase().includes(q) ||
      (r.completionDate || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-navy-900 tracking-tight flex items-center gap-2.5">
            <CheckCircle2 className="w-7 h-7 text-brand-green-700" />
            Completed Rentals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Historical records and archive of fulfilled medical equipment rentals and verified returns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <strong>{completedRentals.length}</strong> Completed Records
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search completed rental by ID, equipment, vendor, or date..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Completed Rentals Table (Section 11: Rental ID, Equipment, Vendor, Rental Period, Completion Date, Status, Action) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/90 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Rental ID</th>
                <th className="px-4 py-3.5">Equipment</th>
                <th className="px-4 py-3.5">Vendor</th>
                <th className="px-4 py-3.5">Rental Period</th>
                <th className="px-4 py-3.5">Completion Date</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((r) => (
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
                        <span>{r.assignedVendor || 'Fulfilling Partner'}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-slate-700 whitespace-nowrap">
                      {r.rentalPeriod || `${r.rentalStartDate} – ${r.rentalEndDate}`}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {r.completionDate || r.rentalEndDate}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Completed
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
                    <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No completed rentals found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Fulfilled equipment rentals will appear here after completion.</p>
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
