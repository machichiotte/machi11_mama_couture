<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <footer class="bg-gray-50 border-t border-gray-100 py-12">
      <div class="container mx-auto px-6 text-center">
        <p class="text-sm text-gray-500 italic">© 2025 Machi10 CMS MA. Artisanat & Passion.</p>
      </div>
    </footer>
  </div>
</template>
