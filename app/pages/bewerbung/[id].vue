<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { getJobById } = useJobs();
const { allApplicationQuestions, adminFields } = useQuestions();
const { resetScores, processAnswer, evilScore, jobScores } = useEvilState();

const jobId = route.params.id as string;
const job = getJobById(jobId);

// State für den Prozess
const step = ref(0); // 0 bis Questions.length
const showAdminForm = ref(false);
const adminData = ref<Record<string, string>>({});

// Init: Scores zurücksetzen beim Start
onMounted(() => {
  resetScores();
});

const currentQuestion = computed(() => allApplicationQuestions[step.value]);

// Antwort wählen
const selectAnswer = (option: any) => {
  // Punkte speichern
  processAnswer(option);

  // Weitergehen
  if (step.value < allApplicationQuestions.length - 1) {
    step.value++;
  } else {
    // Fragen fertig -> Admin Formular zeigen
    showAdminForm.value = true;
  }
};

const submitApplication = () => {
  alert(`Bewerbung für ${job?.title} versendet!\nEvil Score: ${evilScore.value}\nDaten: ${JSON.stringify(adminData.value)}`);
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div v-if="job" class="bg-white p-8 rounded-xl shadow-xl max-w-xl w-full">
      
      <h2 class="text-sm font-bold uppercase text-gray-400 mb-2">Bewerbung für {{ job.title }}</h2>
      
      <div v-if="!showAdminForm && currentQuestion">
        <div class="mb-4 text-right text-xs text-gray-400">
          Frage {{ step + 1 }} von {{ allApplicationQuestions.length }}
        </div>

        <h3 class="text-xl font-bold mb-6 min-h-[60px]">{{ currentQuestion.text }}</h3>

        <div class="space-y-3">
          <button 
            v-for="(opt, index) in currentQuestion.options" 
            :key="index"
            @click="selectAnswer(opt)"
            class="w-full text-left p-4 border rounded hover:bg-gray-100 hover:border-gray-400 transition"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <div v-else>
        <h3 class="text-xl font-bold mb-6">Letzter Schritt: Deine Daten</h3>
        
        <div class="space-y-4">
          <div v-for="field in adminFields" :key="field.id">
            <label class="block text-sm font-bold text-gray-700 mb-1">{{ field.label }}</label>
            <input 
              v-model="adminData[field.id]"
              :type="field.type"
              :placeholder="field.placeholder"
              class="w-full border p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        <button 
          @click="submitApplication"
          class="w-full mt-8 bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 transition"
        >
          BEWERBUNG ABSENDEN
        </button>
      </div>

    </div>
  </div>
</template>