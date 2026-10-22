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
  Filter,
  ShieldCheck,
  Edit2,
  Clock,
  IndianRupee
} from 'lucide-react';
import AddVendorModal from '../components/AddVendorModal';
import VendorDetailModal from '../components/VendorDetailModal';
import { RENTAL_CITIES } from '../../../data/equipmentRentalData';

export default function VendorsManagementView({
  vendors = [],
  onAddVendor,
  onEditVendor,
  onUpdateVendorStatus,
  onVerifyVendor
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vendorToEdit, setVendorToEdit] = useState(null);
  const [selectedVendorForDetails, setSelectedVendorForDetails] = useState(null);

  const tabs = [
    { label: 'All Vendors', key: 'All' },
    { label: 'Active', key: 'Active' },
    { label: 'Under Review', key: 'Under Review' },
    { label: 'Inactive', key: 'Inactive' },
    { label: 'Rejected', key: 'Rejected' }
  ];

  const filteredVendors = vendors.filter((v) => {
    let matchesTab = true;
    if (activeTab === 'Active') {
      matchesTab = (v.status || '').toLowerCase() === 'active';
    } else if (activeTab === 'Under Review') {
      matchesTab = (v.verificationStatus || '').toLowerCase() === 'under review' || (v.status || '').toLowerCase() === 'pending';
    } else if (activeTab === 'Inactive') {
      matchesTab = (v.status || '').toLowerCase() === 'inactive';
    } else if (activeTab === 'Rejected') {
      matchesTab = (v.verificationStatus || '').toLowerCase() === 'rejected' || (v.status || '').toLowerCase() === 'rejected';
    }

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (v.name || '').toLowerCase().includes(q) ||
      (v.businessName || '').toLowerCase().includes(q) ||
      (v.id || '').toLowerCase().includes(q) ||
      (v.contact || '').toLowerCase().includes(q) ||
      (v.serviceArea || '').toLowerCase().includes(q) ||
      (v.location || '').toLowerCase().includes(q) ||
      (v.equipmentCategories || []).some((c) => c.toLowerCase().includes(q));

    const matchesCity =
      selectedCity === 'All Cities' ||
      (v.city || '').toLowerCase() === selectedCity.toLowerCase() ||
      (v.location || '').toLowerCase().includes(selectedCity.toLowerCase());

    return matchesTab && matchesSearch && matchesCity;
  });

  const getVerificationBadge = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Inactive':
        return 'bg-slate-100 text-slate-600 border-slate-300';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
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

  const handleVerify = (vendorId) => {
    if (onVerifyVendor) {
      onVerifyVendor(vendorId);
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
            Maintain verified medical equipment supplier directory, service areas, and monitored rental value records.
          </p>
        </div>

        <button
          onClick={() => {
            setVendorToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 bg-brand-teal-700 hover:bg-brand-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-2 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Vendor</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-2 pt-2 gap-2 overflow-x-auto shadow-xs">
        {tabs.map((tab) => {
          let count = 0;
          if (tab.key === 'All') count = vendors.length;
          else if (tab.key === 'Active') count = vendors.filter((v) => (v.status || '').toLowerCase() === 'active').length;
          else if (tab.key === 'Under Review') count = vendors.filter((v) => (v.verificationStatus || '').toLowerCase() === 'under review' || (v.status || '').toLowerCase() === 'pending').length;
          else if (tab.key === 'Inactive') count = vendors.filter((v) => (v.status || '').toLowerCase() === 'inactive').length;
          else if (tab.key === 'Rejected') count = vendors.filter((v) => (v.verificationStatus || '').toLowerCase() === 'rejected').length;

          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
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

      {/* Search and City Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by vendor name, business, contact, service area, or equipment..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">City Hub:</span>
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

      {/* Table Section (Section 4 Requirements) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/90 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Vendor Name</th>
                <th className="px-4 py-3.5">Vendor ID</th>
                <th className="px-4 py-3.5">Contact Number</th>
                <th className="px-4 py-3.5">Business Name</th>
                <th className="px-4 py-3.5">Service Area</th>
                <th className="px-4 py-3.5">Equipment Categories</th>
                <th className="px-4 py-3.5">Verification</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Requests</th>
                <th className="px-4 py-3.5 text-right">Recorded Value</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => {
                  const isVerified = (vendor.verificationStatus || '').toLowerCase() === 'verified';
                  const isActive = (vendor.status || '').toLowerCase() === 'active';

                  return (
                    <tr
                      key={vendor.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedVendorForDetails(vendor)}
                    >
                      {/* Vendor Name */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-bold text-slate-900 group-hover:text-brand-teal-700 transition-colors">
                          {vendor.name}
                        </div>
                      </td>

                      {/* Vendor ID */}
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-700 whitespace-nowrap">
                        {vendor.id}
                      </td>

                      {/* Contact Number */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-brand-teal-600 shrink-0" />
                          <a
                            href={`tel:${vendor.contact}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:underline"
                          >
                            {vendor.contact}
                          </a>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{vendor.email}</div>
                      </td>

                      {/* Business Name */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-brand-navy-950">
                          {vendor.businessName}
                        </div>
                      </td>

                      {/* Service Area */}
                      <td className="px-4 py-3.5 max-w-[180px]">
                        <div className="font-medium text-slate-700 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-teal-600 shrink-0 mt-0.5" />
                          <span className="truncate" title={vendor.serviceArea || vendor.city}>
                            {vendor.serviceArea || vendor.city}
                          </span>
                        </div>
                      </td>

                      {/* Equipment Categories Offered */}
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <div className="flex flex-wrap gap-1">
                          {(vendor.equipmentCategories || []).slice(0, 2).map((cat, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                            >
                              {cat}
                            </span>
                          ))}
                          {(vendor.equipmentCategories || []).length > 2 && (
                            <span className="text-[10px] font-semibold bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-md border border-teal-200">
                              +{(vendor.equipmentCategories || []).length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Verification Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getVerificationBadge(
                            vendor.verificationStatus || 'Verified'
                          )}`}
                        >
                          {isVerified ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-600" />
                          )}
                          <span>{vendor.verificationStatus || 'Verified'}</span>
                        </span>
                      </td>

                      {/* Active/Inactive Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${getStatusBadge(
                            vendor.status
                          )}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          <span>{vendor.status}</span>
                        </span>
                      </td>

                      {/* Total Rental Requests */}
                      <td className="px-4 py-3.5 text-center font-bold text-slate-800 font-mono">
                        {vendor.totalRentalRequests || 0}
                      </td>

                      {/* Total Recorded Rental Value */}
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-brand-navy-950 whitespace-nowrap">
                        ₹{(vendor.totalRecordedRentalValue || 0).toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3.5 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedVendorForDetails(vendor)}
                            className="p-1.5 text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg transition-colors"
                            title="View Vendor Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setVendorToEdit(vendor);
                              setIsAddModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Vendor"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {!isVerified && onVerifyVendor && (
                            <button
                              type="button"
                              onClick={() => handleVerify(vendor.id)}
                              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Verify Vendor"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(vendor.id, isActive ? 'Inactive' : 'Active')}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isActive
                                ? 'text-rose-600 hover:bg-rose-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={isActive ? 'Deactivate Vendor' : 'Activate Vendor'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="11" className="px-4 py-12 text-center text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No vendors found matching criteria</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try adjusting your search query or city filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Vendor Modal */}
      <AddVendorModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setVendorToEdit(null);
        }}
        onAddVendor={onAddVendor}
        onEditVendor={onEditVendor}
        vendorToEdit={vendorToEdit}
      />

      {/* Vendor Details Modal */}
      <VendorDetailModal
        isOpen={!!selectedVendorForDetails}
        vendor={selectedVendorForDetails}
        onClose={() => setSelectedVendorForDetails(null)}
        onToggleStatus={handleToggleStatus}
        onEdit={(v) => {
          setVendorToEdit(v);
          setIsAddModalOpen(true);
        }}
        onVerify={handleVerify}
      />
    </div>
  );
}
