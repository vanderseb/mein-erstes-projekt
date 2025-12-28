<script setup lang="ts">
const route = useRoute();
const { getJobById, getDepartmentLabel } = useJobs();

// Job-ID aus der URL
const jobId = route.params.id as string;

// Job async laden
const job = ref<Awaited<ReturnType<typeof getJobById>>>(null);
const loading = ref(true);

onMounted(async () => {
    job.value = await getJobById(jobId);
    loading.value = false;
});

// Bild-Pfad basierend auf Department (hr, rd, it, finance, facility)
const heroImage = computed(() => 
    job.value ? `/design/assets/images/${job.value.department}.jpg` : ''
);

// Department-Label für die Anzeige
const departmentLabel = computed(() => 
    job.value ? getDepartmentLabel(job.value.department) : ''
);
</script>

<template>
  <div>
    <!-- Loading State -->
    <template v-if="loading">
      <section class="py-24 px-4 text-center">
        <div class="max-w-md mx-auto">
          <p class="text-4xl mb-6 animate-pulse">⏳</p>
          <p class="text-evil-mid">Lade Stellenbeschreibung...</p>
        </div>
      </section>
    </template>

    <!-- Job gefunden -->
    <template v-else-if="job">
      
      <!-- Hero mit Department-spezifischem Bild -->
      <HeroSection 
        :image="heroImage"
        :title="job.title!"
        :subtitle="departmentLabel"
        :full-height="true"
      />

      <!-- Job Details -->
      <section class="py-12 md:py-16 px-4">
        <div class="max-w-4xl mx-auto">
          
          <!-- Zurück-Link -->
          <NuxtLink 
            to="/karriere" 
            class="inline-flex items-center text-evil-mid hover:text-evil-light transition-colors mb-8"
          >
            ← Zurück zur Übersicht
          </NuxtLink>

          <!-- Beschreibung -->
          <ContentCard padding="lg" class="mb-8">
            <p class="text-evil-light text-lg leading-relaxed border-l-2 border-evil-red pl-6">
              {{ job.description }}
            </p>
          </ContentCard>

          <!-- Tasks & Skills Grid -->
          <div class="grid md:grid-cols-2 gap-6 mb-12">
            
            <!-- Aufgaben -->
            <ContentCard>
              <h3 class="text-white text-xl mb-4 flex items-center gap-3">
                <span class="text-2xl">📋</span> Deine Missionen
              </h3>
              <ul class="space-y-3">
                <li 
                  v-for="task in job.tasks" 
                  :key="task" 
                  class="flex items-start text-evil-light/80"
                >
                  <span class="text-evil-red mr-3 mt-1">▸</span>
                  {{ task }}
                </li>
              </ul>
            </ContentCard>

            <!-- Skills -->
            <ContentCard>
              <h3 class="text-white text-xl mb-4 flex items-center gap-3">
                <span class="text-2xl">🧠</span> Das bringst du mit
              </h3>
              <ul class="space-y-3">
                <li 
                  v-for="skill in job.skills" 
                  :key="skill" 
                  class="flex items-start text-evil-light/80"
                >
                  <span class="text-evil-red mr-3 mt-1">▸</span>
                  {{ skill }}
                </li>
              </ul>
            </ContentCard>

          </div>

          <!-- CTA Section -->
          <ContentCard padding="lg" class="text-center">
            <h3 class="text-white text-2xl mb-4">
              Bereit, die Welt zu verändern?
            </h3>
            <p class="text-evil-mid mb-8">
              Der Bewerbungsprozess beinhaltet keine Sicherheitsüberprüfung, aber eventuell einen Hai-Test.
            </p>
            <BaseButton :href="`/assessment?jobId=${job.id}`">
              JETZT BEWERBEN
            </BaseButton>
          </ContentCard>

        </div>
      </section>

    </template>

    <!-- Job nicht gefunden -->
    <template v-else>
      <section class="py-24 px-4 text-center">
        <div class="max-w-md mx-auto">
          <p class="text-6xl mb-6">☠️</p>
          <h1 class="text-white mb-4">Job eliminiert.</h1>
          <p class="text-evil-mid mb-8">Diese Position existiert nicht (mehr).</p>
          <BaseButton href="/karriere" variant="secondary">
            Zurück zur Basis
          </BaseButton>
        </div>
      </section>
    </template>

  </div>
</template>
