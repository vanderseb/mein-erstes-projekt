<script setup lang="ts">
const router = useRouter();

const { currentQuestion, progress, selectAnswer } = useQuizFlow({
    onComplete: () => router.push('/quiz/result')
});
</script>

<template>
  <div class="min-h-screen py-12 px-4 flex items-center justify-center">
    <div class="max-w-xl w-full">
      
      <ContentCard padding="lg">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-evil-red text-2xl mb-2">Evil Assessment Center</h1>
          <p class="text-evil-mid text-sm">Finde heraus, welcher Job zu dir passt.</p>
        </div>

        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="flex justify-end text-xs text-evil-mid mb-2">
            <span>{{ Math.round(progress) }}%</span>
          </div>
          <div class="h-1 bg-evil-dark rounded-full overflow-hidden">
            <div 
              class="h-full bg-evil-red transition-all duration-500"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
        
        <!-- Question -->
        <div v-if="currentQuestion">
          <h3 class="text-white text-lg mb-6">
            {{ currentQuestion.text }}
          </h3>
          
          <div class="space-y-3">
            <button 
              v-for="(opt, index) in currentQuestion.options" 
              :key="index"
              @click="selectAnswer(opt)"
              class="w-full text-left p-4 bg-evil-dark/50 border border-evil-light/20 rounded-evil-md text-evil-light hover:bg-evil-red hover:border-evil-red hover:text-white transition-all"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else class="text-center py-8">
          <p class="text-evil-mid">Berechne dein Ergebnis...</p>
        </div>
        
      </ContentCard>
      
    </div>
  </div>
</template>
