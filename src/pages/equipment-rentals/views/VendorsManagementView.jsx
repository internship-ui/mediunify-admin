import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Eye,
  Power,
  XCircle,
  AlertCircle,
  Package,
  Layers,
  Filter
} from 'lucide-react';
import AddVendorModal from '../components/AddVendorModal';
import VendorDetailModal from '../components/VendorDetailModal';
import { RENTAL_CITIES } from '../../../data/equipmentRentalData';

export default function VendorsManagementView({
  vendors = [],
  onAddVendor,
  onUpdateVendorStatus
}) {
  const [activeTab, setActiveTab] = useState('Active Vendors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVendorForDetails, setSelectedVendorForDetails] = useState(null);

  const tabs = [
    { label: 'Active Vendors', statusKey: 'Active' },
    { label: 'Pending Verification', statusKey: 'Pending' },
    { label: 'Rejected Vendors', statusKey: 'Rejected' },
    { label: 'Inactive Vendors', statusKey: 'Inactive' }
  ];

  // Map active tab to status
  const currentTabConfig = tabs.find((t) => t.label === activeTab) || tabs[0];

  const filteredVendors = vendors.filter((v) => {
    const matchesTab = (v.status || '').toLowerCase() === currentTabConfig.statusKey.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (v.name || '').toLowerCase().includes(q) ||
      (v.businessName || '').toLowerCase().includes(q) ||
      (v.id || '').toLowerCase().includes(q) ||
      (v.contact || '').toLowerCase().includes(q) ||
      (v.location || '').toLowerCase().includes(q) ||
      (v.equipmentCategories || []).some((c) => c.toLowerCase().includes(q));

    const matchesCity =
      selectedCity === 'All Cities' ||
      (v.city || '').toLowerCase() === selectedCity.toLowerCase() ||
      (v.location || '').toLowerCase().includes(selectedCity.toLowerCase());

    return matchesTab && matchesSearch && matchesCity;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Inactive':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const handleToggleStatus = (vendorId, nextStatus) => {
    if (onUpdateVendorStatus) {
      onUpdateVendorStatus(vendorId, nextStatus);
    }
    if (selectedVendorForDetails && selectedVendorForDetails.id === vendorId) {
      setSelectedVendorForDetails((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-brand-navy-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-brand-teal-700" />
            Vendor Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain directory of approved equipment suppliers, active partners, and deactivated accounts.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-brand-teal-700 hover:bg-brand-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-2 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Vendor</span>
        </button>
      </div>

      {/* 4 Tabs: Active Vendors, Pending Verification, Rejected Vendors, Inactive Vendors */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-2 pt-2 gap-2 overflow-x-auto shadow-xs">
        {tabs.map((tab) => {
          const count = vendors.filter((v) => (v.status || '').toLowerCase() === tab.statusKey.toLowerCase()).length;
          const isActive = activeTab === tab.label;

          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-brand-teal-600 text-brand-teal-800 bg-teal-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
                  isActive
                    ? 'bg-brand-teal-700 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by vendor name, business, contact, or equipment..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">City:</span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
          >
            {RENTAL_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/90 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Vendor ID</th>
                <th className="px-4 py-3.5">Vendor Name</th>
                <th className="px-4 py-3.5">Business Name</th>
                <th className="px-4 py-3.5">Contact</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Equipment Categories</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                      {vendor.id}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 group-hover:text-brand-teal-700 transition-colors">
                        {vendor.name}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">
                        {vendor.businessName}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-teal-600" />
                        <span>{vendor.contact}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{vendor.email}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{vendor.location || vendor.city}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 max-w-[240px]">
                      <div className="flex flex-wrap gap-1">
                        {(vendor.equipmentCategories || []).slice(0, 2).map((cat, idx) => {
                          const units = vendor.equipmentStock?.[cat] || vendor.equipmentStock?.[cat.trim()];
                          return (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 inline-flex items-center gap-1"
                            >
                              <span>{cat}</span>
                              {units !== undefined && (
                                <span className="font-bold text-teal-700 font-mono">({units})</span>
                              )}
                            </span>
                          );
                        })}
                        {(vendor.equipmentCategories || []).length > 2 && (
                          <span className="text-[10px] font-semibold bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-md border border-teal-200">
                            +{(vendor.equipmentCategories || []).length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusBadge(vendor.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${vendor.status === 'Active' ? 'bg-emerald-500' : vendor.status === 'Inactive' ? 'bg-slate-400' : vendor.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedVendorForDetails(vendor)}
                          className="px-2.5 py-1.5 bg-brand-teal-50 hover:bg-brand-teal-600 text-brand-teal-700 hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        {vendor.status === 'Active' ? (
                          <button
                            onClick={() => handleToggleStatus(vendor.id, 'Inactive')}
                            title="Deactivate Vendor"
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 border border-slate-200 hover:border-rose-200"
                          >
                            <Power className="w-3.5 h-3.5 text-rose-500" />
                            <span>Deactivate</span>
                          </button>
                        ) : vendor.status === 'Inactive' ? (
                          <button
                            onClick={() => handleToggleStatus(vendor.id, 'Active')}
                            title="Activate Vendor"
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 border border-emerald-200"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Activate</span>
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No {activeTab.toLowerCase()} found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try searching with a different term or clear filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vendor Modal */}
      <AddVendorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddVendor={onAddVendor}
      />

      {/* Vendor Details Modal */}
      <VendorDetailModal
        isOpen={!!selectedVendorForDetails}
        vendor={selectedVendorForDetails}
        onClose={() => setSelectedVendorForDetails(null)}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
