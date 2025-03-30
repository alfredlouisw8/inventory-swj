'use server'

import { FilterType, ServiceWithGoods } from '@/utils/types'
import { SortingState } from '@tanstack/react-table'
import { ServiceType } from '@prisma/client'
import getGoods from './actions/getGoods'

export const goodsFetchFunction = (
  options: {
    pageIndex: number
    pageSize: number
    filters: FilterType[]
    sorting?: SortingState
  },
  args: { consolidatorId?: string }
): Promise<{ data: ServiceWithGoods[]; count: number }> => {
  return getGoods(options, args)
}
