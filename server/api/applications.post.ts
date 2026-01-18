// server/api/applications.post.ts
// Erstellt Bewerbung, User (falls nötig) und sendet Magic Link via Resend

import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '../../types/supabase';
import { sendEmail } from '../utils/sendEmail';
import { applicationSubmittedTemplate } from '../utils/emailTemplates';
import { extractTokenFromLink, buildCustomMagicLink } from '../utils/magicLink';

interface ApplicationBody {
    job_id: number;
    job_title: string;
    first_name: string;
    last_name: string;
    email: string;
    salary: number;
    availability: string;
    evil_score: number;
    expertise: string;
    risk: string;
    approach: string;
    hierarchy: string;
    cv_base64?: string | null;
    cv_filename?: string | null;
}

export default defineEventHandler(async (event) => {
    const body = await readBody<ApplicationBody>(event);

    // Validierung
    if (!body.email || !body.job_id || !body.first_name || !body.last_name) {
        throw createError({
            statusCode: 400,
            message: 'Pflichtfelder fehlen: email, job_id, first_name, last_name'
        });
    }

    // Supabase Admin Client
    const supabaseAdmin = serverSupabaseServiceRole<Database>(event);

    // 1. User suchen oder erstellen
    let userId: string;

    try {
        const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();

        if (listError) {
            console.error('Fehler beim Laden der User:', listError);
            throw createError({ statusCode: 500, message: 'User-Suche fehlgeschlagen' });
        }

        const existingUser = existingUsers?.users.find(u => u.email === body.email);

        if (existingUser) {
            userId = existingUser.id;
            console.log(`Existierender User gefunden: ${userId}`);
        } else {
            // Neuen User erstellen
            const { data: newUser, error: userCreateError } = await supabaseAdmin.auth.admin.createUser({
                email: body.email,
                email_confirm: true,
                app_metadata: { role: 'applicant' }
            });

            if (userCreateError || !newUser.user) {
                console.error('Fehler beim Erstellen des Users:', userCreateError);
                throw createError({ statusCode: 500, message: 'User konnte nicht erstellt werden' });
            }

            userId = newUser.user.id;
            console.log(`Neuer User erstellt: ${userId}`);
        }
    } catch (err: any) {
        if (err.statusCode) throw err;
        console.error('Unerwarteter Fehler bei User-Verarbeitung:', err);
        throw createError({ statusCode: 500, message: 'Interner Server-Fehler' });
    }

    // 2. CV hochladen falls vorhanden (mit Service Role Key)
    let cvUrl: string | null = null;

    if (body.cv_base64 && body.cv_filename) {
        // Base64 zu Buffer konvertieren
        const binaryString = atob(body.cv_base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const { error: uploadError } = await supabaseAdmin.storage
            .from('cv-uploads')
            .upload(body.cv_filename, bytes, {
                contentType: 'application/pdf'
            });

        if (uploadError) {
            console.error('CV-Upload Fehler:', uploadError);
            throw createError({
                statusCode: 500,
                message: 'CV-Upload fehlgeschlagen: ' + uploadError.message
            });
        }

        // Public URL generieren
        const { data: urlData } = supabaseAdmin.storage
            .from('cv-uploads')
            .getPublicUrl(body.cv_filename);

        cvUrl = urlData.publicUrl;
    }

    // 3. Bewerbung in Datenbank speichern
    const { error: insertError } = await supabaseAdmin.from('applications').insert({
        job_id: body.job_id,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        salary: body.salary,
        availability: body.availability,
        evil_score: body.evil_score,
        expertise: body.expertise,
        risk: body.risk,
        approach: body.approach,
        hierarchy: body.hierarchy,
        cv: cvUrl,
        user_id: userId,
        status: 'open'
    });

    if (insertError) {
        console.error('Fehler beim Speichern der Bewerbung:', insertError);
        throw createError({
            statusCode: 500,
            message: 'Bewerbung konnte nicht gespeichert werden: ' + insertError.message
        });
    }

    // 4. Magic Link generieren und E-Mail via Resend senden
    const requestUrl = getRequestURL(event);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

    let emailSent = false;

    try {
        // Magic Link von Supabase generieren lassen
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: body.email
        });

        if (linkError || !linkData?.properties?.action_link) {
            console.error('Magic-Link Generierung fehlgeschlagen:', linkError);
        } else {
            // Token aus dem Supabase-Link extrahieren und eigenen Link bauen
            const token = extractTokenFromLink(linkData.properties.action_link);

            if (!token) {
                console.error('Token konnte nicht aus Link extrahiert werden');
            } else {
                const customMagicLink = buildCustomMagicLink(baseUrl, token, '/account');

                // E-Mail mit eigenem Template senden
                const html = applicationSubmittedTemplate({
                    firstName: body.first_name,
                    jobTitle: body.job_title,
                    magicLink: customMagicLink
                });

                const emailResult = await sendEmail({
                    to: body.email,
                    subject: 'Akte angelegt – Dr. Evil & Söhne',
                    html
                });

                emailSent = emailResult.success;

                if (!emailResult.success) {
                    console.error('E-Mail-Versand fehlgeschlagen:', emailResult.error);
                }
            }
        }
    } catch (err: any) {
        console.error('Fehler bei Magic Link / E-Mail:', err);
    }

    return {
        success: true,
        userId,
        emailSent,
        message: emailSent
            ? 'Bewerbung erfolgreich gespeichert. Bestätigung wurde gesendet.'
            : 'Bewerbung gespeichert, aber E-Mail konnte nicht gesendet werden.'
    };
});
