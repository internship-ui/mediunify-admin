import React, { useState, useMemo } from 'react';
import {
  X,
  Server,
  AlertTriangle,
  Calendar,
  Clock,
  RotateCcw,
  CheckCircle2,
  Building2,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { RADIOLOGY_MACHINES } from '../../../data/radiologyData';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function RadiologyMachineMaintenanceModal({
  isOpen,
  onClose,
  machine,
  allOrders = [],
  onConfirmMaintenance,
  onReassignOrder
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);

  const [maintenanceReason, setMaintenanceReason] = useState(
    'Scheduled AERB Radiation & Detector Sensor Calibration (10:00 AM - 02:00 PM)'
  );
  const [estimatedDuration, setEstimatedDuration] = useState('4 Hours');

  // Identify all active bookings on this machine today or in future
  const affectedOrders = useMemo(() => {
    if (!machine) return [];
    return allOrders.filter(
      (o) =>
        (o.machine === machine.name || o.machineId === machine.id) &&
        o.orderStatus !== 'COMPLETED' &&
        o.orderStatus !== 'CANCELLED'
    );
  }, [machine, allOrders]);

  if (!isOpen || !machine) return null;

  const handleToggleMaintenance = () => {
    const nextStatus = machine.status === 'Maintenance' ? 'Available' : 'Maintenance';
    onConfirmMaintenance(machine.id, {
      status: nextStatus,
      maintenanceReason: nextStatus === 'Maintenance' ? maintenanceReason : 'Operational',
      estimatedDuration
    });

    addToast(
      `Machine ${machine.name} status updated to ${nextStatus.toUpperCase()}.`,
      nextStatus === 'Maintenance' ? 'warning' : 'success'
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in-50 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-100 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">Machine Maintenance & Booking Conflict Wizard</h3>
              <p className="text-xs text-brand-slate-500">Machine: <strong className="text-brand-navy-900">{machine.name}</strong></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 rounded-lg hover:bg-brand-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Current Machine Status Box */}
          <div className="p-3.5 bg-brand-slate-50 rounded-xl border border-brand-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div>
              <span className="text-brand-slate-400 block">Modality:</span>
              <strong className="text-brand-navy-900">{machine.modality}</strong>
            </div>
            <div>
              <span className="text-brand-slate-400 block">Suite / Room:</span>
              <strong className="text-brand-navy-900 truncate block">{machine.room}</strong>
            </div>
            <div>
              <span className="text-brand-slate-400 block">Current Status:</span>
              <span className={`font-bold ${machine.status === 'Maintenance' ? 'text-amber-700' : 'text-emerald-700'}`}>
                {machine.status}
              </span>
            </div>
            <div>
              <span className="text-brand-slate-400 block">Center:</span>
              <span className="text-brand-slate-700 truncate block">{machine.centerName?.split('-')[0]}</span>
            </div>
          </div>

          {/* Maintenance Inputs */}
          <div className="space-y-3 p-3.5 bg-amber-50/40 rounded-xl border border-amber-200">
            <div>
              <label className="font-bold text-amber-950 block mb-1">Maintenance Reason / Protocol:</label>
              <input
                type="text"
                value={maintenanceReason}
                onChange={(e) => setMaintenanceReason(e.target.value)}
                placeholder="e.g. Scheduled Detector Sensor Calibration / Cryogen Check"
                className="w-full p-2.5 rounded-xl border border-amber-300 text-xs font-medium bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-amber-950 block mb-1">Estimated Downtime Duration:</label>
              <input
                type="text"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="e.g. 4 Hours (10:00 AM - 02:00 PM)"
                className="w-full p-2 rounded-xl border border-amber-300 text-xs font-medium bg-white"
              />
            </div>
          </div>

          {/* Affected Bookings List (Section 24 Rule) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-brand-navy-900 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-brand-coral-600" />
                Affected Patient Bookings ({affectedOrders.length} Conflicted):
              </h4>
              <span className="text-[10px] text-brand-slate-400">Never silently cancels patients</span>
            </div>

            {affectedOrders.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {affectedOrders.map((o) => (
                  <div
                    key={o.orderId}
                    className="p-3 bg-white rounded-xl border border-brand-slate-200 shadow-2xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-brand-teal-700">{o.orderId}</strong>
                        <strong className="text-brand-navy-900">{o.patient?.name}</strong>
                      </div>
                      <p className="text-[11px] text-brand-slate-600">{o.scan?.name}</p>
                      <p className="text-[10px] text-brand-slate-400">
                        {o.appointmentDate} • <strong>{o.appointmentTime}</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onReassignOrder(o)}
                      className="px-3 py-1.5 bg-amber-50 text-amber-800 font-bold border border-amber-200 rounded-lg hover:bg-amber-100 flex items-center gap-1 text-[11px] whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reassign / Reschedule
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200 text-center text-brand-slate-500 text-xs">
                Zero active patient bookings affected by this maintenance schedule.
              </p>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-brand-slate-100 bg-brand-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-brand-slate-600 font-semibold rounded-xl border border-brand-slate-200 hover:bg-brand-slate-100 text-xs"
          >
            Close
          </button>

          <button
            onClick={handleToggleMaintenance}
            className={`px-4 py-2 font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5 text-white ${
              machine.status === 'Maintenance'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {machine.status === 'Maintenance' ? 'Restore Machine to Operational State' : 'Set Machine to Maintenance Mode'}
          </button>
        </div>

      </div>
    </div>
  );
}
