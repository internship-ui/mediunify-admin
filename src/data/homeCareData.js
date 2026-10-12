// MediUnify Home Care & Nursing Operations Master Dataset

// 1. Service Types Master List
export const INITIAL_SERVICE_TYPES = [
  {
    id: 'SRV-001',
    name: 'Injection',
    category: 'Clinical Nursing',
    description: 'Administration of physician-prescribed subcutaneous or intramuscular injections by a registered nurse.',
    basePrice: 350,
    estimatedDuration: '30 Mins',
    status: 'Active',
    requiredQualification: 'GNM / B.Sc Nursing',
    popularCount: 142
  },
  {
    id: 'SRV-002',
    name: 'Medication Assistance',
    category: 'General Care',
    description: 'Timely prescription medicine dispensing, adherence checks, and vital sign cross-verification.',
    basePrice: 400,
    estimatedDuration: '30 Mins',
    status: 'Active',
    requiredQualification: 'GNM / B.Sc Nursing',
    popularCount: 98
  },
  {
    id: 'SRV-003',
    name: 'Wound Dressing',
    category: 'Wound & Surgical Care',
    description: 'Aseptic sterile dressing change, surgical wound inspection, stitch/staple assessment, and ulcer management.',
    basePrice: 750,
    estimatedDuration: '45 Mins',
    status: 'Active',
    requiredQualification: 'B.Sc Nursing (Wound Care Certified)',
    popularCount: 215
  },
  {
    id: 'SRV-004',
    name: 'Vital Monitoring',
    category: 'Diagnostic & Monitoring',
    description: 'Comprehensive blood pressure, pulse rate, SpO2, respiratory rate, and temperature tracking with clinical report.',
    basePrice: 350,
    estimatedDuration: '30 Mins',
    status: 'Active',
    requiredQualification: 'GNM / B.Sc Nursing',
    popularCount: 164
  },
  {
    id: 'SRV-005',
    name: 'Blood Sugar Monitoring',
    category: 'Diagnostic & Monitoring',
    description: 'Fasting and post-prandial capillary blood glucose testing, logging, and dietary alert notification.',
    basePrice: 300,
    estimatedDuration: '20 Mins',
    status: 'Active',
    requiredQualification: 'GNM / B.Sc Nursing',
    popularCount: 180
  },
  {
    id: 'SRV-006',
    name: 'Post-operative Care',
    category: 'Wound & Surgical Care',
    description: 'Post-surgical recovery support, surgical drain tube management, pain assessment, and mobility monitoring.',
    basePrice: 1200,
    estimatedDuration: '60 Mins',
    status: 'Active',
    requiredQualification: 'B.Sc Nursing (ICU / Surgical)',
    popularCount: 88
  },
  {
    id: 'SRV-007',
    name: 'Catheter Care',
    category: 'Clinical Nursing',
    description: 'Sterile urinary catheter insertion, bag replacement, bladder wash/irrigation, and infection prevention.',
    basePrice: 850,
    estimatedDuration: '45 Mins',
    status: 'Active',
    requiredQualification: 'B.Sc Nursing',
    popularCount: 76
  },
  {
    id: 'SRV-008',
    name: 'Elderly Care',
    category: 'Long-Term & Geriatric',
    description: 'Compassionate senior citizen support including assisted mobility, hygiene maintenance, exercises, and companionship.',
    basePrice: 1500,
    estimatedDuration: '120 Mins',
    status: 'Active',
    requiredQualification: 'Geriatric Specialist Nurse',
    popularCount: 195
  },
  {
    id: 'SRV-009',
    name: 'Bedridden Care',
    category: 'Long-Term & Geriatric',
    description: 'Total patient assistance, regular position changes for bedsore prevention, sponge bathing, and Ryle\'s tube feeding.',
    basePrice: 1800,
    estimatedDuration: '180 Mins',
    status: 'Active',
    requiredQualification: 'Senior Registered Nurse',
    popularCount: 110
  },
  {
    id: 'SRV-010',
    name: 'Post-hospital Care',
    category: 'Transitional Care',
    description: 'Transitional step-down care following discharge from hospital, medication reconciliation, and recovery charting.',
    basePrice: 1400,
    estimatedDuration: '90 Mins',
    status: 'Active',
    requiredQualification: 'B.Sc Nursing',
    popularCount: 65
  },
  {
    id: 'SRV-011',
    name: 'Custom Care',
    category: 'Specialized Protocols',
    description: 'Customized nursing care plan formulated as per specific hospital discharge summary and treating physician orders.',
    basePrice: 950,
    estimatedDuration: '60 Mins',
    status: 'Active',
    requiredQualification: 'B.Sc Nursing / M.Sc Nursing',
    popularCount: 52
  }
];

