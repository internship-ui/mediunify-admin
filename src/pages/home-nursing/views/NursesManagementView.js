import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  AlertCircle,
  Eye,
  ShieldCheck,
  Award,
  ChevronDown,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import AddNurseModal from '../components/AddNurseModal';
import NurseDetailsModal from '../components/NurseDetailsModal';

export default function NursesManagementView({
  nurses = [],
  serviceTypes = [],
  onAddNurse,
  onUpdateStatus,
  onToggleAccountStatus,
  selectedNurseId = null,
  onSelectNurse
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [accountFilter, setAccountFilter] = useState('All');
  const [localityFilter, setLocalityFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeDetailsNurseId, setActiveDetailsNurseId] = useState(selectedNurseId || null);

  // Extract unique localities
  const localities = Array.from(new Set(nurses.map((n) => n.locality).filter(Boolean)));

  // Filtered nurses
  const filteredNurses = useMemo(() => {
    return nurses.filter((nurse) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        nurse.name.toLowerCase().includes(searchLower) ||
        nurse.specialization.toLowerCase().includes(searchLower) ||
        nurse.locality.toLowerCase().includes(searchLower) ||
        nurse.phone.includes(searchTerm);

      const matchesStatus = statusFilter === 'All' || nurse.status === statusFilter;
      const matchesService =
        serviceFilter === 'All' ||
        (nurse.services || []).some((s) => s.toLowerCase() === serviceFilter.toLowerCase());
      const matchesAccount = accountFilter === 'All' || nurse.accountStatus === accountFilter;
      const matchesLocality = localityFilter === 'All' || nurse.locality === localityFilter;

      return matchesSearch && matchesStatus && matchesService && matchesAccount && matchesLocality;
    });
  }, [nurses, searchTerm, statusFilter, serviceFilter, accountFilter, localityFilter]);

  const activeDetailsNurse = nurses.find((n) => n.id === (activeDetailsNurseId || selectedNurseId));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-teal-600" />
            Registered Nurses Directory
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
            Manage registered nurses in Mysuru, verify clinical qualifications, and monitor availability for home care.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Nurse</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Search */}
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, specialization, locality, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-brand-slate-200 bg-brand-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-teal-500"
          />
        </div>

        {/* Status Filter */}
        <div className="lg:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-brand-slate-200 bg-brand-slate-50 text-brand-slate-700 focus:outline-hidden focus:border-brand-teal-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="BUSY">Busy</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>

        {/* Service Filter */}
        <div className="lg:col-span-3">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-brand-slate-200 bg-brand-slate-50 text-brand-slate-700 focus:outline-hidden focus:border-brand-teal-500 cursor-pointer"
          >
            <option value="All">All Services</option>
            {serviceTypes.map((srv) => (
              <option key={srv.id} value={srv.name}>
                {srv.name}
              </option>
            ))}
          </select>
        </div>

        {/* Locality Filter */}
        <div className="lg:col-span-2">
          <select
            value={localityFilter}
            onChange={(e) => setLocalityFilter(e.target.value)}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-brand-slate-200 bg-brand-slate-50 text-brand-slate-700 focus:outline-hidden focus:border-brand-teal-500 cursor-pointer"
          >
            <option value="All">All Mysuru Localities</option>
            {localities.map((loc, idx) => (
              <option key={idx} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Account Status Filter */}
        <div className="lg:col-span-1">
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="w-full text-xs py-2.5 px-2 rounded-xl border border-brand-slate-200 bg-brand-slate-50 text-brand-slate-700 focus:outline-hidden focus:border-brand-teal-500 cursor-pointer"
          >
            <option value="All">Account</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Nurses Table & Cards */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        {filteredNurses.length === 0 ? (
          <div className="py-16 text-center text-brand-slate-500">
            <Users className="w-12 h-12 text-brand-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-brand-slate-700">No registered nurses found</h3>
            <p className="text-xs text-brand-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or add a new nurse.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-slate-50/80 border-b border-brand-slate-200 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500">
                    <th className="py-3.5 px-4">Nurse Profile</th>
                    <th className="py-3.5 px-4">Specialization & Services</th>
                    <th className="py-3.5 px-4">Registered Location</th>
                    <th className="py-3.5 px-4">Current Status</th>
                    <th className="py-3.5 px-4">Upcoming Booking</th>
                    <th className="py-3.5 px-4">Account Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100 text-xs">
                  {filteredNurses.map((nurse) => (
                    <tr
                      key={nurse.id}
                      onClick={() => {
                        setActiveDetailsNurseId(nurse.id);
                        if (onSelectNurse) onSelectNurse(nurse.id);
                      }}
                      className="hover:bg-brand-teal-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Nurse Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-teal-100 text-brand-teal-800 font-extrabold flex items-center justify-center text-sm border border-brand-teal-200 flex-shrink-0">
                            {nurse.name.split(' ')[1]?.[0] || 'N'}
                          </div>
                          <div>
                            <span className="font-bold text-brand-slate-900 group-hover:text-brand-teal-800 block">
                              {nurse.name}
                            </span>
                            <span className="text-[11px] text-brand-slate-500">{nurse.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Specialization & Services */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-semibold text-brand-slate-800 block text-xs">
                          {nurse.specialization}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {nurse.services?.slice(0, 3).map((srv, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-1.5 py-0.2 rounded bg-brand-slate-100 text-brand-slate-600 border border-brand-slate-200"
                            >
                              {srv}
                            </span>
                          ))}
                          {(nurse.services?.length || 0) > 3 && (
                            <span className="text-[10px] text-brand-slate-400 font-bold">
                              +{(nurse.services?.length || 0) - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-brand-teal-800 block">{nurse.locality}</span>
                        <span className="text-[11px] text-brand-slate-500 truncate max-w-[180px] block">
                          {nurse.address}
                        </span>
                      </td>

                      {/* Current Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            nurse.status === 'AVAILABLE'
                              ? 'bg-brand-green-100 text-brand-green-800'
                              : nurse.status === 'BUSY'
                              ? 'bg-brand-coral-100 text-brand-coral-800'
                              : nurse.status === 'SCHEDULED'
                              ? 'bg-brand-navy-100 text-brand-navy-800'
                              : 'bg-brand-slate-100 text-brand-slate-600'
                          }`}
                        >
                          {nurse.status}
                        </span>
                      </td>

                      {/* Upcoming Booking */}
                      <td className="py-3.5 px-4">
                        {nurse.nextBooking ? (
                          <div>
                            <span className="font-bold text-brand-slate-800 text-[11px] block">
                              {nurse.nextBooking.service}
                            </span>
                            <span className="text-[10px] text-brand-slate-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-brand-slate-400" />
                              {nurse.nextBooking.date}, {nurse.nextBooking.time}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-brand-green-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-brand-green-600" />
                            No Conflict (Open)
                          </span>
                        )}
                      </td>

                      {/* Account Status */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleAccountStatus(nurse.id);
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-colors ${
                            nurse.accountStatus === 'Active'
                              ? 'bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200 hover:bg-brand-teal-100'
                              : 'bg-brand-slate-100 text-brand-slate-600 border border-brand-slate-200 hover:bg-brand-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${nurse.accountStatus === 'Active' ? 'bg-brand-teal-600' : 'bg-brand-slate-400'}`} />
                          {nurse.accountStatus}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDetailsNurseId(nurse.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-brand-teal-600 hover:text-white text-brand-teal-700 font-semibold text-xs border border-brand-teal-200 transition-colors inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Small Screen Card Grid */}
            <div className="md:hidden divide-y divide-brand-slate-100 p-3 space-y-3">
              {filteredNurses.map((nurse) => (
                <div
                  key={nurse.id}
                  onClick={() => setActiveDetailsNurseId(nurse.id)}
                  className="bg-brand-slate-50/70 p-4 rounded-xl border border-brand-slate-200 space-y-2 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-brand-teal-100 text-brand-teal-800 font-bold text-xs flex items-center justify-center">
                        {nurse.name.split(' ')[1]?.[0] || 'N'}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-brand-slate-900">{nurse.name}</h3>
                        <p className="text-[11px] text-brand-slate-500">{nurse.specialization}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        nurse.status === 'AVAILABLE'
                          ? 'bg-brand-green-100 text-brand-green-800'
                          : 'bg-brand-slate-200 text-brand-slate-700'
                      }`}
                    >
                      {nurse.status}
                    </span>
                  </div>

                  <div className="text-xs text-brand-slate-600 space-y-1 pt-1">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-slate-400" />
                      {nurse.locality}, Mysuru
                    </p>
                    <p className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-brand-slate-400" />
                      {nurse.phone}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-brand-slate-200 flex items-center justify-between text-xs">
                    <span className="text-brand-slate-500">Account: <strong>{nurse.accountStatus}</strong></span>
                    <span className="text-brand-teal-700 font-bold">View Profile &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Nurse Modal */}
      <AddNurseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddNurse={onAddNurse}
        serviceTypes={serviceTypes}
      />

      {/* Nurse Details Modal */}
      {activeDetailsNurse && (
        <NurseDetailsModal
          nurse={activeDetailsNurse}
          onClose={() => {
            setActiveDetailsNurseId(null);
            if (onSelectNurse) onSelectNurse(null);
          }}
          onUpdateStatus={onUpdateStatus}
          onToggleAccountStatus={onToggleAccountStatus}
        />
      )}
    </div>
  );
}
