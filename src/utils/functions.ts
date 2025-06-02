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

export const toUTCISOStringFromZoned = (
  localDateStr: string,
  timeZone = 'Asia/Singapore'
): string => {
  // Treat local date as if it were at 00:00 in the given time zone
  const localDate = new Date(`${localDateStr}T00:00:00`)

  // Format the local date in the given time zone and extract parts
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(localDate)

  const get = (type: string) => parts.find((p) => p.type === type)?.value

  // Combine formatted parts to form the correct local datetime string
  const tzDateStr = `${get('year')}-${get('month')}-${get('day')}T${get(
    'hour'
  )}:${get('minute')}:${get('second')}`

  // Create a date from that (interpreted as local TZ)
  const tzDate = new Date(tzDateStr)

  // Return the UTC string
  return tzDate.toISOString() // this is in UTC
}
export const getWhereConditions = (filters: FilterType[]) => {
  const whereConditions: Record<string, any> = {}
  filters.forEach((filter) => {
    const getValue = (type: FilterType['type'], value: FilterType['value']) => {
      switch (type) {
        case 'date':
          return toUTCISOStringFromZoned(value, TIMEZONE)
        case 'numeric':
          return Number(value)
        default:
          return value
      }
    }

    const value = getValue(filter.type, filter.value)

    const condition =
      filter.operator === 'contains'
        ? { contains: value, mode: 'insensitive' }
        : filter.operator === 'equals'
        ? value
        : filter.operator === 'startsWith'
        ? { startsWith: value, mode: 'insensitive' }
        : filter.operator === 'endsWith'
        ? { endsWith: value, mode: 'insensitive' }
        : filter.operator === 'before' || filter.operator === 'lessThan'
        ? { lt: value }
        : filter.operator === 'after' || filter.operator === 'greaterThan'
        ? { gt: value }
        : undefined

    // Custom case: nested field from Good
    if (['PEBNumber', 'NPENumber'].includes(filter.field)) {
      whereConditions.serviceGoods = {
        some: {
          good: {
            ...whereConditions.serviceGoods?.some?.good,
            [filter.field]: condition,
          },
        },
      }
    } else {
      whereConditions[filter.field] = condition
    }
  })

  return whereConditions
}
