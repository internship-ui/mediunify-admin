import React, { useState, useEffect } from 'react';
import {
  Pill,
  Warehouse,
  Plus,
  AlertTriangle,
  Clock,
  History,
  Layers,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Eye,
  Sliders,
  TrendingDown,
  RefreshCw,
  FileSpreadsheet,
  PackagePlus,
  ShieldAlert
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { PHARMACY_CATEGORIES } from '../../../data/pharmacyData';

export default function PharmacyInventoryView({
  medicines = [],
  batches = [],
  stockHistory = [],
  suppliers = [],
  initialSubTab = 'all',
  onOpenAddMedicine,
  onOpenAddStock,
  onOpenAdjustStock,
  onOpenMedicineDetails,
  onOpenImportExcel,
  isThirdParty = false
}) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSupplier, setSelectedSupplier] = useState('All');

  // Synchronize when initialSubTab prop changes (e.g. from Dashboard card click)
  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Filtered medicines for "All Medicines"
  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.genericName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.batchNumber || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'In Stock' && m.status === 'In Stock') ||
      (selectedStatus === 'Low Stock' && m.status === 'Low Stock') ||
      (selectedStatus === 'Out of Stock' && m.status === 'Out of Stock');
    const matchesSupplier = selectedSupplier === 'All' || m.supplier === selectedSupplier;

    return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
  });

  // Low Stock list (availableStock <= minimumStock or status == Low/Out of Stock)
  const lowStockMedicines = medicines.filter(
    (m) => m.status === 'Out of Stock' || m.status === 'Low Stock' || Number(m.availableStock) <= Number(m.minimumStock)
  );

  // Expiring Soon list (daysRemaining <= 90 or status Expiring Soon/Expired)
  const expiringMedicines = batches.filter(
    (b) => (b.daysRemaining !== undefined && b.daysRemaining <= 90) || b.status === 'Expiring Soon' || b.status === 'Expired'
  );

  // Sub-tab definitions
  const subTabs = [
    { id: 'all', label: 'All Medicines', count: medicines.length, icon: Pill },
    { id: 'low-stock', label: 'Low Stock', count: lowStockMedicines.length, icon: AlertTriangle, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'expiring', label: 'Expiring Soon', count: expiringMedicines.length, icon: Clock, badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'batches', label: 'Batch Management', count: batches.length, icon: Layers },
    { id: 'history', label: 'Stock History', count: stockHistory.length, icon: History }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-teal-50 text-brand-teal-700">
              <Warehouse className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-brand-navy-900">
                {isThirdParty ? 'Multiple Pharmacy Inventory Monitoring' : 'Inventory & Stock Management'}
              </h1>
              <p className="text-xs text-brand-slate-500">
                {isThirdParty
                  ? 'Monitor multiple pharmacy medicine catalog, stock levels, batches, and expiry records (Read-Only Monitoring)'
                  : 'Maintain Central Pharmacy catalog, batch records, stock adjustments, and expiry control'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isThirdParty ? (
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-2 text-xs font-bold text-brand-teal-800 bg-brand-teal-50 border border-brand-teal-200 rounded-xl flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Monitoring Mode Only (No Medicine Creation)</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onOpenAdjustStock()}
              className="px-3.5 py-2 text-xs font-bold text-brand-slate-700 bg-brand-slate-100 hover:bg-brand-slate-200 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Stock Adjustment</span>
            </button>
            <button
              onClick={() => onOpenImportExcel && onOpenImportExcel()}
              className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Upload supplier Excel sheet to bulk update stock"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Import Stock Excel</span>
            </button>
            <button
              onClick={() => onOpenAddStock()}
              className="px-3.5 py-2 text-xs font-bold text-brand-teal-800 bg-brand-teal-50 hover:bg-brand-teal-100 border border-brand-teal-200 rounded-xl transition-all flex items-center gap-1.5"
            >
              <PackagePlus className="w-4 h-4 text-brand-teal-700" />
              <span>+ Add Stock</span>
            </button>
            {onOpenAddMedicine && (
              <button
                onClick={() => onOpenAddMedicine()}
                className="px-4 py-2 text-xs font-bold text-white bg-brand-teal-700 hover:bg-brand-teal-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Medicine SKU</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-brand-slate-200">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-teal-700 text-white shadow-xs'
                  : 'text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-2 py-0.5 text-[11px] rounded-full font-mono ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.badgeColor || 'bg-brand-slate-200/70 text-brand-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. ALL MEDICINES SUB-TAB (Section 5) */}
      {activeSubTab === 'all' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search medicine name, ID, generic, batch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500 bg-brand-slate-50/50"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500 bg-brand-slate-50/50 text-brand-slate-700 font-medium"
                >
                  <option value="All">All Categories</option>
                  {PHARMACY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500 bg-brand-slate-50/50 text-brand-slate-700 font-medium"
                >
                  <option value="All">All Stock Statuses</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              {/* Supplier Filter */}
              <div>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500 bg-brand-slate-50/50 text-brand-slate-700 font-medium"
                >
                  <option value="All">All Suppliers</option>
                  {suppliers.map((sup) => (
                    <option key={sup.id || sup.name} value={sup.name}>
                      {sup.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All' || selectedSupplier !== 'All') && (
              <div className="flex items-center justify-between pt-2 border-t border-brand-slate-100 text-xs">
                <span className="text-brand-slate-500">
                  Showing <strong>{filteredMedicines.length}</strong> of {medicines.length} medicines
                </span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedStatus('All');
                    setSelectedSupplier('All');
                  }}
                  className="text-brand-teal-700 font-bold hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Medicines Master Table */}
          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-slate-50/80 border-b border-brand-slate-200 text-brand-slate-600 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-4">Medicine Name & ID</th>
                    <th className="py-3.5 px-3">Category</th>
                    <th className="py-3.5 px-3">Form & Strength</th>
                    <th className="py-3.5 px-3 text-right">Available Stock</th>
                    <th className="py-3.5 px-3 text-right">Min Stock</th>
                    <th className="py-3.5 px-3">Batch & Expiry</th>
                    <th className="py-3.5 px-3">Supplier</th>
                    <th className="py-3.5 px-3 text-right">Purchase (₹)</th>
                    <th className="py-3.5 px-3 text-right">Selling (₹)</th>
                    <th className="py-3.5 px-3 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100">
                  {filteredMedicines.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="py-12 text-center text-brand-slate-400">
                        <Pill className="w-8 h-8 mx-auto mb-2 opacity-40 text-brand-slate-400" />
                        <p className="font-bold text-sm text-brand-navy-900">No medicines found</p>
                        <p className="text-xs text-brand-slate-500 mt-0.5">Try adjusting your filters or search keywords</p>
                      </td>
                    </tr>
                  ) : (
                    filteredMedicines.map((med) => {
                      const isLow = med.availableStock <= med.minimumStock && med.availableStock > 0;
                      const isOut = med.availableStock === 0;

                      return (
                        <tr
                          key={med.id}
                          className="hover:bg-brand-slate-50/60 transition-colors group"
                        >
                          {/* Medicine Name & ID */}
                          <td className="py-3 px-4">
                            <div className="flex items-start gap-2.5">
                              {med.image ? (
                                <div className="relative group/img shrink-0">
                                  <img
                                    src={med.image}
                                    alt={med.name}
                                    className="w-10 h-10 rounded-xl object-cover border border-brand-slate-200 shadow-2xs group-hover/img:scale-105 transition-transform cursor-pointer"
                                    onClick={() => onOpenMedicineDetails(med)}
                                  />
                                </div>
                              ) : (
                                <span className="p-2 rounded-xl bg-brand-teal-50 text-brand-teal-700 mt-0.5 flex-shrink-0 border border-brand-teal-100">
                                  <Pill className="w-4 h-4" />
                                </span>
                              )}
                              <div>
                                <button
                                  onClick={() => onOpenMedicineDetails(med)}
                                  className="font-bold text-brand-navy-900 hover:text-brand-teal-700 text-left line-clamp-1 text-xs cursor-pointer"
                                >
                                  {med.name}
                                </button>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[10px] text-brand-slate-500 font-semibold bg-brand-slate-100 px-1.5 py-0.2 rounded">
                                    {med.id}
                                  </span>
                                  {med.prescriptionRequired && (
                                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                      Rx Required
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-brand-slate-400 line-clamp-1 max-w-[180px] mt-0.5">
                                  {med.genericName}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3">
                            <span className="text-brand-slate-700 font-medium text-[11px] line-clamp-1 max-w-[140px]">
                              {med.category}
                            </span>
                          </td>

                          {/* Dosage Form & Strength */}
                          <td className="py-3 px-3">
                            <div className="text-brand-navy-900 font-medium">
                              <span className="font-semibold text-xs">{med.strength}</span>
                              <p className="text-[10px] text-brand-slate-400">{med.dosageForm}</p>
                            </div>
                          </td>

                          {/* Available Stock */}
                          <td className="py-3 px-3 text-right">
                            <span
                              className={`font-mono font-bold text-xs ${
                                isOut
                                  ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200'
                                  : isLow
                                  ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200'
                                  : 'text-brand-teal-900 font-bold'
                              }`}
                            >
                              {med.availableStock} Units
                            </span>
                          </td>

                          {/* Minimum Stock */}
                          <td className="py-3 px-3 text-right font-mono text-brand-slate-500">
                            {med.minimumStock}
                          </td>

                          {/* Batch & Expiry */}
                          <td className="py-3 px-3">
                            <div>
                              <span className="font-mono font-bold text-xs text-brand-navy-800">
                                {med.batchNumber || 'BAT-2026'}
                              </span>
                              <p className="text-[10px] text-brand-slate-400">Exp: {med.expiryDate}</p>
                            </div>
                          </td>

                          {/* Supplier */}
                          <td className="py-3 px-3">
                            <span className="text-[11px] text-brand-slate-600 line-clamp-1 max-w-[130px]" title={med.supplier}>
                              {med.supplier}
                            </span>
                          </td>

                          {/* Purchase Price */}
                          <td className="py-3 px-3 text-right font-mono text-brand-slate-600">
                            ₹{Number(med.purchasePrice || 0).toFixed(2)}
                          </td>

                          {/* Selling Price */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-brand-navy-900">
                            ₹{Number(med.sellingPrice || 0).toFixed(2)}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3 text-center">
                            <StatusBadge status={med.status} size="xs" />
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => onOpenMedicineDetails(med)}
                                title="View Specifications & Batches"
                                className="p-1.5 text-brand-slate-500 hover:text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              {!isThirdParty && onOpenAddStock && (
                                <button
                                  onClick={() => onOpenAddStock(med)}
                                  title="Add Stock to this medicine"
                                  className="p-1.5 text-brand-teal-700 hover:text-brand-teal-900 hover:bg-brand-teal-100 rounded-lg transition-colors"
                                >
                                  <PackagePlus className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {!isThirdParty && onOpenAdjustStock && (
                                <button
                                  onClick={() => onOpenAdjustStock(med)}
                                  title="Record Stock Adjustment"
                                  className="p-1.5 text-brand-slate-500 hover:text-brand-coral-700 hover:bg-brand-coral-50 rounded-lg transition-colors"
                                >
                                  <Sliders className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. LOW STOCK SUB-TAB (Section 11) */}
      {activeSubTab === 'low-stock' && (
        <div className="space-y-4">
          <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-950">Low & Out-of-Stock Attention Items</h3>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Medicines that have breached their minimum safety stock threshold or reached 0 units. Stock addition can be executed immediately.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-brand-slate-50 border-b border-brand-slate-200 text-brand-slate-600 font-bold uppercase text-[11px]">
                    <th className="py-3 px-4">Medicine</th>
                    <th className="py-3 px-3 text-right">Current Stock</th>
                    <th className="py-3 px-3 text-right">Min Stock</th>
                    <th className="py-3 px-3 text-right">Reorder Level</th>
                    <th className="py-3 px-3">Supplier</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-center">{isThirdParty ? 'Details' : 'Quick Restock'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100">
                  {lowStockMedicines.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-10 text-center text-brand-slate-400">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <p className="font-bold text-brand-navy-900">All medicines have healthy stock levels!</p>
                      </td>
                    </tr>
                  ) : (
                    lowStockMedicines.map((med) => (
                      <tr key={med.id} className="hover:bg-brand-slate-50/50">
                        <td className="py-3 px-4">
                          <div className="font-bold text-brand-navy-900">{med.name}</div>
                          <div className="text-[10px] text-brand-slate-400">{med.id} • {med.genericName}</div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className={`font-mono font-bold ${med.availableStock === 0 ? 'text-rose-600' : 'text-amber-700'}`}>
                            {med.availableStock} Units
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-brand-slate-600">{med.minimumStock}</td>
                        <td className="py-3 px-3 text-right font-mono text-brand-slate-600">{med.reorderLevel}</td>
                        <td className="py-3 px-3 text-brand-slate-700">{med.supplier}</td>
                        <td className="py-3 px-3 text-center">
                          <StatusBadge status={med.status} size="xs" />
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isThirdParty ? (
                            <button
                              onClick={() => onOpenMedicineDetails(med)}
                              className="px-3 py-1 text-xs font-bold text-brand-slate-700 hover:text-brand-teal-700 bg-brand-slate-100 hover:bg-brand-teal-50 rounded-lg transition-colors inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onOpenAddStock(med)}
                              className="px-3 py-1 text-xs font-bold text-white bg-brand-teal-700 hover:bg-brand-teal-800 rounded-lg shadow-xs inline-flex items-center gap-1"
                            >
                              <PackagePlus className="w-3.5 h-3.5" />
                              <span>Add Stock</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. EXPIRING SOON SUB-TAB (Section 10) */}
      {activeSubTab === 'expiring' && (
        <div className="space-y-4">
          <div className="bg-purple-50/60 border border-purple-200 p-4 rounded-2xl flex items-start gap-3">
            <Clock className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-purple-950">Expiry Tracking & Risk Management</h3>
              <p className="text-xs text-purple-800 mt-0.5 leading-relaxed">
                Medicines with batches approaching expiration. Do not delete expired medicines; record expired or damaged stock via Stock Adjustment to maintain audit compliance.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-brand-slate-50 border-b border-brand-slate-200 text-brand-slate-600 font-bold uppercase text-[11px]">
                    <th className="py-3 px-4">Medicine</th>
                    <th className="py-3 px-3">Batch Number</th>
                    <th className="py-3 px-3 text-right">Available Quantity</th>
                    <th className="py-3 px-3">Expiry Date</th>
                    <th className="py-3 px-3 text-right">Days Remaining</th>
                    <th className="py-3 px-3">Supplier</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100">
                  {expiringMedicines.map((batch) => (
                    <tr key={batch.batchNumber} className="hover:bg-brand-slate-50/50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-brand-navy-900">{batch.medicineName}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-brand-navy-800">{batch.batchNumber}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-brand-slate-800">
                        {batch.quantity} Units
                      </td>
                      <td className="py-3 px-3 font-medium text-purple-900">{batch.expiryDate}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] ${
                            batch.daysRemaining <= 30
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {batch.daysRemaining} days
                        </span>
                      </td>
                      <td className="py-3 px-3 text-brand-slate-600">{batch.supplier}</td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={batch.status || 'Expiring Soon'} size="xs" />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() =>
                            onOpenAdjustStock({
                              name: batch.medicineName,
                              id: batch.medicineId,
                              batchNumber: batch.batchNumber,
                              availableStock: batch.quantity
                            })
                          }
                          className="px-2.5 py-1 text-xs font-bold text-brand-coral-800 bg-brand-coral-50 hover:bg-brand-coral-100 rounded-lg border border-brand-coral-200 transition-colors"
                        >
                          Adjust / Write-off
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. BATCH MANAGEMENT SUB-TAB (Section 9) */}
      {activeSubTab === 'batches' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-brand-navy-900">Central Hub Medicine Batches</h3>
            <p className="text-xs text-brand-slate-500 mt-0.5">
              Live batch tracking for pharmaceutical tracing, quality verification, and purchase price audits
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-brand-slate-50 border-b border-brand-slate-200 text-brand-slate-600 font-bold uppercase text-[11px]">
                    <th className="py-3 px-4">Batch Number</th>
                    <th className="py-3 px-3">Medicine</th>
                    <th className="py-3 px-3 text-right">Quantity</th>
                    <th className="py-3 px-3">Mfg Date</th>
                    <th className="py-3 px-3">Expiry Date</th>
                    <th className="py-3 px-3">Supplier</th>
                    <th className="py-3 px-3 text-right">Purchase Price</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100">
                  {batches.map((b) => (
                    <tr key={b.batchNumber} className="hover:bg-brand-slate-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-brand-teal-900">{b.batchNumber}</td>
                      <td className="py-3 px-3 font-semibold text-brand-navy-900">{b.medicineName}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-brand-slate-900">{b.quantity} Units</td>
                      <td className="py-3 px-3 text-brand-slate-600">{b.mfgDate}</td>
                      <td className="py-3 px-3 text-brand-slate-700 font-medium">{b.expiryDate}</td>
                      <td className="py-3 px-3 text-brand-slate-600">{b.supplier}</td>
                      <td className="py-3 px-3 text-right font-mono text-brand-slate-700">₹{Number(b.purchasePrice || 0).toFixed(2)}</td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={b.status} size="xs" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. STOCK HISTORY SUB-TAB (Section 12) */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">Stock Movement & Audit History</h3>
              <p className="text-xs text-brand-slate-500 mt-0.5">
                Complete trace of additions, damage corrections, expiry write-offs, and hub dispenses
              </p>
            </div>
            <span className="px-3 py-1 bg-brand-slate-100 text-brand-slate-700 rounded-xl text-xs font-mono font-bold">
              {stockHistory.length} Audit Entries
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-brand-slate-50 border-b border-brand-slate-200 text-brand-slate-600 font-bold uppercase text-[11px]">
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-3">Medicine</th>
                    <th className="py-3 px-3">Batch</th>
                    <th className="py-3 px-3">Transaction Type</th>
                    <th className="py-3 px-3 text-right">Quantity</th>
                    <th className="py-3 px-3 text-center">Previous → Updated</th>
                    <th className="py-3 px-4">Reason / Notes</th>
                    <th className="py-3 px-3">Performed By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100">
                  {stockHistory.map((txn) => (
                    <tr key={txn.id} className="hover:bg-brand-slate-50/50">
                      <td className="py-3 px-4 font-mono text-[11px] text-brand-slate-500 whitespace-nowrap">{txn.date}</td>
                      <td className="py-3 px-3 font-bold text-brand-navy-900">{txn.medicineName}</td>
                      <td className="py-3 px-3 font-mono text-brand-slate-600">{txn.batch}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                            txn.transactionType === 'Stock Added'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : txn.transactionType === 'Damaged Stock'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : txn.transactionType === 'Expired Stock'
                              ? 'bg-purple-50 text-purple-800 border border-purple-200'
                              : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}
                        >
                          {txn.transactionType}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        <span
                          className={
                            txn.quantity.startsWith('+') ? 'text-emerald-700' : 'text-rose-600'
                          }
                        >
                          {txn.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-brand-slate-700">
                        {txn.previousStock} → <strong className="text-brand-navy-900">{txn.updatedStock}</strong>
                      </td>
                      <td className="py-3 px-4 text-brand-slate-600 max-w-xs">{txn.reason}</td>
                      <td className="py-3 px-3 font-medium text-brand-slate-700">{txn.performedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
