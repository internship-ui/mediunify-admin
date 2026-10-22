import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Plus,
  Eye,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Check,
  X
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import VendorVerificationDetailModal from '../components/VendorVerificationDetailModal';
import AddVendorModal from '../components/AddVendorModal';

export default function VendorVerificationView({
  vendors = [],
  onApproveVendor,
  onRejectVendor,
  onAddVendor
}) {
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendorForReview, setSelectedVendorForReview] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const pendingVendors = vendors.filter((v) => (v.status || '').toLowerCase() === 'pending');
  const approvedVendors = vendors.filter((v) => (v.status || '').toLowerCase() === 'active' || (v.status || '').toLowerCase() === 'approved');
  const rejectedVendors = vendors.filter((v) => (v.status || '').toLowerCase() === 'rejected');

  const filteredVendors = vendors.filter((v) => {
    let matchesTab = false;
    const s = (v.status || '').toLowerCase();
    if (activeTab === 'All') {
      matchesTab = true;
    } else if (activeTab === 'Pending') {
      matchesTab = s === 'pending';
    } else if (activeTab === 'Approved') {
      matchesTab = s === 'active' || s === 'approved';
    } else if (activeTab === 'Rejected') {
      matchesTab = s === 'rejected';
    }

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (v.name || '').toLowerCase().includes(q) ||
      (v.businessName || '').toLowerCase().includes(q) ||
      (v.id || '').toLowerCase().includes(q) ||
      (v.contact || '').toLowerCase().includes(q) ||
      (v.location || '').toLowerCase().includes(q) ||
      (v.equipmentCategories || []).some((c) => c.toLowerCase().includes(q));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-purple-700" />
            Vendor Verification & Approval
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-1">
            Core administrative function: Review supplier trade licenses, business credentials, and approve medical equipment partners.
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('Pending')}
          className={`p-4 rounded-2xl border shadow-xs transition-all cursor-pointer ${
            activeTab === 'Pending'
              ? 'bg-purple-50/50 border-purple-300 ring-2 ring-purple-500/20'
              : 'bg-white border-brand-slate-200 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center justify-between text-purple-700 text-xs font-bold">
            <span>Pending Verification</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-extrabold text-purple-900 mt-1 block font-mono">
            {pendingVendors.length}
          </span>
          <span className="text-[11px] text-purple-600 font-medium">Awaiting admin review</span>
        </div>

        <div
          onClick={() => setActiveTab('Approved')}
          className={`p-4 rounded-2xl border shadow-xs transition-all cursor-pointer ${
            activeTab === 'Approved'
              ? 'bg-brand-green-50/50 border-brand-green-300 ring-2 ring-brand-green-500/20'
              : 'bg-white border-brand-slate-200 hover:border-brand-green-200'
          }`}
        >
          <div className="flex items-center justify-between text-brand-green-800 text-xs font-bold">
            <span>Approved Vendors</span>
            <CheckCircle2 className="w-4 h-4 text-brand-green-600" />
          </div>
          <span className="text-2xl font-extrabold text-brand-green-900 mt-1 block font-mono">
            {approvedVendors.length}
          </span>
          <span className="text-[11px] text-brand-green-600 font-medium">Active in network</span>
        </div>

        <div
          onClick={() => setActiveTab('Rejected')}
          className={`p-4 rounded-2xl border shadow-xs transition-all cursor-pointer ${
            activeTab === 'Rejected'
              ? 'bg-brand-coral-50/50 border-brand-coral-300 ring-2 ring-brand-coral-500/20'
              : 'bg-white border-brand-slate-200 hover:border-brand-coral-200'
          }`}
        >
          <div className="flex items-center justify-between text-brand-coral-800 text-xs font-bold">
            <span>Rejected Registrations</span>
            <XCircle className="w-4 h-4 text-brand-coral-600" />
          </div>
          <span className="text-2xl font-extrabold text-brand-coral-900 mt-1 block font-mono">
            {rejectedVendors.length}
          </span>
          <span className="text-[11px] text-brand-coral-600 font-medium">Non-compliant</span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['Pending', 'Approved', 'Rejected', 'All'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-brand-slate-50 text-brand-slate-600 hover:bg-brand-slate-100 border border-brand-slate-200'
                }`}
              >
                {tab === 'Pending' ? `Pending (${pendingVendors.length})` : tab}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendor or business..."
            className="w-full pl-9 pr-3 py-1.5 bg-brand-slate-50 border border-brand-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
      </div>

      {/* Verification Table (Requirement 5) */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-600">
            <thead className="bg-brand-slate-50/90 text-[11px] font-bold text-brand-slate-700 uppercase tracking-wider border-b border-brand-slate-200">
              <tr>
                <th className="px-4 py-3">Vendor ID</th>
                <th className="px-4 py-3">Vendor Name</th>
                <th className="px-4 py-3">Business Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Equipment Categories</th>
                <th className="px-4 py-3">Registration Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    onClick={() => setSelectedVendorForReview(vendor)}
                    className="hover:bg-brand-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-brand-navy-900">
                      {vendor.id}
                    </td>

                    <td className="px-4 py-3.5 font-bold text-brand-navy-900">
                      {vendor.name}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-brand-navy-900 group-hover:text-purple-700 transition-colors flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-brand-teal-600 flex-shrink-0" />
                        <span>{vendor.businessName}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-brand-teal-700 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-brand-teal-600" />
                        <span>{vendor.contact}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-medium text-brand-slate-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-slate-400" />
                        <span>{vendor.location}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {(vendor.equipmentCategories || []).slice(0, 2).map((cat, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold bg-brand-slate-100 text-brand-slate-700 px-1.5 py-0.5 rounded"
                          >
                            {cat}
                          </span>
                        ))}
                        {(vendor.equipmentCategories || []).length > 2 && (
                          <span className="text-[10px] font-semibold bg-brand-slate-50 text-brand-slate-500 px-1.5 py-0.5 rounded">
                            +{(vendor.equipmentCategories || []).length - 2} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-brand-slate-500 font-medium">
                      {vendor.registrationDate}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={vendor.status} size="xs" />
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVendorForReview(vendor);
                        }}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-700 text-purple-800 hover:text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 shadow-2xs group-hover:scale-105"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-brand-slate-400">
                    <ShieldCheck className="w-8 h-8 text-brand-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm">No vendors found in this verification status.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedVendorForReview && (
        <VendorVerificationDetailModal
          isOpen={Boolean(selectedVendorForReview)}
          onClose={() => setSelectedVendorForReview(null)}
          vendor={selectedVendorForReview}
          onApprove={(id) => {
            if (onApproveVendor) onApproveVendor(id);
          }}
          onReject={(id, reason) => {
            if (onRejectVendor) onRejectVendor(id, reason);
          }}
        />
      )}

      {/* Add Vendor Modal */}
      <AddVendorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddVendor={onAddVendor}
      />
    </div>
  );
}
