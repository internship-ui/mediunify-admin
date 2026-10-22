import React, { useState } from 'react';
import { CheckCircle2, PackageCheck, AlertCircle, X, Check, ShieldCheck, Banknote, Calendar } from 'lucide-react';

export default function CompleteRentalModal({
  isOpen,
  onClose,
  request,
  onConfirmComplete
}) {
  const [returnDate, setReturnDate] = useState(
    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  );
  const [checklist, setChecklist] = useState({
    workingCondition: true,
    sanitized: true,
    vendorHandover: true,
    depositRefunded: true
  });
  const [returnNotes, setReturnNotes] = useState('Equipment returned in good condition, sanitized and returned to vendor.');

  if (!isOpen || !request) return null;

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = checklist.workingCondition && checklist.sanitized && checklist.vendorHandover;

  const handleComplete = () => {
    if (onConfirmComplete) {
      onConfirmComplete(request.id, {
        returnDate,
        returnNotes,
        finalAmount: request.totalAmount || request.price || 1500
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between bg-brand-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-green-50 text-brand-green-700 border border-brand-green-200">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-brand-navy-900 text-sm">Complete Equipment Rental</h3>
              <p className="text-[11px] text-brand-slate-500">
                Mark equipment as returned & finalize rental order #{request.id}
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

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Summary Information Card */}
          <div className="p-4 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80 space-y-2.5">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-brand-slate-200">
              <div>
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Equipment</span>
                <span className="font-bold text-brand-navy-900 text-sm">{request.equipment}</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Patient</span>
                <span className="font-bold text-brand-slate-800">{request.patientName}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Vendor</span>
                <span className="font-semibold text-brand-teal-700">{request.assignedVendor || 'Vendor Partner'}</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Rental Period</span>
                <span className="font-semibold text-brand-slate-700">{request.rentalStartDate} - {request.rentalEndDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Final Amount</span>
                <span className="font-extrabold text-brand-teal-700">₹{(request.totalAmount || request.price || 1500).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Return Date Input */}
          <div>
            <label className="text-xs font-bold text-brand-slate-700 block mb-1">
              Confirmed Return Date
            </label>
            <div className="relative">
              <input
                type="text"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl text-xs font-bold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
              />
              <Calendar className="w-4 h-4 text-brand-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Quality Return Checklist */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-brand-slate-700 mb-2">
              Return & Inspection Checklist
            </h5>
            <div className="space-y-2">
              <label
                onClick={() => toggleCheck('workingCondition')}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  checklist.workingCondition
                    ? 'bg-brand-green-50/60 border-brand-green-300 text-brand-green-900'
                    : 'bg-white border-brand-slate-200 text-brand-slate-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    checklist.workingCondition
                      ? 'bg-brand-green-600 border-brand-green-600 text-white'
                      : 'border-brand-slate-300'
                  }`}
                >
                  {checklist.workingCondition && <Check className="w-3 h-3" />}
                </div>
                <span className="font-semibold">Equipment inspected for full operational condition & zero physical defects</span>
              </label>

              <label
                onClick={() => toggleCheck('sanitized')}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  checklist.sanitized
                    ? 'bg-brand-green-50/60 border-brand-green-300 text-brand-green-900'
                    : 'bg-white border-brand-slate-200 text-brand-slate-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    checklist.sanitized
                      ? 'bg-brand-green-600 border-brand-green-600 text-white'
                      : 'border-brand-slate-300'
                  }`}
                >
                  {checklist.sanitized && <Check className="w-3 h-3" />}
                </div>
                <span className="font-semibold">Sanitization protocol verified prior to inventory restock</span>
              </label>

              <label
                onClick={() => toggleCheck('vendorHandover')}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  checklist.vendorHandover
                    ? 'bg-brand-green-50/60 border-brand-green-300 text-brand-green-900'
                    : 'bg-white border-brand-slate-200 text-brand-slate-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    checklist.vendorHandover
                      ? 'bg-brand-green-600 border-brand-green-600 text-white'
                      : 'border-brand-slate-300'
                  }`}
                >
                  {checklist.vendorHandover && <Check className="w-3 h-3" />}
                </div>
                <span className="font-semibold">Equipment handed over and signed-off by vendor logistic partner</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] font-bold text-brand-slate-600 block mb-1">
              Return Remarks / Feedback Notes
            </label>
            <input
              type="text"
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-brand-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-brand-slate-50 border-t border-brand-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-brand-slate-600 hover:bg-brand-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleComplete}
            disabled={!allChecked}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 ${
              allChecked
                ? 'bg-brand-green-600 hover:bg-brand-green-700 text-white active:scale-95'
                : 'bg-brand-slate-200 text-brand-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark as Completed</span>
          </button>
        </div>
      </div>
    </div>
  );
}
