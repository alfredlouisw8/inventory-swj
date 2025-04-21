import { Consolidator, Log } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, EyeIcon, PencilIcon, Trash2 } from 'lucide-react'

import { Button, ButtonProps, buttonVariants } from '@/components/ui/button'

import { FilterFieldType } from '@/utils/types'

export const logsFilterFields: FilterFieldType[] = [
  {
    label: 'Type',
    value: 'type',
    type: 'default',
  },
  {
    label: 'Action Type',
    value: 'actionType',
    type: 'default',
  },
  {
    label: 'Data',
    value: 'data',
    type: 'default',
  },
  {
    label: 'Error Message',
    value: 'errorMessage',
    type: 'default',
  },
]
