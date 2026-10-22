import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Building2,
  Sparkles,
  MapPin,
  TrendingUp,
  CheckCircle2,
  XCircle,
  PhoneCall,
  CalendarCheck2,
  Star,
  Users
} from 'lucide-react';
import StatCard from '../../../components/common/StatCard';
import { AYURVEDA_REPORTS_DATA } from '../../../data/ayurveda/reports';

export default function ReportsView({
  centres = [],
  services = [],
  bookings = [],
  callbacks = []
}) {
  const [dateRange, setDateRange] = useState('Last 6 Months');
  const [centreFilter, setCentreFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');

  const reportData = AYURVEDA_REPORTS_DATA;

  const handleExportCSV = () => {
    const headers = ['Metric / Item', 'Category / Location', 'Volume / Value', 'Performance Share'];
    const rows = [
      ['Total Registered Centres', 'Network', centres.length, '100%'],
      ['Total Direct Bookings', 'Direct', bookings.length, '74%'],
      ['Total Callback Requests', 'Inquiries', callbacks.length, '26%'],
      ['Classical Shirodhara', 'Panchakarma', '245 bookings', '28%'],
      ['Full Body Abhyanga', 'Panchakarma', '230 bookings', '24%'],
      ['Senior Vaidya Consultation', 'Ayurveda Consultation', '180 bookings', '18%']
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ayurveda_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy-900 flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-brand-green-700" />
            Ayurveda Operations Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
            Comprehensive audit reports on centre capacity, therapy demand volume, and patient acquisition
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-brand-navy-900 bg-brand-slate-100 hover:bg-brand-slate-200 border border-brand-slate-300 rounded-xl transition-colors self-start sm:self-auto shadow-xs"
        >
          <Download className="w-4 h-4 text-brand-navy-800" />
          <span>Export Analytics (CSV)</span>
        </button>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-brand-slate-500 uppercase mb-1">
            Date Period
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white font-medium"
          >
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="Year to Date">Year to Date (2026)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-brand-slate-500 uppercase mb-1">
            Centre Filter
          </label>
          <select
            value={centreFilter}
            onChange={(e) => setCentreFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white font-medium"
          >
            <option value="ALL">All Ayurveda Centres</option>
            {centres.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-brand-slate-500 uppercase mb-1">
            Service Category
          </label>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white font-medium"
          >
            <option value="ALL">All Service Categories</option>
            <option value="Panchakarma">Panchakarma</option>
            <option value="Ayurveda Consultation">Ayurveda Consultation</option>
            <option value="Ayurvedic Therapies">Ayurvedic Therapies</option>
            <option value="Wellness Programs">Wellness Programs</option>
            <option value="Yoga">Yoga</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-brand-slate-500 uppercase mb-1">
            Geographic Zone
          </label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white font-medium"
          >
            <option value="ALL">All Regions (Karnataka & Kerala)</option>
            <option value="Mysuru">Mysuru Cluster</option>
            <option value="Bengaluru">Bengaluru Metro</option>
            <option value="Kerala">Kerala Centers</option>
          </select>
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Centres"
          value={reportData.kpis.totalCentres}
          subtitle="Accredited network"
          iconName="Building2"
          colorScheme="navy"
        />
        <StatCard
          title="Total Bookings"
          value={reportData.kpis.totalBookings}
          subtitle="Direct & scheduled"
          iconName="CalendarCheck2"
          colorScheme="teal"
        />
        <StatCard
          title="Callbacks Logged"
          value={reportData.kpis.totalCallbacks}
          subtitle="Enquiries answered"
          iconName="PhoneCall"
          colorScheme="coral"
        />
        <StatCard
          title="Completed"
          value={reportData.kpis.completedAppointments}
          subtitle="Satisfied sessions"
          iconName="CheckCircle2"
          colorScheme="green"
        />
        <StatCard
          title="Cancelled"
          value={reportData.kpis.cancelledAppointments}
          subtitle="3.8% cancel rate"
          iconName="XCircle"
          colorScheme="coral"
        />
        <StatCard
          title="Avg Rating"
          value={`★ ${reportData.kpis.avgRating}`}
          subtitle="Quality benchmark"
          iconName="Star"
          colorScheme="green"
        />
      </div>

      {/* Visual Analytics Sections: Booking Trends & Callback Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Section 1: Monthly Booking & Growth Trends */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div>
              <h2 className="text-sm font-bold text-brand-navy-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-green-700" />
                Booking Demand Trends (6 Months)
              </h2>
              <p className="text-xs text-brand-slate-500">Distribution between Direct Online Bookings vs Inquired Callbacks</p>
            </div>
            <span className="text-xs font-bold text-brand-green-700 bg-brand-green-50 px-2.5 py-1 rounded-lg border border-brand-green-200">
              +22% MoM Growth
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {reportData.monthlyTrends.map((trend) => {
              const maxVal = 70;
              const directWidth = Math.round((trend.directBookings / maxVal) * 100);
              const callbackWidth = Math.round((trend.callbacks / maxVal) * 100);

              return (
                <div key={trend.month} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-navy-900 w-20">{trend.month}</span>
                    <div className="flex items-center gap-4 text-[11px] text-brand-slate-600">
                      <span>Direct: <strong className="text-brand-navy-900">{trend.directBookings}</strong></span>
                      <span>Callbacks: <strong className="text-brand-coral-600">{trend.callbacks}</strong></span>
                      <span>Completed: <strong className="text-brand-green-700">{trend.completed}</strong></span>
                    </div>
                  </div>

                  <div className="w-full bg-brand-slate-100 rounded-full h-3 flex overflow-hidden">
                    <div
                      className="bg-brand-teal-600 h-3 transition-all duration-500"
                      style={{ width: `${directWidth}%` }}
                      title={`Direct Bookings: ${trend.directBookings}`}
                    />
                    <div
                      className="bg-brand-coral-400 h-3 transition-all duration-500"
                      style={{ width: `${callbackWidth}%` }}
                      title={`Callbacks: ${trend.callbacks}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 border-t border-brand-slate-100 text-[11px] text-brand-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-brand-teal-600" />
              <span>Direct Bookings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-brand-coral-400" />
              <span>Callback Enquiries</span>
            </div>
          </div>
        </div>

        {/* Section 2: Callback Resolution Efficiency */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div>
              <h2 className="text-sm font-bold text-brand-navy-900 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-brand-coral-500" />
                Callback Conversion & Resolution
              </h2>
              <p className="text-xs text-brand-slate-500">Patient inquiry response speed and booking conversion rate</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-brand-slate-50 border border-brand-slate-200 space-y-1">
              <span className="text-[11px] text-brand-slate-500 font-medium">Avg Response Speed</span>
              <p className="text-2xl font-black text-brand-navy-900">18 Mins</p>
              <p className="text-[10px] text-brand-green-700 font-bold">Target: Under 30 mins</p>
            </div>

            <div className="p-4 rounded-xl bg-brand-green-50 border border-brand-green-200 space-y-1">
              <span className="text-[11px] text-brand-green-800 font-medium">Converted to Bookings</span>
              <p className="text-2xl font-black text-brand-green-800">76.0%</p>
              <p className="text-[10px] text-brand-green-700 font-bold">+4.2% vs industry average</p>
            </div>

            <div className="p-4 rounded-xl bg-brand-slate-50 border border-brand-slate-200 space-y-1">
              <span className="text-[11px] text-brand-slate-500 font-medium">Closed Without Booking</span>
              <p className="text-2xl font-black text-brand-slate-700">14.0%</p>
              <p className="text-[10px] text-brand-slate-400">Information inquiries</p>
            </div>

            <div className="p-4 rounded-xl bg-brand-coral-50 border border-brand-coral-200 space-y-1">
              <span className="text-[11px] text-brand-coral-800 font-medium">Pending Callbacks</span>
              <p className="text-2xl font-black text-brand-coral-700">10.0%</p>
              <p className="text-[10px] text-brand-coral-600 font-bold">Awaiting patient follow-up</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Centre Performance Rankings & Most Requested Services */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Centre Performance Table */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-brand-navy-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-green-700" />
              Centre Performance Rankings
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-slate-700">
              <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Centre Name</th>
                  <th className="py-2.5 px-4">City</th>
                  <th className="py-2.5 px-4">Bookings</th>
                  <th className="py-2.5 px-4">Rating</th>
                  <th className="py-2.5 px-4">Est. Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100 font-medium">
                {reportData.centrePerformance.map((cp, i) => (
                  <tr key={i} className="hover:bg-brand-slate-50/70">
                    <td className="py-3 px-4 font-bold text-brand-navy-900">{cp.name}</td>
                    <td className="py-3 px-4 text-brand-slate-500">{cp.location}</td>
                    <td className="py-3 px-4 font-bold text-brand-navy-900">{cp.bookings}</td>
                    <td className="py-3 px-4 text-amber-600 font-bold">★ {cp.rating}</td>
                    <td className="py-3 px-4 font-extrabold text-brand-green-700">{cp.revenueEst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Performance Table */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-brand-navy-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-teal-600" />
              Most Requested Ayurveda Services
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-slate-700">
              <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Service Protocol</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Enquiries</th>
                  <th className="py-2.5 px-4">Bookings</th>
                  <th className="py-2.5 px-4">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100 font-medium">
                {reportData.servicePerformance.map((sp, i) => (
                  <tr key={i} className="hover:bg-brand-slate-50/70">
                    <td className="py-3 px-4 font-bold text-brand-navy-900">{sp.service}</td>
                    <td className="py-3 px-4 text-brand-slate-500">{sp.category}</td>
                    <td className="py-3 px-4 text-brand-slate-600">{sp.enquiries}</td>
                    <td className="py-3 px-4 font-bold text-brand-navy-900">{sp.bookings}</td>
                    <td className="py-3 px-4 font-bold text-brand-teal-700">{sp.share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
