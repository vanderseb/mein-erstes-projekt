<script setup lang="ts">
const route = useRoute();
const { getJobById } = useJobs();

// 1. Wir holen die ID aus der URL (z.B. "it" oder "hr")
const jobId = route.params.id as string;

// 2. Wir suchen den passenden Job
const job = getJobById(jobId);
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    
    <div v-if="job" class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
      <div class="bg-gray-900 p-8 md:p-12 text-white">
        <NuxtLink to="/karriere" class="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors font-medium">
          &larr; Zurück zur Übersicht
        </NuxtLink>
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span class="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              {{ job.department }}
            </span>
            <h1 class="text-3xl md:text-5xl font-bold leading-tight">{{ job.title }}</h1>
          </div>
        </div>
      </div>

      <div class="p-8 md:p-12">
        
        <p class="text-xl text-gray-700 leading-relaxed mb-10 border-l-4 border-red-500 pl-6">
          {{ job.description }}
        </p>
        
        <div class="grid md:grid-cols-2 gap-12">
          
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="bg-gray-100 p-2 rounded mr-3">📋</span> Deine Missionen
            </h3>
            <ul class="space-y-3">
              <li v-for="task in job.tasks" :key="task" class="flex items-start text-gray-600">
                <span class="text-red-500 mr-2 mt-1">➢</span>
                {{ task }}
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="bg-gray-100 p-2 rounded mr-3">🧠</span> Das bringst du mit
            </h3>
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-100 text-gray-700">
              {{ job.skills }}
            </div>
          </div>

        </div>

        <div class="mt-16 pt-8 border-t border-gray-100 text-center">
          <h3 class="text-2xl font-bold mb-4">Bereit, die Welt zu verändern (oder zu beherrschen)?</h3>
          <p class="text-gray-500 mb-8">Der Bewerbungsprozess beinhaltet keine Sicherheitsüberprüfung, aber eventuell einen Hai-Test.</p>
          
          <NuxtLink 
            :to="`/bewerbung/${job.id}`" 
            class="inline-block bg-red-600 text-white text-xl font-bold px-10 py-4 rounded-lg shadow-lg hover:bg-red-700 transform hover:scale-105 transition-all"
          >
            JETZT BEWERBEN
          </NuxtLink>
        </div>

      </div>
    </div>
    
    <div v-else class="text-center py-20">
      <h1 class="text-6xl mb-4">☠️</h1>
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Job eliminiert.</h2>
      <p class="text-gray-600 mb-8">Diese Position existiert nicht (mehr).</p>
      <NuxtLink to="/karriere" class="text-red-600 font-bold hover:underline">Zurück zur Basis</NuxtLink>
    </div>

  </div>
</template>