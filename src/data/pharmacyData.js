// MediUnify Central Pharmacy Admin Master Dataset
// Production-ready mock data for Central Pharmacy Inventory & Workflow Monitoring

export const PHARMACY_CATEGORIES = [
  'Analgesics & Antipyretics',
  'Antibiotics & Anti-Infectives',
  'Cardiovascular & Antihypertensive',
  'Diabetic Care & Insulin',
  'Gastrointestinal & Antacids',
  'Respiratory & Anti-Allergy',
  'Vitamins & Supplements',
  'Dermatology & Topicals',
  'Neurological & Psychiatric',
  'Ophthalmic & ENT'
];

export const DOSAGE_FORMS = [
  'Tablet',
  'Capsule',
  'Syrup / Suspension',
  'Injectable',
  'Ointment / Gel',
  'Inhaler / Respule',
  'Eye / Ear Drops',
  'Powder / Sachet'
];

export const PHARMACY_SUPPLIERS = [
  {
    id: 'SUP001',
    name: 'ABC Pharma Distributors',
    contactPerson: 'Ramesh Chandra',
    phone: '+91 98450 12345',
    email: 'orders@abcpharma.in',
    address: '#12, Industrial Area, Peenya, Bangalore - 560058',
    medicinesSupplied: ['Paracetamol 500mg', 'Amoxicillin 500mg', 'Pan-D Capsule', 'Azithromycin 500mg'],
    status: 'Active'
  },
  {
    id: 'SUP002',
    name: 'MedLife Healthcare Logistics',
    contactPerson: 'Suresh Rao',
    phone: '+91 98450 23456',
    email: 'supplies@medlifehealth.com',
    address: '#45, Ring Road, Hebbal Industrial Area, Mysore - 570016',
    medicinesSupplied: ['Dolo 650mg', 'Telma 40mg', 'Metformin 500mg', 'Shelcal 500mg'],
    status: 'Active'
  },
  {
    id: 'SUP003',
    name: 'Apex Surgicals & Pharmaceuticals',
    contactPerson: 'Anand Mehta',
    phone: '+91 98450 34567',
    email: 'dispatch@apexsurgipharma.in',
    address: '#108, Bommasandra Industrial Estate, Bangalore - 560099',
    medicinesSupplied: ['Lantus Solostar 100IU', 'Montair-LC Tablet', 'Cetirizine 10mg', 'Augmentin 625 Duo'],
    status: 'Active'
  },
  {
    id: 'SUP004',
    name: 'Mysore Pharma Agencies',
    contactPerson: 'Vikas Gowda',
    phone: '+91 98450 45678',
    email: 'info@mysorepharma.org',
    address: '#89, Sayyaji Rao Road, Mandi Mohalla, Mysore - 570001',
    medicinesSupplied: ['Pantoprazole 40mg', 'Vitamin D3 60K', 'ORS Sachet', 'Glycomet-GP 2 Forte'],
    status: 'Active'
  },
  {
    id: 'SUP005',
    name: 'Karnataka Drug House',
    contactPerson: 'Raghavendra Swamy',
    phone: '+91 98450 56789',
    email: 'sales@karnatakadrugs.in',
    address: '#33, Market Circle, Mandya - 571401',
    medicinesSupplied: ['Amoxicillin 500mg', 'Paracetamol 500mg'],
    status: 'Inactive'
  }
];

export const MEDICINE_PHOTO_PRESETS = [
  {
    id: 'preset-tablets',
    label: 'Tablets Blister Strip',
    dosageForm: 'Tablet',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'preset-capsules',
    label: 'Capsules Bottle / Strip',
    dosageForm: 'Capsule',
    url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'preset-syrup',
    label: 'Liquid Syrup / Bottle',
    dosageForm: 'Syrup / Suspension',
    url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'preset-injectable',
    label: 'Injection Vial / Pen',
    dosageForm: 'Injectable',
    url: 'https://images.unsplash.com/photo-1579165466791-788226ab77b6?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'preset-ointment',
    label: 'Ointment / Gel Tube',
    dosageForm: 'Ointment / Gel',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'preset-sachet',
    label: 'Powder / Sachet / Drops',
    dosageForm: 'Powder / Sachet',
    url: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=400&q=80'
  }
];

