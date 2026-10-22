// Comprehensive Surgical Care, Patient Surgery Requests & Excel Export Data Model — Multi-City Hub (Mysore, Bangalore, Mandya)

export const SURGERY_STATS = {
  totalInquiries: 64,
  localitiesCovered: 28,
  todayInquiries: 14,
  highPriority: 16,
  location: 'Mysore • Bangalore • Mandya (Karnataka Hub)',
  averageTurnaround: '1.2 Days'
};

export const SURGERY_CITIES = [
  'All Cities',
  'Mysore',
  'Bangalore',
  'Mandya'
];

export const SURGERY_CATEGORIES = [
  'All Categories',
  'General Surgery',
  'Orthopedics & Joint Replacement',
  'Gastroenterology & Laparoscopy',
  'Ophthalmology (Eye)',
  'Neurosurgery & Spine',
  'Urology & Nephro',
  'ENT & Head-Neck',
  'Gynecology & Obstetrics',
  'Vascular & Cardiac'
];

export const DEFAULT_SURGERY_SPECIALIZATIONS = [
  'Knee Replacement',
  'Hip Replacement',
  'Joint Replacement',
  'Cardiac Surgery',
  'Neurosurgery',
  'Orthopaedic Surgery',
  'Spine Surgery',
  'General Surgery',
  'Laparoscopic Surgery',
  'Ophthalmology (Eye) Surgery',
  'Urology & Nephro Surgery',
  'ENT & Head-Neck Surgery',
  'Gynecology Surgery',
  'Vascular Surgery',
  'Plastic & Reconstructive Surgery',
  'Pediatric Surgery'
];

export const HOSPITAL_TYPES = [
  'Super Specialty Surgical Hospital',
  'Multi-Specialty Hospital',
  'Orthopaedic & Joint Center',
  'Cardiac & Neuro Super Specialty',
  'Day-Care Surgical Center',
  'Tertiary Care University Hospital',
  'Charitable & Trust Hospital'
];

