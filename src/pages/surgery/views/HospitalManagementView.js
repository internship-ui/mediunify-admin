import React, { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Activity,
  CheckCircle2,
  XCircle,
  Edit2,
  Eye,
  Power,
  Share2,
  MessageSquare,
  ShieldCheck,
  Star,
  LayoutGrid,
  List,
  Sparkles,
  Users
} from 'lucide-react';
import StatCard from '../../../components/common/StatCard';
import {
  DEFAULT_SURGERY_SPECIALIZATIONS,
  SURGERY_CITIES
} from '../../../data/surgeryData';

export default function HospitalManagementView({
  hospitals = [],
  patients = [],
  onOpenAddHospital,
  onOpenEditHospital,
  onOpenViewHospital,
  onToggleHospitalStatus
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Inactive'
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [specializationFilter, setSpecializationFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Dynamic list of unique specializations in onboarded hospitals
  const allSpecializations = useMemo(() => {
    const set = new Set(DEFAULT_SURGERY_SPECIALIZATIONS);
    hospitals.forEach((h) => {
      h.specializations?.forEach((spec) => set.add(spec));
    });
    return Array.from(set);
  }, [hospitals]);

  // Filtered hospitals
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.specializations?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (h.whatsappNumber && h.whatsappNumber.includes(searchTerm)) ||
        (h.notificationEmail && h.notificationEmail.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'All' || h.status === statusFilter;

      const matchesCity =
        cityFilter === 'All Cities' || h.city.toLowerCase() === cityFilter.toLowerCase();

      const matchesSpecialization =
        specializationFilter === 'All' || h.specializations?.includes(specializationFilter);

      return matchesSearch && matchesStatus && matchesCity && matchesSpecialization;
    });
  }, [hospitals, searchTerm, statusFilter, cityFilter, specializationFilter]);

  // Summary statistics
  const activeCount = hospitals.filter((h) => h.status === 'Active').length;
  const inactiveCount = hospitals.filter((h) => h.status === 'Inactive').length;

  // Calculate total referrals count from patients
  const totalReferredInquiries = patients.filter((p) => p.forwardStatus === 'Forwarded').length;

  return (
    <div className="space-y-6 animate-fade-in text-brand-navy-900">
      {/* Top Header & Onboard Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-brand-slate-200/90 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-teal-50 border border-brand-teal-200 text-brand-teal-700">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight">
                  Hospital Management Directory
                </h1>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Surgical Network
                </span>
              </div>
              <p className="text-xs sm:text-sm text-brand-slate-600 mt-1">
                Onboard and manage accredited hospitals, surgery specializations (Knee, Hip, Cardiac, Spine, etc.) & request forwarding channels.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAddHospital}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-xs transition-all active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Hospital</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Onboarded Hospitals"
          value={hospitals.length}
          change="Across Mysore, Bangalore & Mandya"
          isPositive={true}
          icon={Building2}
          colorKey="teal"
        />
        <StatCard
          title="Active for Referrals"
          value={activeCount}
          change="Eligible for inquiry matching"
          isPositive={true}
          icon={CheckCircle2}
          colorKey="green"
        />
        <StatCard
          title="Inactive Hospitals"
          value={inactiveCount}
          change="Excluded from new inquiries"
          isPositive={false}
          icon={XCircle}
          colorKey="coral"
        />
        <StatCard
          title="Forwarded Inquiries"
          value={totalReferredInquiries}
          change="Assigned to partner hospitals"
          isPositive={true}
          icon={Share2}
          colorKey="navy"
        />
      </div>

      {/* Search, Filters & View Toggle Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by hospital name (e.g. A R Hospital), address, city..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500 transition-all text-brand-navy-900 bg-brand-slate-50/50 font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-brand-slate-100 p-1 rounded-xl">
            {['All', 'Active', 'Inactive'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  statusFilter === st
                    ? 'bg-white text-brand-navy-950 shadow-2xs'
                    : 'text-brand-slate-600 hover:text-brand-navy-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* City Filter */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            aria-label="Filter by City"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
          >
            {SURGERY_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Specialization Filter */}
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            aria-label="Filter by Surgery Specialization"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 max-w-[190px]"
          >
            <option value="All">All Specializations</option>
            {allSpecializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-brand-slate-200 rounded-xl overflow-hidden bg-brand-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-brand-teal-700 shadow-2xs'
                  : 'text-brand-slate-400 hover:text-brand-slate-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-brand-teal-700 shadow-2xs'
                  : 'text-brand-slate-400 hover:text-brand-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Directory Results Info */}
      <div className="flex items-center justify-between text-xs text-brand-slate-500 px-1">
        <span>
          Showing <strong>{filteredHospitals.length}</strong> of {hospitals.length} onboarded hospitals
        </span>
        {statusFilter !== 'All' && (
          <span className="font-semibold text-brand-teal-800">
            Filtered by status: {statusFilter}
          </span>
        )}
      </div>

      {/* DIRECTORY DISPLAY: GRID OR TABLE */}
      {filteredHospitals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-12 text-center">
          <Building2 className="w-10 h-10 text-brand-slate-300 mx-auto mb-2" />
          <h3 className="font-black text-brand-navy-950 text-base">No Hospitals Match Filter Criteria</h3>
          <p className="text-xs text-brand-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, city filter, specialization, or status.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All');
              setCityFilter('All Cities');
              setSpecializationFilter('All');
            }}
            className="mt-3 text-xs font-bold text-brand-teal-700 hover:underline"
          >
            Reset all directory filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW - Clean & Minimal: Name + Address only, click to view full details */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHospitals.map((hospital) => {
            const isActive = hospital.status === 'Active';

            return (
              <div
                key={hospital.id}
                onClick={() => onOpenViewHospital(hospital)}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-subtle hover:shadow-md hover:border-brand-teal-300 flex flex-col justify-between cursor-pointer group p-5 ${
                  isActive ? 'border-brand-slate-200/90' : 'border-slate-300 bg-slate-50/50 opacity-90'
                }`}
              >
                {/* Hospital Name & Address */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-extrabold text-brand-navy-950 text-base leading-snug group-hover:text-brand-teal-700 transition-colors">
                      {hospital.name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase flex-shrink-0 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span>{hospital.status}</span>
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-brand-slate-600">
                    <MapPin className="w-4 h-4 text-brand-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      {hospital.address}, {hospital.city}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div
                  className="pt-4 mt-5 border-t border-brand-slate-100 flex items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onOpenViewHospital(hospital)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-brand-teal-800 bg-brand-teal-50 hover:bg-brand-teal-100 border border-brand-teal-200 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenEditHospital(hospital)}
                      className="p-1.5 rounded-lg text-brand-slate-600 hover:text-brand-navy-900 bg-white hover:bg-brand-slate-100 border border-brand-slate-200 transition-colors"
                      title="Edit Hospital"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-brand-teal-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleHospitalStatus(hospital)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isActive
                          ? 'text-red-700 bg-white hover:bg-red-50 border-red-200'
                          : 'text-emerald-700 bg-white hover:bg-emerald-50 border-emerald-200'
                      }`}
                      title={isActive ? 'Deactivate Hospital' : 'Activate Hospital'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW - Clean & Minimal */
        <div className="bg-white rounded-2xl border border-brand-slate-200/90 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-brand-slate-50 border-b border-brand-slate-200 text-[11px] font-bold text-brand-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Hospital Name</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100">
                {filteredHospitals.map((hospital) => {
                  const isActive = hospital.status === 'Active';

                  return (
                    <tr
                      key={hospital.id}
                      className="hover:bg-brand-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onOpenViewHospital(hospital)}
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-brand-navy-950 text-sm group-hover:text-brand-teal-700 transition-colors">
                          {hospital.name}
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-brand-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-brand-slate-400 flex-shrink-0" />
                          <span>{hospital.address}, {hospital.city}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {hospital.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => onOpenViewHospital(hospital)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-brand-teal-800 bg-brand-teal-50 hover:bg-brand-teal-100 border border-brand-teal-200 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenEditHospital(hospital)}
                            className="p-1.5 rounded-lg text-brand-slate-600 hover:bg-brand-slate-100 border border-brand-slate-200 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleHospitalStatus(hospital)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isActive
                                ? 'text-red-600 hover:bg-red-50 border-red-200'
                                : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
                            }`}
                            title={isActive ? 'Deactivate' : 'Activate'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
