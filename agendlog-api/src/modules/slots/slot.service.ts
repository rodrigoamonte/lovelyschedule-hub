import { prisma } from "../../core/database/prisma.js";

export class SlotService {
  async findAll(filters: { bayId?: string; date?: string; storeId?: string }) {
    const where: any = { deletedAt: null };

    if (filters.date) {
      where.startTime = {
        gte: new Date(`${filters.date}T00:00:00.000Z`),
        lte: new Date(`${filters.date}T23:59:59.999Z`),
      };
    }

    if (filters.storeId) {
      const store = await prisma.store.findUnique({
        where: { id: filters.storeId },
        select: { id: true },
      });

      if (!store) {
        const error = new Error("Store not found");
        (error as any).statusCode = 404;
        throw error;
      }

      const bays = await prisma.bay.findMany({
        where: { storeId: filters.storeId, deletedAt: null },
        select: { id: true },
      });

      if (bays.length === 0) return [];

      const bayIds = bays.map((b) => b.id);
      where.bayId = { in: bayIds };
    }

    if (filters.bayId) {
      where.bayId = filters.bayId;
    }

    return prisma.deliverySlot.findMany({
      where,
      include: {
        bay: {
          select: {
            name: true,
            code: true,
            store: { select: { name: true } },
          },
        },
      },
      orderBy: { startTime: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.deliverySlot.findFirst({
      where: { id, deletedAt: null },
      include: { bay: true },
    });
  }

  async create(data: {
    bayId: string;
    startTime: Date;
    endTime: Date;
    maxCapacity?: number;
  }) {
    if (data.startTime >= data.endTime) {
      const error = new Error("Start time must be before end time");
      (error as any).statusCode = 400;
      throw error;
    }

    const existingSlot = await prisma.deliverySlot.findFirst({
      where: {
        bayId: data.bayId,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });

    if (existingSlot) {
      if (!existingSlot.deletedAt) {
        const error = new Error(
          "An active slot already exists for this time in this bay.",
        );
        (error as any).statusCode = 400;
        throw error;
      }

      return prisma.deliverySlot.update({
        where: { id: existingSlot.id },
        data: {
          deletedAt: null,
          maxCapacity: data.maxCapacity || 1,
          status: "AVAILABLE",
        },
      });
    }

    return prisma.deliverySlot.create({
      data: { ...data, status: "AVAILABLE" },
    });
  }

  async delete(id: string) {
    const slot = await this.findById(id);
    if (!slot) {
      const error = new Error("Slot not found");
      (error as any).statusCode = 404;
      throw error;
    }

    return prisma.deliverySlot.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async deleteSlotsByDate(storeId: string, date: string) {
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);

    const bays = await prisma.bay.findMany({ where: { storeId } });
    const bayIds = bays.map((b) => b.id);

    return prisma.deliverySlot.updateMany({
      where: {
        bayId: { in: bayIds },
        startTime: { gte: start },
        endTime: { lte: end },
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }
}
