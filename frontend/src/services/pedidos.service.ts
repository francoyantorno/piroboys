import { db, newId, sleep } from "./mocks/db";
import type { Pedido, PedidoItem } from "@/lib/types";
import { puedeTransicionar, ESTADOS_FINALES } from "@/lib/estado-pedido";

export interface CrearPedidoInput {
  cliente_id: string;
  restaurante_id: string;
  items: Array<{ plato_id: string; cantidad: number }>;
  direccion_entrega: string;
  codigo_postal: string;
  cupon_codigo?: string;
}

export async function crearPedido(input: CrearPedidoInput): Promise<Pedido> {
  await sleep();
  if (!input.items.length) throw new Error("El pedido no puede estar vacío");
  // validar zona
  const zonas = db.zonas.filter((z) => z.restaurante_id === input.restaurante_id);
  if (!zonas.some((z) => z.codigo_postal === input.codigo_postal)) {
    throw new Error("La dirección está fuera de la zona de cobertura del restaurante");
  }
  const items: PedidoItem[] = [];
  for (const it of input.items) {
    if (it.cantidad <= 0) throw new Error("La cantidad debe ser mayor a 0");
    const plato = db.platos.find((p) => p.id === it.plato_id);
    if (!plato) throw new Error("Plato inexistente");
    if (plato.restaurante_id !== input.restaurante_id) throw new Error("Todos los platos deben ser del mismo restaurante");
    if (!plato.disponible) throw new Error(`El plato "${plato.nombre}" no está disponible`);
    items.push({ plato_id: plato.id, nombre: plato.nombre, cantidad: it.cantidad, precio_unitario: plato.precio });
  }
  const subtotal = items.reduce((s, it) => s + it.cantidad * it.precio_unitario, 0);
  let descuento = 0;
  let cupon_codigo: string | undefined;
  if (input.cupon_codigo) {
    const cup = db.cupones.find((c) => c.codigo === input.cupon_codigo);
    if (!cup) throw new Error("Cupón inexistente");
    if (new Date(cup.vencimiento) < new Date()) throw new Error("Cupón vencido");
    if (cup.usos_actuales >= cup.usos_maximos) throw new Error("Cupón sin usos disponibles");
    descuento = (subtotal * cup.porcentaje) / 100;
    cupon_codigo = cup.codigo;
  }
  const pedido: Pedido = {
    id: newId("ped"),
    cliente_id: input.cliente_id,
    restaurante_id: input.restaurante_id,
    repartidor_id: null,
    fecha: new Date().toISOString(),
    estado: "pendiente",
    items,
    subtotal,
    descuento,
    total: subtotal - descuento,
    direccion_entrega: input.direccion_entrega,
    codigo_postal: input.codigo_postal,
    cupon_codigo,
    calificado: false,
  };
  db.pedidos.push(pedido);
  pushNotif(pedido, "pendiente");
  return pedido;
}

function pushNotif(p: Pedido, estado: Pedido["estado"]) {
  db.notificaciones.push({
    id: newId("n"),
    pedido_id: p.id,
    cliente_id: p.cliente_id,
    estado_nuevo: estado,
    fecha: new Date().toISOString(),
    leida: false,
  });
}

export async function getPedido(id: string): Promise<Pedido | undefined> {
  await sleep();
  return db.pedidos.find((p) => p.id === id);
}

export async function pedidosCliente(cliente_id: string, estado?: string): Promise<Pedido[]> {
  await sleep();
  let out = db.pedidos.filter((p) => p.cliente_id === cliente_id);
  if (estado) out = out.filter((p) => p.estado === estado);
  return out.sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha));
}

export async function pedidosRepartidor(repartidor_id: string): Promise<Pedido[]> {
  await sleep();
  return db.pedidos
    .filter((p) => p.repartidor_id === repartidor_id)
    .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha));
}

export async function pedidosTodos(): Promise<Pedido[]> {
  await sleep();
  return [...db.pedidos].sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha));
}

export async function asignarRepartidor(pedido_id: string): Promise<Pedido> {
  await sleep();
  const p = db.pedidos.find((x) => x.id === pedido_id);
  if (!p) throw new Error("Pedido no encontrado");
  if (ESTADOS_FINALES.includes(p.estado)) throw new Error("Pedido finalizado");
  const r = db.repartidores.find((r) => r.disponible);
  if (!r) {
    p.estado = "sin_repartidor";
    pushNotif(p, p.estado);
    return p;
  }
  p.repartidor_id = r.id;
  r.disponible = false;
  if (p.estado === "pendiente" || p.estado === "sin_repartidor") {
    p.estado = "confirmado";
    pushNotif(p, p.estado);
    if (p.cupon_codigo) {
      const cup = db.cupones.find((c) => c.codigo === p.cupon_codigo);
      if (cup) cup.usos_actuales += 1;
    }
  }
  return p;
}

export async function cambiarEstado(pedido_id: string, nuevo: Pedido["estado"]): Promise<Pedido> {
  await sleep();
  const p = db.pedidos.find((x) => x.id === pedido_id);
  if (!p) throw new Error("Pedido no encontrado");
  if (ESTADOS_FINALES.includes(p.estado)) throw new Error("Pedido finalizado, no se puede modificar");
  if (!puedeTransicionar(p.estado, nuevo)) throw new Error(`Transición inválida: ${p.estado} → ${nuevo}`);
  p.estado = nuevo;
  if (nuevo === "entregado" && p.repartidor_id) {
    const r = db.repartidores.find((x) => x.id === p.repartidor_id);
    if (r) r.disponible = true;
  }
  if (nuevo === "cancelado" && p.repartidor_id) {
    const r = db.repartidores.find((x) => x.id === p.repartidor_id);
    if (r) r.disponible = true;
  }
  pushNotif(p, nuevo);
  return p;
}

export async function calificarPedido(pedido_id: string, puntaje: number, comentario: string) {
  await sleep();
  const p = db.pedidos.find((x) => x.id === pedido_id);
  if (!p) throw new Error("Pedido no encontrado");
  if (p.estado !== "entregado") throw new Error("Solo se puede calificar pedidos entregados");
  if (p.calificado) throw new Error("El pedido ya fue calificado");
  if (puntaje < 1 || puntaje > 5) throw new Error("Puntaje debe ser de 1 a 5");
  db.calificaciones.push({
    id: newId("cal"),
    pedido_id,
    puntaje,
    comentario,
    fecha: new Date().toISOString(),
  });
  p.calificado = true;
  // recalcular promedio del restaurante
  const cals = db.calificaciones.filter((c) => {
    const ped = db.pedidos.find((pp) => pp.id === c.pedido_id);
    return ped?.restaurante_id === p.restaurante_id;
  });
  const rest = db.restaurantes.find((r) => r.id === p.restaurante_id);
  if (rest && cals.length) {
    rest.calificacion_promedio = +(cals.reduce((s, c) => s + c.puntaje, 0) / cals.length).toFixed(2);
  }
  return p;
}
