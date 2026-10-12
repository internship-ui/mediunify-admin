import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Send,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Calculator,
  UserCheck,
  Download,
  AlertCircle
} from 'lucide-react';
import { downloadNursingOperationsExcel } from '../../../data/homeNursingData';

export default function CustomQuotesView({
  customQuotes,
  onOpenQuoteDetails,
  onOpenAssignStaff
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Quote Statuses');

  const filteredQuotes = useMemo(() => {
    return customQuotes.filter((q) => {
      const matchesSearch =
        q.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.requirementTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.phone.includes(searchTerm);

      const matchesStatus =
        statusFilter === 'All Quote Statuses' || q.quoteStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customQuotes, searchTerm, statusFilter]);

  const getQuoteStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Quote Preparation':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Quote Sent':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Quote Accepted':
      case 'Staff Assignment Pending':
        return 'bg-brand-teal-50 text-brand-teal-800 border-brand-teal-300 font-bold';
      case 'Quote Declined':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Scheduled':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Completed':
        return 'bg-brand-green-50 text-brand-green-800 border-brand-green-200 font-bold';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-brand-slate-100 text-brand-slate-700 border-brand-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-brand-navy-900">
      {/* Top Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight">
              Custom Quote Requests
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-teal-600" />
              Bespoke Nursing Quotes
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-slate-600 mt-1">
            Section 7 & 8 Workflow: Review non-standard clinical requirements, prepare customized quotations, dispatch to patients, and track decisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const exportData = customQuotes.map((q) => ({
                id: q.id,
                patientName: q.patientName,
                patientId: q.patientId,
                phone: q.phone,
                serviceName: 'Other Nursing Service (Custom Quote)',
                serviceCategory: 'Bespoke',
                location: q.location,
                preferredDate: q.preferredDate,
                preferredTime: q.preferredTime,
                assignedStaff: q.quoteDetails?.staffType || 'Custom Staff',
                status: q.quoteStatus,
                createdDate: q.createdDate
              }));
              downloadNursingOperationsExcel(exportData, 'MediUnify_Custom_Quotes');
            }}
            className="px-3.5 py-2 text-xs font-bold text-brand-slate-700 bg-brand-slate-100 hover:bg-brand-slate-200 border border-brand-slate-200 rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-brand-slate-600" />
            <span>Export Quotes</span>
          </button>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search custom quotes by patient, requirement, ID, location..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 text-brand-navy-900"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by Quote Status"
          className="px-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none"
        >
          <option value="All Quote Statuses">All Quote Statuses</option>
          <option value="New">New</option>
          <option value="Under Review">Under Review</option>
          <option value="Quote Preparation">Quote Preparation</option>
          <option value="Quote Sent">Quote Sent</option>
          <option value="Quote Accepted">Quote Accepted</option>
          <option value="Quote Declined">Quote Declined</option>
          <option value="Staff Assignment Pending">Staff Assignment Pending</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Section 8: Custom Quote Requests Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200/90 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-brand-slate-50 border-b border-brand-slate-200/80 text-[11px] font-bold text-brand-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Requirement</th>
                <th className="py-3 px-4">Requested Date & Time</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Quote Status</th>
                <th className="py-3 px-4 text-center">Request Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-brand-slate-500">
                    <FileText className="w-8 h-8 text-brand-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">No custom quote requests match current filter.</p>
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr
                    key={quote.id}
                    onClick={() => onOpenQuoteDetails(quote)}
                    className="hover:bg-brand-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Request ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-brand-teal-700 whitespace-nowrap">
                      {quote.id}
                    </td>

                    {/* Patient */}
                    <td className="py-3.5 px-4">
                      <div className="font-black text-brand-navy-950 text-xs sm:text-sm group-hover:text-brand-teal-700 transition-colors">
                        {quote.patientName}
                      </div>
                      <div className="text-[11px] text-brand-slate-500 mt-0.5">
                        {quote.phone}
                      </div>
                    </td>

                    {/* Requirement */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-extrabold text-brand-navy-900 line-clamp-1">
                        {quote.requirementTitle}
                      </div>
                      <div className="text-[11px] text-brand-slate-500 line-clamp-1 mt-0.5">
                        {quote.duration}
                      </div>
                    </td>

                    {/* Requested Date & Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-brand-navy-900 text-xs flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-slate-400" />
                        {quote.preferredDate}
                      </div>
                      <div className="text-[11px] text-brand-slate-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-brand-slate-400" />
                        {quote.preferredTime}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-semibold text-brand-navy-900">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-coral-600" />
                        {quote.location}
                      </div>
                    </td>

                    {/* Quote Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getQuoteStatusBadge(quote.quoteStatus)}`}>
                        {quote.quoteStatus}
                      </span>
                    </td>

                    {/* Request Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="text-xs font-semibold text-brand-slate-700 bg-brand-slate-100 px-2 py-0.5 rounded border border-brand-slate-200">
                        {quote.requestStatus}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-brand-slate-600">
                      {quote.createdDate}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenQuoteDetails(quote)}
                          className="px-2.5 py-1 text-xs font-bold text-brand-teal-800 bg-brand-teal-50 hover:bg-brand-teal-100 border border-brand-teal-200 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Calculator className="w-3 h-3" />
                          <span>{quote.quoteStatus === 'New' || quote.quoteStatus === 'Under Review' ? 'Prepare Quote' : 'View Quote'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
