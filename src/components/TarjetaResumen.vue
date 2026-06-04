<script setup>
defineProps({
  titulo: { type: String, required: true },
  valor: { type: [String, Number], required: true },
  color: { type: String, default: '#2E7D6F' }
})
</script>

<template>
  <div class="tarjeta" :style="{ '--card-accent': color }">
    <div class="tarjeta-icono">
      <slot name="icono" />
    </div>
    <div class="tarjeta-info">
      <p class="tarjeta-titulo">{{ titulo }}</p>
      <p class="tarjeta-valor">{{ valor }}</p>
    </div>
  </div>
</template>

<style scoped>
.tarjeta {
  background: var(--white);
  border-radius: var(--radius);
  padding: 22px 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--card-accent, var(--accent));
  transition: transform var(--transition), box-shadow var(--transition);
}

.tarjeta:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.tarjeta-icono {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #F0F7F6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--card-accent, var(--accent));
}

.tarjeta-icono :deep(svg) {
  width: 24px;
  height: 24px;
}

.tarjeta-titulo {
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-weight: 600;
  margin-bottom: 5px;
}

.tarjeta-valor {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text);
  line-height: 1;
  letter-spacing: -1px;
}
</style>
