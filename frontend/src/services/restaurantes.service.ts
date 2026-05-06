import { db, newId, sleep } from "./mocks/db";
import type { Restaurante } from "@/lib/types";

export interface RestauranteFiltros {
  q?: string;
  categoria?: string;
  codigo_postal?: string;
}

export async function listarRestaurantes(f: RestauranteFiltros = {}): Promise<Restaurante[]> {
  await sleep();
  let out = [...db.restaurantes];
  if (f.q) {
    const q = f.q.toLowerCase();
    out = out.filter((r) => r.nombre.toLowerCase().includes(q));
  }
  if (f.categoria) out = out.filter((r) => r.categoria === f.categoria);
  if (f.codigo_postal) {
    const cp = f.codigo_postal;
    const ids = new Set(db.zonas.filter((z) => z.codigo_postal === cp).map((z) => z.restaurante_id));
    out = out.filter((r) => ids.has(r.id));
  }
  out.sort((a, b) => b.calificacion_promedio - a.calificacion_promedio);
  return out;
}

export async function getRestaurante(id: string): Promise<Restaurante | undefined> {
  await sleep();
  return db.restaurantes.find((r) => r.id === id);
}

export async function crearRestaurante(data: Omit<Restaurante, "id" | "calificacion_promedio">): Promise<Restaurante> {
  await sleep();
  const r: Restaurante = { ...data, id: newId("rest"), calificacion_promedio: 0 };
  db.restaurantes.push(r);
  return r;
}

export async function actualizarRestaurante(id: string, data: Partial<Restaurante>): Promise<Restaurante> {
  await sleep();
  const r = db.restaurantes.find((x) => x.id === id);
  if (!r) throw new Error("No encontrado");
  Object.assign(r, data);
  return r;
}

export async function topRestaurantes(): Promise<Array<Restaurante & { pedidos_entregados: number }>> {
  await sleep();
  const counts = new Map<string, number>();
  for (const p of db.pedidos) {
    if (p.estado === "entregado") counts.set(p.restaurante_id, (counts.get(p.restaurante_id) ?? 0) + 1);
  }
  return db.restaurantes
    .map((r) => ({ ...r, pedidos_entregados: counts.get(r.id) ?? 0 }))
    .sort((a, b) => b.pedidos_entregados - a.pedidos_entregados)
    .slice(0, 5);
}

export async function reporteRestaurante(id: string, desde?: string, hasta?: string) {
  await sleep();
  const d = desde ? new Date(desde).getTime() : -Infinity;
  const h = hasta ? new Date(hasta).getTime() : Infinity;
  const pedidos = db.pedidos.filter(
    (p) => p.restaurante_id === id && p.estado === "entregado" && new Date(p.fecha).getTime() >= d && new Date(p.fecha).getTime() <= h
  );
  const facturacion = pedidos.reduce((s, p) => s + p.total, 0);
  const cantidad = pedidos.length;
  const ticket_promedio = cantidad ? facturacion / cantidad : 0;
  // top 5 platos en el rango
  const counts = new Map<string, { cantidad: number; nombre: string }>();
  for (const p of pedidos) {
    for (const it of p.items) {
      const cur = counts.get(it.plato_id) ?? { cantidad: 0, nombre: it.nombre };
      cur.cantidad += it.cantidad;
      counts.set(it.plato_id, cur);
    }
  }
  const top = [...counts.entries()]
    .map(([plato_id, v]) => ({ plato_id, ...v }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);
  return { cantidad, facturacion, ticket_promedio, top_platos: top };
}
