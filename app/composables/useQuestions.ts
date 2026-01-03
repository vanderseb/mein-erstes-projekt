// composables/useQuestions.ts
import type { Expertise, Hierarchy, Approach, Risk } from './useJobs';

// --- Typ-Definitionen ---

// Phase 1: Persönlichkeitsfragen (Evil Score)
export interface PersonalityAnswer {
    label: string;
    evilPoints: number;
}

export interface PersonalityQuestion {
    id: string;
    text: string;
    type: 'personality';
    options: PersonalityAnswer[];
}

// Phase 2: Expertise-Filter Fragen (Binäre Suche)
export interface ExpertiseAnswer {
    label: string;
    keep: Expertise[];
    discard: Expertise[];
    next?: string; // ID der nächsten Frage
}

export interface ExpertiseQuestion {
    id: string;
    text: string;
    type: 'expertise';
    options: ExpertiseAnswer[];
}

// Phase 3: Discriminator Fragen (Tie-Breaker)
export interface DiscriminatorAnswer {
    label: string;
    hierarchy?: Hierarchy;
    approach?: Approach;
    risk?: Risk;
}

export interface DiscriminatorQuestion {
    id: string;
    text: string;
    type: 'discriminator';
    trigger: 'hierarchy' | 'approach' | 'risk'; // Welches Attribut diese Frage unterscheidet
    options: DiscriminatorAnswer[];
}

// Admin-Felder für Bewerbungsformular
export interface AdminField {
    id: string;
    label: string;
    placeholder: string;
    type: 'text' | 'email' | 'number' | 'file';
    pattern?: string; // Regex Pattern für Validierung
    accept?: string;  // Für Dateiuploads
    maxSize?: number; // Max Bytes für Uploads
    errorMessage?: string; // Fehlertext bei ungültiger Eingabe
}

