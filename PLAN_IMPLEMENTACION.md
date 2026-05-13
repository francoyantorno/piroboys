# Plan de Implementación — Rappi App

## Fases de Desarrollo

### FASE 1: Fundación de Base de Datos (HU1, HU2)
**Objetivo:** Establecer el esquema de base de datos y modelos ORM
**Duración estimada:** 2-3 días

#### Tasks:
- [ ] Crear modelos SQLAlchemy:
  - `Cliente` (id, nombre, email unique, direccion, telefono)
  - `Restaurante` (id, nombre, categoria, direccion, calificacion_promedio)
  - `Plato` (id, nombre, descripcion, precio > 0, disponible, restaurante_id)
  - `Repartidor` (id, nombre, vehiculo, disponible boolean)
  - `Zona` (id, restaurante_id, nombre, codigo_postal)
  
- [ ] Crear tabla N:M `pedido_plato`:
  - pedido_id, plato_id, cantidad > 0, precio_unitario (snapshot del momento)
  
- [ ] Crear modelos:
  - `Pedido` (id, cliente_id, restaurante_id, repartidor_id nullable, fecha, estado, total, direccion_entrega)
  - `Calificacion` (id, pedido_id unique, puntaje 1-5, comentario, fecha)
  - `Notificacion` (id, pedido_id, estado_nuevo, fecha, leida boolean)
  - `Cupon` (id, codigo unique, porcentaje 1-100, fecha_vencimiento, usos_maximos, usos_actuales)

- [ ] Crear migrations (Alembic)
- [ ] Script SQL con constraints y triggers para recalcular `calificacion_promedio` del restaurante

**Dependencias:** Ninguna (es la base)

---

### FASE 2: Repositorios y DTOs (Transversal)
**Objetivo:** Implementar acceso a datos y objetos de transferencia
**Duración estimada:** 2-3 días
**Puede iniciarse en paralelo con Fase 1**

#### Tasks:
- [ ] Crear DTOs:
  - `RestauranteDTO`, `PlatoDTO`, `ClienteDTO`, `RepartidorDTO`, `PedidoDTO`, `CalificacionDTO`, `NotificacionDTO`, `CuponDTO`

- [ ] Crear Repositories:
  - `RestauranteRepository` (CRUD, findByNombre/Categoria, getTop5)
  - `PlatoRepository` (CRUD, findByRestaurante, getTop10)
  - `ClienteRepository` (CRUD, findByEmail)
  - `RepartidorRepository` (CRUD, findDisponibles)
  - `PedidoRepository` (CRUD, findByCliente, findByRepartidor, findByEstado)
  - `CalificacionRepository` (CRUD, findByPedido)
  - `NotificacionRepository` (CRUD, findByCliente, markAsRead)
  - `CuponRepository` (CRUD, findByCodigo)

- [ ] Crear Mappers correspondientes

**Dependencias:** Fase 1

---

### FASE 3: Servicios de Negocio — Restaurantes y Menú (HU1)
**Objetivo:** Lógica de negocio para restaurantes y platos
**Duración estimada:** 1-2 días

#### Tasks:
- [ ] `RestauranteService`:
  - `crearRestaurante()`
  - `obtenerMenu(restaurante_id)` → solo platos disponibles
  - `buscarPorNombreOCategoria()` con filtros combinables
  - Ordenar por calificacion_promedio DESC

- [ ] `PlatoService`:
  - `crearPlato()` con validación precio > 0
  - `marcarNoDisponible()` (soft delete lógico)
  - `obtenerPlato()` validando disponibilidad

- [ ] Validaciones:
  - Precio > 0
  - Un plato pertenece a un solo restaurante (foreign key)
  - Email de cliente es único

**Dependencias:** Fase 2

---

### FASE 4: Servicios de Negocio — Clientes y Repartidores (HU2)
**Objetivo:** Registro de clientes y repartidores
**Duración estimada:** 1 día

#### Tasks:
- [ ] `ClienteService`:
  - `registrarCliente()` con email único
  - `obtenerCliente()`

- [ ] `RepartidorService`:
  - `registrarRepartidor()`
  - `obtenerDisponibles()` filtrando `disponible = true`

**Dependencias:** Fase 3

---

### FASE 5: Servicios de Negocio — Búsqueda y Filtros (HU3, HU12)
**Objetivo:** Implementar búsqueda avanzada de restaurantes
**Duración estimada:** 1-2 días

