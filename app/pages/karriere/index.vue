<script setup lang="ts">
// Karriere-Übersicht
const { jobs } = useJobs();
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HeroSection 
      image="/design/assets/images/03_karriere.png"
      title="Karriere bei Dr. Evil & Söhne"
      subtitle="Werden Sie Teil eines Teams, das die Welt verändert. Buchstäblich."
    />

    <!-- Evil Score CTA -->
    <section class="py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <ContentCard padding="lg" class="text-center">
          <h2 class="text-white mb-4">Unsicher, wie böse du bist?</h2>
          <p class="text-evil-light/80 mb-6">
            Finde deinen perfekten Job in unserem wissenschaftlich fragwürdigen Eignungstest.
          </p>
          <BaseButton href="/quiz">
            Evil-Score Test starten →
          </BaseButton>
        </ContentCard>
      </div>
    </section>

    <!-- Jobs Grid -->
    <section class="py-12 md:py-16 px-4">
      <div class="max-w-6xl mx-auto">
        
        <div class="text-center mb-12">
          <h2 class="text-white mb-4">Offene Positionen</h2>
          <div class="w-16 h-1 bg-evil-red mx-auto"></div>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <ContentCard 
            v-for="job in jobs" 
            :key="job.id" 
            class="flex flex-col hover:border-evil-light/40 transition-colors"
          >
            <!-- Department Badge -->
            <span class="inline-block text-xs font-bold uppercase tracking-wider text-evil-red bg-evil-red/10 px-3 py-1 rounded-evil mb-4 self-start">
              {{ job.department }}
            </span>
            
            <!-- Title -->
            <h3 class="text-white text-xl mb-3">
              {{ job.title }}
            </h3>
            
            <!-- Description -->
            <p class="text-evil-light/70 text-sm mb-6 flex-grow">
              {{ job.description }}
            </p>
            
            <!-- CTA -->
            <BaseButton :href="`/karriere/${job.id}`" variant="secondary" class="w-full text-center">
              Stellenbeschreibung →
            </BaseButton>
          </ContentCard>

        </div>

      </div>
    </section>

  </div>
</template>
