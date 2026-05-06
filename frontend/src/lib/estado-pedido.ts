import type { EstadoPedido } from "./types";

export const TRANSICIONES: Record<EstadoPedido, EstadoPedido[]> = {
  pendiente: ["confirmado", "cancelado"],
  confirmado: ["en_preparacion", "cancelado"],
  en_preparacion: ["en_camino", "cancelado"],
  en_camino: ["entregado"],
  entregado: [],
  cancelado: [],
  sin_repartidor: ["confirmado", "cancelado"],
};

export const ESTADOS_FINALES: EstadoPedido[] = ["entregado", "cancelado"];

export function puedeTransicionar(de: EstadoPedido, a: EstadoPedido) {
  return TRANSICIONES[de]?.includes(a) ?? false;
}

export const ESTADO_LABEL: Record<EstadoPedido, string> = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  en_preparacion: "En preparación",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
  sin_repartidor: "Sin repartidor",
};

export const ESTADO_COLOR: Record<EstadoPedido, string> = {
  pendiente: "bg-muted text-foreground",
  confirmado: "bg-accent text-accent-foreground",
  en_preparacion: "bg-warning/20 text-warning-foreground",
  en_camino: "bg-primary/15 text-primary",
  entregado: "bg-success/20 text-success",
  cancelado: "bg-destructive/15 text-destructive",
  sin_repartidor: "bg-destructive/15 text-destructive",
};