// 2. Nurses Master List (Registered with MediUnify in Mysuru area)
export const NURSES_LIST = [
  {
    id: 'NURSE-001',
    name: 'Nurse Priya',
    phone: '+91 98450 33442',
    email: 'priya.nurse@mediunify.care',
    specialization: 'Wound Care & Geriatrics',
    qualification: 'GNM (General Nursing & Midwifery) - KNC-91402',
    services: ['Wound Dressing', 'Medication Assistance', 'Vital Monitoring', 'Elderly Care', 'Injection'],
    experience: '5 Years',
    rating: 4.8,
    completedVisits: 118,
    accountStatus: 'Active',
    status: 'AVAILABLE', // AVAILABLE, BUSY, OFFLINE, SCHEDULED
    address: '#112, 8th Block, Double Road, Kuvempunagar, Mysuru, Karnataka - 570023',
    locality: 'Kuvempunagar',
    city: 'Mysuru',
    lat: 12.2890,
    lng: 76.6240,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: '08:00 AM - 08:00 PM',
    nextBooking: {
      date: '10 Oct 2026',
      time: '10:00 AM',
      patient: 'Patient A',
      service: 'Wound Dressing'
    },
    upcomingBookings: [
      { id: 'BK-101', date: '10 Oct 2026', time: '10:00 AM', patient: 'Patient A', service: 'Wound Dressing', locality: 'Kuvempunagar' }
    ],
    documents: ['Aadhaar Card', 'GNM Diploma Certificate', 'KNC Registration Card', 'BLS Certificate']
  },
  {
    id: 'NURSE-002',
    name: 'Nurse Rahul',
    phone: '+91 98450 44119',
    email: 'rahul.nurse@mediunify.care',
    specialization: 'Wound Care & Catheter Specialist',
    qualification: 'B.Sc Nursing (Surgical & Post-Op) - KNC-77312',
    services: ['Wound Dressing', 'Post-operative Care', 'Catheter Care', 'Vital Monitoring', 'Injection'],
    experience: '6 Years',
    rating: 4.9,
    completedVisits: 134,
    accountStatus: 'Active',
    status: 'BUSY',
    address: '#75, 5th Main, 3rd Cross, Saraswathipuram, Mysuru, Karnataka - 570009',
    locality: 'Saraswathipuram',
    city: 'Mysuru',
    lat: 12.3025,
    lng: 76.6345,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'],
    workingHours: '07:30 AM - 07:30 PM',
    nextBooking: {
      date: '07 Oct 2026',
      time: '04:30 PM',
      patient: 'Harish Babu',
      service: 'Catheter Care'
    },
    upcomingBookings: [
      { id: 'BK-102', date: '07 Oct 2026', time: '04:30 PM', patient: 'Harish Babu', service: 'Catheter Care', locality: 'Saraswathipuram' },
      { id: 'BK-103', date: '09 Oct 2026', time: '11:00 AM', patient: 'Shankar M', service: 'Wound Dressing', locality: 'Jayalakshmipuram' }
    ],
    documents: ['Aadhaar Card', 'B.Sc Degree Certificate', 'KNC Registration Card']
  },
  {
    id: 'NURSE-003',
    name: 'Nurse Anitha',
    phone: '+91 98450 22331',
    email: 'anitha.nurse@mediunify.care',
    specialization: 'Wound Care & Post-Op Nursing',
    qualification: 'B.Sc Nursing (Wound Care Certified) - KNC-88214',
    services: ['Wound Dressing', 'Post-operative Care', 'Injection', 'Blood Sugar Monitoring', 'Bedridden Care'],
    experience: '7 Years',
    rating: 4.9,
    completedVisits: 162,
    accountStatus: 'Active',
    status: 'AVAILABLE',
    address: '#48, 4th Cross, 2nd Main, Jayalakshmipuram, Mysuru, Karnataka - 570012',
    locality: 'Jayalakshmipuram',
    city: 'Mysuru',
    lat: 12.3214,
    lng: 76.6278,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: '08:00 AM - 09:00 PM',
    nextBooking: null,
    upcomingBookings: [],
    documents: ['Aadhaar Card', 'B.Sc Degree Certificate', 'KNC Registration Card', 'Certified Wound Specialist']
  },
  {
    id: 'NURSE-004',
    name: 'Nurse Kavya',
    phone: '+91 98450 55667',
    email: 'kavya.nurse@mediunify.care',
    specialization: 'Geriatric & Palliative Care',
    qualification: 'B.Sc Nursing (Geriatric Care Specialist) - KNC-76342',
    services: ['Elderly Care', 'Bedridden Care', 'Vital Monitoring', 'Medication Assistance'],
    experience: '8 Years',
    rating: 5.0,
    completedVisits: 195,
    accountStatus: 'Active',
    status: 'SCHEDULED',
    address: '#302, 3rd Stage, Contour Road, Gokulam, Mysuru, Karnataka - 570002',
    locality: 'Gokulam',
    city: 'Mysuru',
    lat: 12.3350,
    lng: 76.6290,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: '08:30 AM - 07:30 PM',
    nextBooking: {
      date: '10 Oct 2026',
      time: '02:00 PM',
      patient: 'Sharada Devi',
      service: 'Elderly Care'
    },
    upcomingBookings: [
      { id: 'BK-104', date: '10 Oct 2026', time: '02:00 PM', patient: 'Sharada Devi', service: 'Elderly Care', locality: 'Saraswathipuram' }
    ],
    documents: ['Aadhaar Card', 'Geriatric Nursing Cert', 'KNC Registration Card']
  },
  {
    id: 'NURSE-005',
    name: 'Nurse Manjunath',
    phone: '+91 98450 66778',
    email: 'manjunath.nurse@mediunify.care',
    specialization: 'Critical Care & Catheter Management',
    qualification: 'B.Sc Nursing (Critical Care & BLS) - KNC-85912',
    services: ['Catheter Care', 'Post-operative Care', 'Injection', 'Post-hospital Care', 'Vital Monitoring'],
    experience: '6 Years',
    rating: 4.7,
    completedVisits: 120,
    accountStatus: 'Active',
    status: 'AVAILABLE',
    address: '#88, 2nd Stage, Water Tank Road, Vijayanagar, Mysuru, Karnataka - 570017',
    locality: 'Vijayanagar',
    city: 'Mysuru',
    lat: 12.3395,
    lng: 76.6020,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'],
    workingHours: '07:00 AM - 08:00 PM',
    nextBooking: null,
    upcomingBookings: [],
    documents: ['Aadhaar Card', 'B.Sc Nursing Degree', 'KNC Registration Card', 'Critical Care Reg']
  },
  {
    id: 'NURSE-006',
    name: 'Nurse Sneha',
    phone: '+91 98450 77889',
    email: 'sneha.nurse@mediunify.care',
    specialization: 'Elderly & Chronic Disease Care',
    qualification: 'GNM (Chronic Care Management) - KNC-84091',
    services: ['Vital Monitoring', 'Blood Sugar Monitoring', 'Medication Assistance', 'Elderly Care', 'Bedridden Care'],
    experience: '5 Years',
    rating: 4.8,
    completedVisits: 110,
    accountStatus: 'Active',
    status: 'AVAILABLE',
    address: '#19, E-Block, Ring Road Corner, Ramakrishnanagar, Mysuru, Karnataka - 570022',
    locality: 'Ramakrishnanagar',
    city: 'Mysuru',
    lat: 12.2780,
    lng: 76.6150,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: '08:00 AM - 08:00 PM',
    nextBooking: {
      date: '10 Oct 2026',
      time: '03:00 PM',
      patient: 'Leela Bai',
      service: 'Bedridden Care'
    },
    upcomingBookings: [
      { id: 'BK-105', date: '10 Oct 2026', time: '03:00 PM', patient: 'Leela Bai', service: 'Bedridden Care', locality: 'Ramakrishnanagar' }
    ],
    documents: ['Aadhaar Card', 'GNM Diploma', 'KNC Registration Card']
  },
  {
    id: 'NURSE-007',
    name: 'Nurse Divya',
    phone: '+91 98450 88990',
    email: 'divya.nurse@mediunify.care',
    specialization: 'Surgical ICU & Post-Hospital Care',
    qualification: 'B.Sc Nursing (Surgical Recovery Specialist) - KNC-82319',
    services: ['Post-operative Care', 'Wound Dressing', 'Post-hospital Care', 'Catheter Care'],
    experience: '7 Years',
    rating: 5.0,
    completedVisits: 175,
    accountStatus: 'Active',
    status: 'BUSY',
    address: '#45, 1st Cross, Hebbal Industrial Suburb, Hebbal, Mysuru, Karnataka - 570016',
    locality: 'Hebbal',
    city: 'Mysuru',
    lat: 12.3510,
    lng: 76.6110,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: '08:00 AM - 08:30 PM',
    nextBooking: {
      date: '09 Oct 2026',
      time: '10:30 AM',
      patient: 'Dr. Mohan Murthy',
      service: 'Post-hospital Care'
    },
    upcomingBookings: [
      { id: 'BK-106', date: '09 Oct 2026', time: '10:30 AM', patient: 'Dr. Mohan Murthy', service: 'Post-hospital Care', locality: 'Hebbal' }
    ],
    documents: ['Aadhaar Card', 'B.Sc Degree', 'KNC Registration Card', 'ICU Care Certificate']
  },
  {
    id: 'NURSE-008',
    name: 'Nurse Ramesh',
    phone: '+91 98450 11223',
    email: 'ramesh.nurse@mediunify.care',
    specialization: 'General Nursing & Custom Care',
    qualification: 'B.Sc Nursing - KNC-71923',
    services: ['Wound Dressing', 'Injection', 'Vital Monitoring', 'Custom Care'],
    experience: '4 Years',
    rating: 4.6,
    completedVisits: 84,
    accountStatus: 'Active',
    status: 'OFFLINE',
    address: '#14, 3rd Cross, JP Nagar 1st Phase, Mysuru, Karnataka - 570008',
    locality: 'JP Nagar',
    city: 'Mysuru',
    lat: 12.2680,
    lng: 76.6380,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '09:00 AM - 06:00 PM',
    nextBooking: null,
    upcomingBookings: [],
    documents: ['Aadhaar Card', 'B.Sc Nursing Certificate', 'KNC Registration Card']
  },
  {
    id: 'NURSE-009',
    name: 'Nurse Sunitha',
    phone: '+91 98450 99334',
    email: 'sunitha.nurse@mediunify.care',
    specialization: 'IV Infusion & Injection Therapy',
    qualification: 'GNM (Infusion & Vascular Access) - KNC-99104',
    services: ['Injection', 'Medication Assistance', 'Blood Sugar Monitoring', 'Custom Care', 'Vital Monitoring'],
    experience: '5 Years',
    rating: 4.8,
    completedVisits: 140,
    accountStatus: 'Active',
    status: 'AVAILABLE',
    address: '#62, 4th Main, Vani Vilas Mohalla, VV Mohalla, Mysuru, Karnataka - 570002',
    locality: 'VV Mohalla',
    city: 'Mysuru',
    lat: 12.3180,
    lng: 76.6410,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    workingHours: '07:30 AM - 08:30 PM',
    nextBooking: null,
    upcomingBookings: [],
    documents: ['Aadhaar Card', 'GNM Diploma', 'KNC Registration Card', 'IV Access Certificate']
  },
  {
    id: 'NURSE-010',
    name: 'Nurse Deepa',
    phone: '+91 98450 88445',
    email: 'deepa.nurse@mediunify.care',
    specialization: 'Palliative & Bedridden Care',
    qualification: 'M.Sc Nursing (Palliative & Critical Care) - KNC-61208',
    services: ['Bedridden Care', 'Elderly Care', 'Post-hospital Care', 'Catheter Care', 'Custom Care'],
    experience: '9 Years',
    rating: 4.9,
    completedVisits: 215,
    accountStatus: 'Active',
    status: 'SCHEDULED',
    address: '#54, 1st Cross, T.N.Pura Road, Siddhartha Layout, Mysuru, Karnataka - 570011',
    locality: 'Siddhartha Layout',
    city: 'Mysuru',
    lat: 12.3050,
    lng: 76.6820,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: '08:00 AM - 07:00 PM',
    nextBooking: {
      date: '11 Oct 2026',
      time: '09:00 AM',
      patient: 'K. S. Narayanan',
      service: 'Bedridden Care'
    },
    upcomingBookings: [
      { id: 'BK-107', date: '11 Oct 2026', time: '09:00 AM', patient: 'K. S. Narayanan', service: 'Bedridden Care', locality: 'Siddhartha Layout' }
    ],
    documents: ['Aadhaar Card', 'M.Sc Nursing Degree', 'KNC Registration Card', 'Palliative Care Fellowship']
  }
];

