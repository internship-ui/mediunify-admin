import React, { useState, useMemo } from 'react';
import {
  Activity,
  FileText,
  Users,
  Calendar,
  Receipt,
  Plus,
  Download,
  FileSpreadsheet,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Clock,
  Eye,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Building2
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Modal from '../../components/common/Modal';
import FormInput from '../../components/forms/FormInput';
import SelectInput from '../../components/forms/SelectInput';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  SURGERY_STATS,
  SURGERY_CITIES,
  SURGERY_CATEGORIES,
  MULTI_CITY_SURGERY_LOCALITIES,
  INITIAL_SURGERY_PATIENTS,
  downloadSurgeryPatientsExcel
} from '../../data/surgeryData';
import { exportToPDF, filterDataByDate } from '../../utils/reportExportEngine';

export default function SurgeryAdminView() {
  const { addToast } = useToast();

  const [patients, setPatients] = useState(INITIAL_SURGERY_PATIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All Cities');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocality, setSelectedLocality] = useState('All Localities');
  const [datePreset, setDatePreset] = useState('all');

  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [viewingPatient, setViewingPatient] = useState(null);

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

  // Extract unique areas filtered by selected city
  const availableLocalities = useMemo(() => {
    let filtered = MULTI_CITY_SURGERY_LOCALITIES;
    if (selectedCityFilter !== 'All Cities') {
      filtered = MULTI_CITY_SURGERY_LOCALITIES.filter(
        (loc) => loc === 'All Localities' || loc.startsWith(selectedCityFilter)
      );
    }
    return filtered;
  }, [selectedCityFilter]);

  // Filtered patients list based on Search & City & Locality & Category & Date
  const filteredPatients = useMemo(() => {
    let result = filterDataByDate(patients, 'requestedDate', datePreset);

    return result.filter((p) => {
      const matchesSearch =
        p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.neededSurgery.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mobileNumber.includes(searchTerm) ||
        p.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patientId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCity =
        selectedCityFilter === 'All Cities' || p.cityName.toLowerCase().includes(selectedCityFilter.toLowerCase());

      const matchesLocality =
        selectedLocality === 'All Localities' || p.cityName === selectedLocality;

      const matchesCategory =
        selectedCategory === 'All Categories' || p.surgeryCategory === selectedCategory;

      return matchesSearch && matchesCity && matchesLocality && matchesCategory;
    });
  }, [patients, searchTerm, selectedCityFilter, selectedLocality, selectedCategory, datePreset]);

  // Unique active localities count
  const activeLocalitiesCount = useMemo(() => {
    const areas = new Set(patients.map((p) => p.cityName));
    return areas.size;
  }, [patients]);

  // Handle Excel Download
  const handleDownloadExcel = () => {
    if (filteredPatients.length === 0) {
      addToast('No patient records to export matching current filters', 'warning');
      return;
    }
    downloadSurgeryPatientsExcel(filteredPatients);
    addToast(
      `Excel Sheet downloaded with ${filteredPatients.length} patient records (Needed Surgeries, Localities & Contact Numbers).`,
      'success'
    );
  };

  // Handle PDF Download
  const handleDownloadPDF = () => {
    if (filteredPatients.length === 0) {
      addToast('No patient records to export matching current filters', 'warning');
      return;
    }

    const cols = [
      { header: 'Patient ID', key: 'patientId' },
      { header: 'Patient Name', key: 'patientName' },
      { header: 'Needed Surgery', key: 'neededSurgery' },
      { header: 'Category', key: 'surgeryCategory' },
      { header: 'Location / City', key: 'cityName' },
      { header: 'Mobile Number', key: 'mobileNumber' },
      { header: 'Urgency', key: 'urgency' },
      { header: 'Estimated Cost', key: 'estimatedCost' }
    ];

    exportToPDF({
      filename: `MediUnify_Surgery_Patients_${new Date().toISOString().slice(0, 10)}.pdf`,
      title: 'Surgical Care & Patient Inquiries Report',
      subtitle: 'Required Surgeries, Localities (Mysore • Bangalore • Mandya) & Patient Contacts',
      columns: cols,
      data: filteredPatients,
      summaryCards: [
        { label: 'Total Inquiries', value: filteredPatients.length },
        { label: 'High Priority', value: filteredPatients.filter((p) => p.urgency === 'High Priority').length },
        { label: 'Coverage Hubs', value: 'Mysore, Bangalore, Mandya' },
        { label: 'Avg Turnaround', value: '1.2 Days' }
      ],
      metadata: {
        portal: 'Surgical Care Hub (Mysore • Bangalore • Mandya)',
        dateRange: datePreset === 'all' ? 'All Registered Records' : datePreset
      }
    });

    addToast(
      `Branded PDF downloaded with ${filteredPatients.length} surgery patient cases.`,
      'success'
    );
  };

  // Handle Adding New Patient Surgery Request
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
      age: Number(newPatientForm.age) || 35
    };

    setPatients((prev) => [newEntry, ...prev]);
    addToast(`Surgery request registered for ${newPatientForm.patientName} (${newEntry.cityName})`, 'success');
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

  return (
    <div className="space-y-6 animate-fade-in text-brand-navy-900">
      {/* Top Banner & Multi-City Location Hub */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-brand-slate-200/90 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-teal-50 border border-brand-teal-200 text-brand-teal-700">
              <Activity className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight">
                  Surgical Care & Patient Inquiries
                </h1>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-coral-600" />
                  Mysore • Bangalore • Mandya Hub
                </span>
              </div>
              <p className="text-xs sm:text-sm text-brand-slate-600 mt-1">
                Centralized patient surgery inquiries across Mysore, Bangalore, and Mandya localities, needed procedures, mobile numbers & Excel export.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Main Excel Export Trigger */}
          <button
            onClick={handleDownloadExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all active:scale-[0.98]"
            title="Download Excel spreadsheet of patients with requested surgery and contact details"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download Excel (.xlsx)</span>
          </button>

          {/* Main PDF Export Trigger */}
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-brand-coral-600 hover:bg-brand-coral-700 rounded-xl shadow-xs transition-all active:scale-[0.98]"
            title="Download formatted PDF report of surgical care cases"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF (.pdf)</span>
          </button>

          <button
            onClick={() => setIsAddPatientOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-brand-slate-700 hover:text-brand-navy-900 bg-brand-slate-100 hover:bg-brand-slate-200 border border-brand-slate-200 rounded-xl transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-brand-teal-600" />
            <span>Add Patient Inquiry</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patient Inquiries"
          value={patients.length}
          change="Across Mysore, Bangalore & Mandya"
          isPositive={true}
          icon={Users}
          colorKey="teal"
        />
        <StatCard
          title="Active Localities"
          value={activeLocalitiesCount}
          change="Mysore, Bangalore & Mandya hubs"
          isPositive={true}
          icon={MapPin}
          colorKey="coral"
        />
        <StatCard
          title="High Priority Cases"
          value={patients.filter((p) => p.urgency === 'High Priority').length}
          change="Urgent surgical attention"
          isPositive={true}
          icon={Activity}
          colorKey="navy"
        />
        <StatCard
          title="Excel Export Pipeline"
          value="Active"
          change="Multi-City (.CSV / Excel)"
          isPositive={true}
          icon={FileSpreadsheet}
          colorKey="green"
        />
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200/90 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name, needed surgery, city/locality (Mysore, Bangalore, Mandya), mobile number..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500 transition-all text-brand-navy-900 bg-brand-slate-50/50"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* City Filter */}
          <select
            value={selectedCityFilter}
            onChange={(e) => {
              setSelectedCityFilter(e.target.value);
              setSelectedLocality('All Localities');
            }}
            aria-label="Filter by City"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-brand-slate-50/80 text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
          >
            {SURGERY_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Locality Dropdown */}
          <select
            value={selectedLocality}
            onChange={(e) => setSelectedLocality(e.target.value)}
            aria-label="Filter by Locality"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 max-w-[180px]"
          >
            {availableLocalities.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by Surgery Category"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 max-w-[170px]"
          >
            {SURGERY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Date Range Dropdown */}
          <select
            value={datePreset}
            onChange={(e) => setDatePreset(e.target.value)}
            aria-label="Filter by Date Range"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>
      </div>

      {/* Patient Surgery Requests Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200/90 shadow-subtle overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-brand-navy-900">
              Patients & Surgery Requests
            </h3>
            <p className="text-xs text-brand-slate-500">
              Showing {filteredPatients.length} of {patients.length} patient records across Mysore, Bangalore, and Mandya
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>Mysore</span>
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>Bangalore</span>
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-purple-600" />
              <span>Mandya</span>
            </span>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-brand-slate-50 border-b border-brand-slate-200/80 text-[11px] font-bold text-brand-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Needed Surgery</th>
                <th className="py-3 px-4">Location / City Hub</th>
                <th className="py-3 px-4">Mobile Number & Email</th>
                <th className="py-3 px-4">Inquiry Date & Urgency</th>
                <th className="py-3 px-4 text-right">View / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-brand-slate-500">
                    <Activity className="w-8 h-8 text-brand-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">No surgery patient records match your filter criteria.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCityFilter('All Cities');
                        setSelectedLocality('All Localities');
                        setSelectedCategory('All Categories');
                        setDatePreset('all');
                      }}
                      className="mt-2 text-xs font-bold text-brand-teal-700 hover:underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.patientId}
                    className="hover:bg-brand-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => setViewingPatient(patient)}
                  >
                    {/* Patient Name & Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-black text-brand-navy-950 text-sm group-hover:text-brand-teal-700 transition-colors">
                        {patient.patientName}
                      </div>
                      <div className="text-[11px] text-brand-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-brand-slate-600 font-semibold">{patient.patientId}</span>
                        <span>•</span>
                        <span>{patient.age} yrs ({patient.gender})</span>
                      </div>
                    </td>

                    {/* Needed Surgery */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-extrabold text-brand-navy-900 leading-snug">
                        {patient.neededSurgery}
                      </div>
                      <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-200">
                          {patient.surgeryCategory}
                        </span>
                      </div>
                    </td>

                    {/* Locality */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-slate-100/90 text-brand-navy-900 font-extrabold text-xs border border-brand-slate-200">
                        <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${
                          patient.cityName.includes('Bangalore')
                            ? 'text-blue-600'
                            : patient.cityName.includes('Mandya')
                            ? 'text-purple-600'
                            : 'text-brand-coral-600'
                        }`} />
                        <span>{patient.cityName}</span>
                      </div>
                    </td>

                    {/* Mobile Number & Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-brand-navy-900 text-xs">
                        <Phone className="w-3.5 h-3.5 text-brand-teal-600 flex-shrink-0" />
                        <a
                          href={`tel:${patient.mobileNumber}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-brand-teal-700 hover:underline"
                        >
                          {patient.mobileNumber}
                        </a>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-brand-slate-500 mt-0.5">
                        <Mail className="w-3 h-3 text-brand-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[160px]">{patient.email}</span>
                      </div>
                    </td>

                    {/* Priority & Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          patient.urgency === 'High Priority'
                            ? 'bg-brand-coral-50 text-brand-coral-700 border border-brand-coral-200'
                            : 'bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-200'
                        }`}
                      >
                        {patient.urgency}
                      </span>
                      <div className="text-[11px] text-brand-slate-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-brand-slate-400" />
                        <span>{patient.requestedDate}</span>
                      </div>
                    </td>

                    {/* Action View */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingPatient(patient);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-teal-800 bg-brand-teal-50 hover:bg-brand-teal-100 border border-brand-teal-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: VIEW PATIENT SURGERY DETAILS */}
      <Modal
        isOpen={!!viewingPatient}
        onClose={() => setViewingPatient(null)}
        title={viewingPatient ? `${viewingPatient.patientName} — Surgery Inquiry` : 'Patient Profile'}
        subtitle={viewingPatient?.patientId}
        maxWidth="max-w-xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => {
                if (viewingPatient) downloadSurgeryPatientsExcel([viewingPatient]);
              }}
              className="px-4 py-2 text-xs font-bold text-brand-teal-800 bg-brand-teal-50 hover:bg-brand-teal-100 border border-brand-teal-200 rounded-xl flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Record to Excel</span>
            </button>
            <button
              onClick={() => setViewingPatient(null)}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl"
            >
              Close
            </button>
          </div>
        }
      >
        {viewingPatient && (
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Surgery Banner */}
            <div className="p-4 rounded-2xl bg-brand-teal-50 border border-brand-teal-200">
              <div className="text-xs font-bold text-brand-teal-800 uppercase tracking-wide">
                Needed Surgery / Requested Procedure
              </div>
              <div className="text-base font-black text-brand-navy-950 mt-1">
                {viewingPatient.neededSurgery}
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-brand-teal-800 border border-brand-teal-200">
                  Category: {viewingPatient.surgeryCategory}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-brand-coral-50 text-brand-coral-700 border border-brand-coral-200">
                  {viewingPatient.urgency}
                </span>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-brand-slate-50 p-4 rounded-2xl border border-brand-slate-200/80 space-y-2.5">
              <div className="text-xs font-extrabold text-brand-navy-900 uppercase tracking-wider">
                Patient Contact Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl border border-brand-slate-200">
                  <span className="text-brand-slate-500 text-[11px] block">Mobile Number</span>
                  <a
                    href={`tel:${viewingPatient.mobileNumber}`}
                    className="font-bold text-brand-teal-700 hover:underline flex items-center gap-1 mt-0.5 text-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {viewingPatient.mobileNumber}
                  </a>
                </div>

                <div className="bg-white p-3 rounded-xl border border-brand-slate-200">
                  <span className="text-brand-slate-500 text-[11px] block">Location / City Hub</span>
                  <div className="font-bold text-brand-navy-900 flex items-center gap-1 mt-0.5 text-sm">
                    <MapPin className="w-3.5 h-3.5 text-brand-coral-600" />
                    {viewingPatient.cityName}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-brand-slate-200 sm:col-span-2">
                  <span className="text-brand-slate-500 text-[11px] block">Email Address</span>
                  <div className="font-bold text-brand-navy-900 mt-0.5">
                    {viewingPatient.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Remarks */}
            <div className="bg-brand-slate-50 p-3.5 rounded-xl border border-brand-slate-200">
              <span className="text-brand-slate-500 text-[11px] font-bold block mb-1">
                Clinical Details & Remarks
              </span>
              <p className="text-brand-slate-700 leading-relaxed">
                {viewingPatient.notes || 'No additional remarks provided.'}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 2: ADD NEW SURGERY PATIENT INQUIRY */}
      <Modal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        title="Register New Surgery Patient"
        subtitle="Enter patient required surgery, locality (Mysore, Bangalore, Mandya), and mobile number"
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
              className="px-4 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-xs"
            >
              Save Surgery Inquiry
            </button>
          </div>
        }
      >
        <form id="add-surgery-patient-form" onSubmit={handleSavePatient} className="space-y-3 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <FormInput
                label="Patient Full Name"
                id="patientName"
                value={newPatientForm.patientName}
                onChange={(e) => setNewPatientForm({ ...newPatientForm, patientName: e.target.value })}
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
                onChange={(e) => setNewPatientForm({ ...newPatientForm, age: e.target.value })}
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
              onChange={(e) => setNewPatientForm({ ...newPatientForm, neededSurgery: e.target.value })}
              placeholder="e.g. Laser Cataract Surgery"
              required
            />
            <SelectInput
              label="Surgery Category"
              id="surgeryCategory"
              value={newPatientForm.surgeryCategory}
              onChange={(e) => setNewPatientForm({ ...newPatientForm, surgeryCategory: e.target.value })}
              options={SURGERY_CATEGORIES.filter((c) => c !== 'All Categories')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectInput
              label="Area / City Hub"
              id="cityName"
              value={newPatientForm.cityName}
              onChange={(e) => setNewPatientForm({ ...newPatientForm, cityName: e.target.value })}
              options={MULTI_CITY_SURGERY_LOCALITIES.filter((l) => l !== 'All Localities')}
            />
            <FormInput
              label="Mobile Number"
              id="mobileNumber"
              value={newPatientForm.mobileNumber}
              onChange={(e) => setNewPatientForm({ ...newPatientForm, mobileNumber: e.target.value })}
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
            onChange={(e) => setNewPatientForm({ ...newPatientForm, email: e.target.value })}
            placeholder="patient@gmail.com"
            icon={Mail}
          />

          <div>
            <label className="block text-xs font-bold text-brand-navy-900 mb-1">
              Clinical Remarks / Symptoms
            </label>
            <textarea
              rows="2"
              value={newPatientForm.notes}
              onChange={(e) => setNewPatientForm({ ...newPatientForm, notes: e.target.value })}
              placeholder="Enter patient complaints, locality landmark, etc."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 text-brand-navy-900"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
