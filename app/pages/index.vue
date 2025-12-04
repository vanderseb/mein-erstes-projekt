<script setup lang="ts">
// Homepage - Dr. Evil & Söhne GmbH

const heroImages = [
  '/design/assets/images/01_Homepage_about_ous.jpg',
  '/design/assets/images/02_contact.jpg',
  '/design/assets/images/03_karriere.png',
  '/design/assets/images/ceo.jpg',
  '/design/assets/images/facility.jpg',
  '/design/assets/images/finance.jpg',
  '/design/assets/images/hr.jpg',
  '/design/assets/images/it.jpg',
  '/design/assets/images/rd.jpg',
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HeroSection 
      :images="heroImages"
      title="Dr. Evil & Söhne GmbH"
      subtitle="Tradition trifft Tyrannei seit 1965 – Ihr Partner für Premium-Weltherrschaft und nachhaltige Unterwerfung"
      :full-height="true"
      :interval="5000"
    >
      <BaseButton href="/karriere">
        Karriere starten
      </BaseButton>
    </HeroSection>

    <!-- Über uns Section -->
    <section class="py-16 md:py-24 px-4">
      <div class="max-w-4xl mx-auto">
        
        <div class="text-center mb-12">
          <h2 class="text-white mb-4">Wer wir sind</h2>
          <div class="w-16 h-1 bg-evil-red mx-auto"></div>
        </div>

        <div class="space-y-6 text-evil-light/90 leading-relaxed">
          <p>
            Willkommen bei der Dr. Evil & Söhne GmbH (Gesellschaft mit begrenzter Humanität). 
            Wir sind nicht einfach nur ein Weltmarktführer im Bereich Global Domination, 
            wir sind ein familiengeführtes Traditionsunternehmen. Während andere noch manisch lachen, 
            liefern wir bereits Ergebnisse.
          </p>
          <p>
            Was als kleines Start-up in einer feuchten Höhle begann, ist heute der führende Anbieter 
            für Weltherrschaft as a Service (WaaS). Unser Hauptsitz in der malerischen Gemeinde Vulkaninsel 
            bietet uns die nötige geothermische Energie für unsere Visionen und die nötige Abgeschiedenheit 
            für unsere Experimente.
          </p>
        </div>

      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-16 md:py-24 px-4 bg-evil-mid/20">
      <div class="max-w-4xl mx-auto">
        
        <div class="text-center mb-12">
          <h2 class="text-white mb-4">Unsere Mission</h2>
          <p class="text-evil-light text-xl">Ihr Ultimatum ist unser Auftrag</p>
        </div>

        <div class="space-y-6 text-evil-light/90 leading-relaxed">
          <p>
            Sind Sie ein frustrierter Monarch, dessen Volk den Respekt verloren hat? 
            Ein größenwahnsinniger Investor, der schon alles besitzt außer einem eigenen Kontinent? 
            Oder einfach ein Konkurrent der Weltherrschaft, dem die Logistik über den Kopf wächst?
          </p>
          <p class="text-white font-bold text-lg">Wir verstehen Sie.</p>
          <p>
            Bei Dr. Evil & Söhne glauben wir, dass jeder das Recht auf eine eigene Dystopie hat. 
            Deshalb bieten wir Ihnen maßgeschneiderte Premium-Weltherrschafts-Pakete. 
            Wir kümmern uns um die Entwicklung von Doomsday-Geräten, die nicht nur furchteinflößend aussehen, 
            sondern auch TÜV-geprüft sind. Sie drücken den Knopf, wir erledigen den Rest.
          </p>
        </div>

      </div>
    </section>

    <!-- Kompetenzen Section -->
    <section class="py-16 md:py-24 px-4">
      <div class="max-w-5xl mx-auto">
        
        <div class="text-center mb-12">
          <h2 class="text-white mb-4">Unsere Kernkompetenzen</h2>
          <p class="text-evil-light">Technologie, die einschlägt</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          
          <ContentCard>
            <h3 class="text-white text-lg mb-3">Wetterkontrollsysteme</h3>
            <p class="text-evil-light/80 text-sm">
              Warum auf die Sonne warten, wenn Sie Hagelstürme im Abonnement bestellen können? 
              Perfekt für Erpressungen von G7-Gipfeln.
            </p>
          </ContentCard>

          <ContentCard>
            <h3 class="text-white text-lg mb-3">Lasertechnologie</h3>
            <p class="text-evil-light/80 text-sm">
              Ob auf Haien montiert oder auf dem Mond stationiert – unsere Laser bieten 
              präzise Zerstörungskraft mit minimalem CO2-Fußabdruck.
            </p>
          </ContentCard>

          <ContentCard>
            <h3 class="text-white text-lg mb-3">Doomsday-Infrastruktur</h3>
            <p class="text-evil-light/80 text-sm">
              Von der hydraulischen Falltür bis zum schallisolierten Verließ – 
              wir bauen Lösungen für die Ewigkeit.
            </p>
          </ContentCard>

        </div>

      </div>
    </section>

    <!-- Familie Section -->
    <section class="py-16 md:py-24 px-4 bg-evil-mid/20">
      <div class="max-w-4xl mx-auto text-center">
        
        <h2 class="text-white mb-6">Die Familie hinter der Furcht</h2>
        
        <p class="text-evil-light/90 leading-relaxed mb-8">
          Als Dr. Evil das Unternehmen gründete, hatte er einen Traum: Eine Welt, die ihm zu Füßen liegt. 
          Heute führen seine Söhne dieses Erbe fort – mit weniger theatralischem Lachen, 
          aber dafür mit effizienteren Excel-Tabellen. Wir verbinden den Charme alter Schurkenschule 
          mit den KPIs der modernen Wirtschaft.
        </p>

        <p class="text-white font-bold text-lg mb-8">
          Vertrauen Sie auf die Dr. Evil & Söhne GmbH.<br>
          Denn wenn wir sagen „Wir kümmern uns drum", dann ist das keine Floskel. Es ist eine Drohung.
        </p>

        <BaseButton href="/karriere">
          Jetzt Teil des Teams werden
        </BaseButton>

      </div>
    </section>

  </div>
</template>
