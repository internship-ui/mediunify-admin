import React, { useState, useMemo } from 'react';
import {
  Pipette,
  Search,
  Filter,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSpreadsheet,
  Clock,
  UserCheck,
  Building2,
  TestTube2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { exportToExcel } from '../../../utils/reportExportEngine';
import { useToast } from '../../../context/ToastContext';
import { LAB_CENTERS, COLLECTION_STAFF } from '../../../data/labData';

const SAMPLE_STATUS_TABS = [
  { id: 'ALL', label: 'All Samples' },
  { id: 'PENDING COLLECTION', label: 'Pending Draw' },
  { id: 'ASSIGNED', label: 'Assigned' },
  { id: 'COLLECTED', label: 'Collected / Transit' },
  { id: 'RECEIVED', label: 'Received at Lab' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'REJECTED', label: 'Rejected' }
];

export default function LabSampleManagementView({
  samples = [],
  onOpenRejectModal,
  onAdvanceSampleStatus
}) {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [centerFilter, setCenterFilter] = useState('ALL');
  const [staffFilter, setStaffFilter] = useState('ALL');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter samples
  const filteredSamples = useMemo(() => {
    return samples.filter((sample) => {
      if (activeTab !== 'ALL') {
        if (activeTab === 'RECEIVED' && (sample.sampleStatus === 'RECEIVED' || sample.sampleStatus === 'PROCESSING')) {
          // match
        } else if (sample.sampleStatus !== activeTab) {
          return false;
        }
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchId = sample.sampleId?.toLowerCase().includes(q);
        const matchOrder = sample.orderId?.toLowerCase().includes(q);
        const matchPatient = sample.patientName?.toLowerCase().includes(q);
        const matchBarcode = sample.barcode?.toLowerCase().includes(q);
        const matchTest = sample.testName?.toLowerCase().includes(q);
        if (!matchId && !matchOrder && !matchPatient && !matchBarcode && !matchTest) return false;
      }

      if (centerFilter !== 'ALL' && !sample.center?.includes(centerFilter)) {
        return false;
      }

      if (staffFilter !== 'ALL' && sample.collectionStaff !== staffFilter) {
        return false;
      }

      return true;
    });
  }, [samples, activeTab, searchTerm, centerFilter, staffFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredSamples.length / itemsPerPage));
  const paginatedSamples = filteredSamples.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleResetFilters = () => {
    setActiveTab('ALL');
    setSearchTerm('');
    setCenterFilter('ALL');
    setStaffFilter('ALL');
    setCurrentPage(1);
    addToast('Sample filters reset', 'info');
  };

  const handleExportExcel = () => {
    const exportData = filteredSamples.map((s) => ({
      'Sample ID': s.sampleId,
      'Order ID': s.orderId,
      'Patient Name': s.patientName,
      'Test / Investigation': s.testName,
      'Sample Type': s.sampleType,
      'Tube / Container': s.tubeContainer,
      'Barcode': s.barcode,
      'Collection Staff': s.collectionStaff,
      'Collection Time': s.collectionTime,
      'Processing Center': s.center,
      'Sample Status': s.sampleStatus,
      'Rejection Reason': s.rejectionReason || ''
    }));
    exportToExcel(exportData, 'MediUnify_Physical_Samples_Tracking');
    addToast('Exported samples log to Excel spreadsheet', 'success');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-navy-900 tracking-tight">
            Specimens & Samples
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-brand-slate-50 text-brand-slate-700 text-xs font-semibold rounded-xl border border-brand-slate-200 shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Sample Log
          </button>
        </div>
      </div>

      {/* Sub-navigation Status Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-brand-slate-200 bg-white p-2 rounded-xl border">
        {SAMPLE_STATUS_TABS.map((tab) => {
          const count = samples.filter((s) => {
            if (tab.id === 'ALL') return true;
            if (tab.id === 'RECEIVED' && (s.sampleStatus === 'RECEIVED' || s.sampleStatus === 'PROCESSING')) return true;
            return s.sampleStatus === tab.id;
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Sample ID, Order ID, Barcode, Patient..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            />
          </div>

          {/* Center */}
          <div>
            <select
              value={centerFilter}
              onChange={(e) => {
                setCenterFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            >
              <option value="ALL">All Lab Centers</option>
              {LAB_CENTERS.map((c) => (
                <option key={c.id} value={c.name.split('-')[0]}>
                  {c.name.split('-')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Phlebotomist */}
          <div>
            <select
              value={staffFilter}
              onChange={(e) => {
                setStaffFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            >
              <option value="ALL">All Collection Staff</option>
              {COLLECTION_STAFF.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-brand-slate-500 pt-1">
          <span>Tracking <strong>{filteredSamples.length}</strong> biological sample records</span>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 font-bold text-brand-teal-700 hover:text-brand-teal-800"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Samples Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-brand-slate-100 text-brand-slate-700 font-bold border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-3.5">Sample ID & Barcode</th>
                <th className="py-3 px-3">Order & Patient</th>
                <th className="py-3 px-3">Test / Panel</th>
                <th className="py-3 px-3">Sample Type & Tubes</th>
                <th className="py-3 px-3">Phlebotomist Staff</th>
                <th className="py-3 px-3">Collection Timestamp</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3.5 text-center w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {paginatedSamples.length > 0 ? (
                paginatedSamples.map((sample) => (
                  <tr key={sample.sampleId} className="hover:bg-brand-slate-50/80 transition-colors">
                    {/* Sample ID & Barcode */}
                    <td className="py-3 px-3.5 font-mono">
                      <p className="font-bold text-brand-teal-700 text-sm">{sample.sampleId}</p>
                      <p className="text-[10px] text-brand-slate-400">Barcode: {sample.barcode || 'BC200199'}</p>
                    </td>

                    {/* Order & Patient */}
                    <td className="py-3 px-3">
                      <p className="font-bold text-brand-navy-900">{sample.patientName}</p>
                      <p className="text-[11px] text-brand-slate-400 font-mono">
                        Order: <strong className="text-brand-slate-600">{sample.orderId}</strong>
                      </p>
                    </td>

                    {/* Test */}
                    <td className="py-3 px-3 font-semibold text-brand-navy-900 max-w-xs truncate" title={sample.testName}>
                      {sample.testName}
                    </td>

                    {/* Sample Type & Tube */}
                    <td className="py-3 px-3">
                      <p className="font-medium text-brand-slate-800">{sample.sampleType}</p>
                      <p className="text-[10px] text-brand-slate-400 font-mono truncate max-w-[180px]" title={sample.tubeContainer}>
                        {sample.tubeContainer}
                      </p>
                    </td>

                    {/* Staff */}
                    <td className="py-3 px-3">
                      {sample.collectionStaff && sample.collectionStaff !== 'Unassigned' ? (
                        <span className="font-semibold text-brand-slate-800 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-brand-teal-600" />
                          {sample.collectionStaff}
                        </span>
                      ) : (
                        <span className="text-amber-600 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Time */}
                    <td className="py-3 px-3 text-brand-slate-600 font-medium">
                      {sample.collectionTime}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={sample.sampleStatus} size="xs" />
                      {sample.rejectionReason && (
                        <p className="text-[10px] text-brand-coral-600 mt-0.5 truncate max-w-[120px]" title={sample.rejectionReason}>
                          {sample.rejectionReason}
                        </p>
                      )}
                    </td>

                    {/* Contextual Actions */}
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {sample.sampleStatus === 'ASSIGNED' && (
                          <button
                            onClick={() => onAdvanceSampleStatus(sample.sampleId, 'COLLECTED')}
                            className="px-2 py-1 bg-brand-teal-50 text-brand-teal-700 hover:bg-brand-teal-100 font-bold rounded-lg text-[11px] border border-brand-teal-200"
                          >
                            Mark Collected
                          </button>
                        )}

                        {sample.sampleStatus === 'COLLECTED' && (
                          <button
                            onClick={() => onAdvanceSampleStatus(sample.sampleId, 'RECEIVED')}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg text-[11px] border border-emerald-200"
                          >
                            Mark Received
                          </button>
                        )}

                        {sample.sampleStatus === 'RECEIVED' && (
                          <button
                            onClick={() => onAdvanceSampleStatus(sample.sampleId, 'PROCESSING')}
                            className="px-2 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold rounded-lg text-[11px] border border-purple-200"
                          >
                            Start Run
                          </button>
                        )}

                        {sample.sampleStatus !== 'REJECTED' && sample.sampleStatus !== 'COMPLETED' && (
                          <button
                            onClick={() => onOpenRejectModal(sample)}
                            className="p-1.5 text-brand-coral-600 hover:bg-brand-coral-50 rounded-lg transition-colors"
                            title="Reject Sample (Pre-Analytical Failure)"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {sample.sampleStatus === 'COMPLETED' && (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Tested
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-brand-slate-400">
                    No samples match your current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-3 border-t border-brand-slate-200 bg-brand-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-brand-slate-500">
            Showing <strong className="text-brand-navy-900">{Math.min(filteredSamples.length, (currentPage - 1) * itemsPerPage + 1)}</strong> to{' '}
            <strong className="text-brand-navy-900">{Math.min(filteredSamples.length, currentPage * itemsPerPage)}</strong> of{' '}
            <strong className="text-brand-navy-900">{filteredSamples.length}</strong> samples
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
