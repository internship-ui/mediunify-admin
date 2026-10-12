export const RENTAL_EQUIPMENT = [
  // 1. Hospital Beds
  {
    id: 'EQ-BED-001',
    name: 'Motorized 3-Function ICU Electric Hospital Bed',
    category: 'Hospital Beds',
    description: 'Fully motorized electronic hospital bed with remote-controlled backrest, knee elevation, height adjustment, collateral safety side rails, and collapsible IV pole.',
    images: [
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: '3-function motorized actuator, 220kg load capacity, central locking castors, waterproof high-density foam mattress, emergency CPR release.',
    rentalType: 'Monthly / Weekly',
    startingRentalPrice: 4500,
    deposit: 5000,
    deliveryCharge: 600,
    installationCharge: 400,
    state: 'Karnataka',
    city: 'Bengaluru',
    areasServed: 'Indiranagar, Koramangala, Whitefield, HSR Layout, Malleshwaram, Jayanagar',
    status: 'Active',
    totalInventoryInNetwork: 28,
    activeRentalsCount: 20,
    availableCount: 6,
    maintenanceCount: 2
  },
  {
    id: 'EQ-BED-002',
    name: 'Semi-Fowler 2-Function Manual Hospital Bed',
    category: 'Hospital Beds',
    description: 'Heavy duty manual crank hospital bed offering smooth backrest and leg elevation adjustments, foldable side rails, and ABS head/foot boards.',
    images: [
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: 'Dual manual crank handles, epoxy powder-coated frame, 175kg weight capacity, 4-inch medical grade anti-static castors.',
    rentalType: 'Monthly / Weekly',
    startingRentalPrice: 2800,
    deposit: 3000,
    deliveryCharge: 500,
    installationCharge: 300,
    state: 'Karnataka',
    city: 'Mysuru',
    areasServed: 'Jayalakshmipuram, Kuvempunagar, Saraswathipuram, Gokulam, Vijayanagar',
    status: 'Active',
    totalInventoryInNetwork: 22,
    activeRentalsCount: 16,
    availableCount: 5,
    maintenanceCount: 1
  },
  {
    id: 'EQ-BED-003',
    name: 'Air Mattress with Variable Pressure Pump (Anti-Decubitus)',
    category: 'Hospital Beds',
    description: 'Alternating pressure bubble ripple mattress system engineered for prevention and clinical management of stage I-IV pressure ulcers and bedsores.',
    images: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: 'Medical grade PVC, 130 bubble cells, ultra-quiet 6-minute alternating air cycle pump, adjustable pressure dial, waterproof cover.',
    rentalType: 'Monthly',
    startingRentalPrice: 1200,
    deposit: 1500,
    deliveryCharge: 200,
    installationCharge: 0,
    state: 'Karnataka',
    city: 'Bengaluru',
    areasServed: 'All Bengaluru and Mysuru Localities',
    status: 'Active',
    totalInventoryInNetwork: 35,
    activeRentalsCount: 26,
    availableCount: 8,
    maintenanceCount: 1
  },

  // 2. Wheelchairs
  {
    id: 'EQ-WCH-001',
    name: 'Motorized Power Electric Wheelchair (Foldable)',
    category: 'Wheelchairs',
    description: 'Lightweight airline-approved electric power wheelchair with 360-degree intelligent joystick controller, dual 250W motors, and electromagnetic brakes.',
    images: [
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: 'Lithium-ion battery (20km range), speed up to 6km/h, 120kg weight capacity, breathable cushioned seat, anti-tip rear wheels.',
    rentalType: 'Monthly / Weekly / Daily',
    startingRentalPrice: 5500,
    deposit: 6000,
    deliveryCharge: 400,
    installationCharge: 200,
    state: 'Karnataka',
    city: 'Bengaluru',
    areasServed: 'Bengaluru Metro & Outskirts',
    status: 'Active',
    totalInventoryInNetwork: 18,
    activeRentalsCount: 12,
    availableCount: 5,
    maintenanceCount: 1
  },
  {
    id: 'EQ-WCH-002',
    name: 'Reclining High-Back Wheelchair with Commode & Headrest',
    category: 'Wheelchairs',
    description: 'Ergonomic high-back recliner wheelchair with elevating footrests, detachable armrests, hydraulic reclining mechanism, and integrated sanitation commode.',
    images: [
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: '0 to 180-degree reclining back, padded head support, removable commode bucket, solid rubber puncture-proof tires, chrome steel frame.',
    rentalType: 'Monthly / Weekly',
    startingRentalPrice: 2200,
    deposit: 2500,
    deliveryCharge: 350,
    installationCharge: 150,
    state: 'Karnataka',
    city: 'Mysuru',
    areasServed: 'Mysuru Urban & Rural',
    status: 'Active',
    totalInventoryInNetwork: 24,
    activeRentalsCount: 17,
    availableCount: 6,
    maintenanceCount: 1
  },
  {
    id: 'EQ-WCH-003',
    name: 'Standard Lightweight Folding Transit Wheelchair',
    category: 'Wheelchairs',
    description: 'Compact foldable wheelchair with companion attendant brakes, flip-up footplates, and easy trunk storage design for hospital visits and travel.',
    images: [
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: 'Aluminum alloy lightweight 11kg chassis, 100kg capacity, wipe-clean nylon upholstery, rear seat storage pocket.',
    rentalType: 'Monthly / Weekly / Daily',
    startingRentalPrice: 1100,
    deposit: 1500,
    deliveryCharge: 250,
    installationCharge: 0,
    state: 'Karnataka',
    city: 'Bengaluru',
    areasServed: 'All City Localities',
    status: 'Active',
    totalInventoryInNetwork: 40,
    activeRentalsCount: 30,
    availableCount: 9,
    maintenanceCount: 1
  },

  // 3. Oxygen Equipment
  {
    id: 'EQ-OXY-001',
    name: 'Medical Grade 10 LPM Dual Flow Oxygen Concentrator',
    category: 'Oxygen Equipment',
    description: 'Continuous flow oxygen concentrator delivering 1-10 LPM with >93% oxygen purity, integrated digital purity monitoring, and nebulizer function.',
    images: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: 'Continuous 10 LPM dual output, 93% ± 3% purity, low noise (<45 dB), built-in HEPA filtration, power outage alarm, oxygen sensor.',
    rentalType: 'Monthly / Weekly',
    startingRentalPrice: 5000,
    deposit: 6000,
    deliveryCharge: 400,
    installationCharge: 200,
    state: 'Karnataka',
    city: 'Bengaluru',
    areasServed: 'Bengaluru Urban & Rural',
    status: 'Active',
    totalInventoryInNetwork: 32,
    activeRentalsCount: 24,
    availableCount: 7,
    maintenanceCount: 1
  },
  {
    id: 'EQ-OXY-002',
    name: 'Compact 5 LPM Oxygen Concentrator (Home Care)',
    category: 'Oxygen Equipment',
    description: 'Energy-efficient home oxygen unit providing steady 0.5-5 LPM continuous oxygen for COPD, post-COVID recovery, and respiratory support.',
    images: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: '5 LPM output, 93% purity, 14.5kg portable chassis, low power consumption (300W), integrated humidifier bottle and nasal cannula kit.',
    rentalType: 'Monthly / Weekly',
    startingRentalPrice: 3500,
    deposit: 4000,
    deliveryCharge: 300,
    installationCharge: 150,
    state: 'Karnataka',
    city: 'Mysuru',
    areasServed: 'Mysuru, Mandya, Nanjangud',
    status: 'Active',
    totalInventoryInNetwork: 28,
    activeRentalsCount: 21,
    availableCount: 6,
    maintenanceCount: 1
  },
  {
    id: 'EQ-OXY-003',
    name: 'Medical Oxygen Cylinder Kit (B-Type 10 Litre with Regulator)',
    category: 'Oxygen Equipment',
    description: 'Complete high-pressure seamless steel oxygen cylinder supplied with certified medical regulator, flow meter, humidifier jar, and mask.',
    images: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: '10L water capacity (1500L oxygen volume), 150 bar test pressure, bullnose brass valve, calibrated 0-15 LPM regulator, cylinder stand.',
    rentalType: 'Monthly / Per Refill',
    startingRentalPrice: 1800,
    deposit: 3000,
    deliveryCharge: 400,
    installationCharge: 100,
    state: 'Karnataka',
    city: 'Bengaluru',
    areasServed: 'All City Localities',
    status: 'Active',
    totalInventoryInNetwork: 30,
    activeRentalsCount: 22,
    availableCount: 7,
    maintenanceCount: 1
  },

  // 4. Patient Care Equipment
  {
    id: 'EQ-PCR-001',
    name: 'Electric Hydraulic Patient Transfer Lift / Hoist',
    category: 'Patient Care Equipment',
    description: 'Battery-operated electric patient lift hoist designed for safe, dignified transfer from bed to wheelchair, commode, or floor with universal sling.',
    images: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: '180kg lifting capacity, emergency manual lowering, adjustable base legs, 4-point padded sling, rechargeable battery box with safety stop.',
    rentalType: 'Monthly',
    startingRentalPrice: 6500,
    deposit: 7000,
    deliveryCharge: 600,
    installationCharge: 400,
    state: 'Karnataka',
    city: 'Bengaluru',
    areasServed: 'Greater Bengaluru Area',
    status: 'Active',
    totalInventoryInNetwork: 14,
    activeRentalsCount: 10,
    availableCount: 3,
    maintenanceCount: 1
  },
  {
    id: 'EQ-PCR-002',
    name: 'Medical Heavy Duty Suction Machine (Electric Aspirator)',
    category: 'Patient Care Equipment',
    description: 'High-vacuum, high-flow oil-free diaphragm suction apparatus designed for tracheostomy care, phlegm clearance, and airway management.',
    images: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: 'Max vacuum 0.08 MPa, 20 L/min flow rate, 2x 2500ml shatterproof polycarbonate collection jars with overflow safety float.',
    rentalType: 'Monthly / Weekly',
    startingRentalPrice: 1800,
    deposit: 2000,
    deliveryCharge: 250,
    installationCharge: 150,
    state: 'Karnataka',
    city: 'Mysuru',
    areasServed: 'Mysuru District',
    status: 'Active',
    totalInventoryInNetwork: 20,
    activeRentalsCount: 15,
    availableCount: 4,
    maintenanceCount: 1
  },
  {
    id: 'EQ-PCR-003',
    name: 'Automatic Enteral Feeding Pump (Continuous / Intermittent)',
    category: 'Patient Care Equipment',
    description: 'Precision electronic enteral nutrition pump with programmable flow rates, dose limits, bolus feeding options, and occlusions alarms.',
    images: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: '1-400 ml/hr rate, ±5% accuracy, tube flush alert, rechargeable 5-hour backup battery, pole clamp attachment.',
    rentalType: 'Monthly',
    startingRentalPrice: 3200,
    deposit: 4000,
    deliveryCharge: 200,
    installationCharge: 200,
    state: 'Karnataka',
    city: 'Bengaluru',
    areasServed: 'Bengaluru Urban',
    status: 'Active',
    totalInventoryInNetwork: 16,
    activeRentalsCount: 11,
    availableCount: 4,
    maintenanceCount: 1
  },

  // 5. Mobility Equipment
  {
    id: 'EQ-MOB-001',
    name: 'Folding Walker with Front Wheels & Glides',
    category: 'Mobility Equipment',
    description: 'Sturdy anodized aluminum reciprocal folding walker with 5-inch front wheels, soft rubber handgrips, and one-button folding mechanism.',
    images: [
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: 'Height adjustable 32 to 39 inches, 135kg capacity, dual wheel glide system, lightweight 2.8kg frame.',
    rentalType: 'Monthly / Weekly',
    startingRentalPrice: 600,
    deposit: 800,
    deliveryCharge: 150,
    installationCharge: 0,
    state: 'Karnataka',
    city: 'Bengaluru',
    areasServed: 'All Localities',
    status: 'Active',
    totalInventoryInNetwork: 45,
    activeRentalsCount: 34,
    availableCount: 10,
    maintenanceCount: 1
  },
  {
    id: 'EQ-MOB-002',
    name: 'Rollator Walker with Padded Seat, Backrest & Hand Brakes',
    category: 'Mobility Equipment',
    description: 'Four-wheel mobility rollator walker with ergonomic loop lock hand brakes, comfortable resting padded seat, and under-seat storage basket.',
    images: [
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: '7.5-inch non-marking terrain wheels, arthritic-friendly handbrakes, foldable aluminum frame, 130kg rating.',
    rentalType: 'Monthly / Weekly',
    startingRentalPrice: 1400,
    deposit: 1500,
    deliveryCharge: 200,
    installationCharge: 0,
    state: 'Karnataka',
    city: 'Mysuru',
    areasServed: 'Mysuru Urban',
    status: 'Active',
    totalInventoryInNetwork: 25,
    activeRentalsCount: 18,
    availableCount: 6,
    maintenanceCount: 1
  },

  // 6. Monitoring Equipment
  {
    id: 'EQ-MON-001',
    name: '5-Para Multi-Parameter Patient Monitor (ECG, SpO2, NIBP, Temp, Resp)',
    category: 'Monitoring Equipment',
    description: '12.1-inch high-resolution color TFT display patient monitor equipped with advanced ST-segment analysis, arrhythmia detection, and rechargeable battery.',
    images: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: '5-lead ECG, digital SpO2, automatic NIBP with adult/pediatric cuff, dual channel temperature, 72-hour trend review, audio-visual alarms.',
    rentalType: 'Monthly / Weekly',
    startingRentalPrice: 4200,
    deposit: 5000,
    deliveryCharge: 350,
    installationCharge: 250,
    state: 'Karnataka',
    city: 'Bengaluru',
    areasServed: 'Bengaluru Urban & Rural',
    status: 'Active',
    totalInventoryInNetwork: 20,
    activeRentalsCount: 15,
    availableCount: 4,
    maintenanceCount: 1
  },
  {
    id: 'EQ-MON-002',
    name: 'BIPAP / CPAP Auto-Titrating Respiratory Machine',
    category: 'Monitoring Equipment',
    description: 'Advanced non-invasive positive pressure ventilator with auto-titrating EPAP/IPAP pressures, heated humidifier, and smart therapy compliance tracking.',
    images: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: 'Pressure range 4-25 cmH2O, whisper quiet motor (<28 dB), climate control heated tubing, full face / nasal mask sizing kit included.',
    rentalType: 'Monthly',
    startingRentalPrice: 5800,
    deposit: 6000,
    deliveryCharge: 350,
    installationCharge: 300,
    state: 'Karnataka',
    city: 'Bengaluru',
    areasServed: 'Greater Bengaluru Area',
    status: 'Active',
    totalInventoryInNetwork: 22,
    activeRentalsCount: 17,
    availableCount: 4,
    maintenanceCount: 1
  },

  // 7. Other Equipment
  {
    id: 'EQ-OTH-001',
    name: 'Infusion Syringe Pump (Micro / Macro)',
    category: 'Other Equipment',
    description: 'High-precision micro-infusion syringe driver compatible with standard 5ml to 50ml syringes for controlled medication delivery.',
    images: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: '0.1-1500 ml/h delivery, bolus programmable, occlusion pressure sensing, battery backup 6 hours.',
    rentalType: 'Monthly / Weekly',
    startingRentalPrice: 2200,
    deposit: 3000,
    deliveryCharge: 200,
    installationCharge: 150,
    state: 'Karnataka',
    city: 'Bengaluru',
    areasServed: 'Bengaluru Urban',
    status: 'Active',
    totalInventoryInNetwork: 15,
    activeRentalsCount: 11,
    availableCount: 3,
    maintenanceCount: 1
  },
  {
    id: 'EQ-OTH-002',
    name: 'Phototherapy Unit for Neonatal Jaundice (LED Blanket)',
    category: 'Other Equipment',
    description: 'Blue LED phototherapy wrap-around blanket for non-invasive treatment of neonatal hyperbilirubinemia in comfortable home settings.',
    images: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: '450-470 nm high intensity blue LED, zero UV radiation, temperature sensor safety, disposable soft fabric sleeves.',
    rentalType: 'Weekly / Daily',
    startingRentalPrice: 4000,
    deposit: 5000,
    deliveryCharge: 300,
    installationCharge: 200,
    state: 'Karnataka',
    city: 'Bengaluru',
    areasServed: 'Bengaluru & Mysuru',
    status: 'Active',
    totalInventoryInNetwork: 10,
    activeRentalsCount: 6,
    availableCount: 3,
    maintenanceCount: 1
  }
];
