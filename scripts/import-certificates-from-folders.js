const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Root folder untuk crew STANDBY (vacation crew)
const ROOT_FOLDER = 'D:\\HANMARINE GLOBAL INDONESIA\\SCANNING CREW\\@VACATION CREW';

// Certificate types berdasarkan nama file
const CERT_PATTERNS = {
  'COC': /COC|CERTIFICATE OF COMPETENCY|SERTIFIKAT KEAHLIAN/i,
  'COP': /COP|CERTIFICATE OF PROFICIENCY/i,
  'BST': /BST|BASIC SAFETY TRAINING/i,
  'PSCRB': /PSCRB|PROFICIENCY IN SURVIVAL CRAFT/i,
  'AFF': /AFF|ADVANCED FIRE FIGHTING/i,
  'MFA': /MFA|MEDICAL FIRST AID/i,
  'MEDICAL': /MEDICAL|HEALTH|SURAT SEHAT/i,
  'PASSPORT': /PASSPORT|PASPOR/i,
  'SEAMAN BOOK': /SEAMAN|BUKU PELAUT/i,
  'GMDSS': /GMDSS/i,
  'ECDIS': /ECDIS/i,
  'RADAR': /RADAR/i,
  'ARPA': /ARPA/i,
  'STCW': /STCW/i,
  'TANKER': /TANKER/i,
  'CHEMICAL': /CHEMICAL/i,
  'OIL TANKER': /OIL TANKER/i,
  'LIQUEFIED GAS': /LIQUEFIED GAS|LNG|LPG/i,
  'SSO': /SSO|SHIP SECURITY OFFICER/i,
  'ISPS': /ISPS/i,
  'ISM': /ISM/i,
  'MARPOL': /MARPOL/i,
};

// Parse certificate type from filename
function getCertificateType(filename) {
  const upperFilename = filename.toUpperCase();
  
  for (const [type, pattern] of Object.entries(CERT_PATTERNS)) {
    if (pattern.test(upperFilename)) {
      return type;
    }
  }
  
  return 'OTHER';
}

// Extract dates from filename (common patterns)
function extractDatesFromFilename(filename) {
  // Pattern: YYYY-MM-DD or DD-MM-YYYY or DD/MM/YYYY
  const datePatterns = [
    /(\d{4})-(\d{2})-(\d{2})/g,  // YYYY-MM-DD
    /(\d{2})-(\d{2})-(\d{4})/g,  // DD-MM-YYYY
    /(\d{2})\/(\d{2})\/(\d{4})/g, // DD/MM/YYYY
  ];
  
  const dates = [];
  for (const pattern of datePatterns) {
    let match;
    while ((match = pattern.exec(filename)) !== null) {
      dates.push(match[0]);
    }
  }
  
  return dates;
}

// Scan folder crew untuk cari PDF sertifikat
function scanCrewFolder(crewFolderPath, crewName) {
  const certificates = [];
  
  try {
    const items = fs.readdirSync(crewFolderPath, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(crewFolderPath, item.name);
      
      // Skip CV folder
      if (item.isDirectory() && item.name.toUpperCase() === 'CV') {
        continue;
      }
      
      // Recursive scan subfolder (tapi skip CV)
      if (item.isDirectory()) {
        const subCerts = scanCrewFolder(itemPath, crewName);
        certificates.push(...subCerts);
        continue;
      }
      
      // Process PDF files only
      if (item.isFile() && item.name.toLowerCase().endsWith('.pdf')) {
        const certType = getCertificateType(item.name);
        const dates = extractDatesFromFilename(item.name);
        
        certificates.push({
          fileName: item.name,
          filePath: itemPath,
          type: certType,
          dates: dates,
          crewName: crewName,
        });
      }
    }
  } catch (error) {
    console.error(`❌ Error scanning folder ${crewFolderPath}:`, error.message);
  }
  
  return certificates;
}