export const INITIAL_MEDICINES = [
  {
    id: 'MED001',
    name: 'Paracetamol 500mg',
    genericName: 'Paracetamol (Acetaminophen)',
    category: 'Analgesics & Antipyretics',
    medicineType: 'Allopathic',
    strength: '500mg',
    dosageForm: 'Tablet',
    manufacturer: 'Micro Labs Ltd',
    description: 'Analgesic and antipyretic for pain and fever relief.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    prescriptionRequired: false,
    availableStock: 500,
    minimumStock: 100,
    reorderLevel: 150,
    batchNumber: 'PCM2026A01',
    mfgDate: 'Jan 2026',
    expiryDate: 'Dec 2027',
    daysRemaining: 458,
    supplier: 'ABC Pharma Distributors',
    purchasePrice: 1.20,
    sellingPrice: 2.00,
    status: 'In Stock'
  },
  {
    id: 'MED002',
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin Trihydrate',
    category: 'Antibiotics & Anti-Infectives',
    medicineType: 'Allopathic',
    strength: '500mg',
    dosageForm: 'Capsule',
    manufacturer: 'Cipla Ltd',
    description: 'Broad-spectrum penicillin antibiotic for bacterial infections.',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80',
    prescriptionRequired: true,
    availableStock: 350,
    minimumStock: 80,
    reorderLevel: 120,
    batchNumber: 'AMX2026B14',
    mfgDate: 'Feb 2026',
    expiryDate: 'Jan 2028',
    daysRemaining: 489,
    supplier: 'ABC Pharma Distributors',
    purchasePrice: 5.50,
    sellingPrice: 8.50,
    status: 'In Stock'
  },
  {
    id: 'MED003',
    name: 'Azithromycin 500mg',
    genericName: 'Azithromycin Dihydrate',
    category: 'Antibiotics & Anti-Infectives',
    medicineType: 'Allopathic',
    strength: '500mg',
    dosageForm: 'Tablet',
    manufacturer: 'Zydus Cadila',
    description: 'Macrolide antibiotic for respiratory and soft tissue infections.',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=400&q=80',
    prescriptionRequired: true,
    availableStock: 45,
    minimumStock: 50,
    reorderLevel: 75,
    batchNumber: 'AZI26-092',
    mfgDate: 'Mar 2026',
    expiryDate: 'Oct 2026',
    daysRemaining: 31,
    supplier: 'ABC Pharma Distributors',
    purchasePrice: 14.00,
    sellingPrice: 22.00,
    status: 'Low Stock'
  },
  {
    id: 'MED004',
    name: 'Cetirizine 10mg',
    genericName: 'Cetirizine Hydrochloride',
    category: 'Respiratory & Anti-Allergy',
    medicineType: 'Allopathic',
    strength: '10mg',
    dosageForm: 'Tablet',
    manufacturer: 'Dr. Reddy Laboratories',
    description: 'Antihistamine for allergic rhinitis, sneezing, and skin allergies.',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=400&q=80',
    prescriptionRequired: false,
    availableStock: 600,
    minimumStock: 100,
    reorderLevel: 150,
    batchNumber: 'CET26-441',
    mfgDate: 'Jan 2026',
    expiryDate: 'Jun 2028',
    daysRemaining: 640,
    supplier: 'Apex Surgicals & Pharmaceuticals',
    purchasePrice: 1.80,
    sellingPrice: 3.50,
    status: 'In Stock'
  },
  {
    id: 'MED005',
    name: 'Pantoprazole 40mg',
    genericName: 'Pantoprazole Sodium',
    category: 'Gastrointestinal & Antacids',
    medicineType: 'Allopathic',
    strength: '40mg',
    dosageForm: 'Tablet',
    manufacturer: 'Alkem Laboratories',
    description: 'Proton pump inhibitor for GERD, acid peptic disorders and ulcers.',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
    prescriptionRequired: true,
    availableStock: 420,
    minimumStock: 80,
    reorderLevel: 120,
    batchNumber: 'PAN26-118',
    mfgDate: 'Apr 2026',
    expiryDate: 'Mar 2028',
    daysRemaining: 549,
    supplier: 'Mysore Pharma Agencies',
    purchasePrice: 4.20,
    sellingPrice: 6.80,
    status: 'In Stock'
  },
  {
    id: 'MED006',
    name: 'Metformin 500mg',
    genericName: 'Metformin Hydrochloride (SR)',
    category: 'Diabetic Care & Insulin',
    medicineType: 'Allopathic',
    strength: '500mg',
    dosageForm: 'Tablet',
    manufacturer: 'USV Ltd',
    description: 'Biguanide oral hypoglycemic agent for Type 2 diabetes management.',
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=400&q=80',
    prescriptionRequired: true,
    availableStock: 18,
    minimumStock: 100,
    reorderLevel: 150,
    batchNumber: 'MET26-702',
    mfgDate: 'Jan 2026',
    expiryDate: 'Nov 2026',
    daysRemaining: 62,
    supplier: 'MedLife Healthcare Logistics',
    purchasePrice: 1.50,
    sellingPrice: 2.80,
    status: 'Low Stock'
  },
  {
    id: 'MED007',
    name: 'Vitamin D3 60,000 IU',
    genericName: 'Cholecalciferol',
    category: 'Vitamins & Supplements',
    medicineType: 'Allopathic',
    strength: '60000 IU',
    dosageForm: 'Capsule',
    manufacturer: 'Torrent Pharmaceuticals',
    description: 'High-potency weekly vitamin D3 supplement for bone health.',
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=400&q=80',
    prescriptionRequired: false,
    availableStock: 280,
    minimumStock: 50,
    reorderLevel: 80,
    batchNumber: 'VTD26-880',
    mfgDate: 'Feb 2026',
    expiryDate: 'Jan 2028',
    daysRemaining: 489,
    supplier: 'Mysore Pharma Agencies',
    purchasePrice: 18.00,
    sellingPrice: 28.00,
    status: 'In Stock'
  },
  {
    id: 'MED008',
    name: 'Oral Rehydration Salts (ORS)',
    genericName: 'WHO Standard Oral Electrolytes',
    category: 'Gastrointestinal & Antacids',
    medicineType: 'Allopathic',
    strength: '21.8g / Sachet',
    dosageForm: 'Powder / Sachet',
    manufacturer: 'FDC Ltd',
    description: 'Electrolyte replacement for dehydration due to diarrhea and heat.',
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=400&q=80',
    prescriptionRequired: false,
    availableStock: 850,
    minimumStock: 150,
    reorderLevel: 250,
    batchNumber: 'ORS26-302',
    mfgDate: 'May 2026',
    expiryDate: 'Apr 2028',
    daysRemaining: 580,
    supplier: 'Mysore Pharma Agencies',
    purchasePrice: 12.00,
    sellingPrice: 19.50,
    status: 'In Stock'
  },
  {
    id: 'MED009',
    name: 'Augmentin 625 Duo',
    genericName: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    category: 'Antibiotics & Anti-Infectives',
    medicineType: 'Allopathic',
    strength: '625mg',
    dosageForm: 'Tablet',
    manufacturer: 'GSK Pharmaceuticals',
    description: 'Potentiated penicillin antibiotic resistant to beta-lactamase.',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=400&q=80',
    prescriptionRequired: true,
    availableStock: 0,
    minimumStock: 60,
    reorderLevel: 100,
    batchNumber: 'AUG26-901',
    mfgDate: 'Jan 2026',
    expiryDate: 'Oct 2026',
    daysRemaining: 31,
    supplier: 'Apex Surgicals & Pharmaceuticals',
    purchasePrice: 14.50,
    sellingPrice: 22.00,
    status: 'Out of Stock'
  },
  {
    id: 'MED010',
    name: 'Telma 40mg Tablet',
    genericName: 'Telmisartan (40mg)',
    category: 'Cardiovascular & Antihypertensive',
    medicineType: 'Allopathic',
    strength: '40mg',
    dosageForm: 'Tablet',
    manufacturer: 'Glenmark Pharmaceuticals',
    description: 'Angiotensin receptor blocker for primary essential hypertension.',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=400&q=80',
    prescriptionRequired: true,
    availableStock: 680,
    minimumStock: 80,
    reorderLevel: 120,
    batchNumber: 'TEL26-114',
    mfgDate: 'Mar 2026',
    expiryDate: 'Feb 2028',
    daysRemaining: 520,
    supplier: 'MedLife Healthcare Logistics',
    purchasePrice: 6.20,
    sellingPrice: 9.80,
    status: 'In Stock'
  },
  {
    id: 'MED011',
    name: 'Lantus Solostar 100IU',
    genericName: 'Insulin Glargine (Recombinant)',
    category: 'Diabetic Care & Insulin',
    medicineType: 'Allopathic',
    strength: '100 IU/ml (3ml)',
    dosageForm: 'Injectable',
    manufacturer: 'Sanofi Healthcare',
    description: 'Long-acting basal analog insulin injection for 24-hour glycemic control.',
    image: 'https://images.unsplash.com/photo-1579165466791-788226ab77b6?auto=format&fit=crop&w=400&q=80',
    prescriptionRequired: true,
    availableStock: 6,
    minimumStock: 20,
    reorderLevel: 30,
    batchNumber: 'LNT26-004',
    mfgDate: 'Jan 2026',
    expiryDate: 'Nov 2026',
    daysRemaining: 62,
    supplier: 'Apex Surgicals & Pharmaceuticals',
    purchasePrice: 520.00,
    sellingPrice: 680.00,
    status: 'Low Stock'
  },
  {
    id: 'MED012',
    name: 'Dolo 650mg Tablet',
    genericName: 'Paracetamol (650mg)',
    category: 'Analgesics & Antipyretics',
    medicineType: 'Allopathic',
    strength: '650mg',
    dosageForm: 'Tablet',
    manufacturer: 'Micro Labs Ltd',
    description: 'High-strength antipyretic for persistent viral fever and body aches.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    prescriptionRequired: false,
    availableStock: 1400,
    minimumStock: 200,
    reorderLevel: 350,
    batchNumber: 'DOL26-552',
    mfgDate: 'Jun 2026',
    expiryDate: 'May 2028',
    daysRemaining: 610,
    supplier: 'MedLife Healthcare Logistics',
    purchasePrice: 1.80,
    sellingPrice: 3.00,
    status: 'In Stock'
  }
];

