import React, { useState } from 'react';
import {
  Package,
  Store,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  GitFork,
  User,
  Truck,
  Receipt,
  Eye,
  EyeOff,
  FileText,
  DollarSign
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import StatusBadge from '../../../components/common/StatusBadge';

export default function ExternalOrderDetailModal({
  isOpen,
  onClose,
  order,
  onOpenAssign,
  onOpenUpdateStatus
}) {
  const [showFullPatientInfo, setShowFullPatientInfo] = useState(false);

  if (!order) return null;

  const isAssigned = Boolean(order.assignedPartnerPharmacy);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`External Order Details: ${order.orderId}`}
      subtitle={`Linked to Original Patient Order: ${order.parentOrderId}`}
      maxWidth="max-w-3xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100 rounded-xl transition-colors"
          >
            Close
          </button>

          {!isAssigned && order.orderStatus === 'Pending Assignment' && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAssign(order);
              }}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Store className="w-4 h-4" />
              <span>Assign External Pharmacy</span>
            </button>
          )}

          {isAssigned && order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenUpdateStatus(order);
              }}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-navy-900 hover:bg-brand-navy-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>Update Fulfillment Status</span>
            </button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* 1. Split Order Architecture Header */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-teal-900 via-brand-navy-900 to-brand-slate-900 text-white shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-brand-teal-500/20 text-brand-teal-300 border border-brand-teal-400/30">
                  Split Order Architecture
                </span>
                <span className="text-xs text-brand-slate-300 font-mono">
                  Parent: <strong>{order.parentOrderId}</strong>
                </span>
              </div>
              <h3 className="text-lg font-black mt-1 font-mono tracking-tight flex items-center gap-2">
                <span>{order.orderId}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-sans font-bold bg-white/10 text-white border border-white/20">
                  {order.orderStatus}
                </span>
              </h3>
            </div>

            <div className="text-right sm:border-l sm:border-white/15 sm:pl-4">
              <span className="text-[10px] text-brand-teal-200 block uppercase font-bold tracking-wider">
                External Order Amount
              </span>
              <span className="text-xl font-black font-mono text-emerald-300">
                ₹{order.orderAmount?.toLocaleString()}
              </span>
              <span className="text-[10px] text-brand-slate-300 block">
                Payment: <strong className="text-white">{order.paymentStatus}</strong>
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-brand-teal-100">
            <div>
              <span className="text-brand-teal-300 block text-[10px]">Created Date</span>
              <span className="font-mono">{order.createdAt}</span>
            </div>
            <div>
              <span className="text-brand-teal-300 block text-[10px]">Expected Delivery</span>
              <span className="font-mono">{order.expectedDelivery}</span>
            </div>
            <div>
              <span className="text-brand-teal-300 block text-[10px]">Central Hub Sub-Order</span>
              <span className="font-mono">{order.hubSubOrderId || 'HUB-PART-01'}</span>
            </div>
            <div>
              <span className="text-brand-teal-300 block text-[10px]">Priority</span>
              <span className={`font-bold ${order.priority === 'Urgent' ? 'text-amber-300' : 'text-brand-teal-200'}`}>
                {order.priority}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Split Order Inventory Breakdown (Requirement: Both parts linked to parent) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: Unavailable Medicines (This External Order) */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Store className="w-4 h-4 text-amber-600" />
                <span>Redirected to Third-Party Pharmacy</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                {order.unavailableMedicines?.length || 0} items
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {order.unavailableMedicines?.map((med, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white border border-amber-200/60 shadow-2xs flex items-start justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-brand-navy-900 block">{med.name}</span>
                    <span className="text-[11px] text-brand-slate-500 font-mono">
                      {med.dosageForm} • {med.strength}
                    </span>
                    <span className="text-[10px] text-amber-800 block mt-0.5 font-medium">
                      Reason: {med.reasonUnavailable}
                    </span>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <span className="font-mono font-bold text-amber-900 text-xs">Qty: {med.quantity}</span>
                    <span className="text-[11px] text-brand-slate-600 font-mono block">
                      ₹{(med.price * med.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card B: Available Medicines (Processed by Central Pharmacy Hub) */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>Fulfilled by Central Pharmacy Hub</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {order.hubFulfilledMedicines?.length || 0} items
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {order.hubFulfilledMedicines?.map((med, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white border border-emerald-200/60 shadow-2xs flex items-start justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-brand-navy-900 block">{med.name}</span>
                    <span className="text-[11px] text-brand-slate-500 font-mono">
                      {med.dosageForm} • {med.strength}
                    </span>
                    <span className="text-[10px] text-emerald-700 block mt-0.5 font-medium">
                      Stock: In Stock ({med.batchNumber})
                    </span>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <span className="font-mono font-bold text-emerald-900 text-xs">Qty: {med.quantity}</span>
                    <span className="text-[11px] text-brand-slate-600 font-mono block">
                      ₹{(med.price * med.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Assigned Third-Party Pharmacy */}
        <div className="p-4 rounded-2xl bg-white border border-brand-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-navy-900">
              <Store className="w-4 h-4 text-brand-teal-600" />
              <span>Assigned Third-Party Partner</span>
            </div>

            {isAssigned ? (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-brand-green-50 text-brand-green-800 border border-brand-green-200">
                Partner Active
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                Assignment Pending
              </span>
            )}
          </div>

          {isAssigned ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-bold text-brand-navy-900 text-sm block">
                  {order.assignedPartnerPharmacy.name}
                </span>
                <span className="text-brand-slate-500 font-mono text-[11px] block">
                  License: {order.assignedPartnerPharmacy.licenseNumber}
                </span>
                <span className="text-brand-slate-600 text-[11px] block mt-1">
                  {order.assignedPartnerPharmacy.address}
                </span>
              </div>
              <div className="space-y-1 text-[11px] sm:border-l sm:border-brand-slate-100 sm:pl-3">
                <div className="flex justify-between">
                  <span className="text-brand-slate-500">Contact Person:</span>
                  <span className="font-semibold">{order.assignedPartnerPharmacy.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-slate-500">Phone:</span>
                  <span className="font-mono font-semibold">{order.assignedPartnerPharmacy.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-slate-500">Distance to Patient:</span>
                  <span className="font-mono font-semibold">{order.assignedPartnerPharmacy.distanceFromHubKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-slate-500">Partner Rating:</span>
                  <span className="font-bold text-amber-600">★ {order.assignedPartnerPharmacy.rating}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  No partner pharmacy assigned yet. Unavailable medicines need to be routed.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAssign(order);
                }}
                className="px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
              >
                Select Pharmacy
              </button>
            </div>
          )}
        </div>

        {/* 4. Patient Information with Privacy Protection (Requirement: Protect patient info) */}
        <div className="p-4 rounded-2xl bg-brand-slate-50/80 border border-brand-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-navy-900">
              <User className="w-4 h-4 text-brand-teal-600" />
              <span>Patient & Delivery Destination</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-teal-50 text-brand-teal-800 border border-brand-teal-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-brand-teal-600" />
                <span>Partner Privacy Protection</span>
              </span>

              <button
                type="button"
                onClick={() => setShowFullPatientInfo(!showFullPatientInfo)}
                className="text-[11px] font-semibold text-brand-teal-700 hover:underline flex items-center gap-1"
              >
                {showFullPatientInfo ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showFullPatientInfo ? 'Hide Full Info' : 'Admin Reveal'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-brand-slate-500 text-[11px] block">Patient Name</span>
              <span className="font-bold text-brand-navy-900">{order.patientName}</span>
              <span className="text-[11px] text-brand-slate-500 block">Age: {order.patientAge || '48 yrs'}</span>
            </div>

            <div>
              <span className="text-brand-slate-500 text-[11px] block">Contact Number</span>
              <span className="font-mono font-semibold">
                {showFullPatientInfo ? order.patientPhone : order.patientPhoneMasked || '+91 98450 •••••'}
              </span>
              <span className="text-[10px] text-brand-slate-400 block">
                {showFullPatientInfo ? '(Unmasked for Admin)' : '(Masked for external pharmacy)'}
              </span>
            </div>

            <div>
              <span className="text-brand-slate-500 text-[11px] block">Delivery Locality</span>
              <span className="font-semibold text-brand-navy-900">{order.patientArea}</span>
              <span className="font-mono text-brand-slate-500 text-[11px] block">Pincode: {order.patientPincode}</span>
            </div>
          </div>

          <div>
            <span className="text-brand-slate-500 text-[11px] block">Complete Delivery Address</span>
            <p className="text-xs font-medium text-brand-navy-900 mt-0.5 bg-white p-2.5 rounded-xl border border-brand-slate-200/80">
              {order.patientDeliveryAddress}
            </p>
          </div>
        </div>

        {/* 5. Order Lifecycle & Status Timeline */}
        <div className="p-4 rounded-2xl bg-white border border-brand-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-navy-900">
              <Clock className="w-4 h-4 text-brand-teal-600" />
              <span>External Order Status Timeline</span>
            </div>
            <span className="text-xs font-bold text-brand-teal-800">
              Current: {order.orderStatus}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {order.timeline?.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-brand-slate-50/70 border border-brand-slate-200/70"
              >
                <div className="w-5 h-5 rounded-full bg-brand-teal-100 text-brand-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-navy-900">{step.status}</span>
                    <span className="text-[10px] font-mono text-brand-slate-500">{step.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-brand-slate-600 mt-0.5">{step.notes}</p>
                </div>
              </div>
            ))}
          </div>

          {order.deliveryRider && (
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-700" />
                <div>
                  <span className="font-bold text-blue-950 block">Assigned Delivery Rider: {order.deliveryRider.name}</span>
                  <span className="text-[11px] text-blue-700 font-mono">Mobile: {order.deliveryRider.phone}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-800">
                {order.deliveryRider.vehicle || 'Bike'}
              </span>
            </div>
          )}
        </div>

        {/* 6. Payment & Financial Tracking */}
        <div className="p-4 rounded-2xl bg-brand-slate-50/80 border border-brand-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-navy-900">
            <Receipt className="w-4 h-4 text-brand-teal-600" />
            <span>Commercial Breakdown & Payment Reconciliation</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-brand-slate-200">
              <span className="text-[10px] text-brand-slate-500 block">Order Value</span>
              <span className="font-mono font-bold text-brand-navy-900 text-sm">
                ₹{order.orderAmount?.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-brand-slate-200">
              <span className="text-[10px] text-brand-slate-500 block">Partner Payout (88%)</span>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                ₹{order.paymentDetails?.partnerPayout?.toLocaleString() || Math.round(order.orderAmount * 0.88).toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-brand-slate-200">
              <span className="text-[10px] text-brand-slate-500 block">MediUnify Margin (12%)</span>
              <span className="font-mono font-bold text-brand-teal-700 text-sm">
                ₹{order.paymentDetails?.commissionAmount?.toLocaleString() || Math.round(order.orderAmount * 0.12).toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-brand-slate-200">
              <span className="text-[10px] text-brand-slate-500 block">Settlement Status</span>
              <span className="font-bold text-brand-slate-900 text-xs">
                {order.paymentDetails?.settlementStatus || 'Pending Settlement'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
