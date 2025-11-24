#!/usr/bin/env node

/**
 * Extract field mappings from Excel forms
 * Usage: node scripts/extract-excel-fields.js
 */

const fs = require('fs')
const path = require('path')

// Define the forms we want to extract
const FORMS = {
  'HGF-CR-01': {
    file: path.join(__dirname, '../docs/CR FORMS/HGF-CR-01 Document check list.xlsx'),
    type: 'checklist',
    description: 'Document Checklist',
  },
  'HGF-CR-02': {
    file: path.join(__dirname, '../docs/CR FORMS/HGF-CR-02 APPLICATION FOR EMPLOYMENT.xlsx'),
    type: 'application',
    description: 'Application for Employment',
  },
}

// Define the expected fields for each form based on manual analysis
const FORM_FIELDS = {
  'HGF-CR-01': [
    // Metadata
    { name: 'vesselName', label: 'Vessel Name', type: 'text', section: 'Metadata' },
    { name: 'seamanName', label: "Seaman's Name", type: 'text', section: 'Metadata' },
    { name: 'birthDate', label: 'Birth Date', type: 'date', section: 'Metadata' },
    { name: 'flag', label: 'Flag', type: 'text', section: 'Metadata' },
    { name: 'rank', label: 'Rank', type: 'text', section: 'Metadata' },
    { name: 'joiningDate', label: 'Joining Date', type: 'date', section: 'Metadata' },
    { name: 'type', label: 'Type', type: 'text', section: 'Metadata' },
    { name: 'nationality', label: 'Nationality', type: 'text', section: 'Metadata' },
    { name: 'signOfVerifier', label: 'Sign. of Verifier', type: 'text', section: 'Metadata' },
    // Document Records (repeating)
    { name: 'documents', label: 'Documents', type: 'checkbox', section: 'Documents', repeating: true },
    { name: 'documentNumber', label: 'Number', type: 'text', section: 'Documents', repeating: true },
    { name: 'issueDate', label: 'Issue Date', type: 'date', section: 'Documents', repeating: true },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date', section: 'Documents', repeating: true },
    { name: 'remark', label: 'Remark', type: 'text', section: 'Documents', repeating: true },
  ],

  'HGF-CR-02': [
    // Personal Information
    { name: 'shipName', label: "Ship's Name", type: 'text', section: 'Personal Info' },
    { name: 'familyName', label: 'Family Name', type: 'text', section: 'Personal Info' },
    { name: 'givenName', label: 'Given Name', type: 'text', section: 'Personal Info' },
    { name: 'middleName', label: 'Middle Name', type: 'text', section: 'Personal Info' },
    { name: 'chineseName', label: 'Chinese Name', type: 'text', section: 'Personal Info' },
    { name: 'rank', label: 'Rank', type: 'text', section: 'Personal Info' },
    { name: 'birthDate', label: 'Birth Date', type: 'date', section: 'Personal Info' },
    { name: 'height', label: 'Height', type: 'number', section: 'Personal Info' },
    { name: 'weight', label: 'Weight', type: 'number', section: 'Personal Info' },

    // Seaman Book & License
    { name: 'sbNationality', label: 'S/Book Nationality', type: 'text', section: 'Seaman Book' },
    { name: 'sbNumber', label: 'S/Book Number', type: 'text', section: 'Seaman Book' },
    { name: 'sbExpiry', label: 'S/Book Expiry', type: 'date', section: 'Seaman Book' },
    { name: 'licenseNationality', label: 'License Nationality', type: 'text', section: 'License' },
    { name: 'gocCertificate', label: 'GOC', type: 'checkbox', section: 'License' },

    // Address & Personal Details
    { name: 'presentAddress', label: 'Present Address', type: 'textarea', section: 'Address' },
    { name: 'telephone', label: 'Tel. No.', type: 'text', section: 'Address' },
    { name: 'placeOfBirth', label: 'Place of Birth', type: 'text', section: 'Address' },
    { name: 'religion', label: 'Religion', type: 'text', section: 'Address' },

    // Education & Training
    { name: 'trainingCertificates', label: 'Training Certificates', type: 'text', section: 'Training' },
    { name: 'lastSchool', label: 'Last School', type: 'text', section: 'Education' },
    { name: 'course', label: 'Course', type: 'text', section: 'Education' },
    { name: 'courseFrom', label: 'Course From', type: 'date', section: 'Education' },
    { name: 'courseTo', label: 'Course To', type: 'date', section: 'Education' },

    // Family Information (repeating)
    { name: 'familyRelation', label: 'Relation', type: 'text', section: 'Family', repeating: true },
    { name: 'familyMemberName', label: 'Name', type: 'text', section: 'Family', repeating: true },
    { name: 'familyBirthDate', label: 'Birth Date', type: 'date', section: 'Family', repeating: true },
    { name: 'familyOccupation', label: 'Occupation', type: 'text', section: 'Family', repeating: true },

    // Sea Experience (repeating)
    { name: 'vesselName', label: 'Vessel Name', type: 'text', section: 'Sea Experience', repeating: true },
    { name: 'rankOnVessel', label: 'Rank', type: 'text', section: 'Sea Experience', repeating: true },
    { name: 'signOn', label: 'Sign On', type: 'date', section: 'Sea Experience', repeating: true },
    { name: 'signOff', label: 'Sign Off', type: 'date', section: 'Sea Experience', repeating: true },
    { name: 'vesselType', label: 'Vessel Type', type: 'text', section: 'Sea Experience', repeating: true },
    { name: 'engineType', label: 'Engine Type', type: 'text', section: 'Sea Experience', repeating: true },
    { name: 'grt', label: 'GRT', type: 'number', section: 'Sea Experience', repeating: true },
    { name: 'hp', label: 'H/P', type: 'number', section: 'Sea Experience', repeating: true },
    { name: 'agency', label: 'Agency', type: 'text', section: 'Sea Experience', repeating: true },
    { name: 'principal', label: 'Principal', type: 'text', section: 'Sea Experience', repeating: true },
    { name: 'reasonForLeaving', label: 'Reason for Leaving', type: 'text', section: 'Sea Experience', repeating: true },
  ],
}

// Output as JSON
const output = {
  timestamp: new Date().toISOString(),
  forms: FORM_FIELDS,
  summary: {
    'HGF-CR-01': {
      total_fields: FORM_FIELDS['HGF-CR-01'].length,
      sections: [...new Set(FORM_FIELDS['HGF-CR-01'].map((f) => f.section))],
    },
    'HGF-CR-02': {
      total_fields: FORM_FIELDS['HGF-CR-02'].length,
      sections: [...new Set(FORM_FIELDS['HGF-CR-02'].map((f) => f.section))],
    },
  },
}

console.log(JSON.stringify(output, null, 2))

// Also save to file
const outputPath = path.join(__dirname, '../.form-fields.json')
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))
console.error(`✓ Form fields saved to ${outputPath}`)
