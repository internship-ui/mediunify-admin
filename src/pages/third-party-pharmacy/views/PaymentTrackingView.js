import React, { useState } from 'react';
import {
  Receipt,
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowRight,
  Store,
  Building2,
  RefreshCw,
  Search,
  Download
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function PaymentTrackingView({ orders = [] }) {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Settled, Pending Settlement

  // Local state to simulate payouts
  const [orderPayments, setOrderPayments] = useState(() =>
    orders.map((o) => ({
      ...o,
      settlementStatus: o.paymentDetails?.settlementStatus || 'Pending Settlement',
      partnerShare: o.paymentDetails?.partnerPayout || Math.round((o.orderAmount || 0) * 0.88),
      marginShare: o.paymentDetails?.commissionAmount || Math.round((o.orderAmount || 0) * 0.12)
    }))
  );

  const handleSettle = (orderId) => {
    setOrderPayments((prev) =>
      prev.map((item) =>
        item.orderId === orderId
          ? {
              ...item,
              settlementStatus: 'Settled',
              utrNumber: `NEFT-MYS-${Math.floor(100000 + Math.random() * 900000)}`
            }
          : item
      )
    );
    addToast(`Payout settled successfully for ${orderId}`, 'success');
  };

  const handleBatchSettleAll = () => {
    setOrderPayments((prev) =>
      prev.map((item) => ({
        ...item,
        settlementStatus: 'Settled',
        utrNumber: item.utrNumber || `NEFT-MYS-${Math.floor(100000 + Math.random() * 900000)}`
      }))
    );
    addToast('Batch settlement processed for all pending partner payouts!', 'success');
  };

  const totalGross = orderPayments.reduce((acc, o) => acc + (o.orderAmount || 0), 0);
  const totalPartnerPayout = orderPayments.reduce((acc, o) => acc + (o.partnerShare || 0), 0);
  const totalMargin = orderPayments.reduce((acc, o) => acc + (o.marginShare || 0), 0);
  const totalPendingSettlement = orderPayments
    .filter((o) => o.settlementStatus === 'Pending Settlement')
    .reduce((acc, o) => acc + (o.partnerShare || 0), 0);

  const filteredPayments = orderPayments.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.parentOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.assignedPartnerPharmacy?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'Settled') return o.settlementStatus === 'Settled';
    if (statusFilter === 'Pending') return o.settlementStatus === 'Pending Settlement';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>Earnings & Settlements</span>
          </div>
          <h1 className="text-2xl font-black text-brand-navy-950 mt-1">
            Earnings & Partner Payouts
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-600">
            Monitor platform commission revenue (12%), partner payouts (88%), and bank transfer settlements.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleBatchSettleAll}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Batch Settle Pending</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-brand-slate-500 uppercase block">Total Order Value</span>
          <div className="text-2xl font-black text-brand-navy-950 mt-1 font-mono">
            ₹{totalGross.toLocaleString()}
          </div>
          <span className="text-[10px] text-brand-slate-400 mt-0.5 block">100% Patient collection</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs bg-emerald-50/20">
          <span className="text-[11px] font-bold text-emerald-800 uppercase block">Partner Payouts</span>
          <div className="text-2xl font-black text-emerald-950 mt-1 font-mono">
            ₹{totalPartnerPayout.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-700 mt-0.5 block">88% Share for Partner Stores</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-2xs bg-teal-50/20">
          <span className="text-[11px] font-bold text-teal-800 uppercase block">MediUnify Commission</span>
          <div className="text-2xl font-black text-teal-950 mt-1 font-mono">
            ₹{totalMargin.toLocaleString()}
          </div>
          <span className="text-[10px] text-teal-700 mt-0.5 block">12% Fixed Platform Revenue</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs bg-amber-50/20">
          <span className="text-[11px] font-bold text-amber-800 uppercase block">Pending Settlements</span>
          <div className="text-2xl font-black text-amber-950 mt-1 font-mono">
            ₹{totalPendingSettlement.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-700 mt-0.5 block">Awaiting bank NEFT transfer</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {['All', 'Pending', 'Settled'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white text-brand-slate-600 border-brand-slate-200 hover:bg-brand-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate-400" />
          <input
            type="text"
            placeholder="Search order or partner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-brand-slate-200 bg-brand-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* Settlement Ledger Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-slate-50/80 border-b border-brand-slate-200/80 text-[11px] font-bold text-brand-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Order ID & Parent</th>
                <th className="py-3 px-4">Partner Pharmacy</th>
                <th className="py-3 px-4">Patient Payment</th>
                <th className="py-3 px-4 text-right">Order Gross</th>
                <th className="py-3 px-4 text-right">Partner Payout (88%)</th>
                <th className="py-3 px-4 text-right">MediUnify (12%)</th>
                <th className="py-3 px-4 text-center">Settlement Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredPayments.map((item) => {
                const isSettled = item.settlementStatus === 'Settled';

                return (
                  <tr key={item.orderId} className="hover:bg-brand-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-brand-navy-950 block">{item.orderId}</span>
                      <span className="text-[10px] text-brand-slate-400 font-mono">
                        Parent: {item.parentOrderId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-brand-navy-900 block">
                        {item.assignedPartnerPharmacy?.name || 'Unassigned Store'}
                      </span>
                      <span className="text-[10px] text-brand-slate-400 font-mono">
                        Bank: {item.assignedPartnerPharmacy?.bankDetails?.bank || 'HDFC Bank, Mysore'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <span className="text-emerald-700 font-semibold">{item.paymentStatus}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-brand-navy-950">
                      ₹{item.orderAmount?.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-800">
                      ₹{item.partnerShare?.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-teal-800">
                      ₹{item.marginShare?.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isSettled
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {isSettled ? 'Settled (NEFT)' : 'Pending Settlement'}
                      </span>
                      {item.utrNumber && (
                        <span className="block text-[9px] font-mono text-brand-slate-400 mt-0.5">
                          {item.utrNumber}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {!isSettled ? (
                        <button
                          type="button"
                          onClick={() => handleSettle(item.orderId)}
                          className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-all"
                        >
                          Settle Payout
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-mono font-bold">✓ Cleared</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
