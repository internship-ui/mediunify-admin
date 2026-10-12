import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Star,
  MapPin,
  Phone,
  Mail,
  Plus,
  Briefcase,
  Award,
  Power,
  CheckCircle2,
  AlertCircle,
  Stethoscope
} from 'lucide-react';

export default function StaffManagementView({
  staffList,
  onOpenAddStaff,
  onToggleStaffAvailability
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');

  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm);

      const matchesRole = roleFilter === 'All Roles' || s.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [staffList, searchTerm, roleFilter]);

  return (
    <div className="space-y-6 animate-fade-in text-brand-navy-900">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight">
              Clinical Caregiver & Nurse Roster
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-brand-green-50 text-brand-green-800 border border-brand-green-200">
              {staffList.length} Active Staff Members
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate-600 mt-1">
            Manage clinical nursing personnel, verify hospital certifications, oversee shifts, and deploy across Mysore operational hubs.
          </p>
        </div>

        <button
          onClick={onOpenAddStaff}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-md shadow-brand-green-600/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Nurse / Caregiver</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search staff by name, qualification, Mysore locality, contact number..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 text-brand-navy-900"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          aria-label="Filter staff by role"
          className="px-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none"
        >
          <option value="All Roles">All Staff Roles</option>
          <option value="Registered Nurse">Registered Nurse</option>
          <option value="Homecare Nurse">Homecare Nurse</option>
          <option value="Critical Care Specialist Nurse">Critical Care Specialist Nurse</option>
          <option value="Certified Geriatric Attendant">Certified Geriatric Attendant</option>
          <option value="Senior Caregiver">Senior Caregiver</option>
        </select>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStaff.map((staff) => (
          <div
            key={staff.id}
            className="bg-white p-5 rounded-2xl border border-brand-slate-200/90 shadow-subtle hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-brand-green-100 text-brand-green-800 font-black flex items-center justify-center text-sm border border-brand-green-200 shadow-2xs">
                    {staff.name.split(' ')[1]?.[0] || 'N'}
                  </div>
                  <div>
                    <h3 className="font-black text-brand-navy-950 text-sm">
                      {staff.name}
                    </h3>
                    <span className="font-mono text-[10px] font-bold text-brand-slate-500">
                      {staff.id}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    staff.availability === 'Available'
                      ? 'bg-brand-green-50 text-brand-green-800 border-brand-green-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {staff.availability}
                </span>
              </div>

              {/* Role & Qualification */}
              <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80 space-y-1">
                <div className="text-xs font-bold text-brand-navy-900">{staff.role}</div>
                <div className="text-[11px] text-brand-slate-600 font-medium">{staff.qualification} ({staff.experience})</div>
              </div>

              {/* Contact Info */}
              <div className="mt-3 space-y-1.5 text-xs text-brand-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-brand-green-600" />
                  <a href={`tel:${staff.phone}`} className="font-bold text-brand-navy-900 hover:underline">
                    {staff.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-coral-600" />
                  <span>{staff.location}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1 text-amber-600 font-bold text-[11px]">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {staff.rating} Performance Score
                  </span>
                  <span className="text-[11px] font-semibold text-brand-slate-700">
                    {staff.currentAssignments} active shifts
                  </span>
                </div>
              </div>

              {/* Capabilities */}
              <div className="mt-3 pt-3 border-t border-brand-slate-100">
                <span className="text-[10px] font-bold text-brand-slate-500 uppercase block mb-1.5">
                  Clinical Capabilities
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {staff.capabilities.map((cap, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-green-50 text-brand-green-800 border border-brand-green-200"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Toggle Availability Action */}
            <div className="mt-4 pt-3 border-t border-brand-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-brand-slate-500">
                Shift: {staff.availability === 'Available' ? 'Ready for Dispatch' : 'On Active Duty'}
              </span>
              <button
                onClick={() => onToggleStaffAvailability(staff.id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                  staff.availability === 'Available'
                    ? 'text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-200'
                    : 'text-brand-green-800 bg-brand-green-50 hover:bg-brand-green-100 border-brand-green-200'
                }`}
              >
                Toggle {staff.availability === 'Available' ? 'On Visit' : 'Available'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
