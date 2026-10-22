import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  Bell,
  Cpu,
  Save,
  CheckCircle2,
  Building2,
  Lock
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function RadiologySettingsView() {
  const { addToast } = useToast();

  const [settings, setSettings] = useState({
    pacsServerIp: '192.168.10.150',
    pacsPort: '104 (DICOM Standard)',
    pacsAeTitle: 'MEDIUNIFY_CENTRAL_PACS',
    aerbLicenseExpiry: '2028-12-31',
    autoAssignRadiologists: true,
    emergencyTatHours: 1,
    routineTatHours: 4,
    whatsappReportDispatch: true,
    criticalFindingAlertSms: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Radiology institutional settings & PACS routing saved successfully.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-brand-navy-900 tracking-tight">
          Radiology Module Configuration & Institutional Rules
        </h1>
        <p className="text-xs text-brand-slate-500">
          PACS routing gateway, AERB radiation compliance, automated radiologist workload distribution & patient notification protocols
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: PACS & DICOM Server Network Configuration */}
        <div className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-brand-slate-100 pb-3">
            <Cpu className="w-4 h-4 text-brand-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">PACS Gateway & DICOM Server Node</h3>
              <p className="text-xs text-brand-slate-500">Configuration for transmitting scanner modalities to central imaging archive</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">PACS Gateway Host IP:</label>
              <input
                type="text"
                value={settings.pacsServerIp}
                onChange={(e) => setSettings({ ...settings, pacsServerIp: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 font-mono text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">DICOM Port:</label>
              <input
                type="text"
                value={settings.pacsPort}
                onChange={(e) => setSettings({ ...settings, pacsPort: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 font-mono text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">AE Title (Application Entity):</label>
              <input
                type="text"
                value={settings.pacsAeTitle}
                onChange={(e) => setSettings({ ...settings, pacsAeTitle: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 font-mono text-xs font-bold text-brand-teal-800"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: AERB Radiation Compliance & Quality Audit */}
        <div className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-brand-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">AERB Radiation Safety & Quality Accreditations</h3>
              <p className="text-xs text-brand-slate-500">Atomic Energy Regulatory Board radiation license and sensor calibration limits</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">AERB Diagnostic Institutional License Validity:</label>
              <input
                type="date"
                value={settings.aerbLicenseExpiry}
                onChange={(e) => setSettings({ ...settings, aerbLicenseExpiry: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 font-medium text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Compliance Officer On-Duty:</label>
              <input
                type="text"
                defaultValue="Dr. Vikramaditya Hegde, RSO (Radiation Safety Officer)"
                disabled
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 bg-brand-slate-50 font-medium text-xs text-brand-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Automated Workflow & Notification Policies */}
        <div className="p-5 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-brand-slate-100 pb-3">
            <Bell className="w-4 h-4 text-brand-navy-900" />
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">Automated Dispatch & Critical Alerts</h3>
              <p className="text-xs text-brand-slate-500">Notification protocols for emergency stroke CT, STAT findings and patient delivery</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200 cursor-pointer">
              <div>
                <strong className="text-brand-navy-900 block">Automated Radiologist Specialty Dispatch</strong>
                <span className="text-[11px] text-brand-slate-500">Auto-assign brain MRI to Neuro-radiologists and chest CT to Thoracic specialists</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoAssignRadiologists}
                onChange={(e) => setSettings({ ...settings, autoAssignRadiologists: e.target.checked })}
                className="w-4 h-4 rounded text-brand-teal-600 focus:ring-brand-teal-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200 cursor-pointer">
              <div>
                <strong className="text-brand-navy-900 block">Instant Patient WhatsApp & App Report Delivery</strong>
                <span className="text-[11px] text-brand-slate-500">Deliver signed digital PDF link to registered patient mobile immediately on verification</span>
              </div>
              <input
                type="checkbox"
                checked={settings.whatsappReportDispatch}
                onChange={(e) => setSettings({ ...settings, whatsappReportDispatch: e.target.checked })}
                className="w-4 h-4 rounded text-brand-teal-600 focus:ring-brand-teal-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200 cursor-pointer">
              <div>
                <strong className="text-brand-navy-900 block">Critical Finding Flash Alert to Referring Consultant</strong>
                <span className="text-[11px] text-brand-slate-500">Send high-priority SMS / Email trigger when critical acute intracranial/aortic findings flagged</span>
              </div>
              <input
                type="checkbox"
                checked={settings.criticalFindingAlertSms}
                onChange={(e) => setSettings({ ...settings, criticalFindingAlertSms: e.target.checked })}
                className="w-4 h-4 rounded text-brand-teal-600 focus:ring-brand-teal-500"
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" /> Save Radiology Configuration
          </button>
        </div>

      </form>

    </div>
  );
}
