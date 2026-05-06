// Cliente HTTP. Cuando VITE_USE_MOCKS=true (default), los services usan mocks.
// Para apuntar a tu API: setear VITE_USE_MOCKS=false y VITE_API_URL en .env

const BASE = import.meta.env.VITE_API_URL ?? "";
export const USE_MOCKS = (import.meta.env.VITE_USE_MOCKS ?? "true") !== "false";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("rappi_token");
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}
