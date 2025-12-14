<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { getJobById } = useJobs();
const { adminFields } = useQuestions();
const { evilScore } = useEvilState();

// Job aus URL
const jobId = route.params.id as string;
const job = getJobById(jobId);

// State für Bewerbungsformular
const showAdminForm = ref(false);
const adminData = ref<Record<string, string>>({});

// Quiz Flow mit Callback zum Formular (kein automatischer Reset)
const { currentQuestion, progress, selectAnswer, resetScores } = useQuizFlow({
    onComplete: () => { showAdminForm.value = true; },
    autoReset: false
});

// Prüfe beim Start ob User vom Quiz kommt (via Query-Parameter)
const fromQuiz = route.query.fromQuiz === 'true';

onMounted(() => {
    if (fromQuiz) {
        // User kommt vom Quiz-Result -> direkt Formular zeigen
        showAdminForm.value = true;
    } else {
        // Frischer Start von Stellenanzeige -> Reset durchführen
        resetScores();
    }
});

// Bewerbung absenden
const submitApplication = () => {
    alert(`Bewerbung für ${job?.title} versendet!\nEvil Score: ${evilScore.value}\nDaten: ${JSON.stringify(adminData.value)}`);
    router.push('/');
};
</script>

<template>
  <div class="min-h-screen py-12 px-4 flex items-center justify-center">
    <div class="max-w-xl w-full">
      
      <template v-if="job">
        <ContentCard padding="lg">
          
          <!-- Header -->
          <div class="text-center mb-8">
            <p class="text-evil-mid text-sm uppercase tracking-wider mb-1">Bewerbung für</p>
            <h1 class="text-evil-red text-2xl">{{ job.title }}</h1>
          </div>

          <!-- Progress Bar - nur während der Fragen -->
          <div v-if="!showAdminForm" class="mb-8">
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
          
          <!-- Fragen -->
          <div v-if="currentQuestion && !showAdminForm">
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

          <!-- Admin Formular -->
          <div v-else-if="showAdminForm">
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
              class="w-full mt-8 text-center"
            >
              BEWERBUNG ABSENDEN
            </BaseButton>
          </div>

          <!-- Loading State -->
          <div v-else class="text-center py-8">
            <p class="text-evil-mid">Laden...</p>
          </div>
          
        </ContentCard>
      </template>

      <!-- Job nicht gefunden -->
      <template v-else>
        <ContentCard padding="lg" class="text-center">
          <p class="text-6xl mb-6">☠️</p>
          <h1 class="text-white text-xl mb-4">Job nicht gefunden</h1>
          <p class="text-evil-mid mb-8">Diese Position existiert nicht.</p>
          <BaseButton href="/karriere" variant="secondary">
            Zurück zur Karriereübersicht
          </BaseButton>
        </ContentCard>
      </template>
      
    </div>
  </div>
</template>
