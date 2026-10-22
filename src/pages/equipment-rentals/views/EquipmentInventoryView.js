import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  IndianRupee,
  Layers,
  Eye,
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import AddEquipmentModal from '../components/AddEquipmentModal';
import { EQUIPMENT_CATEGORIES } from '../../../data/equipmentRentalData';

export default function EquipmentInventoryView({
  equipmentList = [],
  vendors = [],
  onAddEquipment,
  onUpdateEquipmentAvailability
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEquipmentDetail, setSelectedEquipmentDetail] = useState(null);

  const filteredEquipment = equipmentList.filter((eq) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (eq.name || '').toLowerCase().includes(q) ||
      (eq.id || '').toLowerCase().includes(q) ||
      (eq.vendor || '').toLowerCase().includes(q) ||
      (eq.category || '').toLowerCase().includes(q) ||
      (eq.features || '').toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'All Categories' || eq.category === selectedCategory;

    const matchesAvailability =
      selectedAvailability === 'All' || eq.availability === selectedAvailability;

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const availableUnits = equipmentList.filter((e) => e.availability === 'Available').length;
  const rentedUnits = equipmentList.filter((e) => e.availability === 'Currently Rented').length;
  const totalUnits = equipmentList.reduce((acc, e) => acc + (e.stockTotal || 10), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy-900 tracking-tight flex items-center gap-2.5">
            <Boxes className="w-7 h-7 text-brand-teal-700" />
            Medical Equipment Inventory
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-1">
            Browse hospital-grade medical equipment catalog, stock availability, and supplier mappings.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-brand-teal-700 hover:bg-brand-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-2 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Equipment Item</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs">
          <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Catalog Items</span>
          <span className="text-2xl font-extrabold text-brand-navy-900 mt-1 block font-mono">
            {equipmentList.length}
          </span>
          <span className="text-[11px] text-brand-slate-500 font-medium">10 medical categories</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs">
          <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Ready for Dispatch</span>
          <span className="text-2xl font-extrabold text-brand-green-700 mt-1 block font-mono">
            {availableUnits} Items
          </span>
          <span className="text-[11px] text-brand-green-600 font-medium">Sanitized & in stock</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs">
          <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Currently Deployed</span>
          <span className="text-2xl font-extrabold text-brand-teal-700 mt-1 block font-mono">
            {rentedUnits} Items
          </span>
          <span className="text-[11px] text-brand-teal-600 font-medium">On active patient rentals</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs">
          <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Total Physical Units</span>
          <span className="text-2xl font-extrabold text-brand-navy-900 mt-1 block font-mono">
            {totalUnits}+
          </span>
          <span className="text-[11px] text-brand-slate-500 font-medium">Across 8 vendor hubs</span>
        </div>
      </div>

      {/* Category Pills (Requirement 14) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {EQUIPMENT_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-teal-700 text-white shadow-xs'
                  : 'bg-white text-brand-slate-600 hover:bg-brand-slate-50 border border-brand-slate-200/90'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search & Availability Filter */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equipment by name, ID, vendor, or specifications..."
            className="w-full pl-10 pr-4 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-brand-slate-400 uppercase">Availability:</span>
          <select
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
            className="px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl text-xs font-semibold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
          >
            <option value="All">All Availabilities</option>
            <option value="Available">Available</option>
            <option value="Currently Rented">Currently Rented</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Equipment Table (Requirement 14) */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-600">
            <thead className="bg-brand-slate-50/90 text-[11px] font-bold text-brand-slate-700 uppercase tracking-wider border-b border-brand-slate-200">
              <tr>
                <th className="px-4 py-3">Equipment ID</th>
                <th className="px-4 py-3">Equipment Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Vendor Partner</th>
                <th className="px-4 py-3">Availability</th>
                <th className="px-4 py-3">Rental Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredEquipment.map((eq) => (
                <tr
                  key={eq.id}
                  onClick={() => setSelectedEquipmentDetail(eq)}
                  className="hover:bg-brand-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3.5 font-mono font-bold text-brand-navy-900">
                    {eq.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-brand-navy-900 group-hover:text-brand-teal-700 transition-colors">
                      {eq.name}
                    </div>
                    <div className="text-[11px] text-brand-slate-400 line-clamp-1 max-w-[280px]">
                      {eq.features}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-brand-slate-100 text-brand-slate-700 rounded-lg font-semibold text-[11px]">
                      {eq.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-brand-teal-700 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-brand-teal-600" />
                      <span>{eq.vendor}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={eq.availability || 'Available'} size="xs" />
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-extrabold text-brand-navy-900 text-xs">
                      ₹{Number(eq.rentalPrice || 1500).toLocaleString()}{' '}
                      <span className="text-[10px] text-brand-slate-400 font-normal">/mo</span>
                    </div>
                    <span className="text-[10px] text-brand-slate-400">
                      ₹{eq.dailyRate || Math.round((eq.rentalPrice || 1500) / 15)}/day
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={eq.status || 'Active'} size="xs" />
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEquipmentDetail(eq);
                      }}
                      className="px-3 py-1.5 bg-brand-teal-50 hover:bg-brand-teal-600 text-brand-teal-700 hover:text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 shadow-2xs group-hover:scale-105"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Details Modal */}
      {selectedEquipmentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up">
            <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between bg-brand-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200 flex items-center justify-center">
                  <Boxes className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy-900 text-sm">
                    {selectedEquipmentDetail.name}
                  </h3>
                  <p className="text-[11px] text-brand-slate-500">
                    ID: {selectedEquipmentDetail.id} • Category: {selectedEquipmentDetail.category}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEquipmentDetail(null)}
                className="text-brand-slate-400 hover:text-brand-slate-700 p-1.5 rounded-lg hover:bg-brand-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100">
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Rental Price</span>
                  <span className="text-base font-extrabold text-brand-teal-700 mt-0.5 block">
                    ₹{Number(selectedEquipmentDetail.rentalPrice).toLocaleString()} / month
                  </span>
                  <span className="text-[10px] text-brand-slate-400">₹{selectedEquipmentDetail.dailyRate}/day</span>
                </div>

                <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-100">
                  <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Stock Status</span>
                  <span className="text-sm font-bold text-brand-navy-900 mt-0.5 block">
                    {selectedEquipmentDetail.stockTotal} Units Total
                  </span>
                  <span className="text-[10px] text-brand-green-700 font-semibold">{selectedEquipmentDetail.availability}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-brand-slate-50 border border-brand-slate-200 space-y-1.5">
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Supplying Partner</span>
                <p className="font-bold text-brand-navy-900 text-sm">{selectedEquipmentDetail.vendor}</p>
                <p className="text-brand-slate-500 text-[11px]">Sanitized & calibrated in accordance with ISO medical standards.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-teal-50/40 border border-brand-teal-200 space-y-1">
                <span className="text-[10px] text-brand-teal-900 font-bold uppercase block">Features & Technical Specs</span>
                <p className="text-brand-slate-700 leading-relaxed font-medium">
                  {selectedEquipmentDetail.features}
                </p>
              </div>
            </div>

            <div className="p-4 bg-brand-slate-50 border-t border-brand-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedEquipmentDetail(null)}
                className="px-4 py-2 text-xs font-bold text-brand-slate-600 hover:bg-brand-slate-200 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      <AddEquipmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        vendors={vendors}
        onAddEquipment={onAddEquipment}
      />
    </div>
  );
}
