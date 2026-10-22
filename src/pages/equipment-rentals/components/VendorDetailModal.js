import React from 'react';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Package,
  FileCheck,
  TrendingUp,
  XCircle,
  Clock,
  ShieldCheck,
  Edit2,
  Power,
  IndianRupee,
  Layers
} from 'lucide-react';

export default function VendorDetailModal({
  isOpen,
  vendor,
  onClose,
  onToggleStatus,
  onEdit,
  onVerify
}) {
  if (!isOpen || !vendor) return null;

  const isVerified = (vendor.verificationStatus || '').toLowerCase() === 'verified';
  const isActive = (vendor.status || '').toLowerCase() === 'active';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-brand-teal-700 to-brand-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-200 border border-white/15">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{vendor.businessName}</h3>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full border bg-white/10 text-teal-100 border-white/20 font-mono">
                  {vendor.id}
                </span>
              </div>
              <p className="text-xs text-teal-100/80 mt-0.5">
                Contact: <strong>{vendor.name}</strong> • Registered on {vendor.registrationDate || '2026'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto text-slate-800 text-xs">
          {/* Status Bar: Verification & Operational Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500 uppercase text-[11px]">Verification Status:</span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs border ${
                  isVerified
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : vendor.verificationStatus === 'Rejected'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {isVerified ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>{vendor.verificationStatus || 'Verified'}</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500 uppercase text-[11px]">Operational Status:</span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs border ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                <span>{vendor.status || 'Active'}</span>
              </span>
            </div>
          </div>

          {/* Key Metrics: Total Requests & Recorded Rental Value */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200">
              <span className="text-[11px] font-bold text-teal-800 uppercase block">
                Total Rental Requests
              </span>
              <span className="text-xl font-black text-brand-navy-950 font-mono mt-0.5 block">
                {vendor.totalRentalRequests || 0} Requests
              </span>
              <span className="text-[10px] text-teal-700 font-medium">Selected by patients</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
              <span className="text-[11px] font-bold text-blue-800 uppercase block">
                Total Recorded Rental Value
              </span>
              <span className="text-xl font-black text-blue-950 font-mono mt-0.5 block">
                ₹{(vendor.totalRecordedRentalValue || 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-blue-700 font-medium">Monitoring only (no fee deducted)</span>
            </div>
          </div>

          {/* Contact & Business Address */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
            <span className="font-bold text-brand-navy-900 text-xs uppercase tracking-wider block">
              Contact & Address Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Contact Number</span>
                <a
                  href={`tel:${vendor.contact}`}
                  className="font-bold text-brand-teal-700 hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{vendor.contact}</span>
                </a>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Email Address</span>
                <a
                  href={`mailto:${vendor.email}`}
                  className="font-semibold text-slate-700 hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{vendor.email}</span>
                </a>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Physical Address</span>
                <p className="font-medium text-slate-800 flex items-start gap-1.5 mt-0.5">
                  <MapPin className="w-4 h-4 text-brand-teal-600 shrink-0 mt-0.5" />
                  <span>{vendor.address}, {vendor.city} - {vendor.pincode || 'Karnataka'}</span>
                </p>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Service Area Coverage</span>
                <p className="font-semibold text-brand-navy-900 mt-0.5">
                  {vendor.serviceArea || (vendor.serviceAreas ? vendor.serviceAreas.join(', ') : vendor.city)}
                </p>
              </div>
            </div>
          </div>

          {/* Equipment Categories Offered & Stock */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-brand-navy-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4 text-brand-teal-600" />
                <span>Equipment Categories Offered</span>
              </span>
              <span className="text-slate-500 font-semibold text-[11px]">
                {vendor.equipmentCategories?.length || 0} Categories
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(vendor.equipmentCategories || []).map((cat) => {
                const stock = vendor.equipmentStock?.[cat];
                return (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-brand-slate-100 text-brand-navy-900 border border-slate-200"
                  >
                    <span>{cat}</span>
                    {stock !== undefined && (
                      <span className="text-[10px] font-mono text-teal-700 font-bold bg-white px-1.5 py-0.2 rounded border border-teal-200">
                        {stock} units
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Verification Documents */}
          {vendor.documents && vendor.documents.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 text-xs uppercase tracking-wider block">
                Verification Documents
              </span>
              <div className="space-y-1.5">
                {vendor.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-brand-teal-600" />
                      <span className="font-semibold text-slate-800">{doc.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {!isVerified && onVerify && (
              <button
                type="button"
                onClick={() => {
                  onVerify(vendor.id);
                  onClose();
                }}
                className="px-3.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify Vendor</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (onToggleStatus) {
                  onToggleStatus(vendor.id, isActive ? 'Inactive' : 'Active');
                }
                onClose();
              }}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-colors ${
                isActive
                  ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isActive ? 'Deactivate Vendor' : 'Activate Vendor'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(vendor);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-brand-navy-950 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-brand-teal-600" />
                <span>Edit Vendor</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-teal-700 hover:bg-brand-teal-800 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
