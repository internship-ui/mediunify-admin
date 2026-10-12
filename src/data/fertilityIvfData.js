export const FERTILITY_IVF_STATS = {
  activeCycles: 42,
  embryoTransfersMonth: 11,
  consultationsToday: 18,
  clinicalSuccessRate: '68.4%',
  oocytesRetrievedMonth: 86,
  cryoStorageEmbryos: 214
};

export const FERTILITY_SPECIALISTS = [
  {
    id: 'DOC-F01',
    name: 'Dr. Nandita Palshetkar, MD, FICOG',
    role: 'Lead Reproductive Endocrinologist & IVF Specialist',
    experience: '22 Years Experience',
    availability: 'Mon - Fri (09:00 AM - 04:00 PM)',
    activePatientsCount: 28,
    specialization: 'Repetitive IVF Failure, Low Ovarian Reserve',
    status: 'Available'
  },
  {
    id: 'DOC-F02',
    name: 'Dr. Rohan Bhattacharya, PhD',
    role: 'Senior Clinical Embryologist & Lab Director',
    experience: '16 Years Experience',
    availability: 'Daily Lab Oversight',
    activePatientsCount: 36,
    specialization: 'ICSI, Blastocyst Culture, Vitrification & PGT-A',
    status: 'In Embryology Lab'
  },
  {
    id: 'DOC-F03',
    name: 'Dr. Shalini Deshpande, MS (OBGYN)',
    role: 'Fertility Specialist & Laparoscopic Surgeon',
    experience: '14 Years Experience',
    availability: 'Tue, Thu, Sat (10:00 AM - 05:00 PM)',
    activePatientsCount: 21,
    specialization: 'Endometriosis, PCOS & Ovarian Stimulation Protocols',
    status: 'Available'
  },
  {
    id: 'DOC-F04',
    name: 'Dr. Vivek Malhotra, MCh (Urology)',
    role: 'Andrologist & Male Fertility Consultant',
    experience: '12 Years Experience',
    availability: 'Wed, Fri (02:00 PM - 06:00 PM)',
    activePatientsCount: 15,
    specialization: 'Micro-TESE, Severe Oligoasthenoteratozoospermia',
    status: 'In Consultation'
  }
];

export const FERTILITY_PROTOCOLS = [
  {
    id: 'PRT-01',
    name: 'In Vitro Fertilization (IVF) Classic + Blastocyst',
    category: 'Assisted Reproductive Technology',
    averageDuration: '4 - 6 Weeks',
    successRate: '68%',
    baseCost: 145000,
    indication: 'Tubal factor, unexplained infertility, mild male factor',
    status: 'Active Protocol'
  },
  {
    id: 'PRT-02',
    name: 'Intracytoplasmic Sperm Injection (ICSI)',
    category: 'Micromanipulation ART',
    averageDuration: '4 - 6 Weeks',
    successRate: '72%',
    baseCost: 175000,
    indication: 'Severe male factor, prior low fertilization in standard IVF',
    status: 'Active Protocol'
  },
  {
    id: 'PRT-03',
    name: 'Intrauterine Insemination (IUI) - Partner/Donor',
    category: 'Basic Fertility Intervention',
    averageDuration: '2 - 3 Weeks',
    successRate: '22%',
    baseCost: 18000,
    indication: 'Mild ovulatory dysfunction, mild male factor, cervical factor',
    status: 'Active Protocol'
  },
  {
    id: 'PRT-04',
    name: 'Social / Medical Oocyte Vitrification (Egg Freezing)',
    category: 'Fertility Preservation',
    averageDuration: '2 - 3 Weeks',
    successRate: '94% Post-Thaw Survival',
    baseCost: 120000,
    indication: 'Elective age-related fertility preservation, pre-oncology',
    status: 'Active Protocol'
  },
  {
    id: 'PRT-05',
    name: 'Preimplantation Genetic Testing for Aneuploidies (PGT-A)',
    category: 'Embryo Genetics',
    averageDuration: 'Add-on 2 Weeks',
    successRate: '99% Accuracy',
    baseCost: 55000,
    indication: 'Advanced maternal age (>35y), recurrent miscarriages',
    status: 'Active Protocol'
  }
];

