import React, { useState, useMemo } from 'react';
import {
  X,
  MapPin,
  UserCheck,
  Phone,
  Star,
  ShieldCheck,
  Calendar,
  Compass,
  CheckCircle2,
  ExternalLink,
  Car,
  Clock,
  Sparkles,
  Route,
  User,
  Activity,
  Search,
  Filter
} from 'lucide-react';
import GoogleMapsCanvas from './GoogleMapsCanvas';
import NurseContactModal from './NurseContactModal';

// Real-world Haversine distance calculator between GPS points in kilometers
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export default function NearbyNursesMapModal({
  isOpen,
  onClose,
  patientRequest,
  nurses = [],
  onConfirmNurse
}) {
  if (!isOpen || !patientRequest) return null;

  const [selectedNurseForContact, setSelectedNurseForContact] = useState(null);
  const [activeNurseId, setActiveNurseId] = useState(nurses[0]?.id || null);
  const [searchFilter, setSearchFilter] = useState('');

  const patientLat = patientRequest.lat || 12.3225;
  const patientLng = patientRequest.lng || 76.6265;

  // Rank nurses by distance to this patient
  const sortedNurses = useMemo(() => {
    return nurses.map((n) => {
      const dist = calculateDistanceKm(n.lat, n.lng, patientLat, patientLng);
      const isConfirmed = patientRequest.confirmedNurses?.some((cn) => cn.nurseId === n.id);
      const isContacted = patientRequest.contactedNurses?.some((cn) => cn.nurseId === n.id);
      return {
        ...n,
        distanceToPatientKm: dist,
        isConfirmed,
        isContacted
      };
    }).sort((a, b) => a.distanceToPatientKm - b.distanceToPatientKm);
  }, [nurses, patientLat, patientLng, patientRequest]);

  const filteredNurses = sortedNurses.filter((n) =>
    (n.name || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (n.specialization || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (n.serviceArea || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (n.address || '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  const activeNurse = sortedNurses.find((n) => n.id === activeNurseId) || sortedNurses[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-brand-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-green-50 border border-brand-green-200 text-brand-green-800 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-gray-900">Nearby Nurses Map for Request #{patientRequest.id}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  Google Maps Live View
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Identify nurses near the patient's home, check distance, call, and record confirmation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Location Banner */}
        <div className="px-6 py-3 bg-rose-50/70 border-b border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-rose-700 block">
                Patient Destination 📍
              </span>
              <span className="font-extrabold text-gray-900 text-xs sm:text-sm">
                {patientRequest.patientName} — {patientRequest.address}
              </span>
              <div className="text-[11px] text-gray-600 font-medium mt-0.5">
                Required Service: <strong className="text-rose-900">{patientRequest.serviceRequired}</strong> • Preferred Schedule: <strong>{patientRequest.preferredDate || '26 Sep'} ({patientRequest.preferredTime || '10:00 AM'})</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">Found:</span>
            <span className="font-black text-emerald-800 bg-white px-2.5 py-1 rounded-xl border border-emerald-300">
              {sortedNurses.filter(n => n.status === 'Available').length} Available Nurses Nearby
            </span>
          </div>
        </div>

        {/* Modal Main Body: Split View (Leaflet Google Maps on Left, Nearby Nurses List on Right) */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row min-h-[480px]">
          {/* AUTHENTIC LEAFLET GOOGLE MAPS CANVAS */}
          <div className="flex-1 relative bg-[#F8FAFC] min-h-[320px] lg:min-h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200">
            <GoogleMapsCanvas
              nurses={filteredNurses}
              selectedNurseId={activeNurseId}
              onSelectNurse={setActiveNurseId}
              center={[patientLat, patientLng]}
              zoom={13}
              className="w-full h-full"
            />
          </div>

          {/* RIGHT SIDEBAR: NEARBY NURSES LIST RANKED BY DISTANCE */}
          <div className="w-full lg:w-96 bg-white flex flex-col h-auto lg:h-full overflow-hidden flex-shrink-0">
            {/* List Header */}
            <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider block">
                  Nearby Nurses List
                </span>
                <span className="font-extrabold text-gray-900 text-xs">
                  Ranked by Distance from Patient
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                {sortedNurses.length} Mapped
              </span>
            </div>

            {/* Nurse List Items */}
            <div className="p-3 overflow-y-auto space-y-2.5 flex-1 max-h-[380px] lg:max-h-full">
              {filteredNurses.map((nurse, idx) => {
                const isClosest = idx === 0;
                const isSelected = activeNurse?.id === nurse.id;

                return (
                  <div
                    key={nurse.id}
                    onClick={() => setActiveNurseId(nurse.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                        : isClosest
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl font-black flex items-center justify-center text-xs ${
                          isClosest
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
                            {isClosest && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-600 text-white uppercase">
                                Closest
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-semibold text-brand-green-800">{nurse.specialization}</div>
                        </div>
                      </div>

                      {/* Distance & Availability */}
                      <div className="text-right">
                        <div className="font-black text-xs sm:text-sm text-emerald-800 font-mono">
                          {nurse.distanceToPatientKm} km
                        </div>
                        <span className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold border inline-block mt-0.5 ${
                          nurse.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {nurse.status}
                        </span>
                      </div>
                    </div>

                    {/* Service Area */}
                    <div className="mt-2 text-[11px] text-gray-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{nurse.address}</span>
                    </div>

                    {/* Step 3 Action Buttons: Call & Confirm */}
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
                      <a
                        href={`tel:${nurse.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-brand-green-700" />
                        <span>Call ({nurse.phone})</span>
                      </a>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNurseForContact(nurse);
                        }}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                          nurse.isConfirmed
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-black'
                            : 'bg-brand-green-700 hover:bg-brand-green-800 text-white'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{nurse.isConfirmed ? 'Confirmed ✓' : 'Call & Confirm'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-gray-500">
            Click on any nurse marker on Google Maps or choose <strong>"Call & Confirm"</strong> to verify availability.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs transition-colors shadow-2xs"
          >
            Close Map
          </button>
        </div>
      </div>

      {/* Step 3: Nurse Contact & Confirmation Modal */}
      {selectedNurseForContact && (
        <NurseContactModal
          isOpen={Boolean(selectedNurseForContact)}
          onClose={() => setSelectedNurseForContact(null)}
          nurse={selectedNurseForContact}
          patient={patientRequest}
          onSaveConfirmation={(contactData) => {
            if (onConfirmNurse) {
              onConfirmNurse(patientRequest.id, contactData);
            }
            setSelectedNurseForContact(null);
          }}
        />
      )}
    </div>
  );
}
