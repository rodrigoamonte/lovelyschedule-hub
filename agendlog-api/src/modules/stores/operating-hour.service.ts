import { prisma } from "../../core/database/prisma.js";
import { SlotService } from "../slots/slot.service.js";

const slotService = new SlotService();

export class OperatingHourService {
  async setOperatingHour(data: {
    storeId: string;
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
  }) {
    return prisma.storeOperatingHour.upsert({
      where: {
        storeId_dayOfWeek: { storeId: data.storeId, dayOfWeek: data.dayOfWeek },
      },
      update: data,
      create: data,
    });
  }

  async generateSlotsForDate(
    storeId: string,
    date: string,
    durationMinutes: number = 30,
    force: boolean = false,
  ) {
    if (force) {
      await slotService.deleteSlotsByDate(storeId, date);
    }

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getUTCDay();

    const config = await prisma.storeOperatingHour.findUnique({
      where: { storeId_dayOfWeek: { storeId, dayOfWeek } },
    });

    if (!config)
      throw new Error("Store does not open on this day of the week.");

    const bays = await prisma.bay.findMany({
      where: { storeId, active: true, deletedAt: null },
    });
    if (bays.length === 0) throw new Error("The store has no bays registered.");

    const [openH, openM] = config.openTime.split(":").map(Number);
    const [closeH, closeM] = config.closeTime.split(":").map(Number);

    const startTime = new Date(targetDate.setUTCHours(openH, openM, 0, 0));
    const endTime = new Date(targetDate.setUTCHours(closeH, closeM, 0, 0));

    const createdSlots = [];
    let current = new Date(startTime);

    while (current < endTime) {
      const nextSlot = new Date(current.getTime() + durationMinutes * 60000);

      if (nextSlot > endTime) break;

      for (const bay of bays) {
        const slot = await slotService.create({
          bayId: bay.id,
          startTime: new Date(current),
          endTime: new Date(nextSlot),
          maxCapacity: 1,
        });
        createdSlots.push(slot);
      }

      current = nextSlot;
    }

    return {
      message: `${createdSlots.length} slots of ${durationMinutes}min successfully generated.`,
    };
  }

  async deleteOperatingHour(storeId: string, dayOfWeek: number) {
    return prisma.storeOperatingHour.delete({
      where: {
        storeId_dayOfWeek: { storeId, dayOfWeek },
      },
    });
  }
}
