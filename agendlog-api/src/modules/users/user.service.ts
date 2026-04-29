import bcrypt from "bcrypt";
import { prisma } from "../../core/database/prisma.js";

export class UserService {
  async findAll() {
    return prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        companyId: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
  }

  
  async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  async create(data: any) {
    const existingUser = await this.findByEmail(data.email);

    if (existingUser) {
      const error = new Error("E-mail já está em uso por um usuário ativo");
      (error as any).statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
  }

  async update(id: string, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const user = await this.findById(id);
    if (!user) throw new Error("User not found");

    return prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: "INACTIVE",
        email: `del_${Date.now()}_${user.email}`,
      },
    });
  }
}
