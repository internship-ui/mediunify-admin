import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Building2,
  Phone,
  FileText,
  AlertCircle,
  Eye,
  CreditCard,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Download,
  Calendar,
  Activity,
  ArrowUpRight,
  CheckCheck,
  Stethoscope,
  TestTube
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { useToast } from '../../../context/ToastContext';

export default function NovusWorkspaceView({
  orders = [],
  onOpenOrderDetails,
  onOpenNewOrder
}) {
  const { addToast } = useToast();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [refCenterFilter, setRefCenterFilter] = useState('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [labNoFilter, setLabNoFilter] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Operational KPI metrics
  const stats = useMemo(() => {
    const total = orders.length;
    const pendingPhlebotomy = orders.filter((o) =>
      ['PLACED', 'VERIFIED', 'COLLECTION SCHEDULED'].includes(o.orderStatus)
    ).length;
    const inProcessing = orders.filter((o) =>
      ['SAMPLE COLLECTED', 'SAMPLE RECEIVED', 'IN LAB / PROCESSING'].includes(o.orderStatus)
    ).length;
    const awaitingSignOff = orders.filter((o) => o.orderStatus === 'REPORT READY').length;
    const completed = orders.filter((o) => o.orderStatus === 'COMPLETED').length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount?.final || 0), 0);
    const collectedRevenue = orders
      .filter((o) => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + (o.amount?.final || 0), 0);

    return { total, pendingPhlebotomy, inProcessing, awaitingSignOff, completed, totalRevenue, collectedRevenue };
  }, [orders]);

  // Filtered orders logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = order.patient?.name?.toLowerCase().includes(query);
        const matchesPhone = String(order.patient?.phone || '').includes(query);
        const matchesLabNo = String(order.orderId || '').toLowerCase().includes(query);
        const matchesBillNo = String(order.billNo || '').toLowerCase().includes(query);
        const matchesTest = order.testOrPackage?.name?.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesLabNo && !matchesBillNo && !matchesTest) return false;
      }
      if (labNoFilter.trim() && !String(order.orderId || '').toLowerCase().includes(labNoFilter.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'ALL' && order.orderStatus !== statusFilter) {
        return false;
      }
      if (refCenterFilter !== 'ALL' && order.center?.name !== refCenterFilter) {
        return false;
      }
      if (paymentStatusFilter !== 'ALL' && order.paymentStatus !== paymentStatusFilter) {
        return false;
      }
      return true;
    });
  }, [orders, searchQuery, statusFilter, refCenterFilter, paymentStatusFilter, labNoFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setRefCenterFilter('ALL');
    setPaymentStatusFilter('ALL');
    setLabNoFilter('');
    addToast('Filters reset to default', 'info');
  };

  const handleToggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.orderId));
    }
  };

  const handleToggleSelectRow = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header & Live System Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 uppercase tracking-wider">
              Diagnostic Operations
            </span>
            <span className="text-xs text-slate-500 font-medium">
              MediUnify Central Reference Lab — Mysuru
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Today's Lab Workspace & Orders
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time accessioning, phlebotomy scheduling, analyte processing, and NABL reports sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const csvContent =
                'data:text/csv;charset=utf-8,' +
                ['Order ID,Patient,Phone,Test,Status,Amount,Date'].join(',') +
                '\n' +
                filteredOrders
                  .map(
                    (o) =>
                      `"${o.orderId}","${o.patient?.name}","${o.patient?.phone}","${o.testOrPackage?.name}","${o.orderStatus}","${o.amount?.final}","${o.createdAt}"`
                  )
                  .join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `MediUnify_Lab_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              addToast('Exported orders CSV', 'success');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200/60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {onOpenNewOrder && (
            <button
              onClick={onOpenNewOrder}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-teal-600/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Order Booking</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Operational KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Orders */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Total Orders</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
            <div className="text-[11px] text-teal-600 font-bold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{stats.completed} Completed today</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
            <LayoutDashboard className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Phlebotomy */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Phlebotomy</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{stats.pendingPhlebotomy}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Awaiting home & center draw
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Processing on Analyzers */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Lab / Processing</div>
            <div className="text-2xl font-black text-blue-600 mt-1">{stats.inProcessing}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              On Roche & Sysmex lines
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <TestTube className="w-6 h-6" />
          </div>
        </div>

        {/* Reports Ready for Pathologist Sign-off */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Awaiting Sign-off</div>
            <div className="text-2xl font-black text-purple-600 mt-1">{stats.awaitingSignOff}</div>
            <div className="text-[11px] text-purple-700 font-bold mt-1">
              Pathologist review queue
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 3. Modern Search & Filter Command Panel */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        
        {/* Top Row: Search Input + Status Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Patient Name, Mobile (+91), Lab No, Bill No, or Test Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                isAdvancedFiltersOpen
                  ? 'bg-teal-50 text-teal-700 border-teal-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Columns</span>
            </button>

            {(searchQuery || statusFilter !== 'ALL' || refCenterFilter !== 'ALL' || paymentStatusFilter !== 'ALL') && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>

        {/* Status Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'ALL', label: 'All Orders', count: orders.length },
            { id: 'PLACED', label: 'Placed / New', count: orders.filter((o) => o.orderStatus === 'PLACED').length },
            { id: 'VERIFIED', label: 'Verified', count: orders.filter((o) => o.orderStatus === 'VERIFIED').length },
            { id: 'COLLECTION SCHEDULED', label: 'Dispatched', count: orders.filter((o) => o.orderStatus === 'COLLECTION SCHEDULED').length },
            { id: 'SAMPLE COLLECTED', label: 'Collected', count: orders.filter((o) => o.orderStatus === 'SAMPLE COLLECTED').length },
            { id: 'SAMPLE RECEIVED', label: 'Received', count: orders.filter((o) => o.orderStatus === 'SAMPLE RECEIVED').length },
            { id: 'IN LAB / PROCESSING', label: 'Processing', count: orders.filter((o) => o.orderStatus === 'IN LAB / PROCESSING').length },
            { id: 'REPORT READY', label: 'Report Ready', count: orders.filter((o) => o.orderStatus === 'REPORT READY').length },
            { id: 'COMPLETED', label: 'Completed', count: orders.filter((o) => o.orderStatus === 'COMPLETED').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  statusFilter === tab.id ? 'bg-teal-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {isAdvancedFiltersOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl animate-in fade-in-50">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-700 font-medium"
              >
                <option value="ALL">All Payments (Paid & Due)</option>
                <option value="Paid">Fully Paid / Settled</option>
                <option value="Due">Due / Pending Settlement</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Reference Lab / Center
              </label>
              <select
                value={refCenterFilter}
                onChange={(e) => setRefCenterFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-700 font-medium"
              >
                <option value="ALL">All Reference Centers</option>
                <option value="MediUnify Central Reference Laboratory - Mysuru Main">MediUnify Central Reference Lab (Saraswathipuram)</option>
                <option value="MediUnify Diagnostics & Collection Hub - Jayalakshmipuram">MediUnify Jayalakshmipuram Center</option>
                <option value="MediUnify Pathology & Sample Hub - Kuvempunagar">MediUnify Kuvempunagar Desk</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Direct Lab # Search
              </label>
              <input
                type="text"
                placeholder="e.g. LAB-1001"
                value={labNoFilter}
                onChange={(e) => setLabNoFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-700 font-medium"
              />
            </div>
          </div>
        )}

      </div>

      {/* 4. High-End Modern Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 font-bold border-b border-slate-200 select-none">
                <th className="py-3 px-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                  />
                </th>
                <th className="py-3 px-3 min-w-[130px]">Lab / Order #</th>
                <th className="py-3 px-4 min-w-[200px]">Patient Name</th>
                <th className="py-3 px-4 min-w-[220px]">Investigation / Service</th>
                <th className="py-3 px-3.5 min-w-[150px]">Ref. Doctor & Center</th>
                <th className="py-3 px-3.5 min-w-[120px]">Billing & Fee</th>
                <th className="py-3 px-3.5 min-w-[140px]">Live Lifecycle</th>
                <th className="py-3 px-4 text-right min-w-[110px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                      <Search className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-slate-700 text-sm">No laboratory orders found</div>
                    <div className="text-xs text-slate-400 mt-0.5">Try adjusting your search criteria or status filter.</div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => {
                  const isSelected = selectedOrders.includes(order.orderId);
                  const isDue = order.paymentStatus === 'Due';

                  return (
                    <tr
                      key={order.orderId}
                      className={`hover:bg-teal-50/40 transition-colors ${
                        isSelected ? 'bg-teal-50/70' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(order.orderId)}
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                        />
                      </td>

                      {/* Order / Lab # */}
                      <td className="py-3.5 px-3">
                        <div
                          onClick={() => onOpenOrderDetails(order)}
                          className="font-bold text-slate-900 hover:text-teal-600 cursor-pointer font-mono flex items-center gap-1 group"
                        >
                          <span>{order.orderId}</span>
                          <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-teal-600 transition-colors opacity-0 group-hover:opacity-100" />
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <span>Bill: {order.billNo || `0139${15 - idx}`}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{order.createdAt}</div>
                      </td>

                      {/* Patient Name - only patient name */}
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => onOpenOrderDetails(order)}
                          className="font-bold text-slate-900 hover:text-teal-600 cursor-pointer text-[13px]"
                        >
                          {order.patient?.name}
                        </div>
                      </td>

                      {/* Test or Package */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 leading-snug">
                          {order.testOrPackage?.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                            {order.testOrPackage?.type || 'LAB TEST'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {order.collectionType || 'Home Collection'}
                          </span>
                        </div>
                      </td>

                      {/* Doctor & Center */}
                      <td className="py-3.5 px-3.5">
                        <div className="font-medium text-slate-800 text-[11px]">
                          {order.patient?.referredBy || 'Dr. Priyadarshini (FAME)'}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px] mt-0.5">
                          {order.patient?.refCenter || order.center?.name || 'Farookh Med College & RI'}
                        </div>
                      </td>

                      {/* Billing & Fee */}
                      <td className="py-3.5 px-3.5">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          ₹{Number(order.amount?.final || 150).toFixed(2)}
                        </div>
                        <div className="mt-0.5">
                          {isDue ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Due
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Paid
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Lifecycle Status Badge */}
                      <td className="py-3.5 px-3.5">
                        <StatusBadge status={order.orderStatus} />
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onOpenOrderDetails(order)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 font-bold text-xs transition-all shadow-2xs inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> lab orders
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span>
              Selected: <strong>{selectedOrders.length}</strong> orders
            </span>
            <span>•</span>
            <span>
              Total Displayed Value:{' '}
              <strong className="text-slate-900 font-mono">
                ₹{filteredOrders.reduce((sum, o) => sum + (o.amount?.final || 0), 0).toFixed(2)}
              </strong>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
