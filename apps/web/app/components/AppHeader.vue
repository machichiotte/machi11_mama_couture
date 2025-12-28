<script setup lang="ts">
import type { SiteSetting, UiString } from '@machi10/types'
import { usePayload } from '~/composables/usePayload'

const { getGlobals } = usePayload()
const { data: siteSettings } = await useAsyncData<SiteSetting>('site-settings', () => getGlobals('site-settings'))
const { data: ui } = await useAsyncData<UiString>('ui-strings', () => getGlobals('ui-strings'))

const isMenuOpen = ref(false)

const navItems = computed(() => {
  if (!ui.value?.nav) return []
  return [
    { to: '/collections', label: ui.value.nav.collections },
    { to: '/about', label: ui.value.nav.artisan },
    { to: '/contact', label: ui.value.nav.contact }
  ]
})

const siteTitle = computed(() => siteSettings.value?.siteTitle || 'MAMA COUTURE')

// Fermer le menu au changement de route
watch(() => useRoute().fullPath, () => {
  isMenuOpen.value = false
})
</script>

<template>
  <header 
    class="sticky top-0 z-[100] border-b border-primary/5 transition-colors duration-300"
    :class="[isMenuOpen ? 'bg-secondary' : 'bg-secondary/80 backdrop-blur-md']"
  >
    <div class="container mx-auto px-6 py-4 flex justify-between items-center relative z-[120]">
      <NuxtLink to="/" class="group">
        <h1 class="text-2xl font-serif font-bold tracking-tight text-primary group-hover:text-accent transition-colors">
          {{ siteTitle }}
        </h1>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav v-if="ui?.nav" class="hidden md:flex space-x-10 items-center">
        <NuxtLink 
          v-for="item in navItems" 
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

      <!-- Mobile Menu Button -->
      <button v-if="ui?.nav" 
              class="md:hidden text-primary p-2 -mr-2 relative"
              @click="isMenuOpen = !isMenuOpen"
              :aria-expanded="isMenuOpen">
        <span class="sr-only">{{ ui.nav.menuLabel }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 transition-all duration-300" 
             :class="{ 'rotate-90': isMenuOpen }"
             fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile Nav Overlay -->
    <Transition name="fade">
      <div v-if="isMenuOpen" class="fixed inset-0 bg-secondary z-[110] flex flex-col pt-32 px-10 h-screen w-screen overflow-hidden">
        <nav class="flex flex-col space-y-8">
          <NuxtLink 
            v-for="(item, index) in navItems" 
            :key="item.to"
            :to="item.to"
            class="text-4xl font-serif text-primary hover:text-accent transition-colors"
            :style="{ transitionDelay: `${index * 100}ms` }"
            active-class="text-accent"
            @click="isMenuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
        
        <div class="mt-auto pb-12">
          <p class="text-xs uppercase tracking-[0.3em] font-bold text-primary/30 mb-6">Suivez-nous</p>
          <div class="flex gap-8">
              <!-- On pourrait rajouter des icônes de réseaux sociaux ici -->
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
