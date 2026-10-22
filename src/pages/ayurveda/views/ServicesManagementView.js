import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Plus,
  Eye,
  Edit3,
  Power,
  CheckCircle2,
  Clock,
  Filter,
  Building2,
  FileText
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/forms/FormInput';
import SelectInput from '../../../components/forms/SelectInput';

export const SERVICE_CATEGORIES = [
  'All Categories',
  'Ayurveda Consultation',
  'Panchakarma',
  'Ayurvedic Therapies',
  'Wellness Programs',
  'Yoga',
  'Nutrition & Lifestyle',
  'Other Services'
];

export default function ServicesManagementView({
  services = [],
  centres = [],
  onSaveService,
  onToggleServiceStatus
}) {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCentreFilter, setSelectedCentreFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [viewingService, setViewingService] = useState(null);

  // Form State
  const initialFormState = {
    name: '',
    category: 'Panchakarma',
    centreId: centres[0]?.id || 'AYU-CTR-001',
    centreName: centres[0]?.name || 'Sanjeevani Ayurveda Wellness Centre',
    description: '',
    duration: '60 mins',
    startingPrice: 1500,
    consultationFee: 0,
    availability: 'Mon - Sat',
    image: '',
    status: 'Active',
    indications: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    setFormData({ ...srv });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startingPrice) return;

    const matchedCentre = centres.find((c) => c.id === formData.centreId);
    const payload = {
      ...formData,
      id: editingService ? editingService.id : `AYU-SRV-${String(Date.now()).slice(-4)}`,
      centreName: matchedCentre ? matchedCentre.name : formData.centreName,
      startingPrice: Number(formData.startingPrice),
      consultationFee: Number(formData.consultationFee || 0)
    };

    onSaveService(payload, Boolean(editingService));
    setIsModalOpen(false);
  };

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      // Category
      if (selectedCategory !== 'All Categories' && srv.category !== selectedCategory) {
        return false;
      }

      // Centre
      if (selectedCentreFilter !== 'ALL' && srv.centreId !== selectedCentreFilter && srv.centreName !== selectedCentreFilter) {
        return false;
      }

      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          srv.name.toLowerCase().includes(q) ||
          srv.category.toLowerCase().includes(q) ||
          (srv.centreName && srv.centreName.toLowerCase().includes(q)) ||
          (srv.description && srv.description.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [services, selectedCategory, selectedCentreFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy-900 flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-brand-teal-600" />
            Ayurveda Services
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
            Manage treatments, classical panchakarma therapies, wellness retreats and consultations
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {SERVICE_CATEGORIES.map((cat) => {
          const count = cat === 'All Categories' ? services.length : services.filter((s) => s.category === cat).length;
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-brand-teal-600 text-white shadow-xs'
                  : 'bg-white text-brand-slate-600 hover:bg-brand-slate-100 border border-brand-slate-200'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-brand-teal-800 text-brand-teal-100' : 'bg-brand-slate-100 text-brand-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Centre Filter Bar */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search service name, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
          />
        </div>

        <div>
          <select
            value={selectedCentreFilter}
            onChange={(e) => setSelectedCentreFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white text-brand-slate-700 font-medium"
          >
            <option value="ALL">All Associated Centres</option>
            {centres.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-700">
            <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Centre</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Starting Price</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100 font-medium">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-brand-slate-400">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-brand-slate-300" />
                    <p className="font-semibold">No Ayurveda services found.</p>
                  </td>
                </tr>
              ) : (
                filteredServices.map((srv) => (
                  <tr key={srv.id} className="hover:bg-brand-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={srv.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100&auto=format&fit=crop&q=80'}
                          alt={srv.name}
                          className="w-10 h-10 rounded-xl object-cover border border-brand-slate-200 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-brand-navy-900 text-xs sm:text-sm">{srv.name}</p>
                          <p className="text-[11px] text-brand-slate-400 truncate max-w-xs sm:max-w-sm">{srv.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-brand-navy-900">
                      {srv.category}
                    </td>
                    <td className="py-3.5 px-4 max-w-[160px] truncate text-brand-slate-600">
                      {srv.centreName}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-600">
                      {srv.duration}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-extrabold text-brand-navy-900">
                      ₹{srv.startingPrice}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-600">
                      {srv.availability}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={srv.status} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setViewingService(srv)}
                          className="p-1.5 rounded-lg text-brand-slate-500 hover:text-brand-navy-900 hover:bg-brand-slate-100 transition-colors"
                          title="View Service Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(srv)}
                          className="p-1.5 rounded-lg text-brand-slate-500 hover:text-brand-teal-700 hover:bg-brand-slate-100 transition-colors"
                          title="Edit Service"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onToggleServiceStatus && onToggleServiceStatus(srv)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            srv.status === 'Active'
                              ? 'text-brand-green-600 hover:text-brand-coral-600 hover:bg-brand-coral-50'
                              : 'text-brand-slate-400 hover:text-brand-green-600 hover:bg-brand-green-50'
                          }`}
                          title={srv.status === 'Active' ? 'Deactivate Service' : 'Activate Service'}
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

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? `Edit Service: ${editingService.name}` : 'Add New Ayurveda Service'}
        subtitle="Specify therapeutic category, affiliated centre, duration, and session pricing"
        maxWidth="max-w-2xl"
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
              {editingService ? 'Save Changes' : 'Create Service'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <FormInput
            label="Service Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Classical Shirodhara with Ksheerabala"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectInput
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={SERVICE_CATEGORIES.filter((c) => c !== 'All Categories')}
              required
            />

            <div>
              <label className="block text-xs font-bold text-brand-navy-900 mb-1.5">
                Affiliated Centre
              </label>
              <select
                value={formData.centreId}
                onChange={(e) => {
                  const cId = e.target.value;
                  const cObj = centres.find((c) => c.id === cId);
                  setFormData({
                    ...formData,
                    centreId: cId,
                    centreName: cObj ? cObj.name : formData.centreName
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
          </div>

          <FormInput
            label="Service Description & Protocol"
            type="textarea"
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe method of application, herbal decoctions used, and patient benefits..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormInput
              label="Duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g. 60 mins"
              required
            />
            <FormInput
              label="Starting Price (₹)"
              type="number"
              value={formData.startingPrice}
              onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
              placeholder="1500"
              required
            />
            <FormInput
              label="Consultation Fee (₹)"
              type="number"
              value={formData.consultationFee}
              onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Availability Schedule"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              placeholder="e.g. Monday - Saturday"
            />
            <SelectInput
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={['Active', 'Inactive']}
            />
          </div>

          <FormInput
            label="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://... photo link"
          />

          <FormInput
            label="Clinical Indications / Target Symptoms"
            value={formData.indications}
            onChange={(e) => setFormData({ ...formData, indications: e.target.value })}
            placeholder="e.g. Insomnia, chronic stress, migraine relief"
          />
        </form>
      </Modal>

      {/* View Service Modal */}
      {viewingService && (
        <Modal
          isOpen={true}
          onClose={() => setViewingService(null)}
          title={viewingService.name}
          subtitle={`Category: ${viewingService.category} • Centre: ${viewingService.centreName}`}
          maxWidth="max-w-md"
          footer={
            <button
              onClick={() => setViewingService(null)}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-green-600 rounded-xl"
            >
              Close
            </button>
          }
        >
          <div className="space-y-3 text-xs text-brand-slate-700">
            <img
              src={viewingService.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&auto=format&fit=crop&q=80'}
              alt={viewingService.name}
              className="w-full h-44 rounded-xl object-cover border border-brand-slate-200"
            />
            <p className="leading-relaxed">{viewingService.description}</p>
            <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200 space-y-1.5">
              <p><span className="text-brand-slate-400">Duration:</span> <strong>{viewingService.duration}</strong></p>
              <p><span className="text-brand-slate-400">Price per Session:</span> <strong className="text-brand-green-700">₹{viewingService.startingPrice}</strong></p>
              <p><span className="text-brand-slate-400">Availability:</span> <strong>{viewingService.availability}</strong></p>
              {viewingService.indications && (
                <p><span className="text-brand-slate-400">Indications:</span> <span>{viewingService.indications}</span></p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
