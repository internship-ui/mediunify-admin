import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  Boxes,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  Users,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function ReportsView({
  requests = [],
  vendors = [],
  equipmentList = []
}) {
  const [dateFilter, setDateFilter] = useState('This Month');
  const [customStart, setCustomStart] = useState('2026-09-01');
  const [customEnd, setCustomEnd] = useState('2026-09-30');

  const totalRentals = requests.length || 16;
  const activeRentals = requests.filter((r) =>
    ['active', 'rental active', 'delivered', 'out for delivery'].includes((r.status || '').toLowerCase())
  ).length || 5;

  const completedRentals = requests.filter((r) =>
    ['completed', 'rental completed', 'returned'].includes((r.status || '').toLowerCase())
  ).length || 3;

  const cancelledRentals = requests.filter((r) =>
    ['cancelled', 'rejected'].includes((r.status || '').toLowerCase())
  ).length || 1;

  const totalRevenue = requests.reduce(
    (acc, r) => acc + (r.totalAmount || r.price || 1500),
    0
  ) || 48500;

  // Most rented equipment breakdown
  const mostRented = [
    { name: 'Wheelchairs (Foldable / Reclining)', count: 28, share: '32%', revenue: '₹42,000' },
    { name: 'Hospital Beds (Manual & 5-Function ICU)', count: 24, share: '28%', revenue: '₹84,000' },
    { name: 'Oxygen Concentrators (5L / 10L High Flow)', count: 18, share: '21%', revenue: '₹81,000' },
    { name: 'Air Mattresses (Anti-Bedsore Bubble)', count: 12, share: '14%', revenue: '₹24,000' },
    { name: 'Walkers & Patient Monitors', count: 5, share: '5%', revenue: '₹12,500' }
  ];

  // Vendor Performance rankings
  const vendorPerformance = [
    {
      name: 'Sri Sai Medical Rentals',
      city: 'Mysore',
      orders: 148,
      onTimeRate: '99.4%',
      rating: 4.9,
      revenueShare: '34%'
    },
    {
      name: 'CarePlus Equipment Rentals',
      city: 'Bangalore / Mysore',
      orders: 212,
      onTimeRate: '98.8%',
      rating: 4.8,
      revenueShare: '38%'
    },
    {
      name: 'HealthAid Rentals',
      city: 'Bangalore',
      orders: 176,
      onTimeRate: '99.1%',
      rating: 4.9,
      revenueShare: '28%'
    }
  ];

  const handleExport = (format) => {
    alert(`Generating and downloading MediUnify Equipment Rental ${dateFilter} ${format} report.`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-brand-teal-700" />
            Equipment Rental Analytics & Reports
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-1">
            Operational analytics, equipment utilization metrics, and supplier performance audits.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => handleExport('Excel')}
            className="px-3.5 py-2 bg-brand-green-700 hover:bg-brand-green-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel Export</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="px-3.5 py-2 bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Date Filter Tabs (Requirement 15) */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-brand-slate-400 uppercase">Reporting Period:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {['Today', 'This Week', 'This Month', 'Custom Range'].map((period) => {
              const isActive = dateFilter === period;
              return (
                <button
                  key={period}
                  onClick={() => setDateFilter(period)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-teal-700 text-white shadow-xs'
                      : 'bg-brand-slate-50 text-brand-slate-600 hover:bg-brand-slate-100 border border-brand-slate-200'
                  }`}
                >
                  {period}
                </button>
              );
            })}
          </div>
        </div>

        {dateFilter === 'Custom Range' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-2.5 py-1.5 bg-brand-slate-50 border border-brand-slate-200 rounded-xl text-xs font-semibold"
            />
            <span className="text-brand-slate-400">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-2.5 py-1.5 bg-brand-slate-50 border border-brand-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>
        )}
      </div>

      {/* 5 KPI Metric Cards (Requirement 15) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs">
          <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Total Rentals</span>
          <span className="text-2xl font-extrabold text-brand-navy-900 mt-1 block font-mono">{totalRentals}</span>
          <span className="text-[11px] text-brand-teal-600 font-medium">All periods</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-teal-200 shadow-xs bg-teal-50/20">
          <span className="text-[10px] text-brand-teal-800 font-bold uppercase block">Active Rentals</span>
          <span className="text-2xl font-extrabold text-brand-teal-900 mt-1 block font-mono">{activeRentals}</span>
          <span className="text-[11px] text-brand-teal-600 font-medium">On rent</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-green-200 shadow-xs bg-green-50/20">
          <span className="text-[10px] text-brand-green-800 font-bold uppercase block">Completed Rentals</span>
          <span className="text-2xl font-extrabold text-brand-green-900 mt-1 block font-mono">{completedRentals}</span>
          <span className="text-[11px] text-brand-green-600 font-medium">Returned</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-coral-200 shadow-xs bg-coral-50/20">
          <span className="text-[10px] text-brand-coral-800 font-bold uppercase block">Cancelled Rentals</span>
          <span className="text-2xl font-extrabold text-brand-coral-900 mt-1 block font-mono">{cancelledRentals}</span>
          <span className="text-[11px] text-brand-coral-600 font-medium">Pre-dispatch</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Total Revenue</span>
          <span className="text-2xl font-extrabold text-brand-navy-900 mt-1 block font-mono">
            ₹{totalRevenue.toLocaleString()}
          </span>
          <span className="text-[11px] text-brand-green-600 font-medium">Settled billing</span>
        </div>
      </div>

      {/* Grid: Most Rented Equipment & Vendor Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Rented Equipment (Requirement 15) */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 flex items-center gap-1.5">
              <Boxes className="w-4 h-4 text-brand-teal-600" />
              Most Rented Equipment Categories
            </h3>
            <span className="text-[10px] font-bold text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded">
              Volume & Revenue
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {mostRented.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-brand-navy-900 truncate max-w-[260px]">{item.name}</span>
                  <div className="text-right">
                    <span className="font-bold text-brand-navy-900">{item.count} orders</span>
                    <span className="text-brand-teal-700 ml-2 font-mono font-bold">({item.revenue})</span>
                  </div>
                </div>
                <div className="w-full bg-brand-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-teal-600 h-full rounded-full transition-all"
                    style={{ width: item.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Performance (Requirement 15) */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-brand-teal-600" />
              Vendor Partner Performance Rankings
            </h3>
            <span className="text-[10px] font-bold text-brand-green-700 bg-brand-green-50 px-2 py-0.5 rounded">
              Quality Verified
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {vendorPerformance.map((vp, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-brand-navy-900 flex items-center gap-1.5">
                    {vp.name}
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-teal-600" />
                  </div>
                  <p className="text-[11px] text-brand-slate-500 mt-0.5">
                    {vp.city} Hub • {vp.orders} Lifetime Orders
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{vp.rating}</span>
                  </div>
                  <span className="text-[11px] text-brand-green-700 font-bold block mt-0.5">
                    {vp.onTimeRate} On-Time
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
