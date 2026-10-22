import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  FileCheck,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Eye,
  ShieldCheck,
  Lock,
  Pill,
  Mail,
  HeartPulse,
  AlertCircle,
  Building2,
  Stethoscope,
  FileText,
  DollarSign,
  Download,
  CreditCard,
  UserCheck
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';
import { INITIAL_PRESCRIPTIONS } from '../../../data/pharmacyData';

export default function OrderDetailModal({
  isOpen,
  onClose,
  order,
  medicines = [],
  prescriptions = []
}) {
  useLockBodyScroll(isOpen, onClose);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'patient' | 'prescription' | 'medicines' | 'timeline'

  if (!isOpen || !order) return null;

  // Lookup matching prescription
  const prescription =
    (prescriptions && prescriptions.find((p) => p.prescriptionId === order.prescriptionId || p.relatedOrderId === order.orderId)) ||
    INITIAL_PRESCRIPTIONS.find((p) => p.prescriptionId === order.prescriptionId || p.relatedOrderId === order.orderId) ||
    {
      prescriptionId: order.prescriptionId || 'RX-DIRECT',
      patientName: order.patientName,
      patientId: order.patientId || 'PID-9012',
      patientPhone: order.patientPhone || '+91 98450 67890',
      doctorName: 'Dr. Ramesh Bose, MD Internal Med',
      doctorRegNo: 'MCI-88219',
      hospital: 'Care Health Hospital, Mysore',
      prescriptionDate: order.orderDate || '29 Sep 2026',
      relatedOrderId: order.orderId,
      verificationStatus: 'Verified',
      currentOrderStatus: order.currentStatus || 'Picking',
      extractedItems: (order.items || []).map((i) => `${i.name} (Qty: ${i.qty})`),
      notes: 'Prescription reviewed and verified by Central Hub Pharmacist (Rahul Verma, Reg #44910).'
    };

  // Enriched patient demographics
  const patientDemographics = {
    'ORD-1024': {
      age: '38 Yrs',
      gender: 'Male',
      bloodGroup: 'O+ Positive',
      email: 'rahul.sharma@gmail.com',
      allergies: 'None Reported',
      conditions: 'Seasonal Pharyngitis & Mild Gastritis',
      emergencyContact: '+91 98450 11223 (Spouse)'
    },
    'ORD-1025': {
      age: '45 Yrs',
      gender: 'Female',
      bloodGroup: 'B+ Positive',
      email: 'priya.narayanan@yahoo.com',
      allergies: 'Penicillin (Mild Rash)',
      conditions: 'Hypertension & Type 2 Diabetes',
      emergencyContact: '+91 97401 88991 (Brother)'
    },
    'ORD-1026': {
      age: '29 Yrs',
      gender: 'Male',
      bloodGroup: 'A+ Positive',
      email: 'kiran.gowda@outlook.com',
      allergies: 'None Reported',
      conditions: 'Allergic Rhinitis & Dehydration',
      emergencyContact: '+91 98801 99002 (Father)'
    },
    'ORD-1027': {
      age: '62 Yrs',
      gender: 'Male',
      bloodGroup: 'AB+ Positive',
      email: 'anil.singhania@corpmail.com',
      allergies: 'Sulfa Drugs (Severe)',
      conditions: 'Insulin-Dependent Diabetes & Hypertension',
      emergencyContact: '+91 98200 11445 (Daughter)'
    },
    'ORD-1028': {
      age: '51 Yrs',
      gender: 'Female',
      bloodGroup: 'O+ Positive',
      email: 'meenakshi.sundaram@gmail.com',
      allergies: 'Aspirin (Gastric Irritation)',
      conditions: 'Acute Febrile Viral Illness',
      emergencyContact: '+91 97401 33445 (Son)'
    },
    'ORD-1029': {
      age: '42 Yrs',
      gender: 'Male',
      bloodGroup: 'B+ Positive',
      email: 'sanjay.deshmukh@gmail.com',
      allergies: 'None Reported',
      conditions: 'Chronic Acid Peptic Disorder / GERD',
      emergencyContact: '+91 98801 77665 (Spouse)'
    }
  }[order.orderId] || {
    age: order.patientAge || '36 Yrs',
    gender: order.patientGender || 'Male',
    bloodGroup: order.bloodGroup || 'O+ Positive',
    email: order.patientEmail || `${(order.patientName || 'patient').toLowerCase().replace(/\s+/g, '.')}@example.com`,
    allergies: order.allergies || 'None Reported',
    conditions: order.conditions || 'General Outpatient Treatment',
    emergencyContact: '+91 98000 00000'
  };

  const timelineSteps = [
    'Order Placed',
    'Prescription Received',
    'Prescription Verified',
    'Picking',
    'Packed',
    'Out for Delivery',
    'Delivered'
  ];

  const currentStepIndex =
    timelineSteps.indexOf(order.currentStatus) !== -1
      ? timelineSteps.indexOf(order.currentStatus)
      : order.currentStatus === 'Delivered'
      ? 6
      : order.currentStatus === 'Out for Delivery'
      ? 5
      : order.currentStatus === 'Packed'
      ? 4
      : order.currentStatus === 'Picking'
      ? 3
      : order.currentStatus === 'Prescription Verified'
      ? 2
      : 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-brand-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-brand-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden animate-scaleUp flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-brand-slate-100 flex items-center justify-between bg-gradient-to-r from-brand-navy-900 via-brand-navy-800 to-brand-teal-900 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-brand-teal-300 border border-white/15">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg tracking-tight">
                  {order.patientName} — {order.orderId}
                </h3>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-white/10 rounded-md border border-white/20 text-brand-teal-200">
                  Rx: {order.prescriptionId || 'OTC Direct'}
                </span>
                <span
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                    order.currentStatus === 'Delivered'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : order.currentStatus === 'Cancelled'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  }`}
                >
                  {order.currentStatus}
                </span>
              </div>
              <p className="text-xs text-brand-teal-100/80 mt-0.5">
                Ordered on {order.orderDate} • Delivery Status: <strong>{order.deliveryStatus || 'Pending'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 pb-2 border-b border-brand-slate-100 bg-brand-slate-50/70 overflow-x-auto flex-shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-white text-brand-teal-900 shadow-xs border border-brand-slate-200'
                : 'text-brand-slate-600 hover:text-brand-navy-900'
            }`}
          >
            Complete Details
          </button>
          <button
            onClick={() => setActiveTab('patient')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'patient'
                ? 'bg-white text-brand-teal-900 shadow-xs border border-brand-slate-200'
                : 'text-brand-slate-600 hover:text-brand-navy-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-brand-teal-600" />
            <span>Patient Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('prescription')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'prescription'
                ? 'bg-white text-brand-teal-900 shadow-xs border border-brand-slate-200'
                : 'text-brand-slate-600 hover:text-brand-navy-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-brand-teal-600" />
            <span>Doctor Prescription (Rx)</span>
          </button>
          <button
            onClick={() => setActiveTab('medicines')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'medicines'
                ? 'bg-white text-brand-teal-900 shadow-xs border border-brand-slate-200'
                : 'text-brand-slate-600 hover:text-brand-navy-900'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-brand-teal-600" />
            <span>Medicines ({order.items?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-white text-brand-teal-900 shadow-xs border border-brand-slate-200'
                : 'text-brand-slate-600 hover:text-brand-navy-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-brand-teal-600" />
            <span>Workflow Timeline</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto text-xs text-brand-slate-700 flex-1">
          {/* SECTION 1: COMPREHENSIVE PATIENT PROFILE */}
          {(activeTab === 'all' || activeTab === 'patient') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-brand-navy-900 tracking-tight">
                      Patient Demographic & Clinical Profile
                    </h4>
                    <p className="text-[11px] text-brand-slate-500">Verified patient identification and contact record</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-brand-teal-800 bg-brand-teal-50 px-2.5 py-1 rounded-lg border border-brand-teal-200">
                  {order.patientId || 'PID-9012'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block mb-0.5">
                    Full Patient Name
                  </span>
                  <p className="font-bold text-brand-navy-900 text-sm">{order.patientName}</p>
                </div>

                <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block mb-0.5">
                    Contact Phone
                  </span>
                  <p className="font-bold text-brand-navy-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-teal-600" />
                    <span>{order.patientPhone || '+91 98450 67890'}</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block mb-0.5">
                    Email Address
                  </span>
                  <p className="font-semibold text-brand-slate-800 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-brand-teal-600 flex-shrink-0" />
                    <span className="truncate">{patientDemographics.email}</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block mb-0.5">
                    Age & Gender
                  </span>
                  <p className="font-bold text-brand-navy-900">
                    {patientDemographics.age} • {patientDemographics.gender}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block mb-0.5">
                    Blood Group
                  </span>
                  <p className="font-bold text-rose-700 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                    <span>{patientDemographics.bloodGroup}</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block mb-0.5">
                    Emergency Contact
                  </span>
                  <p className="font-semibold text-brand-slate-800 truncate">
                    {patientDemographics.emergencyContact}
                  </p>
                </div>
              </div>

              {/* Address & Medical Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-3.5 rounded-xl bg-white border border-brand-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Patient Delivery Address
                  </span>
                  <p className="font-semibold text-brand-navy-900 leading-relaxed text-xs">
                    {order.patientAddress || order.address || '#42, 5th Cross, Jayalakshmipuram, Mysore - 570012'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-brand-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    Known Allergies & Conditions
                  </span>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-brand-navy-900">
                      Allergies: <span className="text-rose-700 font-semibold">{patientDemographics.allergies}</span>
                    </p>
                    <p className="text-brand-slate-600">
                      Diagnosed Condition: <span className="font-medium text-brand-slate-800">{patientDemographics.conditions}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: COMPLETE DOCTOR'S PRESCRIPTION (Rx) */}
          {(activeTab === 'all' || activeTab === 'prescription') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/40 border border-teal-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-teal-200/80">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-teal-600 text-white shadow-xs">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-brand-navy-900 tracking-tight flex items-center gap-2">
                      Doctor's Prescription Details (Rx)
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 border border-teal-300">
                        {prescription.prescriptionId}
                      </span>
                    </h4>
                    <p className="text-[11px] text-teal-800">
                      Digitally validated doctor prescription for order fulfillment
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      prescription.verificationStatus === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : prescription.verificationStatus === 'Rejected'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {prescription.verificationStatus}
                  </span>
                </div>
              </div>

              {/* Doctor & Hospital Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-white p-4 rounded-xl border border-teal-200/80 shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block mb-0.5 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    Prescribing Doctor
                  </span>
                  <p className="font-bold text-brand-navy-900 text-xs">{prescription.doctorName}</p>
                  <p className="text-[10px] text-brand-slate-500 font-mono mt-0.5">
                    Reg No: <strong>{prescription.doctorRegNo || 'MCI-88219'}</strong>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block mb-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    Clinic / Hospital
                  </span>
                  <p className="font-bold text-brand-navy-900 text-xs">{prescription.hospital || 'Care Health Hospital, Mysore'}</p>
                  <p className="text-[10px] text-brand-slate-500 mt-0.5">Authorized Diagnostic & IPD Center</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-400 block mb-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    Prescription Date
                  </span>
                  <p className="font-bold text-brand-navy-900 text-xs">{prescription.prescriptionDate}</p>
                  <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Valid for 30 Days</p>
                </div>
              </div>

              {/* Extracted Prescribed Dosages */}
              <div className="space-y-2 bg-white p-4 rounded-xl border border-teal-200/80 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-500 block mb-1">
                  Prescribed Medications & Doctor's Instructions
                </span>
                <div className="space-y-1.5">
                  {(prescription.extractedItems || [
                    'Paracetamol 500mg (1 Tab TID x 5 days after food)',
                    'Amoxicillin 500mg (1 Cap BD x 5 days)',
                    'Pantoprazole 40mg (1 Tab OD before breakfast x 10 days)'
                  ]).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-brand-slate-50 rounded-lg border border-brand-slate-200 text-xs font-semibold text-brand-navy-900 flex items-center gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-mono text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pharmacist Clinical Audit Log */}
              <div className="p-3.5 rounded-xl bg-brand-slate-50 border border-brand-slate-200 text-xs">
                <div className="flex items-center gap-1.5 text-brand-navy-900 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-brand-teal-700" />
                  <span>Pharmacist Verification Audit Log</span>
                </div>
                <p className="text-brand-slate-700 font-medium leading-relaxed text-[11px]">
                  {prescription.notes || 'Verified and approved by Central Hub Registered Pharmacist (Reg #44910). Digital signature validated.'}
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: PRESCRIBED MEDICINES TO PICK & PACK */}
          {(activeTab === 'all' || activeTab === 'medicines') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-slate-200 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-brand-navy-900 tracking-tight">
                      Prescribed Medicines to Pick & Pack
                    </h4>
                    <p className="text-[11px] text-brand-slate-500">
                      Itemized medicine SKU list for Central Hub dispensing
                    </p>
                  </div>
                </div>
                <span className="font-bold text-xs text-brand-navy-900 bg-brand-slate-100 px-2.5 py-1 rounded-lg">
                  Total Items: {order.items?.length || 2}
                </span>
              </div>

              <div className="border border-brand-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-slate-50 text-[10px] font-bold text-brand-slate-600 uppercase border-b border-brand-slate-200">
                    <tr>
                      <th className="px-3.5 py-2.5">Medicine Name</th>
                      <th className="px-3 py-2.5 text-center">Quantity</th>
                      <th className="px-3 py-2.5 text-right">Unit Price</th>
                      <th className="px-3.5 py-2.5 text-right">Item Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-slate-100">
                    {(order.items || [
                      { name: 'Paracetamol 500mg', qty: 20, price: 2.0, total: 40 },
                      { name: 'Amoxicillin 500mg', qty: 10, price: 8.5, total: 85 }
                    ]).map((item, idx) => {
                      const matchedMed = medicines?.find(
                        (m) =>
                          m.name?.toLowerCase() === (item.name || '').toLowerCase() ||
                          m.id === item.medicineId
                      );
                      const itemImage = item.image || matchedMed?.image;

                      return (
                        <tr key={idx} className="hover:bg-brand-slate-50/70">
                          <td className="px-3.5 py-2.5">
                            <div className="flex items-center gap-2.5">
                              {itemImage ? (
                                <img
                                  src={itemImage}
                                  alt={item.name}
                                  className="w-8 h-8 rounded-lg object-cover border border-brand-slate-200 shrink-0 shadow-2xs"
                                />
                              ) : (
                                <span className="p-1.5 rounded-lg bg-brand-teal-50 text-brand-teal-700 shrink-0">
                                  <Pill className="w-3.5 h-3.5" />
                                </span>
                              )}
                              <div>
                                <span className="font-bold text-brand-navy-900 block leading-tight">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-brand-slate-400">
                                  {matchedMed?.dosageForm || 'Prescribed SKU'} • {matchedMed?.strength || 'Standard'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono font-bold text-brand-slate-800">
                            {item.qty}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono text-brand-slate-600">
                            ₹{Number(item.price).toFixed(2)}
                          </td>
                          <td className="px-3.5 py-2.5 text-right font-mono font-bold text-brand-navy-900">
                            ₹{Number(item.total || item.qty * item.price).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Billing Summary Box */}
              <div className="p-4 rounded-xl bg-brand-slate-50 border border-brand-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold text-brand-navy-900 block">Payment & Billing Summary</span>
                  <p className="text-[11px] text-brand-slate-500">
                    Payment Method: <span className="font-semibold text-brand-navy-900">UPI / Prepaid Online</span> (Transaction Confirmed)
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-brand-slate-400 block">Grand Total</span>
                  <span className="text-lg font-black text-brand-teal-900 font-mono">
                    ₹{Number(order.orderAmount || 450).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: FULFILLMENT TIMELINE */}
          {(activeTab === 'all' || activeTab === 'timeline') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-slate-200 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-brand-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-brand-navy-900 tracking-tight">
                      Fulfillment & Delivery Progress
                    </h4>
                    <p className="text-[11px] text-brand-slate-500">
                      Live lifecycle status from order reception to patient doorstep delivery
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-brand-teal-700 bg-brand-teal-50 px-2.5 py-1 rounded-lg border border-brand-teal-200">
                  Current: {order.currentStatus}
                </span>
              </div>

              <div className="relative pt-3 pb-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 relative z-10">
                  {timelineSteps.map((step, idx) => {
                    const isDone = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div
                        key={step}
                        className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                          isCurrent
                            ? 'bg-brand-teal-50 border-brand-teal-400 ring-2 ring-brand-teal-500/20 shadow-xs'
                            : isDone
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-brand-slate-50 border-brand-slate-200/80'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCurrent
                              ? 'bg-brand-teal-600 text-white shadow-2xs'
                              : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-brand-slate-200 text-brand-slate-500'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] mt-1.5 font-bold leading-tight ${
                            isCurrent
                              ? 'text-brand-teal-900'
                              : isDone
                              ? 'text-emerald-900'
                              : 'text-brand-slate-400'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-brand-slate-50 border-t border-brand-slate-200 flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] text-brand-slate-500 font-medium hidden sm:inline">
            Authorized Pharmacy Admin View • Complete Patient & Prescription Audit Record
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-brand-slate-700 bg-white border border-brand-slate-300 rounded-xl hover:bg-brand-slate-100 transition-colors shadow-2xs ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
