import React, { useState } from 'react';
import {
  Sliders,
  Save,
  Bell,
  MapPin,
  Clock,
  ShieldCheck,
  Smartphone,
  Mail,
  Printer,
  CheckCircle2,
  Building2,
  FileText
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function LabSettingsView() {
  const { addToast } = useToast();

  const [settings, setSettings] = useState({
    homeCollectionFee: 150,
    freeHomeCollectionThreshold: 1500,
    maxHomeServiceRadiusKm: 25,
    autoDispatchThresholdMinutes: 15,
    enableWhatsAppReports: true,
    enableSmsAlerts: true,
    enableEmailPdf: true,
    requirePathologistDigitalSign: true,
    nablCertificateNumber: 'NABL-MED-MYS-88219',
    isoStandard: 'ISO 15189:2022 Medical Laboratories',
    defaultFastingAdvisory: 'Strict overnight fasting of 8 - 10 hours required. Plain drinking water is permitted.',
    labEmergencyHelpline: '+91 821 2548900'
  });

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Laboratory operational settings updated successfully', 'success');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300 max-w-4xl">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-navy-900 tracking-tight">
            Settings
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        
        {/* Section 1: Home Phlebotomy Logistics */}
        <div className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-brand-navy-900 flex items-center gap-2 border-b border-brand-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-brand-teal-600" />
            Home Sample Collection Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">
                Standard Home Collection Fee (₹)
              </label>
              <input
                type="number"
                value={settings.homeCollectionFee}
                onChange={(e) => setSettings({ ...settings, homeCollectionFee: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-bold text-brand-navy-900"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">
                Free Collection Order Value (₹)
              </label>
              <input
                type="number"
                value={settings.freeHomeCollectionThreshold}
                onChange={(e) => setSettings({ ...settings, freeHomeCollectionThreshold: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-bold text-brand-navy-900"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">
                Max Home Service Radius (KM)
              </label>
              <input
                type="number"
                value={settings.maxHomeServiceRadiusKm}
                onChange={(e) => setSettings({ ...settings, maxHomeServiceRadiusKm: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-bold text-brand-navy-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Patient Dispatch & Channels */}
        <div className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-brand-navy-900 flex items-center gap-2 border-b border-brand-slate-100 pb-2">
            <Bell className="w-4 h-4 text-brand-teal-600" />
            Automated Report Dispatch Channels
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableWhatsAppReports}
                onChange={(e) => setSettings({ ...settings, enableWhatsAppReports: e.target.checked })}
                className="w-4 h-4 rounded text-brand-teal-600 focus:ring-brand-teal-500"
              />
              <div>
                <span className="font-bold text-brand-navy-900 block">Instant WhatsApp Diagnostic Report Delivery</span>
                <span className="text-[11px] text-brand-slate-500">Automatically sends password-protected PDF directly to registered patient WhatsApp number upon sign-off.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableEmailPdf}
                onChange={(e) => setSettings({ ...settings, enableEmailPdf: e.target.checked })}
                className="w-4 h-4 rounded text-brand-teal-600 focus:ring-brand-teal-500"
              />
              <div>
                <span className="font-bold text-brand-navy-900 block">Email PDF Diagnostic Report Delivery</span>
                <span className="text-[11px] text-brand-slate-500">Sends formal electronic medical record with encrypted attachment and QR verification link.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableSmsAlerts}
                onChange={(e) => setSettings({ ...settings, enableSmsAlerts: e.target.checked })}
                className="w-4 h-4 rounded text-brand-teal-600 focus:ring-brand-teal-500"
              />
              <div>
                <span className="font-bold text-brand-navy-900 block">SMS Critical Alerts & Booking Confirmations</span>
                <span className="text-[11px] text-brand-slate-500">SMS updates for phlebotomist arrival, barcode generation, and urgent critical value alerts.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 3: Accreditation & Clinical Defaults */}
        <div className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-brand-navy-900 flex items-center gap-2 border-b border-brand-slate-100 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            NABL Accreditation & Pathologist Compliance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">
                NABL Medical Testing Accreditation Code
              </label>
              <input
                type="text"
                value={settings.nablCertificateNumber}
                onChange={(e) => setSettings({ ...settings, nablCertificateNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">
                Standard Quality Framework
              </label>
              <input
                type="text"
                value={settings.isoStandard}
                onChange={(e) => setSettings({ ...settings, isoStandard: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-brand-slate-700 mb-1">
                Default Patient Fasting Instruction Text
              </label>
              <textarea
                rows={2}
                value={settings.defaultFastingAdvisory}
                onChange={(e) => setSettings({ ...settings, defaultFastingAdvisory: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Lab Settings
          </button>
        </div>
      </form>
    </div>
  );
}
