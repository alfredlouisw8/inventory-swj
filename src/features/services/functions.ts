'use server'

import { FilterType, ServiceWithGoods } from '@/utils/types'
import { SortingState } from '@tanstack/react-table'
import getServices from './actions/getServices'
import { ServiceType } from '@prisma/client'

export const servicesFetchFunction = (
  options: {
    pageIndex: number
    pageSize: number
    filters: FilterType[]
    sorting?: SortingState
  },
  args: { consolidatorId?: string; serviceType: ServiceType }
): Promise<{ data: ServiceWithGoods[]; count: number }> => {
  return getServices(options, args)
}
