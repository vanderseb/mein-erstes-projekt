<script setup lang="ts">
import type { Job } from '~/composables/useJobs';

const route = useRoute();
const router = useRouter();
const { getJobById } = useJobs();
const { adminFields } = useQuestions();
const { evilScore } = useEvilState();

const jobId = route.params.id as string;

// Job async laden
const job = ref<Job | null>(null);
const jobLoading = ref(true);

// State für den Prozess
const showAdminForm = ref(false);
const adminData = ref<Record<string, string>>({});

// Initialize Quiz Flow
const { 
  currentQuestion, 
  progress, 
  selectAnswer 
} = useQuizFlow({
  onComplete: () => {
    showAdminForm.value = true;
  }
});

// Init: Job laden
onMounted(async () => {
  job.value = await getJobById(jobId);
  jobLoading.value = false;
});

const submitApplication = () => {
  alert(`Bewerbung für ${job.value?.title} versendet!\nEvil Score: ${evilScore.value}\nDaten: ${JSON.stringify(adminData.value)}`);
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-xl mx-auto">

      <!-- Loading State -->
      <template v-if="jobLoading">
        <ContentCard padding="lg" class="text-center">
          <p class="text-4xl mb-4 animate-pulse">⏳</p>
          <p class="text-evil-mid">Lade Bewerbungsformular...</p>
        </ContentCard>
      </template>
      
      <template v-else-if="job">
        
        <ContentCard padding="lg">
          
          <!-- Header -->
          <div class="mb-6">
            <p class="text-evil-mid text-sm uppercase tracking-wider mb-1">Bewerbung für</p>
            <h2 class="text-white text-xl">{{ job.title }}</h2>
          </div>

          <!-- Progress Bar -->
          <div v-if="!showAdminForm" class="mb-8">
            <div class="flex justify-between text-xs text-evil-mid mb-2">
              <span>Fortschritt</span>
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
