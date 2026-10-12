import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  Award,
  Layers,
  Sparkles,
  Info,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import L from 'leaflet';

export default function NurseMapView({
  nurses = [],
  requests = [],
  onOpenNurseDetails,
  onOpenRequestDetails
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [selectedNurse, setSelectedNurse] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [specializationFilter, setSpecializationFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPatientRequests, setShowPatientRequests] = useState(true);

  // Filtered nurses
  const filteredNurses = nurses.filter((nurse) => {
    const matchesSearch =
      !searchQuery ||
      nurse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nurse.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nurse.specialization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || nurse.status === statusFilter;
    const matchesSpec = specializationFilter === 'All' || nurse.specialization.includes(specializationFilter);

    return matchesSearch && matchesStatus && matchesSpec;
  });

  // Extract specializations
  const specializations = Array.from(new Set(nurses.map((n) => n.specialization.split('&')[0].trim())));

  // Initialize Leaflet Map centered on Mysuru (12.2958, 76.6394)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [12.3050, 76.6350],
        zoom: 13,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Tiles with nice clean healthcare aesthetic
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    // Helper to get color code
    const getStatusColor = (status) => {
      switch (status) {
        case 'AVAILABLE':
          return '#0D9488'; // Teal
        case 'BUSY':
          return '#F43F5E'; // Coral
        case 'SCHEDULED':
          return '#102A43'; // Navy
        case 'OFFLINE':
        default:
          return '#64748B'; // Slate
      }
    };

    // Add Nurse Markers
    filteredNurses.forEach((nurse) => {
      const color = getStatusColor(nurse.status);
      const customIcon = L.divIcon({
        className: 'nurse-map-marker',
        html: `
          <div style="
            background-color: ${color};
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 11px;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s;
          " class="marker-pin hover:scale-110">
            ${nurse.name.split(' ')[1]?.[0] || 'N'}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([nurse.lat, nurse.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedNurse(nurse);
        setSelectedRequest(null);
      });

      // Simple hover tooltip
      marker.bindTooltip(
        `<strong>${nurse.name}</strong><br/><span style="font-size:11px; color:#555;">${nurse.specialization} (${nurse.status})</span>`,
        { direction: 'top', offset: [0, -10] }
      );

      markersRef.current.push(marker);
    });

    // Add Patient Request Markers (if enabled)
    if (showPatientRequests) {
      requests.forEach((req) => {
        if (req.lat && req.lng) {
          const isCompleted = req.overallStatus === 'Completed';
          const isCancelled = req.overallStatus === 'Cancelled';
          const reqColor = isCompleted ? '#10B981' : isCancelled ? '#94A3B8' : '#06B6D4';

          const reqIcon = L.divIcon({
            className: 'request-map-marker',
            html: `
              <div style="
                background-color: ${reqColor};
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 10px;
                border: 2px solid white;
                box-shadow: 0 3px 8px rgba(0,0,0,0.25);
                cursor: pointer;
              ">
                🏠
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          const reqMarker = L.marker([req.lat, req.lng], { icon: reqIcon }).addTo(map);

          reqMarker.on('click', () => {
            setSelectedRequest(req);
            setSelectedNurse(null);
          });

          reqMarker.bindTooltip(
            `<strong>${req.patientName}</strong><br/><span style="font-size:11px;">${req.serviceRequired} (${req.overallStatus})</span>`,
            { direction: 'top' }
          );

          markersRef.current.push(reqMarker);
        }
      });
    }

    // Adjust bounds if markers exist
    if (filteredNurses.length > 0) {
      const bounds = L.latLngBounds(filteredNurses.map((n) => [n.lat, n.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [filteredNurses, showPatientRequests, requests]);

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-brand-teal-600" />
            Registered Nurse Map
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
            Admin monitoring tool displaying registered home locations, availability status and bookings in Mysuru.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 bg-white px-3 py-2 rounded-xl border border-brand-slate-200 shadow-xs text-xs">
          <span className="flex items-center gap-1.5 font-medium text-brand-slate-700">
            <span className="w-3 h-3 rounded-full bg-brand-teal-600 inline-block" /> Available
          </span>
          <span className="flex items-center gap-1.5 font-medium text-brand-slate-700">
            <span className="w-3 h-3 rounded-full bg-brand-coral-600 inline-block" /> Busy
          </span>
          <span className="flex items-center gap-1.5 font-medium text-brand-slate-700">
            <span className="w-3 h-3 rounded-full bg-brand-navy-700 inline-block" /> Scheduled
          </span>
          <span className="flex items-center gap-1.5 font-medium text-brand-slate-700">
            <span className="w-3 h-3 rounded-full bg-brand-slate-400 inline-block" /> Offline
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-3.5 rounded-2xl border border-brand-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search nurse name, locality, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-brand-slate-200 bg-brand-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-teal-500"
          />
        </div>

        <div className="lg:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full text-xs py-2 px-3 rounded-xl border border-brand-slate-200 bg-brand-slate-50 text-brand-slate-700 focus:outline-hidden focus:border-brand-teal-500"
          >
            <option value="All">All Statuses ({nurses.length})</option>
            <option value="AVAILABLE">Available</option>
            <option value="BUSY">Busy</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>

        <div className="lg:col-span-3">
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="w-full text-xs py-2 px-3 rounded-xl border border-brand-slate-200 bg-brand-slate-50 text-brand-slate-700 focus:outline-hidden focus:border-brand-teal-500"
          >
            <option value="All">All Specializations</option>
            {specializations.map((spec, idx) => (
              <option key={idx} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2 flex items-center justify-end">
          <label className="flex items-center gap-2 text-xs font-semibold text-brand-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showPatientRequests}
              onChange={(e) => setShowPatientRequests(e.target.checked)}
              className="rounded border-brand-slate-300 text-brand-teal-600 focus:ring-brand-teal-500"
            />
            <span>Show Patient Homes</span>
          </label>
        </div>
      </div>

      {/* Map + Sidebar Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[650px] relative">
        {/* Map Container (Spans 2 or 3 cols) */}
        <div className="lg:col-span-2 h-full rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden relative">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Map Subtitle Notice */}
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-brand-slate-200 text-[11px] text-brand-slate-600 shadow-sm flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-brand-teal-600" />
            <span>Map markers indicate registered home base locations in Mysuru.</span>
          </div>
        </div>

        {/* Selected Nurse / Request Details Panel */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs p-5 flex flex-col justify-between overflow-y-auto h-full">
          {selectedNurse ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-brand-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-teal-100 text-brand-teal-800 font-extrabold text-base flex items-center justify-center border border-brand-teal-200">
                    {selectedNurse.name.split(' ')[1]?.[0] || 'N'}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-brand-slate-900">{selectedNurse.name}</h3>
                    <p className="text-xs text-brand-slate-500">{selectedNurse.qualification}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedNurse(null)}
                  className="p-1 rounded-lg text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-slate-500">Current Availability</span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    selectedNurse.status === 'AVAILABLE'
                      ? 'bg-brand-teal-100 text-brand-teal-800'
                      : selectedNurse.status === 'BUSY'
                      ? 'bg-brand-coral-100 text-brand-coral-800'
                      : selectedNurse.status === 'SCHEDULED'
                      ? 'bg-brand-navy-100 text-brand-navy-800'
                      : 'bg-brand-slate-100 text-brand-slate-600'
                  }`}
                >
                  {selectedNurse.status}
                </span>
              </div>

              {/* Details List */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-brand-slate-400 block text-[10px]">Specialization</span>
                  <span className="font-semibold text-brand-slate-800">{selectedNurse.specialization}</span>
                </div>

                <div>
                  <span className="text-brand-slate-400 block text-[10px]">Registered Home Location</span>
                  <span className="text-brand-slate-700 font-medium flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-slate-400 flex-shrink-0 mt-0.5" />
                    {selectedNurse.address}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-brand-slate-400 block text-[10px]">Locality</span>
                    <span className="font-semibold text-brand-teal-700">{selectedNurse.locality}</span>
                  </div>
                  <div>
                    <span className="text-brand-slate-400 block text-[10px]">Experience</span>
                    <span className="font-semibold text-brand-slate-800">{selectedNurse.experience}</span>
                  </div>
                </div>

                <div>
                  <span className="text-brand-slate-400 block text-[10px]">Working Hours</span>
                  <span className="font-medium text-brand-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-slate-400" />
                    {selectedNurse.workingHours}
                  </span>
                </div>

                {/* Next Booking Info */}
                <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-500 block mb-1">
                    Next Booking
                  </span>
                  {selectedNurse.nextBooking ? (
                    <div className="text-xs">
                      <p className="font-bold text-brand-slate-900">
                        {selectedNurse.nextBooking.service}
                      </p>
                      <p className="text-brand-teal-700 font-semibold mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {selectedNurse.nextBooking.date}, {selectedNurse.nextBooking.time}
                      </p>
                      <p className="text-brand-slate-500 text-[11px] mt-0.5">
                        Patient: {selectedNurse.nextBooking.patient}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-brand-green-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      No conflicting bookings. Fully Available.
                    </p>
                  )}
                </div>

                {/* Services Provided Badges */}
                <div>
                  <span className="text-brand-slate-400 block text-[10px] mb-1">Services Provided</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedNurse.services?.map((srv, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-200"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-brand-slate-100">
                <button
                  onClick={() => onOpenNurseDetails && onOpenNurseDetails(selectedNurse.id)}
                  className="w-full py-2.5 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>View Full Nurse Profile</span>
                </button>
              </div>
            </div>
          ) : selectedRequest ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-brand-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-aqua-700 bg-brand-aqua-50 px-2 py-0.5 rounded">
                    Patient Home Request
                  </span>
                  <h3 className="font-bold text-base text-brand-slate-900 mt-1">{selectedRequest.patientName}</h3>
                  <p className="text-xs text-brand-teal-700 font-semibold">{selectedRequest.serviceRequired}</p>
                </div>

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1 rounded-lg text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-brand-slate-400 block text-[10px]">Service Address</span>
                  <span className="text-brand-slate-700 font-medium flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-slate-400 flex-shrink-0 mt-0.5" />
                    {selectedRequest.address}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-brand-slate-400 block text-[10px]">Preferred Date</span>
                    <span className="font-semibold text-brand-slate-800">{selectedRequest.requestedDate}</span>
                  </div>
                  <div>
                    <span className="text-brand-slate-400 block text-[10px]">Preferred Time</span>
                    <span className="font-semibold text-brand-slate-800">{selectedRequest.requestedTime}</span>
                  </div>
                </div>

                <div>
                  <span className="text-brand-slate-400 block text-[10px]">Status</span>
                  <span className="font-bold text-brand-teal-700">{selectedRequest.overallStatus}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-slate-100">
                <button
                  onClick={() => onOpenRequestDetails && onOpenRequestDetails(selectedRequest.id)}
                  className="w-full py-2.5 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Open Request Management</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-brand-slate-400">
              <MapPin className="w-10 h-10 text-brand-slate-300 mb-2" />
              <h4 className="text-xs font-bold text-brand-slate-700 uppercase tracking-wider">
                Select a Nurse Marker
              </h4>
              <p className="text-xs text-brand-slate-500 mt-1 max-w-[200px]">
                Click on any nurse marker on the map to inspect their specialization, registered home address, and booking schedule.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
