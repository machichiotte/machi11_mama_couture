<template>
  <!-- Variante Card (pour les grilles) -->
  <div v-if="variant === 'card'">
    <div v-if="price" class="bg-secondary text-primary px-4 py-2.5 shadow-xl rounded-sm border-2 border-primary/10">
      <!-- Prix avec réduction -->
      <div v-if="hasPromo" class="flex flex-col gap-1">
        <div class="text-sm line-through text-primary/50 font-medium">
          {{ price }} €
        </div>
        <div class="text-xl font-bold text-accent">
          {{ discountedPrice }} €
        </div>
      </div>
      
      <!-- Prix normal -->
      <div v-else class="text-xl font-bold">
        {{ price }} €
      </div>
    </div>
    
    <!-- Sur devis -->
    <div v-else class="bg-secondary text-primary px-4 py-2 text-xs uppercase tracking-widest font-bold shadow-xl rounded-sm border-2 border-primary/10">
      Sur devis
    </div>
  </div>

  <!-- Variante Large (pour la page de détail) -->
  <div v-else>
    <div v-if="price">
      <!-- Prix avec réduction -->
      <div v-if="hasPromo" class="flex flex-col gap-2">
        <div class="text-xl line-through text-primary/40 font-light italic font-serif">
          {{ price }} €
        </div>
        <div class="text-4xl font-serif text-accent font-light italic">
          {{ discountedPrice }} €
        </div>
      </div>
      
      <!-- Prix normal -->
      <div v-else class="text-3xl font-light text-accent italic font-serif">
        {{ price }} €
      </div>
    </div>
    
    <!-- Sur devis -->
    <div v-else class="text-[10px] uppercase tracking-widest text-primary/30 font-bold italic">
      Sur devis
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  price?: number | null
  promoPercentage?: number | null
  variant?: 'card' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'card'
})

const hasPromo = computed(() => {
  return props.price && props.promoPercentage && props.promoPercentage > 0
})

const discountedPrice = computed(() => {
  if (!props.price || !props.promoPercentage) return props.price
  const reduction = props.price * (props.promoPercentage / 100)
  return Math.round((props.price - reduction) * 100) / 100 // Arrondi à 2 décimales
})
</script>
