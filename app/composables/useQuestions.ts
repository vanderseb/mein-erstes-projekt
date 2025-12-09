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

    // --- TEIL 1: Persönlichkeitsfragen (Evil Score) ---
    const personalityQuestions: Question[] = [
        {
            id: 'p1',
            text: "Das Fahrstuhl-Dilemma: Sie stehen allein im Fahrstuhl. Die Türen schließen sich gerade. In der Ferne sehen Sie einen Kollegen rennen, der den Fahrstuhl noch erreichen möchte. Er ruft 'Warten!'. Was tun Sie?",
            type: 'radio',
            options: [
                { label: "Ich drücke sofort 'Tür öffnen'.", evilPoints: -1 },
                { label: "Ich tue so, als würde ich suchen.", evilPoints: 1 },
                { label: "Ich drücke demonstrativ 'Tür schließen'.", evilPoints: 2 }
            ]
        },
        {
            id: 'p2',
            text: "Der Pausenraum-Zwischenfall: Im gemeinschaftlichen Kühlschrank steht ein Joghurt. Auf dem Deckel steht groß und deutlich 'LISA'. Sie haben Hunger und keinen eigenen Joghurt dabei.",
            type: 'radio',
            options: [
                { label: "Stehen lassen.", evilPoints: -1 },
                { label: "Essen und Müll verstecken.", evilPoints: 1 },
                { label: "Hälfte essen, 'War lecker' draufschreiben.", evilPoints: 2 }
            ]
        },
        {
            id: 'p3',
            text: "Supermarkt-Strategie: Sie stehen an der Kasse im Supermarkt. Eine alte Dame hinter Ihnen hat nur zwei Artikel in der Hand. Sie haben einen vollen Einkaufswagen.",
            type: 'radio',
            options: [
                { label: "Vorlassen.", evilPoints: -1 },
                { label: "Ignorieren.", evilPoints: 1 },
                { label: "Besonders langsam mit Kleingeld zahlen.", evilPoints: 2 }
            ]
        }
    ];

    // --- TEIL 2: Wissensfragen (Job Scores)
    const knowledgeQuestions: Question[] = [
        {
            id: 'k1',
            text: "Wie viele Liter organische Flüssigkeit nach Falltür-Malheur?",
            type: 'radio',
            options: [
                { label: "5 bis 7 Liter", jobScore: 'facility' },
                { label: "18 - 20 Liter" },
                { label: "3 - 4 Liter" }
            ]
        },
        {
            id: 'k2',
            text: "Laser-Laufzeit Mond bis Weißes Haus?",
            type: 'radio',
            options: [
                { label: "1,1 Minute" },
                { label: "1,3 Sekunden", jobScore: 'rd' },
                { label: "0,0056 Millisekunden" }
            ]
        },
        {
            id: 'k3',
            text: "Wie schnell wird Passwort '12345' geknackt?",
            type: 'radio',
            options: [
                { label: "Sofort", jobScore: 'it' },
                { label: "1 Tag" },
                { label: "1 Stunde" }
            ]
        },
        {
            id: 'k4',
            text: "Wie viel Gold lagert in Fort Knox?",
            type: 'radio',
            options: [
                { label: "934,7 Mrd. Unzen" },
                { label: "100 Tausend Unzen" },
                { label: "147,3 Mio. Unzen", jobScore: 'finance' }
            ]
        },
        {
            id: 'k5',
            text: "Dunbar-Zahl (stabile soziale Beziehungen)?",
            type: 'radio',
            options: [
                { label: "ca. 50 Personen" },
                { label: "ca. 150 Personen", jobScore: 'hr' },
                { label: "ca. 500 Personen" }
            ]
        },
        {
            id: 'k6', // Die große Szenario Frage
            text: "Es Brennt.Was retten Sie aus dem Gebäude?",
            type: 'radio',
            options: [
                { label: "Den Koffer mit den nicht-nummerierten Inhaberaktien und dem Schwarzgeld.", jobScore: 'finance' },
                { label: "Die Backup-Festplatten mit den Erpressungsdaten (und der Browser-History des Chefs).", jobScore: 'it' },
                { label: "Den einzigen funktionierenden Prototypen des 'Schrumpf-o-mat 3000'.", jobScore: 'rd' },
                { label: "Die Kontaktliste der Reserve-Söldner (gutes Personal ist schwer zu finden).", jobScore: 'hr' },
                { label: "Den antiken Perser-Teppich aus dem Chefbüro (Blutflecken gehen da so schwer raus).", jobScore: 'facility' }
            ]
        }
    ];

    // --- TEIL 3: Die Admin-Felder (Schlusseingabe) ---
    // Diese rendern wir etwas anders, daher definieren wir sie separat
    const adminFields = [
        { id: 'salary', label: 'Gehaltsvorstellung (BTC)', placeholder: 'Jahresbrutto in Bitcoin', type: 'text' },
        { id: 'availability', label: 'Verfügbarkeit', placeholder: 'TT.MM.JJJJ oder "Sofort nach Haft..."', type: 'text' },
        { id: 'motivation', label: 'Aktueller Arbeitgeber & Wechselgrund', placeholder: "z.B. 'MI6 - Zu viel Bürokratie'", type: 'text' },
        { id: 'name', label: 'Vollständiger Name', placeholder: 'Max Mustermann', type: 'text' },
        { id: 'email', label: 'E-Mail Adresse', placeholder: 'max@evil-corp.com', type: 'email' }
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