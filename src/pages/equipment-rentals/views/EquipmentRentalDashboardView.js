import React, { useState, useMemo } from 'react';
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
  AlertTriangle,
  Bell,
  Wallet,
  Check,
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function EquipmentRentalDashboardView({
  requests = [],
  vendors = [],
  onNavigateModule,
  onOpenRequest
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // ==========================================
  // 1. Dashboard 8 Required Summary Metrics (Section 3)
  // ==========================================
  const totalRequestsCount = requests.length;

  const pendingConfirmationCount = requests.filter((r) => {
    const s = (r.rentalStatus || r.status || '').toLowerCase();
    const c = (r.vendorConfirmationStatus || '').toLowerCase();
    return s.includes('awaiting vendor') || s.includes('new') || c.includes('awaiting');
  }).length;

  const confirmedRentalsCount = requests.filter((r) => {
    const s = (r.rentalStatus || r.status || '').toLowerCase();
    return s === 'confirmed';
  }).length;

  const awaitingDeliveryCount = requests.filter((r) => {
    const s = (r.rentalStatus || r.status || '').toLowerCase();
    const d = (r.deliveryStatus || '').toLowerCase();
    return s.includes('awaiting delivery') || d.includes('awaiting delivery');
  }).length;

  const activeRentalsCount = requests.filter((r) => {
    const s = (r.rentalStatus || r.status || '').toLowerCase();
    return s.includes('active') || s.includes('delivered');
  }).length;

  const completedRentalsCount = requests.filter((r) => {
    const s = (r.rentalStatus || r.status || '').toLowerCase();
    return s.includes('completed') || s.includes('returned');
  }).length;

  const cancelledRentalsCount = requests.filter((r) => {
    const s = (r.rentalStatus || r.status || '').toLowerCase();
    return s.includes('cancel');
  }).length;

  // Total Recorded Rental Value Calculation (with realization distinction)
  const financialTotals = useMemo(() => {
    let totalRecorded = 0;
    let completedValue = 0;
    let activeValue = 0;
    let pendingValue = 0;
    let depositsHeld = 0;

    requests.forEach((r) => {
      const isAgreed = r.isAmountAgreed && r.finalAgreedAmount !== null;
      const amount = Number(r.finalAgreedAmount) || 0;
      const s = (r.rentalStatus || r.status || '').toLowerCase();

      if (isAgreed) {
        totalRecorded += amount;
        depositsHeld += Number(r.refundableDeposit) || 0;

        if (s.includes('completed') || s.includes('returned')) {
          completedValue += amount;
        } else if (s.includes('active') || s.includes('delivered')) {
          activeValue += amount;
        } else if (!s.includes('cancel')) {
          pendingValue += amount;
        }
      }
    });

    return { totalRecorded, completedValue, activeValue, pendingValue, depositsHeld };
  }, [requests]);

  // ==========================================
  // 2. Section 9: Notifications & Attention Items
  // ==========================================
  const attentionItems = useMemo(() => {
    const items = [];

    requests.forEach((r) => {
      const s = (r.rentalStatus || r.status || '').toLowerCase();
      const c = (r.vendorConfirmationStatus || '').toLowerCase();
      const p = (r.paymentStatus || '').toLowerCase();
      const d = (r.deliveryStatus || '').toLowerCase();

      // 1. New rental requests
      if (s === 'new request' || s === 'new') {
        items.push({
          id: `new-${r.id}`,
          reqId: r.id,
          type: 'new_request',
          severity: 'info',
          title: `New Rental Request: ${r.id}`,
          message: `${r.patientName || r.patientId} requested ${r.equipment} from ${r.selectedVendor?.businessName || 'vendor'}.`,
          time: r.requestDate,
          actionLabel: 'View Request'
        });
      }

      // 2. Awaiting vendor confirmation
      if (c.includes('awaiting') || s === 'awaiting vendor confirmation') {
        items.push({
          id: `awaiting-conf-${r.id}`,
          reqId: r.id,
          type: 'awaiting_confirmation',
          severity: 'warning',
          title: `Awaiting Vendor Confirmation: ${r.id}`,
          message: `${r.selectedVendor?.businessName || 'Vendor'} has not yet confirmed the rental terms with patient.`,
          time: r.requestDate,
          actionLabel: 'Check Status'
        });
      }

      // 3. Agreed amounts not yet recorded
      if (!r.isAmountAgreed || r.finalAgreedAmount === null) {
        items.push({
          id: `price-missing-${r.id}`,
          reqId: r.id,
          type: 'amount_unrecorded',
          severity: 'warning',
          title: `Agreed Amount Not Recorded: ${r.id}`,
          message: `Negotiation in progress. Vendor must record base rent, delivery & refundable deposit.`,
          time: r.requestDate,
          actionLabel: 'Monitor Terms'
        });
      }

      // 4. Return or cancellation updates
      if (s === 'return requested') {
        items.push({
          id: `return-${r.id}`,
          reqId: r.id,
          type: 'return_requested',
          severity: 'info',
          title: `Equipment Return Requested: ${r.id}`,
          message: `Patient requested return pickup for ${r.equipment}. Vendor ${r.selectedVendor?.businessName} notified.`,
          time: r.expectedEndDate,
          actionLabel: 'View Return'
        });
      } else if (s === 'cancelled') {
        items.push({
          id: `cancel-${r.id}`,
          reqId: r.id,
          type: 'cancelled',
          severity: 'danger',
          title: `Rental Cancelled: ${r.id}`,
          message: `Rental request cancelled. Reason: ${r.internalNotes || 'Patient cancelled before delivery'}.`,
          time: r.lastUpdatedDate || r.requestDate,
          actionLabel: 'View Record'
        });
      }

      // 5. Payment updates needed
      if (r.isAmountAgreed && p === 'pending' && (s.includes('active') || s.includes('delivered'))) {
        items.push({
          id: `payment-pending-${r.id}`,
          reqId: r.id,
          type: 'payment_pending',
          severity: 'warning',
          title: `Payment Pending on Active Rental: ${r.id}`,
          message: `₹${Number(r.finalAgreedAmount).toLocaleString('en-IN')} pending collection by ${r.selectedVendor?.businessName}.`,
          time: r.rentalStartDate,
          actionLabel: 'View Payment'
        });
      }
    });

    return items;
  }, [requests]);

  // Filter requests for recent table
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        (req.id || '').toLowerCase().includes(q) ||
        (req.equipment || '').toLowerCase().includes(q) ||
        (req.patientName || req.patientId || '').toLowerCase().includes(q) ||
        (req.selectedVendor?.businessName || '').toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (activeTab === 'all') return true;
      const s = (req.rentalStatus || req.status || '').toLowerCase();
      if (activeTab === 'pending') return s.includes('awaiting') || s.includes('new');
      if (activeTab === 'confirmed') return s === 'confirmed';
      if (activeTab === 'active') return s.includes('active') || s.includes('delivered');
      if (activeTab === 'completed') return s.includes('completed');
      return true;
    });
  }, [requests, searchQuery, activeTab]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-teal-700 via-brand-teal-800 to-brand-navy-900 rounded-2xl p-6 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-teal-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>MediUnify Healthcare Administration</span>
          </div>
          <h1 className="text-2xl font-extrabold mt-1 tracking-tight">Equipment Rental Operations</h1>
          <p className="text-xs sm:text-sm text-brand-teal-100 mt-1 max-w-2xl leading-relaxed">
            Monitor patient-selected vendor rentals, track agreed rental amounts, payment, and delivery progression across all active medical equipment.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onNavigateModule('earnings')}
            className="px-4 py-2.5 bg-brand-navy-900/80 hover:bg-brand-navy-900 text-white font-bold text-xs rounded-xl border border-brand-teal-400/30 transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <TrendingUp className="w-4 h-4 text-brand-teal-300" />
            <span>Earnings & Values</span>
          </button>
          <button
            onClick={() => onNavigateModule('vendors')}
            className="px-4 py-2.5 bg-white text-brand-navy-900 hover:bg-brand-teal-50 font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4 text-brand-teal-700" />
            <span>Manage Vendors ({vendors.length})</span>
          </button>
          <button
            onClick={() => onNavigateModule('requests')}
            className="px-4 py-2.5 bg-brand-teal-800/90 hover:bg-brand-teal-800 text-white font-bold text-xs rounded-xl border border-brand-teal-500 transition-colors inline-flex items-center gap-1.5"
          >
            <ClipboardList className="w-4 h-4" />
            <span>All Requests ({totalRequestsCount})</span>
          </button>
        </div>
      </div>

      {/* Direct Patient-Selected Vendor Workflow Notice */}
      <div className="bg-brand-slate-50 border border-brand-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-brand-navy-900 block">
              Patient-Selected Vendor Workflow & Direct Terms
            </span>
            <span className="text-brand-slate-500 text-[11px] leading-relaxed">
              Patients select their preferred vendor directly in-app. The vendor negotiates pricing, deposit, and delivery with the patient and records the final agreed amount in the portal. Admin monitoring only — no manual vendor assignment.
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-green-50 text-brand-green-700 border border-brand-green-200 rounded-lg text-[11px] font-bold whitespace-nowrap self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5" /> Patient-Selected
        </span>
      </div>

      {/* ======================================================== */}
      {/* 8 Required Summary Cards (Section 3)                      */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Total Rental Requests */}
        <div
          onClick={() => onNavigateModule('requests')}
          className="bg-white p-3.5 rounded-2xl border border-brand-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-brand-teal-400"
        >
          <div className="flex items-center justify-between text-brand-slate-600 text-xs font-bold">
            <span className="truncate">Total Requests</span>
            <ClipboardList className="w-4 h-4 text-brand-slate-400 flex-shrink-0" />
          </div>
          <div className="text-2xl font-black text-brand-navy-900 mt-2 font-mono">
            {totalRequestsCount}
          </div>
          <p className="text-[10px] text-brand-slate-500 font-medium mt-1 truncate">All incoming</p>
        </div>

        {/* 2. Pending Confirmation */}
        <div
          onClick={() => onNavigateModule('requests')}
          className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-amber-50/20 hover:border-amber-400"
        >
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold">
            <span className="truncate">Pending Conf.</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
          </div>
          <div className="text-2xl font-black text-amber-900 mt-2 font-mono">
            {pendingConfirmationCount}
          </div>
          <p className="text-[10px] text-amber-600 font-medium mt-1 truncate">Direct terms open</p>
        </div>

        {/* 3. Confirmed Rentals */}
        <div
          onClick={() => onNavigateModule('requests')}
          className="bg-white p-3.5 rounded-2xl border border-blue-200 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-blue-50/20 hover:border-blue-400"
        >
          <div className="flex items-center justify-between text-blue-700 text-xs font-bold">
            <span className="truncate">Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
          </div>
          <div className="text-2xl font-black text-blue-900 mt-2 font-mono">
            {confirmedRentalsCount}
          </div>
          <p className="text-[10px] text-blue-600 font-medium mt-1 truncate">Terms agreed</p>
        </div>

        {/* 4. Awaiting Delivery */}
        <div
          onClick={() => onNavigateModule('requests')}
          className="bg-white p-3.5 rounded-2xl border border-indigo-200 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-indigo-50/20 hover:border-indigo-400"
        >
          <div className="flex items-center justify-between text-indigo-700 text-xs font-bold">
            <span className="truncate">Awaiting Delivery</span>
            <Truck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          </div>
          <div className="text-2xl font-black text-indigo-900 mt-2 font-mono">
            {awaitingDeliveryCount}
          </div>
          <p className="text-[10px] text-indigo-600 font-medium mt-1 truncate">Dispatch pending</p>
        </div>

        {/* 5. Active Rentals */}
        <div
          onClick={() => onNavigateModule('active-rentals')}
          className="bg-white p-3.5 rounded-2xl border border-brand-teal-200 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-teal-50/20 hover:border-brand-teal-500"
        >
          <div className="flex items-center justify-between text-brand-teal-700 text-xs font-bold">
            <span className="truncate">Active Rentals</span>
            <Truck className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
          </div>
          <div className="text-2xl font-black text-brand-teal-900 mt-2 font-mono">
            {activeRentalsCount}
          </div>
          <p className="text-[10px] text-brand-teal-600 font-medium mt-1 truncate">With patients</p>
        </div>

        {/* 6. Completed Rentals */}
        <div
          onClick={() => onNavigateModule('completed-rentals')}
          className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-emerald-50/20 hover:border-emerald-400"
        >
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold">
            <span className="truncate">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-2 font-mono">
            {completedRentalsCount}
          </div>
          <p className="text-[10px] text-emerald-600 font-medium mt-1 truncate">Returned & closed</p>
        </div>

        {/* 7. Cancelled Rentals */}
        <div
          onClick={() => onNavigateModule('requests')}
          className="bg-white p-3.5 rounded-2xl border border-rose-200 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-rose-50/20 hover:border-rose-400"
        >
          <div className="flex items-center justify-between text-rose-700 text-xs font-bold">
            <span className="truncate">Cancelled</span>
            <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          </div>
          <div className="text-2xl font-black text-rose-900 mt-2 font-mono">
            {cancelledRentalsCount}
          </div>
          <p className="text-[10px] text-rose-600 font-medium mt-1 truncate">Voided requests</p>
        </div>

        {/* 8. Total Recorded Rental Value (Featured Card with clear distinction) */}
        <div
          onClick={() => onNavigateModule('earnings')}
          className="bg-gradient-to-br from-brand-navy-900 to-brand-teal-950 text-white p-3.5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-brand-teal-300 text-xs font-bold">
            <span className="truncate">Recorded Value</span>
            <Wallet className="w-4 h-4 text-brand-teal-400 flex-shrink-0" />
          </div>
          <div className="text-xl font-black text-white mt-2 font-mono">
            ₹{financialTotals.totalRecorded.toLocaleString('en-IN')}
          </div>
          <div className="text-[9px] text-brand-teal-200/80 font-medium mt-1">
            Completed: ₹{financialTotals.completedValue.toLocaleString('en-IN')}
          </div>
          <div className="text-[9px] text-amber-200/80 font-medium">
            Active/Pend: ₹{(financialTotals.activeValue + financialTotals.pendingValue).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Section 9: Notifications & Exceptions Attention Panel      */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-brand-navy-900 tracking-tight flex items-center gap-2">
                Action Items & Notifications
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full font-mono">
                  {attentionItems.length}
                </span>
              </h2>
              <p className="text-xs text-brand-slate-500">
                Live monitoring alerts: unconfirmed requests, missing agreed prices, and rental lifecycle status updates
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateModule('requests')}
            className="text-xs font-bold text-brand-teal-700 hover:text-brand-teal-900 inline-flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {attentionItems.length === 0 ? (
          <div className="p-8 text-center bg-brand-slate-50 rounded-xl border border-dashed border-brand-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-brand-slate-700">All Operations Clear</p>
            <p className="text-xs text-brand-slate-500 mt-0.5">
              No outstanding requests awaiting confirmation or price recording at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {attentionItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenRequest && onOpenRequest(item.reqId)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer group hover:shadow-xs flex flex-col justify-between ${
                  item.severity === 'danger'
                    ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                    : item.severity === 'warning'
                    ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                    : 'bg-blue-50/50 border-blue-200 hover:border-blue-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        item.severity === 'danger'
                          ? 'bg-rose-100 text-rose-800'
                          : item.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-brand-slate-400 font-mono">{item.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-brand-navy-900 group-hover:text-brand-teal-700 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-brand-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-brand-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-brand-slate-500 font-bold">{item.reqId}</span>
                  <span className="font-bold text-brand-teal-700 inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    {item.actionLabel}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* Recent Monitored Rental Requests Table                    */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-brand-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-brand-navy-900 tracking-tight flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-brand-teal-700" />
              Patient Rental Requests & Monitored Terms
            </h2>
            <p className="text-xs text-brand-slate-500 mt-0.5">
              Live patient equipment inquiries showing selected vendor, agreed rental terms, and delivery progression
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, equipment, vendor..."
                className="pl-9 pr-3 py-1.5 text-xs bg-brand-slate-50 border border-brand-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:bg-white w-48 sm:w-64"
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

        {/* Table matching Columns: Request ID | Patient | Equipment | Selected Vendor | Agreed Rental Price | Delivery Status | Rental Status | Action */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-600">
            <thead className="bg-brand-slate-50/80 text-[11px] font-bold text-brand-slate-700 uppercase tracking-wider border-b border-brand-slate-200">
              <tr>
                <th className="px-4 py-3">Request ID</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Equipment</th>
                <th className="px-4 py-3">Selected Vendor</th>
                <th className="px-4 py-3 text-right">Agreed Rental Price</th>
                <th className="px-4 py-3 text-center">Delivery Status</th>
                <th className="px-4 py-3 text-center">Rental Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredRequests.slice(0, 8).map((req) => {
                const isAgreed = req.isAmountAgreed && req.finalAgreedAmount !== null;

                return (
                  <tr
                    key={req.id}
                    onClick={() => onOpenRequest && onOpenRequest(req.id)}
                    className="hover:bg-brand-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-brand-navy-900 whitespace-nowrap">
                      {req.id}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-brand-navy-900">
                        {req.patientName || 'Anonymous Patient'}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-brand-navy-900 flex items-center gap-1.5 group-hover:text-brand-teal-700 transition-colors">
                        <Package className="w-3.5 h-3.5 text-brand-teal-600 flex-shrink-0" />
                        <span>{req.equipment}</span>
                      </div>
                      <span className="text-[10px] text-brand-slate-400">
                        {req.equipmentCategory} (Qty: {req.quantity || 1})
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-brand-navy-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-brand-teal-600 flex-shrink-0" />
                        <span>{req.selectedVendor?.businessName || '—'}</span>
                      </div>
                      <div className="text-[10px] text-brand-slate-400 font-mono">
                        {req.selectedVendor?.id}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono whitespace-nowrap">
                      {isAgreed ? (
                        <div>
                          <span className="font-extrabold text-sm text-brand-navy-900">
                            ₹{Number(req.finalAgreedAmount).toLocaleString('en-IN')}
                          </span>
                          {req.refundableDeposit > 0 && (
                            <div className="text-[9px] text-purple-700 font-sans">
                              +₹{req.refundableDeposit} dep
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-bold">
                          <Clock className="w-3 h-3" /> Awaiting Confirmation
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-200">
                        <Truck className="w-3 h-3" />
                        {req.deliveryStatus || 'Pending'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <StatusBadge status={req.rentalStatus || req.status} size="xs" />
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
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
