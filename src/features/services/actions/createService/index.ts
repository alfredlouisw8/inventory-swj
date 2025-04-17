'use server'

import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { PrismaPromise, Role, ServiceType } from '@prisma/client'
import { InputType, ReturnType } from '../types'
import { ServiceSchema } from '../schema'

async function createServiceInBackground(data: InputType, userId: string) {
  const {
    serviceType,
    truckNumber,
    PKBEDate,
    PKBENumber,
    containerNumber,
    containerSize,
    date,
    remarks,
    consolidatorId,
    goods,
  } = data

  const service = await prisma.service.create({
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
    const updateData =
      serviceType === ServiceType.IN
        ? { increment: quantity }
        : serviceType === ServiceType.OUT
        ? { decrement: quantity }
        : {}

    return prisma.good.update({
      where: { id: goodId },
      data: { currentQuantity: updateData },
    })
  })

  await prisma.$transaction(goodsUpdates)

  revalidatePath(`/consolidators/${consolidatorId}`)
  revalidatePath(`/services/${service.id}`)
}

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth()

  if (!session?.user) {
    return {
      error: 'Silahkan login',
    }
  }

  // Fire and forget the heavy create logic
  createServiceInBackground(data, session.user.id).catch((err) =>
    console.error('Create failed:', err)
  )

  return {
    data: {
      message: 'Jasa sedang diproses. Silakan refresh nanti.',
    },
  }
}

export const createService = createSafeAction(ServiceSchema, handler)
