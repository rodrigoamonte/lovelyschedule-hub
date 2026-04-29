// src/modules/auth/data/repositories/AuthRepository.ts
import api from "@/shared/lib/api";
import { User } from "../../core/entities/User";

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export class AuthRepository {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  }
}
