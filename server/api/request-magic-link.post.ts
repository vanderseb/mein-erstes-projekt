// server/api/request-magic-link.post.ts
// Generiert einen neuen Magic-Link für abgelaufene Zugänge

import { serverSupabaseServiceRole } from '#supabase/server';
import type { Database } from '../../types/supabase';
import { sendEmail } from '../utils/sendEmail';
import { magicLinkRequestedTemplate } from '../utils/emailTemplates';
import { extractTokenFromLink, buildCustomMagicLink } from '../utils/magicLink';

interface RequestBody {
    email: string;
}

export default defineEventHandler(async (event) => {
    const body = await readBody<RequestBody>(event);

    if (!body.email) {
        throw createError({
            statusCode: 400,
            message: 'E-Mail-Adresse erforderlich'
        });
    }

    const supabaseAdmin = serverSupabaseServiceRole<Database>(event);

    // 1. Prüfen ob User existiert und eine Bewerbung hat
    const { data: application, error: fetchError } = await supabaseAdmin
        .from('applications')
        .select('first_name, email')
        .eq('email', body.email)
        .limit(1)
        .single();

    if (fetchError || !application) {
        return {
            success: true,
            message: 'Falls ein Konto existiert, wurde ein Link gesendet.'
        };
    }

    // 2. Magic-Link generieren
    const requestUrl = getRequestURL(event);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: body.email
    });

    if (linkError || !linkData?.properties?.action_link) {
        console.error('Magic-Link Generierung fehlgeschlagen:', linkError);
        throw createError({
            statusCode: 500,
            message: 'Link konnte nicht generiert werden'
        });
    }

    // Token extrahieren und Custom Link bauen
    const token = extractTokenFromLink(linkData.properties.action_link);

    if (!token) {
        console.error('Token konnte nicht aus Link extrahiert werden');
        throw createError({
            statusCode: 500,
            message: 'Link konnte nicht erstellt werden'
        });
    }

    const customMagicLink = buildCustomMagicLink(baseUrl, token, '/account');

    // 3. E-Mail senden
    const html = magicLinkRequestedTemplate({
        firstName: application.first_name,
        magicLink: customMagicLink
    });

    const emailResult = await sendEmail({
        to: body.email,
        subject: 'Dein neues Portal-Ticket – Dr. Evil & Söhne',
        html
    });

    if (!emailResult.success) {
        throw createError({
            statusCode: 500,
            message: 'E-Mail konnte nicht gesendet werden'
        });
    }

    return {
        success: true,
        message: 'Neuer Zugangslink wurde gesendet.'
    };
});