export const INITIAL_BATCHES = [
  {
    batchNumber: 'PCM2026A01',
    medicineId: 'MED001',
    medicineName: 'Paracetamol 500mg',
    quantity: 500,
    mfgDate: 'Jan 2026',
    expiryDate: 'Dec 2027',
    daysRemaining: 458,
    supplier: 'ABC Pharma Distributors',
    purchasePrice: 1.20,
    status: 'Active'
  },
  {
    batchNumber: 'AMX2026B14',
    medicineId: 'MED002',
    medicineName: 'Amoxicillin 500mg',
    quantity: 350,
    mfgDate: 'Feb 2026',
    expiryDate: 'Jan 2028',
    daysRemaining: 489,
    supplier: 'ABC Pharma Distributors',
    purchasePrice: 5.50,
    status: 'Active'
  },
  {
    batchNumber: 'AZI26-092',
    medicineId: 'MED003',
    medicineName: 'Azithromycin 500mg',
    quantity: 45,
    mfgDate: 'Mar 2026',
    expiryDate: 'Oct 2026',
    daysRemaining: 31,
    supplier: 'ABC Pharma Distributors',
    purchasePrice: 14.00,
    status: 'Expiring Soon'
  },
  {
    batchNumber: 'CET26-441',
    medicineId: 'MED004',
    medicineName: 'Cetirizine 10mg',
    quantity: 600,
    mfgDate: 'Jan 2026',
    expiryDate: 'Jun 2028',
    daysRemaining: 640,
    supplier: 'Apex Surgicals & Pharmaceuticals',
    purchasePrice: 1.80,
    status: 'Active'
  },
  {
    batchNumber: 'PAN26-118',
    medicineId: 'MED005',
    medicineName: 'Pantoprazole 40mg',
    quantity: 420,
    mfgDate: 'Apr 2026',
    expiryDate: 'Mar 2028',
    daysRemaining: 549,
    supplier: 'Mysore Pharma Agencies',
    purchasePrice: 4.20,
    status: 'Active'
  },
  {
    batchNumber: 'MET26-702',
    medicineId: 'MED006',
    medicineName: 'Metformin 500mg',
    quantity: 18,
    mfgDate: 'Jan 2026',
    expiryDate: 'Nov 2026',
    daysRemaining: 62,
    supplier: 'MedLife Healthcare Logistics',
    purchasePrice: 1.50,
    status: 'Expiring Soon'
  },
  {
    batchNumber: 'AUG26-901',
    medicineId: 'MED009',
    medicineName: 'Augmentin 625 Duo',
    quantity: 0,
    mfgDate: 'Jan 2026',
    expiryDate: 'Oct 2026',
    daysRemaining: 31,
    supplier: 'Apex Surgicals & Pharmaceuticals',
    purchasePrice: 14.50,
    status: 'Empty'
  },
  {
    batchNumber: 'LNT26-004',
    medicineId: 'MED011',
    medicineName: 'Lantus Solostar 100IU',
    quantity: 6,
    mfgDate: 'Jan 2026',
    expiryDate: 'Nov 2026',
    daysRemaining: 62,
    supplier: 'Apex Surgicals & Pharmaceuticals',
    purchasePrice: 520.00,
    status: 'Expiring Soon'
  },
  {
    batchNumber: 'DOL26-552',
    medicineId: 'MED012',
    medicineName: 'Dolo 650mg Tablet',
    quantity: 1400,
    mfgDate: 'Jun 2026',
    expiryDate: 'May 2028',
    daysRemaining: 610,
    supplier: 'MedLife Healthcare Logistics',
    purchasePrice: 1.80,
    status: 'Active'
  }
];