// Initial Onboarded Hospitals Database
export const INITIAL_HOSPITALS = [
  {
    id: 'HOSP-MY-001',
    name: 'A R Hospital',
    type: 'Super Specialty Surgical Hospital',
    address: '#42, Sayyaji Rao Road, Near Fountain Circle',
    city: 'Mysore',
    state: 'Karnataka',
    pincode: '570020',
    contactPerson: 'Dr. Arvind Rao',
    contactMobile: '+91 98450 11223',
    contactEmail: 'admissions@arhospital.org',
    specializations: [
      'Knee Replacement',
      'Hip Replacement',
      'Joint Replacement',
      'Orthopaedic Surgery',
      'General Surgery',
      'Spine Surgery'
    ],
    preferredNotification: 'Both',
    whatsappNumber: '+91 98450 11223',
    notificationEmail: 'surgery-leads@arhospital.org',
    status: 'Active',
    rating: 4.8,
    totalSurgeriesCompleted: 340,
    establishedYear: 2012,
    bedCount: 160,
    icuBeds: 24,
    onboardedDate: '2025-04-10'
  },
  {
    id: 'HOSP-MY-002',
    name: 'Apollo BGS Hospitals',
    type: 'Multi-Specialty Hospital',
    address: 'Adichunchanagiri Road, Kuvempunagar',
    city: 'Mysore',
    state: 'Karnataka',
    pincode: '570023',
    contactPerson: 'Sneha Kulkarni',
    contactMobile: '+91 98800 23456',
    contactEmail: 'referrals.mysore@apollobgs.com',
    specializations: [
      'Cardiac Surgery',
      'Neurosurgery',
      'Spine Surgery',
      'Knee Replacement',
      'Joint Replacement',
      'Orthopaedic Surgery',
      'General Surgery',
      'Laparoscopic Surgery',
      'Vascular Surgery'
    ],
    preferredNotification: 'Email',
    whatsappNumber: '+91 98800 23456',
    notificationEmail: 'referrals.mysore@apollobgs.com',
    status: 'Active',
    rating: 4.9,
    totalSurgeriesCompleted: 620,
    establishedYear: 2004,
    bedCount: 250,
    icuBeds: 45,
    onboardedDate: '2025-02-15'
  },
  {
    id: 'HOSP-BLR-001',
    name: 'Manipal Hospital (Old Airport Road)',
    type: 'Super Specialty Surgical Hospital',
    address: '#98, HAL Old Airport Road, Kodihalli',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560017',
    contactPerson: 'Vikramaditya Hegde',
    contactMobile: '+91 99160 55432',
    contactEmail: 'desksurgery@manipalhospitals.com',
    specializations: [
      'Cardiac Surgery',
      'Neurosurgery',
      'Spine Surgery',
      'Knee Replacement',
      'Hip Replacement',
      'Joint Replacement',
      'Orthopaedic Surgery',
      'General Surgery',
      'Laparoscopic Surgery'
    ],
    preferredNotification: 'WhatsApp',
    whatsappNumber: '+91 99160 55432',
    notificationEmail: 'desksurgery@manipalhospitals.com',
    status: 'Active',
    rating: 4.9,
    totalSurgeriesCompleted: 890,
    establishedYear: 1991,
    bedCount: 600,
    icuBeds: 90,
    onboardedDate: '2025-01-20'
  },
  {
    id: 'HOSP-BLR-002',
    name: 'Sparsh Hospital for Advanced Surgeries',
    type: 'Orthopaedic & Joint Center',
    address: '#146, Infantry Road, Tasker Town',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    contactPerson: 'Meenakshi Sundaram',
    contactMobile: '+91 94801 66772',
    contactEmail: 'jointcare@sparshhospital.com',
    specializations: [
      'Knee Replacement',
      'Hip Replacement',
      'Joint Replacement',
      'Orthopaedic Surgery',
      'Spine Surgery'
    ],
    preferredNotification: 'WhatsApp',
    whatsappNumber: '+91 94801 66772',
    notificationEmail: 'jointcare@sparshhospital.com',
    status: 'Active',
    rating: 4.7,
    totalSurgeriesCompleted: 480,
    establishedYear: 2008,
    bedCount: 180,
    icuBeds: 28,
    onboardedDate: '2025-03-05'
  },
  {
    id: 'HOSP-BLR-003',
    name: 'Narayana Institute of Cardiac & Neuro Sciences',
    type: 'Cardiac & Neuro Super Specialty',
    address: 'Bommasandra Industrial Area, Anekal Taluk',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560099',
    contactPerson: 'Dr. Pradeep George',
    contactMobile: '+91 97410 88991',
    contactEmail: 'surgerydesk@narayanahealth.org',
    specializations: [
      'Cardiac Surgery',
      'Neurosurgery',
      'Vascular Surgery',
      'Spine Surgery',
      'General Surgery'
    ],
    preferredNotification: 'Both',
    whatsappNumber: '+91 97410 88991',
    notificationEmail: 'surgerydesk@narayanahealth.org',
    status: 'Active',
    rating: 4.8,
    totalSurgeriesCompleted: 750,
    establishedYear: 2000,
    bedCount: 450,
    icuBeds: 80,
    onboardedDate: '2025-02-01'
  },
  {
    id: 'HOSP-MDY-001',
    name: 'Mandya Institute of Medical Sciences (MIMS Hospital)',
    type: 'Tertiary Care University Hospital',
    address: 'Bangalore-Mysore Highway, Gandhi Nagar',
    city: 'Mandya',
    state: 'Karnataka',
    pincode: '571401',
    contactPerson: 'Dr. Jayaramu Gowda',
    contactMobile: '+91 94482 11990',
    contactEmail: 'admin.surgery@mimsmandya.org',
    specializations: [
      'General Surgery',
      'Orthopaedic Surgery',
      'Knee Replacement',
      'Laparoscopic Surgery',
      'Spine Surgery'
    ],
    preferredNotification: 'Email',
    whatsappNumber: '+91 94482 11990',
    notificationEmail: 'admin.surgery@mimsmandya.org',
    status: 'Active',
    rating: 4.6,
    totalSurgeriesCompleted: 290,
    establishedYear: 2006,
    bedCount: 300,
    icuBeds: 35,
    onboardedDate: '2025-05-12'
  },
  {
    id: 'HOSP-MY-003',
    name: 'Cauvery Specialty Hospital',
    type: 'Day-Care Surgical Center',
    address: 'Bannur Road, Siddhartha Layout',
    city: 'Mysore',
    state: 'Karnataka',
    pincode: '570011',
    contactPerson: 'Hitesh Nambiar',
    contactMobile: '+91 98455 77881',
    contactEmail: 'care@cauverysurgical.in',
    specializations: [
      'Knee Replacement',
      'Joint Replacement',
      'General Surgery',
      'Laparoscopic Surgery',
      'Orthopaedic Surgery'
    ],
    preferredNotification: 'WhatsApp',
    whatsappNumber: '+91 98455 77881',
    notificationEmail: 'care@cauverysurgical.in',
    status: 'Inactive',
    statusReason: 'Upgrading surgical suite laminar airflow and OT equipment through November 2026',
    rating: 4.4,
    totalSurgeriesCompleted: 180,
    establishedYear: 2016,
    bedCount: 75,
    icuBeds: 12,
    onboardedDate: '2025-06-01'
  },
  {
    id: 'HOSP-BLR-004',
    name: 'Sankara Eye Super Specialty Hospital',
    type: 'Super Specialty Surgical Hospital',
    address: 'Varthur Road, Kundalahalli Gate, Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560037',
    contactPerson: 'Dr. Radhika Ramesh',
    contactMobile: '+91 98450 99881',
    contactEmail: 'cataract@sankaraeye.com',
    specializations: [
      'Ophthalmology (Eye) Surgery'
    ],
    preferredNotification: 'WhatsApp',
    whatsappNumber: '+91 98450 99881',
    notificationEmail: 'cataract@sankaraeye.com',
    status: 'Active',
    rating: 4.9,
    totalSurgeriesCompleted: 1200,
    establishedYear: 2007,
    bedCount: 150,
    icuBeds: 10,
    onboardedDate: '2025-01-15'
  }
];

