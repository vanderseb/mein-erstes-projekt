// composables/useQuizFlow.ts
import type { Job } from './useJobs';
import type {
    PersonalityQuestion,
    ExpertiseQuestion,
    DiscriminatorQuestion,
    PersonalityAnswer,
    ExpertiseAnswer,
    DiscriminatorAnswer
} from './useQuestions';

export interface QuizFlowOptions {
    onComplete: () => void;
    autoReset?: boolean; // Standard = true
}

export type CurrentQuestion = PersonalityQuestion | ExpertiseQuestion | DiscriminatorQuestion | null;
export type QuizAnswer = PersonalityAnswer | ExpertiseAnswer | DiscriminatorAnswer;

export const useQuizFlow = (options: QuizFlowOptions) => {
    const { getJobsByExpertise } = useJobs();
    const {
        personalityQuestions,
        getExpertiseQuestionById,
        getDiscriminatorByTrigger
    } = useQuestions();

    const {
        currentPhase,
        phase1QuestionIndex,
        remainingExpertises,
        finalExpertise,
        nextExpertiseQuestionId,
        phase3QuestionsAsked,
        resetScores,
        processPersonalityAnswer,
        processExpertiseAnswer,
        processDiscriminatorAnswer,
        advanceToPhase2,
        advanceToPhase3,
        markPhase3QuestionAsked,
        isPhase3QuestionAsked
    } = useQuizState();

    const { findDifferentiatingAttributes } = useJobMatching();

    // Reset beim Start
    if (options.autoReset !== false) {
        onMounted(() => resetScores());
    }

    // Phase 1: Aktuelle Persönlichkeitsfrage
    const currentPersonalityQuestion = computed(() =>
        personalityQuestions[phase1QuestionIndex.value]
    );

    // Phase 2: Aktuelle Expertise-Frage
    const currentExpertiseQuestion = computed(() =>
        getExpertiseQuestionById(nextExpertiseQuestionId.value)
    );

    // Phase 3: Verbleibende Jobs
    const remainingJobs = computed((): Job[] => {
        if (!finalExpertise.value) return [];
        return getJobsByExpertise(finalExpertise.value);
    });

    const currentDiscriminatorQuestion = computed(() => {
        if (remainingJobs.value.length <= 1) return null;

        // Finde Attribute, die sich unterscheiden
        const differentiatingAttrs = findDifferentiatingAttributes(remainingJobs.value);

        // Finde noch nicht gestellte Frage
        for (const attr of differentiatingAttrs) {
            const question = getDiscriminatorByTrigger(attr);
            if (question && !isPhase3QuestionAsked(question.id)) {
                return question;
            }
        }

        return null;
    });

    const currentQuestion = computed((): CurrentQuestion => {
        if (currentPhase.value === 1) return currentPersonalityQuestion.value ?? null;
        if (currentPhase.value === 2) return currentExpertiseQuestion.value ?? null;
        if (currentPhase.value === 3) return currentDiscriminatorQuestion.value ?? null;
        return null;
    });

    const progress = computed(() => {
        if (currentPhase.value === 1) {
            return ((phase1QuestionIndex.value + 1) / personalityQuestions.length) * 33;
        }
        if (currentPhase.value === 2) {
            const totalExpertises = 4;
            const remaining = remainingExpertises.value.length;
            const eliminated = totalExpertises - remaining;
            return 33 + (eliminated / (totalExpertises - 1)) * 33;
        }
        if (currentPhase.value === 3) {
            const totalPossible = 3; // max 3 Discriminator-Fragen
            const asked = phase3QuestionsAsked.value.length;
            return 66 + (asked / totalPossible) * 34;
        }
        return 100;
    });

    
    const selectAnswer = (option: QuizAnswer) => {
        if (currentPhase.value === 1) {
            processPersonalityAnswer(option as PersonalityAnswer);

            if (phase1QuestionIndex.value < personalityQuestions.length - 1) {
                phase1QuestionIndex.value++;
            } else {
                // Phase 1 beendet -> Phase 2
                advanceToPhase2();
            }
        }
        else if (currentPhase.value === 2) {
            processExpertiseAnswer(option as ExpertiseAnswer);

            // Prüfe ob finale Expertise ermittelt wurde
            if (finalExpertise.value) {
                // Prüfe ob mehrere Jobs in dieser Expertise existieren
                const jobsInExpertise = getJobsByExpertise(finalExpertise.value);

                if (jobsInExpertise.length > 1) {
                    advanceToPhase3();
                } else {
                    // Nur ein Job -> Quiz beendet
                    options.onComplete();
                }
            }
        }
        else if (currentPhase.value === 3) {
            processDiscriminatorAnswer(option as DiscriminatorAnswer);

            if (currentDiscriminatorQuestion.value) {
                markPhase3QuestionAsked(currentDiscriminatorQuestion.value.id);
            }

            // Prüfe ob noch Fragen nötig sind
            nextTick(() => {
                if (!currentDiscriminatorQuestion.value) {
                    options.onComplete();
                }
            });
        }
    };

    // Watch für Phase 3 Ende
    watch(currentDiscriminatorQuestion, (newQuestion) => {
        if (currentPhase.value === 3 && !newQuestion && remainingJobs.value.length > 0) {
            options.onComplete();
        }
    });

    return {
        // Computed
        currentQuestion,
        currentPhase,
        progress,
        remainingJobs,
        finalExpertise,

        // Functions
        selectAnswer,
        resetScores
    };
};