// 3. Realistic Initial Service Requests (Covering all stages of the core business flow)
export const INITIAL_SERVICE_REQUESTS = [
  {
    id: 'HCN-1001',
    patientName: 'Patient A (Ramesh Rao)',
    patientPhone: '+91 98201 44512',
    patientEmail: 'ramesh.rao@gmail.com',
    serviceRequired: 'Wound Dressing',
    requirement: 'Patient requires wound dressing at home following orthopedic knee surgery. Sterile dressing kit available.',
    requestedDate: '10 October 2026',
    requestedTime: '10:00 AM',
    duration: '45 Mins',
    additionalNotes: 'Patient is on 2nd floor, elevator available. Prescription dressing protocol by Ortho surgeon attached.',
    address: '#42, 5th Cross, 8th Block, Kuvempunagar, Mysuru - 570023',
    locality: 'Kuvempunagar',
    lat: 12.2895,
    lng: 76.6235,
    serviceAmount: 750,
    paymentStatus: 'Pending', // Pending, Link Sent, Completed, Refunded
    paymentLinkStatus: 'Not Sent', // Not Sent, Sent via SMS & WhatsApp, Paid
    paymentDetails: null,
    overallStatus: 'New Request', // New Request, Patient Contacted, Payment Link Sent, Payment Completed, Nurses Notified, Nurse Accepted, Service In Progress, Completed, Cancelled
    timeline: [
      {
        status: 'New Request',
        timestamp: '07 Oct 2026, 02:15 PM',
        actor: 'Patient (Mobile App)',
        note: 'Home care request created for Wound Dressing on 10 Oct, 10:00 AM.'
      }
    ],
    nursesNotified: [],
    assignedNurse: null
  },
  {
    id: 'HCN-1002',
    patientName: 'Sharada Devi',
    patientPhone: '+91 98451 99220',
    patientEmail: 'sharada.family@outlook.com',
    serviceRequired: 'Elderly Care',
    requirement: 'Senior citizen mobility assistance, gentle limb exercises, and vital signs charting.',
    requestedDate: '10 October 2026',
    requestedTime: '02:00 PM',
    duration: '120 Mins',
    additionalNotes: 'Patient has mild osteoarthritis. Female caregiver preferred by family.',
    address: '#114, 4th Main, Saraswathipuram, Mysuru - 570009',
    locality: 'Saraswathipuram',
    lat: 12.3020,
    lng: 76.6350,
    serviceAmount: 1500,
    paymentStatus: 'Pending',
    paymentLinkStatus: 'Not Sent',
    paymentDetails: null,
    overallStatus: 'Patient Contacted',
    timeline: [
      {
        status: 'New Request',
        timestamp: '07 Oct 2026, 11:30 AM',
        actor: 'Patient (Web Portal)',
        note: 'Elderly Care request received.'
      },
      {
        status: 'Patient Contacted',
        timestamp: '07 Oct 2026, 01:10 PM',
        actor: 'Admin (Telephonic Confirmation)',
        note: 'Admin called patient attendant Mr. Vinay. Service slot of 2:00 PM confirmed. Ready for payment link.'
      }
    ],
    nursesNotified: [],
    assignedNurse: null
  },
  {
    id: 'HCN-1003',
    patientName: 'Vijay Kumar',
    patientPhone: '+91 97401 22884',
    patientEmail: 'vijay.k@techcorp.in',
    serviceRequired: 'Post-operative Care',
    requirement: 'Post-cholecystectomy laparoscopic port site dressing and drain monitoring.',
    requestedDate: '11 October 2026',
    requestedTime: '09:30 AM',
    duration: '60 Mins',
    additionalNotes: 'Discharged from Apollo Mysuru yesterday. All wound ointments and sterile gauze at bedside.',
    address: '#32, Kalidasa Road, Jayalakshmipuram, Mysuru - 570012',
    locality: 'Jayalakshmipuram',
    lat: 12.3210,
    lng: 76.6270,
    serviceAmount: 1200,
    paymentStatus: 'Link Sent',
    paymentLinkStatus: 'Sent via SMS & WhatsApp',
    paymentDetails: null,
    overallStatus: 'Payment Link Sent',
    timeline: [
      {
        status: 'New Request',
        timestamp: '07 Oct 2026, 09:00 AM',
        actor: 'Patient',
        note: 'Request submitted.'
      },
      {
        status: 'Patient Contacted',
        timestamp: '07 Oct 2026, 10:15 AM',
        actor: 'Admin',
        note: 'Spoke with patient and confirmed 11 Oct 9:30 AM slot.'
      },
      {
        status: 'Payment Link Sent',
        timestamp: '07 Oct 2026, 10:20 AM',
        actor: 'System / Admin',
        note: 'Razorpay UPI payment link of ₹1,200 pushed via SMS & WhatsApp.'
      }
    ],
    nursesNotified: [],
    assignedNurse: null
  },
  {
    id: 'HCN-1004',
    patientName: 'Anita Kulkarni',
    patientPhone: '+91 99802 33415',
    patientEmail: 'anita.kulkarni@gmail.com',
    serviceRequired: 'Catheter Care',
    requirement: 'Urinary catheter replacement and bladder irrigation as prescribed by Urologist.',
    requestedDate: '10 October 2026',
    requestedTime: '11:00 AM',
    duration: '45 Mins',
    additionalNotes: 'Foley 16Fr silicone catheter kit and sterile saline available at residence.',
    address: '#78, Contour Road, Gokulam 3rd Stage, Mysuru - 570002',
    locality: 'Gokulam',
    lat: 12.3360,
    lng: 76.6285,
    serviceAmount: 850,
    paymentStatus: 'Completed',
    paymentLinkStatus: 'Paid',
    paymentDetails: {
      transactionId: 'TXN-UPI-771892',
      paidAt: '07 Oct 2026, 02:45 PM',
      mode: 'UPI / PhonePe',
      amount: 850
    },
    overallStatus: 'Payment Completed',
    timeline: [
      {
        status: 'New Request',
        timestamp: '07 Oct 2026, 08:30 AM',
        actor: 'Patient',
        note: 'Catheter care home visit requested.'
      },
      {
        status: 'Patient Contacted',
        timestamp: '07 Oct 2026, 09:15 AM',
        actor: 'Admin',
        note: 'Patient confirmed clinical requirement.'
      },
      {
        status: 'Payment Link Sent',
        timestamp: '07 Oct 2026, 09:20 AM',
        actor: 'Admin',
        note: 'Payment link sent.'
      },
      {
        status: 'Payment Completed',
        timestamp: '07 Oct 2026, 02:45 PM',
        actor: 'Patient (Payment Gateway)',
        note: 'Online payment of ₹850 verified. Ready for automatic eligible nurse broadcast.'
      }
    ],
    nursesNotified: [],
    assignedNurse: null
  },
  {
    id: 'HCN-1005',
    patientName: 'Praveen Gowda',
    patientPhone: '+91 98450 77112',
    patientEmail: 'praveen.gowda@live.com',
    serviceRequired: 'Injection',
    requirement: 'Daily prescribed IV antibiotic infusion administration under aseptic technique.',
    requestedDate: '10 October 2026',
    requestedTime: '08:00 AM',
    duration: '30 Mins',
    additionalNotes: 'IV Cannula is in-situ on left forearm. Doctor prescription available.',
    address: '#90, 2nd Stage, Water Tank Road, Vijayanagar, Mysuru - 570017',
    locality: 'Vijayanagar',
    lat: 12.3390,
    lng: 76.6025,
    serviceAmount: 350,
    paymentStatus: 'Completed',
    paymentLinkStatus: 'Paid',
    paymentDetails: {
      transactionId: 'TXN-GPay-992144',
      paidAt: '07 Oct 2026, 01:20 PM',
      mode: 'Online (GPay)',
      amount: 350
    },
    overallStatus: 'Nurses Notified',
    timeline: [
      {
        status: 'New Request',
        timestamp: '07 Oct 2026, 07:00 AM',
        actor: 'Patient',
        note: 'Requested morning injection visit.'
      },
      {
        status: 'Patient Contacted',
        timestamp: '07 Oct 2026, 07:45 AM',
        actor: 'Admin',
        note: 'Confirmed prescription & time slot.'
      },
      {
        status: 'Payment Completed',
        timestamp: '07 Oct 2026, 01:20 PM',
        actor: 'Payment Gateway',
        note: '₹350 received.'
      },
      {
        status: 'Nurses Notified',
        timestamp: '07 Oct 2026, 01:21 PM',
        actor: 'Auto Dispatch System',
        note: 'System matched 2 eligible registered nurses within 5.0 km radius and dispatched notifications.'
      }
    ],
    nursesNotified: [
      {
        nurseId: 'NURSE-005',
        nurseName: 'Nurse Manjunath',
        phone: '+91 98450 66778',
        specialization: 'Critical Care & Catheter Management',
        distanceKm: 0.1,
        availabilityStatus: 'Available on 10 Oct, 08:00 AM',
        notificationSentAt: '07 Oct 2026, 01:21 PM',
        responseStatus: 'Waiting for Response',
        responseAt: null
      },
      {
        nurseId: 'NURSE-009',
        nurseName: 'Nurse Sunitha',
        phone: '+91 98450 99334',
        specialization: 'IV Infusion & Injection Therapy',
        distanceKm: 4.8,
        availabilityStatus: 'Available on 10 Oct, 08:00 AM',
        notificationSentAt: '07 Oct 2026, 01:21 PM',
        responseStatus: 'Waiting for Response',
        responseAt: null
      }
    ],
    assignedNurse: null
  },
  {
    id: 'HCN-1006',
    patientName: 'Leela Bai',
    patientPhone: '+91 97401 88440',
    patientEmail: 'leelabhai.family@gmail.com',
    serviceRequired: 'Bedridden Care',
    requirement: 'Complete bedridden patient nursing care, posture change, sponge bath, and vitals check.',
    requestedDate: '10 October 2026',
    requestedTime: '03:00 PM',
    duration: '180 Mins',
    additionalNotes: 'Senior patient recovering from ischemic stroke. Dedicated air mattress in place.',
    address: '#22, E-Block, Ring Road, Ramakrishnanagar, Mysuru - 570022',
    locality: 'Ramakrishnanagar',
    lat: 12.2785,
    lng: 76.6145,
    serviceAmount: 1800,
    paymentStatus: 'Completed',
    paymentLinkStatus: 'Paid',
    paymentDetails: {
      transactionId: 'TXN-RAZOR-884021',
      paidAt: '07 Oct 2026, 12:15 PM',
      mode: 'UPI / Paytm',
      amount: 1800
    },
    overallStatus: 'Nurse Accepted',
    timeline: [
      {
        status: 'New Request',
        timestamp: '07 Oct 2026, 10:00 AM',
        actor: 'Patient',
        note: 'Requested Bedridden Care.'
      },
      {
        status: 'Payment Completed',
        timestamp: '07 Oct 2026, 12:15 PM',
        actor: 'Payment Gateway',
        note: 'Payment verified.'
      },
      {
        status: 'Nurses Notified',
        timestamp: '07 Oct 2026, 12:16 PM',
        actor: 'Auto Dispatch System',
        note: 'Broadcast sent to eligible nurses in Ramakrishnanagar radius.'
      },
      {
        status: 'Nurse Accepted',
        timestamp: '07 Oct 2026, 12:19 PM',
        actor: 'Nurse Sneha (Mobile App)',
        note: 'Nurse Sneha accepted the booking. System automatically closed other pending broadcasts.'
      }
    ],
    nursesNotified: [
      {
        nurseId: 'NURSE-006',
        nurseName: 'Nurse Sneha',
        phone: '+91 98450 77889',
        specialization: 'Elderly & Chronic Disease Care',
        distanceKm: 0.1,
        availabilityStatus: 'Available on requested date/time',
        notificationSentAt: '07 Oct 2026, 12:16 PM',
        responseStatus: 'Accepted',
        responseAt: '07 Oct 2026, 12:19 PM'
      },
      {
        nurseId: 'NURSE-001',
        nurseName: 'Nurse Priya',
        phone: '+91 98450 33442',
        specialization: 'Wound Care & Geriatrics',
        distanceKm: 1.6,
        availabilityStatus: 'Available',
        notificationSentAt: '07 Oct 2026, 12:16 PM',
        responseStatus: 'Declined',
        responseAt: '07 Oct 2026, 12:18 PM'
      }
    ],
    assignedNurse: {
      nurseId: 'NURSE-006',
      nurseName: 'Nurse Sneha',
      phone: '+91 98450 77889',
      email: 'sneha.nurse@mediunify.care',
      specialization: 'Elderly & Chronic Disease Care',
      registeredLocation: '#19, E-Block, Ramakrishnanagar, Mysuru',
      distanceKm: 0.1,
      acceptedAt: '07 Oct 2026, 12:19 PM',
      serviceDateTime: '10 October 2026, 03:00 PM'
    }
  },
  {
    id: 'HCN-1007',
    patientName: 'Dr. Mohan Murthy',
    patientPhone: '+91 98450 99441',
    patientEmail: 'dr.mohan@medicalmysore.com',
    serviceRequired: 'Post-hospital Care',
    requirement: 'Post-CABG cardiac step-down nursing care, sternal wound inspection, oxygen saturation monitoring.',
    requestedDate: '09 October 2026',
    requestedTime: '10:30 AM',
    duration: '90 Mins',
    additionalNotes: 'Discharged from Narayana Hrudayalaya. Patient is a retired professor.',
    address: '#52, Hebbal 1st Stage, Mysuru - 570016',
    locality: 'Hebbal',
    lat: 12.3510,
    lng: 76.6110,
    serviceAmount: 1400,
    paymentStatus: 'Completed',
    paymentLinkStatus: 'Paid',
    paymentDetails: {
      transactionId: 'TXN-HDFC-109238',
      paidAt: '06 Oct 2026, 04:00 PM',
      mode: 'Credit Card (HDFC)',
      amount: 1400
    },
    overallStatus: 'Service In Progress',
    timeline: [
      {
        status: 'New Request',
        timestamp: '06 Oct 2026, 03:00 PM',
        actor: 'Patient',
        note: 'Post-hospital cardiac care requested.'
      },
      {
        status: 'Payment Completed',
        timestamp: '06 Oct 2026, 04:00 PM',
        actor: 'Payment Gateway',
        note: 'Payment of ₹1,400 confirmed.'
      },
      {
        status: 'Nurses Notified',
        timestamp: '06 Oct 2026, 04:01 PM',
        actor: 'Auto Dispatch System',
        note: 'Eligible ICU-trained nurses notified.'
      },
      {
        status: 'Nurse Accepted',
        timestamp: '06 Oct 2026, 04:08 PM',
        actor: 'Nurse Divya',
        note: 'Nurse Divya accepted the booking.'
      },
      {
        status: 'Service In Progress',
        timestamp: '09 Oct 2026, 10:25 AM',
        actor: 'Nurse Divya',
        note: 'Nurse arrived at patient location and commenced post-hospital care protocol.'
      }
    ],
    nursesNotified: [
      {
        nurseId: 'NURSE-007',
        nurseName: 'Nurse Divya',
        phone: '+91 98450 88990',
        specialization: 'Surgical ICU & Post-Hospital Care',
        distanceKm: 0.2,
        availabilityStatus: 'Available on requested date/time',
        notificationSentAt: '06 Oct 2026, 04:01 PM',
        responseStatus: 'Accepted',
        responseAt: '06 Oct 2026, 04:08 PM'
      }
    ],
    assignedNurse: {
      nurseId: 'NURSE-007',
      nurseName: 'Nurse Divya',
      phone: '+91 98450 88990',
      email: 'divya.nurse@mediunify.care',
      specialization: 'Surgical ICU & Post-Hospital Care',
      registeredLocation: '#45, 1st Cross, Hebbal, Mysuru',
      distanceKm: 0.2,
      acceptedAt: '06 Oct 2026, 04:08 PM',
      serviceDateTime: '09 October 2026, 10:30 AM'
    }
  },
  {
    id: 'HCN-1008',
    patientName: 'Sundar Rajan',
    patientPhone: '+91 98450 11993',
    patientEmail: 'sundar.rajan@vsnl.net',
    serviceRequired: 'Vital Monitoring',
    requirement: 'Bi-weekly routine blood pressure, pulse, and oxygen saturation charting for hypertensive senior.',
    requestedDate: '08 October 2026',
    requestedTime: '09:00 AM',
    duration: '30 Mins',
    additionalNotes: 'Patient was given clinical vital report with normal readings (BP: 128/82 mmHg).',
    address: '#66, JP Nagar 2nd Phase, Mysuru - 570008',
    locality: 'JP Nagar',
    lat: 12.2685,
    lng: 76.6375,
    serviceAmount: 350,
    paymentStatus: 'Completed',
    paymentLinkStatus: 'Paid',
    paymentDetails: {
      transactionId: 'TXN-UPI-440192',
      paidAt: '07 Oct 2026, 05:00 PM',
      mode: 'UPI / PhonePe',
      amount: 350
    },
    overallStatus: 'Completed',
    timeline: [
      {
        status: 'New Request',
        timestamp: '07 Oct 2026, 04:30 PM',
        actor: 'Patient',
        note: 'Requested vital monitoring.'
      },
      {
        status: 'Payment Completed',
        timestamp: '07 Oct 2026, 05:00 PM',
        actor: 'Payment Gateway',
        note: 'Payment successful.'
      },
      {
        status: 'Nurse Accepted',
        timestamp: '07 Oct 2026, 05:05 PM',
        actor: 'Nurse Priya',
        note: 'Nurse Priya accepted the home visit.'
      },
      {
        status: 'Service In Progress',
        timestamp: '08 Oct 2026, 08:55 AM',
        actor: 'Nurse Priya',
        note: 'Nurse arrived at JP Nagar residence.'
      },
      {
        status: 'Completed',
        timestamp: '08 Oct 2026, 09:30 AM',
        actor: 'Nurse Priya',
        note: 'Visit completed successfully. Digital vitals chart submitted to patient portal.'
      }
    ],
    nursesNotified: [
      {
        nurseId: 'NURSE-001',
        nurseName: 'Nurse Priya',
        phone: '+91 98450 33442',
        specialization: 'Wound Care & Geriatrics',
        distanceKm: 2.8,
        availabilityStatus: 'Available',
        notificationSentAt: '07 Oct 2026, 05:01 PM',
        responseStatus: 'Accepted',
        responseAt: '07 Oct 2026, 05:05 PM'
      }
    ],
    assignedNurse: {
      nurseId: 'NURSE-001',
      nurseName: 'Nurse Priya',
      phone: '+91 98450 33442',
      email: 'priya.nurse@mediunify.care',
      specialization: 'Wound Care & Geriatrics',
      registeredLocation: '#112, 8th Block, Kuvempunagar, Mysuru',
      distanceKm: 2.8,
      acceptedAt: '07 Oct 2026, 05:05 PM',
      serviceDateTime: '08 October 2026, 09:00 AM'
    }
  },
  {
    id: 'HCN-1009',
    patientName: 'Manjula K',
    patientPhone: '+91 98450 55123',
    patientEmail: 'manjula.k@gmail.com',
    serviceRequired: 'Blood Sugar Monitoring',
    requirement: 'Fasting blood glucose test at 7:30 AM and post-prandial follow-up.',
    requestedDate: '08 October 2026',
    requestedTime: '07:30 AM',
    duration: '20 Mins',
    additionalNotes: 'Fasting reading was 114 mg/dL. Report dispatched via SMS.',
    address: '#18, 5th Cross, VV Mohalla, Mysuru - 570002',
    locality: 'VV Mohalla',
    lat: 12.3185,
    lng: 76.6405,
    serviceAmount: 300,
    paymentStatus: 'Completed',
    paymentLinkStatus: 'Paid',
    paymentDetails: {
      transactionId: 'TXN-UPI-994102',
      paidAt: '07 Oct 2026, 06:10 PM',
      mode: 'UPI / Google Pay',
      amount: 300
    },
    overallStatus: 'Completed',
    timeline: [
      {
        status: 'New Request',
        timestamp: '07 Oct 2026, 05:30 PM',
        actor: 'Patient',
        note: 'Requested blood sugar testing.'
      },
      {
        status: 'Payment Completed',
        timestamp: '07 Oct 2026, 06:10 PM',
        actor: 'Payment Gateway',
        note: 'Payment received.'
      },
      {
        status: 'Nurse Accepted',
        timestamp: '07 Oct 2026, 06:12 PM',
        actor: 'Nurse Sunitha',
        note: 'Nurse Sunitha accepted.'
      },
      {
        status: 'Completed',
        timestamp: '08 Oct 2026, 08:00 AM',
        actor: 'Nurse Sunitha',
        note: 'Test conducted and completed.'
      }
    ],
    nursesNotified: [
      {
        nurseId: 'NURSE-009',
        nurseName: 'Nurse Sunitha',
        phone: '+91 98450 99334',
        specialization: 'IV Infusion & Injection Therapy',
        distanceKm: 0.2,
        availabilityStatus: 'Available',
        notificationSentAt: '07 Oct 2026, 06:10 PM',
        responseStatus: 'Accepted',
        responseAt: '07 Oct 2026, 06:12 PM'
      }
    ],
    assignedNurse: {
      nurseId: 'NURSE-009',
      nurseName: 'Nurse Sunitha',
      phone: '+91 98450 99334',
      email: 'sunitha.nurse@mediunify.care',
      specialization: 'IV Infusion & Injection Therapy',
      registeredLocation: '#62, 4th Main, VV Mohalla, Mysuru',
      distanceKm: 0.2,
      acceptedAt: '07 Oct 2026, 06:12 PM',
      serviceDateTime: '08 October 2026, 07:30 AM'
    }
  },
  {
    id: 'HCN-1010',
    patientName: 'Arvind Swamy',
    patientPhone: '+91 98450 33887',
    patientEmail: 'arvind.swamy@zoho.com',
    serviceRequired: 'Custom Care',
    requirement: 'Specialized tracheostomy tube suctioning and stoma cleaning.',
    requestedDate: '07 October 2026',
    requestedTime: '04:00 PM',
    duration: '60 Mins',
    additionalNotes: 'Patient was admitted to hospital emergency before appointment. Requested cancellation and refund.',
    address: '#84, Siddhartha Layout, Mysuru - 570011',
    locality: 'Siddhartha Layout',
    lat: 12.3055,
    lng: 76.6815,
    serviceAmount: 950,
    paymentStatus: 'Refunded',
    paymentLinkStatus: 'Paid',
    paymentDetails: {
      transactionId: 'TXN-UPI-110293',
      paidAt: '06 Oct 2026, 09:00 PM',
      mode: 'UPI',
      amount: 950
    },
    overallStatus: 'Cancelled',
    timeline: [
      {
        status: 'New Request',
        timestamp: '06 Oct 2026, 08:30 PM',
        actor: 'Patient',
        note: 'Requested tracheostomy care.'
      },
      {
        status: 'Payment Completed',
        timestamp: '06 Oct 2026, 09:00 PM',
        actor: 'Payment Gateway',
        note: 'Payment received.'
      },
      {
        status: 'Cancelled',
        timestamp: '07 Oct 2026, 01:00 PM',
        actor: 'Admin / Patient Request',
        note: 'Cancelled due to hospital readmission. 100% refund of ₹950 initiated.'
      }
    ],
    nursesNotified: [],
    assignedNurse: null
  }
];

