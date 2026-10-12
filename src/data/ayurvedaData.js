export const AYURVEDA_STATS = {
  activePractitioners: 9,
  todayTherapies: 24,
  doshaConsultationsToday: 16,
  monthlySessions: 380,
  roomOccupancyRate: '91.6%',
  revenueToday: 78500
};

export const AYURVEDA_PRACTITIONERS = [
  {
    id: 'VAD-01',
    name: 'Dr. (Vaidya) Keshavan Namboothiri, MD (Ayu)',
    designation: 'Chief Ayurvedic Physician & Nadi Pariksha Expert',
    experience: '24 Years of Kerala Classical Tradition',
    qualification: 'BAMS, MD (Kayachikitsa), PhD (Ayu)',
    specialty: 'Chronic Arthritis, Neurological Disorders, Nadi Pariksha',
    todaySlots: '6 / 6 Booked',
    status: 'In Consultation'
  },
  {
    id: 'VAD-02',
    name: 'Dr. Gayatri Warrier, BAMS, MS (Ayu)',
    designation: 'Senior Panchakarma Consultant & Women Wellness Lead',
    experience: '15 Years Experience',
    qualification: 'BAMS, MS (Prasuti Tantra & Stri Roga)',
    specialty: 'PCOS, Hormonal Balancing, Garbhasamskara, Skin Disorders',
    todaySlots: '4 / 6 Booked',
    status: 'Available'
  },
  {
    id: 'VAD-03',
    name: 'Dr. Anandhan Pillai, BAMS',
    designation: 'Holistic Spine & Joint Rehabilitation Physician',
    experience: '12 Years Experience',
    qualification: 'BAMS, PG Diploma in Marma Therapy',
    specialty: 'Kati Basti, Cervical Spondylosis, Sports Marma Therapy',
    todaySlots: '5 / 5 Booked',
    status: 'In Therapy Suite'
  }
];

export const AYURVEDA_THERAPIES = [
  {
    id: 'TH-01',
    name: 'Shirodhara with Medicated Ksheera / Tailam',
    category: 'Classical Panchakarma Upakarma',
    durationMinutes: 60,
    pricePerSession: 2400,
    oilsHerbsUsed: 'Ksheerabala Tailam, Brahmi Oil, Shankhapushpi Decoction',
    benefits: 'Relieves stress, insomnia, anxiety, migraines, and stabilizes Vata dosha.',
    status: 'Active'
  },
  {
    id: 'TH-02',
    name: 'Full Body Abhyanga with Herbal Steam Bath (Swedana)',
    category: 'Snehana & Swedana Protocol',
    durationMinutes: 75,
    pricePerSession: 2800,
    oilsHerbsUsed: 'Dhanwantharam Tailam, Mahanarayan Tailam, Dashamoola Kashayam Steam',
    benefits: 'Lymphatic detoxification, muscle toning, joint lubrication and vitality restoration.',
    status: 'Active'
  },
  {
    id: 'TH-03',
    name: 'Patra Pinda Sweda (Elakizhi Leaf Bolus Therapy)',
    category: 'Swedana & Pain Relief',
    durationMinutes: 60,
    pricePerSession: 2600,
    oilsHerbsUsed: 'Medicinal Leaves (Eranda, Nirgundi, Arka), Kottamchukkadi Choornam',
    benefits: 'Effective in stiffness, sciatica, frozen shoulder, lumbar disc pain.',
    status: 'Active'
  },
  {
    id: 'TH-04',
    name: 'Kati Basti (Warm Medicated Oil Well for Lumbar Spine)',
    category: 'Targeted External Basti',
    durationMinutes: 45,
    pricePerSession: 1900,
    oilsHerbsUsed: 'Murivenna, Sahacharadi Tailam, Black Gram Dough Ring',
    benefits: 'Relieves severe lower back pain, disc compression, sciatica.',
    status: 'Active'
  },
  {
    id: 'TH-05',
    name: 'Nasya Karma (Ayurvedic Nasal Detoxification)',
    category: 'Panchakarma Main Cleansing',
    durationMinutes: 45,
    pricePerSession: 1600,
    oilsHerbsUsed: 'Anu Tailam, Shadbindu Tailam, Facial Marma Massage',
    benefits: 'Cleanses sinuses, improves sleep, relieves chronic sinusitis and headaches.',
    status: 'Active'
  },
  {
    id: 'TH-06',
    name: 'Udvarthanam (Herbal Powder Dry Exfoliation Massage)',
    category: 'Kapha & Medo Hara Therapy',
    durationMinutes: 60,
    pricePerSession: 2500,
    oilsHerbsUsed: 'Triphala Choornam, Kolakulathadi Choornam, Lodhra',
    benefits: 'Weight management, improves microcirculation, clears skin texture.',
    status: 'Active'
  }
];

