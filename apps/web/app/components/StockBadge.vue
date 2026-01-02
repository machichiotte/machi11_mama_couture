<template>
  <div v-if="status && status !== 'hidden'" :class="badgeClasses">
    <span class="badge-icon">{{ badgeIcon }}</span>
    <span class="badge-text">{{ badgeText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status?: 'in-stock' | 'sold' | 'on-order' | 'hidden'
  quantity?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  status: 'hidden'
})

const badgeConfig = computed(() => {
  switch (props.status) {
    case 'in-stock':
      return {
        icon: '✅',
        text: props.quantity && props.quantity > 0 
          ? `${props.quantity} en stock` 
          : 'En stock',
        class: 'badge-in-stock'
      }
    case 'sold':
      return {
        icon: '❌',
        text: 'Vendu',
        class: 'badge-sold'
      }
    case 'on-order':
      return {
        icon: '📦',
        text: 'Sur commande',
        class: 'badge-on-order'
      }
    default:
      return null
  }
})

const badgeIcon = computed(() => badgeConfig.value?.icon || '')
const badgeText = computed(() => badgeConfig.value?.text || '')
const badgeClasses = computed(() => [
  'stock-badge',
  badgeConfig.value?.class || ''
])
</script>

<style scoped>
.stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.badge-icon {
  font-size: 1rem;
  line-height: 1;
}

.badge-text {
  line-height: 1;
}

/* En stock - Vert vibrant */
.badge-in-stock {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.badge-in-stock:hover {
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  transform: translateY(-1px);
}

/* Vendu - Rouge élégant */
.badge-sold {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.badge-sold:hover {
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  transform: translateY(-1px);
}

/* Sur commande - Bleu professionnel */
.badge-on-order {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.badge-on-order:hover {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

/* Animation d'apparition */
.stock-badge {
  animation: fadeInScale 0.3s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
