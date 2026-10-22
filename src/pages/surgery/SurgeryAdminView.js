import React, { useState, useEffect } from 'react';
import {
  Activity,
  Building2,
  Users,
  Plus,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import FormInput from '../../components/forms/FormInput';
import SelectInput from '../../components/forms/SelectInput';

// Datasets & Utilities
import {
  INITIAL_SURGERY_PATIENTS,
  INITIAL_HOSPITALS,
  SURGERY_CATEGORIES,
  MULTI_CITY_SURGERY_LOCALITIES
} from '../../data/surgeryData';

// Internal Views
import SurgeryRequestsView from './views/SurgeryRequestsView';
import HospitalManagementView from './views/HospitalManagementView';

// Modals
import AddEditHospitalModal from './components/AddEditHospitalModal';
import HospitalDetailsModal from './components/HospitalDetailsModal';
import PatientSurgeryDetailModal from './components/PatientSurgeryDetailModal';

export default function SurgeryAdminView() {
  const { activeModule, setActiveModule } = useAuth();
  const { addToast } = useToast();

  // Centralized Datasets State
  const [patients, setPatients] = useState(INITIAL_SURGERY_PATIENTS);
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);

  // Internal Active Tab: 'requests' | 'hospitals'
  const [activeTab, setActiveTab] = useState(() => {
    if (activeModule === 'hospitals' || activeModule === 'hospital-management') {
      return 'hospitals';
    }
    return 'requests';
  });

  // Keep internal tab in sync with sidebar activeModule
  useEffect(() => {
    if (activeModule === 'hospitals' || activeModule === 'hospital-management') {
      setActiveTab('hospitals');
    } else if (activeModule === 'requests' || activeModule === 'dashboard' || activeModule === 'surgeries') {
      setActiveTab('requests');
    }
  }, [activeModule]);

  // Tab switch handler
  const handleSwitchTab = (tab) => {
    setActiveTab(tab);
    if (setActiveModule) {
      setActiveModule(tab);
    }
  };

  // Modals state
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [modalHospitalId, setModalHospitalId] = useState(null);
  const [modalInitialTab, setModalInitialTab] = useState(null);

  const handleOpenPatientDetail = (patient, targetHospitalId = null, targetTab = null) => {
    setViewingPatient(patient);
    setModalHospitalId(targetHospitalId);
    setModalInitialTab(targetTab);
  };

  const [isAddHospitalOpen, setIsAddHospitalOpen] = useState(false);
  const [hospitalToEdit, setHospitalToEdit] = useState(null);
  const [viewingHospital, setViewingHospital] = useState(null);

  // New Patient Form State
  const [newPatientForm, setNewPatientForm] = useState({
    patientName: '',
    age: '',
    gender: 'Female',
    neededSurgery: '',
    surgeryCategory: 'General Surgery',
    cityName: 'Mysore (Gokulam)',
    mobileNumber: '',
    email: '',
    requestedDate: new Date().toISOString().split('T')[0],
    urgency: 'Elective',
    estimatedCost: '',
    notes: ''
  });

  // Handler: Register New Patient Inquiry
  const handleSavePatient = (e) => {
    e.preventDefault();
    if (!newPatientForm.patientName || !newPatientForm.mobileNumber || !newPatientForm.neededSurgery) {
      addToast('Please fill in patient name, needed surgery, and mobile number', 'warning');
      return;
    }

    const prefix = newPatientForm.cityName.startsWith('Bangalore')
      ? 'BLR'
      : newPatientForm.cityName.startsWith('Mandya')
      ? 'MDY'
      : 'MY';

    const newEntry = {
      ...newPatientForm,
      patientId: `${prefix}-SURG-2026-${Math.floor(100 + Math.random() * 900)}`,
      cityName: newPatientForm.cityName || 'Mysore (Gokulam)',
      age: Number(newPatientForm.age) || 35,
      forwardStatus: 'Not Forwarded',
      forwardedHospital: null,
      hospitalResponse: 'Pending',
      hospitalResponseNotes: '',
      timeline: [
        {
          status: 'Inquiry Registered',
          timestamp: 'Just now (14 Oct 2026)',
          note: `Surgery request registered for ${newPatientForm.neededSurgery}.`
        }
      ]
    };

    setPatients((prev) => [newEntry, ...prev]);
    addToast(`Surgery inquiry registered for ${newPatientForm.patientName}`, 'success');
    setIsAddPatientOpen(false);
    setNewPatientForm({
      patientName: '',
      age: '',
      gender: 'Female',
      neededSurgery: '',
      surgeryCategory: 'General Surgery',
      cityName: 'Mysore (Gokulam)',
      mobileNumber: '',
      email: '',
      requestedDate: new Date().toISOString().split('T')[0],
      urgency: 'Elective',
      estimatedCost: '',
      notes: ''
    });
  };

  // Handler: Save or Edit Hospital
  const handleSaveHospital = (hospitalData) => {
    if (hospitalData.id) {
      // Edit existing hospital
      setHospitals((prev) =>
        prev.map((h) => (h.id === hospitalData.id ? { ...h, ...hospitalData } : h))
      );
      addToast(`Hospital details for ${hospitalData.name} updated!`, 'success');
    } else {
      // Add new hospital
      const cityPrefix = hospitalData.city.startsWith('Bangalore')
        ? 'BLR'
        : hospitalData.city.startsWith('Mandya')
        ? 'MDY'
        : 'MY';

      const newHospital = {
        ...hospitalData,
        id: `HOSP-${cityPrefix}-${Math.floor(100 + Math.random() * 900)}`,
        rating: 4.8,
        totalSurgeriesCompleted: 0,
        onboardedDate: new Date().toISOString().split('T')[0]
      };

      setHospitals((prev) => [newHospital, ...prev]);
      addToast(`Hospital "${hospitalData.name}" onboarded successfully!`, 'success');
    }

    setIsAddHospitalOpen(false);
    setHospitalToEdit(null);
  };

  // Handler: Activate or Deactivate Hospital
  const handleToggleHospitalStatus = (targetHospital) => {
    const newStatus = targetHospital.status === 'Active' ? 'Inactive' : 'Active';

    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id === targetHospital.id) {
          return {
            ...h,
            status: newStatus,
            statusReason:
              newStatus === 'Inactive'
                ? 'Deactivated by Admin. Excluded from surgery inquiry matching.'
                : ''
          };
        }
        return h;
      })
    );

    if (newStatus === 'Active') {
      addToast(`${targetHospital.name} activated for surgery referrals!`, 'success');
    } else {
      addToast(
        `${targetHospital.name} deactivated. Remains in directory but excluded from matching suggestions.`,
        'warning'
      );
    }
  };

  // Handler: Forward Patient Surgery Request to Hospital
  const handleForwardRequest = ({ patientId, hospital, method, target }) => {
    const timestampStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    setPatients((prev) =>
      prev.map((p) => {
        if (p.patientId === patientId) {
          const updatedTimeline = [
            ...(p.timeline || []),
            {
              status: `Forwarded to ${hospital.name}`,
              timestamp: timestampStr,
              note: `Enquiry dispatched via ${method} (${target}). Awaiting hospital quotation / consultation response.`
            }
          ];

          const updatedPatient = {
            ...p,
            forwardStatus: 'Forwarded',
            forwardedHospital: {
              hospitalId: hospital.id,
              hospitalName: hospital.name,
              method: method || 'WhatsApp',
              sentAt: timestampStr,
              target: target || hospital.whatsappNumber || hospital.notificationEmail
            },
            hospitalResponse: 'Pending Response',
            timeline: updatedTimeline
          };

          // Also update viewingPatient if currently open
          if (viewingPatient?.patientId === patientId) {
            setViewingPatient(updatedPatient);
          }

          return updatedPatient;
        }
        return p;
      })
    );
  };

  // Handler: Update Hospital Response (Quotation, Consultation Date, Remarks)
  const handleUpdateHospitalResponse = ({
    patientId,
    status,
    quotation,
    scheduledDate,
    remarks
  }) => {
    const timestampStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    setPatients((prev) =>
      prev.map((p) => {
        if (p.patientId === patientId) {
          const noteDetails = [
            quotation ? `Quotation: ${quotation}` : null,
            scheduledDate ? `Scheduled Date: ${scheduledDate}` : null,
            remarks || null
          ]
            .filter(Boolean)
            .join(' • ');

          const updatedTimeline = [
            ...(p.timeline || []),
            {
              status: status,
              timestamp: timestampStr,
              note: noteDetails || 'Hospital status updated.'
            }
          ];

          const updatedPatient = {
            ...p,
            hospitalResponse: status,
            hospitalResponseNotes: noteDetails,
            timeline: updatedTimeline
          };

          if (viewingPatient?.patientId === patientId) {
            setViewingPatient(updatedPatient);
          }

          return updatedPatient;
        }
        return p;
      })
    );
  };

  // Open Edit Hospital modal
  const handleOpenEditHospital = (hosp) => {
    setHospitalToEdit(hosp);
    setIsAddHospitalOpen(true);
  };

  // Open View Hospital modal
  const handleOpenViewHospital = (hosp) => {
    setViewingHospital(hosp);
  };

  return (
    <div className="space-y-6 animate-fade-in text-brand-navy-900">
      {/* INTERNAL SURGERY MODULE TABS NAVIGATION */}
      <div className="bg-white p-2 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-brand-slate-100 rounded-xl">
          {/* Tab 1: Surgery Requests */}
          <button
            type="button"
            onClick={() => handleSwitchTab('requests')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'bg-brand-teal-600 text-white shadow-xs font-black'
                : 'text-brand-slate-600 hover:text-brand-navy-950 hover:bg-brand-slate-200/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Surgery Requests</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                activeTab === 'requests'
                  ? 'bg-white/20 text-white'
                  : 'bg-brand-slate-200 text-brand-slate-700'
              }`}
            >
              {patients.length}
            </span>
          </button>

          {/* Tab 2: Hospital Management */}
          <button
            type="button"
            onClick={() => handleSwitchTab('hospitals')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'hospitals'
                ? 'bg-brand-teal-600 text-white shadow-xs font-black'
                : 'text-brand-slate-600 hover:text-brand-navy-950 hover:bg-brand-slate-200/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Hospital Management</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                activeTab === 'hospitals'
                  ? 'bg-white/20 text-white'
                  : 'bg-brand-slate-200 text-brand-slate-700'
              }`}
            >
              {hospitals.length}
            </span>
          </button>
        </div>

        {/* Tab Telemetry Badge */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-brand-slate-600 pr-3">
          <span className="w-2 h-2 rounded-full bg-brand-teal-500 animate-pulse" />
          <span>Surgery Module</span>
          <span className="text-brand-slate-300">•</span>
          <span className="text-brand-teal-800 flex items-center gap-2">
            {activeTab === 'requests' ? (
              <>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  {patients.filter((p) => p.forwardStatus !== 'Forwarded').length} New Requests
                </span>
                <span className="text-brand-slate-300">•</span>
                <span>{patients.filter((p) => p.forwardStatus === 'Forwarded').length} Referred</span>
              </>
            ) : (
              `${hospitals.filter((h) => h.status === 'Active').length} Active Hospitals`
            )}
          </span>
        </div>
      </div>

      {/* RENDER ACTIVE TAB VIEW */}
      {activeTab === 'requests' ? (
        <SurgeryRequestsView
          patients={patients}
          hospitals={hospitals}
          onOpenAddPatient={() => setIsAddPatientOpen(true)}
          onOpenPatientDetail={handleOpenPatientDetail}
        />
      ) : (
        <HospitalManagementView
          hospitals={hospitals}
          patients={patients}
          onOpenAddHospital={() => {
            setHospitalToEdit(null);
            setIsAddHospitalOpen(true);
          }}
          onOpenEditHospital={handleOpenEditHospital}
          onOpenViewHospital={handleOpenViewHospital}
          onToggleHospitalStatus={handleToggleHospitalStatus}
        />
      )}

      {/* MODAL 1: PATIENT SURGERY DETAIL, MATCHING HOSPITALS & FORWARDING */}
      <PatientSurgeryDetailModal
        isOpen={Boolean(viewingPatient)}
        onClose={() => {
          setViewingPatient(null);
          setModalHospitalId(null);
          setModalInitialTab(null);
        }}
        patient={viewingPatient}
        hospitals={hospitals}
        initialHospitalId={modalHospitalId}
        initialTab={modalInitialTab}
        onForwardRequest={handleForwardRequest}
        onUpdateHospitalResponse={handleUpdateHospitalResponse}
      />

      {/* MODAL 2: ADD / EDIT HOSPITAL */}
      <AddEditHospitalModal
        isOpen={isAddHospitalOpen}
        onClose={() => {
          setIsAddHospitalOpen(false);
          setHospitalToEdit(null);
        }}
        onSave={handleSaveHospital}
        hospitalToEdit={hospitalToEdit}
      />

      {/* MODAL 3: VIEW HOSPITAL DETAILS */}
      <HospitalDetailsModal
        isOpen={Boolean(viewingHospital)}
        onClose={() => setViewingHospital(null)}
        hospital={viewingHospital}
        onEdit={handleOpenEditHospital}
        onToggleStatus={handleToggleHospitalStatus}
        referredPatients={patients.filter(
          (p) => p.forwardedHospital?.hospitalId === viewingHospital?.id
        )}
      />

      {/* MODAL 4: ADD NEW PATIENT SURGERY INQUIRY */}
      <Modal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        title="New Surgery Order / Patient Inquiry"
        subtitle="Enter required surgery operation, locality (Mysore, Bangalore, Mandya), and mobile number"
        maxWidth="max-w-xl"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsAddPatientOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-surgery-patient-form"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all active:scale-[0.98]"
            >
              Save & Register Order
            </button>
          </div>
        }
      >
        <form
          id="add-surgery-patient-form"
          onSubmit={handleSavePatient}
          className="space-y-3.5 text-xs sm:text-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <FormInput
                label="Patient Full Name"
                id="patientName"
                value={newPatientForm.patientName}
                onChange={(e) =>
                  setNewPatientForm({ ...newPatientForm, patientName: e.target.value })
                }
                placeholder="e.g. Ramesh Gowda"
                required
              />
            </div>
            <div>
              <FormInput
                label="Age"
                id="age"
                type="number"
                value={newPatientForm.age}
                onChange={(e) =>
                  setNewPatientForm({ ...newPatientForm, age: e.target.value })
                }
                placeholder="e.g. 45"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Needed Surgery / Procedure"
              id="neededSurgery"
              value={newPatientForm.neededSurgery}
              onChange={(e) =>
                setNewPatientForm({ ...newPatientForm, neededSurgery: e.target.value })
              }
              placeholder="e.g. Total Knee Replacement (TKR)"
              required
            />
            <SelectInput
              label="Surgery Category"
              id="surgeryCategory"
              value={newPatientForm.surgeryCategory}
              onChange={(e) =>
                setNewPatientForm({ ...newPatientForm, surgeryCategory: e.target.value })
              }
              options={SURGERY_CATEGORIES.filter((c) => c !== 'All Categories')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectInput
              label="Area / City Hub"
              id="cityName"
              value={newPatientForm.cityName}
              onChange={(e) =>
                setNewPatientForm({ ...newPatientForm, cityName: e.target.value })
              }
              options={MULTI_CITY_SURGERY_LOCALITIES.filter((l) => l !== 'All Localities')}
            />
            <FormInput
              label="Mobile Number"
              id="mobileNumber"
              value={newPatientForm.mobileNumber}
              onChange={(e) =>
                setNewPatientForm({ ...newPatientForm, mobileNumber: e.target.value })
              }
              placeholder="+91 98450 12345"
              icon={Phone}
              required
            />
          </div>

          <FormInput
            label="Email Address (Optional)"
            id="email"
            type="email"
            value={newPatientForm.email}
            onChange={(e) =>
              setNewPatientForm({ ...newPatientForm, email: e.target.value })
            }
            placeholder="patient@gmail.com"
            icon={Mail}
          />

          <div>
            <label className="block text-xs font-bold text-brand-navy-900 mb-1">
              Clinical Remarks / Complaints
            </label>
            <textarea
              rows="2"
              value={newPatientForm.notes}
              onChange={(e) =>
                setNewPatientForm({ ...newPatientForm, notes: e.target.value })
              }
              placeholder="Enter patient complaints, X-ray status, locality landmark..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 text-brand-navy-900"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
