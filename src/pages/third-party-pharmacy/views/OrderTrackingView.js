import React, { useState } from 'react';
import {
  Truck,
  Package,
  Store,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  User,
  ShieldCheck,
  Search,
  Filter,
  Phone
} from 'lucide-react';

const STAGES = [
  'Pending Assignment',
  'Assigned',
  'Accepted',
  'Preparing',
  'Dispatched',
  'Delivered'
];

export default function OrderTrackingView({
  orders = [],
  onOpenUpdateStatus,
  onOpenOrderDetail
}) {
  const [filterStage, setFilterStage] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active orders in flight (non-completed and non-cancelled)
  const activeOrders = orders.filter((o) => o.orderStatus !== 'Cancelled');

  const filteredOrders = activeOrders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.assignedPartnerPharmacy?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStage === 'Preparing') return ['Accepted', 'Preparing'].includes(o.orderStatus);
    if (filterStage === 'Dispatched') return o.orderStatus === 'Dispatched';
    if (filterStage === 'Delivered') return o.orderStatus === 'Delivered';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Live Delivery Monitor</span>
          </div>
          <h1 className="text-2xl font-black text-brand-navy-950 mt-1">
            Live Order Tracking
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-600">
            Real-time tracking of partner pharmacy order preparation through to doorstep delivery.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'All', label: 'All In-Flight' },
            { id: 'Preparing', label: 'In Store Preparation' },
            { id: 'Dispatched', label: 'Out with Delivery Riders' },
            { id: 'Delivered', label: 'Delivered Today' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilterStage(item.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all whitespace-nowrap ${
                filterStage === item.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-white text-brand-slate-600 border-brand-slate-200 hover:bg-brand-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate-400" />
          <input
            type="text"
            placeholder="Search order or partner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-brand-slate-200 bg-brand-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Tracking Cards Feed */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-brand-slate-200 text-brand-slate-400">
            No active external pharmacy orders matching this tracking stage.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const currentStageIndex = STAGES.indexOf(order.orderStatus);

            return (
              <div
                key={order.orderId}
                className="bg-white rounded-2xl border border-brand-slate-200/90 shadow-2xs p-5 space-y-4 hover:border-blue-300 transition-all"
              >
                {/* Header: Order info & quick action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-brand-navy-950 text-base">
                        {order.orderId}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-slate-100 text-brand-slate-600">
                        Parent Order: {order.parentOrderId}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                        {order.orderStatus}
                      </span>
                    </div>
                    <span className="text-[11px] text-brand-slate-500 mt-1 block">
                      Patient: <strong>{order.patientName}</strong> • Delivery Area: {order.patientArea} • Expected: {order.expectedDelivery}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenOrderDetail(order)}
                      className="px-3 py-1.5 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100 rounded-xl border border-brand-slate-200"
                    >
                      Inspect Order
                    </button>
                    {order.orderStatus !== 'Delivered' && (
                      <button
                        type="button"
                        onClick={() => onOpenUpdateStatus(order)}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Update Status</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Visual Status Stepper */}
                <div className="pt-1">
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[10px]">
                    {STAGES.map((stage, idx) => {
                      const isPast = currentStageIndex > idx;
                      const isCurrent = currentStageIndex === idx;

                      return (
                        <div
                          key={stage}
                          className={`p-2 rounded-xl border transition-all ${
                            isCurrent
                              ? 'bg-blue-50 border-blue-500 font-bold text-blue-900 ring-2 ring-blue-500/20'
                              : isPast
                              ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900 font-semibold'
                              : 'bg-brand-slate-50/60 border-brand-slate-200 text-brand-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-center mb-1">
                            {isPast ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : isCurrent ? (
                              <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                            ) : (
                              <span className="w-3.5 h-3.5 rounded-full border border-brand-slate-300 inline-block" />
                            )}
                          </div>
                          <span>{stage}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-cards: Partner Pharmacy & Delivery Rider */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  {/* Card 1: Partner Pharmacy */}
                  <div className="p-3 rounded-xl bg-brand-slate-50/70 border border-brand-slate-200/80">
                    <span className="text-[10px] font-bold uppercase text-brand-slate-400 block mb-1">
                      Assigned Partner Store
                    </span>
                    {order.assignedPartnerPharmacy ? (
                      <div>
                        <span className="font-bold text-brand-navy-900 block truncate">
                          {order.assignedPartnerPharmacy.name}
                        </span>
                        <span className="text-[11px] text-brand-slate-500 block">
                          {order.assignedPartnerPharmacy.area} ({order.assignedPartnerPharmacy.phone})
                        </span>
                      </div>
                    ) : (
                      <span className="text-amber-700 font-semibold text-[11px]">Unassigned</span>
                    )}
                  </div>

                  {/* Card 2: Medicines being fulfilled */}
                  <div className="p-3 rounded-xl bg-brand-slate-50/70 border border-brand-slate-200/80">
                    <span className="text-[10px] font-bold uppercase text-brand-slate-400 block mb-1">
                      Unavailable Items Redirection
                    </span>
                    <span className="font-bold text-brand-navy-900 block truncate">
                      {order.unavailableMedicines?.map((m) => `${m.name} (${m.quantity})`).join(', ')}
                    </span>
                    <span className="text-[11px] text-brand-slate-500 block font-mono">
                      Subtotal: ₹{order.orderAmount?.toLocaleString()}
                    </span>
                  </div>

                  {/* Card 3: Delivery Logistics */}
                  <div className="p-3 rounded-xl bg-brand-slate-50/70 border border-brand-slate-200/80">
                    <span className="text-[10px] font-bold uppercase text-brand-slate-400 block mb-1">
                      Delivery Rider & Logistics
                    </span>
                    {order.deliveryRider ? (
                      <div>
                        <span className="font-bold text-brand-navy-900 block">
                          {order.deliveryRider.name}
                        </span>
                        <span className="text-[11px] text-blue-700 font-mono block">
                          {order.deliveryRider.phone} ({order.deliveryRider.vehicle})
                        </span>
                      </div>
                    ) : (
                      <span className="text-brand-slate-500 text-[11px]">
                        Rider assignment pending store pack
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
