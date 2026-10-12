import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  UserCheck,
  MapPin,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  Stethoscope,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function ScheduleView({
  scheduledVisits,
  staffList,
  onViewVisitDetails
}) {
  const [selectedDate, setSelectedDate] = useState('2026-09-22');
  const [selectedShift, setSelectedShift] = useState('All Shifts');
  const [selectedStaff, setSelectedStaff] = useState('All Staff');

  const filteredVisits = useMemo(() => {
    return scheduledVisits.filter((v) => {
      const matchesDate = !selectedDate || v.date === selectedDate;
      const matchesShift = selectedShift === 'All Shifts' || v.shift.includes(selectedShift);
      const matchesStaff = selectedStaff === 'All Staff' || v.nurseName.includes(selectedStaff);

      return matchesDate && matchesShift && matchesStaff;
    });
  }, [scheduledVisits, selectedDate, selectedShift, selectedStaff]);

  return (
    <div className="space-y-6 animate-fade-in text-brand-navy-900">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight">
              Clinical Shift & Visit Schedule
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-brand-green-50 text-brand-green-800 border border-brand-green-200">
              {filteredVisits.length} Scheduled Visits on {selectedDate}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate-600 mt-1">
            Real-time nurse dispatch calendar, shift timeslots, clinical home appointments, and patient coverage map.
          </p>
        </div>

        {/* Date Selector Shortcuts */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            aria-label="Filter by Shift"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none"
          >
            <option value="All Shifts">All Shifts</option>
            <option value="Morning">Morning Shift</option>
            <option value="Afternoon">Afternoon Shift</option>
            <option value="Evening">Evening Shift</option>
            <option value="12h">12-Hour Shift</option>
          </select>

          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            aria-label="Filter by Assigned Nurse"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none"
          >
            <option value="All Staff">All Assigned Nurses</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name} ({s.role})
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-brand-slate-500 font-medium">
          Showing visits scheduled across Mysore localities
        </span>
      </div>

      {/* Schedule Timeline Grid */}
      <div className="space-y-3">
        {filteredVisits.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-brand-slate-200 text-brand-slate-500 shadow-subtle">
            <CalendarIcon className="w-8 h-8 text-brand-slate-300 mx-auto mb-2" />
            <p className="font-bold text-sm text-brand-navy-950">No visits scheduled for this date & filter selection.</p>
            <button
              onClick={() => {
                setSelectedDate('2026-09-22');
                setSelectedShift('All Shifts');
                setSelectedStaff('All Staff');
              }}
              className="mt-2 text-xs font-bold text-brand-green-700 hover:underline"
            >
              Reset date filter
            </button>
          </div>
        ) : (
          filteredVisits.map((visit) => (
            <div
              key={visit.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-slate-200/90 shadow-subtle hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-brand-green-50 text-brand-green-800 border border-brand-green-200 font-mono font-bold text-xs flex-shrink-0">
                  <Clock className="w-4 h-4 mb-1 text-brand-green-600" />
                  <span className="text-[10px] block">{visit.shift}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-brand-navy-950 text-base">
                      {visit.patientName}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-brand-green-50 text-brand-green-800 border border-brand-green-200">
                      {visit.serviceName}
                    </span>
                    <span className="font-mono text-[10px] text-brand-slate-500">
                      {visit.requestId}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-brand-slate-600 mt-1.5 flex-wrap">
                    <span className="font-bold text-brand-navy-900 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-teal-600" />
                      {visit.timeSlot}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-brand-teal-800">
                      <UserCheck className="w-3.5 h-3.5 text-brand-teal-600" />
                      {visit.nurseName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-coral-600" />
                      {visit.location}
                    </span>
                  </div>

                  {visit.clinicalNotes && (
                    <p className="text-xs text-brand-slate-500 mt-1.5 italic">
                      Note: {visit.clinicalNotes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                    visit.status === 'Completed'
                      ? 'bg-brand-green-50 text-brand-green-800 border-brand-green-200'
                      : visit.status === 'In Progress'
                      ? 'bg-cyan-50 text-cyan-800 border-cyan-300 animate-pulse'
                      : 'bg-purple-50 text-purple-800 border-purple-200'
                  }`}
                >
                  {visit.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