/**
 * Intelligent Surgery to Hospital Specialization Matching Engine
 * Returns ONLY ACTIVE hospitals matching patient needed surgery or category.
 * Inactive hospitals remain in the directory and are explicitly excluded from new referral recommendations.
 */
export function getMatchingHospitals(patient, hospitals = INITIAL_HOSPITALS) {
  if (!patient || !hospitals) return [];

  const needed = (patient.neededSurgery || '').toLowerCase();
  const category = (patient.surgeryCategory || '').toLowerCase();

  const targetSpecializations = new Set();

  if (needed.includes('knee') || needed.includes('tkr')) {
    targetSpecializations.add('Knee Replacement');
    targetSpecializations.add('Joint Replacement');
    targetSpecializations.add('Orthopaedic Surgery');
  }
  if (needed.includes('hip') || needed.includes('thr')) {
    targetSpecializations.add('Hip Replacement');
    targetSpecializations.add('Joint Replacement');
    targetSpecializations.add('Orthopaedic Surgery');
  }
  if (needed.includes('joint') || needed.includes('arthroscopy') || needed.includes('acl')) {
    targetSpecializations.add('Joint Replacement');
    targetSpecializations.add('Orthopaedic Surgery');
    targetSpecializations.add('Knee Replacement');
  }
  if (
    needed.includes('cardiac') ||
    needed.includes('heart') ||
    needed.includes('angioplasty') ||
    needed.includes('stent') ||
    needed.includes('bypass') ||
    needed.includes('cabg') ||
    category.includes('cardiac') ||
    category.includes('vascular')
  ) {
    targetSpecializations.add('Cardiac Surgery');
    targetSpecializations.add('Vascular Surgery');
  }
  if (
    needed.includes('spine') ||
    needed.includes('discectomy') ||
    needed.includes('acdf') ||
    needed.includes('cervical') ||
    needed.includes('lumbar') ||
    category.includes('spine')
  ) {
    targetSpecializations.add('Spine Surgery');
    targetSpecializations.add('Neurosurgery');
  }
  if (needed.includes('neuro') || needed.includes('brain') || category.includes('neuro')) {
    targetSpecializations.add('Neurosurgery');
    targetSpecializations.add('Spine Surgery');
  }
  if (
    needed.includes('hernia') ||
    needed.includes('append') ||
    needed.includes('cholecyst') ||
    needed.includes('hemorrhoid') ||
    needed.includes('gallbladder') ||
    category.includes('general')
  ) {
    targetSpecializations.add('General Surgery');
    targetSpecializations.add('Laparoscopic Surgery');
  }
  if (
    needed.includes('cataract') ||
    needed.includes('lasik') ||
    needed.includes('smile') ||
    needed.includes('eye') ||
    category.includes('ophthalmology')
  ) {
    targetSpecializations.add('Ophthalmology (Eye) Surgery');
  }
  if (
    needed.includes('prostate') ||
    needed.includes('kidney') ||
    needed.includes('pcnl') ||
    needed.includes('stone') ||
    category.includes('urology')
  ) {
    targetSpecializations.add('Urology & Nephro Surgery');
    targetSpecializations.add('General Surgery');
  }
  if (
    needed.includes('sinus') ||
    needed.includes('fess') ||
    needed.includes('septoplasty') ||
    needed.includes('thyroid') ||
    category.includes('ent')
  ) {
    targetSpecializations.add('ENT & Head-Neck Surgery');
    targetSpecializations.add('General Surgery');
  }
  if (needed.includes('laparoscop') || needed.includes('keyhole') || category.includes('laparoscopy')) {
    targetSpecializations.add('Laparoscopic Surgery');
    targetSpecializations.add('General Surgery');
  }
  if (
    needed.includes('endometrio') ||
    needed.includes('hysterect') ||
    needed.includes('ovarian') ||
    category.includes('gynecology')
  ) {
    targetSpecializations.add('Gynecology Surgery');
    targetSpecializations.add('Laparoscopic Surgery');
  }

  // Filter ONLY ACTIVE hospitals that have matching specializations
  return hospitals
    .filter((h) => h.status === 'Active')
    .filter((h) => {
      const hospitalSpecs = h.specializations || [];
      return hospitalSpecs.some((spec) => {
        if (targetSpecializations.has(spec)) return true;
        const specLower = spec.toLowerCase();
        return needed.includes(specLower) || category.includes(specLower);
      });
    })
    .map((h) => {
      const hospitalSpecs = h.specializations || [];
      const matched = hospitalSpecs.filter((spec) => {
        if (targetSpecializations.has(spec)) return true;
        const specLower = spec.toLowerCase();
        return needed.includes(specLower) || category.includes(specLower);
      });
      return {
        ...h,
        matchedSpecializations: matched.length > 0 ? matched : hospitalSpecs
      };
    });
}

