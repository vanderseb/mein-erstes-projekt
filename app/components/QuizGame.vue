<script setup lang="ts">
// Shared Component for the Quiz Flow
// Used in both /quiz/index.vue and /bewerbung/[id].vue

const emit = defineEmits<{
  (e: 'complete'): void
}>();

// Initialize Quiz Flow
const { 
  currentQuestion, 
  progress, 
  selectAnswer 
} = useQuizFlow({
  onComplete: () => {
    emit('complete');
  }
});
</script>

<template>
  <div class="w-full">
    
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
      <h3 class="text-white text-lg mb-6 min-h-[60px]">
        {{ currentQuestion.text }}
      </h3>
      
      <div class="space-y-3">
        <button 
          v-for="(opt, index) in currentQuestion.options" 
          :key="index"
          @click="selectAnswer(opt)"
          class="w-full text-left p-4 bg-evil-dark/50 border border-evil-light/20 rounded-evil-md text-evil-light hover:bg-evil-red hover:border-evil-red hover:text-white transition-all group"
        >
          <span class="flex items-center">
            <span class="opacity-0 group-hover:opacity-100 transition-opacity mr-2">▸</span>
            {{ opt.label }}
          </span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-8">
      <p class="text-evil-mid animate-pulse">Analysiere Persönlichkeit...</p>
    </div>
    
  </div>
</template>
