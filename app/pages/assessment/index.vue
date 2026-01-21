<script setup lang="ts">
import type { Job } from '~/composables/useJobs';
import { useApplications, type CreateApplicationInput } from '~/composables/useApplications';

const route = useRoute();
const router = useRouter();
const { getJobById } = useJobs();
const { adminFields } = useQuestions();
const { evilScore, finalExpertise, selectedAttributes } = useQuizState();
const { createApplication } = useApplications();

const jobId = route.query.jobId as string | undefined;
const fromQuiz = route.query.fromQuiz === 'true';

const job = ref<Job | null>(null);
const loading = ref(true);
const submitting = ref(false);
const showAdminForm = ref(false);
const adminData = ref<Record<string, any>>({});
const errors = ref<Record<string, string>>({});

const pageTitle = computed(() => {
  if (job.value) return `Bewerbung für: ${job.value.title}`;
  return 'Evil Assessment Center';
});

const pageSubtitle = computed(() => {
  if (job.value) return 'Beweise deine Kompetenz.';
  return 'Finde heraus, welcher Job zu dir passt.';
});

onMounted(async () => {
  if (jobId) {
    job.value = await getJobById(jobId);
    
    if (fromQuiz) {
      showAdminForm.value = true;
    }
  }
  loading.value = false;
});


// Datum von DD.MM.YYYY zu YYYY-MM-DD konvertieren
const convertDateToISO = (dateStr: string): string => {
  const parts = dateStr.split('.');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

// Wenn Spiel zu Ende
const onGameComplete = () => {
  if (job.value) {
    // Direktbewerbung
    showAdminForm.value = true;
  } else {
    // Über Quiz-Ergebnis
    router.push('/assessment/result');
  }
};

// File Upload Handler
const handleFileUpload = (event: Event, field: any) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // Größenprüfung
    if (field.maxSize && file.size > field.maxSize) {
      errors.value[field.id] = field.errorMessage || 'Datei ist zu groß.';
      adminData.value[field.id] = null;
      return;
    }
    // Typprüfung
    if (field.accept && !file.type.match(field.accept.replace('*', '.*'))) {
      errors.value[field.id] = field.errorMessage || 'Falsches Dateiformat.';
      adminData.value[field.id] = null;
      return;
    }

    errors.value[field.id] = '';
    adminData.value[field.id] = file;
  }
};

const submitApplication = async () => {
  if (!job.value || submitting.value) return; 

  errors.value = {};
  let isValid = true;

  for (const field of adminFields) {
    const value = adminData.value[field.id];

    // 1. Pflichtfelder Check
    if (!value && value !== 0) {
      errors.value[field.id] = 'Dieses Feld ist erforderlich.';
      isValid = false;
      continue;
    }

    // 2. Pattern Check
    if (field.pattern && typeof value === 'string') {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        errors.value[field.id] = field.errorMessage || 'Ungültiges Format.';
        isValid = false;
      }
    }
  }

  if (!isValid) return;

  // Formular absenden
  submitting.value = true;

  const applicationInput: CreateApplicationInput = {
    job_id: job.value.job_id,
    job_title: job.value.title,
    first_name: adminData.value.first_name,
    last_name: adminData.value.last_name,
    email: adminData.value.email,
    salary: parseFloat(adminData.value.salary),
    availability: convertDateToISO(adminData.value.availability),
    evil_score: evilScore.value,
    expertise: finalExpertise.value || '',
    risk: selectedAttributes.value.risk || '',
    approach: selectedAttributes.value.approach || '',
    hierarchy: selectedAttributes.value.hierarchy || '',
    cv_file: adminData.value.cv || null
  };

  const result = await createApplication(applicationInput);

  submitting.value = false;

  if (result.success) {
    router.push(`/assessment/success?email=${encodeURIComponent(adminData.value.email)}`);
  } else {
    errors.value.submit = result.error || 'Ein Fehler ist aufgetreten.';
    console.error('Submission error:', result.error);
  }
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

      <!-- Content -->
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

          <!-- 1. Spiel abschließen -->
          <div v-if="!showAdminForm">
            <QuizGame @complete="onGameComplete" />
          </div>

          <!-- 2. Admin Formular -->
          <div v-else>
            <h3 class="text-white text-lg mb-6">Letzter Schritt: Deine Daten</h3>
            
            <div class="space-y-4">
              <div v-for="field in adminFields" :key="field.id">
                <label class="block text-sm font-bold text-evil-light mb-2">
                  {{ field.label }} <span v-if="errors[field.id]" class="text-evil-red text-xs ml-2">{{ errors[field.id] }}</span>
                </label>
                
                <input 
                  v-if="field.type === 'file'"
                  type="file"
                  :accept="field.accept"
                  @change="(e) => handleFileUpload(e, field)"
                  class="w-full text-evil-light file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-evil-red file:text-white hover:file:bg-evil-red/80 cursor-pointer text-sm"
                />

                <input 
                  v-else
                  v-model="adminData[field.id]"
                  :type="field.type"
                  :placeholder="field.placeholder"
                  class="w-full bg-evil-dark border border-evil-light/20 text-evil-light p-3 rounded-evil-md focus:border-evil-red focus:outline-none transition-colors placeholder:text-evil-mid"
                  :class="{ 'border-evil-red': errors[field.id] }"
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
