<script setup lang="ts">
// Hero Section - Bild frei sichtbar, Text unten positioniert
defineProps<{
  image: string
  title: string
  subtitle?: string
  fullHeight?: boolean
}>()
</script>

<template>
  <section class="relative w-full">
    
    <!-- Bild-Container -->
    <div 
      class="w-full bg-cover bg-center bg-no-repeat"
      :class="fullHeight ? 'h-[70vh]' : 'h-[40vh] md:h-[50vh]'"
      :style="{ backgroundImage: `url(${image})` }"
    >
    </div>
    
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
