// ==============================================================================
// MEDIUNIFY RADIOLOGY & IMAGING OPERATIONS MASTER DATA
// ==============================================================================

export const RADIOLOGY_STATS = {
  scansConductedToday: 38,
  machineUtilization: '89.2%',
  urgentReportsPending: 3,
  revenueToday: 184500,
  activeScanners: 9,
  averageScanDuration: '24 min'
};

// 1. RADIOLOGY CENTERS
export const RADIOLOGY_CENTERS = [
  {
    id: 'CTR-MYS-01',
    name: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    code: 'RAD-CTR-MYS01',
    address: 'Plot 42/B, Saraswathipuram Industrial Suburb, Mysuru - 570009',
    city: 'Mysuru',
    contactNumber: '+91 821 2548900',
    email: 'radiology.saraswathi@mediunify.com',
    operatingHours: '06:00 AM - 11:00 PM (24/7 Emergency Scan Support)',
    availableServices: ['MRI', 'CT Scan', 'X-Ray', 'Ultrasound', 'Mammography', 'DEXA'],
    totalMachines: 5,
    todaysBookings: 24,
    status: 'Active',
    accreditation: 'NABL & AERB Certified Hub'
  },
  {
    id: 'CTR-MYS-02',
    name: 'MediUnify Diagnostic Scan & Imaging Suite - Jayalakshmipuram',
    code: 'RAD-CTR-MYS02',
    address: '#108, Temple Road, Jayalakshmipuram, Mysuru - 570012',
    city: 'Mysuru',
    contactNumber: '+91 821 2412880',
    email: 'jayalakshmi.rad@mediunify.com',
    operatingHours: '07:00 AM - 09:00 PM',
    availableServices: ['CT Scan', 'X-Ray', 'Ultrasound', 'Mammography'],
    totalMachines: 3,
    todaysBookings: 14,
    status: 'Active',
    accreditation: 'AERB Approved Multi-Slice Center'
  },
  {
    id: 'CTR-MYS-03',
    name: 'MediUnify Community Imaging & Ultrasound Center - Kuvempunagar',
    code: 'RAD-CTR-MYS03',
    address: '#412, Vishwamanava Double Road, Kuvempunagar, Mysuru - 570023',
    city: 'Mysuru',
    contactNumber: '+91 821 2567119',
    email: 'kuvempu.rad@mediunify.com',
    operatingHours: '08:00 AM - 08:00 PM',
    availableServices: ['X-Ray', 'Ultrasound', 'DEXA'],
    totalMachines: 2,
    todaysBookings: 9,
    status: 'Active',
    accreditation: 'AERB Registered Diagnostic Clinic'
  },
  {
    id: 'CTR-BLR-04',
    name: 'MediUnify Neuro-Imaging & Multi-Slice CT Hub - Indiranagar, Bengaluru',
    code: 'RAD-CTR-BLR01',
    address: '100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru - 560038',
    city: 'Bengaluru',
    contactNumber: '+91 80 41209911',
    email: 'bangalore.rad@mediunify.com',
    operatingHours: '24 Hours (Emergency Trauma & Stroke Hub)',
    availableServices: ['MRI', 'CT Scan', 'X-Ray', 'Ultrasound'],
    totalMachines: 3,
    todaysBookings: 18,
    status: 'Active',
    accreditation: 'ISO 15189 & NABH Accredited'
  }
];

// 2. RADIOLOGY MACHINES
export const RADIOLOGY_MACHINES = [
  {
    id: 'MCH-MRI-01',
    name: 'Siemens MAGNETOM Vida 3T (BioMatrix Gantry A)',
    modality: 'MRI',
    centerId: 'CTR-MYS-01',
    centerName: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    room: 'Shielded Suite 1 (Gantry A)',
    availableServices: ['MRI Brain (Plain & Contrast)', 'MRI Lumbar Spine (L-Spine)', 'MRI Knee Joint (Right / Left)', 'MRI Abdomen', 'Cardiac MRI'],
    operatingHours: '07:00 AM - 10:00 PM',
    status: 'Available', // 'Available' | 'In Use' | 'Maintenance' | 'Inactive'
    maintenanceStatus: 'Operational',
    technologist: 'Arjun Rao (Senior MRI Tech)',
    cryoTemp: '18.2°C (Optimal)',
    uptime: '99.4%',
    nextCalibration: '2026-11-10'
  },
  {
    id: 'MCH-MRI-02',
    name: 'GE SIGNA Hero 3.0T High-Field MRI',
    modality: 'MRI',
    centerId: 'CTR-BLR-04',
    centerName: 'MediUnify Neuro-Imaging & Multi-Slice CT Hub - Indiranagar, Bengaluru',
    room: 'Suite MRI-B (Shielded)',
    availableServices: ['MRI Brain (Plain & Contrast)', 'MRI Lumbar Spine (L-Spine)', 'MRI Angiography'],
    operatingHours: '24 Hours',
    status: 'In Use',
    maintenanceStatus: 'Operational',
    technologist: 'Nikhil Menon',
    cryoTemp: '17.9°C',
    uptime: '98.9%',
    nextCalibration: '2026-10-28'
  },
  {
    id: 'MCH-CT-01',
    name: 'GE Revolution EVO 128-Slice High Speed CT',
    modality: 'CT Scan',
    centerId: 'CTR-MYS-01',
    centerName: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    room: 'Gantry CT-1',
    availableServices: ['CT Chest HRCT (High Resolution Computed Tomography)', 'CT Abdomen & Pelvis (CECT Tri-phasic)', 'CT Head / Brain Plain', 'CT Coronary Angiography'],
    operatingHours: '06:00 AM - 11:00 PM',
    status: 'In Use',
    maintenanceStatus: 'Operational',
    technologist: 'Kavitha Hegde',
    cryoTemp: '21.0°C',
    uptime: '99.8%',
    nextCalibration: '2026-11-05'
  },
  {
    id: 'MCH-CT-02',
    name: 'Siemens SOMATOM go.Top 128-Slice CT',
    modality: 'CT Scan',
    centerId: 'CTR-MYS-02',
    centerName: 'MediUnify Diagnostic Scan & Imaging Suite - Jayalakshmipuram',
    room: 'CT Bay 1',
    availableServices: ['CT Chest HRCT (High Resolution Computed Tomography)', 'CT Head / Brain Plain', 'CT Abdomen & Pelvis (CECT Tri-phasic)'],
    operatingHours: '07:00 AM - 09:00 PM',
    status: 'Available',
    maintenanceStatus: 'Operational',
    technologist: 'Praveen Patil',
    cryoTemp: '20.5°C',
    uptime: '99.1%',
    nextCalibration: '2026-12-01'
  },
  {
    id: 'MCH-XRAY-01',
    name: 'Philips DigitalDiagnost C90 High-Frequency DR',
    modality: 'X-Ray',
    centerId: 'CTR-MYS-01',
    centerName: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    room: 'DR Suite A',
    availableServices: ['Digital X-Ray Chest PA View', 'Digital X-Ray Spine (Cervical / Lumbar AP & Lateral)', 'X-Ray Knee / Joints', 'X-Ray Pelvis'],
    operatingHours: '07:00 AM - 10:00 PM',
    status: 'Available',
    maintenanceStatus: 'Operational',
    technologist: 'Mahesh Gowda',
    cryoTemp: 'Room Temp',
    uptime: '100%',
    nextCalibration: '2026-10-30'
  },
  {
    id: 'MCH-XRAY-02',
    name: 'Carestream DRX-Evolution Plus Dual-Detector',
    modality: 'X-Ray',
    centerId: 'CTR-MYS-03',
    centerName: 'MediUnify Community Imaging & Ultrasound Center - Kuvempunagar',
    room: 'Room X-1',
    availableServices: ['Digital X-Ray Chest PA View', 'Digital X-Ray Spine (Cervical / Lumbar AP & Lateral)'],
    operatingHours: '08:00 AM - 08:00 PM',
    status: 'Available',
    maintenanceStatus: 'Operational',
    technologist: 'Vinay Kumar',
    cryoTemp: 'Room Temp',
    uptime: '99.5%',
    nextCalibration: '2026-11-20'
  },
  {
    id: 'MCH-USG-01',
    name: 'Samsung WS80A Elite with 4D Crystal Live Sonography',
    modality: 'Ultrasound',
    centerId: 'CTR-MYS-01',
    centerName: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    room: 'USG Room 1',
    availableServices: ['Ultrasound Whole Abdomen & Pelvis', 'Ultrasound Obstetric Anomaly Scan (Targeted 2nd Trimester)', 'Carotid Color Doppler', 'Echocardiography'],
    operatingHours: '08:00 AM - 08:00 PM',
    status: 'In Use',
    maintenanceStatus: 'Operational',
    technologist: 'Dr. Anjali Swaminathan (Sonologist)',
    cryoTemp: '22.0°C',
    uptime: '99.2%',
    nextCalibration: '2026-11-15'
  },
  {
    id: 'MCH-USG-02',
    name: 'GE Voluson E10 HD Ultrasound Suite',
    modality: 'Ultrasound',
    centerId: 'CTR-MYS-02',
    centerName: 'MediUnify Diagnostic Scan & Imaging Suite - Jayalakshmipuram',
    room: 'USG Bay B',
    availableServices: ['Ultrasound Whole Abdomen & Pelvis', 'Ultrasound Thyroid & Neck', 'Venous Doppler'],
    operatingHours: '08:00 AM - 07:00 PM',
    status: 'Available',
    maintenanceStatus: 'Operational',
    technologist: 'Dr. Suma Rao',
    cryoTemp: '21.8°C',
    uptime: '99.6%',
    nextCalibration: '2026-12-10'
  },
  {
    id: 'MCH-MAMMO-01',
    name: 'Hologic Selenia Dimensions 3D Tomosynthesis Mammography',
    modality: 'Mammography',
    centerId: 'CTR-MYS-01',
    centerName: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    room: "Women's Imaging Suite",
    availableServices: ['3D Digital Mammography Bilateral (with Tomosynthesis)', 'Targeted Breast Ultrasound'],
    operatingHours: '09:00 AM - 06:00 PM',
    status: 'Available',
    maintenanceStatus: 'Operational',
    technologist: 'Geetha Kumari',
    cryoTemp: '21.5°C',
    uptime: '98.7%',
    nextCalibration: '2026-10-25'
  },
  {
    id: 'MCH-DEXA-01',
    name: 'Hologic Horizon Dual-Energy DEXA Bone Mineral Density',
    modality: 'DEXA',
    centerId: 'CTR-MYS-03',
    centerName: 'MediUnify Community Imaging & Ultrasound Center - Kuvempunagar',
    room: 'BMD Room 2',
    availableServices: ['DEXA Whole Body Bone Mineral Density (BMD)', 'DEXA Spine & Femur Bone Mineral Scan'],
    operatingHours: '09:00 AM - 05:00 PM',
    status: 'Maintenance',
    maintenanceStatus: 'Scheduled Detector Calibration (10:00 AM - 02:00 PM)',
    technologist: 'Service Engineer Team',
    cryoTemp: '22.0°C',
    uptime: '95.0%',
    nextCalibration: '2026-10-01 (In Progress)'
  }
];

