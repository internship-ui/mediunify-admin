import React, { useState } from 'react';
import {
  Store,
  Plus,
  Search,
  Filter,
  Star,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Edit2,
  Power,
  PowerOff,
  Building2,
  PackageCheck
} from 'lucide-react';

export default function PartnerPharmaciesView({
  partners = [],
  onOpenAddPartner,
  onOpenEditPartner,
  onTogglePartnerStatus,
  onVerifyPartner
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Active, Inactive, Verified, Under Review

  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'Active') return p.operationalStatus === 'Active';
    if (statusFilter === 'Inactive') return p.operationalStatus === 'Inactive';
    if (statusFilter === 'Verified') return p.verificationStatus === 'Verified';
    if (statusFilter === 'Under Review') return p.verificationStatus === 'Under Review';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Verified Partner Network</span>
          </div>
          <h1 className="text-2xl font-black text-brand-navy-950 mt-1">
            Partner Pharmacies
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-600">
            Monitor verified partner retail stores, license credentials, and fulfillment ratings.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddPartner}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Partner Store</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate-400" />
          <input
            type="text"
            placeholder="Search by store name, license number, area, pharmacist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-brand-slate-200 bg-brand-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Status filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Active', 'Inactive', 'Verified', 'Under Review'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white text-brand-slate-600 border-brand-slate-200 hover:bg-brand-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Partner Pharmacies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPartners.map((partner) => {
          const isActive = partner.operationalStatus === 'Active';
          const isVerified = partner.verificationStatus === 'Verified';
          const capacityPct = Math.min(
            100,
            Math.round((partner.activeOrdersLoad / partner.maxDailyCapacity) * 100)
          );

          return (
            <div
              key={partner.id}
              className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden ${
                isActive ? 'border-brand-slate-200/90' : 'border-rose-200/80 bg-rose-50/10'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-brand-navy-950 text-sm tracking-tight leading-snug">
                        {partner.name}
                      </h3>
                      <span className="font-mono text-[11px] text-brand-slate-400 block">
                        {partner.shortCode} • License: {partner.licenseNumber}
                      </span>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{partner.rating}</span>
                  </span>
                </div>

                {/* Location & Contact */}
                <div className="space-y-1 text-xs text-brand-slate-600">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-brand-slate-400 shrink-0" />
                    <span className="truncate">
                      {partner.area} ({partner.distanceFromHubKm} km from hub, {partner.deliveryRadiusKm} km radius)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-brand-slate-400 shrink-0" />
                    <span className="font-mono">{partner.phone} ({partner.contactPerson})</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="pt-2 border-t border-brand-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-brand-slate-500">Live Load Capacity:</span>
                    <span className="font-mono font-bold text-brand-navy-900">
                      {partner.activeOrdersLoad} / {partner.maxDailyCapacity} orders ({capacityPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-brand-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        capacityPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${capacityPct}%` }}
                    />
                  </div>
                </div>

                {/* Performance stats mini-grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-brand-slate-50 p-2 rounded-xl border border-brand-slate-200/70">
                    <span className="text-brand-slate-400 block text-[10px]">Fulfillment Rate</span>
                    <span className="font-mono font-bold text-emerald-700">{partner.fulfillmentRate}%</span>
                  </div>
                  <div className="bg-brand-slate-50 p-2 rounded-xl border border-brand-slate-200/70">
                    <span className="text-brand-slate-400 block text-[10px]">Avg TAT Speed</span>
                    <span className="font-mono font-bold text-brand-navy-900">{partner.avgDeliveryMins} mins</span>
                  </div>
                </div>

                {/* Category tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {partner.categoriesSupported?.slice(0, 3).map((cat) => (
                    <span
                      key={cat}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-brand-slate-100 text-brand-slate-700 font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                  {partner.categoriesSupported?.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-brand-slate-100 text-brand-slate-500 font-mono">
                      +{partner.categoriesSupported.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer / Status Badges & Actions */}
              <div className="px-5 py-3.5 bg-brand-slate-50/80 border-t border-brand-slate-200/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                      isVerified
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {isVerified ? 'Verified' : 'Under Review'}
                  </span>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                      isActive
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Edit Partner"
                    onClick={() => onOpenEditPartner(partner)}
                    className="p-1.5 text-brand-slate-600 hover:text-brand-navy-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-brand-slate-200"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {!isVerified && (
                    <button
                      type="button"
                      title="Verify Partner"
                      onClick={() => onVerifyPartner(partner.id)}
                      className="px-2 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      Verify
                    </button>
                  )}

                  <button
                    type="button"
                    title={isActive ? 'Deactivate Partner' : 'Activate Partner'}
                    onClick={() => onTogglePartnerStatus(partner.id)}
                    className={`p-1.5 rounded-lg transition-colors border ${
                      isActive
                        ? 'text-rose-600 hover:bg-rose-50 border-transparent hover:border-rose-200'
                        : 'text-emerald-700 hover:bg-emerald-50 border-transparent hover:border-emerald-200'
                    }`}
                  >
                    {isActive ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
