// MediUnify Portal Scoped Search Indexing Engine
// Extracts and builds searchable records strictly for the active service portal.

import { INITIAL_CARE_REQUESTS, INITIAL_STAFF_ROSTER, NURSING_SERVICES_CATALOG, INITIAL_CUSTOM_QUOTES } from '../data/homeNursingData';
import { NURSES_LIST } from '../data/homeCareData';
import { LAB_TESTS, LAB_CATEGORIES, LAB_PACKAGES, LAB_SAMPLES, LAB_BOOKINGS } from '../data/labData';
import { INITIAL_EQUIPMENT_REQUESTS, REGISTERED_VENDORS } from '../data/equipmentRentalData';
import { PHARMACY_MEDICINES, PHARMACY_ORDERS } from '../data/pharmacyData';
import { RADIOLOGY_MODALITIES, RADIOLOGY_BOOKINGS } from '../data/radiologyData';
import { INITIAL_SURGERY_PATIENTS, SURGERY_CATEGORIES, INITIAL_HOSPITALS } from '../data/surgeryData';

/**
 * Returns an array of searchable items strictly scoped to the active currentService
 * @param {Object} currentService - The active service configuration object
 * @param {Function} setActiveModule - Function to navigate to a module
 * @param {Function} onNavigate - Optional custom navigation handler
 * @param {Function} onClose - Function to close the search modal
 */
