<script setup lang="ts">
import { useApplications, type Application, type ApplicationStatus } from '@/composables/useApplications';
import { useJobs, type Job, DEPARTMENT_LABELS, type Department } from '@/composables/useJobs';

const route = useRoute();
const router = useRouter();
const applicationId = parseInt(route.params.id as string);

// Data
const { getApplicationById, updateStatus, deleteApplications } = useApplications();
const { getJobById } = useJobs();

// State
const application = ref<Application | null>(null);
const job = ref<Job | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const showDeleteConfirm = ref(false);

// Load data
const loadData = async () => {
    loading.value = true;
    error.value = null;

    const app = await getApplicationById(applicationId);
    if (!app) {
        error.value = 'Bewerbung nicht gefunden';
        loading.value = false;
        return;
    }

    application.value = app;

    // Load job data
    const jobData = await getJobById(app.job_id);
    job.value = jobData;

    loading.value = false;
};

await loadData();

// Helpers
const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
        case 'open': return 'Offen';
        case 'in_progress': return 'In Bearbeitung';
        case 'accepted': return 'Angenommen';
        case 'rejected': return 'Abgelehnt';
        default: return status;
    }
};

const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
        case 'accepted': return 'text-green-400';
        default: return 'text-evil-light';
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
};

// Comparison data
const comparisonFields = computed(() => {
    if (!application.value || !job.value) return [];
    
    return [
        {
            label: 'Expertise',
            applicant: application.value.expertise,
            job: job.value.expertise,
            match: application.value.expertise === job.value.expertise
        },
        {
            label: 'Hierarchy',
            applicant: application.value.hierarchy,
            job: job.value.hierarchy,
            match: application.value.hierarchy === job.value.hierarchy
        },
        {
            label: 'Approach',
            applicant: application.value.approach,
            job: job.value.approach,
            match: application.value.approach === job.value.approach
        },
        {
            label: 'Risk',
            applicant: application.value.risk,
            job: job.value.risk,
            match: application.value.risk === job.value.risk
        }
    ];
});

// Actions
const handleStatusChange = async (status: ApplicationStatus) => {
    if (!application.value) return;
    const success = await updateStatus(application.value.application_id, status);
    if (success) {
        application.value.status = status;
    }
};

const handleDelete = async () => {
    if (!application.value) return;
    const result = await deleteApplications([application.value.application_id]);
    if (result.success) {
        router.push('/dashboard');
    }
};
</script>

