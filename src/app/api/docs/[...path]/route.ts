import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    // Decode each path segment properly
    const decodedPath = params.path.map(segment => decodeURIComponent(segment)).join('/')
    let fullPath = path.join(process.cwd(), 'docs', decodedPath)

    console.log('Requested path:', decodedPath)
    console.log('Full path:', fullPath)

    // Check if file exists - if not, try with curly apostrophe
    if (!fs.existsSync(fullPath)) {
      // Replace straight apostrophe with curly apostrophe (Unicode U+2019)
      const pathWithCurlyApostrophe = decodedPath.replace(/'/g, '\u2019')
      fullPath = path.join(process.cwd(), 'docs', pathWithCurlyApostrophe)
      console.log('Trying with curly apostrophe:', fullPath)
      
      if (!fs.existsSync(fullPath)) {
        console.log('File not found:', fullPath)
        return NextResponse.json({ error: 'File not found', path: fullPath }, { status: 404 })
      }
    }

    // Read file
    const fileBuffer = fs.readFileSync(fullPath)
    const fileName = path.basename(fullPath)

    // Determine content type based on extension
    const ext = path.extname(fullPath).toLowerCase()
    const contentTypes: Record<string, string> = {
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.pdf': 'application/pdf',
    }

    const contentType = contentTypes[ext] || 'application/octet-stream'

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
