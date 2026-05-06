import { db, newId, sleep } from "./mocks/db";
import type { Cliente, Repartidor } from "@/lib/types";

export async function listarClientes(): Promise<Cliente[]> {
  await sleep();
  return [...db.clientes];
}
export async function crearCliente(data: Omit<Cliente, "id">): Promise<Cliente> {
  await sleep();
  if (db.clientes.some((c) => c.email === data.email)) throw new Error("Email ya registrado");
  const c: Cliente = { ...data, id: newId("c") };
  db.clientes.push(c);
  return c;
}

export async function listarRepartidores(): Promise<Repartidor[]> {
  await sleep();
  return [...db.repartidores];
}
export async function repartidoresDisponibles(): Promise<Repartidor[]> {
  await sleep();
  return db.repartidores.filter((r) => r.disponible);
}
export async function crearRepartidor(data: Omit<Repartidor, "id">): Promise<Repartidor> {
  await sleep();
  const r: Repartidor = { ...data, id: newId("r") };
  db.repartidores.push(r);
  return r;
}
export async function toggleDisponibleRepartidor(id: string, disponible: boolean) {
  await sleep();
  const r = db.repartidores.find((x) => x.id === id);
  if (!r) throw new Error("No encontrado");
  r.disponible = disponible;
  return r;
}
