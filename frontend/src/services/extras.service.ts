import { db, newId, sleep } from "./mocks/db";
import type { Cupon, Zona, Notificacion } from "@/lib/types";

export async function listarCupones(): Promise<Cupon[]> {
  await sleep();
  return [...db.cupones];
}
export async function crearCupon(data: Omit<Cupon, "id" | "usos_actuales">): Promise<Cupon> {
  await sleep();
  if (data.porcentaje < 1 || data.porcentaje > 100) throw new Error("Porcentaje fuera de rango");
  if (db.cupones.some((c) => c.codigo === data.codigo)) throw new Error("Código ya existe");
  const c: Cupon = { ...data, id: newId("cu"), usos_actuales: 0 };
  db.cupones.push(c);
  return c;
}
export async function validarCupon(codigo: string, subtotal: number) {
  await sleep(50);
  const c = db.cupones.find((x) => x.codigo === codigo);
  if (!c) throw new Error("Cupón inexistente");
  if (new Date(c.vencimiento) < new Date()) throw new Error("Cupón vencido");
  if (c.usos_actuales >= c.usos_maximos) throw new Error("Cupón sin usos disponibles");
  return { cupon: c, descuento: (subtotal * c.porcentaje) / 100 };
}

export async function zonasPorRestaurante(restaurante_id: string): Promise<Zona[]> {
  await sleep();
  return db.zonas.filter((z) => z.restaurante_id === restaurante_id);
}
export async function crearZona(data: Omit<Zona, "id">): Promise<Zona> {
  await sleep();
  const z: Zona = { ...data, id: newId("z") };
  db.zonas.push(z);
  return z;
}
export async function eliminarZona(id: string) {
  await sleep();
  const i = db.zonas.findIndex((z) => z.id === id);
  if (i >= 0) db.zonas.splice(i, 1);
}

export async function notificacionesCliente(cliente_id: string): Promise<Notificacion[]> {
  await sleep();
  return [...db.notificaciones]
    .filter((n) => n.cliente_id === cliente_id)
    .sort((a, b) => {
      if (a.leida !== b.leida) return a.leida ? 1 : -1;
      return +new Date(b.fecha) - +new Date(a.fecha);
    });
}
export async function marcarLeida(id: string) {
  await sleep();
  const n = db.notificaciones.find((x) => x.id === id);
  if (n) n.leida = true;
  return n;
}
