import React, { useState } from 'react';
import {
  HeartHandshake,
  ClipboardList,
  Clock,
  CheckCircle2,
  UserCheck,
  Calendar,
  ArrowRight,
  User,
  MapPin,
  Check,
  Activity,
  AlertCircle,
  CreditCard,
  Send,
  ShieldCheck,
  Eye,
  RotateCcw,
  Compass
} from 'lucide-react';
import StatCard from '../../../components/common/StatCard';
import StatusBadge from '../../../components/common/StatusBadge';

export default function HomeCareDashboardView({
  requests = [],
  nurses = [],
  onNavigateModule,
  onOpenRequest
}) {
  const totalRequestsCount = requests.length;
  const newRequestsCount = requests.filter((r) => r.status === 'New' || r.status === 'New Request' || r.status === 'Accepted').length;
  const nurseConfirmedCount = requests.filter((r) => r.status === 'Payment Link Sent' || r.status === 'Nurse Confirmed' || r.status === 'Nurse Contacted' || r.status === 'Payment Pending').length;
  const paymentSuccessfulCount = requests.filter((r) => r.status === 'Payment Completed' || r.status === 'Payment Successful' || r.paymentStatus === 'Payment Successful' || r.paymentStatus === 'Paid').length;
  const confirmedCount = requests.filter((r) => r.status === 'Nurse Assigned' || r.status === 'Confirmed').length;
  const completedCount = requests.filter((r) => r.status === 'Completed').length;

  const recentRequests = requests.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-teal-700 via-brand-teal-600 to-brand-aqua-600 rounded-2xl p-6 sm:p-7 text-white shadow-md border border-brand-teal-400/30 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs text-xs font-semibold mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Home Care & Nursing Operations Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Home Care Administration
          </h1>
          <p className="text-sm sm:text-base text-teal-50 mt-1 font-normal leading-relaxed">
            Standard workflow: Check patient location on map, call & confirm suitable nurse availability, verify patient online payment, select confirmed nurse, and confirm assignment.
          </p>
        </div>
      </div>

      {/* Summary Cards with Exact Filter Drilldown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Requests -> All */}
        <div onClick={() => onNavigateModule('requests', 'All')} className="cursor-pointer transition-transform hover:-translate-y-0.5" title="View All Requests">
          <StatCard
            title="Total Requests"
            value={totalRequestsCount}
            subtitle="All inbound bookings"
            iconName="ClipboardList"
            colorScheme="navy"
          />
        </div>

        {/* New Requests -> New */}
        <div onClick={() => onNavigateModule('requests', 'New')} className="cursor-pointer transition-transform hover:-translate-y-0.5" title="View New Requests Only">
          <StatCard
            title="New Requests"
            value={newRequestsCount}
            subtitle="Step 1: Inbound"
            iconName="Clock"
            colorScheme="coral"
          />
        </div>

        {/* Nurse Confirmed / Link Sent -> Payment Link Sent */}
        <div onClick={() => onNavigateModule('requests', 'Payment Link Sent')} className="cursor-pointer transition-transform hover:-translate-y-0.5" title="View Nurse Confirmed / Link Sent">
          <StatCard
            title="Nurse Confirmed"
            value={nurseConfirmedCount}
            subtitle="Step 3: Called"
            iconName="Phone"
            colorScheme="teal"
          />
        </div>

        {/* Payment Done -> Payment Completed */}
        <div onClick={() => onNavigateModule('requests', 'Payment Completed')} className="cursor-pointer transition-transform hover:-translate-y-0.5" title="View Paid Requests Only">
          <StatCard
            title="Payment Done"
            value={paymentSuccessfulCount}
            subtitle="Step 4: Paid"
            iconName="CreditCard"
            colorScheme="green"
          />
        </div>

        {/* Confirmed -> Nurse Assigned */}
        <div onClick={() => onNavigateModule('requests', 'Nurse Assigned')} className="cursor-pointer transition-transform hover:-translate-y-0.5" title="View Confirmed Assignments Only">
          <StatCard
            title="Confirmed"
            value={confirmedCount}
            subtitle="Step 6: Assigned"
            iconName="UserCheck"
            colorScheme="teal"
          />
        </div>

        {/* Completed -> Completed */}
        <div onClick={() => onNavigateModule('requests', 'Completed')} className="cursor-pointer transition-transform hover:-translate-y-0.5" title="View Completed Visits Only">
          <StatCard
            title="Completed"
            value={completedCount}
            subtitle="Care fulfilled"
            iconName="CheckCircle2"
            colorScheme="green"
          />
        </div>
      </div>

      {/* Recent Inbound Requests Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200/90 shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-brand-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-brand-navy-950">
              Recent Patient Home Care Inquiries
            </h2>
            <p className="text-xs text-brand-slate-500 mt-0.5">
              Click "View Request" to open the 7-step location check, nurse confirmation, and payment flow
            </p>
          </div>

          <button
            onClick={() => onNavigateModule('requests')}
            className="text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800 inline-flex items-center gap-1"
          >
            <span>View All Requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-700">
            <thead className="bg-brand-slate-50/80 text-[11px] font-extrabold uppercase tracking-wider text-brand-slate-600 border-b border-brand-slate-200">
              <tr>
                <th className="px-4 py-3">Request ID</th>
                <th className="px-4 py-3">Patient Details</th>
                <th className="px-4 py-3">Service Required</th>
                <th className="px-4 py-3">Preferred Schedule</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {recentRequests.map((req) => (
                <tr key={req.id} className="hover:bg-brand-slate-50/70 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-brand-navy-950">
                    #{req.id}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-bold text-brand-slate-900">{req.patientName}</div>
                    <div className="text-[11px] text-brand-slate-500">{req.patientPhone || req.contactNumber}</div>
                    <div className="text-[10px] text-brand-slate-400 truncate max-w-xs">{req.patientLocation || req.address}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-bold text-brand-teal-800 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200 block max-w-max">
                      {req.serviceRequired}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{req.preferredDate || req.requestedDate || '26 Sep 2026'}</div>
                    <div className="text-[10px] text-brand-slate-400">{req.preferredTime || req.requestedTime || '10:00 AM'}</div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      req.paymentStatus === 'Payment Successful'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {req.paymentStatus || 'Payment Pending'} (₹{req.price || 750})
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={req.status} size="xs" />
                  </td>

                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => onOpenRequest && onOpenRequest(req.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-green-700 hover:bg-brand-green-800 text-white font-bold rounded-xl text-xs shadow-2xs transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Request</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
