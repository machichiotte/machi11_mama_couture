<script setup lang="ts">
import type { SiteSetting, UiString, About } from '@machi11/types'
import { usePayload } from '~/composables/usePayload'

const { ui, d } = useI18n()
const { getGlobals } = usePayload()
const { data: siteSettings } = await useAsyncData<SiteSetting>('site-settings', () => getGlobals('site-settings'))
const { data: about } = await useAsyncData<About>('about', () => getGlobals('about'))

const isMenuOpen = ref(false)
const isMounted = ref(false)
const { colorMode, toggleColorMode, isDark } = useColorMode()

onMounted(() => {
  isMounted.value = true
})

const navItems = computed(() => {
  const currentNav = ui.value.nav
  return [
    { to: '/collections', label: currentNav.collections },
    { to: '/about', label: currentNav.about },
    { to: '/contact', label: currentNav.contact }
  ]
})

const siteTitle = computed(() => siteSettings.value?.siteTitle || 'MAMA COUTURE')

// Fermer le menu au changement de route
watch(() => useRoute().fullPath, () => {
  isMenuOpen.value = false
})

// Verrouiller le scroll du corps quand le menu est ouvert
watch(isMenuOpen, (val) => {
  if (process.client) {
    document.body.style.overflow = val ? 'hidden' : ''
  }
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
          :data-umami-event="`nav_click`"
          :data-umami-event-page="item.label"
        >
          {{ item.label }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" 
                :class="{ 'w-full': $route.path.startsWith(item.to) }"></span>
        </NuxtLink>
        
        <!-- Dark Mode Toggle (Desktop) -->
        <div class="w-9 h-9 flex items-center justify-center">
          <button 
            v-if="isMounted"
            @click="() => { 
              toggleColorMode(); 
              if (window.umami) window.umami.track('theme_toggle', { mode: isDark ? 'light' : 'dark' });
            }"
            class="p-2 rounded-full hover:bg-primary/5 transition-all duration-300 group"
            :aria-label="isDark ? 'Activer le mode clair' : 'Activer le mode sombre'"
          >
            <!-- ... icones ... -->
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gold group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:-rotate-12 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>
      </nav>

      <!-- Mobile Controls -->
      <div class="md:hidden flex items-center gap-2">
        <!-- Dark Mode Toggle (Mobile) -->
        <div class="w-10 h-10 flex items-center justify-center">
          <button 
            v-if="isMounted"
            @click="() => { 
                toggleColorMode(); 
                if (window.umami) window.umami.track('theme_toggle_mobile', { mode: isDark ? 'light' : 'dark' });
              }"
            class="p-2 rounded-full hover:bg-primary/5 transition-all duration-300"
            :aria-label="isDark ? 'Activer le mode clair' : 'Activer le mode sombre'"
          >
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>

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
        
        <div v-if="about?.socialLinks?.length" class="mt-20">
          <p class="text-xs uppercase tracking-[0.3em] font-bold text-primary/30 mb-6">Suivez-nous</p>
          <div class="flex flex-wrap gap-6">
              <a v-for="social in about.socialLinks" :key="social.platform" :href="social.url" target="_blank" 
                 class="group flex items-center gap-3 transition-all duration-300"
                 :data-umami-event="`social_click`"
                 :data-umami-event-platform="social.platform"
              >
                <div class="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 transition-colors">
                  <svg v-if="social.platform.toLowerCase().includes('instagram')" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  <svg v-else-if="social.platform.toLowerCase().includes('facebook')" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <span class="text-[10px] items-center uppercase tracking-widest font-bold text-primary/60 group-hover:text-primary transition-colors">{{ social.platform }}</span>
              </a>
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