/**
 * Returns inactive hospitals that match the surgery specialization.
 * Used for system transparency to show why an inactive hospital is excluded.
 */
export function getInactiveMatchingHospitals(patient, hospitals = INITIAL_HOSPITALS) {
  if (!patient || !hospitals) return [];

  const needed = (patient.neededSurgery || '').toLowerCase();
  const category = (patient.surgeryCategory || '').toLowerCase();

  const targetSpecializations = new Set();
  if (needed.includes('knee') || needed.includes('tkr')) targetSpecializations.add('Knee Replacement');
  if (needed.includes('joint')) targetSpecializations.add('Joint Replacement');
  if (needed.includes('spine')) targetSpecializations.add('Spine Surgery');
  if (needed.includes('cardiac')) targetSpecializations.add('Cardiac Surgery');
  if (needed.includes('hernia') || category.includes('general')) targetSpecializations.add('General Surgery');

  return hospitals
    .filter((h) => h.status === 'Inactive')
    .filter((h) => {
      const hospitalSpecs = h.specializations || [];
      return hospitalSpecs.some((spec) => {
        if (targetSpecializations.has(spec)) return true;
        const specLower = spec.toLowerCase();
        return needed.includes(specLower) || category.includes(specLower);
      });
    });
}

export const MULTI_CITY_SURGERY_LOCALITIES = [
  'All Localities',
  // Mysore
  'Mysore (Gokulam)',
  'Mysore (Jayalakshmipuram)',
  'Mysore (Kuvempunagar)',
  'Mysore (Vijayanagar)',
  'Mysore (Saraswathipuram)',
  'Mysore (VV Mohalla)',
  'Mysore (Yadavagiri)',
  'Mysore (Hebbal)',
  'Mysore (Ramakrishnanagar)',
  'Mysore (Siddhartha Layout)',
  'Mysore (Bannimantap)',
  'Mysore (Chamundipuram)',
  // Bangalore
  'Bangalore (Indiranagar)',
  'Bangalore (Koramangala)',
  'Bangalore (Whitefield)',
  'Bangalore (HSR Layout)',
  'Bangalore (Jayanagar)',
  'Bangalore (Malleshwaram)',
  'Bangalore (Electronic City)',
  'Bangalore (JP Nagar)',
  'Bangalore (Hebbal)',
  'Bangalore (Rajajinagar)',
  // Mandya
  'Mandya (City Center)',
  'Mandya (Maddur)',
  'Mandya (Srirangapatna)',
  'Mandya (Malavalli)',
  'Mandya (Pandavapura)',
  'Mandya (Nagamangala)',
  'Mandya (K.R. Pet)'
];

