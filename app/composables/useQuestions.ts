// composables/useQuestions.ts
export const useQuestions = () => {

    // Typ-Definitionen
    interface AnswerOption {
        label: string;
        evilPoints?: number;   // Für Persönlichkeitsfragen (-1, +1, +2)
        jobScore?: string;     // Für Wissensfragen (z.B. 'hr', 'it')
    }

    interface Question {
        id: string | number;
        text: string;
        type: 'radio' | 'select' | 'text' | 'file'; // file wird hier simuliert
        options?: AnswerOption[];
    }

    // --- TEIL 1: Persönlichkeitsfragen (Evil Score) [cite: 71] ---
    const personalityQuestions: Question[] = [
        {
            id: 'p1',
            text: "Das Fahrstuhl-Dilemma: Kollege rennt zum Fahrstuhl. Was tun?", // [cite: 72, 73]
            type: 'radio',
            options: [
                { label: "Ich drücke sofort 'Tür öffnen'.", evilPoints: -1 }, // [cite: 74]
                { label: "Ich tue so, als würde ich suchen.", evilPoints: 1 }, // [cite: 75]
                { label: "Ich drücke demonstrativ 'Tür schließen'.", evilPoints: 2 } // [cite: 76]
            ]
        },
        {
            id: 'p2',
            text: "Der Pausenraum-Zwischenfall: Joghurt mit Name 'LISA'.", // [cite: 77, 78]
            type: 'radio',
            options: [
                { label: "Stehen lassen.", evilPoints: -1 }, // [cite: 79]
                { label: "Essen und Müll verstecken.", evilPoints: 1 }, // [cite: 80]
                { label: "Hälfte essen, 'War lecker' draufschreiben.", evilPoints: 2 } // [cite: 81]
            ]
        },
        {
            id: 'p3',
            text: "Supermarkt-Strategie: Alte Dame mit 2 Artikeln hinter Ihnen.", // [cite: 82, 83]
            type: 'radio',
            options: [
                { label: "Vorlassen.", evilPoints: -1 }, // [cite: 84]
                { label: "Ignorieren.", evilPoints: 1 }, // [cite: 85]
                { label: "Fragen ob eilig, dann mit Kleingeld zahlen.", evilPoints: 2 } // [cite: 86]
            ]
        }
    ];

    // --- TEIL 2: Wissensfragen (Job Scores) [cite: 88] ---
    const knowledgeQuestions: Question[] = [
        {
            id: 'k1',
            text: "Facility: Wie viele Liter organische Flüssigkeit nach Falltür-Malheur?", // [cite: 90]
            type: 'radio',
            options: [
                { label: "5 bis 7 Liter", jobScore: 'facility' }, // [cite: 91]
                { label: "18 - 20 Liter" },
                { label: "3 - 4 Liter" }
            ]
        },
        {
            id: 'k2',
            text: "R&D: Laser-Laufzeit Mond bis Weißes Haus?", // [cite: 95]
            type: 'radio',
            options: [
                { label: "1,1 Minute" },
                { label: "1,3 Sekunden", jobScore: 'rd' }, // [cite: 97]
                { label: "0,0056 Millisekunden" }
            ]
        },
        {
            id: 'k3',
            text: "IT: Wie schnell wird Passwort '12345' geknackt?", // [cite: 100]
            type: 'radio',
            options: [
                { label: "Sofort", jobScore: 'it' }, // [cite: 101]
                { label: "1 Tag" },
                { label: "1 Stunde" }
            ]
        },
        {
            id: 'k4',
            text: "Finanzen: Wie viel Gold lagert in Fort Knox?", // [cite: 105]
            type: 'radio',
            options: [
                { label: "934,7 Mrd. Unzen" },
                { label: "100 Tausend Unzen" },
                { label: "147,3 Mio. Unzen", jobScore: 'finance' } // [cite: 108]
            ]
        },
        {
            id: 'k5',
            text: "HR: Dunbar-Zahl (stabile soziale Beziehungen)?", // [cite: 110]
            type: 'radio',
            options: [
                { label: "ca. 50 Personen" },
                { label: "ca. 150 Personen", jobScore: 'hr' }, // [cite: 112]
                { label: "ca. 500 Personen" }
            ]
        },
        {
            id: 'k6', // Die große Szenario Frage [cite: 114]
            text: "Evakuierung: Was retten Sie mit zwei freien Händen?",
            type: 'radio',
            options: [
                { label: "Koffer mit Inhaberaktien", jobScore: 'finance' }, // [cite: 117]
                { label: "Backup-Festplatten & Browser-History", jobScore: 'it' }, // [cite: 119]
                { label: "Prototyp 'Schrumpf-o-mat 3000'", jobScore: 'rd' }, // [cite: 121]
                { label: "Kontaktliste der Söldner", jobScore: 'hr' }, // [cite: 122]
                { label: "Antiker Perser-Teppich (Blutflecken)", jobScore: 'facility' } // [cite: 123]
            ]
        }
    ];

    // --- TEIL 3: Die Admin-Felder (Schlusseingabe) [cite: 125] ---
    // Diese rendern wir etwas anders, daher definieren wir sie separat
    const adminFields = [
        { id: 'salary', label: 'Gehaltsvorstellung (BTC)', placeholder: 'Jahresbrutto in Bitcoin', type: 'text' }, // [cite: 126]
        { id: 'availability', label: 'Verfügbarkeit', placeholder: 'TT.MM.JJJJ oder "Sofort nach Haft..."', type: 'text' }, // [cite: 127]
        { id: 'motivation', label: 'Aktueller Arbeitgeber & Wechselgrund', placeholder: "z.B. 'MI6 - Zu viel Bürokratie'", type: 'text' }, // [cite: 128]
        { id: 'name', label: 'Vollständiger Name', placeholder: 'Max Mustermann', type: 'text' }, // [cite: 129]
        { id: 'email', label: 'E-Mail Adresse', placeholder: 'max@evil-corp.com', type: 'email' } // [cite: 129]
    ];

    // Helper: Gib mir ALLE Fragen für den Bewerbungsprozess
    const allApplicationQuestions = [...personalityQuestions, ...knowledgeQuestions];

    return {
        personalityQuestions,
        knowledgeQuestions,
        allApplicationQuestions,
        adminFields
    };
};