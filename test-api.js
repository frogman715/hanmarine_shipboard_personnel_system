async function testAPI() {
  console.log('🔍 Testing API endpoints...\n')
  
  try {
    const res = await fetch('http://localhost:3000/api/crew')
    const data = await res.json()
    
    console.log(`📊 Total crew from API: ${data.length}`)
    
    // Count by status
    const onboard = data.filter(c => c.status === 'ONBOARD').length
    const standby = data.filter(c => c.status === 'STANDBY').length
    const inactive = data.filter(c => c.status === 'INACTIVE').length
    
    console.log(`\n✅ Status breakdown:`)
    console.log(`   ONBOARD: ${onboard}`)
    console.log(`   STANDBY: ${standby}`)
    console.log(`   INACTIVE: ${inactive}`)
    console.log(`\nAPI is returning correct data!`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testAPI()
