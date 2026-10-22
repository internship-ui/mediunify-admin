import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  User,
  Phone
} from 'lucide-react';
import Modal from '../../../components/common/Modal';

const STATUS_CHOICES = [
  { value: 'Pending Assignment', label: 'Pending Assignment', desc: 'Awaiting partner pharmacy selection' },
  { value: 'Assigned', label: 'Assigned', desc: 'Routed to partner pharmacy, awaiting partner acceptance' },
  { value: 'Accepted', label: 'Accepted', desc: 'Partner pharmacy confirmed prescription & stock availability' },
  { value: 'Preparing', label: 'Preparing', desc: 'Medicines being packaged and quality checked at external store' },
  { value: 'Dispatched', label: 'Dispatched', desc: 'Handed over to delivery rider, en route to patient location' },
  { value: 'Delivered', label: 'Delivered', desc: 'Successfully handed over to patient at delivery destination' },
  { value: 'Cancelled', label: 'Cancelled', desc: 'Order cancelled or rejected by partner' }
];

export default function UpdateOrderStatusModal({
  isOpen,
  onClose,
  order,
  onUpdateStatus
}) {
  const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || 'Preparing');
  const [notes, setNotes] = useState('');
  const [riderName, setRiderName] = useState(order?.deliveryRider?.name || 'Kishore Kumar');
  const [riderPhone, setRiderPhone] = useState(order?.deliveryRider?.phone || '+91 98450 67890');
  const [vehicle, setVehicle] = useState(order?.deliveryRider?.vehicle || 'Two-Wheeler / Bike');

  if (!order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const riderInfo =
      selectedStatus === 'Dispatched' || selectedStatus === 'Delivered'
        ? {
            name: riderName,
            phone: riderPhone,
            vehicle: vehicle
          }
        : order.deliveryRider;

    onUpdateStatus(order.orderId, selectedStatus, notes, riderInfo);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update External Order Status"
      subtitle={`Change fulfillment status for Order ${order.orderId} (${order.assignedPartnerPharmacy?.name || 'Unassigned'})`}
      maxWidth="max-w-xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Update Status</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order mini summary */}
        <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200 text-xs flex justify-between items-center">
          <div>
            <span className="font-bold text-brand-navy-900 block">
              Patient: {order.patientName} • {order.patientArea}
            </span>
            <span className="text-brand-slate-500 text-[11px]">
              Unavailable medicines: {order.unavailableMedicines?.map((m) => m.name).join(', ')}
            </span>
          </div>
          <div className="text-right font-mono font-bold text-brand-teal-800">
            Current: {order.orderStatus}
          </div>
        </div>

        {/* Status Options */}
        <div>
          <label className="block text-xs font-bold text-brand-navy-900 mb-2">
            Select Next Order Status
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {STATUS_CHOICES.map((choice) => {
              const active = selectedStatus === choice.value;
              return (
                <div
                  key={choice.value}
                  onClick={() => setSelectedStatus(choice.value)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    active
                      ? 'bg-brand-teal-50 border-brand-teal-500 ring-2 ring-brand-teal-500/20 text-brand-teal-950 font-bold'
                      : 'bg-white border-brand-slate-200 hover:border-brand-slate-300 text-brand-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span>{choice.label}</span>
                    {active && <CheckCircle2 className="w-4 h-4 text-brand-teal-600 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-brand-slate-500 font-normal mt-0.5 leading-tight">
                    {choice.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dispatch / Rider Details (Conditional on Dispatched) */}
        {(selectedStatus === 'Dispatched' || selectedStatus === 'Delivered') && (
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
              <Truck className="w-3.5 h-3.5 text-blue-700" />
              <span>Delivery Logistics Rider Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-blue-900 mb-1">Rider Name</label>
                <input
                  type="text"
                  value={riderName}
                  onChange={(e) => setRiderName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-blue-200 bg-white"
                  placeholder="Kishore Kumar"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-blue-900 mb-1">Rider Contact</label>
                <input
                  type="text"
                  value={riderPhone}
                  onChange={(e) => setRiderPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-blue-200 bg-white font-mono"
                  placeholder="+91 98450 67890"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-blue-900 mb-1">Vehicle</label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-blue-200 bg-white"
                  placeholder="Bike / Scooter"
                />
              </div>
            </div>
          </div>
        )}

        {/* Update Notes */}
        <div>
          <label className="block text-xs font-bold text-brand-navy-900 mb-1">
            Status Transition Audit Note
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={`e.g. Order updated to ${selectedStatus} by MediUnify Admin`}
            className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500 font-medium"
          />
        </div>
      </form>
    </Modal>
  );
}
