<script setup>
defineProps({
  columnas: { type: Array, required: true },
  datos: { type: Array, required: true }
})

defineEmits(['editar', 'eliminar', 'cambiarStock'])

function stockClass(stock) {
  const n = Number(stock)
  if (n === 0) return 'stock-cero'
  if (n < 5)  return 'stock-bajo'
  return 'stock-ok'
}
</script>

<template>
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th v-for="col in columnas" :key="col.key">{{ col.label }}</th>
          <th class="th-acciones">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="datos.length === 0">
          <td :colspan="columnas.length + 1" class="empty">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 2H4a2 2 0 00-2 2v3a2 2 0 001 1.72V20a2 2 0 002 2h14a2 2 0 002-2V8.72A2 2 0 0022 7V4a2 2 0 00-2-2zm-5 12H9v-2h6v2zm3-8H6V4h12v2z"/>
            </svg>
            Sin registros disponibles
          </td>
        </tr>
        <tr v-else v-for="fila in datos" :key="fila.id">
          <td v-for="col in columnas" :key="col.key">

            <!-- Estado activo/inactivo -->
            <template v-if="col.tipo === 'boolean'">
              <span :class="fila[col.key] ? 'badge badge-activo' : 'badge badge-inactivo'">
                <span class="badge-dot"></span>
                {{ fila[col.key] ? 'Activo' : 'Inactivo' }}
              </span>
            </template>

            <!-- Control de stock con botones +/- -->
            <template v-else-if="col.tipo === 'stock-control'">
              <div class="stock-control">
                <button
                  class="btn-stock btn-minus"
                  @click.stop="$emit('cambiarStock', fila.id, -1)"
                  :disabled="Number(fila[col.key]) <= 0"
                  title="Reducir stock"
                >−</button>
                <span class="stock-num" :class="stockClass(fila[col.key])">
                  {{ fila[col.key] }}
                </span>
                <button
                  class="btn-stock btn-plus"
                  @click.stop="$emit('cambiarStock', fila.id, 1)"
                  title="Aumentar stock"
                >+</button>
              </div>
            </template>

            <!-- Celda de texto normal -->
            <template v-else>{{ fila[col.key] }}</template>

          </td>
          <td class="td-acciones">
            <button class="btn-accion btn-editar" @click="$emit('editar', fila)" title="Editar">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Editar
            </button>
            <button class="btn-accion btn-eliminar" @click="$emit('eliminar', fila.id)" title="Eliminar">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
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
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  white-space: nowrap;
}

.th-acciones {
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

/* Empty state */
.empty {
  text-align: center;
  color: var(--text-muted);
  padding: 52px 24px;
  font-size: 0.875rem;
}

.empty-icon {
  width: 36px;
  height: 36px;
  color: var(--border);
  display: block;
  margin: 0 auto 12px;
}

/* badges de estado */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.74rem;
  font-weight: 600;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.badge-activo  { background: #ECFDF5; color: #065F46; }
.badge-activo  .badge-dot { background: #10B981; }
.badge-inactivo { background: #FEF2F2; color: #991B1B; }
.badge-inactivo .badge-dot { background: #EF4444; }

/* control de stock */
.stock-control {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-stock {
  width: 22px;
  height: 22px;
  border-radius: 5px;
  border: 1.5px solid var(--border);
  background: #F8FAFC;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition), border-color var(--transition), opacity var(--transition);
  flex-shrink: 0;
  padding: 0;
}

.btn-minus {
  color: var(--danger);
  border-color: #FECACA;
}
.btn-minus:hover:not(:disabled) {
  background: var(--danger-bg);
  border-color: var(--danger);
}

.btn-plus {
  color: var(--accent);
  border-color: #A7F3D0;
}
.btn-plus:hover:not(:disabled) {
  background: var(--accent-light);
  border-color: var(--accent);
}

.btn-stock:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.stock-num {
  font-weight: 700;
  font-size: 0.9rem;
  min-width: 28px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.stock-ok   { color: #2E7D6F; }   /* verde acento */
.stock-bajo { color: #D97706; }   /* naranja */
.stock-cero { color: var(--danger); } /* rojo */

/* botones de accion */
.td-acciones {
  text-align: right;
  white-space: nowrap;
}

.btn-accion {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: none;
  padding: 5px 11px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 600;
  font-family: inherit;
  transition: opacity var(--transition), transform var(--transition);
}

.btn-accion svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

.btn-accion + .btn-accion {
  margin-left: 6px;
}

.btn-editar  { background: #EFF6FF; color: #1D4ED8; }
.btn-eliminar { background: #FEF2F2; color: #DC2626; }

.btn-accion:hover {
  opacity: 0.78;
  transform: translateY(-1px);
}
</style>
