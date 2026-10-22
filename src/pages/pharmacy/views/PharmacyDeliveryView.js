import React, { useState } from 'react';
import {
  Truck,
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Phone,
  ShieldCheck,
  Navigation,
  Package,
  Layers
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function PharmacyDeliveryView({
  deliveries = [],
  onOpenOrderDetails
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered deliveries
  const filteredDeliveries = deliveries.filter((d) => {
    const matchesSearch =
      (d.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.runnerName || '').toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTab = true;
    if (activeTab === 'preparing') {
      matchesTab = d.deliveryStatus === 'Preparing';
    } else if (activeTab === 'packed') {
      matchesTab = d.deliveryStatus === 'Packed';
    } else if (activeTab === 'out-for-delivery') {
      matchesTab = d.deliveryStatus === 'Out for Delivery';
    } else if (activeTab === 'delivered') {
      matchesTab = d.deliveryStatus === 'Delivered';
    }

    return matchesSearch && matchesTab;
  });

  const tabs = [
    { id: 'all', label: 'All Dispatches', count: deliveries.length },
    {
      id: 'preparing',
      label: 'Preparing / Staging',
      count: deliveries.filter((d) => d.deliveryStatus === 'Preparing').length
    },
    {
      id: 'packed',
      label: 'Packed & Sealed',
      count: deliveries.filter((d) => d.deliveryStatus === 'Packed').length,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'out-for-delivery',
      label: 'Out for Delivery',
      count: deliveries.filter((d) => d.deliveryStatus === 'Out for Delivery').length,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'delivered',
      label: 'Delivered',
      count: deliveries.filter((d) => d.deliveryStatus === 'Delivered').length,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Truck className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-brand-navy-900">Delivery Logistics & Runner Monitoring</h1>
              <p className="text-xs text-brand-slate-500">
                Live oversight of patient home delivery dispatch, courier runner transit, and cold-chain drop confirmations
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-slate-100 border border-brand-slate-200 rounded-xl text-xs text-brand-slate-700 font-medium">
          <ShieldCheck className="w-4 h-4 text-brand-teal-700" />
          <span>Monitoring Mode</span>
        </div>
      </div>

      {/* Map & Logistics Visual Overview Banner (Section 17) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Route Visual Mockup */}
        <div className="lg:col-span-2 bg-gradient-to-br from-brand-slate-900 to-brand-navy-950 p-5 rounded-2xl text-white shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-300">
                Mysore Central Hub Logistics Grid
              </span>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-mono font-bold bg-white/10 rounded-lg border border-white/10">
              Zone: KA-09 Hub
            </span>
          </div>

          <div className="my-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-brand-slate-300 uppercase block font-semibold">Active Runners</span>
              <span className="text-lg font-black text-white mt-0.5 block">6 In Transit</span>
              <span className="text-[10px] text-emerald-300">All GPS Connected</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-brand-slate-300 uppercase block font-semibold">Avg Delivery Time</span>
              <span className="text-lg font-black text-white mt-0.5 block">32 Minutes</span>
              <span className="text-[10px] text-brand-teal-200">Express Radius &lt; 8km</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-brand-slate-300 uppercase block font-semibold">Cold Chain Status</span>
              <span className="text-lg font-black text-emerald-300 mt-0.5 block">100% Compliant</span>
              <span className="text-[10px] text-brand-slate-300">2-8°C Insulated Bags</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-brand-slate-400 border-t border-white/10 pt-2">
            <span>Central Hub Dispatch Complex, Peenya/Hebbal Sector</span>
            <span className="text-brand-teal-300 font-semibold">Live GPS Telemetry Active</span>
          </div>
        </div>

        {/* Quick Delivery Summary */}
        <div className="bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-brand-navy-900 text-sm">Delivery Milestones Today</h3>
            <p className="text-[11px] text-brand-slate-500">Live fulfillment counts</p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-700">Orders Staging</span>
              <span className="font-mono font-bold text-slate-900">
                {deliveries.filter((d) => d.deliveryStatus === 'Preparing').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50/70 border border-blue-100">
              <span className="text-blue-900 font-semibold">Packed & Awaiting Runner</span>
              <span className="font-mono font-bold text-blue-900">
                {deliveries.filter((d) => d.deliveryStatus === 'Packed').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 border border-amber-100">
              <span className="text-amber-900 font-semibold">Out with Courier Runners</span>
              <span className="font-mono font-bold text-amber-900">
                {deliveries.filter((d) => d.deliveryStatus === 'Out for Delivery').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-emerald-900 font-semibold">Delivered Successfully</span>
              <span className="font-mono font-bold text-emerald-900">
                {deliveries.filter((d) => d.deliveryStatus === 'Delivered').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-brand-slate-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-700 text-white shadow-xs'
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

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, Patient, or Assigned Runner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-brand-slate-50/50"
          />
        </div>

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-indigo-700 font-bold hover:underline px-2"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Deliveries Table (Section 17) */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-brand-slate-50/80 border-b border-brand-slate-200 text-brand-slate-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-3">Patient Name</th>
                <th className="py-3.5 px-3 text-center">Delivery Status</th>
                <th className="py-3.5 px-3">Packed Time</th>
                <th className="py-3.5 px-3">Dispatch Time</th>
                <th className="py-3.5 px-3">Delivered Time</th>
                <th className="py-3.5 px-3">Runner / ETA</th>
                <th className="py-3.5 px-3">Notes</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-brand-slate-400">
                    <Truck className="w-8 h-8 mx-auto mb-2 opacity-40 text-brand-slate-400" />
                    <p className="font-bold text-sm text-brand-navy-900">No delivery dispatches found</p>
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((del) => (
                  <tr key={del.orderId} className="hover:bg-brand-slate-50/60 transition-colors group">
                    <td className="py-3 px-4 font-mono font-bold text-brand-teal-900">
                      {del.orderId}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-brand-navy-900">{del.patientName}</div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={del.deliveryStatus} size="xs" />
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-brand-slate-600">
                      {del.packedTime}
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-brand-slate-600">
                      {del.dispatchTime}
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-brand-slate-600 font-semibold">
                      {del.deliveredTime}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-brand-navy-900 text-xs">{del.runnerName}</div>
                      <div className="text-[10px] text-brand-slate-400">{del.eta}</div>
                    </td>

                    <td className="py-3 px-3 text-[11px] text-brand-slate-500 max-w-[140px] truncate" title={del.deliveryNotes}>
                      {del.deliveryNotes}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onOpenOrderDetails({ orderId: del.orderId, patientName: del.patientName })}
                        className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg border border-indigo-200 transition-all shadow-2xs"
                      >
                        Details
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