// 3. IMAGING CATALOGUE MASTER
export const RADIOLOGY_CATALOGUE = [
  {
    id: 'SCAN-01',
    code: 'MRI-BRAIN-01',
    name: 'MRI Brain (Plain & Contrast)',
    category: 'MRI',
    bodyPart: 'Brain & Cranium',
    description: 'Multiplanar 3T high-resolution magnetic resonance imaging of brain parenchyma, ventricles and cerebral vasculature.',
    preparationInstructions: '4 hours fasting if contrast is indicated. Remove all metallic objects, hairpins, watches, and dentures. Inform technician of claustrophobia.',
    fastingRequired: true,
    contrastRequired: true,
    approximateDuration: '35 - 45 min',
    tat: '4 - 6 Hours',
    suggestedPrice: 7500,
    contrastAddon: 2500,
    isPopular: true,
    status: 'Active'
  },
  {
    id: 'SCAN-02',
    code: 'MRI-LSPINE-02',
    name: 'MRI Lumbar Spine (L-Spine)',
    category: 'MRI',
    bodyPart: 'Spine / Lumbar Vertebrae',
    description: 'High-resolution sagittal, axial and coronal T1/T2 imaging assessing disc herniation, canal stenosis, nerve root impingement, and cord compression.',
    preparationInstructions: 'No dietary fasting required. Wear loose metal-free cotton gown. Inform technologist of previous spinal instrumentation or pacemaker.',
    fastingRequired: false,
    contrastRequired: false,
    approximateDuration: '25 - 30 min',
    tat: '4 - 6 Hours',
    suggestedPrice: 6500,
    contrastAddon: 2000,
    isPopular: true,
    status: 'Active'
  },
  {
    id: 'SCAN-03',
    code: 'MRI-KNEE-03',
    name: 'MRI Knee Joint (Right / Left)',
    category: 'MRI',
    bodyPart: 'Knee Musculoskeletal',
    description: 'Dedicated joint coil evaluation of ACL, PCL, collateral ligaments, meniscus integrity, bone contusions, and cartilage defects.',
    preparationInstructions: 'No fasting needed. Arrive 15 minutes before slot.',
    fastingRequired: false,
    contrastRequired: false,
    approximateDuration: '25 min',
    tat: '4 - 6 Hours',
    suggestedPrice: 6000,
    contrastAddon: 0,
    status: 'Active'
  },
  {
    id: 'SCAN-04',
    code: 'CT-CHEST-04',
    name: 'CT Chest HRCT (High Resolution Computed Tomography)',
    category: 'CT Scan',
    bodyPart: 'Thorax / Pulmonary',
    description: 'Volumetric sub-millimeter thin slice reconstruction of pulmonary parenchyma for interstitial lung disease, pneumonia, bronchiectasis, and nodules.',
    preparationInstructions: 'Breath holding practice before scan. Remove jewelry and metallic clothing.',
    fastingRequired: false,
    contrastRequired: false,
    approximateDuration: '10 min',
    tat: '2 - 4 Hours',
    suggestedPrice: 4200,
    contrastAddon: 1800,
    isPopular: true,
    status: 'Active'
  },
  {
    id: 'SCAN-05',
    code: 'CT-ABDPEL-05',
    name: 'CT Abdomen & Pelvis (CECT Tri-phasic)',
    category: 'CT Scan',
    bodyPart: 'Abdomen & Pelvic Cavity',
    description: 'Multi-detector contrast-enhanced scan with arterial, portovenous, and delayed phases for hepatic, pancreatic, renal, and gastrointestinal pathology.',
    preparationInstructions: 'Strict 4 - 6 hours fasting. Oral contrast cocktail administered 45 minutes prior. Recent serum creatinine report mandatory for IV contrast.',
    fastingRequired: true,
    contrastRequired: true,
    approximateDuration: '20 min',
    tat: '4 - 6 Hours',
    suggestedPrice: 5800,
    contrastAddon: 2200,
    status: 'Active'
  },
  {
    id: 'SCAN-06',
    code: 'CT-HEAD-06',
    name: 'CT Head / Brain Plain',
    category: 'CT Scan',
    bodyPart: 'Head / Brain',
    description: 'Rapid non-contrast emergency CT screening for acute stroke, intracranial hemorrhage, cranial fractures, and trauma triage.',
    preparationInstructions: 'No prior fasting needed for emergency non-contrast scan.',
    fastingRequired: false,
    contrastRequired: false,
    approximateDuration: '5 - 10 min',
    tat: '1 - 2 Hours (Emergency Priority)',
    suggestedPrice: 2800,
    contrastAddon: 1500,
    status: 'Active'
  },
  {
    id: 'SCAN-07',
    code: 'XRAY-CHEST-07',
    name: 'Digital X-Ray Chest PA View',
    category: 'X-Ray',
    bodyPart: 'Chest / Lungs & Heart',
    description: 'High-frequency digital radiograph for cardiomegaly, lung consolidation, pleural effusion, and rib cage architecture.',
    preparationInstructions: 'Remove metallic necklaces, underwire bras, and chest clothing. Inhale deeply and hold breath on command.',
    fastingRequired: false,
    contrastRequired: false,
    approximateDuration: '5 min',
    tat: '30 - 60 Min',
    suggestedPrice: 600,
    contrastAddon: 0,
    isPopular: true,
    status: 'Active'
  },
  {
    id: 'SCAN-08',
    code: 'XRAY-SPINE-08',
    name: 'Digital X-Ray Spine (Cervical / Lumbar AP & Lateral)',
    category: 'X-Ray',
    bodyPart: 'Spine (Cervical / Lumbar)',
    description: 'Orthogonal standing views assessing vertebral alignment, disc heights, spondylolisthesis, and degenerative osteophytes.',
    preparationInstructions: 'No special preparation needed.',
    fastingRequired: false,
    contrastRequired: false,
    approximateDuration: '10 min',
    tat: '1 Hour',
    suggestedPrice: 900,
    contrastAddon: 0,
    status: 'Active'
  },
  {
    id: 'SCAN-09',
    code: 'USG-ABDOMEN-09',
    name: 'Ultrasound Whole Abdomen & Pelvis',
    category: 'Ultrasound',
    bodyPart: 'Abdomen & Pelvic Viscera',
    description: 'Real-time acoustic evaluation of hepatobiliary system, gallbladder, pancreas, spleen, kidneys, urinary bladder, and prostate/uterus.',
    preparationInstructions: 'Overnight fasting of 6 - 8 hours for gallbladder distension. Full urinary bladder required (drink 1 liter water 1 hour prior and do not void).',
    fastingRequired: true,
    contrastRequired: false,
    approximateDuration: '15 - 20 min',
    tat: '1 - 2 Hours',
    suggestedPrice: 1600,
    contrastAddon: 0,
    isPopular: true,
    status: 'Active'
  },
  {
    id: 'SCAN-10',
    code: 'USG-OBS-10',
    name: 'Ultrasound Obstetric Anomaly Scan (Targeted 2nd Trimester)',
    category: 'Ultrasound',
    bodyPart: 'Obstetric / Fetal Anatomy',
    description: 'Level-II detailed fetal structural survey, biometry, amniotic fluid index, placental localization, and Doppler velocimetry (18 - 22 weeks).',
    preparationInstructions: 'Comfortably full bladder. Bring all prior antenatal records and early dating ultrasound scans.',
    fastingRequired: false,
    contrastRequired: false,
    approximateDuration: '25 - 35 min',
    tat: '2 Hours',
    suggestedPrice: 2400,
    contrastAddon: 0,
    status: 'Active'
  },
  {
    id: 'SCAN-11',
    code: 'MAMMO-BILAT-11',
    name: '3D Digital Mammography Bilateral (with Tomosynthesis)',
    category: 'Mammography',
    bodyPart: 'Bilateral Breasts & Axilla',
    description: 'CC and MLO projection tomosynthesis with computer-aided detection (CAD) for early breast lesion screening and microcalcifications.',
    preparationInstructions: 'Do not apply talcum powder, perfumes, or deodorants under arms on scan day. Best performed in post-menstrual week.',
    fastingRequired: false,
    contrastRequired: false,
    approximateDuration: '20 min',
    tat: '4 - 6 Hours',
    suggestedPrice: 3200,
    contrastAddon: 0,
    isPopular: true,
    status: 'Active'
  },
  {
    id: 'SCAN-12',
    code: 'DEXA-BMD-12',
    name: 'DEXA Whole Body Bone Mineral Density (BMD)',
    category: 'Other',
    bodyPart: 'Spine, Dual Femur & Forearm',
    description: 'Dual-energy X-ray absorptiometry measuring bone mineral content and T-Score/Z-Scores for osteoporosis and fracture risk assessment.',
    preparationInstructions: 'Avoid calcium supplements 24 hours prior to scan. Wear clothing without metal zippers or metal buttons.',
    fastingRequired: false,
    contrastRequired: false,
    approximateDuration: '15 min',
    tat: '2 Hours',
    suggestedPrice: 1900,
    contrastAddon: 0,
    status: 'Active'
  }
];

