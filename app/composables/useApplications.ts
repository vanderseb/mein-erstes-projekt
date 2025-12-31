// composables/useApplications.ts

export type ApplicationStatus = 'open' | 'in_progress' | 'accepted' | 'rejected';

export interface Application {
    application_id: number;
    job_id: number;
    created_at: string;
    salary: number;
    availability: string;
    firstname: string;
    lastname: string;
    email: string;
    evil_score: number;
    status: ApplicationStatus;
}

export const useApplications = () => {
    const supabase = useSupabaseClient();

    // Reaktive States
    const applications = ref<Application[]>([]);
    const loading = ref(true);
    const error = ref<string | null>(null);

    // Alle Bewerbungen laden
    const fetchApplications = async () => {
        loading.value = true;
        error.value = null;

        const { data, error: fetchError } = await supabase
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (fetchError) {
            error.value = fetchError.message;
            console.error('Fehler beim Laden der Bewerbungen:', fetchError);
        } else {
            applications.value = (data as Application[]) || [];
        }

        loading.value = false;
    };

    // Status einer Bewerbung aktualisieren
    const updateStatus = async (applicationId: number, newStatus: ApplicationStatus) => {
        const { error: updateError } = await supabase
            .from('applications')
            .update({ status: newStatus })
            .eq('application_id', applicationId);

        if (updateError) {
            console.error('Fehler beim Aktualisieren:', updateError);
            return false;
        }

        // Lokalen State aktualisieren
        const app = applications.value.find(a => a.application_id === applicationId);
        if (app) {
            app.status = newStatus;
        }
        return true;
    };

    // --- KPIs ---
    const totalApplications = computed(() => applications.value.length);

    const openApplications = computed(() =>
        applications.value.filter(a => a.status === 'open').length
    );

    const averageEvilScore = computed(() => {
        if (applications.value.length === 0) return 0;
        const sum = applications.value.reduce((acc, curr) => acc + curr.evil_score, 0);
        return Math.round((sum / applications.value.length) * 10) / 10;
    });

    return {
        applications,
        loading,
        error,
        fetchApplications,
        updateStatus,
        totalApplications,
        openApplications,
        averageEvilScore
    };
};
