import React, { useState } from 'react';
import {
  AlertCircle,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Building2,
  Phone,
  User,
  MessageSquare,
  XCircle,
  Check,
  Send,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function ComplaintsSupportView({
  complaints = [],
  onUpdateComplaintStatus,
  onAddComplaintNote
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  // Statuses specified in Section 15
  const tabs = [
    'All',
    'Open',
    'In Progress',
    'Waiting for Vendor',
    'Resolved',
    'Closed'
  ];

  const filteredComplaints = complaints.filter((c) => {
    const matchesTab =
      activeTab === 'All' || c.status === activeTab;

    const matchesSearch =
      (c.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.patientName || c.patient || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.vendorName || c.vendor || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.issue || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleOpenNoteModal = (cmp) => {
    setSelectedComplaint(cmp);
    setNoteText(cmp.internalNotes || '');
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = () => {
    if (selectedComplaint && onAddComplaintNote) {
      onAddComplaintNote(selectedComplaint.id, noteText);
    }
    setIsNoteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <AlertCircle className="w-7 h-7 text-brand-teal-600" />
            Support & Rental Issue Resolution
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Operational triage of patient reported equipment malfunctions, vendor replacement requests, and care coordination.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {tabs.map((tab) => {
          const count =
            tab === 'All'
              ? complaints.length
              : complaints.filter((c) => c.status === tab).length;

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
            placeholder="Search ticket ID, order ID, patient, vendor, issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
          />
        </div>
        <div className="text-xs text-gray-500">
          Showing <span className="font-bold text-gray-800">{filteredComplaints.length}</span> support tickets
        </div>
      </div>

      {/* Complaints Table with Required Columns */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3.5">Ticket ID</th>
                <th className="px-4 py-3.5">Rental / Order ID</th>
                <th className="px-4 py-3.5">Patient Details</th>
                <th className="px-4 py-3.5">Vendor Partner</th>
                <th className="px-4 py-3.5">Reported Issue</th>
                <th className="px-4 py-3.5">Created Date</th>
                <th className="px-4 py-3.5">Priority</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Ticket ID */}
                    <td className="px-4 py-3.5 font-mono font-bold text-brand-navy-900">
                      {c.id}
                    </td>

                    {/* Order ID */}
                    <td className="px-4 py-3.5 font-mono text-brand-teal-700 font-semibold">
                      {c.orderId || 'ORD-1001'}
                    </td>

                    {/* Patient */}
                    <td className="px-4 py-3.5 text-gray-900 font-semibold">
                      {c.patientName || c.patient}
                    </td>

                    {/* Vendor */}
                    <td className="px-4 py-3.5 text-gray-700 max-w-[130px] truncate">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-brand-teal-600" />
                        <span>{c.vendorName || c.vendor}</span>
                      </div>
                    </td>

                    {/* Issue */}
                    <td className="px-4 py-3.5 text-gray-800 max-w-[200px] truncate" title={c.description || c.issue}>
                      <div className="font-semibold">{c.issue}</div>
                      <div className="text-[11px] text-gray-400 truncate">{c.description || 'Patient requested actuator check'}</div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      {c.date || 'Today'}
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.priority || 'Medium'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={c.status} size="xs" />
                    </td>

                    {/* Actions: View, Add Note, Contact Vendor, Resolve */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedComplaint(c)}
                          className="px-2 py-1 text-[11px] font-semibold text-gray-700 hover:text-brand-navy-900 hover:bg-gray-100 rounded-lg border border-gray-200"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleOpenNoteModal(c)}
                          className="px-2 py-1 text-[11px] font-semibold text-brand-teal-700 hover:bg-brand-teal-50 rounded-lg border border-brand-teal-200"
                          title="Add Coordination Note"
                        >
                          Note
                        </button>
                        <button
                          onClick={() => {
                            if (onUpdateComplaintStatus) onUpdateComplaintStatus(c.id, 'Waiting for Vendor');
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200"
                          title="Contact Vendor"
                        >
                          Vendor
                        </button>
                        {c.status !== 'Resolved' && c.status !== 'Closed' && (
                          <button
                            onClick={() => {
                              if (onUpdateComplaintStatus) onUpdateComplaintStatus(c.id, 'Resolved');
                            }}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                            title="Resolve Ticket"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-gray-400">
                    <AlertCircle className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-base font-semibold text-gray-700">No support tickets found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPLAINT DETAIL MODAL */}
      {selectedComplaint && !isNoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="font-mono text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded border border-brand-teal-200">
                  {selectedComplaint.id}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-1">{selectedComplaint.issue}</h3>
              </div>
              <button onClick={() => setSelectedComplaint(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
              <div>Order: <strong>{selectedComplaint.orderId || 'ORD-1001'}</strong></div>
              <div>Patient: <strong>{selectedComplaint.patientName || selectedComplaint.patient}</strong></div>
              <div>Vendor: <strong>{selectedComplaint.vendorName || selectedComplaint.vendor}</strong></div>
              <div>Priority: <strong className="text-rose-700 font-bold">{selectedComplaint.priority}</strong></div>
              <div>Description: <p className="text-gray-700 italic mt-0.5">"{selectedComplaint.description || selectedComplaint.issue}"</p></div>
              {selectedComplaint.internalNotes && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-400">Internal Admin Note:</span>
                  <div className="text-gray-800 font-medium">{selectedComplaint.internalNotes}</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 bg-brand-navy-900 text-white rounded-xl font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NOTE MODAL */}
      {isNoteModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Add Operational Note ({selectedComplaint.id})</h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Record vendor phone call details, technician ETA, or patient update..."
              className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsNoteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white rounded-xl font-semibold shadow-sm"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
