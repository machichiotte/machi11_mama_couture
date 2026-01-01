<script setup lang="ts">
const props = defineProps<{
  images: { image: any }[]
}>()

const { getImageUrl } = usePayload()

const activeIndex = ref(0)
const isLightboxOpen = ref(false)

const activeImage = computed(() => props.images[activeIndex.value]?.image)

const nextImage = () => {
  activeIndex.value = (activeIndex.value + 1) % props.images.length
}

const prevImage = () => {
  activeIndex.value = (activeIndex.value - 1 + props.images.length) % props.images.length
}

const openLightbox = (index: number) => {
  activeIndex.value = index
  isLightboxOpen.value = true
}

// Handle ESC key for lightbox
onMounted(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') isLightboxOpen.value = false
  }
  window.addEventListener('keydown', handleEsc)
  onUnmounted(() => window.removeEventListener('keydown', handleEsc))
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Main Display Area -->
    <div class="relative group aspect-[4/5] md:max-h-[70vh] bg-secondary/30 overflow-hidden rounded-sm border border-primary/5 cursor-zoom-in" @click="openLightbox(activeIndex)">
      <Transition name="fade-fast" mode="out-in">
        <NuxtImg 
          :key="activeIndex"
          :src="getImageUrl(activeImage)" 
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          placeholder
        />
      </Transition>

      <!-- Navigation Arrows (visible on hover) -->
      <div v-if="images.length > 1" class="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click.stop="prevImage" class="w-10 h-10 rounded-full bg-white/80 border border-primary/10 flex items-center justify-center hover:bg-white text-primary transition-all shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button @click.stop="nextImage" class="w-10 h-10 rounded-full bg-white/80 border border-primary/10 flex items-center justify-center hover:bg-white text-primary transition-all shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <!-- Badge Zoom -->
      <div class="absolute bottom-4 right-4 p-2 bg-white/40 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
      </div>
    </div>

    <!-- Thumbnails row -->
    <div v-if="images.length > 1" class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      <button 
        v-for="(img, index) in images" 
        :key="index"
        @click="activeIndex = index"
        class="relative w-24 aspect-square flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all duration-300"
        :class="activeIndex === index ? 'border-accent shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'"
      >
        <NuxtImg :src="getImageUrl(img.image)" class="w-full h-full object-cover" />
      </button>
    </div>

    <!-- Lightbox Portal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isLightboxOpen" class="fixed inset-0 z-[200] bg-primary flex items-center justify-center p-6 md:p-20">
          <!-- Background close -->
          <div class="absolute inset-0" @click="isLightboxOpen = false"></div>
          
          <!-- Large Image -->
          <div class="relative z-10 max-h-full max-w-full">
            <Transition name="fade-fast" mode="out-in">
                <NuxtImg 
                    :key="activeIndex"
                    :src="getImageUrl(activeImage)" 
                    class="max-h-[85vh] md:max-h-[90vh] w-auto object-contain shadow-2xl"
                />
            </Transition>
            
            <!-- Controls -->
            <button @click="isLightboxOpen = false" class="absolute -top-12 right-0 text-white/60 hover:text-white flex items-center gap-2 uppercase text-[10px] tracking-widest font-bold">
              <span>Fermer</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div v-if="images.length > 1" class="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:-mx-20">
                <button @click="prevImage" class="text-white/40 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button @click="nextImage" class="text-white/40 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
            
            <!-- Counter -->
            <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/40 font-serif italic">
               {{ activeIndex + 1 }} / {{ images.length }}
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-fast-enter-active, .fade-fast-leave-active {
  transition: opacity 0.3s ease;
}
.fade-fast-enter-from, .fade-fast-leave-to {
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
