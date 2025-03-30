'use server'

import { FilterType } from '@/utils/types'
import prisma from '@/lib/prisma'
import { getWhereConditions } from '@/utils/functions'
import { SortingState } from '@tanstack/react-table'

export default async function getServices<TData>(
  options: {
    pageIndex: number
    pageSize: number
    filters: FilterType[]
    sorting?: SortingState
  },
  args: {
    consolidatorId?: string
    serviceType: string
  }
): Promise<{ data: TData[]; count: number }> {
  const { pageIndex, pageSize, filters, sorting } = options

  const { consolidatorId, serviceType } = args

  const whereConditions = getWhereConditions(filters)

  if (consolidatorId) {
    whereConditions.consolidatorId = consolidatorId
  }

  if (serviceType) {
    whereConditions.serviceType = serviceType
  }

  const orderBy =
    sorting?.map((s) => ({
      [s.id]: s.desc ? 'desc' : 'asc',
    })) || []

  try {
    const data = await prisma.service.findMany({
      where: whereConditions,
      skip: pageIndex * pageSize,
      take: pageSize,
      orderBy,
      include: { serviceGoods: true },
    })

    const count = await prisma.service.count({ where: whereConditions }) // Get total count with the same filters

    return { data: data as TData[], count: count ?? 0 }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { count: 0, data: [] as TData[] }
  }
}
