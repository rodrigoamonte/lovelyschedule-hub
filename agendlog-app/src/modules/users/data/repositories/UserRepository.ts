import api from "@/shared/lib/api";
import { User, UserRole } from "@/modules/auth/core/entities/User";

export class UserRepository {
  async getAll() {
    const { data } = await api.get<User[]>("/users");
    return data;
  }

  async getRoles() {
    const { data } = await api.get<UserRole[]>("/users/roles");
    return data;
  }

  async create(payload: any) {
    const { data } = await api.post<User>("/users", payload);
    return data;
  }

  async update(id: string, payload: any) {
    await api.patch(`/users/${id}`, payload);
  }

  async delete(id: string) {
    await api.delete(`/users/${id}`);
  }
}
