<script setup lang="ts">
const { jobScores, evilScore } = useEvilState();
const { jobs } = useJobs();

// Wir sortieren die Jobs nach Score (höchster zuerst)
const rankedJobs = computed(() => {
  // Wir mappen unsere Job-IDs auf die echten Job-Objekte und fügen den Score hinzu
  return jobs.map(job => {
    return {
      ...job,
      score: jobScores.value[job.id] || 0 // job.id muss matchten (hr, it, rd...)
    };
  }).sort((a, b) => b.score - a.score); // Absteigend sortieren
});

// Der Gewinner (oder die Gewinner)
const winner = computed(() => rankedJobs.value[0]);
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
    <div class="max-w-2xl w-full text-center">
      
      <div class="text-6xl mb-4">😈</div>
      <h1 class="text-4xl font-bold mb-2">Analyse abgeschlossen</h1>
      <p class="text-xl text-gray-400 mb-8">Dein Evil Score: <span class="text-red-500 font-bold">{{ evilScore }}</span></p>

      <div class="bg-gray-800 p-8 rounded-xl border border-red-900 mb-8">
        <h2 class="text-lg text-gray-400 mb-2">Deine Bestimmung:</h2>
        <h3 class="text-3xl font-bold text-white mb-4">{{ winner.title }}</h3>
        <p class="mb-6">{{ winner.description }}</p>
        
        <NuxtLink 
          :to="`/jeopardy/form?job=${winner.id}`"
          class="inline-block bg-red-600 text-white px-8 py-3 rounded font-bold hover:bg-red-700 transition"
        >
          Diesen Job annehmen
        </NuxtLink>
      </div>

      <div class="text-left">
        <h4 class="text-gray-500 text-sm uppercase font-bold mb-4">Alternative Eignung:</h4>
        <div v-for="job in rankedJobs.slice(1)" :key="job.id" class="flex justify-between items-center py-2 border-b border-gray-800">
          <span>{{ job.title }}</span>
          <div class="flex items-center gap-4">
            <span class="text-gray-500 text-sm">Score: {{ job.score }}</span>
            <NuxtLink :to="`/jeopardy/form?job=${job.id}`" class="text-red-400 hover:text-red-300 text-sm">Wählen &rarr;</NuxtLink>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>