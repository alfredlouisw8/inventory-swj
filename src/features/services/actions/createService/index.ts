'use server'

import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { PrismaPromise, ServiceType } from '@prisma/client'
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
    NPEDate,
    PEBNumber,
    NPENumber,
    PEBDate,
    containerNumber,
    containerSize,
    date,
    remarks,
    consolidatorId,
    goods,
  } = data

  try {
    // Create the service and related goods
    const servicePromise = prisma.service.create({
      data: {
        serviceType: serviceType as ServiceType,
        date,
        remarks,
        consolidatorId,
        truckNumber,
        containerNumber,
        PEBNumber,
        PEBDate,
        NPENumber,
        NPEDate,
        containerSize,
        serviceGoods: {
          create: goods.map(({ goodId, quantity }) => ({
            goodId,
            quantity,
          })),
        },
      },
    })

    // Create an array of Prisma promises for goods updates
    const goodsUpdates = goods.reduce((acc, { quantity, goodId }) => {
      let calculationType = {}

      // Handle Add and Subtract calculation types
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

      // Push the Prisma promise for updating goods to the accumulator
      acc.push(
        prisma.good.update({
          where: { id: goodId },
          data: { currentQuantity: calculationType },
        })
      )

      return acc
    }, [] as PrismaPromise<any>[])

    // Execute the transaction with the service creation and goods updates
    const [service] = await prisma.$transaction([
      servicePromise,
      ...goodsUpdates,
    ])

    // Revalidate the cache after successful operations
    revalidatePath(`/consolidators/${consolidatorId}`)
    return { data: service }
  } catch (error: any) {
    console.error(error.message)
    return {
      error: error.message || 'Gagal menambah jasa',
    }
  }
}

export const createService = createSafeAction(ServiceSchema, handler)
