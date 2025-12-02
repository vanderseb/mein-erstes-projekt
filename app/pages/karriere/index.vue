<script setup lang="ts">
// Wir laden die Jobs aus unserem Composable
const { jobs } = useJobs();
</script>

<template>
  <div class="max-w-6xl mx-auto py-12 px-6">
    
    <div class="text-center mb-16">
      <h1 class="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Karriere bei Dr. Evil & Söhne</h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
      </p>
    </div>

    <div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-10 rounded-2xl mb-20 text-center shadow-2xl transform hover:scale-[1.01] transition duration-300">
      <h2 class="text-3xl font-bold mb-4">Unsicher, wie böse du bist?</h2>
      <p class="mb-8 text-gray-300 text-lg">Finde deinen perfekten Job in unserem wissenschaftlich fragwürdigen Eignungstest.</p>
      <NuxtLink 
        to="/jeopardy" 
        class="inline-block bg-red-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-red-700 hover:shadow-lg transition-all"
      >
        Zum Evil-Score Test starten &rarr;
      </NuxtLink>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="job in jobs" 
        :key="job.id" 
        class="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
      >
        <div class="p-8 flex flex-col h-full">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full">
              {{ job.department }}
            </span>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
            {{ job.title }}
          </h2>
          
          <p class="text-gray-600 mb-8 flex-grow leading-relaxed">
            {{ job.description }}
          </p>
          
          <NuxtLink 
            :to="`/karriere/${job.id}`"
            class="mt-auto w-full block text-center border-2 border-gray-900 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-900 hover:text-white transition-colors"
          >
            Stellenbeschreibung &rarr;
          </NuxtLink>
        </div>
      </div>
    </div>

  </div>
</template>