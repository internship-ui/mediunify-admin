import React from 'react';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Activity,
  Package,
  Layers,
  FileCheck,
  TrendingUp,
  XCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function VendorDetailModal({
  isOpen,
  vendor,
  onClose,
  onToggleStatus
}) {
  if (!isOpen || !vendor) return null;

  const activity = vendor.rentalActivity || {
    totalRequests: 0,
    acceptedRequests: 0,
    completedRentals: 0,
    cancelledRentals: 0
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Inactive':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-brand-teal-700 to-brand-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-200 border border-white/15">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{vendor.businessName}</h3>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border bg-white/10 text-teal-100 border-white/20`}>
                  {vendor.id}
                </span>
              </div>
              <p className="text-xs text-teal-100/80">
                Registered Contact: {vendor.name} • Registered on {vendor.registrationDate}
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

        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto text-slate-800">
          {/* Status Bar */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Account Status:</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${getStatusBadge(vendor.status)}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${vendor.status === 'Active' ? 'bg-emerald-500' : vendor.status === 'Inactive' ? 'bg-slate-400' : 'bg-amber-500'}`} />
                {vendor.status}
              </span>
            </div>
            {vendor.status === 'Active' ? (
              <button
                type="button"
                onClick={() => onToggleStatus && onToggleStatus(vendor.id, 'Inactive')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
              >
                Deactivate Vendor
              </button>
            ) : vendor.status === 'Inactive' ? (
              <button
                type="button"
                onClick={() => onToggleStatus && onToggleStatus(vendor.id, 'Active')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
              >
                Activate Vendor
              </button>
            ) : null}
          </div>

          {/* Section 1: Vendor Profile */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-brand-teal-600" />
              Vendor Profile
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div>
                <p className="text-xs text-slate-400">Vendor Name</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{vendor.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Business / Company Name</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{vendor.businessName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Contact Number</p>
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <a href={`tel:${vendor.contact}`} className="hover:underline">{vendor.contact}</a>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400">Email Address</p>
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  <a href={`mailto:${vendor.email}`} className="hover:underline truncate">{vendor.email}</a>
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-400">Address & Location</p>
                <div className="flex items-start gap-1.5 text-sm font-medium text-slate-800 mt-0.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    {vendor.address}, {vendor.city}, {vendor.state} - {vendor.pincode}
                    <span className="ml-2 text-xs font-normal text-slate-500">({vendor.location})</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Equipment Categories & Available Stock */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-brand-teal-600" />
              Equipment Categories & Declared Stock Capacity
            </h4>
            <div className="bg-teal-50/40 p-4 rounded-xl border border-teal-100">
              <p className="text-xs text-slate-500 mb-3">
                Equipment inventory supplied and stocked by this vendor:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vendor.equipmentCategories && vendor.equipmentCategories.length > 0 ? (
                  vendor.equipmentCategories.map((cat, idx) => {
                    const units = vendor.equipmentStock?.[cat] || vendor.equipmentStock?.[cat.trim()] || 10;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-teal-200 shadow-2xs text-xs font-semibold text-teal-950"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>{cat}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 font-mono font-bold text-[11px] border border-teal-100">
                          {units} Units Stocked
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-xs text-slate-400 italic">No equipment categories registered</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Rental Activity */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-brand-teal-600" />
              Rental Activity & Statistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">Total Requests</p>
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-xl font-bold text-slate-900 mt-1">{activity.totalRequests}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Broadcasted to vendor</p>
              </div>

              <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-blue-700">Accepted</p>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <p className="text-xl font-bold text-blue-900 mt-1">{activity.acceptedRequests}</p>
                <p className="text-[11px] text-blue-600/80 mt-0.5">Response confirmed</p>
              </div>

              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-emerald-700">Completed</p>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <p className="text-xl font-bold text-emerald-900 mt-1">{activity.completedRentals}</p>
                <p className="text-[11px] text-emerald-600/80 mt-0.5">Returned & settled</p>
              </div>

              <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-100">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-rose-700">Cancelled</p>
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <p className="text-xl font-bold text-rose-900 mt-1">{activity.cancelledRentals}</p>
                <p className="text-[11px] text-rose-600/80 mt-0.5">Declined / unfulfilled</p>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">Patient Privacy Protection Standard</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                When equipment requests are routed to this vendor, only the equipment type, quantity, rental dates, and fulfillment requirements are shared. Patient names, contacts, and personal addresses are strictly masked.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
