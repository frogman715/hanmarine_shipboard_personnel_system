const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

function addPlaceholdersToNOK(filePath) {
  console.log('Processing:', filePath);
  
  const content = fs.readFileSync(filePath, 'binary');
  const zip = new PizZip(content);
  
  let docXml = zip.file('word/document.xml').asText();
  
  // Simple approach: find and replace specific text patterns
  // Replace "NAME  		:  " with "NAME  		: {fullName}"
  docXml = docXml.replace(/(<w:t[^>]*>NAME\s+:\s+<\/w:t>)/g, '<w:t>NAME  		: {fullName}<\/w:t>');
  
  // Replace "RANK		:  " with "RANK		: {rank}"
  docXml = docXml.replace(/(<w:t[^>]*>RANK\s+:\s+<\/w:t>)/g, '<w:t>RANK		: {rank}<\/w:t>');
  
  // Replace "JOINING 	:  " with "JOINING 	: {vessel}"
  docXml = docXml.replace(/(<w:t[^>]*>JOINING\s+:\s+<\/w:t>)/g, '<w:t>JOINING 	: {vessel}<\/w:t>');
  
  // Replace "Place : Jakarta" with "Place : {placeOfBirth}"
  docXml = docXml.replace(/(<w:t[^>]*>Place\s*:\s*Jakarta<\/w:t>)/g, '<w:t>Place : {placeOfBirth}<\/w:t>');
  
  // Replace "Date : 2024.11.10" with "Date : {today}"
  docXml = docXml.replace(/(<w:t[^>]*>Date\s*:\s*\d{4}\.\d{2}\.\d{2}<\/w:t>)/g, '<w:t>Date : {today}<\/w:t>');
  
  // Save modified file
  zip.file('word/document.xml', docXml);
  const buf = zip.generate({ type: 'nodebuffer' });
  fs.writeFileSync(filePath, buf);
  
  console.log('✓ Updated:', filePath);
}

// Process both templates
try {
  addPlaceholdersToNOK(path.join(__dirname, 'docs/LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/2.NEXT OF KIN DECLARATION.docx'));
  addPlaceholdersToNOK(path.join(__dirname, 'docs/INTERGIS CO, LTD/6.Jika di approv dibuatkan/2.NEXT OF KIN DECLARATION.docx'));
  console.log('\n✅ All NOK templates updated with placeholders!');
} catch (error) {
  console.error('Error:', error.message);
}
