import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Eye,
  Send,
  UserCheck,
  ShieldCheck,
  Filter
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function RadiologyReportsView({
  reports = [],
  orders = [],
  onOpenUploadModal,
  onOpenReviewModal,
  onOpenPreviewModal,
  onSendReportToPatient
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const STATUS_TABS = ['ALL', 'UNDER REVIEW', 'VERIFIED', 'DELIVERED', 'REJECTED'];

  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      if (statusFilter !== 'ALL' && rep.reportStatus !== statusFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchId = rep.reportId?.toLowerCase().includes(q);
        const matchPatient = rep.patientName?.toLowerCase().includes(q);
        const matchScan = rep.scanName?.toLowerCase().includes(q);
        const matchDoc = rep.verifiedBy?.toLowerCase().includes(q);
        if (!matchId && !matchPatient && !matchScan && !matchDoc) return false;
      }
      return true;
    });
  }, [reports, statusFilter, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-brand-navy-900 tracking-tight">
            Diagnostic Radiology Reports Hub
          </h1>
          <p className="text-xs text-brand-slate-500">
            PACS report compilation, consultant radiologist clinical authorization, cryptographic digital seals, and delivery dispatch
          </p>
        </div>

        <button
          onClick={() => onOpenUploadModal(null)}
          className="px-4 py-2 bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5 transition-colors"
        >
          <Upload className="w-4 h-4" /> Draft / Upload Report
        </button>
      </div>

      {/* Tabs & Search Filter */}
      <div className="p-4 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {STATUS_TABS.map((tab) => {
              const count = tab === 'ALL' ? reports.length : reports.filter((r) => r.reportStatus === tab).length;
              const isActive = statusFilter === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-brand-navy-900 text-white shadow-xs'
                      : 'bg-brand-slate-50 text-brand-slate-600 hover:bg-brand-slate-100'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-brand-slate-200 text-brand-slate-700'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by report ID, patient, scan or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 font-medium"
            />
          </div>

        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-brand-slate-100/90 text-brand-slate-700 font-bold border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-3.5">Report ID</th>
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Patient Name</th>
                <th className="py-3 px-3">Imaging Scan</th>
                <th className="py-3 px-3">Center & Machine</th>
                <th className="py-3 px-3">Consultant Radiologist</th>
                <th className="py-3 px-3 text-center">Report Status</th>
                <th className="py-3 px-3">Uploaded / Date</th>
                <th className="py-3 px-3.5 text-center w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredReports.length > 0 ? (
                filteredReports.map((rep) => (
                  <tr key={rep.reportId} className="hover:bg-brand-slate-50 transition-colors">
                    
                    {/* Report ID */}
                    <td className="py-3 px-3.5 font-mono font-bold text-purple-800">
                      {rep.reportId}
                    </td>

                    {/* Order ID */}
                    <td className="py-3 px-3 font-mono text-brand-slate-600 font-semibold">
                      {rep.orderId || 'RAD-1001'}
                    </td>

                    {/* Patient */}
                    <td className="py-3 px-3">
                      <strong className="text-brand-navy-900 block">{rep.patientName}</strong>
                      <span className="text-[11px] text-brand-slate-400 font-mono">{rep.patientId || 'PT-8801'}</span>
                    </td>

                    {/* Scan */}
                    <td className="py-3 px-3">
                      <p className="font-semibold text-brand-navy-900 truncate max-w-xs">{rep.scanName}</p>
                      <span className="text-[10px] text-brand-teal-700 font-bold">{rep.modality}</span>
                    </td>

                    {/* Center & Machine */}
                    <td className="py-3 px-3">
                      <p className="font-medium text-brand-slate-800 truncate max-w-xs">{rep.centerName?.split('-')[0]}</p>
                      <span className="text-[10px] text-brand-slate-400 truncate block max-w-xs">{rep.machineName}</span>
                    </td>

                    {/* Radiologist */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-brand-navy-900 block">{rep.verifiedBy?.split(',')[0]}</span>
                      <span className="text-[10px] text-emerald-700 font-medium">Digital Signature Attached</span>
                    </td>

                    {/* Report Status */}
                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={rep.reportStatus} size="sm" />
                    </td>

                    {/* Upload Date */}
                    <td className="py-3 px-3 text-[11px] text-brand-slate-500">
                      {rep.uploadedDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenPreviewModal(rep)}
                          className="p-1.5 text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100 rounded-lg border border-brand-slate-200 transition-colors"
                          title="View Official Report PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {rep.reportStatus === 'UNDER REVIEW' && (
                          <button
                            onClick={() => onOpenReviewModal(rep)}
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                            title="Verify & Authorize"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        )}

                        {rep.reportStatus === 'VERIFIED' && (
                          <button
                            onClick={() => onSendReportToPatient(rep.reportId)}
                            className="p-1.5 bg-brand-navy-900 text-white hover:bg-brand-navy-800 rounded-lg shadow-2xs transition-colors"
                            title="Deliver to Patient"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-brand-slate-400">
                    No diagnostic reports found for the selected filter.
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
