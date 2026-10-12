import React, { useState } from 'react';
import {
  X,
  Boxes,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit3,
  TestTube2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Clock,
  Sparkles
} from 'lucide-react';
import { MASTER_TESTS } from '../../../data/labData';
import { useToast } from '../../../context/ToastContext';

export default function PackageDetailModal({
  isOpen,
  onClose,
  packageData,
  onUpdatePackage,
  allTests = MASTER_TESTS
}) {
  const { addToast } = useToast();

  const [isAddingTest, setIsAddingTest] = useState(false);
  const [selectedTestToAdd, setSelectedTestToAdd] = useState('');

  if (!isOpen || !packageData) return null;

  // Resolve full test objects from testCodes
  const includedTestCodes = packageData.testCodes || [];
  const includedTests = includedTestCodes.map((code) => {
    return allTests.find((t) => t.code === code || t.id === code) || {
      id: code,
      code,
      name: code,
      category: 'General Panel',
      sampleRequired: 'Whole Blood / Serum',
      tubeContainer: 'Vacutainer',
      preparation: 'Standard protocol',
      tat: 'Same Day',
      price: 0,
      cptCode: '—'
    };
  });

  const handleRemoveTest = (codeToRemove) => {
    const updatedCodes = includedTestCodes.filter((c) => c !== codeToRemove);
    onUpdatePackage({
      ...packageData,
      testCodes: updatedCodes,
      includedPackagesCount: updatedCodes.length
    });
    addToast(`Removed test from package: ${codeToRemove}`, 'info');
  };

  const handleMoveTest = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= includedTestCodes.length) return;

    const newCodes = [...includedTestCodes];
    const temp = newCodes[index];
    newCodes[index] = newCodes[targetIndex];
    newCodes[targetIndex] = temp;

    onUpdatePackage({
      ...packageData,
      testCodes: newCodes
    });
  };

  const handleAddTestToPackage = () => {
    if (!selectedTestToAdd) return;
    if (includedTestCodes.includes(selectedTestToAdd)) {
      addToast('Test is already included in this package', 'warning');
      return;
    }

    const updatedCodes = [...includedTestCodes, selectedTestToAdd];
    onUpdatePackage({
      ...packageData,
      testCodes: updatedCodes,
      includedPackagesCount: updatedCodes.length
    });

    addToast('Added test to package catalogue', 'success');
    setSelectedTestToAdd('');
    setIsAddingTest(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-brand-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-teal-50 text-brand-teal-700 rounded-lg border border-brand-teal-200">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-brand-navy-900">{packageData.name}</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200 font-mono">
                  {packageData.code}
                </span>
              </div>
              <p className="text-xs text-brand-slate-500">
                Category: <strong>{packageData.category}</strong> | Mysuru Price: <strong>₹{packageData.suggestedPrice}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* Package Information Summary */}
          <div className="p-4 bg-brand-slate-50/80 rounded-xl border border-brand-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-slate-500">
                Package Master Information
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {packageData.status || 'Active'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <p className="text-brand-slate-400">Package Name & Code:</p>
                <p className="font-bold text-brand-navy-900">{packageData.name}</p>
                <p className="text-brand-teal-700 font-mono text-[11px] font-semibold">{packageData.code}</p>
              </div>

              <div>
                <p className="text-brand-slate-400">Mysuru Package Price:</p>
                <p className="font-extrabold text-brand-navy-900 text-sm">
                  ₹{packageData.suggestedPrice}{' '}
                  {packageData.originalPrice && (
                    <span className="line-through text-brand-slate-400 text-xs font-normal">
                      ₹{packageData.originalPrice}
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold">
                  {packageData.originalPrice ? `${Math.round((1 - packageData.suggestedPrice / packageData.originalPrice) * 100)}% Package Discount` : 'Standard Rate'}
                </p>
              </div>

              <div>
                <p className="text-brand-slate-400">Included Tests Count:</p>
                <p className="font-bold text-brand-navy-900">{includedTests.length} Integrated Panels</p>
                <p className="text-brand-slate-500 text-[11px]">
                  ~{packageData.includedParametersCount || includedTests.length * 7} Total Parameters
                </p>
              </div>
            </div>

            {packageData.clinicalNotes && (
              <div className="pt-2 border-t border-brand-slate-200/60">
                <p className="text-brand-slate-400 font-medium">Clinical / Pricing Note:</p>
                <p className="text-brand-slate-700 leading-relaxed text-[11px]">
                  {packageData.clinicalNotes}
                </p>
              </div>
            )}

            {packageData.prepSummary && (
              <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Preparation Instructions:</strong> {packageData.prepSummary}
                </span>
              </div>
            )}
          </div>

          {/* Included Tests Header & Add Trigger */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-sm font-bold text-brand-navy-900 flex items-center gap-2">
                  <TestTube2 className="w-4 h-4 text-brand-teal-600" />
                  Included Tests & Panels ({includedTests.length})
                </h4>
                <p className="text-xs text-brand-slate-500">
                  Referenced directly from the Master Test Catalogue without redundant data duplication
                </p>
              </div>

              <button
                onClick={() => setIsAddingTest(!isAddingTest)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Test to Package
              </button>
            </div>

            {/* Add Test to Package Inline Selector */}
            {isAddingTest && (
              <div className="p-3 mb-4 bg-brand-teal-50/60 rounded-xl border border-brand-teal-200 flex flex-wrap items-center gap-2 animate-in fade-in-50">
                <select
                  value={selectedTestToAdd}
                  onChange={(e) => setSelectedTestToAdd(e.target.value)}
                  className="flex-1 min-w-[200px] p-2 bg-white rounded-lg border border-brand-teal-300 text-xs font-medium"
                >
                  <option value="">Select test from catalogue to map into package...</option>
                  {allTests
                    .filter((t) => !includedTestCodes.includes(t.code))
                    .map((t) => (
                      <option key={t.id} value={t.code}>
                        {t.name} ({t.code}) — ₹{t.price} [{t.sampleRequired}]
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleAddTestToPackage}
                  className="px-3 py-2 bg-brand-teal-700 hover:bg-brand-teal-800 text-white font-bold rounded-lg text-xs"
                >
                  Confirm Mapping
                </button>
                <button
                  onClick={() => setIsAddingTest(false)}
                  className="px-3 py-2 bg-white text-brand-slate-600 hover:bg-brand-slate-100 rounded-lg text-xs border border-brand-slate-200"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Included Tests Table */}
            <div className="border border-brand-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-brand-slate-100 text-brand-slate-700 font-bold border-b border-brand-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3">Test / Panel</th>
                    <th className="py-2.5 px-3">Sample & Tube</th>
                    <th className="py-2.5 px-3">Preparation</th>
                    <th className="py-2.5 px-3">TAT</th>
                    <th className="py-2.5 px-3 text-right">Standard Price</th>
                    <th className="py-2.5 px-3 text-center w-28">Order / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100">
                  {includedTests.map((testItem, index) => (
                    <tr key={index} className="hover:bg-brand-slate-50 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-brand-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-brand-navy-900">{testItem.name}</p>
                        <p className="text-[11px] text-brand-slate-400 font-mono">
                          Code: <span className="text-brand-teal-700 font-semibold">{testItem.code}</span> | {testItem.category}
                        </p>
                      </td>
                      <td className="py-2.5 px-3 text-brand-slate-600">
                        <p className="font-medium text-brand-slate-800">{testItem.sampleRequired}</p>
                        <p className="text-[11px] text-brand-slate-400">{testItem.tubeContainer}</p>
                      </td>
                      <td className="py-2.5 px-3 text-brand-slate-600 text-[11px] max-w-xs truncate" title={testItem.preparation}>
                        {testItem.preparation}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-brand-slate-700">
                        {testItem.tat}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-brand-navy-900">
                        ₹{testItem.price || 0}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleMoveTest(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-brand-slate-400 hover:text-brand-slate-700 disabled:opacity-30 rounded"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveTest(index, 'down')}
                            disabled={index === includedTests.length - 1}
                            className="p-1 text-brand-slate-400 hover:text-brand-slate-700 disabled:opacity-30 rounded"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveTest(testItem.code)}
                            className="p-1 text-brand-slate-400 hover:text-brand-coral-600 rounded ml-1"
                            title="Remove from Package"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between text-xs">
          <span className="text-brand-slate-500">
            Total Individual Tests Sum: ₹{includedTests.reduce((sum, t) => sum + (t.price || 0), 0)} | Bundle Price: ₹{packageData.suggestedPrice}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold rounded-xl transition-colors shadow-xs"
          >
            Done & Save Package
          </button>
        </div>
      </div>
    </div>
  );
}
