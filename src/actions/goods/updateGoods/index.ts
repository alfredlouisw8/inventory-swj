'use server'

import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'

import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { InputType, ReturnType } from '../types'
import { GoodSchema } from '../schema'
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

  const {
    name,
    consignee,
    currentQuantity,
    destination,
    packageType,
    shipper,
    remarks,
    goodId,
    consolidatorId,
  } = data

  try {
    result = await prisma.$transaction(async (prisma) => {
      const good = await prisma.good.update({
        where: {
          id: goodId,
        },
        data: {
          name,
          consignee,
          currentQuantity,
          destination,
          packageType,
          shipper,
          remarks,
        },
      })

      return good
    })
  } catch (error: any) {
    console.error(error.message)
    return {
      error: error.message || 'Gagal merubah barang',
    }
  }

  revalidatePath(`/consolidators/${consolidatorId}`)
  revalidatePath(`/goods/${goodId}`)

  return { data: result }
}

export const updateGood = createSafeAction(GoodSchema, handler)
