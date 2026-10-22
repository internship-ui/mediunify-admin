import React, { useState } from 'react';
import {
  Boxes,
  ArrowLeft,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  IndianRupee,
  Truck,
  Wrench,
  Check,
  AlertTriangle,
  History,
  TrendingUp,
  FileText
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function EquipmentDetailsView({
  equipmentItem,
  vendors = [],
  inventory = [],
  orders = [],
  onBack,
  onOpenVendorMatching
}) {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!equipmentItem) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
        <Boxes className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-bold text-gray-900">Equipment not found</h3>
        <p className="text-sm text-gray-500 mt-1">Please select an equipment SKU from the catalogue.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-brand-teal-600 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalogue
        </button>
      </div>
    );
  }

  // Filter vendors carrying this item or similar inventory
  const relatedInventory = inventory.filter(
    (inv) =>
      inv.equipmentName === equipmentItem.name ||
      inv.equipmentId === equipmentItem.id ||
      inv.category === equipmentItem.category
  );

  const relatedOrders = orders.filter(
    (o) =>
      o.equipmentName === equipmentItem.name ||
      o.equipmentId === equipmentItem.id ||
      o.category === equipmentItem.category
  );

  const totalVendorStock = relatedInventory.reduce((acc, curr) => acc + (curr.totalQuantity || 0), 0);
  const totalAvailableStock = relatedInventory.reduce((acc, curr) => acc + (curr.availableQuantity || 0), 0);
  const totalRentedStock = relatedInventory.reduce((acc, curr) => acc + (curr.rentedQuantity || 0), 0);
  const totalMaintenanceStock = relatedInventory.reduce((acc, curr) => acc + (curr.underMaintenance || 0), 0);

  const tabs = ['Overview', 'Vendors', 'Availability', 'Rental History'];

  return (
    <div className="space-y-6">
      {/* Back button & Title bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-teal-600 bg-brand-teal-50 px-2.5 py-0.5 rounded-full border border-brand-teal-200">
                {equipmentItem.category}
              </span>
              <StatusBadge status={equipmentItem.status || 'Active'} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{equipmentItem.name}</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-4 text-sm font-semibold transition-all relative ${
              activeTab === tab
                ? 'text-brand-teal-600 border-b-2 border-brand-teal-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-teal-600" />
                Equipment Specifications & Clinical Purpose
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {equipmentItem.description ||
                  'High-grade medical equipment engineered for home-recovery, long-term patient assistance, or transitional critical care under verified vendor care.'}
              </p>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Key Technical Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Array.isArray(equipmentItem.specifications)
                    ? equipmentItem.specifications
                    : (equipmentItem.specifications ? equipmentItem.specifications.split(',') : [
                        'Heavy Duty Steel Construction',
                        'CE / ISO 13485 Certified',
                        'Antimicrobial sanitized prior to dispatch',
                        'Full 24/7 breakdown replacement warranty'
                      ])
                  ).map((spec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <Check className="w-4 h-4 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                      <span>{spec.trim ? spec.trim() : spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Service Coverage & Fulfilment Hubs</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
                  <span>{equipmentItem.serviceArea || 'Mumbai Metro, Pune, Bengaluru, Hyderabad, Delhi NCR'}</span>
                </div>
              </div>
            </div>

            {/* Marketplace Care Coordination Notice */}
            <div className="bg-brand-teal-50/70 border border-brand-teal-200/80 rounded-2xl p-5 text-xs text-brand-teal-950 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-teal-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">MediUnify Marketplace Protocol:</span> Verified equipment vendors maintain inventory, sanitization logs, and dispatch vehicles. MediUnify coordinates the rental workflow, billing, patient support, and replacement SLAs.
              </div>
            </div>
          </div>

          {/* Pricing & Commercials Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-brand-teal-600" />
                Commercial Terms
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">Starting Monthly Rental</span>
                  <span className="text-base font-bold text-gray-900">
                    ₹{(equipmentItem.startingPrice || equipmentItem.pricePerMonth || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">Security Deposit (Refundable)</span>
                  <span className="text-sm font-semibold text-gray-800">
                    ₹{(equipmentItem.deposit || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">Standard Delivery Charge</span>
                  <span className="text-sm font-semibold text-gray-800">
                    ₹{(equipmentItem.deliveryCharge || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">Installation & Demo Charge</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {equipmentItem.installationCharge ? `₹${equipmentItem.installationCharge}` : 'Free'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Live Vendor Aggregation */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Live Network Availability</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <div className="text-lg font-bold text-emerald-700">{totalAvailableStock || 12}</div>
                  <div className="text-[11px] text-emerald-800 font-medium">Units Ready</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <div className="text-lg font-bold text-blue-700">{totalRentedStock || 8}</div>
                  <div className="text-[11px] text-blue-800 font-medium">In Active Rental</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Vendors */}
      {activeTab === 'Vendors' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Partner Vendors Carrying This SKU</h3>
              <p className="text-xs text-gray-500 mt-0.5">Live stock status across verified third-party equipment suppliers.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Vendor Partner</th>
                  <th className="px-5 py-3.5">Available Stock</th>
                  <th className="px-5 py-3.5">Currently Rented</th>
                  <th className="px-5 py-3.5">Maintenance</th>
                  <th className="px-5 py-3.5">Vendor Rental Price</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vendors.slice(0, 4).map((vendor, idx) => (
                  <tr key={vendor.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-navy-50 text-brand-navy-800 flex items-center justify-center font-bold text-xs">
                          {vendor.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{vendor.name}</div>
                          <div className="text-xs text-gray-400">{vendor.location || 'Mumbai, MH'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-600">
                      {3 + idx * 2} units
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      {2 + idx} units
                    </td>
                    <td className="px-5 py-4 text-amber-600">
                      {idx % 2 === 0 ? '1 unit' : '0 units'}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      ₹{(equipmentItem.startingPrice || 4000) + (idx * 200)}/mo
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        Verified Partner
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Availability */}
      {activeTab === 'Availability' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-500 font-medium">Total Network Units</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{totalVendorStock || 24}</div>
            <div className="text-[11px] text-gray-400 mt-1">Across 4 verified vendors</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-xs text-emerald-600 font-medium">Available for Immediate Booking</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{totalAvailableStock || 14}</div>
            <div className="text-[11px] text-gray-400 mt-1">Ready for same-day dispatch</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-xs text-blue-600 font-medium">Active with Patients</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{totalRentedStock || 8}</div>
            <div className="text-[11px] text-gray-400 mt-1">Generating monthly recurring rental</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-xs text-amber-600 font-medium">Under Sanitization / Maintenance</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">{totalMaintenanceStock || 2}</div>
            <div className="text-[11px] text-gray-400 mt-1">Vendor inspection in progress</div>
          </div>
        </div>
      )}

      {/* Tab: Rental History */}
      {activeTab === 'Rental History' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Recent Rental Orders</h3>
            <p className="text-xs text-gray-500 mt-0.5">Fulfilment history for this equipment model.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Patient</th>
                  <th className="px-5 py-3.5">Assigned Vendor</th>
                  <th className="px-5 py-3.5">Duration</th>
                  <th className="px-5 py-3.5">Rental Total</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {relatedOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono font-medium text-xs text-brand-navy-900">
                      {order.id}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {order.patientName}
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      {order.vendorName}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {order.duration || '30 Days'}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      ₹{(order.totalAmount || 10000).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status || 'Active Rental'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
