import React, { useState, useMemo } from 'react';
import {
  PhoneCall,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Building2,
  Sparkles,
  MessageSquare,
  Plus,
  Check,
  RotateCcw
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/forms/FormInput';

export default function CallbacksView({
  callbacks = [],
  onUpdateCallbackStatus,
  onAddInternalNote
}) {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCallback, setSelectedCallback] = useState(null);

  // New Note state inside modal
  const [newNoteText, setNewNoteText] = useState('');

  // Status Counts
  const counts = {
    ALL: callbacks.length,
    New: callbacks.filter((cb) => cb.status === 'New').length,
    Contacted: callbacks.filter((cb) => cb.status === 'Contacted').length,
    'Appointment Confirmed': callbacks.filter((cb) => cb.status === 'Appointment Confirmed').length,
    Completed: callbacks.filter((cb) => cb.status === 'Completed').length,
    Closed: callbacks.filter((cb) => cb.status === 'Closed').length
  };

  // Filtered Callbacks
  const filteredCallbacks = useMemo(() => {
    return callbacks.filter((cb) => {
      // Tab matching
      if (activeTab !== 'ALL' && cb.status !== activeTab) {
        return false;
      }

      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          cb.id.toLowerCase().includes(q) ||
          cb.patient.toLowerCase().includes(q) ||
          cb.phone.toLowerCase().includes(q) ||
          cb.centre.toLowerCase().includes(q) ||
          cb.serviceName.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [callbacks, activeTab, searchTerm]);

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedCallback) return;

    onAddInternalNote(selectedCallback.id, newNoteText);
    const updatedNotes = [
      ...(selectedCallback.internalNotes || []),
      {
        author: 'Admin Support Lead',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        text: newNoteText
      }
    ];

    setSelectedCallback({
      ...selectedCallback,
      internalNotes: updatedNotes
    });
    setNewNoteText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy-900 flex items-center gap-2.5">
          <PhoneCall className="w-6 h-6 text-brand-coral-500" />
          Callback Requests
        </h1>
        <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
          Patient appointment inquiries, therapy guidance queries, and phone callback coordination
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Requests' },
          { id: 'New', label: 'New Inquiries' },
          { id: 'Contacted', label: 'Contacted' },
          { id: 'Appointment Confirmed', label: 'Confirmed' },
          { id: 'Completed', label: 'Completed' },
          { id: 'Closed', label: 'Closed' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-brand-navy-900 text-white shadow-sm'
                  : 'text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-brand-navy-800 text-brand-teal-300' : 'bg-brand-slate-100 text-brand-slate-600'}`}>
                {counts[tab.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by request ID, patient name, phone or centre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-coral-500/20 focus:border-brand-coral-500"
          />
        </div>
      </div>

      {/* Callbacks Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-700">
            <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Centre</th>
                <th className="py-3 px-4">Selected Service</th>
                <th className="py-3 px-4">Preferred Time</th>
                <th className="py-3 px-4">Request Date</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100 font-medium">
              {filteredCallbacks.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-brand-slate-400">
                    <PhoneCall className="w-8 h-8 mx-auto mb-2 text-brand-slate-300" />
                    <p className="font-semibold">No callback requests found matching criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredCallbacks.map((cb) => (
                  <tr key={cb.id} className="hover:bg-brand-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-extrabold text-brand-navy-900">{cb.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-brand-navy-900">{cb.patient}</td>
                    <td className="py-3.5 px-4 font-mono text-brand-slate-800">{cb.phone}</td>
                    <td className="py-3.5 px-4 max-w-[140px] truncate text-brand-slate-700">{cb.centre}</td>
                    <td className="py-3.5 px-4 max-w-[160px] truncate text-brand-green-800 font-medium">{cb.serviceName}</td>
                    <td className="py-3.5 px-4 max-w-[130px] truncate text-brand-slate-600">{cb.preferredTime}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-600">{cb.requestDate}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-500">{cb.assignedStaff}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={cb.status} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedCallback(cb)}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl text-white bg-brand-green-600 hover:bg-brand-green-700 shadow-xs transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Callback Request Management & Notes Modal */}
      {selectedCallback && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCallback(null)}
          title={`Callback Request • ${selectedCallback.id}`}
          subtitle={`Requested on ${selectedCallback.requestDate} by ${selectedCallback.patient}`}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex flex-wrap items-center justify-between w-full gap-2">
              <button
                type="button"
                onClick={() => setSelectedCallback(null)}
                className="px-4 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {selectedCallback.status === 'New' && (
                  <button
                    onClick={() => {
                      onUpdateCallbackStatus(selectedCallback.id, 'Contacted');
                      setSelectedCallback({ ...selectedCallback, status: 'Contacted' });
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-xs"
                  >
                    Mark Contacted
                  </button>
                )}

                {selectedCallback.status !== 'Appointment Confirmed' && selectedCallback.status !== 'Completed' && (
                  <button
                    onClick={() => {
                      onUpdateCallbackStatus(selectedCallback.id, 'Appointment Confirmed');
                      setSelectedCallback({ ...selectedCallback, status: 'Appointment Confirmed' });
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-xs"
                  >
                    Confirm Appointment
                  </button>
                )}

                {selectedCallback.status !== 'Closed' && (
                  <button
                    onClick={() => {
                      onUpdateCallbackStatus(selectedCallback.id, 'Closed');
                      setSelectedCallback({ ...selectedCallback, status: 'Closed' });
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold text-brand-slate-700 bg-brand-slate-100 hover:bg-brand-slate-200 rounded-xl"
                  >
                    Close Request
                  </button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-brand-slate-700">
            {/* Patient & Request Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-brand-slate-50 border border-brand-slate-200">
              <div>
                <p><span className="text-brand-slate-400">Patient Name:</span> <strong className="text-brand-navy-900">{selectedCallback.patient}</strong></p>
                <p className="mt-1"><span className="text-brand-slate-400">Phone:</span> <strong className="text-brand-navy-900 font-mono">{selectedCallback.phone}</strong></p>
                <p className="mt-1"><span className="text-brand-slate-400">Email:</span> {selectedCallback.email || 'N/A'}</p>
              </div>

              <div>
                <p><span className="text-brand-slate-400">Ayurveda Centre:</span> <strong className="text-brand-navy-900">{selectedCallback.centre}</strong></p>
                <p className="mt-1"><span className="text-brand-slate-400">Target Treatment:</span> <strong className="text-brand-green-700">{selectedCallback.serviceName}</strong></p>
                <p className="mt-1"><span className="text-brand-slate-400">Preferred Timing:</span> {selectedCallback.preferredTime}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-brand-slate-400">Status:</span>
                  <StatusBadge status={selectedCallback.status} size="xs" />
                </div>
              </div>
            </div>

            {/* Patient Initial Inquiry Note */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
              <h4 className="font-bold text-amber-900 text-[11px] uppercase tracking-wider">Patient Enquiry Note</h4>
              <p className="text-amber-800 mt-1 italic">"{selectedCallback.notes}"</p>
            </div>

            {/* Internal Care Coordination Notes Thread */}
            <div className="space-y-2.5 pt-2">
              <h4 className="font-bold text-brand-navy-900 uppercase tracking-wider text-[11px]">
                Internal Coordination Notes & Action Log
              </h4>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {(!selectedCallback.internalNotes || selectedCallback.internalNotes.length === 0) ? (
                  <p className="text-brand-slate-400 italic text-[11px]">No internal notes logged yet.</p>
                ) : (
                  selectedCallback.internalNotes.map((note, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-brand-slate-200 bg-white space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-brand-navy-900">{note.author}</span>
                        <span className="text-brand-slate-400">{note.date}</span>
                      </div>
                      <p className="text-brand-slate-700">{note.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNoteSubmit} className="flex gap-2 pt-2 border-t border-brand-slate-100">
                <input
                  type="text"
                  placeholder="e.g. Patient contacted and requested Panchakarma consultation on Saturday."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 focus:border-brand-green-500"
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-green-700 hover:bg-brand-green-800 rounded-xl transition-colors disabled:opacity-40 shadow-xs"
                >
                  Add Note
                </button>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
