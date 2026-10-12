import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  Clock,
  Building2,
  Server,
  AlertTriangle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { RADIOLOGY_CENTERS, RADIOLOGY_MACHINES } from '../../../data/radiologyData';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function RadiologyRescheduleModal({
  isOpen,
  onClose,
  order,
  onConfirmReschedule,
  allMachines = RADIOLOGY_MACHINES,
  allCenters = RADIOLOGY_CENTERS
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);

  const [targetDate, setTargetDate] = useState('2026-10-02');
  const [selectedCenter, setSelectedCenter] = useState(order?.center || allCenters[0]?.name);
  const [selectedMachine, setSelectedMachine] = useState(order?.machine || allMachines[0]?.name);
  const [selectedSlot, setSelectedSlot] = useState('09:00 AM - 09:30 AM');
  const [rescheduleReason, setRescheduleReason] = useState('Patient requested timing change to morning slot.');

  // Filter machines based on selected center and modality of the scan
  const eligibleMachines = useMemo(() => {
    return allMachines.filter((m) => {
      const matchCenter = m.centerName.includes(selectedCenter) || selectedCenter.includes(m.centerName);
      const matchModality = order?.scan?.category ? m.modality.toLowerCase().includes(order.scan.category.toLowerCase().slice(0, 3)) : true;
      return matchCenter && matchModality && m.status !== 'Inactive';
    });
  }, [allMachines, selectedCenter, order]);

  if (!isOpen || !order) return null;

  const mockAvailableSlots = [
    '08:00 AM - 08:30 AM',
    '09:00 AM - 09:30 AM',
    '10:30 AM - 11:00 AM',
    '11:45 AM - 12:15 PM',
    '02:00 PM - 02:30 PM',
    '03:30 PM - 04:00 PM',
    '05:00 PM - 05:30 PM'
  ];

  const handleReschedule = (e) => {
    e.preventDefault();
    if (!selectedSlot || !targetDate) {
      addToast('Please choose an appointment date and slot.', 'warning');
      return;
    }

    onConfirmReschedule(order.orderId, {
      newDate: targetDate,
      newSlot: selectedSlot,
      newCenter: selectedCenter,
      newMachine: selectedMachine,
      reason: rescheduleReason
    });

    addToast(`Order ${order.orderId} rescheduled to ${targetDate} (${selectedSlot})`, 'success');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-100 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">Reschedule Radiology Appointment</h3>
              <p className="text-xs text-brand-slate-500">Order ID: <strong className="font-mono text-brand-teal-700">{order.orderId}</strong></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 rounded-lg hover:bg-brand-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleReschedule} className="p-6 space-y-4 text-xs">
          
          {/* Current Booking Overview */}
          <div className="p-3.5 bg-brand-slate-50 rounded-xl border border-brand-slate-200">
            <div className="flex items-center justify-between text-[11px] text-brand-slate-500 mb-1">
              <span className="font-bold text-brand-slate-700">Current Slot Allocation:</span>
              <span className="text-brand-coral-600 font-semibold">Will be released upon reschedule</span>
            </div>
            <p className="font-bold text-brand-navy-900 text-sm">{order.scan?.name}</p>
            <p className="text-brand-slate-600 mt-0.5">
              {order.appointmentDate} • <strong>{order.appointmentTime}</strong> at {order.center?.split('-')[0]}
            </p>
          </div>

          {/* New Center & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Select Center:</label>
              <select
                value={selectedCenter}
                onChange={(e) => {
                  setSelectedCenter(e.target.value);
                  const firstEligible = allMachines.find((m) => m.centerName.includes(e.target.value));
                  if (firstEligible) setSelectedMachine(firstEligible.name);
                }}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 text-xs font-medium"
              >
                {allCenters.map((c) => (
                  <option key={c.id} value={c.name}>{c.name.split('-')[0]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">New Appointment Date:</label>
              <input
                type="date"
                value={targetDate}
                min="2026-10-01"
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 text-xs font-medium"
                required
              />
            </div>
          </div>

          {/* Target Machine Selection */}
          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Assigned Machine / Gantry:</label>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 text-xs font-medium"
            >
              {eligibleMachines.length > 0 ? (
                eligibleMachines.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.room}) - {m.status}
                  </option>
                ))
              ) : (
                allMachines.map((m) => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))
              )}
            </select>
          </div>

          {/* Available Slots Grid */}
          <div>
            <label className="font-bold text-brand-slate-700 block mb-1.5">
              Available Time Slots for {targetDate}:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {mockAvailableSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2 rounded-xl text-center font-bold border transition-all text-[11px] ${
                      isSelected
                        ? 'bg-brand-teal-600 text-white border-brand-teal-600 shadow-xs'
                        : 'bg-brand-slate-50 text-brand-slate-700 border-brand-slate-200 hover:bg-brand-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reason for Reschedule */}
          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Reason for Rescheduling:</label>
            <input
              type="text"
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              placeholder="e.g. Patient requested timing change / Emergency machine conflict"
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 text-xs font-medium"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-brand-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-brand-slate-600 font-semibold rounded-xl border border-brand-slate-200 hover:bg-brand-slate-100 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Reschedule
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
