import { ServiceType } from '@prisma/client'
import { FilterType } from './types'

export function serviceTypeText(type: string) {
  switch (type) {
    case ServiceType.IN:
      return 'Bongkar'
    case ServiceType.OUT:
      return 'Muat'
    default:
      // You may want to add a default return value or throw an error here
      return ''
  }
}

export const getWhereConditions = (filters: FilterType[]) => {
  const whereConditions: Record<string, any> = {}

  filters.forEach((filter) => {
    const isDateComparison = ['before', 'after'].includes(filter.operator)
    const value = isDateComparison ? new Date(filter.value) : filter.value

    switch (filter.operator) {
      case 'contains':
        whereConditions[filter.field] = {
          contains: value,
          mode: 'insensitive',
        }
        break
      case 'equals':
        whereConditions[filter.field] = value
        break
      case 'startsWith':
        whereConditions[filter.field] = {
          startsWith: value,
          mode: 'insensitive',
        }
        break
      case 'endsWith':
        whereConditions[filter.field] = {
          endsWith: value,
          mode: 'insensitive',
        }
        break
      case 'before':
        whereConditions[filter.field] = { lt: value }
        break
      case 'after':
        whereConditions[filter.field] = { gt: value }
        break
      case 'greaterThan':
        whereConditions[filter.field] = { gt: value }
        break
      case 'lessThan':
        whereConditions[filter.field] = { lt: value }
        break
    }
  })

  return whereConditions
}
