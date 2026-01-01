<script setup lang="ts">
const { ui } = useI18n()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <footer class="bg-primary/5 border-t border-primary/5 py-4 md:py-6">
      <div class="container mx-auto px-6 text-center space-y-2">
        <p class="text-xs text-primary/40 italic font-serif">{{ ui.common.footerCopyright }}</p>
        <NuxtLink to="/admin" external class="inline-block text-[10px] text-primary/10 hover:text-accent/40 font-serif italic transition-colors">
          {{ ui.common.adminAccess }}
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>
