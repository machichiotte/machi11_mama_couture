<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <NuxtLink to="/" class="group">
        <h1 class="text-2xl font-serif font-bold tracking-tight group-hover:text-accent transition-colors">
          MACHI<span class="text-accent">10</span>
        </h1>
      </NuxtLink>

      <nav class="hidden md:flex space-x-8 items-center">
        <NuxtLink to="/collections" class="text-sm font-medium hover:text-accent transition-colors">Collections</NuxtLink>
        <NuxtLink to="/about" class="text-sm font-medium hover:text-accent transition-colors">Artisan</NuxtLink>
        <NuxtLink to="/contact" class="premium-button text-sm">Contact</NuxtLink>
      </nav>

      <button class="md:hidden text-gray-900">
        <span class="sr-only">Menu</span>
        <!-- Menu Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </header>
</template>
