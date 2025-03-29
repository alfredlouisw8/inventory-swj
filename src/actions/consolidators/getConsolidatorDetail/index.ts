import prisma from '@/lib/prisma'

export default async function getConsolidatorDetail(consolidatorId: string) {
  const response = await prisma.consolidator.findUnique({
    where: {
      id: consolidatorId,
    },
    include: {
      services: {
        include: {
          serviceGoods: true,
        },
      },
      goods: true,
    },
  })

  return response
}
