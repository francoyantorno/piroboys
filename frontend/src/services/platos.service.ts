import { db, newId, sleep } from "./mocks/db";
import type { Plato } from "@/lib/types";

export async function platosPorRestaurante(restaurante_id: string, soloDisponibles = false): Promise<Plato[]> {
  await sleep();
  let out = db.platos.filter((p) => p.restaurante_id === restaurante_id);
  if (soloDisponibles) out = out.filter((p) => p.disponible);
  return out;
}

export async function crearPlato(data: Omit<Plato, "id">): Promise<Plato> {
  await sleep();
  if (data.precio <= 0) throw new Error("El precio debe ser mayor a 0");
  const p: Plato = { ...data, id: newId("p") };
  db.platos.push(p);
  return p;
}

export async function actualizarPlato(id: string, data: Partial<Plato>): Promise<Plato> {
  await sleep();
  const p = db.platos.find((x) => x.id === id);
  if (!p) throw new Error("No encontrado");
  if (data.precio !== undefined && data.precio <= 0) throw new Error("El precio debe ser mayor a 0");
  Object.assign(p, data);
  return p;
}

export async function topPlatos(): Promise<Array<Plato & { vendidos: number }>> {
  await sleep();
  const counts = new Map<string, number>();
  for (const p of db.pedidos) {
    if (p.estado !== "cancelado") {
      for (const it of p.items) counts.set(it.plato_id, (counts.get(it.plato_id) ?? 0) + it.cantidad);
    }
  }
  return db.platos
    .map((p) => ({ ...p, vendidos: counts.get(p.id) ?? 0 }))
    .sort((a, b) => b.vendidos - a.vendidos)
    .slice(0, 10);
}
