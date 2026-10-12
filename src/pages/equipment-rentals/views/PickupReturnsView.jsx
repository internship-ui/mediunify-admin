import React, { useState } from 'react';
import {
  RotateCcw,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  AlertTriangle,
  MapPin,
  Check,
  Truck,
  Wrench,
  XCircle,
  Sparkles,
  Info,
  ArrowRight,
  ShieldCheck,
  IndianRupee
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function PickupReturnsView({
  returns = [],
  onUpdateReturnStatus,
  onUpdateCondition
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState('Good');
  const [depositRefundAmount, setDepositRefundAmount] = useState(2000);

  // Statuses specified in Section 12
  const tabs = [
    'All',
    'Pickup Requested',
    'Pickup Scheduled',
    'Pickup In Progress',
    'Picked Up',
    'Inspection Pending',
    'Returned',
    'Completed'
  ];

  const filteredReturns = returns.filter((ret) => {
    let matchesTab = true;
    if (activeTab === 'Pickup Requested') {
      matchesTab = ret.status === 'Pickup Requested' || ret.status === 'Assigned';
    } else if (activeTab === 'Pickup Scheduled') {
      matchesTab = ret.status === 'Pickup Scheduled' || ret.status === 'Scheduled';
    } else if (activeTab === 'Pickup In Progress') {
      matchesTab = ret.status === 'Pickup In Progress' || ret.status === 'In Progress';
    } else if (activeTab === 'Picked Up') {
      matchesTab = ret.status === 'Picked Up';
    } else if (activeTab === 'Inspection Pending') {
      matchesTab = ret.status === 'Inspection Pending' || ret.status === 'Inspection';
    } else if (activeTab === 'Returned') {
      matchesTab = ret.status === 'Returned';
    } else if (activeTab === 'Completed') {
      matchesTab = ret.status === 'Completed';
    }

    const matchesSearch =
      (ret.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ret.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ret.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ret.equipmentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ret.vendorName || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleOpenConditionModal = (ret) => {
    setSelectedReturn(ret);
    setSelectedCondition(ret.condition || 'Good');
    setDepositRefundAmount(ret.deposit || 2000);
    setConditionModalOpen(true);
  };

  const handleSaveConditionAndRefund = () => {
    if (selectedReturn && onUpdateCondition) {
      onUpdateCondition(selectedReturn.id, selectedCondition);
    }
    if (selectedReturn && onUpdateReturnStatus) {
      onUpdateReturnStatus(selectedReturn.id, 'Completed');
    }
    setConditionModalOpen(false);
    setSelectedReturn(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <RotateCcw className="w-7 h-7 text-brand-teal-600" />
            Pickup & Returns Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Coordinate end-of-rental reverse logistics, warehouse intake inspections, sanitization audits, and security deposit release.
          </p>
        </div>
      </div>

      {/* 8-Stage Return Workflow Banner */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Complete Return & Inspection Workflow</div>
        <div className="flex items-center justify-between overflow-x-auto gap-2 text-xs text-gray-600 font-medium pb-1">
          <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="w-5 h-5 rounded-full bg-brand-navy-900 text-white flex items-center justify-center text-[10px] font-bold">1</span> Patient Request</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="w-5 h-5 rounded-full bg-brand-navy-900 text-white flex items-center justify-center text-[10px] font-bold">2</span> Admin Receives</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="w-5 h-5 rounded-full bg-brand-navy-900 text-white flex items-center justify-center text-[10px] font-bold">3</span> Vendor Notified</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="w-5 h-5 rounded-full bg-brand-navy-900 text-white flex items-center justify-center text-[10px] font-bold">4</span> Pickup Scheduled</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="w-5 h-5 rounded-full bg-brand-navy-900 text-white flex items-center justify-center text-[10px] font-bold">5</span> Picked Up</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="w-5 h-5 rounded-full bg-brand-navy-900 text-white flex items-center justify-center text-[10px] font-bold">6</span> Condition Inspected</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="flex items-center gap-1.5 whitespace-nowrap font-bold text-brand-teal-700"><span className="w-5 h-5 rounded-full bg-brand-teal-600 text-white flex items-center justify-center text-[10px] font-bold">7</span> Deposit Released</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {tabs.map((tab) => {
          let count = 0;
          if (tab === 'All') count = returns.length;
          else if (tab === 'Pickup Requested') count = returns.filter(r => r.status === 'Pickup Requested' || r.status === 'Assigned').length;
          else if (tab === 'Pickup Scheduled') count = returns.filter(r => r.status === 'Pickup Scheduled' || r.status === 'Scheduled').length;
          else if (tab === 'Pickup In Progress') count = returns.filter(r => r.status === 'Pickup In Progress' || r.status === 'In Progress').length;
          else if (tab === 'Picked Up') count = returns.filter(r => r.status === 'Picked Up').length;
          else if (tab === 'Inspection Pending') count = returns.filter(r => r.status === 'Inspection Pending' || r.status === 'Inspection').length;
          else if (tab === 'Returned') count = returns.filter(r => r.status === 'Returned').length;
          else if (tab === 'Completed') count = returns.filter(r => r.status === 'Completed').length;

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
            placeholder="Search return ID, order ID, patient, vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
          />
        </div>
        <div className="text-xs text-gray-500">
          Showing <span className="font-bold text-gray-800">{filteredReturns.length}</span> return workflows
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3.5">Return ID</th>
                <th className="px-4 py-3.5">Order ID</th>
                <th className="px-4 py-3.5">Patient Details</th>
                <th className="px-4 py-3.5">Equipment & Vendor</th>
                <th className="px-4 py-3.5">Pickup Location</th>
                <th className="px-4 py-3.5">Pickup Date</th>
                <th className="px-4 py-3.5">Condition After Return</th>
                <th className="px-4 py-3.5">Deposit Status</th>
                <th className="px-4 py-3.5">Current Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredReturns.length > 0 ? (
                filteredReturns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Return ID */}
                    <td className="px-4 py-3.5 font-mono font-bold text-brand-navy-900">
                      {ret.id}
                    </td>

                    {/* Order ID */}
                    <td className="px-4 py-3.5 font-mono text-brand-teal-700 font-semibold">
                      {ret.orderId}
                    </td>

                    {/* Patient */}
                    <td className="px-4 py-3.5 font-medium text-gray-900">
                      {ret.patientName}
                    </td>

                    {/* Equipment & Vendor */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-800">{ret.equipmentName}</div>
                      <div className="text-gray-400 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span>{ret.vendorName}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5 text-gray-600 max-w-[130px] truncate">
                      {ret.location || 'Mysuru'}
                    </td>

                    {/* Pickup Date */}
                    <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">
                      {ret.pickupDate || 'Tomorrow, 10:00 AM'}
                    </td>

                    {/* Condition */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ret.condition === 'Good' || ret.condition === 'Excellent'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : ret.condition === 'Minor Wear'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : ret.condition === 'Needs Cleaning'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : ret.condition === 'Pending Intake' || ret.condition === 'Pending'
                            ? 'bg-gray-100 text-gray-600 border border-gray-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {ret.condition || 'Pending Intake'}
                      </span>
                    </td>

                    {/* Deposit */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-bold text-gray-900">₹{(ret.deposit || 2000).toLocaleString()}</div>
                      <div className="text-[10px] text-gray-400">
                        {ret.status === 'Completed' ? 'Released to Patient' : 'Held in Escrow'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={ret.status} size="xs" />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenConditionModal(ret)}
                          className="px-2.5 py-1 bg-brand-teal-600 hover:bg-brand-teal-700 text-white rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 shadow-xs"
                          title="Inspect Condition & Release Deposit"
                        >
                          <Wrench className="w-3 h-3" />
                          Inspect
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-gray-400">
                    <RotateCcw className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-base font-semibold text-gray-700">No return requests found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECTION & DEPOSIT RELEASE MODAL */}
      {conditionModalOpen && selectedReturn && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="font-mono text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                  {selectedReturn.id}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-1">Post-Return Inspection & Deposit Refund</h3>
              </div>
              <button onClick={() => setConditionModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
              <div>Equipment: <strong>{selectedReturn.equipmentName}</strong></div>
              <div>Returning Patient: <strong>{selectedReturn.patientName}</strong></div>
              <div>Vendor Warehouse: <strong>{selectedReturn.vendorName}</strong></div>
              <div>Security Deposit Held: <strong className="text-gray-900">₹{(selectedReturn.deposit || 2000).toLocaleString()}</strong></div>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-gray-900">Equipment Condition After Return</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
              >
                <option value="Excellent">Excellent (No defects, sanitized)</option>
                <option value="Good">Good (Standard use, ready for restock)</option>
                <option value="Minor Wear">Minor Wear (Cosmetic surface scratches)</option>
                <option value="Needs Cleaning">Needs Sanitization / Cleaning Cycle</option>
                <option value="Damaged">Damaged (Requires repair / deduction review)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-gray-900">Security Deposit Refund Amount (₹)</label>
              <input
                type="number"
                value={depositRefundAmount}
                onChange={(e) => setDepositRefundAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 font-bold focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
              />
              <p className="text-[11px] text-gray-500">
                100% refundable deposit returned to patient account upon verification.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setConditionModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConditionAndRefund}
                className="px-4 py-2 bg-brand-green-600 hover:bg-brand-green-700 text-white rounded-xl font-semibold shadow-sm inline-flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Approve & Release Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