export const INITIAL_STOCK_HISTORY = [
  {
    id: 'TXN-101',
    date: '29 Sep 2026, 09:30 AM',
    medicineName: 'Paracetamol 500mg',
    batch: 'PCM2026A01',
    transactionType: 'Stock Added',
    quantity: '+200',
    previousStock: 500,
    updatedStock: 700,
    reason: 'New stock received from ABC Pharma (Inv #INV-8821)',
    performedBy: 'Pharmacy Admin'
  },
  {
    id: 'TXN-102',
    date: '29 Sep 2026, 10:15 AM',
    medicineName: 'Paracetamol 500mg',
    batch: 'PCM2026A01',
    transactionType: 'Damaged Stock',
    quantity: '-10',
    previousStock: 700,
    updatedStock: 690,
    reason: 'Damaged blister packaging during humidity check',
    performedBy: 'Pharmacy Admin'
  },
  {
    id: 'TXN-103',
    date: '29 Sep 2026, 11:00 AM',
    medicineName: 'Paracetamol 500mg',
    batch: 'PCM2026A01',
    transactionType: 'Dispensed / Picked',
    quantity: '-20',
    previousStock: 690,
    updatedStock: 670,
    reason: 'Picked by Central Hub staff for Order #ORD-1024',
    performedBy: 'Central Hub Dispatch'
  },
  {
    id: 'TXN-104',
    date: '28 Sep 2026, 03:40 PM',
    medicineName: 'Amoxicillin 500mg',
    batch: 'AMX2026B14',
    transactionType: 'Stock Added',
    quantity: '+150',
    previousStock: 200,
    updatedStock: 350,
    reason: 'Routine quarterly restock replenishment',
    performedBy: 'Pharmacy Admin'
  },
  {
    id: 'TXN-105',
    date: '27 Sep 2026, 02:15 PM',
    medicineName: 'Metformin 500mg',
    batch: 'MET26-702',
    transactionType: 'Stock Correction',
    quantity: '-5',
    previousStock: 23,
    updatedStock: 18,
    reason: 'Physical inventory audit variance adjustment',
    performedBy: 'Pharmacy Admin'
  },
  {
    id: 'TXN-106',
    date: '26 Sep 2026, 04:30 PM',
    medicineName: 'Augmentin 625 Duo',
    batch: 'AUG26-901',
    transactionType: 'Dispensed / Picked',
    quantity: '-15',
    previousStock: 15,
    updatedStock: 0,
    reason: 'Picked for inpatient emergency order fulfillment',
    performedBy: 'Central Hub Dispatch'
  }
];

