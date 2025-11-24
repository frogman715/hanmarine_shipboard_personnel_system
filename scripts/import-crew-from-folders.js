const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')

const prisma = new PrismaClient()

const BASE_FOLDER = 'D:\\HANMARINE GLOBAL INDONESIA\\SCANNING CREW\\@VACATION CREW'

// Certificate mapping dari filename ke database type
const CERT_MAPPING = {
  'BST': 'BST',
  'AFF': 'AFF', 
  'SCRB': 'SCRB',
  'SAT': 'SAT',
  'SSAT': 'SSAT', 
  'SDSD': 'SDSD',
  'PASSPORT': 'PASSPORT',
  'RATING': 'RATING_AB',
  'RATINGS ABLE': 'RATING_AB',
  'RATINGS_ABLE': 'RATING_AB',
  'ABLE DECK': 'RATING_AB',
  'YF': 'YELLOW_FEVER',
  'YELLOW FEVER': 'YELLOW_FEVER',
  'YELLOW_FEVER': 'YELLOW_FEVER',
  'BOCT': 'BOCT',
  'MEFA': 'MEFA',
  'SCHENGEN': 'SCHENGEN_VISA',
  'GOC': 'GOC',
  'ROC': 'ROC'
}

// Extract expiry date dari filename
function extractExpiryFromFilename(filename) {
  // Pattern: ~ DD.MM.YYYY atau ~ YYYY-MM-DD atau ~ DD-MM-YYYY atau ~ MM-DD-YYYY
  const patterns = [
    { regex: /~\s*(\d{2})\.(\d{2})\.(\d{4})/, format: 'DD.MM.YYYY' },  // ~ 05.05.2029
    { regex: /~\s*(\d{4})-(\d{2})-(\d{2})/, format: 'YYYY-MM-DD' },    // ~ 2029-05-05
    { regex: /~\s*(\d{2})[-\/](\d{2})[-\/](\d{4})/, format: 'DD-MM-YYYY' }  // ~ 05-05-2029 or 05/05/2029
  ]
  
  for (const { regex, format } of patterns) {
    const match = filename.match(regex)
    if (match) {
      let date
      if (format === 'DD.MM.YYYY' || format === 'DD-MM-YYYY') {
        // DD.MM.YYYY or DD-MM-YYYY
        const day = parseInt(match[1])
        const month = parseInt(match[2])
        const year = parseInt(match[3])
        
        // Validate ranges
        if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
          date = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
        } else {
          // Might be MM-DD-YYYY format instead
          if (match[1] <= 12 && match[2] <= 31) {
            // Swap: first is month, second is day
            date = new Date(`${year}-${String(match[1]).padStart(2, '0')}-${String(match[2]).padStart(2, '0')}`)
          }
        }
      } else if (format === 'YYYY-MM-DD') {
        // YYYY-MM-DD
        date = new Date(`${match[1]}-${match[2]}-${match[3]}`)
      }
      
      // Validate date is not Invalid Date
      if (date && !isNaN(date.getTime())) {
        return date
      }
    }
  }
  
  // Check for UNLIMITED
  if (filename.toUpperCase().includes('UNLIMITED')) {
    return null // NULL untuk unlimited
  }
  
  return undefined // undefined = ga ketemu pattern
}

// Extract crew code dari NAT.LIC atau RATING file
function extractCrewCodeFromFile(folderPath) {
  try {
    const files = fs.readdirSync(folderPath)
    
    // Cari file RATING atau NAT.LIC
    for (const file of files) {
      if (file.toUpperCase().includes('RATING') || file.toUpperCase().includes('NAT.LIC')) {
        const filename = file.toUpperCase()
        // Extract 10 digit code dari filename
        const match = filename.match(/\d{10}/)
        if (match) {
          console.log(`  ✅ Found crew code in ${file}: ${match[0]}`)
          return match[0]
        }
      }
    }
  } catch (error) {
    // Folder ga ada atau ga bisa di read
  }
  
  return null
}

