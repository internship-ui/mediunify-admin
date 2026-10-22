import React, { useState } from 'react';
import { Warehouse, X, Plus, Check, ArrowRight, PackagePlus } from 'lucide-react';
import { PHARMACY_SUPPLIERS } from '../../../data/pharmacyData';

export default function AddStockModal({
  isOpen,
  onClose,
  medicines = [],
  selectedMedicineId = null,
  onConfirmAddStock
}) {
  const [selectedMedId, setSelectedMedId] = useState(
    selectedMedicineId || medicines[0]?.id || ''
  );
  const [batchNumber, setBatchNumber] = useState(`BAT26-${Math.floor(100 + Math.random() * 900)}`);
  const [quantity, setQuantity] = useState(100);
  const [mfgDate, setMfgDate] = useState('Jan 2026');
  const [expiryDate, setExpiryDate] = useState('Dec 2027');
  const [supplier, setSupplier] = useState(PHARMACY_SUPPLIERS[0]?.name || '');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stockReceivedDate, setStockReceivedDate] = useState(
    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  );
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [notes, setNotes] = useState('Routine supplier stock replenishment');

  if (!isOpen) return null;

  const currentMedicine = medicines.find((m) => m.id === selectedMedId) || medicines[0];
  const existingStock = currentMedicine?.availableStock || 0;
  const addedStock = Number(quantity || 0);
  const updatedStock = existingStock + addedStock;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentMedicine || addedStock <= 0) return;

    const payload = {
      medicineId: currentMedicine.id,
      medicineName: currentMedicine.name,
      batchNumber: batchNumber.trim() || currentMedicine.batchNumber,
      quantity: addedStock,
      mfgDate,
      expiryDate,
      supplier: supplier || currentMedicine.supplier,
      purchasePrice: purchasePrice ? Number(purchasePrice) : currentMedicine.purchasePrice,
      sellingPrice: sellingPrice ? Number(sellingPrice) : currentMedicine.sellingPrice,
      stockReceivedDate,
      invoiceNumber,
      notes,
      existingStock,
      updatedStock
    };

    onConfirmAddStock(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-brand-slate-100 flex items-center justify-between bg-brand-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-brand-navy-900 text-sm sm:text-base">
                Add Stock to Inventory
              </h3>
              <p className="text-[11px] text-brand-slate-500">
                Receive new replenishment batches into Central Pharmacy stock
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
          {/* Medicine Selection */}
          <div>
            <label className="text-xs font-bold text-brand-slate-700 block mb-1">
              Select Medicine *
            </label>
            <select
              value={selectedMedId}
              onChange={(e) => {
                setSelectedMedId(e.target.value);
                const found = medicines.find((m) => m.id === e.target.value);
                if (found) {
                  setSupplier(found.supplier || PHARMACY_SUPPLIERS[0]?.name);
                  setPurchasePrice(found.purchasePrice || '');
                  setSellingPrice(found.sellingPrice || '');
                }
              }}
              className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            >
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.genericName}) — Current Stock: {m.availableStock} Units
                </option>
              ))}
            </select>
          </div>

          {/* Stock Calculation Formula Card (Requirement 7) */}
          <div className="p-3.5 rounded-xl bg-brand-teal-50/50 border border-brand-teal-200 text-xs">
            <span className="font-bold text-brand-teal-950 uppercase tracking-wider text-[10px] block mb-2">
              Stock Calculation Preview
            </span>
            <div className="flex items-center justify-between font-mono">
              <div className="text-center">
                <span className="text-[10px] text-brand-slate-500 block">Existing Stock</span>
                <span className="text-base font-bold text-brand-navy-900">{existingStock}</span>
              </div>
              <span className="text-lg font-bold text-brand-teal-600">+</span>
              <div className="text-center">
                <span className="text-[10px] text-brand-teal-700 font-bold block">New Stock</span>
                <span className="text-base font-bold text-brand-teal-700">+{addedStock}</span>
              </div>
              <span className="text-lg font-bold text-brand-teal-600">=</span>
              <div className="text-center bg-white px-3 py-1 rounded-lg border border-brand-teal-200 shadow-2xs">
                <span className="text-[10px] text-brand-green-700 font-bold block">Updated Stock</span>
                <span className="text-lg font-extrabold text-brand-green-700">{updatedStock}</span>
              </div>
            </div>
          </div>

          {/* Batch & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Batch Number *
              </label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. PCM2026A02"
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-mono font-bold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Quantity Added (Units) *
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-bold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Manufacturing Date
              </label>
              <input
                type="text"
                value={mfgDate}
                onChange={(e) => setMfgDate(e.target.value)}
                placeholder="e.g. Feb 2026"
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Expiry Date *
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="e.g. Dec 2027"
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                required
              />
            </div>
          </div>

          {/* Supplier & Invoice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-brand-slate-100">
            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Supplier *
              </label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
              >
                {PHARMACY_SUPPLIERS.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Invoice / GRN Number *
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="e.g. INV-8821"
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-mono text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Purchase Price (₹ / unit)
              </label>
              <input
                type="number"
                step="0.01"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="e.g. 1.20"
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-slate-700 block mb-1">
                Stock Received Date
              </label>
              <input
                type="text"
                value={stockReceivedDate}
                onChange={(e) => setStockReceivedDate(e.target.value)}
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-slate-700 block mb-1">
              Notes & Stock Remarks
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Received via DHL Express, batch checked and verified."
              className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
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
              className="px-5 py-2.5 bg-brand-teal-700 hover:bg-brand-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Stock Addition</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
