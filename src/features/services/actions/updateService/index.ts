'use server'

import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { PrismaPromise, Role, ServiceType } from '@prisma/client'
import { InputType, ReturnType } from '../types'
import { ServiceSchema } from '../schema'
import { revertInventoryChanges } from '../functions'

async function updateServiceInBackground(data: InputType, userId: string) {
  const {
    serviceType,
    date,
    truckNumber,
    PKBEDate,
    PKBENumber,
    containerNumber,
    containerSize,
    remarks,
    consolidatorId,
    goods,
    serviceId,
  } = data

  const previousService = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { serviceGoods: true },
  })

  if (!previousService) throw new Error('Service not found')

  const transactions: PrismaPromise<any>[] = []

  transactions.push(
    ...revertInventoryChanges(
      previousService.serviceType,
      previousService.serviceGoods
    )
  )

  transactions.push(
    prisma.service.update({
      where: { id: serviceId },
      data: {
        serviceType: serviceType as ServiceType,
        date,
        remarks,
        truckNumber,
        PKBEDate,
        PKBENumber,
        containerNumber,
        containerSize,
        consolidatorId,
        serviceGoods: {
          upsert: goods.map(({ goodId, quantity }) => ({
            where: { serviceId_goodId: { serviceId, goodId } },
            update: { quantity },
            create: { goodId, quantity },
          })),
        },
      },
    })
  )

  const goodsUpdates = goods.map(({ goodId, quantity }) => {
    const data =
      serviceType === ServiceType.IN
        ? { increment: quantity }
        : serviceType === ServiceType.OUT
        ? { decrement: quantity }
        : undefined

    return prisma.good.update({
      where: { id: goodId },
      data: { currentQuantity: data },
    })
  })

  await prisma.$transaction([...transactions, ...goodsUpdates])

  revalidatePath(`/consolidators/${consolidatorId}`)
  revalidatePath(`/services/${serviceId}`)
}

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth()

  if (!session?.user) return { error: 'Silahkan login' }
  if (session.user.role === Role.USER)
    return { error: 'Anda tidak punya akses' }

  // Fire and forget the heavy update
  updateServiceInBackground(data, session.user.id).catch((err) =>
    console.error('Update failed:', err)
  )

  return {
    data: {
      message: 'Perubahan sedang diproses. Silakan refresh nanti.',
    },
  }
}

export const updateService = createSafeAction(ServiceSchema, handler)
