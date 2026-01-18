// composables/useJobMatching.ts
import type { Job, Hierarchy, Approach, Risk } from './useJobs';

// Gewählte Attribute aus Phase 3
export interface SelectedAttributes {
    hierarchy: Hierarchy | null;
    approach: Approach | null;
    risk: Risk | null;
}

export const useJobMatching = () => {
    // Zähle die Übereinstimmungen für einen Job
    const calculateJobMatches = (job: Job, selectedAttributes: SelectedAttributes): number => {
        let matches = 0;

        if (selectedAttributes.hierarchy && job.hierarchy === selectedAttributes.hierarchy) matches++;
        if (selectedAttributes.approach && job.approach === selectedAttributes.approach) matches++;
        if (selectedAttributes.risk && job.risk === selectedAttributes.risk) matches++;

        return matches;
    };

    // Finde den besten Job aus einer Liste (meiste Übereinstimmungen)
    const findBestJob = (jobs: Job[], selectedAttributes: SelectedAttributes): Job => {
        if (jobs.length === 0) {
            throw new Error('No jobs available');
        }

        if (jobs.length === 1) {
            return jobs[0]!;
        }

        return jobs.reduce((best, job) => {
            const currentMatches = calculateJobMatches(job, selectedAttributes);
            const bestMatches = calculateJobMatches(best, selectedAttributes);
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

    return {
        calculateJobMatches,
        findBestJob,
        findDifferentiatingAttributes
    };
};
