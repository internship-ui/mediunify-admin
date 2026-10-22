import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Copy,
  Power,
  Sparkles,
  LayoutGrid,
  List,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { exportToExcel } from '../../../utils/reportExportEngine';
import { useToast } from '../../../context/ToastContext';

export default function LabCheckupPackagesView({
  popularPackages = [],
  curatedPackages = [],
  onOpenPackageDetails,
  onOpenAddPackage,
  onOpenEditPackage,
  onDuplicatePackage,
  onTogglePackageStatus
}) {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('popular'); // 'popular' | 'curated'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const currentList = activeTab === 'popular' ? popularPackages : curatedPackages;

  // Filter packages
  const filteredPackages = useMemo(() => {
    return currentList.filter((pkg) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = pkg.name?.toLowerCase().includes(q);
        const matchCode = pkg.code?.toLowerCase().includes(q);
        const matchCat = pkg.category?.toLowerCase().includes(q);
        const matchDesc = pkg.description?.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchCat && !matchDesc) return false;
      }

      if (categoryFilter !== 'ALL' && pkg.category !== categoryFilter) {
        return false;
      }

      if (statusFilter !== 'ALL' && pkg.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [currentList, searchTerm, categoryFilter, statusFilter]);

  const categories = useMemo(() => {
    const set = new Set(currentList.map((p) => p.category));
    return Array.from(set);
  }, [currentList]);

  const handleExportExcel = () => {
    const exportData = filteredPackages.map((p) => ({
      'Package Code': p.code,
      'Package Name': p.name,
      'Category': p.category,
      'Tests Count': p.testCodes?.length || p.includedPackagesCount || 0,
      'Parameters Count': p.includedParametersCount || 0,
      'Suggested Mysuru Price': p.suggestedPrice,
      'Rack Price': p.originalPrice || '',
      'Status': p.status || 'Active',
      'Clinical Note': p.clinicalNotes || ''
    }));
    exportToExcel(exportData, `MediUnify_${activeTab === 'popular' ? 'Popular' : 'Curated'}_Checkup_Packages`);
    addToast(`Exported ${activeTab === 'popular' ? 'Popular' : 'Curated'} packages to Excel`, 'success');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-navy-900 tracking-tight">
            Checkup Packages
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-brand-slate-50 text-brand-slate-700 text-xs font-semibold rounded-xl border border-brand-slate-200 shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Packages
          </button>
          <button
            onClick={() => onOpenAddPackage(activeTab)}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add {activeTab === 'popular' ? 'Popular' : 'Curated'} Package
          </button>
        </div>
      </div>

      {/* Main Tabs (POPULAR CHECKUPS vs CURATED CHECKUPS) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('popular')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'popular'
                ? 'bg-brand-teal-600 text-white shadow-xs'
                : 'bg-white text-brand-slate-600 hover:bg-brand-slate-100 border border-brand-slate-200'
            }`}
          >
            <Boxes className="w-4 h-4" />
            Popular Checkups ({popularPackages.length})
          </button>

          <button
            onClick={() => setActiveTab('curated')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'curated'
                ? 'bg-brand-teal-600 text-white shadow-xs'
                : 'bg-white text-brand-slate-600 hover:bg-brand-slate-100 border border-brand-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Curated Checkups ({curatedPackages.length})
          </button>
        </div>

        {/* Grid vs Table View Toggle */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-brand-slate-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-brand-teal-50 text-brand-teal-700'
                : 'text-brand-slate-400 hover:text-brand-slate-700'
            }`}
            title="Grid Cards View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-brand-teal-50 text-brand-teal-700'
                : 'text-brand-slate-400 hover:text-brand-slate-700'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-brand-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Search */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Package Name, Code, Clinical Terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            />
          </div>

          {/* Category */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPackages.map((pkg) => {
            const testCount = pkg.testCodes?.length || pkg.includedPackagesCount || 6;
            return (
              <div
                key={pkg.id || pkg.code}
                className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs hover:shadow-md hover:border-brand-teal-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-3">
                  {/* Category & Status Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-2.5 py-0.5 rounded-full border border-brand-teal-200">
                      {pkg.category}
                    </span>
                    <StatusBadge status={pkg.status || 'Active'} size="xs" />
                  </div>

                  {/* Title & Code */}
                  <div>
                    <h3 className="font-extrabold text-brand-navy-900 text-base leading-snug group-hover:text-brand-teal-800 transition-colors">
                      {pkg.name}
                    </h3>
                    <p className="font-mono text-xs text-brand-slate-400 mt-0.5">
                      Code: <strong className="text-brand-teal-700 font-semibold">{pkg.code}</strong>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-brand-slate-600 line-clamp-2 leading-relaxed">
                    {pkg.description || pkg.clinicalNotes}
                  </p>

                  {/* Metrics Badge */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-slate-100 text-xs">
                    <div className="bg-brand-slate-50 p-2 rounded-xl border border-brand-slate-200/60">
                      <span className="text-[10px] text-brand-slate-400 block font-semibold uppercase">Included Tests</span>
                      <strong className="text-brand-navy-900">{testCount} Diagnostic Panels</strong>
                    </div>

                    <div className="bg-brand-slate-50 p-2 rounded-xl border border-brand-slate-200/60">
                      <span className="text-[10px] text-brand-slate-400 block font-semibold uppercase">Turnaround</span>
                      <strong className="text-brand-teal-700">{pkg.tat || 'Same Day'}</strong>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & Actions */}
                <div className="p-4 bg-brand-slate-50/80 border-t border-brand-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-brand-slate-400">Mysuru Price</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-brand-navy-900">
                        ₹{pkg.suggestedPrice}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-xs text-brand-slate-400 line-through">
                          ₹{pkg.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onDuplicatePackage(pkg, activeTab)}
                      className="p-2 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-white rounded-lg border border-transparent hover:border-brand-slate-200 transition-colors"
                      title="Duplicate Package"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenEditPackage(pkg, activeTab)}
                      className="p-2 text-brand-slate-400 hover:text-brand-teal-700 hover:bg-white rounded-lg border border-transparent hover:border-brand-slate-200 transition-colors"
                      title="Edit Package"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenPackageDetails(pkg)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Tests
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-brand-slate-100 text-brand-slate-700 font-bold border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-3.5">Package Code & Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Tests Count</th>
                <th className="py-3 px-3">Turnaround Time</th>
                <th className="py-3 px-3 text-right">Suggested Mysuru Price</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3.5 text-center w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id || pkg.code} className="hover:bg-brand-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5">
                    <p className="font-bold text-brand-navy-900 text-sm">{pkg.name}</p>
                    <p className="text-[11px] text-brand-teal-700 font-mono font-semibold">{pkg.code}</p>
                  </td>
                  <td className="py-3 px-3 font-semibold text-brand-slate-700">
                    {pkg.category}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-brand-navy-900">
                    {pkg.testCodes?.length || pkg.includedPackagesCount || 6} Tests
                  </td>
                  <td className="py-3 px-3 font-semibold text-brand-teal-700">
                    {pkg.tat || 'Same Day'}
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-brand-navy-900 text-sm">
                    ₹{pkg.suggestedPrice}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <StatusBadge status={pkg.status || 'Active'} size="xs" />
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onOpenPackageDetails(pkg)}
                        className="p-1.5 text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg transition-colors font-bold flex items-center gap-1"
                        title="View Included Tests & Parameters"
                      >
                        <Eye className="w-3.5 h-3.5" /> Tests
                      </button>
                      <button
                        onClick={() => onOpenEditPackage(pkg, activeTab)}
                        className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100 rounded-lg transition-colors"
                        title="Edit Package"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onTogglePackageStatus(pkg.id || pkg.code, activeTab)}
                        className="p-1.5 text-brand-slate-400 hover:text-brand-coral-600 hover:bg-brand-coral-50 rounded-lg transition-colors"
                        title="Toggle Status"
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
