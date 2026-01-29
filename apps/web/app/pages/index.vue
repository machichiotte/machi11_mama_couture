<script setup lang="ts">
import type { Series as Collection, SiteSetting } from '@machi11/types'
import { usePayload } from '~/composables/usePayload'

const { getGlobals, getCollection, getImageUrl } = usePayload()
const { ui } = useI18n()

const { data: siteSettings } = await useAsyncData<SiteSetting>('site-settings', () => getGlobals('site-settings'))
const { data: collections } = await useAsyncData('collections', () => 
  getCollection('series', { where: { isPublished: { equals: true } }, limit: 4 })
)

// SEO Metadata
useSeoMeta({
  title: siteSettings.value?.meta?.title || siteSettings.value?.siteTitle || 'Mama Couture',
  ogTitle: siteSettings.value?.meta?.title || siteSettings.value?.siteTitle || 'Mama Couture',
  description: siteSettings.value?.meta?.description || siteSettings.value?.tagline,
  ogDescription: siteSettings.value?.meta?.description || siteSettings.value?.tagline,
  ogImage: siteSettings.value?.meta?.image ? getImageUrl(siteSettings.value.meta.image) : (siteSettings.value?.heroImage ? getImageUrl(siteSettings.value.heroImage) : ''),
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-[65vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-secondary transition-colors duration-500">
      <div class="absolute inset-0">
        <NuxtImg
          v-if="siteSettings?.heroImage"
          :src="getImageUrl(siteSettings.heroImage)"
          :alt="typeof siteSettings.heroImage === 'object' ? (siteSettings.heroImage.alt || 'Atelier Couture') : 'Atelier Couture'"
          class="w-full h-full object-cover opacity-30 dark:opacity-100 transition-opacity duration-500" 
        />
        <!-- Filtre noir uniquement en mode sombre pour l'effet "Luxury Midnight" -->
        <div class="absolute inset-0 bg-transparent dark:bg-black/60 transition-colors duration-500"></div>
      </div>
      
      <div class="relative z-10 text-center px-6 max-w-4xl animate-fade-in banner-text-protected">
        <h1 class="text-5xl md:text-7xl font-serif mb-6 leading-tight text-primary">
          {{ siteSettings?.siteTitle || 'Machi11 Couture' }}
        </h1>
        <h2 class="text-lg uppercase tracking-[0.3em] text-primary mb-8 font-bold">
          {{ siteSettings?.tagline || ui.hero.exploreButton }}
        </h2>
        <p class="text-xl text-primary/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          {{ siteSettings?.seo?.description || '' }}
        </p>
        <NuxtLink to="/collections" class="premium-button text-lg px-10 py-4 font-medium transition-all duration-500">
          {{ ui.hero.exploreButton }}
        </NuxtLink>
      </div>
    </section>

    <section class="py-4 md:py-32 container mx-auto px-6 overflow-hidden">
      <div class="mb-6 md:mb-24 border-b border-primary/5 pb-8 md:pb-12 text-center md:text-left">
        <div class="max-w-xl mx-auto md:mx-0">
          <h3 class="text-accent text-xs uppercase tracking-[0.3em] mb-4 font-bold flex items-center justify-center md:justify-start gap-3">
              <span class="w-10 h-[1px] bg-accent"></span>
              {{ ui.collections.title }}
          </h3>
          <h2 class="text-4xl md:text-6xl font-serif text-primary leading-tight">{{ ui.collections.title }}</h2>
        </div>
      </div>

      <div class="space-y-10 md:space-y-40">
        <div v-for="(collection, index) in (collections?.docs || [])" :key="collection.id" 
             class="flex flex-col md:items-center gap-8 md:gap-12 lg:gap-24 group"
             :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'">
          
          <!-- Image Section -->
          <div class="w-full md:w-1/2 relative">
            <div class="relative aspect-square overflow-hidden rounded-sm bg-secondary shadow-lg group-hover:shadow-2xl transition-all duration-700">
              <template v-if="collection.coverImage">
                <NuxtImg 
                  :src="getImageUrl(collection.coverImage)"
                  :alt="collection.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </template>
              <div v-else class="w-full h-full bg-accent/5 flex items-center justify-center">
                 <span class="text-accent/20 font-serif italic text-2xl uppercase tracking-widest">{{ ui.collections.noImage }} {{ index + 1 }}</span>
              </div>
              
              <div class="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-700"></div>
            </div>
          </div>

          <!-- Text Section -->
          <div class="w-full md:w-1/2 flex flex-col items-start" :class="index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right md:items-end'">
            <span class="text-accent font-serif italic text-base md:text-lg mb-2 md:mb-4 block">Collection</span>
            <h4 class="text-3xl lg:text-5xl font-serif mb-2 md:mb-6 text-primary leading-tight">{{ collection.title }}</h4>
            <p v-if="collection.description" class="text-primary/60 text-base md:text-lg font-light leading-relaxed mb-4 md:mb-10 max-w-md" :class="index % 2 === 0 ? '' : 'md:text-right'">
              {{ collection.description }}
            </p>
            <NuxtLink 
              :to="`/collections/${collection.slug || collection.id}`" 
              class="group/btn relative inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-bold text-primary"
              :data-umami-event="`view_collection_home`"
              :data-umami-event-collection="collection.title"
            >
               <span class="relative z-10">{{ ui.collections.discoverButton }}</span>
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
      <div class="mt-4 md:mt-32 text-center pt-2 md:pt-24 border-t border-primary/5">
        <NuxtLink to="/collections" class="premium-button px-12 py-5 text-sm uppercase tracking-widest font-bold">
          {{ ui.collections.viewAll }}
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