// Main function
async function importCertificatesFromFolders() {
  console.log('🔍 Scanning crew folders for certificates...\n');
  
  if (!fs.existsSync(ROOT_FOLDER)) {
    console.error(`❌ Root folder not found: ${ROOT_FOLDER}`);
    return;
  }
  
  // Get all crew from database
  const allCrew = await prisma.crew.findMany({
    where: {
      crewStatus: 'STANDBY', // Focus on vacation crew
    },
    select: {
      id: true,
      fullName: true,
      rank: true,
    },
  });
  
  console.log(`📊 Found ${allCrew.length} STANDBY crew in database\n`);
  
  // Scan root folder for rank folders (1. CO, 2. CE, etc.)
  const rankFolders = fs.readdirSync(ROOT_FOLDER, { withFileTypes: true })
    .filter(item => item.isDirectory());
  
  let totalCertificatesFound = 0;
  let totalCertificatesImported = 0;
  let crewMatched = 0;
  let crewNotMatched = 0;
  
  for (const rankFolder of rankFolders) {
    const rankFolderPath = path.join(ROOT_FOLDER, rankFolder.name);
    console.log(`\n📁 Scanning rank folder: ${rankFolder.name}`);
    
    // Get crew folders inside rank folder
    const crewFolders = fs.readdirSync(rankFolderPath, { withFileTypes: true })
      .filter(item => item.isDirectory());
    
    for (const crewFolder of crewFolders) {
      const crewFolderPath = path.join(rankFolderPath, crewFolder.name);
      
      // Extract crew name from folder (e.g., "CO-ABIDIN" -> "ABIDIN")
      const folderName = crewFolder.name;
      const crewNameParts = folderName.split('-');
      const crewName = crewNameParts.length > 1 ? crewNameParts.slice(1).join('-').trim() : folderName.trim();
      
      // Scan certificates in this crew folder
      const certificates = scanCrewFolder(crewFolderPath, crewName);
      
      if (certificates.length === 0) {
        continue;
      }
      
      totalCertificatesFound += certificates.length;
      
      // Try to match crew with database
      const matchedCrew = allCrew.find(c => 
        c.fullName.toUpperCase().includes(crewName.toUpperCase()) ||
        crewName.toUpperCase().includes(c.fullName.toUpperCase())
      );
      
      if (!matchedCrew) {
        console.log(`   ⚠️  ${folderName}: ${certificates.length} certs found, but NO MATCH in database`);
        crewNotMatched++;
        continue;
      }
      
      console.log(`   ✅ ${folderName} → ${matchedCrew.fullName} (${matchedCrew.rank})`);
      console.log(`      Found ${certificates.length} certificate(s):`);
      
      crewMatched++;
      
      // Import certificates to database
      for (const cert of certificates) {
        console.log(`      📄 ${cert.type}: ${cert.fileName}`);
        
        try {
          // Check if certificate already exists by type and filename (avoid duplicates)
          const existingCert = await prisma.certificate.findFirst({
            where: {
              crewId: matchedCrew.id,
              type: cert.type,
              remarks: { contains: cert.fileName },
            },
          });
          
          if (existingCert) {
            console.log(`         ⏭️  Already exists, skipping...`);
            continue;
          }
          
          // Estimate issue/expiry dates (placeholder logic - bisa diimprove)
          let issueDate = null;
          let expiryDate = null;
          
          if (cert.dates.length >= 2) {
            // Assume first date is issue, second is expiry
            issueDate = new Date(cert.dates[0]);
            expiryDate = new Date(cert.dates[1]);
          } else if (cert.dates.length === 1) {
            // Assume it's expiry date
            expiryDate = new Date(cert.dates[0]);
          } else {
            // Default: expiry 2 years from now (placeholder)
            expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 2);
          }
          
          // Create certificate
          await prisma.certificate.create({
            data: {
              crewId: matchedCrew.id,
              type: cert.type,
              issueDate: issueDate,
              expiryDate: expiryDate,
              documentPath: cert.filePath,
              remarks: `Imported from: ${cert.fileName}`,
            },
          });
          
          totalCertificatesImported++;
          console.log(`         ✅ Imported successfully`);
          
        } catch (error) {
          console.error(`         ❌ Error importing: ${error.message}`);
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total certificates found: ${totalCertificatesFound}`);
  console.log(`Total certificates imported: ${totalCertificatesImported}`);
  console.log(`Crew matched: ${crewMatched}`);
  console.log(`Crew not matched: ${crewNotMatched}`);
  console.log('='.repeat(60));
}

// Run the script
importCertificatesFromFolders()
  .then(() => {
    console.log('\n✅ Import completed!');
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
  })
  .finally(() => {
    prisma.$disconnect();
  });
