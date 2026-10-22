import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  CheckCircle2,
  XCircle,
  Building2,
  ShieldCheck,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  MapPin,
  IndianRupee,
  Check
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function EquipmentCatalogueView({
  equipment = [],
  categories = [],
  onSelectEquipment,
  onAddEquipment,
  onUpdateEquipmentStatus
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // New Equipment Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hospital Beds',
    description: '',
    rentalType: 'Daily / Monthly',
    startingPrice: '',
    deposit: '',
    deliveryCharge: '',
    installationCharge: '',
    state: 'Maharashtra',
    city: 'Mumbai',
    areasServed: 'Mumbai Metro, Thane, Navi Mumbai',
    specifications: '',
    status: 'Active'
  });

  const categoryList = [
    'All',
    'Hospital Beds',
    'Wheelchairs',
    'Oxygen Equipment',
    'Patient Care Equipment',
    'Mobility Equipment',
    'Monitoring Equipment',
    'Other Equipment'
  ];

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && item.status === 'Active') ||
      (statusFilter === 'Inactive' && item.status === 'Inactive');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Hospital Beds',
      description: '',
      rentalType: 'Daily / Monthly',
      startingPrice: '',
      deposit: '',
      deliveryCharge: '',
      installationCharge: '',
      state: 'Maharashtra',
      city: 'Mumbai',
      areasServed: 'Mumbai Metro, Thane, Navi Mumbai',
      specifications: '',
      status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description || '',
      rentalType: item.rentalType || 'Daily / Monthly',
      startingPrice: item.startingPrice || item.pricePerMonth || '',
      deposit: item.deposit || '',
      deliveryCharge: item.deliveryCharge || '',
      installationCharge: item.installationCharge || '',
      state: item.state || 'Maharashtra',
      city: item.city || 'Mumbai',
      areasServed: item.serviceArea || 'Mumbai Metro, Pune, Bengaluru',
      specifications: Array.isArray(item.specifications) ? item.specifications.join(', ') : (item.specifications || ''),
      status: item.status || 'Active'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveEquipment = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startingPrice) return;

    if (onAddEquipment) {
      onAddEquipment({
        ...formData,
        id: editingItem ? editingItem.id : `EQ-${Date.now().toString().slice(-4)}`,
        startingPrice: Number(formData.startingPrice),
        deposit: Number(formData.deposit) || 0,
        deliveryCharge: Number(formData.deliveryCharge) || 0,
        installationCharge: Number(formData.installationCharge) || 0,
        serviceArea: formData.areasServed
      });
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <Boxes className="w-7 h-7 text-brand-teal-600" />
            Equipment Catalogue
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Master directory of healthcare equipment presented across MediUnify patient channels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-teal-600 text-white rounded-xl hover:bg-brand-teal-700 text-sm font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Equipment
          </button>
        </div>
      </div>

      {/* Ownership & Model Note */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-950">Marketplace Inventory Notice:</span> This catalogue represents standardized medical equipment SKUs available through MediUnify's verified vendor network. Physical equipment is owned, maintained, sanitized and delivered exclusively by third-party partners.
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {categoryList.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-brand-navy-900 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{cat}</span>
              {cat === 'All' && (
                <span className="text-[10px] opacity-75">({equipment.length})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by equipment name, category, specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5">Equipment</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Starting Price</th>
                <th className="px-5 py-3.5">Deposit</th>
                <th className="px-5 py-3.5">Delivery / Install</th>
                <th className="px-5 py-3.5">Service Area</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-normal">
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-teal-50 border border-brand-teal-100 flex items-center justify-center text-brand-teal-700 font-bold text-xs flex-shrink-0">
                          {item.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div
                            onClick={() => onSelectEquipment && onSelectEquipment(item)}
                            className="font-semibold text-gray-900 hover:text-brand-teal-600 cursor-pointer transition-colors line-clamp-1"
                          >
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-400 line-clamp-1 max-w-xs">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      ₹{(item.startingPrice || item.pricePerMonth || 0).toLocaleString()}
                      <span className="text-[11px] text-gray-400 font-normal ml-1">/mo</span>
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      ₹{(item.deposit || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs text-gray-700">
                        ₹{item.deliveryCharge || 0} del.
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {item.installationCharge ? `₹${item.installationCharge} install` : 'Free install'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="line-clamp-1 max-w-[140px]">{item.serviceArea || 'Metro Hubs'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={item.status || 'Active'} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectEquipment && onSelectEquipment(item)}
                          title="View Details"
                          className="p-1.5 text-gray-500 hover:text-brand-teal-600 hover:bg-brand-teal-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Equipment"
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {item.status === 'Active' ? (
                          <button
                            onClick={() => onUpdateEquipmentStatus && onUpdateEquipmentStatus(item.id, 'Inactive')}
                            title="Deactivate"
                            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateEquipmentStatus && onUpdateEquipmentStatus(item.id, 'Active')}
                            title="Activate"
                            className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                    <Boxes className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-base font-semibold text-gray-700">No equipment found</p>
                    <p className="text-xs text-gray-400 mt-1">Try changing search query or category filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Boxes className="w-5 h-5 text-brand-teal-600" />
                {editingItem ? 'Edit Equipment SKU' : 'Add New Equipment to Catalogue'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEquipment} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. 5-Function Electric ICU Bed"
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
                  >
                    <option value="Hospital Beds">Hospital Beds</option>
                    <option value="Wheelchairs">Wheelchairs</option>
                    <option value="Oxygen Equipment">Oxygen Equipment</option>
                    <option value="Patient Care Equipment">Patient Care Equipment</option>
                    <option value="Mobility Equipment">Mobility Equipment</option>
                    <option value="Monitoring Equipment">Monitoring Equipment</option>
                    <option value="Other Equipment">Other Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Rental Type</label>
                  <input
                    type="text"
                    value={formData.rentalType}
                    onChange={(e) => setFormData({ ...formData, rentalType: e.target.value })}
                    placeholder="e.g. Daily / Weekly / Monthly"
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Key medical purpose, standard configuration, hygiene guarantee..."
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Starting Price (₹/month) *</label>
                  <input
                    type="number"
                    required
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                    placeholder="e.g. 4500"
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    placeholder="e.g. 2000"
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Charge (₹)</label>
                  <input
                    type="number"
                    value={formData.deliveryCharge}
                    onChange={(e) => setFormData({ ...formData, deliveryCharge: e.target.value })}
                    placeholder="e.g. 500"
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Installation Charge (₹)</label>
                  <input
                    type="number"
                    value={formData.installationCharge}
                    onChange={(e) => setFormData({ ...formData, installationCharge: e.target.value })}
                    placeholder="e.g. 300 (0 for free)"
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Primary State & City</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                      className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                    />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Areas Served</label>
                  <input
                    type="text"
                    value={formData.areasServed}
                    onChange={(e) => setFormData({ ...formData, areasServed: e.target.value })}
                    placeholder="e.g. Mumbai Metro, Thane, Navi Mumbai"
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Specifications (comma separated)</label>
                  <input
                    type="text"
                    value={formData.specifications}
                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                    placeholder="e.g. Max Load: 250kg, Remote Controlled, Battery Backup"
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-teal-600 text-white rounded-xl hover:bg-brand-teal-700 text-sm font-semibold shadow-sm"
                >
                  {editingItem ? 'Update Equipment' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
