-- Extension para UUIDs (Opcional, si prefieres IDs mas seguros)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

---
-- TABLAS BASE
---

CREATE TABLE Cliente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    direccion TEXT NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL, -- Requerido para HU12
    telefono VARCHAR(20)
);

CREATE TABLE Restaurante (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    direccion TEXT NOT NULL,
    calificacion_promedio DECIMAL(3, 2) DEFAULT 0 CHECK (calificacion_promedio >= 0 AND calificacion_promedio <= 5)
);

CREATE TABLE Zona ( -- Requerido para HU12
    id SERIAL PRIMARY KEY,
    restaurante_id INT REFERENCES Restaurante(id) ON DELETE CASCADE,
    nombre VARCHAR(100),
    codigo_postal VARCHAR(10) NOT NULL
);

CREATE TABLE Plato (
    id SERIAL PRIMARY KEY,
    restaurante_id INT NOT NULL REFERENCES Restaurante(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio > 0), -- Requerido para HU1
    disponible BOOLEAN DEFAULT TRUE
);

CREATE TABLE Repartidor (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    vehiculo VARCHAR(50),
    disponible BOOLEAN DEFAULT TRUE -- Requerido para HU2 y HU5
);

CREATE TABLE Cupon ( -- Requerido para HU11
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    porcentaje_descuento INT CHECK (porcentaje_descuento BETWEEN 1 AND 100),
    fecha_vencimiento TIMESTAMP NOT NULL,
    usos_maximos INT NOT NULL,
    usos_actuales INT DEFAULT 0
);

---
-- TABLAS DE OPERACIÓN
---

CREATE TABLE Pedido (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES Cliente(id),
    restaurante_id INT NOT NULL REFERENCES Restaurante(id),
    repartidor_id INT REFERENCES Repartidor(id),
    cupon_id INT REFERENCES Cupon(id), -- Requerido para HU11
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'pendiente' 
        CHECK (estado IN ('pendiente', 'sin_repartidor', 'confirmado', 'en_preparacion', 'en_camino', 'entregado', 'cancelado')),
    subtotal DECIMAL(10, 2) DEFAULT 0,
    monto_descuento DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) DEFAULT 0,
    direccion_entrega TEXT NOT NULL,
    codigo_postal_entrega VARCHAR(10) NOT NULL -- Requerido para HU12
);

CREATE TABLE pedido_platos (
    pedido_id INT REFERENCES Pedido(id) ON DELETE CASCADE,
    plato_id INT REFERENCES Plato(id),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL, -- Requerido para HU4
    PRIMARY KEY (pedido_id, plato_id)
);

CREATE TABLE Calificacion (
    id SERIAL PRIMARY KEY,
    pedido_id INT UNIQUE REFERENCES Pedido(id), -- Unique asegura 1 sola calificacion (HU9)
    puntaje INT CHECK (puntaje BETWEEN 1 AND 5),
    comentario TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Notificacion ( -- Requerido para HU13
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES Pedido(id),
    estado_nuevo VARCHAR(20),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leida BOOLEAN DEFAULT FALSE
);

---
-- 15. Tablas de Carrito (Shopping Cart)
---

-- El "encabezado" del carrito vinculado al cliente
CREATE TABLE Carrito (
    id SERIAL PRIMARY KEY,
    cliente_id INT UNIQUE NOT NULL REFERENCES Cliente(id) ON DELETE CASCADE,
    restaurante_id INT REFERENCES Restaurante(id), -- Para asegurar la HU4 desde el inicio
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cliente_carrito FOREIGN KEY (cliente_id) REFERENCES Cliente(id)
);

-- Los "items" o platos dentro de ese carrito
CREATE TABLE carrito_items (
    id SERIAL PRIMARY KEY,
    carrito_id INT NOT NULL REFERENCES Carrito(id) ON DELETE CASCADE,
    plato_id INT NOT NULL REFERENCES Plato(id) ON DELETE CASCADE,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    CONSTRAINT fk_carrito_item_rel FOREIGN KEY (carrito_id) REFERENCES Carrito(id),
    CONSTRAINT fk_plato_carrito FOREIGN KEY (plato_id) REFERENCES Plato(id)
);