// server/api/check-user-role.post.ts
// Prüft die Rolle eines Users anhand der E-Mail-Adresse

import { serverSupabaseServiceRole } from '#supabase/server';

interface RequestBody {
    email: string;
}

interface ResponseBody {
    role: 'hr' | 'applicant' | 'unknown';
}

export default defineEventHandler(async (event): Promise<ResponseBody> => {
    const body = await readBody<RequestBody>(event);

    if (!body.email) {
        throw createError({
            statusCode: 400,
            message: 'E-Mail-Adresse erforderlich'
        });
    }

    const supabaseAdmin = serverSupabaseServiceRole(event);

    // Alle User laden und nach E-Mail suchen
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
        console.error('Fehler beim Laden der User:', listError);
        throw createError({
            statusCode: 500,
            message: 'Interner Server-Fehler'
        });
    }

    // User mit dieser E-Mail suchen
    const user = usersData?.users.find(u => u.email?.toLowerCase() === body.email.toLowerCase());

    if (!user) {
        return { role: 'unknown' };
    }

    // Rolle aus app_metadata lesen
    const role = user.app_metadata?.role;

    if (role === 'hr') {
        return { role: 'hr' };
    }

    // Wenn keine Rolle oder 'applicant', dann Bewerber
    return { role: 'applicant' };
});
