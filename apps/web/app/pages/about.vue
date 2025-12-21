<script setup lang="ts">
import type { ArtisanProfile, UiString } from '@machi10/types'
import { usePayload } from '~/composables/usePayload'

const { getGlobals } = usePayload()
const { data: artisan } = await useAsyncData('artisan-profile', () => getGlobals('artisan-profile'))
const { data: ui } = await useAsyncData<UiString>('ui-strings', () => getGlobals('ui-strings'))
</script>

<template>
  <div class="py-20 container mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
      <div class="relative aspect-square bg-secondary/50 overflow-hidden rounded-sm border border-primary/5">
        <div class="absolute inset-0 bg-accent/5"></div>
        <!-- Profile Image Placeholder -->
        <NuxtImg 
          v-if="artisan?.profileImage && typeof artisan.profileImage === 'object'"
          :src="`${useRuntimeConfig().public.payloadBaseUrl}${artisan.profileImage.url}`"
          class="w-full h-full object-cover"
        />
      </div>
      
      <div>
        <h2 class="text-accent text-sm uppercase tracking-widest mb-4 font-semibold">L'Artisan</h2>
        <h1 class="text-4xl md:text-6xl font-serif mb-8 text-primary">{{ artisan?.name || 'Notre Histoire' }}</h1>
        <div class="prose prose-lg text-primary/80 font-light leading-relaxed mb-10">
          <p v-if="!artisan">{{ ui?.common?.loading || 'Chargement...' }}</p>
          <div v-else>
            <!-- If bio is a string (rich text HTML) -->
            <div v-if="typeof artisan.bio === 'string'" v-html="artisan.bio"></div>
            <!-- If bio is a Lexical object -->
            <div v-else-if="artisan.bio" class="opacity-70 italic">
                {{ ui?.common?.loading }}
            </div>
          </div>
        </div>
        
        <div class="space-y-4">
          <h4 class="font-serif text-xl italic border-b border-primary/10 pb-2 text-primary">
              {{ ui?.common?.contactTitle || 'Contact' }}
          </h4>
          <p class="text-primary/60">Email: {{ artisan?.contactEmail }}</p>
          <div class="flex space-x-6">
            <a v-for="social in artisan?.socialLinks" :key="social.platform" :href="social.url" target="_blank" class="text-primary hover:text-accent transition-colors font-medium">
              {{ social.platform }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
