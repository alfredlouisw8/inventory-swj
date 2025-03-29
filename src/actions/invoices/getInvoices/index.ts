import prisma from '@/lib/prisma'

export default async function getInvoices(consolidatorId?: string | undefined) {
  if (!consolidatorId) {
    const response = await prisma.invoice.findMany({
      include: {
        consolidator: true,
      },
    })

    return response
  }

  const response = await prisma.invoice.findMany({
    where: {
      consolidatorId,
    },
  })

  return response
}
