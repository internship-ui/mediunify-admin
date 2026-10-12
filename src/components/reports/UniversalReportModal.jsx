import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Download,
  Calendar,
  Filter,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Building2,
  Activity,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  FlaskConical,
  ScanLine,
  Pill,
  HeartHandshake,
  Printer,
  ChevronRight
} from 'lucide-react';
import Modal from '../common/Modal';
import { SERVICES_CONFIG } from '../../data/servicesConfig';
import { exportToExcel, exportToPDF, filterDataByDate } from '../../utils/reportExportEngine';
import { INITIAL_SURGERY_PATIENTS } from '../../data/surgeryData';
import { INITIAL_CARE_REQUESTS } from '../../data/homeNursingData';
import { LAB_TESTS, LAB_BOOKINGS, LAB_REPORTS } from '../../data/labData';
import { RADIOLOGY_BOOKINGS, RADIOLOGY_REPORTS } from '../../data/radiologyData';
import { PHARMACY_ORDERS, PHARMACY_MEDICINES } from '../../data/pharmacyData';
import { AYURVEDA_BOOKINGS } from '../../data/ayurveda/bookings';
import { useToast } from '../../context/ToastContext';

// Helper to return icon for service
function getServiceIcon(serviceId) {
  switch (serviceId) {
    case 'lab':
      return FlaskConical;
    case 'radiology':
      return ScanLine;
    case 'pharmacy':
      return Pill;
    case 'equipment-rentals':
    case 'equipment-rental':
      return ShieldCheck;
    case 'surgery':
      return Activity;
    case 'home-nursing':
    case 'home-care':
      return HeartHandshake;
    case 'ayurveda':
      return Sparkles;
    default:
      return Layers;
  }
}

