import React from 'react';
import {
  Inbox,
  Clock,
  CheckCircle2,
  UserCheck,
  Activity,
  CheckCircle,
  Users,
  UserX,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  DollarSign,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Layers,
  PhoneCall,
  Send,
  Stethoscope
} from 'lucide-react';

export default function HomeCareOverviewView({
  requests = [],
  nurses = [],
  serviceTypes = [],
  onNavigateModule,
  onOpenRequest,
  onOpenNurse
}) {
  // Compute dashboard metrics
  const newRequestsCount = requests.filter((r) => r.overallStatus === 'New Request').length;
  const paymentPendingCount = requests.filter(
    (r) => r.paymentStatus === 'Pending' || r.paymentStatus === 'Link Sent' || r.overallStatus === 'Patient Contacted' || r.overallStatus === 'Payment Link Sent'
  ).length;
  const paymentCompletedCount = requests.filter(
    (r) => r.paymentStatus === 'Completed' || r.overallStatus === 'Payment Completed'
  ).length;
  const nurseAssignedCount = requests.filter(
    (r) => r.overallStatus === 'Nurse Accepted' || (r.assignedNurse && r.overallStatus !== 'Completed' && r.overallStatus !== 'Cancelled')
  ).length;
  const inProgressCount = requests.filter((r) => r.overallStatus === 'Service In Progress').length;
  const completedCount = requests.filter((r) => r.overallStatus === 'Completed').length;
  const availableNursesCount = nurses.filter((n) => n.status === 'AVAILABLE' && n.accountStatus === 'Active').length;
  const busyNursesCount = nurses.filter((n) => n.status === 'BUSY' || n.status === 'SCHEDULED').length;

  const totalRevenue = requests
    .filter((r) => r.paymentStatus === 'Completed')
    .reduce((sum, r) => sum + (r.serviceAmount || 0), 0);

  // 8 Summary Cards Config
  const summaryCards = [
    {
      title: 'New Requests',
      value: newRequestsCount,
      subtext: 'Awaiting admin review & call',
      icon: Inbox,
      iconColor: 'text-brand-coral-600',
      bgColor: 'bg-brand-coral-50 border-brand-coral-200',
      badgeBg: 'bg-brand-coral-100 text-brand-coral-800',
      targetModule: 'requests',
      targetFilter: 'New Request'
    },
    {
      title: 'Payment Pending',
      value: paymentPendingCount,
      subtext: 'Link sent / awaiting payment',
      icon: Clock,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-200',
      badgeBg: 'bg-amber-100 text-amber-800',
      targetModule: 'requests',
      targetFilter: 'Payment Pending'
    },
    {
      title: 'Payment Completed',
      value: paymentCompletedCount,
      subtext: 'Verified & auto-notifying',
      icon: CheckCircle2,
      iconColor: 'text-brand-teal-600',
      bgColor: 'bg-brand-teal-50 border-brand-teal-200',
      badgeBg: 'bg-brand-teal-100 text-brand-teal-800',
      targetModule: 'requests',
      targetFilter: 'Payment Completed'
    },
    {
      title: 'Nurse Assigned',
      value: nurseAssignedCount,
      subtext: 'Accepted & scheduled visits',
      icon: UserCheck,
      iconColor: 'text-brand-navy-600',
      bgColor: 'bg-brand-navy-50 border-brand-navy-200',
      badgeBg: 'bg-brand-navy-100 text-brand-navy-800',
      targetModule: 'requests',
      targetFilter: 'Nurse Accepted'
    },
    {
      title: 'In Progress',
      value: inProgressCount,
      subtext: 'Nurses currently at patient home',
      icon: Activity,
      iconColor: 'text-brand-aqua-600',
      bgColor: 'bg-brand-aqua-50 border-brand-aqua-200',
      badgeBg: 'bg-brand-aqua-100 text-brand-aqua-800',
      targetModule: 'requests',
      targetFilter: 'Service In Progress'
    },
    {
      title: 'Completed',
      value: completedCount,
      subtext: 'Visits successfully finished',
      icon: CheckCircle,
      iconColor: 'text-brand-green-600',
      bgColor: 'bg-brand-green-50 border-brand-green-200',
      badgeBg: 'bg-brand-green-100 text-brand-green-800',
      targetModule: 'requests',
      targetFilter: 'Completed'
    },
    {
      title: 'Available Nurses',
      value: availableNursesCount,
      subtext: 'Ready for auto-matching pool',
      icon: Users,
      iconColor: 'text-brand-teal-600',
      bgColor: 'bg-brand-teal-50 border-brand-teal-200',
      badgeBg: 'bg-brand-teal-100 text-brand-teal-800',
      targetModule: 'nurses',
      targetFilter: 'AVAILABLE'
    },
    {
      title: 'Busy Nurses',
      value: busyNursesCount,
      subtext: 'On-duty or future scheduled',
      icon: UserX,
      iconColor: 'text-brand-slate-600',
      bgColor: 'bg-brand-slate-100 border-brand-slate-200',
      badgeBg: 'bg-brand-slate-200 text-brand-slate-800',
      targetModule: 'nurses',
      targetFilter: 'BUSY'
    }
  ];

  // Filter requests requiring attention
  const pendingActionRequests = requests.filter(
    (r) => r.overallStatus === 'New Request' || r.overallStatus === 'Patient Contacted' || r.overallStatus === 'Payment Completed'
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-navy-900 via-brand-navy-800 to-brand-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-brand-teal-500/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-teal-500/20 text-brand-teal-200 border border-brand-teal-400/30">
                MediUnify Operations Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-white/90">
                Mysuru Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Home Care & Nursing
            </h1>
            <p className="mt-1 text-sm sm:text-base text-brand-slate-300 max-w-2xl">
              Monitor home care requests, payments, nurses and service activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateModule('requests')}
              className="px-4 py-2.5 rounded-xl bg-brand-teal-500 hover:bg-brand-teal-400 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Inbox className="w-4 h-4" />
              <span>View All Requests ({requests.length})</span>
            </button>
            <button
              onClick={() => onNavigateModule('nurse-map')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <MapPin className="w-4 h-4 text-brand-aqua-300" />
              <span>Nurse Map</span>
            </button>
          </div>
        </div>

        {/* Business Flow Infobar */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-[11px]">
          <div className="bg-white/10 rounded-lg p-2 backdrop-blur-xs">
            <span className="text-white/60 block text-[10px]">Step 1</span>
            <span className="font-semibold text-white">Request Created</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2 backdrop-blur-xs">
            <span className="text-white/60 block text-[10px]">Step 2</span>
            <span className="font-semibold text-white">Admin Calls</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2 backdrop-blur-xs">
            <span className="text-white/60 block text-[10px]">Step 3</span>
            <span className="font-semibold text-white">Payment Sent</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2 backdrop-blur-xs border border-brand-teal-400/40 bg-brand-teal-500/20">
            <span className="text-brand-teal-300 block text-[10px]">Step 4</span>
            <span className="font-bold text-white">Payment Paid</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2 backdrop-blur-xs">
            <span className="text-white/60 block text-[10px]">Step 5 (Auto)</span>
            <span className="font-semibold text-brand-aqua-200">Nurses Notified</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2 backdrop-blur-xs">
            <span className="text-white/60 block text-[10px]">Step 6</span>
            <span className="font-semibold text-brand-green-300">Nurse Accepts</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2 backdrop-blur-xs">
            <span className="text-white/60 block text-[10px]">Step 7</span>
            <span className="font-semibold text-emerald-300">Visit Completed</span>
          </div>
        </div>
      </div>

      {/* 8 Summary Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-slate-600">
            Operations Summary
          </h2>
          <span className="text-xs text-brand-slate-500">
            Total Revenue Collected: <span className="font-bold text-brand-teal-700">₹{totalRevenue.toLocaleString('en-IN')}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigateModule(card.targetModule, card.targetFilter)}
                className="bg-white rounded-xl border border-brand-slate-200 p-5 shadow-xs hover:shadow-md hover:border-brand-teal-300 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl border ${card.bgColor}`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${card.badgeBg}`}>
                    {card.title}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-brand-slate-900 tracking-tight">
                      {card.value}
                    </span>
                  </div>
                  <p className="text-xs text-brand-slate-500 mt-1">{card.subtext}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-brand-slate-100 flex items-center justify-between text-[11px] font-semibold text-brand-teal-700 group-hover:text-brand-teal-800">
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Action Required Requests & Live Registered Nurses Map Teaser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Action Required Requests */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-slate-200 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-brand-slate-100">
              <div>
                <h3 className="text-base font-bold text-brand-slate-900 flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-brand-teal-600" />
                  Requests Requiring Admin Attention
                </h3>
                <p className="text-xs text-brand-slate-500 mt-0.5">
                  Confirm service with patient or broadcast to eligible nurses
                </p>
              </div>
              <button
                onClick={() => onNavigateModule('requests')}
                className="text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800 flex items-center gap-1 cursor-pointer"
              >
                <span>All Requests</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Requests List */}
            <div className="divide-y divide-brand-slate-100 mt-2">
              {pendingActionRequests.length === 0 ? (
                <div className="py-8 text-center text-brand-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-brand-green-500 mx-auto mb-2" />
                  All home care requests have been contacted and processed.
                </div>
              ) : (
                pendingActionRequests.slice(0, 5).map((req) => (
                  <div
                    key={req.id}
                    onClick={() => onOpenRequest(req.id)}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-brand-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-teal-50 border border-brand-teal-200 flex items-center justify-center flex-shrink-0 text-brand-teal-700 font-bold text-xs">
                        {req.id.replace('HCN-', '#')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-brand-slate-900">{req.patientName}</span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200">
                            {req.serviceRequired}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-brand-slate-500 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-brand-slate-400" />
                            {req.locality}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-brand-slate-400" />
                            {req.requestedDate}, {req.requestedTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:self-center">
                      <div className="text-right">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            req.overallStatus === 'New Request'
                              ? 'bg-brand-coral-50 text-brand-coral-700 border-brand-coral-200'
                              : req.overallStatus === 'Patient Contacted'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-brand-teal-50 text-brand-teal-700 border-brand-teal-200'
                          }`}
                        >
                          {req.overallStatus}
                        </span>
                        <p className="text-[11px] text-brand-slate-500 font-semibold mt-0.5">₹{req.serviceAmount}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-brand-slate-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-brand-slate-100 bg-brand-slate-50 p-3 rounded-xl flex items-center justify-between text-xs text-brand-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-brand-teal-600" />
              Automatic nurse assignment triggers instantly when payment is confirmed.
            </span>
            <button
              onClick={() => onNavigateModule('requests')}
              className="text-xs font-bold text-brand-teal-700 hover:underline"
            >
              Open Requests Table
            </button>
          </div>
        </div>

        {/* Right 1 Col: Registered Nurses Pool Summary */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-brand-slate-100">
              <div>
                <h3 className="text-base font-bold text-brand-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-teal-600" />
                  Nurse Network ({nurses.length})
                </h3>
                <p className="text-xs text-brand-slate-500 mt-0.5">
                  Mysuru registered home-visit nurses
                </p>
              </div>
              <button
                onClick={() => onNavigateModule('nurse-map')}
                className="text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Open Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {nurses.slice(0, 4).map((nurse) => (
                <div
                  key={nurse.id}
                  onClick={() => onOpenNurse(nurse.id)}
                  className="p-3 rounded-xl border border-brand-slate-200 hover:border-brand-teal-300 hover:bg-brand-teal-50/30 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-teal-100 text-brand-teal-800 font-bold text-xs flex items-center justify-center border border-brand-teal-200">
                      {nurse.name.split(' ')[1]?.[0] || 'N'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-slate-900">{nurse.name}</p>
                      <p className="text-[11px] text-brand-slate-500 truncate max-w-[140px]">
                        {nurse.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        nurse.status === 'AVAILABLE'
                          ? 'bg-brand-green-100 text-brand-green-800'
                          : nurse.status === 'BUSY'
                          ? 'bg-amber-100 text-amber-800'
                          : nurse.status === 'SCHEDULED'
                          ? 'bg-brand-navy-100 text-brand-navy-800'
                          : 'bg-brand-slate-100 text-brand-slate-600'
                      }`}
                    >
                      {nurse.status}
                    </span>
                    <p className="text-[10px] text-brand-slate-400 mt-0.5">{nurse.locality}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-brand-slate-100">
            <button
              onClick={() => onNavigateModule('nurses')}
              className="w-full py-2 rounded-xl bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage All Registered Nurses</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
