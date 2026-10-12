import React, { useState, useMemo } from 'react';
import {
  ScanLine,
  Server,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  CalendarCheck2,
  FileText,
  TrendingUp,
  Activity,
  Cpu,
  ChevronRight,
  Eye,
  ShieldCheck,
  Zap,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function RadiologyDashboardView({
  orders = [],
  machines = [],
  centers = [],
  catalogue = [],
  reports = [],
  onNavigateToModule,
  onOpenOrderDetails,
  onVerifyOrder,
  onOpenScanExecution,
  onAssignRadiologist,
  onOpenReportPreview,
  onOpenMaintenanceModal
}) {
  const [dateRange, setDateRange] = useState('Today');
  const [customDate, setCustomDate] = useState('2026-10-01');

  // Filter orders by selected date (supports mock dates and current dates)
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const todayReal = now.toISOString().split('T')[0];
    const yDate = new Date(now);
    yDate.setDate(yDate.getDate() - 1);
    const yesterdayReal = yDate.toISOString().split('T')[0];

    if (dateRange === 'Today') {
      return orders.filter(
        (o) => o.appointmentDate === '2026-10-01' || o.appointmentDate === todayReal
      );
    }
    if (dateRange === 'Yesterday') {
      return orders.filter(
        (o) => o.appointmentDate === '2026-09-30' || o.appointmentDate === yesterdayReal
      );
    }
    if (dateRange === 'Custom Date') {
      return orders.filter((o) => o.appointmentDate === customDate);
    }
    return orders;
  }, [orders, dateRange, customDate]);

  // Operational metrics dynamically calculated for the selected date range
  const metrics = useMemo(() => {
    const list = filteredOrders;
    const total = list.length;
    const newOrd = list.filter((o) => o.orderStatus === 'NEW').length;
    const pendingVer = list.filter((o) => o.orderStatus === 'VERIFIED' || o.orderStatus === 'PENDING VERIFICATION').length;
    const inProgress = list.filter((o) => o.orderStatus === 'SCAN IN PROGRESS').length;
    const completedScans = list.filter((o) => o.orderStatus === 'SCAN COMPLETED' || o.orderStatus === 'RADIOLOGIST ASSIGNED' || o.orderStatus === 'REPORT PENDING').length;
    const reportsPending = list.filter((o) => o.orderStatus === 'REPORT PENDING' || o.orderStatus === 'RADIOLOGIST ASSIGNED').length;
    const reportsUnderReview = list.filter((o) => o.orderStatus === 'REPORT UNDER REVIEW').length;
    const reportsReady = list.filter((o) => o.orderStatus === 'REPORT VERIFIED' || o.orderStatus === 'REPORT DELIVERED').length;
    const completedOrders = list.filter((o) => o.orderStatus === 'COMPLETED').length;
    const cancelledOrders = list.filter((o) => o.orderStatus === 'CANCELLED').length;
    const rescheduledOrders = list.filter((o) => o.orderStatus === 'RESCHEDULED').length;

    const periodRevenue = list
      .filter((o) => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return {
      total,
      newOrd,
      pendingVer,
      inProgress,
      completedScans,
      reportsPending,
      reportsUnderReview,
      reportsReady,
      completedOrders,
      cancelledOrders,
      rescheduledOrders,
      periodRevenue
    };
  }, [filteredOrders]);

  // Center Summary
  const centerSummary = useMemo(() => {
    const activeCenters = centers.filter((c) => c.status === 'Active').length;
    const inactiveCenters = centers.filter((c) => c.status !== 'Active').length;
    const totalM = machines.length;
    const availableM = machines.filter((m) => m.status === 'Available').length;
    const inUseM = machines.filter((m) => m.status === 'In Use').length;
    const maintenanceM = machines.filter((m) => m.status === 'Maintenance').length;
    return { activeCenters, inactiveCenters, totalM, availableM, inUseM, maintenanceM };
  }, [centers, machines]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner & Live Operations Control Center */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-gradient-to-r from-brand-navy-900 via-brand-navy-800 to-brand-teal-900 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs">
              PACS & Imaging Operations Control
            </span>
            <span className="text-xs text-brand-teal-200">
              Showing: <strong className="text-white underline">{dateRange === 'Custom Date' ? customDate : dateRange}</strong> ({filteredOrders.length} Scans)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            MediUnify Radiology Administration
          </h1>
          <p className="text-xs text-brand-teal-100 max-w-xl mt-1">
            End-to-end monitoring of MRI, CT, Digital X-Ray, Sonography scans, gantry slots and consultant reporting.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-white/10 p-1.5 rounded-xl backdrop-blur-md border border-white/20">
          {['Today', 'Yesterday', 'All Dates', 'Custom Date'].map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dateRange === range
                  ? 'bg-white text-brand-navy-900 shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {range}
            </button>
          ))}
          {dateRange === 'Custom Date' && (
            <div className="flex items-center gap-1.5 bg-white/15 px-2 py-1 rounded-lg border border-white/20">
              <span className="text-[10px] text-white/90 font-medium">Select:</span>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="px-2 py-0.5 text-xs rounded-md bg-white text-brand-navy-900 font-semibold cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-brand-teal-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards Grid (Section 5 KPI requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div
          onClick={() => onNavigateToModule('orders', 'ALL')}
          className="p-4 bg-white rounded-xl border border-brand-slate-200 shadow-2xs hover:shadow-md hover:border-brand-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-brand-slate-500 mb-2">
            <span className="text-xs font-bold">Total Orders</span>
            <div className="p-1.5 rounded-lg bg-brand-slate-100 text-brand-slate-700 group-hover:bg-brand-teal-50 group-hover:text-brand-teal-700">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-brand-navy-900">{metrics.total}</p>
          <p className="text-[11px] text-brand-teal-700 font-semibold mt-1">₹{metrics.periodRevenue.toLocaleString()} Revenue</p>
        </div>

        <div
          onClick={() => onNavigateToModule('orders', 'NEW')}
          className="p-4 bg-white rounded-xl border border-blue-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group bg-blue-50/20"
        >
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-xs font-bold">New Orders</span>
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-blue-900">{metrics.newOrd}</p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">Requires Verification</p>
        </div>

        <div
          onClick={() => onNavigateToModule('orders', 'CONFIRMED')}
          className="p-4 bg-white rounded-xl border border-purple-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group bg-purple-50/20"
        >
          <div className="flex items-center justify-between text-purple-700 mb-2">
            <span className="text-xs font-bold">Confirmed & Gantry</span>
            <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-purple-900">{metrics.pendingVer + metrics.inProgress}</p>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">Scheduled & In Gantry Suites</p>
        </div>

        <div
          onClick={() => onNavigateToModule('orders', 'SCAN COMPLETED')}
          className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group bg-amber-50/20"
        >
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-bold">Scans Completed</span>
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-900">{metrics.completedScans}</p>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Awaiting Report Upload</p>
        </div>

        <div
          onClick={() => onNavigateToModule('orders', 'REPORT UPLOADED')}
          className="p-4 bg-white rounded-xl border border-purple-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group bg-purple-50/30"
        >
          <div className="flex items-center justify-between text-purple-700 mb-2">
            <span className="text-xs font-bold">Reports Uploaded</span>
            <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-purple-900">{metrics.reportsReady || metrics.reportsUnderReview}</p>
          <p className="text-[11px] text-purple-700 font-semibold mt-1">Ready for Verification & Dispatch</p>
        </div>

        <div
          onClick={() => onNavigateToModule('orders', 'COMPLETED')}
          className="p-4 bg-white rounded-xl border border-brand-green-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group bg-brand-green-50/20"
        >
          <div className="flex items-center justify-between text-brand-green-700 mb-2">
            <span className="text-xs font-bold">Completed</span>
            <div className="p-1.5 rounded-lg bg-brand-green-100 text-brand-green-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-brand-green-900">{metrics.completedOrders}</p>
          <p className="text-[11px] text-brand-green-600 font-semibold mt-1">Delivered to Patient</p>
        </div>

      </div>

      {/* Summary Cards Row: Center Summary & Radiologist Workload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Center & Machine Summary Card */}
        <div className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-brand-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-teal-600" />
                Radiology Centers & Machine Fleet Status
              </h3>
              <p className="text-xs text-brand-slate-500">Live Mysuru & Bengaluru imaging suites</p>
            </div>
            <button
              onClick={() => onNavigateToModule('machines')}
              className="text-xs font-bold text-brand-teal-700 hover:underline"
            >
              Machines ({centerSummary.totalM})
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200">
              <p className="text-lg font-extrabold text-brand-navy-900">{centerSummary.activeCenters}</p>
              <p className="text-[11px] text-brand-slate-500 font-semibold">Active Centers</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <p className="text-lg font-extrabold text-emerald-800">{centerSummary.availableM}</p>
              <p className="text-[11px] text-emerald-700 font-semibold">Available</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900">
              <p className="text-lg font-extrabold text-purple-800">{centerSummary.inUseM}</p>
              <p className="text-[11px] text-purple-700 font-semibold">In Use</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <p className="text-lg font-extrabold text-amber-800">{centerSummary.maintenanceM}</p>
              <p className="text-[11px] text-amber-700 font-semibold">Maintenance</p>
            </div>
          </div>
        </div>

        {/* Imaging Modalities & Service Catalogue */}
        <div className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-brand-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900 flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-brand-teal-600" />
                Active Modalities & Scans
              </h3>
              <p className="text-xs text-brand-slate-500">MRI, CT Scan, Ultrasound, Digital X-Ray & PET-CT</p>
            </div>
            <button
              onClick={() => onNavigateToModule('catalogue')}
              className="text-xs font-bold text-brand-teal-700 hover:underline"
            >
              Scan Catalogue ({catalogue.length})
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200">
              <p className="text-lg font-extrabold text-brand-navy-900">{catalogue.length}</p>
              <p className="text-[11px] text-brand-slate-500 font-semibold">Total Scans</p>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900">
              <p className="text-lg font-extrabold text-sky-800">
                {catalogue.filter((s) => s.category === 'MRI' || s.modality === 'MRI').length}
              </p>
              <p className="text-[11px] text-sky-700 font-semibold">MRI Scans</p>
            </div>
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900">
              <p className="text-lg font-extrabold text-teal-800">
                {catalogue.filter((s) => s.category?.includes('CT') || s.modality?.includes('CT')).length}
              </p>
              <p className="text-[11px] text-teal-700 font-semibold">CT Protocols</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <p className="text-lg font-extrabold text-emerald-800">
                {catalogue.filter((s) => s.status === 'Active').length}
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold">Active Scans</p>
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Section A (Today's Scans Queue) & Machine Live Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Patient Scans Queue (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-brand-navy-900 flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-brand-teal-600" />
                {dateRange === 'Today'
                  ? "Today's Patient Scan Queue & Execution"
                  : dateRange === 'Yesterday'
                  ? "Yesterday's Patient Scan Queue"
                  : dateRange === 'Custom Date'
                  ? `Scan Queue (${customDate})`
                  : "All Patient Scans Queue & Execution"}
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200 font-bold">
                  {filteredOrders.length} {filteredOrders.length === 1 ? 'Scan' : 'Scans'}
                </span>
              </h2>
              <p className="text-xs text-brand-slate-500">
                {dateRange === 'Today'
                  ? "Live appointments requiring check-in, gantry run, or report sign-off"
                  : `Appointments scheduled for ${dateRange === 'Custom Date' ? customDate : dateRange.toLowerCase()}`}
              </p>
            </div>

            <button
              onClick={() => onNavigateToModule('orders')}
              className="flex items-center gap-1 text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800 bg-brand-teal-50 px-3 py-1.5 rounded-lg border border-brand-teal-200 transition-colors cursor-pointer"
            >
              View in Orders <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-10 text-center text-brand-slate-400">
              <CalendarCheck2 className="w-10 h-10 mx-auto mb-2 opacity-40 text-brand-teal-600" />
              <p className="text-xs font-bold text-brand-navy-900">
                No scans found for {dateRange === 'Custom Date' ? customDate : dateRange.toLowerCase()}
              </p>
              <p className="text-[11px] text-brand-slate-500 mt-1">
                Try selecting "All Dates" or "Today" to view patient orders.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-brand-slate-100 max-h-[480px] overflow-y-auto pr-1">
              {filteredOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-brand-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer"
                  onClick={() => onOpenOrderDetails(order)}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 bg-brand-navy-50 text-brand-navy-900 rounded-lg border border-brand-navy-200 font-mono text-xs font-bold shrink-0">
                      {order.orderId}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-brand-navy-900 truncate">{order.patient?.name}</strong>
                        <span className="text-[11px] text-brand-slate-400 font-medium shrink-0">({order.patient?.age}Y, {order.patient?.gender})</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-slate-100 text-brand-slate-600 font-semibold shrink-0">
                          {order.appointmentDate}
                        </span>
                      </div>
                      <p className="text-xs text-brand-teal-800 font-semibold mt-0.5 truncate">
                        {order.scan?.name}
                      </p>
                      <p className="text-[11px] text-brand-slate-400 truncate">
                        {order.center?.split('-')[0]} • <span className="font-semibold text-brand-slate-600">{order.machine}</span> • Slot: {order.appointmentTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={order.orderStatus} size="sm" />
                    <span className="font-bold text-brand-navy-900 text-xs hidden sm:inline">₹{order.totalAmount}</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenOrderDetails(order);
                      }}
                      className="p-1.5 text-brand-slate-400 hover:text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                      title="View Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Machine Live Status (1 Col) */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-brand-navy-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-brand-teal-600" />
                Live Machine Suites
              </h2>
              <p className="text-xs text-brand-slate-500">Real-time scanner status</p>
            </div>

            <button
              onClick={() => onNavigateToModule('machines')}
              className="text-xs font-bold text-brand-teal-700 hover:underline shrink-0"
            >
              All Scanners
            </button>
          </div>

          <div className="space-y-2.5">
            {machines.slice(0, 5).map((m) => (
              <div
                key={m.id}
                className="p-3 bg-brand-slate-50/80 hover:bg-brand-slate-100/70 transition-colors rounded-xl border border-brand-slate-200/90 space-y-1.5 group"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <p
                      className="font-bold text-brand-navy-900 text-xs truncate group-hover:text-brand-teal-800 transition-colors"
                      title={m.name}
                    >
                      {m.name}
                    </p>
                    <p className="text-[11px] text-brand-slate-500 truncate mt-0.5">
                      {m.room} • <span className="font-semibold text-brand-slate-700">{m.modality}</span>
                    </p>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    <StatusBadge status={m.status} size="xs" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-brand-slate-200/60 text-[10px]">
                  <span className="text-brand-slate-400 font-medium">Cooling / Status:</span>
                  <span className="font-mono font-bold text-brand-teal-800 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200/70">
                    {m.cryoTemp || 'Optimal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: Reports Pending & Exceptions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Reports Pending Review */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-brand-slate-100 pb-2">
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                Reports Ready for Sign-Off
              </h3>
              <p className="text-xs text-brand-slate-500">Clinical authorization queue</p>
            </div>
            <button
              onClick={() => onNavigateToModule('reports')}
              className="text-xs font-bold text-brand-teal-700 hover:underline"
            >
              Reports Hub
            </button>
          </div>

          <div className="space-y-2">
            {reports.slice(0, 3).map((rep) => (
              <div key={rep.reportId} className="p-2.5 bg-purple-50/30 rounded-xl border border-purple-200 text-xs flex items-center justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono font-bold text-purple-900 shrink-0">{rep.reportId}</span>
                    <StatusBadge status={rep.reportStatus} size="xs" />
                  </div>
                  <p className="font-bold text-brand-navy-900 truncate">{rep.patientName}</p>
                  <p className="text-[11px] text-brand-slate-500 truncate">{rep.scanName}</p>
                </div>
                <button
                  onClick={() => onOpenReportPreview(rep)}
                  className="p-1.5 bg-white text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 shadow-2xs shrink-0"
                  title="Preview & Sign"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Booking Exceptions (Rescheduled / Cancelled / Maintenance) */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-brand-slate-100 pb-2">
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Booking Exceptions & Reschedules
              </h3>
              <p className="text-xs text-brand-slate-500">Conflict triage & adjustments</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
              {metrics.rescheduledOrders + metrics.cancelledOrders} Cases
            </span>
          </div>

          <div className="space-y-2">
            {filteredOrders.filter((o) => o.orderStatus === 'RESCHEDULED' || o.orderStatus === 'CANCELLED').length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-brand-slate-200 text-center text-xs text-brand-slate-400">
                No exceptions or reschedules for selected period
              </div>
            ) : (
              filteredOrders
                .filter((o) => o.orderStatus === 'RESCHEDULED' || o.orderStatus === 'CANCELLED')
                .map((o) => (
                  <div key={o.orderId} className="p-2.5 bg-amber-50/40 rounded-xl border border-amber-200 text-xs flex items-center justify-between gap-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <strong className="font-mono text-brand-navy-900 shrink-0">{o.orderId}</strong>
                        <StatusBadge status={o.orderStatus} size="xs" />
                      </div>
                      <p className="font-bold text-brand-navy-900 truncate">{o.patient?.name}</p>
                      <p className="text-[11px] text-brand-slate-600 truncate">{o.scan?.name}</p>
                    </div>
                    <button
                      onClick={() => onOpenOrderDetails(o)}
                      className="p-1.5 bg-white text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100 shadow-2xs shrink-0"
                      title="View Exception Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Modality Demand Distribution */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-brand-slate-100 pb-2">
            <h3 className="text-sm font-bold text-brand-navy-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-teal-600" />
              Imaging Modality Booking Trends
            </h3>
            <p className="text-xs text-brand-slate-500">Demand distribution across centers</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-brand-navy-900 mb-1">
                <span>MRI 3.0T High-Field Scans</span>
                <span className="text-brand-teal-700">42%</span>
              </div>
              <div className="w-full h-2 bg-brand-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-teal-600 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-brand-navy-900 mb-1">
                <span>128-Slice Multidetector CT</span>
                <span className="text-brand-teal-700">28%</span>
              </div>
              <div className="w-full h-2 bg-brand-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-navy-800 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-brand-navy-900 mb-1">
                <span>4D Ultrasound & Color Doppler</span>
                <span className="text-brand-teal-700">18%</span>
              </div>
              <div className="w-full h-2 bg-brand-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-brand-navy-900 mb-1">
                <span>High-Frequency Digital X-Ray & DEXA</span>
                <span className="text-brand-teal-700">12%</span>
              </div>
              <div className="w-full h-2 bg-brand-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
