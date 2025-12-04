<script setup lang="ts">
// Hero Section - Unterstützt Slider-Modus (images) oder statisches Bild (image)
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  image?: string
  images?: string[]
  title: string
  subtitle?: string
  fullHeight?: boolean
  interval?: number
}>()

// Slider-Modus aktiv wenn images Array mit mehr als 1 Bild übergeben wurde
const isSlider = computed(() => props.images && props.images.length > 1)

const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const nextSlide = () => {
  if (props.images) {
    currentIndex.value = (currentIndex.value + 1) % props.images.length
  }
}

const prevSlide = () => {
  if (props.images) {
    currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
  }
}

const goToSlide = (index: number) => {
  currentIndex.value = index
}

onMounted(() => {
  if (isSlider.value) {
    timer = setInterval(nextSlide, props.interval || 5000)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section class="relative w-full">
    
    <!-- SLIDER-MODUS -->
    <div 
      v-if="isSlider && images"
      class="relative w-full overflow-hidden"
      :class="fullHeight ? 'h-[70vh]' : 'h-[40vh] md:h-[50vh]'"
    >
      <!-- Slides -->
      <div
        v-for="(img, index) in images"
        :key="index"
        class="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        :class="index === currentIndex ? 'opacity-100' : 'opacity-0'"
        :style="{ backgroundImage: `url(${img})` }"
      />

      <!-- Navigation Pfeile -->
      <button 
        @click="prevSlide"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-evil-dark/70 hover:bg-evil-red text-white rounded-full flex items-center justify-center transition-colors"
        aria-label="Vorheriges Bild"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        @click="nextSlide"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-evil-dark/70 hover:bg-evil-red text-white rounded-full flex items-center justify-center transition-colors"
        aria-label="Nächstes Bild"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Dots Navigation -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        <button
          v-for="(_, index) in images"
          :key="index"
          @click="goToSlide(index)"
          class="w-3 h-3 rounded-full transition-colors"
          :class="index === currentIndex ? 'bg-evil-red' : 'bg-white/50 hover:bg-white/80'"
          :aria-label="`Zu Bild ${index + 1} wechseln`"
        />
      </div>
    </div>

    <!-- STATISCHER MODUS -->
    <div 
      v-else
      class="w-full bg-cover bg-center bg-no-repeat"
      :class="fullHeight ? 'h-[70vh]' : 'h-[40vh] md:h-[50vh]'"
      :style="{ backgroundImage: `url(${image})` }"
    />
    
    <!-- Text-Container unterhalb des Bildes -->
    <div class="relative z-10 px-4 pt-8">
      <div class="max-w-4xl mx-auto">
        
        <div class="bg-evil-dark border-l-4 border-evil-red p-6 md:p-8">
          <h1 class="font-headline text-white mb-2">
            {{ title }}
          </h1>
          
          <p v-if="subtitle" class="text-evil-light text-lg">
            {{ subtitle }}
          </p>
          
          <!-- Slot für zusätzliche Inhalte (z.B. Buttons) -->
          <div v-if="$slots.default" class="mt-6">
            <slot />
          </div>
        </div>
        
      </div>
    </div>
    
  </section>
</template>
