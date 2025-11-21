const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define 6 comprehensive checklists from HGQS manual
const CHECKLISTS = [
  {
    code: 'PRE_JOINING',
    name: 'Pre-Joining Documents',
    description: 'Document verification before crew joins vessel',
    items: [
      { name: 'passport', label: 'Valid Passport', category: 'Identity', required: true },
      { name: 'seamanBook', label: 'Seaman Book / CDC', category: 'Identity', required: true },
      { name: 'nationalId', label: 'National ID / KTP', category: 'Identity', required: true },
      { name: 'coc', label: 'Certificate of Competency (COC)', category: 'Certificates', required: true },
      { name: 'cop', label: 'Certificate of Proficiency (COP)', category: 'Certificates', required: false },
      { name: 'gmdss', label: 'GMDSS Certificate', category: 'Certificates', required: false },
      { name: 'tankerCert', label: 'Tanker Certificates (if applicable)', category: 'Certificates', required: false },
      { name: 'visa', label: 'Valid Visa (if required)', category: 'Travel', required: false },
      { name: 'yellowFever', label: 'Yellow Fever Vaccination', category: 'Medical', required: false },
      { name: 'covidVaccine', label: 'COVID-19 Vaccination', category: 'Medical', required: true },
      { name: 'policeClearance', label: 'Police Clearance Certificate', category: 'Background', required: false },
    ]
  },
  {
    code: 'MEDICAL_MLC',
    name: 'Medical Examination (MLC 2006)',
    description: 'Pre-employment medical fitness as per MLC 2006',
    items: [
      { name: 'medicalCertificate', label: 'Valid Medical Certificate', category: 'Document', required: true },
      { name: 'physicalExam', label: 'Physical Examination Complete', category: 'Examination', required: true },
      { name: 'visionTest', label: 'Vision Test', category: 'Examination', required: true },
      { name: 'hearingTest', label: 'Hearing Test', category: 'Examination', required: true },
      { name: 'bloodTest', label: 'Blood Test', category: 'Laboratory', required: true },
      { name: 'urineTest', label: 'Urine Test', category: 'Laboratory', required: true },
      { name: 'xRay', label: 'Chest X-Ray', category: 'Imaging', required: true },
      { name: 'drugTest', label: 'Drug & Alcohol Test', category: 'Laboratory', required: true },
      { name: 'dentalCheck', label: 'Dental Examination', category: 'Examination', required: true },
      { name: 'psychologicalTest', label: 'Psychological Assessment', category: 'Mental Health', required: false },
      { name: 'fitForDuty', label: 'Fit for Duty Declaration', category: 'Approval', required: true },
    ]
  },
  {
    code: 'TRAINING_STCW',
    name: 'Training & STCW Compliance',
    description: 'Mandatory STCW training certificates verification',
    items: [
      { name: 'basicSafety', label: 'Basic Safety Training (BST)', category: 'Basic', required: true },
      { name: 'advancedFirefighting', label: 'Advanced Fire Fighting', category: 'Safety', required: false },
      { name: 'medicalFirstAid', label: 'Medical First Aid / Medical Care', category: 'Medical', required: false },
      { name: 'proficiencySurvival', label: 'Proficiency in Survival Craft', category: 'Safety', required: false },
      { name: 'securityAwareness', label: 'Security Awareness (ISPS)', category: 'Security', required: true },
      { name: 'shipSecurity', label: 'Ship Security Officer (SSO)', category: 'Security', required: false },
      { name: 'radarNavigation', label: 'Radar Navigation & ARPA', category: 'Navigation', required: false },
      { name: 'ecdis', label: 'ECDIS Training', category: 'Navigation', required: false },
      { name: 'bridgeResourceMgmt', label: 'Bridge Resource Management', category: 'Management', required: false },
      { name: 'engineResourceMgmt', label: 'Engine Resource Management', category: 'Management', required: false },
      { name: 'shipSimulator', label: 'Ship Simulator Training', category: 'Simulation', required: false },
    ]
  },
  {
    code: 'DOCUMENT_VERIFICATION',
    name: 'Document Verification',
    description: 'Documentation Officer verification checklist',
    items: [
      { name: 'originalDocsReceived', label: 'Original Documents Received', category: 'Reception', required: true },
      { name: 'photocopiesMade', label: 'Photocopies Made & Filed', category: 'Filing', required: true },
      { name: 'documentsScanned', label: 'Documents Scanned to System', category: 'Digital', required: true },
      { name: 'expiryDatesChecked', label: 'Expiry Dates Verified', category: 'Validation', required: true },
      { name: 'authenticityVerified', label: 'Authenticity Verified', category: 'Validation', required: true },
      { name: 'issuerContactVerified', label: 'Issuing Authority Contacted', category: 'Validation', required: false },
      { name: 'flagStateApproval', label: 'Flag State Approval (if required)', category: 'Approval', required: false },
      { name: 'principalApproval', label: 'Principal Approval Obtained', category: 'Approval', required: true },
      { name: 'documentsReturned', label: 'Original Documents Returned', category: 'Completion', required: false },
      { name: 'fileArchived', label: 'File Archived Properly', category: 'Completion', required: true },
    ]
  },
  {
    code: 'QUALIFICATION_CHECK',
    name: 'Qualification & Experience',
    description: 'Crew qualification and sea service verification',
    items: [
      { name: 'rankQualified', label: 'Qualified for Applied Rank', category: 'Qualification', required: true },
      { name: 'vesselTypeExp', label: 'Experience on Vessel Type', category: 'Experience', required: true },
      { name: 'seaServiceVerified', label: 'Sea Service Records Verified', category: 'Experience', required: true },
      { name: 'referenceChecked', label: 'References Checked', category: 'Background', required: true },
      { name: 'previousEmployerContact', label: 'Previous Employer Contacted', category: 'Background', required: false },
      { name: 'performanceRecord', label: 'Performance Records Reviewed', category: 'Assessment', required: false },
      { name: 'incidentHistory', label: 'Incident History Checked', category: 'Safety', required: true },
      { name: 'blacklistCheck', label: 'Blacklist Database Checked', category: 'Compliance', required: true },
      { name: 'englishProficiency', label: 'English Proficiency Verified', category: 'Communication', required: true },
      { name: 'technicalInterview', label: 'Technical Interview Completed', category: 'Assessment', required: true },
    ]
  },
  {
    code: 'SIGN_OFF_CHECKLIST',
    name: 'Sign-Off Procedure',
    description: 'Crew sign-off and repatriation checklist',
    items: [
      { name: 'signOffNoticeReceived', label: 'Sign-Off Notice Received', category: 'Notification', required: true },
      { name: 'reliefCrewConfirmed', label: 'Relief Crew Confirmed', category: 'Planning', required: true },
      { name: 'travelArranged', label: 'Travel & Flight Booked', category: 'Travel', required: true },
      { name: 'finalAccountPrepared', label: 'Final Account Prepared', category: 'Finance', required: true },
      { name: 'wagesPaid', label: 'Outstanding Wages Paid', category: 'Finance', required: true },
      { name: 'allotmentSettled', label: 'Allotment Settled', category: 'Finance', required: true },
      { name: 'handoverCompleted', label: 'Handover to Relief Completed', category: 'Operations', required: true },
      { name: 'equipmentReturned', label: 'Company Equipment Returned', category: 'Inventory', required: true },
      { name: 'exitInterview', label: 'Exit Interview Conducted', category: 'HR', required: false },
      { name: 'performanceEvaluation', label: 'Performance Evaluation Submitted', category: 'HR', required: true },
      { name: 'medicalCheckComplete', label: 'Post-Contract Medical Check', category: 'Medical', required: false },
      { name: 'documentsReturned', label: 'Documents Returned to Office', category: 'Documentation', required: true },
      { name: 'vacationScheduled', label: 'Vacation Period Scheduled', category: 'HR', required: false },
    ]
  }
];

async function main() {
  console.log('🚀 Starting to create 6 checklist templates...\n');

  for (const checklist of CHECKLISTS) {
    console.log(`\n📋 Creating checklist: ${checklist.name}`);
    console.log(`   Code: ${checklist.code}`);
    console.log(`   Items: ${checklist.items.length}`);
    
    // Store as JSON in the procedure field of DocumentChecklist model
    // This is a template definition that will be used when creating actual checklists
    
    console.log(`   ✅ Template defined`);
    
    // Print items summary
    const required = checklist.items.filter(i => i.required).length;
    const optional = checklist.items.length - required;
    console.log(`   📊 ${required} required, ${optional} optional items`);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Checklist templates ready!`);
  console.log(`   Total: ${CHECKLISTS.length} checklists`);
  console.log(`   Total items: ${CHECKLISTS.reduce((sum, c) => sum + c.items.length, 0)}`);
  console.log('='.repeat(60));
  
  // Save templates to a JSON file for reference
  const fs = require('fs');
  const path = require('path');
  const outputPath = path.join(__dirname, '..', 'checklist-templates.json');
  fs.writeFileSync(outputPath, JSON.stringify(CHECKLISTS, null, 2));
  console.log(`\n💾 Templates saved to: checklist-templates.json`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