// Parse Excel checklist kalau ada
function parseExcelChecklist(folderPath) {
  try {
    const files = fs.readdirSync(folderPath)
    const excelFile = files.find(f => 
      f.toLowerCase().includes('check') && 
      f.toLowerCase().includes('list') &&
      (f.endsWith('.xls') || f.endsWith('.xlsx'))
    )
    
    if (excelFile) {
      console.log(`  📋 Found checklist: ${excelFile}`)
      const filePath = path.join(folderPath, excelFile)
      const workbook = XLSX.readFile(filePath)
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      
      // Parse as JSON with range to get all data
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
      
      const checklistData = {}
      
      // Strategy 1: Check for structured format (VESSEL NAME, SEAMAN'S NAME, etc in columns)
      for (let i = 0; i < Math.min(10, data.length); i++) {
        const row = data[i]
        const col0 = String(row[0] || '').toUpperCase().trim()
        
        // Check for VESSEL NAME row
        if (col0.includes('VESSEL NAME') || col0.includes('VESSEL') && col0.includes('NAME')) {
          // Vessel in col 5, Flag in col 14, Type in col 23
          if (row[5]) checklistData.vessel = String(row[5]).trim()
          if (row[14]) checklistData.flag = String(row[14]).trim()
          if (row[23]) checklistData.vesselType = String(row[23]).trim()
        }
        
        // Check for SEAMAN'S NAME row
        if (col0.includes('SEAMAN') && col0.includes('NAME')) {
          // Name in col 5, Rank in col 14, Nationality in col 23
          if (row[5]) checklistData.seamanName = String(row[5]).trim()
          if (row[14]) checklistData.rank = String(row[14]).trim()
          if (row[23]) checklistData.nationality = String(row[23]).trim()
        }
        
        // Check for BIRTH DATE row
        if (col0.includes('BIRTH') || col0.includes('BRITH')) {
          // Birth date in col 5, Joining date in col 14
          if (row[5]) checklistData.dateOfBirth = parseExcelDate(row[5])
          if (row[14]) checklistData.joiningDate = parseExcelDate(row[14])
        }
      }
      
      // Strategy 2: Key-value parsing for unstructured format
      for (let i = 0; i < data.length; i++) {
        const row = data[i]
        if (!row[0]) continue
        
        const key = String(row[0]).toLowerCase().trim()
        const value = row[1] ? String(row[1]).trim() : null
        
        if (!value) continue
        
        // Date of Birth
        if ((key.includes('date of birth') || key.includes('birth date') || 
            key.includes('birthday') || key === 'dob') && !checklistData.dateOfBirth) {
          checklistData.dateOfBirth = parseExcelDate(value)
        }
        // Place of Birth
        else if ((key.includes('place of birth') || key.includes('birth place') || 
                 key === 'pob' || key.includes('tempat lahir')) && !checklistData.placeOfBirth) {
          checklistData.placeOfBirth = value
        }
        // Phone
        else if ((key.includes('phone') || key.includes('telephone') || 
                 key.includes('mobile') || key.includes('hp') || 
                 key.includes('contact number')) && !checklistData.phone) {
          checklistData.phone = value
        }
        // Email
        else if ((key.includes('email') || key.includes('e-mail')) && !checklistData.email) {
          checklistData.email = value
        }
        // Address
        else if ((key.includes('address') || key.includes('alamat') || 
                 key.includes('residence')) && !checklistData.address) {
          checklistData.address = value
        }
        // Nationality
        else if ((key.includes('nationality') || key.includes('citizenship') || 
                 key.includes('kewarganegaraan')) && !checklistData.nationality) {
          checklistData.nationality = value
        }
        // Height
        else if ((key.includes('height') || key.includes('tinggi')) && !checklistData.height) {
          const height = parseInt(value)
          if (!isNaN(height)) checklistData.height = height
        }
        // Weight
        else if ((key.includes('weight') || key.includes('berat')) && !checklistData.weight) {
          const weight = parseInt(value)
          if (!isNaN(weight)) checklistData.weight = weight
        }
        // Religion
        else if ((key.includes('religion') || key.includes('agama')) && !checklistData.religion) {
          checklistData.religion = value
        }
        // Marital Status
        else if ((key.includes('marital') || key.includes('married') || 
                 key.includes('status pernikahan')) && !checklistData.maritalStatus) {
          checklistData.maritalStatus = value
        }
        // Next of Kin
        else if ((key.includes('next of kin') || key.includes('emergency contact') || 
                 key.includes('kontak darurat')) && !checklistData.nextOfKin) {
          checklistData.nextOfKin = value
        }
        // NOK Relationship
        else if ((key.includes('relationship') || key.includes('hubungan')) && !checklistData.nokRelationship) {
          checklistData.nokRelationship = value
        }
        // NOK Phone
        else if ((key.includes('nok phone') || key.includes('emergency phone')) && !checklistData.nokPhone) {
          checklistData.nokPhone = value
        }
      }
      
      // Log extracted data
      const extractedFields = Object.keys(checklistData).length
      if (extractedFields > 0) {
        console.log(`  📝 Extracted ${extractedFields} fields from checklist`)
        // Show what was extracted
        if (checklistData.dateOfBirth) console.log(`     - DOB: ${checklistData.dateOfBirth.toISOString().split('T')[0]}`)
        if (checklistData.nationality) console.log(`     - Nationality: ${checklistData.nationality}`)
        if (checklistData.joiningDate) console.log(`     - Joining: ${checklistData.joiningDate.toISOString().split('T')[0]}`)
      }
      
      return checklistData
    }
  } catch (error) {
    console.log(`  ⚠️  Error parsing checklist: ${error.message}`)
  }
  
  return {}
}

