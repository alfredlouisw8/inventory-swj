import { FilterFieldType } from '@/utils/types'

export const goodsFilterFields: FilterFieldType[] = [
  {
    label: 'Nama',
    value: 'name',
    type: 'default',
  },
  {
    label: 'Shipper',
    value: 'shipper',
    type: 'default',
  },
  {
    label: 'Consignee',
    value: 'consignee',
    type: 'default',
  },
  {
    label: 'Tujuan',
    value: 'destination',
    type: 'default',
  },
  {
    label: 'Jumlah',
    value: 'currentQuantity',
    type: 'numeric',
  },
]
