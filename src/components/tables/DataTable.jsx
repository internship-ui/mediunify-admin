import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Download,
  FileSpreadsheet,
  FileText,
  ChevronDown
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { exportToExcel, exportToPDF } from '../../utils/reportExportEngine';

export default function DataTable({
  columns = [],
  data = [],
  searchPlaceholder = 'Search records...',
  searchKeys = [],
  filters = [], // [{ key: 'status', label: 'Status', options: ['Active', 'Inactive'] }]
  onView,
  onEdit,
  onDelete,
  onAddNew,
  addNewLabel = 'Add New',
  title,
  subtitle,
  exportable = true,
  itemsPerPageOptions = [5, 10, 25, 50],
  defaultItemsPerPage = 10
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filtered & Sorted Data
  const processedData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((item) => {
        if (searchKeys.length > 0) {
          return searchKeys.some((k) => String(item[k] || '').toLowerCase().includes(q));
        }
        return Object.values(item).some((val) =>
          String(val || '').toLowerCase().includes(q)
        );
      });
    }

    // Custom Filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== 'ALL') {
        result = result.filter((item) => String(item[key]) === String(value));
      }
    });

    // Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }
        return sortConfig.direction === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return result;
  }, [data, searchTerm, searchKeys, activeFilters, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(processedData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedData.slice(start, start + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  const handleExportExcel = () => {
    if (processedData.length === 0) return;
    const cleanTitle = title || 'Data Report';
    const dateStr = new Date().toISOString().slice(0, 10);
    const exportColumns = columns.map((c) => ({
      header: c.header,
      key: c.accessor,
      width: Math.max(18, c.header.length + 5)
    }));

    exportToExcel({
      filename: `${cleanTitle.replace(/\s+/g, '_')}_${dateStr}.xlsx`,
      sheetName: 'Records',
      title: cleanTitle,
      columns: exportColumns,
      data: processedData,
      metadata: {
        portal: 'MediUnify Operations',
        dateRange: `Total: ${processedData.length} entries`
      }
    });
    setIsExportMenuOpen(false);
  };

  const handleExportPDF = () => {
    if (processedData.length === 0) return;
    const cleanTitle = title || 'Operational Report';
    const dateStr = new Date().toISOString().slice(0, 10);
    const exportColumns = columns.map((c) => ({
      header: c.header,
      key: c.accessor
    }));

    exportToPDF({
      filename: `${cleanTitle.replace(/\s+/g, '_')}_${dateStr}.pdf`,
      title: cleanTitle,
      subtitle: subtitle || 'Unified Administrative & Clinical Summary',
      columns: exportColumns,
      data: processedData,
      summaryCards: [
        { label: 'Total Records', value: processedData.length },
        { label: 'Active Filters', value: Object.keys(activeFilters).length || 'None' }
      ],
      metadata: {
        portal: 'MediUnify Operations',
        dateRange: `Generated: ${new Date().toLocaleDateString('en-IN')}`
      }
    });
    setIsExportMenuOpen(false);
  };

  const handleExportCSV = () => {
    if (processedData.length === 0) return;
    const headers = columns.map((c) => c.header).join(',');
    const rows = processedData.map((item) =>
      columns
        .map((c) => {
          const val = item[c.accessor];
          return `"${String(val || '').replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title || 'export'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportMenuOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-slate-200/80 shadow-sm overflow-hidden flex flex-col">
      {/* Top Header / Action Bar */}
      <div className="p-4 sm:p-5 border-b border-brand-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {(title || subtitle) && (
          <div>
            {title && <h3 className="text-base sm:text-lg font-bold text-brand-navy-900">{title}</h3>}
            {subtitle && <p className="text-xs text-brand-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-brand-slate-200 bg-brand-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-brand-slate-400 hover:text-brand-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Dynamic Filter Dropdowns */}
          {filters.map((flt) => (
            <div key={flt.key} className="relative">
              <select
                value={activeFilters[flt.key] || 'ALL'}
                onChange={(e) => handleFilterChange(flt.key, e.target.value)}
                className="text-xs sm:text-sm pl-3 pr-8 py-2 rounded-xl border border-brand-slate-200 bg-brand-slate-50/50 font-medium text-brand-slate-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 transition-all"
              >
                <option value="ALL">All {flt.label}</option>
                {flt.options.map((opt) => {
                  const val = typeof opt === 'object' ? opt.value : opt;
                  const lbl = typeof opt === 'object' ? opt.label : opt;
                  return (
                    <option key={val} value={val}>
                      {lbl}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}

          {/* Export Dropdown */}
          {exportable && (
            <div className="relative">
              <button
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-brand-teal-800 bg-brand-teal-50 hover:bg-brand-teal-100/80 border border-brand-teal-200/80 rounded-xl transition-all shadow-2xs"
                title="Download data in Excel, PDF, or CSV"
              >
                <Download className="w-3.5 h-3.5 text-brand-teal-700" />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown className="w-3 h-3 text-brand-teal-600" />
              </button>

              {isExportMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsExportMenuOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl border border-brand-slate-200 shadow-xl py-1.5 z-40 animate-slide-up text-left">
                    <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-slate-400 border-b border-brand-slate-100">
                      Export Format ({processedData.length} rows)
                    </div>
                    <button
                      onClick={handleExportExcel}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-50 transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-brand-navy-900 leading-tight">Excel Spreadsheet</p>
                        <p className="text-[10px] text-brand-slate-400">Microsoft Excel (.xlsx)</p>
                      </div>
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-50 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-brand-coral-600" />
                      <div>
                        <p className="font-bold text-brand-navy-900 leading-tight">PDF Document</p>
                        <p className="text-[10px] text-brand-slate-400">Formatted summary (.pdf)</p>
                      </div>
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-50 transition-colors"
                    >
                      <Download className="w-4 h-4 text-brand-teal-600" />
                      <div>
                        <p className="font-bold text-brand-navy-900 leading-tight">Raw Data CSV</p>
                        <p className="text-[10px] text-brand-slate-400">Comma-separated (.csv)</p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Add New Button */}
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-sm transition-all hover:shadow"
            >
              <Plus className="w-4 h-4" />
              <span>{addNewLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Surface */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm text-brand-slate-600">
          <thead className="bg-brand-slate-50/80 text-brand-slate-500 text-[11px] uppercase font-bold tracking-wider border-b border-brand-slate-100 select-none">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor || col.header}
                  onClick={() => col.sortable !== false && col.accessor && handleSort(col.accessor)}
                  className={`px-4 sm:px-5 py-3.5 ${
                    col.sortable !== false && col.accessor ? 'cursor-pointer hover:text-brand-navy-900' : ''
                  } ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                  <div
                    className={`inline-flex items-center gap-1 ${
                      col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'
                    }`}
                  >
                    <span>{col.header}</span>
                    {col.sortable !== false && col.accessor && (
                      <ArrowUpDown className="w-3 h-3 text-brand-slate-400" />
                    )}
                  </div>
                </th>
              ))}
              {(onView || onEdit || onDelete) && (
                <th className="px-4 sm:px-5 py-3.5 text-right font-bold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onView || onEdit || onDelete ? 1 : 0)}
                  className="px-6 py-12 text-center text-brand-slate-400"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Filter className="w-8 h-8 text-brand-slate-300" />
                    <p className="font-semibold text-brand-slate-600">No matching records found</p>
                    <p className="text-xs text-brand-slate-400">Try adjusting your search query or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || row.bookingId || row.sampleId || row.orderId || row.cycleId || row.serialNo || idx}
                  className="hover:bg-brand-slate-50/60 transition-colors"
                >
                  {columns.map((col) => {
                    const val = row[col.accessor];
                    return (
                      <td
                        key={col.accessor || col.header}
                        className={`px-4 sm:px-5 py-3.5 whitespace-nowrap ${
                          col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                        }`}
                      >
                        {col.render ? (
                          col.render(val, row)
                        ) : col.isStatus ? (
                          <StatusBadge status={val} />
                        ) : (
                          <span className="font-medium text-brand-navy-900">{val !== null && val !== undefined ? String(val) : '—'}</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Actions Column */}
                  {(onView || onEdit || onDelete) && (
                    <td className="px-4 sm:px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="p-1.5 text-brand-slate-500 hover:text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-1.5 text-brand-slate-500 hover:text-brand-navy-700 hover:bg-brand-navy-50 rounded-lg transition-colors"
                            title="Edit record"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-1.5 text-brand-slate-400 hover:text-brand-coral-600 hover:bg-brand-coral-50 rounded-lg transition-colors"
                            title="Delete record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-brand-slate-100 bg-brand-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-slate-500">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-brand-slate-200 rounded-lg px-2 py-1 bg-white text-brand-navy-900 focus:outline-none"
          >
            {itemsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="hidden sm:inline">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, processedData.length)} to{' '}
            {Math.min(currentPage * itemsPerPage, processedData.length)} of {processedData.length} entries
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-brand-slate-200 bg-white hover:bg-brand-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-semibold text-brand-navy-900">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-brand-slate-200 bg-white hover:bg-brand-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
