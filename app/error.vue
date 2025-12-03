<script setup lang="ts">
// Nuxt Error Page
// https://nuxt.com/docs/getting-started/error-handling

defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()

// Funktion zum Zurücknavigieren
const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen bg-evil-dark flex items-center justify-center px-4">
    <div class="text-center">
      
      <!-- Error Code -->
      <h1 class="font-headline text-[8rem] md:text-[12rem] text-evil-red leading-none mb-4">
        {{ error.statusCode }}
      </h1>
      
      <!-- Message -->
      <p class="text-evil-light text-lg md:text-xl mb-8 max-w-md mx-auto">
        Hier haben wir Sie nicht erwartet. Bitte gehen Sie zur Startseite zurück.
      </p>
      
      <!-- Button -->
      <button 
        @click="handleError"
        class="inline-block font-body font-bold px-6 py-3 bg-evil-red text-white rounded-evil-md hover:bg-red-700 transition-all"
      >
        Zur Startseite
      </button>
      
    </div>
  </div>
</template>

