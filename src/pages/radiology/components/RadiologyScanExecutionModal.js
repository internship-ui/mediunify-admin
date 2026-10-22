import React, { useState } from 'react';
import {
  X,
  ScanLine,
  CheckCircle2,
  Play,
  Clock,
  User,
  Server,
  Building2,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function RadiologyScanExecutionModal({
  isOpen,
  onClose,
  order,
  actionType = 'start', // 'arrive' | 'start' | 'complete'
  onConfirmArrival,
  onConfirmStartScan,
  onConfirmCompleteScan
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);

  const [technologist, setTechnologist] = useState(order?.operator || 'Arjun Rao (Senior Technologist)');
  const [contrastDosage, setContrastDosage] = useState('75 ml Omnipaque (Non-ionic Iso-osmolar)');
  const [remarks, setRemarks] = useState('Patient tolerated examination without claustrophobia or motion artifact.');
  const [slicesAcquired, setSlicesAcquired] = useState('1,240 Slices');

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (actionType === 'arrive') {
      onConfirmArrival(order.orderId);
      addToast(`Patient ${order.patient?.name} marked as ARRIVED at center reception.`, 'success');
    } else if (actionType === 'start') {
      onConfirmStartScan(order.orderId, {
        technologist,
        contrastDosage: order.scan?.contrastRequired ? contrastDosage : null,
        remarks
      });
      addToast(`Scan started for ${order.patient?.name} on ${order.machine}. Status updated to IN PROGRESS.`, 'success');
    } else if (actionType === 'complete') {
      onConfirmCompleteScan(order.orderId, {
        slicesAcquired,
        remarks
      });
      addToast(`Scan completed for ${order.patient?.name}. Raw DICOM images transmitted to PACS.`, 'success');
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-100 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-navy-50 text-brand-navy-900 rounded-lg border border-brand-navy-200">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">
                {actionType === 'arrive' && 'Confirm Patient Arrival & Check-In'}
                {actionType === 'start' && 'Initiate Gantry Scan Execution'}
                {actionType === 'complete' && 'Mark Scan Completed & Route to PACS'}
              </h3>
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

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Order Snapshot */}
          <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-brand-navy-900 text-sm">{order.patient?.name}</strong>
              <span className="text-[11px] font-mono text-brand-teal-700 font-bold">{order.orderId}</span>
            </div>
            <p className="font-bold text-brand-teal-800">{order.scan?.name}</p>
            <p className="text-brand-slate-500 text-[11px]">
              {order.center?.split('-')[0]} • <strong>{order.machine}</strong>
            </p>
          </div>

          {/* Action-Specific Form Elements */}
          {actionType === 'arrive' && (
            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2 text-emerald-900">
              <p className="font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Patient Identity & Reception Check-in
              </p>
              <p className="text-[11px] leading-relaxed text-emerald-800">
                Confirming patient physical presence at center reception. Patient will be moved to the dressing area and provided an imaging locker token.
              </p>
            </div>
          )}

          {actionType === 'start' && (
            <div className="space-y-3">
              <div>
                <label className="font-bold text-brand-slate-700 block mb-1">Operating Technologist / Radiographer:</label>
                <div className="relative">
                  <User className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={technologist}
                    onChange={(e) => setTechnologist(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 text-xs font-medium"
                    required
                  />
                </div>
              </div>

              {order.scan?.contrastRequired && (
                <div>
                  <label className="font-bold text-brand-slate-700 block mb-1">Contrast Agent & Dosage:</label>
                  <input
                    type="text"
                    value={contrastDosage}
                    onChange={(e) => setContrastDosage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 text-xs font-medium"
                    required
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-brand-slate-700 block mb-1">Pre-Scan Technologist Remarks:</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 text-xs font-medium"
                />
              </div>
            </div>
          )}

          {actionType === 'complete' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-brand-teal-50/50 rounded-xl border border-brand-teal-200 space-y-2">
                <p className="font-bold text-xs text-brand-navy-900 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-brand-teal-600" />
                  DICOM Reconstruction & PACS Transmission
                </p>
                <p className="text-[11px] text-brand-slate-600 leading-relaxed">
                  Marking scan as complete triggers auto-routing of raw high-resolution DICOM series to the central PACS server for Radiologist workstation review.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-brand-slate-700 block mb-1">Total Slices Acquired:</label>
                  <input
                    type="text"
                    value={slicesAcquired}
                    onChange={(e) => setSlicesAcquired(e.target.value)}
                    className="w-full p-2 rounded-xl border border-brand-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-brand-slate-700 block mb-1">Completion Time:</label>
                  <input
                    type="text"
                    defaultValue={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    className="w-full p-2 rounded-xl border border-brand-slate-200 text-xs font-medium bg-brand-slate-50"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-brand-slate-700 block mb-1">Technician Scan Quality Remarks:</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 text-xs font-medium"
                />
              </div>
            </div>
          )}

          {/* Footer */}
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
              className="px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5"
            >
              {actionType === 'arrive' && <><CheckCircle2 className="w-4 h-4" /> Mark Patient Arrived</>}
              {actionType === 'start' && <><Play className="w-4 h-4" /> Start Scan Execution</>}
              {actionType === 'complete' && <><CheckCircle2 className="w-4 h-4" /> Finalize & Send to PACS</>}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
