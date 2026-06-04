<script setup>
import { ref, computed, onMounted } from 'vue'
import TablaGenerica from '../components/TablaGenerica.vue'
import ModalFormulario from '../components/ModalFormulario.vue'
import { categoriasService, proveedoresService } from '../services/api'

const categorias = ref([])
const proveedores = ref([])
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const formulario = ref({})

const columnas = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'proveedorNombre', label: 'Proveedor' }
]

const categoriasConProveedor = computed(() =>
  categorias.value.map((c) => ({
    ...c,
    proveedorNombre:
      proveedores.value.find((p) => String(p.id) === String(c.proveedorId))?.nombre || '—'
  }))
)

const camposConOpciones = computed(() => [
  { key: 'nombre', label: 'Nombre', tipo: 'text' },
  { key: 'descripcion', label: 'Descripción', tipo: 'textarea' },
  {
    key: 'proveedorId',
    label: 'Proveedor',
    tipo: 'select',
    opciones: proveedores.value.map((p) => ({ value: p.id, label: p.nombre }))
  }
])

const cargar = async () => {
  const [r1, r2] = await Promise.all([categoriasService.getAll(), proveedoresService.getAll()])
  categorias.value = r1.data
  proveedores.value = r2.data
}

const abrirCrear = () => {
  formulario.value = {
    nombre: '',
    descripcion: '',
    proveedorId: proveedores.value[0]?.id ?? null
  }
  modoEdicion.value = false
  mostrarModal.value = true
}

const abrirEditar = (fila) => {
  formulario.value = {
    id: fila.id,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    proveedorId: String(fila.proveedorId)
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
    proveedorId: datos.proveedorId
  }
  if (modoEdicion.value) {
    await categoriasService.update(datos.id, payload)
  } else {
    await categoriasService.create(payload)
  }
  cerrarModal()
  await cargar()
}

const eliminar = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta categoría?')) {
    await categoriasService.remove(id)
    await cargar()
  }
}

onMounted(cargar)
</script>

<template>
  <div>
    <div class="page-header">
      <div class="page-header-left">
        <p class="page-eyebrow">Gestión</p>
        <h1 class="page-title">Categorías</h1>
      </div>
      <button class="btn-primary" @click="abrirCrear">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        Nueva Categoría
      </button>
    </div>

    <TablaGenerica
      :columnas="columnas"
      :datos="categoriasConProveedor"
      @editar="abrirEditar"
      @eliminar="eliminar"
    />

    <ModalFormulario
      v-if="mostrarModal"
      :titulo="modoEdicion ? 'Editar Categoría' : 'Nueva Categoría'"
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
  margin-bottom: 24px;
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
</style>
