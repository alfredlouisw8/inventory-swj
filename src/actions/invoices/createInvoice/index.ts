'use server'

import { revalidatePath } from 'next/cache'

import { createSafeAction } from '@/lib/create-safe-action'

import { auth } from '@/lib/auth/auth'
import { InputType, ReturnType } from '../types'
import { InvoiceSchema } from '../schema'
import { createLogEntry, generateLogMessage } from '@/actions/logs/functions'
import { LogAction, LogObject } from '@prisma/client'
import prisma from '@/lib/prisma'

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth()

  if (!session?.user) {
    return {
      error: 'Silahkan login',
    }
  }

  const {
    invoiceCode,
    paymentDate,
    tax,
    serviceIds,
    remarks,
    consolidatorId,
    totalPrice,
    invoiceDate,
  } = data

  try {
    // Start a transaction to create an invoice and update services
    const [invoice] = await prisma.$transaction(async (prisma) => {
      // Create a new invoice
      const invoice = await prisma.invoice.create({
        data: {
          invoiceCode,
          paymentDate,
          invoiceDate,
          tax,
          remarks,
          consolidatorId,
          totalPrice,
        },
      })

      // Use the newly created invoice ID to update services
      const serviceUpdates = await Promise.all(
        serviceIds.map((serviceId) =>
          prisma.service.update({
            where: { id: serviceId },
            data: { invoiceId: invoice.id }, // Use the newly created invoice's ID here
          })
        )
      )

      const consolidator = await prisma.consolidator.findUnique({
        where: {
          id: consolidatorId,
        },
        select: {
          name: true,
        },
      })

      // Generate a log for this action
      const logMessage = generateLogMessage(
        session.user.name as string,
        LogAction.Create,
        LogObject.Invoice,
        invoice.invoiceCode,
        consolidator?.name as string
      )
      await createLogEntry(
        session.user.id as string,
        LogAction.Create,
        LogObject.Invoice,
        consolidatorId,
        logMessage
      )

      return [invoice, ...serviceUpdates]
    })

    // Revalidate the cache after successful operations
    revalidatePath(`/consolidators/${consolidatorId}`)
    return { data: invoice }
  } catch (error: any) {
    console.error(error.message)
    return {
      error: error.message || 'Failed to create service.',
    }
  }
}

export const createInvoice = createSafeAction(InvoiceSchema, handler)
