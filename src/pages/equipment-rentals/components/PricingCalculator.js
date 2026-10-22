import React, { useState, useEffect } from 'react';
import { Calculator, Tag, Percent, IndianRupee, ShieldAlert, Check, RefreshCw } from 'lucide-react';

export default function PricingCalculator({
  initialPrice = 1500,
  initialDays = 7,
  initialDelivery = 200,
  initialAdditional = 0,
  initialDiscount = 100,
  onUpdatePricing,
  isEditable = true
}) {
  const [rentalPrice, setRentalPrice] = useState(initialPrice);
  const [days, setDays] = useState(initialDays || 7);
  const [deliveryCharge, setDeliveryCharge] = useState(initialDelivery);
  const [additionalCharges, setAdditionalCharges] = useState(initialAdditional);
  const [discount, setDiscount] = useState(initialDiscount);

  // Sync when initial values change
  useEffect(() => {
    setRentalPrice(initialPrice);
    setDays(initialDays || 7);
    setDeliveryCharge(initialDelivery);
    setAdditionalCharges(initialAdditional);
    setDiscount(initialDiscount);
  }, [initialPrice, initialDays, initialDelivery, initialAdditional, initialDiscount]);

  // Compute Total
  const subtotal = Number(rentalPrice) || 0;
  const delivery = Number(deliveryCharge) || 0;
  const additional = Number(additionalCharges) || 0;
  const disc = Number(discount) || 0;
  const totalAmount = Math.max(0, subtotal + delivery + additional - disc);

  const handleApply = () => {
    if (onUpdatePricing) {
      onUpdatePricing({
        rentalPrice: subtotal,
        rentalDays: Number(days),
        deliveryCharge: delivery,
        additionalCharges: additional,
        discount: disc,
        totalAmount
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900">
              Rental Price & Billing Breakdown
            </h3>
            <p className="text-[11px] text-brand-slate-500">
              Real-time automated charge calculation
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-brand-teal-700 bg-brand-teal-50 px-2.5 py-0.5 rounded-full border border-brand-teal-200">
          Auto Computed
        </span>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
        {/* Equipment Rental Price */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-brand-slate-700 block">
            Rental Price (₹)
          </label>
          <div className="relative">
            <input
              type="number"
              value={rentalPrice}
              onChange={(e) => setRentalPrice(Number(e.target.value))}
              disabled={!isEditable}
              className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-bold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:bg-white transition-all disabled:opacity-75"
            />
          </div>
          <span className="text-[10px] text-brand-slate-400">Base duration charge</span>
        </div>

        {/* Number of Rental Days */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-brand-slate-700 block">
            Rental Days
          </label>
          <div className="relative">
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              disabled={!isEditable}
              className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-bold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:bg-white transition-all disabled:opacity-75"
            />
          </div>
          <span className="text-[10px] text-brand-slate-400">Period length</span>
        </div>

        {/* Delivery Charge */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-brand-slate-700 block">
            Delivery Charge (₹)
          </label>
          <div className="relative">
            <input
              type="number"
              value={deliveryCharge}
              onChange={(e) => setDeliveryCharge(Number(e.target.value))}
              disabled={!isEditable}
              className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-bold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:bg-white transition-all disabled:opacity-75"
            />
          </div>
          <span className="text-[10px] text-brand-slate-400">Vendor logistics</span>
        </div>

        {/* Additional Charges */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-brand-slate-700 block">
            Additional (₹)
          </label>
          <div className="relative">
            <input
              type="number"
              value={additionalCharges}
              onChange={(e) => setAdditionalCharges(Number(e.target.value))}
              disabled={!isEditable}
              className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-bold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:bg-white transition-all disabled:opacity-75"
            />
          </div>
          <span className="text-[10px] text-brand-slate-400">Assembly / accessories</span>
        </div>

        {/* Discount */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-brand-slate-700 block">
            Discount (₹)
          </label>
          <div className="relative">
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              disabled={!isEditable}
              className="w-full px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl font-bold text-brand-green-700 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 focus:bg-white transition-all disabled:opacity-75"
            />
          </div>
          <span className="text-[10px] text-brand-slate-400">Special concession</span>
        </div>
      </div>

      {/* Real-time Calculation Display Banner */}
      <div className="p-4 rounded-xl bg-brand-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-[10px] text-brand-slate-400 uppercase block font-semibold">Base Price</span>
            <span className="font-bold text-white">₹{subtotal.toLocaleString()}</span>
          </div>
          <span className="text-brand-slate-500 font-bold">+</span>
          <div>
            <span className="text-[10px] text-brand-slate-400 uppercase block font-semibold">Delivery</span>
            <span className="font-bold text-white">₹{delivery.toLocaleString()}</span>
          </div>
          {additional > 0 && (
            <>
              <span className="text-brand-slate-500 font-bold">+</span>
              <div>
                <span className="text-[10px] text-brand-slate-400 uppercase block font-semibold">Additional</span>
                <span className="font-bold text-white">₹{additional.toLocaleString()}</span>
              </div>
            </>
          )}
          {disc > 0 && (
            <>
              <span className="text-brand-slate-500 font-bold">-</span>
              <div>
                <span className="text-[10px] text-brand-slate-400 uppercase block font-semibold">Discount</span>
                <span className="font-bold text-brand-teal-300">₹{disc.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-brand-teal-300 uppercase block font-bold">Total Patient Payable</span>
            <span className="text-xl font-extrabold text-white tracking-tight">
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>

          {isEditable && (
            <button
              type="button"
              onClick={handleApply}
              className="px-3 py-2 bg-brand-teal-500 hover:bg-brand-teal-400 text-brand-navy-950 rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1 active:scale-95 flex-shrink-0"
              title="Save updated pricing values"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Update Pricing</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
