import React, { useState } from 'react';
import {
  Tag,
  Stethoscope,
  Sparkles,
  Gift,
  Plus,
  CheckCircle2,
  Edit3,
  Power,
  Search,
  Building2,
  Clock
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/forms/FormInput';
import SelectInput from '../../../components/forms/SelectInput';

export default function PricingPackagesView({
  consultations = [],
  therapies = [],
  packages = [],
  centres = [],
  onSavePackage,
  onTogglePackageStatus
}) {
  const [activeTab, setActiveTab] = useState('consultations');
  const [searchTerm, setSearchTerm] = useState('');

  // Add / Edit Package Modal
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageForm, setPackageForm] = useState({
    name: '',
    centre: centres[0]?.name || 'Sanjeevani Ayurveda Wellness Centre',
    centreId: centres[0]?.id || 'AYU-CTR-001',
    description: '',
    includedServices: '',
    numberOfSessions: 7,
    packagePrice: 15000,
    validity: '30 Days',
    status: 'Active'
  });

  const handleOpenAddPackage = () => {
    setEditingPackage(null);
    setPackageForm({
      name: '',
      centre: centres[0]?.name || 'Sanjeevani Ayurveda Wellness Centre',
      centreId: centres[0]?.id || 'AYU-CTR-001',
      description: '',
      includedServices: 'Abhyanga Massage, Shirodhara, Herbal Steam, Diet Consult',
      numberOfSessions: 7,
      packagePrice: 15000,
      validity: '30 Days',
      status: 'Active'
    });
    setIsPackageModalOpen(true);
  };

  const handleOpenEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setPackageForm({
      ...pkg,
      includedServices: Array.isArray(pkg.includedServices) ? pkg.includedServices.join(', ') : pkg.includedServices || ''
    });
    setIsPackageModalOpen(true);
  };

  const handleSavePackageSubmit = (e) => {
    e.preventDefault();
    if (!packageForm.name || !packageForm.packagePrice) return;

    const matchedCentre = centres.find((c) => c.id === packageForm.centreId || c.name === packageForm.centre);
    const payload = {
      ...packageForm,
      id: editingPackage ? editingPackage.id : `PKG-${String(Date.now()).slice(-4)}`,
      centre: matchedCentre ? matchedCentre.name : packageForm.centre,
      centreId: matchedCentre ? matchedCentre.id : packageForm.centreId,
      packagePrice: Number(packageForm.packagePrice),
      numberOfSessions: Number(packageForm.numberOfSessions || 1),
      includedServices: typeof packageForm.includedServices === 'string'
        ? packageForm.includedServices.split(',').map((s) => s.trim()).filter(Boolean)
        : packageForm.includedServices || []
    };

    onSavePackage(payload, Boolean(editingPackage));
    setIsPackageModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy-900 flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-brand-green-700" />
            Pricing & Packages
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
            Configure tariff rates for doctor consultations, therapy procedures, and bundled wellness retreat packages
          </p>
        </div>

        {activeTab === 'packages' && (
          <button
            onClick={handleOpenAddPackage}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Package</span>
          </button>
        )}
      </div>

      {/* Sub-Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'consultations', label: 'A. Consultation Pricing', icon: Stethoscope, count: consultations.length },
          { id: 'therapies', label: 'B. Therapy Pricing', icon: Sparkles, count: therapies.length },
          { id: 'packages', label: 'C. Packages', icon: Gift, count: packages.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-brand-navy-900 text-white shadow-sm'
                  : 'text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-brand-navy-800 text-brand-teal-300' : 'bg-brand-slate-100 text-brand-slate-500'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* SECTION A: Consultation Pricing */}
      {activeTab === 'consultations' && (
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between text-xs text-brand-slate-500">
            <h2 className="font-bold text-brand-navy-900 text-sm">Consultation Rates by Centre & Practitioner</h2>
            <span>{consultations.length} active consultation fee tiers</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-slate-700">
              <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
                <tr>
                  <th className="py-3 px-4">Centre</th>
                  <th className="py-3 px-4">Practitioner</th>
                  <th className="py-3 px-4">Consultation Type</th>
                  <th className="py-3 px-4">Fee (₹)</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100 font-medium">
                {consultations.map((cp) => (
                  <tr key={cp.id} className="hover:bg-brand-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-navy-900">{cp.centre}</td>
                    <td className="py-3.5 px-4 text-brand-green-700 font-semibold">{cp.practitioner}</td>
                    <td className="py-3.5 px-4 text-brand-slate-700">{cp.consultationType}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-extrabold text-brand-navy-900 text-sm">₹{cp.fee}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-600">{cp.duration}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap"><StatusBadge status={cp.status} size="xs" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION B: Therapy Pricing */}
      {activeTab === 'therapies' && (
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between text-xs text-brand-slate-500">
            <h2 className="font-bold text-brand-navy-900 text-sm">Panchakarma & Classical Therapy Session Rates</h2>
            <span>{therapies.length} therapy procedures</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-slate-700">
              <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
                <tr>
                  <th className="py-3 px-4">Centre</th>
                  <th className="py-3 px-4">Therapy / Treatment</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Price per Session (₹)</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100 font-medium">
                {therapies.map((tp) => (
                  <tr key={tp.id} className="hover:bg-brand-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-navy-900">{tp.centre}</td>
                    <td className="py-3.5 px-4 font-semibold text-brand-teal-800">{tp.therapy}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-600">{tp.duration}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-extrabold text-brand-navy-900 text-sm">₹{tp.price}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap"><StatusBadge status={tp.status} size="xs" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION C: Packages Table */}
      {activeTab === 'packages' && (
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between text-xs text-brand-slate-500">
            <h2 className="font-bold text-brand-navy-900 text-sm">Comprehensive Wellness & Retreat Packages</h2>
            <span>{packages.length} active packages</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-slate-700">
              <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
                <tr>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Centre</th>
                  <th className="py-3 px-4">Included Services</th>
                  <th className="py-3 px-4">Sessions</th>
                  <th className="py-3 px-4">Price (₹)</th>
                  <th className="py-3 px-4">Validity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100 font-medium">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-brand-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-brand-navy-900 text-xs sm:text-sm">{pkg.name}</p>
                      <p className="text-[11px] text-brand-slate-400 truncate max-w-xs">{pkg.description}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-[150px] truncate text-brand-slate-600 font-medium">
                      {pkg.centre}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {pkg.includedServices?.slice(0, 2).map((inc, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-brand-slate-600">
                            <CheckCircle2 className="w-3 h-3 text-brand-green-600 flex-shrink-0" />
                            <span className="truncate max-w-[180px]">{inc}</span>
                          </div>
                        ))}
                        {pkg.includedServices?.length > 2 && (
                          <span className="text-[10px] text-brand-teal-700 font-bold">
                            +{pkg.includedServices.length - 2} more services
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-brand-navy-900">
                      {pkg.numberOfSessions} Sessions
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-black text-brand-green-700 text-sm">
                      ₹{pkg.packagePrice?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-600">
                      {pkg.validity}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={pkg.status} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditPackage(pkg)}
                          className="p-1.5 rounded-lg text-brand-slate-500 hover:text-brand-green-700 hover:bg-brand-slate-100 transition-colors"
                          title="Edit Package"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onTogglePackageStatus && onTogglePackageStatus(pkg)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            pkg.status === 'Active'
                              ? 'text-brand-green-600 hover:text-brand-coral-600 hover:bg-brand-coral-50'
                              : 'text-brand-slate-400 hover:text-brand-green-600 hover:bg-brand-green-50'
                          }`}
                          title={pkg.status === 'Active' ? 'Deactivate Package' : 'Activate Package'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Package Modal */}
      <Modal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        title={editingPackage ? `Edit Package: ${editingPackage.name}` : 'Create Wellness / Panchakarma Package'}
        subtitle="Bundle multi-day therapies, dietary regimens, and consultations into a discounted wellness plan"
        maxWidth="max-w-2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsPackageModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSavePackageSubmit}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-xs"
            >
              {editingPackage ? 'Save Package' : 'Create Package'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSavePackageSubmit} className="space-y-4">
          <FormInput
            label="Package Name"
            value={packageForm.name}
            onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
            placeholder="e.g. 7-Day Complete Body Rejuvenation (Rasayana)"
            required
          />

          <div>
            <label className="block text-xs font-bold text-brand-navy-900 mb-1.5">
              Affiliated Ayurveda Centre
            </label>
            <select
              value={packageForm.centreId}
              onChange={(e) => {
                const cId = e.target.value;
                const cObj = centres.find((c) => c.id === cId);
                setPackageForm({
                  ...packageForm,
                  centreId: cId,
                  centre: cObj ? cObj.name : packageForm.centre
                });
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white font-medium"
            >
              {centres.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.city})
                </option>
              ))}
            </select>
          </div>

          <FormInput
            label="Description & Target Objectives"
            type="textarea"
            rows={2}
            value={packageForm.description}
            onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
            placeholder="Describe who this package is for and expected clinical outcomes..."
          />

          <FormInput
            label="Included Services (Comma-separated)"
            value={packageForm.includedServices}
            onChange={(e) => setPackageForm({ ...packageForm, includedServices: e.target.value })}
            placeholder="e.g. 7x Abhyanga, 4x Shirodhara, Daily Satvik Diet, Doctor Rounds"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormInput
              label="Number of Sessions / Days"
              type="number"
              value={packageForm.numberOfSessions}
              onChange={(e) => setPackageForm({ ...packageForm, numberOfSessions: e.target.value })}
              placeholder="7"
              required
            />
            <FormInput
              label="Package Price (₹)"
              type="number"
              value={packageForm.packagePrice}
              onChange={(e) => setPackageForm({ ...packageForm, packagePrice: e.target.value })}
              placeholder="15000"
              required
            />
            <FormInput
              label="Validity Duration"
              value={packageForm.validity}
              onChange={(e) => setPackageForm({ ...packageForm, validity: e.target.value })}
              placeholder="e.g. 30 Days"
            />
          </div>

          <SelectInput
            label="Status"
            value={packageForm.status}
            onChange={(e) => setPackageForm({ ...packageForm, status: e.target.value })}
            options={['Active', 'Inactive']}
          />
        </form>
      </Modal>
    </div>
  );
}
