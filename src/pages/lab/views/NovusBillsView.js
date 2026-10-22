import React, { useState, useMemo } from 'react';
import {
  Bell,
  Home,
  BookOpen,
  Search,
  RotateCcw,
  Printer,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  QrCode,
  Calendar,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  DollarSign
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import {
  formatDateDDMMYYYY,
  formatDateTimeWithAt,
  toHtmlDateValue,
  fromHtmlDateValue,
  isDateMatching
} from '../../../utils/dateUtils';

// Reference Screenshot Baseline Mock Records
const REFERENCE_BILL_RECORDS = [
  {
    id: 'bill-1',
    patientName: 'Mrs. Dr JAYASHREE',
    patientTitle: 'Mrs. Dr',
    age: '30 yrs',
    gender: 'Female',
    regNo: '26100021',
    labNo: '13915',
    ipOpNo: '//',
    refCenter: 'Farookh Medical College & RI (FAME)',
    billType: 'credit',
    billNo: '013915',
    billedDate: '01-10-2026 at 02:41 PM',
    paymentStatus: 'Due',
    paidAmount: 0.0,
    dueAmount: 150.0,
    totalAmount: 150.0,
    status: 'Active',
    sponsors: '',
    mobile: '+91 98450 12341',
    items: [
      { name: 'Routine Microscopic Urine Screen', code: 'PAT-URN-11', rate: 150.0, qty: 1, total: 150.0 }
    ]
  },
  {
    id: 'bill-2',
    patientName: 'Mrs. Dr ANURADHA',
    patientTitle: 'Mrs. Dr',
    age: '30 yrs',
    gender: 'Female',
    regNo: '26100020',
    labNo: '13914',
    ipOpNo: '//',
    refCenter: 'Farookh Medical College & RI (FAME)',
    billType: 'credit',
    billNo: '013914',
    billedDate: '01-10-2026 at 02:40 PM',
    paymentStatus: 'Due',
    paidAmount: 0.0,
    dueAmount: 150.0,
    totalAmount: 150.0,
    status: 'Active',
    sponsors: '',
    mobile: '+91 98450 12342',
    items: [
      { name: 'Routine Microscopic Urine Screen', code: 'PAT-URN-11', rate: 150.0, qty: 1, total: 150.0 }
    ]
  },
  {
    id: 'bill-3',
    patientName: 'Mrs. SHILPA',
    patientTitle: 'Mrs.',
    age: '38 yrs',
    gender: 'Female',
    regNo: '26100019',
    labNo: '13913',
    ipOpNo: '//',
    refCenter: 'Farookh Medical College & RI (FAME)',
    billType: 'credit',
    billNo: '013913',
    billedDate: '01-10-2026 at 02:22 PM',
    paymentStatus: 'Due',
    paidAmount: 0.0,
    dueAmount: 80.0,
    totalAmount: 80.0,
    status: 'Active',
    sponsors: '',
    mobile: '+91 98450 12343',
    items: [
      { name: 'Blood Glucose Fasting Screening', code: 'BIO-GLU-01', rate: 80.0, qty: 1, total: 80.0 }
    ]
  },
  {
    id: 'bill-4',
    patientName: 'Dr. Priyadarshini',
    patientTitle: 'Dr.',
    age: '34 yrs',
    gender: 'Female',
    regNo: '26100018',
    labNo: '13912',
    ipOpNo: '//',
    refCenter: 'Farookh Medical College & RI (FAME)',
    billType: 'credit',
    billNo: '013912',
    billedDate: '01-10-2026 at 02:20 PM',
    paymentStatus: 'Due',
    paidAmount: 0.0,
    dueAmount: 80.0,
    totalAmount: 80.0,
    status: 'Active',
    sponsors: '',
    mobile: '+91 98450 12344',
    items: [
      { name: 'Blood Glucose Fasting Screening', code: 'BIO-GLU-01', rate: 80.0, qty: 1, total: 80.0 }
    ]
  },
  {
    id: 'bill-5',
    patientName: 'Baby of. PALLAVI',
    patientTitle: 'Baby of.',
    age: '4 days',
    gender: 'Female',
    regNo: '26100017',
    labNo: '13911',
    ipOpNo: '//',
    refCenter: 'Farookh Medical College & RI (FAME)',
    billType: 'credit',
    billNo: '013911',
    billedDate: '01-10-2026 at 02:19 PM',
    paymentStatus: 'Due',
    paidAmount: 0.0,
    dueAmount: 50.0,
    totalAmount: 50.0,
    status: 'Active',
    sponsors: '',
    mobile: '+91 98450 12345',
    items: [
      { name: 'Neonatal Bilirubin (Total & Direct)', code: 'BIO-BIL-03', rate: 50.0, qty: 1, total: 50.0 }
    ]
  },
  {
    id: 'bill-6',
    patientName: 'Ms. CHANDRALATHA',
    patientTitle: 'Ms.',
    age: '27 yrs',
    gender: 'Female',
    regNo: '26100016',
    labNo: '13910',
    ipOpNo: '//',
    refCenter: 'SMART DIAGNOSTIC LAB',
    billType: 'cash',
    billNo: '013910',
    billedDate: '01-10-2026 at 02:10 PM',
    paymentStatus: 'Due',
    paidAmount: 0.0,
    dueAmount: 510.0,
    totalAmount: 510.0,
    status: 'Active',
    sponsors: '',
    mobile: '+91 98450 12346',
    items: [
      { name: 'Thyroid Stimulating Hormone (TSH Ultrasensitive)', code: 'END-TSH-01', rate: 260.0, qty: 1, total: 260.0 },
      { name: 'Complete Hemogram (CBC)', code: 'HEM-CBC-01', rate: 250.0, qty: 1, total: 250.0 }
    ]
  },
  {
    id: 'bill-7',
    patientName: 'Mrs. MUBEEN TAJ',
    patientTitle: 'Mrs.',
    age: '50 yrs',
    gender: 'Female',
    regNo: '26100015',
    labNo: '13909',
    ipOpNo: '//',
    refCenter: 'NAVAMI DIAGNOSTICS',
    billType: 'credit',
    billNo: '013909',
    billedDate: '01-10-2026 at 01:53 PM',
    paymentStatus: 'Due',
    paidAmount: 0.0,
    dueAmount: 200.0,
    totalAmount: 200.0,
    status: 'Active',
    sponsors: '',
    mobile: '+91 98450 12347',
    items: [
      { name: 'Serum Creatinine & Blood Urea', code: 'BIO-KFT-02', rate: 200.0, qty: 1, total: 200.0 }
    ]
  },
  {
    id: 'bill-8',
    patientName: 'Mr. RAHUL KUMAR',
    patientTitle: 'Mr.',
    age: '32 yrs',
    gender: 'Male',
    regNo: '26100014',
    labNo: '13908',
    ipOpNo: 'OP/2026/044',
    refCenter: 'MediUnify Central Reference Laboratory - Main Hub',
    billType: 'upi',
    billNo: '013908',
    billedDate: '01-10-2026 at 01:30 PM',
    paymentStatus: 'Paid',
    paidAmount: 3499.0,
    dueAmount: 0.0,
    totalAmount: 3499.0,
    status: 'Active',
    sponsors: 'Star Health Insurance',
    mobile: '+91 98765 43210',
    items: [
      { name: 'Complete Health Screening Package (7 Tests)', code: 'PKG-CHS-01', rate: 3499.0, qty: 1, total: 3499.0 }
    ]
  },
  {
    id: 'bill-9',
    patientName: 'Mrs. ANANYA SEN',
    patientTitle: 'Mrs.',
    age: '29 yrs',
    gender: 'Female',
    regNo: '26100013',
    labNo: '13907',
    ipOpNo: 'IP-1102',
    refCenter: 'Nova Diagnostics & Laboratory Centre',
    billType: 'credit',
    billNo: '013907',
    billedDate: '01-10-2026 at 01:15 PM',
    paymentStatus: 'Paid',
    paidAmount: 850.0,
    dueAmount: 0.0,
    totalAmount: 850.0,
    status: 'Active',
    sponsors: 'ECHS TPA',
    mobile: '+91 98765 43212',
    items: [
      { name: 'Lipid Profile Extended & Cardiac Risk Ratio', code: 'BIO-LIP-04', rate: 850.0, qty: 1, total: 850.0 }
    ]
  },
  {
    id: 'bill-10',
    patientName: 'Mr. VIJAY KUMAR',
    patientTitle: 'Mr.',
    age: '45 yrs',
    gender: 'Male',
    regNo: '26100012',
    labNo: '13906',
    ipOpNo: '//',
    refCenter: 'Farookh Medical College & RI (FAME)',
    billType: 'cash',
    billNo: '013906',
    billedDate: '01-10-2026 at 12:45 PM',
    paymentStatus: 'Due',
    paidAmount: 0.0,
    dueAmount: 1200.0,
    totalAmount: 1200.0,
    status: 'Active',
    sponsors: '',
    mobile: '+91 98765 43213',
    items: [
      { name: 'Diabetic & Renal Function Screen', code: 'PKG-DIA-02', rate: 1200.0, qty: 1, total: 1200.0 }
    ]
  },
  {
    id: 'bill-11',
    patientName: 'Mrs. MEENAKSHI SUNDARAM',
    patientTitle: 'Mrs.',
    age: '38 yrs',
    gender: 'Female',
    regNo: '26100011',
    labNo: '13905',
    ipOpNo: 'OP/2026/089',
    refCenter: 'CityCare Labs & Diagnostics',
    billType: 'upi',
    billNo: '013905',
    billedDate: '01-10-2026 at 11:30 AM',
    paymentStatus: 'Paid',
    paidAmount: 750.0,
    dueAmount: 0.0,
    totalAmount: 750.0,
    status: 'Active',
    sponsors: 'Arogya Karnataka',
    mobile: '+91 98765 43214',
    items: [
      { name: 'Liver Function Test (11 Parameters)', code: 'BIO-LFT-05', rate: 750.0, qty: 1, total: 750.0 }
    ]
  }
];

export default function NovusBillsView({ orders = [], onOpenOrderDetails }) {
  const { addToast } = useToast();

  // Alert Banner State
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [isValidityModalOpen, setIsValidityModalOpen] = useState(false);
  const [validityDaysRemaining, setValidityDaysRemaining] = useState(2);
  const [expiryDateFormatted, setExpiryDateFormatted] = useState('03-10-2026');

  // Input filter states (Filter inputs in single horizontal row)
  const [patientSearch, setPatientSearch] = useState('');
  const [patientNoFilter, setPatientNoFilter] = useState('');
  const [billNoFilter, setBillNoFilter] = useState('');
  const [labNoFilter, setLabNoFilter] = useState('');
  const [ipOpNoFilter, setIpOpNoFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [billedDateFilter, setBilledDateFilter] = useState('');

  // Applied Filter State (triggers on 'Search' or enter)
  const [appliedFilters, setAppliedFilters] = useState({
    patientSearch: '',
    patientNo: '',
    billNo: '',
    labNo: '',
    ipOpNo: '',
    paymentStatus: '',
    billedDate: ''
  });

  // Table Sorting State
  const [sortField, setSortField] = useState('billedDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // Selection Checkbox State
  const [selectedBillIds, setSelectedBillIds] = useState(new Set());

  // Modal States
  const [selectedBill, setSelectedBill] = useState(null);
  const [isBillDetailModalOpen, setIsBillDetailModalOpen] = useState(false);
  const [isBatchPrintModalOpen, setIsBatchPrintModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Mutable Billing Dataset (integrates baseline screenshot records with live project orders)
  const [bills, setBills] = useState(() => {
    // Merge baseline records with any live orders from props
    const liveOrderBills = orders.map((o, idx) => {
      const billIndex = 13904 - idx;
      const regIndex = 26100010 - idx;
      const dateFormatted = formatDateTimeWithAt(o.createdAt || '01-10-2026 at 10:15 AM');
      const isPaid = o.paymentStatus === 'Paid';
      const amt = Number(o.totalAmount || o.bookedItem?.price || 450.0);

      return {
        id: `order-bill-${o.orderId || idx}`,
        patientName: o.patient?.name || `Patient ${idx + 1}`,
        patientTitle: o.patient?.gender === 'Female' ? 'Mrs.' : 'Mr.',
        age: `${o.patient?.age || 35} yrs`,
        gender: o.patient?.gender || (idx % 2 === 0 ? 'Female' : 'Male'),
        regNo: String(regIndex),
        labNo: String(billIndex),
        ipOpNo: o.ipOpNo || '//',
        refCenter: o.center || o.collection?.center || 'MediUnify Central Reference Laboratory - Main Hub',
        billType: idx % 3 === 0 ? 'credit' : idx % 2 === 0 ? 'upi' : 'cash',
        billNo: `0${billIndex}`,
        billedDate: dateFormatted,
        paymentStatus: isPaid ? 'Paid' : 'Due',
        paidAmount: isPaid ? amt : 0.0,
        dueAmount: isPaid ? 0.0 : amt,
        totalAmount: amt,
        status: 'Active',
        sponsors: idx % 3 === 0 ? 'ECHS TPA' : '',
        mobile: o.patient?.phone || '+91 98765 00000',
        items: [
          {
            name: o.bookedItem?.name || o.testOrPackage?.name || 'Diagnostic Blood Battery',
            code: o.bookedItem?.code || 'LAB-GEN-01',
            rate: amt,
            qty: 1,
            total: amt
          }
        ]
      };
    });

    return [...REFERENCE_BILL_RECORDS, ...liveOrderBills];
  });

  // Handle Search Trigger
  const handleExecuteSearch = (e) => {
    if (e) e.preventDefault();
    setAppliedFilters({
      patientSearch: patientSearch.trim(),
      patientNo: patientNoFilter.trim(),
      billNo: billNoFilter.trim(),
      labNo: labNoFilter.trim(),
      ipOpNo: ipOpNoFilter.trim(),
      paymentStatus: paymentStatusFilter,
      billedDate: billedDateFilter
    });
  };

  // Handle Reset Filters
  const handleResetFilters = () => {
    setPatientSearch('');
    setPatientNoFilter('');
    setBillNoFilter('');
    setLabNoFilter('');
    setIpOpNoFilter('');
    setPaymentStatusFilter('');
    setBilledDateFilter('');

    setAppliedFilters({
      patientSearch: '',
      patientNo: '',
      billNo: '',
      labNo: '',
      ipOpNo: '',
      paymentStatus: '',
      billedDate: ''
    });
    addToast('Billing filters reset to default view', 'info');
  };

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    appliedFilters.patientSearch ||
    appliedFilters.patientNo ||
    appliedFilters.billNo ||
    appliedFilters.labNo ||
    appliedFilters.ipOpNo ||
    appliedFilters.paymentStatus ||
    appliedFilters.billedDate
  );

  // Filter & Sort Logic
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      // 1. Patient Name / Mobile Filter
      if (appliedFilters.patientSearch) {
        const query = appliedFilters.patientSearch.toLowerCase();
        const matchName = (b.patientName || '').toLowerCase().includes(query);
        const matchMobile = String(b.mobile || '').replace(/\s+/g, '').includes(query.replace(/\s+/g, ''));
        if (!matchName && !matchMobile) return false;
      }

      // 2. Patient Number / Reg Number Filter
      if (appliedFilters.patientNo) {
        const query = appliedFilters.patientNo.toLowerCase();
        if (!String(b.regNo || '').toLowerCase().includes(query)) return false;
      }

      // 3. Bill Number Filter
      if (appliedFilters.billNo) {
        const query = appliedFilters.billNo.toLowerCase();
        if (!String(b.billNo || '').toLowerCase().includes(query)) return false;
      }

      // 4. Lab Number Filter
      if (appliedFilters.labNo) {
        const query = appliedFilters.labNo.toLowerCase();
        if (!String(b.labNo || '').toLowerCase().includes(query)) return false;
      }

      // 5. IP/OP Number Filter
      if (appliedFilters.ipOpNo) {
        const query = appliedFilters.ipOpNo.toLowerCase();
        if (!String(b.ipOpNo || '').toLowerCase().includes(query)) return false;
      }

      // 6. Payment Status Filter
      if (appliedFilters.paymentStatus) {
        if (b.paymentStatus.toLowerCase() !== appliedFilters.paymentStatus.toLowerCase()) {
          return false;
        }
      }

      // 7. Billed Date Filter (Consistently matching DD-MM-YYYY)
      if (appliedFilters.billedDate) {
        if (!isDateMatching(b.billedDate, appliedFilters.billedDate)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'totalAmount' || sortField === 'dueAmount' || sortField === 'paidAmount') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else {
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [bills, appliedFilters, sortField, sortDirection]);

  // Sorting Column Toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Row Selection Helpers
  const isAllSelected = filteredBills.length > 0 && selectedBillIds.size === filteredBills.length;
  const isIndeterminate = selectedBillIds.size > 0 && selectedBillIds.size < filteredBills.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedBillIds(new Set());
    } else {
      const allIds = new Set(filteredBills.map((b) => b.id));
      setSelectedBillIds(allIds);
    }
  };

  const handleToggleSelectRow = (id) => {
    setSelectedBillIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Actions
  const handleOpenBillDetails = (bill) => {
    setSelectedBill(bill);
    setIsBillDetailModalOpen(true);
  };

  // Mark bill as Settled / Paid
  const handleSettleBill = (billId) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          const updated = {
            ...b,
            paymentStatus: 'Paid',
            paidAmount: b.totalAmount,
            dueAmount: 0.0
          };
          if (selectedBill?.id === billId) {
            setSelectedBill(updated);
          }
          return updated;
        }
        return b;
      })
    );
    addToast(`Bill settlement recorded successfully. Paid receipt generated.`, 'success');
  };

  // Header Print Action
  const handleHeaderPrint = () => {
    if (selectedBillIds.size === 0) {
      addToast('Printing all visible invoices...', 'info');
    } else {
      addToast(`Preparing print receipt for ${selectedBillIds.size} selected bills...`, 'info');
    }
    setIsBatchPrintModalOpen(true);
  };

  // Simulate Validity Renewal
  const handleRenewValidity = () => {
    setValidityDaysRemaining(365);
    setExpiryDateFormatted('09-10-2027');
    setIsValidityModalOpen(false);
    addToast('License validity successfully renewed for 1 Year (Expires: 09-10-2027)!', 'success');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Patient Name',
      'Age',
      'Gender',
      'Reg No',
      'Lab No',
      'IP/OP No',
      'Ref Center',
      'Bill Type',
      'Bill No',
      'Billed Date',
      'Paid/Due',
      'Status',
      'Sponsors',
      'Total Amount'
    ];

    const rows = filteredBills.map((b) => [
      `"${b.patientName}"`,
      `"${b.age}"`,
      `"${b.gender}"`,
      b.regNo,
      b.labNo,
      `"${b.ipOpNo}"`,
      `"${b.refCenter}"`,
      b.billType,
      b.billNo,
      `"${b.billedDate}"`,
      b.paymentStatus === 'Due' ? `Due (${b.dueAmount.toFixed(2)})` : 'Paid',
      b.status,
      `"${b.sponsors || '-'}"`,
      b.totalAmount.toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `MediUnify_Bills_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Billing ledger exported to CSV successfully', 'success');
  };

  // Render Sort Icon Helper
  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <span className="inline-flex ml-1 text-slate-400 group-hover:text-slate-600 transition-colors">
          <ArrowUpDown className="w-3 h-3" />
        </span>
      );
    }
    return sortDirection === 'asc' ? (
      <span className="inline-flex ml-1 text-brand-teal-700">
        <ArrowUp className="w-3 h-3" />
      </span>
    ) : (
      <span className="inline-flex ml-1 text-brand-teal-700">
        <ArrowDown className="w-3 h-3" />
      </span>
    );
  };

  return (
    <div className="w-full space-y-3.5 font-sans animate-fade-in text-brand-slate-800">
      
      {/* ========================================================
          1. NOTIFICATION / ALERT BANNER AT THE TOP (Exact Reference)
         ======================================================== */}
      {isAlertVisible && (
        <div className="relative flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-red-200 bg-red-50/70 text-red-900 shadow-2xs transition-all">
          <div className="flex items-center gap-3">
            {/* Alarm / Bell Icon in Pill Container matching reference */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 border border-red-200/60 flex-shrink-0">
              <Bell className="w-4 h-4" />
            </div>

            {/* Alert Message with Interactive Action */}
            <div className="text-xs sm:text-[13px] leading-relaxed text-slate-800">
              <span>Your Validity is about to expire in </span>
              <strong className="font-bold text-red-600">
                {validityDaysRemaining} {validityDaysRemaining === 1 ? 'day' : 'days'}
              </strong>
              <span> (Expiry Date: {expiryDateFormatted}). For Payment please </span>
              <button
                type="button"
                onClick={() => setIsValidityModalOpen(true)}
                className="font-bold text-red-600 hover:text-red-700 underline underline-offset-2 cursor-pointer transition-colors focus:outline-none"
              >
                click here
              </button>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={() => setIsAlertVisible(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-red-100/60 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================
          2. BREADCRUMB NAVIGATION & PAGE TITLE (Exact Reference)
         ======================================================== */}
      <div className="flex items-center justify-between py-1 text-slate-600">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          {/* Home Icon */}
          <button
            type="button"
            onClick={() => handleResetFilters()}
            className="text-brand-teal-700 hover:text-brand-teal-800 transition-colors focus:outline-none"
            title="Home / Overview"
          >
            <Home className="w-4 h-4" />
          </button>

          {/* Separator / Icon (thumb/chevron) */}
          <span className="text-slate-400 text-xs font-semibold select-none">
            &gt;
          </span>

          {/* Page Title: BILLS */}
          <h1 className="font-extrabold uppercase tracking-wide text-brand-slate-800 text-xs sm:text-sm">
            BILLS
          </h1>
        </div>

        {/* Far Right Action Icons (Guide Book Icon from screenshot) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsGuideModalOpen(true)}
            className="p-1.5 rounded-md text-brand-teal-700 hover:text-brand-teal-800 hover:bg-brand-teal-50 border border-transparent hover:border-brand-teal-200 transition-colors"
            title="Billing SOP & Standard Manual"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="p-1.5 rounded-md text-brand-slate-500 hover:text-brand-slate-800 hover:bg-brand-slate-100 transition-colors text-xs font-medium inline-flex items-center gap-1"
            title="Export Billing Ledger as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">CSV</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          3. SEARCH AND FILTER FIELDS IN A SINGLE HORIZONTAL ROW
         ======================================================== */}
      <form
        onSubmit={handleExecuteSearch}
        className="bg-white p-2.5 rounded-lg border border-brand-slate-200 shadow-2xs"
      >
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
          
          {/* 1. Patient Name / Mobile */}
          <div className="flex-1 min-w-[130px]">
            <input
              type="text"
              placeholder="Patient Name / Mobile"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs text-brand-slate-800 placeholder:text-slate-400 bg-white border border-brand-slate-200 rounded hover:border-brand-slate-300 focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500/20 transition-all font-medium"
            />
          </div>

          {/* 2. Patient No. */}
          <div className="w-full lg:w-[110px]">
            <input
              type="text"
              placeholder="Patient No."
              value={patientNoFilter}
              onChange={(e) => setPatientNoFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs text-brand-slate-800 placeholder:text-slate-400 bg-white border border-brand-slate-200 rounded hover:border-brand-slate-300 focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500/20 transition-all font-medium"
            />
          </div>

          {/* 3. Bill no */}
          <div className="w-full lg:w-[100px]">
            <input
              type="text"
              placeholder="Bill no"
              value={billNoFilter}
              onChange={(e) => setBillNoFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs text-brand-slate-800 placeholder:text-slate-400 bg-white border border-brand-slate-200 rounded hover:border-brand-slate-300 focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500/20 transition-all font-medium"
            />
          </div>

          {/* 4. Lab No */}
          <div className="w-full lg:w-[100px]">
            <input
              type="text"
              placeholder="Lab No"
              value={labNoFilter}
              onChange={(e) => setLabNoFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs text-brand-slate-800 placeholder:text-slate-400 bg-white border border-brand-slate-200 rounded hover:border-brand-slate-300 focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500/20 transition-all font-medium"
            />
          </div>

          {/* 5. IP/OP No. */}
          <div className="w-full lg:w-[100px]">
            <input
              type="text"
              placeholder="IP/OP No."
              value={ipOpNoFilter}
              onChange={(e) => setIpOpNoFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs text-brand-slate-800 placeholder:text-slate-400 bg-white border border-brand-slate-200 rounded hover:border-brand-slate-300 focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500/20 transition-all font-medium"
            />
          </div>

          {/* 6. Payment Status Dropdown */}
          <div className="w-full lg:w-[140px]">
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="w-full px-2 py-1.5 text-xs text-brand-slate-800 bg-white border border-brand-slate-200 rounded hover:border-brand-slate-300 focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500/20 transition-all font-medium cursor-pointer"
            >
              <option value="">Select payment s...</option>
              <option value="Due">Due</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          {/* 7. Billed Date (Consistently formatted to DD-MM-YYYY) */}
          <div className="relative w-full lg:w-[140px]">
            <input
              type="date"
              value={toHtmlDateValue(billedDateFilter)}
              onChange={(e) => {
                const standard = fromHtmlDateValue(e.target.value);
                setBilledDateFilter(standard);
              }}
              className="w-full pl-2.5 pr-7 py-1.5 text-xs text-brand-slate-800 bg-white border border-brand-slate-200 rounded hover:border-brand-slate-300 focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500/20 transition-all font-medium cursor-pointer"
              title="Filter by Billed Date (DD-MM-YYYY)"
            />
            {billedDateFilter ? (
              <button
                type="button"
                onClick={() => setBilledDateFilter('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title="Clear date"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-brand-teal-600">
                <Plus className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {/* 8. Search Button aligned to the right (Project's primary brand color) */}
          <div className="flex items-center gap-1.5">
            <button
              type="submit"
              className="w-full lg:w-auto px-5 py-1.5 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-semibold text-xs rounded shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/30"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>

            {/* Optional Reset button if any filter is active */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                title="Clear all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </form>

      {/* ========================================================
          4. BILLING RECORDS TABLE (Exact Reference Structure)
         ======================================================== */}
      <div className="bg-white rounded-lg border border-brand-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            
            {/* Table Header */}
            <thead>
              <tr className="bg-brand-slate-50 text-slate-600 font-bold border-b border-brand-slate-200 select-none text-[11px]">
                
                {/* 1. Name */}
                <th
                  onClick={() => handleSort('patientName')}
                  className="py-2.5 px-3 min-w-[170px] cursor-pointer hover:bg-brand-slate-100 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span>Name</span>
                    {renderSortIcon('patientName')}
                  </div>
                </th>

                {/* 2. Reg / Lab no */}
                <th
                  onClick={() => handleSort('labNo')}
                  className="py-2.5 px-3 min-w-[130px] cursor-pointer hover:bg-brand-slate-100 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span>Reg / Lab no</span>
                    {renderSortIcon('labNo')}
                  </div>
                </th>

                {/* 3. IP/OP No */}
                <th
                  onClick={() => handleSort('ipOpNo')}
                  className="py-2.5 px-2.5 min-w-[90px] cursor-pointer hover:bg-brand-slate-100 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span>IP/OP No</span>
                    {renderSortIcon('ipOpNo')}
                  </div>
                </th>

                {/* 4. Ref. Center */}
                <th
                  onClick={() => handleSort('refCenter')}
                  className="py-2.5 px-3 min-w-[180px] cursor-pointer hover:bg-brand-slate-100 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span>Ref. Center</span>
                    {renderSortIcon('refCenter')}
                  </div>
                </th>

                {/* 5. Bill type / No */}
                <th
                  onClick={() => handleSort('billNo')}
                  className="py-2.5 px-3 min-w-[120px] cursor-pointer hover:bg-brand-slate-100 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span>Bill type / No</span>
                    {renderSortIcon('billNo')}
                  </div>
                </th>

                {/* 6. Billed Date */}
                <th
                  onClick={() => handleSort('billedDate')}
                  className="py-2.5 px-3 min-w-[150px] cursor-pointer hover:bg-brand-slate-100 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span>Billed Date</span>
                    {renderSortIcon('billedDate')}
                  </div>
                </th>

                {/* 7. Paid / Due */}
                <th
                  onClick={() => handleSort('dueAmount')}
                  className="py-2.5 px-3 min-w-[100px] cursor-pointer hover:bg-brand-slate-100 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span>Paid / Due</span>
                    {renderSortIcon('dueAmount')}
                  </div>
                </th>

                {/* 8. Status */}
                <th
                  onClick={() => handleSort('status')}
                  className="py-2.5 px-2.5 min-w-[80px] cursor-pointer hover:bg-brand-slate-100 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    {renderSortIcon('status')}
                  </div>
                </th>

                {/* 9. Sponsors */}
                <th
                  onClick={() => handleSort('sponsors')}
                  className="py-2.5 px-3 min-w-[90px] cursor-pointer hover:bg-brand-slate-100 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span>Sponsors</span>
                    {renderSortIcon('sponsors')}
                  </div>
                </th>

                {/* 10. Total amount */}
                <th
                  onClick={() => handleSort('totalAmount')}
                  className="py-2.5 px-3 min-w-[100px] text-right cursor-pointer hover:bg-brand-slate-100 transition-colors group"
                >
                  <div className="flex items-center justify-end">
                    <span>Total amount</span>
                    {renderSortIcon('totalAmount')}
                  </div>
                </th>

                {/* 11. View Bill action column */}
                <th className="py-2.5 px-2.5 text-center min-w-[85px]">
                  <span>Action</span>
                </th>

                {/* 12. Print button & Checkbox header column (Exact reference layout) */}
                <th className="py-2.5 px-3 text-right min-w-[90px]">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleHeaderPrint}
                      className="px-2 py-0.5 rounded text-[11px] font-bold bg-brand-teal-600 hover:bg-brand-teal-700 text-white shadow-2xs transition-colors cursor-pointer"
                      title={selectedBillIds.size > 0 ? `Print ${selectedBillIds.size} Selected` : 'Print Ledger'}
                    >
                      print
                    </button>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={handleToggleSelectAll}
                      className="w-3.5 h-3.5 text-brand-teal-600 border-slate-300 rounded focus:ring-brand-teal-500 cursor-pointer"
                      title="Select all bills"
                    />
                  </div>
                </th>

              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-brand-slate-100 text-slate-700 font-medium">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                      <Search className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-slate-700 text-sm">No billing records found</div>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      No records matched the selected filters. Try clearing some criteria or searching by a different name/number.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-3 px-3 py-1.5 rounded-md text-xs font-semibold bg-brand-teal-50 text-brand-teal-700 hover:bg-brand-teal-100 border border-brand-teal-200 transition-colors inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Filters</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredBills.map((item) => {
                  const isSelected = selectedBillIds.has(item.id);
                  const isDue = item.paymentStatus === 'Due';

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-brand-teal-50/20 transition-colors ${
                        isSelected ? 'bg-brand-teal-50/40' : ''
                      }`}
                    >
                      {/* 1. Name */}
                      <td className="py-2.5 px-3">
                        <div
                          onClick={() => handleOpenBillDetails(item)}
                          className="font-bold text-slate-900 hover:text-brand-teal-700 cursor-pointer transition-colors leading-tight"
                        >
                          {item.patientName}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <span>{item.age} /</span>
                          {item.gender === 'Female' ? (
                            <span className="text-emerald-600 font-bold" title="Female">
                              &#9792;
                            </span>
                          ) : (
                            <span className="text-brand-teal-700 font-bold" title="Male">
                              &#9794;
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 2. Reg / Lab no */}
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">
                        {item.regNo} / {item.labNo}
                      </td>

                      {/* 3. IP/OP No */}
                      <td className="py-2.5 px-2.5 text-slate-500 font-mono text-[11px]">
                        {item.ipOpNo}
                      </td>

                      {/* 4. Ref. Center */}
                      <td className="py-2.5 px-3 text-slate-800 text-[11px] font-medium leading-tight">
                        {item.refCenter}
                      </td>

                      {/* 5. Bill type / No */}
                      <td className="py-2.5 px-3 text-slate-700 text-[11px] font-mono">
                        {item.billType} / {item.billNo}
                      </td>

                      {/* 6. Billed Date (Consistent DD-MM-YYYY format) */}
                      <td className="py-2.5 px-3 text-slate-600 text-[11px] whitespace-nowrap">
                        {item.billedDate}
                      </td>

                      {/* 7. Paid / Due (Exact reference layout: Pill badge on top, amount below) */}
                      <td className="py-2.5 px-3">
                        {isDue ? (
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white leading-tight">
                              Due
                            </span>
                            <span className="font-mono text-[11px] text-slate-800 font-semibold">
                              {Number(item.dueAmount).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-600 text-white leading-tight">
                              Paid
                            </span>
                            <span className="font-mono text-[11px] text-slate-800 font-semibold">
                              {Number(item.totalAmount).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* 8. Status */}
                      <td className="py-2.5 px-2.5 text-slate-700 text-[11px]">
                        {item.status}
                      </td>

                      {/* 9. Sponsors */}
                      <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                        {item.sponsors || ''}
                      </td>

                      {/* 10. Total amount */}
                      <td className="py-2.5 px-3 text-right font-mono text-[11px] text-slate-900 font-bold">
                        {Number(item.totalAmount).toFixed(2)}
                      </td>

                      {/* 11. View Bill action */}
                      <td className="py-2.5 px-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenBillDetails(item)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded hover:border-slate-400 transition-colors shadow-2xs cursor-pointer"
                        >
                          View Bill
                        </button>
                      </td>

                      {/* 12. Row selection checkbox */}
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(item.id)}
                          className="w-3.5 h-3.5 text-brand-teal-600 border-slate-300 rounded focus:ring-brand-teal-500 cursor-pointer"
                        />
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>

        {/* Table Summary Footer */}
        <div className="px-4 py-3 bg-brand-slate-50 border-t border-brand-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{filteredBills.length}</strong> of{' '}
            <strong className="text-slate-800">{bills.length}</strong> billing records
            {selectedBillIds.size > 0 && (
              <span className="ml-2 font-bold text-brand-teal-700">
                ({selectedBillIds.size} selected)
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>
              Total Billed:{' '}
              <strong className="font-mono text-slate-800 font-bold">
                ₹{filteredBills.reduce((s, b) => s + (b.totalAmount || 0), 0).toFixed(2)}
              </strong>
            </span>
            <span>•</span>
            <span className="text-rose-600">
              Total Due:{' '}
              <strong className="font-mono font-bold">
                ₹{filteredBills.reduce((s, b) => s + (b.dueAmount || 0), 0).toFixed(2)}
              </strong>
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================
          5. VIEW BILL DETAILS MODAL (MediUnify Diagnostics)
         ======================================================== */}
      {isBillDetailModalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-brand-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-brand-teal-700 text-white flex items-center justify-between border-b border-brand-teal-800">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-white/10 text-white">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">
                    Bill / Tax Invoice #{selectedBill.billNo}
                  </h3>
                  <p className="text-[11px] text-teal-100">
                    MediUnify Diagnostics • Central Mysuru Reference Hub
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBillDetailModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-brand-slate-700">
              
              {/* Patient & Center Metadata Box */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-brand-slate-50 border border-brand-slate-200 rounded-lg">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Details</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedBill.patientName}</div>
                  <div className="text-slate-600 mt-0.5">{selectedBill.age}, {selectedBill.gender}</div>
                  <div className="text-slate-500 font-mono text-[11px]">Mobile: {selectedBill.mobile}</div>
                  <div className="text-slate-500 font-mono text-[11px] mt-0.5">Reg No: {selectedBill.regNo}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order & Center Details</div>
                  <div className="text-slate-800 font-semibold mt-0.5">Lab No: {selectedBill.labNo}</div>
                  <div className="text-slate-600">IP/OP No: {selectedBill.ipOpNo}</div>
                  <div className="text-slate-600 text-[11px] font-medium mt-0.5 leading-snug">
                    Center: {selectedBill.refCenter}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Billed Date: {selectedBill.billedDate}
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Investigation & Diagnostics Breakdown
                </div>
                <div className="border border-brand-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-brand-slate-100 text-slate-700 font-bold border-b border-brand-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2 px-3">Item / Investigation</th>
                        <th className="py-2 px-2 text-center">Code</th>
                        <th className="py-2 px-2 text-right">Rate</th>
                        <th className="py-2 px-2 text-center">Qty</th>
                        <th className="py-2 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-slate-100">
                      {selectedBill.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 font-semibold text-slate-900">{it.name}</td>
                          <td className="py-2 px-2 text-center font-mono text-[11px] text-slate-500">{it.code}</td>
                          <td className="py-2 px-2 text-right font-mono text-slate-700">₹{it.rate.toFixed(2)}</td>
                          <td className="py-2 px-2 text-center text-slate-700">{it.qty}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">₹{it.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Calculation Box */}
              <div className="p-3.5 bg-slate-50 border border-brand-slate-200 rounded-lg space-y-1.5 font-medium">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Amount:</span>
                  <span className="font-mono">₹{selectedBill.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Healthcare GST Exemption:</span>
                  <span className="font-mono text-emerald-700 font-semibold">₹0.00 (0%)</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold pt-1.5 border-t border-slate-200 text-sm">
                  <span>Total Bill Amount:</span>
                  <span className="font-mono text-brand-teal-800">₹{selectedBill.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-1 text-slate-600">
                  <span>Amount Paid ({selectedBill.billType.toUpperCase()}):</span>
                  <span className="font-mono text-emerald-700 font-bold">₹{selectedBill.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="font-bold text-slate-800">Outstanding Balance Due:</span>
                  <span className={`font-mono font-black ${selectedBill.dueAmount > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                    ₹{selectedBill.dueAmount.toFixed(2)}
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="px-5 py-3 bg-brand-slate-50 border-t border-brand-slate-200 flex items-center justify-between">
              <div>
                {selectedBill.paymentStatus === 'Due' ? (
                  <button
                    type="button"
                    onClick={() => handleSettleBill(selectedBill.id)}
                    className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Settle & Mark as Paid</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Payment Fully Settled</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBillDetailModalOpen(false)}
                  className="px-3 py-1.5 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          6. BATCH PRINT MODAL
         ======================================================== */}
      {isBatchPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-brand-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-5 py-3.5 bg-brand-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4" />
                <h3 className="text-sm font-bold">Print Diagnostic Receipts</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBatchPrintModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 text-xs text-slate-700 space-y-3">
              <p>
                Ready to print{' '}
                <strong className="text-slate-900 font-bold">
                  {selectedBillIds.size > 0 ? selectedBillIds.size : filteredBills.length}
                </strong>{' '}
                diagnostic bill invoices matching the current view.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] space-y-1">
                <div className="font-semibold text-slate-800">Print Parameters:</div>
                <div className="text-slate-600">• Layout: Standard Healthcare Tax Invoice (A4 / Thermal 80mm)</div>
                <div className="text-slate-600">• Watermark: MediUnify NABL Certified Diagnostic Seal</div>
                <div className="text-slate-600">• Exemption: Form 3A Healthcare Notification</div>
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBatchPrintModalOpen(false)}
                className="px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsBatchPrintModalOpen(false);
                  window.print();
                }}
                className="px-4 py-1.5 rounded-md bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs inline-flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Confirm Print</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          7. VALIDITY SUBSCRIPTION RENEWAL MODAL
         ======================================================== */}
      {isValidityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-brand-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-5 py-3.5 bg-red-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <h3 className="text-sm font-bold">Subscription Validity Alert</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsValidityModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 text-xs text-slate-700 space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900 text-xs">
                Your MediUnify Laboratory Suite subscription will expire in{' '}
                <strong className="font-bold text-red-700">{validityDaysRemaining} days</strong> on{' '}
                <strong>{expiryDateFormatted}</strong>.
              </div>
              <p className="text-slate-600 leading-relaxed">
                Renew now to maintain uninterrupted lab connectivity, instant WhatsApp delivery of certified test reports, and multi-centre billing ledger synchronization.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] space-y-1 font-medium">
                <div className="flex justify-between">
                  <span>Account Tier:</span>
                  <span className="font-bold text-slate-800">MediUnify Enterprise Lab Hub</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Expiry:</span>
                  <span className="font-bold text-slate-800">{expiryDateFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Renewal Cycle:</span>
                  <span className="font-bold text-emerald-700">12 Months Dedicated License</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsValidityModalOpen(false)}
                className="px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs"
              >
                Remind Me Later
              </button>
              <button
                type="button"
                onClick={handleRenewValidity}
                className="px-4 py-1.5 rounded-md bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold text-xs inline-flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Renew Validity Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          8. BILLING GUIDE / SOP MODAL
         ======================================================== */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-brand-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-5 py-3.5 bg-brand-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-teal-400" />
                <h3 className="text-sm font-bold">Billing Guidelines & Operational SOP</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGuideModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 text-xs text-slate-700 space-y-3 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="font-bold text-slate-900">1. Searching & Ledger Filtering</h4>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Use the horizontal toolbar above to filter records by Patient Name, Patient Number, Bill Number, Lab Number, IP/OP Number, or Payment Status. Dates are formatted in project standard DD-MM-YYYY format.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">2. Settling Due Accounts</h4>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Invoices marked with the red <code>Due</code> badge can be settled directly by clicking "View Bill" and selecting "Settle & Mark as Paid".
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">3. Batch Printing</h4>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Select checkboxes on individual rows and click the "print" button in the table header to generate batch thermal or A4 receipts for referring centres.
                </p>
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsGuideModalOpen(false)}
                className="px-4 py-1.5 rounded-md bg-brand-slate-800 hover:bg-brand-slate-900 text-white font-bold text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
