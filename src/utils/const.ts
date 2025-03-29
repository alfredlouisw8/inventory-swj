import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Equal,
  Space,
} from 'lucide-react'

// Create our number formatter.
export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

export const PRICE_TAX = 0.11
export const INCOME_TAX = 0.02
export const TIMEZONE = 'Asia/Bangkok'

export const PER_PAGE = 10
export const operatorOptions = {
  default: [
    { value: 'equals', label: 'Equals', icon: Equal },
    { value: 'contains', label: 'Contains', icon: Space },
    { value: 'startsWith', label: 'Starts with', icon: ArrowRight },
    { value: 'endsWith', label: 'Ends with', icon: ArrowLeft },
  ],
  date: [
    { value: 'equals', label: 'Equals', icon: Equal },
    { value: 'before', label: 'Before', icon: ArrowLeft },
    { value: 'after', label: 'After', icon: ArrowRight },
  ],
  numeric: [
    { value: 'equals', label: 'Equals', icon: Equal },
    { value: 'greaterThan', label: 'Greater than', icon: ChevronRight },
    { value: 'lessThan', label: 'Less than', icon: ChevronLeft },
  ],
}
