import React, { useState } from 'react';
import {
  Inbox,
  Search,
  Eye,
  Calendar,
  Package,
  CheckCircle2,
  Clock,
  Lock,
  Filter,
  X,
  Building2,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import RequestDetails from '../components/RequestDetails';

export default function RentalRequestsView({
  requests = [],
  selectedRequestId,
  onSelectRequest
}) {
  const [activeTab, setActiveTab] = useState('Vendor Response Pending');
  const [searchQuery, setSearchQuery] = useState('');

  const activeDetail = selectedRequestId
    ? requests.find((r) => r.id === selectedRequestId)
    : null;

  // New & Pending Rental Requests (Patient requests broadcast to vendors)
  const incomingRequests = requests.filter((r) => {
    const s = (r.status || '').toLowerCase();
    return s.includes('pending') || s.includes('confirmed') || s === 'new';
  });

  const tabs = [
    'Vendor Response Pending',
    'Vendor Confirmed',
    'All Requests'
  ];

  const getTabCount = (tabName) => {
    if (tabName === 'All Requests') return incomingRequests.length;
    if (tabName === 'Vendor Response Pending') {
      return incomingRequests.filter((r) => (r.status || '').toLowerCase().includes('pending') || (r.status || '').toLowerCase() === 'new').length;
    }
    if (tabName === 'Vendor Confirmed') {
      return incomingRequests.filter((r) => (r.status || '').toLowerCase().includes('confirmed')).length;
    }
    return 0;
  };

  const filteredRequests = incomingRequests.filter((req) => {
    let matchesTab = false;
    const s = (req.status || '').toLowerCase();
    if (activeTab === 'All Requests') {
      matchesTab = true;
    } else if (activeTab === 'Vendor Response Pending') {
      matchesTab = s.includes('pending') || s === 'new';
    } else if (activeTab === 'Vendor Confirmed') {
      matchesTab = s.includes('confirmed');
    }

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (req.id || '').toLowerCase().includes(q) ||
      (req.equipment || '').toLowerCase().includes(q) ||
      (req.rentalPeriod || '').toLowerCase().includes(q) ||
      (req.status || '').toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  if (activeDetail) {
    return (
      <RequestDetails
        request={activeDetail}
        onBack={() => onSelectRequest && onSelectRequest(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-navy-900 tracking-tight flex items-center gap-2.5">
            <Inbox className="w-7 h-7 text-brand-teal-700" />
            Patient Rental Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Incoming patient equipment requests automatically broadcast to registered vendors in real time.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          Showing <strong className="text-brand-navy-900">{filteredRequests.length}</strong> New Requests
        </span>
      </div>

      {/* Privacy Notice Banner (Section 12) */}
      <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-200 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-teal-950">
          <Lock className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            <strong>Automatic Broadcast:</strong> When a patient requests equipment, the system automatically notifies relevant registered vendors without exposing patient personal data.
          </span>
        </div>
        <span className="text-[11px] font-bold text-teal-700 bg-white px-2.5 py-0.5 rounded border border-teal-200 whitespace-nowrap">
          Patient Privacy Shielded
        </span>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const count = getTabCount(tab);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shadow-2xs ${
                isActive
                  ? 'bg-brand-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-brand-teal-900 text-brand-teal-100'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Request ID, equipment, rental dates, or status..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Rental Requests Table (Requirement 3: Request ID, Equipment, Quantity, Rental Period, Status, Action) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/90 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Request ID</th>
                <th className="px-4 py-3.5">Equipment</th>
                <th className="px-3 py-3.5 text-center">Quantity</th>
                <th className="px-4 py-3.5">Rental Period</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => onSelectRequest && onSelectRequest(req.id)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {req.id}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-brand-teal-700 transition-colors">
                        <Package className="w-3.5 h-3.5 text-brand-teal-600 shrink-0" />
                        <span>{req.equipment}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{req.equipmentCategory}</span>
                    </td>

                    <td className="px-3 py-3.5 text-center">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-mono">
                        {req.quantity || 1}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-700">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
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
                          if (onSelectRequest) onSelectRequest(req.id);
                        }}
                        className="px-3 py-1.5 bg-brand-teal-50 hover:bg-brand-teal-600 text-brand-teal-700 hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-slate-400">
                    <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No new rental requests found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">New patient requests will appear here when submitted.</p>
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
