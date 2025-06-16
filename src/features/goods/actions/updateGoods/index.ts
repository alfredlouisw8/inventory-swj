'use server'

import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'

import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { InputType, ReturnType } from '../types'
import { GoodSchema } from '../schema'
import { Role } from '@prisma/client'
import { createErrorLogs, createLogs } from '@/features/logs/actions/createLogs'

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
    PEBDate,
    PEBNumber,
    NPEDate,
    NPENumber,
    block,
    mailNumber,
    shipper,
    truckNumber,
    date,
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
          PEBDate,
          block,
          mailNumber,
          PEBNumber,
          NPEDate,
          NPENumber,
          truckNumber,
          date,
          packageType,
          shipper,
          remarks,
        },
      })

      return good
    })
    createLogs({ data: data, actionType: 'updateGood' })
  } catch (error: any) {
    console.error(error.message)
    createErrorLogs({
      data: data,
      errorMessage: error.message,
      actionType: 'updateGood',
    })
    return {
      error: error.message || 'Gagal merubah barang',
    }
  }

  revalidatePath(`/consolidators/${consolidatorId}`)
  revalidatePath(`/goods/${goodId}`)

  return { data: result }
}

export const updateGood = createSafeAction(GoodSchema, handler)
