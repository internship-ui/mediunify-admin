import React, { useState } from 'react';
import { Truck, MapPin, Phone, Calendar, Clock, CheckCircle2, ChevronRight, PackageCheck, AlertCircle, ArrowRight } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function DeliveryManagement({
  vendorName = 'Sri Sai Medical Rentals',
  vendorContact = '+91 98450 11223',
  equipment = 'Semi-Fowler Manual Hospital Bed',
  deliveryAddress = '#118, 12th Cross, Kuvempunagar, Mysore - 570023',
  expectedDeliveryDate = '29 Sep 2026, 11:30 AM',
  currentDeliveryStatus = 'Pending',
  onUpdateDeliveryStatus
}) {
  const [selectedStatus, setSelectedStatus] = useState(currentDeliveryStatus || 'Pending');
  const [driverName, setDriverName] = useState('Ravi Kumar (Field Logistics Lead)');
  const [driverPhone, setDriverPhone] = useState('+91 98450 77102');

  const deliverySteps = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

  const getStepIdx = (status) => {
    const idx = deliverySteps.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    if (onUpdateDeliveryStatus) {
      onUpdateDeliveryStatus(newStatus);
    }
  };

  const currentIdx = getStepIdx(selectedStatus);

  return (
    <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900">
              Delivery Logistics & Fulfillment Management
            </h3>
            <p className="text-[11px] text-brand-slate-500">
              Track dispatch milestones and update delivery status
            </p>
          </div>
        </div>

        <StatusBadge status={selectedStatus} size="sm" />
      </div>

      {/* Visual Stepper Progression */}
      <div className="py-2">
        <div className="relative flex items-center justify-between">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-brand-slate-100 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-brand-teal-600 -translate-y-1/2 z-0 transition-all duration-300"
            style={{
              width: `${(currentIdx / (deliverySteps.length - 1)) * 100}%`
            }}
          />

          {deliverySteps.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <button
                key={step}
                type="button"
                onClick={() => handleStatusChange(step)}
                className="relative z-10 flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                    isCompleted
                      ? 'bg-brand-teal-600 text-white ring-4 ring-brand-teal-50'
                      : isCurrent
                      ? 'bg-brand-navy-900 text-white ring-4 ring-brand-teal-100 animate-pulse'
                      : 'bg-white border-2 border-brand-slate-300 text-brand-slate-400 group-hover:border-brand-teal-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`mt-1.5 text-[11px] font-bold whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'text-brand-navy-900 font-extrabold'
                      : isCompleted
                      ? 'text-brand-teal-700'
                      : 'text-brand-slate-400'
                  }`}
                >
                  {step}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Delivery Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-1">
        <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80">
          <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Fulfilling Vendor</span>
          <p className="font-bold text-brand-navy-900 mt-0.5">{vendorName}</p>
          <a
            href={`tel:${vendorContact}`}
            className="text-[11px] text-brand-teal-700 hover:underline flex items-center gap-1 mt-1 font-semibold"
          >
            <Phone className="w-3 h-3" />
            <span>{vendorContact}</span>
          </a>
        </div>

        <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80">
          <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Equipment Item</span>
          <p className="font-bold text-brand-slate-800 mt-0.5">{equipment}</p>
          <span className="text-[11px] text-brand-green-700 font-semibold mt-1 block">
            Sanitized & Sealed Package
          </span>
        </div>

        <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80">
          <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Expected Delivery ETA</span>
          <p className="font-bold text-brand-navy-900 mt-0.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-teal-600" />
            <span>{expectedDeliveryDate}</span>
          </p>
          <span className="text-[10px] text-brand-slate-400 mt-1 block">Priority Home Dispatch</span>
        </div>
      </div>

      {/* Address & Quick Status Selector Row */}
      <div className="p-3.5 rounded-xl bg-teal-50/40 border border-brand-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2 max-w-lg">
          <MapPin className="w-4 h-4 text-brand-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-brand-slate-900">Destination: </span>
            <span className="text-brand-slate-700">{deliveryAddress}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-brand-slate-700 whitespace-nowrap">Update Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-1.5 bg-white border border-brand-teal-300 rounded-xl text-xs font-bold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
          >
            {deliverySteps.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