// Parse date dari Excel (bisa berupa serial number atau string)
function parseExcelDate(value) {
  if (!value) return null
  
  // Jika angka, kemungkinan Excel date serial
  if (!isNaN(value) && Number(value) > 1000) {
    const excelEpoch = new Date(1899, 11, 30)
    const date = new Date(excelEpoch.getTime() + Number(value) * 86400000)
    if (!isNaN(date.getTime())) return date
  }
  
  // Jika string, coba parse
  const dateStr = String(value)
  
  // Try various date formats
  const formats = [
    /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
    /(\d{2})\/(\d{2})\/(\d{4})/, // DD/MM/YYYY
    /(\d{2})-(\d{2})-(\d{4})/, // DD-MM-YYYY
    /(\d{2})\.(\d{2})\.(\d{4})/ // DD.MM.YYYY
  ]
  
  for (const format of formats) {
    const match = dateStr.match(format)
    if (match) {
      if (match[1].length === 4) {
        // YYYY-MM-DD
        const date = new Date(`${match[1]}-${match[2]}-${match[3]}`)
        if (!isNaN(date.getTime())) return date
      } else {
        // DD/MM/YYYY or DD-MM-YYYY
        const date = new Date(`${match[3]}-${match[2]}-${match[1]}`)
        if (!isNaN(date.getTime())) return date
      }
    }
  }
  
  return null
}

// Extract certificates dari files
function extractCertificates(folderPath, crewName, rank) {
  const certificates = []
  
  try {
    const files = fs.readdirSync(folderPath)
    
    for (const file of files) {
      const upperFile = file.toUpperCase()
      
      // Skip folders, zip files, thumbs.db
      if (file.includes('.') === false || 
          file.endsWith('.zip') || 
          file.toLowerCase().includes('thumbs')) {
        continue
      }
      
      // Match certificate type
      let certType = null
      for (const [keyword, type] of Object.entries(CERT_MAPPING)) {
        if (upperFile.includes(keyword)) {
          certType = type
          break
        }
      }
      
      if (certType) {
        const expiry = extractExpiryFromFilename(file)
        
        // Only add if we extracted a valid date or it's unlimited (null)
        if (expiry !== undefined) {
          // Skip if expiry is Invalid Date
          if (expiry !== null && isNaN(expiry.getTime())) {
            console.log(`    ⚠️  Skipping ${certType}: Invalid date in ${file}`)
            continue
          }
          
          certificates.push({
            type: certType,
            issueDate: null,
            expiryDate: expiry,
            issuer: null,
            remarks: `From file: ${file}`
          })
          
          const expiryStr = expiry ? expiry.toISOString().split('T')[0] : 'UNLIMITED'
          console.log(`    📜 ${certType}: ${expiryStr}`)
        }
      }
    }
  } catch (error) {
    console.log(`  ⚠️  Error reading folder: ${error.message}`)
  }
  
  return certificates
}

