<script setup lang="ts">
// Einfache Card - solider dunkler Hintergrund mit Rahmen
defineProps<{
  padding?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <div 
    :class="[
      'bg-evil-dark border border-evil-light/20',
      'rounded-evil-md',
      {
        'p-4': padding === 'sm',
        'p-6': padding === 'md' || !padding,
        'p-8': padding === 'lg'
      }
    ]"
  >
    <slot />
  </div>
</template>
