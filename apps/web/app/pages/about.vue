<script setup lang="ts">
import type { ArtisanProfile, UiString } from '@machi10/types'
import { usePayload } from '~/composables/usePayload'
import { useRichText } from '~/composables/useRichText'

const { getGlobals } = usePayload()
const { serialize } = useRichText()
const { data: artisan } = await useAsyncData('artisan-profile', () => getGlobals('artisan-profile'))
const { data: ui } = await useAsyncData<UiString>('ui-strings', () => getGlobals('ui-strings'))
</script>

<template>
  <div class="py-12 md:py-20 container mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start md:items-center">
      <!-- Image Section -->
      <div class="relative w-full max-w-xl mx-auto aspect-square bg-secondary/50 overflow-hidden rounded-sm border border-primary/5 shadow-lg">
        <div class="absolute inset-0 bg-accent/5 z-10"></div>
        <!-- Profile Image Placeholder -->
        <NuxtImg 
          v-if="artisan?.profileImage && typeof artisan.profileImage === 'object'"
          :src="`${useRuntimeConfig().public.payloadBaseUrl}${artisan.profileImage.url}`"
          class="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-primary/20 bg-secondary">
          <span class="font-serif italic text-lg">Photo de l'artisan</span>
        </div>
      </div>
      
      <!-- Content Section -->
      <div class="flex flex-col">
        <h2 class="text-accent text-sm uppercase tracking-[0.2em] mb-4 font-semibold flex items-center gap-4">
          <span class="w-8 h-[1px] bg-accent"></span>
          L'Âme de l'Atelier
        </h2>
        
        <h1 class="text-4xl lg:text-5xl font-serif mb-8 text-primary leading-tight">
          {{ artisan?.name || 'Notre Histoire' }}
        </h1>
        
        <div class="prose prose-lg text-primary/80 font-light leading-relaxed mb-10 max-w-none">
          <p v-if="!artisan">{{ ui?.common?.loading || 'Chargement...' }}</p>
          <div v-else>
            <!-- If bio is a string (rich text HTML) -->
            <div v-if="typeof artisan.bio === 'string'" v-html="artisan.bio"></div>
            <!-- If bio is a Lexical object -->
            <div v-else-if="artisan.bio" v-html="serialize(artisan.bio)"></div>
          </div>
        </div>
        
        <div class="border-t border-primary/10 pt-6">
          <h4 class="font-serif text-xl italic text-primary mb-4 flex items-center gap-2">
             <span>{{ ui?.common?.contactTitle || 'Me Contacter' }}</span>
          </h4>
          <div class="flex flex-col sm:flex-row sm:items-center gap-6 text-primary/60 font-medium tracking-wide">
             <a :href="`mailto:${artisan?.contactEmail}`" class="hover:text-accent transition-colors border-b border-transparent hover:border-accent pb-0.5">
               {{ artisan?.contactEmail }}
             </a>
             <div class="flex space-x-6">
                <a v-for="social in artisan?.socialLinks" :key="social.platform" :href="social.url" target="_blank" class="text-primary/40 hover:text-primary transition-colors uppercase text-xs tracking-widest">
                  {{ social.platform }}
                </a>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
