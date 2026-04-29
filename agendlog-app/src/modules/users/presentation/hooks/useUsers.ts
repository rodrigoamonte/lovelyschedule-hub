// src/modules/users/presentation/hooks/useUsers.ts
import { useState, useEffect, useCallback } from "react";
import { User, UserRole } from "@/modules/auth/core/entities/User";
import { UserRepository } from "@/modules/users/data/repositories/UserRepository";

const repo = new UserRepository();

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [userData, rolesData] = await Promise.all([
        repo.getAll(),
        repo.getRoles(),
      ]);
      setUsers(userData);
      setRoles(rolesData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    users,
    roles,
    isLoading,
    createUser: async (data: any) => {
      await repo.create(data);
      loadData();
    },
    updateUser: async (id: string, data: any) => {
      await repo.update(id, data);
      loadData();
    },
    deleteUser: async (id: string) => {
      await repo.delete(id);
      loadData();
    },
  };
}
