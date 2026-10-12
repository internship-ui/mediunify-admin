import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Info,
  Stethoscope
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function PharmacyPrescriptionsView({
  prescriptions = [],
  onOpenPrescriptionDetails
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered list
  const filteredPrescriptions = prescriptions.filter((p) => {
    const matchesSearch =
      (p.prescriptionId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.doctorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.relatedOrderId || '').toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTab = true;
    if (activeTab === 'pending') {
      matchesTab = p.verificationStatus === 'Pending Verification';
    } else if (activeTab === 'verified') {
      matchesTab = p.verificationStatus === 'Verified';
    } else if (activeTab === 'rejected') {
      matchesTab = p.verificationStatus === 'Rejected';
    }

    return matchesSearch && matchesTab;
  });

  const tabs = [
    { id: 'all', label: 'All Prescriptions', count: prescriptions.length },
    {
      id: 'pending',
      label: 'Pending Verification',
      count: prescriptions.filter((p) => p.verificationStatus === 'Pending Verification').length,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'verified',
      label: 'Verified & Approved',
      count: prescriptions.filter((p) => p.verificationStatus === 'Verified').length,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'rejected',
      label: 'Rejected',
      count: prescriptions.filter((p) => p.verificationStatus === 'Rejected').length,
      badgeColor: 'bg-rose-100 text-rose-800'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-brand-teal-700">
              <FileCheck className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-brand-navy-900">Prescription Verification Queue Monitoring</h1>
              <p className="text-xs text-brand-slate-500">
                Track doctor prescription verification, Schedule H validations, and approvals by Central Hub pharmacists
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-slate-100 border border-brand-slate-200 rounded-xl text-xs text-brand-slate-700 font-medium">
          <ShieldCheck className="w-4 h-4 text-brand-teal-700" />
          <span>Monitoring Mode (Verification at Hub)</span>
        </div>
      </div>

      {/* Info notice */}
      <div className="bg-brand-slate-50 border border-brand-slate-200 p-4 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-teal-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-brand-slate-600 leading-relaxed">
          <strong className="text-brand-navy-900">Compliance & Regulatory Separation:</strong> Digital prescription approvals, doctor signature validation, and drug dosage scrutiny are legally authorized actions performed by licensed pharmacists inside the <strong>Pharmacy Hub Application</strong>. Admin retains audit visibility.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-brand-slate-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-teal-700 text-white shadow-xs'
                  : 'text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-2 py-0.5 text-[11px] rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : tab.badgeColor || 'bg-brand-slate-200 text-brand-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Prescription ID, Patient, Doctor, or Related Order..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500 bg-brand-slate-50/50"
          />
        </div>

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-brand-teal-700 font-bold hover:underline px-2"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Prescription Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-brand-slate-50/80 border-b border-brand-slate-200 text-brand-slate-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Prescription ID</th>
                <th className="py-3.5 px-3">Patient</th>
                <th className="py-3.5 px-3">Doctor & Clinic</th>
                <th className="py-3.5 px-3">Prescription Date</th>
                <th className="py-3.5 px-3">Related Order</th>
                <th className="py-3.5 px-3 text-center">Verification Status</th>
                <th className="py-3.5 px-3 text-center">Current Order Stage</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredPrescriptions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-brand-slate-400">
                    <FileCheck className="w-8 h-8 mx-auto mb-2 opacity-40 text-brand-slate-400" />
                    <p className="font-bold text-sm text-brand-navy-900">No prescriptions found</p>
                    <p className="text-xs text-brand-slate-500 mt-0.5">Try changing your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredPrescriptions.map((rx) => (
                  <tr
                    key={rx.prescriptionId}
                    className="hover:bg-brand-slate-50/60 transition-colors group cursor-pointer"
                    onClick={() => onOpenPrescriptionDetails(rx)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-brand-teal-900">
                      {rx.prescriptionId}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-brand-navy-900">{rx.patientName}</div>
                      <div className="text-[10px] text-brand-slate-400">{rx.patientId}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-brand-navy-900 flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-brand-teal-700" />
                        <span>{rx.doctorName}</span>
                      </div>
                      <p className="text-[10px] text-brand-slate-400">{rx.hospital} ({rx.doctorRegNo})</p>
                    </td>

                    <td className="py-3 px-3 text-brand-slate-600 font-medium">
                      {rx.prescriptionDate}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-brand-slate-100 text-brand-slate-700">
                        {rx.relatedOrderId}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={rx.verificationStatus} size="xs" />
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-slate-100 text-brand-slate-700">
                        {rx.currentOrderStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenPrescriptionDetails(rx)}
                        className="px-3 py-1 text-xs font-bold text-brand-teal-800 bg-brand-teal-50 hover:bg-brand-teal-100 rounded-lg border border-brand-teal-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Rx</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