#### Tasks:
- [ ] `RestauranteService`:
  - `buscarPorNombre(q)` búsqueda parcial (LIKE)
  - `filtrarPorCategoria(categoria)` exacta
  - `filtrarPorCodigoPostal(codigo_postal)` → restaurantes que cubran la zona
  - Combinar filtros
  - Ordenar por calificacion_promedio DESC

- [ ] Crear y gestionar `Zona`:
  - `agregarZona()` a restaurante
  - Validar código postal en zona al crear pedido

**Dependencias:** Fase 3

---

### FASE 6: Servicios de Negocio — Creación de Pedidos (HU4, HU11)
**Objetivo:** Lógica para armar y crear pedidos
**Duración estimada:** 2-3 días

#### Tasks:
- [ ] `PedidoService`:
  - `crearPedido()` con validaciones:
    - Todos los platos del mismo restaurante
    - Platos marcados como disponibles
    - Cantidad > 0 para cada plato
    - Guardar `precio_unitario` snapshot
    - Validar `direccion_entrega` en zona del restaurante
  - Estado inicial: `pendiente`

- [ ] `CuponService`:
  - `aplicarCupon(pedido_id, codigo)`:
    - Validar código único
    - Validar fecha_vencimiento no expirada
    - Validar usos_maximos no alcanzados
    - Aplicar descuento sobre subtotal
    - **No incrementar usos_actuales hasta confirmar pedido**

- [ ] Cálculo de totales:
  - Subtotal: Σ(cantidad × precio_unitario)
  - Si hay cupón: subtotal × (1 - porcentaje/100)
  - Total = con impuestos (si aplica) o directo

**Dependencias:** Fase 5

---

### FASE 7: Servicios de Negocio — Asignación de Repartidor (HU5)
**Objetivo:** Asignación inteligente de repartidores
**Duración estimada:** 1-2 días

#### Tasks:
- [ ] `PedidoService.asignarRepartidor(pedido_id)`:
  - Buscar repartidor con `disponible = true`
  - Si existe:
    - Asignar a pedido
    - Cambiar repartidor a `disponible = false`
    - Cambiar estado del pedido a `confirmado`
  - Si NO existe:
    - Cambiar estado a `sin_repartidor`
    - Generar notificación
  - Endpoint: `POST /pedidos/{id}/asignar`

- [ ] `RepartidorService`:
  - Actualizar disponibilidad

- [ ] Sistema de reintentos (opcional para MVP):
  - Ejecutar asignación automáticaperiódicamente para pedidos en `sin_repartidor`

**Dependencias:** Fase 6

---

### FASE 8: Servicios de Negocio — Cambio de Estados (HU6, HU13)
**Objetivo:** Máquina de estados del pedido y notificaciones
**Duración estimada:** 2-3 días

#### Tasks:
- [ ] Definir transiciones válidas:
  - `pendiente` → `confirmado`
  - `confirmado` → `en_preparacion`
  - `en_preparacion` → `en_camino`
  - `en_camino` → `entregado` o `cancelado`
  - `entregado` y `cancelado` → (terminal, no hay cambios)

- [ ] `PedidoService.cambiarEstado(pedido_id, nuevo_estado)`:
  - Validar transición
  - Si transición inválida → lanzar error
  - Si `entregado`:
    - Marcar repartidor como `disponible = true`
    - Confirmar uso del cupón (incrementar `usos_actuales`)
  - Si `cancelado` y pedido aún en `pendiente`:
    - Liberar repartidor (si asignado)
    - No contar cupón como usado
  - Generar `Notificacion`

- [ ] `NotificacionService`:
  - `crearNotificacion(pedido_id, estado_nuevo)`
  - Marcar `leida = false`

**Dependencias:** Fase 7

---

### FASE 9: Servicios de Negocio — Calificaciones (HU9)
**Objetivo:** Sistema de ratings para restaurantes
**Duración estimada:** 1-2 días

#### Tasks:
- [ ] `CalificacionService`:
  - `calificarPedido(pedido_id, puntaje, comentario)`:
    - Validar pedido en estado `entregado`
    - Validar puntaje entre 1-5
    - Validar que pedido no esté calificado ya (unique)
    - Crear calificación
  - Trigger: actualizar `restaurante.calificacion_promedio`

- [ ] `RestauranteService`:
  - `recalcularCalificacionPromedio(restaurante_id)`

**Dependencias:** Fase 8

---

### FASE 10: Servicios de Negocio — Rankings y Reportes (HU10, HU14)
**Objetivo:** Análisis de datos y ranking
**Duración estimada:** 2-3 días