async function importCrewFromFolders() {
  try {
    if (!fs.existsSync(BASE_FOLDER)) {
      console.error('❌ Base folder tidak ditemukan:', BASE_FOLDER)
      return
    }
    
    // Get rank folders (1. CO, 9. AB, etc.)
    const rankFolders = fs.readdirSync(BASE_FOLDER, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    console.log(`📂 Found ${rankFolders.length} rank folders\n`)
    
    // Collect all crew folders from all rank folders
    const allCrewFolders = []
    for (const rankFolder of rankFolders) {
      const rankPath = path.join(BASE_FOLDER, rankFolder)
      try {
        const crewFolders = fs.readdirSync(rankPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => ({
            name: dirent.name,
            path: path.join(rankPath, dirent.name),
            rankFolder
          }))
        
        allCrewFolders.push(...crewFolders)
      } catch (error) {
        console.log(`⚠️  Cannot read ${rankFolder}: ${error.message}`)
      }
    }
    
    console.log(`👥 Found ${allCrewFolders.length} total crew folders\n`)
    
    let imported = 0
    let updated = 0
    let skipped = 0
    
    for (const crew of allCrewFolders) {
      const folder = crew.name
      const folderPath = crew.path
      const rankFolder = crew.rankFolder
      
      // Check if this is ex-crew folder
      const isExCrew = rankFolder.toUpperCase().includes('EX CREW') || 
                       folder.toUpperCase().includes('EX CREW')
      
      // Skip if folder name itself is just "EX CREW" marker
      if (folder.toUpperCase().includes('EX CREW') && !folder.match(/^([A-Z0-9\/]+)[-\s](.+)$/)) {
        console.log(`⏭️  Skip: ${folder} (EX CREW marker folder)`)
        
        // But scan inside this folder for actual crew folders
        try {
          const exCrewSubfolders = fs.readdirSync(folderPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
          
          console.log(`   📂 Found ${exCrewSubfolders.length} ex-crew subfolders`)
          
          for (const subfolder of exCrewSubfolders) {
            const subPath = path.join(folderPath, subfolder.name)
            const subMatch = subfolder.name.match(/^([A-Z0-9\/]+)[-\s](.+)$/)
            
            if (!subMatch) continue
            
            const subRank = subMatch[1].trim()
            const subName = subMatch[2].trim().replace(/_/g, ' ')
            
            console.log(`\n👤❌ Processing: ${subRank} - ${subName} (EX-CREW from subfolder)`)
            
            // Process this ex-crew
            const subCrewCode = extractCrewCodeFromFile(subPath)
            const subChecklistData = parseExcelChecklist(subPath)
            const subCertificates = extractCertificates(subPath, subName, subRank)
            console.log(`  📜 Found ${subCertificates.length} certificates`)
            
            const existingSub = await prisma.crew.findFirst({
              where: {
                fullName: {
                  equals: subName,
                  mode: 'insensitive'
                }
              }
            })
            
            if (existingSub) {
              await prisma.crew.update({
                where: { id: existingSub.id },
                data: {
                  crewCode: subCrewCode || existingSub.crewCode,
                  rank: subRank,
                  crewStatus: 'INACTIVE',
                  phoneMobile: subChecklistData.phone || existingSub.phoneMobile,
                  address: subChecklistData.address || existingSub.address,
                  dateOfBirth: subChecklistData.dateOfBirth || existingSub.dateOfBirth,
                  placeOfBirth: subChecklistData.placeOfBirth || existingSub.placeOfBirth,
                  heightCm: subChecklistData.height || existingSub.heightCm,
                  weightKg: subChecklistData.weight || existingSub.weightKg,
                  religion: subChecklistData.religion || existingSub.religion,
                  status: subChecklistData.maritalStatus || existingSub.status
                }
              })
              
              for (const cert of subCertificates) {
                await prisma.certificate.upsert({
                  where: {
                    crewId_type: {
                      crewId: existingSub.id,
                      type: cert.type
                    }
                  },
                  update: cert,
                  create: {
                    crewId: existingSub.id,
                    ...cert
                  }
                })
              }
              
              console.log(`  ✅ Updated: ${subName} (ID: ${existingSub.id}) → INACTIVE`)
              updated++
            } else {
              const newSub = await prisma.crew.create({
                data: {
                  fullName: subName,
                  rank: subRank,
                  crewCode: subCrewCode,
                  crewStatus: 'INACTIVE',
                  phoneMobile: subChecklistData.phone,
                  address: subChecklistData.address,
                  dateOfBirth: subChecklistData.dateOfBirth,
                  placeOfBirth: subChecklistData.placeOfBirth,
                  heightCm: subChecklistData.height,
                  weightKg: subChecklistData.weight,
                  religion: subChecklistData.religion,
                  status: subChecklistData.maritalStatus
                }
              })
              
              for (const cert of subCertificates) {
                await prisma.certificate.upsert({
                  where: {
                    crewId_type: {
                      crewId: newSub.id,
                      type: cert.type
                    }
                  },
                  update: cert,
                  create: {
                    crewId: newSub.id,
                    ...cert
                  }
                })
              }
              
              console.log(`  ✅ Created: ${subName} (ID: ${newSub.id}, Code: ${subCrewCode || 'N/A'}) → INACTIVE`)
              imported++
            }
          }
        } catch (error) {
          console.log(`   ⚠️  Error scanning ex-crew folder: ${error.message}`)
        }
        
        skipped++
        continue
      }
      
      // Parse folder name: RANK-FULL_NAME atau RANK-FULL NAME
      const match = folder.match(/^([A-Z0-9\/]+)[-\s](.+)$/)
      
      if (!match) {
        console.log(`⏭️  Skip: ${folder} (format tidak recognized)`)
        skipped++
        continue
      }
      
      const rank = match[1].trim()
      let fullName = match[2].trim().replace(/_/g, ' ')
      
      const statusIcon = isExCrew ? '👤❌' : '👤'
      console.log(`\n${statusIcon} Processing: ${rank} - ${fullName}${isExCrew ? ' (EX-CREW)' : ''}`)
      
      // Extract crew code dari files
      const crewCode = extractCrewCodeFromFile(folderPath)
      
      // Parse Excel checklist
      const checklistData = parseExcelChecklist(folderPath)
      
      // Extract certificates
      const certificates = extractCertificates(folderPath, fullName, rank)
      console.log(`  📜 Found ${certificates.length} certificates`)
      
      // Check if crew already exists
      const existing = await prisma.crew.findFirst({
        where: {
          fullName: {
            equals: fullName,
            mode: 'insensitive'
          }
        }
      })
      
      if (existing) {
        console.log(`  ♻️  Crew already exists, updating...`)
        
        // Determine crew status based on folder location
        let crewStatus = existing.crewStatus
        if (isExCrew) {
          crewStatus = 'INACTIVE' // Ex-crew = inactive
        } else if (existing.crewStatus === 'INACTIVE') {
          crewStatus = 'ACTIVE' // Moved back from ex-crew folder
        }
        
        // Update crew data - preserve existing data if new data is null
        const updateData = {
          crewCode: crewCode || existing.crewCode,
          rank: rank,
          phoneMobile: checklistData.phone || existing.phoneMobile,
          address: checklistData.address || existing.address,
          dateOfBirth: checklistData.dateOfBirth || existing.dateOfBirth,
          placeOfBirth: checklistData.placeOfBirth || existing.placeOfBirth,
          heightCm: checklistData.height || existing.heightCm,
          weightKg: checklistData.weight || existing.weightKg,
          religion: checklistData.religion || existing.religion,
          status: checklistData.maritalStatus || existing.status,
          crewStatus: crewStatus
        }
        
        await prisma.crew.update({
          where: { id: existing.id },
          data: updateData
        })
        
        // Update/create certificates
        for (const cert of certificates) {
          await prisma.certificate.upsert({
            where: {
              crewId_type: {
                crewId: existing.id,
                type: cert.type
              }
            },
            update: {
              expiryDate: cert.expiryDate,
              issuer: cert.issuer,
              remarks: cert.remarks
            },
            create: {
              crewId: existing.id,
              ...cert
            }
          })
        }
        
        console.log(`  ✅ Updated: ${fullName} (ID: ${existing.id})${isExCrew ? ' → INACTIVE' : ''}`)
        updated++
      } else {
        // Create new crew
        const newCrew = await prisma.crew.create({
          data: {
            fullName,
            rank,
            crewCode,
            phoneMobile: checklistData.phone,
            address: checklistData.address,
            dateOfBirth: checklistData.dateOfBirth,
            placeOfBirth: checklistData.placeOfBirth,
            heightCm: checklistData.height,
            weightKg: checklistData.weight,
            religion: checklistData.religion,
            status: checklistData.maritalStatus,
            crewStatus: isExCrew ? 'INACTIVE' : 'ACTIVE'
          }
        })
        
        // Create certificates
        for (const cert of certificates) {
          await prisma.certificate.upsert({
            where: {
              crewId_type: {
                crewId: newCrew.id,
                type: cert.type
              }
            },
            update: cert,
            create: {
              crewId: newCrew.id,
              ...cert
            }
          })
        }
        
        console.log(`  ✅ Created: ${fullName} (ID: ${newCrew.id}, Code: ${crewCode || 'N/A'})${isExCrew ? ' → INACTIVE' : ''}`)
        imported++
      }
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 IMPORT SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ New crew imported: ${imported}`)
    console.log(`♻️  Existing crew updated: ${updated}`)
    console.log(`⏭️  Skipped: ${skipped}`)
    console.log(`📋 Total processed: ${allCrewFolders.length}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run import
importCrewFromFolders()
