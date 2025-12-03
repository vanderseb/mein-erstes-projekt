<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { getJobById } = useJobs();
const { allApplicationQuestions, adminFields } = useQuestions();
const { resetScores, processAnswer, evilScore } = useEvilState();

const jobId = route.params.id as string;
const job = getJobById(jobId);

// State für den Prozess
const step = ref(0);
const showAdminForm = ref(false);
const adminData = ref<Record<string, string>>({});

// Init: Scores zurücksetzen beim Start
onMounted(() => {
  resetScores();
});

const currentQuestion = computed(() => allApplicationQuestions[step.value]);
const progress = computed(() => ((step.value + 1) / allApplicationQuestions.length) * 100);

// Antwort wählen
const selectAnswer = (option: any) => {
  processAnswer(option);

  if (step.value < allApplicationQuestions.length - 1) {
    step.value++;
  } else {
    showAdminForm.value = true;
  }
};

const submitApplication = () => {
  alert(`Bewerbung für ${job?.title} versendet!\nEvil Score: ${evilScore.value}\nDaten: ${JSON.stringify(adminData.value)}`);
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-xl mx-auto">
      
      <template v-if="job">
        
        <ContentCard padding="lg">
          
          <!-- Header -->
          <div class="mb-6">
            <p class="text-evil-mid text-sm uppercase tracking-wider mb-1">Bewerbung für</p>
            <h2 class="text-white text-xl">{{ job.title }}</h2>
          </div>

          <!-- Progress Bar -->
          <div v-if="!showAdminForm" class="mb-8">
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

          <!-- Fragen -->
          <div v-if="!showAdminForm && currentQuestion">
            <h3 class="text-white text-lg mb-6 min-h-[60px]">
              {{ currentQuestion.text }}
            </h3>

            <div class="space-y-3">
              <button 
                v-for="(opt, index) in currentQuestion.options" 
                :key="index"
                @click="selectAnswer(opt)"
                class="w-full text-left p-4 bg-evil-dark/50 border border-evil-light/20 rounded-evil-md text-evil-light hover:bg-evil-mid/30 hover:border-evil-light/40 transition-all"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- Admin Formular -->
          <div v-else>
            <h3 class="text-white text-lg mb-6">Letzter Schritt: Deine Daten</h3>
            
            <div class="space-y-4">
              <div v-for="field in adminFields" :key="field.id">
                <label class="block text-sm font-bold text-evil-light mb-2">
                  {{ field.label }}
                </label>
                <input 
                  v-model="adminData[field.id]"
                  :type="field.type"
                  :placeholder="field.placeholder"
                  class="w-full bg-evil-dark border border-evil-light/20 text-evil-light p-3 rounded-evil-md focus:border-evil-red focus:outline-none transition-colors placeholder:text-evil-mid"
                />
              </div>
            </div>

            <BaseButton 
              @click="submitApplication"
              type="submit"
              class="w-full mt-8 text-center"
            >
              BEWERBUNG ABSENDEN
            </BaseButton>
          </div>

        </ContentCard>

      </template>

    </div>
  </div>
</template>
