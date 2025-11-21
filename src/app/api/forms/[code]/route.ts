import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// GET specific form template with fields
export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const form = await prisma.formTemplate.findUnique({
      where: { code: params.code },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 }
    )
  }
}

// PUT update form template (DIRECTOR only)
export async function PUT(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'DIRECTOR') {
      return NextResponse.json(
        { error: 'Only Director can update form templates' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { name, description } = body

    const form = await prisma.formTemplate.update({
      where: { code: params.code },
      data: { name, description }
    })

    return NextResponse.json({
      success: true,
      form
    })
  } catch (error) {
    console.error('Error updating form:', error)
    return NextResponse.json(
      { error: 'Failed to update form' },
      { status: 500 }
    )
  }
}

// DELETE form template (DIRECTOR only)
export async function DELETE(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'DIRECTOR') {
      return NextResponse.json(
        { error: 'Only Director can delete form templates' },
        { status: 403 }
      )
    }

    await prisma.formTemplate.delete({
      where: { code: params.code }
    })

    return NextResponse.json({
      success: true,
      message: 'Form deleted'
    })
  } catch (error) {
    console.error('Error deleting form:', error)
    return NextResponse.json(
      { error: 'Failed to delete form' },
      { status: 500 }
    )
  }
}
