<script setup lang="ts">
import type { Series as Collection, SiteSetting, UiString } from '@machi10/types'
import { usePayload } from '~/composables/usePayload'

const { getGlobals, getCollection } = usePayload()

const { data: siteSettings } = await useAsyncData<SiteSetting>('site-settings', () => getGlobals('site-settings'))
const { data: ui } = await useAsyncData<UiString>('ui-strings', () => getGlobals('ui-strings'))
const { data: collections } = await useAsyncData('collections', () => 
  getCollection('series', { where: { isPublished: { equals: true } }, limit: 4 })
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

    <section class="py-32 container mx-auto px-6 overflow-hidden">
      <div class="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-primary/5 pb-12">
        <div class="max-w-xl">
          <h3 class="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-bold flex items-center gap-3">
              <span class="w-10 h-[1px] bg-accent"></span>
              {{ ui?.collections?.title || 'Sélections' }}
          </h3>
          <h2 class="text-5xl md:text-6xl font-serif text-primary leading-tight">Nos Créations</h2>
        </div>
        <NuxtLink to="/collections" class="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-primary hover:text-accent transition-all mt-8 md:mt-0">
            <span>{{ ui?.collections?.viewAll || 'Tout Explorer' }}</span>
            <span class="w-8 h-[1px] bg-primary group-hover:bg-accent group-hover:w-12 transition-all"></span>
        </NuxtLink>
      </div>

      <div class="space-y-40">
        <div v-for="(collection, index) in (collections?.docs || [])" :key="collection.id" 
             class="flex flex-col md:items-center gap-12 lg:gap-24 group"
             :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'">
          
          <!-- Image Section -->
          <div class="w-full md:w-1/2 relative">
            <div class="absolute -top-6 -left-6 text-8xl font-serif text-primary/5 hidden lg:block select-none">
              0{{ index + 1 }}
            </div>
            <div class="relative aspect-square overflow-hidden rounded-sm bg-secondary shadow-lg group-hover:shadow-2xl transition-all duration-700">
              <template v-if="collection.coverImage">
                <NuxtImg 
                  :src="typeof collection.coverImage === 'object' ? `${useRuntimeConfig().public.payloadBaseUrl}${collection.coverImage.url}` : ''"
                  :alt="collection.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </template>
              <div v-else class="w-full h-full bg-accent/5 flex items-center justify-center">
                 <span class="text-accent/20 font-serif italic text-2xl uppercase tracking-widest">Série {{ index + 1 }}</span>
              </div>
              
              <div class="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-700"></div>
            </div>
          </div>

          <!-- Text Section -->
          <div class="w-full md:w-1/2 flex flex-col items-start" :class="index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 text-right md:items-end'">
            <span class="text-accent font-serif italic text-lg mb-4 block">Collection</span>
            <h4 class="text-4xl lg:text-5xl font-serif mb-6 text-primary leading-tight">{{ collection.title }}</h4>
            <p class="text-primary/60 text-lg font-light leading-relaxed mb-10 max-w-md" :class="index % 2 === 0 ? '' : 'md:text-right'">
              {{ collection.description }}
            </p>
            <NuxtLink :to="`/collections/${collection.id}`" class="group/btn relative inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-bold text-primary">
               <span class="relative z-10">{{ ui?.collections?.discoverButton || 'Découvrir la série' }}</span>
               <div class="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover/btn:bg-accent group-hover/btn:border-accent group-hover/btn:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
               </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Bottom View All -->
      <div class="mt-32 text-center pt-24 border-t border-primary/5">
        <NuxtLink to="/collections" class="premium-button px-12 py-5 text-sm uppercase tracking-widest font-bold">
          {{ ui?.collections?.viewAll || 'Toutes les Collections' }}
        </NuxtLink>
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
