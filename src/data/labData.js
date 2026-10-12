// MediUnify Lab Admin Master Data & Operational State
// Source of truth: Test Catalogue & End-to-End Single-Thread Lab Workflow

export const LAB_CATEGORIES = [
  { id: 'cat-hema', name: 'Hematology', description: 'Complete blood counts, ESR, morphology, coagulation' },
  { id: 'cat-bioc', name: 'Clinical Biochemistry', description: 'Metabolic markers, organ function, enzymes & electrolytes' },
  { id: 'cat-endo', name: 'Endocrinology & Hormones', description: 'Thyroid, diabetes, reproductive hormones & vitamins' },
  { id: 'cat-path', name: 'Clinical Pathology & Urinalysis', description: 'Urine routine, microscopy, bodily fluids & stool examination' },
  { id: 'cat-sero', name: 'Serology & Immunology', description: 'Infectious disease markers, viral antibodies & allergy screens' },
  { id: 'cat-diag', name: 'Diagnostic Imaging & Cardio', description: '12-Lead ECG, Ultrasound Abdomen & Pelvis, Chest X-Ray' }
];

export const MASTER_TESTS = [
  {
    id: 'TST-CBC',
    code: 'HEM-CBC-01',
    name: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    panelType: 'Automated 5-Part Differential',
    parameters: [
      { name: 'Hemoglobin (Hb)', unit: 'g/dL', normalRange: '13.0 - 17.0 (M) / 12.0 - 15.5 (F)', defaultVal: '14.2' },
      { name: 'Total Leukocyte Count (TLC / WBC)', unit: 'cells/cu.mm', normalRange: '4,000 - 11,000', defaultVal: '7,400' },
      { name: 'Neutrophils', unit: '%', normalRange: '40 - 70', defaultVal: '62' },
      { name: 'Lymphocytes', unit: '%', normalRange: '20 - 40', defaultVal: '28' },
      { name: 'Eosinophils', unit: '%', normalRange: '1 - 6', defaultVal: '3' },
      { name: 'Monocytes', unit: '%', normalRange: '2 - 8', defaultVal: '5' },
      { name: 'Basophils', unit: '%', normalRange: '0 - 1', defaultVal: '0.5' },
      { name: 'Platelet Count', unit: 'lakh/cu.mm', normalRange: '1.50 - 4.50', defaultVal: '2.45' },
      { name: 'Red Blood Cell (RBC) Count', unit: 'million/cu.mm', normalRange: '4.5 - 5.9', defaultVal: '4.95' },
      { name: 'Packed Cell Volume (PCV / Hematocrit)', unit: '%', normalRange: '40 - 50', defaultVal: '43.2' },
      { name: 'Mean Corpuscular Volume (MCV)', unit: 'fL', normalRange: '80 - 100', defaultVal: '88.4' },
      { name: 'Erythrocyte Sedimentation Rate (ESR - Westergren)', unit: 'mm/1st hr', normalRange: '0 - 15 (M) / 0 - 20 (F)', defaultVal: '9' }
    ],
    sampleRequired: 'Blood',
    tubeContainer: 'EDTA blood collection tube',
    tubeIdentifier: 'Purple / EDTA (2ml)',
    collectionInstructions: 'Collect 2ml whole blood in EDTA tube according to the approved laboratory collection protocol. Invert gently 8-10 times to prevent micro-clots. Do not shake.',
    preparation: 'Non-fasting. Routine sample collection.',
    fastingRequired: false,
    tat: '2 - 4 Hours',
    price: 350,
    cptCode: '85025',
    clinicalNotes: 'Screening for anemia, infections, hematologic disorders, and acute inflammatory states.',
    status: 'Active'
  },
  {
    id: 'TST-FBS',
    code: 'BIO-GLU-01',
    name: 'Fasting Blood Glucose',
    category: 'Clinical Biochemistry',
    panelType: 'Single Parameter Enzymatic',
    parameters: [
      { name: 'Glucose - Fasting (Plasma)', unit: 'mg/dL', normalRange: '70 - 99 (Normal) | 100-125 (Prediabetes)', defaultVal: '92' }
    ],
    sampleRequired: 'Blood',
    tubeContainer: 'Sodium Fluoride / Potassium Oxalate tube',
    tubeIdentifier: 'Grey / Fluoride (2ml)',
    collectionInstructions: 'Collect 2ml blood in fluoride tube immediately after morning fasting. Invert gently 5-6 times.',
    preparation: 'Strict overnight fasting of 8 - 10 hours required. Water is permitted.',
    fastingRequired: true,
    tat: '2 Hours',
    price: 120,
    cptCode: '82947',
    clinicalNotes: 'Primary screening test for carbohydrate metabolism and diabetes mellitus diagnosis.',
    status: 'Active'
  },
  {
    id: 'TST-PPBS',
    code: 'BIO-GLU-02',
    name: 'Post Prandial Blood Glucose (PPBS)',
    category: 'Clinical Biochemistry',
    panelType: 'Single Parameter Enzymatic',
    parameters: [
      { name: 'Glucose - Post Prandial (2 hrs post meal)', unit: 'mg/dL', normalRange: '< 140 (Normal) | 140-199 (Impaired)', defaultVal: '128' }
    ],
    sampleRequired: 'Blood',
    tubeContainer: 'Sodium Fluoride tube',
    tubeIdentifier: 'Grey / Fluoride (2ml)',
    collectionInstructions: 'Sample to be collected exactly 2 hours after start of major meal.',
    preparation: 'Sample to be collected exactly 2 hours after start of major meal.',
    fastingRequired: false,
    tat: '2 Hours',
    price: 120,
    cptCode: '82947',
    clinicalNotes: 'Monitors postprandial glycemic excursions and insulin response.',
    status: 'Active'
  },
  {
    id: 'TST-HBA1C',
    code: 'BIO-HBA1C-03',
    name: 'HbA1c',
    category: 'Clinical Biochemistry',
    panelType: 'NGSP & IFCC Standardized HPLC Panel',
    parameters: [
      { name: 'HbA1c (Glycated Hemoglobin)', unit: '%', normalRange: '< 5.7 (Normal) | 5.7-6.4 (Prediabetes) | >= 6.5 (Diabetes)', defaultVal: '5.5' },
      { name: 'Estimated Average Glucose (eAG)', unit: 'mg/dL', normalRange: '90 - 130', defaultVal: '111' }
    ],
    sampleRequired: 'Blood',
    tubeContainer: 'EDTA blood collection tube',
    tubeIdentifier: 'Purple / EDTA (2ml)',
    collectionInstructions: 'Collect 2ml whole blood in EDTA tube for HPLC testing. Invert gently 8 times.',
    preparation: 'Non-fasting. Can be taken at any time of day.',
    fastingRequired: false,
    tat: '3 - 4 Hours',
    price: 550,
    cptCode: '83036',
    clinicalNotes: 'Gold standard index reflecting 3-month retrospective glycemic control.',
    status: 'Active'
  },
  {
    id: 'TST-LIPID',
    code: 'BIO-LIP-04',
    name: 'Lipid Profile',
    category: 'Clinical Biochemistry',
    panelType: 'Automated Photometric Panel (8 Parameters)',
    parameters: [
      { name: 'Total Cholesterol', unit: 'mg/dL', normalRange: '< 200 (Desirable) | 200-239 (Borderline)', defaultVal: '178' },
      { name: 'Triglycerides', unit: 'mg/dL', normalRange: '< 150 (Normal) | 150-199 (Borderline)', defaultVal: '135' },
      { name: 'HDL Cholesterol (Good Cholesterol)', unit: 'mg/dL', normalRange: '> 40 (M) / > 50 (F)', defaultVal: '48' },
      { name: 'LDL Cholesterol (Direct / Calculated)', unit: 'mg/dL', normalRange: '< 100 (Optimal) | 100-129 (Near Optimal)', defaultVal: '98' },
      { name: 'VLDL Cholesterol', unit: 'mg/dL', normalRange: '10 - 30', defaultVal: '24' },
      { name: 'Non-HDL Cholesterol', unit: 'mg/dL', normalRange: '< 130', defaultVal: '118' },
      { name: 'Total Cholesterol / HDL Ratio', unit: 'Ratio', normalRange: '3.3 - 4.4', defaultVal: '3.7' },
      { name: 'LDL / HDL Ratio', unit: 'Ratio', normalRange: '1.5 - 3.0', defaultVal: '2.0' }
    ],
    sampleRequired: 'Blood',
    tubeContainer: 'Gel Separator / SST Vacutainer tube',
    tubeIdentifier: 'Gold / SST (4ml)',
    collectionInstructions: 'Collect 4ml venous blood into SST gel tube. Allow to clot for 30 minutes before centrifugation.',
    preparation: '10 to 12 hours strict overnight fasting required. Water allowed.',
    fastingRequired: true,
    tat: '4 - 6 Hours',
    price: 650,
    cptCode: '80061',
    clinicalNotes: 'Atherosclerotic cardiovascular disease (ASCVD) risk stratification.',
    status: 'Active'
  },
  {
    id: 'TST-LFT',
    code: 'BIO-LFT-05',
    name: 'Liver Function Test',
    category: 'Clinical Biochemistry',
    panelType: 'Multi-Enzymatic Liver Profile (11 Parameters)',
    parameters: [
      { name: 'Total Bilirubin', unit: 'mg/dL', normalRange: '0.2 - 1.2', defaultVal: '0.8' },
      { name: 'Direct Bilirubin (Conjugated)', unit: 'mg/dL', normalRange: '0.0 - 0.3', defaultVal: '0.2' },
      { name: 'Indirect Bilirubin (Unconjugated)', unit: 'mg/dL', normalRange: '0.1 - 0.9', defaultVal: '0.6' },
      { name: 'SGOT / AST (Aspartate Aminotransferase)', unit: 'U/L', normalRange: '10 - 40', defaultVal: '24' },
      { name: 'SGPT / ALT (Alanine Aminotransferase)', unit: 'U/L', normalRange: '7 - 45', defaultVal: '28' },
      { name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', normalRange: '44 - 147', defaultVal: '88' },
      { name: 'Gamma Glutamyl Transferase (GGT)', unit: 'U/L', normalRange: '9 - 48', defaultVal: '22' },
      { name: 'Total Protein', unit: 'g/dL', normalRange: '6.4 - 8.3', defaultVal: '7.2' },
      { name: 'Serum Albumin', unit: 'g/dL', normalRange: '3.5 - 5.2', defaultVal: '4.3' },
      { name: 'Serum Globulin', unit: 'g/dL', normalRange: '2.0 - 3.5', defaultVal: '2.9' },
      { name: 'Albumin / Globulin (A/G) Ratio', unit: 'Ratio', normalRange: '1.1 - 2.2', defaultVal: '1.48' }
    ],
    sampleRequired: 'Blood',
    tubeContainer: 'Clot Activator Vacutainer tube',
    tubeIdentifier: 'Red / Gold Top (4ml)',
    collectionInstructions: 'Collect 4ml venous blood according to approved protocol. Avoid hemolysis.',
    preparation: 'Overnight fasting of 8 - 10 hours recommended.',
    fastingRequired: true,
    tat: '4 - 6 Hours',
    price: 750,
    cptCode: '80076',
    clinicalNotes: 'Evaluates hepatic parenchymal integrity, biliary excretory capacity & synthetic capability.',
    status: 'Active'
  },
  {
    id: 'TST-KFT',
    code: 'BIO-KFT-06',
    name: 'Kidney Function Test',
    category: 'Clinical Biochemistry',
    panelType: 'Renal Function Profile (8 Parameters)',
    parameters: [
      { name: 'Blood Urea', unit: 'mg/dL', normalRange: '15 - 40', defaultVal: '26' },
      { name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', normalRange: '7 - 20', defaultVal: '12.1' },
      { name: 'Serum Creatinine (Enzymatic)', unit: 'mg/dL', normalRange: '0.7 - 1.3 (M) / 0.5 - 1.1 (F)', defaultVal: '0.92' },
      { name: 'eGFR (CKD-EPI Formula)', unit: 'mL/min/1.73m²', normalRange: '> 90 (Optimal)', defaultVal: '104' },
      { name: 'Serum Uric Acid', unit: 'mg/dL', normalRange: '3.5 - 7.2 (M) / 2.6 - 6.0 (F)', defaultVal: '5.2' },
      { name: 'Serum Sodium (Na+)', unit: 'mEq/L', normalRange: '136 - 145', defaultVal: '141' },
      { name: 'Serum Potassium (K+)', unit: 'mEq/L', normalRange: '3.5 - 5.1', defaultVal: '4.2' },
      { name: 'Serum Chloride (Cl-)', unit: 'mEq/L', normalRange: '98 - 107', defaultVal: '102' }
    ],
    sampleRequired: 'Blood',
    tubeContainer: 'Clot Activator Vacutainer tube',
    tubeIdentifier: 'Red / Gold Top (4ml)',
    collectionInstructions: 'Collect 4ml venous blood according to approved laboratory protocol.',
    preparation: 'Fasting preferred. Adequate hydration with water.',
    fastingRequired: true,
    tat: '4 - 6 Hours',
    price: 750,
    cptCode: '80053',
    clinicalNotes: 'Glomerular filtration rate, nitrogenous waste excretion & electrolyte balance.',
    status: 'Active'
  },
  {
    id: 'TST-URINE',
    code: 'PAT-URN-11',
    name: 'Routine Urine Examination',
    category: 'Clinical Pathology & Urinalysis',
    panelType: 'Chemical Strip & Automated Microscopy',
    parameters: [
      { name: 'Color & Appearance', unit: 'Visual', normalRange: 'Pale Yellow, Clear', defaultVal: 'Pale Yellow, Clear' },
      { name: 'Specific Gravity', unit: 'Index', normalRange: '1.005 - 1.030', defaultVal: '1.018' },
      { name: 'pH', unit: 'pH', normalRange: '5.0 - 7.5', defaultVal: '6.0' },
      { name: 'Protein / Albumin', unit: 'Semi-Quant', normalRange: 'Nil / Negative', defaultVal: 'Nil' },
      { name: 'Urine Glucose', unit: 'Semi-Quant', normalRange: 'Nil / Negative', defaultVal: 'Nil' },
      { name: 'Ketone Bodies', unit: 'Semi-Quant', normalRange: 'Negative', defaultVal: 'Negative' },
      { name: 'Pus Cells (Leukocytes)', unit: '/HPF', normalRange: '0 - 4', defaultVal: '1 - 2' },
      { name: 'Red Blood Cells (RBCs)', unit: '/HPF', normalRange: '0 - 2', defaultVal: 'Nil' },
      { name: 'Epithelial Cells', unit: '/HPF', normalRange: 'Few / 0 - 5', defaultVal: '2 - 3' },
      { name: 'Casts / Crystals', unit: '/LPF', normalRange: 'Absent / None seen', defaultVal: 'None seen' },
      { name: 'Bacteria', unit: 'Microscopy', normalRange: 'Absent', defaultVal: 'Absent' }
    ],
    sampleRequired: 'Urine',
    tubeContainer: 'Urine specimen container',
    tubeIdentifier: 'Sterile Urine Container (30-50ml)',
    collectionInstructions: 'Midstream clean-catch urine specimen in sterile leakproof container.',
    preparation: 'First morning midstream clean-catch urine preferred. Clean genital area before collection.',
    fastingRequired: false,
    tat: '2 - 3 Hours',
    price: 180,
    cptCode: '81001',
    clinicalNotes: 'Detection of urinary tract infections, occult renal disease, proteinuria, and systemic metabolic states.',
    status: 'Active'
  },
  {
    id: 'TST-THYROID',
    code: 'END-THY-07',
    name: 'Thyroid Profile Total (T3, T4, TSH)',
    category: 'Endocrinology & Hormones',
    panelType: 'Chemiluminescence Immunoassay (CLIA)',
    parameters: [
      { name: 'Total Triiodothyronine (Total T3)', unit: 'ng/dL', normalRange: '80 - 200', defaultVal: '124' },
      { name: 'Total Thyroxine (Total T4)', unit: 'µg/dL', normalRange: '5.1 - 12.4', defaultVal: '8.4' },
      { name: 'Thyroid Stimulating Hormone (TSH)', unit: 'µIU/mL', normalRange: '0.45 - 4.50', defaultVal: '2.15' }
    ],
    sampleRequired: 'Blood',
    tubeContainer: 'Plain / Gel Vacutainer tube',
    tubeIdentifier: 'Gold / Red Top (4ml)',
    collectionInstructions: 'Morning blood draw preferred. Take daily thyroid medications after blood collection.',
    preparation: 'Morning blood draw preferred.',
    fastingRequired: false,
    tat: '6 - 8 Hours',
    price: 600,
    cptCode: '84443',
    clinicalNotes: 'Screening for hypothyroidism, hyperthyroidism and pituitary-thyroid axis regulation.',
    status: 'Active'
  },
  {
    id: 'TST-VITD',
    code: 'END-VITD-08',
    name: 'Vitamin D (25-Hydroxy D2 + D3)',
    category: 'Endocrinology & Hormones',
    panelType: 'CLIA Quantitative Assay',
    parameters: [
      { name: '25-Hydroxy Vitamin D Total', unit: 'ng/mL', normalRange: '30 - 100 (Sufficient) | 20-29 (Insufficient) | <20 (Deficient)', defaultVal: '34.8' }
    ],
    sampleRequired: 'Blood',
    tubeContainer: 'Plain / Gel Vacutainer tube',
    tubeIdentifier: 'Gold / Red Top (4ml)',
    collectionInstructions: 'Collect 4ml venous blood into SST tube.',
    preparation: 'Fasting not required. Avoid high-dose vitamin supplements morning of test.',
    fastingRequired: false,
    tat: '12 - 24 Hours',
    price: 900,
    cptCode: '82306',
    clinicalNotes: 'Bone mineralization, calcium homeostasis, and immune resilience screening.',
    status: 'Active'
  },
  {
    id: 'TST-VITB12',
    code: 'END-B12-09',
    name: 'Vitamin B12 (Cyanocobalamin)',
    category: 'Endocrinology & Hormones',
    panelType: 'CLIA Quantitative Assay',
    parameters: [
      { name: 'Vitamin B12 (Cobalamin)', unit: 'pg/mL', normalRange: '211 - 911 (Normal) | <200 (Deficient)', defaultVal: '430' }
    ],
    sampleRequired: 'Blood',
    tubeContainer: 'Plain / Gel Vacutainer tube',
    tubeIdentifier: 'Gold / Red Top (4ml)',
    collectionInstructions: 'Overnight fasting of 8 hours preferred. Light protected transport required.',
    preparation: 'Overnight fasting of 8 hours preferred.',
    fastingRequired: true,
    tat: '12 - 24 Hours',
    price: 800,
    cptCode: '82607',
    clinicalNotes: 'Essential for erythropoiesis, neurological function and cellular DNA synthesis.',
    status: 'Active'
  },
  {
    id: 'TST-IRON',
    code: 'HEM-IRON-10',
    name: 'Iron Profile with Ferritin',
    category: 'Hematology',
    panelType: 'Spectrophotometric & CLIA Panel',
    parameters: [
      { name: 'Serum Iron', unit: 'µg/dL', normalRange: '60 - 170 (M) / 50 - 150 (F)', defaultVal: '98' },
      { name: 'Total Iron Binding Capacity (TIBC)', unit: 'µg/dL', normalRange: '250 - 450', defaultVal: '320' },
      { name: 'Serum Ferritin', unit: 'ng/mL', normalRange: '30 - 400 (M) / 15 - 150 (F)', defaultVal: '82' }
    ],
    sampleRequired: 'Blood',
    tubeContainer: 'Gel Vacutainer tube',
    tubeIdentifier: 'Gold Top (4ml)',
    collectionInstructions: 'Morning fasting sample mandatory. Avoid iron supplements for 24 hours.',
    preparation: 'Morning fasting sample mandatory.',
    fastingRequired: true,
    tat: '8 - 12 Hours',
    price: 950,
    cptCode: '83540',
    clinicalNotes: 'Differential diagnosis of iron deficiency anemia vs anemia of chronic disease.',
    status: 'Active'
  }
];

// Popular & Featured Checkup Packages
export const POPULAR_CHECKUPS = [
  {
    id: 'PKG-POP-00',
    code: 'PKG-CHS-01',
    name: 'Complete Health Screening Package',
    category: 'Full Body Health Screening',
    description: 'Comprehensive 7-panel screening covering Complete Blood Count (CBC), Fasting Blood Glucose, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test, and Routine Urine Examination.',
    suggestedPrice: 3499,
    originalPrice: 6500,
    includedParametersCount: 52,
    includedCategories: ['Hematology', 'Clinical Biochemistry', 'Clinical Pathology & Urinalysis'],
    includedPackagesCount: 7,
    testCodes: ['HEM-CBC-01', 'BIO-GLU-01', 'BIO-HBA1C-03', 'BIO-LIP-04', 'BIO-LFT-05', 'BIO-KFT-06', 'PAT-URN-11'],
    clinicalNotes: 'Primary demonstration package including automated hemogram, glycemic assessment, full lipid fraction, hepatic enzymes, renal electrolytes and routine urinalysis.',
    fastingRequired: true,
    prepSummary: 'Follow the preparation instructions configured for the booked tests/package. Overnight fasting 10-12 hours required. Morning midstream clean-catch urine specimen.',
    tat: '8 - 12 Hours',
    popularTag: 'Primary Demo Package',
    status: 'Active'
  },
  {
    id: 'PKG-POP-01',
    code: 'POP-EXE-01',
    name: 'MediUnify Executive Essentials',
    category: 'Executive Health Checkup',
    description: 'Comprehensive vital organ screening designed for working professionals and executives.',
    suggestedPrice: 2499,
    originalPrice: 5200,
    includedParametersCount: 68,
    includedCategories: ['Hematology', 'Clinical Biochemistry', 'Endocrinology & Hormones', 'Urinalysis'],
    includedPackagesCount: 8,
    testCodes: ['HEM-CBC-01', 'BIO-GLU-01', 'BIO-HBA1C-03', 'BIO-LIP-04', 'BIO-LFT-05', 'BIO-KFT-06', 'END-THY-07', 'PAT-URN-11'],
    clinicalNotes: 'Complete baseline screening covering cardiac lipids, hepatic function, renal profile, diabetes and thyroid.',
    fastingRequired: true,
    prepSummary: 'Strict overnight fasting of 10 - 12 hours. Morning midstream urine sample.',
    tat: 'Same Day (8 - 12 Hours)',
    popularTag: 'Most Booked',
    status: 'Active'
  },
  {
    id: 'PKG-POP-02',
    code: 'POP-DIA-04',
    name: 'MediUnify Diabetic & Renal Care Screen',
    category: 'Chronic Disease Management',
    description: 'Dedicated monitoring protocol for individuals with diabetes, prediabetes, or metabolic syndrome.',
    suggestedPrice: 1799,
    originalPrice: 3800,
    includedParametersCount: 45,
    includedCategories: ['Clinical Biochemistry', 'Urinalysis', 'Hematology'],
    includedPackagesCount: 6,
    testCodes: ['HEM-CBC-01', 'BIO-GLU-01', 'BIO-GLU-02', 'BIO-HBA1C-03', 'BIO-LIP-04', 'BIO-KFT-06', 'PAT-URN-11'],
    clinicalNotes: 'Includes Fasting and Post Prandial sugar, HPLC HbA1c, full lipid fraction, eGFR and urine microprotein detection.',
    fastingRequired: true,
    prepSummary: 'Fasting blood draw first, followed by second draw 2 hours post breakfast.',
    tat: '6 - 8 Hours',
    popularTag: 'Targeted',
    status: 'Active'
  },
  {
    id: 'PKG-POP-03',
    code: 'POP-CAR-05',
    name: 'MediUnify Cardiac Risk & Lipid Guard',
    category: 'Cardiovascular Health',
    description: 'Advanced assessment for cardiovascular risk markers, vascular lipids and metabolic health.',
    suggestedPrice: 2199,
    originalPrice: 4500,
    includedParametersCount: 38,
    includedCategories: ['Clinical Biochemistry', 'Hematology'],
    includedPackagesCount: 5,
    testCodes: ['HEM-CBC-01', 'BIO-LIP-04', 'BIO-GLU-01', 'BIO-HBA1C-03', 'BIO-KFT-06'],
    clinicalNotes: 'Direct LDL fractions, total cholesterol ratios, glucose control and renal markers.',
    fastingRequired: true,
    prepSummary: 'Strict 12 hours fasting.',
    tat: '8 - 12 Hours',
    popularTag: 'Heart Special',
    status: 'Active'
  }
];

export const CURATED_CHECKUPS = [
  {
    id: 'PKG-CUR-01',
    code: 'CUR-LSW-01',
    name: 'MediUnify Vitamin & Nutrition Profile',
    category: 'Lifestyle & Wellness',
    description: 'Targeted nutritional panel diagnosing deep vitamin, mineral, and metabolic micronutrient deficiencies.',
    suggestedPrice: 1999,
    originalPrice: 4200,
    includedParametersCount: 26,
    includedCategories: ['Endocrinology & Hormones', 'Hematology', 'Clinical Biochemistry'],
    includedPackagesCount: 5,
    testCodes: ['END-VITD-08', 'END-B12-09', 'HEM-IRON-10', 'HEM-CBC-01'],
    clinicalNotes: 'Identifies micronutrient malnutrition, subclinical bone demineralization, and anemia triggers.',
    fastingRequired: true,
    prepSummary: 'Overnight fasting of 8 hours. Avoid dietary supplements 24h prior.',
    tat: '12 - 24 Hours',
    curatedTag: 'Nutrition & Energy',
    status: 'Active'
  }
];

// Lab Processing Centers & Partner Diagnostics
export const LAB_CENTERS = [
  {
    id: 'CTR-301',
    code: 'NOVA-LAB-01',
    name: 'Nova Diagnostics & Laboratory Centre',
    address: 'Plot 42/B, Saraswathipuram Industrial Suburb, Mysuru - 570009',
    city: 'Mysuru',
    contactPhone: '+91 821 2548900',
    contactEmail: 'nova.diagnostics@partnerlabs.in',
    operatingHours: '24x7 (Round the Clock Operational)',
    availableTestsCount: 160,
    homeCollectionHub: true,
    managerName: 'Dr. Ramesh S. Rao, MD (Chief Pathologist)',
    accreditation: 'NABL Accredited & ISO 15189:2022 Certified',
    status: 'Active'
  },
  {
    id: 'CTR-302',
    code: 'APOLLO-LAB-02',
    name: 'Apollo Diagnostics',
    address: '14th Cross, Kuvempunagar Main Road, Mysuru - 570023',
    city: 'Mysuru',
    contactPhone: '+91 821 2419820',
    contactEmail: 'mysuru.hub@apollodiagnostics.in',
    operatingHours: '06:30 AM - 09:30 PM (Mon - Sun)',
    availableTestsCount: 145,
    homeCollectionHub: true,
    managerName: 'Dr. Sanjay Kulkarni, MD Path',
    accreditation: 'NABL & CAP Accredited Laboratory',
    status: 'Active'
  },
  {
    id: 'CTR-303',
    code: 'CITY-LAB-03',
    name: 'CityCare Labs & Diagnostics',
    address: 'Shop 8, Jayalakshmipuram 1st Main, Mysuru - 570012',
    city: 'Mysuru',
    contactPhone: '+91 821 2345678',
    contactEmail: 'contact@citycarelabs.in',
    operatingHours: '07:00 AM - 08:30 PM (Mon - Sat)',
    availableTestsCount: 110,
    homeCollectionHub: true,
    managerName: 'Dr. Ananya Roy, MD (Biochem)',
    accreditation: 'NABL Accredited Medical Lab',
    status: 'Active'
  },
  {
    id: 'CTR-304',
    code: 'MU-REF-04',
    name: 'MediUnify Central Reference Laboratory - Main Hub',
    address: 'Plot 12, Outer Ring Road, Vijayanagar, Bengaluru - 560040',
    city: 'Bengaluru',
    contactPhone: '+91 80 25489000',
    contactEmail: 'central.lab@mediunify.com',
    operatingHours: '24x7 (Round the Clock Operational)',
    availableTestsCount: 180,
    homeCollectionHub: true,
    managerName: 'Dr. Ramesh S. Rao (Chief Pathologist)',
    accreditation: 'NABL Accredited Reference Hub',
    status: 'Active'
  }
];

// Phlebotomists / Collection Staff
export const COLLECTION_STAFF = [
  {
    id: 'STF-401',
    staffId: 'PH1004',
    name: 'Suresh Kumar',
    phone: '+91 98765 43211',
    email: 'suresh.kumar@mediunify.com',
    serviceArea: 'Vijayanagar & Bengaluru (Near Patient)',
    specialization: 'Senior Phlebotomist & Vacutainer Specialist',
    workingHours: '06:00 AM - 03:00 PM',
    availability: 'Available',
    todaysAssignments: 3,
    completedCollections: 2,
    rating: '4.95/5.0',
    vehicleNumber: 'KA-04-SK-1004',
    status: 'Active'
  },
  {
    id: 'STF-402',
    staffId: 'PH1002',
    name: 'Meena Rao',
    phone: '+91 98765 43212',
    email: 'meena.rao@mediunify.com',
    serviceArea: 'Indiranagar & Central Bengaluru',
    specialization: 'Clinical Pathology & Pediatric Draw',
    workingHours: '06:30 AM - 03:30 PM',
    availability: 'Available',
    todaysAssignments: 2,
    completedCollections: 2,
    rating: '4.9/5.0',
    vehicleNumber: 'KA-04-MR-2002',
    status: 'Active'
  },
  {
    id: 'STF-403',
    staffId: 'PH1003',
    name: 'Arun Kumar',
    phone: '+91 98765 43213',
    email: 'arun.kumar@mediunify.com',
    serviceArea: 'Hebbal & Outer Ring Road',
    specialization: 'Emergency Draw & Cold Chain Transport',
    workingHours: '07:00 AM - 04:00 PM',
    availability: 'Busy',
    todaysAssignments: 5,
    completedCollections: 3,
    rating: '4.85/5.0',
    vehicleNumber: 'KA-04-AK-3003',
    status: 'Active'
  }
];

// Initial Operational Orders across all workflow stages
export const INITIAL_LAB_ORDERS = [
  // PRIMARY DEMONSTRATION ORDER (LAB10001)
  {
    orderId: 'LAB10001',
    patient: {
      name: 'Rahul Kumar',
      patientId: 'PAT1001',
      age: 32,
      gender: 'Male',
      phone: '9876543210',
      email: 'rahul.kumar@gmail.com',
      address: 'Vijayanagar, Bengaluru'
    },
    bookedItem: {
      name: 'Complete Health Screening Package',
      code: 'PKG-CHS-01',
      type: 'Package',
      category: 'Full Body Health Screening',
      description: 'Comprehensive 7-panel screening covering Complete Blood Count (CBC), Fasting Blood Glucose, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test, and Routine Urine Examination.',
      price: 3499,
      tat: '8 - 12 Hours',
      fastingRequired: true,
      preparation: 'Yes — as specified for the booked tests. Follow the preparation instructions configured for the booked tests/package.'
    },
    includedTests: [
      {
        code: 'HEM-CBC-01',
        name: 'Complete Blood Count (CBC)',
        category: 'Hematology',
        sampleRequired: 'Blood',
        tubeContainer: 'EDTA blood collection tube',
        tubeIdentifier: 'Purple / EDTA (2ml)',
        collectionInstructions: 'Collect 2ml whole blood in EDTA tube according to approved laboratory collection protocol. Invert gently 8-10 times.',
        preparation: 'Non-fasting. Routine sample collection.',
        fastingRequired: false,
        tat: '2 - 4 Hours',
        parametersCount: 12,
        parametersSummary: 'Hemoglobin, TLC, Platelets, RBC, MCV, ESR, Differential'
      },
      {
        code: 'BIO-GLU-01',
        name: 'Fasting Blood Glucose',
        category: 'Clinical Biochemistry',
        sampleRequired: 'Blood',
        tubeContainer: 'Sodium Fluoride / Potassium Oxalate tube',
        tubeIdentifier: 'Grey / Fluoride (2ml)',
        collectionInstructions: 'Collect 2ml blood in fluoride tube immediately after morning fasting. Invert gently 5-6 times.',
        preparation: 'Strict overnight fasting of 8 - 10 hours required. Water is permitted.',
        fastingRequired: true,
        tat: '2 Hours',
        parametersCount: 1,
        parametersSummary: 'Fasting Plasma Glucose'
      },
      {
        code: 'BIO-HBA1C-03',
        name: 'HbA1c',
        category: 'Clinical Biochemistry',
        sampleRequired: 'Blood',
        tubeContainer: 'EDTA blood collection tube',
        tubeIdentifier: 'Purple / EDTA (2ml)',
        collectionInstructions: 'Collect 2ml whole blood in EDTA tube for HPLC testing. Invert gently 8 times.',
        preparation: 'Non-fasting. Can be taken at any time of day.',
        fastingRequired: false,
        tat: '3 - 4 Hours',
        parametersCount: 2,
        parametersSummary: 'HbA1c %, Estimated Average Glucose (eAG)'
      },
      {
        code: 'BIO-LIP-04',
        name: 'Lipid Profile',
        category: 'Clinical Biochemistry',
        sampleRequired: 'Blood',
        tubeContainer: 'Gel Separator / SST Vacutainer tube',
        tubeIdentifier: 'Gold / SST (4ml)',
        collectionInstructions: 'Collect 4ml venous blood into SST gel tube. Allow to clot for 30 minutes before centrifugation.',
        preparation: '10 to 12 hours strict fasting required. Water allowed.',
        fastingRequired: true,
        tat: '4 - 6 Hours',
        parametersCount: 8,
        parametersSummary: 'Total Cholesterol, Triglycerides, HDL, LDL, VLDL, Non-HDL'
      },
      {
        code: 'BIO-LFT-05',
        name: 'Liver Function Test',
        category: 'Clinical Biochemistry',
        sampleRequired: 'Blood',
        tubeContainer: 'Clot Activator Vacutainer tube',
        tubeIdentifier: 'Red / Gold Top (4ml)',
        collectionInstructions: 'Collect 4ml venous blood according to approved protocol. Avoid hemolysis.',
        preparation: 'Overnight fasting of 8 - 10 hours recommended.',
        fastingRequired: true,
        tat: '4 - 6 Hours',
        parametersCount: 11,
        parametersSummary: 'Bilirubin (T/D/I), SGOT, SGPT, ALP, GGT, Total Protein, Albumin, Globulin, A/G Ratio'
      },
      {
        code: 'BIO-KFT-06',
        name: 'Kidney Function Test',
        category: 'Clinical Biochemistry',
        sampleRequired: 'Blood',
        tubeContainer: 'Clot Activator Vacutainer tube',
        tubeIdentifier: 'Red / Gold Top (4ml)',
        collectionInstructions: 'Collect 4ml venous blood according to approved protocol.',
        preparation: 'Fasting preferred. Adequate hydration with water.',
        fastingRequired: true,
        tat: '4 - 6 Hours',
        parametersCount: 8,
        parametersSummary: 'Urea, BUN, Creatinine, eGFR, Uric Acid, Electrolytes (Na+, K+, Cl-)'
      },
      {
        code: 'PAT-URN-11',
        name: 'Routine Urine Examination',
        category: 'Clinical Pathology & Urinalysis',
        sampleRequired: 'Urine',
        tubeContainer: 'Urine specimen container',
        tubeIdentifier: 'Sterile Urine Container (30-50ml)',
        collectionInstructions: 'Midstream clean-catch urine specimen in sterile leakproof container.',
        preparation: 'First morning midstream clean-catch urine preferred. Clean genital area before collection.',
        fastingRequired: false,
        tat: '2 - 3 Hours',
        parametersCount: 11,
        parametersSummary: 'Physical, Chemical & Microscopic (Pus cells, RBCs, Protein, Glucose, Epithelial cells)'
      }
    ],
    requiredSamples: [
      {
        sampleNumber: 'Sample 01',
        sampleType: 'Blood',
        container: 'EDTA blood collection tube',
        tubeIdentifier: 'Purple / EDTA (2ml)',
        tests: 'Complete Blood Count (CBC)',
        status: 'Pending'
      },
      {
        sampleNumber: 'Sample 02',
        sampleType: 'Blood',
        container: 'Sodium Fluoride & SST Gel Vacutainer tubes',
        tubeIdentifier: 'Grey (2ml) & Gold Top (4ml)',
        tests: 'Fasting Blood Glucose, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test',
        status: 'Pending'
      },
      {
        sampleNumber: 'Sample 03',
        sampleType: 'Urine',
        container: 'Urine specimen container',
        tubeIdentifier: 'Sterile Urine Container (50ml)',
        tests: 'Routine Urine Examination',
        status: 'Pending'
      }
    ],
    collection: {
      method: 'Home Sample Collection',
      scheduledDate: '02 October 2026',
      scheduledTime: '10:00 AM',
      center: 'Nova Diagnostics & Laboratory Centre',
      patientAddress: 'Vijayanagar, Bengaluru',
      assignedCollector: {
        id: 'PH1004',
        name: 'Suresh Kumar',
        phone: '+91 98765 43211',
        vehicle: 'KA-04-SK-1004',
        status: 'Available',
        location: 'Near Patient'
      },
      collectorMilestones: [
        { step: 'ASSIGNED', title: 'Phlebotomist Assigned', timestamp: '01 Oct 10:30 AM', status: 'pending' },
        { step: 'ACCEPTED', title: 'Phlebotomist Accepted', timestamp: '02 Oct 09:20 AM', status: 'pending' },
        { step: 'ON_THE_WAY', title: 'On The Way', timestamp: '02 Oct 09:30 AM', status: 'pending' },
        { step: 'ARRIVED', title: 'Arrived at Patient', timestamp: '02 Oct 09:55 AM', status: 'pending' },
        { step: 'PATIENT_VERIFIED', title: 'Patient Verified', timestamp: '02 Oct 09:58 AM', status: 'pending' },
        { step: 'COLLECTION_STARTED', title: 'Collection Started', timestamp: '02 Oct 10:00 AM', status: 'pending' },
        { step: 'SAMPLE_COLLECTED', title: 'Samples Collected', timestamp: '02 Oct 10:12 AM', status: 'pending' }
      ]
    },
    sampleDetails: {
      status: 'Pending',
      sampleIds: ['SMP10001', 'SMP10002', 'SMP10003'],
      barcode: 'BC10001-A',
      collectionTime: '02 October 2026, 10:12 AM',
      receivedTime: '02 October 2026, 11:05 AM',
      collectorName: 'Suresh Kumar',
      condition: 'Good / Cold Chain Intact',
      remarks: 'All 3 required specimen containers sealed and barcoded.',
      samples: [
        {
          sampleId: 'SMP10001',
          sampleNumber: 'Sample 01',
          sampleType: 'Blood',
          relatedTests: 'Complete Blood Count (CBC)',
          testCodes: ['HEM-CBC-01'],
          tubeContainer: 'EDTA blood collection tube',
          tubeIdentifier: 'Purple / EDTA (2ml)',
          status: 'Pending',
          collectionTime: '10:12 AM',
          receivedTime: '11:05 AM',
          collector: 'Suresh Kumar',
          condition: 'Good',
          barcode: 'BC10001-A'
        },
        {
          sampleId: 'SMP10002',
          sampleNumber: 'Sample 02',
          sampleType: 'Blood',
          relatedTests: 'Fasting Blood Glucose, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test',
          testCodes: ['BIO-GLU-01', 'BIO-HBA1C-03', 'BIO-LIP-04', 'BIO-LFT-05', 'BIO-KFT-06'],
          tubeContainer: 'Sodium Fluoride & SST Gel Vacutainer tubes',
          tubeIdentifier: 'Grey (2ml) & Gold Top (4ml)',
          status: 'Pending',
          collectionTime: '10:12 AM',
          receivedTime: '11:05 AM',
          collector: 'Suresh Kumar',
          condition: 'Good',
          barcode: 'BC10001-B'
        },
        {
          sampleId: 'SMP10003',
          sampleNumber: 'Sample 03',
          sampleType: 'Urine',
          relatedTests: 'Routine Urine Examination',
          testCodes: ['PAT-URN-11'],
          tubeContainer: 'Urine specimen container',
          tubeIdentifier: 'Sterile Urine Container (50ml)',
          status: 'Pending',
          collectionTime: '10:12 AM',
          receivedTime: '11:05 AM',
          collector: 'Suresh Kumar',
          condition: 'Good',
          barcode: 'BC10001-C'
        }
      ],
      issuesHistory: []
    },
    processingDetails: {
      status: 'Pending',
      analyzer: 'Beckman Coulter AU480 & Sysmex XN-550',
      startedAt: '02 Oct 11:30 AM',
      expectedCompletion: '03 Oct 09:30 AM',
      completedAt: null,
      testsStatus: [
        { testName: 'Complete Blood Count (CBC)', code: 'HEM-CBC-01', analyzer: 'Sysmex XN-550', status: 'Pending' },
        { testName: 'Fasting Blood Glucose', code: 'BIO-GLU-01', analyzer: 'Beckman AU480', status: 'Pending' },
        { testName: 'HbA1c', code: 'BIO-HBA1C-03', analyzer: 'Bio-Rad D-10 HPLC', status: 'Pending' },
        { testName: 'Lipid Profile', code: 'BIO-LIP-04', analyzer: 'Beckman AU480', status: 'Pending' },
        { testName: 'Liver Function Test', code: 'BIO-LFT-05', analyzer: 'Beckman AU480', status: 'Pending' },
        { testName: 'Kidney Function Test', code: 'BIO-KFT-06', analyzer: 'Beckman AU480', status: 'Pending' },
        { testName: 'Routine Urine Examination', code: 'PAT-URN-11', analyzer: 'Dirui FUS-2000 Urinalysis', status: 'Pending' }
      ]
    },
    reportDetails: {
      reportId: 'REP10001',
      status: 'Pending',
      uploadedDate: '03 Oct 09:30 AM',
      verifiedDate: '03 Oct 10:00 AM',
      deliveredDate: '03 Oct 10:05 AM',
      verifiedBy: 'Dr. Ramesh S. Rao, MD (Chief Pathologist)',
      deliveryStatus: 'Pending Verification',
      deliveryChannels: ['WhatsApp (+91 9876543210)', 'Email (rahul.kumar@gmail.com)']
    },
    orderStatus: 'NEW',
    bookingType: 'Home Sample Collection',
    preferredDate: '02 October 2026',
    preferredTimeSlot: '10:00 AM',
    center: 'MediUnify Central Reference Laboratory - Main Hub',
    paymentStatus: 'Paid',
    paymentMethod: 'Online Payment (Razorpay UPI)',
    totalAmount: 3499,
    assignedStaff: 'Suresh Kumar',
    sampleId: 'SMP10001',
    reportId: 'REP10001',
    bookingDate: '2026-10-01 10:20 AM',
    timeline: [
      {
        step: 'NEW',
        title: 'Order Placed by Patient',
        timestamp: '01 Oct 10:20 AM',
        responsible: 'Rahul Kumar (Patient Web Portal)',
        note: 'Booked Complete Health Screening Package (7 tests). Paid ₹3,499 online.',
        completed: true
      }
    ],
    notes: 'Patient confirmed strict 10-12 hours overnight fasting.'
  },

  // ORDER 2: VERIFIED STAGE (Ananya Sharma)
  {
    orderId: 'LAB10002',
    patient: {
      name: 'Ananya Sharma',
      patientId: 'PAT1002',
      age: 28,
      gender: 'Female',
      phone: '9876543214',
      email: 'ananya.sharma@yahoo.com',
      address: 'Indiranagar, Bengaluru'
    },
    bookedItem: {
      name: 'Complete Blood Count (CBC)',
      code: 'HEM-CBC-01',
      type: 'Individual Test',
      category: 'Hematology',
      description: 'Automated 5-part differential blood count assessing hemoglobin, leukocyte fractions, platelets and Westergren ESR.',
      price: 350,
      tat: '2 - 4 Hours',
      fastingRequired: false,
      preparation: 'No fasting required. Walk-in diagnostic center draw.'
    },
    includedTests: [
      {
        code: 'HEM-CBC-01',
        name: 'Complete Blood Count (CBC)',
        category: 'Hematology',
        sampleRequired: 'Blood',
        tubeContainer: 'EDTA blood collection tube',
        tubeIdentifier: 'Purple / EDTA (2ml)',
        collectionInstructions: 'Collect 2ml whole blood in EDTA tube according to approved protocol.',
        preparation: 'Non-fasting',
        fastingRequired: false,
        tat: '2 - 4 Hours',
        parametersCount: 12,
        parametersSummary: 'Hemoglobin, TLC, Platelets, RBC, MCV, ESR'
      }
    ],
    requiredSamples: [
      { sampleNumber: 'Sample 01', sampleType: 'Blood', container: 'EDTA blood collection tube', tubeIdentifier: 'Purple / EDTA (2ml)', tests: 'Complete Blood Count (CBC)', status: 'Pending' }
    ],
    collection: {
      method: 'Home Sample Collection',
      scheduledDate: '02 October 2026',
      scheduledTime: '11:00 AM',
      center: 'MediUnify Central Reference Laboratory - Main Hub',
      patientAddress: 'Indiranagar, Bengaluru',
      assignedCollector: null
    },
    sampleDetails: {
      status: 'Pending',
      sampleIds: ['SMP10004'],
      barcode: 'BC10002-A',
      collectionTime: 'Scheduled 02 Oct 11:00 AM',
      receivedTime: '—',
      collectorName: 'Unassigned',
      condition: 'Pending Draw',
      remarks: 'Verified by Admin. Ready for phlebotomist assignment.',
      samples: [
        { sampleId: 'SMP10004', sampleNumber: 'Sample 01', sampleType: 'Blood', relatedTests: 'CBC', tubeContainer: 'EDTA blood collection tube', status: 'Pending' }
      ]
    },
    processingDetails: { status: 'Pending', analyzer: 'Sysmex XN-550', startedAt: '—', expectedCompletion: '02 Oct 02:00 PM' },
    reportDetails: { reportId: 'REP10002', status: 'Pending', verifiedBy: 'Dr. Ramesh S. Rao, MD' },
    orderStatus: 'VERIFIED',
    bookingType: 'Home Sample Collection',
    preferredDate: '02 October 2026',
    preferredTimeSlot: '11:00 AM',
    center: 'MediUnify Central Reference Laboratory - Main Hub',
    paymentStatus: 'Paid',
    paymentMethod: 'Online UPI',
    totalAmount: 350,
    assignedStaff: null,
    sampleId: 'SMP10004',
    reportId: 'REP10002',
    bookingDate: '2026-10-01 10:25 AM',
    timeline: [
      { step: 'NEW', title: 'Order Placed by Patient', timestamp: '01 Oct 10:25 AM', responsible: 'Ananya Sharma', completed: true },
      { step: 'VERIFIED', title: 'Admin Verified Order', timestamp: '01 Oct 10:30 AM', responsible: 'Lab Administrator', note: 'Prescription & test requirements verified.', completed: true }
    ]
  },

  // ORDER 3: PHLEBOTOMIST ASSIGNED (Vijay Kumar)
  {
    orderId: 'LAB10003',
    patient: {
      name: 'Vijay Kumar',
      patientId: 'PAT1003',
      age: 45,
      gender: 'Male',
      phone: '9876543215',
      email: 'vijay.kumar@gmail.com',
      address: 'Jayanagar, Bengaluru'
    },
    bookedItem: {
      name: 'MediUnify Diabetic & Renal Care Screen',
      code: 'POP-DIA-04',
      type: 'Package',
      category: 'Chronic Disease Management',
      description: 'Dedicated glycemic and metabolic evaluation including Fasting Glucose, HPLC HbA1c, and Renal Function.',
      price: 1799,
      tat: '6 - 8 Hours',
      fastingRequired: true,
      preparation: 'Strict overnight fasting of 8 - 10 hours.'
    },
    includedTests: [
      { code: 'BIO-GLU-01', name: 'Fasting Blood Glucose', category: 'Clinical Biochemistry', sampleRequired: 'Blood', tubeContainer: 'Sodium Fluoride tube', tubeIdentifier: 'Grey (2ml)' },
      { code: 'BIO-HBA1C-03', name: 'HbA1c', category: 'Clinical Biochemistry', sampleRequired: 'Blood', tubeContainer: 'EDTA tube', tubeIdentifier: 'Purple (2ml)' },
      { code: 'BIO-KFT-06', name: 'Kidney Function Test', category: 'Clinical Biochemistry', sampleRequired: 'Blood', tubeContainer: 'Clot Activator tube', tubeIdentifier: 'Red/Gold (4ml)' }
    ],
    requiredSamples: [
      { sampleNumber: 'Sample 01', sampleType: 'Blood', container: 'Sodium Fluoride / EDTA / Clot Activator', status: 'Assigned' }
    ],
    collection: {
      method: 'Home Sample Collection',
      scheduledDate: '02 October 2026',
      scheduledTime: '08:30 AM',
      center: 'MediUnify Central Reference Laboratory - Main Hub',
      patientAddress: 'Jayanagar, Bengaluru',
      assignedCollector: { id: 'PH1004', name: 'Suresh Kumar', phone: '+91 98765 43211', status: 'Assigned' }
    },
    sampleDetails: { status: 'Assigned', sampleIds: ['SMP10005'], barcode: 'BC10003-A', remarks: 'Collector assigned for morning draw.' },
    processingDetails: { status: 'Pending', analyzer: 'Beckman AU480' },
    reportDetails: { reportId: 'REP10003', status: 'Pending' },
    orderStatus: 'PHLEBOTOMIST ASSIGNED',
    bookingType: 'Home Sample Collection',
    preferredDate: '02 October 2026',
    preferredTimeSlot: '08:30 AM',
    center: 'MediUnify Central Reference Laboratory - Main Hub',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    totalAmount: 1799,
    assignedStaff: 'Suresh Kumar',
    sampleId: 'SMP10005',
    reportId: 'REP10003',
    bookingDate: '2026-10-01 10:30 AM',
    timeline: [
      { step: 'NEW', title: 'Order Placed', timestamp: '01 Oct 10:30 AM', completed: true },
      { step: 'VERIFIED', title: 'Admin Verified', timestamp: '01 Oct 10:35 AM', completed: true },
      { step: 'PHLEBOTOMIST ASSIGNED', title: 'Phlebotomist Assigned (Suresh Kumar - PH1004)', timestamp: '01 Oct 10:40 AM', responsible: 'Lab Operations', completed: true }
    ]
  },

  // ORDER 4: ON THE WAY (Priya Nair)
  {
    orderId: 'LAB10004',
    patient: {
      name: 'Priya Nair',
      patientId: 'PAT1004',
      age: 29,
      gender: 'Female',
      phone: '9876543216',
      email: 'priya.nair@gmail.com',
      address: 'Koramangala, Bengaluru'
    },
    bookedItem: {
      name: 'MediUnify Vitamin & Nutrition Profile',
      code: 'CUR-LSW-01',
      type: 'Package',
      category: 'Lifestyle & Wellness',
      description: 'Vitamin D, Vitamin B12, Iron Profile and Complete Blood Count.',
      price: 1999,
      tat: '12 - 24 Hours',
      fastingRequired: true,
      preparation: 'Overnight fasting 8 hours.'
    },
    includedTests: [
      { code: 'END-VITD-08', name: 'Vitamin D', category: 'Endocrinology & Hormones', sampleRequired: 'Blood', tubeContainer: 'Gel Vacutainer', tubeIdentifier: 'Gold (4ml)' },
      { code: 'END-B12-09', name: 'Vitamin B12', category: 'Endocrinology & Hormones', sampleRequired: 'Blood', tubeContainer: 'Gel Vacutainer', tubeIdentifier: 'Gold (4ml)' },
      { code: 'HEM-CBC-01', name: 'Complete Blood Count (CBC)', category: 'Hematology', sampleRequired: 'Blood', tubeContainer: 'EDTA tube', tubeIdentifier: 'Purple (2ml)' }
    ],
    collection: {
      method: 'Home Sample Collection',
      scheduledDate: '02 October 2026',
      scheduledTime: '09:30 AM',
      center: 'MediUnify Central Reference Laboratory - Main Hub',
      patientAddress: 'Koramangala, Bengaluru',
      assignedCollector: { id: 'PH1004', name: 'Suresh Kumar', phone: '+91 98765 43211', status: 'On The Way' }
    },
    sampleDetails: { status: 'In Transit', sampleIds: ['SMP10006'], barcode: 'BC10004-A' },
    processingDetails: { status: 'Pending', analyzer: 'CLIA Analyzer' },
    reportDetails: { reportId: 'REP10004', status: 'Pending' },
    orderStatus: 'COLLECTOR ASSIGNED',
    bookingType: 'Home Sample Collection',
    preferredDate: '02 October 2026',
    preferredTimeSlot: '09:30 AM',
    center: 'MediUnify Central Reference Laboratory - Main Hub',
    paymentStatus: 'Paid',
    totalAmount: 1999,
    assignedStaff: 'Suresh Kumar',
    sampleId: 'SMP10006',
    reportId: 'REP10004',
    bookingDate: '2026-10-01 10:45 AM',
    timeline: [
      { step: 'NEW', title: 'Order Placed', timestamp: '01 Oct 10:45 AM', completed: true },
      { step: 'VERIFIED', title: 'Admin Verified', timestamp: '01 Oct 10:50 AM', completed: true },
      { step: 'PHLEBOTOMIST ASSIGNED', title: 'Phlebotomist Assigned', timestamp: '01 Oct 10:55 AM', completed: true },
      { step: 'ACCEPTED', title: 'Phlebotomist Accepted', timestamp: '02 Oct 09:15 AM', completed: true },
      { step: 'ON THE WAY', title: 'On The Way to Patient', timestamp: '02 Oct 09:30 AM', responsible: 'Suresh Kumar', completed: true }
    ]
  },

  // ORDER 5: SAMPLE COLLECTED (Rajesh Hegde)
  {
    orderId: 'LAB10005',
    patient: {
      name: 'Rajesh Hegde',
      patientId: 'PAT1005',
      age: 52,
      gender: 'Male',
      phone: '9876543217',
      email: 'rajesh.hegde@gmail.com',
      address: 'Malleshwaram, Bengaluru'
    },
    bookedItem: {
      name: 'Lipid Profile',
      code: 'BIO-LIP-04',
      type: 'Individual Test',
      category: 'Clinical Biochemistry',
      description: 'Comprehensive lipid fractions.',
      price: 650,
      tat: '4 - 6 Hours',
      fastingRequired: true,
      preparation: '12 hours fasting.'
    },
    includedTests: [
      { code: 'BIO-LIP-04', name: 'Lipid Profile', category: 'Clinical Biochemistry', sampleRequired: 'Blood', tubeContainer: 'Gel Separator tube', tubeIdentifier: 'Gold (4ml)' }
    ],
    collection: {
      method: 'Home Sample Collection',
      scheduledDate: '02 October 2026',
      scheduledTime: '08:00 AM',
      center: 'MediUnify Central Reference Laboratory - Main Hub',
      patientAddress: 'Malleshwaram, Bengaluru',
      assignedCollector: { id: 'PH1002', name: 'Meena Rao', phone: '+91 98765 43212', status: 'Sample Collected' }
    },
    sampleDetails: {
      status: 'Collected',
      sampleIds: ['SMP10007'],
      barcode: 'BC10005-A',
      collectionTime: '02 Oct 08:15 AM',
      collectorName: 'Meena Rao',
      condition: 'Good'
    },
    processingDetails: { status: 'Pending', analyzer: 'Beckman AU480' },
    reportDetails: { reportId: 'REP10005', status: 'Pending' },
    orderStatus: 'SAMPLE COLLECTED',
    bookingType: 'Home Sample Collection',
    preferredDate: '02 October 2026',
    preferredTimeSlot: '08:00 AM',
    center: 'MediUnify Central Reference Laboratory - Main Hub',
    paymentStatus: 'Paid',
    totalAmount: 650,
    assignedStaff: 'Meena Rao',
    sampleId: 'SMP10007',
    reportId: 'REP10005',
    bookingDate: '2026-10-01 11:00 AM',
    timeline: [
      { step: 'NEW', title: 'Order Placed', timestamp: '01 Oct 11:00 AM', completed: true },
      { step: 'VERIFIED', title: 'Admin Verified', timestamp: '01 Oct 11:05 AM', completed: true },
      { step: 'PHLEBOTOMIST ASSIGNED', title: 'Assigned Meena Rao', timestamp: '01 Oct 11:10 AM', completed: true },
      { step: 'ACCEPTED', title: 'Accepted', timestamp: '02 Oct 07:45 AM', completed: true },
      { step: 'ON THE WAY', title: 'On The Way', timestamp: '02 Oct 07:50 AM', completed: true },
      { step: 'ARRIVED', title: 'Arrived at Patient', timestamp: '02 Oct 08:00 AM', completed: true },
      { step: 'PATIENT VERIFIED', title: 'Patient Verified', timestamp: '02 Oct 08:05 AM', completed: true },
      { step: 'COLLECTION STARTED', title: 'Collection Started', timestamp: '02 Oct 08:08 AM', completed: true },
      { step: 'SAMPLE COLLECTED', title: 'Sample Collected', timestamp: '02 Oct 08:15 AM', responsible: 'Meena Rao', note: 'Vacutainer barcoded and sealed in cold box.', completed: true }
    ]
  },

  // ORDER 6: SAMPLE RECEIVED (Meenakshi Sundaram)
  {
    orderId: 'LAB10006',
    patient: {
      name: 'Meenakshi Sundaram',
      patientId: 'PAT1006',
      age: 38,
      gender: 'Female',
      phone: '9876543218',
      email: 'meenakshi.s@gmail.com',
      address: 'Whitefield, Bengaluru'
    },
    bookedItem: {
      name: 'Liver Function Test',
      code: 'BIO-LFT-05',
      type: 'Individual Test',
      category: 'Clinical Biochemistry',
      description: 'Hepatic enzymes and protein fractions.',
      price: 750,
      tat: '4 - 6 Hours',
      fastingRequired: true,
      preparation: 'Overnight fasting.'
    },
    includedTests: [
      { code: 'BIO-LFT-05', name: 'Liver Function Test', category: 'Clinical Biochemistry', sampleRequired: 'Blood', tubeContainer: 'Clot Activator tube', tubeIdentifier: 'Red/Gold (4ml)' }
    ],
    collection: {
      method: 'Home Sample Collection',
      scheduledDate: '02 October 2026',
      scheduledTime: '07:30 AM',
      center: 'MediUnify Central Reference Laboratory - Main Hub',
      patientAddress: 'Whitefield, Bengaluru',
      assignedCollector: { id: 'PH1003', name: 'Arun Kumar', phone: '+91 98765 43213', status: 'Completed' }
    },
    sampleDetails: {
      status: 'Received',
      sampleIds: ['SMP10008'],
      barcode: 'BC10006-A',
      collectionTime: '02 Oct 07:45 AM',
      receivedTime: '02 Oct 08:40 AM',
      collectorName: 'Arun Kumar',
      condition: 'Good / Cold Chain Certified'
    },
    processingDetails: { status: 'Pending', analyzer: 'Beckman AU480' },
    reportDetails: { reportId: 'REP10006', status: 'Pending' },
    orderStatus: 'SAMPLE RECEIVED',
    bookingType: 'Home Sample Collection',
    preferredDate: '02 October 2026',
    preferredTimeSlot: '07:30 AM',
    center: 'MediUnify Central Reference Laboratory - Main Hub',
    paymentStatus: 'Paid',
    totalAmount: 750,
    assignedStaff: 'Arun Kumar',
    sampleId: 'SMP10008',
    reportId: 'REP10006',
    bookingDate: '2026-10-01 11:15 AM',
    timeline: [
      { step: 'NEW', title: 'Order Placed', timestamp: '01 Oct 11:15 AM', completed: true },
      { step: 'VERIFIED', title: 'Admin Verified', timestamp: '01 Oct 11:20 AM', completed: true },
      { step: 'PHLEBOTOMIST ASSIGNED', title: 'Assigned Arun Kumar', timestamp: '01 Oct 11:25 AM', completed: true },
      { step: 'SAMPLE COLLECTED', title: 'Sample Collected', timestamp: '02 Oct 07:45 AM', completed: true },
      { step: 'SAMPLE RECEIVED', title: 'Sample Received at Lab', timestamp: '02 Oct 08:40 AM', responsible: 'Accession Desk', note: 'Barcode scanned and accessioned.', completed: true }
    ]
  },

  // ORDER 7: PROCESSING (Suresh Menghani)
  {
    orderId: 'LAB10007',
    patient: {
      name: 'Suresh Menghani',
      patientId: 'PAT1007',
      age: 61,
      gender: 'Male',
      phone: '9876543219',
      email: 'suresh.m@gmail.com',
      address: 'HSR Layout, Bengaluru'
    },
    bookedItem: {
      name: 'Kidney Function Test',
      code: 'BIO-KFT-06',
      type: 'Individual Test',
      category: 'Clinical Biochemistry',
      description: 'Renal function and electrolytes.',
      price: 750,
      tat: '4 - 6 Hours',
      fastingRequired: true,
      preparation: 'Fasting preferred.'
    },
    includedTests: [
      { code: 'BIO-KFT-06', name: 'Kidney Function Test', category: 'Clinical Biochemistry', sampleRequired: 'Blood', tubeContainer: 'Clot Activator tube', tubeIdentifier: 'Red/Gold (4ml)' }
    ],
    collection: { method: 'Home Sample Collection', scheduledDate: '02 October 2026', center: 'Nova Diagnostics & Laboratory Centre' },
    sampleDetails: { status: 'Received', sampleIds: ['SMP10009'], barcode: 'BC10007-A', condition: 'Good' },
    processingDetails: {
      status: 'Sample Accessioned',
      analyzer: 'Awaiting Center Report Upload',
      startedAt: '02 Oct 09:00 AM'
    },
    reportDetails: { reportId: 'REP10007', status: 'Ready for Upload' },
    orderStatus: 'SAMPLE RECEIVED',
    bookingType: 'Home Sample Collection',
    preferredDate: '02 October 2026',
    preferredTimeSlot: '07:00 AM',
    center: 'Nova Diagnostics & Laboratory Centre',
    paymentStatus: 'Paid',
    totalAmount: 750,
    assignedStaff: 'Suresh Kumar',
    sampleId: 'SMP10009',
    reportId: 'REP10007',
    bookingDate: '2026-10-01 11:30 AM',
    timeline: [
      { step: 'NEW', title: 'Order Placed', timestamp: '01 Oct 11:30 AM', completed: true },
      { step: 'VERIFIED', title: 'Admin Verified', timestamp: '01 Oct 11:35 AM', completed: true },
      { step: 'SAMPLE COLLECTED', title: 'Sample Collected', timestamp: '02 Oct 07:15 AM', completed: true },
      { step: 'SAMPLE RECEIVED', title: 'Samples Received at Testing Lab', timestamp: '02 Oct 08:00 AM', completed: true }
    ]
  },

  // ORDER 8: REPORT UPLOADED (Kavita Joshi) - Ready report received from Apollo Diagnostics
  {
    orderId: 'LAB10008',
    patient: {
      name: 'Kavita Joshi',
      patientId: 'PAT1008',
      age: 34,
      gender: 'Female',
      phone: '9876543220',
      email: 'kavita.j@gmail.com',
      address: 'Rajajinagar, Bengaluru'
    },
    bookedItem: {
      name: 'MediUnify Executive Essentials',
      code: 'POP-EXE-01',
      type: 'Package',
      category: 'Executive Health Checkup',
      description: 'Complete vital organ screening.',
      price: 2499,
      tat: '8 - 12 Hours',
      fastingRequired: true,
      preparation: '10-12 hours fasting.'
    },
    includedTests: [
      { code: 'HEM-CBC-01', name: 'Complete Blood Count (CBC)', category: 'Hematology', sampleRequired: 'Blood', tubeContainer: 'EDTA tube', tubeIdentifier: 'Purple (2ml)' },
      { code: 'BIO-GLU-01', name: 'Fasting Blood Glucose', category: 'Clinical Biochemistry', sampleRequired: 'Blood', tubeContainer: 'Sodium Fluoride tube', tubeIdentifier: 'Grey (2ml)' },
      { code: 'BIO-LIP-04', name: 'Lipid Profile', category: 'Clinical Biochemistry', sampleRequired: 'Blood', tubeContainer: 'Gel Vacutainer', tubeIdentifier: 'Gold (4ml)' }
    ],
    collection: { method: 'Home Sample Collection', scheduledDate: '02 October 2026', center: 'Apollo Diagnostics' },
    sampleDetails: { status: 'Received', sampleIds: ['SMP10010'], barcode: 'BC10008-A', condition: 'Good' },
    processingDetails: { status: 'Completed', analyzer: 'Apollo Central Analyzers', completedAt: '02 Oct 11:30 AM' },
    reportDetails: { reportId: 'REP10008', status: 'Uploaded', verifiedBy: 'Dr. Neha Sharma, MD (Apollo Diagnostics)' },
    orderStatus: 'REPORT UPLOADED',
    bookingType: 'Home Sample Collection',
    preferredDate: '02 October 2026',
    preferredTimeSlot: '07:00 AM',
    center: 'Apollo Diagnostics',
    paymentStatus: 'Paid',
    totalAmount: 2499,
    assignedStaff: 'Meena Rao',
    sampleId: 'SMP10010',
    reportId: 'REP10008',
    bookingDate: '2026-10-01 11:45 AM',
    timeline: [
      { step: 'NEW', title: 'Order Placed', timestamp: '01 Oct 11:45 AM', completed: true },
      { step: 'VERIFIED', title: 'Admin Verified', timestamp: '01 Oct 11:50 AM', completed: true },
      { step: 'SAMPLE COLLECTED', title: 'Sample Collected', timestamp: '02 Oct 07:10 AM', completed: true },
      { step: 'SAMPLE RECEIVED', title: 'Sample Received at Apollo Lab', timestamp: '02 Oct 07:55 AM', completed: true },
      { step: 'REPORT UPLOADED', title: 'Ready Report Uploaded with MediUnify Watermark', timestamp: '02 Oct 11:40 AM', responsible: 'Apollo Diagnostics / MediUnify Hub', completed: true }
    ]
  },

  // ORDER 9: REPORT VERIFIED (Harish Patel)
  {
    orderId: 'LAB10009',
    patient: {
      name: 'Harish Patel',
      patientId: 'PAT1009',
      age: 49,
      gender: 'Male',
      phone: '9876543221',
      email: 'harish.patel@gmail.com',
      address: 'Basavanagudi, Bengaluru'
    },
    bookedItem: {
      name: 'MediUnify Vitamin & Nutrition Profile',
      code: 'CUR-LSW-01',
      type: 'Package',
      category: 'Lifestyle & Wellness',
      description: 'Vitamin D, B12 and Iron Screen.',
      price: 1999,
      tat: '12 - 24 Hours',
      fastingRequired: true,
      preparation: 'Overnight fasting 8 hours.'
    },
    includedTests: [
      { code: 'END-VITD-08', name: 'Vitamin D', category: 'Endocrinology & Hormones', sampleRequired: 'Blood', tubeContainer: 'Gel Vacutainer', tubeIdentifier: 'Gold (4ml)' },
      { code: 'END-B12-09', name: 'Vitamin B12', category: 'Endocrinology & Hormones', sampleRequired: 'Blood', tubeContainer: 'Gel Vacutainer', tubeIdentifier: 'Gold (4ml)' }
    ],
    collection: { method: 'Home Sample Collection', scheduledDate: '01 October 2026', center: 'MediUnify Central Reference Laboratory - Main Hub' },
    sampleDetails: { status: 'Verified', sampleIds: ['SMP10011'], barcode: 'BC10009-A', condition: 'Good' },
    processingDetails: { status: 'Completed', analyzer: 'CLIA Analyzer', completedAt: '01 Oct 03:00 PM' },
    reportDetails: {
      reportId: 'REP10009',
      status: 'Verified',
      uploadedDate: '01 Oct 04:30 PM',
      verifiedDate: '01 Oct 05:00 PM',
      verifiedBy: 'Dr. Ramesh S. Rao, MD (Chief Pathologist)',
      deliveryStatus: 'Ready for Patient Dispatch'
    },
    orderStatus: 'REPORT VERIFIED',
    bookingType: 'Home Sample Collection',
    preferredDate: '01 October 2026',
    preferredTimeSlot: '08:00 AM',
    center: 'MediUnify Central Reference Laboratory - Main Hub',
    paymentStatus: 'Paid',
    totalAmount: 1999,
    assignedStaff: 'Suresh Kumar',
    sampleId: 'SMP10011',
    reportId: 'REP10009',
    bookingDate: '2026-10-01 08:00 AM',
    timeline: [
      { step: 'NEW', title: 'Order Placed', timestamp: '01 Oct 08:00 AM', completed: true },
      { step: 'VERIFIED', title: 'Admin Verified', timestamp: '01 Oct 08:05 AM', completed: true },
      { step: 'SAMPLE COLLECTED', title: 'Sample Collected', timestamp: '01 Oct 08:30 AM', completed: true },
      { step: 'SAMPLE RECEIVED', title: 'Sample Received', timestamp: '01 Oct 09:15 AM', completed: true },
      { step: 'PROCESSING', title: 'Processing Completed', timestamp: '01 Oct 03:00 PM', completed: true },
      { step: 'REPORT UPLOADED', title: 'Report Uploaded', timestamp: '01 Oct 04:30 PM', completed: true },
      { step: 'REPORT VERIFIED', title: 'Report Verified & Signed Off', timestamp: '01 Oct 05:00 PM', responsible: 'Dr. Ramesh S. Rao, MD', completed: true }
    ]
  },

  // ORDER 10: COMPLETED (Sumathi Rao)
  {
    orderId: 'LAB10010',
    patient: {
      name: 'Sumathi Rao',
      patientId: 'PAT1010',
      age: 56,
      gender: 'Female',
      phone: '9876543222',
      email: 'sumathi.rao@gmail.com',
      address: 'JP Nagar, Bengaluru'
    },
    bookedItem: {
      name: 'Complete Health Screening Package',
      code: 'PKG-CHS-01',
      type: 'Package',
      category: 'Full Body Health Screening',
      description: 'Comprehensive 7-panel health screening package.',
      price: 3499,
      tat: '8 - 12 Hours',
      fastingRequired: true,
      preparation: 'Overnight fasting 10-12 hours.'
    },
    includedTests: [
      { code: 'HEM-CBC-01', name: 'Complete Blood Count (CBC)', category: 'Hematology', sampleRequired: 'Blood', tubeContainer: 'EDTA tube', tubeIdentifier: 'Purple (2ml)' },
      { code: 'BIO-GLU-01', name: 'Fasting Blood Glucose', category: 'Clinical Biochemistry', sampleRequired: 'Blood', tubeContainer: 'Sodium Fluoride tube', tubeIdentifier: 'Grey (2ml)' },
      { code: 'BIO-HBA1C-03', name: 'HbA1c', category: 'Clinical Biochemistry', sampleRequired: 'Blood', tubeContainer: 'EDTA tube', tubeIdentifier: 'Purple (2ml)' },
      { code: 'BIO-LIP-04', name: 'Lipid Profile', category: 'Clinical Biochemistry', sampleRequired: 'Blood', tubeContainer: 'Gel Vacutainer', tubeIdentifier: 'Gold (4ml)' },
      { code: 'BIO-LFT-05', name: 'Liver Function Test', category: 'Clinical Biochemistry', sampleRequired: 'Blood', tubeContainer: 'Clot Activator tube', tubeIdentifier: 'Red/Gold (4ml)' },
      { code: 'BIO-KFT-06', name: 'Kidney Function Test', category: 'Clinical Biochemistry', sampleRequired: 'Blood', tubeContainer: 'Clot Activator tube', tubeIdentifier: 'Red/Gold (4ml)' },
      { code: 'PAT-URN-11', name: 'Routine Urine Examination', category: 'Clinical Pathology', sampleRequired: 'Urine', tubeContainer: 'Urine container', tubeIdentifier: 'Sterile Urine Container (50ml)' }
    ],
    collection: { method: 'Home Sample Collection', scheduledDate: '01 October 2026', center: 'MediUnify Central Reference Laboratory - Main Hub' },
    sampleDetails: { status: 'Completed', sampleIds: ['SMP10012'], barcode: 'BC10010-A', condition: 'Good' },
    processingDetails: { status: 'Completed', analyzer: 'Sysmex XN-550 & Beckman AU480', completedAt: '01 Oct 04:00 PM' },
    reportDetails: {
      reportId: 'REP10010',
      status: 'Delivered',
      uploadedDate: '01 Oct 05:00 PM',
      verifiedDate: '01 Oct 05:30 PM',
      deliveredDate: '01 Oct 05:35 PM',
      verifiedBy: 'Dr. Ramesh S. Rao, MD (Chief Pathologist)',
      deliveryStatus: 'Delivered via WhatsApp & Email'
    },
    orderStatus: 'COMPLETED',
    bookingType: 'Home Sample Collection',
    preferredDate: '01 October 2026',
    preferredTimeSlot: '07:30 AM',
    center: 'MediUnify Central Reference Laboratory - Main Hub',
    paymentStatus: 'Paid',
    totalAmount: 3499,
    assignedStaff: 'Suresh Kumar',
    sampleId: 'SMP10012',
    reportId: 'REP10010',
    bookingDate: '2026-10-01 07:00 AM',
    timeline: [
      { step: 'NEW', title: 'Order Placed', timestamp: '01 Oct 07:00 AM', completed: true },
      { step: 'VERIFIED', title: 'Admin Verified', timestamp: '01 Oct 07:05 AM', completed: true },
      { step: 'PHLEBOTOMIST ASSIGNED', title: 'Phlebotomist Assigned (Suresh Kumar)', timestamp: '01 Oct 07:10 AM', completed: true },
      { step: 'SAMPLE COLLECTED', title: 'Samples Collected', timestamp: '01 Oct 07:45 AM', completed: true },
      { step: 'SAMPLE RECEIVED', title: 'Samples Received at Lab', timestamp: '01 Oct 08:30 AM', completed: true },
      { step: 'SAMPLE VERIFIED', title: 'Samples Verified', timestamp: '01 Oct 08:45 AM', completed: true },
      { step: 'PROCESSING', title: 'Processing Completed', timestamp: '01 Oct 04:00 PM', completed: true },
      { step: 'REPORT UPLOADED', title: 'Report Uploaded', timestamp: '01 Oct 05:00 PM', completed: true },
      { step: 'REPORT VERIFIED', title: 'Report Verified', timestamp: '01 Oct 05:30 PM', responsible: 'Dr. Ramesh S. Rao, MD', completed: true },
      { step: 'REPORT DELIVERED', title: 'Report Delivered to Patient', timestamp: '01 Oct 05:35 PM', responsible: 'Automated Dispatch', note: 'Sent via WhatsApp (+91 9876543222) and Email.', completed: true },
      { step: 'COMPLETED', title: 'Order Completed Successfully', timestamp: '01 Oct 05:35 PM', completed: true }
    ]
  }
];

// Initial Samples tracking physical custody and quality verification
export const INITIAL_LAB_SAMPLES = [
  {
    sampleId: 'SMP10001',
    orderId: 'LAB10001',
    patientName: 'Rahul Kumar',
    patientAge: 32,
    gender: 'Male',
    testName: 'Complete Blood Count (CBC)',
    sampleType: 'Blood',
    tubeContainer: 'EDTA blood collection tube',
    tubeIdentifier: 'Purple / EDTA (2ml)',
    barcode: 'BC10001-A',
    collectionStaff: 'Suresh Kumar',
    collectionTime: '02 October 2026, 10:12 AM',
    receivedTime: '02 October 2026, 11:05 AM',
    center: 'MediUnify Central Reference Laboratory - Main Hub',
    sampleStatus: 'COLLECTED',
    condition: 'Good / Cold Chain Intact',
    rejectionReason: null
  },
  {
    sampleId: 'SMP10002',
    orderId: 'LAB10001',
    patientName: 'Rahul Kumar',
    patientAge: 32,
    gender: 'Male',
    testName: 'Fasting Blood Glucose, HbA1c, Lipid Profile, Liver Function Test, Kidney Function Test',
    sampleType: 'Blood',
    tubeContainer: 'Sodium Fluoride & SST Gel Vacutainer tubes',
    tubeIdentifier: 'Grey (2ml) & Gold Top (4ml)',
    barcode: 'BC10001-B',
    collectionStaff: 'Suresh Kumar',
    collectionTime: '02 October 2026, 10:12 AM',
    receivedTime: '02 October 2026, 11:05 AM',
    center: 'MediUnify Central Reference Laboratory - Main Hub',
    sampleStatus: 'COLLECTED',
    condition: 'Good / Cold Chain Intact',
    rejectionReason: null
  },
  {
    sampleId: 'SMP10003',
    orderId: 'LAB10001',
    patientName: 'Rahul Kumar',
    patientAge: 32,
    gender: 'Male',
    testName: 'Routine Urine Examination',
    sampleType: 'Urine',
    tubeContainer: 'Urine specimen container',
    tubeIdentifier: 'Sterile Urine Container (50ml)',
    barcode: 'BC10001-C',
    collectionStaff: 'Suresh Kumar',
    collectionTime: '02 October 2026, 10:12 AM',
    receivedTime: '02 October 2026, 11:05 AM',
    center: 'MediUnify Central Reference Laboratory - Main Hub',
    sampleStatus: 'COLLECTED',
    condition: 'Good / Cold Chain Intact',
    rejectionReason: null
  },
  {
    sampleId: 'SMP10005',
    orderId: 'LAB10003',
    patientName: 'Vijay Kumar',
    patientAge: 45,
    gender: 'Male',
    testName: 'Diabetic & Renal Screen',
    sampleType: 'Blood',
    tubeContainer: 'Sodium Fluoride & SST',
    tubeIdentifier: 'Grey & Gold Top',
    barcode: 'BC10003-A',
    collectionStaff: 'Suresh Kumar',
    collectionTime: '02 October 2026, 08:30 AM',
    receivedTime: '—',
    center: 'MediUnify Central Reference Laboratory - Main Hub',
    sampleStatus: 'ASSIGNED',
    condition: 'Pending Draw',
    rejectionReason: null
  },
  {
    sampleId: 'SMP10007',
    orderId: 'LAB10005',
    patientName: 'Rajesh Hegde',
    patientAge: 52,
    gender: 'Male',
    testName: 'Lipid Profile',
    sampleType: 'Blood',
    tubeContainer: 'Gel Separator tube',
    tubeIdentifier: 'Gold (4ml)',
    barcode: 'BC10005-A',
    collectionStaff: 'Meena Rao',
    collectionTime: '02 October 2026, 08:15 AM',
    receivedTime: '—',
    center: 'MediUnify Central Reference Laboratory - Main Hub',
    sampleStatus: 'COLLECTED',
    condition: 'Good',
    rejectionReason: null
  },
  {
    sampleId: 'SMP10008',
    orderId: 'LAB10006',
    patientName: 'Meenakshi Sundaram',
    patientAge: 38,
    gender: 'Female',
    testName: 'Liver Function Test',
    sampleType: 'Blood',
    tubeContainer: 'Clot Activator tube',
    tubeIdentifier: 'Red/Gold (4ml)',
    barcode: 'BC10006-A',
    collectionStaff: 'Arun Kumar',
    collectionTime: '02 October 2026, 07:45 AM',
    receivedTime: '02 October 2026, 08:40 AM',
    center: 'MediUnify Central Reference Laboratory - Main Hub',
    sampleStatus: 'RECEIVED',
    condition: 'Good',
    rejectionReason: null
  }
];

// Initial Diagnostic Reports
export const INITIAL_LAB_REPORTS = [
  {
    reportId: 'REP10001',
    orderId: 'LAB10001',
    patientName: 'Rahul Kumar',
    patientAge: 32,
    gender: 'Male',
    testOrPackageName: 'Complete Health Screening Package (7 Tests)',
    sampleId: 'SMP10001 / SMP10002 / SMP10003',
    labCenter: 'Nova Diagnostics & Laboratory Centre',
    reportStatus: 'PENDING',
    uploadedDate: '03 Oct 09:30 AM',
    verifiedBy: 'Dr. Ramesh S. Rao, MD (Chief Pathologist, Nova Diagnostics)',
    deliveryStatus: 'Pending Verification',
    parameters: [
      { name: 'Hemoglobin (Hb)', value: '14.6', unit: 'g/dL', normalRange: '13.0 - 17.0', flag: 'Normal' },
      { name: 'Total Leukocyte Count (WBC)', value: '7,200', unit: 'cells/cu.mm', normalRange: '4,000 - 11,000', flag: 'Normal' },
      { name: 'Platelet Count', value: '2.60', unit: 'lakh/cu.mm', normalRange: '1.50 - 4.50', flag: 'Normal' },
      { name: 'Fasting Blood Glucose', value: '94', unit: 'mg/dL', normalRange: '70 - 99', flag: 'Normal' },
      { name: 'HbA1c (Glycated Hemoglobin)', value: '5.4', unit: '%', normalRange: '< 5.7', flag: 'Normal' },
      { name: 'Total Cholesterol', value: '182', unit: 'mg/dL', normalRange: '< 200', flag: 'Normal' },
      { name: 'Triglycerides', value: '138', unit: 'mg/dL', normalRange: '< 150', flag: 'Normal' },
      { name: 'HDL Cholesterol', value: '48', unit: 'mg/dL', normalRange: '> 40', flag: 'Normal' },
      { name: 'LDL Cholesterol', value: '106', unit: 'mg/dL', normalRange: '< 100', flag: 'Borderline' },
      { name: 'SGOT / AST', value: '26', unit: 'U/L', normalRange: '10 - 40', flag: 'Normal' },
      { name: 'SGPT / ALT', value: '31', unit: 'U/L', normalRange: '7 - 45', flag: 'Normal' },
      { name: 'Serum Bilirubin (Total)', value: '0.8', unit: 'mg/dL', normalRange: '0.2 - 1.2', flag: 'Normal' },
      { name: 'Serum Creatinine', value: '0.95', unit: 'mg/dL', normalRange: '0.7 - 1.3', flag: 'Normal' },
      { name: 'Blood Urea', value: '24', unit: 'mg/dL', normalRange: '15 - 40', flag: 'Normal' },
      { name: 'Urine Routine (Protein)', value: 'Nil', unit: 'Semi-Quant', normalRange: 'Nil / Negative', flag: 'Normal' },
      { name: 'Urine Routine (Sugar)', value: 'Nil', unit: 'Semi-Quant', normalRange: 'Nil / Negative', flag: 'Normal' }
    ]
  },
  {
    reportId: 'REP10009',
    orderId: 'LAB10009',
    patientName: 'Harish Patel',
    patientAge: 49,
    gender: 'Male',
    testOrPackageName: 'MediUnify Vitamin & Nutrition Profile',
    sampleId: 'SMP10011',
    labCenter: 'Apollo Diagnostics',
    reportStatus: 'VERIFIED',
    uploadedDate: '01 Oct 04:30 PM',
    verifiedBy: 'Dr. Sanjay Kulkarni, MD Path (Apollo Diagnostics)',
    deliveryStatus: 'Ready for Delivery',
    parameters: [
      { name: '25-Hydroxy Vitamin D Total', value: '38.2', unit: 'ng/mL', normalRange: '30 - 100', flag: 'Normal' },
      { name: 'Vitamin B12 (Cobalamin)', value: '460', unit: 'pg/mL', normalRange: '211 - 911', flag: 'Normal' }
    ]
  },
  {
    reportId: 'REP10010',
    orderId: 'LAB10010',
    patientName: 'Sumathi Rao',
    patientAge: 56,
    gender: 'Female',
    testOrPackageName: 'Complete Health Screening Package',
    sampleId: 'SMP10012',
    labCenter: 'CityCare Labs & Diagnostics',
    reportStatus: 'DELIVERED',
    uploadedDate: '01 Oct 05:00 PM',
    verifiedBy: 'Dr. Ananya Roy, MD (CityCare Labs)',
    deliveryStatus: 'Delivered to WhatsApp & Email',
    parameters: [
      { name: 'Hemoglobin (Hb)', value: '13.8', unit: 'g/dL', normalRange: '12.0 - 15.5', flag: 'Normal' },
      { name: 'Fasting Blood Glucose', value: '91', unit: 'mg/dL', normalRange: '70 - 99', flag: 'Normal' },
      { name: 'HbA1c', value: '5.6', unit: '%', normalRange: '< 5.7', flag: 'Normal' },
      { name: 'Serum Creatinine', value: '0.88', unit: 'mg/dL', normalRange: '0.5 - 1.1', flag: 'Normal' }
    ]
  }
];

export const LAB_STATS = {
  totalOrdersToday: 24,
  pendingVerification: 4,
  assignedCollections: 8,
  processingAnalyzers: 6,
  readyReports: 5,
  completedToday: 12,
  revenueToday: '₹84,200',
  activeStaff: 3,
  nablAccreditation: 'ISO 15189:2022 Certified'
};

export const LAB_TESTS = MASTER_TESTS;
export const LAB_PACKAGES = [...POPULAR_CHECKUPS, ...CURATED_CHECKUPS];
export const LAB_SAMPLES = INITIAL_LAB_SAMPLES;
export const LAB_BOOKINGS = INITIAL_LAB_ORDERS;
export const LAB_REPORTS = INITIAL_LAB_REPORTS;
