import { NextRequest, NextResponse } from 'next/server'
import { exportGoodsData } from '@/actions/goods/exportGoods'

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

    const result = await exportGoodsData(consolidatorId)

    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching goods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goods' },
      { status: 500 }
    )
  }
}
