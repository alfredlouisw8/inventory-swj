'use server'

import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { PrismaPromise, Role, ServiceType } from '@prisma/client'
import { InputType, ReturnType } from '../types'
import { ServiceSchema } from '../schema'
import { revertInventoryChanges } from '../functions'

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

  const {
    serviceType,
    date,
    truckNumber,
    NPEDate,
    PEBNumber,
    NPENumber,
    PEBDate,
    containerNumber,
    containerSize,
    remarks,
    consolidatorId,
    goods,
    serviceId,
  } = data

  try {
    // 1. Fetch the current service data including the serviceGoods and calculation types
    const previousService = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { serviceGoods: true },
    })

    if (!previousService) {
      return { error: 'Service not found' }
    }

    const transactions: PrismaPromise<any>[] = []

    // 2. Revert the previous calculation
    transactions.push(
      ...revertInventoryChanges(
        previousService.serviceType,
        previousService.serviceGoods
      )
    )

    // 3. Update the service with new data and upsert the related serviceGoods
    transactions.push(
      prisma.service.update({
        where: { id: serviceId },
        data: {
          serviceType: serviceType as ServiceType,
          date,
          remarks,
          truckNumber,
          NPEDate,
          PEBNumber,
          NPENumber,
          PEBDate,
          containerNumber,
          containerSize,
          consolidatorId,
          serviceGoods: {
            upsert: goods.map(({ goodId, quantity }) => ({
              where: {
                serviceId_goodId: {
                  serviceId,
                  goodId,
                },
              },
              update: {
                quantity,
              },
              create: {
                goodId,
                quantity,
              },
            })),
          },
        },
      })
    )

    const goodsUpdates = goods.reduce((acc, { quantity, goodId }) => {
      let calculationType = {}

      switch (serviceType) {
        case ServiceType.IN:
          calculationType = { increment: quantity }
          break
        case ServiceType.OUT:
          calculationType = { decrement: quantity }
          break
        default:
          break
      }

      acc.push(
        prisma.good.update({
          where: { id: goodId },
          data: { currentQuantity: calculationType },
        })
      )

      return acc
    }, [] as PrismaPromise<any>[])

    // 5. Combine all transactions (service update + goods updates)
    const allTransactions = [...transactions, ...goodsUpdates]

    // Run all transactions in a batch
    const [service] = await prisma.$transaction(allTransactions)

    // Revalidate the path after update
    revalidatePath(`/consolidators/${consolidatorId}`)
    revalidatePath(`/services/${serviceId}`)
    return { data: service }
  } catch (error: any) {
    console.error(error.message)
    return {
      error: error.message || 'Gagal merubah jasa',
    }
  }
}

export const updateService = createSafeAction(ServiceSchema, handler)
