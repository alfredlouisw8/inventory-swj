'use server'

import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { ServiceType } from '@prisma/client'
import { InputType, ReturnType } from '../types'
import { ServiceSchema } from '../schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth()

  if (!session?.user) {
    return {
      error: 'Silahkan login',
    }
  }

  const {
    serviceType,
    truckNumber,
    containerNumber,
    containerSize,
    PKBEDate,
    PKBENumber,
    consolidatorId,
    date,
    remarks,
    goods,
  } = data

  try {
    const servicePromise = prisma.service.create({
      data: {
        serviceType: serviceType as ServiceType,
        date,
        remarks,
        consolidatorId,
        truckNumber,
        containerNumber,
        PKBEDate,
        PKBENumber,
        containerSize,
        serviceGoods: {
          create: goods.map(({ goodId, quantity }) => ({
            goodId,
            quantity,
          })),
        },
      },
    })

    const goodsUpdates = goods.map(({ quantity, goodId }) => {
      const calculationType =
        serviceType === ServiceType.IN
          ? { increment: quantity }
          : serviceType === ServiceType.OUT
          ? { decrement: quantity }
          : undefined

      return prisma.good.update({
        where: { id: goodId },
        data: { currentQuantity: calculationType },
      })
    })

    const [service] = await prisma.$transaction([
      servicePromise,
      ...goodsUpdates,
    ])

    revalidatePath(`/consolidators/${consolidatorId}`)

    return { data: service }
  } catch (error: any) {
    console.error(error)
    return {
      error: error.message || 'Gagal menambah jasa',
    }
  }
}

export const createService = createSafeAction(ServiceSchema, handler)
