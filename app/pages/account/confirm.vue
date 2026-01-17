<script setup lang="ts">
// Auth Callback Handler - verarbeitet Magic Links und OAuth Callbacks
// Diese Seite wird von Supabase nach erfolgreicher Authentifizierung aufgerufen

definePageMeta({
    // Keine Auth-Middleware hier
});

const supabase = useSupabaseClient();
const route = useRoute();

const error = ref<string | null>(null);
const loading = ref(true);

onMounted(async () => {
    try {
        // Bei PKCE Flow: Supabase tauscht den Code automatisch gegen eine Session
        // Wir müssen auf das Auth-Event warten
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                // Erfolg - Session ist gesetzt
                subscription.unsubscribe();
                
                const next = route.query.next as string || '/account';
                
                // Kurze Verzögerung damit die Session sicher persistiert ist
                await new Promise(resolve => setTimeout(resolve, 500));
                window.location.href = next;
            }
        });

        // Prüfe ob bereits eine Session existiert
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
            subscription.unsubscribe();
            const next = route.query.next as string || '/account';
            window.location.href = next;
            return;
        }

        // Timeout nach 10 Sekunden
        setTimeout(() => {
            if (loading.value) {
                subscription.unsubscribe();
                error.value = 'Zeitüberschreitung bei der Authentifizierung. Bitte versuche es erneut.';
                loading.value = false;
            }
        }, 10000);
        
    } catch (err: any) {
        error.value = 'Unerwarteter Fehler: ' + err.message;
        loading.value = false;
    }
});
</script>

<template>
  <div class="min-h-screen py-12 px-4 flex items-center justify-center">
    <div class="max-w-md w-full">
      <ContentCard padding="lg">
        
        <!-- Loading -->
        <div v-if="loading" class="text-center space-y-4">
          <div class="animate-pulse">
            <div class="w-12 h-12 bg-evil-red/20 rounded-full mx-auto"></div>
          </div>
          <p class="text-evil-mid">Authentifizierung wird verarbeitet...</p>
        </div>

        <!-- Error -->
        <div v-else class="text-center space-y-6">
          <div>
            <h2 class="text-evil-red text-lg font-bold mb-2">Fehler</h2>
            <p class="text-evil-mid text-sm">{{ error }}</p>
          </div>

          <BaseButton href="/account/login" class="w-full text-center">
            Zurück zum Login
          </BaseButton>
        </div>
        
      </ContentCard>
    </div>
  </div>
</template>
