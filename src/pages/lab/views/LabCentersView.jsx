import React, { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Clock,
  TestTube2,
  Home,
  Edit3,
  Power,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { exportToExcel } from '../../../utils/reportExportEngine';
import { useToast } from '../../../context/ToastContext';

export default function LabCentersView({
  centers = [],
  onOpenAddCenter,
  onOpenEditCenter,
  onToggleCenterStatus
}) {
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredCenters = useMemo(() => {
    return centers.filter((center) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = center.name?.toLowerCase().includes(q);
        const matchCode = center.code?.toLowerCase().includes(q);
        const matchAddress = center.address?.toLowerCase().includes(q);
        const matchManager = center.managerName?.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchAddress && !matchManager) return false;
      }

      if (statusFilter !== 'ALL' && center.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [centers, searchTerm, statusFilter]);

  const handleExportExcel = () => {
    const exportData = filteredCenters.map((c) => ({
      'Center Code': c.code,
      'Center Name': c.name,
      'Address': c.address,
      'City': c.city,
      'Contact Phone': c.contactPhone,
      'Contact Email': c.contactEmail,
      'Operating Hours': c.operatingHours,
      'Available Tests': c.availableTestsCount,
      'Home Collection Hub': c.homeCollectionHub ? 'Yes' : 'No',
      'Manager': c.managerName,
      'Status': c.status
    }));
    exportToExcel(exportData, 'MediUnify_Mysuru_Lab_Centers');
    addToast('Exported lab centers directory to Excel', 'success');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-navy-900 tracking-tight">
            Centers & Hubs
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-brand-slate-50 text-brand-slate-700 text-xs font-semibold rounded-xl border border-brand-slate-200 shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Centers
          </button>
          <button
            onClick={onOpenAddCenter}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Lab Center
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-brand-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Center Name, Code, Address, Manager..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            />
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            >
              <option value="ALL">All Operational Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Temporarily Closed">Temporarily Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Centers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCenters.map((center) => (
          <div
            key={center.id}
            className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs hover:shadow-md hover:border-brand-teal-300 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 space-y-3">
              {/* Header: Name & Code */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-brand-teal-50 text-brand-teal-700 rounded-xl border border-brand-teal-200">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-brand-navy-900 text-sm">{center.name}</h3>
                    <p className="text-[11px] text-brand-slate-400 font-mono">Code: {center.code}</p>
                  </div>
                </div>
                <StatusBadge status={center.status} size="xs" />
              </div>

              {/* Address & Hours */}
              <div className="space-y-1.5 text-xs text-brand-slate-600">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                  <span>{center.address}, {center.city}</span>
                </p>
                <p className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-brand-slate-400" />
                  {center.operatingHours}
                </p>
                <p className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-brand-slate-400" />
                  {center.contactPhone}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-slate-100 text-xs">
                <div className="bg-brand-slate-50 p-2 rounded-xl border border-brand-slate-200/60">
                  <span className="text-[10px] text-brand-slate-400 block font-bold uppercase">Available Tests</span>
                  <strong className="text-brand-navy-900">{center.availableTestsCount}+ Panels</strong>
                </div>

                <div className="bg-brand-slate-50 p-2 rounded-xl border border-brand-slate-200/60">
                  <span className="text-[10px] text-brand-slate-400 block font-bold uppercase">Home Fleet Hub</span>
                  <strong className={center.homeCollectionHub ? 'text-emerald-700' : 'text-brand-slate-500'}>
                    {center.homeCollectionHub ? 'Active Phlebotomy Base' : 'Walk-in Desk Only'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-3.5 bg-brand-slate-50/80 border-t border-brand-slate-100 flex items-center justify-between text-xs">
              <span className="text-brand-slate-500 text-[11px] truncate max-w-[200px]">
                Incharge: <strong>{center.managerName || 'Center Supervisor'}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenEditCenter(center)}
                  className="px-3 py-1.5 bg-white hover:bg-brand-slate-100 text-brand-slate-700 font-semibold rounded-lg border border-brand-slate-200 transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-brand-slate-400" />
                  Edit Details
                </button>
                <button
                  onClick={() => onToggleCenterStatus(center.id)}
                  className={`p-1.5 rounded-lg transition-colors border ${
                    center.status === 'Active'
                      ? 'text-brand-slate-400 hover:text-brand-coral-600 bg-white hover:bg-brand-coral-50 border-brand-slate-200'
                      : 'text-brand-slate-400 hover:text-emerald-600 bg-white hover:bg-emerald-50 border-brand-slate-200'
                  }`}
                  title="Toggle Center Status"
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
