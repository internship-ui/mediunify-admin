import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Server,
  CalendarCheck2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function RadiologyCentersView({
  centers = [],
  machines = [],
  orders = [],
  onOpenAddCenter,
  onOpenEditCenter,
  onToggleCenterStatus,
  onViewCenterMachines
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCenters = centers.filter((c) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
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
            Radiology & Diagnostic Imaging Centers
          </h1>
          <p className="text-xs text-brand-slate-500">
            Manage multi-center imaging networks, enabled modalities, machine suites, and operational schedules
          </p>
        </div>

        <button
          onClick={onOpenAddCenter}
          className="px-4 py-2 bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Register New Center
        </button>
      </div>

      {/* Centers Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredCenters.map((center) => {
          const centerMachines = machines.filter(
            (m) => m.centerId === center.id || m.centerName.includes(center.name.split('-')[0])
          );

          return (
            <div
              key={center.id}
              className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                
                {/* Center Title Row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-brand-slate-100 text-brand-navy-900 border border-brand-slate-200">
                      {center.code}
                    </span>
                    <h3 className="text-base font-extrabold text-brand-navy-900 mt-1">
                      {center.name}
                    </h3>
                  </div>

                  <StatusBadge status={center.status} size="sm" />
                </div>

                {/* Location & Contact Info */}
                <div className="space-y-1.5 text-xs text-brand-slate-600 bg-brand-slate-50/70 p-3 rounded-xl border border-brand-slate-200/80">
                  <p className="flex items-start gap-1.5 text-brand-slate-700 font-medium">
                    <MapPin className="w-4 h-4 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{center.address}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-brand-slate-500">
                    <p className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-brand-slate-400" />
                      <span>{center.contactNumber}</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-slate-400" />
                      <span>{center.operatingHours}</span>
                    </p>
                  </div>
                </div>

                {/* Enabled Modalities (Center → Service Relationship) */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block mb-1.5">
                    Available Imaging Modalities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {center.availableServices.map((svc) => (
                      <span
                        key={svc}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-navy-50 text-brand-navy-900 border border-brand-navy-200"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-brand-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onViewCenterMachines(center.name)}
                  className="text-xs font-bold text-brand-teal-700 hover:underline flex items-center gap-1"
                >
                  <Server className="w-3.5 h-3.5" /> View Sub Scans ({centerMachines.length})
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onToggleCenterStatus(center.id)}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-colors ${
                      center.status === 'Active'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {center.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    onClick={() => onOpenEditCenter(center)}
                    className="p-1.5 text-brand-slate-500 hover:text-brand-navy-900 hover:bg-brand-slate-100 rounded-lg border border-brand-slate-200 transition-colors"
                    title="Edit Center"
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
