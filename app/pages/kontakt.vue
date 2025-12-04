<script setup lang="ts">
// Kontakt-Seite
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HeroSection 
      image="/design/assets/images/02_contact.jpg"
      title="Kontakt"
      subtitle="Haben Sie Fragen? Möchten Sie die Welt unterwerfen? Schreiben Sie uns."
      :full-height="true"
    />

    <!-- Kontakt-Informationen -->
    <section class="py-16 md:py-24 px-4">
      <div class="max-w-4xl mx-auto">
        
        <div class="grid md:grid-cols-2 gap-8">
          
          <!-- Kontaktdaten -->
          <ContentCard padding="lg">
            <h2 class="text-white text-2xl mb-6">So erreichen Sie uns</h2>
            
            <div class="space-y-4 text-evil-light">
              <div>
                <p class="text-evil-mid text-sm uppercase tracking-wider mb-1">Adresse</p>
                <p>Dr. Evil & Söhne GmbH</p>
                <p>Vulkaninsel 1</p>
                <p>00000 Geheimstandort</p>
              </div>
              
              <div>
                <p class="text-evil-mid text-sm uppercase tracking-wider mb-1">Telefon</p>
                <p>+49 (0) 666 - EVIL</p>
              </div>
              
              <div>
                <p class="text-evil-mid text-sm uppercase tracking-wider mb-1">E-Mail</p>
                <p>weltherrschaft@dr-evil.de</p>
              </div>
              
              <div>
                <p class="text-evil-mid text-sm uppercase tracking-wider mb-1">Bürozeiten</p>
                <p>Mo-Fr: 09:00 - 18:00 Uhr</p>
                <p class="text-evil-mid text-sm">(Vulkanausbrüche ausgenommen)</p>
              </div>
            </div>
          </ContentCard>
          
          <!-- Hinweis -->
          <ContentCard padding="lg">
            <h2 class="text-white text-2xl mb-6">Wichtiger Hinweis</h2>
            
            <div class="space-y-4 text-evil-light/90">
              <p>
                Bitte beachten Sie, dass alle eingehenden Nachrichten von unserer 
                KI-gestützten Bedrohungsanalyse geprüft werden.
              </p>
              <p>
                Spontane Besuche sind nicht gestattet. Unser Sicherheitspersonal 
                ist angewiesen, zuerst zu schießen und dann Fragen zu stellen.
              </p>
              <p>
                Für Erpressungsversuche nutzen Sie bitte das 
                offizielle Formular auf unserer Karriereseite.
              </p>
            </div>
            
            <div class="mt-8">
              <BaseButton href="/karriere">
                Zur Karriereseite
              </BaseButton>
            </div>
          </ContentCard>
          
        </div>

      </div>
    </section>

  </div>
</template>
