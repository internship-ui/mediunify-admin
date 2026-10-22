import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Plus,
  Edit3,
  Power,
  Building2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/forms/FormInput';
import SelectInput from '../../../components/forms/SelectInput';

export default function LocationsView({
  locations = [],
  onSaveLocation,
  onToggleLocationStatus
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  const initialFormState = {
    city: 'Mysuru',
    area: 'Jayalakshmipuram & Vani Vilas',
    state: 'Karnataka',
    pincode: '570012',
    centresCount: 1,
    activeServicesCount: 6,
    status: 'Active'
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setEditingLocation(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (loc) => {
    setEditingLocation(loc);
    setFormData({ ...loc });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.city || !formData.area) return;

    const payload = {
      ...formData,
      id: editingLocation ? editingLocation.id : `LOC-${String(Date.now()).slice(-3)}`,
      centresCount: Number(formData.centresCount || 1),
      activeServicesCount: Number(formData.activeServicesCount || 5)
    };

    onSaveLocation(payload, Boolean(editingLocation));
    setIsModalOpen(false);
  };

  const filteredLocations = locations.filter((loc) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      loc.city.toLowerCase().includes(q) ||
      loc.area.toLowerCase().includes(q) ||
      loc.state.toLowerCase().includes(q) ||
      (loc.pincode && loc.pincode.includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy-900 flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-brand-green-700" />
            Ayurveda Locations
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
            Manage geographical operational zones, city clusters and pincode coverage
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Location</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by city, area, state or pincode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 focus:border-brand-green-500"
          />
        </div>
      </div>

      {/* Locations Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-700">
            <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-4">City & Area</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Pincode</th>
                <th className="py-3 px-4">Ayurveda Centres</th>
                <th className="py-3 px-4">Active Services</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100 font-medium">
              {filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-brand-slate-400">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-brand-slate-300" />
                    <p className="font-semibold">No operational locations found.</p>
                  </td>
                </tr>
              ) : (
                filteredLocations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-brand-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-brand-navy-900 text-xs sm:text-sm">{loc.city}</div>
                      <div className="text-[11px] text-brand-slate-400">{loc.area}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-700">
                      {loc.state}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-brand-navy-900 font-semibold">
                      {loc.pincode}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-green-50 text-brand-green-800 text-[11px] font-bold border border-brand-green-200">
                        <Building2 className="w-3.5 h-3.5" />
                        {loc.centresCount} Centres
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-teal-50 text-brand-teal-800 text-[11px] font-bold border border-brand-teal-200">
                        <Sparkles className="w-3.5 h-3.5" />
                        {loc.activeServicesCount} Services
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={loc.status} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(loc)}
                          className="p-1.5 rounded-lg text-brand-slate-500 hover:text-brand-green-700 hover:bg-brand-slate-100 transition-colors"
                          title="Edit Location"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onToggleLocationStatus(loc.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            loc.status === 'Active'
                              ? 'text-brand-green-600 hover:text-brand-coral-600 hover:bg-brand-coral-50'
                              : 'text-brand-slate-400 hover:text-brand-green-600 hover:bg-brand-green-50'
                          }`}
                          title={loc.status === 'Active' ? 'Deactivate Location' : 'Activate Location'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Location Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLocation ? 'Edit Operational Location' : 'Add New Ayurveda Location'}
        subtitle="Define city cluster, local area name, and postal pincode"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-xs"
            >
              {editingLocation ? 'Save Changes' : 'Create Location'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <FormInput
            label="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="e.g. Mysuru"
            required
          />
          <FormInput
            label="Area / Neighborhood Cluster"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            placeholder="e.g. Jayalakshmipuram & Vani Vilas"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              placeholder="e.g. Karnataka"
              required
            />
            <FormInput
              label="Postal PIN Code"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              placeholder="e.g. 570012"
              required
            />
          </div>

          <SelectInput
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={['Active', 'Inactive']}
          />
        </form>
      </Modal>
    </div>
  );
}
