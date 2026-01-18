// server/api/applications-status.post.ts
// Aktualisiert den Status einer Bewerbung und sendet E-Mail-Benachrichtigung

import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '../../types/supabase';
import { sendEmail } from '../utils/sendEmail';
import {
    statusInProgressTemplate,
    statusAcceptedTemplate,
    statusRejectedTemplate
} from '../utils/emailTemplates';
import { extractTokenFromLink, buildCustomMagicLink } from '../utils/magicLink';

type ApplicationStatus = 'open' | 'in_progress' | 'accepted' | 'rejected';

interface StatusUpdateBody {
    applicationId: number;
    newStatus: ApplicationStatus;
}

export default defineEventHandler(async (event) => {
    const body = await readBody<StatusUpdateBody>(event);

    if (!body.applicationId || !body.newStatus) {
        throw createError({
            statusCode: 400,
            message: 'applicationId und newStatus erforderlich'
        });
    }

    const validStatuses: ApplicationStatus[] = ['open', 'in_progress', 'accepted', 'rejected'];
    if (!validStatuses.includes(body.newStatus)) {
        throw createError({
            statusCode: 400,
            message: 'Ungültiger Status'
        });
    }

    const supabaseAdmin = serverSupabaseServiceRole<Database>(event);

    // 1. Bewerbung laden um E-Mail-Adresse, Namen und Job-ID zu bekommen
    const { data: application, error: fetchError } = await supabaseAdmin
        .from('applications')
        .select('email, first_name, status, job_id')
        .eq('application_id', body.applicationId)
        .single();

    if (fetchError || !application) {
        throw createError({
            statusCode: 404,
            message: 'Bewerbung nicht gefunden'
        });
    }

    // Job-Titel aus jobs-Tabelle laden
    let jobTitle = `Job #${application.job_id ?? 'unbekannt'}`;
    if (application.job_id) {
        const { data: job } = await supabaseAdmin
            .from('jobs')
            .select('title')
            .eq('job_id', application.job_id)
            .single();
        jobTitle = job?.title || jobTitle;
    }
    const previousStatus = application.status;

    // 2. Status in DB aktualisieren
    const { error: updateError } = await supabaseAdmin
        .from('applications')
        .update({ status: body.newStatus })
        .eq('application_id', body.applicationId);

    if (updateError) {
        throw createError({
            statusCode: 500,
            message: 'Status-Update fehlgeschlagen: ' + updateError.message
        });
    }

    // 3. E-Mail senden (nur bei relevanten Status-Änderungen)
    // Keine E-Mail bei: open->open, oder wenn Status gleich bleibt
    if (body.newStatus !== 'open' && body.newStatus !== previousStatus) {
        try {
            // Magic-Link generieren
            const requestUrl = getRequestURL(event);
            const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

            const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
                type: 'magiclink',
                email: application.email
            });

            if (linkError || !linkData?.properties?.action_link) {
                console.error('Magic-Link Generierung fehlgeschlagen:', linkError);
                return {
                    success: true,
                    emailSent: false,
                    message: 'Status aktualisiert, aber E-Mail konnte nicht gesendet werden'
                };
            }

            // Token extrahieren und Custom Link bauen
            const token = extractTokenFromLink(linkData.properties.action_link);

            if (!token) {
                console.error('Token konnte nicht aus Link extrahiert werden');
                return {
                    success: true,
                    emailSent: false,
                    message: 'Status aktualisiert, aber Magic Link fehlerhaft'
                };
            }

            const magicLink = buildCustomMagicLink(baseUrl, token, '/account');

            // Template auswählen und E-Mail senden
            let html: string;
            let subject: string;

            switch (body.newStatus) {
                case 'in_progress':
                    html = statusInProgressTemplate({
                        firstName: application.first_name,
                        jobTitle,
                        magicLink
                    });
                    subject = 'Deine Bewerbung wird geprüft – Dr. Evil & Söhne';
                    break;

                case 'accepted':
                    html = statusAcceptedTemplate({
                        firstName: application.first_name,
                        jobTitle,
                        magicLink
                    });
                    subject = 'Willkommen im inneren Zirkel – Dr. Evil & Söhne';
                    break;

                case 'rejected':
                    html = statusRejectedTemplate({
                        firstName: application.first_name,
                        jobTitle,
                        magicLink
                    });
                    subject = 'Zu deiner Bewerbung – Dr. Evil & Söhne';
                    break;

                default:
                    return { success: true, emailSent: false };
            }

            const emailResult = await sendEmail({
                to: application.email,
                subject,
                html
            });

            return {
                success: true,
                emailSent: emailResult.success,
                emailId: emailResult.id
            };

        } catch (err: any) {
            console.error('E-Mail-Versand Fehler:', err);
            return {
                success: true,
                emailSent: false,
                message: 'Status aktualisiert, E-Mail-Versand fehlgeschlagen'
            };
        }
    }

    return { success: true, emailSent: false };
});
