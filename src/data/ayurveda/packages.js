export const AYURVEDA_CONSULTATION_PRICING = [
  {
    id: 'PRC-CON-001',
    centre: 'Sanjeevani Ayurveda Wellness Centre',
    practitioner: 'Dr. Keshavan Namboothiri',
    consultationType: 'Senior Vaidya In-Person (Nadi Pariksha)',
    fee: 500,
    duration: '45 mins',
    status: 'Active'
  },
  {
    id: 'PRC-CON-002',
    centre: 'Kottakkal Arya Vaidya Sala Branch Centre',
    practitioner: 'Dr. P.K. Gangadharan Mooss',
    consultationType: 'Chief Physician Classical Review',
    fee: 600,
    duration: '30 mins',
    status: 'Active'
  },
  {
    id: 'PRC-CON-003',
    centre: 'Soukya Holistic Health Centre',
    practitioner: 'Dr. Issac Mathai',
    consultationType: 'Comprehensive Holistic Medical Consultation',
    fee: 1500,
    duration: '60 mins',
    status: 'Active'
  },
  {
    id: 'PRC-CON-004',
    centre: 'AyurVaid Integrative Care Center',
    practitioner: 'Dr. Suresh Kumar Poduval',
    consultationType: 'Clinical Protocol Assessment',
    fee: 700,
    duration: '45 mins',
    status: 'Active'
  },
  {
    id: 'PRC-CON-005',
    centre: 'Prakriti Vedic Wellness & Panchakarma',
    practitioner: 'Dr. Sharada Prasad',
    consultationType: 'Prakriti / Vikriti Dosha Analysis',
    fee: 400,
    duration: '40 mins',
    status: 'Active'
  },
  {
    id: 'PRC-CON-006',
    centre: 'Somatheeram Holistic Ayurvedic Retreat',
    practitioner: 'Dr. C.K. Sasidharan',
    consultationType: 'Residential Wellness Admission Review',
    fee: 1200,
    duration: '60 mins',
    status: 'Active'
  }
];

export const AYURVEDA_THERAPY_PRICING = [
  {
    id: 'PRC-TH-001',
    centre: 'Sanjeevani Ayurveda Wellness Centre',
    therapy: 'Shirodhara (Ksheerabala Tailam)',
    duration: '60 mins',
    price: 2200,
    status: 'Active'
  },
  {
    id: 'PRC-TH-002',
    centre: 'Sanjeevani Ayurveda Wellness Centre',
    therapy: 'Full Body Abhyanga & Medicated Swedana',
    duration: '60 mins',
    price: 1800,
    status: 'Active'
  },
  {
    id: 'PRC-TH-003',
    centre: 'Kottakkal Arya Vaidya Sala Branch Centre',
    therapy: 'Njavara Kizhi (Medicated Rice Bolus)',
    duration: '60 mins',
    price: 2400,
    status: 'Active'
  },
  {
    id: 'PRC-TH-004',
    centre: 'Kairali Ayurvedic Treatment Center',
    therapy: 'Kati Basti (Lumbar Spine Ring Protocol)',
    duration: '45 mins',
    price: 1600,
    status: 'Active'
  },
  {
    id: 'PRC-TH-005',
    centre: 'Vaidyaratnam Oushadhasala Centre',
    therapy: 'Janu Basti (Knee Joint Cartilage Care)',
    duration: '45 mins',
    price: 1500,
    status: 'Active'
  },
  {
    id: 'PRC-TH-006',
    centre: 'Somatheeram Holistic Ayurvedic Retreat',
    therapy: 'Pizhichil (Warm Herbal Oil Bath)',
    duration: '75 mins',
    price: 3800,
    status: 'Active'
  },
  {
    id: 'PRC-TH-007',
    centre: 'Prakriti Vedic Wellness & Panchakarma',
    therapy: 'Netra Tarpana (Medicated Eye Ghee Dam)',
    duration: '40 mins',
    price: 1300,
    status: 'Active'
  },
  {
    id: 'PRC-TH-008',
    centre: 'Nagarjuna Ayurvedic Centre',
    therapy: 'Udwarthanam (Herbal Lymphatic Powder Scrub)',
    duration: '45 mins',
    price: 1750,
    status: 'Active'
  }
];

