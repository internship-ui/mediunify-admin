import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Search,
  Filter,
  Send,
  Users,
  User,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  FileText
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function NotificationsView({
  notifications = [],
  onSendNotification
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Rental Confirmation & Vendor Dispatch Notice',
    message: '',
    target: 'All Equipment Rental Users',
    type: 'Rental Confirmation',
    status: 'Sent'
  });

  const filteredNotifications = notifications.filter((n) => {
    return (
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.target?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;

    if (onSendNotification) {
      onSendNotification({
        ...formData,
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        createdDate: 'Just Now'
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-brand-teal-600" />
            Equipment Rental Push Notifications & Broadcasts
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Dispatch automated operational alerts, delivery ETA updates, and SLA reminders to patients and vendors.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-teal-600 text-white rounded-xl hover:bg-brand-teal-700 text-sm font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Broadcast
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notification title, target, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500"
          />
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5">Notification Title</th>
                <th className="px-5 py-3.5">Message Content</th>
                <th className="px-5 py-3.5">Target Audience</th>
                <th className="px-5 py-3.5">Delivery Status</th>
                <th className="px-5 py-3.5">Sent Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-normal">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
                        <span>{n.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600 max-w-md">
                      <p className="line-clamp-2">{n.message}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {n.target?.includes('Vendor') ? <Building2 className="w-3 h-3 text-brand-navy-700" /> : <Users className="w-3 h-3 text-brand-teal-700" />}
                        <span>{n.target}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {n.status || 'Sent'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">
                      {n.createdDate || 'Today, 10:15 AM'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                    <Bell className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-base font-semibold text-gray-700">No notifications sent</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-brand-teal-600" />
                Dispatch Operational Notification
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notification Event / Template</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-gray-200"
                >
                  <option value="Rental Confirmation">Rental Confirmation</option>
                  <option value="Delivery Update & ETA">Delivery Update & ETA</option>
                  <option value="Installation Appointment">Installation Appointment</option>
                  <option value="Rental Extension Approval">Rental Extension Approval</option>
                  <option value="Pickup Window Scheduled">Pickup Window Scheduled</option>
                  <option value="Return Inspection Completed">Return Inspection Completed</option>
                  <option value="Vendor Verification Approved">Vendor Verification Approved</option>
                  <option value="Vendor Compliance Alert">Vendor Compliance Alert</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Target Audience</label>
                <select
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-gray-200"
                >
                  <option value="All Equipment Rental Users">All Equipment Rental Users</option>
                  <option value="Specific Patient (Active Rental)">Specific Patient (Active Rental)</option>
                  <option value="Specific Vendor Partner">Specific Vendor Partner</option>
                  <option value="All Verified Vendors">All Verified Vendors</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notification Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-gray-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Message Body *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter alert message details, dates, or logistical contact..."
                  className="w-full p-2.5 rounded-lg border border-gray-200"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white rounded-xl font-bold shadow-sm inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
