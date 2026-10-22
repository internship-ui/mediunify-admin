import React from 'react';
import {
  Store,
  Package,
  GitFork,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Star,
  ShieldCheck,
  Truck,
  Plus,
  Activity,
  Receipt,
  User
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function ThirdPartyDashboardView({
  orders = [],
  partners = [],
  onNavigateTab,
  onOpenAssign,
  onOpenOrderDetail,
  onOpenAddPartner,
  onOpenSplitRouter
}) {
  // Metric calculations
  const totalPartners = partners.length;
  const activePartners = partners.filter((p) => p.operationalStatus === 'Active').length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending Assignment').length;
  const inProgressOrders = orders.filter((o) =>
    ['Assigned', 'Accepted', 'Preparing', 'Dispatched'].includes(o.orderStatus)
  ).length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'Cancelled').length;

  const totalRoutedAmount = orders.reduce((sum, o) => sum + (o.orderAmount || 0), 0);
  const totalCommission = Math.round(totalRoutedAmount * 0.12);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Executive Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-brand-navy-900 rounded-2xl p-6 text-white shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Partner Pharmacy Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">
            Third-Party Pharmacy Hub
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1.5 max-w-2xl leading-relaxed">
            Monitor partner order fulfillment in real time and track platform commission earnings with zero inventory overhead.
          </p>

          <div className="flex items-center gap-4 mt-3 text-[11px] text-emerald-200/90 flex-wrap">
            <span>Network Status: <strong className="text-white">Active ({activePartners} Stores Online)</strong></span>
            <span>•</span>
            <span>Inventory Model: <strong className="text-white">Zero Stock Holding (Partner Fulfilled)</strong></span>
            <span>•</span>
            <span>Platform Fee: <strong className="text-white">12% Commission</strong></span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap lg:flex-col gap-2.5 min-w-[210px]">
          <button
            type="button"
            onClick={onOpenSplitRouter}
            className="w-full px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <GitFork className="w-4 h-4 text-emerald-700" />
            <span>Simulate Order Routing</span>
          </button>
          <button
            type="button"
            onClick={onOpenAddPartner}
            className="w-full px-4 py-2.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white border border-emerald-500/40 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Partner Store</span>
          </button>
        </div>
      </div>

      {/* 2. SUMMARY STATISTICS CARDS (Monitoring & Earnings) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Partner Pharmacies */}
        <div
          onClick={() => onNavigateTab('partners')}
          className="bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-brand-slate-500 text-xs font-bold">
            <span>Partner Stores</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:scale-110 transition-transform">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-navy-900 mt-2 font-mono">
            {totalPartners}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-brand-slate-100 text-[11px]">
            <span className="text-emerald-700 font-semibold">{activePartners} Active Stores</span>
            <span className="text-brand-slate-400 group-hover:text-emerald-700 font-medium flex items-center gap-0.5">
              View Stores <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 2: Pending Orders */}
        <div
          onClick={() => onNavigateTab('orders', 'Pending Assignment')}
          className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group bg-amber-50/20"
        >
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
            <span>Pending Orders</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-950 mt-2 font-mono">
            {pendingOrders}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-200/60 text-[11px]">
            <span className="text-amber-700 font-semibold">Awaiting Assignment</span>
            <span className="text-amber-800 group-hover:underline font-bold flex items-center gap-0.5">
              Assign Store <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 3: Orders In Delivery */}
        <div
          onClick={() => onNavigateTab('tracking')}
          className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group bg-blue-50/20"
        >
          <div className="flex items-center justify-between text-blue-800 text-xs font-bold">
            <span>Active Deliveries</span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800 group-hover:scale-110 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-950 mt-2 font-mono">
            {inProgressOrders}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200/60 text-[11px]">
            <span className="text-blue-700 font-semibold">Preparing & En Route</span>
            <span className="text-blue-800 group-hover:underline font-bold flex items-center gap-0.5">
              Live Track <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 4: Platform Commission Earnings */}
        <div
          onClick={() => onNavigateTab('earnings')}
          className="bg-white p-5 rounded-2xl border border-brand-teal-200 shadow-xs hover:border-brand-teal-400 hover:shadow-md transition-all cursor-pointer group bg-teal-50/20"
        >
          <div className="flex items-center justify-between text-brand-teal-800 text-xs font-bold">
            <span>Commission Earnings</span>
            <div className="p-2 rounded-xl bg-teal-100 text-brand-teal-800 group-hover:scale-110 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-teal-950 mt-2 font-mono">
            ₹{totalCommission.toLocaleString()}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-brand-teal-200/60 text-[11px]">
            <span className="text-brand-teal-700 font-semibold">12% Margin Earned</span>
            <span className="text-brand-teal-800 group-hover:underline font-bold flex items-center gap-0.5">
              Payouts <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Zero-Inventory Fulfillment Stepper */}
      <div className="bg-white p-5 rounded-2xl border border-brand-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <GitFork className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-brand-navy-950 text-sm">
                Zero-Inventory Fulfillment Workflow
              </h3>
              <p className="text-[11px] text-brand-slate-500">
                Unavailable medicines are fulfilled by local partner pharmacies with real-time monitoring and 12% commission
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenSplitRouter}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>Simulate Order Routing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5-Step Visual Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between text-brand-slate-400 font-mono text-[10px] font-bold">
              <span>STEP 01</span>
              <span>PATIENT</span>
            </div>
            <span className="font-bold text-brand-navy-900 block">Patient Order</span>
            <p className="text-[11px] text-brand-slate-500">
              Prescription order received with multiple prescribed items.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-teal-50/70 border border-brand-teal-200 text-xs space-y-1">
            <div className="flex items-center justify-between text-brand-teal-600 font-mono text-[10px] font-bold">
              <span>STEP 02</span>
              <span>CENTRAL HUB</span>
            </div>
            <span className="font-bold text-brand-teal-950 block">Stock Check</span>
            <p className="text-[11px] text-brand-teal-800">
              In-stock items proceed directly via the Central Hub.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1">
            <div className="flex items-center justify-between text-amber-700 font-mono text-[10px] font-bold">
              <span>STEP 03</span>
              <span>ROUTER</span>
            </div>
            <span className="font-bold text-amber-950 block">Partner Routing</span>
            <p className="text-[11px] text-amber-800">
              Out-of-stock items are automatically routed to nearest partner.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
            <div className="flex items-center justify-between text-emerald-700 font-mono text-[10px] font-bold">
              <span>STEP 04</span>
              <span>PARTNER STORE</span>
            </div>
            <span className="font-bold text-emerald-950 block">Partner Packaging</span>
            <p className="text-[11px] text-emerald-800">
              Partner prepares items from their physical retail shelves.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-1">
            <div className="flex items-center justify-between text-blue-700 font-mono text-[10px] font-bold">
              <span>STEP 05</span>
              <span>EARNINGS</span>
            </div>
            <span className="font-bold text-blue-950 block">Delivery & Margin</span>
            <p className="text-[11px] text-blue-800">
              Order delivered to patient; MediUnify retains 12% commission.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Action Queues: Pending External Orders & Top Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent External Orders Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-brand-navy-900 text-sm">
                  External Orders Requiring Attention
                </h3>
                <p className="text-[11px] text-brand-slate-500">
                  Orders redirected from Pharmacy Hub pending assignment or in delivery
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 4).map((order) => {
              const isPending = order.orderStatus === 'Pending Assignment';
              return (
                <div
                  key={order.orderId}
                  className="p-3.5 rounded-xl border border-brand-slate-200/90 hover:border-emerald-300 hover:bg-brand-slate-50/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-navy-900">{order.orderId}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-slate-100 text-brand-slate-600">
                        Parent: {order.parentOrderId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPending
                            ? 'bg-amber-100 text-amber-900'
                            : order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="text-[11px] text-brand-slate-600 flex items-center gap-2 flex-wrap">
                      <span>Patient: <strong>{order.patientName}</strong></span>
                      <span>•</span>
                      <span>{order.patientArea}</span>
                      <span>•</span>
                      <span className="text-amber-800 font-semibold">
                        Unavailable: {order.unavailableMedicines?.map((m) => m.name).join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-brand-navy-900">
                      ₹{order.orderAmount?.toLocaleString()}
                    </span>

                    {isPending ? (
                      <button
                        type="button"
                        onClick={() => onOpenAssign(order)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1"
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>Assign</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenOrderDetail(order)}
                        className="px-3 py-1.5 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-100 border border-brand-slate-200 rounded-lg"
                      >
                        Details
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Top Performing External Partner Pharmacies */}
        <div className="bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-brand-navy-900 text-sm">Partner Pharmacies</h3>
                <p className="text-[11px] text-brand-slate-500">Verified retail network in Mysore</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('partners')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              All Stores
            </button>
          </div>

          <div className="space-y-3">
            {partners.slice(0, 3).map((partner) => (
              <div
                key={partner.id}
                className="p-3 rounded-xl bg-brand-slate-50/70 border border-brand-slate-200/80 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-brand-navy-900 block">{partner.name}</span>
                    <span className="text-[10px] text-brand-slate-500 font-mono">
                      {partner.area} • {partner.distanceFromHubKm} km from hub
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{partner.rating}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-brand-slate-600 pt-1 border-t border-brand-slate-200/60 font-mono">
                  <span>Fulfillment: <strong className="text-emerald-700">{partner.fulfillmentRate}%</strong></span>
                  <span>Avg TAT: <strong>{partner.avgDeliveryMins}m</strong></span>
                  <span>Load: <strong>{partner.activeOrdersLoad}/{partner.maxDailyCapacity}</strong></span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenAddPartner}
            className="w-full py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard New Partner Store</span>
          </button>
        </div>
      </div>
    </div>
  );
}
