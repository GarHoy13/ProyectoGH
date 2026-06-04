<script setup>
import { computed } from 'vue'

const props = defineProps({
  productos: { type: Array, required: true }
})

const productosConPocoStock = computed(() => props.productos.filter((p) => p.stock < 5))
</script>

<template>
  <div v-if="productosConPocoStock.length > 0" class="alerta">
    <div class="alerta-header">
      <svg class="alerta-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
      <p class="alerta-titulo">
        Stock bajo —
        <strong>{{ productosConPocoStock.length }}
        {{ productosConPocoStock.length === 1 ? 'producto' : 'productos' }}</strong>
        con menos de 5 unidades
      </p>
    </div>
    <ul class="alerta-lista">
      <li v-for="p in productosConPocoStock" :key="p.id" class="alerta-item">
        <span class="alerta-nombre">{{ p.nombre }}</span>
        <span class="alerta-badge" :class="{ 'badge-cero': p.stock === 0 }">
          {{ p.stock === 0 ? 'Sin stock' : `${p.stock} uds.` }}
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.alerta {
  background: var(--warning-bg);
  border: 1px solid #FCD34D;
  border-left: 4px solid #D97706;
  border-radius: var(--radius);
  padding: 14px 18px 16px;
  margin-bottom: 24px;
}

.alerta-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.alerta-icon {
  width: 20px;
  height: 20px;
  color: #D97706;
  flex-shrink: 0;
}

.alerta-titulo {
  font-size: 0.875rem;
  color: var(--warning);
  font-weight: 500;
}

.alerta-titulo strong {
  font-weight: 700;
}

.alerta-lista {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.alerta-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #FCD34D;
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 0.8rem;
}

.alerta-nombre {
  font-weight: 600;
  color: #78350F;
}

.alerta-badge {
  font-weight: 700;
  color: #D97706;
  background: #FEF3C7;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.badge-cero {
  color: var(--danger);
  background: var(--danger-light);
}
</style>
