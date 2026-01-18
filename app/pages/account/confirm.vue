<script setup lang="ts">
// Auth Callback Handler - verarbeitet Magic Link Tokens
// Diese Seite verifiziert den Token direkt mit verifyOtp

definePageMeta({
    // Keine Auth-Middleware hier
});

const supabase = useSupabaseClient();
const route = useRoute();

const error = ref<string | null>(null);
const loading = ref(true);

onMounted(async () => {
    const token = route.query.token as string;
    const next = route.query.next as string || '/account';

    // Falls kein Token in URL, prüfe ob bereits eingeloggt
    if (!token) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            window.location.href = next;
            return;
        }
        // Kein Token und keine Session -> abgelaufen
        window.location.href = '/login-expired';
        return;
    }

    try {
        // Token direkt verifizieren (umgeht PKCE)
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'magiclink'
        });

        if (verifyError) {
            console.error('Token-Verifizierung fehlgeschlagen:', verifyError);
            // Token ungültig oder abgelaufen
            window.location.href = '/login-expired';
            return;
        }

        if (data.session) {
            // Erfolg! Session ist gesetzt
            // Kurze Verzögerung damit die Session sicher persistiert ist
            await new Promise(resolve => setTimeout(resolve, 300));
            window.location.href = next;
        } else {
            // Keine Session trotz erfolgreicher Verifizierung
            window.location.href = '/login-expired';
        }

    } catch (err: any) {
        console.error('Confirm Fehler:', err);
        window.location.href = '/login-expired';
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

        <!-- Error (Fallback, normalerweise wird redirected) -->
        <div v-else class="text-center space-y-6">
          <div>
            <h2 class="text-evil-red text-lg font-bold mb-2">Fehler</h2>
            <p class="text-evil-mid text-sm">{{ error }}</p>
          </div>

          <BaseButton href="/login-expired" class="w-full text-center">
            Neues Portal-Ticket anfordern
          </BaseButton>
        </div>
        
      </ContentCard>
    </div>
  </div>
</template>
