<template>
  <div class="min-h-screen bg-evil-dark flex flex-col">
    
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="flex-grow">
      <slot /> 
    </main>

    <!-- Footer -->
    <footer class="bg-evil-dark border-t border-evil-light/10 py-8 mt-auto">
      <div class="max-w-6xl mx-auto px-4">
        
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <!-- Logo & Copyright -->
          <div class="flex items-center gap-4">
            <img 
              src="/design/assets/logo/Logo_Icon_dunkler_Hintergrund.png" 
              alt="Dr. Evil & Söhne" 
              class="h-8 w-auto"
            />
            <p class="text-evil-mid text-sm">
              &copy; {{ new Date().getFullYear() }} Dr. Evil & Söhne GmbH
            </p>
          </div>
          
          <!-- Footer Links -->
          <div class="flex items-center gap-6 text-sm">
            <NuxtLink to="/impressum" class="text-evil-mid hover:text-evil-light transition-colors">
              Impressum
            </NuxtLink>
            <NuxtLink to="/kontakt" class="text-evil-mid hover:text-evil-light transition-colors">
              Kontakt
            </NuxtLink>
          </div>
          
        </div>
        
        <p class="text-evil-mid/50 text-xs text-center mt-6">
          Tradition trifft Tyrannei seit 1965
        </p>
        
      </div>
    </footer>

  </div>
</template>
