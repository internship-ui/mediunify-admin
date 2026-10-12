import React, { useState, useMemo } from 'react';
import {
  CalendarCheck2,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Building2,
  Sparkles,
  UserCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/forms/FormInput';

export default function BookingsView({
  bookings = [],
  onUpdateBookingStatus,
  onRescheduleBooking
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });

  // Counts by tab
  const counts = {
    All: bookings.length,
    Pending: bookings.filter((b) => b.status === 'Pending').length,
    Confirmed: bookings.filter((b) => b.status === 'Confirmed').length,
    Completed: bookings.filter((b) => b.status === 'Completed').length,
    Cancelled: bookings.filter((b) => b.status === 'Cancelled').length
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Tab matching
      if (activeTab !== 'All' && b.status !== activeTab) {
        return false;
      }

      // Type matching
      if (typeFilter !== 'ALL' && b.bookingType !== typeFilter) {
        return false;
      }

      // Search matching
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          b.id.toLowerCase().includes(q) ||
          b.patient.toLowerCase().includes(q) ||
          b.centre.toLowerCase().includes(q) ||
          b.service.toLowerCase().includes(q) ||
          (b.practitioner && b.practitioner.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [bookings, activeTab, typeFilter, searchTerm]);

  const handleOpenReschedule = (b) => {
    setSelectedBooking(b);
    setRescheduleData({ date: b.date, time: b.time });
    setIsRescheduleOpen(true);
  };

  const handleSaveReschedule = (e) => {
    e.preventDefault();
    if (!rescheduleData.date || !rescheduleData.time) return;
    onRescheduleBooking(selectedBooking.id, rescheduleData.date, rescheduleData.time);
    setIsRescheduleOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy-900 flex items-center gap-2.5">
            <CalendarCheck2 className="w-6 h-6 text-brand-green-700" />
            Ayurveda Bookings
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
            Phase-1 Direct Patient Bookings & Callback Slot Reservations
          </p>
        </div>
      </div>

      {/* Booking Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-slate-200 overflow-x-auto pb-1">
        {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-brand-navy-900 text-white shadow-sm'
                  : 'text-brand-slate-600 hover:text-brand-navy-900 hover:bg-brand-slate-100'
              }`}
            >
              <span>{tab} Bookings</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-brand-navy-800 text-brand-teal-300' : 'bg-brand-slate-100 text-brand-slate-600'}`}>
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Booking Type Filter */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by booking ID, patient name, centre or treatment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 focus:border-brand-green-500"
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white text-brand-slate-700 font-medium"
          >
            <option value="ALL">All Booking Types</option>
            <option value="Direct Booking">Direct Booking</option>
            <option value="Callback">Callback</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between text-xs text-brand-slate-500">
          <span>Showing <strong className="text-brand-navy-900">{filteredBookings.length}</strong> bookings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-700">
            <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Centre</th>
                <th className="py-3 px-4">Practitioner</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100 font-medium">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-brand-slate-400">
                    <CalendarCheck2 className="w-8 h-8 mx-auto mb-2 text-brand-slate-300" />
                    <p className="font-semibold">No bookings found in this view.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-brand-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-extrabold text-brand-navy-900">{b.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-brand-navy-900">
                      <div>{b.patient}</div>
                      <div className="text-[11px] text-brand-slate-400 font-normal">{b.patientPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-[150px] truncate text-brand-slate-700">{b.centre}</td>
                    <td className="py-3.5 px-4 max-w-[140px] truncate text-brand-slate-600">{b.practitioner}</td>
                    <td className="py-3.5 px-4 max-w-[160px] truncate text-brand-slate-800">{b.service}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                        b.bookingType === 'Direct Booking'
                          ? 'bg-brand-teal-50 text-brand-teal-800 border-brand-teal-200'
                          : 'bg-brand-coral-50 text-brand-coral-800 border-brand-coral-200'
                      }`}>
                        {b.bookingType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-700">
                      <div>{b.date}</div>
                      <div className="text-[11px] text-brand-slate-400">{b.time}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={b.status} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-1.5 rounded-lg text-brand-slate-500 hover:text-brand-navy-900 hover:bg-brand-slate-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {b.status === 'Pending' && (
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'Confirmed')}
                            className="p-1.5 rounded-lg text-brand-green-600 hover:bg-brand-green-50 transition-colors"
                            title="Confirm Booking"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'Completed')}
                            className="p-1.5 rounded-lg text-brand-teal-600 hover:bg-brand-teal-50 transition-colors"
                            title="Mark Completed"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {b.status !== 'Completed' && b.status !== 'Cancelled' && (
                          <>
                            <button
                              onClick={() => handleOpenReschedule(b)}
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Reschedule Booking"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'Cancelled')}
                              className="p-1.5 rounded-lg text-brand-coral-500 hover:bg-brand-coral-50 transition-colors"
                              title="Cancel Booking"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBooking(null)}
          title={`Booking Details • ${selectedBooking.id}`}
          subtitle={`Created on ${selectedBooking.createdDate} • Type: ${selectedBooking.bookingType}`}
          maxWidth="max-w-lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {selectedBooking.status === 'Pending' && (
                  <button
                    onClick={() => {
                      onUpdateBookingStatus(selectedBooking.id, 'Confirmed');
                      setSelectedBooking({ ...selectedBooking, status: 'Confirmed' });
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-xs"
                  >
                    Confirm Slot
                  </button>
                )}
                {selectedBooking.status === 'Confirmed' && (
                  <button
                    onClick={() => {
                      onUpdateBookingStatus(selectedBooking.id, 'Completed');
                      setSelectedBooking({ ...selectedBooking, status: 'Completed' });
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-xs"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-brand-slate-700">
            {/* Patient Info */}
            <div className="p-3.5 rounded-xl bg-brand-slate-50 border border-brand-slate-200 space-y-1.5">
              <h3 className="font-bold text-brand-navy-900 uppercase tracking-wider text-[11px]">Patient Details</h3>
              <p><span className="text-brand-slate-400">Name:</span> <strong className="text-brand-navy-900">{selectedBooking.patient}</strong></p>
              <p><span className="text-brand-slate-400">Phone:</span> {selectedBooking.patientPhone}</p>
              <p><span className="text-brand-slate-400">Email:</span> {selectedBooking.patientEmail || 'N/A'}</p>
            </div>

            {/* Treatment & Centre */}
            <div className="p-3.5 rounded-xl border border-brand-slate-200 space-y-1.5">
              <h3 className="font-bold text-brand-navy-900 uppercase tracking-wider text-[11px]">Treatment & Centre</h3>
              <p><span className="text-brand-slate-400">Ayurveda Centre:</span> <strong className="text-brand-navy-900">{selectedBooking.centre}</strong></p>
              <p><span className="text-brand-slate-400">Therapy / Service:</span> <strong className="text-brand-green-700">{selectedBooking.service}</strong></p>
              <p><span className="text-brand-slate-400">Assigned Vaidya:</span> {selectedBooking.practitioner}</p>
              <p><span className="text-brand-slate-400">Scheduled Date & Time:</span> <strong className="text-brand-navy-900">{selectedBooking.date} at {selectedBooking.time}</strong></p>
              <div className="pt-1 flex items-center gap-2">
                <span className="text-brand-slate-400">Status:</span>
                <StatusBadge status={selectedBooking.status} size="xs" />
              </div>
            </div>

            {/* Notes */}
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1">
              <h4 className="font-bold text-amber-900 text-[11px] uppercase tracking-wider">Patient Clinical Notes</h4>
              <p className="text-amber-800">{selectedBooking.notes || 'No specific clinical notes provided.'}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Reschedule Modal */}
      <Modal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        title={`Reschedule Booking • ${selectedBooking?.id}`}
        subtitle="Select a revised appointment date and time slot"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsRescheduleOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveReschedule}
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
            >
              Update Slot
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveReschedule} className="space-y-4">
          <FormInput
            label="New Appointment Date"
            type="date"
            value={rescheduleData.date}
            onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
            required
          />
          <FormInput
            label="New Time Slot"
            value={rescheduleData.time}
            onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
            placeholder="e.g. 11:30 AM"
            required
          />
        </form>
      </Modal>
    </div>
  );
}
