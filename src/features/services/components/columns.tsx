'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, EyeIcon, PencilIcon, Trash2 } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'

import Link from 'next/link'
import EditServiceDialog from './edit-service-dialog'
import { ServiceWithGoods, ServiceWithGoodsHistory } from '@/utils/types'
import DeleteServiceDialog from './delete-service-dialog'
import { TIMEZONE } from '@/utils/const'
import { formatInTimeZone } from 'date-fns-tz'
import { ContainerSize } from '../types'

export const serviceInColumns: ColumnDef<ServiceWithGoods>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tanggal Pengerjaan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      formatInTimeZone(row.original.date, TIMEZONE, 'dd-MM-yyyy'),
  },
  {
    accessorKey: 'truckNumber',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nomor Truck
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'remarks',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Keterangan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3 justify-end">
          <Link
            href={`/services/${row.original.id}`}
            className={buttonVariants({ size: 'icon' })}
          >
            <EyeIcon className="h-4 w-4" />
          </Link>
          <EditServiceDialog
            serviceData={row.original}
            triggerComponent={
              <Button variant="outline" size="icon">
                <PencilIcon className=" h-4 w-4" />
              </Button>
            }
          />
          <DeleteServiceDialog
            serviceData={row.original}
            triggerComponent={
              <Button variant="destructive" size="icon">
                <Trash2 className=" h-4 w-4" />
              </Button>
            }
          />
        </div>
      )
    },
    size: 200,
  },
]

export const serviceOutColumns: ColumnDef<ServiceWithGoods>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tanggal Pengerjaan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      formatInTimeZone(row.original.date, TIMEZONE, 'dd-MM-yyyy'),
  },
  {
    accessorKey: 'truckNumber',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nomor Truck
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'containerNumber',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nomor Container
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'PKBENumber',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nomor PKBE
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'PKBEDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tanggal PKBE
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      row.original.PKBEDate
        ? formatInTimeZone(row.original.PKBEDate, TIMEZONE, 'dd-MM-yyyy')
        : '',
  },
  {
    accessorKey: 'containerSize',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ukuran container
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      ContainerSize[row.original.containerSize as keyof typeof ContainerSize],
  },
  {
    accessorKey: 'remarks',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Keterangan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3 justify-end">
          <Link
            href={`/services/${row.original.id}`}
            className={buttonVariants({ size: 'icon' })}
          >
            <EyeIcon className="h-4 w-4" />
          </Link>
          <EditServiceDialog
            serviceData={row.original}
            triggerComponent={
              <Button variant="outline" size="icon">
                <PencilIcon className=" h-4 w-4" />
              </Button>
            }
          />
          <DeleteServiceDialog
            serviceData={row.original}
            triggerComponent={
              <Button variant="destructive" size="icon">
                <Trash2 className=" h-4 w-4" />
              </Button>
            }
          />
        </div>
      )
    },
    size: 200,
  },
]

export const serviceOutHistoryColumns: ColumnDef<ServiceWithGoodsHistory>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tanggal Pengerjaan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      formatInTimeZone(row.original.date, TIMEZONE, 'dd-MM-yyyy'),
  },
  {
    accessorKey: 'truckNumber',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nomor Truck
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'containerNumber',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nomor Container
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'PKBENumber',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nomor PKBE
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'PKBEDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tanggal PKBE
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      row.original.PKBEDate
        ? formatInTimeZone(row.original.PKBEDate, TIMEZONE, 'dd-MM-yyyy')
        : '',
  },
  {
    accessorKey: 'containerSize',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ukuran container
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      ContainerSize[row.original.containerSize as keyof typeof ContainerSize],
  },
  {
    accessorKey: 'PEBNumber',
    header: 'Nomor PEB',
    cell: ({ row }) =>
      row.original.serviceGoods
        .map((serviceGood) => serviceGood.good.PEBNumber)
        .join(', '),
  },
  {
    accessorKey: 'NPENumber',
    header: 'Nomor NPE',
    cell: ({ row }) =>
      row.original.serviceGoods
        .map((serviceGood) => serviceGood.good.NPENumber)
        .join(', '),
  },
  {
    accessorKey: 'remarks',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Keterangan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3 justify-end">
          <Link
            href={`/services/${row.original.id}`}
            className={buttonVariants({ size: 'icon' })}
          >
            <EyeIcon className="h-4 w-4" />
          </Link>
          <EditServiceDialog
            serviceData={row.original}
            triggerComponent={
              <Button variant="outline" size="icon">
                <PencilIcon className=" h-4 w-4" />
              </Button>
            }
          />
          <DeleteServiceDialog
            serviceData={row.original}
            triggerComponent={
              <Button variant="destructive" size="icon">
                <Trash2 className=" h-4 w-4" />
              </Button>
            }
          />
        </div>
      )
    },
    size: 200,
  },
]
