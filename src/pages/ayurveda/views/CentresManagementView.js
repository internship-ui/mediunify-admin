import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  Award,
  Power,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  UserCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  UploadCloud,
  FileText,
  Star
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/forms/FormInput';
import SelectInput from '../../../components/forms/SelectInput';
import ToggleSwitch from '../../../components/forms/ToggleSwitch';

export default function CentresManagementView({
  centres = [],
  onViewCentre,
  onSaveCentre,
  onToggleFeature,
  onToggleStatus,
  onManageServices,
  onManagePractitioners
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [verificationFilter, setVerificationFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [consultFilter, setConsultFilter] = useState('ALL');
  const [therapyFilter, setTherapyFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCentre, setEditingCentre] = useState(null);

  // Form State
  const initialFormState = {
    name: '',
    tagline: '',
    description: '',
    logo: '',
    images: '',
    contactNumber: '',
    email: '',
    website: '',
    address: '',
    city: 'Mysuru',
    state: 'Karnataka',
    pincode: '570012',
    latitude: '12.3168',
    longitude: '76.6345',
    consultationAvailable: true,
    therapyAvailable: true,
    openingTime: '08:00 AM',
    closingTime: '08:00 PM',
    workingDays: 'Monday - Saturday',
    startingPrice: 500,
    verificationStatus: 'Verified',
    status: 'Active',
    ownerName: '',
    ownerPhone: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingCentre(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (ctr) => {
    setEditingCentre(ctr);
    setFormData({
      ...ctr,
      images: Array.isArray(ctr.images) ? ctr.images.join(', ') : ctr.images || ''
    });
    setIsModalOpen(true);
  };

  // Submit Save
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contactNumber || !formData.city) {
      return;
    }

    const payload = {
      ...formData,
      id: editingCentre ? editingCentre.id : `AYU-CTR-${String(Date.now()).slice(-4)}`,
      images: typeof formData.images === 'string'
        ? formData.images.split(',').map((s) => s.trim()).filter(Boolean)
        : formData.images || [],
      startingPrice: Number(formData.startingPrice || 500),
      rating: editingCentre ? editingCentre.rating : 4.8,
      reviewsCount: editingCentre ? editingCentre.reviewsCount : 0,
      submittedDate: editingCentre ? editingCentre.submittedDate : new Date().toISOString().slice(0, 10),
      documents: editingCentre?.documents || [
        { name: 'AYUSH Clinical Establishment Registration', type: 'PDF', date: new Date().toISOString().slice(0, 10), status: formData.verificationStatus, url: '#' }
      ]
    };

    onSaveCentre(payload, Boolean(editingCentre));
    setIsModalOpen(false);
  };

  // Extract unique locations for filter
  const uniqueCities = useMemo(() => {
    return Array.from(new Set(centres.map((c) => c.city).filter(Boolean)));
  }, [centres]);

  // Filtered & Searched Data
  const filteredCentres = useMemo(() => {
    return centres.filter((ctr) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          ctr.name.toLowerCase().includes(q) ||
          ctr.city.toLowerCase().includes(q) ||
          ctr.state.toLowerCase().includes(q) ||
          (ctr.contactNumber && ctr.contactNumber.toLowerCase().includes(q)) ||
          (ctr.address && ctr.address.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Status
      if (statusFilter !== 'ALL' && ctr.status !== statusFilter) return false;

      // Verification
      if (verificationFilter !== 'ALL' && ctr.verificationStatus !== verificationFilter) return false;

      // Location
      if (locationFilter !== 'ALL' && ctr.city !== locationFilter) return false;

      // Consultation
      if (consultFilter === 'YES' && !ctr.consultationAvailable) return false;
      if (consultFilter === 'NO' && ctr.consultationAvailable) return false;

      // Therapy
      if (therapyFilter === 'YES' && !ctr.therapyAvailable) return false;
      if (therapyFilter === 'NO' && ctr.therapyAvailable) return false;

      return true;
    });
  }, [centres, searchTerm, statusFilter, verificationFilter, locationFilter, consultFilter, therapyFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy-900 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-brand-green-700" />
            Ayurveda Centres
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
            Directory of accredited Ayurveda hospitals, clinics, and Panchakarma retreats
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Centre</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-brand-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by centre name, city, contact number or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 focus:border-brand-green-500"
            />
          </div>

          {/* Verification Status Filter */}
          <div>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white text-brand-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 focus:border-brand-green-500 font-medium"
            >
              <option value="ALL">All Verification Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Active Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white text-brand-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 focus:border-brand-green-500 font-medium"
            >
              <option value="ALL">All Active Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-brand-slate-100">
          <div>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-brand-slate-200 bg-brand-slate-50/50 text-brand-slate-700 font-medium"
            >
              <option value="ALL">All Cities ({uniqueCities.length})</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={consultFilter}
              onChange={(e) => setConsultFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-brand-slate-200 bg-brand-slate-50/50 text-brand-slate-700 font-medium"
            >
              <option value="ALL">Consultation: All</option>
              <option value="YES">Consultation Available</option>
              <option value="NO">No Consultation</option>
            </select>
          </div>

          <div>
            <select
              value={therapyFilter}
              onChange={(e) => setTherapyFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-brand-slate-200 bg-brand-slate-50/50 text-brand-slate-700 font-medium"
            >
              <option value="ALL">Therapies: All</option>
              <option value="YES">Therapies Available</option>
              <option value="NO">No Therapies</option>
            </select>
          </div>
        </div>
      </div>

      {/* Centres Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between text-xs text-brand-slate-500">
          <span>Showing <strong className="text-brand-navy-900">{filteredCentres.length}</strong> centres</span>
          {(searchTerm || statusFilter !== 'ALL' || verificationFilter !== 'ALL' || locationFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setVerificationFilter('ALL');
                setLocationFilter('ALL');
                setConsultFilter('ALL');
                setTherapyFilter('ALL');
              }}
              className="text-brand-green-700 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-700">
            <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-4">Centre</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Consultation</th>
                <th className="py-3 px-4">Therapies</th>
                <th className="py-3 px-4">Starting Price</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100 font-medium">
              {filteredCentres.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-brand-slate-400">
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-brand-slate-300" />
                    <p className="font-semibold">No Ayurveda centres found matching criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredCentres.map((ctr) => (
                  <tr key={ctr.id} className="hover:bg-brand-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={ctr.logo || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=100&auto=format&fit=crop&q=80'}
                          alt={ctr.name}
                          className="w-10 h-10 rounded-xl object-cover border border-brand-slate-200 flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-brand-navy-900 text-sm hover:text-brand-green-700 cursor-pointer" onClick={() => onViewCentre(ctr)}>
                              {ctr.name}
                            </span>
                            {ctr.isFeatured && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold" title="Featured Centre">
                                <Award className="w-3 h-3 mr-0.5 text-amber-600" />
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-brand-slate-400 truncate max-w-xs">{ctr.tagline || ctr.description}</p>
                          <p className="text-[11px] text-brand-slate-500 mt-0.5">{ctr.contactNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-brand-navy-900">{ctr.city}</div>
                      <div className="text-[11px] text-brand-slate-400">{ctr.state}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {ctr.consultationAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-green-700 bg-brand-green-50 px-2 py-0.5 rounded-md border border-brand-green-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Available
                        </span>
                      ) : (
                        <span className="text-[11px] text-brand-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {ctr.therapyAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded-md border border-brand-teal-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Available
                        </span>
                      ) : (
                        <span className="text-[11px] text-brand-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-brand-navy-900">
                      ₹{ctr.startingPrice}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-brand-navy-900">{ctr.rating > 0 ? ctr.rating.toFixed(1) : 'New'}</span>
                        {ctr.reviewsCount > 0 && (
                          <span className="text-[10px] text-brand-slate-400">({ctr.reviewsCount})</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={ctr.verificationStatus} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={ctr.status} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onViewCentre(ctr)}
                          className="p-1.5 rounded-lg text-brand-slate-500 hover:text-brand-navy-900 hover:bg-brand-slate-100 transition-colors"
                          title="View Centre Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(ctr)}
                          className="p-1.5 rounded-lg text-brand-slate-500 hover:text-brand-green-700 hover:bg-brand-slate-100 transition-colors"
                          title="Edit Centre Information"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onManageServices && onManageServices(ctr)}
                          className="p-1.5 rounded-lg text-brand-slate-500 hover:text-brand-teal-700 hover:bg-brand-slate-100 transition-colors"
                          title="Manage Centre Services"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onManagePractitioners && onManagePractitioners(ctr)}
                          className="p-1.5 rounded-lg text-brand-slate-500 hover:text-brand-navy-900 hover:bg-brand-slate-100 transition-colors"
                          title="Manage Practitioners"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onToggleFeature && onToggleFeature(ctr)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            ctr.isFeatured
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-brand-slate-400 hover:text-amber-600 hover:bg-brand-slate-100'
                          }`}
                          title={ctr.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                        >
                          <Award className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onToggleStatus && onToggleStatus(ctr)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            ctr.status === 'Active'
                              ? 'text-brand-green-600 hover:text-brand-coral-600 hover:bg-brand-coral-50'
                              : 'text-brand-slate-400 hover:text-brand-green-600 hover:bg-brand-green-50'
                          }`}
                          title={ctr.status === 'Active' ? 'Deactivate Centre' : 'Activate Centre'}
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

      {/* Add / Edit Centre Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCentre ? `Edit Centre: ${editingCentre.name}` : 'Add New Ayurveda Centre'}
        subtitle="Complete institutional registration details, contact numbers, working hours and clinical permits"
        maxWidth="max-w-3xl"
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
              onClick={handleFormSubmit}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-xs"
            >
              {editingCentre ? 'Save Changes' : 'Create Centre'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-400 border-b border-brand-slate-100 pb-1">
              1. Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Centre Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sanjeevani Ayurveda Wellness Centre"
                required
              />
              <FormInput
                label="Tagline / Specialty Title"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. Authentic Traditional Kerala Panchakarma"
              />
            </div>
            <FormInput
              label="Centre Description"
              type="textarea"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe heritage, treatment modalities, and therapy facilities..."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Centre Logo Image URL"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://... image link"
              />
              <FormInput
                label="Facility Photos (Comma-separated URLs)"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                placeholder="https://img1.jpg, https://img2.jpg"
              />
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-400 border-b border-brand-slate-100 pb-1">
              2. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">              <FormInput
                label="Contact Phone Number"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="+91 821 245 8890"
                required
              />
              <FormInput
                label="Official Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@sanjeevaniayur.com"
              />
              <FormInput
                label="Website URL"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.sanjeevaniayur.com"
              />
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-400 border-b border-brand-slate-100 pb-1">
              3. Location & Coordinates
            </h3>
            <FormInput
              label="Street Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Plot 42, Jayalakshmipuram, Near Vani Vilas Water Works"
              required
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <FormInput
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Mysuru"
                required
              />
              <FormInput      
                label="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Karnataka"
                required
              />
              <FormInput
                label="Pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="570012"
              />
              <FormInput
                label="Starting Price (₹)"
                type="number"
                value={formData.startingPrice}
                onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                placeholder="500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Latitude"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="12.3168"
              />
              <FormInput
                label="Longitude"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="76.6345"
              />
            </div>
          </div>

          {/* Section 4: Availability & Working Hours */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-400 border-b border-brand-slate-100 pb-1">
              4. Availability & Working Hours
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-slate-50 p-3.5 rounded-xl border border-brand-slate-200">
              <ToggleSwitch
                label="Consultation Available"
                description="Doctors available for in-person / video pulse assessment"
                checked={formData.consultationAvailable}
                onChange={(val) => setFormData({ ...formData, consultationAvailable: val })}
              />
              <ToggleSwitch
                label="Therapies Available"
                description="Panchakarma & therapy suites operational"
                checked={formData.therapyAvailable}
                onChange={(val) => setFormData({ ...formData, therapyAvailable: val })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormInput
                label="Opening Time"
                value={formData.openingTime}
                onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                placeholder="07:30 AM"
              />
              <FormInput
                label="Closing Time"
                value={formData.closingTime}
                onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                placeholder="08:00 PM"
              />
              <FormInput
                label="Working Days"
                value={formData.workingDays}
                onChange={(e) => setFormData({ ...formData, workingDays: e.target.value })}
                placeholder="Monday - Saturday"
              />
            </div>
          </div>

          {/* Section 5: Verification & Compliance */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-400 border-b border-brand-slate-100 pb-1">
              5. Verification & Compliance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectInput
                label="Verification Status"
                value={formData.verificationStatus}
                onChange={(e) => setFormData({ ...formData, verificationStatus: e.target.value })}
                options={['Verified', 'Pending', 'Under Review', 'Rejected']}
              />
              <SelectInput
                label="Account Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={['Active', 'Inactive']}
              />
            </div>

            {/* Document Upload UI Simulation */}
            <div className="p-4 border-2 border-dashed border-brand-slate-200 rounded-xl text-center space-y-1 bg-brand-slate-50/50 hover:bg-brand-slate-50 transition-colors cursor-pointer">
              <UploadCloud className="w-6 h-6 text-brand-slate-400 mx-auto" />
              <p className="text-xs font-bold text-brand-navy-900">Upload AYUSH / KMC Registration Documents</p>
              <p className="text-[11px] text-brand-slate-400">PDF, JPG, PNG up to 10MB (Frontend dummy interaction)</p>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
