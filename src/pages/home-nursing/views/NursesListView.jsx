import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  Phone,
  Star,
  MapPin,
  CheckCircle2,
  Calendar,
  Building2,
  Activity,
  Plus,
  X,
  Award,
  Clock,
  ShieldCheck,
  Check,
  Compass,
  LayoutGrid,
  FileSpreadsheet,
  Eye,
  ExternalLink,
  Navigation,
  Layers
} from 'lucide-react';
import NurseLocationMap from '../components/NurseLocationMap';
import NurseDetailsModal from '../components/NurseDetailsModal';

export default function NursesListView({
  nurses = [],
  serviceRequests = [],
  onOnboardNurse,
  onUpdateNurseStatus
}) {
  const [activeViewMode, setActiveViewMode] = useState('map'); // 'map' | 'roster' | 'applications'
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [selectedNurseForModal, setSelectedNurseForModal] = useState(null);

  // Form State for Onboarding / Application
  const [formData, setFormData] = useState({
    name: '',
    specialization: 'General Nursing',
    qualification: 'B.Sc Nursing',
    registrationNo: 'KNC-',
    phone: '+91 ',
    appLoginEmail: '',
    experience: '4 Years',
    street: '#12, 1st Cross',
    locality: 'Jayalakshmipuram',
    landmark: 'Near Main Circle',
    city: 'Mysuru',
    state: 'Karnataka',
    pincode: '570012',
    coverageRadiusKm: 6,
    lat: 12.3214,
    lng: 76.6278,
    status: 'Available'
  });

  const [formErrors, setFormErrors] = useState({});

  const specializations = [
    'All',
    'Wound Care',
    'General Nursing',
    'Elder Care',
    'Post-Surgery Care',
    'Injection & IV Therapy',
    'Vital & Blood Sugar Monitoring',
    'Palliative & Bedridden Care',
    'Critical Care & ICU',
    'Maternal & Neonatal Care',
    'Physiotherapy & Rehabilitation'
  ];

  const qualificationsList = [
    'B.Sc Nursing',
    'GNM (General Nursing & Midwifery)',
    'M.Sc Nursing (Critical Care)',
    'M.Sc Nursing (Geriatric Care)',
    'Post-Basic B.Sc Nursing',
    'Certified Wound Care Specialist',
    'Certified Infusion & IV Therapy Nurse'
  ];

  const localitiesMysore = [
    { name: 'Jayalakshmipuram', lat: 12.3214, lng: 76.6278, pincode: '570012' },
    { name: 'Kuvempunagar', lat: 12.2890, lng: 76.6240, pincode: '570023' },
    { name: 'Saraswathipuram', lat: 12.3025, lng: 76.6345, pincode: '570009' },
    { name: 'Gokulam', lat: 12.3350, lng: 76.6290, pincode: '570002' },
    { name: 'Vijayanagar', lat: 12.3395, lng: 76.6020, pincode: '570017' },
    { name: 'Ramakrishnanagar', lat: 12.2780, lng: 76.6150, pincode: '570022' },
    { name: 'Siddhartha Layout', lat: 12.3050, lng: 76.6820, pincode: '570011' },
    { name: 'Hebbal', lat: 12.3510, lng: 76.6110, pincode: '570016' }
  ];

  const filteredNurses = nurses.filter((n) => {
    const matchesSpec = specializationFilter === 'All' || n.specialization === specializationFilter;
    const matchesStatus = statusFilter === 'All' || n.status === statusFilter;
    const matchesSearch =
      (n.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.specialization || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.locality || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.serviceArea || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.qualification || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.applicationId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.phone || '').includes(searchQuery);

    return matchesSpec && matchesStatus && matchesSearch;
  });

  const availableCount = nurses.filter((n) => n.status === 'Available').length;

  const handleOpenModal = () => {
    setFormData({
      name: '',
      specialization: 'General Nursing',
      qualification: 'B.Sc Nursing',
      registrationNo: `KNC-${Math.floor(10000 + Math.random() * 90000)}`,
      phone: '+91 ',
      appLoginEmail: '',
      experience: '4 Years',
      street: '#14, 2nd Main Road',
      locality: 'Jayalakshmipuram',
      landmark: 'Near Post Office',
      city: 'Mysuru',
      state: 'Karnataka',
      pincode: '570012',
      coverageRadiusKm: 6,
      lat: 12.3214,
      lng: 76.6278,
      status: 'Available'
    });
    setFormErrors({});
    setIsOnboardingModalOpen(true);
  };

  const handleLocalityChange = (e) => {
    const locName = e.target.value;
    const matched = localitiesMysore.find((l) => l.name === locName);
    setFormData({
      ...formData,
      locality: locName,
      lat: matched ? matched.lat : formData.lat,
      lng: matched ? matched.lng : formData.lng,
      pincode: matched ? matched.pincode : formData.pincode
    });
  };

  const handleCloseModal = () => {
    setIsOnboardingModalOpen(false);
    setFormErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Nurse name is required';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      errors.phone = 'Valid phone number is required';
    }
    if (!formData.street.trim()) {
      errors.street = 'Street address is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    let formattedName = formData.name.trim();
    if (!formattedName.toLowerCase().startsWith('nurse')) {
      formattedName = `Nurse ${formattedName}`;
    }

    const fullAddress = `${formData.street}, ${formData.locality}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
    const generatedAppId = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedEmail = formData.appLoginEmail.trim() || `${formattedName.toLowerCase().replace(/[^a-z]/g, '')}@mediunify.care`;

    if (onOnboardNurse) {
      onOnboardNurse({
        ...formData,
        id: `NURSE-00${nurses.length + 1}`,
        name: formattedName,
        applicationId: generatedAppId,
        appliedDate: 'Today, Just Now',
        appLoginEmail: generatedEmail,
        address: fullAddress,
        serviceArea: `${formData.locality}, ${formData.city}`,
        rating: 5.0,
        completedVisits: 0,
        applicationStatus: 'Verified & Active',
        verifiedDocuments: ['Aadhaar Card', 'KNC Registration Card', 'Nursing Degree Certificate']
      });
    }

    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <UserCheck className="w-7 h-7 text-brand-green-700" />
              Home Care Nurses & Address Map
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-green-100 text-brand-green-800 border border-brand-green-200">
              {nurses.length} Total Registered
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Nurses apply via the mobile app with their home/operating address, plotted onto the geographic coverage map.
          </p>
        </div>

        {/* View Switcher & Action Button */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* View Mode Tabs */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold text-gray-600">
            <button
              onClick={() => setActiveViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeViewMode === 'map'
                  ? 'bg-white text-brand-green-800 shadow-xs'
                  : 'hover:text-gray-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-brand-green-700" />
              <span>Live Address Map</span>
            </button>
            <button
              onClick={() => setActiveViewMode('roster')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeViewMode === 'roster'
                  ? 'bg-white text-brand-green-800 shadow-xs'
                  : 'hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-brand-green-700" />
              <span>Directory Cards</span>
            </button>
            <button
              onClick={() => setActiveViewMode('applications')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeViewMode === 'applications'
                  ? 'bg-white text-brand-green-800 shadow-xs'
                  : 'hover:text-gray-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-brand-green-700" />
              <span>Application Submissions</span>
            </button>
          </div>

          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green-700 hover:bg-brand-green-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Nurse / Application</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: LIVE ADDRESS MAP */}
      {activeViewMode === 'map' && (
        <NurseLocationMap
          nurses={nurses}
          serviceRequests={serviceRequests}
          onOpenNurseProfile={(nurse) => setSelectedNurseForModal(nurse)}
        />
      )}

      {/* VIEW 2: DIRECTORY CARDS */}
      {activeViewMode === 'roster' && (
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search nurse name, specialization, address, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs text-gray-500 font-medium hidden md:inline">
                <strong className="text-emerald-700">{availableCount}</strong> Available
              </span>
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold focus:outline-none"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredNurses.map((nurse) => (
              <div
                key={nurse.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-brand-green-100 text-brand-green-800 font-black flex items-center justify-center text-sm border border-brand-green-200">
                        {nurse.name.replace('Nurse ', '')[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{nurse.name}</h3>
                        <div className="text-xs font-semibold text-brand-green-800">{nurse.specialization}</div>
                      </div>
                    </div>

                    {/* Status Select */}
                    <select
                      value={nurse.status}
                      onChange={(e) => onUpdateNurseStatus && onUpdateNurseStatus(nurse.id, e.target.value)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer focus:outline-none ${
                        nurse.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : nurse.status === 'On Duty'
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : 'bg-amber-50 text-amber-700 border-amber-300'
                      }`}
                    >
                      <option value="Available">Available</option>
                      <option value="On Duty">On Duty</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>

                  {/* Registered Application Address Box */}
                  <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/80 space-y-1.5 text-xs text-gray-700">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                          Application Address
                        </span>
                        <span className="font-semibold text-gray-900 block">{nurse.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Qualifications */}
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-brand-green-700 flex-shrink-0" />
                      <span>{nurse.phone}</span>
                    </div>
                    <div><span className="text-gray-400">Qualification:</span> <strong className="text-gray-800">{nurse.qualification}</strong></div>
                    <div><span className="text-gray-400">Reg No:</span> <span className="font-mono font-bold text-gray-800">{nurse.registrationNo || 'KNC-88214'}</span></div>
                    <div><span className="text-gray-400">Experience:</span> <span className="text-gray-800">{nurse.experience}</span></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1 font-bold text-gray-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{nurse.rating || 5.0}</span>
                    <span className="text-gray-400 text-[10px] font-normal">({nurse.completedVisits || 0} visits)</span>
                  </div>

                  <button
                    onClick={() => setSelectedNurseForModal(nurse)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-green-700 hover:text-brand-green-800 bg-brand-green-50 px-2.5 py-1 rounded-lg border border-brand-green-200 transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>View Address & Map</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: NURSE APPLICATION SUBMISSIONS TABLE */}
      {activeViewMode === 'applications' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Nurse App Application Submissions</h3>
              <p className="text-xs text-gray-500">Log of incoming nurse registrations, verified address details, and credentials</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">App ID / Submitted</th>
                  <th className="p-3.5">Nurse Details</th>
                  <th className="p-3.5">Specialization & Qualification</th>
                  <th className="p-3.5">Registered Address on Map</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredNurses.map((nurse) => (
                  <tr key={nurse.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-gray-900 block">{nurse.applicationId || 'APP-2026-8801'}</span>
                      <span className="text-[10px] text-gray-400">{nurse.appliedDate || '14 Sep 2026'}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-gray-900 block">{nurse.name}</span>
                      <span className="text-gray-500 text-[11px]">{nurse.phone}</span>
                      <span className="text-gray-400 text-[10px] block">{nurse.appLoginEmail || `${nurse.name.toLowerCase().replace(/[^a-z]/g, '')}@mediunify.care`}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-brand-green-800 block">{nurse.specialization}</span>
                      <span className="text-gray-500 text-[11px]">{nurse.qualification}</span>
                      <span className="text-[10px] text-gray-400 font-mono block">Reg: {nurse.registrationNo || 'KNC-88214'}</span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-gray-900 block">{nurse.address}</span>
                          <span className="text-[10px] font-mono text-gray-400">
                            {nurse.lat?.toFixed(4)}° N, {nurse.lng?.toFixed(4)}° E • {nurse.coverageRadiusKm || 6} km radius
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {nurse.applicationStatus || 'Verified & Active'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedNurseForModal(nurse)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-green-50 hover:bg-brand-green-100 text-brand-green-800 rounded-lg text-xs font-bold border border-brand-green-200 transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Map & Profile</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ONBOARD NEW NURSE / NURSE APPLICATION FORM MODAL */}
      {isOnboardingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-brand-slate-900 via-brand-navy-900 to-brand-green-950 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand-green-500/20 text-brand-green-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Nurse Onboarding & Address Registration</h2>
                  <p className="text-xs text-brand-slate-300">Enter nurse applicant details and registered address to plot on map</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Nurse Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shilpa M or Nurse Shilpa"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 ${
                      formErrors.name
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-brand-green-600 focus:ring-brand-green-600/20'
                    }`}
                  />
                  {formErrors.name && <p className="text-red-500 text-[11px] mt-0.5">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98450 11223"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 ${
                      formErrors.phone
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-brand-green-600 focus:ring-brand-green-600/20'
                    }`}
                  />
                  {formErrors.phone && <p className="text-red-500 text-[11px] mt-0.5">{formErrors.phone}</p>}
                </div>
              </div>

              {/* Specialization & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold focus:outline-none focus:border-brand-green-600"
                  >
                    {specializations.filter(s => s !== 'All').map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Clinical Qualification
                  </label>
                  <select
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold focus:outline-none focus:border-brand-green-600"
                  >
                    {qualificationsList.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ADDRESS SECTION (Crucial for Map Rendering) */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Nurse Application Address (For Map Plotting)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Locality / Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.locality}
                      onChange={handleLocalityChange}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold focus:outline-none focus:border-brand-green-600"
                    >
                      {localitiesMysore.map((loc) => (
                        <option key={loc.name} value={loc.name}>{loc.name} (Pin: {loc.pincode})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Street / House No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. #42, 5th Cross, 3rd Main"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-brand-green-600"
                    />
                    {formErrors.street && <p className="text-red-500 text-[11px] mt-0.5">{formErrors.street}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Landmark</label>
                    <input
                      type="text"
                      placeholder="e.g. Near Kalidasa Circle"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-brand-green-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-brand-green-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Postal Pincode</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-brand-green-600"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center justify-between">
                  <span>GPS Map Point: <strong>{formData.lat?.toFixed(4)}° N, {formData.lng?.toFixed(4)}° E</strong></span>
                  <span className="font-bold text-emerald-700">Auto-mapped to {formData.locality}</span>
                </div>
              </div>

              {/* Council Reg & Login Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Nursing Council Reg #
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNo}
                    onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-brand-green-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    App Login Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="nurse.app@mediunify.care"
                    value={formData.appLoginEmail}
                    onChange={(e) => setFormData({ ...formData, appLoginEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-brand-green-600"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-green-700 hover:bg-brand-green-800 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Register & Plot on Map</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NURSE PROFILE & MAP MODAL */}
      <NurseDetailsModal
        isOpen={Boolean(selectedNurseForModal)}
        onClose={() => setSelectedNurseForModal(null)}
        nurse={selectedNurseForModal}
        onUpdateStatus={(nurseId, newStatus) => {
          if (onUpdateNurseStatus) onUpdateNurseStatus(nurseId, newStatus);
          setSelectedNurseForModal((prev) => prev ? { ...prev, status: newStatus } : null);
        }}
      />
    </div>
  );
}
