'use server'

import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'

import { InputType, ReturnType } from '../types'
import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { ConsolidatorSchema } from '../schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth()

  if (!session?.user) {
    return {
      error: 'Silahkan login',
    }
  }

  let result

  const { name, remarks } = data

  try {
    result = await prisma.$transaction(async (prisma) => {
      const consolidator = await prisma.consolidator.create({
        data: {
          name,
          remarks,
        },
      })

      return consolidator
    })
  } catch (error: any) {
    console.error(error.message)
    return {
      error: error.message || 'Gagal menambah consolidator.',
    }
  }

  revalidatePath(`/consolidators`)
  return { data: result }
}

export const createConsolidator = createSafeAction(ConsolidatorSchema, handler)
