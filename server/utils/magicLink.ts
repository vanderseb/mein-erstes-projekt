// server/utils/magicLink.ts
// Hilfsfunktionen für Magic Link Token-Verarbeitung

//Extrahiert den Token aus einem Supabase Action Link
export function extractTokenFromLink(actionLink: string): string | null {
    try {
        const url = new URL(actionLink);
        return url.searchParams.get('token');
    } catch {
        return null;
    }
}

// Baut einen Custom Magic Link, der direkt zur App zeigt
export function buildCustomMagicLink(baseUrl: string, token: string, next: string = '/account'): string {
    return `${baseUrl}/account/confirm?token=${encodeURIComponent(token)}&next=${encodeURIComponent(next)}`;
}