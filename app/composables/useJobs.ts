// composables/useJobs.ts
export const useJobs = () => {
    interface Job {
        id: string;
        title: string;
        department: string;
        description: string;
        tasks: string[];
        skills: string[];
    }

    const jobs: Job[] = [
        {
            id: 'ceo',
            title: 'Chief Executive Overlord (CEO)',
            department: 'Executive Board & Inner Circle',
            description: 'Nach dem unerwarteten Ausscheiden unseres letzten CEOs (Stichwort: Haifischbecken-Inzident), suchen wir eine visionäre Führungskraft.',
            tasks: ['Strategische Planung: Definition der KPIs für Q3 (Kill-Per-Incident) und Ausbau der Marktanteile in der Schurken-Branche.',
                'Monolog-Management: Professionelles Erklären des Masterplans vor gefesselten Geheimagenten (Mindestdauer: 5 Minuten), bevor Sie den Raum verlassen.',
                'Krisenmanagement: Schnelle Evakuierung via Rettungskapsel, falls die Basis explodiert (Sie haben Vorrang vor dem Personal).',
                'Entscheidungsgewalt: Alleinige Autorität über den „Großen Roten Knopf“.'],
            skills: ['MBA (Master of Bad Administration) oder vergleichbare Diktatoren-Ausbildung.',
                'Markantes Merkmal erwünscht (z. B. Narbe, Augenklappe, oder das Streicheln einer weißen Katze).',
                'Hohe Toleranz für inkompetente Handlanger.']
        },
        {
            id: 'hr',
            title: 'Talent Acquisition Manager',
            department: 'Human Capital & Cannon Fodder',
            description: 'Unsere Fluktuationsrate ist branchenüblich hoch (ca. 40% pro Agenten-Infiltration). Wir suchen einen Recruiter, der schnell für Nachschub an loyalem, uniformiertem Personal sorgt, das keine Fragen stellt.',
            tasks: ['Massen-Recruiting von Wachpersonal (Anforderungsprofil: Sportlich, schlechtes Zielvermögen, namenlos)',
                'Onboarding neuer Handlanger (Ausgabe der Uniformen, Unterzeichnung der Verschwiegenheitserklärung mit Blut)',
                'Verwaltung der „Vermissten“-Akten'],
            skills: ['Empathielosigkeit',
                'Erfahrung mit befristeten Arbeitsverhältnissen (sehr befristet)',
                'Hohe Resilienz gegenüber spontanen Vorgesetzten-Wechseln'
            ]
        },
        {
            id: 'rd',
            title: 'Senior Engineer für Laser & Falltüren',
            department: 'R&D (Research & Destruction)',
            description: 'Dr. Evil & Söhne steht für Qualität. Wenn wir auf den roten Knopf drücken, muss es funktionieren. Wir suchen einen Ingenieur, der Perfektion liebt.',
            tasks: ['Wartung und Ölung der hydraulischen Falltüren im Chefbüro',
                'Integration von Laserwaffen auf exotische Trägersysteme (Drohnen, Haie, Monde)',
                'Selbstzerstörungs-Countdown Wartung'],
            skills: ['Master in Maschinenbau und Moralunterdrückung',
                'Leidenschaft für dramatisch große rote Knöpfe',
                'Kompromisslose Liebe zum Detail: Ein Countdown darf niemals stoppen!']
        },
        {
            id: 'it',
            title: 'Full-Stack Hacker (m/w/d)',
            department: 'IT & Global Hacking',
            description: 'Wir suchen einen Coder, der keine ethischen Grenzen kennt, sondern nur technische Herausforderungen.',
            tasks: ['Entwicklung von bedrolichen E-Mail-Verteilern (Dark Mode only)',
                'Firewall-Penetration bei Zentralbanken',
                'Entlaufende Python des Chefs aufspühren'],
            skills: ['Flexiblen moralischen Kompass („Datenschutz“ = „Datenschatz“)',
                'C++, LavaScript, DarkWeb-APIs',
                'Eintrag im Interpol-Register ist ein Plus']
        },
        {
            id: 'finance',
            title: 'Head of Money Laundering',
            department: 'Finance & Black Budget',
            description: 'Weltherrschaft kostet Geld. Vulkane mieten sich nicht von allein. Wir suchen ein Finanzgenie, das Bilanzen so kreativ frisiert wie unser CEO seine Katze.',
            tasks: ['Verschleierung von Geldströmen (Cayman Islands)', 'Umwandlung von Lösegeld in Goldbarren', 'Kostenstellenrechnung „Projekt Apokalypse“'],
            skills: ['Kreative Buchführung',
                'Nennung aller Steuerparadiese',
                'Steuervermeidung als Kunstform']
        },
        {
            id: 'facility',
            title: 'Specialist for Surface Cleaning',
            department: 'Facility & Tatort-Management',
            description: 'Wo gehobelt wird, fallen Späne – und wo die Weltherrschaft geplant wird, fallen manchmal  Mitarbeiter. Wir suchen eine diskrete Fachkraft, die unsere vulkanbasierte Zentrale sauber hält.',
            tasks: ['Reinigung nach „enttäuschenden“ Performance-Reviews', 'Polieren der Doomsday-Devices', 'Reinigung des Haifischbeckens (von innen)'],
            skills: ['Diskretion',
                'eigener Schutzanzug']
        },
    ];

    const getJobById = (id: string) => jobs.find(job => job.id === id);

    return { jobs, getJobById };
};