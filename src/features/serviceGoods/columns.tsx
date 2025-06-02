'use client'

import { Good, ServiceGood, ServiceType } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ServiceWithGoodData } from '@/utils/types'

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
    accessorKey: 'good.PEBNumber',
    id: 'goodPEBNumber',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nomor PEB
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.good.PEBNumber,
  },
  {
    accessorKey: 'good.NPENumber',
    id: 'goodNPENumber',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nomor NPE
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.good.NPENumber,
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
