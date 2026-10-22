import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  X,
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Download,
  ArrowRight,
  PackagePlus,
  RefreshCw,
  Info,
  Check
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function ImportStockExcelModal({
  isOpen,
  onClose,
  medicines = [],
  onConfirmBulkStockUpdate
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importMode, setImportMode] = useState('ADD'); // 'ADD' (Replenish: Current + Qty) | 'OVERWRITE' (Stocktake: Set exact count)

  if (!isOpen) return null;

  // 1. Download formatted sample template (.xlsx)
  const handleDownloadTemplate = () => {
    const sampleData = [
      {
        'Medicine ID': 'MED001',
        'Medicine Name': 'Paracetamol 500mg',
        'Quantity': 250,
        'Batch Number': 'PCM2026B12',
        'Expiry Date': 'Dec 2028',
        'Mfg Date': 'Sep 2026',
        'Purchase Price': 1.25,
        'Selling Price': 2.00,
        'Supplier': 'ABC Pharma Distributors',
        'Invoice Number': 'INV-2026-901'
      },
      {
        'Medicine ID': 'MED002',
        'Medicine Name': 'Amoxicillin 500mg',
        'Quantity': 150,
        'Batch Number': 'AMX2026B15',
        'Expiry Date': 'Jan 2029',
        'Mfg Date': 'Aug 2026',
        'Purchase Price': 5.50,
        'Selling Price': 8.50,
        'Supplier': 'ABC Pharma Distributors',
        'Invoice Number': 'INV-2026-901'
      },
      {
        'Medicine ID': 'MED003',
        'Medicine Name': 'Azithromycin 500mg',
        'Quantity': 100,
        'Batch Number': 'AZI26-095',
        'Expiry Date': 'Oct 2027',
        'Mfg Date': 'Jul 2026',
        'Purchase Price': 14.00,
        'Selling Price': 22.00,
        'Supplier': 'Global Health Wholesalers',
        'Invoice Number': 'INV-2026-901'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock_Intake_Template');
    XLSX.writeFile(wb, 'MediUnify_Pharmacy_Stock_Template.xlsx');
    addToast('Sample stock Excel template downloaded!', 'success');
  };

  // Helper to extract value regardless of case or alias in headers
  const getField = (row, ...aliases) => {
    for (const key of Object.keys(row)) {
      const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      for (const alias of aliases) {
        if (cleanKey === alias.toLowerCase().replace(/[^a-z0-9]/g, '')) {
          return row[key];
        }
      }
    }
    return '';
  };

  // 2. Parse uploaded Excel / CSV file
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result;
        const wb = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          addToast('Uploaded Excel sheet is empty.', 'warning');
          setIsProcessing(false);
          return;
        }

        // Process and match each row with the medicine catalog
        const processed = rawJson.map((row, idx) => {
          const rawId = String(getField(row, 'medicineid', 'id', 'sku', 'code') || '').trim();
          const rawName = String(getField(row, 'medicinename', 'name', 'itemname', 'product') || '').trim();
          const rawQty = Number(getField(row, 'quantity', 'qty', 'stock', 'newstock', 'addedstock') || 0);
          const rawBatch = String(getField(row, 'batchnumber', 'batch', 'batchno') || '').trim();
          const rawExpiry = String(getField(row, 'expirydate', 'expiry', 'expdate') || '').trim();
          const rawMfg = String(getField(row, 'mfgdate', 'mfg', 'manufacturingdate') || '').trim();
          const rawPurchase = getField(row, 'purchaseprice', 'purchase', 'costprice', 'cost');
          const rawSelling = getField(row, 'sellingprice', 'selling', 'mrp', 'price');
          const rawSupplier = String(getField(row, 'supplier', 'vendor') || '').trim();
          const rawInvoice = String(getField(row, 'invoicenumber', 'invoice', 'invoiceno', 'billno') || '').trim();

          // Match by ID or Name
          const matchedMed = medicines.find(
            (m) =>
              (rawId && m.id?.toLowerCase() === rawId.toLowerCase()) ||
              (rawName && m.name?.toLowerCase() === rawName.toLowerCase())
          );

          const currentStock = Number(matchedMed?.availableStock || 0);
          const validQuantity = !isNaN(rawQty) && rawQty >= 0;

          return {
            rowIdx: idx + 1,
            medicineId: matchedMed?.id || rawId || `ROW-${idx + 1}`,
            medicineName: matchedMed?.name || rawName || 'Unknown Medicine',
            matched: Boolean(matchedMed),
            matchedMed,
            currentStock,
            inputQuantity: validQuantity ? rawQty : 0,
            batchNumber: rawBatch || matchedMed?.batchNumber || `BAT26-${Math.floor(100 + Math.random() * 900)}`,
            expiryDate: rawExpiry || matchedMed?.expiryDate || 'Dec 2028',
            mfgDate: rawMfg || matchedMed?.mfgDate || 'Sep 2026',
            purchasePrice: rawPurchase ? Number(rawPurchase) : matchedMed?.purchasePrice || 0,
            sellingPrice: rawSelling ? Number(rawSelling) : matchedMed?.sellingPrice || 0,
            supplier: rawSupplier || matchedMed?.supplier || 'Central Warehouse',
            invoiceNumber: rawInvoice || 'EXCEL-IMPORT',
            isValid: validQuantity && (Boolean(matchedMed) || Boolean(rawName))
          };
        });

        setParsedRows(processed);
        addToast(`Successfully parsed ${processed.length} rows from ${file.name}`, 'success');
      } catch (err) {
        console.error('Excel parse error:', err);
        addToast('Error reading Excel file. Please ensure it is a valid .xlsx or .xls file.', 'error');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // 3. Confirm and apply bulk stock updates
  const handleApplyUpdates = () => {
    const validRows = parsedRows.filter((r) => r.isValid && r.matched);
    if (validRows.length === 0) {
      addToast('No valid matched medicines found to update.', 'warning');
      return;
    }

    onConfirmBulkStockUpdate({
      items: validRows,
      importMode,
      fileName
    });

    onClose();
  };

  const matchedCount = parsedRows.filter((r) => r.matched).length;
  const totalUnits = parsedRows
    .filter((r) => r.matched)
    .reduce((sum, r) => sum + r.inputQuantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in-50 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-100 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-brand-navy-900 tracking-tight">
                Bulk Stock Intake via Excel (.xlsx)
              </h3>
              <p className="text-xs text-brand-slate-500">
                Upload supplier invoice or warehouse inventory spreadsheets to update stock levels in bulk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Download pre-formatted Excel template"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Download Template</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 rounded-lg hover:bg-brand-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-brand-slate-300 hover:border-emerald-500 bg-brand-slate-50/70 hover:bg-emerald-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white border border-brand-slate-200 shadow-2xs flex items-center justify-center text-brand-slate-500 group-hover:text-emerald-600 group-hover:border-emerald-300 transition-colors mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-brand-navy-900">
              {fileName ? (
                <span className="text-emerald-700 flex items-center justify-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4" /> {fileName}
                </span>
              ) : (
                'Click or drag & drop supplier Excel sheet here'
              )}
            </p>
            <p className="text-xs text-brand-slate-500 mt-1">
              Supports Microsoft Excel (.xlsx, .xls) and CSV spreadsheets
            </p>
          </div>

          {/* Configuration Options Strip (when rows are loaded) */}
          {parsedRows.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-brand-navy-900 text-white rounded-xl shadow-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] text-brand-teal-300 font-bold uppercase tracking-wider block">
                    Total Rows
                  </span>
                  <strong className="text-sm font-extrabold">{parsedRows.length}</strong>
                </div>
                <div className="h-6 w-px bg-white/20" />
                <div>
                  <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                    Matched SKUs
                  </span>
                  <strong className="text-sm font-extrabold text-emerald-400">
                    {matchedCount} / {parsedRows.length}
                  </strong>
                </div>
                <div className="h-6 w-px bg-white/20" />
                <div>
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                    Total Units
                  </span>
                  <strong className="text-sm font-extrabold text-amber-300">
                    +{totalUnits.toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-lg border border-white/20 text-xs">
                <span className="text-[11px] text-brand-slate-300 px-2 font-medium">Update Logic:</span>
                <button
                  type="button"
                  onClick={() => setImportMode('ADD')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    importMode === 'ADD'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                  title="Adds incoming quantity to current existing stock"
                >
                  Replenish (Current + Qty)
                </button>
                <button
                  type="button"
                  onClick={() => setImportMode('OVERWRITE')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    importMode === 'OVERWRITE'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                  title="Sets the available stock to the exact count in Excel"
                >
                  Stocktake Count (Set Exact)
                </button>
              </div>
            </div>
          )}

          {/* Preview Table */}
          {parsedRows.length > 0 && (
            <div className="border border-brand-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-brand-slate-50 px-4 py-2.5 border-b border-brand-slate-200 flex items-center justify-between">
                <h4 className="font-bold text-brand-navy-900 text-xs flex items-center gap-1.5">
                  <span>Parsed Stock Items Preview</span>
                  <span className="text-[10px] text-brand-slate-500 font-normal">
                    (Verify matched medicines before applying updates)
                  </span>
                </h4>
                <span className="text-[10px] font-bold text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                  {importMode === 'ADD' ? 'Mode: Add to Existing Stock' : 'Mode: Set Exact Count'}
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-slate-100/80 text-[10px] font-bold text-brand-slate-500 uppercase tracking-wider sticky top-0 border-b border-brand-slate-200">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Medicine & ID</th>
                      <th className="py-2 px-3 text-right">Current Stock</th>
                      <th className="py-2 px-3 text-right">Excel Qty</th>
                      <th className="py-2 px-3 text-right">Projected Stock</th>
                      <th className="py-2 px-3">Batch & Expiry</th>
                      <th className="py-2 px-3">Supplier / Invoice</th>
                      <th className="py-2 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-slate-100">
                    {parsedRows.map((row) => {
                      const projected =
                        importMode === 'ADD'
                          ? row.currentStock + row.inputQuantity
                          : row.inputQuantity;

                      return (
                        <tr
                          key={row.rowIdx}
                          className={`hover:bg-brand-slate-50 transition-colors ${
                            !row.matched ? 'bg-amber-50/30' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono text-[10px] text-brand-slate-400">
                            {row.rowIdx}
                          </td>
                          <td className="py-2.5 px-3">
                            <strong className="text-brand-navy-900 block font-bold">
                              {row.medicineName}
                            </strong>
                            <span className="text-[10px] font-mono text-brand-slate-400">
                              {row.medicineId}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium text-brand-slate-600">
                            {row.matched ? `${row.currentStock} Units` : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                            +{row.inputQuantity}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {row.matched ? (
                              <strong className="text-brand-navy-900 font-extrabold">
                                {projected} Units
                              </strong>
                            ) : (
                              <span className="text-brand-slate-400 italic text-[11px]">Unmatched</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-mono text-[11px] font-semibold text-brand-slate-700 block">
                              {row.batchNumber}
                            </span>
                            <span className="text-[10px] text-brand-slate-400">
                              Exp: {row.expiryDate}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-brand-slate-600">
                            <span className="truncate max-w-[140px] block">{row.supplier}</span>
                            <span className="text-[10px] text-brand-slate-400 font-mono">
                              {row.invoiceNumber}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {row.matched ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <Check className="w-3 h-3 text-emerald-600" /> Matched
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                <AlertTriangle className="w-3 h-3 text-amber-600" /> New SKU / Check
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quick Guidance Box */}
          <div className="p-3.5 bg-brand-slate-50 rounded-xl border border-brand-slate-200 flex items-start gap-2.5 text-xs text-brand-slate-600">
            <Info className="w-4 h-4 text-brand-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-brand-navy-900 mb-0.5">Automated Multi-Ledger Update:</p>
              <p className="text-[11px] text-brand-slate-500 leading-relaxed">
                Applying updates will automatically adjust <strong>Available Stock</strong> in the medicine catalog, create/update batches under <strong>Batch Management</strong>, and log an audit trail entry under <strong>Stock History</strong>.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-brand-slate-100 bg-brand-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-brand-slate-200 hover:bg-white text-brand-slate-600 rounded-xl font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplyUpdates}
            disabled={parsedRows.length === 0 || matchedCount === 0 || isProcessing}
            className={`px-5 py-2.5 rounded-xl font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer ${
              parsedRows.length > 0 && matchedCount > 0 && !isProcessing
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-brand-slate-200 text-brand-slate-400 cursor-not-allowed'
            }`}
          >
            <PackagePlus className="w-4 h-4" />
            <span>Apply Stock Update ({matchedCount} Items)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
