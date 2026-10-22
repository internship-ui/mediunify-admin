import React, { useState } from 'react';
import { Sliders, X, AlertTriangle, Check, ArrowRight } from 'lucide-react';

export default function StockAdjustmentModal({
  isOpen,
  onClose,
  medicines = [],
  selectedMedicineId = null,
  onConfirmAdjustment
}) {
  const [selectedMedId, setSelectedMedId] = useState(
    selectedMedicineId || medicines[0]?.id || ''
  );
  const [adjustmentType, setAdjustmentType] = useState('Damaged Stock');
  const [quantity, setQuantity] = useState(10);
  const [reason, setReason] = useState('Damaged blister foil during humidity inspection');
  const [notes, setNotes] = useState('Quarantined for disposal protocol');
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  );

  if (!isOpen) return null;

  const currentMedicine = medicines.find((m) => m.id === selectedMedId) || medicines[0];
  const currentStock = currentMedicine?.availableStock || 0;
  const adjQty = Number(quantity || 0);

  // Calculate new stock based on adjustment type
  const isAddition = adjustmentType === 'Add Stock' || adjustmentType === 'Returned Stock';
  const updatedStock = isAddition
    ? currentStock + adjQty
    : Math.max(0, currentStock - adjQty);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentMedicine || adjQty <= 0) return;

    const payload = {
      medicineId: currentMedicine.id,
      medicineName: currentMedicine.name,
      batch: currentMedicine.batchNumber || 'BAT26-001',
      adjustmentType,
      quantity: isAddition ? `+${adjQty}` : `-${adjQty}`,
      previousStock: currentStock,
      updatedStock,
      reason,
      notes,
      date,
      performedBy: 'Pharmacy Admin'
    };

    onConfirmAdjustment(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-brand-slate-100 flex items-center justify-between bg-brand-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-brand-navy-900 text-sm sm:text-base">
                Record Stock Adjustment
              </h3>
              <p className="text-[11px] text-brand-slate-500">
                Log inventory write-offs, physical corrections, damaged or expired stock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-brand-slate-400 hover:text-brand-slate-700 p-1.5 rounded-lg hover:bg-brand-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Medicine Select */}
          <div>
            <label className="text-xs font-bold text-brand-slate-700 block mb-1">
              Select Medicine *
            </label>
            <select
              value={selectedMedId}
              onChange={(e) => setSelectedMedId(e.target.value)}
              className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (Batch: {m.batchNumber}) — Current Stock: {m.availableStock} Units
                </option>
              ))}
            </select>
          </div>

          {/* Adjustment Type Selection */}
          <div>
            <label className="text-xs font-bold text-brand-slate-700 block mb-1">
              Adjustment Type *
            </label>
            <select
              value={adjustmentType}
              onChange={(e) => {
                setAdjustmentType(e.target.value);
                if (e.target.value === 'Damaged Stock') setReason('Damaged packaging during storage handling');
                else if (e.target.value === 'Expired Stock') setReason('Expired batch removed for pharmaceutical incineration');
                else if (e.target.value === 'Stock Correction') setReason('Physical stock audit count variance adjustment');
                else if (e.target.value === 'Returned Stock') setReason('Customer returned undamaged sealed unit');
                else setReason('Inventory adjustment');
              }}
              className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="Damaged Stock">Damaged Stock (Stock Write-off)</option>
              <option value="Expired Stock">Expired Stock (Quarantine & Discard)</option>
              <option value="Stock Correction">Stock Correction (Audit Variance)</option>
              <option value="Remove Stock">Remove Stock (Manual Deduction)</option>
              <option value="Add Stock">Add Stock (Manual Addition)</option>
              <option value="Returned Stock">Returned Stock (Restock Inward)</option>
            </select>
          </div>

          {/* Adjustment Preview Banner (Requirement 8) */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
            <span className="font-bold text-amber-950 uppercase tracking-wider text-[10px] block mb-2">
              Adjustment Impact Preview
            </span>
            <div className="flex items-center justify-between font-mono">
              <div className="text-center">
                <span className="text-[10px] text-brand-slate-500 block">Current Stock</span>
                <span className="text-base font-bold text-brand-navy-900">{currentStock}</span>
              </div>
              <span className={`text-lg font-bold ${isAddition ? 'text-brand-green-600' : 'text-brand-coral-600'}`}>
                {isAddition ? '+' : '-'}
              </span>
              <div className="text-center">
                <span className={`text-[10px] font-bold block ${isAddition ? 'text-brand-green-700' : 'text-brand-coral-700'}`}>
                  Adjustment
                </span>
                <span className={`text-base font-bold ${isAddition ? 'text-brand-green-700' : 'text-brand-coral-700'}`}>
                  {adjQty}
                </span>
              </div>
              <span className="text-lg font-bold text-brand-slate-400">→</span>
              <div className="text-center bg-white px-3 py-1 rounded-lg border border-amber-200 shadow-2xs">
                <span className="text-[10px] text-brand-navy-900 font-bold block">Updated Stock</span>
                <span className="text-lg font-extrabold text-brand-navy-900">{updatedStock}</span>
              </div>
            </div>
          </div>

          {/* Quantity & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Adjustment Quantity *
              </label>
              <input
                type="number"
                min="1"
                max={!isAddition ? currentStock : 10000}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-bold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Date of Adjustment
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate-700 block mb-1">
              Official Reason / Audit Finding *
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Water damage during roof leakage in Row 3 warehouse"
              className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate-700 block mb-1">
              Internal Notes & Disposal Remarks
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Incident report filed with Pharmacist in Charge."
              className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-brand-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-brand-slate-600 hover:bg-brand-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Record Stock Adjustment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
