<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { getJobById } = useJobs();
const { adminFields } = useQuestions();
const { evilScore } = useEvilState();

const jobId = route.query.job as string;
const job = getJobById(jobId);
const adminData = ref<Record<string, string>>({});

const submit = () => {
  console.log("Jeopardy Bewerbung:", {
    job: job?.title,
    evilScore: evilScore.value,
    data: adminData.value
  });
  alert("Willkommen an Bord! Wir melden uns.");
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen py-12 px-4 flex items-center justify-center">
    <div class="max-w-lg w-full">
      
      <GlassCard v-if="job" padding="lg">
        
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-white text-2xl mb-2">Bewerbung abschließen</h1>
          <p class="text-evil-mid">
            Position: <span class="text-evil-light font-bold">{{ job.title }}</span>
          </p>
          <p class="text-evil-mid text-sm">
            Evil Score: <span class="text-evil-red font-bold">{{ evilScore }}</span>
          </p>
        </div>
        
        <!-- Form -->
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
          @click="submit" 
          class="w-full mt-8 text-center"
        >
          Absenden
        </BaseButton>
        
      </GlassCard>

      <!-- Fallback wenn kein Job -->
      <GlassCard v-else padding="lg" class="text-center">
        <p class="text-evil-mid mb-4">Kein Job ausgewählt.</p>
        <BaseButton href="/jeopardy" variant="secondary">
          Zum Test
        </BaseButton>
      </GlassCard>
      
    </div>
  </div>
</template>
