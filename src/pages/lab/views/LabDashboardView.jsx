import React, { useState, useMemo } from 'react';
import {
  CalendarCheck2,
  Users,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle,
  Home,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  UserCheck,
  Building2,
  ShieldCheck,
  Send,
  Eye,
  Activity,
  MapPin,
  Sparkles,
  Search,
  TestTube2,
  Pipette,
  Upload,
  ArrowUpRight
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function LabDashboardView({
  orders = [],
  samples = [],
  reports = [],
  staff = [],
  tests = [],
  packages = [],
  onNavigateToModule,
  onOpenOrderDetails,
  onVerifyOrder,
  onScheduleCollection,
  onUploadReport,
  onSendToPatient,
  onVerifyReport,
  onPreviewReport
}) {
  const [dateRange, setDateRange] = useState('Today');

  // Filter orders based on date range
  const filteredOrders = useMemo(() => {
    if (dateRange === 'Today') {
      return orders.filter((o) => o.bookingDate?.startsWith('2026-10-01') || o.collection?.scheduledDate?.includes('Oct') || o.preferredDate?.includes('Oct'));
    }
    return orders;
  }, [orders, dateRange]);

  // Operational metrics calculated from actual state
  const metrics = useMemo(() => {
    const total = orders.length;
    const newOrd = orders.filter((o) => o.orderStatus === 'NEW' || o.orderStatus === 'BOOKED').length;
    const pendingVer = orders.filter((o) => o.orderStatus === 'PENDING VERIFICATION' || o.orderStatus === 'NEW').length;
    const verified = orders.filter((o) => o.orderStatus === 'VERIFIED' || o.orderStatus === 'ADMIN VERIFIED').length;
    const collectorsAssigned = orders.filter((o) => o.orderStatus === 'COLLECTOR ASSIGNED' || o.orderStatus === 'COLLECTION SCHEDULED' || o.orderStatus === 'COLLECTOR ACCEPTED' || o.orderStatus === 'ON THE WAY').length;
    const sampleColl = orders.filter((o) => o.orderStatus === 'SAMPLE COLLECTED' || o.sampleDetails?.status === 'COLLECTED').length;
    const sampleRec = orders.filter((o) => o.orderStatus === 'SAMPLE RECEIVED' || o.orderStatus === 'RECEIVED' || o.sampleDetails?.status === 'RECEIVED').length;
    const repPend = orders.filter((o) => o.orderStatus === 'REPORT PENDING' || o.orderStatus === 'PROCESSING').length;
    const repReady = orders.filter((o) => o.orderStatus === 'REPORT UPLOADED' || o.orderStatus === 'REPORT READY' || o.orderStatus === 'REPORT VERIFIED').length;
    const comp = orders.filter((o) => o.orderStatus === 'COMPLETED' || o.orderStatus === 'REPORT DELIVERED').length;

    const totalRevenue = orders
      .filter((o) => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + (o.totalAmount || o.bookedItem?.price || 0), 0);

    return {
      total,
      newOrd,
      pendingVer,
      verified,
      collectorsAssigned,
      sampleColl,
      sampleRec,
      repPend,
      repReady,
      comp,
      totalRevenue
    };
  }, [orders]);

  // Render direct primary step action for recent requests
  const renderPrimaryAction = (order) => {
    const status = order.orderStatus?.toUpperCase();
    const isHome = (order.collection?.method || order.bookingType) === 'Home Sample Collection';

    if (status === 'NEW' || status === 'BOOKED') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVerifyOrder ? onVerifyOrder(order) : onOpenOrderDetails(order);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verify</span>
        </button>
      );
    }

    if (status === 'VERIFIED' || status === 'ADMIN VERIFIED' || status === 'PENDING VERIFICATION') {
      if (isHome) {
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onScheduleCollection ? onScheduleCollection(order) : onOpenOrderDetails(order);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Assign Phleb</span>
          </button>
        );
      }
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenOrderDetails(order);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-navy-900 font-bold text-xs rounded-xl border border-brand-slate-300 transition-colors cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5 text-brand-teal-700" />
          <span>Centre Visit</span>
        </button>
      );
    }

    if (status === 'COLLECTOR ASSIGNED' || status === 'COLLECTION SCHEDULED' || status === 'ON THE WAY') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 font-bold text-xs rounded-xl border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>On The Way</span>
        </span>
      );
    }

    if (status === 'SAMPLE COLLECTED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-800 font-bold text-xs rounded-xl border border-indigo-200">
          <Building2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>In Transit to Lab</span>
        </span>
      );
    }

    if (status === 'SAMPLE RECEIVED' || status === 'REPORT PENDING' || status === 'PROCESSING') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onUploadReport) {
              onUploadReport(order);
            } else {
              onOpenOrderDetails(order);
            }
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          title="Upload ready report received from testing center"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Ready Report</span>
        </button>
      );
    }

    if (status === 'REPORT UPLOADED' || status === 'REPORT READY' || status === 'REPORT VERIFIED' || status === 'VERIFIED REPORT') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onSendToPatient) {
              onSendToPatient(order.orderId);
            } else if (onPreviewReport) {
              onPreviewReport(order);
            } else {
              onOpenOrderDetails(order);
            }
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          title="Send ready report to patient via WhatsApp & Email"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send to Patient</span>
        </button>
      );
    }

    if (status === 'REPORT VERIFIED' || status === 'COMPLETED' || status === 'REPORT DELIVERED') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreviewReport(order);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-teal-50 hover:bg-brand-teal-100 text-brand-teal-800 border border-brand-teal-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-brand-teal-600" />
          <span>View Report</span>
        </button>
      );
    }

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenOrderDetails(order);
        }}
        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
      >
        <Eye className="w-3.5 h-3.5 text-brand-slate-400" />
        <span>Details</span>
      </button>
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Top Greeting Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
            MediUnify Diagnostic Operations
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-brand-navy-900 tracking-tight mt-1">
            Good Morning, Lab Admin
          </h1>
          <p className="text-xs text-brand-slate-500 mt-0.5">
            Manage laboratory requests, sample collection, testing and patient reports from one place.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1 bg-brand-slate-100 p-1 rounded-xl text-xs font-semibold">
          {['Today', 'Yesterday', 'Last 7 Days', 'All Time'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                dateRange === range
                  ? 'bg-white text-brand-teal-800 shadow-xs font-bold'
                  : 'text-brand-slate-600 hover:text-brand-slate-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Clean Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Requests */}
        <div
          onClick={() => onNavigateToModule('orders', 'ALL')}
          className="bg-white p-5 rounded-2xl border border-brand-slate-200/80 shadow-xs hover:border-brand-teal-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-brand-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-slate-400">Total Requests</span>
            <div className="p-2 rounded-xl bg-brand-teal-50 text-brand-teal-700 group-hover:bg-brand-teal-600 group-hover:text-white transition-colors">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-brand-navy-900">{metrics.total}</p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-brand-teal-700 font-bold">{metrics.newOrd} New</span>
            <span className="text-brand-slate-500 font-medium">₹{metrics.totalRevenue.toLocaleString()} Revenue</span>
          </div>
        </div>

        {/* Card 2: Pending Verification */}
        <div
          onClick={() => onNavigateToModule('orders', 'NEW')}
          className="bg-white p-5 rounded-2xl border border-brand-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-brand-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-slate-400">Pending Verification</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-brand-navy-900">{metrics.newOrd}</p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-blue-700 font-bold">Action Required</span>
            <span className="text-brand-slate-400">{metrics.verified} Verified</span>
          </div>
        </div>

        {/* Card 3: Sample Collections */}
        <div
          onClick={() => onNavigateToModule('orders', 'COLLECTOR ASSIGNED')}
          className="bg-white p-5 rounded-2xl border border-brand-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-brand-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-slate-400">Sample Tracking</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Pipette className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-brand-navy-900">{metrics.collectorsAssigned + metrics.sampleColl}</p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-amber-700 font-bold">{metrics.sampleColl} Collected</span>
            <span className="text-brand-slate-400">{metrics.sampleRec} Received</span>
          </div>
        </div>

        {/* Card 4: Reports Ready & Completed */}
        <div
          onClick={() => onNavigateToModule('orders', 'REPORT UPLOADED')}
          className="bg-white p-5 rounded-2xl border border-brand-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-brand-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-slate-400">Reports Status</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-brand-navy-900">{metrics.repReady + metrics.comp}</p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold">{metrics.repReady} Ready</span>
            <span className="text-brand-slate-400">{metrics.comp} Delivered</span>
          </div>
        </div>

      </div>

      {/* Smooth Linear Workflow Pipeline Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-brand-navy-900 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-brand-teal-600" />
            Live Request Progression Pipeline
          </span>
          <span className="text-[11px] text-brand-slate-400 font-medium">Click any stage to filter</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
          {[
            { id: 'NEW', label: '1. New Requests', count: metrics.newOrd, color: 'text-blue-700 bg-blue-50 border-blue-200' },
            { id: 'ADMIN VERIFIED', label: '2. Verified', count: metrics.verified, color: 'text-teal-700 bg-teal-50 border-teal-200' },
            { id: 'COLLECTOR ASSIGNED', label: '3. Phleb Assigned', count: metrics.collectorsAssigned, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
            { id: 'SAMPLE COLLECTED', label: '4. Sample Collected', count: metrics.sampleColl, color: 'text-amber-700 bg-amber-50 border-amber-200' },
            { id: 'SAMPLE RECEIVED', label: '5. Received at Lab', count: metrics.sampleRec + metrics.repPend, color: 'text-purple-700 bg-purple-50 border-purple-200' },
            { id: 'REPORT UPLOADED', label: '6. Ready Reports', count: metrics.repReady + metrics.comp, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => onNavigateToModule('orders', st.id)}
              className={`p-2.5 rounded-xl border ${st.color} hover:opacity-90 transition-all flex flex-col items-center justify-center cursor-pointer`}
            >
              <span className="text-[11px] font-bold truncate">{st.label}</span>
              <span className="text-base font-black mt-0.5">{st.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Laboratory Requests Table (Section 4 Requirement) */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-brand-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-brand-navy-900">
              Recent Laboratory Requests
            </h2>
            <p className="text-xs text-brand-slate-500">
              Latest diagnostic bookings across Home Collection and Lab Centres.
            </p>
          </div>

          <button
            onClick={() => onNavigateToModule('orders', 'ALL')}
            className="flex items-center gap-1 text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800 bg-brand-teal-50 hover:bg-brand-teal-100 px-3 py-1.5 rounded-xl border border-brand-teal-200 transition-colors cursor-pointer"
          >
            <span>View All Requests</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-brand-slate-50 text-brand-slate-700 font-bold border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-3.5">Request ID</th>
                <th className="py-3 px-3">Patient</th>
                <th className="py-3 px-3">Test / Package</th>
                <th className="py-3 px-3">Collection</th>
                <th className="py-3 px-3">Lab Centre</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-center">Payment</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {orders.slice(0, 6).map((order) => {
                const bookedName = order.bookedItem?.name || order.testOrPackage?.name || 'Diagnostic Panel';
                const method = order.collection?.method || order.bookingType || 'Home Collection';
                const isHome = method === 'Home Sample Collection';
                const labCenter = order.collection?.center || order.center || 'Nova Diagnostics & Laboratory Centre';

                return (
                  <tr
                    key={order.orderId}
                    onClick={() => onOpenOrderDetails(order)}
                    className="hover:bg-brand-slate-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Request ID */}
                    <td className="py-3 px-3.5 font-mono font-bold text-brand-teal-800">
                      {order.orderId}
                    </td>

                    {/* Patient */}
                    <td className="py-3 px-3">
                      <p className="font-bold text-brand-navy-900">{order.patient?.name}</p>
                      <p className="text-[11px] text-brand-slate-500">
                        {order.patient?.age}Y / {order.patient?.gender}
                      </p>
                    </td>

                    {/* Test / Package */}
                    <td className="py-3 px-3">
                      <p className="font-bold text-brand-navy-900 leading-snug">{bookedName}</p>
                      <p className="text-[10px] text-brand-slate-500 font-mono">₹{order.totalAmount || order.bookedItem?.price || 1200}</p>
                    </td>

                    {/* Collection */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 font-semibold text-brand-slate-800">
                        {isHome ? (
                          <Home className="w-3.5 h-3.5 text-brand-teal-600" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-purple-600" />
                        )}
                        <span>{isHome ? 'Home Collection' : 'Lab Centre'}</span>
                      </div>
                    </td>

                    {/* Lab Centre */}
                    <td className="py-3 px-3 font-medium text-brand-slate-800 max-w-[170px] truncate" title={labCenter}>
                      {labCenter}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 text-brand-slate-700 font-medium">
                      {order.collection?.scheduledDate || order.preferredDate || '08 Oct 2026'}
                    </td>

                    {/* Payment */}
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {order.paymentStatus || 'Paid'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={order.orderStatus} size="xs" />
                    </td>

                    {/* Direct Next Action */}
                    <td className="py-3 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        {renderPrimaryAction(order)}
                        <button
                          onClick={() => onOpenOrderDetails(order)}
                          className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View Full Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