#### Tasks:
- [ ] `RestauranteService`:
  - `obtenerTop5Restaurantes()` por cantidad de pedidos entregados
  - `obtenerReporte(restaurante_id, desde, hasta)`:
    - Cantidad de pedidos entregados
    - Facturación total
    - Ticket promedio
    - Top 5 platos vendidos en el período
    - Si no hay datos: retornar ceros y lista vacía

- [ ] `PlatoService`:
  - `obtenerTop10Platos()` por cantidad total vendida

**Dependencias:** Fase 9

---

### FASE 11: APIs REST — Endpoints Administrativos
**Objetivo:** Routers para administración
**Duración estimada:** 2-3 días

#### Endpoints:
```
POST   /restaurantes                 → crearRestaurante
GET    /restaurantes                 → listar (con filtros)
GET    /restaurantes/{id}            → obtener
PUT    /restaurantes/{id}            → actualizar
DELETE /restaurantes/{id}            → eliminar

POST   /restaurantes/{id}/platos     → crear plato
GET    /restaurantes/{id}/platos     → listar platos del restaurante
GET    /restaurantes/{id}/menu       → menu (solo disponibles)
PUT    /platos/{id}                  → actualizar plato (disponibilidad, precio)
DELETE /platos/{id}                  → eliminar plato

POST   /clientes                     → registrar cliente
GET    /clientes/{id}                → obtener
PUT    /clientes/{id}                → actualizar

POST   /repartidores                 → registrar repartidor
GET    /repartidores                 → listar
GET    /repartidores/disponibles     → solo disponibles
PUT    /repartidores/{id}            → actualizar

POST   /restaurantes/{id}/zonas      → agregar zona
GET    /restaurantes/{id}/zonas      → listar zonas
DELETE /zonas/{id}                   → eliminar zona

POST   /cupones                      → crear cupón
GET    /cupones                      → listar
PUT    /cupones/{id}                 → actualizar (vencimiento, usos)

GET    /restaurantes/top             → top 5 restaurantes
GET    /platos/top                   → top 10 platos
GET    /restaurantes/{id}/reporte    → reporte de ventas
```

**Dependencias:** Fases 2-10

---

### FASE 12: APIs REST — Endpoints de Cliente
**Objetivo:** Routers para clientes (buscar, pedir, historial)
**Duración estimada:** 2-3 días

#### Endpoints:
```
GET    /restaurantes?q=&categoria=&codigo_postal=  → buscar con filtros
GET    /restaurantes/{id}/menu                      → ver menu

POST   /pedidos                      → crear pedido
GET    /pedidos/{id}                 → obtener detalles
GET    /clientes/{id}/pedidos        → historial (con filtro ?estado=)
GET    /clientes/{id}/pedidos?estado={estado}      → filtrar por estado

POST   /pedidos/{id}/asignar         → asignar repartidor
PATCH  /pedidos/{id}/estado          → cambiar estado

POST   /calificaciones               → calificar pedido
GET    /pedidos/{id}/calificacion    → ver calificación

GET    /clientes/{id}/notificaciones → listar notificaciones
PATCH  /notificaciones/{id}          → marcar como leída
```

**Dependencias:** Fases 2-10

---

### FASE 13: APIs REST — Endpoints de Repartidor
**Objetivo:** Routers para repartidores
**Duración estimada:** 1-2 días

#### Endpoints:
```
GET    /repartidores/{id}/pedidos    → mi pedido actual (activo)
PATCH  /pedidos/{id}/estado          → actualizar estado del pedido
```

**Dependencias:** Fases 2-10

---

### FASE 14: Autenticación y Autorización
**Objetivo:** Proteger endpoints por rol
**Duración estimada:** 2-3 días

#### Tasks:
- [ ] Extender modelo `Cliente`, `Repartidor` con roles
- [ ] Middleware: autenticar JWT y validar permisos
- [ ] Proteger endpoints:
  - Admin: `/restaurantes/*`, `/cupones/*`, `/repartidores/*`
  - Cliente: `/clientes/{id}/*`, `/pedidos/{id}/*` (solo sus propios datos)
  - Repartidor: `/repartidores/{id}/*`, `/pedidos/{id}/estado`

**Dependencias:** Fases 11-13

---

### FASE 15: Frontend — Módulo Restaurantes
**Objetivo:** UI para buscar y ver menú
**Duración estimada:** 3-4 días

