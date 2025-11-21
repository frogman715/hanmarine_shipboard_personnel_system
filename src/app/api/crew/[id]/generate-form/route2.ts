import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import fs from 'fs'
import path from 'path'
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import ExcelJS from 'exceljs'

async function generateForm(crewId: number, formType: string, customData?: any) {
  // Get crew data if not provided
  let templateData = customData
  
  if (!customData) {
    const crew = await prisma.crew.findUnique({
      where: { id: crewId },
      include: {
        certificates: true,
        seaServices: true,
      },
    })

    if (!crew) {
      throw new Error('Crew not found')
    }

    // Prepare data for template
    templateData = {
      fullName: crew.fullName || '',
      crewCode: crew.crewCode || '',
      rank: crew.rank || '',
      vessel: crew.vessel || '',
      placeOfBirth: crew.placeOfBirth || '',
      dateOfBirth: crew.dateOfBirth ? new Date(crew.dateOfBirth).toLocaleDateString('en-GB') : '',
      age: crew.dateOfBirth ? String(Math.floor((new Date().getTime() - new Date(crew.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))) : '',
      religion: crew.religion || '',
      bloodType: crew.bloodType || '',
      heightCm: crew.heightCm || '',
      weightKg: crew.weightKg || '',
      shoeSize: crew.shoeSize || '',
      address: crew.address || '',
      phoneMobile: crew.phoneMobile || '',
      phoneHome: crew.phoneHome || '',
      wifeName: crew.wifeName || '',
      totalFamily: crew.totalFamily || '',
      passport: crew.certificates.find(c => c.type.includes('Passport'))?.expiryDate 
        ? new Date(crew.certificates.find(c => c.type.includes('Passport'))!.expiryDate!).toLocaleDateString('en-GB') 
        : '',
      seamanBook: crew.certificates.find(c => c.type.includes('Seaman'))?.expiryDate 
        ? new Date(crew.certificates.find(c => c.type.includes('Seaman'))!.expiryDate!).toLocaleDateString('en-GB') 
        : '',
      medical: crew.certificates.find(c => c.type.includes('Medical'))?.expiryDate 
        ? new Date(crew.certificates.find(c => c.type.includes('Medical'))!.expiryDate!).toLocaleDateString('en-GB') 
        : '',
      lastVessel: crew.seaServices[0]?.vesselName || '',
      lastRank: crew.seaServices[0]?.rank || '',
      lastSignOn: crew.seaServices[0]?.signOn 
        ? new Date(crew.seaServices[0].signOn).toLocaleDateString('en-GB') 
        : '',
      lastSignOff: crew.seaServices[0]?.signOff 
        ? new Date(crew.seaServices[0].signOff).toLocaleDateString('en-GB') 
        : '',
      today: new Date().toLocaleDateString('en-GB'),
      year: String(new Date().getFullYear()),
    }
  }

  // Map form types to template paths
  const formTemplates: Record<string, string> = {
    'lundqvist-contract': 'LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/1.SEAFARER\u2019S EMPLOYMENT CONTRACT.docx',
    'lundqvist-nok': 'LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/2.NEXT OF KIN DECLARATION.docx',
    'lundqvist-form': 'LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/3.LUNDQVIST REDERIERNA.docx',
    'lundqvist-medical': 'LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/3.MEDICAL HISTORY CHECKING LIST.docx',
    'lundqvist-checklist': 'LUNDQVIST REDERIERNA/6.Jika di approv dibuatkan/5.CHECK LIST PENERIMAAN DOCUMEN CREW.xls',
    'intergis-contract': 'INTERGIS CO, LTD/6.Jika di approv dibuatkan/1.SEAFARER EMPLOYMENT AGREEMENT.docx',
    'intergis-nok': 'INTERGIS CO, LTD/6.Jika di approv dibuatkan/2.NEXT OF KIN DECLARATION.docx',
    'intergis-medical': 'INTERGIS CO, LTD/6.Jika di approv dibuatkan/3.MEDICAL HISTORY CHECKING LIST.docx',
    'intergis-training-record': 'INTERGIS CO, LTD/6.Jika di approv dibuatkan/Training record INTERGIS.xlsx',
    'intergis-training-schedule': 'INTERGIS CO, LTD/6.Jika di approv dibuatkan/Training Schedule for Foreigner.docx',
  }

  const templatePath = formTemplates[formType]
  if (!templatePath) {
    throw new Error('Invalid form type')
  }

  const fullPath = path.join(process.cwd(), 'docs', templatePath)

  if (!fs.existsSync(fullPath)) {
    throw new Error('Template not found')
  }

  const ext = path.extname(fullPath).toLowerCase()
  
  // Handle Excel files (.xls, .xlsx)
  if (ext === '.xlsx' || ext === '.xls') {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(fullPath)
    
    workbook.eachSheet((worksheet) => {
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          if (typeof cell.value === 'string') {
            let value = cell.value
            value = value.replace(/\{fullName\}/gi, templateData.fullName || '')
            value = value.replace(/\{crewCode\}/gi, templateData.crewCode || '')
            value = value.replace(/\{rank\}/gi, templateData.rank || '')
            value = value.replace(/\{vessel\}/gi, templateData.vessel || '')
            value = value.replace(/\{dateOfBirth\}/gi, templateData.dateOfBirth || '')
            value = value.replace(/\{placeOfBirth\}/gi, templateData.placeOfBirth || '')
            value = value.replace(/\{address\}/gi, templateData.address || '')
            value = value.replace(/\{phoneMobile\}/gi, templateData.phoneMobile || '')
            value = value.replace(/\{today\}/gi, templateData.today || '')
            cell.value = value
          }
        })
      })
    })
    
    const buffer = await workbook.xlsx.writeBuffer()
    return { buffer, ext, data: templateData }
  }
  
  // Check if file is .doc (old format)
  if (ext === '.doc') {
    const content = fs.readFileSync(fullPath)
    return { buffer: content, ext, data: templateData }
  }

  // Handle .docx files
  const content = fs.readFileSync(fullPath, 'binary')
  const zip = new PizZip(content)
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  })

  doc.render(templateData)

  const buf = doc.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  })

  return { buffer: buf, ext: '.docx', data: templateData }
}

// POST - Generate with custom data (from edit form)
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const crewId = Number(params.id)
    const url = new URL(req.url)
    const formType = url.searchParams.get('form')
    const customData = await req.json()

    if (!formType) {
      return NextResponse.json({ error: 'Form type required' }, { status: 400 })
    }

    const result = await generateForm(crewId, formType, customData)
    const fileName = `${result.data.fullName}_${formType}${result.ext}`

    return new NextResponse(result.buffer as any, {
      headers: {
        'Content-Type': result.ext === '.xlsx' || result.ext === '.xls'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : result.ext === '.doc'
          ? 'application/msword'
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    })
  } catch (error) {
    console.error('Error generating form:', error)
    return NextResponse.json({ 
      error: 'Failed to generate form', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

// GET - Direct download with crew data
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const crewId = Number(params.id)
    const url = new URL(req.url)
    const formType = url.searchParams.get('form')

    if (!formType) {
      return NextResponse.json({ error: 'Form type required' }, { status: 400 })
    }

    const result = await generateForm(crewId, formType)
    const fileName = `${result.data.fullName}_${formType}${result.ext}`

    return new NextResponse(result.buffer as any, {
      headers: {
        'Content-Type': result.ext === '.xlsx' || result.ext === '.xls'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : result.ext === '.doc'
          ? 'application/msword'
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    })
  } catch (error) {
    console.error('Error generating form:', error)
    return NextResponse.json({ 
      error: 'Failed to generate form', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
