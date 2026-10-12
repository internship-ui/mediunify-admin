import React from 'react';
import {
  ShoppingBag,
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  FileCheck,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Eye,
  ShieldCheck,
  Lock,
  Pill
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function OrderDetailModal({
  isOpen,
  onClose,
  order,
  medicines = []
}) {
  useLockBodyScroll(isOpen, onClose);

  if (!isOpen || !order) return null;

  const timelineSteps = [
    'Order Placed',
    'Prescription Received',
    'Prescription Verified',
    'Picking',
    'Packed',
    'Out for Delivery',
    'Delivered'
  ];

  const currentStepIndex = timelineSteps.indexOf(order.currentStatus) !== -1
    ? timelineSteps.indexOf(order.currentStatus)
    : order.currentStatus === 'Delivered'
    ? 6
    : order.currentStatus === 'Out for Delivery'
    ? 5
    : order.currentStatus === 'Packed'
    ? 4
    : order.currentStatus === 'Picking'
    ? 3
    : order.currentStatus === 'Prescription Verified'
    ? 2
    : 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-brand-slate-100 flex items-center justify-between bg-gradient-to-r from-brand-navy-900 to-brand-teal-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-brand-teal-300 border border-white/15">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">{order.orderId}</h3>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-white/10 rounded-md border border-white/20">
                  Rx: {order.prescriptionId || 'OTC Order'}
                </span>
              </div>
              <p className="text-xs text-brand-teal-100/80">
                Ordered on {order.orderDate} • Last Updated: {order.lastUpdated || 'Recently'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-brand-slate-700">
          {/* Operational Monitoring Mode Alert (Requirement 15) */}
          <div className="p-3.5 rounded-xl bg-brand-teal-50/50 border border-brand-teal-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-brand-teal-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-brand-teal-950 block">
                Central Pharmacy Hub Operational Monitoring
              </span>
              <p className="text-[11px] text-brand-teal-900 mt-0.5 leading-relaxed">
                Picking, packing, and dispatch execution are carried out by the on-site Pharmacy Hub team. The admin dashboard provides real-time audit and progress oversight.
              </p>
            </div>
          </div>

          {/* Section 1: Pharmacy Workflow Timeline (Requirement 15) */}
          <div className="p-4 rounded-xl bg-brand-slate-50 border border-brand-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900">
                Pharmacy Fulfillment Workflow
              </h4>
              <span className="text-[11px] font-bold text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                Stage: {order.currentStatus}
              </span>
            </div>

            <div className="relative pt-2 pb-1">
              <div className="flex items-center justify-between relative z-10">
                {timelineSteps.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step} className="flex flex-col items-center text-center flex-1">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-2xs ${
                          isCurrent
                            ? 'bg-brand-teal-600 text-white ring-4 ring-brand-teal-100 scale-110'
                            : isDone
                            ? 'bg-brand-green-600 text-white'
                            : 'bg-brand-slate-200 text-brand-slate-500'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[9px] sm:text-[10px] mt-1.5 font-bold leading-tight ${
                          isCurrent
                            ? 'text-brand-teal-800'
                            : isDone
                            ? 'text-brand-green-800'
                            : 'text-brand-slate-400'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Patient & Order Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Details */}
            <div className="p-4 rounded-xl bg-white border border-brand-slate-200 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 flex items-center gap-1.5 pb-2 border-b border-brand-slate-100">
                <User className="w-4 h-4 text-brand-teal-600" />
                Patient Information
              </h4>
              <div className="space-y-1.5 pt-1">
                <div>
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Patient Name</span>
                  <p className="font-bold text-brand-navy-900">{order.patientName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Patient ID</span>
                  <p className="font-mono text-brand-slate-700">{order.patientId || 'PID-9012'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Contact Phone</span>
                  <p className="font-semibold text-brand-slate-800 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-brand-teal-600" />
                    <span>{order.patientPhone || '+91 98450 11223'}</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Delivery Address</span>
                  <p className="text-brand-slate-800 font-medium flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{order.patientAddress || order.address || 'Mysore Central Facility'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="p-4 rounded-xl bg-white border border-brand-slate-200 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 flex items-center gap-1.5 pb-2 border-b border-brand-slate-100">
                <ShoppingBag className="w-4 h-4 text-brand-teal-600" />
                Order & Billing Details
              </h4>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Order ID</span>
                  <span className="font-mono font-bold text-brand-navy-900">{order.orderId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Order Date</span>
                  <span className="font-medium text-brand-slate-700">{order.orderDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Prescription Link</span>
                  <span className="font-mono font-bold text-brand-teal-700">{order.prescriptionId || 'OTC Direct'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase">Payment Status</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Paid Online
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-brand-slate-100">
                  <span className="text-xs font-bold text-brand-navy-900">Total Bill Amount</span>
                  <span className="text-base font-black text-brand-navy-900 font-mono">
                    ₹{Number(order.orderAmount || 450).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Ordered Items Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 mb-2 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-brand-teal-600" />
              Prescribed Medicines to Pick & Pack
            </h4>
            <div className="border border-brand-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-slate-50 text-[10px] font-bold text-brand-slate-600 uppercase border-b border-brand-slate-200">
                  <tr>
                    <th className="px-3 py-2.5">Medicine Name</th>
                    <th className="px-3 py-2.5 text-center">Quantity</th>
                    <th className="px-3 py-2.5 text-right">Unit Price</th>
                    <th className="px-3 py-2.5 text-right">Item Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100">
                  {(order.items || [
                    { name: 'Paracetamol 500mg', qty: 20, price: 2.0, total: 40 },
                    { name: 'Amoxicillin 500mg', qty: 10, price: 8.5, total: 85 }
                  ]).map((item, idx) => {
                    const matchedMed = medicines?.find(
                      (m) =>
                        m.name?.toLowerCase() === (item.name || '').toLowerCase() ||
                        m.id === item.medicineId
                    );
                    const itemImage = item.image || matchedMed?.image;

                    return (
                      <tr key={idx} className="hover:bg-brand-slate-50/70">
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2.5">
                            {itemImage ? (
                              <img
                                src={itemImage}
                                alt={item.name}
                                className="w-8 h-8 rounded-lg object-cover border border-brand-slate-200 shrink-0 shadow-2xs"
                              />
                            ) : (
                              <span className="p-1.5 rounded-lg bg-brand-teal-50 text-brand-teal-700 shrink-0">
                                <Pill className="w-3.5 h-3.5" />
                              </span>
                            )}
                            <div>
                              <span className="font-bold text-brand-navy-900 block leading-tight">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-brand-slate-400">
                                {matchedMed?.dosageForm || 'Prescribed SKU'} • {matchedMed?.strength || 'Standard'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono font-bold text-brand-slate-800">
                          {item.qty}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-brand-slate-600">
                          ₹{Number(item.price).toFixed(2)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono font-bold text-brand-navy-900">
                          ₹{Number(item.total || item.qty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-brand-slate-50 border-t border-brand-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-brand-slate-500 font-medium">
            Authorized Pharmacy Admin View (Operational controls reserved for Central Hub)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-brand-slate-700 bg-white border border-brand-slate-300 rounded-xl hover:bg-brand-slate-100 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
