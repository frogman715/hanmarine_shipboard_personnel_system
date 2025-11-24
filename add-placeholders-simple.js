const fs = require('fs');
const path = require('path');

// Simple text replacement in Word XML
const files = [
  'docs/LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/2.NEXT OF KIN DECLARATION.docx',
  'docs/INTERGIS CO, LTD/6.Jika di approv dibuatkan/2.NEXT OF KIN DECLARATION.docx'
];

console.log('Adding placeholders to NOK templates...\n');

files.forEach(file => {
  try {
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(file);
    
    const docEntry = zip.getEntry('word/document.xml');
    let docXml = docEntry.getData().toString('utf8');
    
    // Add placeholders after field labels
    docXml = docXml.replace(/>NAME\s+:\s+</g, '>NAME  		: {fullName}<');
    docXml = docXml.replace(/>RANK\s+:\s+</g, '>RANK		: {rank}<');
    docXml = docXml.replace(/>JOINING\s+:\s+</g, '>JOINING 	: {vessel}<');
    docXml = docXml.replace(/>Place\s*:\s*Jakarta</g, '>Place : {placeOfBirth}');
    docXml = docXml.replace(/>Date\s*:\s*\d{4}\.\d{2}\.\d{2}</g, '>Date : {today}');
    
    zip.updateFile('word/document.xml', Buffer.from(docXml, 'utf8'));
    zip.writeZip(file);
    
    console.log('✓', file);
  } catch (error) {
    console.error('✗', file, error.message);
  }
});

console.log('\nDone!');
process.exit(0);