#### Componentes:
- [ ] SearchRestaurantes (búsqueda, filtros)
- [ ] RestauranteCard (nombre, calificación, categoría)
- [ ] MenuList (platos disponibles con precios)
- [ ] PlatoCard (nombre, descripción, precio, agregar a carrito)

**Dependencias:** Fase 12, Fase 4 (carrito)

---

### FASE 16: Frontend — Carrito y Checkout
**Objetivo:** Armar pedido y pagar
**Duración estimada:** 3-4 días

#### Componentes:
- [ ] CartContext (estado global del carrito)
- [ ] CartItem (plato, cantidad, eliminar)
- [ ] ApplyCoupon (input código, aplicar descuento)
- [ ] OrderSummary (subtotal, descuento, total)
- [ ] CheckoutForm (dirección, validar zona)
- [ ] ConfirmOrder (botón crear pedido)

**Dependencias:** Fase 15, Fase 6

---

### FASE 17: Frontend — Historial de Pedidos
**Objetivo:** Ver estado y detalles de pedidos
**Duración estimada:** 2-3 días

#### Componentes:
- [ ] OrderHistory (lista de pedidos, filtrar por estado)
- [ ] OrderDetail (platos, cantidades, total, estado)
- [ ] StateTimeline (visualizar progreso del pedido)
- [ ] RatingForm (calificar pedido)

**Dependencias:** Fase 12, Fase 9

---

### FASE 18: Frontend — Notificaciones
**Objetivo:** Mostrar cambios de estado en tiempo real
**Duración estimada:** 2-3 días

#### Tareas:
- [ ] WebSocket o polling para actualizar estado
- [ ] NotificationBanner (mostrar notificaciones nuevas)
- [ ] NotificationCenter (listar y marcar como leído)
- [ ] StateChange animation

**Dependencias:** Fase 17

---

### FASE 19: Testing
**Objetivo:** Cobertura de pruebas
**Duración estimada:** 4-5 días

#### Tasks:
- [ ] Unit tests para servicios (pytest)
- [ ] Integration tests para repositorios
- [ ] API tests (request/response)
- [ ] Frontend tests (vitest/React Testing Library)

**Dependencias:** Todas las fases anteriores

---

### FASE 20: Deployment y Optimizaciones
**Objetivo:** Publicar y optimizar
**Duración estimada:** 2-3 días

#### Tasks:
- [ ] Configurar variables de entorno (prod)
- [ ] Database migrations en prod
- [ ] Docker (opcional)
- [ ] Índices en base de datos para queries lentas
- [ ] Caching (Redis si es necesario)
- [ ] Error handling y logging

---

## Resumen de Dependencias

```
FASE 1 (DB)
    ↓
FASE 2 (Repos/DTOs) ← puede ir en paralelo con Fase 1
    ↓
FASE 3 (Restaurantes/Platos)
    ↓
FASE 4 (Clientes/Repartidores)
    ↓
FASE 5 (Búsqueda/Filtros)
    ↓
FASE 6 (Crear Pedidos + Cupones)
    ↓
FASE 7 (Asignar Repartidor)
    ↓
FASE 8 (Cambio Estados + Notificaciones)
    ↓
FASE 9 (Calificaciones)
    ↓
FASE 10 (Rankings/Reportes)
    ↓
FASE 11-13 (APIs REST) ← todas dependen de Fase 10
    ↓
FASE 14 (Auth/Autorizacion)
    ↓
FASE 15-18 (Frontend) ← pueden ir en paralelo, después de API
    ↓
FASE 19 (Testing)
    ↓
FASE 20 (Deployment)
```

---

## Estimación Total
- **Backend:** 20-25 días de desarrollo
- **Frontend:** 10-12 días de desarrollo
- **Testing:** 4-5 días
- **Deployment:** 2-3 días

**Total estimado:** 6-8 semanas para MVP completo

---

## Priorización para MVP v1
1. ✅ **CRÍTICO:** Fases 1-10 (Backend lógica completa)
2. ✅ **CRÍTICO:** Fases 11-13 (APIs REST)
3. ⚠️ **IMPORTANTE:** Fases 15-17 (Frontend básico)
4. 🔄 **FUTURO:** Fase 18 (Notificaciones real-time)
5. 🔄 **FUTURO:** Fase 19-20 (Tests y deployment)

---

## Próximos Pasos Recomendados
1. Comenzar FASE 1: Diseñar esquema SQL completo
2. En paralelo, revisar estructura de carpetas backend (ya existe)
3. Comenzar FASE 2: Crear DTOs y Repositories
4. Proceder secuencialmente por las fases