export const INITIAL_ORDERS = [
  {
    orderId: 'ORD-1024',
    patientName: 'Rahul Sharma',
    patientId: 'PID-9012',
    patientPhone: '+91 98450 67890',
    patientAddress: '#42, 5th Cross, Jayalakshmipuram, Mysore - 570012',
    orderDate: '29 Sep 2026, 09:15 AM',
    prescriptionId: 'RX-4401',
    orderAmount: 450,
    items: [
      { name: 'Paracetamol 500mg', qty: 20, price: 2.00, total: 40 },
      { name: 'Amoxicillin 500mg', qty: 10, price: 8.50, total: 85 },
      { name: 'Pantoprazole 40mg', qty: 15, price: 6.80, total: 102 }
    ],
    currentStatus: 'Picking',
    deliveryStatus: 'Preparing',
    lastUpdated: '12 mins ago',
    timeline: [
      { stage: 'Order Placed', time: '29 Sep, 09:15 AM', done: true },
      { stage: 'Prescription Received', time: '29 Sep, 09:18 AM', done: true },
      { stage: 'Prescription Verified', time: '29 Sep, 09:25 AM', done: true },
      { stage: 'Picking', time: '29 Sep, 09:40 AM', current: true },
      { stage: 'Packed', time: 'Pending', pending: true },
      { stage: 'Out for Delivery', time: 'Pending', pending: true },
      { stage: 'Delivered', time: 'Pending', pending: true }
    ]
  },
  {
    orderId: 'ORD-1025',
    patientName: 'Priya Narayanan',
    patientId: 'PID-9013',
    patientPhone: '+91 97401 22998',
    patientAddress: '#118, 12th Cross, Kuvempunagar, Mysore - 570023',
    orderDate: '29 Sep 2026, 08:30 AM',
    prescriptionId: 'RX-4402',
    orderAmount: 820,
    items: [
      { name: 'Telma 40mg Tablet', qty: 30, price: 9.80, total: 294 },
      { name: 'Metformin 500mg', qty: 60, price: 2.80, total: 168 },
      { name: 'Vitamin D3 60,000 IU', qty: 4, price: 28.00, total: 112 }
    ],
    currentStatus: 'Packed',
    deliveryStatus: 'Packed',
    lastUpdated: '25 mins ago',
    timeline: [
      { stage: 'Order Placed', time: '29 Sep, 08:30 AM', done: true },
      { stage: 'Prescription Received', time: '29 Sep, 08:32 AM', done: true },
      { stage: 'Prescription Verified', time: '29 Sep, 08:45 AM', done: true },
      { stage: 'Picking', time: '29 Sep, 09:05 AM', done: true },
      { stage: 'Packed', time: '29 Sep, 09:20 AM', current: true },
      { stage: 'Out for Delivery', time: 'Pending dispatch', pending: true },
      { stage: 'Delivered', time: 'Pending', pending: true }
    ]
  },
  {
    orderId: 'ORD-1026',
    patientName: 'Kiran Gowda',
    patientId: 'PID-9014',
    patientPhone: '+91 98801 44321',
    patientAddress: '#78, Saraswathipuram Main Road, Mysore - 570009',
    orderDate: '29 Sep 2026, 07:45 AM',
    prescriptionId: 'RX-4403',
    orderAmount: 340,
    items: [
      { name: 'Cetirizine 10mg', qty: 20, price: 3.50, total: 70 },
      { name: 'Pantoprazole 40mg', qty: 20, price: 6.80, total: 136 },
      { name: 'Oral Rehydration Salts (ORS)', qty: 5, price: 19.50, total: 97.5 }
    ],
    currentStatus: 'Out for Delivery',
    deliveryStatus: 'Out for Delivery',
    lastUpdated: '8 mins ago',
    timeline: [
      { stage: 'Order Placed', time: '29 Sep, 07:45 AM', done: true },
      { stage: 'Prescription Received', time: '29 Sep, 07:50 AM', done: true },
      { stage: 'Prescription Verified', time: '29 Sep, 08:00 AM', done: true },
      { stage: 'Picking', time: '29 Sep, 08:20 AM', done: true },
      { stage: 'Packed', time: '29 Sep, 08:40 AM', done: true },
      { stage: 'Out for Delivery', time: '29 Sep, 09:10 AM', current: true },
      { stage: 'Delivered', time: 'Estimated 10:15 AM', pending: true }
    ]
  },
  {
    orderId: 'ORD-1027',
    patientName: 'Anil Singhania',
    patientId: 'PID-9015',
    patientPhone: '+91 98200 88990',
    patientAddress: '#14, Gokulam 3rd Stage, Mysore - 570002',
    orderDate: '28 Sep 2026, 04:20 PM',
    prescriptionId: 'RX-4404',
    orderAmount: 1250,
    items: [
      { name: 'Lantus Solostar 100IU', qty: 1, price: 680.00, total: 680 },
      { name: 'Telma 40mg Tablet', qty: 30, price: 9.80, total: 294 }
    ],
    currentStatus: 'Delivered',
    deliveryStatus: 'Delivered',
    lastUpdated: 'Yesterday',
    timeline: [
      { stage: 'Order Placed', time: '28 Sep, 04:20 PM', done: true },
      { stage: 'Prescription Received', time: '28 Sep, 04:25 PM', done: true },
      { stage: 'Prescription Verified', time: '28 Sep, 04:35 PM', done: true },
      { stage: 'Picking', time: '28 Sep, 04:50 PM', done: true },
      { stage: 'Packed', time: '28 Sep, 05:10 PM', done: true },
      { stage: 'Out for Delivery', time: '28 Sep, 05:30 PM', done: true },
      { stage: 'Delivered', time: '28 Sep, 06:15 PM', done: true }
    ]
  },
  {
    orderId: 'ORD-1028',
    patientName: 'Meenakshi Sundaram',
    patientId: 'PID-9016',
    patientPhone: '+91 97401 55667',
    patientAddress: '#90, Vijayanagar 2nd Stage, Mysore - 570017',
    orderDate: '29 Sep 2026, 09:50 AM',
    prescriptionId: 'RX-4405',
    orderAmount: 220,
    items: [
      { name: 'Dolo 650mg Tablet', qty: 30, price: 3.00, total: 90 },
      { name: 'Cetirizine 10mg', qty: 15, price: 3.50, total: 52.5 }
    ],
    currentStatus: 'Prescription Received',
    deliveryStatus: 'Preparing',
    lastUpdated: '5 mins ago',
    timeline: [
      { stage: 'Order Placed', time: '29 Sep, 09:50 AM', done: true },
      { stage: 'Prescription Received', time: '29 Sep, 09:52 AM', current: true },
      { stage: 'Prescription Verified', time: 'Awaiting Hub Pharmacist', pending: true },
      { stage: 'Picking', time: 'Pending', pending: true },
      { stage: 'Packed', time: 'Pending', pending: true },
      { stage: 'Out for Delivery', time: 'Pending', pending: true },
      { stage: 'Delivered', time: 'Pending', pending: true }
    ]
  },
  {
    orderId: 'ORD-1029',
    patientName: 'Sanjay Deshmukh',
    patientId: 'PID-9017',
    patientPhone: '+91 98801 33119',
    patientAddress: '#23, Hebbal 1st Stage, Mysore - 570016',
    orderDate: '28 Sep 2026, 02:10 PM',
    prescriptionId: 'RX-4406',
    orderAmount: 510,
    items: [
      { name: 'Pantoprazole 40mg', qty: 30, price: 6.80, total: 204 }
    ],
    currentStatus: 'Cancelled',
    deliveryStatus: 'Cancelled',
    lastUpdated: 'Yesterday',
    timeline: [
      { stage: 'Order Placed', time: '28 Sep, 02:10 PM', done: true },
      { stage: 'Prescription Received', time: '28 Sep, 02:15 PM', done: true },
      { stage: 'Prescription Verified', time: 'Rejected by Hub (Unclear dosage)', done: true },
      { stage: 'Cancelled', time: '28 Sep, 02:40 PM', done: true }
    ]
  }
];

