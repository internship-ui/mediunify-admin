import React, { useState } from 'react';
import {
  GitFork,
  Search,
  Filter,
  Store,
  Package,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Truck,
  ArrowRight,
  Eye,
  ShieldCheck,
  Plus
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function ExternalOrdersView({
  orders = [],
  onOpenAssign,
  onOpenOrderDetail,
  onOpenUpdateStatus,
  onOpenSplitRouter
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.parentOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.assignedPartnerPharmacy?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.unavailableMedicines?.some((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (activeTab === 'Pending') return order.orderStatus === 'Pending Assignment';
    if (activeTab === 'In Progress') {
      return ['Assigned', 'Accepted', 'Preparing', 'Dispatched'].includes(order.orderStatus);
    }
    if (activeTab === 'Delivered') return order.orderStatus === 'Delivered';
    if (activeTab === 'Cancelled') return order.orderStatus === 'Cancelled';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Partner Fulfillment Queue</span>
          </div>
          <h1 className="text-2xl font-black text-brand-navy-950 mt-1">
            Partner Pharmacy Orders
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-600">
            Monitor and fulfill prescription orders routed to external accredited partner pharmacies.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenSplitRouter}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <GitFork className="w-4 h-4" />
          <span>Simulate Order Routing</span>
        </button>
      </div>

      {/* Tabs and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200/90 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'All', label: 'All Orders', count: orders.length },
            {
              id: 'Pending',
              label: 'Pending Assignment',
              count: orders.filter((o) => o.orderStatus === 'Pending Assignment').length
            },
            {
              id: 'In Progress',
              label: 'In Progress',
              count: orders.filter((o) =>
                ['Assigned', 'Accepted', 'Preparing', 'Dispatched'].includes(o.orderStatus)
              ).length
            },
            {
              id: 'Delivered',
              label: 'Delivered',
              count: orders.filter((o) => o.orderStatus === 'Delivered').length
            },
            {
              id: 'Cancelled',
              label: 'Cancelled',
              count: orders.filter((o) => o.orderStatus === 'Cancelled').length
            }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white text-brand-slate-600 border-brand-slate-200 hover:bg-brand-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-brand-slate-100 text-brand-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate-400" />
          <input
            type="text"
            placeholder="Search order ID, patient, medicine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-brand-slate-200 bg-brand-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-brand-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-slate-50/80 border-b border-brand-slate-200/80 text-[11px] font-bold text-brand-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Unavailable Medicines</th>
                <th className="py-3 px-4">Assigned Partner Pharmacy</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Order Value</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-brand-slate-400">
                    No external medicine orders found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isPending = order.orderStatus === 'Pending Assignment';
                  const isDelivered = order.orderStatus === 'Delivered';
                  const isCancelled = order.orderStatus === 'Cancelled';

                  return (
                    <tr
                      key={order.orderId}
                      className="hover:bg-brand-slate-50/50 transition-colors"
                    >
                      {/* 1. Order ID - only ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-navy-950 text-xs">
                        {order.orderId}
                      </td>

                      {/* 2. Patient Name - only patient name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-brand-navy-900">{order.patientName}</div>
                      </td>

                      {/* 3. Unavailable Medicines (Specific reason out of stock in hub) */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          {order.unavailableMedicines?.map((med, idx) => (
                            <div key={idx} className="flex items-start justify-between gap-1">
                              <span className="font-medium text-brand-navy-900 leading-tight">
                                {med.name}
                              </span>
                              <span className="font-mono font-bold text-amber-900 text-[10px] shrink-0">
                                x{med.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] text-amber-700 block mt-1">
                          Reason: {order.unavailableMedicines?.[0]?.reasonUnavailable || 'Hub Stock Depleted'}
                        </span>
                      </td>

                      {/* 4. Assigned External Pharmacy */}
                      <td className="py-3.5 px-4">
                        {order.assignedPartnerPharmacy ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-brand-navy-900 block">
                              {order.assignedPartnerPharmacy.name}
                            </span>
                            <span className="text-[10px] text-brand-slate-500 font-mono block">
                              {order.assignedPartnerPharmacy.area} • ★ {order.assignedPartnerPharmacy.rating}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-medium block">
                              Ph: {order.assignedPartnerPharmacy.phone}
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Unassigned</span>
                          </div>
                        )}
                      </td>

                      {/* 5. Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isPending
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : isDelivered
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              : isCancelled
                              ? 'bg-rose-100 text-rose-900 border border-rose-200'
                              : 'bg-blue-100 text-blue-900 border border-blue-200'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* 6. Order Value */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono font-bold text-brand-navy-950 text-sm">
                          ₹{order.orderAmount?.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-brand-slate-400 block font-mono">
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* 7. Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => onOpenAssign(order)}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-all flex items-center gap-1"
                            >
                              <Store className="w-3 h-3" />
                              <span>Assign</span>
                            </button>
                          )}

                          {!isPending && !isDelivered && !isCancelled && (
                            <button
                              type="button"
                              onClick={() => onOpenUpdateStatus(order)}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-brand-navy-900 hover:bg-brand-navy-800 rounded-lg shadow-2xs transition-all flex items-center gap-1"
                            >
                              <Truck className="w-3 h-3" />
                              <span>Update</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onOpenOrderDetail(order)}
                            className="p-1.5 text-brand-slate-500 hover:text-brand-navy-900 hover:bg-brand-slate-100 rounded-lg transition-colors border border-brand-slate-200"
                            title="Inspect Order"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
