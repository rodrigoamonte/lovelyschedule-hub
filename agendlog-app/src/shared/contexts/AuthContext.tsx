// src/shared/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/modules/auth/core/entities/User";
import { AuthRepository } from "@/modules/auth/data/repositories/AuthRepository";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const authRepo = new AuthRepository();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("@agendlog:user") ||
      sessionStorage.getItem("@agendlog:user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, remember: boolean) => {
    setIsLoading(true);
    try {
      const data = await authRepo.login(email, password);

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("@agendlog:accessToken", data.accessToken);
      storage.setItem("@agendlog:refreshToken", data.refreshToken);
      storage.setItem("@agendlog:user", JSON.stringify(data.user));

      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
