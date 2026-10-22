import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Star,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Award,
  Search,
  Check,
  Phone
} from 'lucide-react';
import Modal from '../../../components/common/Modal';

export default function StaffAssignmentModal({
  isOpen,
  onClose,
  targetRequest,
  staffList,
  onConfirmAssignment
}) {
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');

  if (!isOpen || !targetRequest) return null;

  const requiredService = targetRequest.serviceName || targetRequest.requiredService || 'Nursing Care';

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'All Roles' || staff.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleAssign = () => {
    if (!selectedStaffId) return;
    const staff = staffList.find((s) => s.id === selectedStaffId);
    onConfirmAssignment(targetRequest.id, staff);
    setSelectedStaffId('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Nurse / Caregiver Staff"
      subtitle={`For ${targetRequest.patientName} • Service: ${requiredService}`}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-brand-slate-500">
            {selectedStaffId ? (
              <span className="text-brand-green-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Selected: {staffList.find((s) => s.id === selectedStaffId)?.name}
              </span>
            ) : (
              'Please select an available staff member'
            )}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              disabled={!selectedStaffId}
              onClick={handleAssign}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Confirm Staff Assignment</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs sm:text-sm text-brand-navy-900 max-h-[65vh] overflow-y-auto pr-1">
        {/* Requirement Banner */}
        <div className="p-3.5 rounded-xl bg-brand-green-50 border border-brand-green-200 flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-brand-green-800 block">
              Required Care Service
            </span>
            <div className="font-black text-brand-navy-950 text-sm mt-0.5">
              {requiredService}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-brand-slate-500 block">Preferred Schedule</span>
            <span className="font-bold text-brand-navy-900 text-xs">
              {targetRequest.preferredDate} ({targetRequest.preferredTime})
            </span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff by name, qualification..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 text-brand-navy-900"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            aria-label="Filter staff by role"
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none"
          >
            <option value="All Roles">All Staff Roles</option>
            <option value="Registered Nurse">Registered Nurse</option>
            <option value="Homecare Nurse">Homecare Nurse</option>
            <option value="Critical Care Specialist Nurse">Critical Care Specialist Nurse</option>
            <option value="Certified Geriatric Attendant">Certified Geriatric Attendant</option>
            <option value="Senior Caregiver">Senior Caregiver</option>
          </select>
        </div>

        {/* Staff Selection Roster (Section 11) */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-slate-500 block">
            Available Clinical Staff Roster ({filteredStaff.length})
          </span>

          {filteredStaff.map((staff) => {
            const isSelected = selectedStaffId === staff.id;
            const isAvailable = staff.availability === 'Available';
            const hasMatchingCapability = staff.capabilities.includes(requiredService);

            return (
              <div
                key={staff.id}
                onClick={() => {
                  if (isAvailable) setSelectedStaffId(staff.id);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-green-50/80 border-brand-green-500 ring-2 ring-brand-green-500/20 shadow-xs'
                    : isAvailable
                    ? 'bg-white hover:bg-brand-slate-50/80 border-brand-slate-200'
                    : 'bg-brand-slate-50 border-brand-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-green-100 text-brand-green-800 font-black flex items-center justify-center text-xs flex-shrink-0 border border-brand-green-200">
                      {staff.name.split(' ')[1]?.[0] || 'N'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-brand-navy-950 text-sm">
                          {staff.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-brand-slate-500 bg-brand-slate-100 px-1.5 py-0.2 rounded">
                          {staff.id}
                        </span>
                        {hasMatchingCapability && (
                          <span className="px-2 py-0.2 rounded text-[10px] font-extrabold bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200 flex items-center gap-1">
                            <Award className="w-2.5 h-2.5" />
                            Direct Skill Match
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-brand-slate-600 mt-0.5 font-medium">
                        <strong className="text-brand-navy-900">{staff.role}</strong> • {staff.qualification} ({staff.experience})
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-brand-slate-500 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-amber-600 font-bold">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {staff.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-coral-600" />
                          {staff.location}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-brand-slate-700">
                          <Briefcase className="w-3 h-3 text-brand-slate-400" />
                          {staff.currentAssignments} active assignments
                        </span>
                      </div>

                      {/* Capabilities badges */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {staff.capabilities.map((cap, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${
                              cap === requiredService
                                ? 'bg-brand-green-100 text-brand-green-900 border-brand-green-300 font-bold'
                                : 'bg-brand-slate-100 text-brand-slate-600 border-brand-slate-200'
                            }`}
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        isAvailable
                          ? 'bg-brand-green-50 text-brand-green-700 border-brand-green-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {staff.availability}
                    </span>

                    <input
                      type="radio"
                      name="staffSelection"
                      checked={isSelected}
                      disabled={!isAvailable}
                      onChange={() => setSelectedStaffId(staff.id)}
                      className="w-4 h-4 text-brand-green-600 focus:ring-brand-green-500 mt-2"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
