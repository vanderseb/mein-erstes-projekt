<script setup lang="ts">
// Props für die Button-Varianten
defineProps<{
  variant?: 'primary' | 'secondary'
  href?: string
  type?: 'button' | 'submit'
}>()
</script>

<template>
  <!-- Als NuxtLink wenn href vorhanden -->
  <NuxtLink 
    v-if="href" 
    :to="href"
    :class="[
      'inline-block font-body font-bold px-6 py-3 transition-all duration-200',
      'rounded-evil-md',
      variant === 'secondary' 
        ? 'bg-transparent border border-evil-light text-evil-light hover:bg-evil-light/10 hover:border-white hover:text-white' 
        : 'bg-evil-red text-white hover:bg-red-700 hover:shadow-lg hover:shadow-evil-red/30'
    ]"
  >
    <slot />
  </NuxtLink>
  
  <!-- Als Button wenn kein href -->
  <button 
    v-else
    :type="type || 'button'"
    :class="[
      'inline-block font-body font-bold px-6 py-3 transition-all duration-200 cursor-pointer',
      'rounded-evil-md',
      variant === 'secondary' 
        ? 'bg-transparent border border-evil-light text-evil-light hover:bg-evil-light/10 hover:border-white hover:text-white' 
        : 'bg-evil-red text-white hover:bg-red-700 hover:shadow-lg hover:shadow-evil-red/30'
    ]"
  >
    <slot />
  </button>
</template>

