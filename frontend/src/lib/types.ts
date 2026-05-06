export type Rol = "admin" | "cliente" | "repartidor";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  // referencias opcionales según rol
  cliente_id?: string;
  repartidor_id?: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  direccion: string;
  telefono: string;
}

export interface Restaurante {
  id: string;
  nombre: string;
  categoria: string;
  direccion: string;
  calificacion_promedio: number;
  imagen?: string;
}

export interface Plato {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  disponible: boolean;
  restaurante_id: string;
  imagen?: string;
}

export interface Repartidor {
  id: string;
  nombre: string;
  vehiculo: string;
  disponible: boolean;
}

export type EstadoPedido =
  | "pendiente"
  | "confirmado"
  | "en_preparacion"
  | "en_camino"
  | "entregado"
  | "cancelado"
  | "sin_repartidor";

export interface PedidoItem {
  plato_id: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
}

export interface Pedido {
  id: string;
  cliente_id: string;
  restaurante_id: string;
  repartidor_id: string | null;
  fecha: string;
  estado: EstadoPedido;
  items: PedidoItem[];
  subtotal: number;
  descuento: number;
  total: number;
  direccion_entrega: string;
  codigo_postal: string;
  cupon_codigo?: string;
  calificado: boolean;
}

export interface Calificacion {
  id: string;
  pedido_id: string;
  puntaje: number;
  comentario: string;
  fecha: string;
}

export interface Cupon {
  id: string;
  codigo: string;
  porcentaje: number;
  vencimiento: string;
  usos_maximos: number;
  usos_actuales: number;
}

export interface Zona {
  id: string;
  restaurante_id: string;
  nombre: string;
  codigo_postal: string;
}

export interface Notificacion {
  id: string;
  pedido_id: string;
  cliente_id: string;
  estado_nuevo: EstadoPedido;
  fecha: string;
  leida: boolean;
}
