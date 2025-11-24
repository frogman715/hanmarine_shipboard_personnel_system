#!/usr/bin/env node

/**
 * Seed form templates (HGF-CR-01, HGF-CR-02) into database
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const FORM_DATA = {
  'HGF-CR-01': {
    name: 'Document Checklist',
    description: 'Checklist for crew documents verification',
    fields: [
      // Metadata section
      { name: 'vesselName', label: 'Vessel Name', type: 'text', section: 'Metadata', order: 1 },
      { name: 'seamanName', label: "Seaman's Name", type: 'text', section: 'Metadata', order: 2 },
      { name: 'birthDate', label: 'Birth Date', type: 'date', section: 'Metadata', order: 3 },
      { name: 'flag', label: 'Flag', type: 'text', section: 'Metadata', order: 4 },
      { name: 'rank', label: 'Rank', type: 'text', section: 'Metadata', order: 5 },
      { name: 'joiningDate', label: 'Joining Date', type: 'date', section: 'Metadata', order: 6 },
      { name: 'type', label: 'Type', type: 'text', section: 'Metadata', order: 7 },
      { name: 'nationality', label: 'Nationality', type: 'text', section: 'Metadata', order: 8 },
      { name: 'signOfVerifier', label: 'Sign. of Verifier', type: 'text', section: 'Metadata', order: 9 },

      // Document records (repeating)
      {
        name: 'documentType',
        label: 'Document Type',
        type: 'checkbox',
        section: 'Documents',
        repeating: true,
        order: 10,
        options: JSON.stringify([
          'National Seaman Book',
          'National License',
          'Flag State Seaman Book',
          'COC',
          'Medical Certificate',
          'Yellow Fever Vaccination',
          'Passport',
          'Visa',
          'Training Certificate',
          'Other',
        ]),
      },
      { name: 'documentNumber', label: 'Document Number', type: 'text', section: 'Documents', repeating: true, order: 11 },
      { name: 'issueDate', label: 'Issue Date', type: 'date', section: 'Documents', repeating: true, order: 12 },
      { name: 'expiryDate', label: 'Expiry Date', type: 'date', section: 'Documents', repeating: true, order: 13 },
      { name: 'remarks', label: 'Remarks', type: 'textarea', section: 'Documents', repeating: true, order: 14 },
    ],
  },

  'HGF-CR-02': {
    name: 'Application for Employment',
    description: 'Crew employment application form',
    fields: [
      // Personal Information
      { name: 'shipName', label: "Ship's Name", type: 'text', section: 'Personal Info', order: 1 },
      { name: 'familyName', label: 'Family Name', type: 'text', section: 'Personal Info', required: true, order: 2 },
      { name: 'givenName', label: 'Given Name', type: 'text', section: 'Personal Info', required: true, order: 3 },
      { name: 'middleName', label: 'Middle Name', type: 'text', section: 'Personal Info', order: 4 },
      { name: 'chineseName', label: 'Chinese Name', type: 'text', section: 'Personal Info', order: 5 },
      { name: 'rank', label: 'Rank', type: 'text', section: 'Personal Info', required: true, order: 6 },
      { name: 'birthDate', label: 'Birth Date', type: 'date', section: 'Personal Info', required: true, order: 7 },
      { name: 'height', label: 'Height (cm)', type: 'number', section: 'Personal Info', order: 8 },
      { name: 'weight', label: 'Weight (kg)', type: 'number', section: 'Personal Info', order: 9 },

      // Seaman Book & License
      { name: 'sbNationality', label: 'S/Book Nationality', type: 'text', section: 'Seaman Book', order: 10 },
      { name: 'sbNumber', label: 'S/Book Number', type: 'text', section: 'Seaman Book', order: 11 },
      { name: 'sbExpiry', label: 'S/Book Expiry', type: 'date', section: 'Seaman Book', order: 12 },
      {
        name: 'licenseNationality',
        label: 'License Nationality',
        type: 'select',
        section: 'License',
        order: 13,
        options: JSON.stringify(['KOREA', 'BAHAMA', 'LIBERIA', 'PANAMA', 'MARSHALL ISLANDS', 'OTHER']),
      },
      { name: 'gocCertificate', label: 'GOC Certificate', type: 'checkbox', section: 'License', order: 14 },

      // Address & Personal Details
      { name: 'presentAddress', label: 'Present Address', type: 'textarea', section: 'Address', order: 15 },
      { name: 'telephone', label: 'Tel. No.', type: 'tel', section: 'Address', order: 16 },
      { name: 'placeOfBirth', label: 'Place of Birth', type: 'text', section: 'Address', order: 17 },
      { name: 'religion', label: 'Religion', type: 'text', section: 'Address', order: 18 },
      { name: 'maritalStatus', label: 'Marital Status', type: 'select', section: 'Address', order: 19, options: JSON.stringify(['Single', 'Married', 'Divorced', 'Widowed']) },

      // Education & Training
      { name: 'lastSchool', label: 'Last School', type: 'text', section: 'Education', order: 20 },
      { name: 'course', label: 'Course/Qualification', type: 'text', section: 'Education', order: 21 },
      { name: 'courseFrom', label: 'Course From', type: 'date', section: 'Education', order: 22 },
      { name: 'courseTo', label: 'Course To', type: 'date', section: 'Education', order: 23 },
      { name: 'safetyTraining', label: 'Safety Training', type: 'checkbox', section: 'Training', order: 24 },
      { name: 'tankerTraining', label: 'Tanker Training', type: 'checkbox', section: 'Training', order: 25 },
      { name: 'coc', label: 'COC', type: 'checkbox', section: 'Training', order: 26 },

      // Family Information (repeating)
      { name: 'familyRelation', label: 'Relation', type: 'text', section: 'Family', repeating: true, order: 27 },
      { name: 'familyName', label: 'Family Member Name', type: 'text', section: 'Family', repeating: true, order: 28 },
      { name: 'familyBirthDate', label: 'Birth Date', type: 'date', section: 'Family', repeating: true, order: 29 },
      { name: 'familyOccupation', label: 'Occupation', type: 'text', section: 'Family', repeating: true, order: 30 },

      // Sea Experience (repeating)
      { name: 'vesselName', label: 'Vessel Name', type: 'text', section: 'Sea Experience', repeating: true, order: 31 },
      { name: 'rankOnVessel', label: 'Rank', type: 'text', section: 'Sea Experience', repeating: true, order: 32 },
      { name: 'signOn', label: 'Sign On', type: 'date', section: 'Sea Experience', repeating: true, order: 33 },
      { name: 'signOff', label: 'Sign Off', type: 'date', section: 'Sea Experience', repeating: true, order: 34 },
      { name: 'vesselType', label: 'Vessel Type', type: 'text', section: 'Sea Experience', repeating: true, order: 35 },
      { name: 'engineType', label: 'Engine Type', type: 'text', section: 'Sea Experience', repeating: true, order: 36 },
      { name: 'grt', label: 'GRT', type: 'number', section: 'Sea Experience', repeating: true, order: 37 },
      { name: 'hp', label: 'H/P', type: 'number', section: 'Sea Experience', repeating: true, order: 38 },
      { name: 'agency', label: 'Agency', type: 'text', section: 'Sea Experience', repeating: true, order: 39 },
      { name: 'principal', label: 'Principal', type: 'text', section: 'Sea Experience', repeating: true, order: 40 },
      { name: 'reasonForLeaving', label: 'Reason for Leaving', type: 'textarea', section: 'Sea Experience', repeating: true, order: 41 },
    ],
  },
}

async function main() {
  try {
    for (const [code, formData] of Object.entries(FORM_DATA)) {
      console.log(`\n📋 Seeding form template: ${code}`)

      // Check if already exists
      const existing = await prisma.formTemplate.findUnique({ where: { code } })
      if (existing) {
        console.log(`   ✓ Template already exists (ID: ${existing.id})`)
        continue
      }

      // Create template with fields (fields is JSON, not relation)
      const template = await prisma.formTemplate.create({
        data: {
          code,
          name: formData.name,
          title: formData.name, // Add title field
          description: formData.description,
          fields: formData.fields, // Store as JSON directly
        },
      })

      console.log(`   ✓ Created template "${template.name}" with ${formData.fields.length} fields`)
    }

    console.log('\n✅ Form templates seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding templates:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
