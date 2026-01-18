// server/utils/magicLink.ts
// Hilfsfunktionen für Magic Link Token-Verarbeitung

/**
 * Extrahiert den Token aus einem Supabase Action Link
 * Der Link hat das Format: https://xxx.supabase.co/auth/v1/verify?token=TOKEN&type=magiclink&redirect_to=...
 */
export function extractTokenFromLink(actionLink: string): string | null {
    try {
        const url = new URL(actionLink);
        return url.searchParams.get('token');
    } catch {
        return null;
    }
}

/**
 * Baut einen Custom Magic Link, der direkt zur App zeigt
 * Dieser Link umgeht den PKCE Flow und nutzt direkte Token-Verifizierung
 */
export function buildCustomMagicLink(baseUrl: string, token: string, next: string = '/account'): string {
    return `${baseUrl}/account/confirm?token=${encodeURIComponent(token)}&next=${encodeURIComponent(next)}`;
}
