// composables/useApplications.ts

export type ApplicationStatus = 'open' | 'in_progress' | 'accepted' | 'rejected';

export interface Application {
    application_id: number;
    job_id: number;
    user_id: string; // Verknuepfung zu auth.users
    created_at: string;
    salary: number;
    availability: string;
    first_name: string;
    last_name: string;
    email: string;
    evil_score: number;
    status: ApplicationStatus;
    expertise: string;
    risk: string;
    approach: string;
    hierarchy: string;
    cv: string | null;
}

// Input-Typ für neue Bewerbungen
export interface CreateApplicationInput {
    job_id: number;
    job_title: string; // Für E-Mail-Benachrichtigungen
    first_name: string;
    last_name: string;
    email: string;
    salary: number;
    availability: string; // YYYY-MM-DD Format
    evil_score: number;
    expertise: string;
    risk: string;
    approach: string;
    hierarchy: string;
    cv_file?: File | null;
}

export const useApplications = () => {
    const supabase = useSupabaseClient();

    const applications = ref<Application[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

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

    const getApplicationById = async (id: number): Promise<Application | null> => {
        const { data, error: fetchError } = await supabase
            .from('applications')
            .select('*')
            .eq('application_id', id)
            .single();

        if (fetchError) {
            console.error('Fehler beim Laden der Bewerbung:', fetchError);
            return null;
        }

        return data as Application;
    };

    // Neue Bewerbung erstellen (User-Erstellung + Magic Link)
    const createApplication = async (input: CreateApplicationInput): Promise<{ success: boolean; error?: string }> => {

        let cvBase64: string | null = null;
        let cvFileName: string | null = null;

        if (input.cv_file) {
            cvFileName = `${Date.now()}_${input.first_name}_${input.last_name}.${input.cv_file.name.split('.').pop()}`;

            // File zu Base64 konvertieren
            cvBase64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    const base64 = result.split(',')[1] ?? '';
                    resolve(base64);
                };
                reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden'));
                reader.readAsDataURL(input.cv_file!);
            });
        }

        // Server-API aufrufen (CV-Upload + User + Bewerbung + Magic Link)
        try {
            await $fetch('/api/applications', {
                method: 'POST',
                body: {
                    job_id: input.job_id,
                    job_title: input.job_title,
                    first_name: input.first_name,
                    last_name: input.last_name,
                    email: input.email,
                    salary: input.salary,
                    availability: input.availability,
                    evil_score: input.evil_score,
                    expertise: input.expertise,
                    risk: input.risk,
                    approach: input.approach,
                    hierarchy: input.hierarchy,
                    cv_base64: cvBase64,
                    cv_filename: cvFileName
                }
            });

            return { success: true };
        } catch (err: any) {
            console.error('Fehler beim Speichern der Bewerbung:', err);
            return {
                success: false,
                error: err.data?.message || 'Speichern fehlgeschlagen'
            };
        }
    };

    // Bewerbungsstatus aktualisieren (mit E-Mail-Versand)

    const updateStatus = async (applicationId: number, newStatus: ApplicationStatus) => {
        try {
            await $fetch('/api/applications-status', {
                method: 'POST',
                body: { applicationId, newStatus }
            });

            const app = applications.value.find(a => a.application_id === applicationId);
            if (app) {
                app.status = newStatus;
            }
            return true;
        } catch (err: any) {
            console.error('Fehler beim Aktualisieren:', err);
            return false;
        }
    };

    const updateBulkStatus = async (ids: number[], newStatus: ApplicationStatus): Promise<boolean> => {
        try {
            // Jede Bewerbung einzeln aktualisieren (für individuelle E-Mails)
            const results = await Promise.all(
                ids.map(id =>
                    $fetch('/api/applications-status', {
                        method: 'POST',
                        body: { applicationId: id, newStatus }
                    }).catch(err => {
                        console.error(`Fehler bei ID ${id}:`, err);
                        return null;
                    })
                )
            );

            applications.value.forEach(app => {
                if (ids.includes(app.application_id)) {
                    app.status = newStatus;
                }
            });

            // Prüfe ob alle erfolgreich waren
            return results.every(r => r !== null);
        } catch (err: any) {
            console.error('Fehler beim Bulk-Update:', err);
            return false;
        }
    };

    // Bewerbungen löschen (mit E-Mail-Versand)
    const deleteApplications = async (ids: number[]): Promise<{ success: boolean; error?: string }> => {
        try {
            await $fetch('/api/applications-delete', {
                method: 'POST',
                body: { applicationIds: ids }
            });

            applications.value = applications.value.filter(
                app => !ids.includes(app.application_id)
            );

            return { success: true };
        } catch (err: any) {
            console.error('Fehler beim Löschen:', err);
            return {
                success: false,
                error: err.data?.message || 'Löschen fehlgeschlagen'
            };
        }
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
        getApplicationById,
        createApplication,
        updateStatus,
        updateBulkStatus,
        deleteApplications,
        totalApplications,
        openApplications,
        averageEvilScore
    };
};

