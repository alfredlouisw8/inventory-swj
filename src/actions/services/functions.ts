import { PrismaPromise, ServiceGood, ServiceType } from '@prisma/client'
import prisma from '@/lib/prisma'

// Function to revert inventory changes
export const revertInventoryChanges = (
  serviceType: ServiceType,
  serviceGoods: ServiceGood[]
): PrismaPromise<any>[] => {
  const transactions: PrismaPromise<any>[] = []

  serviceGoods.forEach(({ goodId, quantity }) => {
    let revertCalculationType = {}

    // Handle Add and Substract calculation types
    switch (serviceType) {
      case ServiceType.IN:
        revertCalculationType = { decrement: quantity }
        break
      case ServiceType.OUT:
        revertCalculationType = { increment: quantity }
        break
      default:
        break
    }

    // Push the update transaction to revert inventory changes
    transactions.push(
      prisma.good.update({
        where: { id: goodId },
        data: {
          currentQuantity: revertCalculationType,
        },
      })
    )
  })

  return transactions
}
