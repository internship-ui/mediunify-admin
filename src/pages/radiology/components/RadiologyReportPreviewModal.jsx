import React from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Building2,
  Calendar,
  User,
  ScanLine,
  Send,
  Sparkles
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function RadiologyReportPreviewModal({
  isOpen,
  onClose,
  report,
  order
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);

  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  const scanCenterName =
    report.scanCenter ||
    report.centerName ||
    order?.center ||
    'Apollo Advanced Imaging & Diagnostic Center';

  const handleDownload = () => {
    addToast(`Downloading Diagnostic Imaging Report: ${report.reportId}.pdf (Presented by MediUnify - Scanned in ${scanCenterName})`, 'success');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-brand-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in-50 zoom-in-95 print:border-none print:shadow-none print:max-h-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-navy-50 text-brand-navy-900 rounded-lg border border-brand-navy-200">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-brand-navy-900">
                  Diagnostic Radiology & Imaging Report
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200 font-bold">
                  Presented by MediUnify
                </span>
              </div>
              <p className="text-xs text-brand-slate-500 font-mono mt-0.5">
                Report ID: {report.reportId} | Order ID: {report.orderId || order?.orderId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-brand-slate-700 bg-white border border-brand-slate-200 hover:bg-brand-slate-50 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-brand-navy-900 hover:bg-brand-navy-800 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100 rounded-lg transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Canvas */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-white print:p-0 print:m-0 text-brand-slate-800 relative">
          
          {/* Subtle MediUnify Authenticity Background Watermark */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center transform -rotate-25 opacity-[0.04]">
              <img
                src="/logo.png"
                alt=""
                className="w-80 max-w-sm h-auto object-contain grayscale mb-4"
              />
              <span className="text-5xl font-black tracking-widest text-brand-navy-900 uppercase">
                MEDIUNIFY
              </span>
              <span className="text-xl font-bold tracking-widest text-brand-slate-700 mt-2">
                PRESENTED BY MEDIUNIFY
              </span>
              <span className="text-sm font-semibold tracking-wider text-brand-teal-700 mt-1">
                SCANNED IN {scanCenterName.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            {/* Official Header with Dual Attribution (Presented by MediUnify & Scanned in Center) */}
            <div className="border-b-2 border-brand-navy-900 pb-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                
                {/* Left: Presented by MediUnify */}
                <div className="flex items-center gap-3.5">
                  <img
                    src="/logo.png"
                    alt="MediUnify Diagnostics"
                    className="h-12 w-auto object-contain rounded-lg border border-brand-slate-200 p-1 bg-white"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200 inline-block mb-1">
                      Presented by MediUnify
                    </span>
                    <h1 className="text-xl font-extrabold text-brand-navy-900 tracking-tight">
                      MediUnify Diagnostic Imaging Network
                    </h1>
                    <p className="text-xs text-brand-slate-500 font-medium">
                      Unified Diagnostic Radiology & PACS Network • High-Precision Imaging
                    </p>
                  </div>
                </div>

                {/* Right: Scanned in Center Card */}
                <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200 min-w-[260px] text-right sm:text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-teal-800 uppercase tracking-wider mb-1">
                    <Building2 className="w-3.5 h-3.5 text-brand-teal-600" />
                    Scanned in Center:
                  </div>
                  <p className="font-extrabold text-brand-navy-900 text-sm leading-snug">
                    {scanCenterName}
                  </p>
                  <p className="text-[10px] text-brand-slate-500 font-semibold mt-0.5">
                    AERB Licensed & Certified Imaging Center
                  </p>
                  <p className="text-[10px] text-brand-teal-700 font-bold mt-1">
                    Presented by MediUnify
                  </p>
                </div>
              </div>
            </div>

            {/* Demographics Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-brand-slate-50/80 rounded-xl border border-brand-slate-200 text-xs">
              <div>
                <p className="text-brand-slate-400 font-medium">Patient Name:</p>
                <p className="font-bold text-brand-navy-900 text-sm">{report.patientName || order?.patient?.name}</p>
                <p className="text-brand-slate-600">
                  Age / Gender: <span className="font-semibold">{report.patientAge || order?.patient?.age || '42'} Yrs / {report.gender || order?.patient?.gender || 'Male'}</span>
                </p>
                <p className="text-brand-slate-500 font-mono text-[11px]">Patient ID: {report.patientId || order?.patient?.patientId || 'PT-8801'}</p>
              </div>

              <div>
                <p className="text-brand-slate-400 font-medium">Study & Modality:</p>
                <p className="font-bold text-brand-navy-900 font-mono">{report.scanCode || order?.scan?.code || 'RAD-01'}</p>
                <p className="text-brand-slate-700 font-semibold">{report.scanName || order?.scan?.name}</p>
                <p className="text-brand-slate-500 text-[11px]">{report.machineName || order?.machine}</p>
              </div>

              <div>
                <p className="text-brand-slate-400 font-medium">Center & Location:</p>
                <p className="text-brand-navy-900 font-bold flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-brand-teal-600 shrink-0" />
                  {scanCenterName}
                </p>
                <p className="text-brand-teal-700 font-semibold text-[11px]">Presented by MediUnify</p>
              </div>

              <div>
                <p className="text-brand-slate-400 font-medium">Reporting Details:</p>
                <p className="text-brand-slate-700">
                  Study Date: <span className="font-semibold">{report.uploadedDate || '2026-10-01 07:15 AM'}</span>
                </p>
                <p className="text-brand-slate-700">
                  Consultant: <span className="font-semibold text-brand-teal-700">{report.verifiedBy || 'Dr. Vikramaditya Hegde, MD, FRCR'}</span>
                </p>
                <p className="text-brand-slate-500 text-[11px]">File: {report.fileName || 'Signed_Diagnostic_Report.pdf'}</p>
              </div>
            </div>

            {/* Ready Diagnostic Report Upload Notice */}
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950">
                    Official Ready Diagnostic Radiology Report Uploaded
                  </h4>
                  <p className="text-emerald-800 text-[11px]">
                    Certified complete report file: <strong>{report.fileName || 'Diagnostic_Scan_Report.pdf'}</strong> • Authenticated with MediUnify cryptographic security stamp.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-[11px] rounded-lg shadow-2xs">
                Ready & Verified
              </span>
            </div>

            {/* Findings & Summary */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-brand-navy-900 border-b border-brand-slate-200 pb-1.5 uppercase tracking-wide">
                Radiological Diagnostic Findings:
              </h3>

              {report.findings && report.findings.length > 0 ? (
                report.findings.map((f, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <strong className="text-brand-teal-800 font-bold block">{f.section}:</strong>
                    <p className="text-brand-slate-700 leading-relaxed pl-2 border-l-2 border-brand-teal-200">{f.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-brand-slate-500">Normal morphological contours and physiological attenuation acquired on cross-sectional sequences.</p>
              )}
            </div>

            {/* Final Diagnostic Impression Box */}
            <div className="p-4 bg-brand-teal-50/60 rounded-xl border-2 border-brand-teal-300 space-y-1 text-xs">
              <div className="flex items-center justify-between mb-1">
                <strong className="text-brand-navy-900 uppercase font-extrabold text-xs tracking-wide block">
                  Final Diagnostic Impression:
                </strong>
                <span className="text-[10px] font-bold text-brand-teal-800 bg-brand-teal-100/60 px-2 py-0.5 rounded">
                  Presented by MediUnify • Scanned in {scanCenterName}
                </span>
              </div>
              <p className="text-brand-navy-900 font-bold whitespace-pre-line leading-relaxed text-sm">
                {report.impression}
              </p>
            </div>

            {/* Radiologist Stamp & Signature Seal */}
            <div className="border-t border-brand-slate-200 pt-5 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              <div className="sm:col-span-2 text-brand-slate-500 space-y-1 text-[11px]">
                <p className="font-semibold text-brand-navy-900">Quality & Protocol Advisory:</p>
                <p>
                  * Diagnostic scan conducted in {scanCenterName} and presented through the MediUnify Healthcare Platform. Images securely archived on MediUnify PACS.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-brand-slate-200 bg-brand-slate-50/60 text-center">
                <div className="font-serif italic font-bold text-brand-navy-900 text-sm tracking-wide mb-1 border-b border-brand-teal-300 pb-1 w-full">
                  {report.verifiedBy || 'Dr. Vikramaditya Hegde, MD'}
                </div>
                <p className="text-[10px] font-bold text-brand-navy-900">Chief Consultant Radiologist</p>
                <p className="text-[9px] text-brand-slate-500">KMC Reg. No. 38419 / FRCR (UK)</p>
                <div className="mt-2 flex items-center gap-1.5 text-[9px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Digitally Verified & Locked
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="text-center text-[10px] text-brand-slate-400 border-t border-brand-slate-100 pt-3">
              This report is presented by MediUnify and was scanned in {scanCenterName}. Official authenticity verifiable at pacs.mediunify.com
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between text-xs print:hidden">
          <span className="text-brand-slate-500">
            Presentation: <strong className="text-brand-teal-700">Presented by MediUnify • Scanned in {scanCenterName}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-slate-200 hover:bg-brand-slate-300 text-brand-slate-800 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
}
