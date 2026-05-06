import { db, sleep } from "./mocks/db";
import type { Usuario } from "@/lib/types";
import { USE_MOCKS, apiFetch } from "./api-client";

export interface LoginResponse {
  token: string;
  user: Usuario;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  if (!USE_MOCKS) return apiFetch<LoginResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  await sleep();
  const user = db.usuarios.find((u) => u.email === email);
  if (!user || db.passwords[email] !== password) throw new Error("Credenciales inválidas");
  return { token: `mock-${user.id}`, user };
}

export async function me(token: string): Promise<Usuario> {
  if (!USE_MOCKS) return apiFetch<Usuario>("/auth/me");
  await sleep();
  const id = token.replace("mock-", "");
  const user = db.usuarios.find((u) => u.id === id);
  if (!user) throw new Error("Sesión inválida");
  return user;
}
