// composables/useQuestions.ts
export const useQuestions = () => {

    // Struktur einer Frage
    interface Question {
        id: number;
        text: string;
        type: 'text' | 'radio' | 'select' | 'file'; // Eingabetyp
        options?: string[]; // Nur für Radio/Select nötig
    }

    // 1. Fragen für das "Fußvolk" (Alle außer CEO)
    const standardQuestions: Question[] = [
        {
            id: 1, text: 'Wie viele Jahre Erfahrung hast du im Bösen?', type: 'select',
            options: ['Keine (Praktikant)', '1-3 Jahre (Minion)', '10+ Jahre (Mastermind)']
        },
        {
            id: 2, text: 'Was ist deine größte Schwäche?', type: 'text'
        },
        {
            id: 3, text: 'Wie reagierst du auf Helden-Infiltration?', type: 'radio',
            options: ['Alarm schlagen', 'Angreifen', 'Weglaufen']
        },
        {
            id: 4, text: 'Lade deinen Lebenslauf hoch (PDF)', type: 'file'
        }
    ];

    // 2. Fragen für den CEO
    const ceoQuestions: Question[] = [
        {
            id: 1, text: 'Besitzen Sie eine eigene Vulkan-Basis?', type: 'radio',
            options: ['Ja', 'Nein, aber eine Insel', 'Ich arbeite dran']
        },
        {
            id: 2, text: 'Wie lautet Ihr maniacal laugh?', type: 'text'
        },
        {
            id: 3, text: 'Was ist Ihr bevorzugtes Haustier?', type: 'select',
            options: ['Weiße Katze', 'Piranhas', 'Nacktmull']
        },
        {
            id: 4, text: 'Laden Sie Ihren Plan zur Weltherrschaft hoch', type: 'file'
        }
    ];

    // 3. Quiz Fragen (Jeopardy)
    const quizQuestions = [
        {
            text: "Was machst du am liebsten?",
            options: [
                { label: "Leute herumkommandieren", score: "hr" },
                { label: "Dinge kaputt machen", score: "rd" },
                { label: "Computer hacken", score: "it" },
                { label: "Geld zählen", score: "finance" },
                { label: "Aufräumen", score: "facility" }
            ]
        },
        {
            text: "Was ist dein liebstes Werkzeug?",
            options: [
                { label: "Die Peitsche", score: "hr" },
                { label: "Der Laser", score: "rd" },
                { label: "Die Tastatur", score: "it" },
                { label: "Der Taschenrechner", score: "finance" },
                { label: "Der Wischmopp", score: "facility" }
            ]
        },
        // ... man könnte hier mehr Fragen ergänzen
    ];

    return { standardQuestions, ceoQuestions, quizQuestions };
};