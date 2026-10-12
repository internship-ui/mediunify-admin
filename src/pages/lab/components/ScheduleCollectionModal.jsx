import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  UserCheck,
  Building2,
  CheckCircle2,
  MapPin,
  Send,
  AlertCircle,
  Pipette,
  Layers,
  FileCheck,
  ShieldCheck,
  Truck,
  Lock
} from 'lucide-react';
import { COLLECTION_STAFF, LAB_CENTERS } from '../../../data/labData';
import { useToast } from '../../../context/ToastContext';
import TubeColorDot from './TubeColorBadge';

export default function ScheduleCollectionModal({
  isOpen,
  onClose,
  order,
  onConfirmSchedule
}) {
  const { addToast } = useToast();

  const [selectedStaffId, setSelectedStaffId] = useState(
    COLLECTION_STAFF[0]?.staffId || 'PH1004'
  );
  const [selectedCenter, setSelectedCenter] = useState(
    order?.collection?.center || order?.center || LAB_CENTERS[0]?.name
  );

  // Locked patient requested date and time
  const patientRequestedDate = order?.collection?.scheduledDate || order?.preferredDate || '02 October 2026';
  const patientRequestedTime = order?.collection?.scheduledTime || order?.preferredTimeSlot || '10:00 AM';

  const [specialInstructions, setSpecialInstructions] = useState(
    'Strict fasting blood collection. Carry barcoded specimen tubes and maintain cold chain box at 2-8°C.'
  );

  useEffect(() => {
    if (order?.center || order?.collection?.center) {
      setSelectedCenter(order.collection?.center || order.center || LAB_CENTERS[0]?.name);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const bookedItem = order.bookedItem || {
    name: order.testOrPackage?.name || 'Complete Health Screening Package',
    code: order.testOrPackage?.code || 'PKG-CHS-01',
    type: 'Package'
  };

  const detailedTests = order.includedTests || [];
  const selectedStaffObj = COLLECTION_STAFF.find((s) => s.staffId === selectedStaffId) || COLLECTION_STAFF[0];

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!selectedStaffObj) {
      addToast('Please select a phlebotomist', 'warning');
      return;
    }

    onConfirmSchedule(order.orderId, {
      staff: selectedStaffObj.name,
      staffId: selectedStaffObj.staffId,
      staffPhone: selectedStaffObj.phone,
      staffLocation: selectedStaffObj.serviceArea,
      center: selectedCenter,
      date: patientRequestedDate,
      timeSlot: patientRequestedTime,
      instructions: specialInstructions
    });

    addToast(
      `Assigned ${selectedStaffObj.name} for ${patientRequestedDate} at ${patientRequestedTime}`,
      'success'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-teal-50 text-brand-teal-700 rounded-lg border border-brand-teal-200">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-brand-navy-900">
                Phlebotomist Assignment & Collection Brief
              </h3>
              <p className="text-xs text-brand-slate-500 font-mono">
                Order #{order.orderId} • Status: <span className="font-bold text-brand-teal-700">ASSIGN PHLEBOTOMIST</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form & Complete Collection Brief Body */}
        <form onSubmit={handleConfirm} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          {/* SECTION 1: COMPLETE COLLECTION BRIEF HEADER */}
          <div className="p-4 bg-gradient-to-r from-brand-navy-900 to-brand-teal-900 rounded-2xl text-white space-y-3 shadow-xs">
            <div className="flex justify-between items-center border-b border-white/15 pb-2">
              <span className="text-[10px] uppercase font-bold text-brand-teal-300">COLLECTION ASSIGNMENT BRIEF</span>
              <span className="font-mono text-xs font-bold text-brand-teal-200">TOTAL TESTS: {detailedTests.length}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              <div>
                <span className="text-brand-teal-200 text-[10px] uppercase font-bold block">Order ID:</span>
                <strong className="text-white font-mono">{order.orderId}</strong>
              </div>
              <div>
                <span className="text-brand-teal-200 text-[10px] uppercase font-bold block">Patient:</span>
                <strong className="text-white">{order.patient?.name}</strong>
              </div>
              <div>
                <span className="text-brand-teal-200 text-[10px] uppercase font-bold block">Date & Time:</span>
                <strong className="text-white">{patientRequestedDate} • {patientRequestedTime}</strong>
              </div>
              <div>
                <span className="text-brand-teal-200 text-[10px] uppercase font-bold block">Booked Package:</span>
                <strong className="text-white">{bookedItem.name}</strong>
              </div>
            </div>

            <div className="pt-1 text-[11px] text-brand-teal-100 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-teal-300 flex-shrink-0" />
              <span>Address: <strong>{order.patient?.address}</strong></span>
            </div>
          </div>

          {/* SECTION 2: SAMPLES TO COLLECT TABLE */}
          <div className="p-4 bg-white rounded-2xl border border-brand-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-brand-slate-100 pb-2">
              <h4 className="font-extrabold text-brand-navy-900 text-xs flex items-center gap-2">
                <Pipette className="w-4 h-4 text-brand-teal-600" />
                SAMPLES TO COLLECT ({detailedTests.length} Items)
              </h4>
              <span className="text-[11px] text-brand-slate-500">Configured requirements from Test Catalogue</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-8">#</th>
                    <th className="py-2.5 px-3">Test</th>
                    <th className="py-2.5 px-3">Sample</th>
                    <th className="py-2.5 px-3 text-center">Tube Color</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {detailedTests.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{t.name}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">{t.sampleRequired}</td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex items-center justify-center">
                          <TubeColorDot tube={t.tubeContainer || t.tubeIdentifier} testCode={t.code} size="md" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Preparation and Special Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-brand-slate-50 p-2.5 rounded-xl border border-brand-slate-200">
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Patient Preparation:</span>
                <p className="font-semibold text-brand-navy-900 mt-0.5">
                  Fasting Required: Yes (10 - 12 Hours). Water permitted. Morning clean-catch urine.
                </p>
              </div>

              <div className="bg-brand-slate-50 p-2.5 rounded-xl border border-brand-slate-200">
                <span className="text-[10px] text-brand-slate-400 font-bold uppercase block">Special Instructions:</span>
                <p className="font-semibold text-brand-navy-900 mt-0.5">
                  Follow approved laboratory collection protocol. Invert EDTA 8-10 times gently.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: PHLEBOTOMIST SELECTION */}
          <div className="p-4 bg-brand-slate-50 rounded-2xl border border-brand-slate-200 space-y-3">
            <h4 className="font-extrabold text-brand-navy-900 text-xs flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand-teal-600" />
              Available Phlebotomists (Select One)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {COLLECTION_STAFF.map((staff) => {
                const isSelected = selectedStaffId === staff.staffId;
                return (
                  <div
                    key={staff.id}
                    onClick={() => setSelectedStaffId(staff.staffId)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-brand-teal-50 border-brand-teal-500 shadow-xs ring-2 ring-brand-teal-400'
                        : 'bg-white border-brand-slate-200 hover:border-brand-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <strong className="text-brand-navy-900 text-xs">{staff.name}</strong>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          staff.availability === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {staff.availability}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-slate-500 font-mono mt-0.5">ID: {staff.staffId}</p>
                    <p className="text-[11px] text-brand-teal-700 font-semibold mt-1">📍 {staff.serviceArea}</p>
                    <p className="text-[10px] text-brand-slate-400 mt-0.5">Rating: {staff.rating} • Vehicle: {staff.vehicleNumber}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: DATE, TIME (LOCKED TO PATIENT'S SELECTION) & CENTER */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-brand-slate-50 p-3 rounded-xl border border-brand-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-brand-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-teal-600" />
                  Collection Date
                </span>
                <span className="text-[10px] font-bold text-brand-teal-800 bg-brand-teal-50 px-2 py-0.5 rounded-md border border-brand-teal-200 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Patient Slot
                </span>
              </div>
              <p className="font-extrabold text-brand-navy-900 text-xs mt-1">{patientRequestedDate}</p>
            </div>

            <div className="bg-brand-slate-50 p-3 rounded-xl border border-brand-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-brand-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-teal-600" />
                  Requested Time
                </span>
                <span className="text-[10px] font-bold text-brand-teal-800 bg-brand-teal-50 px-2 py-0.5 rounded-md border border-brand-teal-200 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Locked
                </span>
              </div>
              <p className="font-extrabold text-brand-navy-900 text-xs mt-1">{patientRequestedTime}</p>
            </div>

            <div>
              <label className="block font-bold text-brand-slate-700 mb-1">Accession Center *</label>
              <select
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 font-medium"
              >
                {LAB_CENTERS.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-slate-700 mb-1">
              Dispatch Instructions
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 font-medium"
            />
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-brand-slate-200 bg-brand-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white text-brand-slate-700 font-semibold text-xs rounded-xl border border-brand-slate-200 hover:bg-brand-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirm Assignment
          </button>
        </div>

      </div>
    </div>
  );
}
