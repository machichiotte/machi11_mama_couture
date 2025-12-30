<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
/* Page Transitions - Elegant Fade & Slide */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Layout Transition for smoother experience */
.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
</style>
