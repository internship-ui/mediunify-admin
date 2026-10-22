import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Clock,
  Building2
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function RadiologyMachinesView({
  subScans = [],
  machines = [],
  onOpenAddSubScan,
  onOpenAddMachine,
  onOpenEditSubScan,
  onOpenEditMachine,
  onToggleSubScanStatus,
  onToggleMachineStatus
}) {
  const [selectedModality, setSelectedModality] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Use subScans if provided, fallback to machines
  const rawList = subScans && subScans.length > 0 ? subScans : machines;

  const MODALITIES = ['ALL', 'MRI', 'CT Scan', 'X-Ray', 'Ultrasound', 'Mammography', 'DEXA'];

  const filteredSubScans = useMemo(() => {
    return rawList.filter((item) => {
      if (selectedModality !== 'ALL' && item.modality !== selectedModality) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = item.name?.toLowerCase().includes(q);
        const matchCode = item.code?.toLowerCase().includes(q);
        const matchPart = item.bodyPart?.toLowerCase().includes(q);
        const matchPrep = item.preparation?.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchPart && !matchPrep) return false;
      }
      return true;
    });
  }, [rawList, selectedModality, searchTerm]);

  const handleOpenAdd = onOpenAddSubScan || onOpenAddMachine;
  const handleOpenEdit = onOpenEditSubScan || onOpenEditMachine;
  const handleToggleStatus = onToggleSubScanStatus || onToggleMachineStatus;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-brand-navy-900 tracking-tight">
            Radiology Sub Scans
          </h1>
          <p className="text-xs text-brand-slate-500">
            Configure sub scans across MRI, CT, X-Ray, Ultrasound, Mammography, and DEXA (e.g. Brain, Spine, Legs, Chest)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Sub Scan
        </button>
      </div>

      {/* Modality Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {MODALITIES.map((mod) => {
            const count = mod === 'ALL'
              ? rawList.length
              : rawList.filter((m) => m.modality === mod).length;
            const isActive = selectedModality === mod;

            return (
              <button
                key={mod}
                onClick={() => setSelectedModality(mod)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-brand-teal-600 text-white shadow-xs'
                    : 'bg-brand-slate-50 text-brand-slate-600 hover:bg-brand-slate-100'
                }`}
              >
                <span>{mod}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-brand-slate-200 text-brand-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search sub scan (e.g. Brain, Spine, Legs)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 font-medium"
          />
        </div>
      </div>

      {/* Sub Scans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubScans.map((subScan) => (
          <div
            key={subScan.id}
            className="p-5 bg-white rounded-2xl border border-brand-slate-200/90 shadow-2xs hover:shadow-md hover:border-brand-teal-300 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              
              {/* Header: Modality + Code on left, Status on right */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-navy-50 text-brand-navy-900 border border-brand-navy-200 uppercase tracking-wider">
                    {subScan.modality}
                  </span>
                  <span className="text-[11px] font-mono text-brand-slate-400 font-semibold">
                    {subScan.code || subScan.id}
                  </span>
                </div>

                <StatusBadge status={subScan.status} size="xs" />
              </div>

              {/* Sub Scan Title & Target Body Part */}
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-brand-navy-900 group-hover:text-brand-teal-800 transition-colors leading-snug">
                  {subScan.name}
                </h3>
                {subScan.bodyPart && (
                  <p className="text-xs text-brand-teal-700 font-semibold mt-1">
                    Target: <span className="text-brand-slate-700 font-medium">{subScan.bodyPart}</span>
                  </p>
                )}
              </div>

              {/* Specs: Duration, Preparation & Centers */}
              <div className="space-y-2 pt-2 border-t border-brand-slate-100 text-xs text-brand-slate-600">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-brand-slate-500">
                    <Clock className="w-3.5 h-3.5 text-brand-slate-400" />
                    <span>Duration:</span>
                  </span>
                  <strong className="text-brand-navy-900 font-bold">{subScan.duration || '25 min'}</strong>
                </div>

                {subScan.preparation && (
                  <p className="text-[11px] text-brand-slate-500 bg-brand-slate-50 p-2 rounded-lg border border-brand-slate-150 line-clamp-2">
                    <strong className="text-brand-slate-700">Prep: </strong>{subScan.preparation}
                  </p>
                )}

                {subScan.centers && (
                  <div className="flex items-center gap-1 text-[10px] text-brand-slate-400">
                    <Building2 className="w-3 h-3 text-brand-slate-400 flex-shrink-0" />
                    <span className="truncate">
                      {Array.isArray(subScan.centers) ? subScan.centers.join(', ') : subScan.centers}
                    </span>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-3.5 mt-3.5 border-t border-brand-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-brand-slate-400">
                {subScan.id}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleStatus(subScan.id)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    subScan.status === 'Active' || subScan.status === 'Available'
                      ? 'bg-white hover:bg-brand-slate-50 text-brand-slate-600 border-brand-slate-200'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {subScan.status === 'Active' || subScan.status === 'Available' ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={() => handleOpenEdit(subScan)}
                  className="p-1.5 text-brand-slate-600 hover:text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg border border-brand-slate-200 transition-colors cursor-pointer"
                  title="Edit Sub Scan"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
