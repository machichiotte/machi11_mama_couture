<script setup lang="ts">
import type { Series as Collection } from '@machi11/types'
import { usePayload } from '~/composables/usePayload'

/**
 * Page de listing des collections
 * Affiche toutes les séries thématiques publiées
 */
const { getCollection, getImageUrl } = usePayload()
const { ui } = useI18n()

// Récupérer toutes les collections triées par l'ordre défini dans Payload
const { data: collections } = await useAsyncData('all-collections', () => 
  getCollection('series', { 
    where: { isPublished: { equals: true } }, 
    sort: 'order',
    limit: 100 
  })
)

useSeoMeta({
  title: `${ui.value.collections.title} - Mama Couture`,
  ogTitle: `${ui.value.collections.title} - Mama Couture`,
  description: ui.value.collections.description,
  ogDescription: ui.value.collections.description,
})
</script>

<template>
  <div class="py-12 md:py-24 container mx-auto px-6">
    <header class="max-w-3xl mb-12 md:mb-20 animate-fade-in">
      <h1 class="text-4xl md:text-6xl font-serif mb-6 md:mb-8 leading-tight text-primary">{{ ui.collections.title }}</h1>
      <div class="w-20 h-1 bg-accent mb-6 md:mb-8"></div>
      <p class="text-primary/60 text-xl leading-relaxed font-light italic">
        {{ ui.collections.description }}
      </p>
    </header>

    <div v-if="collections?.docs?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-10 md:gap-y-16">
      <NuxtLink 
        v-for="(collection, index) in collections.docs" 
        :key="collection.id" 
        :to="`/collections/${collection.slug || collection.id}`"
        class="group cursor-pointer block"
        :style="{ animationDelay: `${index * 0.1}s` }"
        :data-umami-event="`view_collection_list`"
        :data-umami-event-collection="collection.title"
      >
        <div class="relative aspect-square overflow-hidden mb-4 md:mb-8 bg-secondary/50 rounded-sm shadow-sm group-hover:shadow-2xl transition-all duration-700 border border-primary/5">
          <!-- Image de Couverture -->
          <template v-if="collection.coverImage">
            <NuxtImg 
              :src="getImageUrl(collection.coverImage)"
              :alt="collection.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              loading="lazy"
            />
          </template>
          <div v-else class="w-full h-full bg-accent/5 flex items-center justify-center">
             <span class="text-accent/20 font-serif italic text-2xl uppercase tracking-widest">{{ ui.collections.noImage }} No. {{ index + 1 }}</span>
          </div>

          <div class="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
          
          <!-- Badge Explorer -->
          <div class="absolute bottom-10 left-10 right-10 flex justify-center items-center">
            <span class="premium-button text-xs px-8 py-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 shadow-xl">
              {{ ui.collections.exploreLabel }}
            </span>
          </div>
        </div>
        
        <h2 class="text-3xl font-serif mb-3 text-primary group-hover:text-accent transition-colors duration-300">{{ collection.title }}</h2>
        <p class="text-primary/40 font-light italic leading-relaxed line-clamp-2 max-w-lg">{{ collection.description }}</p>
      </NuxtLink>
    </div>

    <div v-else class="text-center py-32 bg-secondary/50 rounded-lg border border-dashed border-primary/10">
      <p class="text-primary/40 font-serif text-2xl italic">{{ ui.collections.noCollections }}</p>
      <NuxtLink to="/contact" class="inline-block mt-8 premium-button px-10">{{ ui.collections.notifyMe }}</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
