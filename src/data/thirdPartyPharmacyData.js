/**
 * Third-Party Pharmacy Network Data
 * Mock dataset supporting external pharmacy partners, split orders,
 * unavailable medicine redirection, order tracking, and payment reconciliation.
 */

export const INITIAL_PARTNER_PHARMACIES = [
  {
    id: 'PART-001',
    name: 'MedPlus Pharmacy (Kuvempunagar)',
    shortCode: 'MEDPLUS-KVP',
    licenseNumber: 'KA-MYS-20B-89214',
    gstin: '29ABCDE1234F1Z5',
    contactPerson: 'Ramesh Rao, B.Pharm',
    phone: '+91 98450 12345',
    email: 'medplus.kuvempunagar@partners.mediunify.com',
    address: '#144, Adichunchanagiri Road, Kuvempunagar, Mysore - 570023',
    area: 'Kuvempunagar',
    city: 'Mysore',
    pincode: '570023',
    deliveryRadiusKm: 6.5,
    distanceFromHubKm: 2.4,
    rating: 4.9,
    reviewsCount: 342,
    fulfillmentRate: 98.8,
    avgDeliveryMins: 32,
    activeOrdersLoad: 3,
    maxDailyCapacity: 40,
    verificationStatus: 'Verified',
    operationalStatus: 'Active',
    joinedDate: '12 Jan 2025',
    categoriesSupported: ['Cold Chain / Insulin', 'Cardiac', 'Diabetic', 'Emergency Antibiotics'],
    bankDetails: {
      accountName: 'MedPlus Kuvempunagar Enterprises',
      accountNumber: '••••••••4829',
      ifsc: 'HDFC0001248',
      bank: 'HDFC Bank, Kuvempunagar'
    }
  },
  {
    id: 'PART-002',
    name: 'Apollo Pharmacy Partner (Vontikoppal)',
    shortCode: 'APOLLO-VTK',
    licenseNumber: 'KA-MYS-21B-94301',
    gstin: '29BCDEF2345G2Z6',
    contactPerson: 'Dr. Shalini Hegde',
    phone: '+91 98450 23456',
    email: 'apollo.vontikoppal@partners.mediunify.com',
    address: '#88, Temple Road, Vontikoppal, Mysore - 570002',
    area: 'Vontikoppal / Gokulam',
    city: 'Mysore',
    pincode: '570002',
    deliveryRadiusKm: 8.0,
    distanceFromHubKm: 3.8,
    rating: 4.8,
    reviewsCount: 518,
    fulfillmentRate: 97.4,
    avgDeliveryMins: 28,
    activeOrdersLoad: 4,
    maxDailyCapacity: 50,
    verificationStatus: 'Verified',
    operationalStatus: 'Active',
    joinedDate: '04 Mar 2025',
    categoriesSupported: ['Specialty Oncology', 'Critical Injections', 'Dermatology', 'Surgical Disposables'],
    bankDetails: {
      accountName: 'Apollo Retail Healthcare Mysore',
      accountNumber: '••••••••9102',
      ifsc: 'ICIC0000341',
      bank: 'ICICI Bank, Vontikoppal'
    }
  },
  {
    id: 'PART-003',
    name: 'Sanjeevani MedStore (Saraswathipuram)',
    shortCode: 'SANJEEV-SSP',
    licenseNumber: 'KA-MYS-20B-78102',
    gstin: '29CDEFG3456H3Z7',
    contactPerson: 'Manjunath Swamy',
    phone: '+91 98450 34567',
    email: 'sanjeevani.store@partners.mediunify.com',
    address: '#56, 5th Main, Saraswathipuram, Mysore - 570009',
    area: 'Saraswathipuram',
    city: 'Mysore',
    pincode: '570009',
    deliveryRadiusKm: 5.0,
    distanceFromHubKm: 1.9,
    rating: 4.7,
    reviewsCount: 198,
    fulfillmentRate: 96.2,
    avgDeliveryMins: 35,
    activeOrdersLoad: 1,
    maxDailyCapacity: 30,
    verificationStatus: 'Verified',
    operationalStatus: 'Active',
    joinedDate: '19 May 2025',
    categoriesSupported: ['Generic Replacements', 'Pediatric Formulations', 'Ayurvedic OTC', 'Respiratory Inhalers'],
    bankDetails: {
      accountName: 'Sanjeevani MedStore LLP',
      accountNumber: '••••••••3319',
      ifsc: 'SBIN0040182',
      bank: 'State Bank of India, Saraswathipuram'
    }
  },
  {
    id: 'PART-004',
    name: 'Cauvery 24/7 Chemist & Druggist',
    shortCode: 'CAUVERY-247',
    licenseNumber: 'KA-MYS-20B-66290',
    gstin: '29DEFGHI4567I4Z8',
    contactPerson: 'Syed Tanveer Ahmed',
    phone: '+91 98450 45678',
    email: 'cauvery.chemists@partners.mediunify.com',
    address: '#19, Irwin Road, Near City Hospital, Mysore - 570001',
    area: 'Central / Mandi Mohalla',
    city: 'Mysore',
    pincode: '570001',
    deliveryRadiusKm: 10.0,
    distanceFromHubKm: 4.2,
    rating: 4.9,
    reviewsCount: 680,
    fulfillmentRate: 99.1,
    avgDeliveryMins: 25,
    activeOrdersLoad: 2,
    maxDailyCapacity: 60,
    verificationStatus: 'Verified',
    operationalStatus: 'Active',
    joinedDate: '02 Aug 2025',
    categoriesSupported: ['24/7 Emergency Delivery', 'ICU Medications', 'Pain Management', 'Anti-Infectives'],
    bankDetails: {
      accountName: 'Cauvery Drugs & Surgicals',
      accountNumber: '••••••••7762',
      ifsc: 'KKBK0008201',
      bank: 'Kotak Mahindra Bank, Irwin Road'
    }
  },
  {
    id: 'PART-005',
    name: 'GreenCross Health Pharmacy (Hebbal)',
    shortCode: 'GREENCROSS-HBL',
    licenseNumber: 'KA-MYS-20B-55319',
    gstin: '29EFGHIJ5678J5Z9',
    contactPerson: 'Kavitha Murthy',
    phone: '+91 98450 56789',
    email: 'greencross.hebbal@partners.mediunify.com',
    address: '#72, Industrial Suburb, Ring Road, Hebbal, Mysore - 570016',
    area: 'Hebbal / Industrial Area',
    city: 'Mysore',
    pincode: '570016',
    deliveryRadiusKm: 7.5,
    distanceFromHubKm: 6.1,
    rating: 4.6,
    reviewsCount: 145,
    fulfillmentRate: 94.5,
    avgDeliveryMins: 40,
    activeOrdersLoad: 1,
    maxDailyCapacity: 25,
    verificationStatus: 'Verified',
    operationalStatus: 'Active',
    joinedDate: '15 Nov 2025',
    categoriesSupported: ['Industrial Health', 'First Aid Bulk', 'Gastroenterology', 'General Wellness'],
    bankDetails: {
      accountName: 'GreenCross Care Retailers',
      accountNumber: '••••••••1109',
      ifsc: 'BARB0HEBBAL',
      bank: 'Bank of Baroda, Hebbal'
    }
  },
  {
    id: 'PART-006',
    name: 'Lifeline Speciality Pharma (Vijayanagar)',
    shortCode: 'LIFELINE-VJN',
    licenseNumber: 'KA-MYS-21B-44102',
    gstin: '29FGHIJK6789K6Z0',
    contactPerson: 'Prashanth Nayak',
    phone: '+91 98450 67890',
    email: 'lifeline.vjn@partners.mediunify.com',
    address: '#31, High Tension Double Road, Vijayanagar 2nd Stage, Mysore - 570017',
    area: 'Vijayanagar',
    city: 'Mysore',
    pincode: '570017',
    deliveryRadiusKm: 6.0,
    distanceFromHubKm: 4.5,
    rating: 4.5,
    reviewsCount: 92,
    fulfillmentRate: 91.0,
    avgDeliveryMins: 45,
    activeOrdersLoad: 0,
    maxDailyCapacity: 20,
    verificationStatus: 'Pending Verification',
    operationalStatus: 'Inactive',
    joinedDate: '01 Oct 2026',
    categoriesSupported: ['Neurology', 'Psychiatry Formulations', 'Hormone Therapies'],
    bankDetails: {
      accountName: 'Lifeline Speciality Retail',
      accountNumber: '••••••••5543',
      ifsc: 'AXIS0001092',
      bank: 'Axis Bank, Vijayanagar'
    }
  }
];

