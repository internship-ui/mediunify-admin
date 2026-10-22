import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  UserCheck,
  CheckCircle2,
  Clock,
  HeartHandshake,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import StatCard from '../../../components/common/StatCard';
import StatusBadge from '../../../components/common/StatusBadge';
import { exportToExcel, exportToPDF, filterDataByDate } from '../../../utils/reportExportEngine';
import { useToast } from '../../../context/ToastContext';

export default function HomeCareReportsView({ requests = [], nurses = [] }) {
  const { addToast } = useToast();
  const [datePreset, setDatePreset] = useState('all');

  // Filtered by date
  const filteredRequests = useMemo(() => {
    return filterDataByDate(requests, 'requestedDate', datePreset);
  }, [requests, datePreset]);

  const totalRequests = filteredRequests.length;
  const nurseAssignedCount = filteredRequests.filter(r => r.assignedNurse !== null || (r.status && (r.status.includes('Assigned') || r.status.includes('Scheduled')))).length;
  const completedCount = filteredRequests.filter(r => r.status === 'Completed').length;
  const newCount = filteredRequests.filter(r => r.status === 'New').length;

  const handleExportExcel = () => {
    if (filteredRequests.length === 0) {
      addToast('No care requests to export matching current date filter', 'warning');
      return;
    }

    const cols = [
      { header: 'Request ID', key: 'id', width: 16 },
      { header: 'Patient Name', key: 'patientName', width: 22 },
      { header: 'Contact Number', key: 'contactNumber', width: 18 },
      { header: 'Address / Locality', key: 'address', width: 26 },
      { header: 'Service Required', key: 'serviceRequired', width: 24 },
      { header: 'Specialization', key: 'specializationRequired', width: 22 },
      { header: 'Requested Date', key: 'requestedDate', width: 15 },
      { header: 'Slot Time', key: 'requestedTime', width: 14 },
      { header: 'Lifecycle Status', key: 'status', width: 16 },
      { header: 'Assigned Nurse', key: 'assignedNurseName', width: 22 }
    ];

    const dataRows = filteredRequests.map(r => ({
      ...r,
      assignedNurseName: r.assignedNurse ? r.assignedNurse.name : (r.assignedNurseName || 'Unassigned')
    }));

    exportToExcel({
      filename: `MediUnify_HomeCare_Report_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Home Care Visits',
      title: 'Home Nursing & Attendant Service Request Ledger',
      columns: cols,
      data: dataRows,
      metadata: {
        portal: 'Home Care & Nursing Portal',
        dateRange: datePreset === 'all' ? 'All Records' : datePreset
      }
    });

    addToast(`Excel spreadsheet downloaded with ${filteredRequests.length} Home Care records.`, 'success');
  };

  const handleExportPDF = () => {
    if (filteredRequests.length === 0) {
      addToast('No care requests to export matching current date filter', 'warning');
      return;
    }

    const cols = [
      { header: 'Req ID', key: 'id' },
      { header: 'Patient Name', key: 'patientName' },
      { header: 'Nursing Service', key: 'serviceRequired' },
      { header: 'Location', key: 'address' },
      { header: 'Date', key: 'requestedDate' },
      { header: 'Status', key: 'status' },
      { header: 'Assigned Nurse', key: 'assignedNurseName' }
    ];

    const dataRows = filteredRequests.map(r => ({
      ...r,
      assignedNurseName: r.assignedNurse ? r.assignedNurse.name : (r.assignedNurseName || 'Unassigned')
    }));

    exportToPDF({
      filename: `MediUnify_HomeCare_Report_${new Date().toISOString().slice(0, 10)}.pdf`,
      title: 'Home Care & Nursing Operations Ledger',
      subtitle: 'Patient Requests, Nurse Assignment & Dispatch Status',
      columns: cols,
      data: dataRows,
      summaryCards: [
        { label: 'Total Requests', value: totalRequests },
        { label: 'Nurse Assigned', value: nurseAssignedCount },
        { label: 'Completed Visits', value: completedCount },
        { label: 'Registered Nurses', value: nurses.length }
      ],
      metadata: {
        portal: 'Home Care & Nursing Portal',
        dateRange: datePreset === 'all' ? 'All Records' : datePreset
      }
    });

    addToast(`PDF report generated for Home Care (${filteredRequests.length} visits).`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-brand-green-700" />
            Home Care Operations & Fulfillment Report
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Summary of patient service requests, nurse assignment rates, and visit completion metrics.
          </p>
        </div>

        {/* Dual Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 text-xs font-bold shadow-xs transition-all"
            title="Download report in Microsoft Excel (.xlsx) format"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel (.xlsx)</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-coral-600 text-white rounded-xl hover:bg-brand-coral-700 text-xs font-bold shadow-xs transition-all"
            title="Download report in PDF document format"
          >
            <FileText className="w-4 h-4" />
            <span>PDF (.pdf)</span>
          </button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
        <span className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-brand-green-700" /> Date Scope:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All Time' },
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: '7days', label: 'Last 7 Days' },
            { id: '30days', label: 'Last 30 Days' },
            { id: 'thisMonth', label: 'This Month' }
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setDatePreset(preset.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                datePreset === preset.id
                  ? 'bg-brand-green-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Service Requests"
          value={totalRequests}
          subtitle="All patient inquiries"
          iconName="ClipboardList"
          colorScheme="navy"
        />
        <StatCard
          title="Nurse Assignment Rate"
          value={`${Math.round((nurseAssignedCount / totalRequests) * 100)}%`}
          subtitle="Assigned after nurse call"
          iconName="UserCheck"
          colorScheme="green"
        />
        <StatCard
          title="Completed Visits"
          value={completedCount}
          subtitle="Verified nurse home visits"
          iconName="CheckCircle2"
          colorScheme="teal"
        />
        <StatCard
          title="Registered Nurses"
          value={nurses.length}
          subtitle="Active nursing panel"
          iconName="HeartHandshake"
          colorScheme="green"
        />
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Patient Service Requests Log</h2>
          <span className="text-xs text-gray-400">Total {filteredRequests.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Request ID</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Service & Specialization</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Assigned Nurse</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium">
              {filteredRequests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-3 font-mono font-bold text-brand-navy-900">{r.id}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{r.patientName}</td>
                  <td className="px-4 py-3 text-gray-800">{r.serviceRequired} ({r.specializationRequired})</td>
                  <td className="px-4 py-3 text-gray-600">{r.requestedDate} • {r.requestedTime}</td>
                  <td className="px-4 py-3 text-gray-900 font-semibold">
                    {r.assignedNurse ? r.assignedNurse.name : <span className="text-gray-400 font-normal italic">Not Assigned</span>}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} size="xs" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
