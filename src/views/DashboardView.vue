<script setup>
import { ref, computed, onMounted } from 'vue'
import TarjetaResumen from '../components/TarjetaResumen.vue'
import AlertaStock from '../components/AlertaStock.vue'
import {
  proveedoresService,
  categoriasService,
  productosService,
  ventasService
} from '../services/api'

const proveedores = ref([])
const categorias  = ref([])
const productos   = ref([])
const ventas      = ref([])

const totalProveedores   = computed(() => proveedores.value.length)
const totalCategorias    = computed(() => categorias.value.length)
const totalProductos     = computed(() => productos.value.length)
const proveedoresActivos = computed(() => proveedores.value.filter((p) => p.activo).length)

// calcula el valor total multiplicando precio por stock de cada producto
const valorInventario = computed(() => {
  const total = productos.value.reduce(
    (acc, p) => acc + Number(p.precio) * Number(p.stock),
    0
  )
  return formatMoneda(total)
})

const ventasRecientes = computed(() =>
  [...ventas.value]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5)
)

// formatea una fecha a string legible
function formatFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

// formatea un numero como moneda mexicana
function formatMoneda(valor) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor)
}

// se manda llamar al montar el componente para cargar todos los datos
onMounted(async () => {
  const [r1, r2, r3, r4] = await Promise.all([
    proveedoresService.getAll(),
    categoriasService.getAll(),
    productosService.getAll(),
    ventasService.getAll()
  ])
  proveedores.value = r1.data
  categorias.value  = r2.data
  productos.value   = r3.data
  ventas.value      = r4.data
})
</script>

<template>
  <div>
    <!-- encabezado -->
    <div class="page-header">
      <p class="page-eyebrow">Panel de control</p>
      <h1 class="page-title">Dashboard</h1>
    </div>

    <AlertaStock :productos="productos" />

    <!-- tarjetas -->
    <div class="tarjetas">
      <TarjetaResumen titulo="Total Proveedores" :valor="totalProveedores" color="#1B2B4B">
        <template #icono>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
        </template>
      </TarjetaResumen>

      <TarjetaResumen titulo="Proveedores Activos" :valor="proveedoresActivos" color="#2E7D6F">
        <template #icono>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </template>
      </TarjetaResumen>

      <TarjetaResumen titulo="Total Categorías" :valor="totalCategorias" color="#5B21B6">
        <template #icono>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21.41 11.58l-9-9A2 2 0 0011 2H4a2 2 0 00-2 2v7a2 2 0 00.59 1.42l9 9A2 2 0 0013 22a2 2 0 001.41-.59l7-7A2 2 0 0022 13a2 2 0 00-.59-1.42zM5.5 7A1.5 1.5 0 114 5.5 1.5 1.5 0 015.5 7z"/>
          </svg>
        </template>
      </TarjetaResumen>

      <TarjetaResumen titulo="Total Productos" :valor="totalProductos" color="#B45309">
        <template #icono>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 2H4a2 2 0 00-2 2v3a2 2 0 001 1.72V20a2 2 0 002 2h14a2 2 0 002-2V8.72A2 2 0 0022 7V4a2 2 0 00-2-2zm-5 12H9v-2h6v2zm3-8H6V4h12v2z"/>
          </svg>
        </template>
      </TarjetaResumen>

      <TarjetaResumen titulo="Valor del Inventario" :valor="valorInventario" color="#0E7490">
        <template #icono>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
          </svg>
        </template>
      </TarjetaResumen>
    </div>

    <!-- ventas recientes -->
    <section class="historial">
      <div class="historial-header">
        <div>
          <p class="page-eyebrow">Actividad</p>
          <h2 class="historial-titulo">Ventas Recientes</h2>
        </div>
        <span class="historial-badge">Últimas 5</span>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Artículos</th>
              <th class="th-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <!-- si no hay ventas registradas -->
            <tr v-if="ventasRecientes.length === 0">
              <td colspan="3" class="empty">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM3 2H1v2h2l3.6 8.59L5.25 15A2 2 0 007 18h12v-2H7.42a.25.25 0 01-.25-.29l.03-.12.9-1.59H19a2 2 0 001.75-1.03l3.58-6.49A1 1 0 0023.4 5H5.21L4.27 3H3z"/>
                </svg>
                Sin ventas registradas aún
              </td>
            </tr>

            <!-- lista de ventas -->
            <tr v-else v-for="venta in ventasRecientes" :key="venta.id">
              <td class="td-fecha">
                <svg class="fecha-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                </svg>
                {{ formatFecha(venta.fecha) }}
              </td>
              <td class="td-articulos">
                <span class="articulos-chip">
                  {{ venta.items.length }}
                  {{ venta.items.length === 1 ? 'artículo' : 'artículos' }}
                </span>
              </td>
              <td class="td-total">{{ formatMoneda(venta.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* encabezado de pagina */
.page-header {
  margin-bottom: 28px;
}

.page-eyebrow {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin-bottom: 4px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.4px;
}

/* tarjetas del dashboard */
.tarjetas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 18px;
  margin-bottom: 36px;
}

/* historial de ventas */
.historial {
  margin-top: 4px;
}

.historial-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;
}

.historial-titulo {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.2px;
}

.historial-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--border);
  padding: 3px 10px;
  border-radius: 20px;
}

/* tabla del historial */
.table-wrapper {
  overflow-x: auto;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}

table {
  width: 100%;
  border-collapse: collapse;
  background: var(--white);
  border-radius: var(--radius);
  overflow: hidden;
}

thead {
  background: #F8FAFC;
  border-bottom: 2px solid var(--border);
}

th {
  padding: 11px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  white-space: nowrap;
}

.th-right {
  text-align: right;
}

td {
  padding: 13px 16px;
  border-bottom: 1px solid #F1F5F9;
  font-size: 0.875rem;
  color: var(--text);
  vertical-align: middle;
}

tr:last-child td {
  border-bottom: none;
}

tbody tr:hover td {
  background: #FAFBFF;
}

/* celda de fecha */
.td-fecha {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 0.84rem;
  white-space: nowrap;
}

.fecha-icon {
  width: 14px;
  height: 14px;
  color: var(--text-muted);
  flex-shrink: 0;
}

/* chip de articulos */
.articulos-chip {
  display: inline-block;
  background: var(--accent-light);
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}

/* total alineado a la derecha */
.td-total {
  text-align: right;
  font-weight: 700;
  color: var(--accent);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
}

/* estado vacio */
.empty {
  text-align: center;
  color: var(--text-muted);
  padding: 48px 24px;
  font-size: 0.875rem;
}

.empty-icon {
  width: 32px;
  height: 32px;
  color: var(--border);
  display: block;
  margin: 0 auto 12px;
}
</style>
