import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  FileSpreadsheet,
  Eye,
  CheckCircle2,
  UserCheck,
  Pipette,
  Upload,
  Send,
  FileText,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
  Clock,
  Layers,
  Sparkles,
  Filter,
  Check,
  Calendar,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { exportToExcel } from '../../../utils/reportExportEngine';
import { useToast } from '../../../context/ToastContext';
import { LAB_CENTERS, COLLECTION_STAFF } from '../../../data/labData';
import TubeColorDot, { TubeColorGroup } from '../components/TubeColorBadge';

const SUB_NAV_TABS = [
  { id: 'ALL', label: 'All Requests' },
  { id: 'NEW', label: 'New' },
  { id: 'ADMIN VERIFIED', label: 'Verified' },
  { id: 'COLLECTOR ASSIGNED', label: 'Assigned' },
  { id: 'SAMPLE COLLECTED', label: 'Collected' },
  { id: 'SAMPLE RECEIVED', label: 'Received at Lab' },
  { id: 'REPORT UPLOADED', label: 'Uploaded Reports' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'CANCELLED', label: 'Cancelled' }
];

export default function LabOrdersView({
  orders = [],
  onOpenOrderDetails,
  onOpenVerifyOrder,
  onOpenScheduleCollection,
  onMarkSampleCollected,
  onMarkSampleReceived,
  onStartProcessing,
  onUploadReport,
  onVerifyReport,
  onSendToPatient,
  onPreviewReport,
  initialTab = 'ALL'
}) {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab || 'ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingTypeFilter, setBookingTypeFilter] = useState('ALL');
  const [centerFilter, setCenterFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  // Keep activeTab synced with initialTab prop
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      setCurrentPage(1);
    }
  }, [initialTab]);

  // Sorting and Pagination
  const [sortField, setSortField] = useState('orderId');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      if (activeTab !== 'ALL') {
        const status = order.orderStatus?.toUpperCase();
        if (activeTab === 'NEW' && (status === 'NEW' || status === 'BOOKED')) {
          // match
        } else if (activeTab === 'ADMIN VERIFIED' && (status === 'VERIFIED' || status === 'ADMIN VERIFIED' || status === 'PENDING VERIFICATION')) {
          // match
        } else if (activeTab === 'COLLECTOR ASSIGNED' && (status === 'COLLECTOR ASSIGNED' || status === 'PHLEBOTOMIST ASSIGNED' || status === 'COLLECTION SCHEDULED' || status === 'COLLECTOR ACCEPTED' || status === 'ON THE WAY' || status === 'ARRIVED')) {
          // match
        } else if (activeTab === 'SAMPLE COLLECTED' && (status === 'SAMPLE COLLECTED' || status === 'COLLECTED')) {
          // match
        } else if (activeTab === 'SAMPLE RECEIVED' && (status === 'SAMPLE RECEIVED' || status === 'RECEIVED' || status === 'REPORT PENDING' || status === 'PROCESSING' || status === 'IN LAB / PROCESSING')) {
          // match
        } else if (activeTab === 'REPORT UPLOADED' && (status === 'REPORT READY' || status === 'REPORT UPLOADED' || status === 'VERIFIED REPORT' || status === 'REPORT VERIFIED')) {
          // match
        } else if (status !== activeTab.toUpperCase()) {
          return false;
        }
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchId = order.orderId?.toLowerCase().includes(q);
        const matchPatientId = order.patient?.patientId?.toLowerCase().includes(q);
        const matchName = order.patient?.name?.toLowerCase().includes(q);
        const matchPhone = order.patient?.phone?.toLowerCase().includes(q);
        const matchTest = (order.bookedItem?.name || order.testOrPackage?.name)?.toLowerCase().includes(q);
        if (!matchId && !matchPatientId && !matchName && !matchPhone && !matchTest) return false;
      }

      // Collection Method Filter
      if (bookingTypeFilter !== 'ALL') {
        const bType = order.collection?.method || order.bookingType;
        if (bType !== bookingTypeFilter) return false;
      }

      // Center Filter
      if (centerFilter !== 'ALL') {
        const ctr = order.collection?.center || order.center;
        if (!ctr?.includes(centerFilter)) return false;
      }

      // Payment Filter
      if (paymentFilter !== 'ALL' && order.paymentStatus !== paymentFilter) {
        return false;
      }

      return true;
    });
  }, [orders, activeTab, searchTerm, bookingTypeFilter, centerFilter, paymentFilter]);

  // Sort logic
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'patient') {
        valA = a.patient?.name || '';
        valB = b.patient?.name || '';
      }

      if (typeof valA === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
  }, [filteredOrders, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / itemsPerPage));
  const paginatedOrders = sortedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleResetFilters = () => {
    setActiveTab('ALL');
    setSearchTerm('');
    setBookingTypeFilter('ALL');
    setCenterFilter('ALL');
    setPaymentFilter('ALL');
    setCurrentPage(1);
    addToast('Filters reset', 'info');
  };

  const handleExportExcel = () => {
    const exportData = sortedOrders.map((o) => ({
      'Request ID': o.orderId,
      'Patient Name': o.patient?.name,
      'Patient ID': o.patient?.patientId,
      'Phone': o.patient?.phone,
      'Test / Package': o.bookedItem?.name || o.testOrPackage?.name,
      'Collection Method': o.collection?.method || o.bookingType,
      'Lab Centre': o.collection?.center || o.center,
      'Date': o.collection?.scheduledDate || o.preferredDate,
      'Payment Status': o.paymentStatus,
      'Request Status': o.orderStatus
    }));
    exportToExcel(exportData, 'MediUnify_Lab_Requests_Log');
    addToast('Exported Lab Requests to Excel', 'success');
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Render the single, direct next action button for seamless flow
  const renderNextActionButton = (order) => {
    const status = order.orderStatus?.toUpperCase();
    const isHome = (order.collection?.method || order.bookingType) === 'Home Sample Collection';

    if (status === 'NEW' || status === 'BOOKED') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenVerifyOrder(order);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          title="Verify Patient Request"
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
              onOpenScheduleCollection(order);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            title="Assign Phlebotomist for Home Collection"
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
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-navy-900 font-semibold text-xs rounded-xl border border-brand-slate-300 transition-colors cursor-pointer whitespace-nowrap"
          title="Patient to visit testing centre"
        >
          <Building2 className="w-3.5 h-3.5 text-brand-teal-700" />
          <span>Centre Visit</span>
        </button>
      );
    }

    if (status === 'COLLECTOR ASSIGNED' || status === 'PHLEBOTOMIST ASSIGNED' || status === 'COLLECTION SCHEDULED' || status === 'COLLECTOR ACCEPTED' || status === 'ON THE WAY' || status === 'ARRIVED') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkSampleCollected(order.orderId);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          title="Confirm sample collected by phlebotomist"
        >
          <Pipette className="w-3.5 h-3.5" />
          <span>Mark Collected</span>
        </button>
      );
    }

    if (status === 'SAMPLE COLLECTED') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkSampleReceived(order.orderId);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          title="Receive and accession sample at lab"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Receive at Lab</span>
        </button>
      );
    }

    if (status === 'SAMPLE RECEIVED' || status === 'REPORT PENDING' || status === 'PROCESSING') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUploadReport(order);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          title="Upload ready certified report"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Report</span>
        </button>
      );
    }

    if (status === 'REPORT UPLOADED' || status === 'REPORT READY' || status === 'REPORT VERIFIED' || status === 'VERIFIED REPORT') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSendToPatient(order.orderId);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          title="Send ready report to patient via WhatsApp & Email"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Report</span>
        </button>
      );
    }

    if (status === 'COMPLETED' || status === 'REPORT DELIVERED') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onPreviewReport) onPreviewReport(order);
            else onOpenOrderDetails(order);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-brand-teal-50 hover:bg-brand-teal-100 text-brand-teal-800 border border-brand-teal-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          title="Preview Official Report"
        >
          <FileText className="w-3.5 h-3.5 text-brand-teal-600" />
          <span>View Report</span>
        </button>
      );
    }

    if (status === 'CANCELLED') {
      return (
        <span className="text-[11px] text-brand-slate-400 font-medium italic whitespace-nowrap">
          Cancelled
        </span>
      );
    }

    return null;
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Clean Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-brand-navy-900 tracking-tight">
            Lab Requests
          </h1>
          <p className="text-xs text-brand-slate-500 mt-0.5">
            Review and manage patient laboratory test requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-brand-slate-50 text-brand-slate-700 text-xs font-semibold rounded-xl border border-brand-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Clean Status Navigation Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-brand-slate-200 bg-white p-2 rounded-2xl border shadow-2xs no-scrollbar">
        {SUB_NAV_TABS.map((tab) => {
          const count = orders.filter((o) => {
            if (tab.id === 'ALL') return true;
            const status = o.orderStatus?.toUpperCase();
            if (tab.id === 'NEW' && (status === 'NEW' || status === 'BOOKED')) return true;
            if (tab.id === 'ADMIN VERIFIED' && (status === 'VERIFIED' || status === 'ADMIN VERIFIED' || status === 'PENDING VERIFICATION')) return true;
            if (tab.id === 'COLLECTOR ASSIGNED' && (status === 'COLLECTOR ASSIGNED' || status === 'PHLEBOTOMIST ASSIGNED' || status === 'COLLECTION SCHEDULED' || status === 'COLLECTOR ACCEPTED' || status === 'ON THE WAY' || status === 'ARRIVED')) return true;
            if (tab.id === 'SAMPLE COLLECTED' && (status === 'SAMPLE COLLECTED' || status === 'COLLECTED')) return true;
            if (tab.id === 'SAMPLE RECEIVED' && (status === 'SAMPLE RECEIVED' || status === 'RECEIVED' || status === 'REPORT PENDING' || status === 'PROCESSING' || status === 'IN LAB / PROCESSING')) return true;
            if (tab.id === 'REPORT UPLOADED' && (status === 'REPORT READY' || status === 'REPORT UPLOADED' || status === 'VERIFIED REPORT' || status === 'REPORT VERIFIED')) return true;
            return status === tab.id.toUpperCase();
          }).length;

          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-brand-teal-600 text-white shadow-xs'
                  : 'text-brand-slate-600 hover:bg-brand-slate-100 hover:text-brand-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-brand-slate-100 text-brand-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Clean Quick Filter Toolbar */}
      <div className="p-3.5 bg-white rounded-2xl border border-brand-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Request ID, Patient Name, Phone, Test..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 font-medium text-brand-slate-800"
            />
          </div>

          {/* Collection Method Filter */}
          <div>
            <select
              value={bookingTypeFilter}
              onChange={(e) => {
                setBookingTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 font-medium text-brand-slate-700 bg-white"
            >
              <option value="ALL">All Collection Methods</option>
              <option value="Home Sample Collection">Home Sample Collection</option>
              <option value="Lab Centre Visit">Lab Centre Visit</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 font-medium text-brand-slate-700 bg-white"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center justify-between text-xs text-brand-slate-500 pt-1 border-t border-brand-slate-100">
          <span>Found <strong>{sortedOrders.length}</strong> matching laboratory requests</span>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 font-bold text-brand-teal-700 hover:text-brand-teal-800 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* Clean, Streamlined Requests Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-brand-slate-50 text-brand-slate-700 font-bold border-b border-brand-slate-200">
              <tr>
                <th
                  onClick={() => handleSort('orderId')}
                  className="py-3 px-3.5 cursor-pointer hover:text-brand-teal-700 w-28 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1 font-mono">
                    Request ID <ArrowUpDown className="w-3 h-3 opacity-40" />
                  </div>
                </th>
                <th className="py-3 px-3 whitespace-nowrap">Patient Name</th>
                <th className="py-3 px-3 min-w-[200px]">Test / Package</th>
                <th className="py-3 px-3 whitespace-nowrap">Collection</th>
                <th className="py-3 px-3 whitespace-nowrap">Lab Centre</th>
                <th className="py-3 px-3 text-center whitespace-nowrap">Payment</th>
                <th className="py-3 px-3 text-center min-w-[130px] whitespace-nowrap">Status</th>
                <th className="py-3 px-3.5 text-center min-w-[170px] whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => {
                  const bookedName = order.bookedItem?.name || order.testOrPackage?.name || 'Diagnostic Panel';
                  const bookedType = order.bookedItem?.type || (order.testOrPackage?.type === 'package' ? 'Package' : 'Individual Test');
                  const method = order.collection?.method || order.bookingType || 'Home Collection';
                  const isHome = method === 'Home Sample Collection';
                  const labCenter = order.collection?.center || order.center || 'Nova Diagnostics & Laboratory Centre';

                  return (
                    <tr
                      key={order.orderId}
                      className="hover:bg-brand-slate-50/70 transition-colors group"
                    >
                      {/* Request ID - only ID */}
                      <td className="py-3 px-3.5 font-mono whitespace-nowrap">
                        <span className="font-bold text-brand-teal-800 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                          {order.orderId}
                        </span>
                      </td>

                      {/* Patient Name - only patient name */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <p className="font-bold text-brand-navy-900">{order.patient?.name}</p>
                      </td>

                      {/* Test / Package */}
                      <td className="py-3 px-3">
                        <p className="font-bold text-brand-navy-900 leading-snug line-clamp-1" title={bookedName}>
                          {bookedName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              bookedType === 'Package'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {bookedType}
                          </span>
                          <span className="text-[11px] font-semibold text-brand-slate-600 font-mono">
                            ₹{order.totalAmount || order.bookedItem?.price || 1200}
                          </span>
                        </div>
                      </td>

                      {/* Collection */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-semibold text-brand-slate-800">
                          {isHome ? (
                            <Home className="w-3.5 h-3.5 text-brand-teal-600 shrink-0" />
                          ) : (
                            <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          )}
                          <span>{isHome ? 'Home Collection' : 'Lab Centre'}</span>
                        </div>
                        <p className="text-[10px] text-brand-slate-500 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-slate-400 shrink-0" />
                          {order.collection?.scheduledDate || order.preferredDate || 'Today'}
                        </p>
                      </td>

                      {/* Lab Centre */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <p className="font-medium text-brand-slate-800 truncate max-w-[170px]" title={labCenter}>
                          {labCenter}
                        </p>
                      </td>

                      {/* Payment */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            order.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {order.paymentStatus || 'Paid'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <StatusBadge status={order.orderStatus} size="sm" />
                      </td>

                      {/* Direct Next Action (Smooth Single-Click Flow) */}
                      <td className="py-3 px-3.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          {renderNextActionButton(order)}
                          <button
                            onClick={() => onOpenOrderDetails(order)}
                            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-brand-slate-400">
                    <p className="font-semibold text-sm">No laboratory requests match your filter criteria.</p>
                    <p className="text-xs text-brand-slate-400 mt-1">Try resetting the status filter or search parameters.</p>
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
            <strong className="text-brand-navy-900">{sortedOrders.length}</strong> requests
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-brand-slate-200 bg-white hover:bg-brand-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-bold text-brand-navy-900 bg-white border border-brand-slate-200 rounded-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-brand-slate-200 bg-white hover:bg-brand-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
   </div>
  );
}
