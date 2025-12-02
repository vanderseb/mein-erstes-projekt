<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { getJobById } = useJobs();
const { adminFields } = useQuestions();
const { evilScore } = useEvilState();

const jobId = route.query.job as string; // Job ID aus der URL holen (?job=it)
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
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div v-if="job" class="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full">
      <h1 class="text-2xl font-bold mb-2">Bewerbung abschließen</h1>
      <p class="text-gray-600 mb-6">Position: <span class="font-bold text-black">{{ job.title }}</span></p>
      
      <div class="space-y-4">
          <div v-for="field in adminFields" :key="field.id">
            <label class="block text-sm font-bold text-gray-700 mb-1">{{ field.label }}</label>
            <input 
              v-model="adminData[field.id]"
              :type="field.type"
              :placeholder="field.placeholder"
              class="w-full border p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
      </div>

      <button @click="submit" class="w-full mt-8 bg-black text-white py-3 rounded font-bold hover:bg-gray-800">
        Absenden
      </button>
    </div>
  </div>
</template>