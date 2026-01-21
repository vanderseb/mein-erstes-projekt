// composables/useQuizState.ts
import type { Expertise, Hierarchy, Approach, Risk } from './useJobs';
import type {
    PersonalityAnswer,
    ExpertiseAnswer,
    DiscriminatorAnswer
} from './useQuestions';

// Typen für das Scoring-System
export type QuizPhase = 1 | 2 | 3;

export const useQuizState = () => {
    // --- PHASE 1: Evil Score ---
    const evilScore = useState<number>('evilScore', () => 0);

    // --- PHASE 2: Funnel für Expertise ---
    const remainingExpertises = useState<Expertise[]>('remainingExpertises',
        () => ['Digital', 'Social_Engineering', 'Heavy_Machinery', 'Economy']);

    const finalExpertise = useState<Expertise | null>('finalExpertise', () => null);

    const nextExpertiseQuestionId = useState<string>('nextExpertiseQuestionId', () => 'e1');

    // --- PHASE 3: Gewählte Attribute ---
    const selectedAttributes = useState<{
        hierarchy: Hierarchy | null;
        approach: Approach | null;
        risk: Risk | null;
    }>('selectedAttributes', () => ({
        hierarchy: null,
        approach: null,
        risk: null
    }));

    const currentPhase = useState<QuizPhase>('currentPhase', () => 1);

    const phase1QuestionIndex = useState<number>('phase1QuestionIndex', () => 0);

    const phase3QuestionsAsked = useState<string[]>('phase3QuestionsAsked', () => []);

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

    const processPersonalityAnswer = (answer: PersonalityAnswer) => {
        evilScore.value += answer.evilPoints;
    };

    const processExpertiseAnswer = (answer: ExpertiseAnswer) => {
        // Entferne die verworfenen Expertisen
        remainingExpertises.value = remainingExpertises.value.filter(
            exp => !answer.discard.includes(exp)
        );

        // Wenn nur noch eine Expertise übrig ist, ist Phase 2 beendet
        if (remainingExpertises.value.length === 1) {
            finalExpertise.value = remainingExpertises.value[0]!;
        }

        // Nächste Frage-ID
        if (answer.next) {
            nextExpertiseQuestionId.value = answer.next;
        }
    };

    const processDiscriminatorAnswer = (answer: DiscriminatorAnswer) => {
        // Gewählte Attribute
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

    // Phasen-Durchlauf
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
        advanceToPhase2,
        advanceToPhase3,
        markPhase3QuestionAsked,
        isPhase3QuestionAsked
    };
};
