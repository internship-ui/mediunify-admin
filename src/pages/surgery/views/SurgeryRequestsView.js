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
  Building2,
  Share2,
  CheckCircle2,
  Send
} from 'lucide-react';
import StatCard from '../../../components/common/StatCard';
import {
  SURGERY_CITIES,
  SURGERY_CATEGORIES,
  MULTI_CITY_SURGERY_LOCALITIES,
  downloadSurgeryPatientsExcel,
  getMatchingHospitals
} from '../../../data/surgeryData';
import { exportToPDF, filterDataByDate } from '../../../utils/reportExportEngine';
import { useToast } from '../../../context/ToastContext';

export default function SurgeryRequestsView({
  patients = [],
  hospitals = [],
  onOpenAddPatient,
  onOpenPatientDetail
}) {
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All Cities');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocality, setSelectedLocality] = useState('All Localities');
  const [datePreset, setDatePreset] = useState('all');
  const [referralStatusFilter, setReferralStatusFilter] = useState('All'); // 'All' | 'Forwarded' | 'Pending'

  // Map of patientId -> selectedHospitalId
  const [selectedHospitals, setSelectedHospitals] = useState({});

  // Helper to get currently selected hospital for a patient
  const getSelectedHospitalId = (patient) => {
    if (selectedHospitals[patient.patientId] !== undefined) {
      return selectedHospitals[patient.patientId];
    }
    // If patient already has forwardedHospital, use that
    if (patient.forwardedHospital?.hospitalId) {
      return patient.forwardedHospital.hospitalId;
    }
    // Do NOT automatically select; admin must choose manually from the dropdown
    return '';
  };

  const handleHospitalChange = (patientId, hospitalId) => {
    setSelectedHospitals((prev) => ({
      ...prev,
      [patientId]: hospitalId
    }));
  };

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

  // Filtered patients list based on Search & City & Locality & Category & Date & Referral status
  const filteredPatients = useMemo(() => {
    let result = filterDataByDate(patients, 'requestedDate', datePreset);

    return result.filter((p) => {
      const matchesSearch =
        p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.neededSurgery.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mobileNumber.includes(searchTerm) ||
        p.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.forwardedHospital?.hospitalName &&
          p.forwardedHospital.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCity =
        selectedCityFilter === 'All Cities' ||
        p.cityName.toLowerCase().includes(selectedCityFilter.toLowerCase());

      const matchesLocality =
        selectedLocality === 'All Localities' || p.cityName === selectedLocality;

      const matchesCategory =
        selectedCategory === 'All Categories' || p.surgeryCategory === selectedCategory;

      const matchesReferral =
        referralStatusFilter === 'All' ||
        (referralStatusFilter === 'Forwarded' && p.forwardStatus === 'Forwarded') ||
        ((referralStatusFilter === 'Pending' || referralStatusFilter === 'New') &&
          p.forwardStatus !== 'Forwarded');

      return matchesSearch && matchesCity && matchesLocality && matchesCategory && matchesReferral;
    });
  }, [
    patients,
    searchTerm,
    selectedCityFilter,
    selectedLocality,
    selectedCategory,
    datePreset,
    referralStatusFilter
  ]);

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
      `Excel Sheet downloaded with ${filteredPatients.length} patient records (Needed Surgeries, Hospitals & Contact Numbers).`,
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
      { header: 'Hospital Referral', key: 'forwardStatus' },
      { header: 'Urgency', key: 'urgency' }
    ];

    exportToPDF({
      filename: `MediUnify_Surgery_Patients_${new Date().toISOString().slice(0, 10)}.pdf`,
      title: 'Surgical Care & Patient Inquiries Report',
      subtitle: 'Required Surgeries, Localities (Mysore • Bangalore • Mandya) & Hospital Referrals',
      columns: cols,
      data: filteredPatients,
      summaryCards: [
        { label: 'Total Inquiries', value: filteredPatients.length },
        { label: 'High Priority', value: filteredPatients.filter((p) => p.urgency === 'High Priority').length },
        { label: 'Hospital Referrals', value: filteredPatients.filter((p) => p.forwardStatus === 'Forwarded').length },
        { label: 'Coverage Hubs', value: 'Mysore, Bangalore, Mandya' }
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

  const activeHospitalsCount = hospitals.filter((h) => h.status === 'Active').length;
  const newRequestsCount = useMemo(
    () => patients.filter((p) => p.forwardStatus !== 'Forwarded').length,
    [patients]
  );
  const forwardedCount = useMemo(
    () => patients.filter((p) => p.forwardStatus === 'Forwarded').length,
    [patients]
  );

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
                  Patient Surgery Requests
                </h1>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-coral-600" />
                  Mysore • Bangalore • Mandya Hub
                </span>
              </div>
              <p className="text-xs sm:text-sm text-brand-slate-600 mt-1">
                Centralized patient surgery inquiries, required operations, hospital specialization matching & referral tracking.
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
            onClick={onOpenAddPatient}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-brand-slate-700 hover:text-brand-navy-900 bg-brand-slate-100 hover:bg-brand-slate-200 border border-brand-slate-200 rounded-xl transition-all active:scale-[0.98]"
            title="Register a new patient surgery inquiry"
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
          subtitle="Click to view all records"
          trend={`${patients.length} total cases`}
          trendPositive={true}
          iconName="Users"
          colorScheme="teal"
          onClick={() => {
            setReferralStatusFilter('All');
            const tableEl = document.getElementById('surgery-requests-table');
            if (tableEl) tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            addToast('Showing all patient surgery records', 'info');
          }}
        />
        <StatCard
          title="New Requests (Pending)"
          value={newRequestsCount}
          subtitle="Click to list new requests"
          iconName="Sparkles"
          colorScheme="green"
          onClick={() => {
            setReferralStatusFilter('New');
            const tableEl = document.getElementById('surgery-requests-table');
            if (tableEl) tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            addToast(`Listing ${newRequestsCount} new requests awaiting hospital referral`, 'success');
          }}
          actionButton={
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black shadow-2xs transition-all ${
                referralStatusFilter === 'New' || referralStatusFilter === 'Pending'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>List New ({newRequestsCount})</span>
            </span>
          }
        />
        <StatCard
          title="Referred to Hospitals"
          value={forwardedCount}
          subtitle="Click to view dispatched"
          trend={`${forwardedCount} dispatched`}
          trendPositive={true}
          iconName="Share2"
          colorScheme="navy"
          onClick={() => {
            setReferralStatusFilter('Forwarded');
            addToast('Filtered to inquiries referred to partner hospitals', 'info');
          }}
        />
        <StatCard
          title="Active Partner Hospitals"
          value={activeHospitalsCount}
          subtitle="Available surgical network"
          trend={`${activeHospitalsCount} active hubs`}
          trendPositive={true}
          iconName="Building2"
          colorScheme="coral"
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
            placeholder="Search by patient name, operation name, city, phone, hospital..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 focus:border-brand-teal-500 transition-all text-brand-navy-900 bg-brand-slate-50/50"
          />
        </div>

        {/* Quick Status Filter Tabs: All, New Inquiries, Forwarded */}
        <div className="flex items-center gap-1.5 bg-brand-slate-100 p-1 rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setReferralStatusFilter('All')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              referralStatusFilter === 'All'
                ? 'bg-white text-brand-navy-950 shadow-2xs font-black'
                : 'text-brand-slate-600 hover:text-brand-navy-900'
            }`}
          >
            <span>All</span>
            <span className="px-1.5 py-0.2 rounded-md bg-brand-slate-200 text-brand-slate-700 text-[10px]">
              {patients.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setReferralStatusFilter('New')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              referralStatusFilter === 'New' || referralStatusFilter === 'Pending'
                ? 'bg-emerald-600 text-white shadow-2xs font-black'
                : 'text-brand-slate-600 hover:text-brand-navy-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>New Requests</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                referralStatusFilter === 'New' || referralStatusFilter === 'Pending'
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {newRequestsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setReferralStatusFilter('Forwarded')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              referralStatusFilter === 'Forwarded'
                ? 'bg-brand-teal-600 text-white shadow-2xs font-black'
                : 'text-brand-slate-600 hover:text-brand-navy-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Forwarded</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                referralStatusFilter === 'Forwarded'
                  ? 'bg-white/20 text-white'
                  : 'bg-brand-slate-200 text-brand-slate-700'
              }`}
            >
              {forwardedCount}
            </span>
          </button>
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
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 max-w-[170px]"
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
      <div id="surgery-requests-table" className="bg-white rounded-2xl border border-brand-slate-200/90 shadow-subtle overflow-hidden scroll-mt-6">
        <div className="px-5 py-4 border-b border-brand-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-extrabold text-brand-navy-900">
                Patients & Surgery Requests
              </h3>
              {(referralStatusFilter === 'New' || referralStatusFilter === 'Pending') && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Showing {filteredPatients.length} New Requests
                </span>
              )}
            </div>
            <p className="text-xs text-brand-slate-500 mt-0.5">
              Showing {filteredPatients.length} of {patients.length} patient records across Mysore, Bangalore, and Mandya
              {referralStatusFilter !== 'All' && (
                <button
                  type="button"
                  onClick={() => setReferralStatusFilter('All')}
                  className="ml-2 font-bold text-brand-teal-700 hover:underline cursor-pointer"
                >
                  (Reset to Show All)
                </button>
              )}
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
                <th className="py-3 px-4">Operation Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4 min-w-[220px]">Select Hospital</th>
                <th className="py-3 px-4">Date & Urgency</th>
                <th className="py-3 px-4 text-right">Send Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-brand-slate-500">
                    <Activity className="w-8 h-8 text-brand-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">No surgery patient records match your filter criteria.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCityFilter('All Cities');
                        setSelectedLocality('All Localities');
                        setSelectedCategory('All Categories');
                        setDatePreset('all');
                        setReferralStatusFilter('All');
                      }}
                      className="mt-2 text-xs font-bold text-brand-teal-700 hover:underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const isForwarded = patient.forwardStatus === 'Forwarded';
                  const matches = getMatchingHospitals(patient, hospitals);
                  const selectedHospId = getSelectedHospitalId(patient);
                  const selectedHospitalObj = hospitals.find((h) => h.id === selectedHospId);
                  const matchingHospIds = new Set(matches.map((m) => m.id));
                  const otherActiveHospitals = hospitals.filter(
                    (h) => h.status === 'Active' && !matchingHospIds.has(h.id)
                  );

                  return (
                    <tr
                      key={patient.patientId}
                      className="transition-colors group cursor-pointer hover:bg-brand-slate-50/80"
                      onClick={() =>
                        onOpenPatientDetail(
                          patient,
                          selectedHospId,
                          isForwarded ? 'response' : selectedHospId ? 'preview' : 'matching'
                        )
                      }
                    >
                      {/* Patient Name - only patient name */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-brand-navy-950 text-sm group-hover:text-brand-teal-700 transition-colors">
                          {patient.patientName}
                        </span>
                      </td>

                      {/* Operation Name - only operation name */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-medium text-brand-navy-900 leading-snug">
                          {patient.neededSurgery}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-brand-slate-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-brand-slate-400 flex-shrink-0" />
                          <span>{patient.cityName}</span>
                        </div>
                      </td>

                      {/* Mobile Number & Email */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium text-brand-navy-900 text-xs">
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
                          <span className="truncate max-w-[150px]">{patient.email}</span>
                        </div>
                      </td>

                      {/* Select Hospital Dropdown Column */}
                      <td className="py-3.5 px-4 min-w-[220px]" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-1">
                          <div className="relative">
                            <select
                              value={selectedHospId}
                              onChange={(e) => handleHospitalChange(patient.patientId, e.target.value)}
                              aria-label={`Select hospital for ${patient.patientName}`}
                              className={`w-full pl-3 pr-8 py-2 text-xs rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 appearance-none cursor-pointer ${
                                isForwarded
                                  ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 font-semibold'
                                  : selectedHospId
                                  ? 'border-brand-teal-300 bg-brand-teal-50/40 text-brand-navy-950 font-semibold'
                                  : 'border-brand-slate-200 bg-white text-brand-slate-600 hover:border-brand-teal-400 font-medium'
                              }`}
                            >
                              <option value="">-- Choose Hospital to Refer --</option>
                              {matches.length > 0 && (
                                <optgroup label="⭐ Recommended Matching Hospitals">
                                  {matches.map((h) => (
                                    <option key={h.id} value={h.id}>
                                      {h.name} ({h.city} • {h.preferredNotification})
                                    </option>
                                  ))}
                                </optgroup>
                              )}
                              {otherActiveHospitals.length > 0 && (
                                <optgroup label="Other Available Hospitals">
                                  {otherActiveHospitals.map((h) => (
                                    <option key={h.id} value={h.id}>
                                      {h.name} ({h.city})
                                    </option>
                                  ))}
                                </optgroup>
                              )}
                            </select>
                            <Building2 className="w-3.5 h-3.5 text-brand-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>

                          {/* Quick Hospital Indicator & Referral Status */}
                          {isForwarded ? (
                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="truncate">Sent to {patient.forwardedHospital?.hospitalName || 'Hospital'}</span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex-shrink-0">
                                {patient.hospitalResponse || 'Forwarded'}
                              </span>
                            </div>
                          ) : selectedHospitalObj ? (
                            <div className="flex items-center justify-between text-[10px] text-brand-slate-500">
                              <span className="font-semibold text-brand-teal-800 truncate">
                                Channel: <strong>{selectedHospitalObj.preferredNotification}</strong>
                              </span>
                              <span className="text-emerald-700 font-bold">
                                {matches.some((m) => m.id === selectedHospitalObj.id) ? '✓ Match' : 'Active'}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </td>

                      {/* Date & Urgency */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              patient.urgency === 'High Priority'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-200'
                            }`}
                          >
                            {patient.urgency}
                          </span>
                          <div className="text-[11px] text-brand-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-brand-slate-400" />
                            <span>{patient.requestedDate}</span>
                          </div>
                        </div>
                      </td>

                      {/* Send Details / Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              const hospId = getSelectedHospitalId(patient);
                              if (!hospId) {
                                addToast('Please select a hospital from the dropdown first', 'warning');
                                return;
                              }
                              onOpenPatientDetail(patient, hospId, 'preview');
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-[0.98] ${
                              !isForwarded
                                ? selectedHospId
                                  ? 'text-white bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-400/20 shadow-xs'
                                  : 'text-brand-slate-600 bg-brand-slate-100 hover:bg-brand-slate-200 border border-brand-slate-300'
                                : 'text-brand-teal-700 bg-brand-teal-50 hover:bg-brand-teal-100 border border-brand-teal-200'
                            }`}
                            title={
                              !isForwarded && !selectedHospId
                                ? 'Please select a hospital from the dropdown first'
                                : `Send ${patient.patientName}'s details to ${selectedHospitalObj?.name || 'selected hospital'}`
                            }
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{!isForwarded ? 'Send Details' : 'Re-send'}</span>
                          </button>

                          <button
                            onClick={() =>
                              onOpenPatientDetail(
                                patient,
                                selectedHospId,
                                isForwarded ? 'response' : selectedHospId ? 'preview' : 'matching'
                              )
                            }
                            className="p-1.5 rounded-xl text-brand-slate-600 hover:text-brand-navy-950 hover:bg-brand-slate-100 border border-brand-slate-200 transition-colors"
                            title="View Case Details & Timeline"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
