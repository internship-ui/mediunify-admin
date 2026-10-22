import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle2,
  XCircle,
  X,
  Check,
  AlertTriangle,
  Download,
  Calendar,
  Layers,
  Boxes
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function VendorVerificationDetailModal({
  isOpen,
  onClose,
  vendor,
  onApprove,
  onReject
}) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  if (!isOpen || !vendor) return null;

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      setRejectionError('Please enter a valid reason for rejecting this vendor registration.');
      return;
    }
    if (onReject) {
      onReject(vendor.id, rejectionReason.trim());
    }
    setShowRejectModal(false);
    onClose();
  };

  const handleApproveAction = () => {
    if (onApprove) {
      onApprove(vendor.id);
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between bg-brand-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-brand-navy-900 text-sm">
                    Vendor Registration Review
                  </h3>
                  <StatusBadge status={vendor.status} size="xs" />
                </div>
                <p className="text-[11px] text-brand-slate-500">
                  Vendor ID: {vendor.id} • Registered on {vendor.registrationDate}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-brand-slate-400 hover:text-brand-slate-700 p-1.5 rounded-lg hover:bg-brand-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            {/* 1. Vendor Information (Section 6) */}
            <div className="p-4 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-brand-teal-600" />
                Vendor Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-brand-slate-400 uppercase font-bold block">Vendor Name / Owner</span>
                  <p className="font-bold text-brand-navy-900 text-sm mt-0.5">{vendor.name}</p>
                </div>

                <div>
                  <span className="text-[10px] text-brand-slate-400 uppercase font-bold block">Business / Company Name</span>
                  <p className="font-bold text-brand-navy-900 text-sm mt-0.5">{vendor.businessName}</p>
                </div>

                <div>
                  <span className="text-[10px] text-brand-slate-400 uppercase font-bold block">Phone Number</span>
                  <p className="font-bold text-brand-teal-700 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-brand-teal-600" />
                    <span>{vendor.contact}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-brand-slate-400 uppercase font-bold block">Email Address</span>
                  <p className="font-semibold text-brand-slate-800 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-brand-teal-600" />
                    <span>{vendor.email}</span>
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] text-brand-slate-400 uppercase font-bold block">Warehouse / Physical Address</span>
                  <p className="font-medium text-brand-slate-800 flex items-start gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{vendor.address || vendor.location}, {vendor.city} - {vendor.pincode || '570001'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Equipment Information (Section 6) */}
            <div className="p-4 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 flex items-center gap-1.5">
                <Boxes className="w-4 h-4 text-brand-teal-600" />
                Supplied Equipment Categories & Declared Stock Capacity
              </h4>
              <p className="text-[11px] text-brand-slate-500">
                Equipment inventory capacity declared by the vendor for automated request routing:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {(vendor.equipmentCategories || []).map((cat, idx) => {
                  const units = vendor.equipmentStock?.[cat] || vendor.equipmentStock?.[cat.trim()] || 10;
                  return (
                    <div
                      key={idx}
                      className="px-3 py-2 bg-white text-brand-navy-900 border border-brand-teal-200 rounded-xl text-xs font-semibold flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-brand-teal-600 shrink-0" />
                        <span>{cat}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-brand-teal-50 text-brand-teal-700 font-mono font-bold text-[11px] border border-brand-teal-100">
                        {units} Units
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Registration Documents (Section 6) */}
            <div className="p-4 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-teal-600" />
                Submitted Verification Documents
              </h4>

              <div className="space-y-2">
                {(vendor.documents || [
                  { name: 'Business Registration Certificate (GST/MSME)', type: 'PDF Document', size: '2.4 MB', status: 'Submitted' },
                  { name: 'Medical Equipment Dealership License', type: 'PDF Document', size: '1.8 MB', status: 'Submitted' },
                  { name: 'Identity & Address Verification (Aadhaar/PAN)', type: 'PDF Document', size: '1.2 MB', status: 'Submitted' }
                ]).map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-brand-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-brand-teal-50 text-brand-teal-700">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-navy-900">{doc.name}</p>
                        <span className="text-[10px] text-brand-slate-400">{doc.type} • {doc.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-green-50 text-brand-green-700 border border-brand-green-200">
                        {doc.status || 'Verified'}
                      </span>
                      <button
                        type="button"
                        onClick={() => alert(`Viewing document: ${doc.name}`)}
                        className="p-1 text-brand-slate-500 hover:text-brand-teal-700 hover:bg-brand-slate-100 rounded-lg transition-colors"
                        title="View Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {vendor.rejectionReason && (
              <div className="p-3.5 rounded-xl bg-brand-coral-50 border border-brand-coral-200 text-xs text-brand-coral-800 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-brand-coral-600" />
                  Previous Rejection Reason:
                </span>
                <p className="text-[11px] leading-relaxed">{vendor.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Footer Actions (Section 6) */}
          <div className="p-4 bg-brand-slate-50 border-t border-brand-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-brand-slate-600 hover:bg-brand-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>

            <div className="flex items-center gap-2.5">
              {vendor.status !== 'Rejected' && (
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2 bg-brand-coral-50 hover:bg-brand-coral-600 text-brand-coral-700 hover:text-white rounded-xl text-xs font-bold border border-brand-coral-200 transition-all inline-flex items-center gap-1.5 active:scale-95"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Vendor</span>
                </button>
              )}

              {vendor.status !== 'Active' && vendor.status !== 'Approved' && (
                <button
                  type="button"
                  onClick={handleApproveAction}
                  className="px-5 py-2 bg-brand-green-600 hover:bg-brand-green-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Vendor</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Reason Modal (Requirement 6) */}
      {showRejectModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-brand-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
            <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between bg-brand-coral-50/60">
              <div className="flex items-center gap-2 text-brand-coral-800">
                <AlertTriangle className="w-5 h-5 text-brand-coral-600" />
                <h3 className="font-bold text-sm">Reject Vendor Registration</h3>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-brand-slate-400 hover:text-brand-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <p className="text-brand-slate-600">
                Please specify the official reason for rejecting <strong>{vendor.businessName}</strong>. This feedback will be recorded in the vendor registry.
              </p>

              <div>
                <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                  Reason for Rejection *
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (rejectionError) setRejectionError('');
                  }}
                  placeholder="e.g. Incomplete GST trade license documentation / Unverified warehouse address."
                  className="w-full px-3 py-2 border border-brand-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-coral-500/20 text-xs font-medium"
                />
                {rejectionError && (
                  <p className="text-[11px] text-brand-coral-600 font-semibold mt-1">{rejectionError}</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-brand-slate-50 border-t border-brand-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-bold text-brand-slate-600 hover:bg-brand-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-bold bg-brand-coral-600 hover:bg-brand-coral-700 text-white rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Vendor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
