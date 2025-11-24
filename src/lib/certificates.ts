// Certificate types organized by department and rank

export interface CertificateType {
  code: string
  name: string
  category: 'LICENSE' | 'TRAINING' | 'MEDICAL' | 'ENDORSEMENT' | 'PROFICIENCY' | 'IDENTITY'
  requiredFor: string[] // Array of rank codes
  validityYears?: number
  issuingAuthority?: string
  description?: string
}

export const CERTIFICATE_TYPES: CertificateType[] = [
  // LICENSES - DECK OFFICERS
  {
    code: 'COC-MASTER',
    name: 'Certificate of Competency - Master Unlimited',
    category: 'LICENSE',
    requiredFor: ['MASTER'],
    validityYears: 5,
    issuingAuthority: 'Flag State / STCW',
    description: 'Master certificate for vessels of any tonnage',
  },
  {
    code: 'COC-CO',
    name: 'Certificate of Competency - Chief Officer',
    category: 'LICENSE',
    requiredFor: ['CO', 'MASTER'],
    validityYears: 5,
    issuingAuthority: 'Flag State / STCW',
  },
  {
    code: 'COC-2O',
    name: 'Certificate of Competency - Second Officer',
    category: 'LICENSE',
    requiredFor: ['2/O', 'CO'],
    validityYears: 5,
    issuingAuthority: 'Flag State / STCW',
  },
  {
    code: 'COC-3O',
    name: 'Certificate of Competency - Third Officer',
    category: 'LICENSE',
    requiredFor: ['3/O', '2/O'],
    validityYears: 5,
    issuingAuthority: 'Flag State / STCW',
  },

  // LICENSES - ENGINE OFFICERS
  {
    code: 'COC-CE',
    name: 'Certificate of Competency - Chief Engineer',
    category: 'LICENSE',
    requiredFor: ['CE'],
    validityYears: 5,
    issuingAuthority: 'Flag State / STCW',
  },
  {
    code: 'COC-2E',
    name: 'Certificate of Competency - Second Engineer',
    category: 'LICENSE',
    requiredFor: ['2/E', 'CE'],
    validityYears: 5,
    issuingAuthority: 'Flag State / STCW',
  },
  {
    code: 'COC-3E',
    name: 'Certificate of Competency - Third Engineer',
    category: 'LICENSE',
    requiredFor: ['3/E', '2/E'],
    validityYears: 5,
    issuingAuthority: 'Flag State / STCW',
  },

  // LICENSES - RATINGS
  {
    code: 'COP-AB',
    name: 'Certificate of Proficiency - Able Seaman',
    category: 'PROFICIENCY',
    requiredFor: ['AB', 'BOSUN'],
    validityYears: 5,
    issuingAuthority: 'Flag State / STCW',
  },
  {
    code: 'COP-OLR',
    name: 'Certificate of Proficiency - Oiler',
    category: 'PROFICIENCY',
    requiredFor: ['OLR', 'OLR.1'],
    validityYears: 5,
    issuingAuthority: 'Flag State / STCW',
  },

  // TRAINING CERTIFICATES - BASIC (All crew)
  {
    code: 'BST',
    name: 'Basic Safety Training (STCW A-VI/1)',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E', 'BOSUN', 'AB', 'OS', 'OLR.1', 'OLR', 'WPR', 'CCK', 'PM', 'GB'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
    description: 'Personal Survival Techniques, Fire Prevention & Fire Fighting, Elementary First Aid, Personal Safety & Social Responsibilities',
  },
  {
    code: 'PST',
    name: 'Personal Survival Techniques',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E', 'BOSUN', 'AB', 'OS', 'OLR.1', 'OLR', 'WPR', 'CCK', 'PM', 'GB'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },
  {
    code: 'FPFF',
    name: 'Fire Prevention & Fire Fighting',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E', 'BOSUN', 'AB', 'OS', 'OLR.1', 'OLR', 'WPR', 'CCK', 'PM', 'GB'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },
  {
    code: 'EFA',
    name: 'Elementary First Aid',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E', 'BOSUN', 'AB', 'OS', 'OLR.1', 'OLR', 'WPR', 'CCK', 'PM', 'GB'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },
  {
    code: 'PSSR',
    name: 'Personal Safety & Social Responsibilities',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E', 'BOSUN', 'AB', 'OS', 'OLR.1', 'OLR', 'WPR', 'CCK', 'PM', 'GB'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },

  // TRAINING CERTIFICATES - ADVANCED (Officers)
  {
    code: 'AFF',
    name: 'Advanced Fire Fighting (STCW A-VI/3)',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },
  {
    code: 'MFA',
    name: 'Medical First Aid (STCW A-VI/4-1)',
    category: 'TRAINING',
    requiredFor: ['3/O', '3/E'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },
  {
    code: 'MCC',
    name: 'Medical Care (STCW A-VI/4-2)',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },

  // SECURITY TRAINING
  {
    code: 'SSA',
    name: 'Ship Security Awareness (STCW A-VI/6-1)',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E', 'BOSUN', 'AB', 'OS', 'OLR.1', 'OLR', 'WPR'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },
  {
    code: 'SSO',
    name: 'Ship Security Officer (STCW A-VI/5)',
    category: 'TRAINING',
    requiredFor: ['CO', '2/O'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },

  // TANKER CERTIFICATES
  {
    code: 'BOCT',
    name: 'Basic Oil & Chemical Tanker (STCW A-V/1-1)',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
    description: 'For officers on oil and chemical tankers',
  },
  {
    code: 'AOCT',
    name: 'Advanced Oil Tanker (STCW A-V/1-1-1)',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO', 'CE'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },
  {
    code: 'ACCT',
    name: 'Advanced Chemical Tanker (STCW A-V/1-1-2)',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO', 'CE'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },
  {
    code: 'BLTC',
    name: 'Basic Liquefied Gas Tanker (STCW A-V/1-2)',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },
  {
    code: 'ALGT',
    name: 'Advanced Liquefied Gas Tanker (STCW A-V/1-2-1)',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO', 'CE'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },

  // RADAR & NAVIGATION
  {
    code: 'RADAR',
    name: 'Operational Use of ARPA/Radar (STCW A-II/1)',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },
  {
    code: 'ECDIS',
    name: 'Electronic Chart Display & Information System',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },
  {
    code: 'GMDSS',
    name: 'Global Maritime Distress & Safety System (GOC)',
    category: 'TRAINING',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },

  // CARGO & OPERATIONS
  {
    code: 'HVOLTAGE',
    name: 'High Voltage Certificate',
    category: 'TRAINING',
    requiredFor: ['CE', '2/E', '3/E'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },
  {
    code: 'MEFA',
    name: 'Marine Engine Familiarization',
    category: 'TRAINING',
    requiredFor: ['CE', '2/E', '3/E'],
    validityYears: 5,
    issuingAuthority: 'Approved Training Center',
  },

  // ENDORSEMENTS
  {
    code: 'END-BAHAMAS',
    name: 'Bahamas Flag State Endorsement',
    category: 'ENDORSEMENT',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E'],
    validityYears: 5,
    issuingAuthority: 'Bahamas Maritime Authority',
  },
  {
    code: 'END-MARSHALL',
    name: 'Marshall Islands Endorsement',
    category: 'ENDORSEMENT',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E'],
    validityYears: 5,
    issuingAuthority: 'Marshall Islands Maritime Administrator',
  },
  {
    code: 'END-PANAMA',
    name: 'Panama Flag State Endorsement',
    category: 'ENDORSEMENT',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E'],
    validityYears: 5,
    issuingAuthority: 'Panama Maritime Authority',
  },

  // MEDICAL CERTIFICATES
  {
    code: 'MEDICAL',
    name: 'Seafarer Medical Certificate',
    category: 'MEDICAL',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E', 'BOSUN', 'AB', 'OS', 'OLR.1', 'OLR', 'WPR', 'CCK', 'PM', 'GB'],
    validityYears: 2,
    issuingAuthority: 'Approved Medical Examiner',
  },
  {
    code: 'YELLOW-FEVER',
    name: 'Yellow Fever Vaccination Certificate',
    category: 'MEDICAL',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E', 'BOSUN', 'AB', 'OS', 'OLR.1', 'OLR', 'WPR', 'CCK', 'PM', 'GB'],
    validityYears: 10,
    issuingAuthority: 'WHO Approved Center',
  },

  // IDENTITY DOCUMENTS
  {
    code: 'PASSPORT',
    name: 'Passport',
    category: 'IDENTITY',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E', 'BOSUN', 'AB', 'OS', 'OLR.1', 'OLR', 'WPR', 'CCK', 'PM', 'GB'],
    validityYears: 10,
    issuingAuthority: 'Government',
  },
  {
    code: 'SEAMAN-BOOK',
    name: 'Seaman Book / Discharge Book',
    category: 'IDENTITY',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E', 'BOSUN', 'AB', 'OS', 'OLR.1', 'OLR', 'WPR', 'CCK', 'PM', 'GB'],
    validityYears: 10,
    issuingAuthority: 'Maritime Authority',
  },
  {
    code: 'SID',
    name: 'Seafarer Identity Document',
    category: 'IDENTITY',
    requiredFor: ['MASTER', 'CO', '2/O', '3/O', 'CE', '2/E', '3/E', 'BOSUN', 'AB', 'OS', 'OLR.1', 'OLR', 'WPR', 'CCK', 'PM', 'GB'],
    validityYears: 10,
    issuingAuthority: 'Maritime Authority',
  },
]

// Helper functions
export function getCertificatesByRank(rankCode: string): CertificateType[] {
  return CERTIFICATE_TYPES.filter(cert => cert.requiredFor.includes(rankCode))
}

export function getCertificatesByCategory(category: CertificateType['category']): CertificateType[] {
  return CERTIFICATE_TYPES.filter(cert => cert.category === category)
}

export function getCertificateByCode(code: string): CertificateType | undefined {
  return CERTIFICATE_TYPES.find(cert => cert.code === code)
}

export const CERTIFICATE_CATEGORIES = {
  LICENSE: 'Certificates of Competency & Proficiency',
  TRAINING: 'STCW Training Certificates',
  MEDICAL: 'Medical & Health Certificates',
  ENDORSEMENT: 'Flag State Endorsements',
  PROFICIENCY: 'Certificates of Proficiency',
  IDENTITY: 'Identity & Travel Documents',
}
