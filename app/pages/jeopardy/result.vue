<script setup lang="ts">
const { jobScores, evilScore } = useEvilState();
const { jobs } = useJobs();

// Logik bleibt gleich: Sortieren nach Score
const rankedJobs = computed(() => {
  return jobs.map(job => ({
    ...job,
    score: jobScores.value[job.id] || 0
  })).sort((a, b) => b.score - a.score);
});

const winner = computed(() => rankedJobs.value[0]);
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8 text-center">

      <div>
        <h1 class="text-2xl font-bold">Ergebnis</h1>
        <p class="text-gray-400">Evil Score: <span class="text-red-500 font-bold">{{ evilScore }}</span></p>
      </div>

      <div class="p-6 rounded bg-gray-800">
        <h2 class="text-xl font-bold mb-2 text-red-500">{{ winner.title }}</h2>
        <p class="text-sm text-gray-300 mb-6">{{ winner.description }}</p>
        
        <NuxtLink :to="`/jeopardy/form?job=${winner.id}`" class="block w-full bg-red-600 py-2 rounded font-bold hover:bg-red-700">
          Job annehmen
        </NuxtLink>
      </div>

      <div class="text-left text-sm space-y-2">
        <p class="text-gray-500 uppercase font-bold text-xs">Alternativen:</p>
        
        <div v-for="job in rankedJobs.slice(1)" :key="job.id" class="flex justify-between border-b border-gray-700 pb-1">
          <span>{{ job.title }} <span class="text-gray-500">({{ job.score }})</span></span>
          <NuxtLink :to="`/jeopardy/form?job=${job.id}`" class="text-red-400 hover:text-white">
            Wählen
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>