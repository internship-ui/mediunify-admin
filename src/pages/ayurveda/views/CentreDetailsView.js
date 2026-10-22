import React, { useState } from 'react';
import {
  Building2,
  ChevronLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  Award,
  Sparkles,
  UserCheck,
  Tag,
  CalendarCheck2,
  FileText,
  ShieldCheck,
  Edit3,
  Power,
  ExternalLink,
  Download,
  Plus
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function CentreDetailsView({
  centre,
  services = [],
  practitioners = [],
  consultationPricing = [],
  therapyPricing = [],
  packages = [],
  bookings = [],
  reviews = [],
  onBack,
  onEditCentre,
  onToggleFeature,
  onToggleStatus,
  onViewBooking
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!centre) {
    return (
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-12 text-center space-y-3">
        <Building2 className="w-10 h-10 text-brand-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-brand-navy-900">Centre Not Found</h3>
        <p className="text-xs text-brand-slate-500">The requested Ayurveda centre profile does not exist.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand-green-600 rounded-xl"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Centres
        </button>
      </div>
    );
  }

  // Filter centre-specific data
  const centreServices = services.filter((s) => s.centreId === centre.id || s.centreName === centre.name);
  const centrePractitioners = practitioners.filter((p) => p.centreId === centre.id || p.centreName === centre.name);
  const centreConsultPricing = consultationPricing.filter((c) => c.centre === centre.name);
  const centreTherapyPricing = therapyPricing.filter((t) => t.centre === centre.name);
  const centrePackages = packages.filter((pkg) => pkg.centreId === centre.id || pkg.centre === centre.name);
  const centreBookings = bookings.filter((b) => b.centreId === centre.id || b.centre === centre.name);
  const centreReviews = reviews.filter((r) => r.centreId === centre.id || r.centre === centre.name);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-slate-600 hover:text-brand-navy-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Ayurveda Centres</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFeature && onToggleFeature(centre)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
              centre.isFeatured
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-white text-brand-slate-600 border-brand-slate-200 hover:bg-brand-slate-50'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>{centre.isFeatured ? 'Featured Centre' : 'Mark as Featured'}</span>
          </button>

          <button
            onClick={() => onEditCentre && onEditCentre(centre)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl transition-colors shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Centre Header Card */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={centre.logo || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=150&auto=format&fit=crop&q=80'}
              alt={centre.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-brand-slate-200 shadow-xs flex-shrink-0"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-brand-navy-900">{centre.name}</h1>
                <StatusBadge status={centre.verificationStatus} size="xs" />
                <StatusBadge status={centre.status} size="xs" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-brand-slate-500">{centre.tagline || centre.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-brand-slate-500 pt-1">
                <div className="flex items-center gap-1 text-brand-navy-900 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-brand-green-700" />
                  <span>{centre.city}, {centre.state}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-brand-slate-400" />
                  <span>{centre.contactNumber}</span>
                </div>
                {centre.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-brand-slate-400" />
                    <span>{centre.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-brand-navy-900">{centre.rating > 0 ? centre.rating.toFixed(1) : 'New'}</span>
                  <span className="text-brand-slate-400">({centre.reviewsCount || 0} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-brand-slate-100 pt-4">
          {[
            { id: 'overview', label: 'Overview', icon: Building2 },
            { id: 'services', label: `Services (${centreServices.length})`, icon: Sparkles },
            { id: 'practitioners', label: `Practitioners (${centrePractitioners.length})`, icon: UserCheck },
            { id: 'pricing', label: 'Pricing & Packages', icon: Tag },
            { id: 'bookings', label: `Bookings (${centreBookings.length})`, icon: CalendarCheck2 },
            { id: 'reviews', label: `Reviews (${centreReviews.length})`, icon: Star },
            { id: 'documents', label: `Documents (${centre.documents?.length || 0})`, icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-brand-green-600 text-white shadow-xs'
                    : 'text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* About Box */}
            <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-brand-navy-900">About the Centre</h2>
              <p className="text-xs text-brand-slate-600 leading-relaxed">{centre.description}</p>
              
              {centre.images && centre.images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {centre.images.map((imgUrl, i) => (
                    <img
                      key={i}
                      src={imgUrl}
                      alt="Facility photo"
                      className="w-full h-40 rounded-xl object-cover border border-brand-slate-200"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Address & Coordinates */}
            <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-brand-navy-900">Location & Coordinates</h2>
              <div className="text-xs text-brand-slate-700 space-y-1">
                <p><span className="font-semibold text-brand-slate-400">Street Address:</span> {centre.address}</p>
                <p><span className="font-semibold text-brand-slate-400">City, State & PIN:</span> {centre.city}, {centre.state} - {centre.pincode}</p>
                <p><span className="font-semibold text-brand-slate-400">Geo Coordinates:</span> Lat {centre.latitude || '12.3168'}, Long {centre.longitude || '76.6345'}</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Operational Parameters */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-brand-navy-900 border-b border-brand-slate-100 pb-2">
                Operational Details
              </h2>
              
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-brand-slate-400 font-medium">Working Hours:</span>
                  <div className="font-bold text-brand-navy-900 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-green-700" />
                    <span>{centre.openingTime} - {centre.closingTime}</span>
                  </div>
                </div>

                <div>
                  <span className="text-brand-slate-400 font-medium">Working Days:</span>
                  <div className="font-bold text-brand-navy-900 mt-0.5">{centre.workingDays}</div>
                </div>

                <div>
                  <span className="text-brand-slate-400 font-medium">Consultation Availability:</span>
                  <div className="mt-0.5">
                    {centre.consultationAvailable ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-green-700 bg-brand-green-50 px-2 py-0.5 rounded border border-brand-green-200">
                        <CheckCircle2 className="w-3 h-3" /> Available
                      </span>
                    ) : (
                      <span className="text-brand-slate-400 font-bold">Unavailable</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-brand-slate-400 font-medium">Therapy Suites Availability:</span>
                  <div className="mt-0.5">
                    {centre.therapyAvailable ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                        <CheckCircle2 className="w-3 h-3" /> Available
                      </span>
                    ) : (
                      <span className="text-brand-slate-400 font-bold">Unavailable</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-brand-slate-400 font-medium">Starting Price:</span>
                  <div className="font-extrabold text-brand-navy-900 text-sm mt-0.5">₹{centre.startingPrice}</div>
                </div>
              </div>
            </div>

            {/* Owner & Compliance Box */}
            <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-sm space-y-3 text-xs">
              <h2 className="text-sm font-bold text-brand-navy-900 border-b border-brand-slate-100 pb-2">
                Ownership & Compliance
              </h2>
              <p><span className="text-brand-slate-400">Owner/Lead:</span> <strong className="text-brand-navy-900">{centre.ownerName || 'Dr. Keshavan Namboothiri'}</strong></p>
              <p><span className="text-brand-slate-400">Owner Contact:</span> <strong className="text-brand-navy-900">{centre.ownerPhone || centre.contactNumber}</strong></p>
              <p><span className="text-brand-slate-400">Submission Date:</span> <span className="text-brand-slate-600">{centre.submittedDate}</span></p>
              <p><span className="text-brand-slate-400">Verified Date:</span> <span className="text-brand-slate-600">{centre.verifiedDate || 'Pending'}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Services */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-brand-navy-900">Services Offered by {centre.name}</h2>
            <span className="text-xs text-brand-slate-500">{centreServices.length} active therapeutic services</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-slate-700">
              <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
                <tr>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100 font-medium">
                {centreServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-brand-slate-400">
                      No services listed for this centre.
                    </td>
                  </tr>
                ) : (
                  centreServices.map((srv) => (
                    <tr key={srv.id} className="hover:bg-brand-slate-50/70">
                      <td className="py-3 px-4">
                        <p className="font-bold text-brand-navy-900">{srv.name}</p>
                        <p className="text-[11px] text-brand-slate-400 truncate max-w-sm">{srv.description}</p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{srv.category}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{srv.duration}</td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-brand-navy-900">₹{srv.startingPrice}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{srv.availability}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={srv.status} size="xs" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Practitioners */}
      {activeTab === 'practitioners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {centrePractitioners.length === 0 ? (
            <div className="col-span-3 bg-white rounded-2xl border border-brand-slate-200 p-8 text-center text-brand-slate-400 text-xs">
              No affiliated practitioners listed.
            </div>
          ) : (
            centrePractitioners.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <img
                      src={doc.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80'}
                      alt={doc.name}
                      className="w-12 h-12 rounded-xl object-cover border border-brand-slate-200"
                    />
                    <StatusBadge status={doc.status} size="xs" />
                  </div>
                  <h3 className="font-bold text-brand-navy-900 text-sm mt-3">{doc.name}</h3>
                  <p className="text-xs text-brand-green-700 font-semibold">{doc.qualification}</p>
                  
                  <div className="mt-2.5 text-xs bg-brand-slate-50 p-2.5 rounded-lg border border-brand-slate-100 space-y-1">
                    <p><span className="text-brand-slate-400">Specialization:</span> {doc.specialization}</p>
                    <p><span className="text-brand-slate-400">Experience:</span> {doc.experience}</p>
                    <p><span className="text-brand-slate-400">Consultation Fee:</span> <strong className="text-brand-navy-900">₹{doc.consultationFee}</strong></p>
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-slate-100 text-[11px] text-brand-slate-500">
                  <span>Available: {doc.availableDays}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Pricing */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          {/* Consultations */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-bold text-brand-navy-900">Consultation Pricing</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-brand-slate-700">
                <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Consultation Type</th>
                    <th className="py-2.5 px-4">Attending Doctor</th>
                    <th className="py-2.5 px-4">Duration</th>
                    <th className="py-2.5 px-4">Fee (₹)</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100">
                  {centreConsultPricing.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-brand-slate-400">Standard consultation ₹{centre.startingPrice} per session.</td>
                    </tr>
                  ) : (
                    centreConsultPricing.map((cp) => (
                      <tr key={cp.id}>
                        <td className="py-2.5 px-4 font-bold text-brand-navy-900">{cp.consultationType}</td>
                        <td className="py-2.5 px-4">{cp.practitioner}</td>
                        <td className="py-2.5 px-4">{cp.duration}</td>
                        <td className="py-2.5 px-4 font-bold text-brand-navy-900">₹{cp.fee}</td>
                        <td className="py-2.5 px-4"><StatusBadge status={cp.status} size="xs" /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Packages */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-bold text-brand-navy-900">Wellness Packages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {centrePackages.length === 0 ? (
                <div className="col-span-2 text-center py-6 text-brand-slate-400 text-xs">
                  No customized packages registered for this centre.
                </div>
              ) : (
                centrePackages.map((pkg) => (
                  <div key={pkg.id} className="p-4 rounded-xl border border-brand-slate-200 bg-brand-slate-50/40 space-y-2">
                    <h3 className="text-xs font-bold text-brand-navy-900">{pkg.name}</h3>
                    <p className="text-[11px] text-brand-slate-500">{pkg.description}</p>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-brand-slate-200/60">
                      <span className="font-extrabold text-brand-green-700 text-sm">₹{pkg.packagePrice.toLocaleString()}</span>
                      <span className="text-brand-slate-500">{pkg.numberOfSessions} Sessions • Validity {pkg.validity}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Bookings */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-brand-navy-900">Bookings for {centre.name}</h2>
            <span className="text-xs text-brand-slate-500">{centreBookings.length} bookings logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-slate-700">
              <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Practitioner</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100 font-medium">
                {centreBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-brand-slate-400">
                      No active bookings for this centre.
                    </td>
                  </tr>
                ) : (
                  centreBookings.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => onViewBooking && onViewBooking(b)}
                      className="hover:bg-brand-slate-50/70 cursor-pointer"
                    >
                      <td className="py-3 px-4 font-bold text-brand-navy-900">{b.id}</td>
                      <td className="py-3 px-4 font-semibold text-brand-navy-900">{b.patient}</td>
                      <td className="py-3 px-4">{b.service}</td>
                      <td className="py-3 px-4 text-brand-slate-500">{b.practitioner}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{b.date} • {b.time}</td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-slate-100 text-brand-slate-700">
                          {b.bookingType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={b.status} size="xs" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Reviews */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <h2 className="text-sm font-bold text-brand-navy-900">Patient Testimonials & Reviews</h2>
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-navy-900">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{centre.rating > 0 ? centre.rating.toFixed(1) : 'New'} / 5.0 Rating</span>
            </div>
          </div>

          <div className="space-y-3">
            {centreReviews.length === 0 ? (
              <div className="text-center py-8 text-brand-slate-400 text-xs">
                No patient reviews submitted yet for this centre.
              </div>
            ) : (
              centreReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl border border-brand-slate-100 bg-brand-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-brand-navy-900">{rev.patient}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      ))}
                      <span className="text-brand-slate-400 text-[11px] ml-1">{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-brand-slate-600 italic">"{rev.review}"</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 7: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
            <div>
              <h2 className="text-sm font-bold text-brand-navy-900">Verification & Legal Accreditation Documents</h2>
              <p className="text-xs text-brand-slate-500">AYUSH licenses, registration papers, and clinical permit submissions</p>
            </div>
            <StatusBadge status={centre.verificationStatus} size="sm" />
          </div>

          <div className="space-y-3">
            {(!centre.documents || centre.documents.length === 0) ? (
              <div className="text-center py-8 text-brand-slate-400 text-xs">
                No legal verification documents uploaded.
              </div>
            ) : (
              centre.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-brand-slate-200 bg-brand-slate-50/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-green-50 text-brand-green-700 flex items-center justify-center font-bold text-xs border border-brand-green-200">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-brand-navy-900">{doc.name}</h3>
                      <p className="text-[11px] text-brand-slate-400">
                        {doc.type} • Uploaded on {doc.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={doc.status || 'Approved'} size="xs" />
                    <button
                      onClick={() => alert(`Viewing document: ${doc.name}`)}
                      className="p-2 text-brand-slate-500 hover:text-brand-navy-900 hover:bg-brand-slate-100 rounded-lg transition-colors"
                      title="Preview Document"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