<template>
  <div>
    <!-- Header Section -->
    <section class="py-8 md:py-12 px-4 border-b border-evil-light/10">
      <div class="max-w-4xl mx-auto">
        <NuxtLink 
          to="/dashboard" 
          class="inline-flex items-center text-evil-light/60 hover:text-evil-light mb-4 transition-colors"
        >
          ← Zurück zum Dashboard
        </NuxtLink>
        <h1 class="text-white text-2xl md:text-3xl font-bold">Bewerbungsdetails</h1>
      </div>
    </section>

    <!-- Content -->
    <section class="py-8 px-4">
      <div class="max-w-4xl mx-auto">

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12 text-evil-light/50">
          Lade Bewerbungsdetails...
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-evil-red mb-4">{{ error }}</p>
          <NuxtLink to="/dashboard" class="text-evil-light hover:text-white">
            Zurück zum Dashboard
          </NuxtLink>
        </div>

        <!-- Content -->
        <div v-else-if="application" class="space-y-6">

          <!-- Status & Actions -->
          <ContentCard padding="md">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p class="text-evil-light/60 text-sm uppercase tracking-wider mb-1">Aktueller Status</p>
                <p :class="['text-xl font-bold', getStatusColor(application.status)]">
                  {{ getStatusLabel(application.status) }}
                </p>
              </div>
              <div class="flex flex-wrap gap-2">
                <button 
                  @click="handleStatusChange('open')"
                  :class="[
                    'px-3 py-1 text-sm border rounded-evil-md transition-colors',
                    application.status === 'open' 
                      ? 'bg-evil-light text-evil-dark border-evil-light' 
                      : 'bg-evil-light/10 text-evil-light border-evil-light/20 hover:bg-evil-light/20'
                  ]"
                >
                  Offen
                </button>
                <button 
                  @click="handleStatusChange('in_progress')"
                  :class="[
                    'px-3 py-1 text-sm border rounded-evil-md transition-colors',
                    application.status === 'in_progress' 
                      ? 'bg-evil-light text-evil-dark border-evil-light' 
                      : 'bg-evil-light/10 text-evil-light border-evil-light/20 hover:bg-evil-light/20'
                  ]"
                >
                  In Bearbeitung
                </button>
                <button 
                  @click="handleStatusChange('rejected')"
                  :class="[
                    'px-3 py-1 text-sm border rounded-evil-md transition-colors',
                    application.status === 'rejected' 
                      ? 'bg-evil-light text-evil-dark border-evil-light' 
                      : 'bg-evil-light/10 text-evil-light border-evil-light/20 hover:bg-evil-light/20'
                  ]"
                >
                  Abgelehnt
                </button>
                <button 
                  @click="handleStatusChange('accepted')"
                  :class="[
                    'px-3 py-1 text-sm border rounded-evil-md transition-colors',
                    application.status === 'accepted' 
                      ? 'bg-green-500 text-white border-green-500' 
                      : 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
                  ]"
                >
                  Angenommen
                </button>
                <button 
                  @click="showDeleteConfirm = true"
                  class="px-3 py-1 text-sm bg-evil-red/20 text-evil-red border border-evil-red/30 rounded-evil-md hover:bg-evil-red/30 transition-colors"
                >
                  Löschen
                </button>
              </div>
            </div>
          </ContentCard>

          <!-- Personal Data -->
          <ContentCard padding="lg">
            <h2 class="text-white text-lg font-bold mb-4 pb-2 border-b border-evil-light/10">Persönliche Daten</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-evil-light/60 text-sm">Vorname</p>
                <p class="text-white font-medium">{{ application.first_name }}</p>
              </div>
              <div>
                <p class="text-evil-light/60 text-sm">Nachname</p>
                <p class="text-white font-medium">{{ application.last_name }}</p>
              </div>
              <div>
                <p class="text-evil-light/60 text-sm">E-Mail</p>
                <p class="text-white font-medium">{{ application.email }}</p>
              </div>
              <div>
                <p class="text-evil-light/60 text-sm">Evil Score</p>
                <p :class="application.evil_score === 0 ? 'text-evil-red' : 'text-white'" class="font-mono font-bold text-lg">
                  {{ application.evil_score }}
                </p>
              </div>
              <div>
                <p class="text-evil-light/60 text-sm">Gehaltswunsch</p>
                <p class="text-white font-mono font-medium">₿ {{ application.salary }}</p>
              </div>
              <div>
                <p class="text-evil-light/60 text-sm">Verfügbarkeit</p>
                <p class="text-white font-medium">{{ formatDate(application.availability) }}</p>
              </div>
              <div v-if="application.cv" class="md:col-span-2">
                <p class="text-evil-light/60 text-sm mb-1">Lebenslauf</p>
                <a 
                  :href="application.cv" 
                  target="_blank" 
                  class="inline-flex items-center text-evil-red hover:text-evil-red/80 transition-colors"
                >
                  📄 CV herunterladen →
                </a>
              </div>
            </div>
          </ContentCard>

          <!-- Job Data -->
          <ContentCard padding="lg">
            <h2 class="text-white text-lg font-bold mb-4 pb-2 border-b border-evil-light/10">Job Daten</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p class="text-evil-light/60 text-sm">Job-ID</p>
                <p class="text-white font-mono">{{ application.job_id }}</p>
              </div>
              <div>
                <p class="text-evil-light/60 text-sm">Titel</p>
                <p class="text-white font-medium">{{ job?.title || '—' }}</p>
              </div>
              <div class="md:col-span-2">
                <p class="text-evil-light/60 text-sm">Department</p>
                <p class="text-white font-medium">{{ job ? DEPARTMENT_LABELS[job.department as Department] : '—' }}</p>
              </div>
            </div>

            <!-- Comparison Table -->
            <h3 class="text-white font-bold mb-3">Profil-Vergleich</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="border-b border-evil-light/10 text-evil-light/50 text-sm uppercase tracking-wider">
                    <th class="py-2 pr-4">Kriterium</th>
                    <th class="py-2 pr-4">Bewerber</th>
                    <th class="py-2 pr-4">Anforderung</th>
                    <th class="py-2">Match</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-evil-light/10">
                  <tr v-for="field in comparisonFields" :key="field.label">
                    <td class="py-3 pr-4 text-evil-light/70">{{ field.label }}</td>
                    <td class="py-3 pr-4 text-white">{{ field.applicant }}</td>
                    <td class="py-3 pr-4 text-white">{{ field.job }}</td>
                    <td class="py-3">
                      <span 
                        :class="field.match ? 'text-green-400' : 'text-evil-red'"
                        class="font-bold text-lg"
                      >
                        {{ field.match ? '✓' : '✗' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ContentCard>

          <!-- Metadata -->
          <ContentCard padding="md">
            <p class="text-evil-light/50 text-sm">
              Eingegangen am {{ formatDate(application.created_at) }}
            </p>
          </ContentCard>

        </div>

        <!-- Delete Confirmation Modal -->
        <div 
          v-if="showDeleteConfirm" 
          class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          <div class="bg-evil-darker border border-evil-light/20 rounded-evil-lg p-6 max-w-md w-full">
            <h3 class="text-white text-lg font-bold mb-4">Löschen bestätigen</h3>
            <p class="text-evil-light/70 mb-6">
              Möchtest du diese Bewerbung wirklich unwiderruflich löschen?
              <br><br>
              <span class="text-evil-red">⚠️ Dies löscht auch den zugehörigen Lebenslauf!</span>
            </p>
            <div class="flex gap-3 justify-end">
              <button 
                @click="showDeleteConfirm = false"
                class="px-4 py-2 text-evil-light border border-evil-light/30 rounded-evil-md hover:bg-evil-light/10 transition-colors"
              >
                Abbrechen
              </button>
              <button 
                @click="handleDelete"
                class="px-4 py-2 bg-red-700 text-white rounded-evil-md hover:bg-red-600 transition-colors"
              >
                Endgültig löschen
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>