// 4. Haversine distance calculator between coordinates in Kilometers
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 3.5;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Number(d.toFixed(1));
}

// 5. Automatic Nurse Eligibility & Matching Rule Engine
export function findEligibleNurses(request, nursesList) {
  if (!request) return [];

  const reqService = (request.serviceRequired || '').toLowerCase().trim();
  const reqDate = request.requestedDate;
  const reqTime = request.requestedTime;
  const patientLat = request.lat || 12.2958;
  const patientLng = request.lng || 76.6394;

  return nursesList
    .filter((nurse) => {
      // Rule 1: Registered with MediUnify
      if (!nurse.id) return false;

      // Rule 2: Nurse is Active (accountStatus === 'Active') and not OFFLINE
      if (nurse.accountStatus !== 'Active') return false;
      if (nurse.status === 'OFFLINE') return false;

      // Rule 3: Nurse provides the requested service
      const providesService = (nurse.services || []).some(
        (srv) => srv.toLowerCase().trim() === reqService || reqService.includes(srv.toLowerCase().trim())
      );
      if (!providesService) return false;

      // Rule 4 & 5: Check future date & time availability
      // If nurse has a booking at the EXACT SAME requested date and time slot, they are busy for that slot
      const hasConflict = (nurse.upcomingBookings || []).some(
        (b) => b.date === reqDate && b.time === reqTime && b.id !== request.id
      );
      if (hasConflict) return false;

      return true;
    })
    .map((nurse) => {
      const dist = calculateDistanceKm(patientLat, patientLng, nurse.lat, nurse.lng);
      return {
        ...nurse,
        distanceKm: dist,
        availabilityStatus: `Available on ${reqDate || 'requested date'}, ${reqTime || 'requested time'}`
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm); // Rule 6: Ranked by proximity
}
