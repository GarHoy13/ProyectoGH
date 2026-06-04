<script setup>
import { ref, computed, onMounted } from 'vue'
import { productosService, ventasService } from '../services/api'

const productos = ref([])
const busqueda = ref('')
const carrito = ref([])
const mensaje = ref('')
const cargando = ref(false)

const productosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return productos.value
  return productos.value.filter(
    (p) =>
      p.nombre.toLowerCase().includes(q) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(q))
  )
})

const totalCarrito = computed(() =>
  carrito.value.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
)

const cargarProductos = async () => {
  const { data } = await productosService.getAll()
  productos.value = data
}

const agregarAlCarrito = (producto) => {
  if (Number(producto.stock) === 0) return

  const existente = carrito.value.find((i) => String(i.productoId) === String(producto.id))

  if (existente) {
    if (existente.cantidad < Number(producto.stock)) {
      existente.cantidad++
    }
  } else {
    carrito.value.push({
      productoId: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      cantidad: 1
    })
  }
}

const quitarDelCarrito = (productoId) => {
  carrito.value = carrito.value.filter((i) => String(i.productoId) !== String(productoId))
}

const cambiarCantidad = (productoId, delta) => {
  const item = carrito.value.find((i) => String(i.productoId) === String(productoId))
  if (!item) return

  // aqui se verifica que la cantidad no supere el stock disponible
  const prodActual = productos.value.find((p) => String(p.id) === String(productoId))
  const stockMax = prodActual ? Number(prodActual.stock) : Infinity

  const nuevaCantidad = item.cantidad + delta
  if (nuevaCantidad <= 0) {
    quitarDelCarrito(productoId)
  } else if (nuevaCantidad <= stockMax) {
    item.cantidad = nuevaCantidad
  }
}

const cancelar = () => {
  carrito.value = []
  mensaje.value = ''
}

