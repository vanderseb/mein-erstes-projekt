<script setup lang="ts">
import { useApplications, type Application, type ApplicationStatus } from '@/composables/useApplications';
import { useJobs, type Job } from '@/composables/useJobs';
import { getStatusLabel, getStatusColor, formatDate } from '@/composables/useApplicationUtils';

const supabase = useSupabaseClient();
const router = useRouter();

// Logout
const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
};

// Data
const { 
    applications, 
    loading, 
    error,
    fetchApplications, 
    updateBulkStatus,
    deleteApplications,
    totalApplications, 
    openApplications, 
    averageEvilScore 
} = useApplications();

const { jobs, fetchJobs } = useJobs();

// Bewerbungen und Jobs laden
await Promise.all([fetchApplications(), fetchJobs()]);

// Selection State
const selectedIds = ref<number[]>([]);
const showDeleteConfirm = ref(false);

// Filter States
const filterJob = ref<string>('');
const filterEvilScore = ref<string>('');
const filterMatches = ref<string>('');
const filterStatus = ref<string>('');

// Computed: Unique job titles for filter
const uniqueJobTitles = computed(() => {
    const titles = new Set<string>();
    applications.value.forEach(app => {
        const job = getJobForApplication(app);
        if (job) titles.add(job.title);
    });
    return Array.from(titles).sort();
});

// Computed: Unique evil scores for filter
const uniqueEvilScores = computed(() => {
    const scores = new Set<number>();
    applications.value.forEach(app => scores.add(app.evil_score));
    return Array.from(scores).sort((a, b) => b - a);
});

// Gefilterte Liste
const filteredApplications = computed(() => {
    let result = applications.value;
    
    if (filterJob.value) {
        result = result.filter(app => {
            const job = getJobForApplication(app);
            return job?.title === filterJob.value;
        });
    }
    
    if (filterEvilScore.value) {
        result = result.filter(app => app.evil_score === parseInt(filterEvilScore.value));
    }
    
    if (filterMatches.value) {
        result = result.filter(app => getMatchCount(app) === parseInt(filterMatches.value));
    }
    
    if (filterStatus.value) {
        result = result.filter(app => app.status === filterStatus.value);
    }
    
    return result;
});

// Check if all visible items are selected
const allSelected = computed(() => {
    if (filteredApplications.value.length === 0) return false;
    return filteredApplications.value.every(app => selectedIds.value.includes(app.application_id));
});

// Hilfsfunktionen
const getJobForApplication = (app: Application): Job | undefined => {
    return jobs.value.find(job => job.job_id === app.job_id);
};

const getMatchCount = (app: Application): number => {
    const job = getJobForApplication(app);
    if (!job) return 0;
    
    let matches = 0;
    if (app.expertise === job.expertise) matches++;
    if (app.hierarchy === job.hierarchy) matches++;
    if (app.approach === job.approach) matches++;
    if (app.risk === job.risk) matches++;
    
    return matches;
};

// Selection handlers
const toggleAll = () => {
    if (allSelected.value) {
        selectedIds.value = [];
    } else {
        selectedIds.value = filteredApplications.value.map(app => app.application_id);
    }
};

const toggleSelection = (id: number) => {
    const index = selectedIds.value.indexOf(id);
    if (index === -1) {
        selectedIds.value.push(id);
    } else {
        selectedIds.value.splice(index, 1);
    }
};

// Bulk action handlers
const handleBulkStatus = async (status: ApplicationStatus) => {
    if (selectedIds.value.length === 0) return;
    await updateBulkStatus(selectedIds.value, status);
    selectedIds.value = [];
};

const handleBulkDelete = async () => {
    if (selectedIds.value.length === 0) return;
    const result = await deleteApplications(selectedIds.value);
    if (result.success) {
        selectedIds.value = [];
    }
    showDeleteConfirm.value = false;
};
</script>

