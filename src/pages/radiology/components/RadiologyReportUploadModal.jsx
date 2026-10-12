import React, { useState } from 'react';
import {
  X,
  Upload,
  FileCheck2,
  CheckCircle2,
  Building2,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function RadiologyReportUploadModal({
  isOpen,
  onClose,
  report,
  order,
  onSaveReport
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);

  const [fileName, setFileName] = useState('Radiology_Scan_Diagnostic_Report_Signed.pdf');
  const [fileSize, setFileSize] = useState('420 KB');
  const [uploadProgress, setUploadProgress] = useState(100);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);

  // Auto-detected scan center
  const detectedCenter =
    order?.center ||
    report?.centerName ||
    report?.scanCenter ||
    'Apollo Advanced Imaging & Diagnostic Center';

  const [scanCenter, setScanCenter] = useState(detectedCenter);

  if (!isOpen) return null;

  const currentReportId = report?.reportId || order?.reportId || `RPT-RAD-${Math.floor(4000 + Math.random() * 900)}`;

  const handleSimulateFilePick = () => {
    setIsSimulatingUpload(true);
    setUploadProgress(25);
    const mockFiles = [
      `${(order?.scan?.name || 'Scan').replace(/[^a-zA-Z0-9]/g, '_')}_Signed_Report.pdf`,
      'Radiology_Diagnostic_Imaging_Report_Signed.pdf',
      'Clinical_Scan_Diagnostic_Report_Ready.pdf'
    ];
    const picked = mockFiles[Math.floor(Math.random() * mockFiles.length)];

    setTimeout(() => {
      setUploadProgress(70);
    }, 200);

    setTimeout(() => {
      setFileName(picked);
      setFileSize(`${Math.floor(350 + Math.random() * 200)} KB`);
      setUploadProgress(100);
      setIsSimulatingUpload(false);
      addToast(`Selected ready scan report: ${picked}`, 'info');
    }, 400);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();

    const reportPayload = {
      reportId: currentReportId,
      orderId: order?.orderId || report?.orderId || 'RAD-8001',
      patientName: order?.patient?.name || report?.patientName || 'Patient',
      patientAge: order?.patient?.age || report?.patientAge || '42',
      gender: order?.patient?.gender || report?.gender || 'Male',
      patientId: order?.patient?.patientId || report?.patientId || 'PT-8801',
      scanName: order?.scan?.name || report?.scanName || 'Diagnostic Scan',
      scanCode: order?.scan?.code || report?.scanCode || 'RAD-01',
      modality: order?.scan?.category || report?.modality || 'MRI',
      centerName: scanCenter,
      scanCenter: scanCenter,
      machineName: order?.machine || report?.machineName || 'Siemens Magnetom 3T',
      referringPhysician: 'Consultant Clinical Team',
      clinicalHistory: order?.clinicalNotes || 'Evaluation of chronic intermittent headaches and localized pain.',
      protocol: 'Axial, Sagittal and Coronal multi-sequence reconstructed slices acquired on 3T platform.',
      findings: [
        { section: 'Anatomical Structure / Region', text: 'Normal morphological contours, tissue attenuation and signal characteristics. No focal mass lesion, acute hemorrhage or edema detected.' },
        { section: 'Bony Architecture & Soft Tissues', text: 'Intact cortical margins. Normal mineralization without fracture or destructive osteolytic pathology.' }
      ],
      impression: '1. Diagnostic imaging study within normal physiological limits.\n2. No acute or focal intracranial/regional pathology identified.',
      verifiedBy: order?.radiologist || report?.verifiedBy || 'Dr. Vikramaditya Hegde, MD, FRCR',
      reportStatus: 'UPLOADED',
      uploadedDate: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      deliveryStatus: 'Ready for Patient Delivery',
      fileName,
      fileSize,
      notes: `Ready report scanned in ${scanCenter} uploaded with MediUnify watermark.`
    };

    onSaveReport(currentReportId, reportPayload);
    addToast(`Ready scan report from ${scanCenter} uploaded successfully!`, 'success');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-brand-slate-200 flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-teal-50 text-brand-teal-700 rounded-lg border border-brand-teal-200">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy-900">
                Upload Ready Report
              </h3>
              <p className="text-xs text-brand-slate-500 font-mono">
                Report ID: <strong className="font-mono text-brand-teal-700">{currentReportId}</strong> • {order?.patient?.name || report?.patientName || 'Patient'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simplified Upload Body */}
        <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Order & Scan Center Context Pill */}
          <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block">
                Imaging Scan / Procedure
              </span>
              <span className="font-bold text-brand-navy-900 text-xs">
                {order?.scan?.name || report?.scanName || 'Diagnostic Scan Investigation'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block">
                Scanned in Center
              </span>
              <span className="font-semibold text-brand-teal-800 text-xs flex items-center gap-1 justify-end">
                <Building2 className="w-3.5 h-3.5 text-brand-teal-600" />
                {scanCenter}
              </span>
            </div>
          </div>

          {/* Clean Big File Upload Drop Area */}
          <div
            onClick={handleSimulateFilePick}
            className="border-2 border-dashed border-brand-teal-300 bg-brand-teal-50/20 hover:bg-brand-teal-50/50 rounded-2xl p-6 text-center cursor-pointer transition-all group"
          >
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white border border-brand-teal-200 flex items-center justify-center text-brand-teal-600 shadow-xs group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-7 h-7" />
            </div>
            
            <p className="font-bold text-brand-navy-900 text-sm">{fileName}</p>
            <p className="text-xs text-brand-slate-500 mt-1">
              Ready Diagnostic Report PDF ({fileSize})
            </p>
            
            {/* Progress Bar during simulated file pick */}
            {isSimulatingUpload && (
              <div className="w-48 mx-auto mt-2.5 bg-brand-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-brand-teal-600 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-brand-slate-200 text-brand-slate-700 font-semibold rounded-xl text-xs shadow-2xs hover:bg-brand-slate-50 transition-colors">
                <Upload className="w-3.5 h-3.5 text-brand-teal-600" />
                Browse / Replace PDF
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Signed Ready Report
              </span>
            </div>
          </div>

          {/* Clean Attribution Note */}
          <div className="p-3 rounded-xl bg-brand-teal-50/50 border border-brand-teal-200 text-brand-slate-700 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-brand-teal-600 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              When shared with the patient, report is presented as <strong className="text-brand-teal-800 font-bold">"Presented by MediUnify"</strong> and <strong className="text-brand-navy-900 font-bold">"Scanned in {scanCenter}"</strong> with official authenticity seal.
            </p>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-brand-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-brand-slate-100 text-brand-slate-700 text-xs font-semibold rounded-xl border border-brand-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-teal-600 hover:bg-brand-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Upload Ready Report
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