export const MYSORE_LOCALITIES = MULTI_CITY_SURGERY_LOCALITIES;

// Patient Surgery Requests Database — Multi-City Coverage (Mysore, Bangalore, Mandya)
export const INITIAL_SURGERY_PATIENTS = [
  // Mysore Patients
  {
    patientId: 'MY-SURG-2026-081',
    patientName: 'Ananya Sharma',
    age: 38,
    gender: 'Female',
    neededSurgery: 'Laparoscopic Cholecystectomy (Gallbladder)',
    surgeryCategory: 'Gastroenterology & Laparoscopy',
    cityName: 'Mysore (Gokulam)',
    mobileNumber: '+91 98450 45892',
    email: 'ananya.sharma@gmail.com',
    requestedDate: '2026-09-19',
    urgency: 'High Priority',
    estimatedCost: '₹75,000',
    notes: 'Recurrent biliary colic, USG confirmed 8mm gallstones. Resident of Gokulam 3rd Stage, Mysore.',
    forwardStatus: 'Forwarded',
    forwardedHospital: {
      hospitalId: 'HOSP-MY-002',
      hospitalName: 'Apollo BGS Hospitals',
      method: 'Email',
      sentAt: '2026-09-19 11:30 AM',
      target: 'referrals.mysore@apollobgs.com'
    },
    hospitalResponse: 'Consultation Scheduled',
    hospitalResponseNotes: 'Surgical gastroenterology consultation scheduled with Dr. Suresh for 25 Sept. Pre-anesthetic checkup requested.',
    timeline: [
      {
        status: 'Inquiry Registered',
        timestamp: '19 Sep 2026, 09:15 AM',
        note: 'Patient inquiry registered for Laparoscopic Cholecystectomy.'
      },
      {
        status: 'Forwarded to Hospital',
        timestamp: '19 Sep 2026, 11:30 AM',
        note: 'Referred to Apollo BGS Hospitals via Email with USG report summary.'
      },
      {
        status: 'Consultation Scheduled',
        timestamp: '20 Sep 2026, 02:45 PM',
        note: 'Hospital confirmed OP consultation slot on 25 Sept.'
      }
    ]
  },
  {
    patientId: 'MY-SURG-2026-082',
    patientName: 'Rajesh Kumar Verma',
    age: 62,
    gender: 'Male',
    neededSurgery: 'Total Knee Replacement (TKR) - Left Knee',
    surgeryCategory: 'Orthopedics & Joint Replacement',
    cityName: 'Mysore (Kuvempunagar)',
    mobileNumber: '+91 94801 33219',
    email: 'rajesh.verma62@yahoo.co.in',
    requestedDate: '2026-09-20',
    urgency: 'Elective',
    estimatedCost: '₹1,95,000',
    notes: 'Grade IV Osteoarthritis, severe mobility issues. Kuvempunagar M-Block, Mysore.',
    forwardStatus: 'Forwarded',
    forwardedHospital: {
      hospitalId: 'HOSP-MY-001',
      hospitalName: 'A R Hospital',
      method: 'Both',
      sentAt: '2026-09-20 02:15 PM',
      target: '+91 98450 11223 / surgery-leads@arhospital.org'
    },
    hospitalResponse: 'Quotation Received',
    hospitalResponseNotes: 'Package quotation ₹1,85,000 received for Zimmer Biomet high-flex knee implant. Dr. Arvind Rao reviewed X-rays.',
    timeline: [
      {
        status: 'Inquiry Registered',
        timestamp: '20 Sep 2026, 10:00 AM',
        note: 'Patient inquiry registered for Total Knee Replacement.'
      },
      {
        status: 'Forwarded to Hospital',
        timestamp: '20 Sep 2026, 02:15 PM',
        note: 'Referred to A R Hospital via WhatsApp (+91 98450 11223) & Email.'
      },
      {
        status: 'Quotation Received',
        timestamp: '21 Sep 2026, 11:30 AM',
        note: 'Quotation of ₹1,85,000 received from Dr. Arvind Rao. Patient notified.'
      }
    ]
  },
  {
    patientId: 'MY-SURG-2026-083',
    patientName: 'Pooja Iyer',
    age: 29,
    gender: 'Female',
    neededSurgery: 'ACL Reconstruction Knee Arthroscopy',
    surgeryCategory: 'Orthopedics & Joint Replacement',
    cityName: 'Mysore (Jayalakshmipuram)',
    mobileNumber: '+91 97412 12654',
    email: 'pooja.iyer.tech@gmail.com',
    requestedDate: '2026-09-21',
    urgency: 'High Priority',
    estimatedCost: '₹1,15,000',
    notes: 'Sports injury during Chamundi Hill run. Complete ACL tear on 3T MRI scan.',
    forwardStatus: 'Not Forwarded',
    forwardedHospital: null,
    hospitalResponse: 'Pending',
    hospitalResponseNotes: '',
    timeline: [
      {
        status: 'Inquiry Registered',
        timestamp: '21 Sep 2026, 09:30 AM',
        note: 'Sports knee injury inquiry registered. Awaiting hospital matching & forwarding.'
      }
    ]
  },
  {
    patientId: 'MY-SURG-2026-084',
    patientName: 'Vikram R. Hegde',
    age: 54,
    gender: 'Male',
    neededSurgery: 'Inguinal Hernia Mesh Repair (Bilateral)',
    surgeryCategory: 'General Surgery',
    cityName: 'Mysore (Vijayanagar)',
    mobileNumber: '+91 99001 88210',
    email: 'vikram.hegde.mys@gmail.com',
    requestedDate: '2026-09-18',
    urgency: 'Elective',
    estimatedCost: '₹68,000',
    notes: 'Bilateral direct hernia. Day-care 3D mesh laparoscopic procedure requested.'
  },
  {
    patientId: 'MY-SURG-2026-085',
    patientName: 'Meera Deshmukh',
    age: 67,
    gender: 'Female',
    neededSurgery: 'Laser Cataract Surgery with Toric Multifocal IOL',
    surgeryCategory: 'Ophthalmology (Eye)',
    cityName: 'Mysore (VV Mohalla)',
    mobileNumber: '+91 98860 74123',
    email: 'meera.deshmukh@rediffmail.com',
    requestedDate: '2026-09-17',
    urgency: 'Elective',
    estimatedCost: '₹55,000',
    notes: 'Right eye mature nuclear cataract (Grade 3). VV Mohalla resident.'
  },
  {
    patientId: 'MY-SURG-2026-086',
    patientName: 'Sanjay Kapoor',
    age: 46,
    gender: 'Male',
    neededSurgery: 'Microdiscectomy L4-L5 Spine Decompression',
    surgeryCategory: 'Neurosurgery & Spine',
    cityName: 'Mysore (Hebbal)',
    mobileNumber: '+91 96112 33451',
    email: 'sanjay.kapoor@outlook.com',
    requestedDate: '2026-09-22',
    urgency: 'High Priority',
    estimatedCost: '₹1,85,000',
    notes: 'Radiating sciatica pain with disc extrusion at L4-L5 level. Hebbal Industrial Area, Mysore.'
  },
  {
    patientId: 'MY-SURG-2026-087',
    patientName: 'Kavita Nair',
    age: 33,
    gender: 'Female',
    neededSurgery: 'Endoscopic Sinus Surgery (FESS) & Septoplasty',
    surgeryCategory: 'ENT & Head-Neck',
    cityName: 'Mysore (Saraswathipuram)',
    mobileNumber: '+91 94481 90812',
    email: 'kavita.nair.mys@gmail.com',
    requestedDate: '2026-09-23',
    urgency: 'Elective',
    estimatedCost: '₹62,000',
    notes: 'Chronic rhinosinusitis with bilateral nasal polyps. CT PNS scan completed.'
  },
  {
    patientId: 'MY-SURG-2026-088',
    patientName: 'Somashekar Swamy',
    age: 51,
    gender: 'Male',
    neededSurgery: 'Laser Hemorrhoidectomy (Day Care)',
    surgeryCategory: 'General Surgery',
    cityName: 'Mysore (Yadavagiri)',
    mobileNumber: '+91 98451 45199',
    email: 'somashekar.swamy@gmail.com',
    requestedDate: '2026-09-18',
    urgency: 'Elective',
    estimatedCost: '₹48,000',
    notes: 'Grade III internal hemorrhoids. Requests minimally invasive diode laser procedure.'
  },

  // Bangalore Patients
  {
    patientId: 'BLR-SURG-2026-101',
    patientName: 'Aditya Narayanan',
    age: 42,
    gender: 'Male',
    neededSurgery: 'Robotic Radical Prostatectomy',
    surgeryCategory: 'Urology & Nephro',
    cityName: 'Bangalore (Indiranagar)',
    mobileNumber: '+91 98801 55672',
    email: 'aditya.narayanan@techcorp.in',
    requestedDate: '2026-09-23',
    urgency: 'High Priority',
    estimatedCost: '₹3,20,000',
    notes: 'Elevated PSA with localized prostatic adenocarcinoma. Inquiring for da Vinci robotic surgery.'
  },
  {
    patientId: 'BLR-SURG-2026-102',
    patientName: 'Dr. Shalini Venkatesh',
    age: 35,
    gender: 'Female',
    neededSurgery: 'Laser Assisted In-Situ Keratomileusis (LASIK / SMILE)',
    surgeryCategory: 'Ophthalmology (Eye)',
    cityName: 'Bangalore (Koramangala)',
    mobileNumber: '+91 97422 66781',
    email: 'dr.shalini.v@gmail.com',
    requestedDate: '2026-09-24',
    urgency: 'Elective',
    estimatedCost: '₹95,000',
    notes: 'High myopic astigmatism (-5.5D). Corneal topography suitable for Contoura vision.'
  },
  {
    patientId: 'BLR-SURG-2026-103',
    patientName: 'Farhan Siddiqui',
    age: 49,
    gender: 'Male',
    neededSurgery: 'Coronary Angioplasty & Drug-Eluting Stenting (DES)',
    surgeryCategory: 'Vascular & Cardiac',
    cityName: 'Bangalore (Whitefield)',
    mobileNumber: '+91 99160 88234',
    email: 'farhan.siddiqui@gmail.com',
    requestedDate: '2026-09-22',
    urgency: 'High Priority',
    estimatedCost: '₹2,40,000',
    notes: 'TMT positive for inducible ischemia. Diagnostic coronary angiogram showed 85% LAD stenosis.'
  },
  {
    patientId: 'BLR-SURG-2026-104',
    patientName: 'Preethi Chandrashekar',
    age: 31,
    gender: 'Female',
    neededSurgery: 'Diagnostic & Operative Laparoscopy (Endometriosis Excision)',
    surgeryCategory: 'Gynecology & Obstetrics',
    cityName: 'Bangalore (HSR Layout)',
    mobileNumber: '+91 98455 33419',
    email: 'preethi.c@gmail.com',
    requestedDate: '2026-09-21',
    urgency: 'Elective',
    estimatedCost: '₹1,25,000',
    notes: 'Grade III pelvic endometriosis with ovarian endometrioma. Fertility sparing keyhole surgery.'
  },
  {
    patientId: 'BLR-SURG-2026-105',
    patientName: 'Kishore G. Rao',
    age: 58,
    gender: 'Male',
    neededSurgery: 'Cervical Spine ACDF (Anterior Discectomy & Fusion)',
    surgeryCategory: 'Neurosurgery & Spine',
    cityName: 'Bangalore (Malleshwaram)',
    mobileNumber: '+91 94480 77123',
    email: 'kishore.rao.blr@gmail.com',
    requestedDate: '2026-09-20',
    urgency: 'High Priority',
    estimatedCost: '₹2,75,000',
    notes: 'C5-C6 cervical radiculopathy with progressive grip weakness. PEEK cage fusion requested.'
  },

  // Mandya Patients
  {
    patientId: 'MDY-SURG-2026-201',
    patientName: 'Basavaraju Gowda',
    age: 64,
    gender: 'Male',
    neededSurgery: 'Phacoemulsification Cataract Surgery with Monofocal IOL',
    surgeryCategory: 'Ophthalmology (Eye)',
    cityName: 'Mandya (City Center)',
    mobileNumber: '+91 94803 11228',
    email: 'basavaraju.gowda@gmail.com',
    requestedDate: '2026-09-22',
    urgency: 'Elective',
    estimatedCost: '₹38,000',
    notes: 'Advanced senile cataract, left eye. Mandya agricultural hub resident.'
  },
  {
    patientId: 'MDY-SURG-2026-202',
    patientName: 'Lakshmamma M.',
    age: 56,
    gender: 'Female',
    neededSurgery: 'Laparoscopic Appendectomy & Adhesiolysis',
    surgeryCategory: 'General Surgery',
    cityName: 'Mandya (Maddur)',
    mobileNumber: '+91 98459 22341',
    email: 'lakshmamma.maddur@gmail.com',
    requestedDate: '2026-09-24',
    urgency: 'High Priority',
    estimatedCost: '₹58,000',
    notes: 'Subacute appendicitis with recurrent right iliac fossa pain. Ultrasonography verified.'
  },
  {
    patientId: 'MDY-SURG-2026-203',
    patientName: 'Ramesh Chennapatna',
    age: 47,
    gender: 'Male',
    neededSurgery: 'PCNL (Percutaneous Nephrolithotomy - Kidney Stone)',
    surgeryCategory: 'Urology & Nephro',
    cityName: 'Mandya (Srirangapatna)',
    mobileNumber: '+91 97311 44890',
    email: 'ramesh.chenna@yahoo.com',
    requestedDate: '2026-09-23',
    urgency: 'High Priority',
    estimatedCost: '₹72,000',
    notes: '18mm right renal pelvis staghorn calculus causing hydronephrosis. Laser PCNL scheduled.'
  },
  {
    patientId: 'MDY-SURG-2026-204',
    patientName: 'Geetha Nagendra',
    age: 39,
    gender: 'Female',
    neededSurgery: 'Total Thyroidectomy for Multinodular Goitre',
    surgeryCategory: 'ENT & Head-Neck',
    cityName: 'Mandya (Pandavapura)',
    mobileNumber: '+91 99012 33456',
    email: 'geetha.nagendra@gmail.com',
    requestedDate: '2026-09-19',
    urgency: 'Elective',
    estimatedCost: '₹65,000',
    notes: 'Euthyroid multinodular goitre with retrosternal extension. Nerve monitoring assisted.'
  }
];

