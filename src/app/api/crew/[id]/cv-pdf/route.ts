import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Crew ID required' }, { status: 400 })
  }

  try {
    const crew = await prisma.crew.findUnique({
      where: { id: parseInt(id) },
      include: {
        certificates: {
          orderBy: { type: 'asc' },
        },
        seaServices: {
          orderBy: { id: 'desc' },
        },
        assignments: {
          where: { status: { in: ['ONBOARD', 'ACTIVE'] } },
          orderBy: { signOn: 'desc' },
          take: 5,
        },
      },
    })

    if (!crew) {
      return NextResponse.json({ error: 'Crew not found' }, { status: 404 })
    }

    // Generate PDF
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.text('CURRICULUM VITAE', 105, 20, { align: 'center' })

    doc.setFontSize(12)
    doc.text('⚓ Hanmarine Shipboard Personnel System', 105, 30, { align: 'center' })

    // Personal Information
    doc.setFontSize(14)
    doc.text('Personal Information', 14, 45)

    const personalData = [
      ['Full Name', crew.fullName],
      ['Rank', crew.rank || '-'],
      ['Status', crew.crewStatus],
      ['Place of Birth', crew.placeOfBirth || '-'],
      ['Date of Birth', crew.dateOfBirth ? new Date(crew.dateOfBirth).toLocaleDateString() : '-'],
      ['Religion', crew.religion || '-'],
      ['Blood Type', crew.bloodType || '-'],
      ['Height', crew.heightCm ? `${crew.heightCm} cm` : '-'],
      ['Weight', crew.weightKg ? `${crew.weightKg} kg` : '-'],
      ['Phone', crew.phoneMobile || crew.phoneHome || '-'],
      ['Address', crew.address || '-'],
    ]

    autoTable(doc, {
      startY: 50,
      head: [],
      body: personalData,
      theme: 'grid',
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 130 },
      },
    })

    // Certificates
    let finalY = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(14)
    doc.text('Certificates & Licenses', 14, finalY)

    if (crew.certificates.length > 0) {
      const certData = crew.certificates.map((cert: any) => [
        cert.type,
        cert.issuer || '-',
        cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : '-',
        cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : '-',
      ])

      autoTable(doc, {
        startY: finalY + 5,
        head: [['Type', 'Number/Issuer', 'Issue Date', 'Expiry Date']],
        body: certData,
        theme: 'striped',
      })

      finalY = (doc as any).lastAutoTable.finalY + 10
    } else {
      doc.setFontSize(10)
      doc.text('No certificates on record', 14, finalY + 5)
      finalY += 15
    }

    // Sea Service Experience
    if (finalY > 250) {
      doc.addPage()
      finalY = 20
    }

    doc.setFontSize(14)
    doc.text('Sea Service Experience', 14, finalY)

    if (crew.seaServices.length > 0) {
      const seaData = crew.seaServices.map((sea: any) => [
        sea.vesselName || '-',
        sea.vesselType || '-',
        sea.rank || '-',
        sea.fromDate ? new Date(sea.fromDate).toLocaleDateString() : '-',
        sea.toDate ? new Date(sea.toDate).toLocaleDateString() : '-',
      ])

      autoTable(doc, {
        startY: finalY + 5,
        head: [['Vessel', 'Type', 'Rank', 'Sign On', 'Sign Off']],
        body: seaData,
        theme: 'striped',
      })

      finalY = (doc as any).lastAutoTable.finalY + 10
    } else {
      doc.setFontSize(10)
      doc.text('No sea service records', 14, finalY + 5)
      finalY += 15
    }

    // Recent Assignments
    if (crew.assignments.length > 0 && finalY < 250) {
      doc.setFontSize(14)
      doc.text('Recent Assignments', 14, finalY)

      const assignData = crew.assignments.map((a: any) => [
        a.vesselName,
        a.rank,
        a.signOn ? new Date(a.signOn).toLocaleDateString() : '-',
        a.signOff ? new Date(a.signOff).toLocaleDateString() : 'Current',
        a.status,
      ])

      autoTable(doc, {
        startY: finalY + 5,
        head: [['Vessel', 'Rank', 'Sign On', 'Sign Off', 'Status']],
        body: assignData,
        theme: 'striped',
      })
    }

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
        105,
        290,
        { align: 'center' }
      )
    }

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="CV-${crew.fullName.replace(/\s+/g, '-')}.pdf"`,
      },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
