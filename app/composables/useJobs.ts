// composables/useJobs.ts

// Type-Definitionen für das Tag-basierte Job-System
export type Expertise = 'Digital' | 'Social_Engineering' | 'Heavy_Machinery' | 'Economy';
export type Hierarchy = 'Mastermind' | 'Henchman' | 'Minion';
export type Approach = 'Destructive' | 'Manipulative' | 'Greedy' | 'Obedient';
export type Risk = 'Lethal' | 'Toxic' | 'Safe_Desk';

// Department-Typen (interner Schlüssel für Bilder)
export type Department = 'hr' | 'rd' | 'it' | 'finance' | 'facility';

// Mapping: Department-Schlüssel → Anzeige-Label
export const DEPARTMENT_LABELS: Record<Department, string> = {
    hr: 'Human Capital & Cannon Fodder',
    rd: 'R&D (Research & Destruction)',
    it: 'IT & Global Hacking',
    finance: 'Finance & Black Budget',
    facility: 'Facility & Tatort-Management'
};

export interface Job {
    job_id: number;
    title: string;
    department: Department;
    expertise: Expertise;
    hierarchy: Hierarchy;
    approach: Approach;
    risk: Risk;
    description: string;
    tasks: string[];
    skills: string[];
}

export const useJobs = () => {
    const supabase = useSupabaseClient();

    // Reaktive States
    const jobs = ref<Job[]>([]);
    const loading = ref(true);
    const error = ref<string | null>(null);

    // Alle Jobs laden
    const fetchJobs = async () => {
        loading.value = true;
        error.value = null;

        const { data, error: fetchError } = await supabase
            .from('jobs')
            .select('*')
            .order('job_id');

        if (fetchError) {
            error.value = fetchError.message;
            console.error('Fehler beim Laden der Jobs:', fetchError);
        } else {
            jobs.value = (data as Job[]) || [];
        }

        loading.value = false;
    };

    // Einzelnen Job nach ID laden
    const getJobById = async (id: string | number): Promise<Job | null> => {
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

        // Erst im Cache schauen
        const cachedJob = jobs.value.find(job => job.job_id === numericId);
        if (cachedJob) {
            return cachedJob;
        }

        // Falls nicht im Cache, aus Supabase laden
        const { data, error: fetchError } = await supabase
            .from('jobs')
            .select('*')
            .eq('job_id', numericId)
            .single();

        if (fetchError) {
            console.error('Fehler beim Laden des Jobs:', fetchError);
            return null;
        }

        return data as Job;
    };

    // Hilfsfunktion: Jobs nach Expertise filtern
    const getJobsByExpertise = (expertise: Expertise) =>
        jobs.value.filter(job => job.expertise === expertise);

    // Hilfsfunktion: Department-Label holen
    const getDepartmentLabel = (department: Department): string =>
        DEPARTMENT_LABELS[department];

    // Jobs beim ersten Aufruf laden
    if (import.meta.client) {
        fetchJobs();
    }

    return {
        jobs,
        loading,
        error,
        fetchJobs,
        getJobById,
        getJobsByExpertise,
        getDepartmentLabel,
        DEPARTMENT_LABELS
    };
};
