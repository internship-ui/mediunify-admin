import React, { useState } from 'react';
import {
  Truck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  Wrench,
  MapPin,
  Phone,
  User,
  XCircle,
  Check,
  Info,
  Activity
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function DeliveryInstallationView({
  deliveries = [],
  onUpdateDeliveryStatus
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [timelineDelivery, setTimelineDelivery] = useState(null);

  // Statuses specified in Section 9
  const tabs = [
    'All',
    'Delivery Pending',
    'Assigned',
    'Out for Delivery',
    'Delivered',
    'Installation Pending',
    'Installation Completed'
  ];

  const filteredDeliveries = deliveries.filter((d) => {
    let matchesTab = true;
    if (activeTab === 'Delivery Pending') {
      matchesTab = d.deliveryStatus === 'Delivery Pending' || d.deliveryStatus === 'Pending';
    } else if (activeTab === 'Assigned') {
      matchesTab = d.deliveryStatus === 'Assigned';
    } else if (activeTab === 'Out for Delivery') {
      matchesTab = d.deliveryStatus === 'Out for Delivery';
    } else if (activeTab === 'Delivered') {
      matchesTab = d.deliveryStatus === 'Delivered';
    } else if (activeTab === 'Installation Pending') {
      matchesTab = d.installationStatus === 'Installation Pending' || d.installationStatus === 'Pending';
    } else if (activeTab === 'Installation Completed') {
      matchesTab = d.installationStatus === 'Installation Completed' || d.installationStatus === 'Installed';
    }

    const matchesSearch =
      (d.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.vendorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.equipmentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.deliveryAddress || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <Truck className="w-7 h-7 text-brand-teal-600" />
            Delivery & Installation Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track third-party vendor physical dispatches, technician equipment installations, and patient handovers.
          </p>
        </div>
      </div>

      {/* Coordination Banner */}
      <div className="bg-gradient-to-r from-brand-teal-50 to-brand-aqua-50 text-brand-teal-950 rounded-xl p-4 border border-brand-teal-200 text-xs flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-brand-teal-800">Operational Notice:</span> Partner vendors physically perform equipment delivery, assembly, and biomedical calibration. MediUnify Admin monitors logistics SLAs, coordinates arrival times with patients, and logs digital proof of delivery.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {tabs.map((tab) => {
          let count = 0;
          if (tab === 'All') count = deliveries.length;
          else if (tab === 'Delivery Pending') count = deliveries.filter(d => d.deliveryStatus === 'Delivery Pending' || d.deliveryStatus === 'Pending').length;
          else if (tab === 'Assigned') count = deliveries.filter(d => d.deliveryStatus === 'Assigned').length;
          else if (tab === 'Out for Delivery') count = deliveries.filter(d => d.deliveryStatus === 'Out for Delivery').length;
          else if (tab === 'Delivered') count = deliveries.filter(d => d.deliveryStatus === 'Delivered').length;
          else if (tab === 'Installation Pending') count = deliveries.filter(d => d.installationStatus === 'Installation Pending' || d.installationStatus === 'Pending').length;
          else if (tab === 'Installation Completed') count = deliveries.filter(d => d.installationStatus === 'Installation Completed' || d.installationStatus === 'Installed').length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-brand-navy-900 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search dispatch ID, order ID, patient, vendor, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
          />
        </div>
        <div className="text-xs text-gray-500">
          Showing <span className="font-bold text-gray-800">{filteredDeliveries.length}</span> dispatches
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3.5">Rental / Order ID</th>
                <th className="px-4 py-3.5">Patient Details</th>
                <th className="px-4 py-3.5">Equipment</th>
                <th className="px-4 py-3.5">Vendor Partner</th>
                <th className="px-4 py-3.5">Delivery Address</th>
                <th className="px-4 py-3.5">Delivery Date</th>
                <th className="px-4 py-3.5">Installation Req.</th>
                <th className="px-4 py-3.5">Delivery Status</th>
                <th className="px-4 py-3.5">Installation Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((del) => (
                  <tr key={del.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Rental ID */}
                    <td className="px-4 py-3.5 font-mono font-bold text-brand-navy-900">
                      {del.orderId || del.id}
                      <div className="text-[10px] text-gray-400 font-mono font-normal">{del.id}</div>
                    </td>

                    {/* Patient */}
                    <td className="px-4 py-3.5 font-medium text-gray-900">
                      {del.patientName}
                    </td>

                    {/* Equipment */}
                    <td className="px-4 py-3.5 text-gray-800 font-semibold max-w-[130px] truncate" title={del.equipmentName}>
                      {del.equipmentName}
                    </td>

                    {/* Vendor */}
                    <td className="px-4 py-3.5 text-gray-700 max-w-[130px] truncate">
                      <div className="flex items-center gap-1 font-medium">
                        <Building2 className="w-3 h-3 text-brand-teal-600" />
                        <span>{del.vendorName}</span>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="px-4 py-3.5 text-gray-600 max-w-[140px] truncate" title={del.deliveryAddress}>
                      {del.deliveryAddress}
                    </td>

                    {/* Delivery Date */}
                    <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">
                      {del.deliveryDate || 'Today, 4:00 PM'}
                    </td>

                    {/* Installation Requirement */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        del.installationRequired ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {del.installationRequired ? 'Required' : 'None'}
                      </span>
                    </td>

                    {/* Delivery Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={del.deliveryStatus} size="xs" />
                    </td>

                    {/* Installation Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={del.installationStatus} size="xs" />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDelivery(del)}
                          className="px-2 py-1 text-[11px] font-semibold text-gray-700 hover:text-brand-navy-900 hover:bg-gray-100 rounded-lg border border-gray-200"
                        >
                          Details
                        </button>
                        {del.deliveryStatus !== 'Delivered' && (
                          <button
                            onClick={() => onUpdateDeliveryStatus && onUpdateDeliveryStatus(del.id, 'Delivered')}
                            className="px-2 py-1 bg-brand-green-600 hover:bg-brand-green-700 text-white rounded-lg text-[11px] font-semibold inline-flex items-center gap-1"
                            title="Mark Delivered"
                          >
                            <Check className="w-3 h-3" />
                            Delivered
                          </button>
                        )}
                        <button
                          onClick={() => setTimelineDelivery(del)}
                          className="p-1 rounded-lg text-gray-400 hover:text-brand-teal-600 hover:bg-gray-100"
                          title="View Dispatch Timeline"
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-gray-400">
                    <Truck className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-base font-semibold text-gray-700">No dispatches found</p>
                    <p className="text-xs text-gray-400 mt-1">There are no deliveries matching the selected tab.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISPATCH DETAILS MODAL */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                  {selectedDelivery.id}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-1">Delivery & Installation Tracking</h3>
              </div>
              <button onClick={() => setSelectedDelivery(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
              <div className="font-bold text-gray-900">Fulfilment Dispatch Record</div>
              <div>Patient: <strong>{selectedDelivery.patientName}</strong></div>
              <div>Equipment: <strong>{selectedDelivery.equipmentName}</strong></div>
              <div>Vendor: <strong>{selectedDelivery.vendorName}</strong></div>
              <div>Address: <strong>{selectedDelivery.deliveryAddress}</strong></div>
              <div>Delivery Slot: <strong>{selectedDelivery.deliveryDate || 'Today, 4:00 PM'}</strong></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200">
                <span className="text-teal-700 font-semibold block">Delivery Status:</span>
                <div className="mt-1"><StatusBadge status={selectedDelivery.deliveryStatus} size="xs" /></div>
              </div>
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200">
                <span className="text-purple-700 font-semibold block">Installation Status:</span>
                <div className="mt-1"><StatusBadge status={selectedDelivery.installationStatus} size="xs" /></div>
              </div>
            </div>

            <div className="text-right pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedDelivery(null)}
                className="px-4 py-2 bg-brand-navy-900 text-white rounded-xl font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISPATCH TIMELINE MODAL */}
      {timelineDelivery && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Logistics Timeline ({timelineDelivery.id})</h3>
              <button onClick={() => setTimelineDelivery(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-navy-900 text-white flex items-center justify-center text-[10px] font-bold">1</div>
                <div>
                  <div className="font-semibold text-gray-900">Order Assigned to Vendor</div>
                  <div className="text-[11px] text-gray-500">{timelineDelivery.vendorName} accepted dispatch</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-navy-900 text-white flex items-center justify-center text-[10px] font-bold">2</div>
                <div>
                  <div className="font-semibold text-gray-900">Equipment Sanitized & Loaded</div>
                  <div className="text-[11px] text-gray-500">Biomedical check complete; dispatch vehicle en route</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-teal-600 text-white flex items-center justify-center text-[10px] font-bold">3</div>
                <div>
                  <div className="font-bold text-brand-teal-700">Delivered & Assembled</div>
                  <div className="text-[11px] text-gray-500">Technician demonstration given to patient</div>
                </div>
              </div>
            </div>

            <div className="text-right pt-3 border-t border-gray-100">
              <button
                onClick={() => setTimelineDelivery(null)}
                className="px-4 py-2 bg-brand-navy-900 text-white rounded-xl font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
