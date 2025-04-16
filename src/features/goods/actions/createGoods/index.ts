'use server'

import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'

import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { InputType, ReturnType } from '../types'
import { GoodSchema } from '../schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth()

  if (!session?.user) {
    return {
      error: 'Silahkan login',
    }
  }

  let result

  const {
    name,
    consignee,
    destination,
    packageType,
    PEBDate,
    PEBNumber,
    NPEDate,
    NPENumber,
    shipper,
    currentQuantity,
    truckNumber,
    date,
    remarks,
    consolidatorId,
  } = data

  try {
    result = await prisma.$transaction(async (prisma) => {
      const good = await prisma.good.create({
        data: {
          name,
          consignee,
          destination,
          packageType,
          PEBDate,
          PEBNumber,
          NPEDate,
          NPENumber,
          truckNumber,
          date,
          shipper,
          currentQuantity,
          consolidatorId,
          remarks,
        },
      })

      return good
    })
  } catch (error: any) {
    console.error(error.message)
    return {
      error: error.message || 'Gagal menambah barang',
    }
  }

  revalidatePath(`/consolidators/${consolidatorId}`)
  return { data: result }
}

export const createGood = createSafeAction(GoodSchema, handler)
