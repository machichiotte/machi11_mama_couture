<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <footer class="bg-primary/5 border-t border-primary/5 py-12">
      <div class="container mx-auto px-6 text-center">
        <p class="text-sm text-primary/40 italic font-serif">© 2025 Mama Couture. Confection Artisanale & Passion.</p>
      </div>
    </footer>
  </div>
</template>