<template>
  <div>
    <!-- Header Section -->
    <section class="py-12 md:py-16 px-4 border-b border-evil-light/10">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <div>
          <h1 class="text-white text-3xl md:text-4xl font-bold mb-2">HR Dashboard</h1>
          <p class="text-evil-light/70">Bewerbungsmanagement für Dr. Evil & Söhne</p>
        </div>
        <button 
          @click="logout"
          class="px-4 py-2 text-sm text-evil-mid hover:text-evil-light border border-evil-light/20 rounded-evil-md hover:border-evil-light/40 transition-colors"
        >
          Abmelden
        </button>
      </div>
    </section>

    <!-- KPIs -->
    <section class="py-8 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <ContentCard padding="md">
            <p class="text-evil-light/60 text-sm uppercase tracking-wider mb-1">Gesamt</p>
            <p class="text-white text-3xl font-bold">{{ totalApplications }}</p>
          </ContentCard>

          <ContentCard padding="md">
            <p class="text-evil-light/60 text-sm uppercase tracking-wider mb-1">Offen</p>
            <p class="text-evil-red text-3xl font-bold">{{ openApplications }}</p>
          </ContentCard>

          <ContentCard padding="md">
            <p class="text-evil-light/60 text-sm uppercase tracking-wider mb-1">Ø Evil Score</p>
            <p class="text-white text-3xl font-bold">{{ averageEvilScore }}</p>
          </ContentCard>

        </div>
      </div>
    </section>

    <!-- Bewerbungen Liste -->
    <section class="py-8 px-4">
      <div class="max-w-6xl mx-auto">
        
        <ContentCard padding="lg">
          <!-- Header -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-evil-light/10">
            <h2 class="text-white text-xl font-bold">Eingegangene Bewerbungen</h2>
          </div>

          <!-- Bulk Actions Bar (appears when items selected) -->
          <div 
            v-if="selectedIds.length > 0" 
            class="mb-4 p-3 bg-evil-dark/50 border border-evil-light/20 rounded-evil-md flex flex-wrap items-center gap-3"
          >
            <span class="text-evil-light text-sm">{{ selectedIds.length }} ausgewählt</span>
            <div class="flex flex-wrap gap-2">
              <button 
                @click="handleBulkStatus('open')"
                class="px-3 py-1 text-sm bg-evil-light/10 text-evil-light border border-evil-light/20 rounded-evil-md hover:bg-evil-light/20 transition-colors"
              >
                Offen
              </button>
              <button 
                @click="handleBulkStatus('in_progress')"
                class="px-3 py-1 text-sm bg-evil-light/10 text-evil-light border border-evil-light/20 rounded-evil-md hover:bg-evil-light/20 transition-colors"
              >
                In Bearbeitung
              </button>
              <button 
                @click="handleBulkStatus('rejected')"
                class="px-3 py-1 text-sm bg-evil-light/10 text-evil-light border border-evil-light/20 rounded-evil-md hover:bg-evil-light/20 transition-colors"
              >
                Abgelehnt
              </button>
              <button 
                @click="handleBulkStatus('accepted')"
                class="px-3 py-1 text-sm bg-green-500/20 text-green-400 border border-green-500/30 rounded-evil-md hover:bg-green-500/30 transition-colors"
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

          <!-- Delete Confirmation Modal -->
          <div 
            v-if="showDeleteConfirm" 
            class="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div class="bg-evil-dark border border-evil-light/30 rounded-evil-lg p-6 max-w-md w-full shadow-2xl shadow-black/50">
              <h3 class="text-white text-lg font-bold mb-4">Löschen bestätigen</h3>
              <p class="text-evil-light/70 mb-6">
                Möchtest du wirklich {{ selectedIds.length }} Bewerbung(en) unwiderruflich löschen?
                <br><br>
                <span class="text-evil-red">⚠️ Dies löscht auch alle zugehörigen Lebenslauf-Dateien!</span>
              </p>
              <div class="flex gap-3 justify-end">
                <button 
                  @click="showDeleteConfirm = false"
                  class="px-4 py-2 text-evil-light border border-evil-light/30 rounded-evil-md hover:bg-evil-light/10 transition-colors"
                >
                  Abbrechen
                </button>
                <button 
                  @click="handleBulkDelete"
                  class="px-4 py-2 bg-red-700 text-white rounded-evil-md hover:bg-red-600 transition-colors"
                >
                  Endgültig löschen
                </button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12 text-evil-light/50">
            Lade Bewerbungen...
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-12 text-evil-red">
            Fehler: {{ error }}
          </div>

          <!-- Leere Liste -->
          <div v-else-if="filteredApplications.length === 0" class="text-center py-12 text-evil-light/50">
            Keine Bewerbungen gefunden.
          </div>

          <!-- Tabelle -->
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-evil-light/10 text-evil-light/50 text-sm uppercase tracking-wider">
                  <th class="py-3 pr-2 w-10">
                    <input 
                      type="checkbox" 
                      :checked="allSelected"
                      @change="toggleAll"
                      class="w-4 h-4 accent-evil-red cursor-pointer"
                    >
                  </th>
                  <th class="py-3 pr-4">Name</th>
                  <th class="py-3 pr-4">
                    <select 
                      v-model="filterJob"
                      class="bg-transparent border-none text-evil-light/50 text-sm tracking-wider cursor-pointer hover:text-evil-light focus:outline-none"
                    >
                      <option value="" class="uppercase">JOB</option>
                      <option v-for="title in uniqueJobTitles" :key="title" :value="title">{{ title }}</option>
                    </select>
                  </th>
                  <th class="py-3 pr-4">
                    <select 
                      v-model="filterEvilScore"
                      class="bg-transparent border-none text-evil-light/50 text-sm tracking-wider cursor-pointer hover:text-evil-light focus:outline-none"
                    >
                      <option value="" class="uppercase">EVIL SCORE</option>
                      <option v-for="score in uniqueEvilScores" :key="score" :value="score">{{ score }}</option>
                    </select>
                  </th>
                  <th class="py-3 pr-4">
                    <select 
                      v-model="filterMatches"
                      class="bg-transparent border-none text-evil-light/50 text-sm tracking-wider cursor-pointer hover:text-evil-light focus:outline-none"
                    >
                      <option value="" class="uppercase">MATCHES</option>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </th>
                  <th class="py-3 pr-4">Eingang</th>
                  <th class="py-3 pr-4">
                    <select 
                      v-model="filterStatus"
                      class="bg-transparent border-none text-evil-light/50 text-sm tracking-wider cursor-pointer hover:text-evil-light focus:outline-none"
                    >
                      <option value="" class="uppercase">STATUS</option>
                      <option value="open">Offen</option>
                      <option value="in_progress">In Bearbeitung</option>
                      <option value="accepted">Angenommen</option>
                      <option value="rejected">Abgelehnt</option>
                    </select>
                  </th>
                  <th class="py-3">Detail</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-evil-light/10">
                <tr v-for="app in filteredApplications" :key="app.application_id" class="hover:bg-evil-light/5 transition-colors">
                  <td class="py-4 pr-2">
                    <input 
                      type="checkbox" 
                      :checked="selectedIds.includes(app.application_id)"
                      @change="toggleSelection(app.application_id)"
                      class="w-4 h-4 accent-evil-red cursor-pointer"
                    >
                  </td>
                  <td class="py-4 pr-4">
                    <span class="text-white font-medium">{{ app.first_name }} {{ app.last_name }}</span>
                  </td>
                  <td class="py-4 pr-4 text-evil-light/70 text-sm">
                    {{ getJobForApplication(app)?.title || '—' }}
                  </td>
                  <td class="py-4 pr-4">
                    <span :class="app.evil_score === 0 ? 'text-evil-red' : 'text-white'" class="font-mono font-bold">
                      {{ app.evil_score }}
                    </span>
                  </td>
                  <td class="py-4 pr-4">
                    <span :class="getMatchCount(app) === 0 ? 'text-evil-red' : 'text-white'" class="font-mono font-bold">
                      {{ getMatchCount(app) }}
                    </span>
                  </td>
                  <td class="py-4 pr-4 text-evil-light/50 text-sm">{{ formatDate(app.created_at) }}</td>
                  <td class="py-4 pr-4">
                    <span :class="['font-semibold', getStatusColor(app.status)]">
                      {{ getStatusLabel(app.status) }}
                    </span>
                  </td>
                  <td class="py-4">
                    <NuxtLink 
                      :to="`/dashboard/${app.application_id}`"
                      class="px-3 py-1 text-sm bg-evil-light/10 text-evil-light border border-evil-light/20 rounded-evil-md hover:bg-evil-light/20 transition-colors"
                    >
                      Details →
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </ContentCard>

      </div>
    </section>

  </div>
</template>
