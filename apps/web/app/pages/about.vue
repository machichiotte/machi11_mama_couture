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
  <div class="py-6 md:py-10 container mx-auto px-6">
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
        <h2 class="text-accent text-sm uppercase tracking-[0.2em] mb-2 font-semibold flex items-center gap-4">
          <span class="w-8 h-[1px] bg-accent"></span>
          L'Âme de l'Atelier
        </h2>
        
        <h1 class="text-4xl lg:text-5xl font-serif mb-6 text-primary leading-tight">
          {{ artisan?.name || 'Notre Histoire' }}
        </h1>
        
        <div class="prose prose-lg text-primary/80 font-light leading-relaxed mb-6 max-w-none">
          <p v-if="!artisan">{{ ui?.common?.loading || 'Chargement...' }}</p>
          <div v-else>
            <!-- If bio is a string (rich text HTML) -->
            <div v-if="typeof artisan.bio === 'string'" v-html="artisan.bio"></div>
            <!-- If bio is a Lexical object -->
            <div v-else-if="artisan.bio" v-html="serialize(artisan.bio)"></div>
          </div>
        </div>
        
        <div class="border-t border-primary/10 pt-6 mt-6 bg-secondary/30 p-6 rounded-sm">
          <h4 class="font-serif text-2xl italic text-primary mb-4 flex items-center gap-3">
             <span class="w-6 h-[1px] bg-accent"></span>
             <span>{{ ui?.common?.contactTitle || 'Restons en Contact' }}</span>
          </h4>
          
          <div class="flex flex-col gap-4">
             <!-- Email -->
             <a :href="`mailto:${artisan?.contactEmail}`" class="group flex items-center gap-4 text-primary/80 hover:text-accent transition-all duration-300">
               <div class="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                 </svg>
               </div>
               <span class="font-medium tracking-wide text-lg pb-0.5 border-b border-transparent group-hover:border-accent">{{ artisan?.contactEmail }}</span>
             </a>

             <!-- Social Networks -->
             <div v-if="artisan?.socialLinks?.length" class="flex flex-wrap gap-4 mt-2">
                <a v-for="social in artisan?.socialLinks" :key="social.platform" :href="social.url" target="_blank" 
                   class="group flex items-center gap-3 px-5 py-3 bg-white border border-primary/10 rounded-sm hover:border-accent/50 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <!-- Icon based on platform name (simple check) -->
                  <svg v-if="social.platform.toLowerCase().includes('instagram')" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  <svg v-else-if="social.platform.toLowerCase().includes('facebook')" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.6 9h4.9a8 8 0 010 9v0a8 8 0 01-4.9-3" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.4 9h-4.9a8 8 0 000 9v0a8 8 0 004.9-3" /></svg>
                  
                  <span class="uppercase text-xs font-bold tracking-widest text-primary/80 group-hover:text-primary">{{ social.platform }}</span>
                </a>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
