import React, { useState } from 'react';
import {
  ShieldCheck,
  ClipboardList,
  Building2,
  Clock,
  CheckCircle2,
  Package,
  ArrowRight,
  UserCheck,
  Eye,
  Calendar,
  XCircle,
  Truck,
  Lock,
  Search,
  Check
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function EquipmentRentalDashboardView({
  requests = [],
  vendors = [],
  onNavigateModule,
  onOpenRequest
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // 6 Exact Summary Numbers requested in Section 2:
  const newRequestsCount = requests.filter(
    (r) => (r.status || '').toLowerCase().includes('pending') || (r.status || '').toLowerCase() === 'new'
  ).length;

  const pendingVerificationCount = vendors.filter(
    (v) => (v.status || '').toLowerCase() === 'pending'
  ).length;

  const activeVendorsCount = vendors.filter(
    (v) => (v.status || '').toLowerCase() === 'active'
  ).length;

  const inactiveVendorsCount = vendors.filter(
    (v) => (v.status || '').toLowerCase() === 'inactive'
  ).length;

  const activeRentalsCount = requests.filter(
    (r) => (r.status || '').toLowerCase() === 'active'
  ).length;

  const completedRentalsCount = requests.filter(
    (r) => (r.status || '').toLowerCase() === 'completed'
  ).length;

  // Incoming new rental requests (Vendor Response Pending)
  const incomingRequests = requests.filter(
    (r) => (r.status || '').toLowerCase().includes('pending') || (r.status || '').toLowerCase() === 'new'
  );

  // Filter recent requests
  const filteredRequests = incomingRequests.filter((req) => {
    const q = searchQuery.toLowerCase();
    return (
      (req.id || '').toLowerCase().includes(q) ||
      (req.equipment || '').toLowerCase().includes(q) ||
      (req.rentalPeriod || '').toLowerCase().includes(q) ||
      (req.status || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-teal-700 via-brand-teal-800 to-brand-navy-900 rounded-2xl p-6 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-teal-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>MediUnify Healthcare Administration</span>
          </div>
          <h1 className="text-2xl font-extrabold mt-1 tracking-tight">Equipment Rental Operations</h1>
          <p className="text-xs sm:text-sm text-brand-teal-100 mt-1 max-w-xl leading-relaxed">
            Verify registered equipment vendors and monitor automated patient rental requests across the network.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onNavigateModule('vendor-verification')}
            className="px-4 py-2.5 bg-white text-brand-navy-900 hover:bg-brand-teal-50 font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-brand-teal-700" />
            <span>Verify Vendors ({pendingVerificationCount})</span>
          </button>
          <button
            onClick={() => onNavigateModule('requests')}
            className="px-4 py-2.5 bg-brand-teal-800/90 hover:bg-brand-teal-800 text-white font-bold text-xs rounded-xl border border-brand-teal-500 transition-colors inline-flex items-center gap-1.5"
          >
            <ClipboardList className="w-4 h-4" />
            <span>View All Requests</span>
          </button>
        </div>
      </div>

      {/* Automatic Flow & Privacy Banner Notice */}
      <div className="bg-brand-slate-50 border border-brand-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200 flex items-center justify-center flex-shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-brand-navy-900 block">
              Automated Request Routing & Patient Privacy Shield Active
            </span>
            <span className="text-brand-slate-500 text-[11px]">
              Patient requests are automatically broadcast to eligible registered vendors with personal information completely shielded.
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-green-50 text-brand-green-700 border border-brand-green-200 rounded-lg text-[11px] font-bold whitespace-nowrap self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5" /> Automated Broadcast
        </span>
      </div>

      {/* 6 Summary Cards (Requirement 2) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. New Rental Requests */}
        <div
          onClick={() => onNavigateModule('requests')}
          className="bg-white p-4 rounded-2xl border border-blue-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-blue-50/20"
        >
          <div className="flex items-center justify-between text-blue-700 text-xs font-bold">
            <span className="truncate">New Requests</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
          </div>
          <div className="text-2xl font-extrabold text-blue-900 mt-2 font-mono">
            {newRequestsCount}
          </div>
          <p className="text-[10px] text-blue-600 font-medium mt-1 truncate">Auto sent to vendors</p>
        </div>

        {/* 2. Pending Vendor Verification */}
        <div
          onClick={() => onNavigateModule('vendor-verification')}
          className="bg-white p-4 rounded-2xl border border-purple-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-purple-50/20"
        >
          <div className="flex items-center justify-between text-purple-700 text-xs font-bold">
            <span className="truncate">Pending Verify</span>
            <ShieldCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
          </div>
          <div className="text-2xl font-extrabold text-purple-900 mt-2 font-mono">
            {pendingVerificationCount}
          </div>
          <p className="text-[10px] text-purple-600 font-medium mt-1 truncate">Action required</p>
        </div>

        {/* 3. Active Vendors */}
        <div
          onClick={() => onNavigateModule('vendors')}
          className="bg-white p-4 rounded-2xl border border-brand-teal-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-teal-50/20"
        >
          <div className="flex items-center justify-between text-brand-teal-700 text-xs font-bold">
            <span className="truncate">Active Vendors</span>
            <Building2 className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
          </div>
          <div className="text-2xl font-extrabold text-brand-teal-900 mt-2 font-mono">
            {activeVendorsCount}
          </div>
          <p className="text-[10px] text-brand-teal-600 font-medium mt-1 truncate">Approved suppliers</p>
        </div>

        {/* 4. Inactive Vendors */}
        <div
          onClick={() => onNavigateModule('vendors')}
          className="bg-white p-4 rounded-2xl border border-brand-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-brand-slate-500 text-xs font-bold">
            <span className="truncate">Inactive Vendors</span>
            <XCircle className="w-4 h-4 text-brand-slate-400 flex-shrink-0" />
          </div>
          <div className="text-2xl font-extrabold text-brand-slate-700 mt-2 font-mono">
            {inactiveVendorsCount}
          </div>
          <p className="text-[10px] text-brand-slate-400 font-medium mt-1 truncate">Paused accounts</p>
        </div>

        {/* 5. Active Rentals */}
        <div
          onClick={() => onNavigateModule('active-rentals')}
          className="bg-white p-4 rounded-2xl border border-brand-teal-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-teal-50/20"
        >
          <div className="flex items-center justify-between text-brand-teal-700 text-xs font-bold">
            <span className="truncate">Active Rentals</span>
            <Truck className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
          </div>
          <div className="text-2xl font-extrabold text-brand-teal-900 mt-2 font-mono">
            {activeRentalsCount}
          </div>
          <p className="text-[10px] text-brand-teal-600 font-medium mt-1 truncate">Currently on rent</p>
        </div>

        {/* 6. Completed Rentals */}
        <div
          onClick={() => onNavigateModule('completed-rentals')}
          className="bg-white p-4 rounded-2xl border border-brand-green-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-green-50/20"
        >
          <div className="flex items-center justify-between text-brand-green-700 text-xs font-bold">
            <span className="truncate">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-brand-green-600 flex-shrink-0" />
          </div>
          <div className="text-2xl font-extrabold text-brand-green-900 mt-2 font-mono">
            {completedRentalsCount}
          </div>
          <p className="text-[10px] text-brand-green-600 font-medium mt-1 truncate">Returned & closed</p>
        </div>
      </div>

      {/* Recent Rental Requests Table (Requirement 2) */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-brand-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-brand-navy-900 tracking-tight flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-brand-teal-700" />
              Recent Rental Requests
            </h2>
            <p className="text-xs text-brand-slate-500 mt-0.5">
              Live patient equipment inquiries being processed by registered vendors
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, equipment..."
                className="pl-9 pr-3 py-1.5 text-xs bg-brand-slate-50 border border-brand-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:bg-white w-44 sm:w-60"
              />
            </div>

            <button
              onClick={() => onNavigateModule('requests')}
              className="text-xs font-bold text-brand-teal-700 hover:text-brand-teal-900 inline-flex items-center gap-1 flex-shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table matching Columns: Request ID | Equipment | Quantity | Rental Period | Status | Action */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-600">
            <thead className="bg-brand-slate-50/80 text-[11px] font-bold text-brand-slate-700 uppercase tracking-wider border-b border-brand-slate-200">
              <tr>
                <th className="px-4 py-3">Request ID</th>
                <th className="px-4 py-3">Equipment</th>
                <th className="px-3 py-3 text-center">Quantity</th>
                <th className="px-4 py-3">Rental Period</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredRequests.slice(0, 7).map((req) => (
                <tr
                  key={req.id}
                  onClick={() => onOpenRequest && onOpenRequest(req.id)}
                  className="hover:bg-brand-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3.5 font-mono font-bold text-brand-navy-900 whitespace-nowrap">
                    {req.id}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-bold text-brand-navy-900 flex items-center gap-1.5 group-hover:text-brand-teal-700 transition-colors">
                      <Package className="w-3.5 h-3.5 text-brand-teal-600 flex-shrink-0" />
                      <span>{req.equipment}</span>
                    </div>
                    <span className="text-[10px] text-brand-slate-400">{req.equipmentCategory}</span>
                  </td>

                  <td className="px-3 py-3.5 text-center">
                    <span className="font-bold text-brand-slate-800 bg-brand-slate-100 px-2 py-0.5 rounded font-mono">
                      {req.quantity || 1}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-medium text-brand-slate-700">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-slate-400 flex-shrink-0" />
                      <span>{req.rentalPeriod || `${req.rentalStartDate} – ${req.rentalEndDate}`}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={req.status} size="xs" />
                  </td>

                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenRequest) onOpenRequest(req.id);
                      }}
                      className="px-3 py-1.5 bg-brand-teal-50 hover:bg-brand-teal-600 text-brand-teal-700 hover:text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 shadow-2xs group-hover:scale-105"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
