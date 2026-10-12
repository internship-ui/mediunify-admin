import React from 'react';
import {
  Building2,
  ShieldCheck,
  UserCheck,
  CalendarCheck2,
  PhoneCall,
  Sparkles,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Users,
  ChevronRight,
  FileText
} from 'lucide-react';
import StatCard from '../../../components/common/StatCard';
import StatusBadge from '../../../components/common/StatusBadge';

export default function AyurvedaDashboardView({
  centres = [],
  bookings = [],
  callbacks = [],
  services = [],
  practitioners = [],
  onNavigateModule,
  onViewCentre,
  onReviewVerification,
  onViewBooking,
  onViewCallback
}) {
  // Top 8 Summary metrics
  const totalCentresCount = centres.length;
  const activeCentresCount = centres.filter((c) => c.status === 'Active' && c.verificationStatus === 'Verified').length;
  const pendingVerificationCount = centres.filter((c) => c.verificationStatus === 'Pending' || c.verificationStatus === 'Under Review').length;
  const totalPractitionersCount = practitioners.length;
  const upcomingBookingsCount = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending').length;
  const callbackRequestsCount = callbacks.filter((cb) => cb.status === 'New' || cb.status === 'Contacted').length;
  const totalServicesCount = services.length;
  const featuredCentresCount = centres.filter((c) => c.isFeatured).length;

  const recentBookings = bookings.slice(0, 6);
  const recentCallbacks = callbacks.slice(0, 5);
  const pendingCentres = centres.filter((c) => c.verificationStatus === 'Pending' || c.verificationStatus === 'Under Review').slice(0, 4);

  // Popular Services sorted by enquiries / bookings
  const popularServices = [...services]
    .sort((a, b) => ((b.bookingsCount || 0) + (b.enquiriesCount || 0)) - ((a.bookingsCount || 0) + (a.enquiriesCount || 0)))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-navy-900 via-brand-navy-800 to-brand-green-900 rounded-2xl p-6 sm:p-7 text-white shadow-md border border-brand-navy-700/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-green-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green-500/20 text-brand-green-300 border border-brand-green-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ayurveda & Holistic Wellness Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Ayurveda & Wellness
          </h1>
          <p className="text-sm sm:text-base text-brand-slate-300 mt-1 font-normal leading-relaxed">
            Manage Ayurveda centres, services, practitioners, appointments and patient enquiries.
          </p>
        </div>
      </div>

      {/* Top 8 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => onNavigateModule('centres')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="Total Centres"
            value={totalCentresCount}
            subtitle="Registered wellness institutions"
            iconName="Building2"
            colorScheme="navy"
          />
        </div>
        <div onClick={() => onNavigateModule('centres')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="Active Centres"
            value={activeCentresCount}
            subtitle="Currently verified & live"
            iconName="CheckCircle2"
            colorScheme="green"
          />
        </div>
        <div onClick={() => onNavigateModule('verification')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="Pending Verification"
            value={pendingVerificationCount}
            subtitle="Awaiting compliance review"
            iconName="ShieldCheck"
            colorScheme="coral"
          />
        </div>
        <div onClick={() => onNavigateModule('practitioners')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="Total Practitioners"
            value={totalPractitionersCount}
            subtitle="Vaidyas & lead specialists"
            iconName="UserCheck"
            colorScheme="teal"
          />
        </div>
        <div onClick={() => onNavigateModule('bookings')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="Upcoming Bookings"
            value={upcomingBookingsCount}
            subtitle="Confirmed & pending slots"
            iconName="CalendarCheck2"
            colorScheme="teal"
          />
        </div>
        <div onClick={() => onNavigateModule('callbacks')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="Callback Requests"
            value={callbackRequestsCount}
            subtitle="Pending patient enquiries"
            iconName="PhoneCall"
            colorScheme="coral"
          />
        </div>
        <div onClick={() => onNavigateModule('services')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="Services"
            value={totalServicesCount}
            subtitle="Active therapeutic catalog"
            iconName="Sparkles"
            colorScheme="green"
          />
        </div>
        <div onClick={() => onNavigateModule('featured')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="Featured Centres"
            value={featuredCentresCount}
            subtitle="Highlighted in patient app"
            iconName="Award"
            colorScheme="navy"
          />
        </div>
      </div>

      {/* Grid: Recent Bookings & Recent Callback Requests */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Section A: Recent Bookings */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-brand-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-brand-navy-900 flex items-center gap-2">
                <CalendarCheck2 className="w-5 h-5 text-brand-green-600" />
                Recent Bookings
              </h2>
              <p className="text-xs text-brand-slate-500 mt-0.5">Direct and callback scheduled patient appointments</p>
            </div>
            <button
              onClick={() => onNavigateModule('bookings')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green-700 hover:text-brand-green-800 transition-colors"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-slate-700">
              <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Centre</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Practitioner</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100 font-medium">
                {recentBookings.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => onViewBooking && onViewBooking(b)}
                    className="hover:bg-brand-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-brand-navy-900">{b.id}</td>
                    <td className="py-3.5 px-4 text-brand-navy-900 font-semibold">{b.patient}</td>
                    <td className="py-3.5 px-4 text-brand-slate-600 max-w-[140px] truncate">{b.centre}</td>
                    <td className="py-3.5 px-4 text-brand-slate-600 max-w-[150px] truncate">{b.service}</td>
                    <td className="py-3.5 px-4 text-brand-slate-500 truncate">{b.practitioner}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-600">
                      <div>{b.date}</div>
                      <div className="text-[11px] text-brand-slate-400">{b.time}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={b.status} size="xs" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-brand-slate-50 border-t border-brand-slate-100 text-center text-xs text-brand-slate-500">
            Showing latest {recentBookings.length} bookings
          </div>
        </div>

        {/* Section B: Recent Callback Requests */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-brand-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-brand-navy-900 flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-brand-coral-500" />
                Recent Callback Requests
              </h2>
              <p className="text-xs text-brand-slate-500 mt-0.5">Patients requesting consultation assistance</p>
            </div>
            <button
              onClick={() => onNavigateModule('callbacks')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-coral-600 hover:text-brand-coral-700 transition-colors"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-slate-700">
              <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
                <tr>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Centre</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Requested Date</th>
                  <th className="py-3 px-4">Preferred Time</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100 font-medium">
                {recentCallbacks.map((cb) => (
                  <tr
                    key={cb.id}
                    onClick={() => onViewCallback && onViewCallback(cb)}
                    className="hover:bg-brand-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-brand-navy-900">{cb.id}</td>
                    <td className="py-3.5 px-4 text-brand-navy-900 font-semibold">{cb.patient}</td>
                    <td className="py-3.5 px-4 text-brand-slate-600 max-w-[140px] truncate">{cb.centre}</td>
                    <td className="py-3.5 px-4 text-brand-slate-600 max-w-[150px] truncate">{cb.service}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-600">{cb.requestDate}</td>
                    <td className="py-3.5 px-4 text-brand-slate-500 max-w-[130px] truncate">{cb.preferredTime}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={cb.status} size="xs" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-brand-slate-50 border-t border-brand-slate-100 text-center text-xs text-brand-slate-500">
            Showing latest {recentCallbacks.length} callback requests
          </div>
        </div>
      </div>

      {/* Grid: Pending Centre Verification & Popular Services */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Section C: Pending Centre Verification */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div>
              <h2 className="text-base font-bold text-brand-navy-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-coral-500" />
                Pending Centre Verification
              </h2>
              <p className="text-xs text-brand-slate-500 mt-0.5">Centres submitted for AYUSH and clinical registration check</p>
            </div>
            <button
              onClick={() => onNavigateModule('verification')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800"
            >
              Verification Queue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingCentres.length === 0 ? (
              <div className="text-center py-8 text-brand-slate-400 text-xs">
                No centres currently pending verification.
              </div>
            ) : (
              pendingCentres.map((ctr) => (
                <div
                  key={ctr.id}
                  className="p-4 rounded-xl border border-brand-slate-200 bg-brand-slate-50/50 hover:bg-brand-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-brand-navy-900">{ctr.name}</h3>
                      <StatusBadge status={ctr.verificationStatus} size="xs" />
                    </div>
                    <p className="text-xs text-brand-slate-500">
                      {ctr.city}, {ctr.state} • Submitted: {ctr.submittedDate}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-brand-slate-400">
                      <FileText className="w-3 h-3" />
                      <span>{ctr.documents?.length || 0} Documents Uploaded</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReviewVerification && onReviewVerification(ctr)}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg text-white bg-brand-green-600 hover:bg-brand-green-700 transition-colors shadow-xs"
                    >
                      Review Centre
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section D: Popular Services */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div>
              <h2 className="text-base font-bold text-brand-navy-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-teal-600" />
                Popular Services
              </h2>
              <p className="text-xs text-brand-slate-500 mt-0.5">Top performing treatments by patient enquiries & direct bookings</p>
            </div>
            <button
              onClick={() => onNavigateModule('services')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal-700 hover:text-brand-teal-800"
            >
              Services Catalog
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {popularServices.map((srv, idx) => {
              const total = (srv.bookingsCount || 0) + (srv.enquiriesCount || 0);
              const progressPct = Math.min(100, Math.round((total / 550) * 100));

              return (
                <div key={srv.id} className="space-y-1.5 p-3 rounded-xl border border-brand-slate-100 hover:bg-brand-slate-50/60 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-teal-50 text-brand-teal-700 font-bold text-[10px] flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-brand-navy-900 truncate max-w-[220px] sm:max-w-xs">{srv.name}</span>
                    </div>
                    <span className="font-bold text-brand-navy-900">₹{srv.startingPrice}</span>
                  </div>

                  <div className="w-full bg-brand-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-brand-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-brand-slate-500 pt-0.5">
                    <span>{srv.category}</span>
                    <span className="space-x-3">
                      <strong className="text-brand-navy-900">{srv.enquiriesCount || 0}</strong> enquiries • <strong className="text-brand-green-700">{srv.bookingsCount || 0}</strong> bookings
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
