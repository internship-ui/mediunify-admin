import React, { useState } from 'react';
import {
  Server,
  Plus,
  Edit2,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Activity,
  Cpu,
  Search
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function RadiologyMachinesView({
  machines = [],
  orders = [],
  onOpenAddMachine,
  onOpenEditMachine,
  onOpenMaintenanceModal,
  onToggleMachineStatus
}) {
  const [selectedModality, setSelectedModality] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const MODALITIES = ['ALL', 'MRI', 'CT Scan', 'X-Ray', 'Ultrasound', 'Mammography', 'DEXA'];

  const filteredMachines = machines.filter((m) => {
    if (selectedModality !== 'ALL' && m.modality !== selectedModality) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.room.toLowerCase().includes(q) ||
        m.centerName.toLowerCase().includes(q) ||
        m.technologist?.toLowerCase().includes(q)
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
            Radiology Machine Suites & Hardware Fleet
          </h1>
          <p className="text-xs text-brand-slate-500">
            Monitor high-field 3T MRI gantries, multi-slice CT scanners, DR X-ray suites, cryogenic sensors, and maintenance downtime
          </p>
        </div>

        <button
          onClick={onOpenAddMachine}
          className="px-4 py-2 bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Machine Suite
        </button>
      </div>

      {/* Modality Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {MODALITIES.map((mod) => {
            const count = mod === 'ALL' ? machines.length : machines.filter((m) => m.modality === mod).length;
            const isActive = selectedModality === mod;

            return (
              <button
                key={mod}
                onClick={() => setSelectedModality(mod)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
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

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search machine, suite room, center..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 font-medium"
          />
        </div>
      </div>

      {/* Machine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMachines.map((machine) => {
          const isMaintenance = machine.status === 'Maintenance';
          const isInUse = machine.status === 'In Use';

          return (
            <div
              key={machine.id}
              className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-brand-navy-50 text-brand-navy-900 border border-brand-navy-200">
                        {machine.modality}
                      </span>
                      <span className="text-[11px] text-brand-slate-400 font-mono">{machine.id}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-brand-navy-900 mt-1">
                      {machine.name}
                    </h3>
                  </div>

                  <StatusBadge status={machine.status} size="xs" />
                </div>

                {/* Center & Room Location */}
                <div className="p-2.5 bg-brand-slate-50 rounded-xl border border-brand-slate-200/80 space-y-1 text-xs text-brand-slate-600">
                  <p className="font-bold text-brand-navy-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-brand-teal-600" />
                    {machine.centerName?.split('-')[0]}
                  </p>
                  <p className="text-[11px] text-brand-slate-500">Suite Location: <strong>{machine.room}</strong></p>
                </div>

                {/* Telemetry & Sensors */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-brand-slate-50 rounded-lg border border-brand-slate-200">
                    <span className="text-brand-slate-400 block text-[10px]">Cryo / Sensor Temp:</span>
                    <strong className="text-brand-teal-800">{machine.cryoTemp || 'Optimal'}</strong>
                  </div>
                  <div className="p-2 bg-brand-slate-50 rounded-lg border border-brand-slate-200">
                    <span className="text-brand-slate-400 block text-[10px]">Uptime Rate:</span>
                    <strong className="text-emerald-700">{machine.uptime || '99.5%'}</strong>
                  </div>
                </div>

                {/* Duty Technologist */}
                <div className="text-[11px] text-brand-slate-600">
                  <span className="text-brand-slate-400">Duty Radiographer: </span>
                  <strong className="text-brand-navy-900">{machine.technologist}</strong>
                </div>

                {/* Maintenance / Operational remarks */}
                {machine.maintenanceStatus && (
                  <p className="text-[10px] text-brand-slate-500 italic bg-white p-1.5 rounded border border-brand-slate-200">
                    Status Note: {machine.maintenanceStatus}
                  </p>
                )}

              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-brand-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onOpenMaintenanceModal(machine)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-colors flex items-center gap-1 ${
                    isMaintenance
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {isMaintenance ? 'End Maintenance' : 'Schedule Maintenance'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenEditMachine(machine)}
                    className="p-1.5 text-brand-slate-500 hover:text-brand-navy-900 hover:bg-brand-slate-100 rounded-lg border border-brand-slate-200 transition-colors"
                    title="Edit Machine"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
