import prisma from '@/lib/prisma'

export async function createLogs({
  data,
  actionType,
}: {
  data: any
  actionType: string
}) {
  await prisma.log.create({
    data: {
      type: 'success',
      actionType,
      data: JSON.stringify(data),
    },
  })
}

export async function createErrorLogs({
  data,
  actionType,
  errorMessage = '',
}: {
  data: any
  actionType: string
  errorMessage: string
}) {
  await prisma.log.create({
    data: {
      type: 'error',
      data: JSON.stringify(data),
      actionType,
      errorMessage,
    },
  })
}
