import { prisma } from "../../core/database/prisma.js";

export class BayService {
  async findAll(storeId?: string) {
    return prisma.bay.findMany({
      where: {
        deletedAt: null,
        ...(storeId && { storeId }),
      },
      include: { store: { select: { name: true } } },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.bay.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(data: {
    name: string;
    code: string;
    storeId: string;
    location?: string;
  }) {
    const storeExists = await prisma.store.findUnique({
      where: { id: data.storeId },
    });
    if (!storeExists) {
      const error = new Error("Loja vinculada não encontrada");
      (error as any).statusCode = 404;
      throw error;
    }

    const existing = await prisma.bay.findFirst({
      where: { code: data.code, deletedAt: null },
    });

    if (existing) {
      const error = new Error("Código de doca já em uso");
      (error as any).statusCode = 400;
      throw error;
    }

    return prisma.bay.create({ data });
  }
  async update(id: string, data: any) {
    const bay = await this.findById(id);
    if (!bay) {
      const error = new Error("Bay not found");
      (error as any).statusCode = 404;
      throw error;
    }

    return prisma.bay.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const bay = await this.findById(id);
    if (!bay) {
      const error = new Error("Bay not found");
      (error as any).statusCode = 404;
      throw error;
    }

    return prisma.bay.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        active: false,
        code: `${bay.code}_del_${Date.now()}`,
      },
    });
  }
}
