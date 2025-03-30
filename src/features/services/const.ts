import { FilterFieldType } from '@/utils/types'
import { ContainerSize } from './types'

export const servicesInFilterFields: FilterFieldType[] = [
  {
    label: 'Tanggal Pengerjaan',
    value: 'date',
    type: 'date',
  },
  {
    label: 'Nomor truck',
    value: 'truckNumber',
    type: 'default',
  },
]

export const servicesOutFilterFields: FilterFieldType[] = [
  {
    label: 'Tanggal Pengerjaan',
    value: 'date',
    type: 'date',
  },
  {
    label: 'Nomor truck',
    value: 'truckNumber',
    type: 'default',
  },
  {
    label: 'Nomor container',
    value: 'containerNumber',
    type: 'default',
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
    label: 'Nomor NPE',
    value: 'NPENumber',
    type: 'default',
  },
  {
    label: 'Tanggal NPE',
    value: 'NPEDate',
    type: 'date',
  },
]

export const containerSizeOptions = Object.entries(ContainerSize).map(
  ([key, value]) => ({
    value: key,
    label: value,
  })
)
