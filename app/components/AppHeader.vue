<script setup lang="ts">
// Navigation Items
const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Karriere', to: '/karriere' },
  { label: 'Kontakt', to: '/kontakt' },
  { label: 'Impressum', to: '/impressum' },
]

// Mobile Menu State
const mobileMenuOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 bg-evil-dark border-b border-evil-light/20">
    <nav class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      
      <!-- Logo -->
      <NuxtLink to="/" class="flex-shrink-0">
        <img 
          src="/design/assets/logo/Logo_dunkler_Hintergrund.png" 
          alt="Dr. Evil & Söhne GmbH" 
          class="h-10 md:h-12 w-auto"
        />
      </NuxtLink>
      
      <!-- Desktop Navigation -->
      <ul class="hidden md:flex items-center gap-8">
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink 
            :to="item.to"
            class="font-body text-evil-light hover:text-white transition-colors duration-200 text-sm uppercase tracking-wider"
            active-class="text-white border-b-2 border-evil-red pb-1"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
      
      <!-- Mobile Menu Button -->
      <button 
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="md:hidden text-evil-light hover:text-white p-2"
        aria-label="Menü öffnen"
      >
        <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
    </nav>
    
    <!-- Mobile Menu -->
    <div 
      v-if="mobileMenuOpen" 
      class="md:hidden bg-evil-dark border-t border-evil-light/10"
    >
      <ul class="px-4 py-4 space-y-4">
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink 
            :to="item.to"
            @click="mobileMenuOpen = false"
            class="block font-body text-evil-light hover:text-white transition-colors py-2 text-sm uppercase tracking-wider"
            active-class="text-white"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    
  </header>
</template>
