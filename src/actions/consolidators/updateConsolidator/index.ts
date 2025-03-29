'use server'

import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'

import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { ConsolidatorSchema } from '../schema'
import { InputType, ReturnType } from '../types'
import { createLogEntry, generateLogMessage } from '@/actions/logs/functions'
import { Role } from '@prisma/client'

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth()

  if (!session?.user) {
    return {
      error: 'Silahkan login',
    }
  }

  if (session.user.role === Role.USER) {
    return {
      error: 'Anda tidak punya akses',
    }
  }

  let result

  const { name, remarks, consolidatorId } = data

  try {
    result = await prisma.$transaction(async (prisma) => {
      const consolidator = await prisma.consolidator.update({
        data: {
          name,
          remarks,
        },
        where: {
          id: consolidatorId,
        },
      })

      return consolidator
    })
  } catch (error: any) {
    console.error(error.message)
    return {
      error: error.message || 'Gagal merubah consolidator',
    }
  }

  revalidatePath(`/consolidators`)
  revalidatePath(`/consolidators/${consolidatorId}`)
  return { data: result }
}

export const updateConsolidator = createSafeAction(ConsolidatorSchema, handler)
