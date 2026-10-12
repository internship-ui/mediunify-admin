import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  UserCheck,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Phone,
  CheckCircle2,
  AlertCircle,
  Activity,
  Sparkles,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function HomeCareScheduleView({ requests = [], onOpenRequest }) {
  const [selectedDayFilter, setSelectedDayFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // All visits that are assigned or in progress/completed/confirmed
  const scheduledVisits = useMemo(() => {
    return requests.filter(
      (r) =>
        r.assignedNurse !== null ||
        r.status === 'Confirmed' ||
        r.status === 'Nurse Assigned' ||
        r.status === 'Scheduled' ||
        r.status === 'In Progress' ||
        r.status === 'Completed'
    );
  }, [requests]);

  const daysList = [
    { label: 'All Scheduled', value: 'All' },
    { label: 'Today (26 Sep)', value: '26 Sep' },
    { label: 'Tomorrow (27 Sep)', value: '27 Sep' },
    { label: '28 Sep 2026', value: '28 Sep' },
    { label: '29 Sep 2026', value: '29 Sep' }
  ];

  const filteredVisits = useMemo(() => {
    return scheduledVisits.filter((item) => {
      const dateStr = item.preferredDate || item.requestedDate || '';
      const matchesDay =
        selectedDayFilter === 'All' || dateStr.toLowerCase().includes(selectedDayFilter.toLowerCase());

      const nurseName = item.assignedNurse?.name || item.candidateNurse?.name || '';
      const matchesSearch =
        (item.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.serviceRequired || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.patientLocation || item.location || item.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        nurseName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDay && matchesSearch;
    });
  }, [scheduledVisits, selectedDayFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <CalendarIcon className="w-7 h-7 text-brand-green-700" />
              Home Visit Schedule & Roster
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-green-100 text-brand-green-800 border border-brand-green-200">
              {scheduledVisits.length} Active Bookings
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Real-time timetable of confirmed nurse home visits to patient residences across Mysuru.
          </p>
        </div>
      </div>

      {/* 2. Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Scheduled</span>
          <span className="text-2xl font-black text-gray-900 mt-1 block">{scheduledVisits.length}</span>
          <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">Home visits allocated</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Today's Visits</span>
          <span className="text-2xl font-black text-brand-green-800 mt-1 block">
            {scheduledVisits.filter(r => (r.preferredDate || r.requestedDate || '').includes('26 Sep')).length}
          </span>
          <span className="text-[10px] text-gray-500 font-medium mt-0.5 block">26 Sep 2026</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Nurses On Visit</span>
          <span className="text-2xl font-black text-blue-700 mt-1 block">
            {new Set(scheduledVisits.filter(r => r.assignedNurse).map(r => r.assignedNurse.name)).size}
          </span>
          <span className="text-[10px] text-blue-600 font-medium mt-0.5 block">Assigned field staff</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Completed Visits</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">
            {requests.filter(r => r.status === 'Completed').length}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">Finished & billed</span>
        </div>
      </div>

      {/* 3. Filter Bar & Day Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        {/* Day Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {daysList.map((day) => {
            const isActive = selectedDayFilter === day.value;
            const count =
              day.value === 'All'
                ? scheduledVisits.length
                : scheduledVisits.filter((r) => (r.preferredDate || r.requestedDate || '').includes(day.value)).length;

            return (
              <button
                key={day.value}
                onClick={() => setSelectedDayFilter(day.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-brand-green-700 text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{day.label}</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search schedule by patient name, nurse, service required, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 text-gray-900"
          />
        </div>
      </div>

      {/* 4. Schedule Timetable Cards */}
      <div className="space-y-3.5">
        {filteredVisits.map((item) => {
          const dateStr = item.preferredDate || item.requestedDate || '26 Sep 2026';
          const parts = dateStr.split(' ');
          const dayNum = parts[0] || '26';
          const monthText = parts[1] || 'Sep';
          const timeSlot = item.preferredTime || item.requestedTime || '10:00 AM';
          const nurse = item.assignedNurse || item.candidateNurse || {
            name: 'Unassigned Nurse',
            specialization: item.specializationRequired || 'General Nursing',
            phone: '+91 98450 00000',
            address: 'Mysuru'
          };

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:border-brand-green-400 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
            >
              {/* Left: Date Stamp & Patient Details */}
              <div className="flex items-start gap-3.5">
                {/* Visual Date Badge */}
                <div className="w-14 h-14 rounded-2xl bg-brand-green-50 border border-brand-green-200 flex flex-col items-center justify-center text-brand-green-900 flex-shrink-0 shadow-2xs">
                  <span className="font-black text-lg leading-tight">{dayNum}</span>
                  <span className="text-[10px] uppercase font-black tracking-wider text-brand-green-700">{monthText}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                      #{item.id}
                    </span>
                    <StatusBadge status={item.status} size="xs" />
                    <span className="font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      ₹{item.price || 750} • {item.paymentStatus === 'Payment Successful' || item.paymentStatus === 'Paid' ? 'Paid Online' : 'Pending'}
                    </span>
                  </div>

                  <div className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
                    <span>{item.patientName}</span>
                    <span className="text-gray-400 font-normal">—</span>
                    <span className="text-brand-green-800 font-bold bg-brand-green-50 px-2 py-0.2 rounded border border-brand-green-200 text-xs">
                      {item.serviceRequired}
                    </span>
                  </div>

                  <div className="text-gray-600 flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span>{item.address || item.patientLocation || item.location}</span>
                  </div>

                  {item.specialRequirements && (
                    <p className="text-[11px] text-gray-500 italic max-w-xl">
                      Note: {item.specialRequirements}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Nurse Allocation & Time Slot Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200 flex-shrink-0">
                {/* Assigned Nurse */}
                <div className="min-w-[160px]">
                  <span className="text-gray-400 block text-[10px] font-bold uppercase tracking-wider">Assigned Nurse:</span>
                  <div className="font-black text-gray-900 text-xs sm:text-sm flex items-center gap-1 mt-0.5">
                    <UserCheck className="w-4 h-4 text-brand-green-700 flex-shrink-0" />
                    <span>{nurse.name}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    {nurse.specialization}
                  </div>
                  <a
                    href={`tel:${nurse.phone}`}
                    className="font-mono text-[11px] text-brand-green-800 font-bold hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Phone className="w-3 h-3 text-brand-green-600" />
                    <span>{nurse.phone}</span>
                  </a>
                </div>

                {/* Scheduled Slot */}
                <div className="sm:border-l sm:border-gray-200 sm:pl-3 min-w-[120px]">
                  <span className="text-gray-400 block text-[10px] font-bold uppercase tracking-wider">Time Slot:</span>
                  <div className="font-extrabold text-brand-green-950 text-xs sm:text-sm flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{timeSlot}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-0.5">{dateStr}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {filteredVisits.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 space-y-2">
            <CalendarIcon className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-sm font-bold text-gray-700">No scheduled visits for this filter</p>
            <p className="text-xs text-gray-400">
              Try switching the day filter to "All Scheduled" or confirm more patient requests.
            </p>
            {selectedDayFilter !== 'All' && (
              <button
                onClick={() => setSelectedDayFilter('All')}
                className="mt-2 px-4 py-1.5 bg-brand-green-700 hover:bg-brand-green-800 text-white font-bold rounded-xl text-xs transition-colors"
              >
                View All Scheduled Visits
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
