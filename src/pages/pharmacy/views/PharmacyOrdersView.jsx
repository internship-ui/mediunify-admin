import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  FileCheck,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Info
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function PharmacyOrdersView({
  orders = [],
  onOpenOrderDetails
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeliveryFilter, setSelectedDeliveryFilter] = useState('All');

  // Filter logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      (o.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.prescriptionId || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDelivery =
      selectedDeliveryFilter === 'All' || o.deliveryStatus === selectedDeliveryFilter;

    let matchesTab = true;
    if (activeTab === 'pending') {
      matchesTab = o.currentStatus === 'Order Placed' || o.currentStatus === 'Prescription Received';
    } else if (activeTab === 'processing') {
      matchesTab =
        o.currentStatus === 'Prescription Verified' ||
        o.currentStatus === 'Picking' ||
        o.currentStatus === 'Packed';
    } else if (activeTab === 'out-for-delivery') {
      matchesTab = o.currentStatus === 'Out for Delivery';
    } else if (activeTab === 'delivered') {
      matchesTab = o.currentStatus === 'Delivered';
    } else if (activeTab === 'cancelled') {
      matchesTab = o.currentStatus === 'Cancelled';
    }

    return matchesSearch && matchesDelivery && matchesTab;
  });

  const orderTabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    {
      id: 'pending',
      label: 'Pending',
      count: orders.filter((o) => o.currentStatus === 'Order Placed' || o.currentStatus === 'Prescription Received').length,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'processing',
      label: 'Processing / Picking',
      count: orders.filter((o) => ['Prescription Verified', 'Picking', 'Packed'].includes(o.currentStatus)).length,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'out-for-delivery',
      label: 'Out for Delivery',
      count: orders.filter((o) => o.currentStatus === 'Out for Delivery').length,
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'delivered',
      label: 'Delivered',
      count: orders.filter((o) => o.currentStatus === 'Delivered').length,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      count: orders.filter((o) => o.currentStatus === 'Cancelled').length,
      badgeColor: 'bg-slate-200 text-slate-700'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner with Strict Monitoring Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-brand-navy-900">Patient Order Fulfillment Monitoring</h1>
              <p className="text-xs text-brand-slate-500">
                Track Central Pharmacy Hub order picking, packing stages, and delivery logistics
              </p>
            </div>
          </div>
        </div>

        {/* Monitoring Mode Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-slate-100 border border-brand-slate-200 rounded-xl text-xs text-brand-slate-700 font-medium">
          <ShieldCheck className="w-4 h-4 text-brand-teal-700" />
          <span>Admin Oversight Mode (Read-Only)</span>
        </div>
      </div>

      {/* Architecture Disclaimer Alert */}
      <div className="bg-brand-slate-50 border border-brand-slate-200 p-4 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-teal-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-brand-slate-600 leading-relaxed">
          <strong className="text-brand-navy-900">Hub Operational Workflow Separation:</strong> The actual picking, packing, prescription verification, and courier dispatch actions are performed exclusively by registered pharmacists inside the separate <strong>Pharmacy Hub Application</strong>. This Admin module provides end-to-end monitoring and SLA tracking.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-brand-slate-200">
        {orderTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-navy-900 text-white shadow-xs'
                  : 'text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-2 py-0.5 text-[11px] rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : tab.badgeColor || 'bg-brand-slate-200 text-brand-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, Patient Name, or Prescription ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500 bg-brand-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDeliveryFilter}
            onChange={(e) => setSelectedDeliveryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500 bg-brand-slate-50/50 text-brand-slate-700 font-medium"
          >
            <option value="All">All Delivery Statuses</option>
            <option value="Preparing">Preparing</option>
            <option value="Packed">Packed</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {(searchQuery || selectedDeliveryFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDeliveryFilter('All');
              }}
              className="text-xs text-brand-teal-700 font-bold hover:underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-brand-slate-50/80 border-b border-brand-slate-200 text-brand-slate-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-3">Patient Name</th>
                <th className="py-3.5 px-3">Order Date</th>
                <th className="py-3.5 px-3">Prescription ID</th>
                <th className="py-3.5 px-3 text-right">Order Amount</th>
                <th className="py-3.5 px-3 text-center">Hub Workflow Stage</th>
                <th className="py-3.5 px-3 text-center">Delivery Status</th>
                <th className="py-3.5 px-3">Last Updated</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-brand-slate-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40 text-brand-slate-400" />
                    <p className="font-bold text-sm text-brand-navy-900">No orders found</p>
                    <p className="text-xs text-brand-slate-500 mt-0.5">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-brand-slate-50/60 transition-colors group cursor-pointer"
                    onClick={() => onOpenOrderDetails(order)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-brand-teal-900">
                      {order.orderId}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-brand-navy-900">{order.patientName}</div>
                      <div className="text-[10px] text-brand-slate-400">{order.patientPhone}</div>
                    </td>

                    <td className="py-3 px-3 text-brand-slate-600 font-medium">
                      {order.orderDate}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-brand-slate-100 text-brand-slate-700">
                        {order.prescriptionId}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-brand-navy-900">
                      ₹{Number(order.orderAmount || 0).toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          order.currentStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : order.currentStatus === 'Out for Delivery'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : order.currentStatus === 'Packed' || order.currentStatus === 'Picking'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : order.currentStatus === 'Cancelled'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {order.currentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={order.deliveryStatus} size="xs" />
                    </td>

                    <td className="py-3 px-3 text-brand-slate-500 text-[11px]">
                      {order.lastUpdated}
                    </td>

                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenOrderDetails(order)}
                        className="px-3 py-1 text-xs font-bold text-brand-teal-800 bg-brand-teal-50 hover:bg-brand-teal-100 rounded-lg border border-brand-teal-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Timeline</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
