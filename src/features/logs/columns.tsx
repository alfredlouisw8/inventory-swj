'use client'

import { Good, Log } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, EyeIcon, PencilIcon, Trash2 } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { TIMEZONE } from '@/utils/const'
import { formatInTimeZone } from 'date-fns-tz'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const logColumns: ColumnDef<Log>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tanggal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      row.original.createdAt
        ? formatInTimeZone(row.original.createdAt, TIMEZONE, 'dd-MM-yyyy')
        : '',
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'actionType',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Action Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'data',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'errorMessage',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Error Message
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]
