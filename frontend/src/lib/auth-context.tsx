import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Usuario } from "@/lib/types";
import { login as loginSvc, me as meSvc } from "@/services/auth.service";

interface AuthContextValue {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Usuario>;
  logout: () => void;
}

const Ctx = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("rappi_token") : null;
    if (!token) {
      setLoading(false);
      return;
    }
    meSvc(token)
      .then(setUser)
      .catch(() => localStorage.removeItem("rappi_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await loginSvc(email, password);
    localStorage.setItem("rappi_token", token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("rappi_token");
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth fuera de AuthProvider");
  return v;
}
