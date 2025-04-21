'use server'

import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'

import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { InputType, ReturnType } from '../types'
import { GoodSchema } from '../schema'
import { Role } from '@prisma/client'
import { create } from 'domain'
import { createErrorLogs, createLogs } from '@/features/logs/actions/createLogs'

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth()

  if (!session?.user) {
    return {
      error: 'Silahkan login',
    }
  }

  if (session.user.role !== Role.SUPER_ADMIN) {
    return {
      error: 'Anda tidak punya akses',
    }
  }

  let result

  const { goodId, consolidatorId } = data

  try {
    result = await prisma.$transaction(async (prisma) => {
      const good = await prisma.good.delete({
        where: {
          id: goodId,
        },
      })

      return good
    })
    createLogs({ data: data, actionType: 'deleteGood' })
  } catch (error: any) {
    console.error(error.message)
    createErrorLogs({
      data: data,
      actionType: 'deleteGood',
      errorMessage: error.message,
    })
    return {
      error: error.message || 'Gagal menghapus barang',
    }
  }

  revalidatePath(`/consolidators/${consolidatorId}`)
  return { data: result }
}

export const deleteGood = createSafeAction(GoodSchema, handler)
