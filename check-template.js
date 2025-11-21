const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

const templatePath = path.join(__dirname, 'docs/LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/1.SEAFARER\u2019S EMPLOYMENT CONTRACT.docx');
const content = fs.readFileSync(templatePath, 'binary');
const zip = new PizZip(content);
const docXml = zip.file('word/document.xml').asText();

// Extract text content
const textMatches = docXml.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
if (textMatches) {
  console.log('=== TEXT IN TEMPLATE (first 50 entries) ===');
  textMatches.slice(0, 50).forEach((match, i) => {
    const text = match.replace(/<[^>]+>/g, '');
    if (text.trim()) console.log(i + 1 + '. ' + text);
  });
}
