<script setup>
import { ref, computed, onMounted } from 'vue'
import TablaGenerica from '../components/TablaGenerica.vue'
import ModalFormulario from '../components/ModalFormulario.vue'
import AlertaStock from '../components/AlertaStock.vue'
import { productosService, categoriasService } from '../services/api'

const productos = ref([])
const categorias = ref([])
const busqueda = ref('')
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const formulario = ref({})

const columnas = [
  { key: 'nombre',         label: 'Nombre' },
  { key: 'descripcion',    label: 'Descripción' },
  { key: 'precio',         label: 'Precio ($)' },
  { key: 'stock',          label: 'Stock', tipo: 'stock-control' },
  { key: 'categoriaNombre', label: 'Categoría' }
]

const productosConCategoria = computed(() =>
  productos.value.map((p) => ({
    ...p,
    categoriaNombre:
      categorias.value.find((c) => String(c.id) === String(p.categoriaId))?.nombre || '—'
  }))
)

const productosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return productosConCategoria.value
  return productosConCategoria.value.filter(
    (p) =>
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q) ||
      p.categoriaNombre.toLowerCase().includes(q)
  )
})

const camposConOpciones = computed(() => [
  { key: 'nombre',      label: 'Nombre',        tipo: 'text' },
  { key: 'descripcion', label: 'Descripción',   tipo: 'textarea' },
  { key: 'precio',      label: 'Precio ($)',    tipo: 'number' },
  { key: 'stock',       label: 'Stock',         tipo: 'number' },
  {
    key: 'categoriaId',
    label: 'Categoría',
    tipo: 'select',
    opciones: categorias.value.map((c) => ({ value: c.id, label: c.nombre }))
  }
])

// carga los productos y categorias desde la api
const cargar = async () => {
  const [r1, r2] = await Promise.all([productosService.getAll(), categoriasService.getAll()])
  productos.value = r1.data
  categorias.value = r2.data
}

const abrirCrear = () => {
  formulario.value = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaId: categorias.value[0]?.id ?? null
  }
  modoEdicion.value = false
  mostrarModal.value = true
}

const abrirEditar = (fila) => {
  formulario.value = {
    id: fila.id,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    precio: fila.precio,
    stock: fila.stock,
    categoriaId: String(fila.categoriaId)
  }
  modoEdicion.value = true
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const guardar = async (datos) => {
  const payload = {
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    categoriaId: datos.categoriaId
  }
  if (modoEdicion.value) {
    await productosService.update(datos.id, payload)
  } else {
    await productosService.create(payload)
  }
  cerrarModal()
  await cargar()
}

const eliminar = async (id) => {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    await productosService.remove(id)
    await cargar()
  }
}

// actualiza el stock sin esperar la respuesta del servidor
const cambiarStock = async (id, delta) => {
  const producto = productos.value.find((p) => String(p.id) === String(id))
  if (!producto) return

  const stockActual  = Number(producto.stock)
  const nuevoStock   = Math.max(0, stockActual + delta)
  if (nuevoStock === stockActual) return // ya esta en 0, no hay cambio

  producto.stock = nuevoStock

  try {
    await productosService.update(id, { ...producto, stock: nuevoStock })
  } catch {
    // si falla recarga los datos
    await cargar()
  }
}

onMounted(cargar)
</script>

<template>
  <div>
    <div class="page-header">
      <div class="page-header-left">
        <p class="page-eyebrow">Inventario</p>
        <h1 class="page-title">Productos</h1>
      </div>
      <button class="btn-primary" @click="abrirCrear">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        Nuevo Producto
      </button>
    </div>

    <!-- buscador -->
    <div class="search-wrapper">
      <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
      <input
        v-model="busqueda"
        class="buscador"
        placeholder="Buscar por nombre, descripción o categoría..."
      />
    </div>

    <AlertaStock :productos="productos" />

    <TablaGenerica
      :columnas="columnas"
      :datos="productosFiltrados"
      @editar="abrirEditar"
      @eliminar="eliminar"
      @cambiarStock="cambiarStock"
    />

    <ModalFormulario
      v-if="mostrarModal"
      :titulo="modoEdicion ? 'Editar Producto' : 'Nuevo Producto'"
      :campos="camposConOpciones"
      :valores="formulario"
      @guardar="guardar"
      @cancelar="cerrarModal"
    />
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;
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

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--accent);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: var(--radius);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  font-family: inherit;
  transition: background var(--transition);
  white-space: nowrap;
}

.btn-primary svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.btn-primary:hover {
  background: var(--accent-hover);
}

/* Search */
.search-wrapper {
  position: relative;
  max-width: 440px;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  pointer-events: none;
}

.buscador {
  width: 100%;
  padding: 10px 14px 10px 38px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-family: inherit;
  color: var(--text);
  background: var(--white);
  transition: border-color var(--transition), box-shadow var(--transition);
}

.buscador:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(46, 125, 111, 0.13);
}
</style>
