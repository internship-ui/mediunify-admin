import React from 'react';
import {
  Pill,
  Warehouse,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ShoppingBag,
  FileCheck,
  Building2,
  Package,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  Bell,
  Eye,
  Plus,
  Sliders,
  Store
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { CENTRAL_HUB_STATUS, PHARMACY_ALERTS } from '../../../data/pharmacyData';
import { THIRD_PARTY_SUMMARY_STATS } from '../../../data/thirdPartyPharmacyData';
import { useAuth } from '../../../context/AuthContext';

export default function PharmacyDashboardView({
  medicines = [],
  orders = [],
  prescriptions = [],
  deliveries = [],
  stockHistory = [],
  onNavigateModule,
  onOpenAddStock,
  onOpenAdjustStock,
  onOpenMedicineDetails,
  onOpenOrderDetails,
  onOpenPrescriptionDetails
}) {
  const { switchService, currentService } = useAuth();
  const isThirdParty = currentService?.id === 'third-party-pharmacy';

  // Inventory calculations
  const totalMedicines = medicines.length || 1248;
  const totalStockUnits = medicines.reduce((acc, m) => acc + Number(m.availableStock || 0), 0);
  const lowStockCount = medicines.filter((m) => m.status === 'Low Stock' || (m.availableStock > 0 && m.availableStock <= m.minimumStock)).length;
  const outOfStockCount = medicines.filter((m) => m.status === 'Out of Stock' || m.availableStock === 0).length;
  const expiringSoonCount = medicines.filter((m) => m.daysRemaining && m.daysRemaining <= 90).length || 3;

  // Order monitoring calculations
  const pendingOrdersCount = orders.filter((o) => o.currentStatus === 'Order Placed' || o.currentStatus === 'Prescription Received').length;
  const processingOrdersCount = orders.filter((o) => o.currentStatus === 'Prescription Verified' || o.currentStatus === 'Picking' || o.currentStatus === 'Packed').length;
  const outForDeliveryOrdersCount = orders.filter((o) => o.currentStatus === 'Out for Delivery').length;
  const deliveredOrdersCount = orders.filter((o) => o.currentStatus === 'Delivered').length;
  const cancelledOrdersCount = orders.filter((o) => o.currentStatus === 'Cancelled').length;

  // Prescription monitoring calculations
  const rxPendingCount = prescriptions.filter((p) => p.verificationStatus === 'Pending Verification').length;
  const rxVerifiedCount = prescriptions.filter((p) => p.verificationStatus === 'Verified').length;
  const rxRejectedCount = prescriptions.filter((p) => p.verificationStatus === 'Rejected').length;

  // Delivery monitoring calculations
  const delPreparingCount = deliveries.filter((d) => d.deliveryStatus === 'Preparing').length;
  const delPackedCount = deliveries.filter((d) => d.deliveryStatus === 'Packed').length;
  const delOutCount = deliveries.filter((d) => d.deliveryStatus === 'Out for Delivery').length;
  const delDoneCount = deliveries.filter((d) => d.deliveryStatus === 'Delivered').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Top Executive Banner: Hub Status */}
      <div className="bg-gradient-to-r from-brand-teal-800 via-brand-teal-900 to-brand-navy-900 rounded-2xl p-6 text-white shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-teal-200 text-xs font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isThirdParty ? 'Multiple Pharmacy Network' : CENTRAL_HUB_STATUS.hubName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">
            {isThirdParty ? 'Multiple Pharmacy Operations Hub' : 'Central Pharmacy Admin Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-brand-teal-100 mt-1.5 max-w-2xl leading-relaxed">
            {isThirdParty
              ? 'Multiple pharmacy inventory control, stock maintenance, and real-time operational monitoring across partner stores.'
              : 'Overall pharmacy inventory control, stock maintenance, and real-time operational monitoring across the Central Pharmacy Hub workflow.'}
          </p>

          <div className="flex items-center gap-4 mt-3 text-[11px] text-brand-teal-200/90 flex-wrap">
            <span>Pharmacist in Charge: <strong>{CENTRAL_HUB_STATUS.pharmacistInCharge}</strong></span>
            <span>•</span>
            <span>License: <strong>{CENTRAL_HUB_STATUS.licenseNumber}</strong></span>
          </div>
        </div>

        {/* Quick Hub Today's Activity Pill Box (Section 18) */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 min-w-[280px]">
          <span className="text-[10px] uppercase font-bold text-brand-teal-200 tracking-wider block mb-2">
            Central Hub Live Activity
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-[10px] text-brand-teal-200 block">Orders Received</span>
              <span className="text-base font-bold text-white">{CENTRAL_HUB_STATUS.todayActivity.ordersReceived}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-[10px] text-brand-teal-200 block">Rx Verified</span>
              <span className="text-base font-bold text-emerald-300">{CENTRAL_HUB_STATUS.todayActivity.prescriptionsVerified}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-[10px] text-brand-teal-200 block">Out for Delivery</span>
              <span className="text-base font-bold text-amber-300">{CENTRAL_HUB_STATUS.todayActivity.outForDelivery}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-[10px] text-brand-teal-200 block">Delivered Today</span>
              <span className="text-base font-bold text-brand-teal-100">{CENTRAL_HUB_STATUS.todayActivity.deliveredToday}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. INVENTORY SUMMARY CARDS (Requirement 4) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-slate-500 flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-brand-teal-700" />
            Inventory & Stock Summary
          </h2>
          <button
            onClick={() => onNavigateModule('inventory')}
            className="text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800 flex items-center gap-1"
          >
            <span>Open Full Inventory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Total Medicines */}
          <div
            onClick={() => onNavigateModule('inventory', 'all')}
            className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs hover:border-brand-teal-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-brand-slate-500 text-xs font-bold">
              <span>Total Medicines</span>
              <Pill className="w-4 h-4 text-brand-teal-600" />
            </div>
            <div className="text-2xl font-black text-brand-navy-900 mt-2 font-mono">
              {totalMedicines.toLocaleString()}
            </div>
            <p className="text-[11px] text-brand-slate-400 mt-1">Active Catalog SKUs</p>
          </div>

          {/* Card 2: Total Stock Units */}
          <div
            onClick={() => onNavigateModule('inventory', 'all')}
            className="bg-white p-4 rounded-2xl border border-brand-teal-200 shadow-xs hover:shadow-md transition-all cursor-pointer group bg-teal-50/20"
          >
            <div className="flex items-center justify-between text-brand-teal-800 text-xs font-bold">
              <span>Total Stock Units</span>
              <Package className="w-4 h-4 text-brand-teal-600" />
            </div>
            <div className="text-2xl font-black text-brand-teal-950 mt-2 font-mono">
              {totalStockUnits.toLocaleString()}
            </div>
            <p className="text-[11px] text-brand-teal-700 font-medium mt-1">Units in Central Hub</p>
          </div>

          {/* Card 3: Low Stock */}
          <div
            onClick={() => onNavigateModule('inventory', 'low-stock')}
            className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group bg-amber-50/20"
          >
            <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
              <span>Low Stock</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-900 mt-2 font-mono">
              {lowStockCount}
            </div>
            <p className="text-[11px] text-amber-700 font-medium mt-1">Below minimum level (Click to view)</p>
          </div>

          {/* Card 4: Out of Stock */}
          <div
            onClick={() => onNavigateModule('inventory', 'low-stock')}
            className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group bg-rose-50/20"
          >
            <div className="flex items-center justify-between text-rose-700 text-xs font-bold">
              <span>Out of Stock</span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-900 mt-2 font-mono">
              {outOfStockCount}
            </div>
            <p className="text-[11px] text-rose-600 font-medium mt-1">Zero units available (Click to view)</p>
          </div>

          {/* Card 5: Expiring Soon */}
          <div
            onClick={() => onNavigateModule('inventory', 'expiring')}
            className="bg-white p-4 rounded-2xl border border-purple-200 shadow-xs hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group bg-purple-50/20"
          >
            <div className="flex items-center justify-between text-purple-700 text-xs font-bold">
              <span>Expiring Soon</span>
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-900 mt-2 font-mono">
              {expiringSoonCount}
            </div>
            <p className="text-[11px] text-purple-600 font-medium mt-1">Batches &lt; 90 days (Click to view)</p>
          </div>
        </div>
      </div>

      {/* 3. WORKFLOW MONITORING SECTION (Orders, Prescriptions, Delivery) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Monitoring Card (Requirement 4) */}
        <div className="bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-brand-navy-900 text-sm">Order Monitoring</h3>
                <p className="text-[11px] text-brand-slate-500">Live Central Hub Fulfillment</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateModule('orders')}
              className="text-xs font-bold text-brand-teal-700 hover:underline"
            >
              View Orders
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/60 border border-amber-100">
              <span className="font-semibold text-amber-900">Pending Orders</span>
              <span className="font-mono font-bold text-amber-900">{pendingOrdersCount}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50/60 border border-blue-100">
              <span className="font-semibold text-blue-900">Processing (Picking/Packed)</span>
              <span className="font-mono font-bold text-blue-900">{processingOrdersCount}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-purple-50/60 border border-purple-100">
              <span className="font-semibold text-purple-900">Out for Delivery</span>
              <span className="font-mono font-bold text-purple-900">{outForDeliveryOrdersCount}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="font-semibold text-emerald-900">Delivered Today</span>
              <span className="font-mono font-bold text-emerald-900">{deliveredOrdersCount}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-semibold text-slate-600">Cancelled / Rejected</span>
              <span className="font-mono font-bold text-slate-700">{cancelledOrdersCount}</span>
            </div>
          </div>
        </div>

        {/* Prescription Monitoring Card (Requirement 4) */}
        <div className="bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-brand-teal-700">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-brand-navy-900 text-sm">Prescription Monitoring</h3>
                <p className="text-[11px] text-brand-slate-500">Pharmacist Verification Queue</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateModule('orders')}
              className="text-xs font-bold text-brand-teal-700 hover:underline"
            >
              View Orders
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
              <div>
                <span className="font-bold text-amber-900 block">Pending Verification</span>
                <span className="text-[10px] text-amber-700">In Hub Pharmacist Queue</span>
              </div>
              <span className="font-mono font-bold text-amber-900 text-base">{rxPendingCount}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div>
                <span className="font-bold text-emerald-900 block">Verified & Approved</span>
                <span className="text-[10px] text-emerald-700">Approved for Dispensing</span>
              </div>
              <span className="font-mono font-bold text-emerald-900 text-base">{rxVerifiedCount}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/60 border border-rose-100">
              <div>
                <span className="font-bold text-rose-900 block">Rejected Prescriptions</span>
                <span className="text-[10px] text-rose-700">Incomplete or Invalid Rx</span>
              </div>
              <span className="font-mono font-bold text-rose-900 text-base">{rxRejectedCount}</span>
            </div>
          </div>
        </div>

        {/* Delivery Monitoring Card (Requirement 4) */}
        <div className="bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-brand-navy-900 text-sm">Delivery Monitoring</h3>
                <p className="text-[11px] text-brand-slate-500">Runner Logistics & Dispatch</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateModule('delivery')}
              className="text-xs font-bold text-brand-teal-700 hover:underline"
            >
              Live Tracking
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-700">Preparing & Staging</span>
              <span className="font-mono font-bold text-slate-900">{delPreparingCount}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50/60 border border-blue-100">
              <span className="font-semibold text-blue-900">Packed & Sealed</span>
              <span className="font-mono font-bold text-blue-900">{delPackedCount}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/60 border border-amber-100">
              <span className="font-semibold text-amber-900">Out with Runners</span>
              <span className="font-mono font-bold text-amber-900">{delOutCount}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="font-semibold text-emerald-900">Delivered to Patients</span>
              <span className="font-mono font-bold text-emerald-900">{delDoneCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Real-time Inventory Alerts & Recent Activity Feed (Section 20) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Feed */}
        <div className="bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-brand-navy-900 text-sm">Pharmacy Stock & Safety Alerts</h3>
                <p className="text-[11px] text-brand-slate-500">Automated inventory threshold monitors</p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full">
              {PHARMACY_ALERTS.length} Alerts
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs">
            {PHARMACY_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                  alert.severity === 'critical'
                    ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                    : alert.severity === 'warning'
                    ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                    : 'bg-teal-50/60 border-teal-200 text-teal-950'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="font-bold block">{alert.title}</span>
                  <p className="text-[11px] opacity-90 leading-relaxed">{alert.message}</p>
                </div>
                <span className="text-[10px] opacity-75 font-mono whitespace-nowrap">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Stock Movement Audit (Section 12 Preview) */}
        <div className="bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-teal-50 text-brand-teal-700">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-brand-navy-900 text-sm">Recent Stock Movements</h3>
                <p className="text-[11px] text-brand-slate-500">Audit trail of additions & deductions</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateModule('inventory')}
              className="text-xs font-bold text-brand-teal-700 hover:underline"
            >
              View History
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
            {(stockHistory || []).slice(0, 5).map((txn) => (
              <div
                key={txn.id}
                className="p-3 bg-brand-slate-50/80 rounded-xl border border-brand-slate-200/80 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-brand-navy-900">{txn.medicineName}</span>
                    <span className="font-mono text-[10px] text-brand-slate-500">({txn.batch})</span>
                  </div>
                  <p className="text-[11px] text-brand-slate-500">{txn.reason}</p>
                </div>

                <div className="text-right whitespace-nowrap">
                  <span
                    className={`font-mono font-bold text-xs ${
                      txn.quantity.startsWith('+') ? 'text-brand-green-700' : 'text-brand-coral-700'
                    }`}
                  >
                    {txn.quantity} Units
                  </span>
                  <p className="text-[10px] text-brand-slate-400 font-mono">
                    {txn.previousStock} → {txn.updatedStock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