// 4. RADIOLOGISTS
export const RADIOLOGY_RADIOLOGISTS = [
  {
    id: 'RAD-DOC-01',
    name: 'Dr. Vikramaditya Hegde, MD, FRCR',
    radiologistId: 'RAD-MYS-01',
    specialization: 'Neuro-Radiology & Stroke Imaging',
    center: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    experience: '18 Years',
    phone: '+91 98451 77234',
    email: 'dr.v.hegde@mediunify.com',
    availability: 'Available', // 'Available' | 'Busy' | 'Offline' | 'Inactive'
    status: 'Active',
    pendingReports: 2,
    completedReports: 1420,
    rating: '4.95/5.0'
  },
  {
    id: 'RAD-DOC-02',
    name: 'Dr. Radhika Sen, MD, DNB (Radiodiagnosis)',
    radiologistId: 'RAD-MYS-02',
    specialization: 'Musculoskeletal & Joint MRI',
    center: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    experience: '12 Years',
    phone: '+91 97311 44892',
    email: 'dr.radhika.sen@mediunify.com',
    availability: 'Available',
    status: 'Active',
    pendingReports: 1,
    completedReports: 980,
    rating: '4.9/5.0'
  },
  {
    id: 'RAD-DOC-03',
    name: 'Dr. Pradeep Narang, MD (Radiodiagnosis)',
    radiologistId: 'RAD-MYS-03',
    specialization: 'Chest & Body CT Imaging',
    center: 'MediUnify Diagnostic Scan & Imaging Suite - Jayalakshmipuram',
    experience: '15 Years',
    phone: '+91 96222 33189',
    email: 'dr.p.narang@mediunify.com',
    availability: 'Busy',
    status: 'Active',
    pendingReports: 4,
    completedReports: 1850,
    rating: '4.85/5.0'
  },
  {
    id: 'RAD-DOC-04',
    name: 'Dr. Anjali Swaminathan, DMRD, DNB',
    radiologistId: 'RAD-MYS-04',
    specialization: "Women's Imaging & Fetal Sonology",
    center: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    experience: '14 Years',
    phone: '+91 94480 88219',
    email: 'dr.anjali.s@mediunify.com',
    availability: 'Available',
    status: 'Active',
    pendingReports: 1,
    completedReports: 1210,
    rating: '4.92/5.0'
  },
  {
    id: 'RAD-DOC-05',
    name: 'Dr. Sandeep Kulkarni, MD, PDCC (Cardiac Imaging)',
    radiologistId: 'RAD-BLR-05',
    specialization: 'Cardiovascular & Thoracic Imaging',
    center: 'MediUnify Neuro-Imaging & Multi-Slice CT Hub - Indiranagar, Bengaluru',
    experience: '10 Years',
    phone: '+91 99003 55120',
    email: 'dr.sandeep.k@mediunify.com',
    availability: 'Offline',
    status: 'Active',
    pendingReports: 0,
    completedReports: 640,
    rating: '4.88/5.0'
  }
];

