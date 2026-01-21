<script setup lang="ts">
// Seite für abgelaufene Magic Links

definePageMeta({
});

const route = useRoute();

const email = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

onMounted(() => {
    if (route.query.email) {
        email.value = route.query.email as string;
    }
});

// Neuen Magic Link anfordern
const requestNewLink = async () => {
    if (!email.value) {
        error.value = 'Bitte E-Mail-Adresse eingeben.';
        return;
    }

    loading.value = true;
    error.value = null;

    try {
        await $fetch('/api/request-magic-link', {
            method: 'POST',
            body: { email: email.value }
        });

        success.value = true;
    } catch (err: any) {
        error.value = err.data?.message || 'Anfrage fehlgeschlagen. Bitte versuche es erneut.';
    }

    loading.value = false;
};
</script>

<template>
  <div class="min-h-screen py-12 px-4 flex items-center justify-center">
    <div class="max-w-md w-full">
      
      <ContentCard padding="lg">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-evil-red text-2xl mb-2">Portal-Ticket abgelaufen</h1>
          <p class="text-evil-mid text-sm">Dein Zugang ist nicht mehr gültig.</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 bg-evil-red/20 border border-evil-red/50 rounded-evil-md">
          <p class="text-evil-red text-sm">{{ error }}</p>
        </div>

        <!-- Success State -->
        <template v-if="success">
          <div class="text-center space-y-6">
            <div>
              <h2 class="text-evil-light text-lg font-bold mb-2">Neues Ticket gesendet!</h2>
              <p class="text-evil-mid text-sm">
                Wir haben einen neuen Zugangslink an<br/>
                <span class="text-evil-light font-bold">{{ email }}</span><br/>
                gesendet.
              </p>
            </div>

            <p class="text-evil-mid text-xs">
              Prüfe dein E-Mail-Postfach. Der Link ist 60 Minuten gültig.
            </p>

            <NuxtLink 
              to="/"
              class="inline-block text-evil-mid text-sm hover:text-evil-light transition-colors"
            >
              ← Zur Startseite
            </NuxtLink>
          </div>
        </template>

        <!-- Request Form -->
        <template v-else>
          <div class="space-y-6">
            <p class="text-evil-light text-sm">
              Portal-Tickets sind nur 60 Minuten gültig. 
              Gib deine E-Mail-Adresse ein, um ein neues Ticket anzufordern.
            </p>

            <form @submit.prevent="requestNewLink" class="space-y-4">
              <div>
                <label class="block text-sm font-bold text-evil-light mb-2">
                  E-Mail Adresse
                </label>
                <input 
                  v-model="email"
                  type="email"
                  placeholder="Deine E-Mail-Adresse"
                  class="w-full bg-evil-dark border border-evil-light/20 text-evil-light p-3 rounded-evil-md focus:border-evil-red focus:outline-none transition-colors placeholder:text-evil-mid"
                  :disabled="loading"
                  autofocus
                />
              </div>

              <BaseButton 
                type="submit"
                class="w-full mt-6 text-center"
                :disabled="loading"
              >
                {{ loading ? 'Wird gesendet...' : 'Neues Portal-Ticket anfordern' }}
              </BaseButton>
            </form>
          </div>
        </template>

        <!-- Back Link -->
        <div class="mt-8 text-center">
          <NuxtLink to="/login" class="text-evil-mid text-sm hover:text-evil-light transition-colors">
            ← Zurück zum Login
          </NuxtLink>
        </div>
        
      </ContentCard>
      
    </div>
  </div>
</template>
