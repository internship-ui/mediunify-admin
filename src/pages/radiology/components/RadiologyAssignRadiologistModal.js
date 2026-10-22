import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Building2,
  Award,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { RADIOLOGY_RADIOLOGISTS } from '../../../data/radiologyData';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function RadiologyAssignRadiologistModal({
  isOpen,
  onClose,
  order,
  allRadiologists = RADIOLOGY_RADIOLOGISTS,
  onConfirmAssignment
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);

  const [selectedRadiologist, setSelectedRadiologist] = useState(
    allRadiologists.find((r) => r.availability === 'Available')?.name || allRadiologists[0]?.name
  );
  const [priorityFlag, setPriorityFlag] = useState('Routine'); // 'Routine' | 'Urgent / STAT' | 'Critical Review'
  const [instructions, setInstructions] = useState('Please review high-resolution DICOM slices on PACS workstation.');

  if (!isOpen || !order) return null;

  const handleAssign = (e) => {
    e.preventDefault();
    if (!selectedRadiologist) {
      addToast('Please select a radiologist.', 'warning');
      return;
    }

    onConfirmAssignment(order.orderId, {
      radiologistName: selectedRadiologist,
      priority: priorityFlag,
      instructions
    });

    addToast(`Order ${order.orderId} assigned to ${selectedRadiologist}.`, 'success');
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
            <div className="p-2 bg-brand-teal-50 text-brand-teal-700 rounded-lg border border-brand-teal-200">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">Assign Reporting Radiologist</h3>
              <p className="text-xs text-brand-slate-500">Scan: <strong className="text-brand-navy-900">{order.scan?.name}</strong></p>
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
        <form onSubmit={handleAssign} className="p-6 space-y-4 text-xs">
          
          {/* Order Snapshot */}
          <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-brand-navy-900">{order.patient?.name} ({order.patient?.age}Y, {order.patient?.gender})</p>
              <p className="text-[11px] text-brand-slate-500">{order.scan?.category} • {order.center?.split('-')[0]}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Scan Completed
            </span>
          </div>

          {/* Radiologists Selection Grid */}
          <div>
            <label className="font-bold text-brand-slate-700 block mb-1.5">
              Select Consultant Radiologist:
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {allRadiologists.map((doc) => {
                const isSelected = selectedRadiologist === doc.name;
                const isAvailable = doc.availability === 'Available';

                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedRadiologist(doc.name)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-teal-50/70 border-brand-teal-400 ring-2 ring-brand-teal-500/20'
                        : 'bg-white border-brand-slate-200 hover:bg-brand-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-brand-navy-900 text-xs">{doc.name}</strong>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                            isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {doc.availability}
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-teal-800 font-semibold">{doc.specialization}</p>
                      <p className="text-[10px] text-brand-slate-400">{doc.experience} • Rating {doc.rating}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-brand-navy-900">{doc.pendingReports}</span>
                      <p className="text-[10px] text-brand-slate-400">In Queue</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reporting Priority */}
          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Reporting Priority Level:</label>
            <div className="grid grid-cols-3 gap-2">
              {['Routine (Standard TAT)', 'Urgent / STAT (2 Hours)', 'Emergency Trauma (30 Mins)'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriorityFlag(p)}
                  className={`p-2 rounded-xl text-center font-bold text-[11px] border transition-all ${
                    priorityFlag === p
                      ? 'bg-brand-navy-900 text-white border-brand-navy-900 shadow-xs'
                      : 'bg-brand-slate-50 text-brand-slate-700 border-brand-slate-200 hover:bg-brand-slate-100'
                  }`}
                >
                  {p.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Clinical Focus Instructions */}
          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Clinical Notes for Radiologist:</label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-teal-500 text-xs font-medium"
            />
          </div>

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
              <CheckCircle2 className="w-4 h-4" />
              Assign & Create Report Draft
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
