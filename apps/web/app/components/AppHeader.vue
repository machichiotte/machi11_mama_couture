<script setup lang="ts">
import type { SiteSetting, UiString } from '@machi10/types'
import { usePayload } from '~/composables/usePayload'

const { getGlobals } = usePayload()
const { data: siteSettings } = await useAsyncData<SiteSetting>('site-settings', () => getGlobals('site-settings'))
const { data: ui } = await useAsyncData<UiString>('ui-strings', () => getGlobals('ui-strings'))

// Logic to split title for the logo effect if needed, otherwise just use the title
const siteTitle = computed(() => siteSettings.value?.siteTitle || 'MAMA COUTURE')
</script>

<template>
  <header class="sticky top-0 z-50 bg-secondary/80 backdrop-blur-md border-b border-primary/5">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <NuxtLink to="/" class="group">
        <h1 class="text-2xl font-serif font-bold tracking-tight text-primary group-hover:text-accent transition-colors">
          {{ siteTitle }}
        </h1>
      </NuxtLink>

      <nav v-if="ui?.nav" class="hidden md:flex space-x-10 items-center">
        <NuxtLink 
          v-for="item in [
            { to: '/collections', label: ui.nav.collections },
            { to: '/about', label: ui.nav.artisan },
            { to: '/contact', label: ui.nav.contact }
          ]" 
          :key="item.to"
          :to="item.to" 
          class="text-xs uppercase tracking-[0.2em] font-bold text-primary/60 hover:text-primary transition-all relative py-1 group"
          active-class="!text-accent !text-opacity-100"
        >
          {{ item.label }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" 
                :class="{ 'w-full': $route.path.startsWith(item.to) }"></span>
        </NuxtLink>
      </nav>

      <button v-if="ui?.nav" class="md:hidden text-primary">
        <span class="sr-only">{{ ui.nav.menuLabel }}</span>
        <!-- Menu Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </header>
</template>
