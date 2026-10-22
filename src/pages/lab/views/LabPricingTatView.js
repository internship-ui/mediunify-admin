import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Clock,
  Edit3,
  Power,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  Boxes,
  TestTube2,
  TrendingUp,
  Percent
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { exportToExcel } from '../../../utils/reportExportEngine';
import { useToast } from '../../../context/ToastContext';

export default function LabPricingTatView({
  tests = [],
  popularPackages = [],
  curatedPackages = [],
  onOpenEditPricing,
  onToggleStatus
}) {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('tests'); // 'tests' | 'packages'
  const [searchTerm, setSearchTerm] = useState('');

  const allPackages = useMemo(() => {
    return [...popularPackages, ...curatedPackages];
  }, [popularPackages, curatedPackages]);

  // Filter tests
  const filteredTests = useMemo(() => {
    if (!searchTerm.trim()) return tests;
    const q = searchTerm.toLowerCase();
    return tests.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.code?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
    );
  }, [tests, searchTerm]);

  // Filter packages
  const filteredPackages = useMemo(() => {
    if (!searchTerm.trim()) return allPackages;
    const q = searchTerm.toLowerCase();
    return allPackages.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.code?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [allPackages, searchTerm]);

  const handleExportExcel = () => {
    if (activeTab === 'tests') {
      const exportData = filteredTests.map((t) => ({
        'Test Code': t.code,
        'Test Name': t.name,
        'Category': t.category,
        'Suggested Mysuru Price': t.price,
        'CPT Reference': t.cptCode || '—',
        'Turnaround Time (TAT)': t.tat,
        'Status': t.status
      }));
      exportToExcel(exportData, 'MediUnify_Mysuru_Test_Pricing_and_TAT');
      addToast('Exported test pricing master to Excel', 'success');
    } else {
      const exportData = filteredPackages.map((p) => ({
        'Package Code': p.code,
        'Package Name': p.name,
        'Category': p.category,
        'Suggested Mysuru Price': p.suggestedPrice,
        'Turnaround Time (TAT)': p.tat || 'Same Day',
        'Status': p.status || 'Active'
      }));
      exportToExcel(exportData, 'MediUnify_Mysuru_Package_Pricing_and_TAT');
      addToast('Exported package pricing master to Excel', 'success');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-navy-900 tracking-tight">
            Pricing & TAT
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-brand-slate-50 text-brand-slate-700 text-xs font-semibold rounded-xl border border-brand-slate-200 shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Pricing Matrix
          </button>
        </div>
      </div>

      {/* Tabs (TEST PRICING vs PACKAGE PRICING) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'tests'
                ? 'bg-brand-teal-600 text-white shadow-xs'
                : 'bg-white text-brand-slate-600 hover:bg-brand-slate-100 border border-brand-slate-200'
            }`}
          >
            <TestTube2 className="w-4 h-4" />
            Test Pricing & TAT ({tests.length})
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'packages'
                ? 'bg-brand-teal-600 text-white shadow-xs'
                : 'bg-white text-brand-slate-600 hover:bg-brand-slate-100 border border-brand-slate-200'
            }`}
          >
            <Boxes className="w-4 h-4" />
            Package Pricing ({allPackages.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search price table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-brand-slate-200 focus:ring-2 focus:ring-brand-teal-500 font-medium"
          />
        </div>
      </div>

      {/* TAB 1: INDIVIDUAL TEST PRICING TABLE */}
      {activeTab === 'tests' && (
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-brand-slate-100 text-brand-slate-700 font-bold border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-3.5">Diagnostic Test</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">CPT Code Reference</th>
                <th className="py-3 px-3">Standard TAT SLA</th>
                <th className="py-3 px-3 text-right">Suggested Mysuru Price</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3.5 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredTests.map((t) => (
                <tr key={t.id || t.code} className="hover:bg-brand-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5">
                    <p className="font-bold text-brand-navy-900 text-sm">{t.name}</p>
                    <p className="text-[11px] text-brand-slate-400 font-mono">Code: {t.code}</p>
                  </td>
                  <td className="py-3 px-3 font-semibold text-brand-slate-700">
                    {t.category}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-brand-teal-700">
                    {t.cptCode || '—'}
                  </td>
                  <td className="py-3 px-3 font-semibold text-brand-navy-900">
                    {t.tat}
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-brand-navy-900 text-sm">
                    ₹{t.price}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <StatusBadge status={t.status} size="xs" />
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onOpenEditPricing(t, 'test')}
                        className="px-2 py-1 bg-white hover:bg-brand-teal-50 text-brand-teal-700 font-bold rounded-lg border border-brand-slate-200 transition-colors text-[11px]"
                      >
                        Edit Price/TAT
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: PACKAGE PRICING TABLE */}
      {activeTab === 'packages' && (
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-brand-slate-100 text-brand-slate-700 font-bold border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-3.5">Checkup Package</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Bundled Tests</th>
                <th className="py-3 px-3">Turnaround Time</th>
                <th className="py-3 px-3 text-right">Suggested Mysuru Price</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3.5 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredPackages.map((p) => (
                <tr key={p.id || p.code} className="hover:bg-brand-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5">
                    <p className="font-bold text-brand-navy-900 text-sm">{p.name}</p>
                    <p className="text-[11px] text-brand-slate-400 font-mono">Code: {p.code}</p>
                  </td>
                  <td className="py-3 px-3 font-semibold text-brand-slate-700">
                    {p.category}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-brand-navy-900">
                    {p.testCodes?.length || p.includedPackagesCount || 6} Tests
                  </td>
                  <td className="py-3 px-3 font-semibold text-brand-navy-900">
                    {p.tat || 'Same Day'}
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-brand-navy-900 text-sm">
                    ₹{p.suggestedPrice}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <StatusBadge status={p.status || 'Active'} size="xs" />
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onOpenEditPricing(p, 'package')}
                        className="px-2 py-1 bg-white hover:bg-brand-teal-50 text-brand-teal-700 font-bold rounded-lg border border-brand-slate-200 transition-colors text-[11px]"
                      >
                        Edit Price
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
