const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define all 42 forms based on HGQS manual structure
const FORMS = {
  // CR Forms (17) - Crewing Department
  CR: [
    { code: 'HGF-CR-01', name: 'Document Checklist', description: 'Pre-joining document verification checklist' },
    { code: 'HGF-CR-02', name: 'Application for Employment', description: 'Employment application form' },
    { code: 'HGF-CR-03', name: 'Crew Personal Data', description: 'Detailed crew personal information' },
    { code: 'HGF-CR-04', name: 'Next of Kin', description: 'Emergency contact information' },
    { code: 'HGF-CR-05', name: 'Declaration Form', description: 'Crew declaration and agreement' },
    { code: 'HGF-CR-06', name: 'Training Record', description: 'Training and certification record' },
    { code: 'HGF-CR-07', name: 'Medical Examination Record', description: 'MLC 2006 medical examination' },
    { code: 'HGF-CR-08', name: 'Joining Instruction', description: 'Pre-joining travel and vessel instructions' },
    { code: 'HGF-CR-09', name: 'Crew Evaluation Report', description: 'Performance evaluation form' },
    { code: 'HGF-CR-10', name: 'Crew Replacement Plan', description: 'Monthly crew rotation planning' },
    { code: 'HGF-CR-11', name: 'Sign-Off Report', description: 'Crew sign-off documentation' },
    { code: 'HGF-CR-12', name: 'Repatriation Form', description: 'Crew repatriation arrangement' },
    { code: 'HGF-CR-13', name: 'Incident Report', description: 'Crew incident and near-miss report' },
    { code: 'HGF-CR-14', name: 'Semester Report to Government', description: 'Bi-annual report to DISHUB' },
    { code: 'HGF-CR-15', name: 'Crew Change Schedule', description: 'Vessel crew change planning' },
    { code: 'HGF-CR-16', name: 'Contract Extension Request', description: 'Contract extension approval form' },
    { code: 'HGF-CR-17', name: 'Crew Database Update', description: 'Master crew data update form' },
  ],
  
  // AD Forms (20) - Administration/Documentation Department
  AD: [
    { code: 'HGF-AD-01', name: 'Visa Application', description: 'Crew visa application processing' },
    { code: 'HGF-AD-02', name: 'Passport Processing', description: 'Passport renewal/application' },
    { code: 'HGF-AD-03', name: 'Seaman Book Application', description: 'Seaman book processing' },
    { code: 'HGF-AD-04', name: 'Certificate of Competency', description: 'COC application/renewal' },
    { code: 'HGF-AD-05', name: 'Certificate of Proficiency', description: 'COP application/renewal' },
    { code: 'HGF-AD-06', name: 'Yellow Fever Vaccination', description: 'Yellow fever vaccination record' },
    { code: 'HGF-AD-07', name: 'COVID-19 Vaccination', description: 'COVID-19 vaccination certificate' },
    { code: 'HGF-AD-08', name: 'Police Clearance', description: 'Police clearance certificate' },
    { code: 'HGF-AD-09', name: 'Document Expiry Alert', description: 'Document expiry notification' },
    { code: 'HGF-AD-10', name: 'Document Submission Log', description: 'Document submission tracking' },
    { code: 'HGF-AD-11', name: 'Embassy Appointment', description: 'Embassy appointment scheduling' },
    { code: 'HGF-AD-12', name: 'Flight Booking Request', description: 'Crew travel booking form' },
    { code: 'HGF-AD-13', name: 'Hotel Accommodation', description: 'Pre-joining hotel arrangement' },
    { code: 'HGF-AD-14', name: 'Travel Itinerary', description: 'Complete travel schedule' },
    { code: 'HGF-AD-15', name: 'Immigration Clearance', description: 'Immigration processing form' },
    { code: 'HGF-AD-16', name: 'Quarantine Certificate', description: 'Health quarantine clearance' },
    { code: 'HGF-AD-17', name: 'Insurance Coverage', description: 'Crew insurance documentation' },
    { code: 'HGF-AD-18', name: 'Document Archive Log', description: 'Document archival tracking' },
    { code: 'HGF-AD-19', name: 'Principal Approval Request', description: 'Principal approval form' },
    { code: 'HGF-AD-20', name: 'Document Verification Report', description: 'Document verification summary' },
  ],
  
  // AC Forms (5) - Accounting Department
  AC: [
    { code: 'HGF-AC-01', name: 'Wage Calculation', description: 'Monthly wage calculation sheet' },
    { code: 'HGF-AC-02', name: 'Allotment Processing', description: 'Crew allotment to family' },
    { code: 'HGF-AC-03', name: 'Cash Advance Request', description: 'Crew cash advance form' },
    { code: 'HGF-AC-04', name: 'Final Account Settlement', description: 'Sign-off final account' },
    { code: 'HGF-AC-05', name: 'Deduction Authorization', description: 'Salary deduction approval' },
  ],
};

async function main() {
  console.log('🚀 Starting to seed 42 forms...\n');

  let totalCreated = 0;
  let totalSkipped = 0;

  // Process each category
  for (const [category, forms] of Object.entries(FORMS)) {
    console.log(`\n📋 Processing ${category} Forms (${forms.length} forms)...`);
    
    for (const form of forms) {
      try {
        // Check if form already exists
        const existing = await prisma.formTemplate.findUnique({
          where: { code: form.code }
        });

        if (existing) {
          console.log(`   ⏭️  ${form.code} already exists - skipping`);
          totalSkipped++;
          continue;
        }

        // Create form template
        await prisma.formTemplate.create({
          data: {
            code: form.code,
            name: form.name,
            description: form.description,
          }
        });

        console.log(`   ✅ Created ${form.code}: ${form.name}`);
        totalCreated++;
      } catch (error) {
        console.error(`   ❌ Failed to create ${form.code}:`, error.message);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Seeding complete!`);
  console.log(`   Created: ${totalCreated} forms`);
  console.log(`   Skipped: ${totalSkipped} forms`);
  console.log(`   Total:   ${totalCreated + totalSkipped} forms`);
  console.log('='.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ Error seeding forms:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
