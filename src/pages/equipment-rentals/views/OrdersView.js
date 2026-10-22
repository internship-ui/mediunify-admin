import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Building2,
  Calendar,
  MapPin,
  Clock,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Truck,
  Wrench,
  IndianRupee,
  Layers,
  RotateCcw,
  Check
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function OrdersView({
  orders = [],
  onUpdateOrderStatus,
  onNavigateModule
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const tabs = ['All', 'Confirmed', 'Delivery Pending', 'Delivered', 'Active Rental', 'Pickup Requested', 'Completed', 'Cancelled'];

  const filteredOrders = orders.filter((o) => {
    const matchesTab =
      activeTab === 'All' || o.fulfilmentStatus === activeTab || o.status === activeTab;

    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.equipmentName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-brand-teal-600" />
            Equipment Rental Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Master lifecycle log of confirmed bookings, vendor fulfillment, payments, and returns.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {tabs.map((tab) => {
          const count =
            tab === 'All'
              ? orders.length
              : orders.filter((o) => o.fulfilmentStatus === tab || o.status === tab).length;

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
            placeholder="Search order ID, patient, vendor, equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Patient Details</th>
                <th className="px-5 py-3.5">Equipment & Duration</th>
                <th className="px-5 py-3.5">Assigned Vendor</th>
                <th className="px-5 py-3.5">Total Billing</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Fulfilment</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-xs text-brand-navy-900">
                      {order.id}
                      <div className="text-[10px] text-gray-400 font-normal">{order.createdDate || 'Today'}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">{order.patientName}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{order.deliveryAddress || 'Mumbai'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{order.equipmentName}</div>
                      <div className="text-xs text-brand-teal-700 font-semibold">{order.duration || '30 Days'}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-800 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-brand-navy-700 flex-shrink-0" />
                        <span>{order.vendorName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900">
                        ₹{(order.totalAmount || 12800).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Rent ₹{order.rentalAmount || 10000} + Dep ₹{order.deposit || 2000}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {order.paymentStatus || 'Paid (Escrow)'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.fulfilmentStatus || order.status || 'Active Rental'} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2.5 py-1 text-xs font-semibold text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg border border-brand-teal-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                    <FileText className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-base font-semibold text-gray-700">No orders found</p>
                    <p className="text-xs text-gray-400 mt-1">Try switching tabs or searching by order ID.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-mono font-bold text-brand-teal-600">{selectedOrder.id}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">Order Fulfilment Dossier</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Patient & Vendor Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5">
                <div className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-brand-teal-600" />
                  Patient Logistics
                </div>
                <div><span className="text-gray-400">Name:</span> <strong className="text-gray-900">{selectedOrder.patientName}</strong></div>
                <div><span className="text-gray-400">Phone:</span> <span className="text-gray-800">{selectedOrder.patientPhone || '+91 98201 44512'}</span></div>
                <div><span className="text-gray-400">Address:</span> <span className="text-gray-800">{selectedOrder.deliveryAddress || 'Mumbai'}</span></div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5">
                <div className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-brand-navy-700" />
                  Assigned Vendor Partner
                </div>
                <div><span className="text-gray-400">Partner:</span> <strong className="text-gray-900">{selectedOrder.vendorName}</strong></div>
                <div><span className="text-gray-400">Contact:</span> <span className="text-gray-800">{selectedOrder.vendorPhone || '+91 98200 99881'}</span></div>
                <div><span className="text-gray-400">Hub:</span> <span className="text-gray-800">{selectedOrder.vendorLocation || 'Mumbai Central'}</span></div>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-brand-teal-600" />
                Financial Breakdown & Escrow Split
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-400">Monthly Rent:</span>
                  <div className="font-bold text-gray-900">₹{(selectedOrder.rentalAmount || 10000).toLocaleString()}</div>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-400">Security Deposit:</span>
                  <div className="font-bold text-gray-900">₹{(selectedOrder.deposit || 2000).toLocaleString()}</div>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                  <span className="text-emerald-700">MediUnify Comm.:</span>
                  <div className="font-bold text-emerald-800">₹{(selectedOrder.commission || 1500).toLocaleString()}</div>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-blue-700">Vendor Net Payout:</span>
                  <div className="font-bold text-blue-800">₹{(selectedOrder.vendorPayout || 11300).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Fulfilment Status Workflow */}
            <div className="p-4 bg-brand-slate-50 border border-brand-slate-200 text-brand-slate-800 rounded-xl text-xs space-y-2">
              <div className="font-bold text-brand-teal-700 uppercase tracking-wider">Fulfilment Milestones</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div>
                  <span className="text-gray-500">Delivery:</span>
                  <div className="font-bold text-gray-900">{selectedOrder.deliveryStatus || 'Delivered'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Installation:</span>
                  <div className="font-bold text-gray-900">{selectedOrder.installationStatus || 'Completed'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Active Stage:</span>
                  <div className="font-bold text-brand-teal-700">{selectedOrder.fulfilmentStatus || 'Active Rental'}</div>
                </div>
                <div>
                  <span className="text-gray-400">Pickup Status:</span>
                  <div className="font-bold text-white">{selectedOrder.pickupStatus || 'Not Scheduled'}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
