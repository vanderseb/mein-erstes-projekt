<script setup lang="ts">
import { useApplications, type Application, type ApplicationStatus } from '@/composables/useApplications';

// Data
const { 
    applications, 
    loading, 
    error,
    fetchApplications, 
    updateStatus, 
    totalApplications, 
    openApplications, 
    averageEvilScore 
} = useApplications();

// Bewerbungen laden
await fetchApplications();

// Filter State
const filterStatus = ref<string>('');

// Gefilterte Liste
const filteredApplications = computed(() => {
    if (!filterStatus.value) return applications.value;
    return applications.value.filter(app => app.status === filterStatus.value);
});

// Hilfsfunktionen
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
        case 'open': return 'text-evil-red';
        case 'in_progress': return 'text-yellow-400';
        case 'accepted': return 'text-green-400';
        case 'rejected': return 'text-gray-400';
        default: return 'text-evil-light';
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
};

const handleStatusChange = async (app: Application, event: Event) => {
    const newStatus = (event.target as HTMLSelectElement).value as ApplicationStatus;
    await updateStatus(app.application_id, newStatus);
};
</script>

<template>
  <div>
    <!-- Header Section -->
    <section class="py-12 md:py-16 px-4 border-b border-evil-light/10">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-white text-3xl md:text-4xl font-bold mb-2">HR Dashboard</h1>
        <p class="text-evil-light/70">Bewerbungsmanagement für Dr. Evil & Söhne</p>
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
          <!-- Header mit Filter -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-evil-light/10">
            <h2 class="text-white text-xl font-bold">Eingegangene Bewerbungen</h2>
            
            <select 
              v-model="filterStatus" 
              class="bg-evil-dark border border-evil-light/30 text-evil-light rounded-evil-md px-4 py-2 focus:outline-none focus:border-evil-red"
            >
              <option value="">Alle Status</option>
              <option value="open">Offen</option>
              <option value="in_progress">In Bearbeitung</option>
              <option value="accepted">Angenommen</option>
              <option value="rejected">Abgelehnt</option>
            </select>
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
                  <th class="py-3 pr-4">Name</th>
                  <th class="py-3 pr-4">E-Mail</th>
                  <th class="py-3 pr-4">Evil Score</th>
                  <th class="py-3 pr-4">Gehalt (BTC)</th>
                  <th class="py-3 pr-4">Eingang</th>
                  <th class="py-3 pr-4">Status</th>
                  <th class="py-3">Aktion</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-evil-light/10">
                <tr v-for="app in filteredApplications" :key="app.application_id" class="hover:bg-evil-light/5 transition-colors">
                  <td class="py-4 pr-4">
                    <span class="text-white font-medium">{{ app.firstname }} {{ app.lastname }}</span>
                  </td>
                  <td class="py-4 pr-4 text-evil-light/70 text-sm">{{ app.email }}</td>
                  <td class="py-4 pr-4">
                    <span :class="app.evil_score === 0 ? 'text-evil-red' : 'text-white'" class="font-mono font-bold">
                      {{ app.evil_score }}
                    </span>
                  </td>
                  <td class="py-4 pr-4 text-yellow-500 font-mono">₿ {{ app.salary }}</td>
                  <td class="py-4 pr-4 text-evil-light/50 text-sm">{{ formatDate(app.created_at) }}</td>
                  <td class="py-4 pr-4">
                    <span :class="['font-semibold', getStatusColor(app.status)]">
                      {{ getStatusLabel(app.status) }}
                    </span>
                  </td>
                  <td class="py-4">
                    <select 
                      @change="handleStatusChange(app, $event)"
                      class="bg-evil-dark border border-evil-light/30 text-evil-light rounded-evil-md px-3 py-1 text-sm focus:outline-none focus:border-evil-red cursor-pointer"
                    >
                      <option value="" selected disabled>—</option>
                      <option value="open">Offen</option>
                      <option value="in_progress">In Bearbeitung</option>
                      <option value="accepted">Angenommen</option>
                      <option value="rejected">Abgelehnt</option>
                    </select>
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
