import React, { useState, useMemo } from 'react';
import {
  Stethoscope,
  Search,
  Filter,
  Eye,
  Edit2,
  Power,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Calendar,
  Syringe,
  Pill,
  Bandage,
  Activity,
  Droplet,
  ShieldAlert,
  Bed,
  HeartHandshake,
  Hospital,
  FileQuestion
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/forms/FormInput';
import SelectInput from '../../../components/forms/SelectInput';

export default function ServiceManagementView({
  services,
  onToggleServiceActive,
  onUpdateService,
  onOpenServiceDetails
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({
    availability: '',
    baseRate: 0,
    isActive: true,
    description: ''
  });

  const categories = useMemo(() => {
    const cats = new Set(services.map((s) => s.category));
    return ['All Categories', ...Array.from(cats)];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = categoryFilter === 'All Categories' || s.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [services, searchTerm, categoryFilter]);

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    setEditForm({
      availability: srv.availability,
      baseRate: srv.baseRate,
      isActive: srv.isActive,
      description: srv.description
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingService) return;
    onUpdateService(editingService.id, {
      ...editingService,
      availability: editForm.availability,
      baseRate: Number(editForm.baseRate),
      isActive: editForm.isActive,
      description: editForm.description
    });
    setEditingService(null);
  };

  const getServiceIcon = (name) => {
    switch (name) {
      case 'Injection Administration':
        return <Syringe className="w-5 h-5 text-brand-teal-600" />;
      case 'Medication Administration':
        return <Pill className="w-5 h-5 text-brand-green-600" />;
      case 'Wound Dressing':
        return <Bandage className="w-5 h-5 text-amber-600" />;
      case 'Vital Monitoring':
        return <Activity className="w-5 h-5 text-brand-teal-600" />;
      case 'Blood Sugar Monitoring':
        return <Droplet className="w-5 h-5 text-rose-600" />;
      case 'Post-Operative Nursing':
        return <Stethoscope className="w-5 h-5 text-indigo-600" />;
      case 'Catheter Care':
        return <ShieldAlert className="w-5 h-5 text-purple-600" />;
      case 'Bedridden Patient Care':
        return <Bed className="w-5 h-5 text-amber-700" />;
      case 'Elderly Nursing Support':
        return <HeartHandshake className="w-5 h-5 text-brand-green-700" />;
      case 'Post-Hospitalisation Care':
        return <Hospital className="w-5 h-5 text-sky-600" />;
      default:
        return <FileQuestion className="w-5 h-5 text-brand-teal-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-brand-navy-900">
      {/* Top Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight">
              Nursing Service Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-brand-green-50 text-brand-green-800 border border-brand-green-200">
              {services.length} Core Services
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate-600 mt-1">
            Configure availability, active status, rates, and inspect live request telemetry for all 11 patient-side services.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-brand-slate-100 rounded-xl border border-brand-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-brand-navy-950 shadow-xs'
                  : 'text-brand-slate-500 hover:text-brand-navy-900'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-brand-navy-950 shadow-xs'
                  : 'text-brand-slate-500 hover:text-brand-navy-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search nursing service by name, category, clinical protocol..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 text-brand-navy-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by Service Category"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Section 1: Services Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                srv.isActive
                  ? 'bg-white border-brand-slate-200/90 shadow-subtle hover:shadow-md'
                  : 'bg-brand-slate-50/90 border-brand-slate-300/80 opacity-75'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-brand-slate-50 border border-brand-slate-200 shadow-2xs">
                    {getServiceIcon(srv.name)}
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      srv.isActive
                        ? 'bg-brand-green-50 text-brand-green-800 border-brand-green-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {srv.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 className="text-base font-black text-brand-navy-950 tracking-tight">
                  {srv.name}
                </h3>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-slate-100 text-brand-slate-600 border border-brand-slate-200">
                  {srv.category}
                </span>

                <p className="text-xs text-brand-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {srv.description}
                </p>

                {/* Availability Info */}
                <div className="mt-3 pt-3 border-t border-brand-slate-100 flex items-center justify-between text-xs">
                  <span className="text-brand-slate-500 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-slate-400" />
                    {srv.availability}
                  </span>
                  {srv.baseRate > 0 && (
                    <span className="font-mono font-black text-brand-teal-700">
                      ₹{srv.baseRate}
                    </span>
                  )}
                </div>

                {/* Telemetry Badge Row */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-brand-slate-100 text-center">
                  <div className="p-1.5 rounded-lg bg-brand-slate-50 border border-brand-slate-200">
                    <span className="text-[10px] text-brand-slate-500 font-bold block">Requests</span>
                    <span className="font-black text-brand-navy-950 text-xs">{srv.totalRequests}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="text-[10px] text-amber-700 font-bold block">Pending</span>
                    <span className="font-black text-amber-900 text-xs">{srv.pendingRequests}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-purple-50 border border-purple-200">
                    <span className="text-[10px] text-purple-700 font-bold block">Scheduled</span>
                    <span className="font-black text-purple-900 text-xs">{srv.scheduledVisits}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-brand-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenServiceDetails(srv)}
                  className="px-3 py-1.5 text-xs font-bold text-brand-green-800 bg-brand-green-50 hover:bg-brand-green-100 border border-brand-green-200 rounded-xl transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>View Details</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="p-1.5 rounded-lg text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100 transition-colors"
                    title="Edit Service Configuration"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onToggleServiceActive(srv.id)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors ${
                      srv.isActive
                        ? 'text-rose-700 hover:bg-rose-50 border-rose-200'
                        : 'text-brand-green-700 hover:bg-brand-green-50 border-brand-green-200'
                    }`}
                    title={srv.isActive ? 'Deactivate Service' : 'Activate Service'}
                  >
                    <Power className="w-3 h-3 inline mr-1" />
                    <span>{srv.isActive ? 'Deactivate' : 'Activate'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Section 1: Table View */
        <div className="bg-white rounded-2xl border border-brand-slate-200/90 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-brand-slate-50 border-b border-brand-slate-200/80 text-[11px] font-bold text-brand-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Service Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Requests</th>
                  <th className="py-3 px-4 text-right">Pending</th>
                  <th className="py-3 px-4 text-right">Scheduled</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100">
                {filteredServices.map((srv) => (
                  <tr
                    key={srv.id}
                    className="hover:bg-brand-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-brand-navy-950 text-xs sm:text-sm">
                        {srv.name}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-200">
                        {srv.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-brand-slate-600 text-xs">
                      {srv.availability}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                          srv.isActive
                            ? 'bg-brand-green-50 text-brand-green-800 border-brand-green-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {srv.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-brand-navy-950">
                      {srv.totalRequests}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-amber-700">
                      {srv.pendingRequests}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-purple-700">
                      {srv.scheduledVisits}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenServiceDetails(srv)}
                          className="px-2.5 py-1 text-xs font-bold text-brand-green-800 bg-brand-green-50 hover:bg-brand-green-100 border border-brand-green-200 rounded-lg transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleOpenEdit(srv)}
                          className="px-2.5 py-1 text-xs font-bold text-brand-slate-700 bg-brand-slate-100 hover:bg-brand-slate-200 border border-brand-slate-200 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onToggleServiceActive(srv.id)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors ${
                            srv.isActive
                              ? 'text-rose-700 hover:bg-rose-50 border-rose-200'
                              : 'text-brand-green-700 hover:bg-brand-green-50 border-brand-green-200'
                          }`}
                        >
                          {srv.isActive ? 'Deactivate' : 'Activate'}
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

      {/* Edit Service Modal */}
      {editingService && (
        <Modal
          isOpen={!!editingService}
          onClose={() => setEditingService(null)}
          title={`Edit Service — ${editingService.name}`}
          subtitle="Update availability schedule and active status"
          maxWidth="max-w-md"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-service-form"
                className="px-4 py-2 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-xs"
              >
                Save Changes
              </button>
            </div>
          }
        >
          <form id="edit-service-form" onSubmit={handleSaveEdit} className="space-y-3 text-xs sm:text-sm text-brand-navy-900">
            <FormInput
              label="Availability Schedule"
              id="availability"
              value={editForm.availability}
              onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })}
              placeholder="e.g. 24x7 / Scheduled Daily"
              required
            />

            <FormInput
              label="Base Service Charge (₹)"
              id="baseRate"
              type="number"
              value={editForm.baseRate}
              onChange={(e) => setEditForm({ ...editForm, baseRate: e.target.value })}
              placeholder="0 for custom quote"
            />

            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-brand-navy-950 block">Service Active Status</span>
                <span className="text-[11px] text-brand-slate-500">
                  {editForm.isActive ? 'Active for new bookings' : 'Inactive (existing bookings retained)'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={editForm.isActive}
                onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                className="w-4 h-4 text-brand-green-600 rounded focus:ring-brand-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                Description / Scope
              </label>
              <textarea
                rows="3"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 text-brand-navy-900"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
