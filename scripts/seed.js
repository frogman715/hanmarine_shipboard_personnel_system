// Simple seed script that posts sample data to local dev server API endpoints.
// Usage: `node scripts/seed.js` (ensure dev server is running, default localhost:3000)

// Use global fetch if available (Node 18+). Otherwise dynamically import node-fetch.
let fetchFn
if (typeof globalThis.fetch === 'function') {
  fetchFn = globalThis.fetch.bind(globalThis)
} else {
  fetchFn = (...args) => import('node-fetch').then(({ default: f }) => f(...args))
}

const BASE = process.env.SEED_BASE_URL || 'http://localhost:3000'

async function createCrew(payload) {
  const res = await fetchFn(`${BASE}/api/crew`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}

async function createApplication(payload) {
  const res = await fetchFn(`${BASE}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}

async function run() {
  console.log('Seeding sample data to', BASE)

  const crew1 = await createCrew({ fullName: 'ARIEF SULAEMAN', rank: 'AB', vessel: 'MT TEST', status: 'AVAILABLE' })
  console.log('Created crew', crew1.id)

  const crew2 = await createCrew({ fullName: 'BUDI SANTOSO', rank: '2E', vessel: null, status: 'AVAILABLE' })
  console.log('Created crew', crew2.id)

  const app1 = await createApplication({ crewId: crew1.id, appliedRank: 'AB', notes: 'Sample application' })
  console.log('Created application', app1.id)

  console.log('Seeding finished. Visit /crew and /applications to see data.')
}

run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
