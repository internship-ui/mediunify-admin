import React, { useState } from 'react';
import { MapPin, Navigation, Compass, ExternalLink, Layers, ZoomIn, ZoomOut, CheckCircle } from 'lucide-react';

export default function MapPlaceholder({
  patientLocation = 'Mysore (Jayalakshmipuram)',
  deliveryAddress = '#42, 5th Main, Jayalakshmipuram, Mysore - 570012',
  city = 'Mysore',
  coordinates = { lat: 12.3168, lng: 76.6348 },
  deliveryCoordinates = { lat: 12.3192, lng: 76.6315 },
  vendorName = 'Sri Sai Medical Rentals',
  vendorLocation = 'Mysore (Gokulam)'
}) {
  const [showFullModal, setShowFullModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(14);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${deliveryAddress}, ${city}`
  )}`;

  return (
    <>
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        {/* Header bar */}
        <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between bg-brand-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900">
                Patient & Delivery Location Map
              </h3>
              <p className="text-[11px] text-brand-slate-500">
                {city} Dispatch Zone • Coordinates: {coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFullModal(true)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-brand-teal-600 hover:bg-brand-teal-700 text-white shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>View Location</span>
            </button>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-brand-slate-500 hover:text-brand-teal-700 hover:bg-brand-slate-100 rounded-lg border border-brand-slate-200 transition-colors"
              title="Open in Google Maps"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Map Canvas / Simulated Interactive Visualization */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden select-none">
          {/* Subtle Grid Map Texture */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(13, 148, 136, 0.25) 0%, transparent 70%),
                linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 36px 36px, 36px 36px'
            }}
          />

          {/* Simulated Road Network Vectors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0D9488" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
            {/* Background Grid Roads */}
            <path d="M 0,80 Q 200,90 400,60 T 800,90" stroke="rgba(255,255,255,0.12)" strokeWidth="4" fill="none" />
            <path d="M 120,0 L 140,300" stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="none" />
            <path d="M 380,0 Q 360,150 420,300" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
            <path d="M 0,200 C 250,180 350,220 800,190" stroke="rgba(255,255,255,0.12)" strokeWidth="4" fill="none" />

            {/* Active Delivery Route Line */}
            <path
              d="M 150,180 C 220,170 280,120 340,110"
              stroke="url(#routeGrad)"
              strokeWidth="4"
              strokeDasharray="6 4"
              fill="none"
              className="animate-pulse"
            />
          </svg>

          {/* Map Controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
              className="w-7 h-7 bg-white/90 hover:bg-white text-brand-slate-700 rounded-lg shadow-md flex items-center justify-center transition-all text-xs font-bold"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
              className="w-7 h-7 bg-white/90 hover:bg-white text-brand-slate-700 rounded-lg shadow-md flex items-center justify-center transition-all text-xs font-bold"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Compass Chip */}
          <div className="absolute bottom-3 left-3 bg-brand-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono flex items-center gap-1.5 z-10">
            <Compass className="w-3 h-3 text-brand-teal-400 animate-spin-slow" />
            <span>{city.toUpperCase()} • ZOOM {zoomLevel}X</span>
          </div>

          {/* Vendor Dispatch Marker */}
          <div className="absolute top-[155px] left-[130px] z-10 group cursor-pointer">
            <div className="relative">
              <span className="absolute -top-1 -left-1 w-8 h-8 bg-brand-navy-400 rounded-full animate-ping opacity-30" />
              <div className="w-6 h-6 rounded-full bg-brand-navy-900 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">
                V
              </div>
              <div className="absolute left-7 -top-2 bg-brand-navy-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-md whitespace-nowrap backdrop-blur-xs border border-white/10">
                {vendorName}
              </div>
            </div>
          </div>

          {/* Patient Destination Marker */}
          <div className="absolute top-[85px] left-[325px] z-10 group cursor-pointer">
            <div className="relative">
              <span className="absolute -top-2 -left-2 w-10 h-10 bg-brand-teal-400 rounded-full animate-ping opacity-40" />
              <div className="w-7 h-7 rounded-full bg-brand-teal-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
                <MapPin className="w-4 h-4 fill-white" />
              </div>
              <div className="absolute left-8 -top-3 bg-white text-brand-slate-900 text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap border border-brand-slate-200">
                <p className="leading-none text-[11px] text-brand-teal-700">Patient Delivery Point</p>
                <p className="text-[10px] text-brand-slate-500 font-medium">{patientLocation}</p>
              </div>
            </div>
          </div>

          {/* Estimated Distance Badge */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-brand-slate-200 shadow-md text-right z-10">
            <p className="text-[10px] text-brand-slate-400 font-semibold uppercase">Est. Dispatch Distance</p>
            <p className="text-xs font-extrabold text-brand-teal-700">4.2 km • ~18 mins</p>
          </div>
        </div>

        {/* Footer address info */}
        <div className="p-3.5 bg-brand-slate-50 text-xs text-brand-slate-600 border-t border-brand-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-brand-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-brand-slate-900">Delivery Address: </span>
              <span className="text-brand-slate-700">{deliveryAddress}</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-green-700 bg-brand-green-50 px-2 py-0.5 rounded border border-brand-green-200 w-fit">
            <CheckCircle className="w-3 h-3" /> Serviceable Zone
          </span>
        </div>
      </div>

      {/* Full Location Modal */}
      {showFullModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-scale-up">
            <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between bg-brand-slate-50/80">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-brand-teal-600" />
                <h3 className="font-bold text-brand-navy-900 text-sm">Delivery Geographic Details</h3>
              </div>
              <button
                onClick={() => setShowFullModal(false)}
                className="text-brand-slate-400 hover:text-brand-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3.5 rounded-xl bg-brand-teal-50/60 border border-brand-teal-200 space-y-1.5">
                <p className="text-xs font-bold text-brand-teal-900">Patient Destination</p>
                <p className="text-sm font-semibold text-brand-slate-800">{deliveryAddress}</p>
                <p className="text-xs text-brand-slate-500">Zone: {patientLocation} ({city})</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-brand-slate-200 bg-brand-slate-50">
                  <span className="text-brand-slate-400 block font-semibold text-[10px]">COORDINATES</span>
                  <span className="font-mono font-bold text-brand-slate-800">
                    {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-brand-slate-200 bg-brand-slate-50">
                  <span className="text-brand-slate-400 block font-semibold text-[10px]">ESTIMATED SLA</span>
                  <span className="font-bold text-brand-green-700">Same-Day (2-4 Hours)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-brand-slate-200 bg-white space-y-2">
                <p className="text-xs font-bold text-brand-slate-900">Assigned Vendor Hub</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-brand-teal-700">{vendorName}</span>
                  <span className="text-brand-slate-500">{vendorLocation}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-brand-slate-50 border-t border-brand-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowFullModal(false)}
                className="px-4 py-2 text-xs font-bold text-brand-slate-600 hover:bg-brand-slate-200 rounded-xl transition-colors"
              >
                Close
              </button>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-bold bg-brand-teal-600 hover:bg-brand-teal-700 text-white rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
