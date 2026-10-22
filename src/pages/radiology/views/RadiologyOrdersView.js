import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  FileSpreadsheet,
  Eye,
  Calendar,
  Building2,
  Server,
  CheckCircle2,
  Play,
  Upload,
  Send,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { exportToExcel } from '../../../utils/reportExportEngine';
import { useToast } from '../../../context/ToastContext';
import { RADIOLOGY_CENTERS, RADIOLOGY_MACHINES, RADIOLOGY_CATALOGUE } from '../../../data/radiologyData';

const SUB_NAV_TABS = [
  { id: 'ALL', label: 'All Orders' },
  { id: 'NEW', label: 'New Bookings' },
  { id: 'CONFIRMED', label: 'Confirmed' },
  { id: 'SCAN COMPLETED', label: 'Scan Completed' },
  { id: 'REPORT UPLOADED', label: 'Report Uploaded' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'CANCELLED', label: 'Cancelled' }
];

export default function RadiologyOrdersView({
  orders = [],
  initialTab = 'ALL',
  onOpenOrderDetails,
  onVerifyOrder,
  onRescheduleOrder,
  onMarkArrived,
  onStartScan,
  onCompleteScan,
  onAssignRadiologist,
  onUploadReport,
  onReviewReport,
  onPreviewReport,
  onDeliverReport
}) {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab || 'ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [centerFilter, setCenterFilter] = useState('ALL');
  const [modalityFilter, setModalityFilter] = useState('ALL');
  const [machineFilter, setMachineFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');

  // Sorting & Pagination
  const [sortField, setSortField] = useState('orderId');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      setCurrentPage(1);
    }
  }, [initialTab]);

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      if (activeTab !== 'ALL') {
        const s = order.orderStatus?.toUpperCase();
        if (activeTab === 'NEW') {
          if (s !== 'NEW' && s !== 'BOOKED') return false;
        } else if (activeTab === 'CONFIRMED') {
          if (s !== 'CONFIRMED' && s !== 'VERIFIED' && s !== 'PATIENT SCHEDULED' && s !== 'PATIENT ARRIVED' && s !== 'SCAN IN PROGRESS') return false;
        } else if (activeTab === 'SCAN COMPLETED') {
          if (s !== 'SCAN COMPLETED' && s !== 'RADIOLOGIST ASSIGNED' && s !== 'REPORT PENDING') return false;
        } else if (activeTab === 'REPORT UPLOADED') {
          if (s !== 'REPORT UPLOADED' && s !== 'REPORT UNDER REVIEW' && s !== 'REPORT VERIFIED') return false;
        } else if (activeTab === 'COMPLETED') {
          if (s !== 'COMPLETED' && s !== 'REPORT DELIVERED') return false;
        } else if (activeTab === 'CANCELLED') {
          if (s !== 'CANCELLED' && s !== 'RESCHEDULED') return false;
        } else if (s !== activeTab) {
          return false;
        }
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchId = order.orderId?.toLowerCase().includes(q);
        const matchName = order.patient?.name?.toLowerCase().includes(q);
        const matchPhone = order.patient?.phone?.toLowerCase().includes(q);
        const matchScan = order.scan?.name?.toLowerCase().includes(q);
        const matchCode = order.scan?.code?.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchPhone && !matchScan && !matchCode) return false;
      }

      // Center Filter
      if (centerFilter !== 'ALL' && !order.center?.includes(centerFilter)) {
        return false;
      }

      // Modality Filter
      if (modalityFilter !== 'ALL' && order.scan?.category !== modalityFilter) {
        return false;
      }

      // Machine Filter
      if (machineFilter !== 'ALL' && !order.machine?.includes(machineFilter)) {
        return false;
      }

      // Payment Filter
      if (paymentFilter !== 'ALL' && order.paymentStatus !== paymentFilter) {
        return false;
      }

      // Date Filter
      const todayReal = new Date().toISOString().split('T')[0];
      const yDate = new Date();
      yDate.setDate(yDate.getDate() - 1);
      const yesterdayReal = yDate.toISOString().split('T')[0];

      if (dateFilter === 'Today' && order.appointmentDate !== '2026-10-01' && order.appointmentDate !== todayReal) {
        return false;
      }
      if (dateFilter === 'Yesterday' && order.appointmentDate !== '2026-09-30' && order.appointmentDate !== yesterdayReal) {
        return false;
      }

      return true;
    });
  }, [
    orders,
    activeTab,
    searchTerm,
    centerFilter,
    modalityFilter,
    machineFilter,
    paymentFilter,
    dateFilter
  ]);

  // Sorted and Paginated Data
  const sortedOrders = useMemo(() => {
    const list = [...filteredOrders];
    list.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (typeof valA === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
    return list;
  }, [filteredOrders, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / itemsPerPage));
  const paginatedOrders = sortedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleResetFilters = () => {
    setActiveTab('ALL');
    setSearchTerm('');
    setCenterFilter('ALL');
    setModalityFilter('ALL');
    setMachineFilter('ALL');
    setPaymentFilter('ALL');
    setDateFilter('ALL');
    setCurrentPage(1);
    addToast('Filters reset to default', 'info');
  };

  const handleExportExcel = () => {
    const exportData = filteredOrders.map((o) => ({
      'Order ID': o.orderId,
      'Patient Name': o.patient?.name,
      'Age/Gender': `${o.patient?.age} / ${o.patient?.gender}`,
      'Phone': o.patient?.phone,
      'Scan Name': o.scan?.name,
      'Modality': o.scan?.category,
      'Center': o.center,
      'Machine': o.machine,
      'Appointment Date': o.appointmentDate,
      'Slot Time': o.appointmentTime,
      'Radiologist': o.radiologist || 'Unassigned',
      'Total Amount': o.totalAmount,
      'Payment Status': o.paymentStatus,
      'Order Status': o.orderStatus,
      'Created Date': o.createdAt
    }));
    exportToExcel(exportData, `MediUnify_Radiology_Orders_Export`);
    addToast('Exported orders to Excel spreadsheet', 'success');
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Direct action button matching simple flow:
  // 1. App Booking (New) -> Confirm Booking
  // 2. Confirmed -> Patient visits center for scan -> Scan Done
  // 3. Scan Done -> Upload Report
  // 4. Report Uploaded -> Share with Patient
  // 5. Completed
  const renderNextActionButton = (order) => {
    const status = order.orderStatus?.toUpperCase();

    if (status === 'NEW' || status === 'BOOKED') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVerifyOrder(order);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          title="Confirm Patient Appointment & Reserve Slot"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Confirm</span>
        </button>
      );
    }

    if (
      status === 'CONFIRMED' ||
      status === 'VERIFIED' ||
      status === 'PATIENT SCHEDULED' ||
      status === 'PATIENT ARRIVED' ||
      status === 'SCAN IN PROGRESS'
    ) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCompleteScan(order);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          title="Patient arrived at center for scan - Mark Scan Done"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Scan Done</span>
        </button>
      );
    }

    if (
      status === 'SCAN COMPLETED' ||
      status === 'RADIOLOGIST ASSIGNED' ||
      status === 'REPORT PENDING'
    ) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUploadReport(order);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          title="Upload official diagnostic report"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Report</span>
        </button>
      );
    }

    if (
      status === 'REPORT UPLOADED' ||
      status === 'REPORT UNDER REVIEW' ||
      status === 'REPORT VERIFIED'
    ) {
      return (
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreviewReport(order);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-brand-teal-50 hover:bg-brand-teal-100 text-brand-teal-800 border border-brand-teal-300 font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
            title="View Official Diagnostic Report"
          >
            <FileText className="w-3.5 h-3.5 text-brand-teal-600" />
            <span>View</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeliverReport(order);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Share report with patient via WhatsApp & Health Vault"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      );
    }

    if (status === 'COMPLETED' || status === 'REPORT DELIVERED') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreviewReport(order);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-brand-teal-50 hover:bg-brand-teal-100 text-brand-teal-800 border border-brand-teal-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          title="View Official Report"
        >
          <FileText className="w-3.5 h-3.5 text-brand-teal-600" />
          <span>View Report</span>
        </button>
      );
    }

    return null;
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-brand-navy-900 tracking-tight">
            Scan Orders & Bookings Management
          </h1>
          <p className="text-xs text-brand-slate-500">
            Review app bookings, confirm machine slots, track scan completion, and share reports with patients.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-brand-slate-50 text-brand-slate-700 text-xs font-semibold rounded-xl border border-brand-slate-200 shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Sub-Navigation Status Tabs (Section 6 Tabs) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-brand-slate-200 bg-white p-2 rounded-xl border">
        {SUB_NAV_TABS.map((tab) => {
          const count = orders.filter((o) => {
            if (tab.id === 'ALL') return true;
            const s = o.orderStatus?.toUpperCase();
            if (tab.id === 'NEW') return s === 'NEW' || s === 'BOOKED';
            if (tab.id === 'CONFIRMED') return s === 'CONFIRMED' || s === 'VERIFIED' || s === 'PATIENT SCHEDULED' || s === 'PATIENT ARRIVED' || s === 'SCAN IN PROGRESS';
            if (tab.id === 'SCAN COMPLETED') return s === 'SCAN COMPLETED' || s === 'RADIOLOGIST ASSIGNED' || s === 'REPORT PENDING';
            if (tab.id === 'REPORT UPLOADED') return s === 'REPORT UPLOADED' || s === 'REPORT UNDER REVIEW' || s === 'REPORT VERIFIED';
            if (tab.id === 'COMPLETED') return s === 'COMPLETED' || s === 'REPORT DELIVERED';
            if (tab.id === 'CANCELLED') return s === 'CANCELLED' || s === 'RESCHEDULED';
            return s === tab.id;
          }).length;

          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-brand-navy-900 text-white shadow-xs'
                  : 'text-brand-slate-600 hover:bg-brand-slate-100 hover:text-brand-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-brand-slate-200 text-brand-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Comprehensive Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-brand-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Order ID, Patient Name, Phone, Scan..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 font-medium"
            />
          </div>

          {/* Center Filter */}
          <div>
            <select
              value={centerFilter}
              onChange={(e) => {
                setCenterFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 font-medium"
            >
              <option value="ALL">All Centers</option>
              {RADIOLOGY_CENTERS.map((c) => (
                <option key={c.id} value={c.name.split('-')[0]}>{c.name.split('-')[0]}</option>
              ))}
            </select>
          </div>

          {/* Modality Filter */}
          <div>
            <select
              value={modalityFilter}
              onChange={(e) => {
                setModalityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 font-medium"
            >
              <option value="ALL">All Modalities</option>
              <option value="MRI">MRI</option>
              <option value="CT Scan">CT Scan</option>
              <option value="X-Ray">Digital X-Ray</option>
              <option value="Ultrasound">Ultrasound</option>
              <option value="Mammography">Mammography</option>
              <option value="Other">DEXA / BMD</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 font-medium"
            >
              <option value="ALL">All Appointment Dates</option>
              <option value="Today">Today (Oct 01)</option>
              <option value="Yesterday">Yesterday (Sep 30)</option>
            </select>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-brand-slate-100 text-xs text-brand-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-brand-slate-600">Machine:</span>
              <select
                value={machineFilter}
                onChange={(e) => setMachineFilter(e.target.value)}
                className="p-1 rounded-lg border border-brand-slate-200 text-xs font-medium"
              >
                <option value="ALL">All Machines</option>
                {RADIOLOGY_MACHINES.map((m) => (
                  <option key={m.id} value={m.name.slice(0, 25)}>{m.name.slice(0, 25)}...</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-brand-slate-600">Payment:</span>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="p-1 rounded-lg border border-brand-slate-200 text-xs font-medium"
              >
                <option value="ALL">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-brand-slate-100/90 text-brand-slate-700 font-bold border-b border-brand-slate-200">
              <tr>
                <th
                  onClick={() => handleSort('orderId')}
                  className="py-3 px-3.5 cursor-pointer hover:text-brand-teal-700"
                >
                  <div className="flex items-center gap-1">
                    Order ID <ArrowUpDown className="w-3 h-3 opacity-50" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('patientName')}
                  className="py-3 px-3 cursor-pointer hover:text-brand-teal-700"
                >
                  Patient Name
                </th>
                <th className="py-3 px-3">Imaging Scan</th>
                <th className="py-3 px-3">Center & Machine</th>
                <th className="py-3 px-3">Appointment Slot</th>
                <th className="py-3 px-3 text-center">Payment</th>
                <th className="py-3 px-3 text-center">Order Status</th>
                <th className="py-3 px-3.5 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-brand-teal-50/20 transition-colors group"
                  >
                    {/* Order ID */}
                    <td className="py-3 px-3.5 font-mono font-bold text-brand-teal-700">
                      {order.orderId}
                    </td>

                    {/* Patient Name - only patient name */}
                    <td className="py-3 px-3">
                      <p className="font-bold text-brand-navy-900">{order.patient?.name}</p>
                    </td>

                    {/* Scan */}
                    <td className="py-3 px-3">
                      <p className="font-semibold text-brand-navy-900 truncate max-w-xs" title={order.scan?.name}>
                        {order.scan?.name}
                      </p>
                      <span className="text-[10px] text-brand-slate-400 font-mono">
                        {order.scan?.code} • {order.scan?.category}
                      </span>
                    </td>

                    {/* Center & Machine */}
                    <td className="py-3 px-3">
                      <span className="font-medium text-brand-slate-800 block truncate max-w-xs">
                        {order.center?.split('-')[0]}
                      </span>
                      <span className="text-[10px] text-brand-slate-400 truncate block max-w-xs">
                        {order.machine}
                      </span>
                    </td>

                    {/* Slot */}
                    <td className="py-3 px-3">
                      <p className="font-semibold text-brand-slate-700">{order.appointmentDate}</p>
                      <p className="text-[11px] text-brand-slate-400">{order.appointmentTime}</p>
                    </td>

                    {/* Payment Status */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-brand-coral-50 text-brand-coral-700 border border-brand-coral-200'
                        }`}
                      >
                        ₹{order.totalAmount} • {order.paymentStatus}
                      </span>
                    </td>

                    {/* Order Status */}
                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={order.orderStatus} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        {renderNextActionButton(order)}
                        <button
                          onClick={() => onOpenOrderDetails(order)}
                          className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Open Order Details Workspace"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-brand-slate-400">
                    No radiology orders match the specified filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-3 border-t border-brand-slate-200 bg-brand-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-brand-slate-500">
            Showing <strong className="text-brand-navy-900">{Math.min(sortedOrders.length, (currentPage - 1) * itemsPerPage + 1)}</strong> to{' '}
            <strong className="text-brand-navy-900">{Math.min(sortedOrders.length, currentPage * itemsPerPage)}</strong> of{' '}
            <strong className="text-brand-navy-900">{sortedOrders.length}</strong> orders
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-brand-slate-200 bg-white hover:bg-brand-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-bold text-brand-navy-900 bg-white border border-brand-slate-200 rounded-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-brand-slate-200 bg-white hover:bg-brand-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
