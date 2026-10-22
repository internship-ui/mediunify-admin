import React, { useState, useMemo, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Phone,
  User,
  MapPin,
  Calendar,
  UserCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Sparkles,
  Info,
  XCircle,
  Activity,
  HeartHandshake,
  CreditCard,
  Send,
  ShieldCheck,
  Edit2,
  Copy,
  Receipt,
  AlertCircle,
  Compass,
  ArrowRight
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import NearbyNursesMapModal from '../components/NearbyNursesMapModal';
import NurseContactModal from '../components/NurseContactModal';

// Haversine distance calculator
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export default function ServiceRequestsView({
  requests = [],
  nurses = [],
  initialTab = 'All',
  onAcceptRequest,
  onPushPaymentLink,
  onSimulatePayment,
  onConfirmService,
  onAssignNurse,
  onConfirmNurseAvailability,
  selectedRequestId,
  onSelectRequest
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'All');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRequestDetail, setActiveRequestDetail] = useState(
    selectedRequestId ? requests.find((r) => r.id === selectedRequestId) : null
  );

  // Per-row nurse selection state: { [requestId]: nurseId }
  const [rowSelectedNurse, setRowSelectedNurse] = useState({});
  // Per-row price state: { [requestId]: number }
  const [rowPrice, setRowPrice] = useState({});
  // Per-row editing state
  const [rowEditing, setRowEditing] = useState({});

  // Details panel state
  const [detailSelectedNurseId, setDetailSelectedNurseId] = useState('');
  const [detailPrice, setDetailPrice] = useState(750);
  const [copiedId, setCopiedId] = useState(null);

  // Modals state
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedNurseForContact, setSelectedNurseForContact] = useState(null);

  // Keep activeRequestDetail updated when requests change in parent
  const currentRequest = useMemo(() => {
    if (!activeRequestDetail) return null;
    return requests.find((r) => r.id === activeRequestDetail.id) || activeRequestDetail;
  }, [requests, activeRequestDetail]);

  const tabs = [
    'All',
    'New',
    'Payment Link Sent',
    'Payment Completed',
    'Nurse Assigned',
    'Scheduled',
    'In Progress',
    'Completed'
  ];

  const filteredRequests = requests.filter((req) => {
    let matchesTab = false;
    const reqStatus = req.status || '';

    if (activeTab === 'All') {
      matchesTab = true;
    } else if (activeTab === 'New') {
      matchesTab = reqStatus === 'New' || reqStatus === 'New Request' || reqStatus === 'Accepted' || Boolean(rowEditing[req.id]);
    } else if (activeTab === 'Payment Link Sent') {
      matchesTab = reqStatus === 'Payment Link Sent' || reqStatus === 'Nurse Contacted' || reqStatus === 'Nurse Confirmed' || reqStatus === 'Payment Pending';
    } else if (activeTab === 'Payment Completed') {
      matchesTab = reqStatus === 'Payment Completed' || reqStatus === 'Payment Successful' || req.paymentStatus === 'Payment Successful' || req.paymentStatus === 'Paid';
    } else if (activeTab === 'Nurse Assigned') {
      matchesTab = reqStatus === 'Nurse Assigned' || reqStatus === 'Confirmed';
    } else {
      matchesTab = reqStatus === activeTab;
    }

    const matchesSearch =
      (req.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.serviceRequired || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.specializationRequired || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.patientLocation || req.location || req.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.assignedNurse?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.candidateNurse?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.contactNumber || req.patientPhone || '').includes(searchQuery);

    return matchesTab && matchesSearch;
  });

  const handleOpenDetail = (req) => {
    setActiveRequestDetail(req);
    const candidateId = req.candidateNurse?.id || req.assignedNurse?.id || nurses[0]?.id || '';
    setDetailSelectedNurseId(candidateId);
    setDetailPrice(req.price || 750);
    if (onSelectRequest) onSelectRequest(req.id);
  };

  // Nearby nurses calculated for active request
  const nearbyNursesForCurrent = useMemo(() => {
    if (!currentRequest) return [];
    const pLat = currentRequest.lat || 12.3225;
    const pLng = currentRequest.lng || 76.6265;

    return nurses.map((n) => {
      const dist = calculateDistanceKm(n.lat, n.lng, pLat, pLng);
      return {
        ...n,
        distanceKm: dist
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [currentRequest, nurses]);

  // Inline Row Handlers
  const handleAccept = (reqId) => {
    if (onAcceptRequest) {
      onAcceptRequest(reqId);
    }
    setRowEditing((prev) => ({ ...prev, [reqId]: true }));
    const req = requests.find((r) => r.id === reqId);
    if (req) {
      setRowPrice((prev) => ({ ...prev, [reqId]: prev[reqId] || req.price || 750 }));
      setRowSelectedNurse((prev) => ({ ...prev, [reqId]: prev[reqId] || req.candidateNurse?.id || nurses[0]?.id }));
    }
  };

  const handlePushLink = (reqId, customPrice, customNurseId) => {
    const price = customPrice !== undefined ? Number(customPrice) : Number(rowPrice[reqId] || 750);
    const nurseId = customNurseId || rowSelectedNurse[reqId] || nurses[0]?.id;

    if (onPushPaymentLink) {
      onPushPaymentLink(reqId, price, nurseId);
    }
    setRowEditing((prev) => ({ ...prev, [reqId]: false }));
  };

  const handleCopyPaymentLink = (reqId) => {
    const url = `https://pay.mediunify.care/hc/${reqId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedId(reqId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSimulatePaymentAction = (reqId) => {
    if (onSimulatePayment) {
      onSimulatePayment(reqId);
    }
  };

  const handleConfirmServiceAction = (reqId, customNurseId) => {
    const nurseId = customNurseId || rowSelectedNurse[reqId] || nurses[0]?.id;
    if (onConfirmService) {
      onConfirmService(reqId, nurseId);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <ClipboardList className="w-7 h-7 text-brand-green-700" />
              Home Care Service Requests
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-green-100 text-brand-green-800 border border-brand-green-200">
              {requests.length} Total Inquiries
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Accept requests, select candidate nurse from dropdown, push payment link, simulate payment, and confirm service.
          </p>
        </div>
      </div>

      {/* 2. Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            let count = 0;
            if (tab === 'All') {
              count = requests.length;
            } else if (tab === 'New') {
              count = requests.filter((r) => r.status === 'New' || r.status === 'New Request' || r.status === 'Accepted').length;
            } else if (tab === 'Payment Link Sent') {
              count = requests.filter((r) => r.status === 'Payment Link Sent' || r.status === 'Nurse Contacted' || r.status === 'Nurse Confirmed' || r.status === 'Payment Pending').length;
            } else if (tab === 'Payment Completed') {
              count = requests.filter((r) => r.status === 'Payment Completed' || r.status === 'Payment Successful' || r.paymentStatus === 'Payment Successful' || r.paymentStatus === 'Paid').length;
            } else if (tab === 'Nurse Assigned') {
              count = requests.filter((r) => r.status === 'Nurse Assigned' || r.status === 'Confirmed').length;
            } else {
              count = requests.filter((r) => r.status === tab).length;
            }

            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-brand-green-700 text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search request ID, patient name, phone, service required, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 text-gray-900"
          />
        </div>
      </div>

      {/* 3. MAIN SERVICE REQUESTS TABLE (WITH INLINE DROPDOWN & PAYMENT CONTROLS) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Request ID</th>
                <th className="p-3.5">Patient Details</th>
                <th className="p-3.5">Service Required</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Preferred Schedule</th>
                <th className="p-3.5">Fee (₹)</th>
                <th className="p-3.5">Assigned / Candidate Nurse</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((req) => {
                const isNew = req.status === 'New' || req.status === 'New Request';
                const isAcceptedOrEditing = req.status === 'Accepted' || rowEditing[req.id];
                const isLinkSent = req.status === 'Payment Link Sent' || req.status === 'Nurse Confirmed' || (req.status === 'Payment Pending' && !isAcceptedOrEditing);
                const isPaymentDone = req.status === 'Payment Completed' || req.status === 'Payment Successful' || req.paymentStatus === 'Payment Successful' || req.paymentStatus === 'Paid';
                const isConfirmed = req.status === 'Nurse Assigned' || req.status === 'Confirmed' || req.status === 'Completed';

                const currentPrice = rowPrice[req.id] !== undefined ? rowPrice[req.id] : req.price || 750;
                const selectedNurseId = rowSelectedNurse[req.id] || req.confirmedNurses?.[0]?.nurseId || req.candidateNurse?.id || req.assignedNurse?.id || nurses[0]?.id;

                return (
                  <tr key={req.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-gray-900">
                      #{req.id}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-gray-900 text-xs sm:text-sm block">{req.patientName}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-brand-green-800 bg-brand-green-50 px-2 py-0.5 rounded-md border border-brand-green-200 inline-block">
                        {req.serviceRequired}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-700">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                        <span className="truncate max-w-[150px]">{req.patientLocation || req.location || req.address}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-medium text-gray-800">
                      <div>{req.preferredDate || req.requestedDate || '26 Sep 2026'}</div>
                      <div className="text-gray-400 text-[11px]">{req.preferredTime || req.requestedTime || '10:00 AM'}</div>
                    </td>
                    <td className="p-3.5 font-mono font-black text-gray-900 text-xs">
                      ₹{req.price || 750}
                    </td>
                    <td className="p-3.5">
                      {req.assignedNurse ? (
                        <div className="flex items-center gap-1.5 text-brand-green-800 font-bold">
                          <UserCheck className="w-3.5 h-3.5 text-brand-green-700 flex-shrink-0" />
                          <span>{req.assignedNurse.name}</span>
                        </div>
                      ) : req.candidateNurse ? (
                        <div className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                          <span className="px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200">Candidate:</span>
                          <span>{req.candidateNurse.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={req.status} size="xs" />
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1. New -> Accept */}
                        {isNew && !isAcceptedOrEditing && (
                          <button
                            onClick={() => handleAccept(req.id)}
                            className="px-2.5 py-1 text-xs font-bold rounded-xl bg-brand-green-50 text-brand-green-800 hover:bg-brand-green-100 border border-brand-green-200 transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept & Set Fee</span>
                          </button>
                        )}

                        {/* 2. Accepted / Editing -> Price Input + Push Payment Link (No Nurse Dropdown Before Payment) */}
                        {isAcceptedOrEditing && (
                          <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-200">
                            <input
                              type="number"
                              value={currentPrice}
                              onChange={(e) => setRowPrice({ ...rowPrice, [req.id]: e.target.value })}
                              placeholder="₹ Fee"
                              className="w-20 px-2 py-1 text-xs border border-gray-300 rounded-lg font-mono font-bold bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-green-500"
                            />
                            <button
                              onClick={() => handlePushLink(req.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
                              title="Push amount & payment link to patient mobile"
                            >
                              <Send className="w-3 h-3" />
                              <span>Push Payment Link</span>
                            </button>
                          </div>
                        )}

                        {/* 3. Payment Link Sent -> Copy Link + Simulate Payment */}
                        {isLinkSent && !isPaymentDone && !isConfirmed && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleCopyPaymentLink(req.id)}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition-colors"
                              title="Copy Online Payment URL"
                            >
                              {copiedId === req.id ? (
                                <Check className="w-3.5 h-3.5 text-brand-green-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleSimulatePaymentAction(req.id)}
                              className="px-2.5 py-1 rounded-lg bg-brand-green-700 hover:bg-brand-green-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
                              title="Simulate patient completing online payment"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Simulate Patient Payment</span>
                            </button>
                          </div>
                        )}

                        {/* 4. Payment Completed / Successful -> Available Nurse Dropdown + Confirm Service & Assign */}
                        {isPaymentDone && !isConfirmed && (
                          <div className="flex items-center gap-1.5 bg-emerald-50/80 p-1 rounded-xl border border-emerald-300">
                            <select
                              value={selectedNurseId}
                              onChange={(e) => setRowSelectedNurse({ ...rowSelectedNurse, [req.id]: e.target.value })}
                              className="px-2 py-1 text-xs border border-emerald-300 rounded-lg bg-white max-w-[155px] font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-brand-green-500"
                              title="Select Available Nurse to Assign"
                            >
                              <option value="" disabled>-- Select Nurse --</option>
                              {nurses.map((n) => (
                                <option key={n.id} value={n.id}>
                                  {n.name} ({n.specialization}) {n.status === 'Available' ? '✓ Available' : ''}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleConfirmServiceAction(req.id, selectedNurseId)}
                              className="px-3 py-1 rounded-lg bg-brand-green-700 hover:bg-brand-green-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 flex-shrink-0"
                              title="Confirm Service after online payment verified"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Confirm Service & Assign</span>
                            </button>
                          </div>
                        )}

                        {/* Map Button */}
                        <button
                          onClick={() => {
                            handleOpenDetail(req);
                            setIsMapModalOpen(true);
                          }}
                          className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
                          title="Open Google Maps Nearby View"
                        >
                          <Compass className="w-3.5 h-3.5 text-blue-600" />
                          <span>Map</span>
                        </button>

                        {/* Details Button */}
                        <button
                          onClick={() => handleOpenDetail(req)}
                          className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-gray-400">
                    <ClipboardList className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-bold text-gray-700">No requests found</p>
                    <p className="text-xs text-gray-400 mt-1">Try switching tabs or adjusting search query.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. DEDICATED SLIDE-OUT / MODAL REQUEST DETAILS VIEW */}
      {currentRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-3xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-slide-up">
            {/* Modal Top Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-brand-slate-900 via-brand-navy-950 to-brand-green-950 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-green-500/20 border border-brand-green-400/30 flex items-center justify-center text-brand-green-400 font-bold">
                  #{currentRequest.id}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-white">Home Care Request Details</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {currentRequest.status}
                    </span>
                  </div>
                  <p className="text-xs text-brand-slate-300 mt-0.5">
                    Patient: {currentRequest.patientName} • Service: {currentRequest.serviceRequired}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveRequestDetail(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-700 flex-1">
              {/* 3-STEP ONLINE PAYMENT FLOW PROGRESS BANNER */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-green-50 via-teal-50 to-emerald-50 border border-brand-green-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-brand-green-900 block">
                    Online Payment & Assignment Sequence
                  </span>
                  <span className="text-[10px] font-bold text-gray-500">
                    Step {
                      currentRequest.status === 'New' || currentRequest.status === 'New Request' || currentRequest.status === 'Accepted' ? '1 of 3: Set Fee & Push Link' :
                      currentRequest.status === 'Payment Link Sent' || currentRequest.status === 'Nurse Confirmed' || currentRequest.status === 'Payment Pending' ? '2 of 3: Patient Online Payment' :
                      '3 of 3: Confirmed & Dispatched'
                    }
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div
                    className={`p-2 rounded-xl border text-center ${
                      currentRequest.status === 'New' || currentRequest.status === 'New Request' || currentRequest.status === 'Accepted'
                        ? 'bg-white border-brand-green-600 font-bold text-brand-green-900 ring-2 ring-brand-green-100'
                        : 'bg-brand-green-100/60 border-brand-green-200 text-brand-green-800 font-semibold'
                    }`}
                  >
                    <span className="text-[10px] block font-extrabold">1. Push Payment Link</span>
                    <span>Set Fee & Send</span>
                  </div>
                  <div
                    className={`p-2 rounded-xl border text-center ${
                      currentRequest.status === 'Payment Link Sent' || currentRequest.status === 'Nurse Confirmed' || currentRequest.status === 'Payment Pending'
                        ? 'bg-white border-amber-400 font-bold text-amber-900 ring-2 ring-amber-100'
                        : currentRequest.paymentStatus === 'Payment Successful' || currentRequest.paymentStatus === 'Paid' || currentRequest.status === 'Payment Completed' || currentRequest.status === 'Confirmed'
                        ? 'bg-brand-green-100 border-brand-green-200 text-brand-green-900 font-bold'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <span className="text-[10px] block font-extrabold">2. Patient Pays</span>
                    <span>
                      {currentRequest.paymentStatus === 'Payment Successful' || currentRequest.paymentStatus === 'Paid' || currentRequest.status === 'Payment Completed' || currentRequest.status === 'Confirmed'
                        ? 'Paid Online'
                        : 'Awaiting Pay'}
                    </span>
                  </div>
                  <div
                    className={`p-2 rounded-xl border text-center ${
                      currentRequest.status === 'Payment Completed' || currentRequest.status === 'Payment Successful'
                        ? 'bg-white border-brand-green-600 font-bold text-brand-green-900 ring-2 ring-brand-green-100'
                        : currentRequest.status === 'Nurse Assigned' || currentRequest.status === 'Confirmed' || currentRequest.status === 'Completed'
                        ? 'bg-brand-green-100 border-brand-green-200 text-brand-green-900 font-bold'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <span className="text-[10px] block font-extrabold">3. Admin Confirm</span>
                    <span>Assign & Notify</span>
                  </div>
                </div>
              </div>

              {/* SIMULATED NOTIFICATION BOX (SMS / WHATSAPP LINK) */}
              <div className="p-3.5 rounded-2xl bg-gray-900 text-white space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-gray-800 pb-1 text-[10px] text-gray-400">
                  <span className="font-bold flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-brand-green-400" />
                    SMS / Push Notification Sent to Patient
                  </span>
                  <span className="font-mono">{currentRequest.contactNumber || currentRequest.patientPhone}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-teal-300 font-mono">
                    "MediUnify: Please pay ₹{detailPrice || currentRequest.price || 750} for your {currentRequest.serviceRequired} care booking. Click to complete online payment: https://pay.mediunify.care/hc/{currentRequest.id}"
                  </p>
                  <button
                    onClick={() => handleCopyPaymentLink(currentRequest.id)}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors flex-shrink-0 flex items-center gap-1 text-[10px] font-bold"
                  >
                    {copiedId === currentRequest.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === currentRequest.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* CANDIDATE NURSE SELECTION & WORKFLOW ACTION CARD */}
              <div className="p-4 bg-white rounded-2xl border-2 border-brand-green-600/30 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-xs sm:text-sm flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-brand-green-700" />
                      <span>Nurse Selection & Fee Configuration</span>
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Select candidate nurse from applied directory and set patient fee.
                    </p>
                  </div>

                  {/* Open Light Google Maps Button */}
                  <button
                    onClick={() => setIsMapModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex-shrink-0"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>View Nearby Nurses [ Open Map ]</span>
                  </button>
                </div>

                <div className={`grid gap-3 ${
                  currentRequest.paymentStatus === 'Payment Successful' || currentRequest.paymentStatus === 'Paid' || currentRequest.status === 'Payment Completed' || currentRequest.status === 'Confirmed' || currentRequest.status === 'Nurse Assigned'
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-1'
                }`}>
                  {/* Fee Input */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                      Service Fee (₹ INR) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={detailPrice}
                      onChange={(e) => setDetailPrice(e.target.value)}
                      className="w-full p-2.5 text-xs font-mono font-bold rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                    />
                  </div>

                  {/* Nurse Dropdown (Shown ONLY after payment is successful) */}
                  {(currentRequest.paymentStatus === 'Payment Successful' || currentRequest.paymentStatus === 'Paid' || currentRequest.status === 'Payment Completed' || currentRequest.status === 'Confirmed' || currentRequest.status === 'Nurse Assigned') && (
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                        Select Available Nurse to Assign <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={detailSelectedNurseId || currentRequest.confirmedNurses?.[0]?.nurseId || currentRequest.candidateNurse?.id || currentRequest.assignedNurse?.id || nurses[0]?.id}
                        onChange={(e) => setDetailSelectedNurseId(e.target.value)}
                        className="w-full p-2.5 text-xs font-bold rounded-xl border border-emerald-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                      >
                        {nurses.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.name} — {n.specialization} ({n.serviceArea || n.locality || 'Mysuru'}) {n.status === 'Available' ? '✓ Available' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Direct Action Trigger Buttons */}
                <div className="pt-2 flex items-center justify-between flex-wrap gap-2 border-t border-gray-100">
                  <div className="text-[11px] text-gray-500 font-medium">
                    Status: <strong className="text-gray-900">{currentRequest.status}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Push Payment Link (Before Payment) */}
                    {!(currentRequest.paymentStatus === 'Payment Successful' || currentRequest.paymentStatus === 'Paid' || currentRequest.status === 'Payment Completed' || currentRequest.status === 'Confirmed' || currentRequest.status === 'Nurse Assigned') && (
                      <button
                        onClick={() => handlePushLink(currentRequest.id, detailPrice)}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Push Payment Link</span>
                      </button>
                    )}

                    {/* Simulate Payment */}
                    {!(currentRequest.paymentStatus === 'Payment Successful' || currentRequest.paymentStatus === 'Paid' || currentRequest.status === 'Payment Completed' || currentRequest.status === 'Confirmed' || currentRequest.status === 'Nurse Assigned') && (
                      <button
                        onClick={() => handleSimulatePaymentAction(currentRequest.id)}
                        className="px-4 py-2 rounded-xl bg-brand-green-700 hover:bg-brand-green-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Simulate Patient Payment</span>
                      </button>
                    )}

                    {/* Confirm Service & Assign Nurse (After Payment) */}
                    {(currentRequest.paymentStatus === 'Payment Successful' || currentRequest.paymentStatus === 'Paid' || currentRequest.status === 'Payment Completed') && currentRequest.status !== 'Confirmed' && currentRequest.status !== 'Nurse Assigned' && (
                      <button
                        onClick={() => handleConfirmServiceAction(currentRequest.id, detailSelectedNurseId)}
                        className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm & Assign Nurse</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* PATIENT & SERVICE DETAILS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Patient Information Card */}
                <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2.5">
                  <h4 className="font-extrabold text-gray-900 text-xs flex items-center gap-2 border-b border-gray-100 pb-2">
                    <User className="w-4 h-4 text-brand-green-700" />
                    <span>Patient Information</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div><span className="text-gray-400">Name:</span> <strong className="text-gray-900 ml-1">{currentRequest.patientName}</strong></div>
                    <div>
                      <span className="text-gray-400">Phone:</span>
                      <a href={`tel:${currentRequest.patientPhone || currentRequest.contactNumber}`} className="font-mono font-bold text-brand-green-800 hover:underline ml-1">
                        {currentRequest.patientPhone || currentRequest.contactNumber}
                      </a>
                    </div>
                    <div><span className="text-gray-400">Location:</span> <span className="text-gray-800 ml-1">{currentRequest.patientLocation || currentRequest.location}</span></div>
                    <div><span className="text-gray-400">Full Address:</span> <span className="text-gray-800 ml-1">{currentRequest.address}</span></div>
                  </div>
                </div>

                {/* Service & Clinical Requirements Card */}
                <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2.5">
                  <h4 className="font-extrabold text-gray-900 text-xs flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Activity className="w-4 h-4 text-brand-green-700" />
                    <span>Clinical Requirements & Schedule</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-gray-400">Service:</span>
                      <span className="font-bold text-brand-green-900 bg-brand-green-50 px-2 py-0.5 rounded border border-brand-green-200 ml-1">
                        {currentRequest.serviceRequired}
                      </span>
                    </div>
                    <div><span className="text-gray-400">Schedule:</span> <strong className="text-gray-900 ml-1">{currentRequest.preferredDate || '26 Sep 2026'} at {currentRequest.preferredTime || '10:00 AM'}</strong></div>
                    <div>
                      <span className="text-gray-400">Clinical Notes:</span>
                      <p className="text-gray-700 italic mt-0.5">{currentRequest.specialRequirements || currentRequest.additionalRequirements || 'Standard homecare protocol.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-end flex-shrink-0">
              <button
                onClick={() => setActiveRequestDetail(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-xs transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAP MODAL (Triggered by [Map] or [View Nearby Nurses]) */}
      {isMapModalOpen && currentRequest && (
        <NearbyNursesMapModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          patientRequest={currentRequest}
          nurses={nurses}
          onConfirmNurse={(reqId, contactData) => {
            if (onConfirmNurseAvailability) {
              onConfirmNurseAvailability(reqId, contactData);
            }
            if (contactData.availabilityConfirmed) {
              setDetailSelectedNurseId(contactData.nurseId);
              setRowSelectedNurse((prev) => ({ ...prev, [reqId]: contactData.nurseId }));
            }
          }}
        />
      )}

      {/* NURSE CONTACT MODAL */}
      {selectedNurseForContact && currentRequest && (
        <NurseContactModal
          isOpen={Boolean(selectedNurseForContact)}
          onClose={() => setSelectedNurseForContact(null)}
          nurse={selectedNurseForContact}
          patient={currentRequest}
          onSaveConfirmation={(contactData) => {
            if (onConfirmNurseAvailability) {
              onConfirmNurseAvailability(currentRequest.id, contactData);
            }
            if (contactData.availabilityConfirmed) {
              setDetailSelectedNurseId(contactData.nurseId);
              setRowSelectedNurse((prev) => ({ ...prev, [currentRequest.id]: contactData.nurseId }));
            }
            setSelectedNurseForContact(null);
          }}
        />
      )}
    </div>
  );
}
