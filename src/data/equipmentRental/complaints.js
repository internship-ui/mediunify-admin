export const RENTAL_COMPLAINTS = [
  {
    id: 'CMP-EQ-001',
    orderId: 'ORD-EQ-902',
    patient: 'Sunita Prabhakar',
    patientPhone: '+91 98455 66778',
    vendor: 'Apex Healthcare Fleet Solutions',
    vendorId: 'VND-002',
    equipment: '5-Para Multi-Parameter Patient Monitor',
    issue: 'SpO2 cable sensor showing intermittent reading',
    description: 'Patient caregiver reported that the finger clip sensor wire disconnects if moved. Needs replacement cable.',
    priority: 'High',
    assignedStaff: 'Kavitha R. (Clinical Support Lead)',
    date: '2026-09-18',
    status: 'In Progress',
    internalNotes: [
      {
        author: 'Kavitha R.',
        date: '2026-09-18 10:15 AM',
        text: 'Contacted Apex Healthcare dispatcher. Technician dispatched with replacement pediatric & adult probes.'
      }
    ]
  },
  {
    id: 'CMP-EQ-002',
    orderId: 'ORD-EQ-901',
    patient: 'Deepika S. Gowda',
    patientPhone: '+91 97401 22883',
    vendor: 'Cauvery Home Medix Solutions',
    vendorId: 'VND-003',
    equipment: 'Semi-Fowler 2-Function Manual Hospital Bed',
    issue: 'Delivery window inquiry and technician arrival',
    description: 'Patient family wanted confirmation on whether installation crew will assist moving existing bed.',
    priority: 'Low',
    assignedStaff: 'Vandana M. (Care Coordinator)',
    date: '2026-09-17',
    status: 'Resolved',
    internalNotes: [
      {
        author: 'Vandana M.',
        date: '2026-09-17 02:30 PM',
        text: 'Coordinated with driver. Confirmed two-person team will facilitate positioning.'
      }
    ]
  },
  {
    id: 'CMP-EQ-003',
    orderId: 'ORD-EQ-885',
    patient: 'Tara Krishnan',
    patientPhone: '+91 97402 11994',
    vendor: 'MedEquip Logistics & Healthcare Hub',
    vendorId: 'VND-001',
    equipment: 'Motorized 3-Function ICU Electric Hospital Bed',
    issue: 'Remote control battery compartment loose',
    description: 'Wired remote control holder had a loose screw causing intermittent click.',
    priority: 'Medium',
    assignedStaff: 'Suresh N. (Senior Ops)',
    date: '2026-09-14',
    status: 'Closed',
    internalNotes: [
      {
        author: 'Suresh N.',
        date: '2026-09-14 05:00 PM',
        text: 'Technician visited within 2 hours and replaced remote handset. Verified fully functional.'
      }
    ]
  },
  {
    id: 'CMP-EQ-004',
    orderId: 'ORD-EQ-872',
    patient: 'Padma Vasudev',
    patientPhone: '+91 94481 22998',
    vendor: 'Apex Healthcare Fleet Solutions',
    vendorId: 'VND-002',
    equipment: 'Reclining High-Back Wheelchair with Commode',
    issue: 'Wheelchair left brake adjustment requested',
    description: 'Caregiver noticed left parking brake required firmer pull.',
    priority: 'Medium',
    assignedStaff: 'Kavitha R. (Clinical Support Lead)',
    date: '2026-09-12',
    status: 'Resolved',
    internalNotes: [
      {
        author: 'Kavitha R.',
        date: '2026-09-12 04:00 PM',
        text: 'Brake tension calibrated during routine weekly checkup.'
      }
    ]
  }
];
