// server/api/applications-delete.post.ts
// Löscht Bewerbungen und sendet DSGVO-konforme Benachrichtigung

import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '../../types/supabase';
import { sendEmail } from '../utils/sendEmail';
import { statusDeletedTemplate } from '../utils/emailTemplates';

interface DeleteBody {
    applicationIds: number[];
}

export default defineEventHandler(async (event) => {
    const body = await readBody<DeleteBody>(event);

    if (!body.applicationIds || body.applicationIds.length === 0) {
        throw createError({
            statusCode: 400,
            message: 'applicationIds Array erforderlich'
        });
    }

    const supabaseAdmin = serverSupabaseServiceRole<Database>(event);

    // 1. Bewerbungen laden um E-Mail-Adressen, Job-IDs und CV-URLs zu bekommen
    const { data: applications, error: fetchError } = await supabaseAdmin
        .from('applications')
        .select('application_id, email, first_name, cv, job_id')
        .in('application_id', body.applicationIds);

    if (fetchError) {
        throw createError({
            statusCode: 500,
            message: 'Fehler beim Laden der Bewerbungen: ' + fetchError.message
        });
    }

    if (!applications || applications.length === 0) {
        throw createError({
            statusCode: 404,
            message: 'Keine Bewerbungen gefunden'
        });
    }

    // Job-Titel für alle betroffenen Jobs laden
    const uniqueJobIds = [...new Set(applications.map(app => app.job_id).filter((id): id is number => id !== null))];
    const { data: jobs } = await supabaseAdmin
        .from('jobs')
        .select('job_id, title')
        .in('job_id', uniqueJobIds);

    const jobTitleMap = new Map(jobs?.map(j => [j.job_id, j.title]) || []);

    // 2. CV-Dateien aus Storage löschen
    const cvFiles = applications
        .filter(app => app.cv)
        .map(app => {
            const url = app.cv!;
            const parts = url.split('/');
            return parts[parts.length - 1];
        });

    if (cvFiles.length > 0) {
        const { error: storageError } = await supabaseAdmin.storage
            .from('cv-uploads')
            .remove(cvFiles);

        if (storageError) {
            console.error('Warnung: CV-Dateien konnten nicht gelöscht werden:', storageError);
            // Wir machen trotzdem weiter
        }
    }

    // 3. Bewerbungen aus DB löschen
    const { error: deleteError } = await supabaseAdmin
        .from('applications')
        .delete()
        .in('application_id', body.applicationIds);

    if (deleteError) {
        throw createError({
            statusCode: 500,
            message: 'Fehler beim Löschen: ' + deleteError.message
        });
    }

    // 4. E-Mails an alle betroffenen Bewerber senden
    const emailResults: { email: string; success: boolean }[] = [];

    for (const app of applications) {
        const jobTitle = (app.job_id && jobTitleMap.get(app.job_id)) || `Job #${app.job_id ?? 'unbekannt'}`;

        const html = statusDeletedTemplate({
            firstName: app.first_name,
            jobTitle
        });

        const result = await sendEmail({
            to: app.email,
            subject: 'Datenvernichtung abgeschlossen – Dr. Evil & Söhne',
            html
        });

        emailResults.push({
            email: app.email,
            success: result.success
        });
    }

    return {
        success: true,
        deletedCount: applications.length,
        emailResults
    };
});
