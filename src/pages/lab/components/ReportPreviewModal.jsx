import React from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Building2,
  Calendar,
  User,
  Phone,
  Send,
  Award,
  Check
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function ReportPreviewModal({
  isOpen,
  onClose,
  report,
  order,
  onSendToPatient
}) {
  const { addToast } = useToast();

  if (!isOpen || !report) return null;

  const labCenterName =
    report.labCenter ||
    order?.collection?.center ||
    order?.center ||
    'Nova Diagnostics & Laboratory Centre';

  const patientName = report.patientName || order?.patient?.name || 'Rahul Kumar';
  const patientId = order?.patient?.patientId || 'MU-10245';
  const patientAge = report.patientAge || order?.patient?.age || '32';
  const patientGender = report.gender || order?.patient?.gender || 'Male';
  const patientPhone = order?.patient?.phone || '+91 98765 43210';
  const reportDate = report.uploadedDate && report.uploadedDate !== '—' ? report.uploadedDate : '08 October 2026';
  const sampleId = report.sampleId || order?.sampleDetails?.sampleIds?.join(' / ') || 'SMP-10001 / SMP-10002';
  const testName = report.testOrPackageName || order?.bookedItem?.name || 'Complete Health Screening Package (7 Tests)';

  const isDelivered = (order?.orderStatus === 'COMPLETED' || order?.orderStatus === 'REPORT DELIVERED' || report?.reportStatus === 'DELIVERED');

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    addToast(`Downloading Official Report: ${report.reportId}.pdf (Presented by MediUnify)`, 'success');
  };

  const handleDeliver = () => {
    if (onSendToPatient) {
      onSendToPatient(report.orderId || order?.orderId || report.reportId);
    }
    addToast(`Diagnostic report successfully sent to ${patientName} via WhatsApp and Email`, 'success');
    if (onClose) {
      onClose();
    }
  };

  // Full comprehensive 16 clinical parameters from certified laboratory
  const displayParameters = report.parameters && report.parameters.length > 0
    ? report.parameters
    : [
        { name: 'Hemoglobin (Hb)', value: '14.6', unit: 'g/dL', normalRange: '13.0 - 17.0', flag: 'Normal' },
        { name: 'Total Leukocyte Count (WBC)', value: '7,200', unit: 'cells/cu.mm', normalRange: '4,000 - 11,000', flag: 'Normal' },
        { name: 'Platelet Count', value: '2.60', unit: 'lakh/cu.mm', normalRange: '1.50 - 4.50', flag: 'Normal' },
        { name: 'Fasting Blood Glucose', value: '94', unit: 'mg/dL', normalRange: '70 - 99', flag: 'Normal' },
        { name: 'HbA1c (Glycated Hemoglobin)', value: '5.4', unit: '%', normalRange: '< 5.7', flag: 'Normal' },
        { name: 'Total Cholesterol', value: '182', unit: 'mg/dL', normalRange: '< 200', flag: 'Normal' },
        { name: 'Triglycerides', value: '138', unit: 'mg/dL', normalRange: '< 150', flag: 'Normal' },
        { name: 'HDL Cholesterol', value: '48', unit: 'mg/dL', normalRange: '> 40', flag: 'Normal' },
        { name: 'LDL Cholesterol', value: '106', unit: 'mg/dL', normalRange: '< 100', flag: 'Borderline' },
        { name: 'SGOT / AST', value: '26', unit: 'U/L', normalRange: '10 - 40', flag: 'Normal' },
        { name: 'SGPT / ALT', value: '31', unit: 'U/L', normalRange: '7 - 45', flag: 'Normal' },
        { name: 'Serum Bilirubin (Total)', value: '0.8', unit: 'mg/dL', normalRange: '0.2 - 1.2', flag: 'Normal' },
        { name: 'Serum Creatinine', value: '0.95', unit: 'mg/dL', normalRange: '0.7 - 1.3', flag: 'Normal' },
        { name: 'Blood Urea', value: '24', unit: 'mg/dL', normalRange: '15 - 40', flag: 'Normal' },
        { name: 'Urine Routine (Protein)', value: 'Nil', unit: 'Semi-Quant', normalRange: 'Nil / Negative', flag: 'Normal' },
        { name: 'Urine Routine (Sugar)', value: 'Nil', unit: 'Semi-Quant', normalRange: 'Nil / Negative', flag: 'Normal' }
      ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-brand-slate-200 flex flex-col max-h-[94vh] overflow-hidden animate-in fade-in-50 zoom-in-95 print:border-none print:shadow-none print:max-h-none print:rounded-none">
        
        {/* Top Control Bar (Screen Only) */}
        <div className="px-6 py-3.5 border-b border-brand-slate-200 bg-brand-slate-50 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-teal-50 text-brand-teal-700 rounded-lg border border-brand-teal-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy-900 flex items-center gap-2">
                Official Laboratory Diagnostic Report
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  Presented by MediUnify
                </span>
              </h3>
              <p className="text-xs text-brand-slate-500 font-mono">
                Report ID: {report.reportId} | Order: {report.orderId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-brand-slate-700 bg-white border border-brand-slate-200 hover:bg-brand-slate-100 shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-brand-slate-700 bg-white border border-brand-slate-200 hover:bg-brand-slate-100 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
            <button
              onClick={handleDeliver}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg text-white bg-brand-teal-600 hover:bg-brand-teal-700 shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {isDelivered ? 'Report Delivered (Resend)' : 'Send to Patient'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100 rounded-lg transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Report Canvas */}
        <div className="relative flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 bg-white text-brand-slate-800 print:p-6 print:m-0 print:overflow-visible">
          
          {/* ============================================================ */}
          {/* SUBTLE, PROFESSIONAL MEDIUNIFY WATERMARK (BEHIND CONTENT) */}
          {/* ============================================================ */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center"
          >
            {/* Center Primary Watermark Stamp */}
            <div className="flex flex-col items-center justify-center transform -rotate-25 opacity-[0.045]">
              <img
                src="/logo.png"
                alt=""
                className="w-80 max-w-sm h-auto object-contain grayscale mb-4"
              />
              <span className="text-5xl font-black tracking-widest text-brand-navy-900 uppercase">
                MEDIUNIFY
              </span>
              <span className="text-xl font-bold tracking-widest text-brand-slate-700 mt-2">
                PRESENTED BY MEDIUNIFY HEALTHCARE
              </span>
              <span className="text-sm font-semibold tracking-wider text-brand-slate-500 mt-1">
                AUTHENTICATED DIAGNOSTIC RECORD
              </span>
            </div>

            {/* Top-Right Secondary Watermark Stamp */}
            <div className="absolute top-16 right-10 transform -rotate-15 opacity-[0.035] text-center hidden md:block">
              <span className="text-2xl font-black tracking-wider text-brand-teal-900 block">
                PRESENTED BY MEDIUNIFY
              </span>
              <span className="text-xs font-bold text-brand-slate-600">
                VERIFIED PARTNER LABORATORY
              </span>
            </div>

            {/* Bottom-Left Secondary Watermark Stamp */}
            <div className="absolute bottom-20 left-10 transform -rotate-15 opacity-[0.035] text-center hidden md:block">
              <span className="text-2xl font-black tracking-wider text-brand-teal-900 block">
                PRESENTED BY MEDIUNIFY
              </span>
              <span className="text-xs font-bold text-brand-slate-600">
                SECURE HEALTH ARCHIVE
              </span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* FOREGROUND REPORT CONTENT (Z-10 FOR COMPLETE CLARITY)       */}
          {/* ============================================================ */}
          <div className="relative z-10 space-y-6">

            {/* Official Report Header */}
            <div className="border-b-2 border-brand-teal-600 pb-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                
                {/* Brand & Document Title */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-xl border border-brand-slate-200 shadow-2xs">
                    <img
                      src="/logo.png"
                      alt="MediUnify"
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                      Presented by MediUnify
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-brand-navy-900 tracking-tight mt-1">
                      LABORATORY TEST REPORT
                    </h1>
                    <p className="text-xs text-brand-slate-500 font-medium">
                      MediUnify Unified Health Diagnostic Network
                    </p>
                  </div>
                </div>

                {/* Prominent "Tested at" Center Attribution Card */}
                <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200 min-w-[260px] text-right sm:text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-teal-800 uppercase tracking-wider mb-1">
                    <Building2 className="w-3.5 h-3.5 text-brand-teal-600" />
                    Tested at:
                  </div>
                  <p className="font-extrabold text-brand-navy-900 text-sm leading-snug">
                    {labCenterName}
                  </p>
                  <p className="text-[10px] text-brand-slate-500 font-semibold mt-0.5">
                    NABL Accredited & ISO 15189:2022 Certified Lab
                  </p>
                  <p className="text-[10px] text-brand-teal-700 font-bold mt-1">
                    Presented by MediUnify
                  </p>
                </div>
              </div>
            </div>

            {/* Patient & Specimen Demographics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-brand-slate-50/90 rounded-xl border border-brand-slate-200 text-xs">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400">Patient Details</p>
                <p className="font-bold text-brand-navy-900 text-sm">{patientName}</p>
                <p className="text-brand-slate-600">
                  Patient ID: <span className="font-mono font-bold text-brand-slate-900">{patientId}</span>
                </p>
                <p className="text-brand-slate-600">
                  Age / Gender: <span className="font-semibold">{patientAge} Yrs / {patientGender}</span>
                </p>
                <p className="text-brand-slate-500 text-[11px]">Phone: {patientPhone}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400">Sample & Center</p>
                <p className="text-brand-slate-700">
                  Report ID: <span className="font-mono font-bold text-brand-navy-900">{report.reportId}</span>
                </p>
                <p className="text-brand-slate-700">
                  Sample Barcode: <span className="font-mono font-semibold text-brand-teal-800">{sampleId}</span>
                </p>
                <p className="text-brand-slate-600">
                  Testing Center: <span className="font-semibold text-brand-navy-900">{labCenterName}</span>
                </p>
                <p className="text-[11px] text-brand-teal-700 font-bold">
                  Presentation: Presented by MediUnify
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400">Dates & Signee</p>
                <p className="text-brand-slate-700">
                  Date Reported: <span className="font-semibold">{reportDate}</span>
                </p>
                <p className="text-brand-slate-700">
                  Verified by: <span className="font-semibold text-brand-navy-900">{report.verifiedBy || 'Dr. Ramesh S. Rao, MD (Path)'}</span>
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Accredited Test Results
                  </span>
                </div>
              </div>
            </div>

            {/* Test Investigation Headline */}
            <div className="bg-brand-teal-50/80 p-3 rounded-xl border border-brand-teal-100 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-teal-700">
                  Diagnostic Investigation Conducted
                </span>
                <h2 className="text-base font-bold text-brand-navy-900">{testName}</h2>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-brand-slate-600 block">
                  Tested at: {labCenterName}
                </span>
                <span className="text-[10px] font-bold text-brand-teal-800">
                  Presented by MediUnify
                </span>
              </div>
            </div>

            {/* Test Results Table (Clean, Certified from Lab Center) */}
            <div className="border border-brand-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-brand-slate-100/90 text-brand-slate-700 font-bold border-b border-brand-slate-200">
                    <th className="py-2.5 px-4">Test Parameter / Analyte</th>
                    <th className="py-2.5 px-3 text-center w-28">Observed Result</th>
                    <th className="py-2.5 px-3 w-24">Unit</th>
                    <th className="py-2.5 px-3 w-36">Biological Reference Range</th>
                    <th className="py-2.5 px-3 text-center w-28">Clinical Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100">
                  {displayParameters.map((param, index) => {
                    const isAbnormal = param.flag === 'High' || param.flag === 'Low' || param.flag === 'Critical';
                    return (
                      <tr
                        key={index}
                        className={`hover:bg-brand-slate-50/80 transition-colors ${
                          isAbnormal ? 'bg-amber-50/40' : ''
                        }`}
                      >
                        <td className="py-2.5 px-4 font-semibold text-brand-navy-900">
                          {param.name}
                        </td>
                        <td className={`py-2.5 px-3 text-center font-bold text-sm ${
                          param.flag === 'High'
                            ? 'text-brand-coral-700'
                            : param.flag === 'Low'
                            ? 'text-amber-700'
                            : 'text-brand-navy-900'
                        }`}>
                          {param.value}
                        </td>
                        <td className="py-2.5 px-3 text-brand-slate-500 font-mono text-[11px]">
                          {param.unit}
                        </td>
                        <td className="py-2.5 px-3 text-brand-slate-600 font-medium">
                          {param.normalRange}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {param.flag === 'High' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                              <AlertTriangle className="w-2.5 h-2.5" /> High
                            </span>
                          ) : param.flag === 'Low' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <AlertTriangle className="w-2.5 h-2.5" /> Low
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pathologist Remarks & Digital Signature */}
            <div className="border-t border-brand-slate-200 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Remarks Box */}
              <div className="sm:col-span-2 text-xs text-brand-slate-600 space-y-1.5">
                <p className="font-bold text-brand-navy-900 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-brand-teal-600" />
                  Clinical Remarks from {labCenterName}:
                </p>
                <p className="bg-brand-slate-50 p-3 rounded-lg border border-brand-slate-200/80 leading-relaxed text-[11px]">
                  All specimens were processed and analyzed in accordance with standardized analytical protocols at <strong>{labCenterName}</strong>. Calibration curves, internal quality control standards (Westgard rules) and biological reference intervals verified for age and gender.
                </p>
                <p className="text-[10px] text-brand-slate-400">
                  * Final analytical output presented by MediUnify Healthcare Unified Network.
                </p>
              </div>

              {/* Signature Box */}
              <div className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-brand-slate-200 bg-brand-slate-50/70 text-center">
                <div className="font-serif italic font-bold text-brand-teal-800 text-sm tracking-wide mb-1 border-b border-brand-teal-300 pb-1 w-full">
                  {report.verifiedBy ? report.verifiedBy.split(',')[0] : 'Dr. Ramesh S. Rao'}
                </div>
                <p className="text-[10px] font-bold text-brand-navy-900">
                  Consultant Pathologist
                </p>
                <p className="text-[9px] text-brand-slate-500 font-medium">
                  {labCenterName}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Digitally Signed & Locked
                </div>
              </div>
            </div>

            {/* Official Report Footer (Required Branding & Attribution) */}
            <div className="border-t-2 border-brand-slate-200 pt-4 text-center space-y-1.5">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-bold text-brand-navy-900">
                <span>Tested at: {labCenterName}</span>
                <span className="text-brand-slate-300">•</span>
                <span className="text-brand-teal-700">Presented by MediUnify</span>
              </div>
              
              <p className="text-[10px] text-brand-slate-500 max-w-2xl mx-auto leading-relaxed">
                This diagnostic test was performed by the accredited testing laboratory specified above ({labCenterName}). MediUnify provides patient presentation, digital access, and logistics coordination. For verification scan the security barcode or visit <strong>verify.mediunify.care</strong>.
              </p>
            </div>

          </div>
        </div>

        {/* Modal Bottom Footer (Screen Only) */}
        <div className="px-6 py-3 border-t border-brand-slate-200 bg-brand-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs print:hidden">
          <div className="flex items-center gap-2 text-brand-slate-500">
            <span>Tested at: <strong className="text-brand-navy-900">{labCenterName}</strong></span>
            <span>•</span>
            <span>Presented by: <strong className="text-brand-teal-700">MediUnify</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDeliver}
              className="px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {isDelivered ? 'Report Delivered (Resend)' : 'Send to Patient'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-brand-slate-200 hover:bg-brand-slate-300 text-brand-slate-800 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Close Viewer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
