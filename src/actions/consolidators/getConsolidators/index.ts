'use server'

import { FilterType } from '@/utils/types'
import prisma from '@/lib/prisma'
import { getWhereConditions } from '@/utils/functions'
import { SortingState } from '@tanstack/react-table'

export default async function getConsolidators<TData>(options: {
  pageIndex: number
  pageSize: number
  filters: FilterType[]
  sorting?: SortingState
}): Promise<{ data: TData[]; count: number }> {
  const { pageIndex, pageSize, filters, sorting } = options

  const whereConditions = getWhereConditions(filters)

  const orderBy =
    sorting?.map((s) => ({
      [s.id]: s.desc ? 'desc' : 'asc',
    })) || []

  try {
    const data = await prisma.consolidator.findMany({
      where: whereConditions,
      skip: pageIndex * pageSize,
      take: pageSize,
      orderBy,
    })

    const count = await prisma.consolidator.count({ where: whereConditions }) // Get total count with the same filters

    return { data: data as TData[], count: count ?? 0 }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { count: 0, data: [] as TData[] }
  }
}
