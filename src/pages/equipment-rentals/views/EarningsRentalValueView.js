import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Wallet,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  AlertCircle,
  Filter,
  Calendar,
  Building2,
  Package,
  Search,
  Eye,
  Info,
  DollarSign,
  Layers,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function EarningsRentalValueView({
  requests = [],
  vendors = [],
  onOpenRequest
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('ALL');
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'vendor-breakdown' | 'equipment-breakdown'

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    requests.forEach((r) => {
      if (r.equipmentCategory) set.add(r.equipmentCategory);
    });
    return Array.from(set).sort();
  }, [requests]);

  // Extract unique vendors from requests & vendors list
  const vendorOptions = useMemo(() => {
    const map = new Map();
    vendors.forEach((v) => map.set(v.businessName, v.businessName));
    requests.forEach((r) => {
      if (r.selectedVendor?.businessName) {
        map.set(r.selectedVendor.businessName, r.selectedVendor.businessName);
      }
    });
    return Array.from(map.values()).sort();
  }, [vendors, requests]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Vendor filter
      if (selectedVendor !== 'ALL') {
        const vName = req.selectedVendor?.businessName || '';
        if (vName !== selectedVendor) return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL') {
        if (req.equipmentCategory !== selectedCategory) return false;
      }

      // Status filter
      if (selectedStatus !== 'ALL') {
        const s = (req.rentalStatus || req.status || '').toLowerCase();
        if (selectedStatus === 'COMPLETED' && !s.includes('completed')) return false;
        if (selectedStatus === 'ACTIVE' && (!s.includes('active') && !s.includes('delivered'))) return false;
        if (selectedStatus === 'CONFIRMED' && !s.includes('confirmed')) return false;
        if (selectedStatus === 'PENDING' && !s.includes('awaiting') && !s.includes('new')) return false;
        if (selectedStatus === 'CANCELLED' && !s.includes('cancel')) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = (req.id || '').toLowerCase().includes(q);
        const matchEquip = (req.equipment || '').toLowerCase().includes(q);
        const matchVendor = (req.selectedVendor?.businessName || '').toLowerCase().includes(q);
        const matchPatient = (req.patientName || req.patientId || '').toLowerCase().includes(q);
        if (!matchId && !matchEquip && !matchVendor && !matchPatient) return false;
      }

      return true;
    });
  }, [requests, selectedVendor, selectedCategory, selectedStatus, searchQuery]);

  // Financial Metrics Calculation (Applied over filtered dataset or entire dataset for cards)
  const metrics = useMemo(() => {
    let totalRecorded = 0;
    let completedValue = 0;
    let activeValue = 0;
    let pendingValue = 0;
    let totalDelivery = 0;
    let totalDeposits = 0;
    let completedCount = 0;
    let awaitingPriceCount = 0;

    filteredRequests.forEach((r) => {
      const s = (r.rentalStatus || r.status || '').toLowerCase();
      const amount = Number(r.finalAgreedAmount) || 0;
      const isAgreed = Boolean(r.isAmountAgreed && r.finalAgreedAmount);

      if (!isAgreed) {
        awaitingPriceCount++;
      } else {
        totalRecorded += amount;
        totalDelivery += Number(r.deliveryCharges) || 0;
        totalDeposits += Number(r.refundableDeposit) || 0;

        if (s.includes('completed')) {
          completedValue += amount;
        } else if (s.includes('active') || s.includes('delivered')) {
          activeValue += amount;
        } else if (!s.includes('cancel')) {
          pendingValue += amount;
        }
      }

      if (s.includes('completed')) {
        completedCount++;
      }
    });

    return {
      totalRecorded,
      completedValue,
      activeValue,
      pendingValue,
      totalDelivery,
      totalDeposits,
      completedCount,
      awaitingPriceCount,
      totalRequests: filteredRequests.length
    };
  }, [filteredRequests]);

  // Vendor-wise breakdown
  const vendorBreakdown = useMemo(() => {
    const vMap = {};
    filteredRequests.forEach((r) => {
      const vName = r.selectedVendor?.businessName || 'Unassigned / Direct';
      if (!vMap[vName]) {
        vMap[vName] = {
          name: vName,
          vendorId: r.selectedVendor?.id || '—',
          phone: r.selectedVendor?.phone || '—',
          totalRequests: 0,
          completedRequests: 0,
          activeRequests: 0,
          recordedValue: 0,
          depositsHeld: 0,
          awaitingPrice: 0
        };
      }
      vMap[vName].totalRequests++;
      const s = (r.rentalStatus || r.status || '').toLowerCase();
      if (s.includes('completed')) vMap[vName].completedRequests++;
      if (s.includes('active') || s.includes('delivered')) vMap[vName].activeRequests++;

      if (r.isAmountAgreed && r.finalAgreedAmount) {
        vMap[vName].recordedValue += Number(r.finalAgreedAmount) || 0;
        vMap[vName].depositsHeld += Number(r.refundableDeposit) || 0;
      } else {
        vMap[vName].awaitingPrice++;
      }
    });
    return Object.values(vMap).sort((a, b) => b.recordedValue - a.recordedValue);
  }, [filteredRequests]);

  // Equipment Category breakdown
  const equipmentBreakdown = useMemo(() => {
    const cMap = {};
    filteredRequests.forEach((r) => {
      const cat = r.equipmentCategory || 'General Equipment';
      if (!cMap[cat]) {
        cMap[cat] = {
          category: cat,
          totalRequests: 0,
          completedCount: 0,
          recordedValue: 0,
          depositsHeld: 0
        };
      }
      cMap[cat].totalRequests++;
      const s = (r.rentalStatus || r.status || '').toLowerCase();
      if (s.includes('completed')) cMap[cat].completedCount++;
      if (r.isAmountAgreed && r.finalAgreedAmount) {
        cMap[cat].recordedValue += Number(r.finalAgreedAmount) || 0;
        cMap[cat].depositsHeld += Number(r.refundableDeposit) || 0;
      }
    });
    return Object.values(cMap).sort((a, b) => b.recordedValue - a.recordedValue);
  }, [filteredRequests]);

  const resetFilters = () => {
    setSelectedVendor('ALL');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSelectedDateRange('ALL');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-brand-navy-900 via-brand-navy-800 to-brand-teal-900 rounded-2xl p-6 text-white shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-teal-300 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Financial Monitoring & Oversight</span>
            </div>
            <h1 className="text-2xl font-extrabold mt-1 tracking-tight">
              Earnings & Rental Value
            </h1>
            <p className="text-xs sm:text-sm text-brand-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time monitoring of agreed rental values, delivery charges, and deposits between registered vendors and patients.
            </p>
          </div>

          {/* Quick Notice Badge */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-xs flex items-start gap-2.5 max-w-md">
            <Info className="w-4 h-4 text-brand-teal-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white text-[11px]">Monitoring Scope Notice</p>
              <p className="text-[11px] text-brand-slate-300 mt-0.5 leading-snug">
                Values reflect amounts agreed directly between patients and vendors. No platform commissions or fee deductions are applied. Refundable deposits are identified separately.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7 Summary Cards (Requirement Section 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
        {/* Card 1: Total Recorded Rental Value */}
        <div className="bg-white p-4 rounded-2xl border border-brand-teal-200 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-brand-teal-700 text-xs font-bold">
            <span className="truncate">Total Recorded Value</span>
            <Wallet className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
          </div>
          <div className="text-2xl font-black text-brand-navy-900 mt-2 font-mono">
            ₹{metrics.totalRecorded.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-brand-teal-700 font-semibold mt-1 truncate">
            Across {filteredRequests.length} monitored records
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-teal-500" />
        </div>

        {/* Card 2: Completed Rentals Value */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs relative overflow-hidden group hover:shadow-md transition-all bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold">
            <span className="truncate">Completed Value</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-2 font-mono">
            ₹{metrics.completedValue.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-emerald-700 font-semibold mt-1 truncate">
            {metrics.completedCount} rentals completed
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Card 3: Active Rentals Value */}
        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs relative overflow-hidden group hover:shadow-md transition-all bg-blue-50/20">
          <div className="flex items-center justify-between text-blue-700 text-xs font-bold">
            <span className="truncate">Active Rentals Value</span>
            <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
          </div>
          <div className="text-2xl font-black text-blue-900 mt-2 font-mono">
            ₹{metrics.activeValue.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-blue-700 font-semibold mt-1 truncate">
            Active with patients now
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
        </div>

        {/* Card 4: Pending Rental Value */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs relative overflow-hidden group hover:shadow-md transition-all bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold">
            <span className="truncate">Pending Rental Value</span>
            <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          </div>
          <div className="text-2xl font-black text-amber-900 mt-2 font-mono">
            ₹{metrics.pendingValue.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-amber-700 font-semibold mt-1 truncate">
            {metrics.awaitingPriceCount > 0 ? `${metrics.awaitingPriceCount} awaiting price` : 'Confirmed / Pre-dispatch'}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
        </div>

        {/* Card 5: Total Delivery Charges Recorded */}
        <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-xs relative overflow-hidden group hover:shadow-md transition-all bg-indigo-50/20">
          <div className="flex items-center justify-between text-indigo-700 text-xs font-bold">
            <span className="truncate">Delivery Charges</span>
            <Truck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          </div>
          <div className="text-2xl font-black text-indigo-900 mt-2 font-mono">
            ₹{metrics.totalDelivery.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-indigo-700 font-semibold mt-1 truncate">
            Transport & logistics sum
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500" />
        </div>

        {/* Card 6: Total Refundable Deposits Held */}
        <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-xs relative overflow-hidden group hover:shadow-md transition-all bg-purple-50/20">
          <div className="flex items-center justify-between text-purple-700 text-xs font-bold">
            <span className="truncate">Deposits Held</span>
            <ShieldCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
          </div>
          <div className="text-2xl font-black text-purple-900 mt-2 font-mono">
            ₹{metrics.totalDeposits.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-purple-700 font-semibold mt-1 truncate">
            Refundable (Held in Trust)
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
        </div>

        {/* Card 7: Number of Completed Rentals */}
        <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs relative overflow-hidden group hover:shadow-md transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-brand-slate-600 text-xs font-bold">
            <span className="truncate">Completed Rentals</span>
            <CheckCircle2 className="w-4 h-4 text-brand-slate-500 flex-shrink-0" />
          </div>
          <div className="text-2xl font-black text-brand-navy-900 mt-2 font-mono">
            {metrics.completedCount}
          </div>
          <p className="text-[10px] text-brand-slate-500 font-semibold mt-1 truncate">
            Fully closed orders
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-slate-400" />
        </div>
      </div>

      {/* Financial Disclaimer Banner */}
      <div className="bg-brand-teal-50/70 border border-brand-teal-200 rounded-2xl p-4 text-xs text-brand-teal-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-brand-teal-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-brand-navy-900">
              Admin Governance & Non-Interference Policy
            </span>
            <span className="text-brand-slate-600 text-[11px] leading-relaxed">
              MediUnify acts solely as an operational monitoring portal. MediUnify does not deduct commissions or platform fees.
              Agreed rental prices and refundable deposits are managed directly between the patient and their selected vendor.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-brand-teal-300 rounded-lg font-mono text-[11px] font-bold text-brand-teal-800 shadow-2xs">
            0% Commission Policy
          </span>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs p-4 space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-brand-slate-100 rounded-xl self-start">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'transactions'
                  ? 'bg-white text-brand-navy-900 shadow-xs'
                  : 'text-brand-slate-600 hover:text-brand-navy-900'
              }`}
            >
              Rental Transactions ({filteredRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('vendor-breakdown')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'vendor-breakdown'
                  ? 'bg-white text-brand-navy-900 shadow-xs'
                  : 'text-brand-slate-600 hover:text-brand-navy-900'
              }`}
            >
              Vendor-wise Breakdown ({vendorBreakdown.length})
            </button>
            <button
              onClick={() => setActiveTab('equipment-breakdown')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'equipment-breakdown'
                  ? 'bg-white text-brand-navy-900 shadow-xs'
                  : 'text-brand-slate-600 hover:text-brand-navy-900'
              }`}
            >
              Equipment-wise Breakdown ({equipmentBreakdown.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search request ID, vendor, equip..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-brand-slate-50 border border-brand-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:bg-white"
            />
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-brand-slate-100">
          {/* Vendor Filter */}
          <div>
            <label className="text-[10px] font-bold text-brand-slate-500 uppercase tracking-wider block mb-1">
              Filter by Vendor
            </label>
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="w-full text-xs bg-brand-slate-50 border border-brand-slate-200 rounded-xl px-2.5 py-1.5 text-brand-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            >
              <option value="ALL">All Vendors ({vendorOptions.length})</option>
              {vendorOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Equipment Category Filter */}
          <div>
            <label className="text-[10px] font-bold text-brand-slate-500 uppercase tracking-wider block mb-1">
              Equipment Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs bg-brand-slate-50 border border-brand-slate-200 rounded-xl px-2.5 py-1.5 text-brand-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Rental Status Filter */}
          <div>
            <label className="text-[10px] font-bold text-brand-slate-500 uppercase tracking-wider block mb-1">
              Rental Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs bg-brand-slate-50 border border-brand-slate-200 rounded-xl px-2.5 py-1.5 text-brand-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending / Awaiting</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="ACTIVE">Active Rentals</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="text-[10px] font-bold text-brand-slate-500 uppercase tracking-wider block mb-1">
              Date Period
            </label>
            <div className="flex items-center gap-1.5">
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full text-xs bg-brand-slate-50 border border-brand-slate-200 rounded-xl px-2.5 py-1.5 text-brand-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
              >
                <option value="ALL">All Time</option>
                <option value="LAST_7">Last 7 Days</option>
                <option value="LAST_30">Last 30 Days</option>
                <option value="THIS_MONTH">This Month</option>
              </select>

              {(selectedVendor !== 'ALL' || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
                <button
                  onClick={resetFilters}
                  title="Reset Filters"
                  className="p-1.5 text-brand-slate-500 hover:text-brand-slate-800 bg-brand-slate-100 hover:bg-brand-slate-200 rounded-xl transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Areas based on Tab */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-brand-navy-900 tracking-tight flex items-center gap-2">
                <Wallet className="w-4 h-4 text-brand-teal-700" />
                Detailed Rental Transactions
              </h2>
              <p className="text-xs text-brand-slate-500 mt-0.5">
                Individual rental agreements with full itemization of base rent, logistics, and refundable deposits
              </p>
            </div>
            <span className="text-xs font-bold font-mono text-brand-slate-500">
              Showing {filteredRequests.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-slate-600">
              <thead className="bg-brand-slate-50/80 text-[11px] font-bold text-brand-slate-700 uppercase tracking-wider border-b border-brand-slate-200">
                <tr>
                  <th className="px-3.5 py-3">Request ID</th>
                  <th className="px-3.5 py-3">Vendor Name</th>
                  <th className="px-3.5 py-3">Equipment</th>
                  <th className="px-3 py-3">Rental Duration</th>
                  <th className="px-3 py-3 text-right">Agreed Rental Price</th>
                  <th className="px-3 py-3 text-right">Delivery Charges</th>
                  <th className="px-3 py-3 text-right">Refundable Deposit</th>
                  <th className="px-3.5 py-3 text-right">Final Agreed Amount</th>
                  <th className="px-3 py-3 text-center">Payment Status</th>
                  <th className="px-3 py-3 text-center">Rental Status</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center py-12 text-brand-slate-400">
                      <AlertCircle className="w-8 h-8 mx-auto text-brand-slate-300 mb-2" />
                      <p className="font-bold text-sm text-brand-slate-600">No rental records match the filters</p>
                      <button
                        onClick={resetFilters}
                        className="mt-3 px-3.5 py-1.5 bg-brand-teal-50 text-brand-teal-700 hover:bg-brand-teal-100 rounded-xl text-xs font-bold transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => {
                    const isAgreed = req.isAmountAgreed && req.finalAgreedAmount !== null;

                    return (
                      <tr
                        key={req.id}
                        className="hover:bg-brand-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => onOpenRequest && onOpenRequest(req.id)}
                      >
                        {/* 1. Request ID */}
                        <td className="px-3.5 py-3.5 font-mono font-bold text-brand-navy-900 whitespace-nowrap">
                          {req.id}
                          <div className="text-[10px] text-brand-slate-400 font-sans font-normal">
                            {req.requestDate}
                          </div>
                        </td>

                        {/* 2. Vendor Name */}
                        <td className="px-3.5 py-3.5">
                          <div className="font-bold text-brand-navy-900 whitespace-nowrap flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-brand-teal-600 flex-shrink-0" />
                            <span>{req.selectedVendor?.businessName || '—'}</span>
                          </div>
                          <div className="text-[10px] text-brand-slate-400 font-mono">
                            {req.selectedVendor?.id}
                          </div>
                        </td>

                        {/* 3. Equipment */}
                        <td className="px-3.5 py-3.5">
                          <div className="font-semibold text-brand-navy-900 flex items-center gap-1">
                            <Package className="w-3.5 h-3.5 text-brand-slate-400 flex-shrink-0" />
                            <span>{req.equipment}</span>
                          </div>
                          <span className="text-[10px] text-brand-slate-400">
                            {req.equipmentCategory} (Qty: {req.quantity || 1})
                          </span>
                        </td>

                        {/* 4. Rental Duration */}
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <span className="font-medium text-brand-slate-700">
                            {req.rentalDuration || req.rentalPeriod || '—'}
                          </span>
                          <div className="text-[10px] text-brand-slate-400">
                            {req.rentalStartDate}
                          </div>
                        </td>

                        {/* 5. Agreed Rental Price */}
                        <td className="px-3 py-3.5 text-right font-mono whitespace-nowrap">
                          {isAgreed ? (
                            <div>
                              <span className="font-bold text-brand-navy-900">
                                ₹{Number(req.baseRentalPrice || 0).toLocaleString('en-IN')}
                              </span>
                              {req.discount > 0 && (
                                <div className="text-[10px] text-emerald-600 font-sans">
                                  -₹{req.discount} off
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              Awaiting
                            </span>
                          )}
                        </td>

                        {/* 6. Delivery Charges */}
                        <td className="px-3 py-3.5 text-right font-mono whitespace-nowrap">
                          {isAgreed ? (
                            req.deliveryCharges > 0 ? (
                              <span className="text-brand-slate-700 font-medium">
                                ₹{Number(req.deliveryCharges).toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span className="text-emerald-700 text-[10px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                                Free
                              </span>
                            )
                          ) : (
                            <span className="text-brand-slate-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* 7. Refundable Deposit */}
                        <td className="px-3 py-3.5 text-right font-mono whitespace-nowrap">
                          {isAgreed ? (
                            req.refundableDeposit > 0 ? (
                              <div>
                                <span className="font-bold text-purple-800">
                                  ₹{Number(req.refundableDeposit).toLocaleString('en-IN')}
                                </span>
                                <div className="text-[9px] text-purple-600 uppercase font-sans font-bold">
                                  Deposit Held
                                </div>
                              </div>
                            ) : (
                              <span className="text-brand-slate-400 text-[10px]">None</span>
                            )
                          ) : (
                            <span className="text-brand-slate-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* 8. Final Agreed Amount */}
                        <td className="px-3.5 py-3.5 text-right font-mono whitespace-nowrap">
                          {isAgreed ? (
                            <div>
                              <span className="font-extrabold text-sm text-brand-teal-900">
                                ₹{Number(req.finalAgreedAmount).toLocaleString('en-IN')}
                              </span>
                              <div className="text-[9px] text-brand-slate-400 font-sans">
                                rent + delivery
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-bold">
                              <Clock className="w-3 h-3" /> Amount Awaiting Confirmation
                            </span>
                          )}
                        </td>

                        {/* 9. Payment Status */}
                        <td className="px-3 py-3.5 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              (req.paymentStatus || '').toLowerCase() === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : (req.paymentStatus || '').toLowerCase().includes('partial')
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : (req.paymentStatus || '').toLowerCase().includes('pending')
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-brand-slate-100 text-brand-slate-600 border border-brand-slate-200'
                            }`}
                          >
                            {req.paymentStatus || 'Awaiting Update'}
                          </span>
                        </td>

                        {/* 10. Rental Status */}
                        <td className="px-3 py-3.5 text-center whitespace-nowrap">
                          <StatusBadge status={req.rentalStatus || req.status} size="xs" />
                        </td>

                        {/* 11. Action */}
                        <td className="px-3 py-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onOpenRequest) onOpenRequest(req.id);
                            }}
                            className="px-2.5 py-1.5 bg-brand-teal-50 hover:bg-brand-teal-600 text-brand-teal-700 hover:text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 shadow-2xs group-hover:scale-105"
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
        </div>
      )}

      {/* Vendor Breakdown View */}
      {activeTab === 'vendor-breakdown' && (
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-brand-slate-100">
            <h2 className="text-sm font-extrabold text-brand-navy-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-teal-700" />
              Vendor-wise Value Summary
            </h2>
            <p className="text-xs text-brand-slate-500 mt-0.5">
              Aggregated rental values and security deposits reported per equipment vendor
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-slate-600">
              <thead className="bg-brand-slate-50/80 text-[11px] font-bold text-brand-slate-700 uppercase tracking-wider border-b border-brand-slate-200">
                <tr>
                  <th className="px-4 py-3">Vendor / Business Name</th>
                  <th className="px-4 py-3">Vendor ID</th>
                  <th className="px-4 py-3 text-center">Total Requests</th>
                  <th className="px-4 py-3 text-center">Active Rentals</th>
                  <th className="px-4 py-3 text-center">Completed</th>
                  <th className="px-4 py-3 text-right">Refundable Deposits Held</th>
                  <th className="px-4 py-3 text-right">Total Recorded Rental Value</th>
                  <th className="px-4 py-3 text-center">Awaiting Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100">
                {vendorBreakdown.map((v) => (
                  <tr key={v.name} className="hover:bg-brand-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-brand-navy-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
                      <span>{v.name}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-brand-slate-500">{v.vendorId}</td>
                    <td className="px-4 py-3.5 text-center font-bold font-mono text-brand-navy-900">
                      {v.totalRequests}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold font-mono rounded">
                        {v.activeRequests}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold font-mono rounded">
                        {v.completedRequests}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-purple-800">
                      ₹{v.depositsHeld.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-extrabold text-sm text-brand-teal-900">
                      ₹{v.recordedValue.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {v.awaitingPrice > 0 ? (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 rounded">
                          {v.awaitingPrice} pending
                        </span>
                      ) : (
                        <span className="text-emerald-700 text-[10px] font-bold">All Set</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Equipment-wise Breakdown View */}
      {activeTab === 'equipment-breakdown' && (
        <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-brand-slate-100">
            <h2 className="text-sm font-extrabold text-brand-navy-900 tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-teal-700" />
              Equipment Category Breakdown
            </h2>
            <p className="text-xs text-brand-slate-500 mt-0.5">
              Breakdown of rental volume and total agreed value classified by medical device category
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-slate-600">
              <thead className="bg-brand-slate-50/80 text-[11px] font-bold text-brand-slate-700 uppercase tracking-wider border-b border-brand-slate-200">
                <tr>
                  <th className="px-4 py-3">Category Name</th>
                  <th className="px-4 py-3 text-center">Total Requests</th>
                  <th className="px-4 py-3 text-center">Completed Rentals</th>
                  <th className="px-4 py-3 text-right">Refundable Deposits Held</th>
                  <th className="px-4 py-3 text-right">Total Recorded Value</th>
                  <th className="px-4 py-3 text-right">Avg Value / Rental</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100">
                {equipmentBreakdown.map((c) => {
                  const avg = c.totalRequests > 0 ? Math.round(c.recordedValue / c.totalRequests) : 0;
                  return (
                    <tr key={c.category} className="hover:bg-brand-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-brand-navy-900 flex items-center gap-2">
                        <Package className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
                        <span>{c.category}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono font-bold text-brand-navy-900">
                        {c.totalRequests}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold font-mono rounded">
                          {c.completedCount}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-purple-800">
                        ₹{c.depositsHeld.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-extrabold text-sm text-brand-teal-900">
                        ₹{c.recordedValue.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-brand-slate-700 font-semibold">
                        ₹{avg.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