export const INITIAL_EXTERNAL_ORDERS = [
  {
    orderId: 'EXT-ORD-881',
    parentOrderId: 'ORD-2026-881',
    hubOrderId: 'ORD-2026-881-HUB',
    patientName: 'Meera Krishnan',
    patientPhoneMasked: '+91 98450 •••••',
    patientArea: 'Kuvempunagar',
    patientCity: 'Mysore',
    patientPincode: '570023',
    patientDeliveryAddress: 'Flat 302, Royal Residency, 14th Main, Kuvempunagar, Mysore - 570023',
    orderDate: '13 Oct 2026, 11:30 AM',
    prescriptionRef: 'RX-88219 (Dr. A. Sundaram, Cardiologist)',
    isSplitOrder: true,
    totalOriginalItems: 5,
    hubItemsFulfilled: 4,
    externalItemsCount: 1,
    splitNote: '1 out of 5 medicines was out of stock in Central Hub; successfully split and rerouted to third-party partner.',
    
    // Unavailable medicines redirected to Third-Party
    unavailableMedicines: [
      {
        id: 'EXT-MED-01',
        name: 'Lantus Solostar 100IU/ml Cartridge Pen',
        genericName: 'Insulin Glargine',
        strength: '100 IU/ml (3ml pre-filled)',
        dosageForm: 'Subcutaneous Pen',
        quantity: 2,
        pricePerUnit: 680.00,
        total: 1360.00,
        hubStockStatus: 'Out of Stock in Central Hub (Available: 0)',
        urgency: 'High (Diabetic Care)'
      }
    ],

    // Available medicines fulfilled concurrently by Central Hub
    hubMedicines: [
      { name: 'Metformin 500mg SR', qty: 60, price: 2.80, total: 168.00 },
      { name: 'Telma 40mg Tablet', qty: 30, price: 9.80, total: 294.00 },
      { name: 'Atorvastatin 10mg', qty: 30, price: 8.50, total: 255.00 },
      { name: 'Vitamin D3 60,000 IU', qty: 4, price: 28.00, total: 112.00 }
    ],

    assignedPharmacyId: 'PART-001',
    assignedPharmacyName: 'MedPlus Pharmacy (Kuvempunagar)',
    assignedPharmacyContact: 'Ramesh Rao (+91 98450 12345)',
    status: 'Preparing', // Pending Assignment | Assigned | Accepted | Preparing | Dispatched | Delivered | Cancelled
    orderAmount: 1360.00,
    pharmacyPayoutAmount: 1292.00, // 95%
    platformFee: 68.00, // 5%
    paymentMode: 'Online Prepaid (UPI)',
    paymentStatus: 'Paid by Patient',
    settlementStatus: 'Pending Settlement',
    deliveryPartner: 'MedPlus Dedicated Express Rider',
    deliveryRiderName: 'Santhosh Kumar',
    deliveryRiderPhoneMasked: '+91 97401 •••••',
    estimatedDeliveryTime: 'Today, 01:15 PM',
    lastUpdated: '12 mins ago',
    timeline: [
      { stage: 'Order Placed by Patient', time: '13 Oct, 11:28 AM', done: true, notes: 'Patient ordered 5 medicines online.' },
      { stage: 'Hub Stock Evaluation', time: '13 Oct, 11:30 AM', done: true, notes: '4 items in stock; Lantus out of stock in Central Hub.' },
      { stage: 'Split Order Created', time: '13 Oct, 11:31 AM', done: true, notes: 'Auto-split into Hub Part and External Part EXT-ORD-881.' },
      { stage: 'Assigned to Partner', time: '13 Oct, 11:35 AM', done: true, notes: 'Assigned to MedPlus Kuvempunagar (2.4 km distance, cold-chain verified).' },
      { stage: 'Accepted by Partner', time: '13 Oct, 11:42 AM', done: true, notes: 'Partner verified batch expiry (Exp: Mar 2028) & accepted fulfillment.' },
      { stage: 'Preparing & Packing', time: '13 Oct, 11:55 AM', current: true, notes: 'Partner packing in temperature-controlled ice gel pack.' },
      { stage: 'Dispatched for Delivery', time: 'Estimated 12:45 PM', pending: true, notes: 'Awaiting courier rider hand-off.' },
      { stage: 'Delivered to Patient', time: 'Estimated 01:15 PM', pending: true, notes: 'OTP delivery confirmation upon handover.' }
    ]
  },
  {
    orderId: 'EXT-ORD-882',
    parentOrderId: 'ORD-2026-882',
    hubOrderId: 'ORD-2026-882-HUB',
    patientName: 'Devendra Joshi',
    patientPhoneMasked: '+91 98801 •••••',
    patientArea: 'Vontikoppal',
    patientCity: 'Mysore',
    patientPincode: '570002',
    patientDeliveryAddress: '#204, Kalidasa Road, Vontikoppal, Mysore - 570002',
    orderDate: '13 Oct 2026, 12:10 PM',
    prescriptionRef: 'RX-88220 (Dr. P. Hegde, Pulmonologist)',
    isSplitOrder: true,
    totalOriginalItems: 3,
    hubItemsFulfilled: 2,
    externalItemsCount: 1,
    splitNote: 'Symbicort Turbuhaler was unavailable in Hub inventory; redirected to Apollo Pharmacy Partner.',
    
    unavailableMedicines: [
      {
        id: 'EXT-MED-02',
        name: 'Symbicort Turbuhaler 160/4.5mcg',
        genericName: 'Budesonide + Formoterol',
        strength: '160/4.5 mcg (120 Doses)',
        dosageForm: 'Dry Powder Inhaler',
        quantity: 1,
        pricePerUnit: 890.00,
        total: 890.00,
        hubStockStatus: 'Zero Stock in Hub (Restock ETA: 3 Days)',
        urgency: 'Medium (Asthma Maintenance)'
      }
    ],

    hubMedicines: [
      { name: 'Montelukast 10mg', qty: 30, price: 12.00, total: 360.00 },
      { name: 'Cetirizine 10mg', qty: 20, price: 3.50, total: 70.00 }
    ],

    assignedPharmacyId: 'PART-002',
    assignedPharmacyName: 'Apollo Pharmacy Partner (Vontikoppal)',
    assignedPharmacyContact: 'Dr. Shalini Hegde (+91 98450 23456)',
    status: 'Dispatched',
    orderAmount: 890.00,
    pharmacyPayoutAmount: 845.50,
    platformFee: 44.50,
    paymentMode: 'Cash on Delivery',
    paymentStatus: 'Pending Collection on Delivery',
    settlementStatus: 'Pending Settlement',
    deliveryPartner: 'Apollo Local Rider #04',
    deliveryRiderName: 'Kiran Gowda',
    deliveryRiderPhoneMasked: '+91 99002 •••••',
    estimatedDeliveryTime: 'Today, 01:30 PM',
    lastUpdated: '5 mins ago',
    timeline: [
      { stage: 'Order Placed by Patient', time: '13 Oct, 12:10 PM', done: true, notes: 'Order confirmed online.' },
      { stage: 'Hub Stock Evaluation', time: '13 Oct, 12:12 PM', done: true, notes: 'Inhaler unit out of stock in Hub.' },
      { stage: 'Split Order Created', time: '13 Oct, 12:13 PM', done: true, notes: 'Split into EXT-ORD-882.' },
      { stage: 'Assigned to Partner', time: '13 Oct, 12:15 PM', done: true, notes: 'Assigned to Apollo Vontikoppal.' },
      { stage: 'Accepted by Partner', time: '13 Oct, 12:20 PM', done: true, notes: 'Stock verified in Apollo drawer.' },
      { stage: 'Preparing & Packing', time: '13 Oct, 12:35 PM', done: true, notes: 'Tamper-evident sealed bag.' },
      { stage: 'Dispatched for Delivery', time: '13 Oct, 12:55 PM', current: true, notes: 'Rider out on delivery vehicle.' },
      { stage: 'Delivered to Patient', time: 'Estimated 01:30 PM', pending: true, notes: 'Cash collection ₹890.' }
    ]
  },
  {
    orderId: 'EXT-ORD-883',
    parentOrderId: 'ORD-2026-883',
    hubOrderId: 'ORD-2026-883-HUB',
    patientName: 'Naveen Kumar Shetty',
    patientPhoneMasked: '+91 97401 •••••',
    patientArea: 'Saraswathipuram',
    patientCity: 'Mysore',
    patientPincode: '570009',
    patientDeliveryAddress: '#77, 7th Cross, Saraswathipuram, Mysore - 570009',
    orderDate: '13 Oct 2026, 12:40 PM',
    prescriptionRef: 'RX-88221 (Dr. R. Kamath, Dermatologist)',
    isSplitOrder: true,
    totalOriginalItems: 4,
    hubItemsFulfilled: 2,
    externalItemsCount: 2,
    splitNote: 'Specialist ointment & medicated wash unavailable in Central Hub; split and pending partner allocation.',
    
    unavailableMedicines: [
      {
        id: 'EXT-MED-03',
        name: 'Tacrolimus Ointment 0.1% (30g)',
        genericName: 'Tacrolimus',
        strength: '0.1% w/w',
        dosageForm: 'Topical Ointment',
        quantity: 1,
        pricePerUnit: 520.00,
        total: 520.00,
        hubStockStatus: 'Zero Stock in Hub',
        urgency: 'Medium (Dermatology)'
      },
      {
        id: 'EXT-MED-04',
        name: 'Ketoconazole 2% Medicated Scalp Lotion',
        genericName: 'Ketoconazole',
        strength: '2% w/v (100ml)',
        dosageForm: 'Lotion',
        quantity: 2,
        pricePerUnit: 240.00,
        total: 480.00,
        hubStockStatus: 'Zero Stock in Hub',
        urgency: 'Low'
      }
    ],

    hubMedicines: [
      { name: 'Cetirizine 10mg', qty: 30, price: 3.50, total: 105.00 },
      { name: 'Paracetamol 500mg', qty: 20, price: 2.00, total: 40.00 }
    ],

    assignedPharmacyId: null,
    assignedPharmacyName: null,
    assignedPharmacyContact: null,
    status: 'Pending Assignment', // Admin needs to assign!
    orderAmount: 1000.00,
    pharmacyPayoutAmount: 950.00,
    platformFee: 50.00,
    paymentMode: 'Online Prepaid (Card)',
    paymentStatus: 'Paid by Patient',
    settlementStatus: 'Awaiting Partner Assignment',
    deliveryPartner: 'TBD upon assignment',
    deliveryRiderName: 'Unassigned',
    deliveryRiderPhoneMasked: '—',
    estimatedDeliveryTime: 'Today, 02:45 PM',
    lastUpdated: '10 mins ago',
    timeline: [
      { stage: 'Order Placed by Patient', time: '13 Oct, 12:40 PM', done: true, notes: 'Order submitted by patient.' },
      { stage: 'Hub Stock Evaluation', time: '13 Oct, 12:42 PM', done: true, notes: '2 topical items missing from Hub.' },
      { stage: 'Split Order Created', time: '13 Oct, 12:43 PM', done: true, notes: 'Split into EXT-ORD-883.' },
      { stage: 'Pending Assignment', time: '13 Oct, 12:43 PM', current: true, notes: 'Awaiting admin partner pharmacy selection.' },
      { stage: 'Accepted by Partner', time: 'Pending', pending: true },
      { stage: 'Preparing & Packing', time: 'Pending', pending: true },
      { stage: 'Dispatched for Delivery', time: 'Pending', pending: true },
      { stage: 'Delivered to Patient', time: 'Pending', pending: true }
    ]
  },
  {
    orderId: 'EXT-ORD-884',
    parentOrderId: 'ORD-2026-884',
    hubOrderId: 'ORD-2026-884-HUB',
    patientName: 'Ananya Deshmukh',
    patientPhoneMasked: '+91 99001 •••••',
    patientArea: 'Irwin Road',
    patientCity: 'Mysore',
    patientPincode: '570001',
    patientDeliveryAddress: '#12/A, Dhanvantri Road, Near Ayurveda College, Mysore - 570001',
    orderDate: '13 Oct 2026, 10:15 AM',
    prescriptionRef: 'RX-88215 (Emergency Casualty Roster)',
    isSplitOrder: false, // 100% routed externally because Hub had none of the emergency items
    totalOriginalItems: 2,
    hubItemsFulfilled: 0,
    externalItemsCount: 2,
    splitNote: 'All requested specialty ICU injections out of stock in Hub; entirely rerouted to Cauvery 24/7 Chemist.',
    
    unavailableMedicines: [
      {
        id: 'EXT-MED-05',
        name: 'Inj. Enoxaparin Sodium 40mg/0.4ml',
        genericName: 'Enoxaparin Sodium (Clexane)',
        strength: '40 mg / 0.4 ml PFS',
        dosageForm: 'Prefilled Syringe',
        quantity: 2,
        pricePerUnit: 440.00,
        total: 880.00,
        hubStockStatus: 'Zero Stock in Hub',
        urgency: 'Critical / High (Anticoagulant)'
      },
      {
        id: 'EXT-MED-06',
        name: 'Inj. Pantoprazole 40mg IV Vial',
        genericName: 'Pantoprazole IV',
        strength: '40 mg Vial with WFI',
        dosageForm: 'IV Injection',
        quantity: 4,
        pricePerUnit: 65.00,
        total: 260.00,
        hubStockStatus: 'Zero Stock in Hub',
        urgency: 'High'
      }
    ],

    hubMedicines: [],

    assignedPharmacyId: 'PART-004',
    assignedPharmacyName: 'Cauvery 24/7 Chemist & Druggist',
    assignedPharmacyContact: 'Syed Tanveer (+91 98450 45678)',
    status: 'Delivered',
    orderAmount: 1140.00,
    pharmacyPayoutAmount: 1083.00,
    platformFee: 57.00,
    paymentMode: 'Online Prepaid (UPI)',
    paymentStatus: 'Paid by Patient',
    settlementStatus: 'Settled',
    settlementRef: 'SET-2026-9041',
    deliveryPartner: 'Cauvery Rapid Courier Unit',
    deliveryRiderName: 'Imran Pasha',
    deliveryRiderPhoneMasked: '+91 98452 •••••',
    estimatedDeliveryTime: 'Delivered 11:10 AM',
    lastUpdated: '1 hr ago',
    timeline: [
      { stage: 'Order Placed by Patient', time: '13 Oct, 10:15 AM', done: true, notes: 'Emergency doctor order received.' },
      { stage: 'Hub Stock Evaluation', time: '13 Oct, 10:16 AM', done: true, notes: 'Injectables out of stock in Central Hub.' },
      { stage: 'Assigned to Partner', time: '13 Oct, 10:18 AM', done: true, notes: 'Auto-routed to Cauvery 24/7 (1.2 km away).' },
      { stage: 'Accepted by Partner', time: '13 Oct, 10:22 AM', done: true, notes: 'Stock verified and pulled from cold room.' },
      { stage: 'Preparing & Packing', time: '13 Oct, 10:30 AM', done: true, notes: 'Sealed cold container with syringe safety seal.' },
      { stage: 'Dispatched for Delivery', time: '13 Oct, 10:45 AM', done: true, notes: 'Emergency green-corridor priority rider.' },
      { stage: 'Delivered to Patient', time: '13 Oct, 11:10 AM', done: true, notes: 'Delivered & verified with OTP #8419.' }
    ]
  },
  {
    orderId: 'EXT-ORD-885',
    parentOrderId: 'ORD-2026-885',
    hubOrderId: 'ORD-2026-885-HUB',
    patientName: 'Subhashini Iyengar',
    patientPhoneMasked: '+91 98455 •••••',
    patientArea: 'Hebbal',
    patientCity: 'Mysore',
    patientPincode: '570016',
    patientDeliveryAddress: '#18, 2nd Main, Hebbal 1st Stage, Mysore - 570016',
    orderDate: '12 Oct 2026, 04:30 PM',
    prescriptionRef: 'RX-88210 (Dr. Manjunath, Ortho)',
    isSplitOrder: true,
    totalOriginalItems: 3,
    hubItemsFulfilled: 2,
    externalItemsCount: 1,
    splitNote: 'Glucosamine specialized joint complex out of stock in Hub; redirected to GreenCross Hebbal.',
    
    unavailableMedicines: [
      {
        id: 'EXT-MED-07',
        name: 'Cartigen Forte Plus Tablets (Joint Complex)',
        genericName: 'Glucosamine + Chondroitin + MSM',
        strength: '1500mg/500mg',
        dosageForm: 'Tablet',
        quantity: 30,
        pricePerUnit: 24.50,
        total: 735.00,
        hubStockStatus: 'Zero Stock in Hub',
        urgency: 'Low (Chronic Ortho)'
      }
    ],

    hubMedicines: [
      { name: 'Calcium + Vit D3 Tablets', qty: 30, price: 6.50, total: 195.00 },
      { name: 'Paracetamol 650mg', qty: 15, price: 3.00, total: 45.00 }
    ],

    assignedPharmacyId: 'PART-005',
    assignedPharmacyName: 'GreenCross Health Pharmacy (Hebbal)',
    assignedPharmacyContact: 'Kavitha Murthy (+91 98450 56789)',
    status: 'Delivered',
    orderAmount: 735.00,
    pharmacyPayoutAmount: 698.25,
    platformFee: 36.75,
    paymentMode: 'Online Prepaid (NetBanking)',
    paymentStatus: 'Paid by Patient',
    settlementStatus: 'Settled',
    settlementRef: 'SET-2026-8994',
    deliveryPartner: 'GreenCross Delivery Fleet',
    deliveryRiderName: 'Deepak V.',
    deliveryRiderPhoneMasked: '+91 97410 •••••',
    estimatedDeliveryTime: 'Delivered Yesterday, 06:15 PM',
    lastUpdated: 'Yesterday',
    timeline: [
      { stage: 'Order Placed by Patient', time: '12 Oct, 04:30 PM', done: true, notes: 'Order submitted.' },
      { stage: 'Hub Stock Evaluation', time: '12 Oct, 04:32 PM', done: true, notes: 'Joint supplement out of stock.' },
      { stage: 'Assigned to Partner', time: '12 Oct, 04:35 PM', done: true, notes: 'Assigned to GreenCross Hebbal.' },
      { stage: 'Accepted by Partner', time: '12 Oct, 04:45 PM', done: true, notes: 'Accepted by pharmacist Kavitha.' },
      { stage: 'Preparing & Packing', time: '12 Oct, 05:10 PM', done: true, notes: 'Packed with invoice.' },
      { stage: 'Dispatched for Delivery', time: '12 Oct, 05:35 PM', done: true, notes: 'Dispatched.' },
      { stage: 'Delivered to Patient', time: '12 Oct, 06:15 PM', done: true, notes: 'Handed over to patient daughter.' }
    ]
  },
  {
    orderId: 'EXT-ORD-886',
    parentOrderId: 'ORD-2026-886',
    hubOrderId: 'ORD-2026-886-HUB',
    patientName: 'Vikramaditya Rao',
    patientPhoneMasked: '+91 99800 •••••',
    patientArea: 'Vijayanagar',
    patientCity: 'Mysore',
    patientPincode: '570017',
    patientDeliveryAddress: '#99, 4th Stage, Vijayanagar, Mysore - 570017',
    orderDate: '12 Oct 2026, 02:00 PM',
    prescriptionRef: 'RX-88204 (Dr. B. Kulkarni, Gastro)',
    isSplitOrder: true,
    totalOriginalItems: 2,
    hubItemsFulfilled: 1,
    externalItemsCount: 1,
    splitNote: 'Imported probiotic sachet out of stock in Hub; partner could not source specific brand.',
    
    unavailableMedicines: [
      {
        id: 'EXT-MED-08',
        name: 'VSL#3 High Potency Probiotic Sachets',
        genericName: 'Probiotic Multi-Strain Blend',
        strength: '112.5 Billion CFU',
        dosageForm: 'Sachet Powder',
        quantity: 10,
        pricePerUnit: 145.00,
        total: 1450.00,
        hubStockStatus: 'Zero Stock in Hub',
        urgency: 'Medium'
      }
    ],

    hubMedicines: [
      { name: 'Rifaximin 400mg', qty: 14, price: 32.00, total: 448.00 }
    ],

    assignedPharmacyId: 'PART-006',
    assignedPharmacyName: 'Lifeline Speciality Pharma (Vijayanagar)',
    assignedPharmacyContact: 'Prashanth Nayak (+91 98450 67890)',
    status: 'Cancelled',
    orderAmount: 1450.00,
    pharmacyPayoutAmount: 0.00,
    platformFee: 0.00,
    paymentMode: 'Online Prepaid (UPI)',
    paymentStatus: 'Refunded to Patient (₹1450)',
    settlementStatus: 'Cancelled / Void',
    deliveryPartner: 'None',
    deliveryRiderName: '—',
    deliveryRiderPhoneMasked: '—',
    estimatedDeliveryTime: 'Cancelled',
    lastUpdated: 'Yesterday',
    timeline: [
      { stage: 'Order Placed by Patient', time: '12 Oct, 02:00 PM', done: true, notes: 'Order placed.' },
      { stage: 'Hub Stock Evaluation', time: '12 Oct, 02:05 PM', done: true, notes: 'VSL#3 unavailable in Hub.' },
      { stage: 'Assigned to Partner', time: '12 Oct, 02:10 PM', done: true, notes: 'Assigned to Lifeline.' },
      { stage: 'Partner Cancellation', time: '12 Oct, 02:40 PM', done: true, notes: 'Partner distributor out of cold chain stock for VSL#3. Cancelled with full refund.' }
    ]
  }
];

export const THIRD_PARTY_SUMMARY_STATS = {
  totalPartnerPharmacies: 14,
  activePartners: 12,
  pendingPartners: 2,
  pendingExternalOrders: 3,
  ordersInProgress: 8,
  completedExternalOrders: 42,
  cancelledExternalOrders: 2,
  splitOrdersRedirectedToday: 6,
  totalExternalVolume: '₹1,48,250',
  averageDeliveryTat: '34 mins',
  partnerFulfillmentRate: '98.2%'
};
