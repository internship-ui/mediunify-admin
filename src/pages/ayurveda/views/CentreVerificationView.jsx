import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
  Search,
  Building2,
  Clock,
  UserCheck,
  ExternalLink,
  MessageSquareQuote,
  Check,
  X,
  RotateCcw
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/forms/FormInput';

export default function CentreVerificationView({
  centres = [],
  services = [],
  practitioners = [],
  onApproveCentre,
  onRejectCentre,
  onRequestChanges
}) {
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected centre for review modal
  const [reviewTarget, setReviewTarget] = useState(null);

  // Sub-modals for Action confirmations
  const [actionType, setActionType] = useState(null); // 'approve' | 'reject' | 'changes'
  const [reasonInput, setReasonInput] = useState('');

  // Filtered by tab
  const filteredCentres = useMemo(() => {
    return centres.filter((ctr) => {
      // Tab matching
      let tabMatch = false;
      if (activeTab === 'Pending') {
        tabMatch = ctr.verificationStatus === 'Pending';
      } else if (activeTab === 'Under Review') {
        tabMatch = ctr.verificationStatus === 'Under Review';
      } else if (activeTab === 'Approved') {
        tabMatch = ctr.verificationStatus === 'Verified';
      } else if (activeTab === 'Rejected') {
        tabMatch = ctr.verificationStatus === 'Rejected';
      }

      if (!tabMatch) return false;

      // Search matching
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          ctr.name.toLowerCase().includes(q) ||
          ctr.city.toLowerCase().includes(q) ||
          (ctr.ownerName && ctr.ownerName.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [centres, activeTab, searchTerm]);

  // Handle open Action confirmation
  const handleOpenAction = (type) => {
    setActionType(type);
    setReasonInput('');
  };

  // Confirm Action
  const handleExecuteAction = () => {
    if (!reviewTarget) return;

    if (actionType === 'approve') {
      onApproveCentre(reviewTarget.id);
      setActionType(null);
      setReviewTarget(null);
    } else if (actionType === 'reject') {
      if (!reasonInput.trim()) return;
      onRejectCentre(reviewTarget.id, reasonInput);
      setActionType(null);
      setReviewTarget(null);
    } else if (actionType === 'changes') {
      if (!reasonInput.trim()) return;
      onRequestChanges(reviewTarget.id, reasonInput);
      setActionType(null);
      setReviewTarget(null);
    }
  };

  // Associated details for review modal
  const reviewServices = useMemo(() => {
    if (!reviewTarget) return [];
    return services.filter((s) => s.centreId === reviewTarget.id || s.centreName === reviewTarget.name);
  }, [reviewTarget, services]);

  const reviewPractitioners = useMemo(() => {
    if (!reviewTarget) return [];
    return practitioners.filter((p) => p.centreId === reviewTarget.id || p.centreName === reviewTarget.name);
  }, [reviewTarget, practitioners]);

  const counts = {
    Pending: centres.filter((c) => c.verificationStatus === 'Pending').length,
    'Under Review': centres.filter((c) => c.verificationStatus === 'Under Review').length,
    Approved: centres.filter((c) => c.verificationStatus === 'Verified').length,
    Rejected: centres.filter((c) => c.verificationStatus === 'Rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy-900 flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-brand-green-700" />
          Ayurveda Centre Verification
        </h1>
        <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
          Verify AYUSH licenses, clinical establishment certificates, and practitioner credentials before listing
        </p>
      </div>

      {/* Verification Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'Pending', label: 'Pending Review', count: counts.Pending, color: 'text-amber-700 bg-amber-50' },
          { id: 'Under Review', label: 'Under Review', count: counts['Under Review'], color: 'text-brand-teal-700 bg-brand-teal-50' },
          { id: 'Approved', label: 'Approved & Active', count: counts.Approved, color: 'text-brand-green-700 bg-brand-green-50' },
          { id: 'Rejected', label: 'Rejected', count: counts.Rejected, color: 'text-brand-coral-700 bg-brand-coral-50' }
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
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-brand-navy-800 text-brand-teal-300' : tab.color}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search submitted centres, owner or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 focus:border-brand-green-500"
          />
        </div>
      </div>

      {/* Verification Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-700">
            <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-4">Centre</th>
                <th className="py-3 px-4">Owner / Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100 font-medium">
              {filteredCentres.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-brand-slate-400">
                    <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-brand-slate-300" />
                    <p className="font-semibold">No centres in {activeTab} verification queue.</p>
                  </td>
                </tr>
              ) : (
                filteredCentres.map((ctr) => (
                  <tr key={ctr.id} className="hover:bg-brand-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={ctr.logo || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=100&auto=format&fit=crop&q=80'}
                          alt={ctr.name}
                          className="w-9 h-9 rounded-xl object-cover border border-brand-slate-200 flex-shrink-0"
                        />
                        <div>
                          <div className="font-bold text-brand-navy-900 text-xs sm:text-sm">{ctr.name}</div>
                          <div className="text-[11px] text-brand-slate-400 truncate max-w-xs">{ctr.tagline || ctr.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-brand-navy-900">{ctr.ownerName || 'Dr. Representative'}</div>
                      <div className="text-[11px] text-brand-slate-400">{ctr.ownerPhone || ctr.contactNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-brand-navy-900">{ctr.city}</div>
                      <div className="text-[11px] text-brand-slate-400">{ctr.state}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-600">
                      {ctr.submittedDate}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-slate-100 text-brand-slate-700 text-[11px] font-bold">
                        <FileText className="w-3.5 h-3.5 text-brand-slate-500" />
                        {ctr.documents?.length || 0} Files
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={ctr.verificationStatus} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setReviewTarget(ctr)}
                        className="px-3.5 py-1.5 text-xs font-bold rounded-xl text-white bg-brand-green-600 hover:bg-brand-green-700 shadow-xs transition-colors"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Centre Verification Review Modal */}
      {reviewTarget && (
        <Modal
          isOpen={true}
          onClose={() => setReviewTarget(null)}
          title={`Verification Review • ${reviewTarget.name}`}
          subtitle={`Submission ID: ${reviewTarget.id} • Submitted on ${reviewTarget.submittedDate}`}
          maxWidth="max-w-4xl"
          footer={
            <div className="flex flex-wrap items-center justify-between w-full gap-3">
              <button
                type="button"
                onClick={() => setReviewTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl"
              >
                Close Window
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAction('changes')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Changes</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAction('reject')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-coral-600 hover:bg-brand-coral-700 rounded-xl transition-colors shadow-xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAction('approve')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl transition-colors shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Centre</span>
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Rejection / Note banner if rejected previously */}
            {reviewTarget.rejectReason && (
              <div className="p-3.5 rounded-xl bg-brand-coral-50 border border-brand-coral-200 text-brand-coral-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-brand-coral-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Previous Rejection Reason:</p>
                  <p className="text-brand-coral-800 mt-0.5">{reviewTarget.rejectReason}</p>
                </div>
              </div>
            )}

            {/* 1. Centre & Contact Information */}
            <div className="p-4 rounded-xl bg-brand-slate-50 border border-brand-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy-900">
                  Institutional Profile & Ownership
                </h3>
                <StatusBadge status={reviewTarget.verificationStatus} size="xs" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div><span className="text-brand-slate-400">Centre Name:</span> <strong className="text-brand-navy-900">{reviewTarget.name}</strong></div>
                <div><span className="text-brand-slate-400">Owner/Physician Lead:</span> <strong className="text-brand-navy-900">{reviewTarget.ownerName || 'Dr. Keshavan Namboothiri'}</strong></div>
                <div><span className="text-brand-slate-400">Contact Number:</span> <span className="text-brand-slate-800">{reviewTarget.contactNumber}</span></div>
                <div><span className="text-brand-slate-400">Official Email:</span> <span className="text-brand-slate-800">{reviewTarget.email || 'N/A'}</span></div>
                <div className="sm:col-span-2"><span className="text-brand-slate-400">Address:</span> <span className="text-brand-slate-800">{reviewTarget.address}, {reviewTarget.city}, {reviewTarget.state} - {reviewTarget.pincode}</span></div>
              </div>
            </div>

            {/* 2. Submitted Legal Documents */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-slate-500">
                Submitted AYUSH & Clinical Documents ({reviewTarget.documents?.length || 0})
              </h3>
              <div className="space-y-2">
                {(!reviewTarget.documents || reviewTarget.documents.length === 0) ? (
                  <p className="text-xs text-brand-slate-400 italic">No verification documents attached.</p>
                ) : (
                  reviewTarget.documents.map((doc, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-brand-slate-200 bg-white flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-green-50 text-brand-green-700 flex items-center justify-center font-bold">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-brand-navy-900">{doc.name}</p>
                          <p className="text-[11px] text-brand-slate-400">{doc.type} • Uploaded {doc.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={doc.status || 'Pending'} size="xs" />
                        <button
                          type="button"
                          onClick={() => alert(`Opening document preview for: ${doc.name}`)}
                          className="px-2.5 py-1 text-[11px] font-bold text-brand-teal-700 bg-brand-teal-50 hover:bg-brand-teal-100 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 3. Listed Services & Practitioners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl border border-brand-slate-200 bg-white space-y-2">
                <h4 className="text-xs font-bold text-brand-navy-900">Services Offered ({reviewServices.length})</h4>
                <div className="max-h-32 overflow-y-auto space-y-1 text-xs text-brand-slate-600 divide-y divide-brand-slate-100">
                  {reviewServices.length === 0 ? (
                    <p className="text-brand-slate-400 italic text-[11px]">No services registered yet.</p>
                  ) : (
                    reviewServices.map((s) => (
                      <div key={s.id} className="pt-1 flex items-center justify-between">
                        <span className="truncate">{s.name}</span>
                        <span className="font-bold text-brand-navy-900">₹{s.startingPrice}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-brand-slate-200 bg-white space-y-2">
                <h4 className="text-xs font-bold text-brand-navy-900">Accredited Doctors ({reviewPractitioners.length})</h4>
                <div className="max-h-32 overflow-y-auto space-y-1 text-xs text-brand-slate-600 divide-y divide-brand-slate-100">
                  {reviewPractitioners.length === 0 ? (
                    <p className="text-brand-slate-400 italic text-[11px]">Primary applicant physician.</p>
                  ) : (
                    reviewPractitioners.map((p) => (
                      <div key={p.id} className="pt-1 flex items-center justify-between">
                        <span className="truncate font-semibold">{p.name}</span>
                        <span className="text-[11px] text-brand-green-700">{p.qualification}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* 4. Verification History Log */}
            <div className="p-3.5 rounded-xl bg-brand-slate-50 border border-brand-slate-200 text-xs space-y-1">
              <h4 className="font-bold text-brand-navy-900 text-[11px] uppercase tracking-wider">Verification Audit Log</h4>
              <p className="text-brand-slate-500">• {reviewTarget.submittedDate} - Centre registration documents submitted by applicant.</p>
              <p className="text-brand-slate-500">• {reviewTarget.submittedDate} - Initial automated compliance checks initialized.</p>
              {reviewTarget.verificationStatus === 'Verified' && (
                <p className="text-brand-green-700 font-semibold">• {reviewTarget.verifiedDate || '2026-02-04'} - Approved by MediUnify AYUSH Operations Committee.</p>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Sub-Modals */}
      {/* 1. Approve Modal */}
      <Modal
        isOpen={actionType === 'approve'}
        onClose={() => setActionType(null)}
        title="Approve Ayurveda Centre?"
        subtitle="This action will verify and publish the centre across the MediUnify Patient Network."
        maxWidth="max-w-md"
        footer={
          <>
            <button
              onClick={() => setActionType(null)}
              className="px-4 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteAction}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-xs"
            >
              Yes, Approve Centre
            </button>
          </>
        }
      >
        <p className="text-xs text-brand-slate-600">
          Are you sure you want to approve <strong>{reviewTarget?.name}</strong>? Its practitioners, services, and booking slots will become live immediately.
        </p>
      </Modal>

      {/* 2. Reject Modal */}
      <Modal
        isOpen={actionType === 'reject'}
        onClose={() => setActionType(null)}
        title="Reject Centre Application"
        subtitle="Please provide a formal reason for rejecting this Ayurveda centre."
        maxWidth="max-w-lg"
        footer={
          <>
            <button
              onClick={() => setActionType(null)}
              className="px-4 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteAction}
              disabled={!reasonInput.trim()}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-coral-600 hover:bg-brand-coral-700 rounded-xl shadow-xs disabled:opacity-50"
            >
              Reject Application
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-brand-slate-600">
            This explanation will be shared with the centre applicant:
          </p>
          <FormInput
            label="Rejection Reason"
            type="textarea"
            rows={3}
            value={reasonInput}
            onChange={(e) => setReasonInput(e.target.value)}
            placeholder="e.g. Expired AYUSH clinical registration or lack of on-site BAMS physician."
            required
          />
        </div>
      </Modal>

      {/* 3. Request Changes Modal */}
      <Modal
        isOpen={actionType === 'changes'}
        onClose={() => setActionType(null)}
        title="Request Application Changes"
        subtitle="Specify what additional documents or revisions are needed."
        maxWidth="max-w-lg"
        footer={
          <>
            <button
              onClick={() => setActionType(null)}
              className="px-4 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteAction}
              disabled={!reasonInput.trim()}
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs disabled:opacity-50"
            >
              Send Remarks to Centre
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-brand-slate-600">
            Provide detailed remarks on what needs to be re-uploaded:
          </p>
          <FormInput
            label="Remarks / Clarifications Required"
            type="textarea"
            rows={3}
            value={reasonInput}
            onChange={(e) => setReasonInput(e.target.value)}
            placeholder="e.g. Please upload clear scan of the current year KMC registration and renewed Fire NOC."
            required
          />
        </div>
      </Modal>
    </div>
  );
}
