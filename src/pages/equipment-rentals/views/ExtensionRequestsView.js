import React, { useState } from 'react';
import {
  CalendarPlus,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Calendar,
  IndianRupee,
  Check,
  AlertCircle,
  ArrowRight,
  User
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function ExtensionRequestsView({
  extensions = [],
  onApproveExtension,
  onRejectExtension
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExt, setSelectedExt] = useState(null);

  const filteredExtensions = extensions.filter((ext) => {
    const matchesSearch =
      (ext.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ext.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ext.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ext.equipmentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ext.vendorName || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <CalendarPlus className="w-7 h-7 text-brand-teal-600" />
            Rental Extension Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review patient requests to extend medical equipment rental periods with partner vendor stock verification and updated pricing.
          </p>
        </div>
      </div>

      {/* Extension Workflow Progression Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Extension Review Flow</div>
        <div className="flex items-center justify-between overflow-x-auto gap-2 text-xs text-gray-600 font-medium pb-1">
          <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-brand-navy-900 text-white flex items-center justify-center text-[10px] font-bold">1</span> Patient Request</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-brand-navy-900 text-white flex items-center justify-center text-[10px] font-bold">2</span> Admin Review</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-brand-navy-900 text-white flex items-center justify-center text-[10px] font-bold">3</span> Vendor Check</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-brand-navy-900 text-white flex items-center justify-center text-[10px] font-bold">4</span> Updated Price</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="flex items-center gap-1.5 font-bold text-brand-teal-700"><span className="w-5 h-5 rounded-full bg-brand-teal-600 text-white flex items-center justify-center text-[10px] font-bold">5</span> Approved & Updated</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search extension ID, order ID, patient, vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
          />
        </div>
        <div className="text-xs text-gray-500">
          Showing <span className="font-bold text-gray-800">{filteredExtensions.length}</span> extension requests
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3.5">Request ID</th>
                <th className="px-4 py-3.5">Rental / Order ID</th>
                <th className="px-4 py-3.5">Patient Details</th>
                <th className="px-4 py-3.5">Equipment & Vendor</th>
                <th className="px-4 py-3.5">Current Period</th>
                <th className="px-4 py-3.5">Requested Extension</th>
                <th className="px-4 py-3.5">Updated End Date</th>
                <th className="px-4 py-3.5">Additional Amount</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredExtensions.length > 0 ? (
                filteredExtensions.map((ext) => (
                  <tr key={ext.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Request ID */}
                    <td className="px-4 py-3.5 font-mono font-bold text-brand-navy-900">
                      {ext.id}
                    </td>

                    {/* Order ID */}
                    <td className="px-4 py-3.5 font-mono text-brand-teal-700 font-semibold">
                      {ext.orderId}
                    </td>

                    {/* Patient */}
                    <td className="px-4 py-3.5 font-semibold text-gray-900">
                      {ext.patientName}
                    </td>

                    {/* Equipment & Vendor */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-800">{ext.equipmentName}</div>
                      <div className="text-gray-400 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span>{ext.vendorName}</span>
                      </div>
                    </td>

                    {/* Current Period */}
                    <td className="px-4 py-3.5 text-gray-600">
                      <div>{ext.currentRentalPeriod || '1 Month (30 Days)'}</div>
                      <div className="text-[10px] text-gray-400">Ends: {ext.currentEndDate || '30 Sep 2026'}</div>
                    </td>

                    {/* Requested Extension */}
                    <td className="px-4 py-3.5 font-bold text-brand-teal-700">
                      +{ext.requestedExtension || '15 Days'}
                    </td>

                    {/* Updated End Date */}
                    <td className="px-4 py-3.5 font-semibold text-gray-900">
                      {ext.requestedEndDate || '15 Oct 2026'}
                    </td>

                    {/* Additional Amount */}
                    <td className="px-4 py-3.5 font-bold text-gray-900">
                      ₹{(ext.additionalAmount || 2250).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={ext.status || 'New'} size="xs" />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedExt(ext)}
                          className="px-2 py-1 text-[11px] font-semibold text-gray-700 hover:text-brand-navy-900 hover:bg-gray-100 rounded-lg border border-gray-200"
                        >
                          Details
                        </button>
                        {(ext.status === 'New' || ext.status === 'Pending') && (
                          <>
                            <button
                              onClick={() => onApproveExtension && onApproveExtension(ext.id)}
                              className="px-2.5 py-1 bg-brand-green-600 hover:bg-brand-green-700 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1 shadow-xs"
                              title="Approve Extension"
                            >
                              <Check className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                              onClick={() => onRejectExtension && onRejectExtension(ext.id)}
                              className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Reject Extension"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-gray-400">
                    <CalendarPlus className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-base font-semibold text-gray-700">No extension requests found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXTENSION DETAIL MODAL */}
      {selectedExt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="font-mono text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                  {selectedExt.id}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-1">Rental Extension Details</h3>
              </div>
              <button onClick={() => setSelectedExt(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
              <div className="font-bold text-gray-900">Contract & Extension Breakdown</div>
              <div>Patient: <strong>{selectedExt.patientName}</strong></div>
              <div>Order ID: <strong className="font-mono text-brand-teal-700">{selectedExt.orderId}</strong></div>
              <div>Equipment: <strong>{selectedExt.equipmentName}</strong></div>
              <div>Vendor: <strong>{selectedExt.vendorName}</strong></div>
              <div>Current End Date: <strong>{selectedExt.currentEndDate || '30 Sep 2026'}</strong></div>
              <div>New Extended End Date: <strong className="text-brand-teal-700">{selectedExt.requestedEndDate || '15 Oct 2026'}</strong></div>
              <div>Additional Amount Due: <strong className="text-gray-900">₹{(selectedExt.additionalAmount || 2250).toLocaleString()}</strong></div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedExt(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium"
              >
                Close
              </button>
              {(selectedExt.status === 'New' || selectedExt.status === 'Pending') && (
                <button
                  type="button"
                  onClick={() => {
                    if (onApproveExtension) onApproveExtension(selectedExt.id);
                    setSelectedExt(null);
                  }}
                  className="px-4 py-2 bg-brand-green-600 hover:bg-brand-green-700 text-white rounded-xl font-semibold shadow-sm"
                >
                  Approve Extension
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
