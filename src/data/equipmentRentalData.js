// MediUnify Equipment Rental Operations Master Dataset
// Production-ready mock data focused on Vendor Verification & Request Monitoring

export const RENTAL_CITIES = [
  'All Cities',
  'Mysore',
  'Bangalore',
  'Mandya'
];

export const EQUIPMENT_CATEGORIES = [
  'Wheelchair',
  'Hospital Bed',
  'Oxygen Concentrator',
  'Walker',
  'Crutches',
  'Nebulizer',
  'Commode Chair',
  'Air Mattress',
  'Other'
];

export const INITIAL_VENDORS_DATA = [
  {
    id: 'VEND-001',
    name: 'Suresh Babu',
    businessName: 'Sri Sai Medical Rentals',
    contact: '+91 98450 11223',
    email: 'contact@srisaimedical.in',
    address: '#42, 5th Cross, Gokulam 2nd Stage',
    city: 'Mysore',
    location: 'Mysore (Gokulam)',
    state: 'Karnataka',
    pincode: '570002',
    equipmentCategories: ['Wheelchair', 'Hospital Bed', 'Air Mattress', 'Commode Chair'],
    equipmentStock: { 'Wheelchair': 16, 'Hospital Bed': 8, 'Air Mattress': 12, 'Commode Chair': 10 },
    registrationDate: '15 Jan 2026',
    status: 'Active',
    rejectionReason: null,
    documents: [
      { name: 'Business Registration Certificate (GST/MSME)', type: 'PDF Document', size: '2.4 MB', status: 'Verified' },
      { name: 'Medical Equipment Dealership License', type: 'PDF Document', size: '1.8 MB', status: 'Verified' },
      { name: 'Identity & Address Verification (Aadhaar/PAN)', type: 'PDF Document', size: '1.2 MB', status: 'Verified' },
      { name: 'Warehouse Safety & Sanitization Audit', type: 'PDF Document', size: '3.1 MB', status: 'Verified' }
    ],
    rentalActivity: {
      totalRequests: 148,
      acceptedRequests: 142,
      completedRentals: 136,
      cancelledRentals: 6
    }
  },
  {
    id: 'VEND-002',
    name: 'Rajesh Sharma',
    businessName: 'CarePlus Equipment Rentals',
    contact: '+91 98450 22334',
    email: 'ops@careplusequip.com',
    address: '#118, 100ft Road, Indiranagar',
    city: 'Bangalore',
    location: 'Bangalore (Indiranagar)',
    state: 'Karnataka',
    pincode: '560038',
    equipmentCategories: ['Hospital Bed', 'Oxygen Concentrator', 'Air Mattress', 'Wheelchair'],
    equipmentStock: { 'Hospital Bed': 14, 'Oxygen Concentrator': 10, 'Air Mattress': 15, 'Wheelchair': 18 },
    registrationDate: '20 Feb 2026',
    status: 'Active',
    rejectionReason: null,
    documents: [
      { name: 'Business Registration Certificate (GST/MSME)', type: 'PDF Document', size: '2.2 MB', status: 'Verified' },
      { name: 'Medical Equipment Dealership License', type: 'PDF Document', size: '1.9 MB', status: 'Verified' },
      { name: 'Identity & Address Verification (PAN)', type: 'PDF Document', size: '1.1 MB', status: 'Verified' }
    ],
    rentalActivity: {
      totalRequests: 212,
      acceptedRequests: 198,
      completedRentals: 190,
      cancelledRentals: 8
    }
  },
  {
    id: 'VEND-003',
    name: 'Anand Kumar',
    businessName: 'HealthAid Rentals',
    contact: '+91 98450 33445',
    email: 'support@healthaidrentals.org',
    address: '#76, 27th Main, BTM Layout 1st Stage',
    city: 'Bangalore',
    location: 'Bangalore (BTM / Jayanagar)',
    state: 'Karnataka',
    pincode: '560068',
    equipmentCategories: ['Oxygen Concentrator', 'Wheelchair', 'Crutches', 'Walker'],
    equipmentStock: { 'Oxygen Concentrator': 12, 'Wheelchair': 20, 'Crutches': 25, 'Walker': 15 },
    registrationDate: '05 Mar 2026',
    status: 'Active',
    rejectionReason: null,
    documents: [
      { name: 'Business Registration Certificate (MSME)', type: 'PDF Document', size: '2.5 MB', status: 'Verified' },
      { name: 'Medical Equipment Supply License', type: 'PDF Document', size: '1.6 MB', status: 'Verified' }
    ],
    rentalActivity: {
      totalRequests: 176,
      acceptedRequests: 168,
      completedRentals: 162,
      cancelledRentals: 6
    }
  },
  {
    id: 'VEND-004',
    name: 'Raghavendra Swamy',
    businessName: 'MediCare Equipments',
    contact: '+91 98450 44556',
    email: 'rentals@medicareequip.in',
    address: '#19, Sugar Town Road',
    city: 'Mandya',
    location: 'Mandya (City Center)',
    state: 'Karnataka',
    pincode: '571401',
    equipmentCategories: ['Wheelchair', 'Hospital Bed', 'Oxygen Concentrator', 'Walker', 'Nebulizer'],
    equipmentStock: { 'Wheelchair': 14, 'Hospital Bed': 6, 'Oxygen Concentrator': 8, 'Walker': 12, 'Nebulizer': 15 },
    registrationDate: '12 Apr 2026',
    status: 'Active',
    rejectionReason: null,
    documents: [
      { name: 'Business Trade License (Mandya City Corp)', type: 'PDF Document', size: '2.0 MB', status: 'Verified' },
      { name: 'GST Registration Document', type: 'PDF Document', size: '1.4 MB', status: 'Verified' }
    ],
    rentalActivity: {
      totalRequests: 94,
      acceptedRequests: 88,
      completedRentals: 84,
      cancelledRentals: 4
    }
  },
  {
    id: 'VEND-005',
    name: 'Vikas Mehta',
    businessName: 'Apex Health Logistics',
    contact: '+91 98450 55667',
    email: 'care@apexhealthlogistics.com',
    address: '#204, 14th Main, HSR Layout Sector 3',
    city: 'Bangalore',
    location: 'Bangalore (HSR Layout)',
    state: 'Karnataka',
    pincode: '560102',
    equipmentCategories: ['Hospital Bed', 'Oxygen Concentrator', 'Wheelchair', 'Air Mattress'],
    equipmentStock: { 'Hospital Bed': 20, 'Oxygen Concentrator': 15, 'Wheelchair': 22, 'Air Mattress': 18 },
    registrationDate: '18 May 2026',
    status: 'Active',
    rejectionReason: null,
    documents: [
      { name: 'Business Registration (GST & MSME)', type: 'PDF Document', size: '2.8 MB', status: 'Verified' },
      { name: 'Health Department Equipment Clearance', type: 'PDF Document', size: '1.7 MB', status: 'Verified' }
    ],
    rentalActivity: {
      totalRequests: 188,
      acceptedRequests: 180,
      completedRentals: 174,
      cancelledRentals: 6
    }
  },
  {
    id: 'VEND-006',
    name: 'Prakash Rao',
    businessName: 'BioCare Medical Equipment',
    contact: '+91 98450 66778',
    email: 'info@biocaremysore.com',
    address: '#55, Saraswathipuram 4th Cross',
    city: 'Mysore',
    location: 'Mysore (Saraswathipuram)',
    state: 'Karnataka',
    pincode: '570009',
    equipmentCategories: ['Nebulizer', 'Air Mattress', 'Oxygen Concentrator', 'Commode Chair'],
    equipmentStock: { 'Nebulizer': 20, 'Air Mattress': 10, 'Oxygen Concentrator': 6, 'Commode Chair': 8 },
    registrationDate: '22 Jun 2026',
    status: 'Active',
    rejectionReason: null,
    documents: [
      { name: 'Business Registration Certificate', type: 'PDF Document', size: '1.9 MB', status: 'Verified' }
    ],
    rentalActivity: {
      totalRequests: 130,
      acceptedRequests: 122,
      completedRentals: 118,
      cancelledRentals: 4
    }
  },
  {
    id: 'VEND-007',
    name: 'Gowda Bros',
    businessName: 'Cauvery Surgicals & Rentals',
    contact: '+91 98450 77889',
    email: 'help@cauverysurgicals.com',
    address: '#12, Maddur Highway Junction',
    city: 'Mandya',
    location: 'Mandya (Maddur)',
    state: 'Karnataka',
    pincode: '571428',
    equipmentCategories: ['Hospital Bed', 'Wheelchair', 'Crutches', 'Walker'],
    equipmentStock: { 'Hospital Bed': 5, 'Wheelchair': 8, 'Crutches': 12, 'Walker': 6 },
    registrationDate: '28 Sep 2026',
    status: 'Pending',
    rejectionReason: null,
    documents: [
      { name: 'Trade License Application', type: 'PDF Document', size: '1.5 MB', status: 'Under Review' },
      { name: 'GST Certificate Draft', type: 'PDF Document', size: '1.2 MB', status: 'Under Review' },
      { name: 'Owner Identity Verification (Aadhaar)', type: 'PDF Document', size: '980 KB', status: 'Under Review' }
    ],
    rentalActivity: {
      totalRequests: 0,
      acceptedRequests: 0,
      completedRentals: 0,
      cancelledRentals: 0
    }
  },
  {
    id: 'VEND-008',
    name: 'Dr. Manjunath',
    businessName: 'Mysore Rehab Solutions',
    contact: '+91 98450 88990',
    email: 'dispatch@mysorerehab.com',
    address: '#89, Kuvempunagar Double Road',
    city: 'Mysore',
    location: 'Mysore (Kuvempunagar)',
    state: 'Karnataka',
    pincode: '570023',
    equipmentCategories: ['Wheelchair', 'Crutches', 'Walker', 'Hospital Bed'],
    equipmentStock: { 'Wheelchair': 10, 'Crutches': 15, 'Walker': 8, 'Hospital Bed': 4 },
    registrationDate: '29 Sep 2026',
    status: 'Pending',
    rejectionReason: null,
    documents: [
      { name: 'Physiotherapy & Equipment Retail License', type: 'PDF Document', size: '2.1 MB', status: 'Under Review' },
      { name: 'Business Registration (GST)', type: 'PDF Document', size: '1.7 MB', status: 'Under Review' },
      { name: 'Sanitization Protocol Certification', type: 'PDF Document', size: '1.4 MB', status: 'Under Review' }
    ],
    rentalActivity: {
      totalRequests: 0,
      acceptedRequests: 0,
      completedRentals: 0,
      cancelledRentals: 0
    }
  },
  {
    id: 'VEND-009',
    name: 'Sunil Verma',
    businessName: 'Karnataka SurgiCare Pvt Ltd',
    contact: '+91 98450 99001',
    email: 'info@karnatakasurgicare.in',
    address: '#14, Malleshwaram 8th Cross',
    city: 'Bangalore',
    location: 'Bangalore (Malleshwaram)',
    state: 'Karnataka',
    pincode: '560003',
    equipmentCategories: ['Hospital Bed', 'Wheelchair', 'Air Mattress'],
    equipmentStock: { 'Hospital Bed': 4, 'Wheelchair': 6, 'Air Mattress': 5 },
    registrationDate: '10 Sep 2026',
    status: 'Rejected',
    rejectionReason: 'Invalid drug controller trade license and incomplete business GST documentation.',
    documents: [
      { name: 'Incomplete Trade License', type: 'PDF Document', size: '850 KB', status: 'Rejected' },
      { name: 'Identity Proof', type: 'PDF Document', size: '1.1 MB', status: 'Rejected' }
    ],
    rentalActivity: {
      totalRequests: 0,
      acceptedRequests: 0,
      completedRentals: 0,
      cancelledRentals: 0
    }
  },
  {
    id: 'VEND-010',
    name: 'Ramesh Hegde',
    businessName: 'Royal Medical Supplies',
    contact: '+91 98450 11002',
    email: 'admin@royalmedicals.com',
    address: '#50, Jayanagar 4th Block',
    city: 'Bangalore',
    location: 'Bangalore (Jayanagar)',
    state: 'Karnataka',
    pincode: '560011',
    equipmentCategories: ['Nebulizer', 'Commode Chair', 'Walker'],
    equipmentStock: { 'Nebulizer': 8, 'Commode Chair': 4, 'Walker': 5 },
    registrationDate: '01 Aug 2026',
    status: 'Inactive',
    rejectionReason: null,
    documents: [
      { name: 'Trade License', type: 'PDF Document', size: '1.6 MB', status: 'Verified' }
    ],
    rentalActivity: {
      totalRequests: 42,
      acceptedRequests: 35,
      completedRentals: 33,
      cancelledRentals: 2
    }
  }
];

