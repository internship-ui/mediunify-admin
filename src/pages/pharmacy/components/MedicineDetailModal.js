import React from 'react';
import {
  Pill,
  X,
  Building2,
  Package,
  Calendar,
  AlertTriangle,
  History,
  Layers,
  Plus,
  Sliders,
  CheckCircle2,
  XCircle,
  Tag
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function MedicineDetailModal({
  isOpen,
  onClose,
  medicine,
  batches = [],
  stockHistory = [],
  onOpenAddStock,
  onOpenAdjustStock
}) {
  useLockBodyScroll(isOpen, onClose);

  if (!isOpen || !medicine) return null;

  const medicineBatches = batches.filter(
    (b) => b.medicineId === medicine.id || b.medicineName === medicine.name
  );

  const medicineHistory = stockHistory.filter(
    (h) => h.medicineName === medicine.name
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-brand-slate-100 flex items-center justify-between bg-gradient-to-r from-brand-navy-900 to-brand-teal-900 text-white">
          <div className="flex items-center gap-3">
            {medicine.image ? (
              <img
                src={medicine.image}
                alt={medicine.name}
                className="w-14 h-14 rounded-xl object-cover border-2 border-white/20 shadow-md shrink-0 bg-white"
              />
            ) : (
              <div className="p-2.5 rounded-xl bg-white/10 text-brand-teal-300 border border-white/15">
                <Pill className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">{medicine.name}</h3>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-white/10 rounded-md border border-white/20">
                  {medicine.id}
                </span>
              </div>
              <p className="text-xs text-brand-teal-100/80 mt-0.5">
                {medicine.genericName} • {medicine.strength} • {medicine.dosageForm}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs text-brand-slate-700">
          {/* Status & Quick Stock Bar */}
          <div className="p-4 rounded-xl bg-brand-slate-50 border border-brand-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-left">
                <span className="text-[10px] text-brand-slate-400 uppercase font-bold block">Available Inventory</span>
                <span className={`text-2xl font-black font-mono ${medicine.availableStock === 0 ? 'text-brand-coral-600' : medicine.availableStock <= medicine.minimumStock ? 'text-amber-600' : 'text-brand-green-700'}`}>
                  {medicine.availableStock} Units
                </span>
              </div>
              <span className="text-brand-slate-300 hidden sm:inline">|</span>
              <div>
                <span className="text-[10px] text-brand-slate-400 uppercase font-bold block">Status</span>
                <StatusBadge status={medicine.status} size="sm" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenAddStock) onOpenAddStock(medicine.id);
                }}
                className="px-3.5 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stock</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenAdjustStock) onOpenAdjustStock(medicine.id);
                }}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 active:scale-95"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-600" />
                <span>Adjust Stock</span>
              </button>
            </div>
          </div>

          {/* Packaging Visual Verification Card */}
          {medicine.image && (
            <div className="p-3.5 rounded-xl bg-white border border-brand-slate-200 flex items-center gap-4 shadow-2xs">
              <img
                src={medicine.image}
                alt={medicine.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-brand-slate-200 shrink-0 shadow-xs"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded-md border border-brand-teal-200">
                    Verified Packaging Reference
                  </span>
                  <span className="text-[10px] text-brand-slate-400 font-mono font-semibold">
                    {medicine.dosageForm} • {medicine.strength}
                  </span>
                </div>
                <p className="text-xs font-bold text-brand-navy-900 truncate">
                  {medicine.name} ({medicine.genericName})
                </p>
                <p className="text-[11px] text-brand-slate-500 leading-tight">
                  Reference packaging photo used by pharmacy hub staff during pick & pack and dispatch cross-check.
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Detailed Attributes Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-teal-600" />
              Pharmaceutical Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-brand-slate-200 shadow-2xs">
              <div>
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Category</span>
                <span className="font-semibold text-brand-navy-900">{medicine.category}</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Dosage Form</span>
                <span className="font-semibold text-brand-navy-900">{medicine.dosageForm}</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Strength</span>
                <span className="font-semibold text-brand-navy-900">{medicine.strength}</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Manufacturer</span>
                <span className="font-semibold text-brand-navy-900">{medicine.manufacturer || 'General Pharma'}</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Purchase Price</span>
                <span className="font-mono font-bold text-brand-navy-900">₹{Number(medicine.purchasePrice).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Selling Price</span>
                <span className="font-mono font-bold text-brand-green-700">₹{Number(medicine.sellingPrice).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Minimum Stock Threshold</span>
                <span className="font-mono font-bold text-brand-slate-700">{medicine.minimumStock} Units</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Reorder Level</span>
                <span className="font-mono font-bold text-brand-slate-700">{medicine.reorderLevel} Units</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Schedule H / Rx</span>
                <span className={`font-bold ${medicine.prescriptionRequired ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {medicine.prescriptionRequired ? 'Rx Required' : 'OTC / Non-Rx'}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-3 pt-2 border-t border-brand-slate-100">
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Supplier</span>
                <span className="font-semibold text-brand-navy-900">{medicine.supplier}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Batch Management (Requirement 9) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-teal-600" />
              Active Batches & Expiry Dates
            </h4>
            <div className="border border-brand-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-slate-50 text-[10px] font-bold text-brand-slate-600 uppercase border-b border-brand-slate-200">
                  <tr>
                    <th className="px-3 py-2.5">Batch Number</th>
                    <th className="px-3 py-2.5">Quantity</th>
                    <th className="px-3 py-2.5">Mfg Date</th>
                    <th className="px-3 py-2.5">Expiry Date</th>
                    <th className="px-3 py-2.5">Supplier</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100">
                  {medicineBatches.length > 0 ? (
                    medicineBatches.map((b, idx) => (
                      <tr key={idx} className="hover:bg-brand-slate-50/70">
                        <td className="px-3 py-2.5 font-mono font-bold text-brand-navy-900">
                          {b.batchNumber}
                        </td>
                        <td className="px-3 py-2.5 font-bold text-brand-slate-800">
                          {b.quantity} Units
                        </td>
                        <td className="px-3 py-2.5 text-brand-slate-600">{b.mfgDate}</td>
                        <td className="px-3 py-2.5 font-semibold text-brand-slate-800">{b.expiryDate}</td>
                        <td className="px-3 py-2.5 text-brand-slate-600 truncate max-w-[140px]">{b.supplier}</td>
                        <td className="px-3 py-2.5">
                          <StatusBadge status={b.status} size="xs" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-3 py-2.5 font-mono font-bold text-brand-navy-900">
                        {medicine.batchNumber || 'BAT26-001'}
                      </td>
                      <td className="px-3 py-2.5 font-bold text-brand-slate-800">
                        {medicine.availableStock} Units
                      </td>
                      <td className="px-3 py-2.5 text-brand-slate-600">{medicine.mfgDate || 'Jan 2026'}</td>
                      <td className="px-3 py-2.5 font-semibold text-brand-slate-800">{medicine.expiryDate}</td>
                      <td className="px-3 py-2.5 text-brand-slate-600 truncate max-w-[140px]">{medicine.supplier}</td>
                      <td className="px-3 py-2.5">
                        <StatusBadge status={medicine.status === 'In Stock' ? 'Active' : medicine.status} size="xs" />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Stock Movement Logs for this Medicine (Requirement 12) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900 mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-brand-teal-600" />
              Recent Stock Movement Logs
            </h4>
            <div className="border border-brand-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-slate-50 text-[10px] font-bold text-brand-slate-600 uppercase border-b border-brand-slate-200">
                  <tr>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Transaction Type</th>
                    <th className="px-3 py-2">Quantity</th>
                    <th className="px-3 py-2">Movement</th>
                    <th className="px-3 py-2">Reason / Audit Trail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100">
                  {medicineHistory.length > 0 ? (
                    medicineHistory.map((h, idx) => (
                      <tr key={idx} className="hover:bg-brand-slate-50/70">
                        <td className="px-3 py-2 text-[11px] text-brand-slate-500 whitespace-nowrap">{h.date}</td>
                        <td className="px-3 py-2 font-semibold text-brand-navy-900">{h.transactionType}</td>
                        <td className={`px-3 py-2 font-mono font-bold ${h.quantity.startsWith('+') ? 'text-brand-green-700' : 'text-brand-coral-700'}`}>
                          {h.quantity}
                        </td>
                        <td className="px-3 py-2 font-mono text-[11px] text-brand-slate-600">
                          {h.previousStock} → {h.updatedStock}
                        </td>
                        <td className="px-3 py-2 text-brand-slate-600 text-[11px]">{h.reason}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-3 py-4 text-center text-brand-slate-400">
                        No recent stock movement history recorded for this SKU.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-brand-slate-50 border-t border-brand-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-brand-slate-700 bg-white border border-brand-slate-300 rounded-xl hover:bg-brand-slate-100 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
