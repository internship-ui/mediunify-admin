import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Star,
  UserCheck,
  ShieldCheck,
  Search,
  ExternalLink,
  Layers,
  Crosshair,
  Compass,
  CheckCircle2,
  Calendar,
  Eye,
  Maximize2,
  Minimize2,
  Car,
  Clock,
  Check,
  Building2,
  ChevronRight,
  Filter,
  Sparkles,
  Award,
  ArrowRight,
  Route,
  User,
  Activity
} from 'lucide-react';
import GoogleMapsCanvas from './GoogleMapsCanvas';

// Real-world Haversine distance calculator between GPS points in kilometers
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export default function NurseLocationMap({
  nurses = [],
  serviceRequests = [],
  onSelectNurse,
  onOpenNurseProfile
}) {
  const [selectedPatientId, setSelectedPatientId] = useState(serviceRequests[0]?.id || 'HC1001');
  const [selectedNurseId, setSelectedNurseId] = useState(nurses[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [isExpanded, setIsExpanded] = useState(false);

  const specializations = [
    'All',
    'Wound Care',
    'General Nursing',
    'Elder Care',
    'Post-Surgery Care',
    'Injection & IV Therapy',
    'Vital & Blood Sugar Monitoring',
    'Palliative & Bedridden Care'
  ];

  // Active Patient Request
  const activePatient = useMemo(() => {
    return serviceRequests.find((r) => r.id === selectedPatientId) || serviceRequests[0] || {
      id: 'HC1001',
      patientName: 'Rahul Kumar',
      address: '#42, 5th Main, Jayalakshmipuram, Mysuru',
      serviceRequired: 'Wound Care',
      lat: 12.3225,
      lng: 76.6265
    };
  }, [serviceRequests, selectedPatientId]);

  // Nurses with calculated distance to active patient, sorted by nearest first
  const nursesWithDistance = useMemo(() => {
    const pLat = activePatient.lat || 12.3225;
    const pLng = activePatient.lng || 76.6265;

    return nurses.map((n) => {
      const dist = calculateDistanceKm(n.lat, n.lng, pLat, pLng);
      // Estimated drive time ~3.2 mins per km in Mysuru traffic
      const etaMins = Math.max(3, Math.round(dist * 3.2));
      const isSkillMatch =
        (activePatient.serviceRequired || activePatient.specializationRequired || '').toLowerCase().includes(n.specialization.toLowerCase()) ||
        n.specialization.toLowerCase().includes((activePatient.specializationRequired || '').toLowerCase());

      return {
        ...n,
        distanceToPatientKm: dist,
        etaMinutes: etaMins,
        isSkillMatch
      };
    }).sort((a, b) => a.distanceToPatientKm - b.distanceToPatientKm);
  }, [nurses, activePatient]);

  // Filtered nurses based on user search & specialization filter
  const filteredNurses = useMemo(() => {
    return nursesWithDistance.filter((n) => {
      const matchesSpec = selectedSpecialization === 'All' || n.specialization === selectedSpecialization;
      const matchesSearch =
        (n.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.specialization || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.locality || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.serviceArea || '').toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSpec && matchesSearch;
    });
  }, [nursesWithDistance, selectedSpecialization, searchQuery]);

  const selectedNurse = useMemo(() => {
    return nursesWithDistance.find((n) => n.id === selectedNurseId) || filteredNurses[0] || nursesWithDistance[0];
  }, [nursesWithDistance, selectedNurseId, filteredNurses]);

  return (
    <div className={`bg-white rounded-3xl border border-gray-300 shadow-md overflow-hidden flex flex-col transition-all font-sans relative ${
      isExpanded ? 'fixed inset-2 sm:inset-4 z-50 shadow-2xl' : 'h-[820px]'
    }`}>
      {/* 1. TOP BAR: APPLIED NURSE LOCATIONS (Google Maps Light Theme) */}
      <div className="p-4 bg-white border-b border-gray-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 flex-shrink-0 z-20">
        {/* Left: Nurse Locations Overview */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-green-50 border border-brand-green-200 flex items-center justify-center text-brand-green-800 shadow-2xs flex-shrink-0">
            <Compass className="w-5 h-5 text-brand-green-700" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-black tracking-wider text-brand-green-800 bg-brand-green-50 px-2 py-0.5 rounded-full border border-brand-green-200">
                Live Nurse Directory
              </span>
              <span className="text-xs font-bold text-gray-900">Applied Nurse Locations on Google Maps</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Visualizing {nurses.length} registered nurse application addresses across Mysuru localities
            </p>
          </div>
        </div>

        {/* Right: Quick Stats & Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>{nurses.filter((n) => n.status === 'Available').length} Available Nurses</strong> Mapped
            </span>
          </div>

          {/* Expand Fullscreen */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition-colors"
            title={isExpanded ? 'Minimize Map' : 'Maximize Fullscreen'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. FILTER & SPECIALIZATION STRIP */}
      <div className="p-3 bg-gray-50/90 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs flex-shrink-0 z-10">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search nurse name, specialization, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 text-gray-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-gray-500 font-bold flex-shrink-0 text-[11px]">Filter Specialization:</span>
          {specializations.slice(0, 5).map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialization(spec)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                selectedSpecialization === spec
                  ? 'bg-brand-green-700 text-white shadow-2xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MAIN AUTHENTIC GOOGLE MAPS CANVAS + CLOSEST NURSES SIDEBAR */}
      <div className="relative flex-1 bg-[#F8FAFC] overflow-hidden flex flex-col lg:flex-row">
        {/* LEAFLET GOOGLE MAPS CANVAS */}
        <div className="flex-1 relative min-h-[350px] lg:min-h-full">
          <GoogleMapsCanvas
            nurses={filteredNurses}
            selectedNurseId={selectedNurse?.id}
            onSelectNurse={(id) => {
              setSelectedNurseId(id);
              if (onSelectNurse) onSelectNurse(id);
            }}
            center={[12.3114, 76.6400]}
            zoom={13}
            className="w-full h-full"
          />
        </div>

        {/* 4. RIGHT SIDEBAR: PROXIMITY DISPATCH ENGINE */}
        <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col h-auto lg:h-full overflow-hidden flex-shrink-0 z-10 shadow-lg">
          {/* Header Card */}
          <div className="p-4 bg-gradient-to-r from-brand-slate-900 via-brand-navy-950 to-brand-green-950 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 block">
                  Proximity Dispatch Engine
                </span>
                <h3 className="font-extrabold text-white text-sm mt-0.5">
                  Closest Nurses to Patient
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                {filteredNurses.length} Mapped
              </span>
            </div>

            {/* Target Patient Capsule */}
            <div className="mt-2.5 p-2.5 bg-white/10 rounded-xl border border-white/15 text-xs text-slate-200">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Patient Destination:</div>
              <div className="font-bold text-white text-xs truncate">{activePatient.patientName} • {activePatient.address}</div>
              <div className="text-[11px] text-emerald-300 font-medium mt-0.5">Needs: {activePatient.serviceRequired}</div>
            </div>
          </div>

          {/* Sorted Nurse List by Distance */}
          <div className="p-3 overflow-y-auto space-y-2.5 flex-1">
            {filteredNurses.map((nurse, idx) => {
              const isNearest = idx === 0;
              const isSelected = selectedNurse?.id === nurse.id;

              return (
                <div
                  key={nurse.id}
                  onClick={() => setSelectedNurseId(nurse.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                      : isNearest
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-sm'
                      : 'bg-white hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  {/* Top Rank Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl font-black flex items-center justify-center text-sm shadow-2xs ${
                        isNearest
                          ? 'bg-emerald-600 text-white'
                          : isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {nurse.name.replace('Nurse ', '')[0]}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm">{nurse.name}</h4>
                          {isNearest && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-600 text-white uppercase">
                              #1 Closest
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-semibold text-brand-green-800">{nurse.specialization}</div>
                      </div>
                    </div>

                    {/* Distance & Travel Time Tag */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-black text-sm text-emerald-800 font-mono">
                        {nurse.distanceToPatientKm} km
                      </div>
                      <div className="text-[10px] font-bold text-gray-500">
                        ETA ~{nurse.etaMinutes} mins
                      </div>
                    </div>
                  </div>

                  {/* Registered Application Address */}
                  <div className="mt-2 text-[11px] text-gray-600 bg-white/80 p-2 rounded-xl border border-gray-200/80 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-gray-900 block truncate">{nurse.address}</span>
                      <span className="text-[10px] text-gray-400 font-mono">App Reg: {nurse.applicationId || 'APP-2026-8801'}</span>
                    </div>
                  </div>

                  {/* Action Strip */}
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <a
                      href={`tel:${nurse.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 font-bold text-gray-700 hover:text-gray-900 text-[11px]"
                    >
                      <Phone className="w-3 h-3 text-brand-green-700" />
                      <span>{nurse.phone}</span>
                    </a>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(nurse.address)}&destination=${encodeURIComponent(activePatient.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-gray-100 text-blue-700 font-bold rounded-lg border border-blue-200 text-[11px] shadow-2xs"
                      >
                        <Route className="w-3 h-3 text-blue-600" />
                        <span>Google Route</span>
                      </a>

                      {onOpenNurseProfile && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenNurseProfile(nurse);
                          }}
                          className="px-2.5 py-1 bg-brand-green-700 hover:bg-brand-green-800 text-white font-bold rounded-lg text-[11px] shadow-2xs"
                        >
                          Profile
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. BOTTOM NURSE SELECTION STRIP */}
      <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 overflow-x-auto text-xs flex-shrink-0 z-20">
        <span className="text-gray-400 text-[11px] font-black uppercase tracking-wider flex-shrink-0 pl-1">
          Applied Nurses By Proximity:
        </span>
        {filteredNurses.map((n, idx) => (
          <button
            key={n.id}
            onClick={() => setSelectedNurseId(n.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 border transition-all flex-shrink-0 ${
              selectedNurse?.id === n.id
                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                : idx === 0
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-black'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <MapPin className={`w-3.5 h-3.5 ${selectedNurse?.id === n.id ? 'text-white' : idx === 0 ? 'text-emerald-700' : 'text-red-500'}`} />
            <span>{n.name}</span>
            <span className={`text-[10px] font-mono font-bold ${selectedNurse?.id === n.id ? 'text-blue-100' : 'text-emerald-700'}`}>
              ({n.distanceToPatientKm} km)
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
