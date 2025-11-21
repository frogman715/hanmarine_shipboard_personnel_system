// CV Templates for different flag states

export interface CVTemplate {
  flag: string
  country: string
  sections: string[]
  requiredFields: string[]
  format: 'standard' | 'detailed' | 'compact'
}

export const CV_TEMPLATES: Record<string, CVTemplate> = {
  BAHAMAS: {
    flag: 'BAHAMAS',
    country: 'Commonwealth of The Bahamas',
    sections: [
      'Personal Information',
      'Certificate of Competency',
      'Endorsements',
      'Training Certificates',
      'Medical Certificate',
      'Sea Service Experience',
      'Education',
      'References',
    ],
    requiredFields: [
      'fullName',
      'dateOfBirth',
      'nationality',
      'passport',
      'seamanBook',
      'cocNumber',
      'rank',
      'endorsementNumber',
      'medicalCertificate',
      'seaService',
    ],
    format: 'detailed',
  },
  PANAMA: {
    flag: 'PANAMA',
    country: 'Republic of Panama',
    sections: [
      'Personal Data',
      'Licenses & Certificates',
      'Panama Endorsement',
      'Professional Training',
      'Medical Fitness',
      'Sea Service Record',
      'Academic Background',
    ],
    requiredFields: [
      'fullName',
      'dateOfBirth',
      'nationality',
      'passport',
      'seamanBook',
      'license',
      'panamaEndorsement',
      'medicalCertificate',
      'seaService',
    ],
    format: 'standard',
  },
  MARSHALL_ISLANDS: {
    flag: 'MARSHALL_ISLANDS',
    country: 'Republic of the Marshall Islands',
    sections: [
      'Personal Information',
      'Certification',
      'Marshall Islands Endorsement',
      'STCW Training',
      'Medical Examination',
      'Sea Service History',
      'Education & Qualifications',
    ],
    requiredFields: [
      'fullName',
      'dateOfBirth',
      'nationality',
      'passport',
      'coc',
      'miEndorsement',
      'stcwTraining',
      'medicalCertificate',
      'seaService',
    ],
    format: 'detailed',
  },
  SINGAPORE: {
    flag: 'SINGAPORE',
    country: 'Republic of Singapore',
    sections: [
      'Personal Particulars',
      'Professional Certificates',
      'Training & Competency',
      'Medical Status',
      'Employment History',
      'Educational Qualifications',
    ],
    requiredFields: [
      'fullName',
      'dateOfBirth',
      'nationality',
      'identityCard',
      'certificates',
      'training',
      'medical',
      'experience',
    ],
    format: 'compact',
  },
  LIBERIA: {
    flag: 'LIBERIA',
    country: 'Republic of Liberia',
    sections: [
      'Personal Information',
      'Certificate of Competency',
      'Liberian Endorsement',
      'STCW Certificates',
      'Medical Certificate',
      'Sea Service Record',
      'Education',
    ],
    requiredFields: [
      'fullName',
      'dateOfBirth',
      'nationality',
      'passport',
      'coc',
      'liberianEndorsement',
      'stcwCerts',
      'medical',
      'seaService',
    ],
    format: 'standard',
  },
  MALTA: {
    flag: 'MALTA',
    country: 'Republic of Malta',
    sections: [
      'Personal Details',
      'Certification & Licensing',
      'Malta Endorsement',
      'Training Records',
      'Medical Fitness Certificate',
      'Sea Service Experience',
      'Academic Qualifications',
    ],
    requiredFields: [
      'fullName',
      'dateOfBirth',
      'nationality',
      'passport',
      'coc',
      'maltaEndorsement',
      'training',
      'medical',
      'seaService',
    ],
    format: 'detailed',
  },
}

export const FLAG_OPTIONS = [
  { value: 'BAHAMAS', label: '🇧🇸 Bahamas' },
  { value: 'PANAMA', label: '🇵🇦 Panama' },
  { value: 'MARSHALL_ISLANDS', label: '🇲🇭 Marshall Islands' },
  { value: 'SINGAPORE', label: '🇸🇬 Singapore' },
  { value: 'LIBERIA', label: '🇱🇷 Liberia' },
  { value: 'MALTA', label: '🇲🇹 Malta' },
]

export function getTemplateByFlag(flag: string): CVTemplate | undefined {
  return CV_TEMPLATES[flag]
}

export function validateCrewDataForCV(crewData: any, template: CVTemplate): {
  valid: boolean
  missing: string[]
} {
  const missing: string[] = []

  template.requiredFields.forEach((field) => {
    if (!crewData[field] || crewData[field] === '') {
      missing.push(field)
    }
  })

  return {
    valid: missing.length === 0,
    missing,
  }
}