export const AYURVEDA_PACKAGES = [
  {
    id: 'PKG-001',
    name: '7-Day Complete Body Rejuvenation & Detox (Rasayana)',
    centre: 'Somatheeram Holistic Ayurvedic Retreat',
    centreId: 'AYU-CTR-003',
    description: 'Comprehensive restorative package including synchronized Abhyanga, Shirodhara, herbal steam, organic meals, and personal doctor review.',
    includedServices: ['7x Synchronized Abhyanga', '4x Brahmi Shirodhara', '7x Herbal Steam Baths', 'Daily Dosha Diet', 'Yoga & Pranayama'],
    numberOfSessions: 7,
    packagePrice: 24500,
    validity: '30 Days',
    status: 'Active'
  },
  {
    id: 'PKG-002',
    name: 'Spine & Joint Intensive Relief (Kati & Janu Basti)',
    centre: 'Sanjeevani Ayurveda Wellness Centre',
    centreId: 'AYU-CTR-001',
    description: 'Targeted program for chronic back pain, lumbar spondylosis, and osteoarthritis with daily targeted oil pooling and Kizhi.',
    includedServices: ['5x Kati Basti / Janu Basti', '5x Elakizhi / Patra Pinda Sweda', '2x Senior Doctor Consultations', 'Medicated Decoction Plan'],
    numberOfSessions: 5,
    packagePrice: 12500,
    validity: '45 Days',
    status: 'Active'
  },
  {
    id: 'PKG-003',
    name: '5-Day Executive Stress Relief & Sleep Balance',
    centre: 'Soukya Holistic Health Centre',
    centreId: 'AYU-CTR-006',
    description: 'Calms Vata-Pitta overload, relieves corporate burnout, tension headaches, and promotes restorative deep sleep.',
    includedServices: ['5x Customized Shirodhara', '3x Padabhyanga Foot Massage', '5x Guided Meditation Sessions', 'Herbal Calming Tonics'],
    numberOfSessions: 5,
    packagePrice: 16500,
    validity: '30 Days',
    status: 'Active'
  },
  {
    id: 'PKG-004',
    name: '14-Day Classical Panchakarma Deep Detoxification',
    centre: 'Kottakkal Arya Vaidya Sala Branch Centre',
    centreId: 'AYU-CTR-002',
    description: 'Authentic 3-stage classic cleansing protocol: Snehana, Swedana, Vamana/Virechana, and Paschat Karma restorative diet.',
    includedServices: ['14x Daily Therapies', 'Classical Virechana / Basti Karma', 'Daily Vaidya Rounds', 'Dietary Management', 'Kashayam Dispensary'],
    numberOfSessions: 14,
    packagePrice: 36000,
    validity: '60 Days',
    status: 'Active'
  },
  {
    id: 'PKG-005',
    name: 'Weight Management & Metabolic Reset (10 Days)',
    centre: 'Arogyadhama Holistic Ayurveda & Yoga Center',
    centreId: 'AYU-CTR-014',
    description: 'Stimulates sluggish metabolic Agni, eliminates deep cellulitis, and restores lean muscle balance.',
    includedServices: ['10x Udwarthanam Powder Scrubs', '10x Medicated Steam Enclosures', 'Custom Low-Glycemic Ayurveda Diet', 'Kriya Yoga Instruction'],
    numberOfSessions: 10,
    packagePrice: 21000,
    validity: '45 Days',
    status: 'Active'
  },
  {
    id: 'PKG-006',
    name: 'Ayurvedic Skin Glow & Complexion Enhancement',
    centre: 'Vaidyashree Holistic Wellness',
    centreId: 'AYU-CTR-016',
    description: 'Classical Mukha Lepam with Kumkumadi Tailam, herbal steam, Rakta Shodhana blood detox, and botanical nourishment.',
    includedServices: ['4x Mukha Lepam Facials', '2x Full Body Herbal Scrubs', '1x Blood Purifying Herbal Regimen', 'Dermatology Review'],
    numberOfSessions: 4,
    packagePrice: 7800,
    validity: '60 Days',
    status: 'Active'
  },
  {
    id: 'PKG-007',
    name: 'Post-Natal Care & Maternal Restoration (14 Days)',
    centre: 'Sitaram Ayurveda Specialty Clinic',
    centreId: 'AYU-CTR-017',
    description: 'Traditional Sutika Paricharya care for new mothers: restorative oil baths, herbal water soaks, and lactation support.',
    includedServices: ['14x Post-Natal Abhyanga', '14x Medicated Herbal Water Baths', 'Belly Binding Therapy', 'Vethu Kootu Concoction'],
    numberOfSessions: 14,
    packagePrice: 28000,
    validity: '60 Days',
    status: 'Active'
  },
  {
    id: 'PKG-008',
    name: 'Geriatric Vitality & Joint Mobility Program (7 Days)',
    centre: 'AyurVaid Integrative Care Center',
    centreId: 'AYU-CTR-005',
    description: 'Nourishing Vata-pacifying therapies, gentle joint range of motion exercises, and memory-enhancing Rasayana herbs.',
    includedServices: ['7x Njavara Kizhi / Abhyanga', '7x Herbal Steam & Knee Care', 'Geriatric Physician Review', 'Daily Herbal Supplements'],
    numberOfSessions: 7,
    packagePrice: 14500,
    validity: '30 Days',
    status: 'Active'
  }
];
