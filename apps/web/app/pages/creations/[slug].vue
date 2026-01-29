<script setup lang="ts">
import type { Creation, Series as Collection } from '@machi11/types'
import { usePayload } from '~/composables/usePayload'

const route = useRoute()
const { findBySlug, getImageUrl } = usePayload()
const { ui } = useI18n()

const slug = route.params.slug as string

// 1. Récupérer les détails de la création
const { data: creation } = await useAsyncData(`creation-${slug}`, () => 
  findBySlug('creations', slug)
)

// Helper pour extraire le texte brut du JSON Lexical (fallback pour la description courte)
const extractLexicalText = (root: any): string => {
  if (!root) return ''
  if (typeof root === 'string') return root
  let text = ''
  if (root.children && Array.isArray(root.children)) {
    for (const child of root.children) text += extractLexicalText(child)
  }
  if (root.text) text += root.text
  return text
}

// SEO Metadata
useSeoMeta({
  title: `${creation.value?.title || 'Création'} - Mama Couture`,
  ogTitle: `${creation.value?.title || 'Création'} - Mama Couture`,
  description: creation.value?.description ? extractLexicalText(creation.value.description.root) : 'Une création fait-main par Mama Couture',
})
</script>

<template>
  <div class="py-6 md:py-12 container mx-auto px-6">
    <div v-if="creation" class="animate-fade-in">
      
      <!-- Fil d'Ariane -->
      <nav class="mb-6 md:mb-8">
        <NuxtLink to="/collections" class="text-[10px] uppercase tracking-widest text-primary/40 hover:text-accent transition-colors">{{ ui.nav.collections }}</NuxtLink>
        <span class="mx-3 text-primary/20 text-xs">/</span>
        <span class="text-[10px] uppercase tracking-widest text-primary font-bold">{{ creation.title }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        <!-- Colonne Gauche: Galerie Photo -->
        <div class="relative">
          <!-- Pastille Promo (si elle existe) -->
          <div v-if="creation.promoLabel && creation.stockStatus !== 'hidden'" class="absolute top-4 right-4 z-20">
            <div class="bg-accent text-secondary px-6 py-3 shadow-2xl font-bold text-sm uppercase tracking-widest rounded-sm">
              {{ creation.promoLabel }}
            </div>
          </div>
          
          <CreationGallery :images="creation.images || []" />
        </div>

        <!-- Colonne Droite: Informations -->
        <div class="flex flex-col gap-6">
          
          <!-- En-tête -->
          <div>
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-serif text-primary mb-4 leading-tight">
              {{ creation.title }}
            </h1>
            
            <!-- Prix avec ou sans réduction -->
            <div v-if="creation.stockStatus !== 'hidden'">
              <PriceDisplay 
                :price="creation.price" 
                :promo-percentage="creation.promoPercentage"
                variant="large"
              />
            </div>
          </div>

          <!-- Badge de statut -->
          <div v-if="creation.stockStatus !== 'hidden'">
            <StockBadge 
              :status="creation.stockStatus" 
              :quantity="creation.stockQuantity"
            />
          </div>

          <!-- Description -->
          <div class="border-t border-primary/10 pt-6">
            <h2 class="text-xs uppercase tracking-[0.3em] font-bold text-primary/30 mb-3 italic">
              {{ ui.creation.historyLabel }}
            </h2>
            <div class="prose prose-primary max-w-none">
              <p class="text-base leading-relaxed text-primary/70 italic font-serif">
                {{ creation.description && typeof creation.description === 'object' && creation.description.root ? extractLexicalText(creation.description.root) : creation.description }}
              </p>
            </div>
          </div>

          <!-- Détails / Features -->
          <div class="border-t border-primary/10 pt-6">
            <h3 class="text-xs uppercase tracking-[0.3em] font-bold text-primary/30 mb-4 italic">
              {{ ui.creation.detailsLabel }}
            </h3>
            <ul class="space-y-2">
              <template v-if="creation.features && creation.features.length">
                <li v-for="(feature, idx) in creation.features" :key="idx" class="flex items-start gap-3 text-sm text-primary/60 italic font-serif">
                  <span class="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2 flex-shrink-0"></span>
                  <span>{{ feature.label }}</span>
                </li>
              </template>
              <template v-else>
                <li class="flex items-start gap-3 text-sm text-primary/60 italic font-serif">
                  <span class="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2 flex-shrink-0"></span>
                  <span>{{ ui.creation.handMade }}</span>
                </li>
              </template>
            </ul>
          </div>

          <!-- Bouton de Réservation (uniquement si pas portfolio) -->
          <div v-if="creation.stockStatus !== 'hidden'" class="border-t border-primary/10 pt-6">
            <NuxtLink 
              :to="`/contact?subject=${ui.creation.preorderButton}: ${creation.title}&message=Bonjour, je souhaite réserver ou avoir plus d'informations sur la création : ${creation.title}.`"
              class="premium-button w-full text-center flex items-center justify-center gap-3 py-4 shadow-xl hover:shadow-2xl active:scale-95 transition-all group"
              :data-umami-event="`preorder_click`"
              :data-umami-event-creation="creation.title"
            >
              <span class="text-sm uppercase tracking-[0.3em] font-bold">{{ ui.creation.preorderButton }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NuxtLink>
            
            <p class="mt-3 text-[10px] text-center text-primary/30 uppercase tracking-widest font-bold">
              {{ ui.creation.securityLabel }}
            </p>
          </div>

        </div>
      </div>

    </div>

    <!-- État d'erreur -->
    <div v-else class="text-center py-40">
       <h2 class="text-4xl font-serif text-primary/40 italic">{{ ui.creation.errorTitle }}</h2>
       <NuxtLink to="/collections" class="inline-block mt-8 text-accent border-b border-accent pb-1 font-bold tracking-widest uppercase text-xs">{{ ui.creation.backToCollections }}</NuxtLink>
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
