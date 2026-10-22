import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  Building2,
  FileCheck2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function ReportUploadModal({
  isOpen,
  onClose,
  report,
  order,
  onSaveReport,
  onPreviewReport
}) {
  const { addToast } = useToast();

  const [fileName, setFileName] = useState('Laboratory_Diagnostic_Report_Signed.pdf');
  const [fileSize, setFileSize] = useState('342 KB');
  const [uploadProgress, setUploadProgress] = useState(100);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);

  // Auto-detected laboratory center
  const detectedCenter =
    order?.collection?.center ||
    order?.center ||
    report?.labCenter ||
    'Nova Diagnostics & Laboratory Centre';

  const [labCenter, setLabCenter] = useState(detectedCenter);

  if (!isOpen) return null;

  const handleSimulateFilePick = () => {
    setIsSimulatingUpload(true);
    setUploadProgress(20);
    const mockFiles = [
      'Nova_Diagnostics_Certified_Report_Signed.pdf',
      'Apollo_Diagnostics_Complete_Report_Signed.pdf',
      'Certified_Clinical_Diagnostic_Report.pdf'
    ];
    const picked = mockFiles[Math.floor(Math.random() * mockFiles.length)];

    setTimeout(() => {
      setUploadProgress(65);
    }, 200);

    setTimeout(() => {
      setFileName(picked);
      setFileSize(`${Math.floor(280 + Math.random() * 150)} KB`);
      setUploadProgress(100);
      setIsSimulatingUpload(false);
      addToast(`Selected ready report: ${picked}`, 'info');
    }, 400);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const reportId = report?.reportId || `REP-${Math.floor(10000 + Math.random() * 9000)}`;

    onSaveReport(reportId, {
      reportId,
      orderId: order?.orderId || report?.orderId || 'LAB10001',
      patientName: order?.patient?.name || report?.patientName || 'Rahul Kumar',
      patientAge: order?.patient?.age || report?.patientAge || 32,
      gender: order?.patient?.gender || report?.gender || 'Male',
      testOrPackageName: order?.bookedItem?.name || order?.testOrPackage?.name || report?.testOrPackageName || 'Diagnostic Investigation',
      sampleId: order?.sampleDetails?.sampleIds?.join(' / ') || report?.sampleId || 'SMP10001',
      labCenter: labCenter,
      reportStatus: 'UPLOADED',
      uploadedDate: new Date().toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      verifiedBy: 'Dr. Ramesh S. Rao, MD (Chief Pathologist)',
      deliveryStatus: 'Ready for Patient Delivery',
      fileName,
      fileSize,
      notes: 'Certified report uploaded directly from testing center with MediUnify watermark.'
    });

    addToast(`Ready report from ${labCenter} uploaded with MediUnify watermark`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-brand-slate-200 flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
        
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
                Order: {order?.orderId || report?.orderId || 'LAB10001'} • {order?.patient?.name || report?.patientName || 'Patient'}
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
          
          {/* Order & Center Context Pill */}
          <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block">
                Investigation / Test
              </span>
              <span className="font-bold text-brand-navy-900 text-xs">
                {order?.bookedItem?.name || order?.testOrPackage?.name || report?.testOrPackageName || 'Diagnostic Investigation'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block">
                Tested at Center
              </span>
              <span className="font-semibold text-brand-teal-800 text-xs flex items-center gap-1 justify-end">
                <Building2 className="w-3.5 h-3.5 text-brand-teal-600" />
                {labCenter}
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
              Ready Center PDF ({fileSize})
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

          {/* Simple Clean Attribution Note */}
          <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200 text-brand-slate-600 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
            <p className="text-[11px] leading-relaxed">
              MediUnify watermark and <strong>"Presented by MediUnify"</strong> will be applied automatically to this report upon upload.
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