export const INITIAL_PRESCRIPTIONS = [
  {
    prescriptionId: 'RX-4401',
    patientName: 'Rahul Sharma',
    patientId: 'PID-9012',
    patientPhone: '+91 98450 67890',
    doctorName: 'Dr. Ramesh Bose, MD Internal Med',
    doctorRegNo: 'MCI-88219',
    hospital: 'Care Health Hospital, Mysore',
    prescriptionDate: '29 Sep 2026',
    relatedOrderId: 'ORD-1024',
    verificationStatus: 'Verified',
    currentOrderStatus: 'Picking',
    extractedItems: [
      'Paracetamol 500mg (TID x 5 days)',
      'Amoxicillin 500mg (BD x 5 days)',
      'Pantoprazole 40mg (OD before food x 10 days)'
    ],
    notes: 'Verified and approved by Central Hub Pharmacist (Rahul Verma, Reg #44910).'
  },
  {
    prescriptionId: 'RX-4402',
    patientName: 'Priya Narayanan',
    patientId: 'PID-9013',
    patientPhone: '+91 97401 22998',
    doctorName: 'Dr. Sneha Roy, MD Cardiology',
    doctorRegNo: 'MCI-94102',
    hospital: 'Apex Cardio Clinic, Mysore',
    prescriptionDate: '29 Sep 2026',
    relatedOrderId: 'ORD-1025',
    verificationStatus: 'Verified',
    currentOrderStatus: 'Packed',
    extractedItems: [
      'Telma 40mg (OD morning x 30 days)',
      'Metformin 500mg (BD after food x 30 days)',
      'Vitamin D3 60K (1 cap weekly x 4 weeks)'
    ],
    notes: 'Chronic care prescription approved for automated repeat dispatch.'
  },
  {
    prescriptionId: 'RX-4403',
    patientName: 'Kiran Gowda',
    patientId: 'PID-9014',
    patientPhone: '+91 98801 44321',
    doctorName: 'Dr. Farhan Qureshi, MD Pulmonology',
    doctorRegNo: 'MCI-76540',
    hospital: 'City Chest Care Centre',
    prescriptionDate: '29 Sep 2026',
    relatedOrderId: 'ORD-1026',
    verificationStatus: 'Verified',
    currentOrderStatus: 'Out for Delivery',
    extractedItems: [
      'Cetirizine 10mg (HS x 10 days)',
      'Pantoprazole 40mg (OD x 10 days)',
      'ORS Sachet (As needed for hydration)'
    ],
    notes: 'Dispensed and packed with tamper-evident seal.'
  },
  {
    prescriptionId: 'RX-4404',
    patientName: 'Anil Singhania',
    patientId: 'PID-9015',
    patientPhone: '+91 98200 88990',
    doctorName: 'Dr. Manjunath Swamy, MD Diabetology',
    doctorRegNo: 'MCI-55412',
    hospital: 'Mysore Diabetes Specialty Hospital',
    prescriptionDate: '28 Sep 2026',
    relatedOrderId: 'ORD-1027',
    verificationStatus: 'Verified',
    currentOrderStatus: 'Delivered',
    extractedItems: [
      'Lantus Solostar 100IU (10 units HS subcutaneously)',
      'Telma 40mg (OD x 30 days)'
    ],
    notes: 'Cold-chain compliant insulated package verified and delivered.'
  },
  {
    prescriptionId: 'RX-4405',
    patientName: 'Meenakshi Sundaram',
    patientId: 'PID-9016',
    patientPhone: '+91 97401 55667',
    doctorName: 'Dr. Kavita Rao, MBBS',
    doctorRegNo: 'MCI-66782',
    hospital: 'Vijayanagar Polyclinic',
    prescriptionDate: '29 Sep 2026',
    relatedOrderId: 'ORD-1028',
    verificationStatus: 'Pending Verification',
    currentOrderStatus: 'Prescription Received',
    extractedItems: [
      'Dolo 650mg (TID x 5 days)',
      'Cetirizine 10mg (HS x 5 days)'
    ],
    notes: 'Awaiting digital signature review by Central Hub Pharmacist queue.'
  },
  {
    prescriptionId: 'RX-4406',
    patientName: 'Sanjay Deshmukh',
    patientId: 'PID-9017',
    patientPhone: '+91 98801 33119',
    doctorName: 'Dr. Prakash Hegde, MD',
    doctorRegNo: 'MCI-33190',
    hospital: 'Private Practice',
    prescriptionDate: '28 Sep 2026',
    relatedOrderId: 'ORD-1029',
    verificationStatus: 'Rejected',
    currentOrderStatus: 'Cancelled',
    extractedItems: [
      'Pantoprazole 40mg (Unclear dosage strength)'
    ],
    notes: 'Rejected due to missing doctor registration seal and ambiguous frequency.'
  }
];

