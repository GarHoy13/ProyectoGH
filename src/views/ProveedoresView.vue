<script setup>
import { ref, onMounted } from 'vue'
import TablaGenerica from '../components/TablaGenerica.vue'
import ModalFormulario from '../components/ModalFormulario.vue'
import { proveedoresService } from '../services/api'

const proveedores = ref([])
const mostrarModal = ref(false)
const modoEdicion = ref(false)
const formulario = ref({})

const columnas = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'email', label: 'Email' },
  { key: 'activo', label: 'Estado', tipo: 'boolean' }
]

const campos = [
  { key: 'nombre', label: 'Nombre', tipo: 'text' },
  { key: 'telefono', label: 'Teléfono', tipo: 'text' },
  { key: 'email', label: 'Email', tipo: 'email' },
  { key: 'activo', label: 'Estado', tipo: 'boolean' }
]

const cargar = async () => {
  const { data } = await proveedoresService.getAll()
  proveedores.value = data
}

const abrirCrear = () => {
  formulario.value = { nombre: '', telefono: '', email: '', activo: true }
  modoEdicion.value = false
  mostrarModal.value = true
}

const abrirEditar = (fila) => {
  formulario.value = { ...fila }
  modoEdicion.value = true
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const guardar = async (datos) => {
  if (modoEdicion.value) {
    await proveedoresService.update(datos.id, datos)
  } else {
    await proveedoresService.create(datos)
  }
  cerrarModal()
  await cargar()
}

const eliminar = async (id) => {
  if (confirm('¿Estás seguro de eliminar este proveedor?')) {
    await proveedoresService.remove(id)
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
        <h1 class="page-title">Proveedores</h1>
      </div>
      <button class="btn-primary" @click="abrirCrear">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        Nuevo Proveedor
      </button>
    </div>

    <TablaGenerica
      :columnas="columnas"
      :datos="proveedores"
      @editar="abrirEditar"
      @eliminar="eliminar"
    />

    <ModalFormulario
      v-if="mostrarModal"
      :titulo="modoEdicion ? 'Editar Proveedor' : 'Nuevo Proveedor'"
      :campos="campos"
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
