import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Car,
  Clock,
  UserCheck,
  Edit3,
  Power,
  Calendar,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { exportToExcel } from '../../../utils/reportExportEngine';
import { useToast } from '../../../context/ToastContext';

export default function LabCollectionStaffView({
  staff = [],
  onOpenAddStaff,
  onOpenEditStaff,
  onToggleAvailability,
  onToggleStaffStatus
}) {
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');

  // Filter staff
  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = member.name?.toLowerCase().includes(q);
        const matchPhone = member.phone?.toLowerCase().includes(q);
        const matchArea = member.serviceArea?.toLowerCase().includes(q);
        const matchSpec = member.specialization?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchArea && !matchSpec) return false;
      }

      if (areaFilter !== 'ALL' && !member.serviceArea?.includes(areaFilter)) {
        return false;
      }

      if (availabilityFilter !== 'ALL' && member.availability !== availabilityFilter) {
        return false;
      }

      return true;
    });
  }, [staff, searchTerm, areaFilter, availabilityFilter]);

  const handleExportExcel = () => {
    const exportData = filteredStaff.map((s) => ({
      'Staff ID': s.staffId,
      'Name': s.name,
      'Phone': s.phone,
      'Email': s.email,
      'Service Area': s.serviceArea,
      'Specialization': s.specialization,
      'Working Hours': s.workingHours,
      'Availability': s.availability,
      'Todays Assignments': s.todaysAssignments,
      'Completed Collections': s.completedCollections,
      'Rating': s.rating,
      'Vehicle': s.vehicleNumber,
      'Status': s.status
    }));
    exportToExcel(exportData, 'MediUnify_Phlebotomists_Staff_Roster');
    addToast('Exported collection staff roster to Excel', 'success');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-navy-900 tracking-tight">
            Phlebotomy Staff
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-brand-slate-50 text-brand-slate-700 text-xs font-semibold rounded-xl border border-brand-slate-200 shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Staff
          </button>
          <button
            onClick={onOpenAddStaff}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Register Phlebotomist
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-brand-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Phlebotomist Name, Phone, Area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            />
          </div>

          {/* Area */}
          <div>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            >
              <option value="ALL">All Mysuru Service Zones</option>
              <option value="Kuvempunagar">Kuvempunagar & Saraswathipuram</option>
              <option value="Jayalakshmipuram">Jayalakshmipuram & Gokulam</option>
              <option value="VV Mohalla">VV Mohalla & Central</option>
              <option value="Vijayanagar">Vijayanagar & Hebbal</option>
              <option value="Siddhartha">Siddhartha Layout & Bannimantap</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            >
              <option value="ALL">All Availability States</option>
              <option value="AVAILABLE">AVAILABLE (Accepting Draws)</option>
              <option value="BUSY">BUSY (On Route)</option>
              <option value="OFFLINE">OFFLINE (Off Duty)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs hover:shadow-md hover:border-brand-teal-300 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 space-y-3">
              {/* Header: Name & Availability */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-teal-50 border border-brand-teal-200 text-brand-teal-700 flex items-center justify-center font-bold text-sm">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-brand-navy-900 text-sm">{member.name}</h3>
                    <p className="text-[11px] text-brand-slate-400 font-mono">{member.staffId}</p>
                  </div>
                </div>
                <StatusBadge status={member.availability} size="xs" />
              </div>

              {/* Specialization & Zone */}
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-brand-teal-800 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-brand-teal-600" />
                  {member.specialization}
                </p>
                <p className="text-brand-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-slate-400" />
                  {member.serviceArea}
                </p>
                <p className="text-brand-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-slate-400" />
                  {member.phone}
                </p>
                <p className="text-brand-slate-500 text-[11px] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-slate-400" />
                  {member.workingHours}
                </p>
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-brand-slate-100 text-center text-xs">
                <div className="bg-brand-slate-50 p-2 rounded-xl border border-brand-slate-200/60">
                  <span className="text-[10px] text-brand-slate-400 block font-bold uppercase">Assignments</span>
                  <strong className="text-brand-navy-900">{member.todaysAssignments}</strong>
                </div>
                <div className="bg-brand-slate-50 p-2 rounded-xl border border-brand-slate-200/60">
                  <span className="text-[10px] text-brand-slate-400 block font-bold uppercase">Completed</span>
                  <strong className="text-emerald-700">{member.completedCollections}</strong>
                </div>
                <div className="bg-brand-slate-50 p-2 rounded-xl border border-brand-slate-200/60">
                  <span className="text-[10px] text-brand-slate-400 block font-bold uppercase">Rating</span>
                  <strong className="text-brand-teal-700">{member.rating}</strong>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-3.5 bg-brand-slate-50/80 border-t border-brand-slate-100 flex items-center justify-between text-xs">
              <span className="font-mono text-brand-slate-500 text-[11px]">
                {member.vehicleNumber}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onToggleAvailability(member.id)}
                  className="px-2.5 py-1 bg-white hover:bg-brand-slate-100 text-brand-slate-700 font-semibold rounded-lg border border-brand-slate-200 transition-colors"
                >
                  Toggle Availability
                </button>
                <button
                  onClick={() => onOpenEditStaff(member)}
                  className="p-1.5 text-brand-slate-400 hover:text-brand-teal-700 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-brand-slate-200"
                  title="Edit Staff"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
