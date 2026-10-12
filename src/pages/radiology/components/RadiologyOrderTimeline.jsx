import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  ScanLine,
  FileCheck,
  Building2,
  Calendar
} from 'lucide-react';

const ORDER_LIFECYCLE_STEPS = [
  { id: 'NEW', label: '1. App Booking Received' },
  { id: 'CONFIRMED', label: '2. Booking Confirmed' },
  { id: 'SCAN COMPLETED', label: '3. Scan Completed' },
  { id: 'REPORT UPLOADED', label: '4. Report Uploaded' },
  { id: 'COMPLETED', label: '5. Report Shared with Patient' }
];

export default function RadiologyOrderTimeline({ order }) {
  if (!order) return null;

  const currentStatus = order.orderStatus || 'NEW';
  const isCancelled = currentStatus === 'CANCELLED';
  const isRescheduled = currentStatus === 'RESCHEDULED';

  const currentStepIndex = ORDER_LIFECYCLE_STEPS.findIndex(
    (s) =>
      s.id === currentStatus ||
      ((currentStatus === 'CONFIRMED' || currentStatus === 'VERIFIED' || currentStatus === 'PATIENT SCHEDULED' || currentStatus === 'PATIENT ARRIVED' || currentStatus === 'SCAN IN PROGRESS') && s.id === 'CONFIRMED') ||
      ((currentStatus === 'SCAN COMPLETED' || currentStatus === 'RADIOLOGIST ASSIGNED' || currentStatus === 'REPORT PENDING') && s.id === 'SCAN COMPLETED') ||
      ((currentStatus === 'REPORT UPLOADED' || currentStatus === 'REPORT UNDER REVIEW' || currentStatus === 'REPORT VERIFIED') && s.id === 'REPORT UPLOADED') ||
      ((currentStatus === 'COMPLETED' || currentStatus === 'REPORT DELIVERED') && s.id === 'COMPLETED')
  );

  return (
    <div className="bg-white rounded-xl p-5 border border-brand-slate-200/80 shadow-2xs">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-slate-100">
        <div>
          <h4 className="text-sm font-bold text-brand-navy-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-teal-600" />
            Imaging Lifecycle & Execution Timeline
          </h4>
          <p className="text-xs text-brand-slate-500">
            Real-time track of patient booking, slot confirmation, scan execution, and report delivery
          </p>
        </div>
        {isCancelled ? (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-50 text-red-700 border border-red-200">
            ORDER CANCELLED
          </span>
        ) : isRescheduled ? (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            APPOINTMENT RESCHEDULED
          </span>
        ) : (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-navy-50 text-brand-navy-900 border border-brand-navy-200">
            Stage {Math.max(1, currentStepIndex + 1)} of 5
          </span>
        )}
      </div>

      {/* Timeline entries list */}
      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-slate-200">
        {order.timeline && order.timeline.length > 0 ? (
          order.timeline.map((item, idx) => {
            const isLast = idx === order.timeline.length - 1;
            const isError = item.step === 'CANCELLED' || item.step === 'REJECTED';
            const isResched = item.step === 'RESCHEDULED';

            return (
              <div key={idx} className="relative group">
                {/* Timeline Icon Marker */}
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs ${
                    isError
                      ? 'bg-brand-coral-500 text-white'
                      : isResched
                      ? 'bg-amber-500 text-white'
                      : isLast
                      ? 'bg-brand-teal-600 text-white animate-pulse'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {isError ? (
                    <AlertCircle className="w-3 h-3" />
                  ) : isLast ? (
                    <Clock className="w-3 h-3" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                </div>

                {/* Step Card */}
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    isLast
                      ? 'bg-brand-teal-50/40 border-brand-teal-200 shadow-xs'
                      : 'bg-brand-slate-50/60 border-brand-slate-200/70'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-brand-navy-900 flex items-center gap-1.5">
                      {item.title}
                      {isLast && !isCancelled && !isRescheduled && (
                        <span className="px-1.5 py-0.2 text-[10px] uppercase font-bold bg-brand-teal-600 text-white rounded">
                          Current Stage
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] font-medium text-brand-slate-500">
                      {item.timestamp}
                    </span>
                  </div>

                  {item.responsible && (
                    <p className="text-xs text-brand-slate-600 flex items-center gap-1.5 mb-1 font-medium">
                      <User className="w-3.5 h-3.5 text-brand-slate-400" />
                      Handled by: <span className="font-semibold text-brand-navy-800">{item.responsible}</span>
                    </p>
                  )}

                  {item.note && (
                    <p className="text-xs text-brand-slate-600 bg-white/90 p-2 rounded-lg border border-brand-slate-200/60 mt-1.5 leading-relaxed">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-brand-slate-400 italic">No timeline entries recorded yet.</p>
        )}
      </div>

      {/* Next expected action guide */}
      {!isCancelled && !isRescheduled && currentStepIndex >= 0 && currentStepIndex < ORDER_LIFECYCLE_STEPS.length - 1 && (
        <div className="mt-5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-900">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Next Operational Action:</strong> Advance order to{' '}
            <span className="font-bold underline">{ORDER_LIFECYCLE_STEPS[currentStepIndex + 1]?.label}</span>
          </span>
        </div>
      )}
    </div>
  );
}
