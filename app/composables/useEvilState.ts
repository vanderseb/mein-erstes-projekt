// composables/useEvilState.ts
import type { Expertise, Hierarchy, Approach, Risk, Job } from './useJobs';
import type {
    PersonalityAnswer,
    ExpertiseAnswer,
    DiscriminatorAnswer
} from './useQuestions';

// Typen für das Scoring-System
export type QuizPhase = 1 | 2 | 3;

// Gewählte Attribute aus Phase 3 (einfache Werte statt Scores)
export interface SelectedAttributes {
    hierarchy: Hierarchy | null;
    approach: Approach | null;
    risk: Risk | null;
}

export const useEvilState = () => {
    // --- PHASE 1: Evil Score ---
    const evilScore = useState<number>('evilScore', () => 0);

    // --- PHASE 2: Expertise Funnel ---
    const remainingExpertises = useState<Expertise[]>('remainingExpertises',
        () => ['Digital', 'Social_Engineering', 'Heavy_Machinery', 'Economy']);

    // Die finale Expertise nach Phase 2
    const finalExpertise = useState<Expertise | null>('finalExpertise', () => null);

    // Die nächste Expertise-Frage ID (für den adaptiven Flow)
    const nextExpertiseQuestionId = useState<string>('nextExpertiseQuestionId', () => 'e1');

    // --- PHASE 3: Gewählte Attribute (für Tie-Breaker) ---
    const selectedAttributes = useState<SelectedAttributes>('selectedAttributes', () => ({
        hierarchy: null,
        approach: null,
        risk: null
    }));

    // --- CURRENT PHASE ---
    const currentPhase = useState<QuizPhase>('currentPhase', () => 1);

    // --- PHASE 1 TRACKING ---
    const phase1QuestionIndex = useState<number>('phase1QuestionIndex', () => 0);

    // --- PHASE 3 TRACKING ---
    const phase3QuestionsAsked = useState<string[]>('phase3QuestionsAsked', () => []);

    // =============================================
    // RESET FUNKTION
    // =============================================
    const resetScores = () => {
        evilScore.value = 0;
        remainingExpertises.value = ['Digital', 'Social_Engineering', 'Heavy_Machinery', 'Economy'];
        finalExpertise.value = null;
        nextExpertiseQuestionId.value = 'e1';
        selectedAttributes.value = {
            hierarchy: null,
            approach: null,
            risk: null
        };
        currentPhase.value = 1;
        phase1QuestionIndex.value = 0;
        phase3QuestionsAsked.value = [];
    };

    // =============================================
    // PHASE 1: Personality Answer Processing
    // =============================================
    const processPersonalityAnswer = (answer: PersonalityAnswer) => {
        evilScore.value += answer.evilPoints;
    };

    // =============================================
    // PHASE 2: Expertise Answer Processing
    // =============================================
    const processExpertiseAnswer = (answer: ExpertiseAnswer) => {
        // Entferne die verworfenen Expertisen
        remainingExpertises.value = remainingExpertises.value.filter(
            exp => !answer.discard.includes(exp)
        );

        // Wenn nur noch eine Expertise übrig ist, ist Phase 2 beendet
        if (remainingExpertises.value.length === 1) {
            finalExpertise.value = remainingExpertises.value[0]!;
        }

        // Setze die nächste Frage-ID (wenn vorhanden)
        if (answer.next) {
            nextExpertiseQuestionId.value = answer.next;
        }
    };

    // =============================================
    // PHASE 3: Discriminator Answer Processing
    // =============================================
    const processDiscriminatorAnswer = (answer: DiscriminatorAnswer) => {
        // Speichere die gewählten Attribute direkt
        if (answer.hierarchy) {
            selectedAttributes.value.hierarchy = answer.hierarchy;
        }
        if (answer.approach) {
            selectedAttributes.value.approach = answer.approach;
        }
        if (answer.risk) {
            selectedAttributes.value.risk = answer.risk;
        }
    };

    // =============================================
    // JOB MATCHING ALGORITHMUS
    // =============================================

    // Zähle die Übereinstimmungen für einen Job
    const calculateJobMatches = (job: Job): number => {
        const selected = selectedAttributes.value;
        let matches = 0;

        if (selected.hierarchy && job.hierarchy === selected.hierarchy) matches++;
        if (selected.approach && job.approach === selected.approach) matches++;
        if (selected.risk && job.risk === selected.risk) matches++;

        return matches;
    };

    // Finde den besten Job aus einer Liste (meiste Übereinstimmungen)
    const findBestJob = (jobs: Job[]): Job => {
        if (jobs.length === 0) {
            throw new Error('No jobs available');
        }

        if (jobs.length === 1) {
            return jobs[0]!;
        }

        return jobs.reduce((best, job) => {
            const currentMatches = calculateJobMatches(job);
            const bestMatches = calculateJobMatches(best);
            return currentMatches > bestMatches ? job : best;
        }, jobs[0]!);
    };

    // Finde heraus, welche Attribute sich bei den verbleibenden Jobs unterscheiden
    const findDifferentiatingAttributes = (jobs: Job[]): ('hierarchy' | 'approach' | 'risk')[] => {
        const attributes: ('hierarchy' | 'approach' | 'risk')[] = [];

        if (jobs.length <= 1) return attributes;

        // Prüfe hierarchy
        const hierarchies = new Set(jobs.map(j => j.hierarchy));
        if (hierarchies.size > 1) attributes.push('hierarchy');

        // Prüfe approach
        const approaches = new Set(jobs.map(j => j.approach));
        if (approaches.size > 1) attributes.push('approach');

        // Prüfe risk
        const risks = new Set(jobs.map(j => j.risk));
        if (risks.size > 1) attributes.push('risk');

        return attributes;
    };

    // =============================================
    // PHASE MANAGEMENT
    // =============================================

    const advanceToPhase2 = () => {
        currentPhase.value = 2;
    };

    const advanceToPhase3 = () => {
        currentPhase.value = 3;
    };

    const markPhase3QuestionAsked = (questionId: string) => {
        if (!phase3QuestionsAsked.value.includes(questionId)) {
            phase3QuestionsAsked.value.push(questionId);
        }
    };

    const isPhase3QuestionAsked = (questionId: string): boolean => {
        return phase3QuestionsAsked.value.includes(questionId);
    };

    return {
        // State
        evilScore,
        remainingExpertises,
        finalExpertise,
        nextExpertiseQuestionId,
        selectedAttributes,
        currentPhase,
        phase1QuestionIndex,
        phase3QuestionsAsked,

        // Functions
        resetScores,
        processPersonalityAnswer,
        processExpertiseAnswer,
        processDiscriminatorAnswer,
        calculateJobMatches,
        findBestJob,
        findDifferentiatingAttributes,
        advanceToPhase2,
        advanceToPhase3,
        markPhase3QuestionAsked,
        isPhase3QuestionAsked
    };
};