export const useQuestions = () => {

    // --- PHASE 1: Persönlichkeitsfragen (Evil Score) ---
    const personalityQuestions: PersonalityQuestion[] = [
        {
            id: 'p1',
            text: "Das Fahrstuhl-Dilemma: Sie stehen allein im Fahrstuhl. Die Türen schließen sich gerade. In der Ferne sehen Sie einen Kollegen rennen, der den Fahrstuhl noch erreichen möchte. Er ruft 'Warten!'. Was tun Sie?",
            type: 'personality',
            options: [
                { label: "Ich drücke sofort 'Tür öffnen'.", evilPoints: -1 },
                { label: "Ich tue so, als würde ich suchen.", evilPoints: 1 },
                { label: "Ich drücke demonstrativ 'Tür schließen'.", evilPoints: 2 }
            ]
        },
        {
            id: 'p2',
            text: "Der Pausenraum-Zwischenfall: Im gemeinschaftlichen Kühlschrank steht ein Joghurt. Auf dem Deckel steht groß und deutlich 'LISA'. Sie haben Hunger und keinen eigenen Joghurt dabei.",
            type: 'personality',
            options: [
                { label: "Stehen lassen.", evilPoints: -1 },
                { label: "Essen und Müll verstecken.", evilPoints: 1 },
                { label: "Hälfte essen, 'War lecker' draufschreiben.", evilPoints: 2 }
            ]
        },
        {
            id: 'p3',
            text: "Supermarkt-Strategie: Sie stehen an der Kasse im Supermarkt. Eine alte Dame hinter Ihnen hat nur zwei Artikel in der Hand. Sie haben einen vollen Einkaufswagen.",
            type: 'personality',
            options: [
                { label: "Vorlassen.", evilPoints: -1 },
                { label: "Ignorieren.", evilPoints: 1 },
                { label: "Besonders langsam mit Kleingeld zahlen.", evilPoints: 2 }
            ]
        }
    ];

    // --- PHASE 2: Expertise-Filter Fragen (Adaptive Funnel) ---
    const expertiseQuestions: ExpertiseQuestion[] = [
        {
            id: 'e1',
            text: "Wie möchtest du zur Weltherrschaft beitragen?",
            type: 'expertise',
            options: [
                {
                    label: "Durch technologische Überlegenheit und Maschinen.",
                    keep: ['Digital', 'Heavy_Machinery'],
                    discard: ['Social_Engineering', 'Economy'],
                    next: 'e2_tech'
                },
                {
                    label: "Durch Manipulation der Menschen und Märkte.",
                    keep: ['Social_Engineering', 'Economy'],
                    discard: ['Digital', 'Heavy_Machinery'],
                    next: 'e2_people'
                }
            ]
        },
        {
            id: 'e2_tech',
            text: "Wo arbeitest du am liebsten?",
            type: 'expertise',
            options: [
                {
                    label: "Im dunklen Serverraum, beleuchtet nur von LEDs.",
                    keep: ['Digital'],
                    discard: ['Heavy_Machinery']
                },
                {
                    label: "In der Werkstatt, wo Funken fliegen und Dinge explodieren.",
                    keep: ['Heavy_Machinery'],
                    discard: ['Digital']
                }
            ]
        },
        {
            id: 'e2_people',
            text: "Was ist dein bevorzugtes Druckmittel?",
            type: 'expertise',
            options: [
                {
                    label: "Erpresserische Geheimnisse und psychologischer Druck.",
                    keep: ['Social_Engineering'],
                    discard: ['Economy']
                },
                {
                    label: "Geldströme, Bestechung und Offshore-Konten.",
                    keep: ['Economy'],
                    discard: ['Social_Engineering']
                }
            ]
        }
    ];

    // --- PHASE 3: Discriminator Fragen (Tie-Breaker) ---
    const discriminatorQuestions: DiscriminatorQuestion[] = [
        {
            id: 'd_hierarchy',
            text: "Ein Experiment läuft schief und giftiger Schleim tritt aus. Deine Reaktion?",
            type: 'discriminator',
            trigger: 'hierarchy',
            options: [
                {
                    label: "Ich analysiere die chemische Zusammensetzung, um es als Waffe zu nutzen.",
                    hierarchy: 'Mastermind'
                },
                {
                    label: "Ich hole den Spezial-Mopp und mache sauber, bevor der Boss es sieht.",
                    hierarchy: 'Minion'
                },
                {
                    label: "Ich dokumentiere den Vorfall und melde es meinem Vorgesetzten.",
                    hierarchy: 'Henchman'
                }
            ]
        },
        {
            id: 'd_approach',
            text: "Du entdeckst eine Sicherheitslücke im System der Konkurrenz.",
            type: 'discriminator',
            trigger: 'approach',
            options: [
                {
                    label: "Ich zerstöre ihre Datenbanken vollständig.",
                    approach: 'Destructive'
                },
                {
                    label: "Ich installiere eine Hintertür und höre heimlich mit.",
                    approach: 'Manipulative'
                },
                {
                    label: "Ich verkaufe die Information an den Meistbietenden.",
                    approach: 'Greedy'
                },
                {
                    label: "Ich melde es dem Chef und warte auf Anweisungen.",
                    approach: 'Obedient'
                }
            ]
        },
        {
            id: 'd_risk',
            text: "Der Chef bietet dir einen Bonus an, aber der Job ist gefährlich. Deine Reaktion?",
            type: 'discriminator',
            trigger: 'risk',
            options: [
                {
                    label: "Gefahr? Das ist mein zweiter Vorname. Ich bin dabei!",
                    risk: 'Lethal'
                },
                {
                    label: "Mit der richtigen Schutzausrüstung mache ich alles.",
                    risk: 'Toxic'
                },
                {
                    label: "Ich bevorzuge Risiken, die nur meine Karriere betreffen.",
                    risk: 'Safe_Desk'
                }
            ]
        }
    ];

    // --- ADMIN-FELDER für Bewerbungsformular ---
    const adminFields: AdminField[] = [
        {
            id: 'salary',
            label: 'Gehaltsvorstellung (BTC)',
            placeholder: 'Jahresbrutto in Bitcoin',
            type: 'number',
            pattern: '^[0-9]+(\\.[0-9]+)?$',
            errorMessage: 'Bitte nur positive Zahlen eingeben.'
        },
        {
            id: 'availability',
            label: 'Verfügbarkeit',
            placeholder: 'DD.MM.JJJJ',
            type: 'text',
            pattern: '^(0[1-9]|[12][0-9]|3[01])\\.(0[1-9]|1[0-2])\\.\\d{4}$',
            errorMessage: 'Format muss DD.MM.JJJJ sein.'
        },
        {
            id: 'first_name',
            label: 'Vorname',
            placeholder: 'Max',
            type: 'text'
        },
        {
            id: 'last_name',
            label: 'Nachname',
            placeholder: 'Mustermann',
            type: 'text'
        },
        {
            id: 'email',
            label: 'E-Mail Adresse',
            placeholder: 'max@evil-corp.com',
            type: 'email',
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            errorMessage: 'Bitte gib eine gültige E-Mail-Adresse ein (z.B. name@beispiel.de).'
        },
        {
            id: 'cv',
            label: 'Lebenslauf (PDF)',
            placeholder: '',
            type: 'file',
            accept: 'application/pdf',
            maxSize: 5 * 1024 * 1024, // 5MB
            errorMessage: 'Nur PDF Dateien bis max. 5MB.'
        }
    ];

    // --- HELPER FUNKTIONEN ---

    // Expertise-Frage nach ID finden
    const getExpertiseQuestionById = (id: string) =>
        expertiseQuestions.find(q => q.id === id);

    // Discriminator-Frage nach Trigger finden
    const getDiscriminatorByTrigger = (trigger: 'hierarchy' | 'approach' | 'risk') =>
        discriminatorQuestions.find(q => q.trigger === trigger);

    return {
        personalityQuestions,
        expertiseQuestions,
        discriminatorQuestions,
        adminFields,
        getExpertiseQuestionById,
        getDiscriminatorByTrigger
    };
};
