import React, { useState } from 'react';
import {
  Bell,
  Search,
  Plus,
  Send,
  Eye,
  RotateCcw,
  CheckCircle2,
  Clock,
  Users,
  Building2,
  ShieldCheck,
  CalendarCheck2
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/forms/FormInput';
import SelectInput from '../../../components/forms/SelectInput';

export const NOTIFICATION_TYPES = [
  'Booking Confirmation',
  'Appointment Reminder',
  'Callback Update',
  'Centre Approval',
  'Centre Rejection',
  'Service Update'
];

export const TARGET_AUDIENCES = [
  'All Ayurveda Patients',
  'All Ayurveda Patients (Mysuru)',
  'All Ayurveda Patients (Bengaluru)',
  'Specific Centre Users',
  'Specific Patient'
];

export default function NotificationsView({
  notifications = [],
  onSendNotification,
  onResendNotification
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [viewingNotif, setViewingNotif] = useState(null);

  const initialForm = {
    title: '',
    message: '',
    type: 'Service Update',
    target: 'All Ayurveda Patients',
    status: 'Sent'
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenCompose = () => {
    setFormData(initialForm);
    setIsComposeOpen(true);
  };

  const handleComposeSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;

    const payload = {
      ...formData,
      id: `NOTIF-AYU-${String(Date.now()).slice(-3)}`,
      createdDate: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    onSendNotification(payload);
    setIsComposeOpen(false);
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (typeFilter !== 'ALL' && notif.type !== typeFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        notif.title.toLowerCase().includes(q) ||
        notif.message.toLowerCase().includes(q) ||
        notif.target.toLowerCase().includes(q) ||
        notif.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy-900 flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-brand-green-700" />
            Ayurveda Notifications
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
            Broadcast patient alerts, booking reminders, compliance updates and seasonal health advisories
          </p>
        </div>

        <button
          onClick={handleOpenCompose}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Broadcast Notification</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search notification title, message content or target..."
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
            <option value="ALL">All Notification Types</option>
            {NOTIFICATION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-700">
            <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-4">Notification Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Target Audience</th>
                <th className="py-3 px-4">Message Snippet</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100 font-medium">
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-brand-slate-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-brand-slate-300" />
                    <p className="font-semibold">No notifications logged.</p>
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((notif) => (
                  <tr key={notif.id} className="hover:bg-brand-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-navy-900 whitespace-nowrap">
                      {notif.title}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-brand-green-800">
                      {notif.type}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-600">
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-brand-slate-100 font-medium">
                        {notif.target}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-brand-slate-500 truncate">
                      {notif.message}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-500">
                      {notif.createdDate}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={notif.status} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setViewingNotif(notif)}
                          className="p-1.5 rounded-lg text-brand-slate-500 hover:text-brand-navy-900 hover:bg-brand-slate-100 transition-colors"
                          title="View Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onResendNotification(notif.id)}
                          className="p-1.5 rounded-lg text-brand-slate-500 hover:text-brand-teal-700 hover:bg-brand-slate-100 transition-colors"
                          title="Resend Notification"
                        >
                          <RotateCcw className="w-4 h-4" />
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

      {/* Compose Notification Modal */}
      <Modal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        title="Broadcast Notification"
        subtitle="Send targeted messages or scheduled seasonal notifications to patients and centres"
        maxWidth="max-w-lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsComposeOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleComposeSubmit}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-xs"
            >
              Dispatch Notification
            </button>
          </>
        }
      >
        <form onSubmit={handleComposeSubmit} className="space-y-4">
          <FormInput
            label="Notification Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Seasonal Varsha Ritu Panchakarma Advisory"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectInput
              label="Notification Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={NOTIFICATION_TYPES}
            />

            <SelectInput
              label="Target Audience"
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              options={TARGET_AUDIENCES}
            />
          </div>

          <FormInput
            label="Message Body"
            type="textarea"
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Enter full notification content to be delivered via Patient Mobile App & SMS..."
            required
          />

          <SelectInput
            label="Dispatch Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={['Sent', 'Scheduled', 'Draft']}
          />
        </form>
      </Modal>

      {/* View Notification Modal */}
      {viewingNotif && (
        <Modal
          isOpen={true}
          onClose={() => setViewingNotif(null)}
          title={viewingNotif.title}
          subtitle={`Type: ${viewingNotif.type} • Target: ${viewingNotif.target}`}
          maxWidth="max-w-md"
          footer={
            <button
              onClick={() => setViewingNotif(null)}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-green-600 rounded-xl"
            >
              Close
            </button>
          }
        >
          <div className="space-y-3 text-xs text-brand-slate-700">
            <div className="p-4 rounded-xl border border-brand-slate-200 bg-brand-slate-50/50 leading-relaxed font-medium">
              {viewingNotif.message}
            </div>
            <div className="flex items-center justify-between text-[11px] text-brand-slate-500 pt-1">
              <span>Dispatched on: {viewingNotif.createdDate}</span>
              <StatusBadge status={viewingNotif.status} size="xs" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