// 5. RADIOLOGY OPERATIONAL ORDERS (Initial State across full 21-status lifecycle)
export const INITIAL_RADIOLOGY_ORDERS = [
  {
    orderId: 'RAD-1001',
    patient: {
      name: 'Rahul Kumar',
      age: 42,
      gender: 'Male',
      phone: '+91 98450 11234',
      email: 'rahul.kumar@gmail.com',
      address: '#248, 9th Cross, Kuvempunagar, Mysuru - 570023',
      patientId: 'PT-8801'
    },
    scan: {
      id: 'SCAN-01',
      code: 'MRI-BRAIN-01',
      name: 'MRI Brain (Plain & Contrast)',
      category: 'MRI',
      bodyPart: 'Brain & Cranium',
      price: 7500,
      contrastAddon: 2500,
      duration: '45 min'
    },
    center: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    centerCode: 'RAD-CTR-MYS01',
    machine: 'Siemens MAGNETOM Vida 3T (BioMatrix Gantry A)',
    machineId: 'MCH-MRI-01',
    appointmentDate: '2026-10-01',
    appointmentTime: '09:30 AM - 10:15 AM',
    bookingSource: 'MediUnify Patient Mobile App',
    paymentStatus: 'Paid',
    totalAmount: 10000,
    orderStatus: 'NEW', // 'NEW' | 'VERIFIED' | 'PATIENT SCHEDULED' | 'PATIENT ARRIVED' | 'SCAN IN PROGRESS' | 'SCAN COMPLETED' | 'RADIOLOGIST ASSIGNED' | 'REPORT PENDING' | 'REPORT UPLOADED' | 'REPORT UNDER REVIEW' | 'REPORT VERIFIED' | 'REPORT DELIVERED' | 'COMPLETED' | 'RESCHEDULED' | 'CANCELLED'
    radiologist: null,
    reportId: 'RPT-RAD-4001',
    createdAt: '2026-10-01 07:10 AM',
    timeline: [
      {
        step: 'NEW',
        title: 'Imaging Booking Received',
        timestamp: '2026-10-01 07:10 AM',
        responsible: 'Patient App',
        note: 'Patient booked MRI Brain with Contrast. Awaiting admin verification of clinical history and fasting.',
        completed: true
      }
    ],
    clinicalNotes: 'Patient complains of recurrent intractable temporal headaches and episodes of visual blurring.'
  },
  {
    orderId: 'RAD-1002',
    patient: {
      name: 'Ananya Sharma',
      age: 28,
      gender: 'Female',
      phone: '+91 97312 88765',
      email: 'ananya.sharma@yahoo.com',
      address: '#14, 3rd Stage, Gokulam, Mysuru - 570002',
      patientId: 'PT-8802'
    },
    scan: {
      id: 'SCAN-03',
      code: 'MRI-KNEE-03',
      name: 'MRI Knee Joint (Right)',
      category: 'MRI',
      bodyPart: 'Knee Musculoskeletal',
      price: 6000,
      contrastAddon: 0,
      duration: '25 min'
    },
    center: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    centerCode: 'RAD-CTR-MYS01',
    machine: 'Siemens MAGNETOM Vida 3T (BioMatrix Gantry A)',
    machineId: 'MCH-MRI-01',
    appointmentDate: '2026-10-01',
    appointmentTime: '10:30 AM - 11:00 AM',
    bookingSource: 'Consultant Referral Portal',
    paymentStatus: 'Paid',
    totalAmount: 6000,
    orderStatus: 'VERIFIED',
    radiologist: 'Dr. Radhika Sen, MD, DNB',
    reportId: 'RPT-RAD-4002',
    createdAt: '2026-10-01 07:30 AM',
    timeline: [
      {
        step: 'NEW',
        title: 'Order Placed Online',
        timestamp: '2026-10-01 07:30 AM',
        responsible: 'Online Portal',
        note: 'Referral by Dr. Arvind (Orthopedics) for suspected ACL sprain.',
        completed: true
      },
      {
        step: 'VERIFIED',
        title: 'Booking & Machine Slot Verified',
        timestamp: '2026-10-01 08:00 AM',
        responsible: 'Radiology Desk Lead',
        note: 'Center, 3T Magnet suite, and technologist schedule confirmed.',
        completed: true
      }
    ],
    clinicalNotes: 'Right knee hyperextension injury during sports. Joint effusion present.'
  },
  {
    orderId: 'RAD-1003',
    patient: {
      name: 'Suresh Patil',
      age: 54,
      gender: 'Male',
      phone: '+91 94481 22980',
      email: 'suresh.patil@outlook.com',
      address: '#89, Siddhartha Layout, Mysuru - 570011',
      patientId: 'PT-8803'
    },
    scan: {
      id: 'SCAN-04',
      code: 'CT-CHEST-04',
      name: 'CT Chest HRCT (High Resolution Computed Tomography)',
      category: 'CT Scan',
      bodyPart: 'Thorax / Pulmonary',
      price: 4200,
      contrastAddon: 0,
      duration: '10 min'
    },
    center: 'MediUnify Diagnostic Scan & Imaging Suite - Jayalakshmipuram',
    centerCode: 'RAD-CTR-MYS02',
    machine: 'Siemens SOMATOM go.Top 128-Slice CT',
    machineId: 'MCH-CT-02',
    appointmentDate: '2026-10-01',
    appointmentTime: '11:00 AM - 11:15 AM',
    bookingSource: 'MediUnify Walk-in Desk',
    paymentStatus: 'Paid',
    totalAmount: 4200,
    orderStatus: 'PATIENT SCHEDULED',
    radiologist: 'Dr. Pradeep Narang, MD',
    reportId: 'RPT-RAD-4003',
    createdAt: '2026-10-01 07:45 AM',
    timeline: [
      {
        step: 'NEW',
        title: 'Order Created',
        timestamp: '2026-10-01 07:45 AM',
        responsible: 'Jayalakshmipuram Desk',
        note: 'HRCT Thorax requisition for chronic cough and dyspnea.',
        completed: true
      },
      {
        step: 'VERIFIED',
        title: 'Slot & Machine Approved',
        timestamp: '2026-10-01 08:15 AM',
        responsible: 'Radiology Supervisor',
        note: '128-slice CT Gantry calibration verified.',
        completed: true
      },
      {
        step: 'PATIENT SCHEDULED',
        title: 'Patient Scheduled & Prepped',
        timestamp: '2026-10-01 08:30 AM',
        responsible: 'SMS Dispatch Engine',
        note: 'Appointment token and breathing instructions sent via WhatsApp to +91 94481 22980.',
        completed: true
      }
    ],
    clinicalNotes: 'Persistent dry cough post-viral illness. Rule out interstitial lung changes.'
  },
  {
    orderId: 'RAD-1004',
    patient: {
      name: 'Meenakshi Sundaram',
      age: 36,
      gender: 'Female',
      phone: '+91 96111 44520',
      email: 'meenakshi.s@gmail.com',
      address: '#71, 4th Main, Saraswathipuram, Mysuru - 570009',
      patientId: 'PT-8804'
    },
    scan: {
      id: 'SCAN-10',
      code: 'USG-OBS-10',
      name: 'Ultrasound Obstetric Anomaly Scan (Targeted 2nd Trimester)',
      category: 'Ultrasound',
      bodyPart: 'Obstetric / Fetal Anatomy',
      price: 2400,
      contrastAddon: 0,
      duration: '30 min'
    },
    center: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    centerCode: 'RAD-CTR-MYS01',
    machine: 'Samsung WS80A Elite with 4D Crystal Live Sonography',
    machineId: 'MCH-USG-01',
    appointmentDate: '2026-10-01',
    appointmentTime: '10:00 AM - 10:35 AM',
    bookingSource: 'MediUnify Patient App',
    paymentStatus: 'Paid',
    totalAmount: 2400,
    orderStatus: 'PATIENT ARRIVED',
    arrivalTime: '2026-10-01 09:50 AM',
    radiologist: 'Dr. Anjali Swaminathan, DMRD, DNB',
    reportId: 'RPT-RAD-4004',
    createdAt: '2026-10-01 08:00 AM',
    timeline: [
      {
        step: 'NEW',
        title: 'Booking Placed',
        timestamp: '2026-10-01 08:00 AM',
        responsible: 'Patient App',
        note: 'Antenatal anomaly scan booking (20 weeks gestation).',
        completed: true
      },
      {
        step: 'PATIENT SCHEDULED',
        title: 'Sonology Suite Allocated',
        timestamp: '2026-10-01 08:20 AM',
        responsible: 'Desk Coordinator',
        note: 'Samsung 4D USG suite reserved.',
        completed: true
      },
      {
        step: 'PATIENT ARRIVED',
        title: 'Patient Checked In at Reception Desk',
        timestamp: '2026-10-01 09:50 AM',
        responsible: 'Reception Desk',
        note: 'Patient verified with token #RAD-04. Full bladder confirmed, moved to waiting lounge.',
        completed: true
      }
    ],
    clinicalNotes: 'Gestational age 20 weeks 4 days. Level-II fetal anatomical evaluation.'
  },
  {
    orderId: 'RAD-1005',
    patient: {
      name: 'Vikram Sethi',
      age: 49,
      gender: 'Male',
      phone: '+91 98801 77341',
      email: 'vikram.sethi@tcs.com',
      address: '#310, Vijayanagar 2nd Stage, Mysuru - 570017',
      patientId: 'PT-8805'
    },
    scan: {
      id: 'SCAN-02',
      code: 'MRI-LSPINE-02',
      name: 'MRI Lumbar Spine (L-Spine)',
      category: 'MRI',
      bodyPart: 'Spine / Lumbar Vertebrae',
      price: 6500,
      contrastAddon: 0,
      duration: '30 min'
    },
    center: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    centerCode: 'RAD-CTR-MYS01',
    machine: 'Siemens MAGNETOM Vida 3T (BioMatrix Gantry A)',
    machineId: 'MCH-MRI-01',
    appointmentDate: '2026-10-01',
    appointmentTime: '08:45 AM - 09:15 AM',
    bookingSource: 'Consultant Referral Portal',
    paymentStatus: 'Paid',
    totalAmount: 6500,
    orderStatus: 'SCAN IN PROGRESS',
    scanStartTime: '2026-10-01 08:50 AM',
    operator: 'Arjun Rao (Senior MRI Tech)',
    radiologist: 'Dr. Radhika Sen, MD, DNB',
    reportId: 'RPT-RAD-4005',
    createdAt: '2026-10-01 07:00 AM',
    timeline: [
      {
        step: 'NEW',
        title: 'Booking Created',
        timestamp: '2026-10-01 07:00 AM',
        responsible: 'Online Portal',
        note: 'Order placed for acute severe low backache with radiculopathy.',
        completed: true
      },
      {
        step: 'PATIENT ARRIVED',
        title: 'Patient Checked In',
        timestamp: '2026-10-01 08:35 AM',
        responsible: 'Reception Desk',
        note: 'Patient screened for metallic implants. Zero contraindications.',
        completed: true
      },
      {
        step: 'SCAN IN PROGRESS',
        title: 'Loaded in 3.0T MRI Gantry (Spine Coil Active)',
        timestamp: '2026-10-01 08:50 AM',
        responsible: 'Arjun Rao (Technologist)',
        note: 'T1/T2 Sagittal and Axial fast spin echo sequences acquiring.',
        completed: true
      }
    ],
    clinicalNotes: 'Severe L4-L5 disc protrusion suspicion with left S1 dermatomal sciatica.'
  },
  {
    orderId: 'RAD-1006',
    patient: {
      name: 'Dr. Girish Deshpande',
      age: 63,
      gender: 'Male',
      phone: '+91 99002 88412',
      email: 'girish.deshpande@gmail.com',
      address: '#19, Yadavagiri, Mysuru - 570020',
      patientId: 'PT-8806'
    },
    scan: {
      id: 'SCAN-05',
      code: 'CT-ABDPEL-05',
      name: 'CT Abdomen & Pelvis (CECT Tri-phasic)',
      category: 'CT Scan',
      bodyPart: 'Abdomen & Pelvic Cavity',
      price: 5800,
      contrastAddon: 2200,
      duration: '25 min'
    },
    center: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    centerCode: 'RAD-CTR-MYS01',
    machine: 'GE Revolution EVO 128-Slice High Speed CT',
    machineId: 'MCH-CT-01',
    appointmentDate: '2026-10-01',
    appointmentTime: '08:00 AM - 08:25 AM',
    bookingSource: 'MediUnify Hospital Desk',
    paymentStatus: 'Paid',
    totalAmount: 8000,
    orderStatus: 'SCAN COMPLETED',
    scanStartTime: '2026-10-01 08:05 AM',
    scanEndTime: '2026-10-01 08:28 AM',
    operator: 'Kavitha Hegde',
    radiologist: null,
    reportId: 'RPT-RAD-4006',
    createdAt: '2026-10-01 06:40 AM',
    timeline: [
      {
        step: 'NEW',
        title: 'Booking Initialized',
        timestamp: '2026-10-01 06:40 AM',
        responsible: 'Hospital Referral Desk',
        note: 'Tri-phasic CECT requested for recurrent right upper quadrant pain.',
        completed: true
      },
      {
        step: 'SCAN IN PROGRESS',
        title: 'Contrast Injection & Dual Phase CT Run',
        timestamp: '2026-10-01 08:05 AM',
        responsible: 'Kavitha Hegde',
        note: '75ml Omnipaque contrast administered via automated power injector. Zero adverse reaction.',
        completed: true
      },
      {
        step: 'SCAN COMPLETED',
        title: 'Raw DICOM Images Transmitted to PACS',
        timestamp: '2026-10-01 08:28 AM',
        responsible: 'PACS Gateway',
        note: '1,420 high-resolution axial slices routed to reporting queue. Ready for Radiologist assignment.',
        completed: true
      }
    ],
    clinicalNotes: 'Evaluation of hepatic focal lesion vs hemangioma. Serum Creatinine: 0.9 mg/dL (Normal).'
  },
  {
    orderId: 'RAD-1007',
    patient: {
      name: 'Kavita Nair',
      age: 31,
      gender: 'Female',
      phone: '+91 97410 99543',
      email: 'kavita.nair@hotmail.com',
      address: '#56, 1st Cross, Hebbal 1st Stage, Mysuru - 570016',
      patientId: 'PT-8807'
    },
    scan: {
      id: 'SCAN-11',
      code: 'MAMMO-BILAT-11',
      name: '3D Digital Mammography Bilateral (with Tomosynthesis)',
      category: 'Mammography',
      bodyPart: 'Bilateral Breasts & Axilla',
      price: 3200,
      contrastAddon: 0,
      duration: '20 min'
    },
    center: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    centerCode: 'RAD-CTR-MYS01',
    machine: 'Hologic Selenia Dimensions 3D Tomosynthesis Mammography',
    machineId: 'MCH-MAMMO-01',
    appointmentDate: '2026-10-01',
    appointmentTime: '07:30 AM - 07:50 AM',
    bookingSource: 'MediUnify Wellness Portal',
    paymentStatus: 'Paid',
    totalAmount: 3200,
    orderStatus: 'RADIOLOGIST ASSIGNED',
    radiologist: 'Dr. Anjali Swaminathan, DMRD, DNB',
    reportId: 'RPT-RAD-4007',
    createdAt: '2026-10-01 06:15 AM',
    timeline: [
      {
        step: 'SCAN COMPLETED',
        title: '3D Tomosynthesis Projections Acquired',
        timestamp: '2026-10-01 07:50 AM',
        responsible: 'Geetha Kumari (Mammographer)',
        note: 'Bilateral CC and MLO views with tomosynthesis reconstruction generated.',
        completed: true
      },
      {
        step: 'RADIOLOGIST ASSIGNED',
        title: 'Assigned to Dr. Anjali Swaminathan',
        timestamp: '2026-10-01 08:10 AM',
        responsible: 'Admin Reporting Dispatch',
        note: "Allocated to Women's Imaging Specialist workload. Report drafting pending.",
        completed: true
      }
    ],
    clinicalNotes: 'Routine baseline screening mammography. No palpable lumps. Family history of fibroadenoma.'
  },
  {
    orderId: 'RAD-1008',
    patient: {
      name: 'Rajeshwari Bai',
      age: 58,
      gender: 'Female',
      phone: '+91 98440 66129',
      email: 'rajeshwari.bai@gmail.com',
      address: '#112, Chamundipuram, Mysuru - 570004',
      patientId: 'PT-8808'
    },
    scan: {
      id: 'SCAN-07',
      code: 'XRAY-CHEST-07',
      name: 'Digital X-Ray Chest PA View',
      category: 'X-Ray',
      bodyPart: 'Chest / Lungs & Heart',
      price: 600,
      contrastAddon: 0,
      duration: '5 min'
    },
    center: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    centerCode: 'RAD-CTR-MYS01',
    machine: 'Philips DigitalDiagnost C90 High-Frequency DR',
    machineId: 'MCH-XRAY-01',
    appointmentDate: '2026-10-01',
    appointmentTime: '07:00 AM - 07:15 AM',
    bookingSource: 'MediUnify Walk-in Desk',
    paymentStatus: 'Paid',
    totalAmount: 600,
    orderStatus: 'REPORT UNDER REVIEW',
    radiologist: 'Dr. Pradeep Narang, MD',
    reportId: 'RPT-RAD-4008',
    createdAt: '2026-10-01 06:00 AM',
    timeline: [
      {
        step: 'SCAN COMPLETED',
        title: 'DR Chest Exposure Completed',
        timestamp: '2026-10-01 07:12 AM',
        responsible: 'Mahesh Gowda',
        note: 'Crisp PA view acquired with full inspiratory effort.',
        completed: true
      },
      {
        step: 'REPORT UPLOADED',
        title: 'Draft Findings Compiled by Fellow',
        timestamp: '2026-10-01 07:40 AM',
        responsible: 'Dr. Pradeep Narang, MD',
        note: 'Bilateral lung fields clear. Cardiothoracic ratio within normal limits. Awaiting admin clinical sign-off.',
        completed: true
      },
      {
        step: 'REPORT UNDER REVIEW',
        title: 'Admin / Senior Pathologist Verification',
        timestamp: '2026-10-01 08:15 AM',
        responsible: 'Chief Radiologist Desk',
        note: 'Report draft under quality review before patient delivery.',
        completed: true
      }
    ],
    clinicalNotes: 'Pre-operative fitness clearance for elective cataract surgery.'
  },
  {
    orderId: 'RAD-1009',
    patient: {
      name: 'Mohammed Farooq',
      age: 45,
      gender: 'Male',
      phone: '+91 99801 33290',
      email: 'm.farooq@yahoo.in',
      address: '#22/A, Bannimantap B-Layout, Mysuru - 570015',
      patientId: 'PT-8809'
    },
    scan: {
      id: 'SCAN-06',
      code: 'CT-HEAD-06',
      name: 'CT Head / Brain Plain',
      category: 'CT Scan',
      bodyPart: 'Head / Brain',
      price: 2800,
      contrastAddon: 0,
      duration: '10 min'
    },
    center: 'MediUnify Neuro-Imaging & Multi-Slice CT Hub - Indiranagar, Bengaluru',
    centerCode: 'RAD-CTR-BLR01',
    machine: 'GE Revolution EVO 128-Slice High Speed CT',
    machineId: 'MCH-CT-01',
    appointmentDate: '2026-10-01',
    appointmentTime: '06:30 AM - 06:45 AM',
    bookingSource: 'Emergency Room Referral',
    paymentStatus: 'Paid',
    totalAmount: 2800,
    orderStatus: 'REPORT VERIFIED',
    radiologist: 'Dr. Vikramaditya Hegde, MD, FRCR',
    reportId: 'RPT-RAD-4009',
    createdAt: '2026-10-01 05:45 AM',
    timeline: [
      {
        step: 'SCAN COMPLETED',
        title: 'Emergency Head CT Performed',
        timestamp: '2026-10-01 06:42 AM',
        responsible: 'Emergency Tech',
        note: 'Axial 5mm non-contrast slices reconstructed.',
        completed: true
      },
      {
        step: 'REPORT VERIFIED',
        title: 'Signed by Dr. Vikramaditya Hegde',
        timestamp: '2026-10-01 07:15 AM',
        responsible: 'Dr. Vikramaditya Hegde, MD, FRCR',
        note: 'No acute intracranial hemorrhage or midline shift. Digital cryptographic signature attached.',
        completed: true
      }
    ],
    clinicalNotes: 'Fall from two-wheeler with transient dizziness. GCS 15/15.'
  },
  {
    orderId: 'RAD-1010',
    patient: {
      name: 'Smt. Prema Kumari',
      age: 67,
      gender: 'Female',
      phone: '+91 98455 12098',
      email: 'prema.kumari@gmail.com',
      address: '#180, Kuvempunagar M-Block, Mysuru - 570023',
      patientId: 'PT-8810'
    },
    scan: {
      id: 'SCAN-12',
      code: 'DEXA-BMD-12',
      name: 'DEXA Whole Body Bone Mineral Density (BMD)',
      category: 'Other',
      bodyPart: 'Spine, Dual Femur & Forearm',
      price: 1900,
      contrastAddon: 0,
      duration: '15 min'
    },
    center: 'MediUnify Community Imaging & Ultrasound Center - Kuvempunagar',
    centerCode: 'RAD-CTR-MYS03',
    machine: 'Hologic Horizon Dual-Energy DEXA Bone Mineral Density',
    machineId: 'MCH-DEXA-01',
    appointmentDate: '2026-09-30',
    appointmentTime: '04:00 PM - 04:15 PM',
    bookingSource: 'MediUnify Patient App',
    paymentStatus: 'Paid',
    totalAmount: 1900,
    orderStatus: 'COMPLETED',
    radiologist: 'Dr. Radhika Sen, MD, DNB',
    reportId: 'RPT-RAD-4010',
    createdAt: '2026-09-30 02:00 PM',
    timeline: [
      {
        step: 'REPORT VERIFIED',
        title: 'Signed & Certified',
        timestamp: '2026-09-30 05:40 PM',
        responsible: 'Dr. Radhika Sen, MD, DNB',
        note: 'Lumbar spine T-Score -2.6 (Osteoporosis). Bisphosphonate therapy correlation noted.',
        completed: true
      },
      {
        step: 'COMPLETED',
        title: 'Report Delivered via WhatsApp & Patient App',
        timestamp: '2026-09-30 06:30 PM',
        responsible: 'Auto Dispatch Engine',
        note: 'PDF report delivered to patient mobile and uploaded to MediUnify Health Records Vault.',
        completed: true
      }
    ],
    clinicalNotes: 'Postmenopausal osteoporosis screening. History of Colles wrist fracture 2 years ago.'
  },
  {
    orderId: 'RAD-1011',
    patient: {
      name: 'Harish Gowda',
      age: 39,
      gender: 'Male',
      phone: '+91 97319 88102',
      email: 'harish.gowda@gmail.com',
      address: '#45, Dattagalli 3rd Stage, Mysuru - 570022',
      patientId: 'PT-8811'
    },
    scan: {
      id: 'SCAN-02',
      code: 'MRI-LSPINE-02',
      name: 'MRI Lumbar Spine (L-Spine)',
      category: 'MRI',
      bodyPart: 'Spine / Lumbar Vertebrae',
      price: 6500,
      contrastAddon: 0,
      duration: '30 min'
    },
    center: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    centerCode: 'RAD-CTR-MYS01',
    machine: 'Siemens MAGNETOM Vida 3T (BioMatrix Gantry A)',
    machineId: 'MCH-MRI-01',
    appointmentDate: '2026-10-02',
    appointmentTime: '09:00 AM - 09:30 AM',
    bookingSource: 'MediUnify Patient App',
    paymentStatus: 'Paid',
    totalAmount: 6500,
    orderStatus: 'RESCHEDULED',
    radiologist: 'Dr. Radhika Sen, MD, DNB',
    reportId: 'RPT-RAD-4011',
    createdAt: '2026-09-30 05:00 PM',
    timeline: [
      {
        step: 'NEW',
        title: 'Original Booking Placed',
        timestamp: '2026-09-30 05:00 PM',
        responsible: 'Patient App',
        note: 'Originally scheduled for 2026-10-01 11:30 AM.',
        completed: true
      },
      {
        step: 'RESCHEDULED',
        title: 'Appointment Rescheduled to Oct 02, 09:00 AM',
        timestamp: '2026-10-01 07:30 AM',
        responsible: 'Radiology Desk Lead',
        note: 'Slot adjusted to accommodate emergency acute stroke MRI. Patient notified and accepted new slot.',
        completed: true
      }
    ],
    clinicalNotes: 'Chronic L5-S1 discogenic back pain.'
  },
  {
    orderId: 'RAD-1012',
    patient: {
      name: 'Anita Balasubramanian',
      age: 50,
      gender: 'Female',
      phone: '+91 96112 33491',
      email: 'anita.bala@gmail.com',
      address: '#90, Nazarbad, Mysuru - 570010',
      patientId: 'PT-8812'
    },
    scan: {
      id: 'SCAN-05',
      code: 'CT-ABDPEL-05',
      name: 'CT Abdomen & Pelvis (CECT Tri-phasic)',
      category: 'CT Scan',
      bodyPart: 'Abdomen & Pelvic Cavity',
      price: 5800,
      contrastAddon: 2200,
      duration: '25 min'
    },
    center: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    centerCode: 'RAD-CTR-MYS01',
    machine: 'GE Revolution EVO 128-Slice High Speed CT',
    machineId: 'MCH-CT-01',
    appointmentDate: '2026-10-01',
    appointmentTime: '02:00 PM - 02:25 PM',
    bookingSource: 'MediUnify Patient App',
    paymentStatus: 'Refunded',
    totalAmount: 8000,
    orderStatus: 'CANCELLED',
    radiologist: null,
    reportId: 'RPT-RAD-4012',
    createdAt: '2026-09-30 07:00 PM',
    timeline: [
      {
        step: 'CANCELLED',
        title: 'Order Cancelled & Refund Initiated',
        timestamp: '2026-10-01 08:00 AM',
        responsible: 'Patient / Support Helpdesk',
        note: 'Patient reported acute fever and requested cancellation. Full refund of ₹8,000 processed to source bank account.',
        completed: true
      }
    ],
    clinicalNotes: 'Order cancelled upon patient request.'
  }
];

