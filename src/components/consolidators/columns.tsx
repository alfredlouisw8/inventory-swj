'use client'

import { Consolidator } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, EyeIcon, PencilIcon, Trash2 } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'

import Link from 'next/link'
import EditConsolidatorDialog from './edit-consolidator-dialog'
import DeleteConsolidatorDialog from './delete-consolidator-dialog'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const consolidatorColumns: ColumnDef<Consolidator>[] = [
  {
    accessorKey: 'name',
    enableSorting: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={(e) =>
            column.toggleSorting(
              e.shiftKey ? undefined : column.getIsSorted() === 'asc'
            )
          }
        >
          Nama
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'remarks',
    enableSorting: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={(e) =>
            column.toggleSorting(
              e.shiftKey ? undefined : column.getIsSorted() === 'asc'
            )
          }
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
            href={`/consolidators/${row.original.id}`}
            className={buttonVariants({ size: 'icon' })}
          >
            <EyeIcon className="h-4 w-4" />
          </Link>
          <EditConsolidatorDialog
            consolidatorData={row.original}
            triggerComponent={
              <Button variant="outline" size="icon">
                <PencilIcon className=" h-4 w-4" />
              </Button>
            }
          />
          <DeleteConsolidatorDialog
            consolidatorData={row.original}
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
