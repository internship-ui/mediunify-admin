import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Map as MapIcon,
  Globe,
  Mountain,
  Compass
} from 'lucide-react';

export default function GoogleMapsCanvas({
  nurses = [],
  selectedNurseId,
  onSelectNurse,
  center = [12.3114, 76.6400], // Mysuru center
  zoom = 13,
  className = 'w-full h-full'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const tileLayerRef = useRef(null);

  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite' | 'hybrid' | 'terrain'

  // Initialize Leaflet Map Instance with Google Maps Tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false, // Custom Google Maps styled controls
        attributionControl: false
      });

      // Google Maps Vector / Raster Tile Layer
      const getTileUrl = (type) => {
        switch (type) {
          case 'satellite':
            return 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
          case 'hybrid':
            return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
          case 'terrain':
            return 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
          case 'roadmap':
          default:
            return 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
        }
      };

      const tileLayer = L.tileLayer(getTileUrl('roadmap'), {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Invalidate size after mount to prevent grey tile rendering
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tiles when Map Type changes
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const tileUrls = {
      roadmap: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      satellite: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      hybrid: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      terrain: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
    };
    tileLayerRef.current.setUrl(tileUrls[mapType] || tileUrls.roadmap);
  }, [mapType]);

  // Render High-Fidelity Google Maps Location Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;
    markersGroupRef.current.clearLayers();

    nurses.forEach((nurse) => {
      const isSelected = selectedNurseId === nurse.id;
      const isAvailable = nurse.status === 'Available';

      // Authentic Google Maps Pin Color Palette
      const pinColor = isSelected ? '#1A73E8' : isAvailable ? '#0F9D58' : '#EA4335';
      const labelBg = isSelected ? '#1A73E8' : '#FFFFFF';
      const labelText = isSelected ? '#FFFFFF' : '#202124';

      const customHtml = `
        <div class="google-map-marker-container" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -100%);
          cursor: pointer;
          pointer-events: auto;
        ">
          <!-- Floating Nurse Name & Specialization Callout -->
          <div style="
            background: ${labelBg};
            color: ${labelText};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 11px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 8px;
            white-space: nowrap;
            box-shadow: 0 3px 8px rgba(0,0,0,0.25);
            border: 1.5px solid ${isSelected ? '#1557B0' : '#DADCE0'};
            margin-bottom: 2px;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: transform 0.15s ease-in-out;
          ">
            <span>${nurse.name}</span>
            <span style="
              font-size: 9px;
              font-weight: 700;
              padding: 1px 5px;
              border-radius: 4px;
              background: ${isSelected ? 'rgba(255,255,255,0.25)' : isAvailable ? '#E6F4EA' : '#FCE8E6'};
              color: ${isSelected ? '#FFFFFF' : isAvailable ? '#137333' : '#C5221F'};
            ">${nurse.specialization}</span>
          </div>

          <!-- Google Maps Marker Pin SVG -->
          <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 5px rgba(0,0,0,0.35));">
            <path d="M17 0C7.61116 0 0 7.61116 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.61116 26.3888 0 17 0Z" fill="${pinColor}"/>
            <circle cx="17" cy="16" r="8" fill="white"/>
            <!-- Inner Medical / Nurse Cross Icon -->
            <path d="M15.5 11.5H18.5V14.5H21.5V17.5H18.5V20.5H15.5V17.5H12.5V14.5H15.5V11.5Z" fill="${pinColor}"/>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-google-pin',
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker([nurse.lat, nurse.lng], { icon: customIcon });

      // Interactive Popup on Marker Click
      const popupHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 4px; min-width: 230px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; margin-bottom: 6px;">
            <strong style="font-size: 13px; color: #111827;">${nurse.name}</strong>
            <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 9999px; background: ${isAvailable ? '#DCFCE7' : '#FEE2E2'}; color: ${isAvailable ? '#166534' : '#991B1B'};">${nurse.status}</span>
          </div>
          <div style="font-size: 11px; color: #374151; margin-bottom: 4px;">
            <strong>Specialization:</strong> <span style="color: #047857; font-weight: 600;">${nurse.specialization}</span>
          </div>
          <div style="font-size: 11px; color: #374151; margin-bottom: 4px;">
            <strong>Locality:</strong> ${nurse.locality || nurse.serviceArea || 'Mysuru'}
          </div>
          <div style="font-size: 10px; color: #6B7280; line-height: 1.35; margin-bottom: 6px;">
            📍 ${nurse.address}
          </div>
          <div style="padding-top: 6px; border-top: 1px solid #F3F4F6; display: flex; justify-content: space-between; align-items: center;">
            <a href="tel:${nurse.phone}" style="font-size: 11px; color: #047857; font-weight: 700; text-decoration: none;">📞 ${nurse.phone}</a>
            <span style="font-size: 10px; color: #6B7280; font-weight: 600;">⭐ ${nurse.rating || '4.9'} • ${nurse.experience || '5 Yrs'}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        offset: [0, -42],
        closeButton: true
      });

      marker.on('click', () => {
        if (onSelectNurse) onSelectNurse(nurse.id);
      });

      markersGroupRef.current.addLayer(marker);
    });

    // If selected nurse changed, pan smoothly to their location
    if (selectedNurseId) {
      const selected = nurses.find((n) => n.id === selectedNurseId);
      if (selected && mapInstanceRef.current) {
        mapInstanceRef.current.panTo([selected.lat, selected.lng], {
          animate: true,
          duration: 0.6
        });
      }
    }
  }, [nurses, selectedNurseId]);

  // Controls Handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 1. Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* 2. Google Maps Type Selector (Top Left) */}
      <div className="absolute top-3 left-3 z-[400] bg-white rounded-xl shadow-md border border-gray-200 p-1 flex items-center gap-1 text-xs font-bold">
        <button
          onClick={() => setMapType('roadmap')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            mapType === 'roadmap'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Map</span>
        </button>

        <button
          onClick={() => setMapType('satellite')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            mapType === 'satellite'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Satellite</span>
        </button>

        <button
          onClick={() => setMapType('terrain')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            mapType === 'terrain'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Mountain className="w-3.5 h-3.5" />
          <span>Terrain</span>
        </button>
      </div>

      {/* 3. Google Maps Style Zoom & Recenter Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-3 z-[400] flex flex-col gap-1.5 shadow-md">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col divide-y divide-gray-200">
          <button
            onClick={handleZoomIn}
            className="p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleRecenter}
          className="p-2.5 bg-white rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
          title="Recenter Map on Mysuru"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* 4. Authentic Google Maps Logo / Brand Mark (Bottom Left) */}
      <div className="absolute bottom-2 left-3 z-[400] pointer-events-none select-none">
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs text-[11px] font-black text-gray-700 tracking-tight">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
          <span className="text-[9px] font-semibold text-gray-500 ml-1">Maps (Mysuru Live)</span>
        </div>
      </div>
    </div>
  );
}
