<script setup lang="ts">
import type { Series as Collection, Creation } from '@machi10/types'
import { usePayload } from '~/composables/usePayload'

/**
 * Page de détails d'une collection
 * Affiche la description de la collection et toutes les créations associées
 */
const route = useRoute()
const { findBySlug, getCollection, getImageUrl } = usePayload()
const { ui } = useI18n()

// On peut recevoir soit un ID, soit un slug
const slugOrId = route.params.slug as string

// 1. Récupérer les détails de la collection par son slug
const { data: collection } = await useAsyncData(`collection-${slugOrId}`, () => 
  findBySlug('series', slugOrId)
)

// 2. Récupérer les créations liées à cette collection (en utilisant l'ID de la collection trouvée)
const { data: creations } = await useAsyncData(`creations-${slugOrId}`, async () => {
  if (!collection.value) return { docs: [] }
  return await getCollection('creations', { 
    where: { 
      series: { equals: collection.value.id },
      isPublished: { equals: true }
    }
  })
})

// Helper pour extraire le texte brut du JSON Lexical
const extractLexicalText = (root: any): string => {
  if (!root) return ''
  if (typeof root === 'string') return root
  
  let text = ''
  if (root.children && Array.isArray(root.children)) {
    for (const child of root.children) {
      text += extractLexicalText(child)
    }
  }
  if (root.text) {
    text += root.text
  }
  return text
}

// SEO Metadata
useSeoMeta({
  title: collection.value?.meta?.title || collection.value?.title || 'Collection - Mama Couture',
  ogTitle: collection.value?.meta?.title || collection.value?.title,
  description: collection.value?.meta?.description || collection.value?.description,
  ogDescription: collection.value?.meta?.description || collection.value?.description,
  ogImage: collection.value?.meta?.image ? getImageUrl(collection.value.meta.image) : (collection.value?.coverImage ? getImageUrl(collection.value.coverImage) : ''),
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <main v-if="collection && collection.isPublished">
      <!-- Hero Section de la Collection -->
      <header class="h-[40vh] md:h-[60vh] relative flex items-center justify-center overflow-hidden bg-primary">
        <div class="absolute inset-0 opacity-40">
          <template v-if="collection.coverImage">
            <NuxtImg 
              :src="getImageUrl(collection.coverImage)"
              class="w-full h-full object-cover"
              placeholder
            />
          </template>
          <div v-else class="w-full h-full bg-accent/20"></div>
        </div>
        
        <div class="relative z-10 text-center px-6 max-w-4xl animate-fade-in">
          <h1 class="text-secondary text-4xl md:text-7xl font-serif mb-4 md:mb-6 leading-tight">{{ collection.title }}</h1>
          <p class="text-secondary/80 text-lg md:text-xl italic font-light max-w-2xl mx-auto">
            {{ collection.description }}
          </p>
        </div>
      </header>

      <!-- Grille des Créations -->
      <section class="container mx-auto px-6 py-10 md:py-20">
        <div class="flex flex-col md:flex-row justify-between items-baseline mb-16 border-b border-primary/5 pb-8">
          <div>
            <h2 class="text-accent text-sm uppercase tracking-widest mb-2 font-bold">{{ ui.collections.portfolioLabel }}</h2>
            <p class="text-3xl font-serif text-primary">{{ ui.collections.piecesTitle }}</p>
          </div>
          <div class="text-primary/40 text-sm italic mt-4 md:mt-0 font-serif">
            {{ creations?.docs?.length || 0 }} {{ ui.collections.uniqueCreationsLabel }}
          </div>
        </div>

        <div v-if="creations?.docs?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
          <article v-for="creation in creations.docs" :key="creation.id" class="group">
            <div class="relative aspect-square overflow-hidden bg-secondary/50 mb-6 rounded-sm shadow-sm group-hover:shadow-xl transition-all duration-500 border border-primary/5">
              <!-- Image de la Création -->
              <template v-if="creation.images?.length && creation.images[0]?.image">
                <NuxtImg 
                  :src="getImageUrl(creation.images[0].image)"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  loading="lazy"
                />
              </template>
              <div v-else class="w-full h-full border border-primary/5 flex items-center justify-center text-primary/20">
                 <span class="text-xs uppercase tracking-widest font-sans">{{ ui.collections.noImage }}</span>
              </div>
              
              <div class="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-500"></div>
              
              <div class="absolute bottom-6 left-6 right-6 flex justify-between items-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span v-if="creation.price" class="bg-secondary text-primary px-4 py-2 text-sm font-medium shadow-lg">{{ creation.price }}€</span>
                <button 
                  class="bg-primary text-secondary px-6 py-2 text-xs uppercase tracking-widest hover:bg-accent transition-colors shadow-lg"
                  :data-umami-event="`view_creation_detail`"
                  :data-umami-event-creation="creation.title"
                  :data-umami-event-collection="collection.title"
                >
                  {{ ui.collections.detailsButton }}
                </button>
              </div>
            </div>
            
            <h3 class="text-xl font-serif mb-2 text-primary group-hover:text-accent transition-colors">{{ creation.title }}</h3>
            <p class="text-primary/60 text-sm line-clamp-2 italic font-serif leading-relaxed">
              {{ creation.description && typeof creation.description === 'object' && creation.description.root ? extractLexicalText(creation.description.root) : creation.description }}
            </p>
          </article>
        </div>

        <!-- État Vide -->
        <div v-else class="text-center py-32 bg-secondary/50 rounded-sm border border-dashed border-primary/10">
          <p class="text-primary/40 font-serif italic text-lg">{{ ui.collections.emptyCollection }}</p>
          <NuxtLink to="/contact" class="inline-block mt-6 text-accent hover:text-primary transition-colors font-medium border-b border-accent">
            {{ ui.collections.inquiryLink }}
          </NuxtLink>
        </div>
        
        <!-- Bouton Retour -->
        <nav class="mt-16 md:mt-24 pt-8 md:pt-12 border-t border-primary/5 flex justify-center">
          <NuxtLink to="/collections" class="text-primary hover:text-accent font-medium tracking-widest text-sm uppercase flex items-center group transition-all">
            <span class="mr-3 transform group-hover:-translate-x-2 transition-transform duration-300">←</span>
            {{ ui.collections.backToAll }}
          </NuxtLink>
        </nav>
      </section>
    </main>

    <!-- État de chargement -->
    <div v-else class="min-h-screen flex items-center justify-center bg-secondary">
      <div class="text-center">
         <div class="w-16 h-16 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
         <p class="font-serif italic text-primary/40 text-lg">{{ ui.collections.loadingCollection }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
