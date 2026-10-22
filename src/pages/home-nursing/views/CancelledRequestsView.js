import React from 'react';
import {
  XCircle,
  Calendar,
  AlertCircle,
  Eye,
  MapPin,
  FileText
} from 'lucide-react';

export default function CancelledRequestsView({
  requests,
  customQuotes,
  onViewRequest,
  onOpenQuoteDetails
}) {
  const cancelledCareRequests = requests.filter((r) => r.status === 'Cancelled');
  const declinedQuotes = customQuotes.filter((q) => q.quoteStatus === 'Quote Declined' || q.quoteStatus === 'Cancelled');

  return (
    <div className="space-y-6 animate-fade-in text-brand-navy-900">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight">
              Cancelled Requests & Declined Quotes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
              {cancelledCareRequests.length + declinedQuotes.length} Total Closed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate-600 mt-1">
            Audit trail of patient cancellations, declined custom quotes, and closure reasons.
          </p>
        </div>
      </div>

      {/* Grid of Cancelled Care Requests and Declined Quotes */}
      <div className="space-y-4">
        {cancelledCareRequests.length === 0 && declinedQuotes.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-brand-slate-200 text-brand-slate-500 shadow-subtle">
            <XCircle className="w-8 h-8 text-brand-slate-300 mx-auto mb-2" />
            <p className="font-bold text-sm text-brand-navy-950">No cancelled requests or declined quotes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cancelledCareRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-brand-slate-500 bg-brand-slate-100 px-2 py-0.5 rounded border border-brand-slate-200">
                      {req.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                      Cancelled
                    </span>
                  </div>

                  <h3 className="font-black text-brand-navy-950 text-base">
                    {req.patientName}
                  </h3>
                  <p className="text-xs font-bold text-brand-navy-900 mt-0.5">
                    {req.serviceName}
                  </p>

                  <div className="mt-3 p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-xs text-rose-800 space-y-1">
                    <div className="font-bold">Cancellation Reason:</div>
                    <p className="text-rose-700 leading-relaxed">
                      {req.cancellationReason || 'Patient requested cancellation.'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-brand-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-brand-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-coral-600" />
                    {req.location}
                  </span>
                  <button
                    onClick={() => onViewRequest(req)}
                    className="px-3 py-1.5 text-xs font-bold text-brand-slate-700 bg-brand-slate-100 hover:bg-brand-slate-200 border border-brand-slate-200 rounded-xl"
                  >
                    View Audit Log
                  </button>
                </div>
              </div>
            ))}

            {declinedQuotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-brand-slate-500 bg-brand-slate-100 px-2 py-0.5 rounded border border-brand-slate-200">
                      {quote.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                      Quote Declined
                    </span>
                  </div>

                  <h3 className="font-black text-brand-navy-950 text-base">
                    {quote.patientName}
                  </h3>
                  <p className="text-xs font-bold text-brand-navy-900 mt-0.5">
                    {quote.requirementTitle}
                  </p>

                  <div className="mt-3 p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-xs text-rose-800 space-y-1">
                    <div className="font-bold">Quote Outcome:</div>
                    <p className="text-rose-700 leading-relaxed">
                      {quote.cancellationReason || 'Quotation declined by patient.'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-brand-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-brand-slate-500">
                    Quote: ₹{quote.quoteDetails?.totalQuote?.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => onOpenQuoteDetails(quote)}
                    className="px-3 py-1.5 text-xs font-bold text-brand-slate-700 bg-brand-slate-100 hover:bg-brand-slate-200 border border-brand-slate-200 rounded-xl"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