export const INITIAL_DELIVERIES = [
  {
    orderId: 'ORD-1026',
    patientName: 'Kiran Gowda',
    patientPhone: '+91 98801 44321',
    address: '#78, Saraswathipuram Main Road, Mysore - 570009',
    deliveryStatus: 'Out for Delivery',
    packedTime: '29 Sep 2026, 08:40 AM',
    dispatchTime: '29 Sep 2026, 09:10 AM',
    deliveredTime: 'In Transit',
    currentStage: 'Out for Delivery',
    runnerName: 'Praveen Kumar (Runner #4)',
    runnerPhone: '+91 98450 88221',
    eta: '10:15 AM (15 mins away)',
    deliveryNotes: 'Express delivery priority'
  },
  {
    orderId: 'ORD-1025',
    patientName: 'Priya Narayanan',
    patientPhone: '+91 97401 22998',
    address: '#118, 12th Cross, Kuvempunagar, Mysore - 570023',
    deliveryStatus: 'Packed',
    packedTime: '29 Sep 2026, 09:20 AM',
    dispatchTime: 'Awaiting Hub Runner Assignment',
    deliveredTime: '-',
    currentStage: 'Packed',
    runnerName: 'Pending Pickup',
    runnerPhone: '-',
    eta: '11:00 AM',
    deliveryNotes: 'Standard cold pack'
  },
  {
    orderId: 'ORD-1024',
    patientName: 'Rahul Sharma',
    patientPhone: '+91 98450 67890',
    address: '#42, 5th Cross, Jayalakshmipuram, Mysore - 570012',
    deliveryStatus: 'Preparing',
    packedTime: 'In Progress (Picking)',
    dispatchTime: '-',
    deliveredTime: '-',
    currentStage: 'Preparing',
    runnerName: 'Unassigned',
    runnerPhone: '-',
    eta: '11:45 AM',
    deliveryNotes: 'Scheduled home drop'
  },
  {
    orderId: 'ORD-1027',
    patientName: 'Anil Singhania',
    patientPhone: '+91 98200 88990',
    address: '#14, Gokulam 3rd Stage, Mysore - 570002',
    deliveryStatus: 'Delivered',
    packedTime: '28 Sep 2026, 05:10 PM',
    dispatchTime: '28 Sep 2026, 05:30 PM',
    deliveredTime: '28 Sep 2026, 06:15 PM',
    currentStage: 'Delivered',
    runnerName: 'Santhosh M (Runner #2)',
    runnerPhone: '+91 98450 99443',
    eta: 'Delivered Successfully',
    deliveryNotes: 'Handed to patient with digital OTP confirmation'
  }
];

