<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  titulo: { type: String, default: 'Formulario' },
  campos: { type: Array, required: true },
  valores: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['guardar', 'cancelar'])

const form = reactive({})

watch(
  () => props.valores,
  (nuevos) => {
    Object.keys(form).forEach((k) => delete form[k])
    Object.assign(form, nuevos)
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="modal-overlay" @click.self="emit('cancelar')">
    <div class="modal">
      <!-- Header -->
      <div class="modal-header">
        <h2>{{ titulo }}</h2>
        <button class="modal-close" @click="emit('cancelar')" title="Cerrar">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <!-- Body / Form -->
      <form @submit.prevent="emit('guardar', { ...form })" class="modal-body">
        <div v-for="campo in campos" :key="campo.key" class="campo">
          <label :for="campo.key">{{ campo.label }}</label>

          <template v-if="campo.tipo === 'boolean'">
            <select :id="campo.key" v-model="form[campo.key]">
              <option :value="true">Activo</option>
              <option :value="false">Inactivo</option>
            </select>
          </template>

          <template v-else-if="campo.tipo === 'select'">
            <select :id="campo.key" v-model="form[campo.key]">
              <option v-for="op in campo.opciones" :key="op.value" :value="op.value">
                {{ op.label }}
              </option>
            </select>
          </template>

          <template v-else-if="campo.tipo === 'textarea'">
            <textarea :id="campo.key" v-model="form[campo.key]" rows="3"></textarea>
          </template>

          <template v-else>
            <input :id="campo.key" :type="campo.tipo || 'text'" v-model="form[campo.key]" />
          </template>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="emit('cancelar')">Cancelar</button>
          <button type="submit" class="btn-save">Guardar cambios</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal {
  background: var(--white);
  border-radius: 12px;
  width: 520px;
  max-width: 95vw;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--primary);
  padding: 18px 24px;
}

.modal-header h2 {
  color: white;
  font-size: 0.97rem;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  background: rgba(255, 255, 255, 0.14);
  border-radius: 6px;
  cursor: pointer;
  color: white;
  transition: background var(--transition);
  flex-shrink: 0;
}

.modal-close svg {
  width: 16px;
  height: 16px;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.26);
}

/* Body */
.modal-body {
  padding: 24px;
}

.campo {
  margin-bottom: 18px;
}

label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

input,
select,
textarea {
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--text);
  background: var(--white);
  transition: border-color var(--transition), box-shadow var(--transition);
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(46, 125, 111, 0.13);
}

textarea {
  resize: vertical;
}

/* Footer actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.btn-cancel,
.btn-save {
  padding: 9px 20px;
  border-radius: var(--radius);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  font-family: inherit;
  transition: opacity var(--transition), background var(--transition);
}

.btn-cancel {
  background: #F1F5F9;
  color: var(--text-muted);
  border: 1.5px solid var(--border);
}

.btn-cancel:hover {
  background: var(--border);
}

.btn-save {
  background: var(--accent);
  color: white;
  border: none;
}

.btn-save:hover {
  background: var(--accent-hover);
}
</style>
