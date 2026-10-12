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
    notes: 'Recurrent biliary colic, USG confirmed 8mm gallstones. Resident of Gokulam 3rd Stage, Mysore.'
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
    notes: 'Grade IV Osteoarthritis, severe mobility issues. Kuvempunagar M-Block, Mysore.'
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
    notes: 'Sports injury during Chamundi Hill run. Complete ACL tear on 3T MRI scan.'
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
