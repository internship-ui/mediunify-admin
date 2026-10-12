import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Filter,
  Eye,
  Building2,
  Wrench,
  History,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  XCircle,
  FileText,
  Info,
  Layers,
  Activity
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function VendorInventoryView({
  inventory = [],
  vendors = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [vendorFilter, setVendorFilter] = useState('All');
  const [equipmentFilter, setEquipmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInvItem, setSelectedInvItem] = useState(null);

  // Status mapping
  const statuses = ['All', 'Available', 'Rented', 'Under Maintenance', 'Out of Service'];

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      (item.equipmentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.vendorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVendor =
      vendorFilter === 'All' || item.vendorName === vendorFilter || item.vendorId === vendorFilter;

    const matchesEquip =
      equipmentFilter === 'All' || item.equipmentName === equipmentFilter;

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Available' && (item.availableQuantity || item.available) > 0) ||
      (statusFilter === 'Rented' && (item.rentedQuantity || item.rented) > 0) ||
      (statusFilter === 'Under Maintenance' && (item.maintenanceQuantity || item.underMaintenance) > 0) ||
      (statusFilter === 'Out of Service' && (item.outOfServiceQuantity || item.outOfService) > 0);

    return matchesSearch && matchesVendor && matchesEquip && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <Boxes className="w-7 h-7 text-brand-teal-600" />
            Vendor Inventory & Availability Monitoring
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time administrative tracking of third-party vendor stock levels, active rentals, and maintenance status.
          </p>
        </div>
      </div>

      {/* Ownership Transparency Notice */}
      <div className="bg-gradient-to-r from-brand-teal-50 to-brand-aqua-50 text-brand-teal-950 rounded-xl p-4 border border-brand-teal-200 text-xs flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-brand-teal-800">Third-Party Inventory Model:</span> Physical medical equipment listed below is owned, warehoused, and maintained by verified third-party partner vendors. MediUnify operates as the coordination and dispatch monitoring layer for quality assurance and SLA tracking.
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search equipment, vendor, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
          {/* Vendor Filter */}
          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
          >
            <option value="All">All Vendors</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.name}>{v.name}</option>
            ))}
          </select>

          {/* Equipment Filter */}
          <select
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
          >
            <option value="All">All Equipment</option>
            {Array.from(new Set(inventory.map(i => i.equipmentName))).map(eq => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
          >
            {statuses.map(st => (
              <option key={st} value={st}>{st === 'All' ? 'All Statuses' : st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table with Required Columns */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5">Vendor</th>
                <th className="px-5 py-3.5">Equipment</th>
                <th className="px-5 py-3.5 text-center">Total Quantity</th>
                <th className="px-5 py-3.5 text-center">Available</th>
                <th className="px-5 py-3.5 text-center">Rented</th>
                <th className="px-5 py-3.5 text-center">Under Maintenance</th>
                <th className="px-5 py-3.5 text-center">Out of Service</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => {
                  const total = item.totalQuantity || item.totalUnits || 10;
                  const available = item.availableQuantity !== undefined ? item.availableQuantity : (item.available || 4);
                  const rented = item.rentedQuantity !== undefined ? item.rentedQuantity : (item.rented || 5);
                  const underMaintenance = item.maintenanceQuantity !== undefined ? item.maintenanceQuantity : (item.underMaintenance || 1);
                  const outOfService = item.outOfServiceQuantity !== undefined ? item.outOfServiceQuantity : (item.outOfService || 0);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Vendor */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-gray-900">{item.vendorName}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{item.vendorId || 'VND-001'}</div>
                      </td>

                      {/* Equipment */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-900">{item.equipmentName}</div>
                        <div className="text-[11px] text-gray-500">{item.category || 'Hospital Equipment'}</div>
                      </td>

                      {/* Total Quantity */}
                      <td className="px-5 py-4 text-center font-bold text-gray-900">
                        {total}
                      </td>

                      {/* Available */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {available}
                        </span>
                      </td>

                      {/* Rented */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {rented}
                        </span>
                      </td>

                      {/* Under Maintenance */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {underMaintenance}
                        </span>
                      </td>

                      {/* Out of Service */}
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          outOfService > 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {outOfService}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedInvItem(item)}
                          className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:text-brand-navy-900 hover:bg-gray-100 rounded-lg border border-gray-200"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                    <Boxes className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-base font-semibold text-gray-700">No inventory records found</p>
                    <p className="text-xs text-gray-400 mt-1">There are no inventory entries matching the selected criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVENTORY ITEM DETAIL MODAL */}
      {selectedInvItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                  {selectedInvItem.id}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-1">{selectedInvItem.equipmentName}</h3>
                <p className="text-gray-500">Partner: {selectedInvItem.vendorName}</p>
              </div>
              <button onClick={() => setSelectedInvItem(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
              <div className="font-bold text-gray-900">Current Stock Allocation</div>
              <div className="grid grid-cols-2 gap-2">
                <div>Total Fleet: <strong>{selectedInvItem.totalQuantity || 10} Units</strong></div>
                <div>Available for Dispatch: <strong className="text-emerald-700">{selectedInvItem.availableQuantity || selectedInvItem.available || 4} Units</strong></div>
                <div>Currently Deployed: <strong className="text-blue-700">{selectedInvItem.rentedQuantity || selectedInvItem.rented || 5} Units</strong></div>
                <div>In Sanitization/Service: <strong className="text-amber-700">{selectedInvItem.maintenanceQuantity || 1} Units</strong></div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-gray-500">Warehouse Location:</span>
              <div className="font-medium text-gray-800">Hebbal Industrial Estate, Mysuru, Karnataka</div>
            </div>

            <div className="text-right pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedInvItem(null)}
                className="px-4 py-2 bg-brand-navy-900 text-white rounded-xl font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
