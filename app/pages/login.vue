<script setup lang="ts">
const supabase = useSupabaseClient();
const route = useRoute();

type LoginStep = 'email' | 'password' | 'magic-link-sent' | 'unknown';
const step = ref<LoginStep>('email');

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

// E-Mail Validierung
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const emailErrorMessage = 'Bitte gib eine gültige E-Mail-Adresse ein (z.B. name@beispiel.de).';

// Prüfung auf Fehler aus Middleware
onMounted(() => {
    if (route.query.error === 'unauthorized') {
        error.value = 'Zugriff verweigert. Bitte melde dich mit einem berechtigten Account an.';
    }
});

// Schritt 1: E-Mail prüfen
const checkEmail = async () => {
    if (!email.value) {
        error.value = 'Bitte E-Mail-Adresse eingeben.';
        return;
    }

    // E-Mail-Format validieren
    if (!emailPattern.test(email.value)) {
        error.value = emailErrorMessage;
        return;
    }

    loading.value = true;
    error.value = null;

    try {
        const { role } = await $fetch<{ role: 'admin' | 'applicant' | 'unknown' }>('/api/check-user-role', {
            method: 'POST',
            body: { email: email.value }
        });

        if (role === 'admin') {
            step.value = 'password';
        } else if (role === 'applicant') {
            // Magic Link senden
            await sendMagicLink();
        } else {
            step.value = 'unknown';
        }
    } catch (err: any) {
        error.value = 'Fehler bei der Prüfung: ' + (err.message || 'Unbekannter Fehler');
    }

    loading.value = false;
};

const sendMagicLink = async () => {
    try {
        const result = await $fetch<{ success: boolean; message: string }>('/api/request-magic-link', {
            method: 'POST',
            body: { email: email.value }
        });

        if (!result.success) {
            error.value = 'Fehler beim Senden des Magic Links.';
            return;
        }

        step.value = 'magic-link-sent';
    } catch (err: any) {
        error.value = 'Fehler beim Senden des Magic Links: ' + (err.message || 'Unbekannter Fehler');
    }
};

// Admin Login mit Passwort
const loginHr = async () => {
    if (!password.value) {
        error.value = 'Bitte Passwort eingeben.';
        return;
    }

    if (!email.value) {
        error.value = 'E-Mail-Adresse fehlt. Bitte starte den Login erneut.';
        step.value = 'email';
        return;
    }

    loading.value = true;
    error.value = null;

    try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        });

        if (authError) {
            error.value = 'Login fehlgeschlagen: ' + authError.message;
            loading.value = false;
            return;
        }

        const role = data.user?.app_metadata?.role;
        
        if (role !== 'admin') {
            await supabase.auth.signOut();
            error.value = 'Dieser Account hat keine Admin-Berechtigung.';
            loading.value = false;
            return;
        }

        window.location.href = '/dashboard';
    } catch (err: any) {
        error.value = 'Unerwarteter Fehler: ' + err.message;
        loading.value = false;
    }
};

// Zurück zur E-Mail-Eingabe
const resetToEmail = () => {
    step.value = 'email';
    password.value = '';
    error.value = null;
};
</script>

<template>
  <div class="min-h-screen py-12 px-4 flex items-center justify-center">
    <div class="max-w-md w-full">
      
      <ContentCard padding="lg">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-evil-red text-2xl mb-2">Anmeldung</h1>
          <p class="text-evil-mid text-sm">Willkommen bei Dr. Evil & Söhne</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 bg-evil-red/20 border border-evil-red/50 rounded-evil-md">
          <p class="text-evil-red text-sm">{{ error }}</p>
        </div>

        <!-- SCHRITT 1: E-Mail eingeben -->
        <template v-if="step === 'email'">
          <form @submit.prevent="checkEmail" class="space-y-4" novalidate>
            <div>
              <label class="block text-sm font-bold text-evil-light mb-2">
                E-Mail Adresse
              </label>
              <input 
                v-model="email"
                type="text"
                inputmode="email"
                autocomplete="email"
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
              {{ loading ? 'Prüfe...' : 'Bestätigen' }}
            </BaseButton>
          </form>
        </template>

        <!-- SCHRITT 2: Admin Passwort eingeben -->
        <template v-else-if="step === 'password'">
          <form @submit.prevent="loginHr" class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-evil-light mb-2">
                E-Mail Adresse
              </label>
              <input 
                :value="email"
                type="email"
                class="w-full bg-evil-dark/50 border border-evil-light/10 text-evil-mid p-3 rounded-evil-md cursor-not-allowed"
                disabled
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-evil-light mb-2">
                Passwort
              </label>
              <input 
                v-model="password"
                type="password"
                placeholder="Dein Passwort"
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
              {{ loading ? 'Anmelden...' : 'Anmelden' }}
            </BaseButton>

            <button 
              type="button"
              @click="resetToEmail"
              class="w-full text-center text-evil-mid text-sm hover:text-evil-light transition-colors"
            >
              ← Andere E-Mail verwenden
            </button>
          </form>
        </template>

        <!-- SCHRITT 3: Magic Link gesendet (Bewerber) -->
        <template v-else-if="step === 'magic-link-sent'">
          <div class="text-center space-y-6">
            <div>
              <h2 class="text-evil-light text-lg font-bold mb-2">Magic Link gesendet!</h2>
              <p class="text-evil-mid text-sm">
                Wir haben einen Anmelde-Link an<br/>
                <span class="text-evil-light font-bold">{{ email }}</span><br/>
                gesendet.
              </p>
            </div>

            <p class="text-evil-mid text-xs">
              Prüfe dein E-Mail-Postfach und klicke auf den Link, um deine Bewerbungen einzusehen.
            </p>

            <button 
              @click="resetToEmail"
              class="text-evil-mid text-sm hover:text-evil-light transition-colors"
            >
              ← Andere E-Mail verwenden
            </button>
          </div>
        </template>

        <!-- SCHRITT 4: Unbekannte E-Mail -->
        <template v-else-if="step === 'unknown'">
          <div class="text-center space-y-6">
            <div>
              <h2 class="text-evil-mid text-lg font-bold mb-3">
                Kein Zugang vorhanden
              </h2>
              <p class="text-evil-mid text-sm">
                Für <span class="text-evil-light font-bold">{{ email }}</span><br/>
                existiert kein Account.
              </p>
            </div>

            <div class="pt-4 border-t border-evil-light/10">
              <p class="text-evil-light text-sm mb-4">
                Du möchtest Teil unserer Organisation werden?<br/>
                Dann bewirb dich jetzt!
              </p>
              
              <BaseButton href="/karriere" class="w-full text-center">
                Offene Stellen ansehen
              </BaseButton>
            </div>

            <button 
              @click="resetToEmail"
              class="w-full text-center text-evil-mid text-sm hover:text-evil-light transition-colors"
            >
              ← Andere E-Mail verwenden
            </button>
          </div>
        </template>

        <!-- Back Link -->
        <div class="mt-8 text-center">
          <NuxtLink to="/" class="text-evil-mid text-sm hover:text-evil-light transition-colors">
            ← Zurück zur Startseite
          </NuxtLink>
        </div>
        
      </ContentCard>
      
    </div>
  </div>
</template>