export function getPortalSearchIndex(currentService, setActiveModule, onNavigate, onClose) {
  if (!currentService) return [];

  const serviceId = currentService.id;
  const items = [];

  const handleAction = (moduleId, extraData = null) => {
    setActiveModule(moduleId);
    if (onNavigate) onNavigate(serviceId, moduleId, extraData);
    if (onClose) onClose();
  };

  // 1. MODULES & NAVIGATION
  if (currentService.modules && Array.isArray(currentService.modules)) {
    currentService.modules.forEach((mod) => {
      items.push({
        id: `mod-${serviceId}-${mod.id}`,
        category: 'Module Navigation',
        title: `${currentService.name} › ${mod.name}`,
        subtitle: `Jump to ${mod.name} module in ${currentService.fullName}`,
        iconName: mod.iconName || 'LayoutDashboard',
        badge: 'Module',
        badgeColor: 'bg-brand-slate-100 text-brand-slate-700',
        keywords: `${mod.name} navigation page screen view ${currentService.name}`,
        action: () => handleAction(mod.id)
      });
    });
  }

  // 2. HOME CARE / HOME NURSING
  if (serviceId === 'home-nursing' || serviceId === 'home-care') {
    // (a) Patients & Service Requests
    if (Array.isArray(INITIAL_CARE_REQUESTS)) {
      INITIAL_CARE_REQUESTS.forEach((req) => {
        items.push({
          id: `hcare-req-${req.id}`,
          category: 'Patients & Requests',
          title: `${req.patientName}`,
          subtitle: `${req.serviceName} • ${req.location || req.address || 'Mysore'} • ${req.id} • Status: ${req.status}`,
          iconName: 'User',
          badge: 'Patient / Request',
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
          keywords: `${req.patientName} ${req.id} ${req.patientId} ${req.serviceName} ${req.location} ${req.phone} ${req.assignedStaff} ${req.status} patient care request`,
          action: () => handleAction('requests', { requestId: req.id, patientName: req.patientName })
        });
      });
    }

    // (b) Custom Quote Patients
    if (Array.isArray(INITIAL_CUSTOM_QUOTES)) {
      INITIAL_CUSTOM_QUOTES.forEach((quote) => {
        items.push({
          id: `hcare-quote-${quote.id}`,
          category: 'Patients & Requests',
          title: `${quote.patientName} (Custom Quote)`,
          subtitle: `${quote.serviceType || 'Specialized Care'} • ${quote.location || 'Mysore'} • ${quote.id} • Status: ${quote.status}`,
          iconName: 'ClipboardList',
          badge: 'Custom Quote',
          badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
          keywords: `${quote.patientName} ${quote.id} ${quote.phone} ${quote.serviceType} ${quote.location} quote patient`,
          action: () => handleAction('requests', { quoteId: quote.id })
        });
      });
    }

    // (c) Staff & Nurses Roster
    const staffList = (INITIAL_STAFF_ROSTER && INITIAL_STAFF_ROSTER.length > 0) ? INITIAL_STAFF_ROSTER : NURSES_LIST;
    if (Array.isArray(staffList)) {
      staffList.forEach((staff) => {
        items.push({
          id: `hcare-staff-${staff.id || staff.name}`,
          category: 'Nurses & Care Staff',
          title: `${staff.name}`,
          subtitle: `${staff.role || 'Staff Nurse'} • ${staff.qualification || staff.specialization || 'Clinical Nurse'} • ${staff.location || 'Mysore'} • Rating: ${staff.rating || '5.0'}★`,
          iconName: 'UserCheck',
          badge: 'Nurse Roster',
          badgeColor: 'bg-teal-50 text-teal-700 border border-teal-200',
          keywords: `${staff.name} ${staff.role} ${staff.qualification} ${staff.phone} ${staff.location} nurse staff roster`,
          action: () => handleAction('nurses', { staffId: staff.id })
        });
      });
    }

    // (d) Nursing Services Catalog
    if (Array.isArray(NURSING_SERVICES_CATALOG)) {
      NURSING_SERVICES_CATALOG.forEach((srv) => {
        items.push({
          id: `hcare-srv-${srv.id}`,
          category: 'Nursing Services',
          title: `${srv.name}`,
          subtitle: `${srv.category} • Base Rate: ₹${srv.baseRate} • Duration: ${srv.typicalDuration} • ${srv.description}`,
          iconName: srv.iconName || 'HeartHandshake',
          badge: 'Service',
          badgeColor: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
          keywords: `${srv.name} ${srv.category} ${srv.description} ${srv.requiredQualification} nursing service rate`,
          action: () => handleAction('requests')
        });
      });
    }
  }

  // 3. LAB SERVICES
  if (serviceId === 'lab') {
    // (a) Lab Tests
    if (Array.isArray(LAB_TESTS)) {
      LAB_TESTS.forEach((test) => {
        items.push({
          id: `lab-test-${test.id}`,
          category: 'Diagnostic Tests',
          title: `${test.name}`,
          subtitle: `Code: ${test.code} • ₹${test.price} • ${test.category} • TAT: ${test.tat} • Sample: ${test.sampleType}`,
          iconName: 'TestTube2',
          badge: 'Lab Test',
          badgeColor: 'bg-teal-50 text-teal-700 border border-teal-200',
          keywords: `${test.name} ${test.code} ${test.category} ${test.sampleType} test lab blood urine fasting`,
          action: () => handleAction('tests', { testId: test.id })
        });
      });
    }

    // (b) Test Categories
    if (Array.isArray(LAB_CATEGORIES)) {
      LAB_CATEGORIES.forEach((cat) => {
        items.push({
          id: `lab-cat-${cat.id}`,
          category: 'Test Categories',
          title: `${cat.name}`,
          subtitle: `${cat.description} • ${cat.testCount || 20}+ Active Tests`,
          iconName: 'FolderKanban',
          badge: 'Category',
          badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
          keywords: `${cat.name} ${cat.description} category department lab`,
          action: () => handleAction('categories', { catId: cat.id })
        });
      });
    }

    // (c) Test Packages
    if (Array.isArray(LAB_PACKAGES)) {
      LAB_PACKAGES.forEach((pkg) => {
        items.push({
          id: `lab-pkg-${pkg.id}`,
          category: 'Diagnostic Packages',
          title: `${pkg.name}`,
          subtitle: `Code: ${pkg.code} • ₹${pkg.price} (Orig: ₹${pkg.originalPrice}) • ${pkg.testCount} Tests Included • TAT: ${pkg.tat}`,
          iconName: 'Boxes',
          badge: 'Health Package',
          badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200',
          keywords: `${pkg.name} ${pkg.code} ${pkg.description} package checkup health`,
          action: () => handleAction('packages', { pkgId: pkg.id })
        });
      });
    }

    // (d) Samples & Patient Collection Records
    if (Array.isArray(LAB_SAMPLES)) {
      LAB_SAMPLES.forEach((sample) => {
        items.push({
          id: `lab-sample-${sample.sampleId}`,
          category: 'Samples & Patients',
          title: `${sample.patientName} (${sample.sampleId})`,
          subtitle: `${sample.testName} • ${sample.sampleType} • Phlebotomist: ${sample.phlebotomist || 'Unassigned'} • Status: ${sample.status}`,
          iconName: 'Pipette',
          badge: 'Sample / Patient',
          badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
          keywords: `${sample.patientName} ${sample.sampleId} ${sample.barcode} ${sample.testName} ${sample.phlebotomist} ${sample.status} sample patient collection`,
          action: () => handleAction(sample.collectionType === 'Home Collection' ? 'home-collection' : 'samples', { sampleId: sample.sampleId })
        });
      });
    }

    // (e) Lab Bookings
    if (Array.isArray(LAB_BOOKINGS)) {
      LAB_BOOKINGS.forEach((bk) => {
        items.push({
          id: `lab-bk-${bk.id}`,
          category: 'Lab Bookings',
          title: `${bk.patientName} • ${bk.id}`,
          subtitle: `${bk.testName || 'Diagnostic Profile'} • ₹${bk.amount || 500} • Slot: ${bk.slot || 'Today'} • Status: ${bk.status}`,
          iconName: 'CalendarCheck2',
          badge: 'Booking',
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
          keywords: `${bk.patientName} ${bk.id} ${bk.phone} ${bk.testName} booking lab`,
          action: () => handleAction('bookings', { bookingId: bk.id })
        });
      });
    }
  }

  // 4. EQUIPMENT RENTALS
  if (serviceId === 'equipment-rentals' || serviceId === 'equipment-rental') {
    // (a) Rental Requests
    if (Array.isArray(INITIAL_EQUIPMENT_REQUESTS)) {
      INITIAL_EQUIPMENT_REQUESTS.forEach((req) => {
        items.push({
          id: `eq-req-${req.id}`,
          category: 'Rental Requests',
          title: `${req.patientName} (${req.id})`,
          subtitle: `${req.equipment} (Qty: ${req.quantity || 1}) • ${req.rentalPeriod || req.rentalStartDate} • ${req.deliveryLocation} • Status: ${req.status}`,
          iconName: 'Inbox',
          badge: 'Rental Request',
          badgeColor: 'bg-teal-50 text-teal-700 border border-teal-200',
          keywords: `${req.patientName} ${req.id} ${req.equipment} ${req.contactNumber} ${req.deliveryLocation} ${req.status} rental equipment`,
          action: () => handleAction('requests', { requestId: req.id })
        });
      });
    }

    // (b) Registered Vendors
    if (Array.isArray(REGISTERED_VENDORS)) {
      REGISTERED_VENDORS.forEach((vendor) => {
        items.push({
          id: `eq-vend-${vendor.id}`,
          category: 'Registered Vendors',
          title: `${vendor.name}`,
          subtitle: `Equipment: ${vendor.equipment} • Phone: ${vendor.contact} • Location: ${vendor.location}`,
          iconName: 'Building2',
          badge: 'Vendor',
          badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
          keywords: `${vendor.name} ${vendor.equipment} ${vendor.contact} ${vendor.location} vendor partner`,
          action: () => handleAction('vendors', { vendorId: vendor.id })
        });
      });
    }
  }

  // 5. PHARMACY & MULTIPLE PHARMACY
  if (serviceId === 'pharmacy' || serviceId === 'third-party-pharmacy' || serviceId === 'multiple-pharmacy') {
    // (a) Medicine Catalog
    if (Array.isArray(PHARMACY_MEDICINES)) {
      PHARMACY_MEDICINES.forEach((med) => {
        items.push({
          id: `pharm-med-${med.id}`,
          category: 'Medicine Catalog',
          title: `${med.name}`,
          subtitle: `${med.dosage || ''} ${med.form || 'Tablet'} • ₹${med.price} • Stock: ${med.stock} units • Mfr: ${med.manufacturer || 'Standard'}`,
          iconName: 'Pill',
          badge: 'Medicine',
          badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
          keywords: `${med.name} ${med.genericName || ''} ${med.category} ${med.manufacturer} medicine drug tablet syrup prescription`,
          action: () => handleAction('medicines', { medId: med.id })
        });
      });
    }

    // (b) Pharmacy Orders
    if (Array.isArray(PHARMACY_ORDERS)) {
      PHARMACY_ORDERS.forEach((ord) => {
        items.push({
          id: `pharm-ord-${ord.id}`,
          category: 'Orders & Prescriptions',
          title: `${ord.customerName} (${ord.id})`,
          subtitle: `${ord.itemsCount || 3} Medicines • ₹${ord.totalAmount || 450} • Delivery: ${ord.deliveryType || 'Home Delivery'} • Status: ${ord.status}`,
          iconName: 'ShoppingBag',
          badge: 'Pharmacy Order',
          badgeColor: 'bg-teal-50 text-teal-700 border border-teal-200',
          keywords: `${ord.customerName} ${ord.id} ${ord.phone} order prescription delivery customer`,
          action: () => handleAction('orders', { orderId: ord.id })
        });
      });
    }
  }

  // 6. RADIOLOGY
  if (serviceId === 'radiology') {
    // (a) Imaging Modalities & Scans
    if (Array.isArray(RADIOLOGY_MODALITIES)) {
      RADIOLOGY_MODALITIES.forEach((mod) => {
        items.push({
          id: `rad-mod-${mod.id}`,
          category: 'Imaging Modalities',
          title: `${mod.name}`,
          subtitle: `Type: ${mod.type} • ₹${mod.price} • Duration: ${mod.duration} • Machines: ${mod.machineModel || 'Siemens / GE'}`,
          iconName: 'ScanLine',
          badge: 'Radiology Scan',
          badgeColor: 'bg-teal-50 text-teal-700 border border-teal-200',
          keywords: `${mod.name} ${mod.type} ${mod.code || ''} ${mod.prepNotes || ''} scan mri ct xray ultrasound radiology`,
          action: () => handleAction('modalities', { modalityId: mod.id })
        });
      });
    }

    // (b) Radiology Bookings & Patients
    if (Array.isArray(RADIOLOGY_BOOKINGS)) {
      RADIOLOGY_BOOKINGS.forEach((bk) => {
        items.push({
          id: `rad-bk-${bk.id}`,
          category: 'Scan Appointments',
          title: `${bk.patientName} (${bk.id})`,
          subtitle: `${bk.scanName || 'Diagnostic Scan'} • Radiologist: ${bk.radiologist || 'Dr. Sanjeev Rao'} • Slot: ${bk.slot || 'Today'} • Status: ${bk.status}`,
          iconName: 'Calendar',
          badge: 'Appointment',
          badgeColor: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
          keywords: `${bk.patientName} ${bk.id} ${bk.scanName} ${bk.radiologist} scan patient appointment radiology`,
          action: () => handleAction('bookings', { bookingId: bk.id })
        });
      });
    }
  }

  // 7. SURGERY
  if (serviceId === 'surgery') {
    // (a) Surgery Patients
    if (Array.isArray(INITIAL_SURGERY_PATIENTS)) {
      INITIAL_SURGERY_PATIENTS.forEach((pat) => {
        items.push({
          id: `surg-pat-${pat.patientId || pat.id}`,
          category: 'Patient Inquiries & Leads',
          title: `${pat.patientName || pat.name}`,
          subtitle: `Procedure: ${pat.neededSurgery || pat.procedure || pat.surgeryName || 'Surgical Care'} • Location: ${pat.cityName || pat.city || 'Karnataka'} • Phone: ${pat.mobileNumber || pat.phone} • Urgency: ${pat.urgency || 'Elective'}`,
          iconName: 'Activity',
          badge: 'Surgery Patient',
          badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200',
          keywords: `${pat.patientName || pat.name} ${pat.patientId || pat.id} ${pat.neededSurgery || pat.procedure || ''} ${pat.mobileNumber || pat.phone || ''} ${pat.cityName || pat.city || ''} surgery patient lead inquiry`,
          action: () => handleAction('dashboard', { patientId: pat.patientId || pat.id })
        });
      });
    }

    // (b) Surgery Categories
    if (Array.isArray(SURGERY_CATEGORIES)) {
      SURGERY_CATEGORIES.forEach((cat) => {
        items.push({
          id: `surg-cat-${cat.id}`,
          category: 'Surgical Procedures',
          title: `${cat.name}`,
          subtitle: `${cat.description || 'Specialized surgical treatment'} • ${cat.procedureCount || 15}+ Surgeries Available`,
          iconName: 'HeartHandshake',
          badge: 'Procedure Category',
          badgeColor: 'bg-slate-100 text-slate-700',
          action: () => handleAction('requests')
        });
      });
    }

    // (c) Partner Hospitals
    if (Array.isArray(INITIAL_HOSPITALS)) {
      INITIAL_HOSPITALS.forEach((hosp) => {
        items.push({
          id: `surg-hosp-${hosp.id}`,
          category: 'Partner Hospitals',
          title: hosp.name,
          subtitle: `${hosp.type} • ${hosp.city} • Specializations: ${(hosp.specializations || []).slice(0, 3).join(', ')} • Status: ${hosp.status}`,
          iconName: 'Building2',
          badge: hosp.status === 'Active' ? 'Active Hospital' : 'Inactive Hospital',
          badgeColor: hosp.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700',
          keywords: `${hosp.name} ${hosp.city} ${hosp.address} ${hosp.type} ${(hosp.specializations || []).join(' ')} hospital surgery clinic`,
          action: () => handleAction('hospitals', { hospitalId: hosp.id })
        });
      });
    }
  }

  return items;
}
