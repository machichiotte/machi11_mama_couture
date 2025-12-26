<script setup lang="ts">
import type { Series as Collection, SiteSetting, UiString } from '@machi10/types'
import { usePayload } from '~/composables/usePayload'

const { getGlobals, getCollection } = usePayload()

const { data: siteSettings } = await useAsyncData<SiteSetting>('site-settings', () => getGlobals('site-settings'))
const { data: ui } = await useAsyncData<UiString>('ui-strings', () => getGlobals('ui-strings'))
const { data: collections } = await useAsyncData('collections', () => 
  getCollection('series', { where: { isPublished: { equals: true } } })
)
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-[65vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-secondary text-primary">
      <div class="absolute inset-0">
        <NuxtImg
          v-if="siteSettings?.heroImage && typeof siteSettings.heroImage === 'object'"
          :src="`${useRuntimeConfig().public.payloadBaseUrl}${siteSettings.heroImage.url}`"
          :alt="siteSettings.heroImage.alt || 'Atelier Couture'"
          class="w-full h-full object-cover" 
        />
        <div class="absolute inset-0 bg-white/35"></div>
      </div>
      
      <div class="relative z-10 text-center px-6 max-w-4xl animate-fade-in">
        <h1 class="text-5xl md:text-7xl font-serif mb-6 leading-tight text-primary">
          {{ siteSettings?.siteTitle || 'Machi11 Couture' }}
        </h1>
        <h2 class="text-lg uppercase tracking-[0.3em] text-primary mb-8 font-bold">
          {{ siteSettings?.tagline || ui?.hero.exploreButton }}
        </h2>
        <p class="text-xl text-primary/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          {{ siteSettings?.seoDescription || '' }}
        </p>
        <NuxtLink to="/collections" class="premium-button text-lg px-10 py-4 font-medium transition-all duration-500">
          {{ ui?.hero.exploreButton || 'Explorer' }}
        </NuxtLink>
      </div>
    </section>

    <!-- Collections Grid -->
    <section class="py-24 container mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-end mb-16">
        <div>
          <h3 class="text-accent text-sm uppercase tracking-widest mb-2 font-semibold">
              {{ ui?.collections?.title || 'Nos Collections' }}
          </h3>
          <h2 class="text-4xl font-serif">{{ 'Nos Créations' }}</h2>
        </div>
        <NuxtLink to="/collections" class="text-sm font-medium border-b border-primary pb-1 hover:text-accent hover:border-accent transition-all">
            {{ ui?.collections?.viewAll || 'Voir tout' }}
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <div v-for="collection in (collections?.docs || [])" :key="collection.id" class="group">
          <div class="relative aspect-square overflow-hidden rounded-sm mb-6 bg-secondary/50">
            <template v-if="collection.coverImage">
              <NuxtImg 
                :src="typeof collection.coverImage === 'object' ? `${useRuntimeConfig().public.payloadBaseUrl}${collection.coverImage.url}` : ''"
                :alt="collection.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </template>
            <div v-else class="w-full h-full bg-accent/10 flex items-center justify-center">
              <span class="text-accent/30 font-serif italic">{{ ui?.collections?.noImage }}</span>
            </div>
            
            <div class="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-all duration-700"></div>
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
               <NuxtLink :to="`/collections/${collection.id}`" class="premium-button text-sm px-8">
                   {{ ui?.collections?.discoverButton || 'Découvrir' }}
               </NuxtLink>
            </div>
          </div>
          <h4 class="text-xl font-serif mb-2">{{ collection.title }}</h4>
          <p class="text-primary/60 text-sm italic">{{ collection.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
