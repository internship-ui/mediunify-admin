import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Eye,
  Edit3,
  Power,
  Building2,
  Calendar,
  Clock,
  Star,
  Award,
  Filter
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/forms/FormInput';
import SelectInput from '../../../components/forms/SelectInput';

export default function PractitionersView({
  practitioners = [],
  centres = [],
  onSavePractitioner,
  onTogglePractitionerStatus
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [centreFilter, setCentreFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPractitioner, setEditingPractitioner] = useState(null);
  const [viewingPractitioner, setViewingPractitioner] = useState(null);

  const initialFormState = {
    name: '',
    photo: '',
    qualification: 'BAMS, MD (Ayurveda)',
    experience: '10 Years',
    specialization: 'Panchakarma & Spine Disorders',
    centreId: centres[0]?.id || 'AYU-CTR-001',
    centreName: centres[0]?.name || 'Sanjeevani Ayurveda Wellness Centre',
    consultationFee: 500,
    availableDays: 'Monday - Saturday',
    availableTime: '09:00 AM - 01:00 PM, 04:30 PM - 07:30 PM',
    status: 'Active',
    bio: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setEditingPractitioner(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setEditingPractitioner(doc);
    setFormData({ ...doc });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.qualification) return;

    const matchedCentre = centres.find((c) => c.id === formData.centreId);
    const payload = {
      ...formData,
      id: editingPractitioner ? editingPractitioner.id : `AYU-DOC-${String(Date.now()).slice(-4)}`,
      centreName: matchedCentre ? matchedCentre.name : formData.centreName,
      consultationFee: Number(formData.consultationFee || 500),
      rating: editingPractitioner ? editingPractitioner.rating : 4.8
    };

    onSavePractitioner(payload, Boolean(editingPractitioner));
    setIsModalOpen(false);
  };

  // Filtered Practitioners
  const filteredPractitioners = useMemo(() => {
    return practitioners.filter((doc) => {
      // Centre
      if (centreFilter !== 'ALL' && doc.centreId !== centreFilter && doc.centreName !== centreFilter) {
        return false;
      }

      // Status
      if (statusFilter !== 'ALL' && doc.status !== statusFilter) {
        return false;
      }

      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          doc.name.toLowerCase().includes(q) ||
          doc.qualification.toLowerCase().includes(q) ||
          doc.specialization.toLowerCase().includes(q) ||
          (doc.centreName && doc.centreName.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [practitioners, centreFilter, statusFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy-900 flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-brand-green-700" />
            Doctors / Practitioners
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
            Accredited Ayurvedic Vaidyas, Panchakarma physicians, and holistic wellness experts
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Practitioner</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by doctor name, qualification, specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 focus:border-brand-green-500"
          />
        </div>

        <div>
          <select
            value={centreFilter}
            onChange={(e) => setCentreFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white text-brand-slate-700 font-medium"
          >
            <option value="ALL">All Associated Centres</option>
            {centres.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white text-brand-slate-700 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Practitioners Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between text-xs text-brand-slate-500">
          <span>Showing <strong className="text-brand-navy-900">{filteredPractitioners.length}</strong> practitioners</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-700">
            <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-4">Practitioner</th>
                <th className="py-3 px-4">Qualification</th>
                <th className="py-3 px-4">Specialization</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Centre</th>
                <th className="py-3 px-4">Fee (₹)</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100 font-medium">
              {filteredPractitioners.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-brand-slate-400">
                    <UserCheck className="w-8 h-8 mx-auto mb-2 text-brand-slate-300" />
                    <p className="font-semibold">No practitioners found.</p>
                  </td>
                </tr>
              ) : (
                filteredPractitioners.map((doc) => (
                  <tr key={doc.id} className="hover:bg-brand-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80'}
                          alt={doc.name}
                          className="w-10 h-10 rounded-xl object-cover border border-brand-slate-200 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-brand-navy-900 text-xs sm:text-sm">{doc.name}</p>
                          <div className="flex items-center gap-1 text-[11px] text-amber-600">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{doc.rating || 4.8}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-brand-green-700 whitespace-nowrap">
                      {doc.qualification}
                    </td>
                    <td className="py-3.5 px-4 text-brand-navy-900 max-w-[170px] truncate">
                      {doc.specialization}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-600">
                      {doc.experience}
                    </td>
                    <td className="py-3.5 px-4 max-w-[160px] truncate text-brand-slate-600">
                      {doc.centreName}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-extrabold text-brand-navy-900">
                      ₹{doc.consultationFee}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-600">
                      <div>{doc.availableDays}</div>
                      <div className="text-[10px] text-brand-slate-400">{doc.availableTime}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={doc.status} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setViewingPractitioner(doc)}
                          className="p-1.5 rounded-lg text-brand-slate-500 hover:text-brand-navy-900 hover:bg-brand-slate-100 transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(doc)}
                          className="p-1.5 rounded-lg text-brand-slate-500 hover:text-brand-green-700 hover:bg-brand-slate-100 transition-colors"
                          title="Edit Practitioner"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onTogglePractitionerStatus && onTogglePractitionerStatus(doc)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            doc.status === 'Active'
                              ? 'text-brand-green-600 hover:text-brand-coral-600 hover:bg-brand-coral-50'
                              : 'text-brand-slate-400 hover:text-brand-green-600 hover:bg-brand-green-50'
                          }`}
                          title={doc.status === 'Active' ? 'Deactivate Doctor' : 'Activate Doctor'}
                        >
                          <Power className="w-4 h-4" />
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

      {/* Add / Edit Practitioner Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPractitioner ? `Edit Doctor: ${editingPractitioner.name}` : 'Add New Doctor / Practitioner'}
        subtitle="Specify qualification degrees, clinic affiliation, consultation fees and available timings"
        maxWidth="max-w-2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-xs"
            >
              {editingPractitioner ? 'Save Changes' : 'Create Practitioner'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Doctor / Vaidya Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Keshavan Namboothiri"
              required
            />
            <FormInput
              label="Qualification Degrees"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              placeholder="e.g. BAMS, MD (Ayurveda - Panchakarma)"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g. Panchakarma & Chronic Spine Disorders"
              required
            />
            <FormInput
              label="Clinical Experience"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="e.g. 18 Years"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy-900 mb-1.5">
                Affiliated Centre
              </label>
              <select
                value={formData.centreId}
                onChange={(e) => {
                  const cId = e.target.value;
                  const cObj = centres.find((c) => c.id === cId);
                  setFormData({
                    ...formData,
                    centreId: cId,
                    centreName: cObj ? cObj.name : formData.centreName
                  });
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white font-medium"
              >
                {centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>

            <FormInput
              label="Consultation Fee (₹)"
              type="number"
              value={formData.consultationFee}
              onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
              placeholder="500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Available Days"
              value={formData.availableDays}
              onChange={(e) => setFormData({ ...formData, availableDays: e.target.value })}
              placeholder="Mon, Tue, Wed, Thu, Fri, Sat"
            />
            <FormInput
              label="Available Time Slots"
              value={formData.availableTime}
              onChange={(e) => setFormData({ ...formData, availableTime: e.target.value })}
              placeholder="09:00 AM - 01:00 PM, 04:30 PM - 07:30 PM"
            />
          </div>

          <FormInput
            label="Doctor Photo URL"
            value={formData.photo}
            onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
            placeholder="https://... profile photo"
          />

          <FormInput
            label="Professional Bio & Clinical Background"
            type="textarea"
            rows={2}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Describe traditional lineage, clinical achievements, and treatment focus..."
          />

          <SelectInput
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={['Active', 'Inactive']}
          />
        </form>
      </Modal>

      {/* View Practitioner Profile Modal */}
      {viewingPractitioner && (
        <Modal
          isOpen={true}
          onClose={() => setViewingPractitioner(null)}
          title={viewingPractitioner.name}
          subtitle={`${viewingPractitioner.qualification} • ${viewingPractitioner.centreName}`}
          maxWidth="max-w-md"
          footer={
            <button
              onClick={() => setViewingPractitioner(null)}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-green-600 rounded-xl"
            >
              Close
            </button>
          }
        >
          <div className="space-y-4 text-xs text-brand-slate-700">
            <div className="flex items-center gap-4">
              <img
                src={viewingPractitioner.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}
                alt={viewingPractitioner.name}
                className="w-16 h-16 rounded-2xl object-cover border border-brand-slate-200"
              />
              <div>
                <h3 className="font-extrabold text-brand-navy-900 text-sm">{viewingPractitioner.name}</h3>
                <p className="text-brand-green-700 font-bold">{viewingPractitioner.qualification}</p>
                <p className="text-brand-slate-400 mt-0.5">{viewingPractitioner.experience} Clinical Practice</p>
              </div>
            </div>

            <p className="leading-relaxed text-brand-slate-600 bg-brand-slate-50 p-3 rounded-xl border border-brand-slate-200">
              {viewingPractitioner.bio || 'Experienced classical Ayurvedic physician specializing in comprehensive dosha analysis and personalized wellness regimens.'}
            </p>

            <div className="p-3.5 rounded-xl border border-brand-slate-200 space-y-2">
              <p><span className="text-brand-slate-400">Specialization:</span> <strong className="text-brand-navy-900">{viewingPractitioner.specialization}</strong></p>
              <p><span className="text-brand-slate-400">Centre:</span> <strong className="text-brand-navy-900">{viewingPractitioner.centreName}</strong></p>
              <p><span className="text-brand-slate-400">Consultation Fee:</span> <strong className="text-brand-green-700 text-sm">₹{viewingPractitioner.consultationFee}</strong></p>
              <p><span className="text-brand-slate-400">Available Days:</span> <span>{viewingPractitioner.availableDays}</span></p>
              <p><span className="text-brand-slate-400">Timings:</span> <span>{viewingPractitioner.availableTime}</span></p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
