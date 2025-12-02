<script setup lang="ts">
const { jobScores, evilScore } = useEvilState();
const { jobs } = useJobs();

// Jobs nach Score sortieren
const rankedJobs = computed(() => {
  return jobs.map(job => ({
    ...job,
    score: jobScores.value[job.id] || 0
  })).sort((a, b) => b.score - a.score);
});

const winner = computed(() => rankedJobs.value[0]);
</script>

<template>
  <div class="min-h-screen py-12 px-4 flex items-center justify-center">
    <div class="max-w-lg w-full space-y-6">

      <!-- Score Display -->
      <div class="text-center">
        <h1 class="text-white text-3xl mb-2">Dein Ergebnis</h1>
        <p class="text-evil-mid">
          Evil Score: <span class="text-evil-red font-bold text-2xl">{{ evilScore }}</span>
        </p>
      </div>

      <!-- Winner Card -->
      <GlassCard padding="lg" class="text-center border-evil-red/50">
        <p class="text-evil-mid text-sm uppercase tracking-wider mb-2">Dein perfekter Job</p>
        <h2 class="text-evil-red text-2xl mb-3">{{ winner.title }}</h2>
        <p class="text-evil-light/80 text-sm mb-6">{{ winner.description }}</p>
        
        <BaseButton :href="`/jeopardy/form?job=${winner.id}`" class="w-full text-center">
          Job annehmen
        </BaseButton>
      </GlassCard>

      <!-- Alternatives -->
      <GlassCard>
        <p class="text-evil-mid text-xs uppercase tracking-wider font-bold mb-4">
          Alternativen
        </p>
        
        <div class="space-y-3">
          <div 
            v-for="job in rankedJobs.slice(1)" 
            :key="job.id" 
            class="flex items-center justify-between py-2 border-b border-evil-light/10 last:border-0"
          >
            <div>
              <span class="text-evil-light text-sm">{{ job.title }}</span>
              <span class="text-evil-mid text-xs ml-2">({{ job.score }} Punkte)</span>
            </div>
            <NuxtLink 
              :to="`/jeopardy/form?job=${job.id}`" 
              class="text-evil-red text-sm hover:text-white transition-colors"
            >
              Wählen
            </NuxtLink>
          </div>
        </div>
      </GlassCard>

      <!-- Back Link -->
      <div class="text-center">
        <NuxtLink to="/karriere" class="text-evil-mid text-sm hover:text-evil-light transition-colors">
          ← Zurück zur Karriereübersicht
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
