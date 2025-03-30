import { ServiceType } from '@prisma/client'
import { FilterType } from './types'
import { TIMEZONE } from './const'
import { fromZonedTime } from 'date-fns-tz'

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
    const getValue = (type: FilterType['type'], value: FilterType['value']) => {
      switch (type) {
        case 'date':
          return fromZonedTime(value, TIMEZONE)
        case 'numeric':
          return Number(value)
        default:
          return value
      }
    }

    const value = getValue(filter.type, filter.value)

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