/**
 * Generates and downloads an Excel spreadsheet (CSV format with UTF-8 BOM)
 * containing patient surgery requests across Mysore, Bangalore, and Mandya.
 */
export function downloadSurgeryPatientsExcel(patients) {
  const headers = [
    'Patient ID',
    'Patient Name',
    'Age',
    'Gender',
    'Needed Surgery',
    'Surgery Category',
    'City / Area (Mysore / Bangalore / Mandya)',
    'Mobile Number',
    'Email Address',
    'Requested Date',
    'Urgency',
    'Estimated Cost (INR)',
    'Forwarded Hospital',
    'Hospital Response Status',
    'Clinical Remarks'
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const stringVal = String(val).replace(/"/g, '""');
    return `"${stringVal}"`;
  };

  const rows = patients.map((p) => [
    escapeCSV(p.patientId),
    escapeCSV(p.patientName),
    escapeCSV(p.age),
    escapeCSV(p.gender),
    escapeCSV(p.neededSurgery),
    escapeCSV(p.surgeryCategory),
    escapeCSV(p.cityName),
    escapeCSV(p.mobileNumber),
    escapeCSV(p.email),
    escapeCSV(p.requestedDate),
    escapeCSV(p.urgency),
    escapeCSV(p.estimatedCost),
    escapeCSV(p.forwardedHospital?.hospitalName || 'Not Forwarded'),
    escapeCSV(p.hospitalResponse || 'Pending'),
    escapeCSV(p.notes)
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.map((h) => `"${h}"`).join(','),
    ...rows.map((r) => r.join(','))
  ].join('\r\n');

  // \uFEFF Byte Order Mark ensures Microsoft Excel displays UTF-8 properly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const todayStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `MediUnify_Surgery_Patients_${todayStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
