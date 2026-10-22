import React from 'react';
import { Building2, Phone, MapPin, CheckCircle, ShieldCheck, Clock, Truck, Star, ArrowRight } from 'lucide-react';

export default function VendorCard({
  vendor,
  isSelected = false,
  onSelect,
  onContact,
  requestedEquipment = 'Wheelchair',
  estimatedPrice = 1500
}) {
  if (!vendor) return null;

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all relative flex flex-col justify-between ${
        isSelected
          ? 'bg-teal-50/40 border-brand-teal-500 shadow-md ring-2 ring-brand-teal-500/20'
          : 'bg-white border-brand-slate-200/90 hover:border-brand-teal-300 hover:shadow-sm'
      }`}
    >
      {/* Top row: Name & Badges */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-navy-900 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-sm font-bold text-brand-navy-900 leading-tight">
                  {vendor.name}
                </h4>
                {vendor.verified && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-brand-teal-700 bg-brand-teal-50 px-1.5 py-0.2 rounded border border-brand-teal-200">
                    <ShieldCheck className="w-3 h-3 text-brand-teal-600" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-[11px] text-brand-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-brand-slate-400" />
                <span>{vendor.location}</span>
              </p>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{vendor.rating || 4.8}</span>
            </div>
            <span className="text-[10px] text-brand-slate-400 mt-0.5">
              {vendor.completedOrders || 120}+ orders
            </span>
          </div>
        </div>

        {/* Vendor Availability & SLA Specs */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-brand-slate-50 border border-brand-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-brand-slate-400 font-semibold uppercase">
              <Truck className="w-3 h-3 text-brand-teal-600" />
              <span>Delivery SLA</span>
            </div>
            <p className="text-xs font-bold text-brand-slate-800 mt-0.5">
              {vendor.deliverySLA || 'Within 2-4 Hours'}
            </p>
          </div>

          <div className="p-2 rounded-xl bg-brand-slate-50 border border-brand-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-brand-slate-400 font-semibold uppercase">
              <Clock className="w-3 h-3 text-brand-green-600" />
              <span>Stock Status</span>
            </div>
            <p className="text-xs font-bold text-brand-green-700 mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green-500 animate-pulse" />
              In Stock & Ready
            </p>
          </div>
        </div>

        {/* Equipment Categories Supplied */}
        <div className="mt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400">
            Supplied Categories
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {(vendor.equipmentCategories || ['Wheelchair', 'Hospital Bed', 'Oxygen Concentrator']).slice(0, 3).map((cat, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 bg-brand-slate-100 text-brand-slate-700 rounded-md border border-brand-slate-200"
              >
                {cat}
              </span>
            ))}
            {(vendor.equipmentCategories || []).length > 3 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 bg-brand-slate-50 text-brand-slate-500 rounded-md border border-brand-slate-200">
                +{(vendor.equipmentCategories || []).length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-4 pt-3 border-t border-brand-slate-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-brand-slate-400 block leading-tight">Est. Base Price</span>
          <span className="text-xs font-extrabold text-brand-teal-700">₹{estimatedPrice.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Contact Vendor Button */}
          <button
            type="button"
            onClick={() => onContact && onContact(vendor)}
            className="px-2.5 py-1.5 text-xs font-bold rounded-xl text-brand-teal-800 bg-brand-teal-50 hover:bg-brand-teal-100 border border-brand-teal-200 transition-colors inline-flex items-center gap-1 shadow-2xs"
            title={`Call or coordinate with ${vendor.name}`}
          >
            <Phone className="w-3.5 h-3.5 text-brand-teal-600" />
            <span>Contact Vendor</span>
          </button>

          {/* Select Vendor Button */}
          <button
            type="button"
            onClick={() => onSelect && onSelect(vendor)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1 shadow-xs ${
              isSelected
                ? 'bg-brand-teal-700 text-white'
                : 'bg-brand-navy-900 hover:bg-brand-navy-800 text-white active:scale-95'
            }`}
          >
            {isSelected ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Selected</span>
              </>
            ) : (
              <>
                <span>Select Vendor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