export const AYURVEDA_CONSULTATIONS = [
  {
    consultationId: 'AYU-CNS-301',
    patientName: 'Subhashree Iyer',
    age: 44,
    gender: 'Female',
    practitioner: 'Dr. (Vaidya) Keshavan Namboothiri',
    prakritiAssessment: 'Vata-Pitta Dominant',
    primaryComplaint: 'Chronic insomnia, digestive Agnimandya, cervical tension',
    recommendedTherapy: '7-Day Shirodhara & Abhyanga Course',
    dietaryGuideline: 'Warm soupy foods, ghee with meals, avoid raw salads & cold water.',
    status: 'Treatment Ongoing',
    date: '2026-09-16'
  },
  {
    consultationId: 'AYU-CNS-302',
    patientName: 'Raghavan Pillai',
    age: 58,
    gender: 'Male',
    practitioner: 'Dr. Anandhan Pillai',
    prakritiAssessment: 'Kapha-Vata',
    primaryComplaint: 'Bilateral knee osteoarthrosis with morning stiffness',
    recommendedTherapy: '14-Day Janu Basti + Elakizhi Therapy',
    dietaryGuideline: 'Anti-inflammatory regimen, boiled ginger water, Triphala Guggulu.',
    status: 'Prescription Issued',
    date: '2026-09-16'
  },
  {
    consultationId: 'AYU-CNS-303',
    patientName: 'Ananya Singhal',
    age: 31,
    gender: 'Female',
    practitioner: 'Dr. Gayatri Warrier',
    prakritiAssessment: 'Pitta-Vata',
    primaryComplaint: 'PCOS hormonal imbalance, skin breakouts, irregular cycle',
    recommendedTherapy: 'Uttar Basti & Matra Basti Detox Cycle',
    dietaryGuideline: 'Cooling Pitta-pacifying diet, fresh coconut water, Shatavari Ghritham.',
    status: 'Scheduled Consultation',
    date: '2026-09-16 02:30 PM'
  }
];

export const AYURVEDA_APPOINTMENTS = [
  {
    appId: 'AYU-APT-701',
    patientName: 'Subhashree Iyer',
    therapy: 'Shirodhara with Ksheerabala Tailam (Day 3 of 7)',
    room: 'Therapy Suite 1 (Dhara Room)',
    therapist: 'Anu & Maya (Senior Therapists)',
    timeSlot: '10:00 AM - 11:00 AM',
    status: 'In Session'
  },
  {
    appId: 'AYU-APT-702',
    patientName: 'Raghavan Pillai',
    therapy: 'Patra Pinda Sweda (Elakizhi)',
    room: 'Therapy Suite 2 (Kizhi Room)',
    therapist: 'Suresh & Vijayan',
    timeSlot: '11:15 AM - 12:15 PM',
    status: 'Scheduled'
  },
  {
    appId: 'AYU-APT-703',
    patientName: 'Vikrant Joshi',
    therapy: 'Full Body Abhyanga + Herbal Steam',
    room: 'Therapy Suite 3 (Swedana Room)',
    therapist: 'Gopal & Pradeep',
    timeSlot: '02:00 PM - 03:15 PM',
    status: 'Scheduled'
  }
];

export const AYURVEDA_PACKAGES = [
  {
    id: 'PKG-AYU-01',
    name: '7-Day Classical Stress Relief & Rejuvenation Retreat',
    sessionsCount: 7,
    price: 18500,
    includes: ['Daily Abhyanga & Shirodhara', 'Herbal Steam Baths', 'Daily Vaidya Checkup', 'Custom Herbal Teas']
  },
  {
    id: 'PKG-AYU-02',
    name: '14-Day Intensive Spine & Joint Care Program',
    sessionsCount: 14,
    price: 36000,
    includes: ['Targeted Kati/Janu Basti', 'Elakizhi Leaf Bolus Massage', 'Internal Guggulu Medicines', 'Physiotherapy Yoga Alignment']
  },
  {
    id: 'PKG-AYU-03',
    name: '21-Day Comprehensive Panchakarma Detoxification',
    sessionsCount: 21,
    price: 54000,
    includes: ['Purvakarma (Snehana & Swedana)', 'Pradhanakarma (Vamana/Virechana/Basti)', 'Paschatkarma (Samsarjana Krama Diet)', 'Doctor Consultations']
  }
];