export default function UniversalReportModal({ isOpen, onClose, initialServiceId = 'all' }) {
  const { addToast } = useToast();

  const [selectedService, setSelectedService] = useState(initialServiceId || 'all');
  const [reportType, setReportType] = useState('summary');
  const [datePreset, setDatePreset] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Synchronize when initialServiceId changes
  React.useEffect(() => {
    if (initialServiceId) {
      setSelectedService(initialServiceId);
    }
  }, [initialServiceId]);

  // Generate dataset based on selection
  const { rawData, columns, title, subtitle, summaryCards } = useMemo(() => {
    let dataset = [];
    let cols = [];
    let repTitle = '';
    let repSubtitle = '';
    let kpiCards = [];

    if (selectedService === 'all') {
      repTitle = 'MediUnify Unified Multi-Portal Executive Report';
      repSubtitle = 'Consolidated operations across Surgery, Equipment, Homecare, Lab, Radiology & Pharmacy';
      
      // Merge high-level cross-portal records
      dataset = [
        ...INITIAL_SURGERY_PATIENTS.map((p) => ({
          portal: 'Surgery (Mysore)',
          refId: p.patientId,
          patientName: p.patientName,
          details: `${p.neededSurgery} (${p.cityName})`,
          contact: p.mobileNumber,
          date: p.requestedDate,
          status: p.urgency,
          amount: p.estimatedCost
        })),
        ...INITIAL_CARE_REQUESTS.map((r) => ({
          portal: 'Home Care',
          refId: r.id,
          patientName: r.patientName,
          details: `${r.serviceName} (${r.cityName})`,
          contact: r.phone,
          date: r.dateRequested,
          status: r.status,
          amount: `₹${r.baseRate || 450}`
        })),
        ...LAB_BOOKINGS.map((b) => ({
          portal: 'Laboratory',
          refId: b.bookingId,
          patientName: b.patientName,
          details: b.testName,
          contact: b.phone,
          date: b.date,
          status: b.status,
          amount: `₹${b.totalAmount}`
        })),
        ...RADIOLOGY_BOOKINGS.map((rb) => ({
          portal: 'Radiology',
          refId: rb.bookingId,
          patientName: rb.patientName,
          details: `${rb.modality} - ${rb.scanType}`,
          contact: rb.phone,
          date: rb.date,
          status: rb.status,
          amount: `₹${rb.amount}`
        })),
        ...PHARMACY_ORDERS.map((o) => ({
          portal: 'Pharmacy',
          refId: o.orderId,
          patientName: o.customerName,
          details: `${o.itemsCount} Rx Medicines (${o.deliveryType})`,
          contact: o.phone,
          date: o.date,
          status: o.status,
          amount: `₹${o.totalAmount}`
        }))
      ];

      cols = [
        { header: 'Portal', key: 'portal', width: 18 },
        { header: 'Ref ID', key: 'refId', width: 16 },
        { header: 'Patient / Customer', key: 'patientName', width: 22 },
        { header: 'Clinical / Service Detail', key: 'details', width: 34 },
        { header: 'Contact Mobile', key: 'contact', width: 18 },
        { header: 'Date', key: 'date', width: 14 },
        { header: 'Status / Urgency', key: 'status', width: 16 },
        { header: 'Amount (INR)', key: 'amount', width: 16 }
      ];

      kpiCards = [
        { label: 'Total Portal Inquiries', value: dataset.length },
        { label: 'Surgery Cases', value: INITIAL_SURGERY_PATIENTS.length },
        { label: 'Home Care Visits', value: INITIAL_CARE_REQUESTS.length },
        { label: 'Diagnostics & Scans', value: LAB_BOOKINGS.length + RADIOLOGY_BOOKINGS.length }
      ];
    } else if (selectedService === 'surgery') {
      repTitle = 'Surgical Care & Patient Inquiries Report (Mysore)';
      repSubtitle = 'Patients requiring surgeries, localities, mobile contacts, and urgency levels';

      dataset = INITIAL_SURGERY_PATIENTS.map((p) => ({
        patientId: p.patientId,
        patientName: p.patientName,
        ageGender: `${p.age}y / ${p.gender}`,
        neededSurgery: p.neededSurgery,
        category: p.surgeryCategory,
        cityName: p.cityName,
        mobileNumber: p.mobileNumber,
        email: p.email,
        date: p.requestedDate,
        urgency: p.urgency,
        estimatedCost: p.estimatedCost,
        notes: p.notes
      }));

      cols = [
        { header: 'Patient ID', key: 'patientId', width: 18 },
        { header: 'Patient Name', key: 'patientName', width: 22 },
        { header: 'Age / Gender', key: 'ageGender', width: 14 },
        { header: 'Needed Surgery', key: 'neededSurgery', width: 32 },
        { header: 'Category', key: 'category', width: 24 },
        { header: 'Mysore Locality', key: 'cityName', width: 22 },
        { header: 'Mobile Number', key: 'mobileNumber', width: 18 },
        { header: 'Requested Date', key: 'date', width: 15 },
        { header: 'Urgency', key: 'urgency', width: 16 },
        { header: 'Estimated Cost', key: 'estimatedCost', width: 16 }
      ];

      kpiCards = [
        { label: 'Total Mysore Inquiries', value: dataset.length },
        { label: 'High Priority Cases', value: dataset.filter((d) => d.urgency === 'High Priority').length },
        { label: 'Localities Covered', value: 12 },
        { label: 'Avg Turnaround', value: '1.5 Days' }
      ];
    } else if (selectedService === 'home-nursing' || selectedService === 'home-care') {
      repTitle = 'Home Nursing & Attendant Service Request Ledger';
      repSubtitle = 'Patient care visits, assigned nurses, multi-city dispatch, and completion status';

      dataset = INITIAL_CARE_REQUESTS.map((r) => ({
        id: r.id,
        patientName: r.patientName,
        serviceName: r.serviceName,
        category: r.category,
        cityName: r.cityName,
        phone: r.phone,
        assignedNurse: r.assignedNurseName || 'Awaiting Nurse',
        date: r.dateRequested,
        scheduledSlot: r.scheduledSlot,
        status: r.status,
        baseRate: `₹${r.baseRate || 400}`
      }));

      cols = [
        { header: 'Request ID', key: 'id', width: 16 },
        { header: 'Patient Name', key: 'patientName', width: 22 },
        { header: 'Nursing Service', key: 'serviceName', width: 26 },
        { header: 'City / Locality', key: 'cityName', width: 20 },
        { header: 'Phone Number', key: 'phone', width: 18 },
        { header: 'Assigned Nurse', key: 'assignedNurse', width: 22 },
        { header: 'Date', key: 'date', width: 14 },
        { header: 'Time Slot', key: 'scheduledSlot', width: 18 },
        { header: 'Status', key: 'status', width: 16 },
        { header: 'Rate (INR)', key: 'baseRate', width: 14 }
      ];

      kpiCards = [
        { label: 'Total Care Requests', value: dataset.length },
        { label: 'Nurse Assigned', value: dataset.filter((d) => d.status.includes('Assigned') || d.status.includes('Scheduled')).length },
        { label: 'Completed Visits', value: dataset.filter((d) => d.status === 'Completed').length },
        { label: 'Active Roster', value: '28 Nurses' }
      ];
    } else if (selectedService === 'equipment-rentals' || selectedService === 'equipment-rental') {
      repTitle = 'Medical Equipment Rental & Vendor Asset Ledger';
      repSubtitle = 'Rental requests, active deployments, partner vendors, and revenue settlements';

      dataset = [
        { orderId: 'ORD-1001', patientName: 'Siddharth Rao', equipment: 'Motorized ICU Hospital Bed', vendor: 'Cauvery Home Medix', amount: '₹5,500', deposit: '₹2,500', date: '2026-09-18', status: 'Active' },
        { orderId: 'ORD-1002', patientName: 'Deepika Gowda', equipment: 'Manual Hospital Bed 2-Cut', vendor: 'Cauvery Home Medix', amount: '₹3,600', deposit: '₹1,500', date: '2026-09-19', status: 'Active' },
        { orderId: 'ORD-1003', patientName: 'K. Venkatesh', equipment: 'BiPAP Ventilator Machine', vendor: 'Apex Healthcare Logistics', amount: '₹4,800', deposit: '₹3,000', date: '2026-09-20', status: 'Active' },
        { orderId: 'ORD-0982', patientName: 'Pooja Hegde', equipment: 'Foldable Power Wheelchair', vendor: 'Mysore Meditech Hub', amount: '₹2,800', deposit: '₹2,000', date: '2026-09-14', status: 'Completed' },
        { orderId: 'ORD-0979', patientName: 'Suresh Kumar', equipment: 'Air Mattress with Compressor', vendor: 'Apex Healthcare Logistics', amount: '₹1,500', deposit: '₹1,000', date: '2026-09-15', status: 'Completed' },
        { orderId: 'ORD-0975', patientName: 'Meenakshi Sundaram', equipment: 'Suction Machine Heavy Duty', vendor: 'Cauvery Home Medix', amount: '₹2,200', deposit: '₹1,200', date: '2026-09-16', status: 'Completed' }
      ];

      cols = [
        { header: 'Order ID', key: 'orderId', width: 16 },
        { header: 'Patient Name', key: 'patientName', width: 22 },
        { header: 'Medical Equipment SKU', key: 'equipment', width: 30 },
        { header: 'Vendor Partner', key: 'vendor', width: 26 },
        { header: 'Rental Fee', key: 'amount', width: 16 },
        { header: 'Deposit Refunded', key: 'deposit', width: 18 },
        { header: 'Start Date', key: 'date', width: 14 },
        { header: 'Lifecycle Status', key: 'status', width: 16 }
      ];

      kpiCards = [
        { label: 'Active Rentals', value: '42 Units' },
        { label: 'Fleet Utilization', value: '81.4%' },
        { label: 'Vendor SLA Rate', value: '98.5%' },
        { label: 'Gross Volume', value: '₹4.82L' }
      ];
    } else if (selectedService === 'lab') {
      repTitle = 'Clinical Pathology & Diagnostic Investigation Report';
      repSubtitle = 'Test bookings, sample collection tracking, and pathologist sign-offs';

      dataset = LAB_BOOKINGS.map((b) => ({
        bookingId: b.bookingId,
        patientName: b.patientName,
        testName: b.testName,
        phone: b.phone,
        date: b.date,
        timeSlot: b.timeSlot,
        collectionType: b.collectionType,
        paymentStatus: b.paymentStatus,
        status: b.status,
        amount: `₹${b.totalAmount}`
      }));

      cols = [
        { header: 'Booking ID', key: 'bookingId', width: 18 },
        { header: 'Patient Name', key: 'patientName', width: 22 },
        { header: 'Diagnostic Test', key: 'testName', width: 30 },
        { header: 'Phone', key: 'phone', width: 18 },
        { header: 'Date', key: 'date', width: 14 },
        { header: 'Mode', key: 'collectionType', width: 16 },
        { header: 'Payment', key: 'paymentStatus', width: 14 },
        { header: 'Lab Status', key: 'status', width: 16 },
        { header: 'Fee (INR)', key: 'amount', width: 14 }
      ];

      kpiCards = [
        { label: 'Bookings Logged', value: dataset.length },
        { label: 'Catalog Investigations', value: LAB_TESTS.length },
        { label: 'Verified Reports', value: LAB_REPORTS.length },
        { label: 'NABL Compliance', value: '100%' }
      ];
    } else if (selectedService === 'radiology') {
      repTitle = 'Radiology & Medical Imaging Center Report';
      repSubtitle = 'MRI, CT, Ultrasound, and X-Ray scans with radiologist verifications';

      dataset = RADIOLOGY_BOOKINGS.map((r) => ({
        bookingId: r.bookingId,
        patientName: r.patientName,
        modality: r.modality,
        scanType: r.scanType,
        machine: r.machineName,
        date: r.date,
        timeSlot: r.timeSlot,
        radiologist: r.radiologist,
        status: r.status,
        amount: `₹${r.amount}`
      }));

      cols = [
        { header: 'Scan Ref', key: 'bookingId', width: 18 },
        { header: 'Patient Name', key: 'patientName', width: 22 },
        { header: 'Modality', key: 'modality', width: 16 },
        { header: 'Investigation', key: 'scanType', width: 28 },
        { header: 'Imaging Machine', key: 'machine', width: 24 },
        { header: 'Scan Date', key: 'date', width: 14 },
        { header: 'Reporting Radiologist', key: 'radiologist', width: 24 },
        { header: 'Status', key: 'status', width: 16 },
        { header: 'Amount', key: 'amount', width: 14 }
      ];

      kpiCards = [
        { label: 'Completed Scans', value: dataset.length },
        { label: 'PACS Published', value: RADIOLOGY_REPORTS.length },
        { label: '3T MRI Utilization', value: '92%' },
        { label: 'Reporting TAT', value: '2.4 Hours' }
      ];
    } else if (selectedService === 'pharmacy') {
      repTitle = 'Pharmacy Dispensation & Medicine Orders Ledger';
      repSubtitle = 'Prescription orders, doorstep delivery logs, and inventory status';

      dataset = PHARMACY_ORDERS.map((o) => ({
        orderId: o.orderId,
        customerName: o.customerName,
        phone: o.phone,
        itemsCount: `${o.itemsCount} Items`,
        deliveryType: o.deliveryType,
        date: o.date,
        paymentMethod: o.paymentMethod,
        status: o.status,
        amount: `₹${o.totalAmount}`
      }));

      cols = [
        { header: 'Order ID', key: 'orderId', width: 18 },
        { header: 'Customer Name', key: 'customerName', width: 22 },
        { header: 'Phone', key: 'phone', width: 18 },
        { header: 'Item Count', key: 'itemsCount', width: 16 },
        { header: 'Fulfillment', key: 'deliveryType', width: 18 },
        { header: 'Date', key: 'date', width: 14 },
        { header: 'Payment', key: 'paymentMethod', width: 16 },
        { header: 'Order Status', key: 'status', width: 16 },
        { header: 'Total Value', key: 'amount', width: 16 }
      ];

      kpiCards = [
        { label: 'Orders Handled', value: dataset.length },
        { label: 'Active SKUs', value: PHARMACY_MEDICINES.length },
        { label: 'Avg Fulfillment', value: '45 mins' },
        { label: 'Prescriptions Checked', value: '100%' }
      ];
    } else {
      repTitle = 'Ayurveda & Integrative Medicine Ledger';
      repSubtitle = 'Doctor consultations, panchakarma therapies, and wellness packages';

      dataset = AYURVEDA_BOOKINGS.map((a) => ({
        bookingId: a.bookingId,
        patientName: a.patientName,
        phone: a.phone,
        serviceType: a.serviceType,
        doctor: a.doctorName,
        date: a.date,
        status: a.status,
        amount: `₹${a.amount}`
      }));

      cols = [
        { header: 'Booking ID', key: 'bookingId', width: 18 },
        { header: 'Patient Name', key: 'patientName', width: 22 },
        { header: 'Phone', key: 'phone', width: 18 },
        { header: 'Therapy / Consult', key: 'serviceType', width: 28 },
        { header: 'Ayurvedic Vaidya', key: 'doctor', width: 24 },
        { header: 'Date', key: 'date', width: 14 },
        { header: 'Status', key: 'status', width: 16 },
        { header: 'Fee (INR)', key: 'amount', width: 14 }
      ];

      kpiCards = [
        { label: 'Therapy Sessions', value: dataset.length },
        { label: 'Panchakarma Plans', value: '18 Active' },
        { label: 'Patient Rating', value: '4.9 ★' },
        { label: 'Holistic Centers', value: '3 Hubs' }
      ];
    }

    return { rawData: dataset, columns: cols, title: repTitle, subtitle: repSubtitle, summaryCards: kpiCards };
  }, [selectedService]);

  // Apply Date and Search and Status Filters
  const filteredData = useMemo(() => {
    let result = filterDataByDate(rawData, 'date', datePreset, startDate, endDate);

    if (statusFilter !== 'all') {
      result = result.filter((item) => {
        const s = String(item.status || item.urgency || '').toLowerCase();
        return s.includes(statusFilter.toLowerCase());
      });
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some((val) => String(val || '').toLowerCase().includes(q))
      );
    }

    return result;
  }, [rawData, datePreset, startDate, endDate, statusFilter, searchTerm]);

  // Date Range Human Label
  const getDateRangeLabel = () => {
    if (datePreset === 'all') return 'All Time Records';
    if (datePreset === 'today') return 'Today (Current Day)';
    if (datePreset === 'yesterday') return 'Yesterday';
    if (datePreset === '7days') return 'Past 7 Days';
    if (datePreset === '30days') return 'Past 30 Days';
    if (datePreset === 'thisMonth') return 'Current Month (September 2026)';
    if (datePreset === 'quarter') return 'Current Quarter (Q3 2026)';
    if (datePreset === 'custom') {
      return `Custom: ${startDate || 'Start'} to ${endDate || 'End'}`;
    }
    return 'Selected Date Range';
  };

  // Download Excel (.xlsx)
  const handleDownloadExcel = () => {
    if (filteredData.length === 0) {
      addToast('No records match your selected filters to export', 'warning');
      return;
    }

    const portalName =
      selectedService === 'all'
        ? 'All Healthcare Portals'
        : SERVICES_CONFIG.find((s) => s.id === selectedService)?.name || selectedService;

    const dateTag = new Date().toISOString().split('T')[0];
    const cleanFilename = `MediUnify_${selectedService.toUpperCase()}_Report_${datePreset}_${dateTag}.xlsx`;

    exportToExcel({
      filename: cleanFilename,
      sheetName: 'Ledger Records',
      title: title,
      columns: columns,
      data: filteredData,
      metadata: {
        portal: portalName,
        dateRange: getDateRangeLabel()
      }
    });

    addToast(`Excel spreadsheet successfully generated with ${filteredData.length} records.`, 'success');
  };

  // Download PDF (.pdf)
  const handleDownloadPDF = () => {
    if (filteredData.length === 0) {
      addToast('No records match your selected filters to export', 'warning');
      return;
    }

    const portalName =
      selectedService === 'all'
        ? 'All Healthcare Portals'
        : SERVICES_CONFIG.find((s) => s.id === selectedService)?.name || selectedService;

    const dateTag = new Date().toISOString().split('T')[0];
    const cleanFilename = `MediUnify_${selectedService.toUpperCase()}_Report_${datePreset}_${dateTag}.pdf`;

    exportToPDF({
      filename: cleanFilename,
      title: title,
      subtitle: subtitle,
      columns: columns,
      data: filteredData,
      summaryCards: [
        { label: 'Matching Records', value: filteredData.length },
        ...summaryCards.slice(1, 4)
      ],
      metadata: {
        portal: portalName,
        dateRange: getDateRangeLabel()
      }
    });

    addToast(`Branded PDF report successfully generated with ${filteredData.length} records.`, 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Universal Reports & Export Center"
      subtitle="Generate and download dated Excel (.xlsx) and PDF operational ledgers across all healthcare portals"
      maxWidth="max-w-5xl"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <div className="text-xs font-semibold text-brand-slate-600 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-teal-500 animate-pulse" />
            <span>
              Ready to export <strong className="text-brand-navy-900 font-extrabold">{filteredData.length}</strong> matching entries ({getDateRangeLabel()})
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleDownloadExcel}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all hover:shadow active:scale-[0.98]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Excel (.xlsx)</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-brand-coral-600 hover:bg-brand-coral-700 text-white shadow-sm transition-all hover:shadow active:scale-[0.98]"
            >
              <FileText className="w-4 h-4" />
              <span>Download PDF (.pdf)</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Step 1: Portal Scope Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-brand-navy-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-teal-100 text-brand-teal-800 text-[10px] font-black flex items-center justify-center">1</span>
              Select Healthcare Service / Scope
            </label>
            <span className="text-[11px] font-bold text-brand-slate-400">
              Active: {selectedService === 'all' ? 'Consolidated All Portals' : SERVICES_CONFIG.find(s => s.id === selectedService)?.name}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            <button
              onClick={() => setSelectedService('all')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                selectedService === 'all'
                  ? 'bg-brand-navy-900 text-white border-brand-navy-900 shadow-md font-bold ring-2 ring-brand-navy-900/20'
                  : 'bg-white hover:bg-brand-slate-50 text-brand-slate-700 border-brand-slate-200 shadow-2xs'
              }`}
            >
              <Layers className={`w-4 h-4 mx-auto mb-1 ${selectedService === 'all' ? 'text-brand-aqua-400' : 'text-brand-slate-500'}`} />
              <span className="text-[11px] block font-bold truncate">All Portals</span>
            </button>

            {SERVICES_CONFIG.map((svc) => {
              const SvcIcon = getServiceIcon(svc.id);
              const isSelected = selectedService === svc.id;

              return (
                <button
                  key={svc.id}
                  onClick={() => setSelectedService(svc.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-brand-teal-600 text-white border-brand-teal-600 shadow-md font-bold ring-2 ring-brand-teal-600/20'
                      : 'bg-white hover:bg-brand-slate-50 text-brand-slate-700 border-brand-slate-200 shadow-2xs'
                  }`}
                >
                  <SvcIcon className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-white' : 'text-brand-teal-600'}`} />
                  <span className="text-[11px] block font-semibold truncate">{svc.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Date Range Filter Bar */}
        <div className="bg-brand-slate-50 p-3.5 sm:p-4 rounded-2xl border border-brand-slate-200/80 space-y-3 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-brand-navy-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-teal-100 text-brand-teal-800 text-[10px] font-black flex items-center justify-center">2</span>
              <Calendar className="w-3.5 h-3.5 text-brand-teal-600" />
              Filter Records by Date Range
            </label>
            <span className="text-[11px] font-bold text-brand-teal-800 bg-brand-teal-50 px-2.5 py-0.5 rounded-lg border border-brand-teal-200">
              {getDateRangeLabel()}
            </span>
          </div>

          {/* Quick Date Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {[
              { id: 'all', label: 'All Time Records' },
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: '7days', label: 'Last 7 Days' },
              { id: '30days', label: 'Last 30 Days' },
              { id: 'thisMonth', label: 'This Month' },
              { id: 'quarter', label: 'Current Quarter' },
              { id: 'custom', label: 'Custom Date Range...' }
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => setDatePreset(preset.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  datePreset === preset.id
                    ? 'bg-brand-teal-600 text-white shadow-xs font-bold'
                    : 'bg-white text-brand-slate-600 hover:bg-brand-slate-100 border border-brand-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Date Inputs if Custom is selected */}
          {datePreset === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-brand-slate-200/80 animate-slide-up">
              <div>
                <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
                  Start Date (From)
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-brand-slate-700 mb-1">
                  End Date (To)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white font-medium text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
                />
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Search & Status Refinements */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient name, needed surgery, test, phone, order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-brand-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 text-brand-navy-900"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-slate-400 hover:text-brand-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-slate-200 bg-white text-brand-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 font-medium"
            >
              <option value="all">All Lifecycle Statuses</option>
              <option value="active">Active / In Progress</option>
              <option value="completed">Completed / Discharged</option>
              <option value="scheduled">Scheduled / Assigned</option>
              <option value="high priority">High Priority / Urgent</option>
            </select>
          </div>
        </div>

        {/* Summary Telemetry KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-white p-3 rounded-xl border border-brand-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-brand-slate-400 block">Matching Entries</span>
            <span className="text-base font-black text-brand-navy-900 mt-0.5 block">{filteredData.length} Records</span>
          </div>
          {summaryCards.slice(1, 4).map((kpi, idx) => (
            <div key={idx} className="bg-white p-3 rounded-xl border border-brand-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-brand-slate-400 block">{kpi.label}</span>
              <span className="text-base font-black text-brand-navy-900 mt-0.5 block">{kpi.value}</span>
            </div>
          ))}
        </div>

        {/* Step 4: Live Preview Table */}
        <div className="border border-brand-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
          <div className="px-4 py-3 bg-brand-slate-50 border-b border-brand-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-brand-navy-900 uppercase tracking-wider">
                Live Data Preview ({filteredData.length} Records)
              </h4>
              <p className="text-[11px] text-brand-slate-500">{title}</p>
            </div>
            <span className="text-[11px] font-bold text-brand-slate-400">
              Displaying top {Math.min(filteredData.length, 6)} rows
            </span>
          </div>

          <div className="overflow-x-auto max-h-60">
            {filteredData.length === 0 ? (
              <div className="py-10 text-center text-brand-slate-400 text-xs">
                <Filter className="w-6 h-6 mx-auto mb-2 text-brand-slate-300" />
                <p className="font-semibold text-brand-slate-600">No records match the active date/search filters</p>
                <p className="text-brand-slate-400 mt-0.5">Try choosing 'All Time Records' or clearing your search term</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-brand-slate-600">
                <thead className="bg-brand-slate-100/80 text-[10px] uppercase font-bold text-brand-slate-700 border-b border-brand-slate-200 sticky top-0">
                  <tr>
                    {columns.map((c) => (
                      <th key={c.key || c.header} className="px-3.5 py-2.5 whitespace-nowrap">
                        {c.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-slate-100 font-medium">
                  {filteredData.slice(0, 6).map((row, idx) => (
                    <tr key={idx} className="hover:bg-brand-slate-50/70 transition-colors">
                      {columns.map((c) => {
                        const val = row[c.key || c.accessor];
                        return (
                          <td key={c.key || c.header} className="px-3.5 py-2 whitespace-nowrap text-brand-navy-900">
                            {val !== null && val !== undefined ? String(val) : '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
