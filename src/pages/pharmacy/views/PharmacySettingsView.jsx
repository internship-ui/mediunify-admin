import React, { useState } from 'react';
import {
  Sliders,
  Warehouse,
  ShieldCheck,
  Save,
  CheckCircle2,
  Building2,
  FileCheck,
  Bell,
  Thermometer,
  Lock
} from 'lucide-react';
import FormInput from '../../../components/forms/FormInput';
import ToggleSwitch from '../../../components/forms/ToggleSwitch';
import { useToast } from '../../../context/ToastContext';
import { CENTRAL_HUB_STATUS } from '../../../data/pharmacyData';

export default function PharmacySettingsView() {
  const { addToast } = useToast();

  const [settings, setSettings] = useState({
    hubName: CENTRAL_HUB_STATUS.hubName,
    licenseNumber: CENTRAL_HUB_STATUS.licenseNumber,
    pharmacistInCharge: CENTRAL_HUB_STATUS.pharmacistInCharge,
    gstin: '29AABCM9012K1Z9',
    hubAddress: 'MediUnify Central Operations Complex, Peenya/Hebbal Sector, Mysore',
    autoReorderThreshold: 50,
    lowStockAlertEmail: 'pharmacy.alerts@mediunify.com',
    enableColdChainMonitoring: true,
    enableScheduleHStrictCheck: true,
    enableAutoBatchExpiryQuarantine: true
  });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addToast('Pharmacy Central Hub configuration saved successfully', 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-brand-teal-700">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-brand-navy-900">Pharmacy Central Hub Configuration</h1>
              <p className="text-xs text-brand-slate-500">
                Manage Drug Form 20/21 compliance, safety threshold limits, and Central Hub operational parameters
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-slate-100 border border-brand-slate-200 rounded-xl text-xs text-brand-slate-700 font-medium">
          <ShieldCheck className="w-4 h-4 text-brand-teal-700" />
          <span>License Verified & Compliant</span>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Hub Legal & Compliance Credentials */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-brand-slate-100">
            <Building2 className="w-4 h-4 text-brand-teal-700" />
            <h2 className="font-bold text-sm text-brand-navy-900">
              Central Pharmacy Hub Identification & Drug Licenses
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Central Hub Name"
              value={settings.hubName}
              onChange={(e) => setSettings({ ...settings, hubName: e.target.value })}
              required
            />
            <FormInput
              label="Drug License Number (Form 20 / Form 21)"
              value={settings.licenseNumber}
              onChange={(e) => setSettings({ ...settings, licenseNumber: e.target.value })}
              required
            />
            <FormInput
              label="Registered Pharmacist in Charge (RP)"
              value={settings.pharmacistInCharge}
              onChange={(e) => setSettings({ ...settings, pharmacistInCharge: e.target.value })}
              required
            />
            <FormInput
              label="GSTIN Identification"
              value={settings.gstin}
              onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
              required
            />
            <div className="sm:col-span-2">
              <FormInput
                label="Fulfillment Hub Physical Address"
                value={settings.hubAddress}
                onChange={(e) => setSettings({ ...settings, hubAddress: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Inventory Thresholds & Automation */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-brand-slate-100">
            <Warehouse className="w-4 h-4 text-brand-teal-700" />
            <h2 className="font-bold text-sm text-brand-navy-900">
              Safety Stock & Automated Monitoring Policies
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Default Reorder Threshold (Units)"
              type="number"
              value={settings.autoReorderThreshold}
              onChange={(e) => setSettings({ ...settings, autoReorderThreshold: Number(e.target.value) })}
              required
            />
            <FormInput
              label="Stock Alert Notification Email"
              type="email"
              value={settings.lowStockAlertEmail}
              onChange={(e) => setSettings({ ...settings, lowStockAlertEmail: e.target.value })}
              required
            />
          </div>

          <div className="space-y-4 pt-3 border-t border-brand-slate-100">
            <ToggleSwitch
              checked={settings.enableColdChainMonitoring}
              onChange={(checked) => setSettings({ ...settings, enableColdChainMonitoring: checked })}
              label="Enforce 2°C - 8°C Cold Chain Packaging Check"
              description="Requires runners to verify temperature log before dispatch of biologicals & insulin"
            />
            <ToggleSwitch
              checked={settings.enableScheduleHStrictCheck}
              onChange={(checked) => setSettings({ ...settings, enableScheduleHStrictCheck: checked })}
              label="Schedule H / H1 Prescription Verification Protocol"
              description="Prohibits picking without digital signature verification from Central Hub Pharmacist"
            />
            <ToggleSwitch
              checked={settings.enableAutoBatchExpiryQuarantine}
              onChange={(checked) => setSettings({ ...settings, enableAutoBatchExpiryQuarantine: checked })}
              label="Automate Expiry Quarantine Warnings (30 Days)"
              description="Sends automated notification to admin for stock adjustment on approaching expiration"
            />
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-brand-teal-700 hover:bg-brand-teal-800 rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
