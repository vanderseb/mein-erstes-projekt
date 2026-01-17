// server/api/applications.post.ts
// Erstellt Bewerbung, User (falls nötig) und sendet Magic Link

import { serverSupabaseServiceRole, serverSupabaseClient } from '#supabase/server';

interface ApplicationBody {
    job_id: number;
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

    // Supabase Clients
    const supabaseAdmin = serverSupabaseServiceRole(event);
    const supabaseClient = await serverSupabaseClient(event);

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

    // 4. Magic Link senden (signInWithOtp versendet die E-Mail automatisch)
    const requestUrl = getRequestURL(event);
    const redirectUrl = `${requestUrl.protocol}//${requestUrl.host}/account/confirm?next=/account`;

    const { error: otpError } = await supabaseClient.auth.signInWithOtp({
        email: body.email,
        options: {
            emailRedirectTo: redirectUrl
        }
    });

    if (otpError) {
        console.error('Magic Link Fehler:', otpError);
        // Bewerbung wurde gespeichert, nur E-Mail fehlgeschlagen
        // Wir geben trotzdem Erfolg zurück, loggen aber den Fehler
    }

    return {
        success: true,
        userId,
        message: 'Bewerbung erfolgreich gespeichert. Magic Link wurde gesendet.'
    };
});
