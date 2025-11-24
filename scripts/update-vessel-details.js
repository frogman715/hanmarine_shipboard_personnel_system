const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const vesselData = [
  {
    name: 'MT ALFA BALTICA',
    flag: 'BAHAMAS',
    imo: '9696773',
    vesselType: 'CRUDE OIL TANKER',
    grt: 57312,
  },
  {
    name: 'MT ALFA ALANDIA',
    flag: 'BAHAMAS',
    imo: '9752797',
    vesselType: 'CRUDE OIL TANKER',
    grt: 57164,
  },
  {
    name: 'MT LANCING',
    flag: 'BAHAMAS',
    imo: '9792046',
    vesselType: 'CRUDE OIL TANKER',
    grt: 57164,
  },
  {
    name: 'MV DK ITONIA',
    flag: 'KOREA',
    imo: '9643647',
    vesselType: 'GENERAL CARGO',
    grt: 9413,
  },
  {
    name: 'MV DK IMAN',
    flag: 'KOREA',
    imo: '9294769',
    vesselType: 'GENERAL CARGO',
    grt: 4562,
  },
  {
    name: 'MV DK ILIOS',
    flag: 'KOREA',
    imo: '9234771',
    vesselType: 'GENERAL CARGO',
    grt: 7433,
  },
]

async function main() {
  console.log('🚢 Updating vessel details...\n')

  for (const vessel of vesselData) {
    try {
      const result = await prisma.vessel.upsert({
        where: { name: vessel.name },
        update: {
          flag: vessel.flag,
          imo: vessel.imo,
          vesselType: vessel.vesselType,
          grt: vessel.grt,
        },
        create: {
          name: vessel.name,
          flag: vessel.flag,
          imo: vessel.imo,
          vesselType: vessel.vesselType,
          grt: vessel.grt,
        },
      })
      
      console.log(`✅ ${result.name}`)
      console.log(`   Flag: ${result.flag} | IMO: ${result.imo} | Type: ${result.vesselType} | GT: ${result.grt}`)
    } catch (error) {
      console.error(`❌ Error updating ${vessel.name}:`, error.message)
    }
  }

  console.log('\n✅ Vessel details updated successfully!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