const cobrar = async () => {
  if (carrito.value.length === 0 || cargando.value) return
  cargando.value = true
  mensaje.value = ''

  try {
    // descontar el stock de cada producto vendido
    for (const item of carrito.value) {
      const prod = productos.value.find((p) => String(p.id) === String(item.productoId))
      if (prod) {
        await productosService.update(prod.id, {
          ...prod,
          stock: Number(prod.stock) - item.cantidad
        })
      }
    }

    // guardar la venta en la base de datos
    await ventasService.create({
      fecha: new Date().toISOString(),
      total: totalCarrito.value,
      items: carrito.value.map((i) => ({
        productoId: i.productoId,
        nombre: i.nombre,
        precio: i.precio,
        cantidad: i.cantidad
      }))
    })

    // limpiar el carrito y recargar productos
    carrito.value = []
    await cargarProductos()

    mensaje.value = 'Venta registrada correctamente'
    setTimeout(() => { mensaje.value = '' }, 4000)
  } catch {
    mensaje.value = 'Error al registrar la venta. Intenta de nuevo.'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarProductos)
</script>

<template>
  <div class="pos-layout">

    <!-- panel izquierdo -->
    <aside class="panel-carrito">

      <!-- Header del carrito -->
      <div class="carrito-header">
        <div class="carrito-header-left">
          <svg viewBox="0 0 24 24" fill="currentColor" class="carrito-header-icon" aria-hidden="true">
            <path d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM3 2H1v2h2l3.6 8.59L5.25 15A2 2 0 007 18h12v-2H7.42a.25.25 0 01-.25-.29l.03-.12.9-1.59H19a2 2 0 001.75-1.03l3.58-6.49A1 1 0 0023.4 5H5.21L4.27 3H3z"/>
          </svg>
          <h2 class="carrito-titulo">Ticket de Venta</h2>
        </div>
        <span class="carrito-count" v-if="carrito.length > 0">{{ carrito.length }}</span>
      </div>

      <!-- Mensaje de éxito / error -->
      <transition name="fade">
        <div v-if="mensaje" class="mensaje" :class="{ 'mensaje-error': mensaje.includes('Error') }">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path v-if="!mensaje.includes('Error')" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            <path v-else d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {{ mensaje }}
        </div>
      </transition>

      <!-- Items del carrito -->
      <div class="carrito-items">
        <div v-if="carrito.length === 0" class="carrito-vacio">
          <svg viewBox="0 0 24 24" fill="currentColor" class="vacio-icon" aria-hidden="true">
            <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM7.17 14l-1.62-8H20l-1.62 8H7.17z"/>
          </svg>
          <p>El carrito está vacío</p>
          <p class="vacio-sub">Selecciona productos del catálogo</p>
        </div>

        <div v-else v-for="item in carrito" :key="item.productoId" class="carrito-item">
          <div class="item-info">
            <p class="item-nombre">{{ item.nombre }}</p>
            <p class="item-precio">${{ item.precio.toFixed(2) }} c/u</p>
          </div>

          <div class="item-controls">
            <button class="btn-qty" @click="cambiarCantidad(item.productoId, -1)" aria-label="Reducir">−</button>
            <span class="item-qty">{{ item.cantidad }}</span>
            <button class="btn-qty" @click="cambiarCantidad(item.productoId, 1)" aria-label="Aumentar">+</button>
          </div>

          <span class="item-subtotal">${{ (item.precio * item.cantidad).toFixed(2) }}</span>

          <button class="btn-quitar" @click="quitarDelCarrito(item.productoId)" aria-label="Quitar del carrito">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Total + Acciones -->
      <div class="total-section">
        <div class="total-row">
          <span class="total-label">Total</span>
          <span class="total-valor">${{ totalCarrito.toFixed(2) }}</span>
        </div>

        <div class="carrito-acciones">
          <button
            class="btn-cancelar"
            @click="cancelar"
            :disabled="cargando || carrito.length === 0"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            Cancelar
          </button>
          <button
            class="btn-cobrar"
            @click="cobrar"
            :disabled="carrito.length === 0 || cargando"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
            </svg>
            {{ cargando ? 'Procesando...' : 'Cobrar' }}
          </button>
        </div>
      </div>
    </aside>

    <!-- panel derecho -->
    <section class="panel-productos">
      <div class="productos-header">
        <h2 class="productos-titulo">Catálogo de Productos</h2>
        <div class="search-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            v-model="busqueda"
            class="buscador"
            placeholder="Buscar producto..."
          />
        </div>
      </div>

      <div class="productos-grid">
        <div
          v-for="producto in productosFiltrados"
          :key="producto.id"
          class="producto-tarjeta"
          :class="{ 'tarjeta-disabled': Number(producto.stock) === 0 }"
          @click="agregarAlCarrito(producto)"
          :title="Number(producto.stock) === 0 ? 'Sin stock disponible' : producto.nombre"
        >
          <p class="prod-nombre">{{ producto.nombre }}</p>
          <p class="prod-precio">${{ Number(producto.precio).toFixed(2) }}</p>
          <div class="prod-footer">
            <span
              class="prod-stock"
              :class="{
                'stock-cero': Number(producto.stock) === 0,
                'stock-bajo': Number(producto.stock) > 0 && Number(producto.stock) < 5
              }"
            >
              <span v-if="Number(producto.stock) === 0">Sin stock</span>
              <span v-else>{{ producto.stock }} en stock</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* layout del pos */
.pos-layout {
  position: fixed;
  top: 64px; /* altura del NavBar */
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  overflow: hidden;
  background: var(--bg);
}

/* panel izquierdo */
.panel-carrito {
  width: 380px;
  min-width: 300px;
  background: var(--white);
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1;
  flex-shrink: 0;
}

/* Carrito header */
.carrito-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.carrito-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.carrito-header-icon {
  width: 20px;
  height: 20px;
  color: var(--primary);
}

.carrito-titulo {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
}

.carrito-count {
  background: var(--accent);
  color: white;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 22px;
  text-align: center;
}