// 6. DETAILED REPORTS MASTER
export const INITIAL_RADIOLOGY_REPORTS = [
  {
    reportId: 'RPT-RAD-4009',
    orderId: 'RAD-1009',
    patientName: 'Mohammed Farooq',
    patientAge: 45,
    gender: 'Male',
    patientId: 'PT-8809',
    scanName: 'CT Head / Brain Plain',
    scanCode: 'CT-HEAD-06',
    modality: 'Computed Tomography (CT)',
    centerName: 'MediUnify Neuro-Imaging & Multi-Slice CT Hub - Indiranagar, Bengaluru',
    machineName: 'GE Revolution EVO 128-Slice High Speed CT',
    referringPhysician: 'Dr. K. Srinivas, MS, MCh (Neuro-trauma)',
    clinicalHistory: 'Evaluation of head injury following two-wheeler skid. GCS 15/15. Transient headache and scalp abrasion.',
    protocol: 'Volumetric contiguous axial non-contrast 5mm and reconstructed 1.25mm bone & soft tissue algorithm scans acquired from skull base to vertex on 128-slice MDCT platform.',
    reportStatus: 'VERIFIED',
    uploadedDate: '2026-10-01 07:15 AM',
    verifiedBy: 'Dr. Vikramaditya Hegde, MD, FRCR',
    deliveryStatus: 'Delivered to Patient App & PACS',
    findings: [
      {
        section: 'Brain Parenchyma',
        text: 'The cerebral and cerebellar hemispheres reveal normal attenuation and grey-white matter differentiation. No focal hyperdense intra-axial or extra-axial hemorrhage, contusion or hematoma detected.'
      },
      {
        section: 'Ventricular System & Cisterns',
        text: 'The lateral, third and fourth ventricles are normal in size, symmetry and configuration. Basal cisterns, sylvian fissures and cortical sulci appear prominent for age.'
      },
      {
        section: 'Midline Structures',
        text: 'Midline structures are strictly central. No midline shift, falcine or uncal herniation noted.'
      },
      {
        section: 'Bony Calvarium & Skull Base',
        text: 'Bone window settings reveal intact cranial vault and skull base. No evidence of linear, depressed or basilar skull fracture. Paranasal sinuses and mastoid air cells are well-aerated.'
      }
    ],
    impression: '1. Normal Non-Contrast CT Brain Study.\n2. No evidence of acute intracranial hemorrhage, cerebral contusion, or skull fracture.\n3. Clinical correlation and observation advised.',
    keyImages: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&auto=format&fit=crop&q=80'
    ]
  },
  {
    reportId: 'RPT-RAD-4010',
    orderId: 'RAD-1010',
    patientName: 'Smt. Prema Kumari',
    patientAge: 67,
    gender: 'Female',
    patientId: 'PT-8810',
    scanName: 'DEXA Whole Body Bone Mineral Density (BMD)',
    scanCode: 'DEXA-BMD-12',
    modality: 'DEXA Bone Densitometry',
    centerName: 'MediUnify Community Imaging & Ultrasound Center - Kuvempunagar',
    machineName: 'Hologic Horizon Dual-Energy DEXA Bone Mineral Density',
    referringPhysician: 'Dr. Arvind Swamy, MS (Ortho)',
    clinicalHistory: 'Postmenopausal osteoporosis assessment. High risk for fragility fractures.',
    protocol: 'Dual Energy X-ray Absorptiometry scan of Lumbar Spine (L1-L4), Left Femoral Neck, and Total Hip using Hologic Horizon system.',
    reportStatus: 'DELIVERED',
    uploadedDate: '2026-09-30 05:40 PM',
    verifiedBy: 'Dr. Radhika Sen, MD, DNB',
    deliveryStatus: 'Delivered via WhatsApp & Health Vault',
    findings: [
      {
        section: 'Lumbar Spine (L1 - L4)',
        text: 'Total Bone Mineral Density (BMD) = 0.748 g/cm². T-Score = -2.6 SD (WHO Classification: Osteoporosis). Z-Score = -1.1 SD.'
      },
      {
        section: 'Left Femoral Neck',
        text: 'BMD = 0.612 g/cm². T-Score = -2.4 SD (WHO Classification: Low Bone Mass / Osteopenia). Z-Score = -0.9 SD.'
      },
      {
        section: 'Left Total Hip',
        text: 'BMD = 0.710 g/cm². T-Score = -2.2 SD. Z-Score = -0.8 SD.'
      }
    ],
    impression: '1. DEXA findings consistent with Osteoporosis at the Lumbar Spine (T-Score -2.6) and Osteopenia at the Left Hip.\n2. High FRAX 10-year probability of major osteoporotic fracture.\n3. Clinical correlation, anti-resorptive therapy (e.g. bisphosphonates / teriparatide), and calcium/vitamin D3 supplementation recommended under orthopedic supervision.',
    keyImages: [
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&auto=format&fit=crop&q=80'
    ]
  },
  {
    reportId: 'RPT-RAD-4008',
    orderId: 'RAD-1008',
    patientName: 'Rajeshwari Bai',
    patientAge: 58,
    gender: 'Female',
    patientId: 'PT-8808',
    scanName: 'Digital X-Ray Chest PA View',
    scanCode: 'XRAY-CHEST-07',
    modality: 'Digital Radiography (DR)',
    centerName: 'MediUnify Advanced Imaging & Reference Hub - Saraswathipuram',
    machineName: 'Philips DigitalDiagnost C90 High-Frequency DR',
    referringPhysician: 'Dr. Chandrashekar, MD (Internal Medicine)',
    clinicalHistory: 'Pre-operative fitness clearance for elective surgery.',
    protocol: 'Erect Postero-Anterior (PA) digital chest radiograph exposed in full inspiration.',
    reportStatus: 'UNDER REVIEW',
    uploadedDate: '2026-10-01 07:40 AM',
    verifiedBy: 'Dr. Pradeep Narang, MD',
    deliveryStatus: 'Pending Consultant Sign-off',
    findings: [
      {
        section: 'Lungs & Pleura',
        text: 'Both lung fields are clear with normal bronchovascular markings. No focal airspace consolidation, cavitary lesion, nodule or mass seen. Costophrenic and cardiophrenic angles are sharp and clear.'
      },
      {
        section: 'Cardiovascular & Mediastinum',
        text: 'Cardiac silhouette is within normal limits in size and contour (Cardiothoracic ratio < 50%). Mediastinum and hila are normal. Trachea is central.'
      },
      {
        section: 'Thoracic Cage & Diaphragm',
        text: 'Both domes of diaphragm are smooth and normal in position. Ribs, clavicles, and visualized soft tissues reveal no gross abnormality.'
      }
    ],
    impression: '1. Normal Digital Chest Radiograph.\n2. No active cardiopulmonary pathology detected.',
    keyImages: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&auto=format&fit=crop&q=80'
    ]
  }
];

