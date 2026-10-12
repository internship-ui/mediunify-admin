import React, { useState } from 'react';
import {
  Stethoscope,
  Plus,
  Search,
  Edit2,
  CheckCircle2,
  Clock,
  DollarSign,
  Award,
  Layers,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

export default function ServiceTypesView({
  serviceTypes = [],
  onAddService,
  onUpdateService,
  onToggleServiceStatus
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formState, setFormState] = useState({
    name: '',
    category: 'Clinical Nursing',
    description: '',
    basePrice: 500,
    estimatedDuration: '45 Mins',
    requiredQualification: 'GNM / B.Sc Nursing',
    status: 'Active'
  });

  const categories = Array.from(new Set(serviceTypes.map((s) => s.category).filter(Boolean)));

  const filteredServices = serviceTypes.filter((service) => {
    const matchesSearch =
      !searchTerm ||
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || service.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenAddModal = () => {
    setFormState({
      name: '',
      category: 'Clinical Nursing',
      description: '',
      basePrice: 500,
      estimatedDuration: '45 Mins',
      requiredQualification: 'GNM / B.Sc Nursing',
      status: 'Active'
    });
    setEditingService(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setEditingService(service);
    setFormState({
      name: service.name,
      category: service.category || 'Clinical Nursing',
      description: service.description,
      basePrice: service.basePrice,
      estimatedDuration: service.estimatedDuration,
      requiredQualification: service.requiredQualification || 'GNM / B.Sc Nursing',
      status: service.status
    });
    setIsAddModalOpen(true);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!formState.name.trim()) return;

    if (editingService) {
      onUpdateService({
        ...editingService,
        ...formState,
        basePrice: Number(formState.basePrice)
      });
    } else {
      const newSrv = {
        id: `SRV-0${serviceTypes.length + 1}`,
        ...formState,
        basePrice: Number(formState.basePrice),
        popularCount: 0
      };
      onAddService(newSrv);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-brand-teal-600" />
            Home Care Service Types
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
            Configure catalog of home care and nursing procedures, set base prices, and manage active service offerings.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Care Service</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-8 relative">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-brand-slate-200 bg-brand-slate-50 focus:bg-white focus:outline-hidden focus:border-brand-teal-500"
          />
        </div>

        <div className="lg:col-span-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-brand-slate-200 bg-brand-slate-50 text-brand-slate-700 focus:outline-hidden focus:border-brand-teal-500 cursor-pointer"
          >
            <option value="All">All Categories ({serviceTypes.length})</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-brand-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                    {service.category || 'General Nursing'}
                  </span>
                  <h3 className="font-bold text-base text-brand-slate-900 mt-1.5 group-hover:text-brand-teal-700 transition-colors">
                    {service.name}
                  </h3>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    service.status === 'Active'
                      ? 'bg-brand-green-100 text-brand-green-800'
                      : 'bg-brand-slate-200 text-brand-slate-700'
                  }`}
                >
                  {service.status}
                </span>
              </div>

              <p className="text-xs text-brand-slate-600 mt-3 leading-relaxed min-h-[48px]">
                {service.description}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-brand-slate-100 text-xs">
                <div>
                  <span className="text-brand-slate-400 block text-[10px]">Base Price</span>
                  <span className="font-extrabold text-brand-slate-900 text-base">₹{service.basePrice}</span>
                </div>
                <div>
                  <span className="text-brand-slate-400 block text-[10px]">Estimated Duration</span>
                  <span className="font-semibold text-brand-slate-700 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-brand-slate-400" />
                    {service.estimatedDuration}
                  </span>
                </div>
              </div>

              <div className="mt-2 text-xs text-brand-slate-500">
                <span className="text-[10px] text-brand-slate-400 block">Required Qualification</span>
                <span className="font-medium text-brand-slate-700">{service.requiredQualification}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-brand-slate-100 flex items-center justify-between">
              <button
                onClick={() => onToggleServiceStatus(service.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  service.status === 'Active'
                    ? 'border-brand-slate-200 text-brand-slate-600 hover:bg-brand-slate-100'
                    : 'border-brand-teal-300 bg-brand-teal-50 text-brand-teal-800 hover:bg-brand-teal-100'
                }`}
              >
                {service.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>

              <button
                onClick={() => handleOpenEditModal(service)}
                className="px-3 py-1.5 rounded-lg bg-brand-teal-50 hover:bg-brand-teal-100 text-brand-teal-800 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border border-brand-teal-200"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-teal-100 text-brand-teal-800 flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-brand-slate-900">
                    {editingService ? 'Edit Home Care Service' : 'Add New Home Care Service'}
                  </h3>
                  <p className="text-xs text-brand-slate-500">Configure service specifications & pricing</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-brand-slate-400 hover:text-brand-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-brand-slate-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Wound Dressing"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-slate-700 mb-1">Category</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                  >
                    <option value="Clinical Nursing">Clinical Nursing</option>
                    <option value="General Care">General Care</option>
                    <option value="Wound & Surgical Care">Wound & Surgical Care</option>
                    <option value="Diagnostic & Monitoring">Diagnostic & Monitoring</option>
                    <option value="Long-Term & Geriatric">Long-Term & Geriatric</option>
                    <option value="Transitional Care">Transitional Care</option>
                    <option value="Specialized Protocols">Specialized Protocols</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-slate-700 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={formState.basePrice}
                    onChange={(e) => setFormState({ ...formState, totalPrice: e.target.value, basePrice: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe nursing procedure protocol..."
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-slate-700 mb-1">Estimated Duration</label>
                  <select
                    value={formState.estimatedDuration}
                    onChange={(e) => setFormState({ ...formState, estimatedDuration: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                  >
                    <option value="20 Mins">20 Mins</option>
                    <option value="30 Mins">30 Mins</option>
                    <option value="45 Mins">45 Mins</option>
                    <option value="60 Mins">60 Mins</option>
                    <option value="90 Mins">90 Mins</option>
                    <option value="120 Mins">120 Mins</option>
                    <option value="180 Mins">180 Mins</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-slate-700 mb-1">Status</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-brand-slate-300 focus:outline-hidden focus:border-brand-teal-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-brand-slate-300 text-brand-slate-600 hover:bg-brand-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-500 text-white font-bold shadow-sm"
                >
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
