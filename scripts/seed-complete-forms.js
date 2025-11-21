const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const formTemplates = [
  {
    code: 'HGF-CR-02',
    name: 'Application for Employment',
    title: 'Application for Employment',
    description: 'Crew member application form with complete personal data, experience, and qualifications',
    category: 'RECRUITMENT',
    version: '2.0',
    fields: {
      sections: [
        {
          title: 'Personal Information',
          fields: [
            { name: 'fullName', label: 'Full Name', type: 'text', required: true },
            { name: 'placeOfBirth', label: 'Place of Birth', type: 'text', required: true },
            { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
            { name: 'nationality', label: 'Nationality', type: 'text', required: true },
            { name: 'religion', label: 'Religion', type: 'select', options: ['Islam', 'Christian', 'Catholic', 'Hindu', 'Buddha', 'Other'], required: true },
            { name: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'], required: true },
            { name: 'height', label: 'Height (cm)', type: 'number', required: false },
            { name: 'weight', label: 'Weight (kg)', type: 'number', required: false },
            { name: 'bloodType', label: 'Blood Type', type: 'select', options: ['A', 'B', 'AB', 'O'], required: false },
            { name: 'eyeSight', label: 'Eye Sight', type: 'text', required: false },
          ]
        },
        {
          title: 'Contact Information',
          fields: [
            { name: 'address', label: 'Full Address', type: 'textarea', required: true },
            { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
            { name: 'email', label: 'Email Address', type: 'email', required: false },
          ]
        },
        {
          title: 'Position Applied',
          fields: [
            { name: 'appliedRank', label: 'Position/Rank Applied', type: 'rank-select', required: true },
            { name: 'expectedSalary', label: 'Expected Salary (USD)', type: 'number', required: false },
            { name: 'availableDate', label: 'Available to Join', type: 'date', required: false },
          ]
        },
        {
          title: 'Education Background',
          fields: [
            { name: 'lastEducation', label: 'Last Education Level', type: 'text', required: true },
            { name: 'schoolName', label: 'School/Institution Name', type: 'text', required: false },
            { name: 'graduationYear', label: 'Graduation Year', type: 'number', required: false },
            { name: 'major', label: 'Major/Field of Study', type: 'text', required: false },
          ]
        },
        {
          title: 'Certificates & Licenses',
          fields: [
            { name: 'certificates', label: 'List of Certificates', type: 'textarea', placeholder: 'List all valid certificates (COC, COP, etc.)', required: true },
            { name: 'licenseNumber', label: 'License Number', type: 'text', required: false },
            { name: 'licenseExpiry', label: 'License Expiry Date', type: 'date', required: false },
          ]
        },
        {
          title: 'Sea Service Experience',
          fields: [
            { name: 'totalSeaService', label: 'Total Sea Service (months)', type: 'number', required: false },
            { name: 'lastVessel', label: 'Last Vessel', type: 'text', required: false },
            { name: 'lastRank', label: 'Last Rank', type: 'text', required: false },
            { name: 'lastSignOff', label: 'Last Sign-Off Date', type: 'date', required: false },
            { name: 'experience', label: 'Detailed Experience', type: 'textarea', placeholder: 'List previous vessels, ranks, and duration', required: false },
          ]
        },
        {
          title: 'Emergency Contact',
          fields: [
            { name: 'emergencyName', label: 'Emergency Contact Name', type: 'text', required: true },
            { name: 'emergencyRelation', label: 'Relationship', type: 'text', required: true },
            { name: 'emergencyPhone', label: 'Emergency Phone', type: 'tel', required: true },
            { name: 'emergencyAddress', label: 'Emergency Contact Address', type: 'textarea', required: true },
          ]
        },
        {
          title: 'Additional Information',
          fields: [
            { name: 'specialSkills', label: 'Special Skills', type: 'textarea', required: false },
            { name: 'languages', label: 'Languages Spoken', type: 'text', placeholder: 'e.g., English, Indonesian, Mandarin', required: false },
            { name: 'medicalConditions', label: 'Medical Conditions (if any)', type: 'textarea', required: false },
            { name: 'remarks', label: 'Additional Remarks', type: 'textarea', required: false },
          ]
        }
      ]
    }
  },
  
  {
    code: 'DOC-CHECKLIST',
    name: 'Document Checklist for Crew',
    title: 'Document Checklist for Crew',
    description: 'Complete list of required documents for crew onboarding',
    category: 'DOCUMENTATION',
    version: '1.0',
    fields: {
      sections: [
        {
          title: 'Identity Documents',
          fields: [
            { name: 'passport', label: 'Passport (valid min. 6 months)', type: 'checkbox', required: true },
            { name: 'passportCopy', label: 'Passport Copy (color)', type: 'file', required: true },
            { name: 'seamanBook', label: 'Seaman Book', type: 'checkbox', required: true },
            { name: 'seamanBookCopy', label: 'Seaman Book Copy', type: 'file', required: true },
            { name: 'ktp', label: 'KTP/ID Card', type: 'checkbox', required: true },
            { name: 'ktpCopy', label: 'KTP Copy', type: 'file', required: true },
          ]
        },
        {
          title: 'Certificates of Competency',
          fields: [
            { name: 'coc', label: 'Certificate of Competency (COC)', type: 'checkbox', required: true },
            { name: 'cocCopy', label: 'COC Copy', type: 'file', required: true },
            { name: 'cop', label: 'Certificate of Proficiency (COP)', type: 'checkbox', required: false },
            { name: 'copCopy', label: 'COP Copy', type: 'file', required: false },
            { name: 'endorsement', label: 'Flag State Endorsement', type: 'checkbox', required: false },
            { name: 'endorsementCopy', label: 'Endorsement Copy', type: 'file', required: false },
          ]
        },
        {
          title: 'Medical & Health',
          fields: [
            { name: 'medicalCertificate', label: 'Medical Certificate (valid)', type: 'checkbox', required: true },
            { name: 'medicalCopy', label: 'Medical Certificate Copy', type: 'file', required: true },
            { name: 'yellowFever', label: 'Yellow Fever Certificate', type: 'checkbox', required: false },
            { name: 'vaccination', label: 'Vaccination Record', type: 'checkbox', required: false },
          ]
        },
        {
          title: 'Training Certificates',
          fields: [
            { name: 'bst', label: 'Basic Safety Training (BST)', type: 'checkbox', required: true },
            { name: 'bstCopy', label: 'BST Copy', type: 'file', required: true },
            { name: 'advancedFirefighting', label: 'Advanced Fire Fighting', type: 'checkbox', required: false },
            { name: 'medicalFirstAid', label: 'Medical First Aid', type: 'checkbox', required: false },
            { name: 'securityAwareness', label: 'Security Awareness', type: 'checkbox', required: false },
            { name: 'tankerTraining', label: 'Tanker Training (if applicable)', type: 'checkbox', required: false },
          ]
        },
        {
          title: 'Service Records',
          fields: [
            { name: 'seamanServiceRecord', label: 'Seaman Service Record Book', type: 'checkbox', required: true },
            { name: 'serviceRecordCopy', label: 'Service Record Copy', type: 'file', required: true },
            { name: 'dischargeBook', label: 'Discharge Book', type: 'checkbox', required: false },
            { name: 'referenceLetters', label: 'Reference Letters', type: 'checkbox', required: false },
          ]
        },
        {
          title: 'Other Documents',
          fields: [
            { name: 'cv', label: 'Updated CV', type: 'checkbox', required: true },
            { name: 'cvFile', label: 'CV File', type: 'file', required: true },
            { name: 'photo', label: 'Recent Photo (4x6)', type: 'checkbox', required: true },
            { name: 'photoFile', label: 'Photo File', type: 'file', required: true },
            { name: 'nextOfKin', label: 'Next of Kin Form', type: 'checkbox', required: true },
            { name: 'declaration', label: 'Declaration Form', type: 'checkbox', required: true },
          ]
        }
      ]
    }
  },

  {
    code: 'AC-01',
    name: 'Application to Work On Board Form',
    title: 'Application to Work On Board Form',
    description: 'Formal application to work onboard vessel',
    category: 'APPLICATION',
    version: '1.0',
    fields: {
      sections: [
        {
          title: 'Applicant Information',
          fields: [
            { name: 'fullName', label: 'Full Name', type: 'text', required: true },
            { name: 'dateOfApplication', label: 'Date of Application', type: 'date', required: true },
            { name: 'positionApplied', label: 'Position Applied', type: 'rank-select', required: true },
            { name: 'vesselName', label: 'Vessel Name (if known)', type: 'text', required: false },
          ]
        },
        {
          title: 'Declaration',
          fields: [
            { name: 'agreeToTerms', label: 'I agree to the terms and conditions', type: 'checkbox', required: true },
            { name: 'medicallyFit', label: 'I declare that I am medically fit', type: 'checkbox', required: true },
            { name: 'certificatesValid', label: 'All my certificates are valid', type: 'checkbox', required: true },
            { name: 'signature', label: 'Applicant Signature', type: 'text', required: true },
            { name: 'signatureDate', label: 'Date', type: 'date', required: true },
          ]
        }
      ]
    }
  },

  {
    code: 'AC-02',
    name: 'Next of Kin Form',
    title: 'Next of Kin Form',
    description: 'Emergency contact and next of kin information',
    category: 'APPLICATION',
    version: '1.0',
    fields: {
      sections: [
        {
          title: 'Crew Member Information',
          fields: [
            { name: 'crewName', label: 'Crew Member Name', type: 'text', required: true },
            { name: 'crewRank', label: 'Rank', type: 'text', required: true },
          ]
        },
        {
          title: 'Next of Kin Details',
          fields: [
            { name: 'nokName', label: 'Next of Kin Name', type: 'text', required: true },
            { name: 'nokRelationship', label: 'Relationship', type: 'text', required: true },
            { name: 'nokPhone', label: 'Phone Number', type: 'tel', required: true },
            { name: 'nokAddress', label: 'Full Address', type: 'textarea', required: true },
            { name: 'nokEmail', label: 'Email', type: 'email', required: false },
          ]
        },
        {
          title: 'Alternative Contact',
          fields: [
            { name: 'altName', label: 'Alternative Contact Name', type: 'text', required: false },
            { name: 'altRelationship', label: 'Relationship', type: 'text', required: false },
            { name: 'altPhone', label: 'Phone Number', type: 'tel', required: false },
          ]
        }
      ]
    }
  },

  {
    code: 'AC-03',
    name: 'Allotment Form',
    title: 'Allotment Form',
    description: 'Salary allotment and beneficiary information',
    category: 'APPLICATION',
    version: '1.0',
    fields: {
      sections: [
        {
          title: 'Crew Information',
          fields: [
            { name: 'crewName', label: 'Crew Member Name', type: 'text', required: true },
            { name: 'crewRank', label: 'Rank', type: 'text', required: true },
            { name: 'vessel', label: 'Vessel Name', type: 'text', required: true },
          ]
        },
        {
          title: 'Allotment Details',
          fields: [
            { name: 'allotmentAmount', label: 'Allotment Amount (USD)', type: 'number', required: true },
            { name: 'allotmentPercentage', label: 'Percentage of Salary (%)', type: 'number', required: false },
            { name: 'beneficiaryName', label: 'Beneficiary Name', type: 'text', required: true },
            { name: 'beneficiaryRelation', label: 'Relationship', type: 'text', required: true },
          ]
        },
        {
          title: 'Bank Details',
          fields: [
            { name: 'bankName', label: 'Bank Name', type: 'text', required: true },
            { name: 'accountNumber', label: 'Account Number', type: 'text', required: true },
            { name: 'accountName', label: 'Account Holder Name', type: 'text', required: true },
            { name: 'swiftCode', label: 'SWIFT/BIC Code', type: 'text', required: false },
          ]
        }
      ]
    }
  },

  {
    code: 'AC-04',
    name: 'Declaration Form',
    title: 'Crew Declaration Form',
    description: 'Declaration of health, criminal record, and employment eligibility',
    category: 'APPLICATION',
    version: '1.0',
    fields: {
      sections: [
        {
          title: 'Personal Declaration',
          fields: [
            { name: 'fullName', label: 'Full Name', type: 'text', required: true },
            { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
            { name: 'nationality', label: 'Nationality', type: 'text', required: true },
          ]
        },
        {
          title: 'Health Declaration',
          fields: [
            { name: 'medicallyFit', label: 'I declare that I am medically fit for sea service', type: 'checkbox', required: true },
            { name: 'noInfectiousDisease', label: 'I have no infectious diseases', type: 'checkbox', required: true },
            { name: 'medicationDetails', label: 'Current medications (if any)', type: 'textarea', required: false },
            { name: 'allergies', label: 'Known allergies', type: 'textarea', required: false },
          ]
        },
        {
          title: 'Criminal Record',
          fields: [
            { name: 'noCriminalRecord', label: 'I have no criminal record', type: 'checkbox', required: true },
            { name: 'criminalDetails', label: 'Details (if applicable)', type: 'textarea', required: false },
          ]
        },
        {
          title: 'Employment Eligibility',
          fields: [
            { name: 'legalToWork', label: 'I am legally eligible to work at sea', type: 'checkbox', required: true },
            { name: 'certificatesValid', label: 'All my certificates are valid and genuine', type: 'checkbox', required: true },
            { name: 'truthfulInformation', label: 'All information provided is truthful', type: 'checkbox', required: true },
          ]
        },
        {
          title: 'Signature',
          fields: [
            { name: 'signature', label: 'Full Name (as signature)', type: 'text', required: true },
            { name: 'signatureDate', label: 'Date', type: 'date', required: true },
            { name: 'place', label: 'Place', type: 'text', required: true },
          ]
        }
      ]
    }
  },

  {
    code: 'AC-05',
    name: 'Medical Fitness Certificate',
    title: 'Medical Fitness for Sea Service',
    description: 'Medical examination report and fitness declaration',
    category: 'APPLICATION',
    version: '1.0',
    fields: {
      sections: [
        {
          title: 'Crew Information',
          fields: [
            { name: 'fullName', label: 'Full Name', type: 'text', required: true },
            { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
            { name: 'age', label: 'Age', type: 'number', required: true },
            { name: 'rank', label: 'Rank/Position', type: 'rank-select', required: true },
          ]
        },
        {
          title: 'Medical Certificate Details',
          fields: [
            { name: 'certificateNumber', label: 'Medical Certificate Number', type: 'text', required: true },
            { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
            { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
            { name: 'issuingAuthority', label: 'Issuing Authority', type: 'text', required: true },
            { name: 'doctorName', label: 'Examining Doctor Name', type: 'text', required: true },
          ]
        },
        {
          title: 'Medical Status',
          fields: [
            { name: 'fitForDuty', label: 'Fit for duty', type: 'select', options: ['Fit', 'Unfit', 'Fit with restrictions'], required: true },
            { name: 'restrictions', label: 'Restrictions (if any)', type: 'textarea', required: false },
            { name: 'remarks', label: 'Medical Remarks', type: 'textarea', required: false },
          ]
        }
      ]
    }
  },

  {
    code: 'AC-06',
    name: 'Employment Contract',
    title: 'Seafarer Employment Agreement',
    description: 'Contract of employment between seafarer and company',
    category: 'APPLICATION',
    version: '1.0',
    fields: {
      sections: [
        {
          title: 'Contract Parties',
          fields: [
            { name: 'seafarerName', label: 'Seafarer Name', type: 'text', required: true },
            { name: 'companyName', label: 'Company Name', type: 'text', required: true },
            { name: 'contractDate', label: 'Contract Date', type: 'date', required: true },
          ]
        },
        {
          title: 'Employment Details',
          fields: [
            { name: 'rank', label: 'Rank/Position', type: 'rank-select', required: true },
            { name: 'vesselName', label: 'Vessel Name', type: 'text', required: true },
            { name: 'contractDuration', label: 'Contract Duration (months)', type: 'number', required: true },
            { name: 'commencementDate', label: 'Commencement Date', type: 'date', required: true },
            { name: 'expectedCompletionDate', label: 'Expected Completion Date', type: 'date', required: true },
          ]
        },
        {
          title: 'Compensation',
          fields: [
            { name: 'basicSalary', label: 'Basic Salary (USD/month)', type: 'number', required: true },
            { name: 'overtimePay', label: 'Overtime Rate (USD/hour)', type: 'number', required: false },
            { name: 'fixedOvertime', label: 'Fixed Overtime (hours/month)', type: 'number', required: false },
            { name: 'leavePayRate', label: 'Leave Pay Rate (days/month)', type: 'number', required: false },
            { name: 'otherAllowances', label: 'Other Allowances', type: 'textarea', required: false },
          ]
        },
        {
          title: 'Working Hours',
          fields: [
            { name: 'workingHours', label: 'Working Hours per Day', type: 'number', required: true },
            { name: 'restHours', label: 'Rest Hours per Day', type: 'number', required: true },
            { name: 'watchSchedule', label: 'Watch Schedule', type: 'text', required: false },
          ]
        },
        {
          title: 'Agreement',
          fields: [
            { name: 'acceptTerms', label: 'I accept all terms and conditions', type: 'checkbox', required: true },
            { name: 'seafarerSignature', label: 'Seafarer Signature', type: 'text', required: true },
            { name: 'seafarerSignatureDate', label: 'Date', type: 'date', required: true },
            { name: 'companyRepresentative', label: 'Company Representative Name', type: 'text', required: true },
            { name: 'companySignatureDate', label: 'Date', type: 'date', required: true },
          ]
        }
      ]
    }
  },

  // ADMINISTRATIVE FORMS
  {
    code: 'AD-01',
    name: 'Leave Application',
    title: 'Crew Leave Application Form',
    description: 'Application for annual leave, sick leave, or emergency leave',
    category: 'ADMINISTRATIVE',
    version: '1.0',
    fields: {
      sections: [
        {
          title: 'Applicant Information',
          fields: [
            { name: 'crewName', label: 'Crew Name', type: 'text', required: true },
            { name: 'rank', label: 'Rank', type: 'rank-select', required: true },
            { name: 'vessel', label: 'Vessel Name', type: 'text', required: true },
          ]
        },
        {
          title: 'Leave Details',
          fields: [
            { name: 'leaveType', label: 'Type of Leave', type: 'select', options: ['Annual Leave', 'Sick Leave', 'Emergency Leave', 'Compassionate Leave', 'Other'], required: true },
            { name: 'startDate', label: 'Leave Start Date', type: 'date', required: true },
            { name: 'endDate', label: 'Leave End Date', type: 'date', required: true },
            { name: 'numberOfDays', label: 'Number of Days', type: 'number', required: true },
            { name: 'reason', label: 'Reason for Leave', type: 'textarea', required: true },
          ]
        },
        {
          title: 'Contact During Leave',
          fields: [
            { name: 'contactAddress', label: 'Address During Leave', type: 'textarea', required: true },
            { name: 'contactPhone', label: 'Contact Phone Number', type: 'tel', required: true },
            { name: 'emergencyContact', label: 'Emergency Contact', type: 'text', required: false },
          ]
        },
        {
          title: 'Approval',
          fields: [
            { name: 'applicantSignature', label: 'Applicant Signature', type: 'text', required: true },
            { name: 'applicationDate', label: 'Application Date', type: 'date', required: true },
          ]
        }
      ]
    }
  },

  {
    code: 'AD-02',
    name: 'Travel Request',
    title: 'Travel Authorization Request',
    description: 'Request for travel arrangements and reimbursement',
    category: 'ADMINISTRATIVE',
    version: '1.0',
    fields: {
      sections: [
        {
          title: 'Traveler Information',
          fields: [
            { name: 'crewName', label: 'Crew Name', type: 'text', required: true },
            { name: 'rank', label: 'Rank', type: 'text', required: true },
            { name: 'departureFrom', label: 'Departure From', type: 'text', required: true },
            { name: 'destination', label: 'Destination', type: 'text', required: true },
          ]
        },
        {
          title: 'Travel Details',
          fields: [
            { name: 'travelPurpose', label: 'Purpose of Travel', type: 'select', options: ['Sign On', 'Sign Off', 'Medical', 'Training', 'Official Business', 'Other'], required: true },
            { name: 'departureDate', label: 'Departure Date', type: 'date', required: true },
            { name: 'returnDate', label: 'Return Date', type: 'date', required: false },
            { name: 'travelMode', label: 'Mode of Travel', type: 'select', options: ['Flight', 'Train', 'Bus', 'Ferry', 'Private Vehicle'], required: true },
          ]
        },
        {
          title: 'Cost Estimates',
          fields: [
            { name: 'estimatedTicketCost', label: 'Estimated Ticket Cost (USD)', type: 'number', required: false },
            { name: 'estimatedAccommodation', label: 'Accommodation Cost (USD)', type: 'number', required: false },
            { name: 'estimatedMeals', label: 'Meals & Allowance (USD)', type: 'number', required: false },
            { name: 'otherExpenses', label: 'Other Expenses', type: 'textarea', required: false },
          ]
        }
      ]
    }
  },

  {
    code: 'AD-03',
    name: 'Expense Claim',
    title: 'Expense Reimbursement Claim',
    description: 'Claim for reimbursement of work-related expenses',
    category: 'ADMINISTRATIVE',
    version: '1.0',
    fields: {
      sections: [
        {
          title: 'Claimant Information',
          fields: [
            { name: 'crewName', label: 'Crew Name', type: 'text', required: true },
            { name: 'rank', label: 'Rank', type: 'text', required: true },
            { name: 'claimDate', label: 'Claim Date', type: 'date', required: true },
          ]
        },
        {
          title: 'Expense Details',
          fields: [
            { name: 'expenseType', label: 'Type of Expense', type: 'select', options: ['Travel', 'Accommodation', 'Meals', 'Medical', 'Equipment', 'Communication', 'Other'], required: true },
            { name: 'expenseDate', label: 'Date of Expense', type: 'date', required: true },
            { name: 'amount', label: 'Amount (USD)', type: 'number', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: true },
            { name: 'receiptAttached', label: 'Receipt Attached', type: 'checkbox', required: true },
          ]
        },
        {
          title: 'Payment Details',
          fields: [
            { name: 'paymentMethod', label: 'Preferred Payment Method', type: 'select', options: ['Bank Transfer', 'Cash', 'Deduct from Salary'], required: true },
            { name: 'bankDetails', label: 'Bank Account Details', type: 'textarea', required: false },
          ]
        }
      ]
    }
  },

  {
    code: 'AD-04',
    name: 'Incident Report',
    title: 'Incident/Accident Report Form',
    description: 'Report of incident, accident, or near-miss event',
    category: 'ADMINISTRATIVE',
    version: '1.0',
    fields: {
      sections: [
        {
          title: 'Reporter Information',
          fields: [
            { name: 'reporterName', label: 'Reporter Name', type: 'text', required: true },
            { name: 'reporterRank', label: 'Rank', type: 'rank-select', required: true },
            { name: 'reportDate', label: 'Report Date', type: 'date', required: true },
          ]
        },
        {
          title: 'Incident Details',
          fields: [
            { name: 'incidentType', label: 'Type of Incident', type: 'select', options: ['Personal Injury', 'Equipment Damage', 'Environmental', 'Security', 'Near Miss', 'Other'], required: true },
            { name: 'incidentDate', label: 'Date of Incident', type: 'date', required: true },
            { name: 'incidentTime', label: 'Time of Incident', type: 'text', required: true },
            { name: 'location', label: 'Location', type: 'text', required: true },
            { name: 'vesselName', label: 'Vessel Name', type: 'text', required: true },
          ]
        },
        {
          title: 'Incident Description',
          fields: [
            { name: 'description', label: 'Detailed Description', type: 'textarea', required: true },
            { name: 'personsInvolved', label: 'Persons Involved', type: 'textarea', required: false },
            { name: 'witnesses', label: 'Witnesses', type: 'textarea', required: false },
            { name: 'injuries', label: 'Injuries (if any)', type: 'textarea', required: false },
            { name: 'damages', label: 'Damages (if any)', type: 'textarea', required: false },
          ]
        },
        {
          title: 'Immediate Actions',
          fields: [
            { name: 'actionsTaken', label: 'Immediate Actions Taken', type: 'textarea', required: true },
            { name: 'medicalTreatment', label: 'Medical Treatment Provided', type: 'textarea', required: false },
          ]
        },
        {
          title: 'Root Cause & Prevention',
          fields: [
            { name: 'rootCause', label: 'Root Cause Analysis', type: 'textarea', required: false },
            { name: 'preventiveMeasures', label: 'Preventive Measures Recommended', type: 'textarea', required: false },
          ]
        }
      ]
    }
  }
]

async function main() {
  console.log('🚀 Seeding complete form templates...\n')

  for (const template of formTemplates) {
    try {
      const result = await prisma.formTemplate.upsert({
        where: { code: template.code },
        update: {
          name: template.name,
          title: template.title,
          description: template.description,
          category: template.category,
          version: template.version,
          fields: template.fields,
        },
        create: {
          code: template.code,
          name: template.name,
          title: template.title,
          description: template.description,
          category: template.category,
          version: template.version,
          fields: template.fields,
        },
      })
      
      console.log(`✅ ${result.code}: ${result.title}`)
      const totalFields = result.fields.sections.reduce((sum, section) => sum + section.fields.length, 0)
      console.log(`   Sections: ${result.fields.sections.length}, Total Fields: ${totalFields}\n`)
    } catch (error) {
      console.error(`❌ Error with ${template.code}:`, error.message)
    }
  }

  console.log('✅ Form templates seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
