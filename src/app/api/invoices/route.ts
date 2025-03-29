import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma' // Adjust the path to your Prisma client instance

export async function GET(req: NextRequest) {
  try {
    // Get the consolidatorId from the query parameters
    const { searchParams } = new URL(req.url)
    const consolidatorId = searchParams.get('consolidatorId')

    if (!consolidatorId) {
      return NextResponse.json(
        { error: 'Missing consolidatorId' },
        { status: 400 }
      )
    }

    // Fetch invoices based on consolidatorId
    const invoices = await prisma.invoice.findMany({
      where: {
        consolidatorId: consolidatorId,
      },
    })

    return NextResponse.json({ data: invoices }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}
