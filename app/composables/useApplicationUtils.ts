// composables/useApplicationUtils.ts
// Gemeinsame Hilfsfunktionen für Bewerbungs-Anzeige

import type { ApplicationStatus } from './useApplications';

// Status-Konfiguration
export const statusConfig: Record<ApplicationStatus, { label: string; color: string }> = {
    open: { label: 'Offen', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
    in_progress: { label: 'In Bearbeitung', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
    accepted: { label: 'Angenommen', color: 'bg-green-500/20 text-green-400 border-green-500/50' },
    rejected: { label: 'Abgelehnt', color: 'bg-red-500/20 text-red-400 border-red-500/50' }
};

// Status-Label für Anzeige
export const getStatusLabel = (status: ApplicationStatus): string => {
    return statusConfig[status]?.label ?? status;
};

// Status-Farbe für Tabellen (einfach)
export const getStatusColor = (status: ApplicationStatus): string => {
    return status === 'accepted' ? 'text-green-400' : 'text-evil-light';
};

// Datum formatieren (deutsches Format)
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
