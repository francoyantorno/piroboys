import type {
  Cliente,
  Cupon,
  Notificacion,
  Pedido,
  Plato,
  Repartidor,
  Restaurante,
  Usuario,
  Zona,
  Calificacion,
} from "@/lib/types";

export const db = {
  usuarios: [
    { id: "u1", nombre: "Admin", email: "admin@rappi.com", rol: "admin" },
    {
      id: "u2",
      nombre: "Lucía",
      email: "lucia@mail.com",
      rol: "cliente",
      cliente_id: "c1",
    },
    {
      id: "u3",
      nombre: "Mateo",
      email: "mateo@mail.com",
      rol: "repartidor",
      repartidor_id: "r1",
    },
  ] as Usuario[],
  passwords: { "admin@rappi.com": "admin", "lucia@mail.com": "1234", "mateo@mail.com": "1234" } as Record<string, string>,
  clientes: [
    { id: "c1", nombre: "Lucía", email: "lucia@mail.com", direccion: "Av. Siempre Viva 123", telefono: "1122334455" },
  ] as Cliente[],
  repartidores: [
    { id: "r1", nombre: "Mateo", vehiculo: "Moto", disponible: true },
    { id: "r2", nombre: "Sofía", vehiculo: "Bici", disponible: true },
    { id: "r3", nombre: "Diego", vehiculo: "Auto", disponible: false },
  ] as Repartidor[],
  restaurantes: [
    { id: "rest1", nombre: "Sushi Zen", categoria: "sushi", direccion: "Palermo 100", calificacion_promedio: 4.6 },
    { id: "rest2", nombre: "Pizza Nona", categoria: "pizza", direccion: "Caballito 200", calificacion_promedio: 4.2 },
    { id: "rest3", nombre: "Burger House", categoria: "hamburguesas", direccion: "Belgrano 300", calificacion_promedio: 4.4 },
    { id: "rest4", nombre: "Veggie Bowl", categoria: "saludable", direccion: "Recoleta 400", calificacion_promedio: 4.8 },
  ] as Restaurante[],
  platos: [
    { id: "p1", nombre: "Roll Philadelphia", descripcion: "Salmón, queso crema, palta", precio: 4500, disponible: true, restaurante_id: "rest1" },
    { id: "p2", nombre: "Roll California", descripcion: "Kanikama, palta, pepino", precio: 3800, disponible: true, restaurante_id: "rest1" },
    { id: "p3", nombre: "Sashimi Mixto", descripcion: "12 piezas variadas", precio: 6200, disponible: false, restaurante_id: "rest1" },
    { id: "p4", nombre: "Muzzarella", descripcion: "Pizza clásica al molde", precio: 3200, disponible: true, restaurante_id: "rest2" },
    { id: "p5", nombre: "Napolitana", descripcion: "Tomate, ajo, albahaca", precio: 3600, disponible: true, restaurante_id: "rest2" },
    { id: "p6", nombre: "Cheeseburger", descripcion: "Doble carne, cheddar", precio: 4200, disponible: true, restaurante_id: "rest3" },
    { id: "p7", nombre: "Bacon Burger", descripcion: "Carne, bacon, BBQ", precio: 4800, disponible: true, restaurante_id: "rest3" },
    { id: "p8", nombre: "Bowl Quinoa", descripcion: "Quinoa, palta, vegetales", precio: 3900, disponible: true, restaurante_id: "rest4" },
  ] as Plato[],
  pedidos: [] as Pedido[],
  calificaciones: [] as Calificacion[],
  cupones: [
    { id: "cu1", codigo: "BIENVENIDA10", porcentaje: 10, vencimiento: "2027-01-01", usos_maximos: 100, usos_actuales: 0 },
    { id: "cu2", codigo: "SUSHI20", porcentaje: 20, vencimiento: "2027-06-30", usos_maximos: 50, usos_actuales: 0 },
  ] as Cupon[],
  zonas: [
    { id: "z1", restaurante_id: "rest1", nombre: "Palermo", codigo_postal: "1414" },
    { id: "z2", restaurante_id: "rest1", nombre: "Recoleta", codigo_postal: "1425" },
    { id: "z3", restaurante_id: "rest2", nombre: "Caballito", codigo_postal: "1405" },
    { id: "z4", restaurante_id: "rest2", nombre: "Palermo", codigo_postal: "1414" },
    { id: "z5", restaurante_id: "rest3", nombre: "Belgrano", codigo_postal: "1428" },
    { id: "z6", restaurante_id: "rest4", nombre: "Recoleta", codigo_postal: "1425" },
  ] as Zona[],
  notificaciones: [] as Notificacion[],
};

let _id = 1000;
export const newId = (prefix = "id") => `${prefix}${++_id}`;

export const sleep = (ms = 200) => new Promise<void>((r) => setTimeout(r, ms));
