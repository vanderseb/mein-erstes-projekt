<script setup lang="ts">
import { useApplications, type Application } from '@/composables/useApplications';
import { useJobs, type Job } from '@/composables/useJobs';
import { statusConfig, formatDate } from '@/composables/useApplicationUtils';

const supabase = useSupabaseClient();
const router = useRouter();

const { applications, error } = useApplications();
const { jobs, fetchJobs } = useJobs();

const pageLoading = ref(true);
const userName = ref<string>('');

onMounted(async () => {
    await fetchJobs();
    
    // User aus Supabase holen
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (authUser?.id) {
        await fetchMyApplicationsForUser(authUser.id);
    }
    
    pageLoading.value = false;
});

// Bewerbungen für bestimmten User laden
const fetchMyApplicationsForUser = async (uid: string) => {
    const { data, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false }) as { data: Application[] | null; error: any };
    
    if (fetchError) {
        console.error('Fetch error:', fetchError);
    } else {
        applications.value = data || [];
        if (data && data.length > 0) {
            const firstApp = data[0]!;
            userName.value = `${firstApp.first_name} ${firstApp.last_name}`;
        }
    }
};

// Job-Titel zu Bewerbung holen
const getJobForApplication = (app: Application): Job | undefined => {
    return jobs.value.find(j => j.job_id === app.job_id);
};

const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
};
</script>

<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-4xl mx-auto">
      
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-evil-red text-2xl mb-1">Meine Bewerbungen</h1>
          <p class="text-evil-mid text-sm">
            Eingeloggt als: {{ userName || 'Unbekannt' }}
          </p>
        </div>
        <button 
          @click="logout"
          class="px-4 py-2 text-sm text-evil-mid hover:text-evil-light border border-evil-light/20 rounded-evil-md hover:border-evil-light/40 transition-colors"
        >
          Abmelden
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="pageLoading" class="text-center py-12">
        <p class="text-evil-mid">Lade Bewerbungen...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <ContentCard padding="lg">
          <p class="text-evil-red mb-4">{{ error }}</p>
        </ContentCard>
      </div>

      <!-- Empty State -->
      <div v-else-if="applications.length === 0" class="text-center py-12">
        <ContentCard padding="lg">
          <h2 class="text-white text-xl mb-4">Keine Bewerbungen gefunden</h2>
          <p class="text-evil-mid mb-8">
            Du hast noch keine Bewerbungen eingereicht.
          </p>
          <BaseButton href="/karriere">
            Jobs entdecken
          </BaseButton>
        </ContentCard>
      </div>

      <!-- Applications Table -->
      <ContentCard v-else padding="sm">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-evil-light/10">
                <th class="text-left py-4 px-4 text-evil-mid text-sm font-normal">Position</th>
                <th class="text-left py-4 px-4 text-evil-mid text-sm font-normal">Beworben am</th>
                <th class="text-left py-4 px-4 text-evil-mid text-sm font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="app in applications" 
                :key="app.application_id"
                class="border-b border-evil-light/5 last:border-0 hover:bg-evil-light/5 transition-colors"
              >
                <td class="py-4 px-4">
                  <span class="text-evil-light">
                    {{ getJobForApplication(app)?.title || `Job #${app.job_id}` }}
                  </span>
                </td>
                <td class="py-4 px-4">
                  <span class="text-evil-mid">
                    {{ formatDate(app.created_at) }}
                  </span>
                </td>
                <td class="py-4 px-4">
                  <span 
                    :class="[
                      'px-3 py-1 text-xs font-bold rounded-full border',
                      statusConfig[app.status].color
                    ]"
                  >
                    {{ statusConfig[app.status].label }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentCard>

      <!-- Back Link -->
      <div class="mt-8 text-center">
        <NuxtLink to="/" class="text-evil-mid text-sm hover:text-evil-light transition-colors">
          ← Zur Startseite
        </NuxtLink>
      </div>
      
    </div>
  </div>
</template>
