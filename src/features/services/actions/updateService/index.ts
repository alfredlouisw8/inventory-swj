'use server'

import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { PrismaPromise, Role, ServiceType } from '@prisma/client'
import { InputType, ReturnType } from '../types'
import { ServiceSchema } from '../schema'
import { createErrorLogs, createLogs } from '@/features/logs/actions/createLogs'

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

  const oldGoodsMap = new Map(
    previousService.serviceGoods.map((item) => [item.goodId, item.quantity])
  )

  const deltas: Record<string, number> = {}
  for (const { goodId, quantity } of goods) {
    const prevQty = oldGoodsMap.get(goodId) ?? 0
    const diff = quantity - prevQty
    const delta =
      serviceType === ServiceType.IN
        ? diff
        : serviceType === ServiceType.OUT
        ? -diff
        : 0

    if (delta !== 0) {
      deltas[goodId] = (deltas[goodId] || 0) + delta
    }
  }

  // Calculate deltas for removed goods
  const removedGoods = Array.from(oldGoodsMap.entries())
    .filter(([goodId]) => !goods.some((g) => g.goodId === goodId))
    .map(([goodId, quantity]) => ({
      goodId,
      // Reverse the original operation
      delta: serviceType === ServiceType.IN ? -quantity : quantity,
    }))

  // Add deltas for removed goods
  for (const { goodId, delta } of removedGoods) {
    deltas[goodId] = (deltas[goodId] || 0) + delta
  }

  let updatedService

  const transactions: PrismaPromise<any>[] = []

  const updateServicePromise = prisma.service.update({
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
        deleteMany: {
          serviceId,
          goodId: {
            notIn: goods.map((g) => g.goodId),
          },
        },
        upsert: goods.map(({ goodId, quantity }) => ({
          where: { serviceId_goodId: { serviceId, goodId } },
          update: { quantity },
          create: { goodId, quantity },
        })),
      },
    },
  })

  transactions.push(updateServicePromise)

  for (const [goodId, delta] of Object.entries(deltas)) {
    transactions.push(
      prisma.good.update({
        where: { id: goodId },
        data: {
          currentQuantity: {
            increment: delta,
          },
        },
      })
    )
  }

  const [service] = await prisma.$transaction(transactions)
  updatedService = service

  revalidatePath(`/consolidators/${consolidatorId}`)
  revalidatePath(`/services/${serviceId}`)

  return updatedService
}

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth()

  if (!session?.user) return { error: 'Silahkan login' }
  if (session.user.role === Role.USER)
    return { error: 'Anda tidak punya akses' }

  try {
    const service = await updateServiceInBackground(data, session.user.id)

    createLogs({ data: data, actionType: 'updateService' })
    return { data: service }
  } catch (err: any) {
    console.error('Update failed:', err)
    createErrorLogs({
      data: data,
      actionType: 'updateService',
      errorMessage: err.message,
    })
    return { error: err.message || 'Gagal mengupdate jasa' }
  }
}

export const updateService = createSafeAction(ServiceSchema, handler)
