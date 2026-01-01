<script setup lang="ts">
import type { Creation, Series as Collection } from '@machi10/types'
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
      <nav class="mb-6 md:mb-10">
        <NuxtLink to="/collections" class="text-[10px] uppercase tracking-widest text-primary/40 hover:text-accent transition-colors">{{ ui.nav.collections }}</NuxtLink>
        <span class="mx-3 text-primary/20 text-xs">/</span>
        <span class="text-[10px] uppercase tracking-widest text-primary font-bold">{{ creation.title }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        
        <!-- Colonne Gauche: Galerie Photo Premium -->
        <div class="lg:col-span-5">
          <CreationGallery :images="creation.images || []" />
        </div>

        <!-- Colonne Droite: Informations -->
        <div class="lg:col-span-7 flex flex-col">
          <header class="mb-6 border-b border-primary/5 pb-6">
            <h1 class="text-3xl md:text-5xl font-serif text-primary mb-4 leading-tight">{{ creation.title }}</h1>
            <div v-if="creation.price" class="text-2xl font-light text-accent italic font-serif">
              {{ creation.price }}€
            </div>
            <div v-else class="text-[10px] uppercase tracking-widest text-primary/30 font-bold italic">
              {{ ui.creation.onQuote }}
            </div>
          </header>

          <div class="space-y-6 mb-8">
            <div>
               <h2 class="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/30 mb-3 italic">{{ ui.creation.historyLabel }}</h2>
               <div class="prose prose-primary prose-lg font-light leading-relaxed text-primary/70">
                 <!-- On affiche le RichText Lexical si dispo -->
                 <p class="whitespace-pre-wrap italic font-serif leading-relaxed">
                   {{ creation.description && typeof creation.description === 'object' && creation.description.root ? extractLexicalText(creation.description.root) : creation.description }}
                 </p>
               </div>
            </div>

            <div class="flex flex-col gap-4">
               <h3 class="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/30 mb-2 italic">{{ ui.creation.detailsLabel }}</h3>
               <ul class="space-y-3">
                 <template v-if="creation.features && creation.features.length">
                   <li v-for="(feature, idx) in creation.features" :key="idx" class="flex items-center gap-4 text-sm text-primary/60 italic font-serif">
                     <span class="w-1.5 h-1.5 rounded-full bg-accent/40"></span>
                     {{ feature.label }}
                   </li>
                 </template>
                 <template v-else>
                   <li class="flex items-center gap-4 text-sm text-primary/60 italic font-serif">
                     <span class="w-1.5 h-1.5 rounded-full bg-accent/40"></span>
                     {{ ui.creation.handMade }}
                   </li>
                 </template>
               </ul>
            </div>
          </div>

          <!-- Bouton de Réservation (Conversion CTA) -->
          <NuxtLink 
            :to="`/contact?subject=${ui.creation.preorderButton}: ${creation.title}&message=Bonjour, je souhaite réserver ou avoir plus d'informations sur la création : ${creation.title}.`"
            class="premium-button text-center flex items-center justify-center gap-4 py-4 shadow-xl active:scale-95 transition-transform"
            :data-umami-event="`preorder_click`"
            :data-umami-event-creation="creation.title"
          >
            <span class="text-sm uppercase tracking-[0.3em] font-bold">{{ ui.creation.preorderButton }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </NuxtLink>

          <p class="mt-4 text-[10px] text-center text-primary/30 uppercase tracking-widest font-bold">
            {{ ui.creation.securityLabel }}
          </p>
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
