// composables/useApplications.ts

export type ApplicationStatus = 'open' | 'in_progress' | 'accepted' | 'rejected';

export interface Application {
    application_id: number;
    job_id: number;
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

// Input-Typ für neue Bewerbungen (ohne auto-generierte Felder)
export interface CreateApplicationInput {
    job_id: number;
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

    // Einzelne Bewerbung nach ID laden
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

    // Neue Bewerbung erstellen
    const createApplication = async (input: CreateApplicationInput): Promise<{ success: boolean; error?: string }> => {
        let cvUrl: string | null = null;

        // 1. CV hochladen falls vorhanden
        if (input.cv_file) {
            const fileExt = input.cv_file.name.split('.').pop();
            const fileName = `${Date.now()}_${input.first_name}_${input.last_name}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('cv-uploads')
                .upload(fileName, input.cv_file);

            if (uploadError) {
                console.error('Fehler beim CV-Upload:', uploadError);
                return { success: false, error: 'CV-Upload fehlgeschlagen: ' + uploadError.message };
            }

            // Public URL generieren
            const { data: urlData } = supabase.storage
                .from('cv-uploads')
                .getPublicUrl(fileName);

            cvUrl = urlData.publicUrl;
        }

        // 2. Bewerbung in Datenbank speichern
        const { error: insertError } = await supabase
            .from('applications')
            .insert({
                job_id: input.job_id,
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
                cv: cvUrl,
                status: 'open'
            } as any); // Type assertion wegen fehlender Supabase-Typen

        if (insertError) {
            console.error('Fehler beim Speichern der Bewerbung:', insertError);
            return { success: false, error: 'Speichern fehlgeschlagen: ' + insertError.message };
        }

        return { success: true };
    };

    // Status einer Bewerbung aktualisieren
    const updateStatus = async (applicationId: number, newStatus: ApplicationStatus) => {
        const { error: updateError } = await supabase
            .from('applications')
            .update({ status: newStatus } as any)
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

    // Bulk-Status für mehrere Bewerbungen aktualisieren
    const updateBulkStatus = async (ids: number[], newStatus: ApplicationStatus): Promise<boolean> => {
        const { error: updateError } = await supabase
            .from('applications')
            .update({ status: newStatus } as any)
            .in('application_id', ids);

        if (updateError) {
            console.error('Fehler beim Bulk-Update:', updateError);
            return false;
        }

        // Lokalen State aktualisieren
        applications.value.forEach(app => {
            if (ids.includes(app.application_id)) {
                app.status = newStatus;
            }
        });
        return true;
    };

    // Bewerbungen löschen (DB + Storage)
    const deleteApplications = async (ids: number[]): Promise<{ success: boolean; error?: string }> => {
        // 1. Bewerbungen laden um CV-URLs zu bekommen
        const { data: appsToDelete, error: fetchError } = await supabase
            .from('applications')
            .select('application_id, cv')
            .in('application_id', ids);

        if (fetchError) {
            return { success: false, error: 'Fehler beim Laden: ' + fetchError.message };
        }

        // 2. CV-Dateien aus Storage löschen
        const cvFiles = (appsToDelete as { application_id: number; cv: string | null }[])
            .filter(app => app.cv)
            .map(app => {
                // Extrahiere Dateinamen aus der URL
                const url = app.cv!;
                const parts = url.split('/');
                return parts[parts.length - 1];
            });

        if (cvFiles.length > 0) {
            const { error: storageError } = await supabase.storage
                .from('cv-uploads')
                .remove(cvFiles);

            if (storageError) {
                console.error('Warnung: CV-Dateien konnten nicht gelöscht werden:', storageError);
                // Wir machen trotzdem weiter mit dem DB-Löschen
            }
        }

        // 3. Bewerbungen aus DB löschen
        const { error: deleteError } = await supabase
            .from('applications')
            .delete()
            .in('application_id', ids);

        if (deleteError) {
            return { success: false, error: 'Fehler beim Löschen: ' + deleteError.message };
        }

        // 4. Lokalen State aktualisieren
        applications.value = applications.value.filter(
            app => !ids.includes(app.application_id)
        );

        return { success: true };
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

