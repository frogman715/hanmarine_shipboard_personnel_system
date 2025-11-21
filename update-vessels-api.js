const vesselUpdates = [
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

async function updateVessels() {
  console.log('🚢 Updating vessels via API...\n')
  
  for (const vessel of vesselUpdates) {
    try {
      // Check if vessel exists
      const checkResponse = await fetch(`http://localhost:3000/api/vessels?name=${encodeURIComponent(vessel.name)}`)
      const existing = await checkResponse.json()
      
      let response
      if (existing && existing.length > 0) {
        // Update existing
        response = await fetch(`http://localhost:3000/api/vessels/${existing[0].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vessel)
        })
      } else {
        // Create new
        response = await fetch('http://localhost:3000/api/vessels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vessel)
        })
      }
      
      if (response.ok) {
        const result = await response.json()
        console.log(`✅ ${vessel.name}`)
        console.log(`   Flag: ${vessel.flag} | IMO: ${vessel.imo} | Type: ${vessel.vesselType} | GT: ${vessel.grt}\n`)
      } else {
        console.log(`❌ ${vessel.name} - ${response.statusText}`)
      }
    } catch (error) {
      console.error(`❌ Error with ${vessel.name}:`, error.message)
    }
  }
  
  console.log('✅ Done!')
}

updateVessels()
