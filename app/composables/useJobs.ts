// composables/useJobs.ts
export const useJobs = () => {
    interface Job {
        id: string;
        title: string;
        department: string;
        description: string;
        tasks: string[]; // Neu: Aufgaben als Liste
        skills: string;  // Neu: Anforderungen/Skills
    }

    const jobs: Job[] = [
        {
            id: 'ceo',
            title: 'Chief Executive Overlord (CEO)',
            department: 'Executive Board & Inner Circle',
            description: 'Nach dem unerwarteten Ausscheiden unseres letzten CEOs (Stichwort: Haifischbecken-Inzident), suchen wir eine visionäre Führungskraft.',
            tasks: ['Strategische Planung (Kill-Per-Incident)', 'Monolog-Management vor gefesselten Agenten', 'Entscheidungsgewalt über den „Großen Roten Knopf“'],
            skills: 'MBA (Master of Bad Administration), Narbe oder Augenklappe erwünscht.'
        },
        {
            id: 'hr',
            title: 'Talent Acquisition Manager',
            department: 'Human Capital & Cannon Fodder',
            description: 'Unsere Fluktuationsrate ist branchenüblich hoch. Wir brauchen Nachschub an loyalem Personal, das keine Fragen stellt.',
            tasks: ['Massen-Recruiting von Wachpersonal', 'Onboarding (Verschwiegenheitserklärung mit Blut)', 'Verwaltung der „Vermissten“-Akten'],
            skills: 'Empathielosigkeit, Erfahrung mit sehr befristeten Arbeitsverhältnissen.'
        },
        {
            id: 'rd',
            title: 'Senior Engineer für Laser & Falltüren',
            department: 'R&D (Research & Destruction)',
            description: 'Dr. Evil & Söhne steht für Qualität. Wenn wir auf den roten Knopf drücken, muss es funktionieren.',
            tasks: ['Wartung der hydraulischen Falltüren', 'Integration von Laserwaffen auf Haie', 'Selbstzerstörungs-Countdown Wartung'],
            skills: 'Master in Maschinenbau, keine moralischen Bedenken.'
        },
        {
            id: 'it',
            title: 'Full-Stack Hacker (m/w/d)',
            department: 'IT & Global Hacking',
            description: 'Wir bieten „Ransomware as a Service“. Wir brauchen Code, der so böse ist wie unser Kaffee.',
            tasks: ['Dashboards für Regierungs-Erpressung (Dark Mode only)', 'Firewall-Penetration bei Zentralbanken', 'Support für Dr. Evils Video-Konferenzen'],
            skills: 'Python, C++, DarkWeb-APIs.'
        },
        {
            id: 'finance',
            title: 'Head of Money Laundering',
            department: 'Finance & Black Budget',
            description: 'Weltherrschaft kostet Geld. Vulkane mieten sich nicht von allein.',
            tasks: ['Verschleierung von Geldströmen (Cayman Islands)', 'Umwandlung von Lösegeld in Goldbarren', 'Kostenstellenrechnung „Projekt Apokalypse“'],
            skills: 'Kreative Buchführung, Steuervermeidung.'
        },
        {
            id: 'facility',
            title: 'Specialist for Surface Cleaning',
            department: 'Facility & Tatort-Management',
            description: 'Wo die Weltherrschaft geplant wird, fallen manchmal... Mitarbeiter.',
            tasks: ['Reinigung nach „enttäuschenden“ Performance-Reviews', 'Polieren der Doomsday-Devices', 'Reinigung des Haifischbeckens (von innen)'],
            skills: 'Diskretion, eigener Schutzanzug.'
        },
    ];

    const getJobById = (id: string) => jobs.find(job => job.id === id);

    return { jobs, getJobById };
};