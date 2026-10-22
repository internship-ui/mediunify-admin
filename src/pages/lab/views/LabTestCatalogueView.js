import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  TestTube2,
  Filter,
  RotateCcw,
  Edit3,
  Eye,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Power
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { LAB_CATEGORIES } from '../../../data/labData';
import { exportToExcel } from '../../../utils/reportExportEngine';
import { useToast } from '../../../context/ToastContext';
import TubeColorDot from '../components/TubeColorBadge';

export default function LabTestCatalogueView({
  tests = [],
  onOpenAddTest,
  onOpenEditTest,
  onToggleTestStatus
}) {
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sampleTypeFilter, setSampleTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter tests
  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = test.name?.toLowerCase().includes(q);
        const matchCode = test.code?.toLowerCase().includes(q);
        const matchCat = test.category?.toLowerCase().includes(q);
        const matchPrep = test.preparation?.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchCat && !matchPrep) return false;
      }

      if (categoryFilter !== 'ALL' && test.category !== categoryFilter) {
        return false;
      }

      if (sampleTypeFilter !== 'ALL' && !test.sampleRequired?.toLowerCase().includes(sampleTypeFilter.toLowerCase())) {
        return false;
      }

      if (statusFilter !== 'ALL' && test.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [tests, searchTerm, categoryFilter, sampleTypeFilter, statusFilter]);

  // Sort and Paginate
  const sortedTests = useMemo(() => {
    const list = [...filteredTests];
    list.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (typeof valA === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
    return list;
  }, [filteredTests, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedTests.length / itemsPerPage));
  const paginatedTests = sortedTests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('ALL');
    setSampleTypeFilter('ALL');
    setStatusFilter('ALL');
    setCurrentPage(1);
    addToast('Test catalogue filters reset', 'info');
  };

  const handleExportExcel = () => {
    const exportData = filteredTests.map((t) => ({
      'Test Code': t.code,
      'Test Name': t.name,
      'Category': t.category,
      'Sample Required': t.sampleRequired,
      'Tube / Container': t.tubeContainer,
      'Preparation': t.preparation,
      'TAT': t.tat,
      'Suggested Mysuru Price': t.price,
      'CPT Reference': t.cptCode || '—',
      'Status': t.status
    }));
    exportToExcel(exportData, 'MediUnify_Master_Test_Catalogue');
    addToast('Exported test catalogue to Excel', 'success');
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-navy-900 tracking-tight">
            Test Catalogue
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-brand-slate-50 text-brand-slate-700 text-xs font-semibold rounded-xl border border-brand-slate-200 shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Catalogue
          </button>
          <button
            onClick={onOpenAddTest}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Test
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-brand-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Test Name, Code, Parameter..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            />
          </div>

          {/* Department / Category */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            >
              <option value="ALL">All Departments / Categories</option>
              {LAB_CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Sample Type */}
          <div>
            <select
              value={sampleTypeFilter}
              onChange={(e) => {
                setSampleTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            >
              <option value="ALL">All Sample Types</option>
              <option value="Blood">Blood (EDTA / Fluoride)</option>
              <option value="Serum">Serum (Clot Activator / Plain)</option>
              <option value="Urine">Urine (Midstream Clean Catch)</option>
              <option value="Diagnostic">Diagnostic Scan / ECG Trace</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active (Bookable)</option>
              <option value="Inactive">Inactive (Disabled)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-brand-slate-500 pt-1">
          <span>Found <strong>{filteredTests.length}</strong> master test records</span>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 font-bold text-brand-teal-700 hover:text-brand-teal-800"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-brand-slate-100 text-brand-slate-700 font-bold border-b border-brand-slate-200">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-3.5 cursor-pointer hover:text-brand-teal-700"
                >
                  <div className="flex items-center gap-1">
                    Test Name & Code <ArrowUpDown className="w-3 h-3 opacity-50" />
                  </div>
                </th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Sample & Tube</th>
                <th className="py-3 px-3">Preparation Guidance</th>
                <th className="py-3 px-3">TAT</th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-brand-teal-700"
                >
                  <div className="flex items-center justify-end gap-1">
                    Mysuru Price <ArrowUpDown className="w-3 h-3 opacity-50" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3.5 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {paginatedTests.length > 0 ? (
                paginatedTests.map((test) => (
                  <tr key={test.id || test.code} className="hover:bg-brand-slate-50/80 transition-colors">
                    {/* Name & Code */}
                    <td className="py-3 px-3.5">
                      <p className="font-bold text-brand-navy-900 text-sm">{test.name}</p>
                      <p className="text-[11px] text-brand-slate-400 font-mono">
                        Code: <span className="text-brand-teal-700 font-semibold">{test.code}</span>
                        {test.cptCode && test.cptCode !== '—' && (
                          <span className="ml-2 text-brand-slate-500">| CPT: {test.cptCode}</span>
                        )}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 font-semibold text-brand-slate-700">
                      {test.category}
                    </td>

                    {/* Sample & Tube Color */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <TubeColorDot tube={test.tubeContainer || test.tubeIdentifier} testCode={test.code} size="md" />
                        <span className="font-semibold text-slate-800 text-xs">{test.sampleRequired}</span>
                      </div>
                    </td>

                    {/* Preparation */}
                    <td className="py-3 px-3 text-brand-slate-600 max-w-xs truncate" title={test.preparation}>
                      <span className="text-[11px] leading-tight block">
                        {test.preparation}
                      </span>
                    </td>

                    {/* TAT */}
                    <td className="py-3 px-3 font-bold text-brand-teal-700">
                      {test.tat}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 text-right font-extrabold text-brand-navy-900 text-sm">
                      ₹{test.price}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={test.status} size="xs" />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onOpenEditTest(test)}
                          className="p-1.5 text-brand-slate-400 hover:text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg transition-colors"
                          title="Edit Test Details & Parameters"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onToggleTestStatus(test.id || test.code)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            test.status === 'Active'
                              ? 'text-brand-slate-400 hover:text-brand-coral-600 hover:bg-brand-coral-50'
                              : 'text-brand-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={test.status === 'Active' ? 'Disable Test' : 'Enable Test'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-brand-slate-400">
                    No tests match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-3 border-t border-brand-slate-200 bg-brand-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-brand-slate-500">
            Showing <strong className="text-brand-navy-900">{Math.min(sortedTests.length, (currentPage - 1) * itemsPerPage + 1)}</strong> to{' '}
            <strong className="text-brand-navy-900">{Math.min(sortedTests.length, currentPage * itemsPerPage)}</strong> of{' '}
            <strong className="text-brand-navy-900">{sortedTests.length}</strong> test records
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-brand-slate-200 bg-white hover:bg-brand-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-bold text-brand-navy-900 bg-white border border-brand-slate-200 rounded-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-brand-slate-200 bg-white hover:bg-brand-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