export const CENTRAL_HUB_STATUS = {
  status: 'Active & Operational',
  hubName: 'MediUnify Central Pharmacy Fulfillment Hub #1',
  location: 'Central Medical Operations Complex, Mysore',
  pharmacistInCharge: 'Rahul Verma, B.Pharm (Reg # 44910)',
  licenseNumber: 'Form 20/21 • DL-20-KAR-88390 / 21-KAR-88391',
  todayActivity: {
    ordersReceived: 128,
    prescriptionsVerified: 116,
    ordersBeingPicked: 7,
    ordersPacked: 5,
    outForDelivery: 14,
    deliveredToday: 102,
    cancelledOrders: 3
  }
};

export const PHARMACY_ALERTS = [
  {
    id: 'ALT-01',
    type: 'low_stock',
    severity: 'critical',
    title: 'Out of Stock: Augmentin 625 Duo',
    message: 'Available stock reached 0 units. Immediate reorder required from Apex Surgicals.',
    time: '15 mins ago'
  },
  {
    id: 'ALT-02',
    type: 'low_stock',
    severity: 'warning',
    title: 'Low Stock Alert: Metformin 500mg',
    message: 'Stock is down to 18 units (Minimum threshold: 100 units).',
    time: '45 mins ago'
  },
  {
    id: 'ALT-03',
    type: 'expiring',
    severity: 'warning',
    title: 'Expiring Soon: Azithromycin 500mg (Batch AZI26-092)',
    message: 'Batch expiring in 31 days (Oct 2026). Available quantity: 45 units.',
    time: '2 hours ago'
  },
  {
    id: 'ALT-04',
    type: 'stock_added',
    severity: 'info',
    title: 'Stock Received: Paracetamol 500mg (+200 units)',
    message: 'Batch PCM2026A01 stock updated from 500 to 700 units via Invoice #INV-8821.',
    time: '3 hours ago'
  },
  {
    id: 'ALT-05',
    type: 'delivery',
    severity: 'info',
    title: 'Order #ORD-1026 Out for Delivery',
    message: 'Runner Praveen Kumar has departed Central Hub for Saraswathipuram.',
    time: '35 mins ago'
  }
];

// Backwards compatibility aliases
export const PHARMACY_STATS = {
  totalMedicines: 1248,
  totalStockUnits: 84520,
  lowStockAlerts: 37,
  outOfStock: 8,
  expiringSoon: 19,
  pendingPrescriptions: 14,
  ordersToday: 128,
  revenueToday: 142800,
  outForDelivery: 14,
  fulfillmentRate: '98.8%'
};

export const PHARMACY_MEDICINES = INITIAL_MEDICINES;
export const PHARMACY_PRESCRIPTIONS = INITIAL_PRESCRIPTIONS;
export const PHARMACY_ORDERS = INITIAL_ORDERS;
export const PHARMACY_DISCOUNTS = [];
