<script setup lang="ts">
import type { ArtisanProfile } from '@machi10/types'
import { usePayload } from '~/composables/usePayload'

const { getGlobals } = usePayload()
const { data: artisan } = await useAsyncData('artisan-profile', () => getGlobals('artisan-profile'))
</script>

<template>
  <div class="py-20 container mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
      <div class="relative aspect-square bg-gray-100 overflow-hidden rounded-sm">
        <div class="absolute inset-0 bg-accent/5"></div>
        <!-- Profile Image Placeholder -->
      </div>
      
      <div>
        <h2 class="text-accent text-sm uppercase tracking-widest mb-4 font-semibold">L'Artisan</h2>
        <h1 class="text-4xl md:text-6xl font-serif mb-8">{{ artisan?.name || 'Notre Histoire' }}</h1>
        <div class="prose prose-lg text-gray-600 font-light leading-relaxed mb-10">
          <p v-if="!artisan">Chargement du profil...</p>
          <div v-else>
            <!-- If bio is a string (rich text HTML) -->
            <div v-if="typeof artisan.bio === 'string'" v-html="artisan.bio"></div>
            <!-- If bio is a Lexical object (not handled here but prevents error) -->
            <div v-else>Contenu du profil indisponible</div>
          </div>
        </div>
        
        <div class="space-y-4">
          <h4 class="font-serif text-xl italic border-b border-gray-100 pb-2">Contact & Réseaux</h4>
          <p class="text-gray-500">Email: {{ artisan?.contactEmail }}</p>
          <div class="flex space-x-6">
            <a v-for="social in artisan?.socialLinks" :key="social.platform" :href="social.url" target="_blank" class="text-black hover:text-accent transition-colors font-medium">
              {{ social.platform }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
