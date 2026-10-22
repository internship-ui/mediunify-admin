import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck,
  MapPin,
  FileSpreadsheet,
  Download,
  Activity,
  Eye,
  FileText
} from 'lucide-react';
import { downloadNursingOperationsExcel } from '../../../data/homeNursingData';

export default function CompletedVisitsView({
  requests,
  onViewRequest
}) {
  const completedList = requests.filter((r) => r.status === 'Completed');

  const handleExport = () => {
    downloadNursingOperationsExcel(completedList, 'MediUnify_Completed_Home_Visits');
  };

  return (
    <div className="space-y-6 animate-fade-in text-brand-navy-900">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight">
              Completed Visits & Clinical Archive
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-brand-green-50 text-brand-green-800 border border-brand-green-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-brand-green-600" />
              {completedList.length} Successfully Fulfilled
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate-600 mt-1">
            Historical log of fulfilled clinical visits, caregiver field summaries, and exportable patient records.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-xs transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Completed Visits</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200/90 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-brand-slate-50 border-b border-brand-slate-200/80 text-[11px] font-bold text-brand-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Fulfilled Nursing Service</th>
                <th className="py-3 px-4">Date Completed</th>
                <th className="py-3 px-4">Attending Nurse</th>
                <th className="py-3 px-4">Locality</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">View Archive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {completedList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-brand-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-brand-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">No completed visits recorded yet.</p>
                  </td>
                </tr>
              ) : (
                completedList.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => onViewRequest(req)}
                    className="hover:bg-brand-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-brand-teal-700 whitespace-nowrap">
                      {req.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-black text-brand-navy-950 text-xs sm:text-sm group-hover:text-brand-green-700 transition-colors">
                        {req.patientName}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-brand-navy-900">{req.serviceName}</div>
                      <span className="text-[10px] font-semibold text-brand-slate-500">{req.serviceCategory}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-semibold text-brand-slate-700">
                      {req.preferredDate}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-brand-teal-800 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-brand-teal-600" />
                        {req.assignedStaff}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-coral-600" />
                        {req.location}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-green-50 text-brand-green-800 border border-brand-green-200">
                        Completed
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onViewRequest(req)}
                        className="px-2.5 py-1 text-xs font-bold text-brand-green-800 bg-brand-green-50 hover:bg-brand-green-100 border border-brand-green-200 rounded-lg inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Summary</span>
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
