const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding dummy crew data...')

  const ranks = ['Master', 'Chief Officer', 'Second Officer', 'Third Officer', 'Chief Engineer', 'Second Engineer', 'Third Engineer', 'Fourth Engineer', 'Bosun', 'AB', 'Oiler', 'Wiper', 'Fitter', 'Cook', 'Messman']
  const vessels = ['MV OCEAN GLORY', 'MV PACIFIC STAR', 'MV ATLANTIC WAVE', 'MV INDIAN PEARL', 'MV ARCTIC BREEZE']
  const statuses = ['ACTIVE', 'ON_BOARD', 'ON_LEAVE', 'STANDBY']

  const crewMembers = []

  for (let i = 1; i <= 20; i++) {
    const rank = ranks[Math.floor(Math.random() * ranks.length)]
    const vessel = vessels[Math.floor(Math.random() * vessels.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    const crew = await prisma.crew.create({
      data: {
        crewCode: `HM${String(i).padStart(4, '0')}`,
        fullName: `Crew Member ${i}`,
        rank,
        vessel,
        status,
        dateOfBirth: new Date(1970 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        placeOfBirth: 'Jakarta',
        religion: 'Islam',
        phoneMobile: `+62812${Math.floor(Math.random() * 90000000 + 10000000)}`,
        address: `Jl. Pelabuhan No. ${i}`,
        bloodType: ['A', 'B', 'AB', 'O'][Math.floor(Math.random() * 4)],
        heightCm: 160 + Math.floor(Math.random() * 30),
        weightKg: 60 + Math.floor(Math.random() * 30),
        shoeSize: String(38 + Math.floor(Math.random() * 8)),
        crewStatus: status === 'ON_BOARD' ? 'ONBOARD' : (status === 'ACTIVE' ? 'ACTIVE' : 'STANDBY')
      }
    })
    crewMembers.push(crew)
  }

  console.log(`✅ Created ${crewMembers.length} crew members`)
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
