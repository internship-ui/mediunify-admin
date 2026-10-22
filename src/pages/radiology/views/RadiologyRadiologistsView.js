import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Edit2,
  Building2,
  Award,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  FileText,
  Search
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function RadiologyRadiologistsView({
  radiologists = [],
  onOpenAddRadiologist,
  onOpenEditRadiologist,
  onToggleAvailability
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRadiologists = radiologists.filter((r) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.specialization.toLowerCase().includes(q) ||
        r.radiologistId.toLowerCase().includes(q) ||
        r.center.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-brand-navy-900 tracking-tight">
            Consultant Radiologists & Diagnostic Roster
          </h1>
          <p className="text-xs text-brand-slate-500">
            Manage medical specialist credentials, sub-specialty assignments, workload queues and live reporting availability
          </p>
        </div>

        <button
          onClick={onOpenAddRadiologist}
          className="px-4 py-2 bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Onboard Radiologist
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search radiologist by name, specialty, ID or center..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 font-medium"
          />
        </div>

        <span className="text-xs font-semibold text-brand-slate-500">
          Total Specialists: <strong className="text-brand-navy-900">{radiologists.length}</strong>
        </span>
      </div>

      {/* Radiologists Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRadiologists.map((doc) => {
          const isAvailable = doc.availability === 'Available';

          return (
            <div
              key={doc.id}
              className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-navy-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {doc.name.split(' ')[1]?.slice(0, 2)?.toUpperCase() || 'DR'}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-brand-navy-900">
                        {doc.name}
                      </h3>
                      <p className="text-[11px] font-mono text-brand-teal-700 font-bold">{doc.radiologistId}</p>
                    </div>
                  </div>

                  <StatusBadge status={doc.availability} size="xs" />
                </div>

                {/* Sub-Specialization & Center */}
                <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200/80 space-y-1.5 text-xs">
                  <div>
                    <span className="text-brand-slate-400 block text-[10px] uppercase font-bold">Sub-Specialization:</span>
                    <strong className="text-brand-navy-900 text-[11px]">{doc.specialization}</strong>
                  </div>

                  <div>
                    <span className="text-brand-slate-400 block text-[10px] uppercase font-bold">Primary Base Center:</span>
                    <span className="text-brand-slate-700 font-medium text-[11px] truncate block">
                      {doc.center?.split('-')[0]}
                    </span>
                  </div>
                </div>

                {/* Workload Stats */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-purple-50 rounded-lg border border-purple-200 text-purple-900">
                    <strong className="text-base font-extrabold text-purple-800">{doc.pendingReports}</strong>
                    <p className="text-[10px] text-purple-700 font-semibold">Reports In Queue</p>
                  </div>
                  <div className="p-2 bg-brand-slate-50 rounded-lg border border-brand-slate-200">
                    <strong className="text-base font-extrabold text-brand-navy-900">{doc.completedReports}</strong>
                    <p className="text-[10px] text-brand-slate-500 font-medium">Completed All-Time</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="text-[11px] text-brand-slate-500 space-y-0.5 pt-1">
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-slate-400" />
                    <span>{doc.phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-brand-slate-400" />
                    <span>{doc.email}</span>
                  </p>
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-brand-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onToggleAvailability(doc.id)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-colors ${
                    isAvailable
                      ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {isAvailable ? 'Mark Busy / Offline' : 'Mark Available'}
                </button>

                <button
                  type="button"
                  onClick={() => onOpenEditRadiologist(doc)}
                  className="p-1.5 text-brand-slate-500 hover:text-brand-navy-900 hover:bg-brand-slate-100 rounded-lg border border-brand-slate-200 transition-colors"
                  title="Edit Radiologist"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
