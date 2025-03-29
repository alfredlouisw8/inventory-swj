import prisma from '@/lib/prisma'
import { LogAction, LogObject } from '@prisma/client'

function logObjectText(object: LogObject) {
  switch (object) {
    case LogObject.Consolidator:
      return 'consolidator'
    case LogObject.Good:
      return 'barang'
    case LogObject.Service:
      return 'jasa'
    case LogObject.Invoice:
      return 'invoice'
    default:
      return 'unknown'
  }
}

function logActionText(action: LogAction) {
  switch (action) {
    case LogAction.Create:
      return 'menambah'
    case LogAction.Update:
      return 'merubah'
    case LogAction.Delete:
      return 'menghapus'
    default:
      return 'unknown'
  }
}

export function generateLogMessage(
  userName: string,
  action: LogAction,
  object: LogObject,
  objectName: string,
  consolidatorName: string,
  isConsolidator = false
) {
  if (isConsolidator) {
    return `User ${userName} ${logActionText(action)} ${logObjectText(
      object
    )} ${consolidatorName}`
  }

  return `User ${userName} ${logActionText(action)} ${logObjectText(
    object
  )} ${objectName} untuk consolidator ${consolidatorName}`
}

export async function createLogEntry(
  userId: string,
  action: LogAction,
  object: LogObject,
  consolidatorId: string,
  details: string
) {
  return await prisma.log.create({
    data: {
      userId,
      action,
      object,
      consolidatorId,
      details,
    },
  })
}

export function createLogEntrySync(
  userId: string,
  action: LogAction,
  object: LogObject,
  consolidatorId: string,
  details: string
) {
  return prisma.log.create({
    data: {
      userId,
      action,
      object,
      consolidatorId,
      details,
    },
  })
}
