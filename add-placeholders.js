const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

async function addPlaceholders() {
  // Lundqvist Contract
  const templatePath = path.join(__dirname, 'docs/LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/1.SEAFARER\u2019S EMPLOYMENT CONTRACT.docx');
  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);
  
  let docXml = zip.file('word/document.xml').asText();
  
  // Find common patterns and replace with placeholders
  // Date format: 07/10/2025 -> {today}
  docXml = docXml.replace(/>07<\/w:t><w:t[^>]*>\/10\/202<\/w:t><w:t[^>]*>5</g, '>{today}</w:t><w:t xml:space="preserve"> </w:t><w:t>     ');
  
  // Look for "Name:" or "Full Name:" fields - need to see actual structure first
  console.log('Current XML structure around dates:');
  const dateContext = docXml.match(/.{100}>07<\/w:t>.{200}/g);
  if (dateContext) dateContext.forEach((c, i) => console.log(i + ':\n' + c + '\n'));
}

addPlaceholders();
