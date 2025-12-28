<script setup lang="ts">
import type { Job } from '~/composables/useJobs';

const route = useRoute();
const router = useRouter();
const { getJobById } = useJobs();
const { adminFields } = useQuestions();
const { evilScore } = useEvilState();

// --- STATE ---
const jobId = route.query.jobId as string | undefined;
const fromQuiz = route.query.fromQuiz === 'true';

const job = ref<Job | null>(null);
const loading = ref(true);
const showAdminForm = ref(false);
const adminData = ref<Record<string, string>>({});

// --- COMPUTED ---
const pageTitle = computed(() => {
  if (job.value) return `Bewerbung für: ${job.value.title}`;
  return 'Evil Assessment Center';
});

const pageSubtitle = computed(() => {
  if (job.value) return 'Beweise deine Kompetenz.';
  return 'Finde heraus, welcher Job zu dir passt.';
});

// --- INIT ---
onMounted(async () => {
  if (jobId) {
    // Mode: Direktbewerbung (oder aus Quiz-Ergebnis gewählt)
    job.value = await getJobById(jobId);
    
    // Wenn wir vom Quiz kommen, überspringen wir das Spiel
    if (fromQuiz) {
      showAdminForm.value = true;
    }
  }
  // Mode: Allgemeines Quiz (kein Job geladen)
  loading.value = false;
});

// --- HANDLER ---

// Wenn Spiel beendet
const onGameComplete = () => {
  if (job.value) {
    // Wenn wir einen Job haben, geht's zum Formular
    showAdminForm.value = true;
  } else {
    // Wenn wir KEINEN Job haben (Quiz Mode), geht's zum Ergebnis
    router.push('/assessment/result');
  }
};

// Formular Absenden
const submitApplication = () => {
  if (!job.value) return; // Should not happen
  alert(`Bewerbung für ${job.value.title} versendet!\nEvil Score: ${evilScore.value}\nDaten: ${JSON.stringify(adminData.value)}`);
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen py-12 px-4 flex items-center justify-center">
    <div class="max-w-xl w-full">

      <!-- Loading -->
      <template v-if="loading">
        <ContentCard padding="lg" class="text-center">
          <p class="text-4xl mb-4 animate-pulse">⏳</p>
          <p class="text-evil-mid">Initialisiere Protokolle...</p>
        </ContentCard>
      </template>

      <!-- Main Content -->
      <template v-else>
        <ContentCard padding="lg">
          
          <!-- Header -->
          <div class="text-center mb-8">
            <template v-if="job">
              <p class="text-evil-mid text-sm uppercase tracking-wider mb-1">Bewerbung</p>
              <h1 class="text-white text-xl">{{ job.title }}</h1>
            </template>
            <template v-else>
              <h1 class="text-evil-red text-2xl mb-2">Evil Assessment Center</h1>
              <p class="text-evil-mid text-sm">{{ pageSubtitle }}</p>
            </template>
          </div>

          <!-- 1. SPIEL (Wenn Formular noch nicht aktiv) -->
          <div v-if="!showAdminForm">
            <QuizGame @complete="onGameComplete" />
          </div>

          <!-- 2. ADMIN FORMULAR (Nur wenn Job bekannt und Spiel fertig/übersprungen) -->
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
