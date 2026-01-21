<script setup lang="ts">
import type { Department } from '@/composables/useJobs';

const { jobs, loading, error, DEPARTMENT_LABELS, fetchJobs } = useJobs();
const route = useRoute();

await fetchJobs();

// Filter State - prüfe auf Department
const getInitialDepartment = (): Department | 'all' => {
    const dept = route.query.department as string;
    if (dept && Object.keys(DEPARTMENT_LABELS).includes(dept)) {
        return dept as Department;
    }
    return 'all';
};

const selectedDepartment = ref<Department | 'all'>(getInitialDepartment());

onMounted(() => {
    if (route.query.department) {
        // Kurz warten bis die Seite gerendert ist
        setTimeout(() => {
            document.getElementById('positionen')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
});

const filteredJobs = computed(() => {
    if (selectedDepartment.value === 'all') {
        return jobs.value;
    }
    return jobs.value.filter(job => job.department === selectedDepartment.value);
});

// Alle Departments für Filter-Buttons
const departments = Object.entries(DEPARTMENT_LABELS) as [Department, string][];
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HeroSection 
      image="/design/assets/images/03_karriere.webp"
      title="Karriere bei Dr. Evil & Söhne"
      subtitle="Werden Sie Teil eines Teams, das die Welt verändert. Buchstäblich."
      :full-height="true"
    />

    <!-- Quiz CTA -->
    <section class="py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <ContentCard padding="lg" class="text-center">
          <h2 class="text-white mb-4">Hast du das Zeug zum Henchman?</h2>
          <p class="text-evil-light/80 mb-6">
            Finde deinen perfekten Job in unserem wissenschaftlich fragwürdigen Eignungstest.
          </p>
          <BaseButton href="/assessment">
            Quiz starten →
          </BaseButton>
        </ContentCard>
      </div>
    </section>

    <!-- Jobs Grid -->
    <section id="positionen" class="py-12 md:py-16 px-4">
      <div class="max-w-6xl mx-auto">
        
        <div class="text-center mb-8">
          <h2 class="text-white mb-4">Offene Positionen</h2>
          <div class="w-16 h-1 bg-evil-red mx-auto"></div>
        </div>

        <!-- Department Filter -->
        <div class="mb-8">
          <div class="flex flex-wrap justify-center gap-2">
            <button
              @click="selectedDepartment = 'all'"
              :class="[
                'px-4 py-2 text-sm font-bold rounded-evil-md transition-all',
                selectedDepartment === 'all'
                  ? 'bg-evil-red text-white'
                  : 'bg-evil-dark border border-evil-light/20 text-evil-mid hover:text-evil-light hover:border-evil-light/40'
              ]"
            >
              Alle
            </button>
            
            <!-- Department Buttons -->
            <button
              v-for="[key, label] in departments"
              :key="key"
              @click="selectedDepartment = key"
              :class="[
                'px-4 py-2 text-sm font-bold rounded-evil-md transition-all',
                selectedDepartment === key
                  ? 'bg-evil-red text-white'
                  : 'bg-evil-dark border border-evil-light/20 text-evil-mid hover:text-evil-light hover:border-evil-light/40'
              ]"
            >
              {{ label }}
            </button>
          </div>
          
            <!-- Anzahl der gefundenen Positionen -->
          <p class="text-center text-evil-mid text-sm mt-4">
            {{ filteredJobs.length }} {{ filteredJobs.length === 1 ? 'Position' : 'Positionen' }} gefunden
          </p>
        </div>

        <!-- Jobs Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <ContentCard 
            v-for="job in filteredJobs" 
            :key="job.job_id" 
            class="flex flex-col hover:border-evil-light/40 transition-colors"
          >
            <!-- Department Label -->
            <span class="inline-block text-xs font-bold uppercase tracking-wider text-evil-red bg-evil-red/10 px-3 py-1 rounded-evil mb-4 self-start">
              {{ DEPARTMENT_LABELS[job.department] }}
            </span>
            
            <!-- Title -->
            <h3 class="text-white text-xl mb-3">
              {{ job.title }}
            </h3>
            
            <!-- Description -->
            <p class="text-evil-light/70 text-sm mb-6 flex-grow">
              {{ job.description }}
            </p>
            
            <!-- CTA -->
            <BaseButton :href="`/karriere/${job.job_id}`" variant="secondary" class="w-full text-center">
              Stellenbeschreibung →
            </BaseButton>
          </ContentCard>

        </div>

        <!-- Empty State -->
        <div v-if="filteredJobs.length === 0" class="text-center py-12">
          <p class="text-evil-mid">Keine offenen Positionen in diesem Bereich.</p>
        </div>

      </div>
    </section>

  </div>
</template>