// 7. MACHINE TIME SLOTS (Pre-generated sample grid for live booking & slot management)
export const INITIAL_RADIOLOGY_SLOTS = [
  // Siemens MAGNETOM Vida 3T (CTR-MYS-01) - Today
  { id: 'SLOT-01', centerId: 'CTR-MYS-01', machineId: 'MCH-MRI-01', machineName: 'Siemens MAGNETOM Vida 3T', scanType: 'MRI', date: '2026-10-01', startTime: '07:00 AM', endTime: '07:45 AM', duration: '45 min', status: 'Completed', orderId: 'RAD-1000' },
  { id: 'SLOT-02', centerId: 'CTR-MYS-01', machineId: 'MCH-MRI-01', machineName: 'Siemens MAGNETOM Vida 3T', scanType: 'MRI', date: '2026-10-01', startTime: '08:00 AM', endTime: '08:45 AM', duration: '45 min', status: 'Completed', orderId: 'RAD-1005-PREV' },
  { id: 'SLOT-03', centerId: 'CTR-MYS-01', machineId: 'MCH-MRI-01', machineName: 'Siemens MAGNETOM Vida 3T', scanType: 'MRI', date: '2026-10-01', startTime: '08:45 AM', endTime: '09:15 AM', duration: '30 min', status: 'Booked', orderId: 'RAD-1005', patientName: 'Vikram Sethi' },
  { id: 'SLOT-04', centerId: 'CTR-MYS-01', machineId: 'MCH-MRI-01', machineName: 'Siemens MAGNETOM Vida 3T', scanType: 'MRI', date: '2026-10-01', startTime: '09:30 AM', endTime: '10:15 AM', duration: '45 min', status: 'Booked', orderId: 'RAD-1001', patientName: 'Rahul Kumar' },
  { id: 'SLOT-05', centerId: 'CTR-MYS-01', machineId: 'MCH-MRI-01', machineName: 'Siemens MAGNETOM Vida 3T', scanType: 'MRI', date: '2026-10-01', startTime: '10:30 AM', endTime: '11:00 AM', duration: '30 min', status: 'Booked', orderId: 'RAD-1002', patientName: 'Ananya Sharma' },
  { id: 'SLOT-06', centerId: 'CTR-MYS-01', machineId: 'MCH-MRI-01', machineName: 'Siemens MAGNETOM Vida 3T', scanType: 'MRI', date: '2026-10-01', startTime: '11:15 AM', endTime: '12:00 PM', duration: '45 min', status: 'Available', orderId: null },
  { id: 'SLOT-07', centerId: 'CTR-MYS-01', machineId: 'MCH-MRI-01', machineName: 'Siemens MAGNETOM Vida 3T', scanType: 'MRI', date: '2026-10-01', startTime: '12:15 PM', endTime: '01:00 PM', duration: '45 min', status: 'Available', orderId: null },
  { id: 'SLOT-08', centerId: 'CTR-MYS-01', machineId: 'MCH-MRI-01', machineName: 'Siemens MAGNETOM Vida 3T', scanType: 'MRI', date: '2026-10-01', startTime: '02:00 PM', endTime: '02:45 PM', duration: '45 min', status: 'Blocked', orderId: null, blockReason: 'Weekly Cryogen Level Check & Quality Control' },
  { id: 'SLOT-09', centerId: 'CTR-MYS-01', machineId: 'MCH-MRI-01', machineName: 'Siemens MAGNETOM Vida 3T', scanType: 'MRI', date: '2026-10-01', startTime: '03:00 PM', endTime: '03:45 PM', duration: '45 min', status: 'Available', orderId: null },
  { id: 'SLOT-10', centerId: 'CTR-MYS-01', machineId: 'MCH-MRI-01', machineName: 'Siemens MAGNETOM Vida 3T', scanType: 'MRI', date: '2026-10-01', startTime: '04:00 PM', endTime: '04:45 PM', duration: '45 min', status: 'Available', orderId: null },

  // GE Revolution EVO CT (CTR-MYS-01) - Today
  { id: 'SLOT-11', centerId: 'CTR-MYS-01', machineId: 'MCH-CT-01', machineName: 'GE Revolution EVO 128 CT', scanType: 'CT Scan', date: '2026-10-01', startTime: '08:00 AM', endTime: '08:25 AM', duration: '25 min', status: 'Completed', orderId: 'RAD-1006', patientName: 'Dr. Girish Deshpande' },
  { id: 'SLOT-12', centerId: 'CTR-MYS-01', machineId: 'MCH-CT-01', machineName: 'GE Revolution EVO 128 CT', scanType: 'CT Scan', date: '2026-10-01', startTime: '08:45 AM', endTime: '09:00 AM', duration: '15 min', status: 'Completed', orderId: 'RAD-1006-B' },
  { id: 'SLOT-13', centerId: 'CTR-MYS-01', machineId: 'MCH-CT-01', machineName: 'GE Revolution EVO 128 CT', scanType: 'CT Scan', date: '2026-10-01', startTime: '09:15 AM', endTime: '09:35 AM', duration: '20 min', status: 'Booked', orderId: 'RAD-1013', patientName: 'Pooja Hegde' },
  { id: 'SLOT-14', centerId: 'CTR-MYS-01', machineId: 'MCH-CT-01', machineName: 'GE Revolution EVO 128 CT', scanType: 'CT Scan', date: '2026-10-01', startTime: '09:45 AM', endTime: '10:00 AM', duration: '15 min', status: 'Available', orderId: null },
  { id: 'SLOT-15', centerId: 'CTR-MYS-01', machineId: 'MCH-CT-01', machineName: 'GE Revolution EVO 128 CT', scanType: 'CT Scan', date: '2026-10-01', startTime: '10:15 AM', endTime: '10:35 AM', duration: '20 min', status: 'Available', orderId: null },
  { id: 'SLOT-16', centerId: 'CTR-MYS-01', machineId: 'MCH-CT-01', machineName: 'GE Revolution EVO 128 CT', scanType: 'CT Scan', date: '2026-10-01', startTime: '11:00 AM', endTime: '11:20 AM', duration: '20 min', status: 'Available', orderId: null },

  // Hologic DEXA (CTR-MYS-03) - Maintenance Demonstration
  { id: 'SLOT-17', centerId: 'CTR-MYS-03', machineId: 'MCH-DEXA-01', machineName: 'Hologic Horizon DEXA', scanType: 'DEXA', date: '2026-10-01', startTime: '09:00 AM', endTime: '09:30 AM', duration: '30 min', status: 'Completed', orderId: null },
  { id: 'SLOT-18', centerId: 'CTR-MYS-03', machineId: 'MCH-DEXA-01', machineName: 'Hologic Horizon DEXA', scanType: 'DEXA', date: '2026-10-01', startTime: '10:00 AM', endTime: '12:00 PM', duration: '120 min', status: 'Maintenance', orderId: null, blockReason: 'Scheduled AERB Radiation & Detector Sensor Calibration' },
  { id: 'SLOT-19', centerId: 'CTR-MYS-03', machineId: 'MCH-DEXA-01', machineName: 'Hologic Horizon DEXA', scanType: 'DEXA', date: '2026-10-01', startTime: '12:00 PM', endTime: '02:00 PM', duration: '120 min', status: 'Maintenance', orderId: null, blockReason: 'Scheduled AERB Radiation & Detector Sensor Calibration' },
  { id: 'SLOT-20', centerId: 'CTR-MYS-03', machineId: 'MCH-DEXA-01', machineName: 'Hologic Horizon DEXA', scanType: 'DEXA', date: '2026-10-01', startTime: '02:30 PM', endTime: '03:00 PM', duration: '30 min', status: 'Available', orderId: null }
];

// Compatibility Exports
export const RADIOLOGY_MODALITIES = RADIOLOGY_CATALOGUE;
export const RADIOLOGY_BOOKINGS = INITIAL_RADIOLOGY_ORDERS;
export const RADIOLOGY_REPORTS = INITIAL_RADIOLOGY_REPORTS;

