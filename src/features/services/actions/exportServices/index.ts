'use server'

import { serviceTypeText } from '@/utils/functions'
import { format } from 'date-fns'

import prisma from '@/lib/prisma'
import { formatInTimeZone } from 'date-fns-tz'
import { TIMEZONE } from '@/utils/const'

export async function exportServicesData(consolidatorId: string) {
  let data: any[] = []

  try {
    const consolidator = await prisma.consolidator.findUnique({
      where: {
        id: consolidatorId,
      },
    })
    const result = await prisma.serviceGood.findMany({
      where: {
        consolidatorId,
      },
      include: {
        good: true,
        service: true,
      },
    })

    data = result.map((item) => ({
      nama_consolidator: consolidator?.name,
      kode_jasa: item.service.serviceCode,
      tanggal_pengerjaan: formatInTimeZone(
        item.service.date,
        TIMEZONE,
        'dd-MM-yyyy'
      ),
      tipe_jasa: serviceTypeText(item.service.serviceType),
      no_container: item.containerNumber,
      no_truck: item.truckNumber,
      nama_barang: item.good.name,
      spek_barang: item.good.specification,
      packing_barang: item.good.packing,
      jumlah: item.goodCount,
      keterangan: item.service.remarks,
    }))
  } catch (error: any) {
    console.error(error)
  }

  return data
}
