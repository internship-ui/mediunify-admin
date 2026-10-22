import React, { useState } from 'react';
import {
  Receipt,
  Search,
  IndianRupee,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Filter,
  Eye,
  Calendar,
  Building2,
  Package,
  RotateCcw
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { INITIAL_PAYMENTS_DATA } from '../../../data/equipmentRentalData';

export default function PaymentsFinanceView({
  payments = INITIAL_PAYMENTS_DATA,
  requests = [],
  onOpenRequest
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState(null);

  const totalRevenue = payments
    .filter((p) => p.paymentStatus === 'Paid')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const pendingPayments = payments
    .filter((p) => p.paymentStatus === 'Pending')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const completedPaymentsCount = payments.filter((p) => p.paymentStatus === 'Paid').length;
  const refundsAmount = payments
    .filter((p) => p.paymentStatus === 'Refunded')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const filteredPayments = payments.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (p.id || '').toLowerCase().includes(q) ||
      (p.rentalId || '').toLowerCase().includes(q) ||
      (p.patient || '').toLowerCase().includes(q) ||
      (p.equipment || '').toLowerCase().includes(q) ||
      (p.transactionRef || '').toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'All' || p.paymentStatus.toLowerCase() === statusFilter.toLowerCase();

    const matchesMethod =
      methodFilter === 'All' || (p.paymentMethod || '').toLowerCase() === methodFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy-900 tracking-tight flex items-center gap-2.5">
            <Receipt className="w-7 h-7 text-brand-teal-700" />
            Equipment Rental Payments & Settlements
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-1">
            Reconcile patient rental invoices, online UPI/Card transactions, and vendor revenue disbursements.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting complete financial ledger as Excel/CSV report.')}
          className="px-4 py-2.5 bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-2 active:scale-95 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Ledger</span>
        </button>
      </div>

      {/* 4 Summary Cards (Requirement 12) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-brand-teal-200 shadow-xs bg-teal-50/20">
          <div className="flex items-center justify-between text-brand-teal-800 text-xs font-bold">
            <span>Total Revenue</span>
            <IndianRupee className="w-4 h-4 text-brand-teal-600" />
          </div>
          <span className="text-2xl font-extrabold text-brand-teal-900 mt-1 block font-mono">
            ₹{totalRevenue.toLocaleString()}
          </span>
          <span className="text-[11px] text-brand-teal-600 font-medium">Cleared settlements</span>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
            <span>Pending Payments</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-extrabold text-amber-900 mt-1 block font-mono">
            ₹{pendingPayments.toLocaleString()}
          </span>
          <span className="text-[11px] text-amber-700 font-medium">Awaiting patient payment</span>
        </div>

        {/* Completed Payments */}
        <div className="bg-white p-4 rounded-2xl border border-brand-green-200 shadow-xs bg-green-50/20">
          <div className="flex items-center justify-between text-brand-green-800 text-xs font-bold">
            <span>Completed Payments</span>
            <CheckCircle2 className="w-4 h-4 text-brand-green-600" />
          </div>
          <span className="text-2xl font-extrabold text-brand-green-900 mt-1 block font-mono">
            {completedPaymentsCount} Orders
          </span>
          <span className="text-[11px] text-brand-green-600 font-medium">100% verified gateway</span>
        </div>

        {/* Refunds */}
        <div className="bg-white p-4 rounded-2xl border border-brand-coral-200 shadow-xs bg-coral-50/20">
          <div className="flex items-center justify-between text-brand-coral-800 text-xs font-bold">
            <span>Refunds Processed</span>
            <RotateCcw className="w-4 h-4 text-brand-coral-600" />
          </div>
          <span className="text-2xl font-extrabold text-brand-coral-900 mt-1 block font-mono">
            ₹{refundsAmount.toLocaleString()}
          </span>
          <span className="text-[11px] text-brand-coral-600 font-medium">Pre-dispatch cancellation</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payment ID, rental ID, patient, transaction ref..."
            className="w-full pl-10 pr-4 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-brand-slate-400 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl text-xs font-semibold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-brand-slate-400 uppercase">Method:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-2 bg-brand-slate-50 border border-brand-slate-200 rounded-xl text-xs font-semibold text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            >
              <option value="All">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Records Table (Requirement 12) */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-600">
            <thead className="bg-brand-slate-50/90 text-[11px] font-bold text-brand-slate-700 uppercase tracking-wider border-b border-brand-slate-200">
              <tr>
                <th className="px-4 py-3">Payment ID</th>
                <th className="px-4 py-3">Rental ID</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Equipment</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Payment Date</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredPayments.map((pay) => (
                <tr
                  key={pay.id}
                  onClick={() => setSelectedPaymentDetail(pay)}
                  className="hover:bg-brand-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3.5 font-mono font-bold text-brand-navy-900">
                    {pay.id}
                  </td>

                  <td className="px-4 py-3.5 font-mono font-semibold text-brand-teal-700">
                    {pay.rentalId}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-bold text-brand-navy-900">{pay.patient}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-brand-slate-800">{pay.equipment}</div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-extrabold text-brand-navy-900 text-sm">
                    ₹{pay.amount.toLocaleString()}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-brand-slate-100 text-brand-slate-700 rounded-lg font-semibold text-[11px] inline-flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-brand-teal-600" />
                      <span>{pay.paymentMethod}</span>
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-brand-slate-500 font-medium">
                    {pay.paymentDate}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={pay.paymentStatus} size="xs" />
                  </td>

                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPaymentDetail(pay);
                      }}
                      className="px-3 py-1.5 bg-brand-teal-50 hover:bg-brand-teal-600 text-brand-teal-700 hover:text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 shadow-2xs group-hover:scale-105"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedPaymentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
            <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between bg-brand-slate-50/80">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-teal-600" />
                <h3 className="font-bold text-brand-navy-900 text-sm">Payment Receipt Summary</h3>
              </div>
              <button
                onClick={() => setSelectedPaymentDetail(null)}
                className="text-brand-slate-400 hover:text-brand-slate-700 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="p-4 rounded-xl bg-brand-teal-50/50 border border-brand-teal-200 text-center space-y-1">
                <span className="text-[10px] text-brand-teal-800 font-bold uppercase">Settled Amount</span>
                <p className="text-2xl font-extrabold text-brand-navy-900 font-mono">
                  ₹{selectedPaymentDetail.amount.toLocaleString()}
                </p>
                <StatusBadge status={selectedPaymentDetail.paymentStatus} size="sm" />
              </div>

              <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-brand-slate-500">Transaction ID:</span>
                  <span className="font-mono font-bold text-brand-slate-800">{selectedPaymentDetail.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-slate-500">Rental Order ID:</span>
                  <span className="font-mono font-bold text-brand-teal-700">{selectedPaymentDetail.rentalId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-slate-500">Patient:</span>
                  <span className="font-bold text-brand-navy-900">{selectedPaymentDetail.patient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-slate-500">Equipment:</span>
                  <span className="font-semibold text-brand-slate-800">{selectedPaymentDetail.equipment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-slate-500">Payment Gateway:</span>
                  <span className="font-semibold text-brand-slate-800">{selectedPaymentDetail.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-t border-brand-slate-200/80 pt-1.5">
                  <span className="text-brand-slate-500">Ref Code:</span>
                  <span className="font-mono text-[10px] text-brand-slate-600">{selectedPaymentDetail.transactionRef || 'TXN-902810'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-brand-slate-50 border-t border-brand-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  alert(`Downloading PDF receipt for transaction ${selectedPaymentDetail.id}`);
                }}
                className="px-4 py-2 bg-brand-teal-700 hover:bg-brand-teal-800 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={() => setSelectedPaymentDetail(null)}
                className="px-4 py-2 text-xs font-bold text-brand-slate-600 hover:bg-brand-slate-200 rounded-xl transition-colors"
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
