import React from 'react';
import {
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
  FileCheck,
  CheckCircle,
  ShieldAlert,
  Send,
  FlaskConical,
  Pipette,
  Layers
} from 'lucide-react';

const ORDER_LIFECYCLE_STEPS = [
  { id: 'NEW', label: 'Order Booked' },
  { id: 'ADMIN VERIFIED', label: 'Admin Verified' },
  { id: 'COLLECTOR ASSIGNED', label: 'Collector Assigned' },
  { id: 'SAMPLE COLLECTED', label: 'Sample Collected' },
  { id: 'SAMPLE RECEIVED', label: 'Sample Received' },
  { id: 'REPORT UPLOADED', label: 'Ready Report Uploaded' },
  { id: 'COMPLETED', label: 'Completed & Delivered' }
];

export default function OrderTimeline({ order }) {
  if (!order) return null;

  const currentStatus = order.orderStatus || 'NEW';
  const isCancelled = currentStatus === 'CANCELLED';
  const isRecollection = currentStatus === 'RECOLLECTION REQUIRED';

  const currentStepIndex = ORDER_LIFECYCLE_STEPS.findIndex(
    (s) => s.id === currentStatus || 
           (currentStatus === 'VERIFIED' && s.id === 'ADMIN VERIFIED') ||
           ((currentStatus === 'COLLECTION SCHEDULED' || currentStatus === 'PHLEBOTOMIST ASSIGNED' || currentStatus === 'COLLECTOR ACCEPTED' || currentStatus === 'ON THE WAY' || currentStatus === 'ARRIVED' || currentStatus === 'PATIENT VERIFIED') && s.id === 'COLLECTOR ASSIGNED') ||
           (currentStatus === 'COLLECTED' && s.id === 'SAMPLE COLLECTED') ||
           ((currentStatus === 'RECEIVED' || currentStatus === 'SAMPLE VERIFIED' || currentStatus === 'PROCESSING' || currentStatus === 'IN LAB / PROCESSING' || currentStatus === 'REPORT PENDING') && s.id === 'SAMPLE RECEIVED') ||
           ((currentStatus === 'REPORT READY' || currentStatus === 'REPORT VERIFIED' || currentStatus === 'VERIFIED REPORT') && s.id === 'REPORT UPLOADED') ||
           (currentStatus === 'REPORT DELIVERED' && s.id === 'COMPLETED')
  );

  return (
    <div className="bg-white rounded-xl p-5 border border-brand-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-slate-100">
        <div>
          <h4 className="text-sm font-bold text-brand-navy-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-teal-600" />
            Order Operational Lifecycle
          </h4>
          <p className="text-xs text-brand-slate-500">
            Real-time track of sample collection, processing, and clinical report delivery
          </p>
        </div>
        {isCancelled ? (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-50 text-red-700 border border-red-200">
            ORDER CANCELLED
          </span>
        ) : isRecollection ? (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            RECOLLECTION REQUIRED
          </span>
        ) : (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200">
            Stage {Math.max(1, currentStepIndex + 1)} of {ORDER_LIFECYCLE_STEPS.length}
          </span>
        )}
      </div>

      {/* Visual Timeline Steps */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-slate-200">
        {order.timeline && order.timeline.length > 0 ? (
          order.timeline.map((item, idx) => {
            const isLast = idx === order.timeline.length - 1;
            const isError = item.step === 'CANCELLED' || item.step === 'REJECTED';

            return (
              <div key={idx} className="relative group">
                {/* Timeline Icon Marker */}
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs ${
                    isError
                      ? 'bg-brand-coral-500 text-white'
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
                      ? 'bg-brand-teal-50/50 border-brand-teal-200 shadow-xs'
                      : 'bg-brand-slate-50/60 border-brand-slate-200/70'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-brand-navy-900 flex items-center gap-1.5">
                      {item.title}
                      {isLast && !isCancelled && (
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
                    <p className="text-xs text-brand-slate-600 flex items-center gap-1.5 mb-1.5 font-medium">
                      <User className="w-3.5 h-3.5 text-brand-slate-400" />
                      Handled by: <span className="font-semibold text-brand-navy-800">{item.responsible}</span>
                    </p>
                  )}

                  {item.note && (
                    <p className="text-xs text-brand-slate-600 bg-white/90 p-2 rounded-lg border border-brand-slate-200/60 mt-1.5">
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

      {/* Next Expected Step Helper */}
      {!isCancelled && currentStepIndex < ORDER_LIFECYCLE_STEPS.length - 1 && (
        <div className="mt-5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-800">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Next Expected Action:</strong> Advance order to{' '}
            <span className="font-bold underline">{ORDER_LIFECYCLE_STEPS[currentStepIndex + 1]?.label}</span>
          </span>
        </div>
      )}
    </div>
  );
}
