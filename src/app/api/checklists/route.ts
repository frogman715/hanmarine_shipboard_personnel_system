import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

// Load checklist templates from JSON
const templatesPath = path.join(process.cwd(), 'checklist-templates.json')
let CHECKLIST_TEMPLATES: any[] = []
try {
  CHECKLIST_TEMPLATES = JSON.parse(fs.readFileSync(templatesPath, 'utf8'))
} catch (e) {
  console.error('Failed to load checklist templates:', e)
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const crewId = url.searchParams.get('crewId')
  const applicationId = url.searchParams.get('applicationId')
  const templateCode = url.searchParams.get('template')

  // Return template definition
  if (templateCode) {
    const template = CHECKLIST_TEMPLATES.find((t: any) => t.code === templateCode)
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }
    return NextResponse.json(template)
  }

  // Return all templates
  if (!crewId && !applicationId) {
    return NextResponse.json(CHECKLIST_TEMPLATES)
  }

  // Return crew/application checklists
  const where: any = {}
  if (crewId) where.crewId = Number(crewId)
  if (applicationId) where.applicationId = Number(applicationId)

  const items = await prisma.documentChecklist.findMany({ 
    where,
    include: {
      crew: { select: { id: true, fullName: true, crewCode: true } },
      application: { select: { id: true, appliedRank: true } }
    },
    orderBy: { id: 'desc' }
  })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      crewId,
      applicationId,
      templateCode,
      checklistData,
      passportOk,
      seamanBookOk,
      cocOk,
      medicalOk,
      visaOk,
      vaccinationOk,
      photoIdOk,
      policeClearanceOk,
      trainingCertsOk,
      covidVaccineOk,
      remarks,
    } = body

    if (!crewId) return NextResponse.json({ error: 'crewId is required' }, { status: 400 })

    // Get template if provided
    const template = templateCode 
      ? CHECKLIST_TEMPLATES.find((t: any) => t.code === templateCode)
      : null

    const created = await prisma.documentChecklist.create({
      data: {
        crew: { connect: { id: Number(crewId) } },
        application: applicationId ? { connect: { id: Number(applicationId) } } : undefined,
        passportOk: checklistData?.passport ?? passportOk ?? null,
        seamanBookOk: checklistData?.seamanBook ?? seamanBookOk ?? null,
        cocOk: checklistData?.coc ?? cocOk ?? null,
        medicalOk: checklistData?.medicalCertificate ?? medicalOk ?? null,
        visaOk: checklistData?.visa ?? visaOk ?? null,
        vaccinationOk: checklistData?.covidVaccine ?? vaccinationOk ?? null,
        photoIdOk: checklistData?.nationalId ?? photoIdOk ?? null,
        policeClearanceOk: checklistData?.policeClearance ?? policeClearanceOk ?? null,
        trainingCertsOk: checklistData?.basicSafety ?? trainingCertsOk ?? null,
        covidVaccineOk: checklistData?.covidVaccine ?? covidVaccineOk ?? null,
        remarks: checklistData?.remarks ?? remarks ?? null,
        procedure: template ? {
          templateCode: template.code,
          templateName: template.name,
          items: checklistData || {},
          completedAt: new Date().toISOString(),
          completedBy: user.fullName
        } : null,
      },
    })

    // Check for expired certificates for this crew and return as warnings
    const expired = await prisma.certificate.findMany({
      where: {
        crewId: Number(crewId),
        expiryDate: { lt: new Date() },
      },
    })

    const warnings = expired.map((c) => ({ id: c.id, type: c.type, expiryDate: c.expiryDate }))

    return NextResponse.json({ checklist: created, warnings }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to save checklist' }, { status: 500 })
  }
}
