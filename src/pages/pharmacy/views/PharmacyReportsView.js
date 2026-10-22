import React, { useState } from 'react';
import {
  BarChart3,
  Warehouse,
  History,
  ShoppingBag,
  Truck,
  Download,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Pill,
  TrendingUp
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function PharmacyReportsView({
  medicines = [],
  orders = [],
  deliveries = [],
  stockHistory = []
}) {
  const { addToast } = useToast();
  const [activeReportTab, setActiveReportTab] = useState('inventory');
  const [selectedRange, setSelectedRange] = useState('month');

  // Calculations for Inventory Report
  const totalMedicines = medicines.length;
  const totalStockUnits = medicines.reduce((acc, m) => acc + Number(m.availableStock || 0), 0);
  const totalInventoryValuation = medicines.reduce(
    (acc, m) => acc + Number(m.availableStock || 0) * Number(m.purchasePrice || 0),
    0
  );
  const lowStockCount = medicines.filter((m) => m.status === 'Low Stock' || (m.availableStock > 0 && m.availableStock <= m.minimumStock)).length;
  const outOfStockCount = medicines.filter((m) => m.status === 'Out of Stock' || m.availableStock === 0).length;
  const expiringCount = medicines.filter((m) => m.daysRemaining && m.daysRemaining <= 90).length;

  // Calculations for Stock Movement Report
  const stockAddedCount = stockHistory.filter((s) => s.transactionType === 'Stock Added').length;
  const stockDamagedCount = stockHistory.filter((s) => s.transactionType === 'Damaged Stock').length;
  const stockExpiredCount = stockHistory.filter((s) => s.transactionType === 'Expired Stock').length;
  const stockCorrectionCount = stockHistory.filter((s) => s.transactionType === 'Stock Correction').length;

  // Calculations for Order Report
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => ['Order Placed', 'Prescription Received'].includes(o.currentStatus)).length;
  const processingOrders = orders.filter((o) => ['Prescription Verified', 'Picking', 'Packed'].includes(o.currentStatus)).length;
  const deliveredOrders = orders.filter((o) => o.currentStatus === 'Delivered').length;
  const cancelledOrders = orders.filter((o) => o.currentStatus === 'Cancelled').length;
  const totalRevenue = orders.reduce((acc, o) => acc + Number(o.orderAmount || 0), 0);

  // Calculations for Delivery Report
  const totalDeliveries = deliveries.length;
  const outForDelivery = deliveries.filter((d) => d.deliveryStatus === 'Out for Delivery').length;
  const deliveredCount = deliveries.filter((d) => d.deliveryStatus === 'Delivered').length;

  const handleExportCSV = (reportName) => {
    addToast(`Exported ${reportName} (CSV format) successfully`, 'success');
  };

  // State for Inventory Report interactive card filtering
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All'); // 'All' | 'Low Stock' | 'Out of Stock' | 'In Stock'

  // Filtered medicines for Inventory Report table
  const filteredReportMedicines = medicines.filter((m) => {
    if (selectedStatusFilter === 'All') return true;
    if (selectedStatusFilter === 'Low Stock') {
      return m.status === 'Low Stock' || (m.availableStock > 0 && m.availableStock <= m.minimumStock);
    }
    if (selectedStatusFilter === 'Out of Stock') {
      return m.status === 'Out of Stock' || m.availableStock === 0;
    }
    if (selectedStatusFilter === 'In Stock') {
      return m.status === 'In Stock' && m.availableStock > m.minimumStock;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-brand-teal-700">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-brand-navy-900">Pharmacy Analytics & Audit Reports</h1>
              <p className="text-xs text-brand-slate-500">
                Generate operational summaries for stock valuation, inventory movements, order SLAs, and runner dispatches
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-brand-slate-50 font-medium text-brand-slate-700"
          >
            <option value="today">Today (29 Sep 2026)</option>
            <option value="week">This Week</option>
            <option value="month">Current Month (Sep 2026)</option>
            <option value="quarter">Q3 2026</option>
          </select>

          <button
            onClick={() => handleExportCSV(activeReportTab.toUpperCase())}
            className="px-3.5 py-2 text-xs font-bold text-brand-teal-800 bg-brand-teal-50 hover:bg-brand-teal-100 border border-brand-teal-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Report Sub-tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-brand-slate-200">
        {[
          { id: 'inventory', label: 'Inventory Report', icon: Warehouse },
          { id: 'movement', label: 'Stock Movement Report', icon: History },
          { id: 'orders', label: 'Order Report', icon: ShoppingBag },
          { id: 'delivery', label: 'Delivery Report', icon: Truck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReportTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-teal-700 text-white shadow-xs'
                  : 'text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. INVENTORY REPORT (Section 21) */}
      {activeReportTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* Card 1: All */}
            <div
              onClick={() => setSelectedStatusFilter('All')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                selectedStatusFilter === 'All'
                  ? 'bg-brand-slate-900 text-white border-brand-slate-900 shadow-md ring-2 ring-brand-teal-500'
                  : 'bg-white border-brand-slate-200 hover:border-brand-teal-300 hover:shadow-xs shadow-xs'
              }`}
            >
              <span className={`text-xs font-semibold block ${selectedStatusFilter === 'All' ? 'text-brand-slate-300' : 'text-brand-slate-500'}`}>
                Total Catalog Lines
              </span>
              <span className={`text-2xl font-black font-mono mt-1 block ${selectedStatusFilter === 'All' ? 'text-white' : 'text-brand-navy-900'}`}>
                {totalMedicines}
              </span>
              <span className={`text-[11px] font-medium ${selectedStatusFilter === 'All' ? 'text-brand-teal-300' : 'text-brand-teal-700'}`}>
                {selectedStatusFilter === 'All' ? '✓ Showing All SKUs' : 'Click to show all'}
              </span>
            </div>

            {/* Card 2: Total Stock Units */}
            <div
              onClick={() => setSelectedStatusFilter('All')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none bg-teal-50/30 ${
                selectedStatusFilter === 'In Stock'
                  ? 'border-brand-teal-600 shadow-md ring-2 ring-brand-teal-600 bg-teal-50/80'
                  : 'border-brand-teal-200 hover:border-brand-teal-400 hover:shadow-xs shadow-xs'
              }`}
            >
              <span className="text-xs text-brand-teal-800 font-semibold block">Total Stock Units</span>
              <span className="text-2xl font-black text-brand-teal-950 font-mono mt-1 block">
                {totalStockUnits.toLocaleString()}
              </span>
              <span className="text-[11px] text-brand-teal-700 font-medium">In central warehouse</span>
            </div>

            {/* Card 3: Inventory Valuation */}
            <div
              onClick={() => setSelectedStatusFilter('All')}
              className="p-4 rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/20 hover:border-emerald-300 transition-all cursor-pointer select-none"
            >
              <span className="text-xs text-emerald-800 font-semibold block">Inventory Valuation</span>
              <span className="text-2xl font-black text-emerald-950 font-mono mt-1 block">
                ₹{Math.round(totalInventoryValuation).toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">At purchase cost</span>
            </div>

            {/* Card 4: Low Stock */}
            <div
              onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Low Stock' ? 'All' : 'Low Stock')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                selectedStatusFilter === 'Low Stock'
                  ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-500'
                  : 'bg-amber-50/30 border-amber-200 hover:border-amber-400 hover:shadow-xs shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-900 font-bold block">Low Stock Lines</span>
                {selectedStatusFilter === 'Low Stock' && (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-600 text-white rounded">FILTERED</span>
                )}
              </div>
              <span className="text-2xl font-black text-amber-950 font-mono mt-1 block">{lowStockCount}</span>
              <span className="text-[11px] text-amber-800 font-medium">
                {selectedStatusFilter === 'Low Stock' ? '✓ Filter active' : 'Click to filter low stock'}
              </span>
            </div>

            {/* Card 5: Out of Stock */}
            <div
              onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'Out of Stock' ? 'All' : 'Out of Stock')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                selectedStatusFilter === 'Out of Stock'
                  ? 'bg-rose-100 border-rose-500 shadow-md ring-2 ring-rose-500'
                  : 'bg-rose-50/30 border-rose-200 hover:border-rose-400 hover:shadow-xs shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-rose-900 font-bold block">Out of Stock</span>
                {selectedStatusFilter === 'Out of Stock' && (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold bg-rose-600 text-white rounded">FILTERED</span>
                )}
              </div>
              <span className="text-2xl font-black text-rose-950 font-mono mt-1 block">{outOfStockCount}</span>
              <span className="text-[11px] text-rose-800 font-medium">
                {selectedStatusFilter === 'Out of Stock' ? '✓ Filter active' : 'Click to filter out of stock'}
              </span>
            </div>
          </div>

          {/* Detailed SKU Breakdown Table */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-brand-navy-900 text-sm">Inventory SKU Status Summary</h3>
                {selectedStatusFilter !== 'All' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-teal-100 text-brand-teal-800 flex items-center gap-1">
                    Filtered: {selectedStatusFilter}
                    <button
                      onClick={() => setSelectedStatusFilter('All')}
                      className="ml-1 text-brand-teal-900 hover:text-black font-black"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-brand-slate-500">
                  Showing <strong>{filteredReportMedicines.length}</strong> of {medicines.length} Medicines
                </span>
                {selectedStatusFilter !== 'All' && (
                  <button
                    onClick={() => setSelectedStatusFilter('All')}
                    className="text-xs font-bold text-brand-teal-700 hover:underline"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-brand-slate-50 text-brand-slate-600 font-bold uppercase text-[11px]">
                    <th className="py-3 px-4">Medicine</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3 text-right">Available Units</th>
                    <th className="py-3 px-3 text-right">Min Stock</th>
                    <th className="py-3 px-3 text-right">Unit Price</th>
                    <th className="py-3 px-3 text-right">Total Value</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100">
                  {filteredReportMedicines.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-10 text-center text-brand-slate-400">
                        <Pill className="w-8 h-8 mx-auto mb-2 opacity-40 text-brand-slate-400" />
                        <p className="font-bold text-sm text-brand-navy-900">No medicines in {selectedStatusFilter} status</p>
                        <button
                          onClick={() => setSelectedStatusFilter('All')}
                          className="mt-2 text-xs font-bold text-brand-teal-700 hover:underline"
                        >
                          View All Medicines
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredReportMedicines.map((m) => (
                      <tr key={m.id} className="hover:bg-brand-slate-50/50">
                        <td className="py-3 px-4 font-bold text-brand-navy-900">{m.name}</td>
                        <td className="py-3 px-3 text-brand-slate-600">{m.category}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-brand-navy-900">{m.availableStock}</td>
                        <td className="py-3 px-3 text-right font-mono text-brand-slate-500">{m.minimumStock}</td>
                        <td className="py-3 px-3 text-right font-mono text-brand-slate-600">₹{Number(m.purchasePrice).toFixed(2)}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-brand-teal-900">
                          ₹{(Number(m.availableStock) * Number(m.purchasePrice)).toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.status === 'Out of Stock'
                              ? 'bg-rose-100 text-rose-800'
                              : m.status === 'Low Stock'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. STOCK MOVEMENT REPORT (Section 21) */}
      {activeReportTab === 'movement' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/20">
              <span className="text-xs text-emerald-800 font-semibold block">Stock Replenishments</span>
              <span className="text-2xl font-black text-emerald-950 font-mono mt-1 block">{stockAddedCount} Batches</span>
              <span className="text-[11px] text-emerald-700">Suppliers received</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs bg-rose-50/20">
              <span className="text-xs text-rose-800 font-semibold block">Damaged Write-offs</span>
              <span className="text-2xl font-black text-rose-950 font-mono mt-1 block">{stockDamagedCount} Items</span>
              <span className="text-[11px] text-rose-700">Written off to audit</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-xs bg-purple-50/20">
              <span className="text-xs text-purple-800 font-semibold block">Expired Write-offs</span>
              <span className="text-2xl font-black text-purple-950 font-mono mt-1 block">{stockExpiredCount} Batches</span>
              <span className="text-[11px] text-purple-700">Quarantined stock</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs bg-blue-50/20">
              <span className="text-xs text-blue-800 font-semibold block">Audit Adjustments</span>
              <span className="text-2xl font-black text-blue-950 font-mono mt-1 block">{stockCorrectionCount} Logs</span>
              <span className="text-[11px] text-blue-700">Physical count reconciliations</span>
            </div>
          </div>

          {/* Movement Log Table */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-brand-navy-900 text-sm">Movement Audit Ledger</h3>
              <span className="text-xs text-brand-slate-500">{stockHistory.length} Recorded transactions</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-brand-slate-50 text-brand-slate-600 font-bold uppercase text-[11px]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-3">Medicine</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3 text-right">Quantity</th>
                    <th className="py-3 px-3">Reason</th>
                    <th className="py-3 px-3">Performed By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100">
                  {stockHistory.map((s) => (
                    <tr key={s.id} className="hover:bg-brand-slate-50/50">
                      <td className="py-3 px-4 font-mono text-brand-slate-500">{s.date}</td>
                      <td className="py-3 px-3 font-bold text-brand-navy-900">{s.medicineName}</td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-brand-slate-700">{s.transactionType}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        <span className={s.quantity.startsWith('+') ? 'text-emerald-700' : 'text-rose-600'}>
                          {s.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-brand-slate-600">{s.reason}</td>
                      <td className="py-3 px-3 text-brand-slate-700 font-medium">{s.performedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ORDER REPORT (Section 21) */}
      {activeReportTab === 'orders' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs">
              <span className="text-xs text-brand-slate-500 font-semibold block">Total Orders Logged</span>
              <span className="text-2xl font-black text-brand-navy-900 font-mono mt-1 block">{totalOrders}</span>
              <span className="text-[11px] text-brand-teal-700">Gross Volume: ₹{totalRevenue.toLocaleString()}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs bg-blue-50/20">
              <span className="text-xs text-blue-800 font-semibold block">Processing In Hub</span>
              <span className="text-2xl font-black text-blue-950 font-mono mt-1 block">{processingOrders}</span>
              <span className="text-[11px] text-blue-700">Picking / Packing stages</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/20">
              <span className="text-xs text-emerald-800 font-semibold block">Successfully Delivered</span>
              <span className="text-2xl font-black text-emerald-950 font-mono mt-1 block">{deliveredOrders}</span>
              <span className="text-[11px] text-emerald-700">Confirmed patient drop</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs bg-slate-50/60">
              <span className="text-xs text-slate-600 font-semibold block">Cancelled / Rejected</span>
              <span className="text-2xl font-black text-slate-800 font-mono mt-1 block">{cancelledOrders}</span>
              <span className="text-[11px] text-slate-500">Rx discrepancies</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs p-5">
            <h3 className="font-bold text-brand-navy-900 text-sm mb-3">Order Fulfillment Pipeline Throughput</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200/80">
                <span className="text-brand-slate-500 font-semibold block">Average Order Value (AOV)</span>
                <span className="text-lg font-bold text-brand-navy-900 mt-1 block">
                  ₹{totalOrders ? Math.round(totalRevenue / totalOrders) : 0}
                </span>
              </div>
              <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200/80">
                <span className="text-brand-slate-500 font-semibold block">Prescription Verification Rate</span>
                <span className="text-lg font-bold text-emerald-700 mt-1 block">96.4% Approved</span>
              </div>
              <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200/80">
                <span className="text-brand-slate-500 font-semibold block">Delivery Completion Rate</span>
                <span className="text-lg font-bold text-brand-teal-700 mt-1 block">98.2% on-time</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. DELIVERY REPORT (Section 21) */}
      {activeReportTab === 'delivery' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-xs bg-indigo-50/20">
              <span className="text-xs text-indigo-800 font-semibold block">Total Dispatches</span>
              <span className="text-2xl font-black text-indigo-950 font-mono mt-1 block">{totalDeliveries}</span>
              <span className="text-[11px] text-indigo-700">Central Hub Fleet</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs bg-amber-50/20">
              <span className="text-xs text-amber-800 font-semibold block">Out for Delivery (Active)</span>
              <span className="text-2xl font-black text-amber-950 font-mono mt-1 block">{outForDelivery}</span>
              <span className="text-[11px] text-amber-700">En route with runners</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/20">
              <span className="text-xs text-emerald-800 font-semibold block">Delivered Completed</span>
              <span className="text-2xl font-black text-emerald-950 font-mono mt-1 block">{deliveredCount}</span>
              <span className="text-[11px] text-emerald-700">OTP Handover confirmed</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs p-5 space-y-3">
            <h3 className="font-bold text-brand-navy-900 text-sm">Runner Fleet Performance Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200/80">
                <span className="text-brand-slate-500 font-semibold block">Average Hub Dispatch Turnaround</span>
                <span className="text-base font-bold text-brand-navy-900 mt-1 block">18 mins (Pick to Pack)</span>
              </div>
              <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200/80">
                <span className="text-brand-slate-500 font-semibold block">Average Transit Time</span>
                <span className="text-base font-bold text-brand-navy-900 mt-1 block">32 mins across Mysore zone</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