export const FERTILITY_CYCLES = [
  {
    cycleId: 'CYC-2026-081',
    coupleName: 'Pooja & Vikram Joshi',
    femaleAge: 32,
    maleAge: 35,
    primaryDoctor: 'Dr. Nandita Palshetkar',
    protocol: 'Self IVF + ICSI with Blastocyst Culture',
    currentStage: 'Embryo Culture (Day 3)',
    stageProgress: 65,
    cycleDay: 'Day 16',
    oocytesRetrieved: 14,
    fertilizedCount: 11,
    scheduledAction: 'Blastocyst grading on Day 5 (18 Sep)',
    status: 'In Progress'
  },
  {
    cycleId: 'CYC-2026-082',
    coupleName: 'Sneha & Amit Kapoor',
    femaleAge: 29,
    maleAge: 32,
    primaryDoctor: 'Dr. Shalini Deshpande',
    protocol: 'Stimulated IUI (Cycle 2)',
    currentStage: 'Ovulation Induction / Follicular Monitoring',
    stageProgress: 35,
    cycleDay: 'Day 9',
    oocytesRetrieved: null,
    fertilizedCount: null,
    scheduledAction: 'TV-USG Folliculometry (Dominant follicle 16mm)',
    status: 'In Progress'
  },
  {
    cycleId: 'CYC-2026-083',
    coupleName: 'Meera & Rajesh Nair',
    femaleAge: 36,
    maleAge: 38,
    primaryDoctor: 'Dr. Nandita Palshetkar',
    protocol: 'Frozen Embryo Transfer (FET)',
    currentStage: 'Embryo Transfer Scheduled',
    stageProgress: 85,
    cycleDay: 'Day 19 of HRT',
    oocytesRetrieved: null,
    fertilizedCount: null,
    scheduledAction: 'Single Euploid Blastocyst Transfer on 17 Sep, 11:30 AM',
    status: 'Scheduled'
  },
  {
    cycleId: 'CYC-2026-084',
    coupleName: 'Divya & Sanjay Verma',
    femaleAge: 31,
    maleAge: 34,
    primaryDoctor: 'Dr. Shalini Deshpande',
    protocol: 'Self IVF + PGT-A',
    currentStage: 'Post-Transfer / Luteal Support',
    stageProgress: 95,
    cycleDay: 'Day 28',
    oocytesRetrieved: 16,
    fertilizedCount: 13,
    scheduledAction: 'Serum Beta-hCG Pregnancy Blood Test on 19 Sep',
    status: 'Awaiting Results'
  },
  {
    cycleId: 'CYC-2026-085',
    coupleName: 'Aishwarya & Karthik Raman',
    femaleAge: 34,
    maleAge: 36,
    primaryDoctor: 'Dr. Nandita Palshetkar',
    protocol: 'IVF-ICSI with PGT-A',
    currentStage: 'Cycle Completed - Positive Pregnancy',
    stageProgress: 100,
    cycleDay: 'Week 6 Gestation',
    oocytesRetrieved: 12,
    fertilizedCount: 9,
    scheduledAction: 'First Viability Cardiac Ultrasound Scheduled',
    status: 'Success'
  }
];

export const FERTILITY_PACKAGES = [
  {
    id: 'PKG-IVF-01',
    name: 'Comprehensive IVF-ICSI All-Inclusive Journey',
    price: 185000,
    includes: ['All stimulation ultrasounds', 'OPU under anesthesia', 'ICSI micromanipulation', 'Day 5 Blastocyst culture', 'Single Fresh/Frozen transfer', 'First month luteal support'],
    installmentAvailable: true
  },
  {
    id: 'PKG-IVF-02',
    name: 'Two-Cycle IVF Assured Program with PGT-A',
    price: 320000,
    includes: ['2 complete OPU cycles', 'ICSI for all mature oocytes', 'PGT-A genetic screening for up to 6 embryos', 'Unlimited frozen transfers up to 1 year', 'Embryo cryopreservation (1 year)'],
    installmentAvailable: true
  },
  {
    id: 'PKG-IVF-03',
    name: 'Elective Oocyte Vitrification (Egg Freezing 5-Year Plan)',
    price: 160000,
    includes: ['Ovarian stimulation tracking', 'OPU procedure', 'High-security vitrification', '5 years liquid nitrogen biobank storage'],
    installmentAvailable: true
  }
];
