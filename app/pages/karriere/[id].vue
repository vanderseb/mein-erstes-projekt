<script setup lang="ts">
const route = useRoute();
const { getJobById } = useJobs();

// Job-ID aus der URL
const jobId = route.params.id as string;
const job = getJobById(jobId);

// Bild-Pfad basierend auf Job-ID
const heroImage = computed(() => `/design/assets/images/${jobId}.jpg`);
</script>

<template>
  <div>
    <!-- Job gefunden -->
    <template v-if="job">
      
      <!-- Hero mit Job-spezifischem Bild -->
      <HeroSection 
        :image="heroImage"
        :title="job.title"
        :subtitle="job.department"
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
          <GlassCard padding="lg" class="mb-8">
            <p class="text-evil-light text-lg leading-relaxed border-l-2 border-evil-red pl-6">
              {{ job.description }}
            </p>
          </GlassCard>

          <!-- Tasks & Skills Grid -->
          <div class="grid md:grid-cols-2 gap-6 mb-12">
            
            <!-- Aufgaben -->
            <GlassCard>
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
            </GlassCard>

            <!-- Skills -->
            <GlassCard>
              <h3 class="text-white text-xl mb-4 flex items-center gap-3">
                <span class="text-2xl">🧠</span> Das bringst du mit
              </h3>
              <p class="text-evil-light/80">
                {{ job.skills }}
              </p>
            </GlassCard>

          </div>

          <!-- CTA Section -->
          <GlassCard padding="lg" class="text-center">
            <h3 class="text-white text-2xl mb-4">
              Bereit, die Welt zu verändern?
            </h3>
            <p class="text-evil-mid mb-8">
              Der Bewerbungsprozess beinhaltet keine Sicherheitsüberprüfung, aber eventuell einen Hai-Test.
            </p>
            <BaseButton :href="`/bewerbung/${job.id}`">
              JETZT BEWERBEN
            </BaseButton>
          </GlassCard>

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
