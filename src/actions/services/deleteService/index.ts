'use server'

import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { InputType, ReturnType } from '../types'
import { ServiceSchema } from '../schema'
import { revertInventoryChanges } from '../functions'
import { PrismaPromise, Role } from '@prisma/client'

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth()

  if (!session?.user) {
    return {
      error: 'Silahkan login',
    }
  }

  if (session.user.role !== Role.SUPER_ADMIN) {
    return {
      error: 'Anda tidak punya akses',
    }
  }

  const { serviceId } = data

  try {
    // 1. Fetch the service and related serviceGoods
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { serviceGoods: true },
    })

    if (!service) {
      return { error: 'Service not found' }
    }

    const transactions: PrismaPromise<any>[] = []

    // 2. Revert the inventory calculation
    transactions.push(
      ...revertInventoryChanges(service.serviceType, service.serviceGoods)
    )

    // 3. Delete related ServiceGoods first
    transactions.push(
      prisma.serviceGood.deleteMany({
        where: { serviceId },
      })
    )

    // 3. Delete the service after reverting the inventory
    transactions.push(
      prisma.service.delete({
        where: {
          id: serviceId,
        },
      })
    )

    // 4. Execute all the transactions
    const [deletedService] = await prisma.$transaction(transactions)

    // Revalidate the path to update the client UI
    revalidatePath(`/consolidators/${deletedService.consolidatorId}`)
    return { data: deletedService }
  } catch (error: any) {
    console.error(error.message)
    return {
      error: error.message || 'Gagal menghapus jasa',
    }
  }
}

export const deleteService = createSafeAction(ServiceSchema, handler)
