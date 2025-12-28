<script setup lang="ts">
const { jobs, getJobsByExpertise } = useJobs();
const { 
    evilScore, 
    finalExpertise, 
    findBestJob, 
    calculateJobMatches 
} = useEvilState();

// Jobs die zur ermittelten Expertise passen
const matchingJobs = computed(() => {
    if (!finalExpertise.value) return jobs.value; // Fallback: alle Jobs (unwrapped)
    return getJobsByExpertise(finalExpertise.value);
});

// Der beste Job basierend auf dem Matching-Algorithmus
const winner = computed(() => {
    if (matchingJobs.value.length === 0) return jobs.value[0]; // Fallback
    return findBestJob(matchingJobs.value);
});

// Rangliste aller passenden Jobs mit Übereinstimmungen
const rankedJobs = computed(() => {
    return matchingJobs.value
        .map(job => ({
            ...job,
            matches: calculateJobMatches(job)
        }))
        .sort((a, b) => b.matches - a.matches);
});

// Expertise Labels für die Anzeige
const expertiseLabels: Record<string, string> = {
    'Digital': 'IT & Hacking',
    'Social_Engineering': 'Human Resources',
    'Heavy_Machinery': 'Technik & Engineering',
    'Economy': 'Finance & Operations'
};
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

      <!-- Expertise Badge -->
      <div v-if="finalExpertise" class="text-center">
        <span class="inline-block px-4 py-2 bg-evil-dark border border-evil-light/30 rounded-full text-evil-light text-sm">
          Dein Fachgebiet: <strong class="text-white">{{ expertiseLabels[finalExpertise] || finalExpertise }}</strong>
        </span>
      </div>

      <!-- Winner Card -->
      <ContentCard v-if="winner" padding="lg" class="text-center border-evil-red/50">
        <p class="text-evil-mid text-sm uppercase tracking-wider mb-2">Dein perfekter Job</p>
        <h2 class="text-evil-red text-2xl mb-4">{{ winner.title }}</h2>
        <p class="text-evil-light/80 text-sm mb-6">{{ winner.description }}</p>
        
        <!-- Job Tags -->
        <div class="flex flex-wrap justify-center gap-2 mb-6">
          <span class="px-2 py-1 bg-evil-dark/70 rounded text-xs text-evil-light">
            {{ winner.hierarchy }}
          </span>
          <span class="px-2 py-1 bg-evil-dark/70 rounded text-xs text-evil-light">
            {{ winner.approach }}
          </span>
          <span class="px-2 py-1 bg-evil-dark/70 rounded text-xs text-evil-light">
            {{ winner.risk }}
          </span>
        </div>
        
        <BaseButton :href="`/assessment?jobId=${winner.id}&fromQuiz=true`" class="w-full text-center">
          Job annehmen
        </BaseButton>
      </ContentCard>

      <!-- Alternatives (nur wenn mehr als 1 Job) -->
      <ContentCard v-if="rankedJobs.length > 1">
        <p class="text-evil-mid text-xs uppercase tracking-wider font-bold mb-4">
          Alternative Positionen
        </p>
        
        <div class="space-y-3">
          <div 
            v-for="job in rankedJobs.slice(1)" 
            :key="job.id" 
            class="flex items-center justify-between py-2 border-b border-evil-light/10 last:border-0"
          >
            <div>
              <span class="text-evil-light text-sm">{{ job.title }}</span>
              <span class="text-evil-mid text-xs ml-2">({{ job.matches }}/3 Treffer)</span>
            </div>
            <NuxtLink 
              :to="`/assessment?jobId=${job.id}&fromQuiz=true`" 
              class="text-evil-red text-sm hover:text-white transition-colors"
            >
              Wählen
            </NuxtLink>
          </div>
        </div>
      </ContentCard>

      <!-- Back Link -->
      <div class="text-center space-y-2">
        <NuxtLink to="/assessment" class="text-evil-red text-sm hover:text-white transition-colors block">
          ← Quiz wiederholen
        </NuxtLink>
        <NuxtLink to="/karriere" class="text-evil-mid text-sm hover:text-evil-light transition-colors block">
          Zur Karriereübersicht
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
