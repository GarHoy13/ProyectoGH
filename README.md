# GH Comercializadora

Sistema web de gestión de inventario para una comercializadora de artículos médicos (equipo de movilidad, diagnóstico, protección y terapia). Permite administrar proveedores, categorías y productos, así como registrar ventas desde un punto de venta (POS) sencillo con descuento automático de stock.

---

## Tecnologías utilizadas

|                      Tecnología                        |   Versión   |                            Rol                                 |
|--------------------------------------------------------|-------------|----------------------------------------------------------------|
| [Vue 3](https://vuejs.org/)                            |    ^3.5     | Framework principal (Composition API + `<script setup>`)       |
| [Vue Router](https://router.vuejs.org/)                |    ^5.0     | Navegación entre vistas (SPA)                                  |
| [Axios](https://axios-http.com/)                       |    ^1.16    | Cliente HTTP para consumir la API                              |
| [Vite](https://vite.dev/)                              |    ^8.0     | Bundler y servidor de desarrollo                               |
| [json-server](https://github.com/typicode/json-server) | ^1.0.0-beta | Base del servidor REST (extendido con `server.mjs`)            |
| Node.js (built-ins)                                    |      —      | `server.mjs` personalizado con IDs numéricos autoincrementales |
|--------------------------------------------------------|-------------|----------------------------------------------------------------|
---

## Estructura del proyecto

```
gh-comercializadora/
│
├── public/                     # Archivos estáticos públicos
│
├── src/
│   ├── components/             # Componentes reutilizables
│   │   ├── AlertaStock.vue     # Banner de advertencia para productos con stock < 5
│   │   ├── ModalFormulario.vue # Modal genérico de creación/edición con campos dinámicos
│   │   ├── NavBar.vue          # Barra de navegación sticky con íconos SVG
│   │   ├── TablaGenerica.vue   # Tabla reutilizable con soporte a badges, stock-control y acciones
│   │   └── TarjetaResumen.vue  # Tarjeta de métrica con borde de color e ícono por slot
│   │
│   ├── router/
│   │   └── index.js            # Definición de rutas con Vue Router
│   │
│   ├── services/
│   │   └── api.js              # Instancia de Axios y servicios para cada entidad
│   │
│   ├── views/                  # Vistas (una por ruta)
│   │   ├── DashboardView.vue   # Panel principal: métricas, alertas e historial de ventas
│   │   ├── ProveedoresView.vue # CRUD de proveedores
│   │   ├── CategoriasView.vue  # CRUD de categorías (con relación a proveedor)
│   │   ├── ProductosView.vue   # CRUD de productos con ajuste rápido de stock +/-
│   │   └── VentasView.vue      # Punto de venta (POS): carrito y registro de ventas
│   │
│   ├── App.vue                 # Componente raíz: NavBar + RouterView + variables CSS globales
│   └── main.js                 # Punto de entrada: crea la app, registra el router
│
├── db.json                     # Base de datos del servidor REST (modificada automáticamente)
├── server.mjs                  # Servidor API personalizado (Node.js) con IDs autoincrementales
├── vite.config.js              # Configuración de Vite
├── package.json                # Scripts y dependencias
└── index.html                  # HTML raíz
```

---

## Requisitos previos

- **Node.js** v18 o superior 
- **npm** v8 o superior
---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/GarHoy13/gh-comercializadora.git

# 2. Entrar al directorio
cd gh-comercializadora

# 3. Instalar dependencias
npm install
```

---

## Cómo ejecutar el proyecto

El proyecto requiere **dos terminales** corriendo simultáneamente:

### Terminal 1 — API REST (puerto 3001)

```bash
npm run api
```

Inicia `server.mjs` que sirve los datos de `db.json` en `http://localhost:3001`.

### Terminal 2 — Frontend Vue (puerto 5173)

```bash
npm run dev
```

> Ambos comandos deben estar activos al mismo tiempo para que la aplicación funcione correctamente.

---

## Funcionalidades

### Dashboard (`/dashboard`)
- Tarjetas de resumen: total de proveedores, proveedores activos, categorías, productos y valor total del inventario
- Alerta automática de stock bajo (productos con menos de 5 unidades)
- Tabla con las últimas 5 ventas registradas, ordenadas de más reciente a más antigua

### Proveedores (`/proveedores`)
- **CRUD completo**: crear, ver, editar y eliminar proveedores
- Badge de estado Activo / Inactivo con indicador de color

### Categorías (`/categorias`)
- **CRUD completo**: crear, ver, editar y eliminar categorías
- Relación con proveedor: la columna "Proveedor" se resuelve dinámicamente mediante `computed`

### Productos (`/productos`)
- **CRUD completo**: crear, ver, editar y eliminar productos
- **Ajuste rápido de stock** con botones `−` / `+` inline: actualización inmediata a la API (optimista)
- Color del stock: verde (≥5), naranja (1–4), rojo (0)
- Buscador en tiempo real por nombre, descripción o categoría
- Alerta de stock bajo integrada

### Ventas / POS (`/ventas`)
- Catálogo de productos con búsqueda y tarjetas clickeables
- Carrito de compra con control de cantidad por ítem
- Validación de stock máximo disponible
- Al cobrar: descuenta el stock de cada producto (PUT) y registra la venta (POST) de forma secuencial
- Mensaje de confirmación / error tras el proceso de cobro

---

## Autor
Jared Alejandro Garcia Hoyos