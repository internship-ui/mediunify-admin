import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  DollarSign,
  UserCheck,
  Phone,
  Send,
  Eye,
  ChevronDown,
  Sparkles,
  Inbox,
  CheckCircle,
  Activity,
  UserX,
  Plus
} from 'lucide-react';
import RequestDetailsModal from '../components/RequestDetailsModal';

export default function HomeCareRequestsView({
  requests = [],
  nurses = [],
  serviceTypes = [],
  selectedRequestId = null,
  onSelectRequest,
  onCallPatient,
  onSendPaymentLink,
  onSimulatePayment,
  onBroadcastNurses,
  onSimulateNurseAccept,
  onStartService,
  onCompleteService,
  onCancelRequest,
  initialStatusFilter = 'All'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState(initialStatusFilter || 'All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [activeModalRequestId, setActiveModalRequestId] = useState(selectedRequestId || null);

  // Status Filter Tabs
  const STATUS_TABS = [
    { id: 'All', label: 'All Requests', count: requests.length },
    { id: 'New Request', label: 'New Requests', count: requests.filter((r) => r.overallStatus === 'New Request').length },
    { id: 'Payment Pending', label: 'Payment Pending', count: requests.filter((r) => r.paymentStatus === 'Pending' || r.paymentStatus === 'Link Sent').length },
    { id: 'Payment Completed', label: 'Paid / Auto-Match', count: requests.filter((r) => r.overallStatus === 'Payment Completed' || r.overallStatus === 'Nurses Notified').length },
    { id: 'Nurse Assigned', label: 'Nurse Assigned', count: requests.filter((r) => r.overallStatus === 'Nurse Accepted' || r.assignedNurse).length },
    { id: 'Service In Progress', label: 'In Progress', count: requests.filter((r) => r.overallStatus === 'Service In Progress').length },
    { id: 'Completed', label: 'Completed', count: requests.filter((r) => r.overallStatus === 'Completed').length },
    { id: 'Cancelled', label: 'Cancelled', count: requests.filter((r) => r.overallStatus === 'Cancelled').length }
  ];

  // Filtering & Sorting Logic
  const filteredRequests = useMemo(() => {
    return requests
      .filter((req) => {
        // Search
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          !searchTerm ||
          req.id.toLowerCase().includes(searchLower) ||
          req.patientName.toLowerCase().includes(searchLower) ||
          req.serviceRequired.toLowerCase().includes(searchLower) ||
          req.locality.toLowerCase().includes(searchLower) ||
          req.address.toLowerCase().includes(searchLower);

        // Status Tab
        let matchesStatus = true;
        if (statusTab === 'New Request') matchesStatus = req.overallStatus === 'New Request';
        else if (statusTab === 'Payment Pending') matchesStatus = req.paymentStatus === 'Pending' || req.paymentStatus === 'Link Sent';
        else if (statusTab === 'Payment Completed') matchesStatus = req.overallStatus === 'Payment Completed' || req.overallStatus === 'Nurses Notified';
        else if (statusTab === 'Nurse Assigned') matchesStatus = req.overallStatus === 'Nurse Accepted' || (req.assignedNurse && req.overallStatus !== 'Completed' && req.overallStatus !== 'Cancelled');
        else if (statusTab === 'Service In Progress') matchesStatus = req.overallStatus === 'Service In Progress';
        else if (statusTab === 'Completed') matchesStatus = req.overallStatus === 'Completed';
        else if (statusTab === 'Cancelled') matchesStatus = req.overallStatus === 'Cancelled';

        // Service Filter
        const matchesService = serviceFilter === 'All' || req.serviceRequired === serviceFilter;

        // Payment Filter
        const matchesPayment = paymentFilter === 'All' || req.paymentStatus === paymentFilter;

        return matchesSearch && matchesStatus && matchesService && matchesPayment;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return b.id.localeCompare(a.id);
        if (sortBy === 'date-asc') return a.id.localeCompare(b.id);
        if (sortBy === 'amount-high') return (b.serviceAmount || 0) - (a.serviceAmount || 0);
        if (sortBy === 'amount-low') return (a.serviceAmount || 0) - (b.serviceAmount || 0);
        return 0;
      });
  }, [requests, searchTerm, statusTab, serviceFilter, paymentFilter, sortBy]);

  const activeModalRequest = requests.find((r) => r.id === (activeModalRequestId || selectedRequestId));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-slate-900 tracking-tight flex items-center gap-2">
            <Inbox className="w-6 h-6 text-brand-teal-600" />
            Home Care & Nursing Requests
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
            Monitor, confirm with patient, send payment links, and track automatic nurse assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-brand-teal-50 border border-brand-teal-200 text-brand-teal-800 text-xs font-semibold">
            {filteredRequests.length} of {requests.length} Requests
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-brand-slate-200">
        {STATUS_TABS.map((tab) => {
          const isActive = statusTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-brand-teal-600 text-white shadow-sm'
                  : 'bg-white text-brand-slate-600 hover:bg-brand-slate-100 hover:text-brand-slate-900 border border-brand-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-brand-slate-100 text-brand-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Search */}
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Patient Name, ID, Service, Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-brand-slate-200 bg-brand-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-teal-500 focus:ring-1 focus:ring-brand-teal-500"
          />
        </div>

        {/* Service Type Filter */}
        <div className="lg:col-span-3">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-brand-slate-200 bg-brand-slate-50 text-brand-slate-700 focus:outline-hidden focus:border-brand-teal-500 cursor-pointer"
          >
            <option value="All">All Service Types</option>
            {serviceTypes.map((srv) => (
              <option key={srv.id} value={srv.name}>
                {srv.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Filter */}
        <div className="lg:col-span-2">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-brand-slate-200 bg-brand-slate-50 text-brand-slate-700 focus:outline-hidden focus:border-brand-teal-500 cursor-pointer"
          >
            <option value="All">All Payments</option>
            <option value="Pending">Pending</option>
            <option value="Link Sent">Link Sent</option>
            <option value="Completed">Paid / Completed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="lg:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-brand-slate-200 bg-brand-slate-50 text-brand-slate-700 focus:outline-hidden focus:border-brand-teal-500 cursor-pointer"
          >
            <option value="date-desc">Newest Requests First</option>
            <option value="date-asc">Oldest Requests First</option>
            <option value="amount-high">Amount (Highest First)</option>
            <option value="amount-low">Amount (Lowest First)</option>
          </select>
        </div>
      </div>

      {/* Requests Table (Desktop / Tablet) & Cards (Mobile) */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="py-16 text-center text-brand-slate-500">
            <Inbox className="w-12 h-12 text-brand-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-brand-slate-700">No care requests found</h3>
            <p className="text-xs text-brand-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms, status tab, or service filters.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-slate-50/80 border-b border-brand-slate-200 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500">
                    <th className="py-3.5 px-4">Request ID</th>
                    <th className="py-3.5 px-4">Patient Name</th>
                    <th className="py-3.5 px-4">Service Required</th>
                    <th className="py-3.5 px-4">Requested Date & Time</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Nurse Status</th>
                    <th className="py-3.5 px-4">Overall Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100 text-xs">
                  {filteredRequests.map((req) => (
                    <tr
                      key={req.id}
                      onClick={() => {
                        setActiveModalRequestId(req.id);
                        if (onSelectRequest) onSelectRequest(req.id);
                      }}
                      className="hover:bg-brand-teal-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Request ID */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-brand-teal-700 bg-brand-teal-50 px-2 py-1 rounded border border-brand-teal-200/70">
                          {req.id}
                        </span>
                      </td>

                      {/* Patient Name */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-brand-slate-900 group-hover:text-brand-teal-800 block">
                          {req.patientName}
                        </span>
                        <span className="text-[11px] text-brand-slate-500">{req.patientPhone}</span>
                      </td>

                      {/* Service */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-brand-slate-800 bg-brand-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {req.serviceRequired}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-brand-slate-800 block">{req.requestedDate}</span>
                        <span className="text-[11px] text-brand-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-slate-400" />
                          {req.requestedTime}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-brand-slate-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-slate-400" />
                          {req.locality}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            req.paymentStatus === 'Completed'
                              ? 'bg-brand-green-100 text-brand-green-800'
                              : req.paymentStatus === 'Link Sent'
                              ? 'bg-brand-aqua-100 text-brand-aqua-800'
                              : req.paymentStatus === 'Refunded'
                              ? 'bg-brand-coral-100 text-brand-coral-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.paymentStatus} (₹{req.serviceAmount})
                        </span>
                      </td>

                      {/* Nurse Status */}
                      <td className="py-3.5 px-4">
                        {req.assignedNurse ? (
                          <div>
                            <span className="font-bold text-brand-teal-800 text-[11px] block">
                              {req.assignedNurse.nurseName}
                            </span>
                            <span className="text-[10px] text-brand-slate-500">
                              {req.assignedNurse.distanceKm} km away
                            </span>
                          </div>
                        ) : req.nursesNotified && req.nursesNotified.length > 0 ? (
                          <span className="text-[11px] font-semibold text-brand-aqua-700 bg-brand-aqua-50 px-2 py-0.5 rounded border border-brand-aqua-200">
                            {req.nursesNotified.length} Notified
                          </span>
                        ) : (
                          <span className="text-[11px] text-brand-slate-400 italic">Not Assigned</span>
                        )}
                      </td>

                      {/* Overall Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                            req.overallStatus === 'Completed'
                              ? 'bg-brand-green-50 text-brand-green-700 border-brand-green-200'
                              : req.overallStatus === 'Cancelled'
                              ? 'bg-brand-coral-50 text-brand-coral-700 border-brand-coral-200'
                              : req.overallStatus === 'New Request'
                              ? 'bg-brand-coral-50 text-brand-coral-700 border-brand-coral-200'
                              : req.overallStatus === 'Patient Contacted'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-brand-teal-50 text-brand-teal-700 border-brand-teal-200'
                          }`}
                        >
                          {req.overallStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalRequestId(req.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-brand-teal-600 hover:text-white text-brand-teal-700 font-semibold text-xs border border-brand-teal-200 transition-colors inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Small Screen Card Grid */}
            <div className="md:hidden divide-y divide-brand-slate-100 p-3 space-y-3">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setActiveModalRequestId(req.id)}
                  className="bg-brand-slate-50/70 p-4 rounded-xl border border-brand-slate-200 space-y-2 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                      {req.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        req.overallStatus === 'Completed'
                          ? 'bg-brand-green-100 text-brand-green-800'
                          : req.overallStatus === 'New Request'
                          ? 'bg-brand-coral-100 text-brand-coral-800'
                          : 'bg-brand-teal-100 text-brand-teal-800'
                      }`}
                    >
                      {req.overallStatus}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-brand-slate-900">{req.patientName}</h3>
                    <p className="text-xs text-brand-teal-700 font-semibold">{req.serviceRequired}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-brand-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-slate-400" />
                      {req.requestedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-slate-400" />
                      {req.requestedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-slate-400" />
                      {req.locality}
                    </span>
                    <span className="font-bold text-brand-slate-900">₹{req.serviceAmount}</span>
                  </div>

                  <div className="pt-2 border-t border-brand-slate-200 flex items-center justify-between text-xs">
                    <span className="text-brand-slate-500">
                      Nurse: <strong>{req.assignedNurse?.nurseName || (req.nursesNotified?.length ? `${req.nursesNotified.length} Notified` : 'Not Assigned')}</strong>
                    </span>
                    <span className="text-brand-teal-700 font-bold flex items-center gap-1">
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Request Details Modal */}
      {activeModalRequest && (
        <RequestDetailsModal
          request={activeModalRequest}
          nurses={nurses}
          onClose={() => {
            setActiveModalRequestId(null);
            if (onSelectRequest) onSelectRequest(null);
          }}
          onCallPatient={onCallPatient}
          onSendPaymentLink={onSendPaymentLink}
          onSimulatePayment={onSimulatePayment}
          onBroadcastNurses={onBroadcastNurses}
          onSimulateNurseAccept={onSimulateNurseAccept}
          onStartService={onStartService}
          onCompleteService={onCompleteService}
          onCancelRequest={onCancelRequest}
        />
      )}
    </div>
  );
}
