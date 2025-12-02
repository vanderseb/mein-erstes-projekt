export const useEvilState = () => {
    // Globaler State für den Evil Score
    const evilScore = useState<number>('evilScore', () => 0);

    // Globaler State für die Job-Scores (HR, IT, etc.)
    const jobScores = useState<Record<string, number>>('jobScores', () => ({
        hr: 0,
        rd: 0,
        it: 0,
        finance: 0,
        facility: 0
    }));

    // Funktion zum Zurücksetzen (wichtig bei Neustart)
    const resetScores = () => {
        evilScore.value = 0;
        jobScores.value = { hr: 0, rd: 0, it: 0, finance: 0, facility: 0 };
    };

    // Funktion: Antwort verarbeiten und Punkte verteilen
    const processAnswer = (option: any) => {
        // 1. Evil Score updaten
        if (option.evilPoints) {
            evilScore.value += option.evilPoints;
        }
        // 2. Job Score updaten
        const scores = jobScores.value;
        const jobKey = option.jobScore;

        if (jobKey && scores && typeof scores[jobKey] === 'number') {
            scores[jobKey] += 1;
        }
    };

    return {
        evilScore,
        jobScores,
        resetScores,
        processAnswer
    };
};