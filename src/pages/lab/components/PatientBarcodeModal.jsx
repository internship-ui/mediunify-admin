import React from 'react';
import {
  X,
  Printer,
  Download,
  Barcode,
  CheckCircle2,
  Building2,
  Calendar,
  User
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function PatientBarcodeModal({ isOpen, onClose, patient }) {
  const { addToast } = useToast();

  if (!isOpen || !patient) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    addToast(`Barcode generated for ${patient.name}`, 'success');
  };

  const labNo = patient.labNo || patient.patientId?.replace('PT-', '13') || '13915';
  const regNo = patient.regNo || patient.patientId?.replace('PT-', '261000') || '26100021';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-teal-50 text-brand-teal-700 rounded-lg border border-brand-teal-200">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy-900">
                Vacutainer Barcode Label
              </h3>
              <p className="text-xs text-brand-slate-500 font-mono">
                Lab No: {labNo} | Reg: {regNo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barcode Printable Label Canvas */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-white rounded-xl border-2 border-dashed border-brand-slate-300 text-center space-y-2 shadow-2xs font-mono">
            <div className="flex items-center justify-between text-[11px] font-bold text-brand-navy-900 border-b border-brand-slate-100 pb-1 font-sans">
              <span>MEDIUNIFY DIAGNOSTICS</span>
              <span className="text-brand-teal-700 font-mono">MYSURU</span>
            </div>

            <div className="text-left text-xs font-sans">
              <p className="font-extrabold text-brand-navy-900 text-sm">{patient.name}</p>
              <p className="text-brand-slate-600 text-[11px]">
                {patient.age} Yrs / {patient.gender || 'Female'} • Ref: Farookh Med. College
              </p>
            </div>

            {/* Rendered Barcode */}
            <div className="py-2 bg-brand-slate-50 rounded-lg border border-brand-slate-200 flex flex-col items-center justify-center">
              <span className="font-mono text-xl tracking-[0.25em] font-bold text-brand-navy-900">
                ||||| |||| ||||| ||| |||||||
              </span>
              <span className="font-mono text-xs font-bold text-brand-teal-800 mt-1">
                *{regNo}*
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-brand-slate-500 font-sans pt-1">
              <span>Lab No: <strong>{labNo}</strong></span>
              <span>Date: <strong>01-10-2026</strong></span>
            </div>
          </div>

          <p className="text-xs text-brand-slate-500 text-center">
            Standard 50mm x 25mm thermal sticker label for EDTA, Serum, and Fluoride tubes.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-brand-slate-200 bg-brand-slate-50 flex items-center justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-brand-slate-100 text-brand-slate-700 font-semibold rounded-xl border border-brand-slate-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Barcode Label
          </button>
        </div>
      </div>
    </div>
  );
}