/* Mensaje */
.mensaje {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 16px 0;
  padding: 10px 14px;
  background: #ECFDF5;
  border-left: 3px solid #10B981;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #065F46;
  flex-shrink: 0;
}

.mensaje svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.mensaje-error {
  background: var(--danger-bg);
  border-color: var(--danger);
  color: var(--danger);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Items del carrito */
.carrito-items {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px;
}

.carrito-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 52px 24px;
  text-align: center;
  color: var(--text-muted);
}

.vacio-icon {
  width: 40px;
  height: 40px;
  color: var(--border);
  margin-bottom: 12px;
}

.carrito-vacio p {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.vacio-sub {
  font-size: 0.8rem;
  font-weight: 400 !important;
  color: #A0AEC0;
}

/* Item de carrito */
.carrito-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 0;
  border-bottom: 1px solid #F7FAFC;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-nombre {
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-precio {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 2px;
}

/* Controles qty */
.item-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.btn-qty {
  width: 26px;
  height: 26px;
  border: 1.5px solid var(--border);
  border-radius: 6px;
  background: #F8FAFC;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  transition: background var(--transition), border-color var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text);
}

.btn-qty:hover {
  background: var(--border);
  border-color: #CBD5E0;
}

.item-qty {
  width: 24px;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text);
}

.item-subtotal {
  width: 64px;
  text-align: right;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--accent);
  flex-shrink: 0;
}

.btn-quitar {
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 6px;
  background: var(--danger-light);
  color: var(--danger);
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-quitar svg {
  width: 14px;
  height: 14px;
}

.btn-quitar:hover { opacity: 0.72; }

/* Total y acciones */
.total-section {
  padding: 16px 20px 24px;
  border-top: 2px solid var(--border);
  flex-shrink: 0;
  background: var(--white);
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
}

.total-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.total-valor {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: -1px;
}

.carrito-acciones {
  display: flex;
  gap: 10px;
}

.btn-cancelar,
.btn-cobrar {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px 10px;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: inherit;
  transition: opacity var(--transition), background var(--transition);
}

.btn-cancelar svg,
.btn-cobrar svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.btn-cancelar {
  background: transparent;
  color: var(--danger);
  border: 2px solid var(--danger);
}

.btn-cancelar:hover:not(:disabled) {
  background: var(--danger-bg);
}

.btn-cobrar {
  background: var(--accent);
  color: white;
  border: none;
}

.btn-cobrar:hover:not(:disabled) {
  background: var(--accent-hover);
}

.btn-cancelar:disabled,
.btn-cobrar:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* panel derecho */
.panel-productos {
  flex: 1;
  background: var(--bg);
  overflow-y: auto;
  padding: 20px 24px;
}

.productos-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.productos-titulo {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 180px;
  max-width: 320px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  color: var(--text-muted);
  pointer-events: none;
}

.buscador {
  width: 100%;
  padding: 9px 12px 9px 32px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-family: inherit;
  background: var(--white);
  color: var(--text);
  transition: border-color var(--transition), box-shadow var(--transition);
}

.buscador:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(46, 125, 111, 0.13);
}

/* Producto grid */
.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 14px;
}

.producto-tarjeta {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 14px;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
  user-select: none;
}

.producto-tarjeta:hover:not(.tarjeta-disabled) {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--accent);
}

.tarjeta-disabled {
  opacity: 0.42;
  cursor: not-allowed;
}

.prod-nombre {
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
  line-height: 1.35;
  min-height: 2.3em;
}

.prod-precio {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 8px;
  letter-spacing: -0.3px;
}

.prod-footer {
  border-top: 1px solid #F1F5F9;
  padding-top: 8px;
  margin-top: 2px;
}

.prod-stock {
  font-size: 0.74rem;
  color: var(--text-muted);
  font-weight: 500;
}

.stock-bajo {
  color: #D97706;
  font-weight: 700;
}

.stock-cero {
  color: var(--danger);
  font-weight: 700;
}
</style>
