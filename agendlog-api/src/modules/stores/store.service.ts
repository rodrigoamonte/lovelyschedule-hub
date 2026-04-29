import { prisma } from "../../core/database/prisma.js";

export class StoreService {
  async findAll() {
    return prisma.store.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.store.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByCode(code: string) {
    return prisma.store.findFirst({
      where: { code, deletedAt: null },
    });
  }

  async create(data: {
    name: string;
    code: string;
    address: string;
    active?: boolean;
  }) {
    return prisma.store.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return prisma.store.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const store = await this.findById(id);

    if (!store) {
      throw new Error("Store not found");
    }

    return prisma.store.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        code: `${store.code}-deleted-${Date.now()}`,
      },
    });
  }
}
