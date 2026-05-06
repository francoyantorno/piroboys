## Rappi — Frontend (TanStack Start + React)

App de delivery con 3 roles. Frontend puro: el backend lo manejás vos. Generamos UI completa, capa de servicios HTTP lista para apuntar a tu API, y mocks intercambiables mientras tanto.

### Arquitectura

- **Auth real**: `POST {API}/auth/login` → `{ token, user: { id, nombre, rol } }`. Token JWT en `localStorage`, adjuntado en header `Authorization: Bearer ...` por el cliente HTTP.
- **Capa de servicios**: `src/services/*.ts` con funciones tipadas por entidad (restaurantes, platos, pedidos, etc.). Cada función llama a `apiClient`.
- **Mocks**: flag `VITE_USE_MOCKS=true` activa adapter en memoria que cumple la misma interfaz. Al apagar el flag y setear `VITE_API_URL`, todo apunta a tu API sin tocar componentes.
- **Rutas protegidas**: layouts pathless `_admin`, `_cliente`, `_repartidor` con `beforeLoad` que verifica rol.
- **Estado servidor**: TanStack Query para cache, refetch y mutaciones.
- **Validación**: Zod en formularios (login, alta restaurante/plato, crear pedido, calificación, cupón, etc.).

### Diseño

Inspirado en Rappi: naranja vibrante (`#FF441F` → token `--primary`), fondo claro, cards con sombras suaves, bordes redondeados, mobile-first. Tipografía sans moderna. Tokens semánticos en `src/styles.css` (oklch). Sidebar colapsable para admin; bottom-nav para cliente/repartidor en mobile.

### Estructura de rutas

```text
src/routes/
  __root.tsx              shell + providers (QueryClient, AuthProvider)
  index.tsx               landing → redirige según rol
  login.tsx
  register.tsx            (cliente)
  _admin.tsx              guard rol=admin
    _admin/dashboard.tsx
    _admin/restaurantes.tsx           HU1, HU12
    _admin/restaurantes.$id.tsx       editar + menú + zonas
    _admin/clientes.tsx               HU2
    _admin/repartidores.tsx           HU2
    _admin/cupones.tsx                HU11
    _admin/rankings.tsx               HU10
    _admin/reportes.tsx               HU14
  _cliente.tsx            guard rol=cliente
    _cliente/buscar.tsx               HU3 (filtros nombre/categoria/CP)
    _cliente/restaurantes.$id.tsx     menú + armar pedido (HU4)
    _cliente/checkout.tsx             aplicar cupón + dirección (HU11, HU12)
    _cliente/pedidos.tsx              historial + total acumulado (HU8)
    _cliente/pedidos.$id.tsx          detalle, desglose, calificar (HU7, HU9)
    _cliente/notificaciones.tsx       HU13
  _repartidor.tsx         guard rol=repartidor
    _repartidor/pedidos.tsx           pedidos asignados
    _repartidor/pedidos.$id.tsx       cambiar estado (HU6)
```

### Capa de datos (`src/services/`)

```text
api-client.ts        fetch wrapper, baseURL, auth header, manejo de errores
auth.service.ts      login, me, logout
restaurantes.ts      list (q, categoria, cp), get, create, update, top, reporte
platos.ts            byRestaurante, create, update, toggleDisponible, top
clientes.ts          create, get, pedidos (filtro estado)
repartidores.ts      create, listDisponibles
pedidos.ts           create, get, asignar, cambiarEstado, calificar
cupones.ts           crud, validar
zonas.ts             byRestaurante, create
notificaciones.ts    byCliente, marcarLeida
mocks/               implementaciones in-memory equivalentes
```

`apiClient` lee `import.meta.env.VITE_API_URL`. Si `VITE_USE_MOCKS === 'true'`, los servicios re-exportan los mocks.

### Componentes UI clave

- `RestaurantCard`, `MenuItem`, `OrderCart` (con totales en vivo), `OrderStatusBadge`, `OrderTimeline`, `RatingStars`, `CouponInput`, `NotificationBell`, `RoleSidebar`, `MobileBottomNav`.
- Estados visuales: loading skeletons, empty states, errores con retry.

### Reglas de negocio en el front (validaciones espejo)

- Carrito bloquea agregar platos de otro restaurante (HU4).
- Solo platos `disponible=true` aparecen en menú cliente (HU1).
- Estado del pedido: máquina de transiciones válidas; botones se ocultan si no aplica (HU6).
- Calificar habilitado solo si `estado=entregado` y `calificado=false` (HU9).
- Cupón valida fecha/usos antes de enviar (HU11).
- Dirección de entrega valida CP contra zonas del restaurante (HU12).

### Variables de entorno (`.env`)

```text
VITE_API_URL=http://localhost:3000
VITE_USE_MOCKS=true
```

### Stack técnico

- TanStack Start + Router (file-based, ya configurado)
- TanStack Query para fetching/cache
- Zod + react-hook-form para formularios
- shadcn/ui + Tailwind v4 + tokens oklch
- lucide-react para iconos
- date-fns para fechas
- sonner para toasts

### Entregable de este turno

Genero todo el frontend con mocks funcionando end-to-end (podés probar las 14 HU navegando como admin, cliente o repartidor). Cuando tengas tu API, cambiás `VITE_USE_MOCKS=false` y `VITE_API_URL`, y debería funcionar sin tocar componentes — solo ajustar shape de respuesta si difiere.

### Fuera de alcance

- Pagos reales
- WebSockets/realtime para notificaciones (se hace polling con Query)
- Mapa para tracking del repartidor
- Tests automatizados