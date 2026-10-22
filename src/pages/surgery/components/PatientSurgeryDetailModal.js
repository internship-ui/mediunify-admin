import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Share2,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Send,
  FileSpreadsheet,
  Check,
  Calendar,
  Sparkles,
  Info,
  DollarSign,
  UserCheck,
  Stethoscope
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import {
  getMatchingHospitals,
  getInactiveMatchingHospitals,
  downloadSurgeryPatientsExcel
} from '../../../data/surgeryData';
import { useToast } from '../../../context/ToastContext';

export default function PatientSurgeryDetailModal({
  isOpen,
  onClose,
  patient,
  hospitals = [],
  initialHospitalId = null,
  initialTab = null,
  onForwardRequest,
  onUpdateHospitalResponse
}) {
  const { addToast } = useToast();

  // Active sub-tab inside patient modal: 'matching' | 'preview' | 'response'
  const [activeModalTab, setActiveModalTab] = useState('preview');
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const [previewChannel, setPreviewChannel] = useState('whatsapp'); // 'whatsapp' | 'email'

  // Response tracking form state
  const [responseStatus, setResponseStatus] = useState('Quotation Received');
  const [quotationAmount, setQuotationAmount] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [doctorRemarks, setDoctorRemarks] = useState('');

  // Find matching active hospitals
  const matchingActiveHospitals = useMemo(() => {
    if (!patient) return [];
    return getMatchingHospitals(patient, hospitals);
  }, [patient, hospitals]);

  // Find matching inactive hospitals (to show transparency about exclusion)
  const matchingInactiveHospitals = useMemo(() => {
    if (!patient) return [];
    return getInactiveMatchingHospitals(patient, hospitals);
  }, [patient, hospitals]);

  // Sync selected hospital when patient changes
  useEffect(() => {
    if (patient) {
      if (initialHospitalId) {
        setSelectedHospitalId(initialHospitalId);
        setActiveModalTab(initialTab || (patient.forwardStatus === 'Forwarded' ? 'response' : 'preview'));
      } else if (patient.forwardedHospital?.hospitalId) {
        setSelectedHospitalId(patient.forwardedHospital.hospitalId);
        setActiveModalTab(initialTab || 'response');
        setResponseStatus(patient.hospitalResponse || 'Quotation Received');
        setDoctorRemarks(patient.hospitalResponseNotes || '');
      } else if (matchingActiveHospitals.length > 0) {
        setSelectedHospitalId(matchingActiveHospitals[0].id);
        setActiveModalTab(initialTab || 'preview');
      } else {
        setSelectedHospitalId(null);
        setActiveModalTab(initialTab || 'matching');
      }
    }
  }, [patient, initialHospitalId, initialTab, matchingActiveHospitals]);

  if (!patient) return null;

  const selectedHospital = hospitals.find((h) => h.id === selectedHospitalId);
  const isAlreadyForwarded = patient.forwardStatus === 'Forwarded';

  // Construct Formatted WhatsApp Message
  const generateWhatsAppMessage = () => {
    const hosp = selectedHospital || patient.forwardedHospital;
    return `*MediUnify Surgery Referral — Patient Inquiry*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Patient Name:* ${patient.patientName} (${patient.gender}, ${patient.age} yrs)\n` +
      `*Inquiry Ref:* ${patient.patientId}\n` +
      `*Required Operation:* ${patient.neededSurgery}\n` +
      `*Surgical Category:* ${patient.surgeryCategory}\n` +
      `*Patient Locality:* ${patient.cityName}\n` +
      `*Urgency Level:* ${patient.urgency}\n` +
      `*Contact Number:* ${patient.mobileNumber}\n` +
      `*Patient Email:* ${patient.email || 'N/A'}\n` +
      `*Clinical Complaints & Remarks:* ${patient.notes || 'None'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Referred Partner:* ${hosp?.name || 'Partner Hospital'}\n` +
      `*Action Required:* Please review the surgical requirement and reply with consultation availability / quotation.\n` +
      `_Dispatched via MediUnify Centralized Healthcare Operations Hub_`;
  };

  // Construct Formatted Email Message
  const generateEmailSubject = () => {
    return `[MediUnify Surgery Referral] New Case: ${patient.patientName} — ${patient.neededSurgery} (${patient.patientId})`;
  };

  const generateEmailBody = () => {
    const hosp = selectedHospital || patient.forwardedHospital;
    return `Dear Surgical Admissions Team (${hosp?.name || 'Partner Hospital'}),\n\n` +
      `A patient surgery inquiry matching your surgical specializations has been registered on the MediUnify Healthcare Network.\n\n` +
      `PATIENT CLINICAL SUMMARY:\n` +
      `• Patient Name: ${patient.patientName}\n` +
      `• Age & Gender: ${patient.age} yrs, ${patient.gender}\n` +
      `• Inquired Operation: ${patient.neededSurgery}\n` +
      `• Specialty Category: ${patient.surgeryCategory}\n` +
      `• Location / Hub: ${patient.cityName}\n` +
      `• Urgency: ${patient.urgency}\n` +
      `• Contact Mobile: ${patient.mobileNumber}\n` +
      `• Email: ${patient.email || 'N/A'}\n` +
      `• Clinical Findings: ${patient.notes || 'No preliminary notes'}\n\n` +
      `Please provide estimated surgical package quotation and consultation slot availability.\n\n` +
      `Regards,\n` +
      `MediUnify Centralized Surgery Admin Operations\n` +
      `Karnataka Hub (Mysore • Bangalore • Mandya)`;
  };

  // Handler: Dispatch via WhatsApp
  const handleDispatchWhatsApp = () => {
    if (!selectedHospital) {
      addToast('Please select a matching hospital to forward this surgery request', 'warning');
      return;
    }

    const waNumber = (selectedHospital.whatsappNumber || selectedHospital.contactMobile || '').replace(/\D/g, '');
    const message = generateWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${waNumber}?text=${encoded}`;

    // Open WhatsApp Web or App
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Record Forwarding in state
    onForwardRequest({
      patientId: patient.patientId,
      hospital: selectedHospital,
      method: 'WhatsApp',
      target: selectedHospital.whatsappNumber || selectedHospital.contactMobile
    });

    addToast(`Surgery request successfully forwarded to ${selectedHospital.name} via WhatsApp!`, 'success');
    setActiveModalTab('response');
  };

  // Handler: Dispatch via Email
  const handleDispatchEmail = () => {
    if (!selectedHospital) {
      addToast('Please select a matching hospital to forward this surgery request', 'warning');
      return;
    }

    const email = selectedHospital.notificationEmail || selectedHospital.contactEmail;
    const subject = encodeURIComponent(generateEmailSubject());
    const body = encodeURIComponent(generateEmailBody());
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    window.open(mailtoUrl, '_blank');

    // Record Forwarding in state
    onForwardRequest({
      patientId: patient.patientId,
      hospital: selectedHospital,
      method: 'Email',
      target: email
    });

    addToast(`Surgery request referral email created for ${selectedHospital.name}!`, 'success');
    setActiveModalTab('response');
  };

  // Handler: Direct / System Forwarding
  const handleDirectRecordForward = (method = 'System Dispatch') => {
    if (!selectedHospital) {
      addToast('Please select a matching hospital', 'warning');
      return;
    }

    onForwardRequest({
      patientId: patient.patientId,
      hospital: selectedHospital,
      method: method || selectedHospital.preferredNotification,
      target:
        selectedHospital.preferredNotification === 'WhatsApp'
          ? selectedHospital.whatsappNumber
          : selectedHospital.notificationEmail
    });

    addToast(
      `Inquiry officially assigned & recorded for ${selectedHospital.name}!`,
      'success'
    );
    setActiveModalTab('response');
  };

  // Handler: Submit Hospital Response
  const handleSaveResponse = (e) => {
    e.preventDefault();
    if (!doctorRemarks.trim() && !quotationAmount.trim()) {
      addToast('Please enter quotation amount or hospital doctor remarks', 'warning');
      return;
    }

    onUpdateHospitalResponse({
      patientId: patient.patientId,
      status: responseStatus,
      quotation: quotationAmount ? `₹${quotationAmount.replace(/[^\d,]/g, '')}` : null,
      scheduledDate: scheduledDate || null,
      remarks: doctorRemarks
    });

    addToast(`Hospital response recorded: ${responseStatus}`, 'success');
    setDoctorRemarks('');
    setQuotationAmount('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${patient.patientName} — Surgery Referral & Hospital Coordination`}
      subtitle={`Inquiry ID: ${patient.patientId} • ${patient.cityName} • ${patient.urgency}`}
      maxWidth="max-w-4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={() => downloadSurgeryPatientsExcel([patient])}
            className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export to Excel</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-5 text-xs sm:text-sm">
        {/* TOP BANNER: REQUIRED OPERATION & PATIENT INFO */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-teal-50 via-white to-brand-slate-50 border border-brand-teal-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-teal-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-teal-600" />
                Required Surgical Operation
              </span>
              <h2 className="text-lg sm:text-xl font-black text-brand-navy-950 mt-1">
                {patient.neededSurgery}
              </h2>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-brand-teal-800 border border-brand-teal-200">
                  Category: {patient.surgeryCategory}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                  patient.urgency === 'High Priority'
                    ? 'bg-brand-coral-50 text-brand-coral-700 border border-brand-coral-200'
                    : 'bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-200'
                }`}>
                  {patient.urgency}
                </span>
                {patient.estimatedCost && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Est. Budget: {patient.estimatedCost}
                  </span>
                )}
              </div>
            </div>

            {/* Current Referral Status Pill */}
            <div className="sm:text-right bg-white p-3 rounded-xl border border-brand-slate-200 sm:min-w-[210px]">
              <span className="text-[10px] text-brand-slate-400 font-bold uppercase tracking-wider block">
                Hospital Forwarding Status
              </span>
              <div className="mt-1 flex items-center sm:justify-end gap-1.5 font-black text-sm">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isAlreadyForwarded ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`} />
                <span className={isAlreadyForwarded ? 'text-emerald-800' : 'text-amber-800'}>
                  {patient.forwardStatus || 'Ready to Forward'}
                </span>
              </div>
              {patient.forwardedHospital && (
                <p className="text-[11px] font-bold text-brand-teal-700 mt-0.5 truncate">
                  → {patient.forwardedHospital.hospitalName}
                </p>
              )}
            </div>
          </div>

          {/* Patient Contact & Clinical Remarks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-3.5 border-t border-brand-teal-100 text-xs">
            <div className="bg-white/80 p-2.5 rounded-xl border border-brand-slate-200">
              <span className="text-brand-slate-400 text-[10px] uppercase font-bold block">Patient Details</span>
              <p className="font-bold text-brand-navy-950 mt-0.5">
                {patient.patientName} ({patient.age} yrs, {patient.gender})
              </p>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-brand-slate-200">
              <span className="text-brand-slate-400 text-[10px] uppercase font-bold block">Contact Information</span>
              <p className="font-bold text-brand-teal-700 mt-0.5 flex items-center gap-1">
                <Phone className="w-3 h-3 text-brand-teal-600" />
                <span>{patient.mobileNumber}</span>
              </p>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-brand-slate-200">
              <span className="text-brand-slate-400 text-[10px] uppercase font-bold block">City & Hub Location</span>
              <p className="font-bold text-brand-navy-900 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-brand-coral-600" />
                <span>{patient.cityName}</span>
              </p>
            </div>
          </div>

          {patient.notes && (
            <div className="mt-3 p-2.5 rounded-xl bg-white/70 border border-brand-slate-200/90 text-[11px] text-brand-slate-700">
              <span className="font-bold text-brand-slate-900 mr-1">Clinical Remarks:</span>
              {patient.notes}
            </div>
          )}
        </div>

        {/* WORKFLOW TABS: MATCHING HOSPITALS | ENQUIRY PREVIEW | HOSPITAL RESPONSE TRACKER */}
        <div className="border-b border-brand-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            <button
              type="button"
              onClick={() => setActiveModalTab('matching')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeModalTab === 'matching'
                  ? 'border-brand-teal-600 text-brand-teal-800 bg-brand-teal-50/70 font-black'
                  : 'border-transparent text-brand-slate-600 hover:text-brand-navy-950 hover:bg-brand-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>1. Matching Hospitals ({matchingActiveHospitals.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModalTab('preview')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeModalTab === 'preview'
                  ? 'border-brand-teal-600 text-brand-teal-800 bg-brand-teal-50/70 font-black'
                  : 'border-transparent text-brand-slate-600 hover:text-brand-navy-950 hover:bg-brand-slate-50'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>2. Preview Enquiry & Forward</span>
              {selectedHospital && (
                <span className="px-1.5 py-0.2 rounded bg-brand-teal-200 text-brand-teal-900 text-[10px]">
                  {selectedHospital.name.split(' ')[0]}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveModalTab('response')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeModalTab === 'response'
                  ? 'border-brand-teal-600 text-brand-teal-800 bg-brand-teal-50/70 font-black'
                  : 'border-transparent text-brand-slate-600 hover:text-brand-navy-950 hover:bg-brand-slate-50'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>3. Hospital Response Tracker</span>
              {patient.hospitalResponse && patient.hospitalResponse !== 'Pending' && (
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ✓ Recorded
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: MATCHING HOSPITALS SELECTION */}
        {activeModalTab === 'matching' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h3 className="text-sm font-black text-brand-navy-950">
                  Recommended Active Hospitals for "{patient.neededSurgery}"
                </h3>
                <p className="text-xs text-brand-slate-500">
                  Only <strong>Active</strong> hospitals registered for matching surgery specializations are suggested.
                </p>
              </div>

              {selectedHospital && (
                <button
                  type="button"
                  onClick={() => setActiveModalTab('preview')}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
                >
                  <span>Preview Enquiry ({selectedHospital.name})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* List of Matching Active Hospitals */}
            {matchingActiveHospitals.length === 0 ? (
              <div className="p-8 text-center bg-brand-slate-50 rounded-2xl border border-brand-slate-200">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h4 className="font-extrabold text-brand-navy-950 text-sm">
                  No Active Hospitals Match this Specialty Directly
                </h4>
                <p className="text-xs text-brand-slate-500 mt-1 max-w-md mx-auto">
                  Please onboard a partner hospital with specializations for {patient.surgeryCategory} in the Hospital Management tab.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {matchingActiveHospitals.map((hospital) => {
                  const isSelected = selectedHospitalId === hospital.id;
                  const isCurrentlyAssigned =
                    patient.forwardedHospital?.hospitalId === hospital.id;

                  return (
                    <div
                      key={hospital.id}
                      onClick={() => setSelectedHospitalId(hospital.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-br from-brand-teal-50/80 to-white border-brand-teal-600 ring-2 ring-brand-teal-500/20 shadow-md'
                          : 'bg-white border-brand-slate-200/90 hover:border-brand-teal-300 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Hospital Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`p-2 rounded-xl border ${
                              isSelected
                                ? 'bg-brand-teal-600 text-white border-brand-teal-600'
                                : 'bg-brand-teal-50 text-brand-teal-700 border-brand-teal-200'
                            }`}>
                              <Building2 className="w-4 h-4" />
                            </span>
                            <div>
                              <div className="font-black text-brand-navy-950 text-sm flex items-center gap-1.5 flex-wrap">
                                <span>{hospital.name}</span>
                                {isCurrentlyAssigned && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    Current Referral
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-brand-slate-500 font-medium">
                                {hospital.type}
                              </p>
                            </div>
                          </div>

                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-brand-teal-600 bg-brand-teal-600 text-white'
                              : 'border-brand-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Location & Contact Summary */}
                        <div className="mt-3 space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-brand-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-brand-coral-600 flex-shrink-0" />
                            <span className="truncate">{hospital.city} • {hospital.address}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-brand-slate-600">
                            <Phone className="w-3.5 h-3.5 text-brand-teal-600 flex-shrink-0" />
                            <span>{hospital.contactPerson} ({hospital.contactMobile})</span>
                          </div>
                        </div>

                        {/* Matching Specializations Badges */}
                        <div className="mt-3 pt-2.5 border-t border-brand-slate-100">
                          <span className="text-[10px] font-bold text-brand-slate-400 uppercase tracking-wider block mb-1">
                            Matching Specializations
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {hospital.matchedSpecializations?.map((spec) => (
                              <span
                                key={spec}
                                className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200"
                              >
                                ✓ {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer: Notification Method badge */}
                      <div className="mt-3.5 pt-2 border-t border-brand-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-brand-slate-500 font-semibold flex items-center gap-1">
                          {hospital.preferredNotification === 'WhatsApp' && <MessageSquare className="w-3 h-3 text-emerald-600" />}
                          {hospital.preferredNotification === 'Email' && <Mail className="w-3 h-3 text-blue-600" />}
                          {hospital.preferredNotification === 'Both' && <Share2 className="w-3 h-3 text-brand-teal-600" />}
                          <span>Notification: <strong>{hospital.preferredNotification}</strong></span>
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedHospitalId(hospital.id);
                            setActiveModalTab('preview');
                          }}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-brand-teal-600 text-white'
                              : 'bg-brand-slate-100 text-brand-slate-700 hover:bg-brand-slate-200'
                          }`}
                        >
                          Select & Preview
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Inactive Hospital Exclusion Transparency Notice */}
            {matchingInactiveHospitals.length > 0 && (
              <div className="p-3.5 rounded-xl bg-brand-slate-100/80 border border-brand-slate-200/90 text-xs text-brand-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-brand-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-brand-slate-800">
                    System Policy: Inactive Hospitals Excluded
                  </p>
                  <p className="text-[11px] text-brand-slate-500 mt-0.5">
                    {matchingInactiveHospitals.map((h) => h.name).join(', ')} also matches these specializations, but is currently marked <strong>Inactive</strong> and therefore strictly ineligible for referral recommendations.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PREVIEW PATIENT ENQUIRY & FORWARD DISPATCH */}
        {activeModalTab === 'preview' && (
          <div className="space-y-4">
            {selectedHospital ? (
              <>
                {/* Target Hospital Header */}
                <div className="p-4 rounded-xl bg-brand-slate-50 border border-brand-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-brand-teal-600 text-white">
                      <Building2 className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="font-black text-brand-navy-950 text-base">
                        {selectedHospital.name}
                      </div>
                      <p className="text-xs text-brand-slate-600">
                        {selectedHospital.type} • {selectedHospital.city} • Coordinator: {selectedHospital.contactPerson}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalTab('matching')}
                      className="px-3 py-1.5 text-xs font-bold text-brand-slate-600 hover:text-brand-navy-900 bg-white border border-brand-slate-200 rounded-xl"
                    >
                      Change Hospital
                    </button>
                  </div>
                </div>

                {/* Channel Switcher */}
                <div className="flex items-center gap-2 border-b border-brand-slate-200 pb-2">
                  <span className="text-xs font-bold text-brand-slate-600">Preview Channel:</span>
                  <button
                    type="button"
                    onClick={() => setPreviewChannel('whatsapp')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      previewChannel === 'whatsapp'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-brand-slate-100 text-brand-slate-700 hover:bg-brand-slate-200'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Message</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewChannel('email')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      previewChannel === 'email'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-brand-slate-100 text-brand-slate-700 hover:bg-brand-slate-200'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Referral</span>
                  </button>
                </div>

                {/* PREVIEW CONTAINER */}
                {previewChannel === 'whatsapp' ? (
                  <div className="space-y-3">
                    <div className="bg-[#EFEAE2] p-4 sm:p-5 rounded-2xl border border-brand-slate-300/80 shadow-inner max-w-xl mx-auto">
                      <div className="bg-[#075E54] text-white px-3.5 py-2 rounded-t-xl flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-300" />
                          <span>WhatsApp to: {selectedHospital.name}</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-200">
                          {selectedHospital.whatsappNumber || selectedHospital.contactMobile}
                        </span>
                      </div>

                      <div className="bg-white p-4 rounded-b-xl border border-t-0 border-[#075E54]/20 shadow-xs">
                        <pre className="font-sans text-xs text-brand-navy-950 whitespace-pre-wrap leading-relaxed select-all">
                          {generateWhatsAppMessage()}
                        </pre>
                        <div className="text-right text-[10px] text-brand-slate-400 mt-2 font-mono">
                          Just now • MediUnify Verified Referral ✓✓
                        </div>
                      </div>
                    </div>

                    {/* Forward Action Buttons for WhatsApp */}
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleDispatchWhatsApp}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Send via WhatsApp Web / App</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDirectRecordForward('WhatsApp')}
                        className="px-4 py-2.5 rounded-xl bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-slate-700 font-bold text-xs border border-brand-slate-300 transition-colors"
                      >
                        Log as Forwarded (No App)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* EMAIL PREVIEW */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-slate-300 shadow-xs max-w-2xl mx-auto space-y-3">
                      <div className="space-y-1.5 pb-3 border-b border-brand-slate-200 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-slate-500 w-16">To:</span>
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            {selectedHospital.notificationEmail || selectedHospital.contactEmail}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-slate-500 w-16">Subject:</span>
                          <span className="font-extrabold text-brand-navy-950">
                            {generateEmailSubject()}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-brand-slate-50 rounded-xl border border-brand-slate-200">
                        <pre className="font-mono text-xs text-brand-navy-900 whitespace-pre-wrap leading-relaxed select-all">
                          {generateEmailBody()}
                        </pre>
                      </div>
                    </div>

                    {/* Forward Action Buttons for Email */}
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleDispatchEmail}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Open in Email Client (Mailto)</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDirectRecordForward('Email')}
                        className="px-4 py-2.5 rounded-xl bg-brand-slate-100 hover:bg-brand-slate-200 text-brand-slate-700 font-bold text-xs border border-brand-slate-300 transition-colors"
                      >
                        Log as Forwarded (No Client)
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center bg-brand-slate-50 rounded-2xl border border-brand-slate-200">
                <p className="font-bold text-brand-navy-900">
                  Please select a matching hospital from Step 1 first.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModalTab('matching')}
                  className="mt-2 text-xs font-bold text-brand-teal-700 hover:underline"
                >
                  View Matching Hospitals
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HOSPITAL RESPONSE TRACKER & TIMELINE */}
        {activeModalTab === 'response' && (
          <div className="space-y-4">
            <div className="bg-brand-slate-50/80 p-4 sm:p-5 rounded-2xl border border-brand-slate-200/90 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h3 className="text-sm font-black text-brand-navy-950 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brand-teal-600" />
                    <span>Hospital Response & Progress Tracking</span>
                  </h3>
                  <p className="text-xs text-brand-slate-500">
                    Track hospital feedback, package quotations, doctor consultations, or admissions
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-brand-slate-400 font-bold block uppercase">
                    Current Hospital
                  </span>
                  <span className="text-xs font-black text-brand-navy-900">
                    {patient.forwardedHospital?.hospitalName || selectedHospital?.name || 'A R Hospital'}
                  </span>
                </div>
              </div>

              {/* Response Update Form */}
              <form onSubmit={handleSaveResponse} className="space-y-3.5 bg-white p-4 rounded-xl border border-brand-slate-200 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                      Hospital Response Status
                    </label>
                    <select
                      value={responseStatus}
                      onChange={(e) => setResponseStatus(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                    >
                      <option value="Quotation Received">Quotation Received</option>
                      <option value="Consultation Scheduled">Consultation Scheduled</option>
                      <option value="Accepted & Scheduled for Surgery">Accepted & Scheduled for Surgery</option>
                      <option value="Doctor Assigned (Assessment Underway)">Doctor Assigned</option>
                      <option value="Declined (Bed / OT Unavailable)">Declined / Unavailable</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                      Quotation Amount (INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate-400 text-xs font-bold">
                        ₹
                      </span>
                      <input
                        type="text"
                        value={quotationAmount}
                        onChange={(e) => setQuotationAmount(e.target.value)}
                        placeholder="e.g. 1,85,000"
                        className="w-full pl-7 pr-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                      Consultation / Procedure Date
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy-900 mb-1">
                    Doctor Remarks / Hospital Notes
                  </label>
                  <textarea
                    rows="2"
                    value={doctorRemarks}
                    onChange={(e) => setDoctorRemarks(e.target.value)}
                    placeholder="e.g. Dr. Arvind Rao reviewed X-Ray; package includes 4 days room, ceramic-polyethylene implant, physiotherapy..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Record Hospital Response</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Request Activity History Timeline */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-slate-200 space-y-3">
              <h4 className="text-xs font-black text-brand-navy-950 uppercase tracking-wider">
                Referral & Activity Timeline
              </h4>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-brand-slate-200">
                {(patient.timeline && patient.timeline.length > 0 ? patient.timeline : [
                  {
                    status: 'Inquiry Registered',
                    timestamp: patient.requestedDate,
                    note: `Patient inquiry recorded for ${patient.neededSurgery}.`
                  }
                ]).map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3 pl-1">
                    <span className="w-6 h-6 rounded-full bg-brand-teal-600 text-white flex items-center justify-center text-[10px] font-black z-10 flex-shrink-0">
                      ✓
                    </span>
                    <div className="flex-1 bg-brand-slate-50 p-3 rounded-xl border border-brand-slate-200">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-brand-navy-950 text-xs">
                          {step.status}
                        </span>
                        <span className="text-[10px] text-brand-slate-400 font-mono">
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-brand-slate-600 mt-1">
                        {step.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
