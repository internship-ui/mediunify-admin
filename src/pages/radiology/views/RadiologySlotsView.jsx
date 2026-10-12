import React, { useState, useMemo } from 'react';
import {
  Clock,
  Calendar,
  Building2,
  Server,
  Plus,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  Filter
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { useToast } from '../../../context/ToastContext';
import { RADIOLOGY_CENTERS, RADIOLOGY_MACHINES } from '../../../data/radiologyData';

export default function RadiologySlotsView({
  slots = [],
  machines = RADIOLOGY_MACHINES,
  centers = RADIOLOGY_CENTERS,
  onToggleSlotStatus,
  onAddCustomSlot
}) {
  const { addToast } = useToast();

  const [selectedCenter, setSelectedCenter] = useState('ALL');
  const [selectedMachine, setSelectedMachine] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('2026-10-01');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter slots
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      if (selectedDate && slot.date !== selectedDate) return false;
      if (selectedCenter !== 'ALL' && slot.centerId !== selectedCenter) return false;
      if (selectedMachine !== 'ALL' && slot.machineId !== selectedMachine) return false;
      if (statusFilter !== 'ALL' && slot.status !== statusFilter) return false;
      return true;
    });
  }, [slots, selectedDate, selectedCenter, selectedMachine, statusFilter]);

  const handleBlockSlot = (slot) => {
    const nextStatus = slot.status === 'Blocked' ? 'Available' : 'Blocked';
    onToggleSlotStatus(slot.id, nextStatus);
    addToast(`Slot ${slot.startTime} marked as ${nextStatus.toUpperCase()}.`, 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-brand-navy-900 tracking-tight">
            Machine Slot Management & Operational Matrix
          </h1>
          <p className="text-xs text-brand-slate-500">
            Control gantry time slot availability, block maintenance periods, and prevent overlapping scan appointments
          </p>
        </div>

        <button
          onClick={() => {
            const time = window.prompt('Enter new slot time (e.g. 05:30 PM - 06:15 PM):');
            if (time) onAddCustomSlot(selectedCenter, selectedMachine, selectedDate, time);
          }}
          className="px-4 py-2 bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Open Custom Slot
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Date Picker */}
          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Appointment Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
            />
          </div>

          {/* Center Selector */}
          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Radiology Center:</label>
            <select
              value={selectedCenter}
              onChange={(e) => {
                setSelectedCenter(e.target.value);
                setSelectedMachine('ALL');
              }}
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
            >
              <option value="ALL">All Centers</option>
              {centers.map((c) => (
                <option key={c.id} value={c.id}>{c.name.split('-')[0]}</option>
              ))}
            </select>
          </div>

          {/* Machine Selector */}
          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Specific Machine Suite:</label>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
            >
              <option value="ALL">All Machines</option>
              {machines
                .filter((m) => selectedCenter === 'ALL' || m.centerId === selectedCenter)
                .map((m) => (
                  <option key={m.id} value={m.id}>{m.name.slice(0, 30)}...</option>
                ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Slot Availability State:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
            >
              <option value="ALL">All Slot States</option>
              <option value="Available">Available (Open)</option>
              <option value="Booked">Booked (Patient Assigned)</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked (Admin Lock)</option>
              <option value="Maintenance">Maintenance Period</option>
            </select>
          </div>

        </div>
      </div>

      {/* Slots Visual Matrix / Grid */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-brand-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-teal-600" />
            <h3 className="font-bold text-sm text-brand-navy-900">
              Gantry Slots Schedule for {selectedDate} ({filteredSlots.length} Slots Total)
            </h3>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-semibold text-brand-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-navy-800"></span> Booked</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Maintenance</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-slate-400"></span> Blocked</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredSlots.map((slot) => {
            const isAvailable = slot.status === 'Available';
            const isBooked = slot.status === 'Booked';
            const isMaintenance = slot.status === 'Maintenance';
            const isBlocked = slot.status === 'Blocked';
            const isCompleted = slot.status === 'Completed';

            return (
              <div
                key={slot.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
                  isAvailable
                    ? 'bg-emerald-50/30 border-emerald-200 hover:border-emerald-300'
                    : isBooked
                    ? 'bg-brand-navy-50/50 border-brand-navy-200'
                    : isMaintenance
                    ? 'bg-amber-50/60 border-amber-300'
                    : isBlocked
                    ? 'bg-brand-slate-100 border-brand-slate-300'
                    : 'bg-brand-slate-50 border-brand-slate-200 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-navy-900 font-mono">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <StatusBadge status={slot.status} size="xs" />
                  </div>

                  <p className="text-[11px] font-bold text-brand-teal-800 mt-1 truncate">
                    {slot.machineName}
                  </p>
                  <p className="text-[10px] text-brand-slate-400">Duration: {slot.duration} • {slot.scanType}</p>

                  {slot.patientName && (
                    <div className="mt-2 p-1.5 bg-white rounded-md border border-brand-slate-200 text-[11px]">
                      <span className="text-brand-slate-400 text-[9px] uppercase font-bold block">Patient:</span>
                      <strong className="text-brand-navy-900">{slot.patientName}</strong> ({slot.orderId})
                    </div>
                  )}

                  {slot.blockReason && (
                    <p className="mt-1 text-[10px] text-amber-800 italic">
                      Note: {slot.blockReason}
                    </p>
                  )}
                </div>

                {/* Slot Block / Unblock Quick Action */}
                {!isBooked && !isCompleted && (
                  <div className="pt-2 border-t border-brand-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-brand-slate-400">Admin Control</span>
                    <button
                      type="button"
                      onClick={() => handleBlockSlot(slot)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                        isBlocked
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-white text-brand-slate-700 border-brand-slate-200 hover:bg-brand-slate-100'
                      }`}
                    >
                      {isBlocked ? <><Unlock className="w-3 h-3" /> Unblock</> : <><Lock className="w-3 h-3" /> Block Slot</>}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredSlots.length === 0 && (
          <p className="text-center py-8 text-brand-slate-400 text-xs">
            No slot allocations configured for the selected filters.
          </p>
        )}
      </div>

    </div>
  );
}
