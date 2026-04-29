import { prisma } from "../../core/database/prisma.js";
import { DeliverySlotStatus, AppointmentStatus, Role } from "@prisma/client";

export class AppointmentService {
  async create(data: {
    deliverySlotIds: string[];
    supplierId: string;
    createdById: string;
    merchandise: string;
    orderNumber?: string;
    totalValue?: number;
    notes?: string;
  }) {
    const slots = await prisma.deliverySlot.findMany({
      where: { id: { in: data.deliverySlotIds } },
      include: { bay: { select: { storeId: true } } },
    });

    if (
      slots.length !== data.deliverySlotIds.length ||
      slots.some((s) => s.status !== DeliverySlotStatus.AVAILABLE)
    ) {
      const error = new Error("One or more slots are unavailable");
      (error as any).statusCode = 400;
      throw error;
    }

    const storeId = slots[0].bay.storeId;

    return prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.create({
        data: {
          supplierId: data.supplierId,
          createdById: data.createdById,
          storeId: storeId,
          merchandise: data.merchandise,
          orderNumber: data.orderNumber,
          totalValue: data.totalValue,
          notes: data.notes,
          status: AppointmentStatus.PENDING,
          deliverySlots: {
            connect: data.deliverySlotIds.map((id) => ({ id })),
          },
        },
      });

      await tx.deliverySlot.updateMany({
        where: { id: { in: data.deliverySlotIds } },
        data: {
          usedCapacity: { increment: 1 },
          status: DeliverySlotStatus.RESERVED,
        },
      });

      await tx.appointmentHistory.create({
        data: {
          appointmentId: appointment.id,
          status: AppointmentStatus.PENDING,
          changedById: data.createdById,
          reason: "Multiple slot reservation under review",
        },
      });

      return appointment;
    });
  }

  async findAll(
    user: { id: string; role: Role },
    filters: {
      storeId?: string;
      status?: AppointmentStatus;
      includeDeleted?: boolean;
    },
  ) {
    const isInternal =
      user.role === Role.ADMIN ||
      user.role === Role.ANALYST ||
      user.role === Role.CHECKER;

    let where: any = {};
    if (filters.storeId) where.storeId = filters.storeId;
    if (filters.status) where.status = filters.status;

    if (isInternal) {
      if (
        filters.status !== AppointmentStatus.CANCELLED &&
        !filters.includeDeleted
      ) {
        where.deletedAt = null;
      }
    } else {
      const supplierVisibility = {
        OR: [
          { supplierId: user.id },
          { createdById: user.id },
          {
            deletedAt: null,
            status: {
              notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.REJECTED],
            },
          },
        ],
      };

      where = {
        AND: [where, supplierVisibility],
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        supplier: { select: { name: true } },
        store: { select: { name: true } },
        deliverySlots: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (isInternal) {
      return appointments;
    }

    return appointments.map((app) => {
      const isOwner = app.supplierId === user.id || app.createdById === user.id;

      if (isOwner) {
        return {
          ...app,
          statusLabel:
            app.status === AppointmentStatus.PENDING
              ? "Under review"
              : app.status,
        };
      }

      const isTechnicalBlock =
        (app.status as any) === "MAINTENANCE" ||
        app.deliverySlots.some(
          (slot) =>
            slot.status === DeliverySlotStatus.MAINTENANCE ||
            slot.status === DeliverySlotStatus.BLOCKED,
        );

      return {
        id: app.id,
        deliverySlots: app.deliverySlots.map((slot) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
        status: isTechnicalBlock ? "BLOCKED" : "RESERVED",
        statusLabel: isTechnicalBlock ? "Blocked (Maintenance)" : "Reserved",
      };
    });
  }

  async findById(id: string) {
    return prisma.appointment.findFirst({
      where: { id, deletedAt: null },
      include: {
        deliverySlots: true,
        history: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  async findMyAppointments(userId: string) {
    return prisma.appointment.findMany({
      where: {
        OR: [{ supplierId: userId }, { createdById: userId }],
      },
      include: { store: { select: { name: true } }, deliverySlots: true },
    });
  }

  async approve(id: string, userId: string) {
    const appointment = await this.findById(id);
    if (!appointment) throw new Error("Not found");

    return prisma.$transaction(async (tx) => {
      const updated = await tx.appointment.update({
        where: { id },
        data: { status: AppointmentStatus.SCHEDULED },
      });

      await tx.appointmentHistory.create({
        data: {
          appointmentId: id,
          status: AppointmentStatus.SCHEDULED,
          previousStatus: AppointmentStatus.PENDING,
          changedById: userId,
          reason: "Approved internally",
        },
      });

      return updated;
    });
  }

  async update(
    id: string,
    userId: string,
    data: {
      merchandise?: string;
      notes?: string;
      status?: AppointmentStatus;
      statusReason?: string;
      orderNumber?: string;
      totalValue?: number;
    },
  ) {
    const appointment = await this.findById(id);
    if (!appointment) throw new Error("Not found");

    return prisma.$transaction(async (tx) => {
      const updated = await tx.appointment.update({
        where: { id },
        data: {
          merchandise: data.merchandise,
          notes: data.notes,
          status: data.status,
          statusReason: data.statusReason,
          orderNumber: data.orderNumber,
          totalValue: data.totalValue,
        },
      });

      if (
        data.status === AppointmentStatus.CANCELLED ||
        data.status === AppointmentStatus.REJECTED
      ) {
        await this.releaseSlotsCapacity(tx, id);
      }

      await tx.appointmentHistory.create({
        data: {
          appointmentId: id,
          status: data.status || appointment.status,
          previousStatus: appointment.status,
          changedById: userId,
          reason: data.statusReason || "Data or status update",
        },
      });

      return updated;
    });
  }

  async delete(id: string, userId: string, reason?: string) {
    const appointment = await this.findById(id);
    if (!appointment) throw new Error("Not found");

    return prisma.$transaction(async (tx) => {
      await tx.appointment.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          status: AppointmentStatus.CANCELLED,
          statusReason: reason,
        },
      });

      await this.releaseSlotsCapacity(tx, id);

      await tx.appointmentHistory.create({
        data: {
          appointmentId: id,
          status: AppointmentStatus.CANCELLED,
          previousStatus: appointment.status,
          changedById: userId,
          reason: reason || "Logical deletion of appointment",
        },
      });
    });
  }

  private async releaseSlotsCapacity(tx: any, appointmentId: string) {
    const appointment = await tx.appointment.findUnique({
      where: { id: appointmentId },
      include: { deliverySlots: true },
    });

    if (appointment && appointment.deliverySlots.length > 0) {
      const slotIds = appointment.deliverySlots.map((s: any) => s.id);
      await tx.deliverySlot.updateMany({
        where: { id: { in: slotIds } },
        data: {
          usedCapacity: { decrement: 1 },
          status: DeliverySlotStatus.AVAILABLE,
        },
      });
    }
  }
}
