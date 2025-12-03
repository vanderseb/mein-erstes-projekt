<script setup lang="ts">
const router = useRouter();
const { allApplicationQuestions } = useQuestions();
const { resetScores, processAnswer } = useEvilState();

const step = ref(0);
const currentQuestion = computed(() => allApplicationQuestions[step.value]);
const progress = computed(() => ((step.value + 1) / allApplicationQuestions.length) * 100);

// Reset beim Start
onMounted(() => resetScores());

const selectAnswer = (option: any) => {
  processAnswer(option);
  
  if (step.value < allApplicationQuestions.length - 1) {
    step.value++;
  } else {
    router.push('/quiz/result');
  }
};
</script>

<template>
  <div class="min-h-screen py-12 px-4 flex items-center justify-center">
    <div class="max-w-xl w-full">
      
      <ContentCard padding="lg">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-evil-red text-2xl mb-2">Evil Assessment Center</h1>
          <p class="text-evil-mid text-sm">Finde heraus, wie böse du wirklich bist.</p>
        </div>

        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="flex justify-between text-xs text-evil-mid mb-2">
            <span>Frage {{ step + 1 }} von {{ allApplicationQuestions.length }}</span>
            <span>{{ Math.round(progress) }}%</span>
          </div>
          <div class="h-1 bg-evil-dark rounded-full overflow-hidden">
            <div 
              class="h-full bg-evil-red transition-all duration-300"
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
        
      </ContentCard>
      
    </div>
  </div>
</template>
