import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Upload,
  ShieldCheck,
  Send,
  XCircle,
  FileSpreadsheet,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Printer
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { exportToExcel } from '../../../utils/reportExportEngine';
import { useToast } from '../../../context/ToastContext';

const REPORT_STATUS_TABS = [
  { id: 'ALL', label: 'All Reports' },
  { id: 'PENDING', label: 'Pending Upload' },
  { id: 'UPLOADED', label: 'Uploaded / Draft' },
  { id: 'UNDER REVIEW', label: 'Under Review' },
  { id: 'VERIFIED', label: 'Verified & Signed' },
  { id: 'DELIVERED', label: 'Delivered to Patient' },
  { id: 'REJECTED', label: 'Rejected' }
];

export default function LabReportsView({
  reports = [],
  onOpenUploadModal,
  onOpenVerificationModal,
  onOpenPreviewModal,
  onSendReportToPatient
}) {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('ALL');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      if (activeTab !== 'ALL' && rep.reportStatus !== activeTab) {
        return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchId = rep.reportId?.toLowerCase().includes(q);
        const matchOrder = rep.orderId?.toLowerCase().includes(q);
        const matchPatient = rep.patientName?.toLowerCase().includes(q);
        const matchTest = rep.testOrPackageName?.toLowerCase().includes(q);
        const matchPath = rep.verifiedBy?.toLowerCase().includes(q);
        if (!matchId && !matchOrder && !matchPatient && !matchTest && !matchPath) return false;
      }

      if (deliveryFilter !== 'ALL' && !rep.deliveryStatus?.includes(deliveryFilter)) {
        return false;
      }

      return true;
    });
  }, [reports, activeTab, searchTerm, deliveryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / itemsPerPage));
  const paginatedReports = filteredReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleResetFilters = () => {
    setActiveTab('ALL');
    setSearchTerm('');
    setDeliveryFilter('ALL');
    setCurrentPage(1);
    addToast('Report filters reset', 'info');
  };

  const handleExportExcel = () => {
    const exportData = filteredReports.map((r) => ({
      'Report ID': r.reportId,
      'Order ID': r.orderId,
      'Patient Name': r.patientName,
      'Test / Package': r.testOrPackageName,
      'Sample ID': r.sampleId,
      'Report Status': r.reportStatus,
      'Uploaded Date': r.uploadedDate,
      'Verified By': r.verifiedBy,
      'Delivery Status': r.deliveryStatus
    }));
    exportToExcel(exportData, 'MediUnify_Diagnostic_Reports_Log');
    addToast('Exported diagnostic reports log to Excel', 'success');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-navy-900 tracking-tight">
            Diagnostic Reports
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-brand-slate-50 text-brand-slate-700 text-xs font-semibold rounded-xl border border-brand-slate-200 shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Reports
          </button>
          <button
            onClick={() => onOpenUploadModal(null)}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Report
          </button>
        </div>
      </div>

      {/* Sub-navigation Status Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-brand-slate-200 bg-white p-2 rounded-xl border">
        {REPORT_STATUS_TABS.map((tab) => {
          const count = reports.filter((r) => {
            if (tab.id === 'ALL') return true;
            return r.reportStatus === tab.id;
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
                  ? 'bg-brand-teal-600 text-white shadow-xs'
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

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-brand-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Report ID, Order ID, Patient Name, Pathologist..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            />
          </div>

          {/* Delivery Filter */}
          <div>
            <select
              value={deliveryFilter}
              onChange={(e) => {
                setDeliveryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            >
              <option value="ALL">All Delivery Channels & States</option>
              <option value="Delivered">Delivered via WhatsApp & Email</option>
              <option value="Pending Verification">Pending Pathologist Verification</option>
              <option value="Ready">Ready for Dispatch</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-brand-slate-500 pt-1">
          <span>Found <strong>{filteredReports.length}</strong> diagnostic report entries</span>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 font-bold text-brand-teal-700 hover:text-brand-teal-800"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-brand-slate-100 text-brand-slate-700 font-bold border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-3.5">Report ID</th>
                <th className="py-3 px-3">Patient Name</th>
                <th className="py-3 px-3">Test / Package</th>
                <th className="py-3 px-3">Sample ID</th>
                <th className="py-3 px-3 text-center">Report Status</th>
                <th className="py-3 px-3">Uploaded Date</th>
                <th className="py-3 px-3">Verified By</th>
                <th className="py-3 px-3">Delivery Status</th>
                <th className="py-3 px-3.5 text-center w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {paginatedReports.length > 0 ? (
                paginatedReports.map((rep) => (
                  <tr key={rep.reportId} className="hover:bg-brand-slate-50/80 transition-colors">
                    {/* Report ID - only ID */}
                    <td className="py-3 px-3.5 font-mono">
                      <span className="font-bold text-purple-900 text-sm bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {rep.reportId}
                      </span>
                    </td>

                    {/* Patient Name - only patient name */}
                    <td className="py-3 px-3">
                      <p className="font-bold text-brand-navy-900">{rep.patientName}</p>
                    </td>

                    {/* Test/Package & Testing Lab */}
                    <td className="py-3 px-3 max-w-xs">
                      <p className="font-semibold text-brand-navy-900 truncate" title={rep.testOrPackageName}>
                        {rep.testOrPackageName}
                      </p>
                      <p className="text-[10px] text-brand-slate-500 truncate mt-0.5">
                        Tested at: <strong className="text-brand-navy-900">{rep.labCenter || 'Nova Diagnostics & Laboratory Centre'}</strong>
                      </p>
                    </td>

                    {/* Sample ID */}
                    <td className="py-3 px-3 font-mono text-brand-teal-700 font-semibold">
                      {rep.sampleId}
                    </td>

                    {/* Report Status */}
                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={rep.reportStatus} size="xs" />
                    </td>

                    {/* Uploaded Date */}
                    <td className="py-3 px-3 text-brand-slate-600 font-medium">
                      {rep.uploadedDate}
                    </td>

                    {/* Verified By */}
                    <td className="py-3 px-3 text-brand-slate-700 font-medium">
                      {rep.verifiedBy}
                    </td>

                    {/* Delivery Status */}
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-semibold text-brand-slate-800">
                        {rep.deliveryStatus}
                      </span>
                    </td>

                    {/* Contextual Actions */}
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onOpenPreviewModal(rep)}
                          className="p-1.5 text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg transition-colors"
                          title="Preview Official Report PDF"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {(rep.reportStatus === 'UPLOADED' || rep.reportStatus === 'UNDER REVIEW') && (
                          <button
                            onClick={() => onOpenVerificationModal(rep)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors font-bold"
                            title="Pathologist Verification"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {rep.reportStatus === 'VERIFIED' && (
                          <button
                            onClick={() => onSendReportToPatient(rep.reportId)}
                            className="p-1.5 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors font-bold"
                            title="Dispatch Report to Patient"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {rep.reportStatus === 'PENDING' && (
                          <button
                            onClick={() => onOpenUploadModal(rep)}
                            className="p-1.5 text-brand-slate-500 hover:text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg transition-colors"
                            title="Upload Draft Report"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-brand-slate-400">
                    No diagnostic reports match your current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-3 border-t border-brand-slate-200 bg-brand-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-brand-slate-500">
            Showing <strong className="text-brand-navy-900">{Math.min(filteredReports.length, (currentPage - 1) * itemsPerPage + 1)}</strong> to{' '}
            <strong className="text-brand-navy-900">{Math.min(filteredReports.length, currentPage * itemsPerPage)}</strong> of{' '}
            <strong className="text-brand-navy-900">{filteredReports.length}</strong> reports
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
