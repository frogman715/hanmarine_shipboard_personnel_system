const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking crew data...')
  
  // Get some crew members
  const crew = await prisma.crew.findMany({
    take: 10,
    orderBy: { id: 'asc' }
  })

  if (crew.length === 0) {
    console.log('❌ No crew found in database. Please import crew data first.')
    return
  }

  console.log(`✅ Found ${crew.length} crew members`)

  // Certificate types to seed
  const certTypes = [
    'Seaman Book',
    'Passport',
    'Medical Certificate',
    'Basic Safety Training (BST)',
    'Advanced Fire Fighting (AFF)',
    'STCW Certificate',
    'Certificate of Competency (COC)',
    'Certificate of Proficiency (COP)',
    'GMDSS Certificate',
    'Tanker Familiarization',
    'Ship Security Officer (SSO)',
    'Designated Security Duties (DSD)'
  ]

  console.log('🌱 Seeding certificates...')
  let count = 0

  for (const member of crew) {
    // Random number of certificates per crew (3-8)
    const numCerts = Math.floor(Math.random() * 6) + 3
    const selectedTypes = certTypes.sort(() => 0.5 - Math.random()).slice(0, numCerts)

    for (const certType of selectedTypes) {
      const issueDate = new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      
      // Some certificates expire in different periods
      let validityYears = 5
      if (certType.includes('Medical')) validityYears = 2
      if (certType.includes('Passport')) validityYears = 10
      if (certType.includes('BST') || certType.includes('AFF')) validityYears = 5
      
      const expiryDate = new Date(issueDate)
      expiryDate.setFullYear(expiryDate.getFullYear() + validityYears)
      
      // Mix of expired, expiring soon, and valid
      const randomOffset = Math.floor(Math.random() * 1000) - 500 // -500 to +500 days
      expiryDate.setDate(expiryDate.getDate() + randomOffset)

      await prisma.certificate.create({
        data: {
          crewId: member.id,
          type: certType,
          issueDate,
          expiryDate,
          issuer: ['Ministry of Transportation', 'STCW Authority', 'Maritime Training Center', 'Flag State Authority'][Math.floor(Math.random() * 4)],
          remarks: `Cert No: ${certType.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900000 + 100000)}`,
          documentPath: null // No actual files yet
        }
      })
      count++
    }
  }

  console.log(`✅ Created ${count} certificates for ${crew.length} crew members`)
  console.log('✨ Done!')
}

main()
  .catch(e => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
