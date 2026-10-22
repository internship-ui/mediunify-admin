import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  Clock,
  Truck,
  Wrench,
  MapPin,
  IndianRupee,
  ChevronRight,
  Filter,
  Check,
  XCircle,
  Inbox,
  ArrowLeft,
  AlertTriangle,
  Award,
  Eye,
  User,
  Send
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function VendorMatchingView({
  selectedRequest,
  requests = [],
  vendors = [],
  inventory = [],
  onSelectRequest,
  onConfirmVendorMatch,
  onBack
}) {
  const [activeReqId, setActiveReqId] = useState(
    selectedRequest ? selectedRequest.id : (requests.find(r => r.status === 'New' || r.status === 'New Request' || r.status === 'Vendor Matching')?.id || requests[0]?.id)
  );

  const currentRequest = requests.find((r) => r.id === activeReqId) || selectedRequest || requests[0];
  const [selectedVendorForMatch, setSelectedVendorForMatch] = useState(null);
  const [matchStep, setMatchStep] = useState(1); // 1: Selected Vendor -> 2: Vendor Confirmation -> 3: Price & Terms -> 4: Patient Confirmation -> 5: Order Created
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedVendorDetailsModal, setSelectedVendorDetailsModal] = useState(null);

  // Available vendor matching list with Available vs Not Available status
  const vendorMatchCards = vendors.map((vendor, idx) => {
    // Determine inventory match
    const vendorInv = inventory.find(
      (inv) => inv.vendorId === vendor.id && inv.equipmentName === (currentRequest?.equipmentName || currentRequest?.equipment)
    );

    // Realistic availability simulation
    const isVerified = vendor.verificationStatus === 'Verified' || vendor.status === 'Active';
    const availableQty = vendorInv ? vendorInv.availableQuantity : (idx === 0 ? 5 : idx === 1 ? 3 : idx === 2 ? 0 : 2);
    const isAvailable = isVerified && availableQty > 0;

    const baseRentalPrice = vendorInv ? vendorInv.rentalPrice : (currentRequest?.rentalAmount || 4500) + (idx * 200);
    const deposit = currentRequest?.deposit || 2000;
    const deliveryCharge = 500;
    const installationCharge = currentRequest?.installationRequired ? 300 : 0;
    const estimatedDelivery = idx === 0 ? 'Within 4 Hours (Express)' : (idx === 1 ? 'Same Day (6-8 Hours)' : idx === 2 ? 'Out of Stock' : 'Next Day Delivery');
    const serviceArea = vendor.serviceArea || 'Mysuru & Outskirts';
    const rating = vendor.rating || (4.7 + idx * 0.05).toFixed(1);
    const completedRentals = vendor.completedRentals || vendor.totalOrders || (38 + idx * 12);
    const onTimeDeliveryRate = idx === 0 ? '98.5%' : idx === 1 ? '96.2%' : '92.0%';

    return {
      vendor,
      isVerified,
      isAvailable,
      availableQty,
      rentalPrice: baseRentalPrice,
      deposit,
      deliveryCharge,
      installationCharge,
      estimatedDelivery,
      serviceArea,
      deliveryAvailability: 'Doorstep Delivery Active',
      installationAvailability: currentRequest?.installationRequired ? 'Technician Available' : 'Self-Install Supported',
      rating,
      completedRentals,
      onTimeDeliveryRate,
      availabilityStatus: isAvailable ? 'Available' : 'Not Available',
      badgeColor: isAvailable ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
    };
  });

  const handleOpenConfirm = (matchCard) => {
    setSelectedVendorForMatch(matchCard);
    setMatchStep(1);
    setIsConfirmModalOpen(true);
  };

  const handleExecuteFinalMatch = () => {
    if (onConfirmVendorMatch && selectedVendorForMatch && currentRequest) {
      onConfirmVendorMatch(currentRequest.id, selectedVendorForMatch.vendor.id, selectedVendorForMatch);
    }
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-brand-teal-600" />
              Vendor Matching & Dispatch Allocation
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Compare verified medical equipment vendors, verify stock availability, and assign partner fulfillment.
          </p>
        </div>

        {/* Request Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Select Inbound Request:</span>
          <select
            value={activeReqId}
            onChange={(e) => {
              setActiveReqId(e.target.value);
              const found = requests.find(r => r.id === e.target.value);
              if (onSelectRequest && found) onSelectRequest(found);
            }}
            className="text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
          >
            {requests.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} - {r.patientName || r.patient} ({r.equipmentName || r.equipment}) - [{r.status}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* REQUEST SUMMARY BANNER */}
      {currentRequest ? (
        <div className="bg-gradient-to-r from-brand-navy-950 via-brand-navy-900 to-brand-slate-900 text-white rounded-2xl p-6 border border-brand-navy-800 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-teal-500/20 border border-brand-teal-500/30 flex items-center justify-center text-brand-teal-400 font-bold">
                <Inbox className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-teal-500/20 text-brand-teal-300 font-semibold">
                    {currentRequest.id}
                  </span>
                  <StatusBadge status={currentRequest.status} size="xs" />
                </div>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {currentRequest.equipmentName || currentRequest.equipment}
                </h2>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-brand-slate-300">Estimated Rental Budget</div>
              <div className="text-xl font-bold text-brand-teal-400">
                ₹{(currentRequest.rentalAmount || currentRequest.estimatedTotal || 4500).toLocaleString()}
                <span className="text-xs font-normal text-brand-slate-300"> / {currentRequest.duration || currentRequest.rentalDuration || '30 Days'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
            <div>
              <span className="text-brand-slate-400 block">Patient Name:</span>
              <span className="font-semibold text-white">{currentRequest.patientName || currentRequest.patient}</span>
            </div>
            <div>
              <span className="text-brand-slate-400 block">Delivery Location:</span>
              <span className="font-semibold text-white">{currentRequest.location || currentRequest.deliveryAddress || 'Mysuru'}</span>
            </div>
            <div>
              <span className="text-brand-slate-400 block">Quantity & Duration:</span>
              <span className="font-semibold text-white">{currentRequest.quantity || 1} Unit • {currentRequest.duration || currentRequest.rentalDuration || '30 Days'}</span>
            </div>
            <div>
              <span className="text-brand-slate-400 block">Installation Required:</span>
              <span className="font-semibold text-brand-teal-300">
                {currentRequest.installationRequired ? 'Yes (Certified Tech)' : 'No'}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {/* MATCHING VENDORS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-teal-600" />
            Matching Vendors in Service Area
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            Showing {vendorMatchCards.length} verified vendors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {vendorMatchCards.map((card, idx) => (
            <div
              key={card.vendor.id}
              className={`rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                card.isAvailable
                  ? 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-brand-teal-300'
                  : 'bg-gray-50/70 border-gray-200 opacity-75'
              }`}
            >
              <div className="space-y-3.5">
                {/* Top Vendor Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 text-sm">{card.vendor.name}</span>
                      {card.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-brand-teal-600 flex-shrink-0" title="Biomedical KYC Verified" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{card.serviceArea}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                    {card.availabilityStatus}
                  </span>
                </div>

                {/* Rating & Performance Metrics */}
                <div className="flex items-center justify-between text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span className="font-bold text-gray-800">{card.rating}</span>
                    <span className="text-gray-400 text-[10px]">({card.completedRentals} fulfilled)</span>
                  </div>
                  <div className="text-[11px] text-brand-teal-700 font-semibold">
                    {card.onTimeDeliveryRate} On-Time
                  </div>
                </div>

                {/* Specifics for Requested Equipment */}
                <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Available Stock:</span>
                    <span className={`font-bold ${card.availableQty > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {card.availableQty} Units in Warehouse
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Delivery:</span>
                    <span className="font-medium text-gray-800">{card.estimatedDelivery}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery Service:</span>
                    <span className="font-medium text-gray-800">{card.deliveryAvailability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Installation:</span>
                    <span className="font-medium text-gray-800">{card.installationAvailability}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-100">
                    <span className="text-gray-500 font-medium">Rental Quote:</span>
                    <span className="font-bold text-brand-navy-900">₹{card.rentalPrice.toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedVendorDetailsModal(card.vendor)}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-brand-navy-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  View Vendor
                </button>

                {card.isAvailable ? (
                  <button
                    onClick={() => handleOpenConfirm(card)}
                    className="px-3.5 py-1.5 bg-brand-teal-600 hover:bg-brand-teal-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-xs transition-colors"
                  >
                    Select Vendor
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg text-xs font-semibold cursor-not-allowed"
                  >
                    Unavailable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VENDOR SELECTION & CONFIRMATION MODAL (Step-by-Step Flow) */}
      {isConfirmModalOpen && selectedVendorForMatch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-brand-teal-600 uppercase tracking-wider">Vendor Matching Allocation</span>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">Assign Partner Fulfillment</h3>
              </div>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Progression: Selected Vendor -> Vendor Confirmation -> Price & Terms -> Patient Confirmation */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs pb-2 border-b border-gray-100">
              <div className={`p-2 rounded-lg ${matchStep >= 1 ? 'bg-brand-navy-900 text-white font-bold' : 'bg-gray-100 text-gray-400'}`}>
                1. Selected Vendor
              </div>
              <div className={`p-2 rounded-lg ${matchStep >= 2 ? 'bg-brand-navy-900 text-white font-bold' : 'bg-gray-100 text-gray-400'}`}>
                2. Vendor Confirmation
              </div>
              <div className={`p-2 rounded-lg ${matchStep >= 3 ? 'bg-brand-navy-900 text-white font-bold' : 'bg-gray-100 text-gray-400'}`}>
                3. Price & Terms
              </div>
              <div className={`p-2 rounded-lg ${matchStep >= 4 ? 'bg-brand-navy-900 text-white font-bold' : 'bg-gray-100 text-gray-400'}`}>
                4. Patient Confirmed
              </div>
            </div>

            {/* Step 1: Selected Vendor */}
            {matchStep === 1 && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="font-bold text-gray-900 text-sm">{selectedVendorForMatch.vendor.name}</div>
                  <div className="text-gray-600 mt-1">Service Area: {selectedVendorForMatch.serviceArea}</div>
                  <div className="text-gray-600">Available Quantity: {selectedVendorForMatch.availableQty} units</div>
                  <div className="text-gray-600">Estimated Delivery: {selectedVendorForMatch.estimatedDelivery}</div>
                </div>
                <div className="text-gray-600">
                  Click below to dispatch automatic notification and request vendor confirmation for this order.
                </div>
              </div>
            )}

            {/* Step 2: Vendor Confirmation */}
            {matchStep === 2 && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Vendor Confirmation Received
                  </div>
                  <div>
                    {selectedVendorForMatch.vendor.name} has confirmed stock reservation and scheduled biomedical preparation.
                  </div>
                </div>
                <div className="text-gray-600">
                  Ready to review commercial pricing and prepare terms for patient confirmation.
                </div>
              </div>
            )}

            {/* Step 3: Price & Terms */}
            {matchStep === 3 && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-brand-slate-50 rounded-xl border border-brand-slate-200 space-y-2">
                  <div className="font-bold text-brand-navy-900">Commercial Summary</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>Rental Amount: <strong>₹{selectedVendorForMatch.rentalPrice.toLocaleString()}</strong></div>
                    <div>Deposit: <strong>₹{selectedVendorForMatch.deposit.toLocaleString()}</strong></div>
                    <div>Delivery Fee: <strong>₹{selectedVendorForMatch.deliveryCharge}</strong></div>
                    <div>Installation Fee: <strong>₹{selectedVendorForMatch.installationCharge}</strong></div>
                  </div>
                </div>
                <div className="text-gray-600">
                  Terms approved. Final payment escrow link will be locked upon patient confirmation.
                </div>
              </div>
            )}

            {/* Step 4: Patient Confirmation */}
            {matchStep === 4 && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-200 text-teal-900 space-y-1">
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-teal-700" />
                    Patient Confirmation Complete
                  </div>
                  <div>
                    Patient {currentRequest?.patientName || currentRequest?.patient} has verified delivery schedule and payment terms.
                  </div>
                </div>
                <div className="text-gray-600">
                  Click 'Generate Order & Schedule Dispatch' to finalize assignment.
                </div>
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                {matchStep < 4 ? (
                  <button
                    onClick={() => setMatchStep(prev => prev + 1)}
                    className="px-4 py-2 bg-brand-navy-900 hover:bg-brand-navy-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    Next Step
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleExecuteFinalMatch}
                    className="px-4 py-2 bg-brand-green-600 hover:bg-brand-green-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    Generate Order & Schedule Dispatch
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VENDOR DETAILS MODAL */}
      {selectedVendorDetailsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">{selectedVendorDetailsModal.name}</h3>
                <span className="text-[11px] text-gray-500">{selectedVendorDetailsModal.businessName || 'Medical Fleet Partner'}</span>
              </div>
              <button
                onClick={() => setSelectedVendorDetailsModal(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div><span className="text-gray-400">Contact Person:</span> <strong className="text-gray-800">{selectedVendorDetailsModal.contactPerson || 'Logistics Coordinator'}</strong></div>
              <div><span className="text-gray-400">Phone:</span> <strong className="text-gray-800">{selectedVendorDetailsModal.phone || '+91 98450 00112'}</strong></div>
              <div><span className="text-gray-400">Email:</span> <strong className="text-gray-800">{selectedVendorDetailsModal.email || 'partner@carevendor.com'}</strong></div>
              <div><span className="text-gray-400">Service Coverage:</span> <strong className="text-gray-800">{selectedVendorDetailsModal.serviceArea || 'Mysuru & Outskirts'}</strong></div>
              <div><span className="text-gray-400">Verification Status:</span> <strong className="text-emerald-700 font-bold">{selectedVendorDetailsModal.verificationStatus || 'Verified'}</strong></div>
            </div>

            <div className="text-right pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedVendorDetailsModal(null)}
                className="px-4 py-2 bg-brand-navy-900 text-white rounded-xl font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
