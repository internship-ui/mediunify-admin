import React from 'react';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Eye,
  AlertCircle,
  FileText,
  IndianRupee,
  Truck,
  RotateCcw,
  History,
  Lock
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function RequestDetails({
  request,
  onBack
}) {
  if (!request) return null;

  const isAgreed = request.isAmountAgreed && request.finalAgreedAmount !== null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered / Active Rental':
      case 'Confirmed':
      case 'Completed / Returned':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Awaiting Delivery':
      case 'Awaiting Vendor Confirmation':
      case 'New Request':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getPaymentStatusBadge = (pStatus) => {
    switch (pStatus) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Partially Paid':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Awaiting Update':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100 rounded-xl transition-colors border border-brand-slate-200 shadow-2xs"
            title="Back to Requests Table"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-brand-navy-900 font-mono">
                {request.id}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(
                  request.rentalStatus || request.status
                )}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>{request.rentalStatus || request.status}</span>
              </span>
            </div>
            <p className="text-xs text-brand-slate-500 mt-1">
              Created on {request.requestDate} • Monitored Rental Request
            </p>
          </div>
        </div>

        {/* Informative Workflow Monitoring Notice */}
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-teal-800 bg-brand-teal-50 px-3 py-1.5 rounded-xl border border-brand-teal-200">
          <Eye className="w-4 h-4 text-brand-teal-600 shrink-0" />
          <span>Admin Monitoring Mode (Vendor & Patient Workflow)</span>
        </div>
      </div>

      {/* Workflow Progress Tracker */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 sm:p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-400 mb-3">
          Equipment Rental Lifecycle Tracker
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {[
            {
              label: '1. Request Created',
              status: 'Completed',
              desc: 'Patient selected vendor'
            },
            {
              label: '2. Vendor Contact',
              status: request.isAmountAgreed ? 'Completed' : 'In Progress',
              desc: 'Direct terms discussion'
            },
            {
              label: '3. Amount Agreed',
              status: isAgreed ? 'Completed' : 'Pending',
              desc: isAgreed ? `₹${request.finalAgreedAmount}` : 'Awaiting confirmation'
            },
            {
              label: '4. Delivery Status',
              status: request.deliveryStatus || 'Not Dispatched',
              desc: request.deliveryStatus === 'Delivered' ? 'Equipment Delivered' : 'Scheduled dispatch'
            },
            {
              label: '5. Rental Status',
              status: request.rentalStatus || request.status,
              desc: 'Ongoing deployment'
            },
            {
              label: '6. Payment Status',
              status: request.paymentStatus || 'Awaiting Update',
              desc: request.paymentStatus === 'Paid' ? 'Paid in full' : 'Monitored status'
            }
          ].map((step, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80 text-xs space-y-1"
            >
              <span className="text-[10px] font-bold text-brand-slate-400 uppercase block">{step.label}</span>
              <span className="font-extrabold text-brand-navy-900 block truncate">{step.status}</span>
              <span className="text-[10px] text-brand-slate-500 block truncate">{step.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Patient-Selected Vendor & Agreed Rental Amount */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Patient-Selected Vendor (Section 2 & 4) */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-brand-teal-700 border border-brand-teal-200">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900">
                  Patient-Selected Vendor
                </h3>
                <p className="text-[11px] text-brand-slate-500">Chosen directly by patient in app</p>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold text-brand-teal-800 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
              {request.selectedVendor?.id || 'VEND-001'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-brand-slate-50 border border-brand-slate-200 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-black text-brand-navy-950 text-sm">
                  {request.selectedVendor?.businessName || request.assignedVendor || 'Assigned Partner'}
                </h4>
                <p className="text-xs text-brand-slate-600 font-medium mt-0.5">
                  Contact Person: <strong>{request.selectedVendor?.name || 'Suresh Babu'}</strong>
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Patient Choice
              </span>
            </div>

            <div className="pt-2 border-t border-brand-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Direct Phone:</span>
              <a
                href={`tel:${request.selectedVendor?.contact}`}
                className="font-bold text-brand-teal-700 hover:underline flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>{request.selectedVendor?.contact || '+91 98450 11223'}</span>
              </a>
            </div>

            <div className="pt-1 text-[11px] text-slate-500">
              Vendor confirmation status:{' '}
              <strong className="text-brand-navy-900">
                {request.vendorConfirmationStatus || 'Awaiting Vendor Confirmation'}
              </strong>
            </div>
          </div>

          {/* Business Flow Notice */}
          <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-200 text-xs text-teal-950 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Workflow Note:</strong> The admin does not manually assign a vendor or negotiate prices. The selected vendor contacts the patient directly, arranges terms, and updates the system.
            </p>
          </div>
        </div>

        {/* Card 2: Agreed Rental Amount & Financial Breakdown (Section 6 & 7) */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-brand-teal-700 border border-brand-teal-200">
                <IndianRupee className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900">
                  Agreed Rental Amount
                </h3>
                <p className="text-[11px] text-brand-slate-500">Recorded by vendor after direct discussion</p>
              </div>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPaymentStatusBadge(
                request.paymentStatus
              )}`}
            >
              Payment: {request.paymentStatus || 'Awaiting Update'}
            </span>
          </div>

          {isAgreed ? (
            <div className="space-y-3">
              {/* Financial Calculation Table */}
              <div className="p-3.5 rounded-xl bg-brand-slate-50 border border-brand-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Base Rental Price ({request.rentalDuration || 'Duration'}):</span>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{request.baseRentalPrice?.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Delivery & Installation Charges:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{request.deliveryCharges?.toLocaleString() || 0}
                  </span>
                </div>

                {request.discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Discount Provided by Vendor:</span>
                    <span className="font-bold font-mono">-₹{request.discount?.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-brand-slate-200 flex items-center justify-between text-sm">
                  <span className="font-black text-brand-navy-950">Final Agreed Rental Amount:</span>
                  <span className="font-black text-brand-teal-800 font-mono text-base">
                    ₹{request.finalAgreedAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Separate Refundable Security Deposit Box */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-950 block">Refundable Security Deposit Held</span>
                  <span className="text-[10px] text-amber-800">
                    Identified separately — not counted as rental revenue
                  </span>
                </div>
                <span className="font-black text-amber-950 font-mono text-sm">
                  ₹{request.refundableDeposit?.toLocaleString() || 0}
                </span>
              </div>

              {/* Timestamp & Record Date */}
              <div className="flex items-center justify-between text-[11px] text-brand-slate-500 pt-1">
                <span>Date Amount Recorded: <strong>{request.amountRecordedDate || 'N/A'}</strong></span>
                <span>Last Updated: <strong>{request.amountLastUpdated || 'N/A'}</strong></span>
              </div>
            </div>
          ) : (
            /* Amount Awaiting Confirmation State (Section 6) */
            <div className="p-6 rounded-xl bg-amber-50/50 border border-dashed border-amber-300 text-center space-y-2">
              <Clock className="w-8 h-8 text-amber-600 mx-auto" />
              <h4 className="font-bold text-amber-950 text-sm">
                Amount Awaiting Confirmation
              </h4>
              <p className="text-xs text-amber-800 max-w-sm mx-auto leading-relaxed">
                The selected vendor is currently discussing duration, pricing, delivery charges, and deposit directly with the patient. The agreed amount will appear once recorded by the vendor.
              </p>
            </div>
          )}

          {/* Price History / Change Log */}
          {request.priceHistory && request.priceHistory.length > 0 && (
            <div className="pt-3 border-t border-brand-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold text-brand-slate-400 uppercase tracking-wider flex items-center gap-1">
                <History className="w-3 h-3" />
                <span>Price Record Change History</span>
              </span>
              <div className="space-y-1 text-[11px] text-brand-slate-600">
                {request.priceHistory.map((h, i) => (
                  <div key={i} className="p-2 rounded-lg bg-brand-slate-50 border border-brand-slate-200/60">
                    <div className="flex items-center justify-between font-semibold text-brand-navy-900">
                      <span>{h.updatedBy}</span>
                      <span className="font-normal text-brand-slate-400">{h.date}</span>
                    </div>
                    <p className="mt-0.5 text-brand-slate-600">{h.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Equipment Details & Patient Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Request Card */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-brand-teal-700 border border-brand-teal-200">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900">
                  Requested Equipment Details
                </h3>
                <p className="text-[11px] text-brand-slate-500">Category & declared specifications</p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-brand-slate-100 text-brand-slate-700 text-xs font-bold">
              {request.equipmentCategory}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Equipment Name</span>
              <p className="font-bold text-brand-navy-900 mt-0.5 truncate">{request.equipment}</p>
            </div>

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Quantity</span>
              <p className="font-bold text-brand-navy-900 mt-0.5">{request.quantity || 1} Unit(s)</p>
            </div>

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Rental Start Date</span>
              <p className="font-bold text-brand-navy-900 mt-0.5">{request.rentalStartDate}</p>
            </div>

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Expected End Date</span>
              <p className="font-bold text-brand-navy-900 mt-0.5">{request.rentalEndDate}</p>
            </div>
          </div>

          {/* Additional Requirements */}
          <div className="p-3.5 rounded-xl bg-brand-slate-50 border border-brand-slate-200 text-xs space-y-1">
            <span className="font-bold text-brand-navy-900 block">Patient Special Requirements:</span>
            <p className="text-brand-slate-700 leading-relaxed font-medium">
              {request.additionalRequirements || 'Standard sanitized medical equipment requirement.'}
            </p>
          </div>
        </div>

        {/* Patient Details (Privacy Shield) */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-brand-teal-700 border border-brand-teal-200">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900">
                  Patient Information
                </h3>
                <p className="text-[11px] text-brand-slate-500">Authorized Admin Directory View</p>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold text-brand-slate-500 bg-brand-slate-100 px-2 py-0.5 rounded">
              {request.patientId || 'PID-8842'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100 space-y-1">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Patient Name</span>
              <p className="font-bold text-brand-navy-900 text-sm">{request.patientName}</p>
            </div>

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100 space-y-1">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Contact Phone</span>
              <p className="font-bold text-brand-slate-800 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-brand-teal-600" />
                <span>{request.patientPhone}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100 space-y-1 sm:col-span-2">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Email Address</span>
              <p className="font-semibold text-brand-slate-800 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-brand-teal-600" />
                <span>{request.patientEmail}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100 space-y-1 sm:col-span-2">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Delivery Destination</span>
              <p className="font-semibold text-brand-slate-800 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                <span>{request.patientAddress}</span>
              </p>
              <p className="text-[11px] text-brand-slate-500 pl-5">
                City / Locality Zone: <strong>{request.patientLocation}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