export const INITIAL_RENTAL_REQUESTS = [
  {
    id: 'ER-1001',
    patientId: 'PID-8842',
    patientName: 'Rahul Kumar',
    patientPhone: '+91 98201 44512',
    patientEmail: 'rahul.kumar@gmail.com',
    patientAddress: '#42, 5th Main, Jayalakshmipuram, Mysore - 570012',
    patientLocation: 'Mysore (Jayalakshmipuram)',
    equipment: 'Wheelchair',
    equipmentCategory: 'Wheelchair',
    quantity: 1,
    rentalStartDate: '02 Oct 2026',
    rentalEndDate: '07 Oct 2026',
    rentalPeriod: '02 Oct 2026 – 07 Oct 2026',
    additionalRequirements: 'Elevating footrests required for post-ortho recovery.',
    requestDate: '29 Sep 2026, 09:30 AM',
    status: 'Vendor Response Pending',
    assignedVendor: null,
    vendorResponses: [
      {
        vendorId: 'VEND-001',
        vendorName: 'Sri Sai Medical Rentals',
        status: 'Available',
        responseTime: '12 mins ago',
        notes: 'In stock at Gokulam warehouse. Ready for instant dispatch.'
      },
      {
        vendorId: 'VEND-006',
        vendorName: 'BioCare Medical Equipment',
        status: 'Not Available',
        responseTime: '20 mins ago',
        notes: 'Standard wheelchairs currently booked until 05 Oct.'
      }
    ]
  },
  {
    id: 'ER-1002',
    patientId: 'PID-8843',
    patientName: 'Priya Sharma',
    patientPhone: '+91 97401 22998',
    patientEmail: 'priya.sharma92@yahoo.com',
    patientAddress: '#118, 12th Cross, Kuvempunagar, Mysore - 570023',
    patientLocation: 'Mysore (Kuvempunagar)',
    equipment: 'Hospital Bed',
    equipmentCategory: 'Hospital Bed',
    quantity: 1,
    rentalStartDate: '01 Oct 2026',
    rentalEndDate: '15 Oct 2026',
    rentalPeriod: '01 Oct 2026 – 15 Oct 2026',
    additionalRequirements: 'Semi-fowler manual bed with side safety railings.',
    requestDate: '28 Sep 2026, 03:15 PM',
    status: 'Vendor Confirmed',
    assignedVendor: 'Sri Sai Medical Rentals',
    vendorResponses: [
      {
        vendorId: 'VEND-001',
        vendorName: 'Sri Sai Medical Rentals',
        status: 'Available',
        responseTime: '1 hour ago',
        notes: 'Confirmed stock and scheduled for delivery.'
      },
      {
        vendorId: 'VEND-002',
        vendorName: 'CarePlus Equipment Rentals',
        status: 'Available',
        responseTime: '45 mins ago',
        notes: 'Available for dispatch.'
      }
    ]
  },
  {
    id: 'ER-1003',
    patientId: 'PID-8844',
    patientName: 'Arun Kumar',
    patientPhone: '+91 98450 11992',
    patientEmail: 'arun.k88@outlook.com',
    patientAddress: '#78, Gokulam 3rd Stage, Mysore - 570002',
    patientLocation: 'Mysore (Gokulam)',
    equipment: 'Oxygen Concentrator',
    equipmentCategory: 'Oxygen Concentrator',
    quantity: 1,
    rentalStartDate: '30 Sep 2026',
    rentalEndDate: '08 Oct 2026',
    rentalPeriod: '30 Sep 2026 – 08 Oct 2026',
    additionalRequirements: '5L high purity continuous oxygen flow unit with sterile cannula.',
    requestDate: '29 Sep 2026, 08:45 AM',
    status: 'Vendor Response Pending',
    assignedVendor: null,
    vendorResponses: [
      {
        vendorId: 'VEND-003',
        vendorName: 'HealthAid Rentals',
        status: 'Available',
        responseTime: '15 mins ago',
        notes: '5L Philips unit tested and ready.'
      }
    ]
  },
  {
    id: 'ER-1004',
    patientId: 'PID-8845',
    patientName: 'Savitri Bai',
    patientPhone: '+91 98801 77412',
    patientEmail: 'savitri.family@gmail.com',
    patientAddress: '#14, Saraswathipuram Main Road, Mysore - 570009',
    patientLocation: 'Mysore (Saraswathipuram)',
    equipment: 'Hospital Bed',
    equipmentCategory: 'Hospital Bed',
    quantity: 1,
    rentalStartDate: '27 Sep 2026',
    rentalEndDate: '15 Oct 2026',
    rentalPeriod: '27 Sep 2026 – 15 Oct 2026',
    additionalRequirements: '5-function motorized electric bed with air mattress.',
    requestDate: '26 Sep 2026, 05:20 PM',
    status: 'Active',
    assignedVendor: 'CarePlus Equipment Rentals',
    vendorResponses: [
      {
        vendorId: 'VEND-002',
        vendorName: 'CarePlus Equipment Rentals',
        status: 'Available',
        responseTime: 'Accepted',
        notes: 'Delivered and active.'
      }
    ]
  },
  {
    id: 'ER-1005',
    patientId: 'PID-8846',
    patientName: 'Vikas Gowda',
    patientPhone: '+91 97401 88321',
    patientEmail: 'vikas.gowda@techcorp.in',
    patientAddress: '#90, 100ft Road, Indiranagar, Bangalore - 560038',
    patientLocation: 'Bangalore (Indiranagar)',
    equipment: 'Walker',
    equipmentCategory: 'Walker',
    quantity: 1,
    rentalStartDate: '25 Sep 2026',
    rentalEndDate: '05 Oct 2026',
    rentalPeriod: '25 Sep 2026 – 05 Oct 2026',
    additionalRequirements: 'Reciprocal aluminum walker with height adjustments.',
    requestDate: '24 Sep 2026, 11:10 AM',
    status: 'Active',
    assignedVendor: 'HealthAid Rentals',
    vendorResponses: [
      {
        vendorId: 'VEND-003',
        vendorName: 'HealthAid Rentals',
        status: 'Available',
        responseTime: 'Accepted',
        notes: 'In use with patient.'
      }
    ]
  },
  {
    id: 'ER-1006',
    patientId: 'PID-8847',
    patientName: 'Lakshmi Narayanan',
    patientPhone: '+91 98450 99441',
    patientEmail: 'lakshmi.n@gmail.com',
    patientAddress: '#23, ITPL Main Road, Whitefield, Bangalore - 560066',
    patientLocation: 'Bangalore (Whitefield)',
    equipment: 'Walker',
    equipmentCategory: 'Walker',
    quantity: 1,
    rentalStartDate: '15 Sep 2026',
    rentalEndDate: '24 Sep 2026',
    rentalPeriod: '15 Sep 2026 – 24 Sep 2026',
    additionalRequirements: 'Gait training walker.',
    requestDate: '14 Sep 2026, 10:00 AM',
    status: 'Completed',
    assignedVendor: 'MediCare Equipments',
    completionDate: '24 Sep 2026',
    vendorResponses: [
      {
        vendorId: 'VEND-004',
        vendorName: 'MediCare Equipments',
        status: 'Available',
        responseTime: 'Fulfilled & Returned',
        notes: 'Returned in good condition.'
      }
    ]
  },
  {
    id: 'ER-1007',
    patientId: 'PID-8848',
    patientName: 'Naveen Chandra',
    patientPhone: '+91 98450 66221',
    patientEmail: 'naveen.chandra@rediffmail.com',
    patientAddress: '#55, Near Sugar Town, Mandya - 571401',
    patientLocation: 'Mandya (City Center)',
    equipment: 'Air Mattress',
    equipmentCategory: 'Air Mattress',
    quantity: 1,
    rentalStartDate: '26 Sep 2026',
    rentalEndDate: '03 Oct 2026',
    rentalPeriod: '26 Sep 2026 – 03 Oct 2026',
    additionalRequirements: 'Anti-bedsore bubble air mattress with pump.',
    requestDate: '25 Sep 2026, 02:40 PM',
    status: 'Active',
    assignedVendor: 'Sri Sai Medical Rentals',
    vendorResponses: [
      {
        vendorId: 'VEND-001',
        vendorName: 'Sri Sai Medical Rentals',
        status: 'Available',
        responseTime: 'Accepted',
        notes: 'Dispatched and installed.'
      }
    ]
  },
  {
    id: 'ER-1008',
    patientId: 'PID-8849',
    patientName: 'Meenakshi Rao',
    patientPhone: '+91 98450 88991',
    patientEmail: 'meenakshi.rao@gmail.com',
    patientAddress: '#34, 3rd Stage, Vijayanagar, Mysore - 570017',
    patientLocation: 'Mysore (Vijayanagar)',
    equipment: 'Commode Chair',
    equipmentCategory: 'Commode Chair',
    quantity: 1,
    rentalStartDate: '29 Sep 2026',
    rentalEndDate: '08 Oct 2026',
    rentalPeriod: '29 Sep 2026 – 08 Oct 2026',
    additionalRequirements: 'Foldable bedside commode chair.',
    requestDate: '29 Sep 2026, 08:15 AM',
    status: 'Vendor Response Pending',
    assignedVendor: null,
    vendorResponses: [
      {
        vendorId: 'VEND-001',
        vendorName: 'Sri Sai Medical Rentals',
        status: 'Available',
        responseTime: '10 mins ago',
        notes: 'Available for afternoon delivery.'
      }
    ]
  },
  {
    id: 'ER-1009',
    patientId: 'PID-8850',
    patientName: 'Sanjay Hegde',
    patientPhone: '+91 97401 55332',
    patientEmail: 'sanjay.hegde@infosys.com',
    patientAddress: '#88, 4th Block, Koramangala, Bangalore - 560034',
    patientLocation: 'Bangalore (Koramangala)',
    equipment: 'Nebulizer',
    equipmentCategory: 'Nebulizer',
    quantity: 1,
    rentalStartDate: '29 Sep 2026',
    rentalEndDate: '06 Oct 2026',
    rentalPeriod: '29 Sep 2026 – 06 Oct 2026',
    additionalRequirements: 'Heavy-duty ultrasonic pediatric/adult compressor nebulizer.',
    requestDate: '29 Sep 2026, 07:50 AM',
    status: 'Vendor Response Pending',
    assignedVendor: null,
    vendorResponses: [
      {
        vendorId: 'VEND-006',
        vendorName: 'BioCare Medical Equipment',
        status: 'Available',
        responseTime: '22 mins ago',
        notes: 'Sterilized units available.'
      }
    ]
  },
  {
    id: 'ER-1010',
    patientId: 'PID-8851',
    patientName: 'Vikram Rao',
    patientPhone: '+91 98801 33221',
    patientEmail: 'vikram.rao@accenture.com',
    patientAddress: '#12, Hebbal 1st Stage, Mysore - 570016',
    patientLocation: 'Mysore (Hebbal)',
    equipment: 'Crutches',
    equipmentCategory: 'Crutches',
    quantity: 1,
    rentalStartDate: '28 Sep 2026',
    rentalEndDate: '12 Oct 2026',
    rentalPeriod: '28 Sep 2026 – 12 Oct 2026',
    additionalRequirements: 'Underarm aluminum crutches (pair) for tall adult.',
    requestDate: '27 Sep 2026, 06:10 PM',
    status: 'Active',
    assignedVendor: 'CarePlus Equipment Rentals',
    vendorResponses: [
      {
        vendorId: 'VEND-002',
        vendorName: 'CarePlus Equipment Rentals',
        status: 'Available',
        responseTime: 'Accepted',
        notes: 'Delivered.'
      }
    ]
  },
  {
    id: 'ER-1011',
    patientId: 'PID-8852',
    patientName: 'Kavita Reddy',
    patientPhone: '+91 98801 88223',
    patientEmail: 'kavita.reddy@gmail.com',
    patientAddress: '#105, 5th Main, Gokulam 1st Stage, Mysore - 570002',
    patientLocation: 'Mysore (Gokulam)',
    equipment: 'Hospital Bed',
    equipmentCategory: 'Hospital Bed',
    quantity: 1,
    rentalStartDate: '10 Sep 2026',
    rentalEndDate: '20 Sep 2026',
    rentalPeriod: '10 Sep 2026 – 20 Sep 2026',
    additionalRequirements: '3-function electric hospital bed.',
    requestDate: '09 Sep 2026, 09:00 AM',
    status: 'Completed',
    assignedVendor: 'Sri Sai Medical Rentals',
    completionDate: '20 Sep 2026',
    vendorResponses: [
      {
        vendorId: 'VEND-001',
        vendorName: 'Sri Sai Medical Rentals',
        status: 'Available',
        responseTime: 'Fulfilled',
        notes: 'Equipment returned and inspected.'
      }
    ]
  }
];

// Export aliases for portalSearchEngine and other modules
export const REGISTERED_VENDORS = INITIAL_VENDORS_DATA;
export const INITIAL_EQUIPMENT_REQUESTS = INITIAL_RENTAL_REQUESTS;
export const INITIAL_EQUIPMENT_INVENTORY = [];
export const INITIAL_PAYMENTS_DATA = [];
