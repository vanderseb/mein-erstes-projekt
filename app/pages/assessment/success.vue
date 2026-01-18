<script setup lang="ts">
const router = useRouter();
const route = useRoute();

const email = computed(() => route.query.email as string || '');

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen py-12 px-4 flex items-center justify-center">
    <div class="max-w-md w-full">
      <ContentCard padding="lg" class="text-center">

        <!-- Erfolgs-Icon -->
        <div class="text-6xl mb-6">✅</div>

        <!-- Überschrift -->
        <h1 class="text-white text-2xl font-bold mb-4">
          Bewerbung erfolgreich!
        </h1>

        <!-- Nachricht -->
        <p class="text-evil-light/80 mb-6">
          Vielen Dank für deine Bewerbung bei Dr. Evil & Söhne GmbH.
          Unsere Personalabteilung wird sich zeitnah bei dir melden –
          sofern du die Eignungsprüfung überstanden hast.
        </p>

        <!-- E-Mail Info -->
        <p v-if="email" class="text-evil-mid text-sm mb-8">
          Eine Bestätigung wurde an <span class="text-evil-light font-medium">{{ email }}</span> gesendet.
        </p>

        <!-- Home Button -->
        <BaseButton @click="goHome" class="w-full text-center">
          ZUR STARTSEITE
        </BaseButton>

      </ContentCard>
    </div>
  </div>
</template>
