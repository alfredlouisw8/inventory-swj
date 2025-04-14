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
    label: 'Nomor NPE',
    value: 'NPENumber',
    type: 'default',
  },
  {
    label: 'Tanggal NPE',
    value: 'NPEDate',
    type: 'date',
  },
  {
    label: 'Nomor PEB',
    value: 'PEBNumber',
    type: 'default',
  },
  {
    label: 'Tanggal PEB',
    value: 'PEBDate',
    type: 'date',
  },
  {
    label: 'Jumlah',
    value: 'currentQuantity',
    type: 'numeric',
  },
]
