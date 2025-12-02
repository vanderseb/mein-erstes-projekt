<script setup lang="ts">
const router = useRouter();
const { allApplicationQuestions } = useQuestions();
const { resetScores, processAnswer } = useEvilState();

const step = ref(0);
const currentQuestion = computed(() => allApplicationQuestions[step.value]);

// Reset beim Start
onMounted(() => resetScores());

const selectAnswer = (option: any) => {
  processAnswer(option);
  
  if (step.value < allApplicationQuestions.length - 1) {
    step.value++;
  } else {
    // Fertig -> Zum Ergebnis
    router.push('/jeopardy/result');
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
    <div class="max-w-xl w-full bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700">
      <h1 class="text-red-500 font-bold mb-6">Evil Assessment Center</h1>
      
      <div v-if="currentQuestion">
        <h3 class="text-xl font-bold mb-6">{{ currentQuestion.text }}</h3>
        
        <div class="space-y-3">
          <button 
            v-for="(opt, index) in currentQuestion.options" 
            :key="index"
            @click="selectAnswer(opt)"
            class="w-full text-left p-4 bg-gray-700 rounded hover:bg-red-600 transition"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>