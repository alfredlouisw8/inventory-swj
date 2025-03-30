'use client'

import { ServiceGood, ServiceType } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { serviceTypeText } from '@/utils/functions'
import { format } from 'date-fns'
import { TIMEZONE } from '@/utils/const'
import { formatInTimeZone } from 'date-fns-tz'

// Adjusted column definitions to work with individual ServiceGood objects

type ServiceWithGoodData = ServiceGood & {
  good: {
    name: string
    shipper: string
    packageType: string
    destination: string
    consignee: string
  }
}

export const serviceWithGoodsColumns: ColumnDef<ServiceWithGoodData>[] = [
  {
    accessorKey: 'good.name',
    id: 'goodName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nama Barang
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.good.name,
  },
  {
    accessorKey: 'good.shipper',
    id: 'goodShipper',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Shipper
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.good.shipper,
  },
  {
    accessorKey: 'good.consignee',
    id: 'goodConsignee',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Consignee
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.good.consignee,
  },
  {
    accessorKey: 'good.packageType',
    id: 'goodPackageType',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Packaging
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.good.packageType,
  },
  {
    accessorKey: 'good.destination',
    id: 'goodDestination',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Tujuan
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.good.destination,
  },
  {
    accessorKey: 'quantity', // Direct access to 'goodCount'
    id: 'goodCount',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Jumlah Barang
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.quantity, // Direct access to 'goodCount'
  },
]

// type GoodWithServiceData = ServiceGood & {
//   service: {
//     serviceCode: string
//     serviceCalculationType: ServiceCalculationType
//     serviceType: ServiceType
//     date: Date
//   }
// }

// export const goodsWithServiceColumns: ColumnDef<GoodWithServiceData>[] = [
//   {
//     accessorKey: 'service.serviceCode',
//     id: 'serviceCode',
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//       >
//         Kode Jasa
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => row.original.service.serviceCode,
//   },
//   {
//     accessorKey: 'service.serviceType',
//     id: 'serviceType',
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//       >
//         Tipe Jasa
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => serviceTypeText(row.original.service.serviceType),
//   },
//   {
//     accessorKey: 'service.date',
//     id: 'service.date',
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//       >
//         Tanggal Pengerjaan
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) =>
//       formatInTimeZone(row.original.service.date, TIMEZONE, 'dd-MM-yyyy'),
//   },
//   {
//     accessorKey: 'goodCount', // Direct access to 'goodCount'
//     id: 'goodCount',
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//       >
//         Jumlah Barang
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => row.original.goodCount, // Direct access to 'goodCount'
//   },
//   {
//     accessorKey: 'containerNumber', // Direct access to 'containerNumber'
//     id: 'containerNumber',
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//       >
//         Nomor Kontainer
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => row.original.containerNumber, // Direct access to 'containerNumber'
//   },
//   {
//     accessorKey: 'truckNumber', // Direct access to 'truckNumber'
//     id: 'truckNumber',
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//       >
//         Nomor Truk
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => row.original.truckNumber, // Direct access to 'truckNumber'
//   },
//   {
//     accessorKey: 'service.remarks',
//     id: 'remarks',
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//       >
//         Keterangan
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//   },
// ]
