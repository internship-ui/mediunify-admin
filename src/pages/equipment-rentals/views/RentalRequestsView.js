import React, { useState, useMemo } from 'react';
import {
  Inbox,
  Search,
  Eye,
  Calendar,
  Package,
  CheckCircle2,
  Clock,
  Filter,
  X,
  Building2,
  AlertCircle,
  Truck,
  IndianRupee,
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';
import RequestDetails from '../components/RequestDetails';
import { EQUIPMENT_CATEGORIES } from '../../../data/equipmentRentalData';

export default function RentalRequestsView({
  requests = [],
  selectedRequestId,
  onSelectRequest
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [vendorFilter, setVendorFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

  const activeDetail = selectedRequestId
    ? requests.find((r) => r.id === selectedRequestId)
    : null;

  // Extract unique vendors for vendor filter dropdown
  const uniqueVendors = useMemo(() => {
    const set = new Set();
    requests.forEach((r) => {
      const vName = r.selectedVendor?.businessName || r.assignedVendor;
      if (vName) set.add(vName);
    });
    return Array.from(set);
  }, [requests]);

  // Filtered & sorted requests
  const filteredRequests = useMemo(() => {
    return requests
      .filter((req) => {
        // Status filter
        const rStatus = req.rentalStatus || req.status || '';
        const matchesStatus =
          statusFilter === 'All' || rStatus.toLowerCase() === statusFilter.toLowerCase();

        // Payment status filter
        const pStatus = req.paymentStatus || 'Awaiting Update';
        const matchesPayment =
          paymentFilter === 'All' || pStatus.toLowerCase() === paymentFilter.toLowerCase();

        // Vendor filter
        const vName = req.selectedVendor?.businessName || req.assignedVendor || '';
        const matchesVendor =
          vendorFilter === 'All' || vName.toLowerCase() === vendorFilter.toLowerCase();

        // Category filter
        const cat = req.equipmentCategory || '';
        const matchesCategory =
          categoryFilter === 'All' || cat.toLowerCase() === categoryFilter.toLowerCase();

        // Search query
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          (req.id || '').toLowerCase().includes(q) ||
          (req.patientName || '').toLowerCase().includes(q) ||
          (req.equipment || '').toLowerCase().includes(q) ||
          vName.toLowerCase().includes(q) ||
          (req.patientLocation || '').toLowerCase().includes(q);

        return matchesStatus && matchesPayment && matchesVendor && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'amount-desc') {
          return (b.finalAgreedAmount || 0) - (a.finalAgreedAmount || 0);
        }
        if (sortBy === 'amount-asc') {
          return (a.finalAgreedAmount || 0) - (b.finalAgreedAmount || 0);
        }
        if (sortBy === 'date-asc') {
          return (a.id || '').localeCompare(b.id || '');
        }
        return (b.id || '').localeCompare(a.id || '');
      });
  }, [requests, statusFilter, paymentFilter, vendorFilter, categoryFilter, searchQuery, sortBy]);

  if (activeDetail) {
    return (
      <RequestDetails
        request={activeDetail}
        onBack={() => onSelectRequest && onSelectRequest(null)}
      />
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered / Active Rental':
      case 'Confirmed':
      case 'Completed / Returned':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Awaiting Delivery':
      case 'Awaiting Vendor Confirmation':
      case 'New Request':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Partially Paid':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-navy-900 tracking-tight flex items-center gap-2.5">
            <Inbox className="w-7 h-7 text-brand-teal-700" />
            Equipment Rental Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor patient rental requests, selected vendors, recorded agreed amounts, payment, and delivery status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            Showing <strong className="text-brand-navy-900">{filteredRequests.length}</strong> of {requests.length} Requests
          </span>
        </div>
      </div>

      {/* Workflow Guidance Notice */}
      <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-teal-950">
          <Building2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>
            <strong>Patient-Selected Vendor Workflow:</strong> Patients select their preferred vendor directly in the app. The vendor discusses availability, delivery, and rates directly with the patient and records the final agreed amount.
          </span>
        </div>
        <span className="text-[11px] font-bold text-teal-800 bg-white px-2.5 py-0.5 rounded-md border border-teal-200 whitespace-nowrap">
          No Admin Assignment Needed
        </span>
      </div>

      {/* Comprehensive Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Request ID, patient name, equipment, or vendor..."
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

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            >
              <option value="date-desc">Newest Requests First</option>
              <option value="date-asc">Oldest Requests First</option>
              <option value="amount-desc">Agreed Amount (High to Low)</option>
              <option value="amount-asc">Agreed Amount (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
          {/* Request Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            >
              <option value="All">All Statuses</option>
              <option value="New Request">New Request</option>
              <option value="Awaiting Vendor Confirmation">Awaiting Confirmation</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Awaiting Delivery">Awaiting Delivery</option>
              <option value="Delivered / Active Rental">Active Rental</option>
              <option value="Completed / Returned">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Awaiting Update">Awaiting Update</option>
            </select>
          </div>

          {/* Vendor Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Vendor:</span>
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 max-w-[180px]"
            >
              <option value="All">All Vendors</option>
              {uniqueVendors.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Equipment Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 max-w-[160px]"
            >
              <option value="All">All Categories</option>
              {EQUIPMENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {(statusFilter !== 'All' ||
            paymentFilter !== 'All' ||
            vendorFilter !== 'All' ||
            categoryFilter !== 'All' ||
            searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('All');
                setPaymentFilter('All');
                setVendorFilter('All');
                setCategoryFilter('All');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-brand-teal-700 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Rental Requests Table (Section 5 Requirements) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/90 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Request ID</th>
                <th className="px-4 py-3.5">Request Date</th>
                <th className="px-4 py-3.5">Patient Name</th>
                <th className="px-4 py-3.5">Selected Vendor</th>
                <th className="px-4 py-3.5">Equipment & Qty</th>
                <th className="px-4 py-3.5">Rental Dates</th>
                <th className="px-4 py-3.5 text-right">Agreed Price</th>
                <th className="px-4 py-3.5 text-right">Delivery</th>
                <th className="px-4 py-3.5 text-right">Deposit</th>
                <th className="px-4 py-3.5 text-right">Total Amount</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5">Confirmation</th>
                <th className="px-4 py-3.5">Delivery Status</th>
                <th className="px-4 py-3.5">Rental Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => {
                  const isAgreed = req.isAmountAgreed && req.finalAgreedAmount !== null;
                  const vName = req.selectedVendor?.businessName || req.assignedVendor || 'Partner Vendor';
                  const rStatus = req.rentalStatus || req.status || 'New Request';

                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectRequest && onSelectRequest(req.id)}
                    >
                      {/* Request ID */}
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {req.id}
                      </td>

                      {/* Request Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 text-[11px]">
                        {req.requestDate}
                      </td>

                      {/* Patient Name - only patient name */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-bold text-brand-navy-950 group-hover:text-brand-teal-700 transition-colors">
                          {req.patientName}
                        </div>
                      </td>

                      {/* Selected Vendor (Pre-selected by patient) */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-brand-teal-600 shrink-0" />
                          <span>{vName}</span>
                        </div>
                      </td>

                      {/* Equipment & Quantity */}
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <div className="font-semibold text-brand-navy-900 leading-snug">
                          {req.equipment}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {req.equipmentCategory} • <strong>{req.quantity || 1} Unit</strong>
                        </div>
                      </td>

                      {/* Rental Dates */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-medium text-slate-800 text-[11px]">
                          {req.rentalStartDate} – {req.rentalEndDate}
                        </div>
                        <div className="text-[10px] text-brand-teal-700 font-semibold">
                          {req.rentalDuration || `${req.rentalDurationDays || 7} Days`}
                        </div>
                      </td>

                      {/* Agreed Rental Price (Section 6: Amount Awaiting Confirmation if not entered) */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {isAgreed ? (
                          <span className="font-mono font-bold text-slate-900">
                            ₹{req.baseRentalPrice?.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Amount Awaiting Confirmation
                          </span>
                        )}
                      </td>

                      {/* Delivery Charge */}
                      <td className="px-4 py-3.5 text-right font-mono whitespace-nowrap">
                        {isAgreed ? `₹${req.deliveryCharges?.toLocaleString() || 0}` : '—'}
                      </td>

                      {/* Refundable Security Deposit */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {isAgreed && req.refundableDeposit ? (
                          <span className="font-mono text-amber-900 font-semibold" title="Held separately; not rental revenue">
                            ₹{req.refundableDeposit.toLocaleString()}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>

                      {/* Total Agreed Amount */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {isAgreed ? (
                          <span className="font-mono font-black text-brand-teal-800 text-sm">
                            ₹{req.finalAgreedAmount?.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Pending</span>
                        )}
                      </td>

                      {/* Payment Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getPaymentBadge(
                            req.paymentStatus || 'Awaiting Update'
                          )}`}
                        >
                          {req.paymentStatus || 'Awaiting Update'}
                        </span>
                      </td>

                      {/* Vendor Confirmation Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-[11px] font-semibold text-slate-700">
                          {req.vendorConfirmationStatus || 'In Discussion'}
                        </span>
                      </td>

                      {/* Delivery Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700">
                          <Truck className="w-3 h-3 text-brand-teal-600" />
                          <span>{req.deliveryStatus || 'Not Dispatched'}</span>
                        </span>
                      </td>

                      {/* Rental Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(
                            rStatus
                          )}`}
                        >
                          {rStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3.5 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectRequest && onSelectRequest(req.id)}
                          className="px-2.5 py-1.5 bg-brand-teal-50 hover:bg-brand-teal-600 text-brand-teal-700 hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="15" className="px-4 py-12 text-center text-slate-400">
                    <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No rental requests match current filters</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Adjust filter criteria to view all requests</p>
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
