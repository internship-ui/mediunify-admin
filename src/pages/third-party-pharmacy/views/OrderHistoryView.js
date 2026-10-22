import React, { useState } from 'react';
import {
  History,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Eye,
  Calendar,
  Store,
  MapPin,
  GitFork,
  Download
} from 'lucide-react';

export default function OrderHistoryView({ orders = [], onOpenOrderDetail }) {
  const [historyFilter, setHistoryFilter] = useState('All'); // All, Delivered, Cancelled
  const [searchTerm, setSearchTerm] = useState('');

  const historyOrders = orders.filter((o) =>
    ['Delivered', 'Cancelled'].includes(o.orderStatus)
  );

  const filteredHistory = historyOrders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.parentOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.assignedPartnerPharmacy?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (historyFilter === 'Delivered') return order.orderStatus === 'Delivered';
    if (historyFilter === 'Cancelled') return order.orderStatus === 'Cancelled';
    return true;
  });

  const totalDelivered = historyOrders.filter((o) => o.orderStatus === 'Delivered').length;
  const totalCancelled = historyOrders.filter((o) => o.orderStatus === 'Cancelled').length;
  const totalHistoryValue = historyOrders
    .filter((o) => o.orderStatus === 'Delivered')
    .reduce((sum, o) => sum + (o.orderAmount || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-slate-600">
            <History className="w-4 h-4 text-emerald-600" />
            <span>Fulfillment History</span>
          </div>
          <h1 className="text-2xl font-black text-brand-navy-950 mt-1">
            Partner Order History
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-600">
            Archive of completed and delivered prescription orders fulfilled by partner stores.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Exporting partner pharmacy order audit ledger... (Mock Action)')}
          className="px-4 py-2.5 rounded-xl border border-brand-slate-200 bg-white hover:bg-brand-slate-50 text-brand-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-brand-slate-500" />
          <span>Export History CSV</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs bg-emerald-50/20">
          <span className="text-[11px] font-bold text-emerald-800 uppercase block">Total Delivered</span>
          <div className="text-2xl font-black text-emerald-950 mt-1 font-mono">{totalDelivered}</div>
          <span className="text-[11px] text-emerald-700 mt-1 block">Successfully fulfilled by partners</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs bg-rose-50/20">
          <span className="text-[11px] font-bold text-rose-800 uppercase block">Total Cancelled / Rejected</span>
          <div className="text-2xl font-black text-rose-950 mt-1 font-mono">{totalCancelled}</div>
          <span className="text-[11px] text-rose-700 mt-1 block">Unfulfilled or patient cancellation</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-brand-slate-500 uppercase block">Delivered Order Volume</span>
          <div className="text-2xl font-black text-brand-navy-950 mt-1 font-mono">
            ₹{totalHistoryValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-brand-slate-400 mt-1 block">Gross partner prescription turnover</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {['All', 'Delivered', 'Cancelled'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setHistoryFilter(f)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                historyFilter === f
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white text-brand-slate-600 border-brand-slate-200 hover:bg-brand-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate-400" />
          <input
            type="text"
            placeholder="Search historical order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-brand-slate-200 bg-brand-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-slate-50/80 border-b border-brand-slate-200/80 text-[11px] font-bold text-brand-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Parent Order Link</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Medicines Fulfilled</th>
                <th className="py-3 px-4">Partner Store</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-brand-slate-400">
                    No historical external orders matching criteria.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((order) => {
                  const isDelivered = order.orderStatus === 'Delivered';

                  return (
                    <tr key={order.orderId} className="hover:bg-brand-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-navy-950">
                        {order.orderId}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-emerald-800 font-semibold">
                        <div className="flex items-center gap-1">
                          <GitFork className="w-3 h-3 text-emerald-600" />
                          <span>{order.parentOrderId}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-brand-navy-900 block">{order.patientName}</span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="truncate block font-medium">
                          {order.unavailableMedicines?.map((m) => m.name).join(', ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-brand-navy-900 block">
                          {order.assignedPartnerPharmacy?.name || 'Unassigned'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isDelivered
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              : 'bg-rose-100 text-rose-900 border border-rose-200'
                          }`}
                        >
                          {isDelivered ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-rose-600" />
                          )}
                          <span>{order.orderStatus}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-brand-navy-950">
                        ₹{order.orderAmount?.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => onOpenOrderDetail(order)}
                          className="p-1.5 text-brand-slate-500 hover:text-brand-navy-900 hover:bg-brand-slate-100 rounded-lg transition-colors border border-brand-slate-200"
                          title="Inspect Order"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
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
