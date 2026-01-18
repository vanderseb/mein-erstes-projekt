// server/utils/emailTemplates.ts
// E-Mail-Templates im Dr. Evil Design mit Inline-CSS

// Design-Konstanten
const COLORS = {
    dark: '#223E54',
    mid: '#5A7E8E',
    light: '#A8DADC',
    red: '#DB162F',
    white: '#ffffff',
    darkBg: '#1a3245'
};

// Basis-Layout für alle E-Mails
const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dr. Evil & Söhne</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.dark}; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: ${COLORS.darkBg}; border-radius: 8px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px 40px; border-bottom: 2px solid ${COLORS.red};">
                            <h1 style="margin: 0; color: ${COLORS.red}; font-size: 24px; font-weight: bold; letter-spacing: -0.5px;">
                                Dr. Evil & Söhne GmbH
                            </h1>
                            <p style="margin: 5px 0 0 0; color: ${COLORS.mid}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                                Tradition trifft Tyrannei seit 1965
                            </p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            ${content}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; background-color: ${COLORS.dark}; border-top: 1px solid ${COLORS.mid};">
                            <p style="margin: 0; color: ${COLORS.mid}; font-size: 11px; text-align: center;">
                                Diese Nachricht wurde automatisch generiert.<br>
                                Antworten auf diese E-Mail werden nicht gelesen – wir haben Wichtigeres zu tun.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

// Button-Komponente
const buttonHtml = (text: string, url: string) => `
<table role="presentation" style="margin: 30px 0; width: 100%;">
    <tr>
        <td align="center">
            <a href="${url}" style="display: inline-block; padding: 16px 32px; background-color: ${COLORS.red}; color: ${COLORS.white}; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                ${text}
            </a>
        </td>
    </tr>
</table>
<p style="margin: 0; color: ${COLORS.mid}; font-size: 11px; text-align: center;">
    Dieser Zugang ist nur 60 Minuten gültig.
</p>
`;

// Position-Zeile für Templates
const positionLine = (jobTitle: string) => `
        <p style="margin: 0 0 25px 0; color: ${COLORS.light}; font-size: 14px; line-height: 1.6; padding: 12px 16px; background-color: ${COLORS.dark}; border-left: 3px solid ${COLORS.red}; border-radius: 0 4px 4px 0;">
            <span style="color: ${COLORS.mid};">Position:</span><br>
            <strong>${jobTitle}</strong>
        </p>
`;

// ============================================================
// TEMPLATE 1: Bewerbung eingereicht
// ============================================================
interface ApplicationSubmittedParams {
    firstName: string;
    jobTitle: string;
    magicLink: string;
}

export const applicationSubmittedTemplate = ({ firstName, jobTitle, magicLink }: ApplicationSubmittedParams): string => {
    const content = `
        <h2 style="margin: 0 0 20px 0; color: ${COLORS.light}; font-size: 28px; font-weight: bold;">
            Akte angelegt.
        </h2>
        <p style="margin: 0 0 15px 0; color: ${COLORS.light}; font-size: 16px; line-height: 1.6;">
            ${firstName},
        </p>
        <p style="margin: 0 0 15px 0; color: ${COLORS.light}; font-size: 16px; line-height: 1.6;">
            Deine Bewerbung wurde in unserem System erfasst. Ein Aktenzeichen wurde vergeben.
            Die zuständigen Stellen wurden informiert.
        </p>
        ${positionLine(jobTitle)}
        <p style="margin: 0 0 25px 0; color: ${COLORS.mid}; font-size: 14px; line-height: 1.6;">
            Wir melden uns – wenn wir es für nötig halten.
        </p>
        ${buttonHtml('Zum Bewerber-Portal', magicLink)}
    `;
    return baseTemplate(content);
};

// ============================================================
// TEMPLATE 2: Status "In Bearbeitung"
// ============================================================
interface StatusInProgressParams {
    firstName: string;
    jobTitle: string;
    magicLink: string;
}

export const statusInProgressTemplate = ({ firstName, jobTitle, magicLink }: StatusInProgressParams): string => {
    const content = `
        <h2 style="margin: 0 0 20px 0; color: ${COLORS.light}; font-size: 28px; font-weight: bold;">
            Die Akten liegen auf dem Tisch.
        </h2>
        <p style="margin: 0 0 15px 0; color: ${COLORS.light}; font-size: 16px; line-height: 1.6;">
            ${firstName},
        </p>
        <p style="margin: 0 0 15px 0; color: ${COLORS.light}; font-size: 16px; line-height: 1.6;">
            Deine Unterlagen werden derzeit von unseren Spezialisten geprüft. 
            Hintergrundchecks laufen. Referenzen werden ausspioniert.
        </p>
        ${positionLine(jobTitle)}
        <p style="margin: 0 0 25px 0; color: ${COLORS.mid}; font-size: 14px; line-height: 1.6;">
            Bleib erreichbar. Wir beobachten dich.
        </p>
        ${buttonHtml('Zum Bewerber-Portal', magicLink)}
    `;
    return baseTemplate(content);
};

// ============================================================
// TEMPLATE 3: Status "Angenommen"
// ============================================================
interface StatusAcceptedParams {
    firstName: string;
    jobTitle: string;
    magicLink: string;
}

export const statusAcceptedTemplate = ({ firstName, jobTitle, magicLink }: StatusAcceptedParams): string => {
    const content = `
        <h2 style="margin: 0 0 20px 0; color: ${COLORS.red}; font-size: 28px; font-weight: bold;">
            Willkommen im inneren Zirkel.
        </h2>
        <p style="margin: 0 0 15px 0; color: ${COLORS.light}; font-size: 16px; line-height: 1.6;">
            ${firstName},
        </p>
        <p style="margin: 0 0 15px 0; color: ${COLORS.light}; font-size: 16px; line-height: 1.6;">
            Du hast bewiesen, dass du das gewisse Etwas hast. Die Prüfung ist bestanden.
            Du bist jetzt Teil von etwas Größerem.
        </p>
        ${positionLine(jobTitle)}
        <p style="margin: 0 0 15px 0; color: ${COLORS.light}; font-size: 16px; line-height: 1.6;">
            Unser HR-Team wird sich in Kürze mit den Details melden.
            Bereite dich vor.
        </p>
        <p style="margin: 0 0 25px 0; color: ${COLORS.mid}; font-size: 14px; line-height: 1.6;">
            Loyalität wird belohnt. Verrat weniger.
        </p>
        ${buttonHtml('Zum Bewerber-Portal', magicLink)}
    `;
    return baseTemplate(content);
};

// ============================================================
// TEMPLATE 4: Status "Abgelehnt"
// ============================================================
interface StatusRejectedParams {
    firstName: string;
    jobTitle: string;
    magicLink: string;
}

export const statusRejectedTemplate = ({ firstName, jobTitle, magicLink }: StatusRejectedParams): string => {
    const content = `
        <h2 style="margin: 0 0 20px 0; color: ${COLORS.mid}; font-size: 28px; font-weight: bold;">
            Aussortiert.
        </h2>
        <p style="margin: 0 0 15px 0; color: ${COLORS.light}; font-size: 16px; line-height: 1.6;">
            ${firstName},
        </p>
        <p style="margin: 0 0 15px 0; color: ${COLORS.light}; font-size: 16px; line-height: 1.6;">
            Nach eingehender Prüfung haben wir entschieden: nicht diesmal.
        </p>
        ${positionLine(jobTitle)}
        <p style="margin: 0 0 25px 0; color: ${COLORS.mid}; font-size: 14px; line-height: 1.6;">
            Nimm es nicht persönlich. Wir haben hohe Standards.
        </p>
        ${buttonHtml('Zum Bewerber-Portal', magicLink)}
    `;
    return baseTemplate(content);
};

// ============================================================
// TEMPLATE 5: Status "Gelöscht" (DSGVO-Parodie)
// ============================================================
interface StatusDeletedParams {
    firstName: string;
    jobTitle: string;
}

export const statusDeletedTemplate = ({ firstName, jobTitle }: StatusDeletedParams): string => {
    const content = `
        <h2 style="margin: 0 0 20px 0; color: ${COLORS.red}; font-size: 28px; font-weight: bold;">
            Restlose Vernichtung.
        </h2>
        <p style="margin: 0 0 15px 0; color: ${COLORS.light}; font-size: 16px; line-height: 1.6;">
            ${firstName},
        </p>
        <p style="margin: 0 0 15px 0; color: ${COLORS.light}; font-size: 16px; line-height: 1.6;">
            Gemäß der Datenschutz-Grundverordnung (DSGVO) – und unserer eigenen Paranoia – 
            wurden sämtliche Daten zu deiner Bewerbung unwiderruflich vernichtet.
        </p>
        ${positionLine(jobTitle)}
        <p style="margin: 0 0 15px 0; color: ${COLORS.light}; font-size: 16px; line-height: 1.6;">
            Deine Akte wurde geschreddert, verbrannt und die Asche in einem 
            unmarkierten Vulkan verstreut. Alle Backups wurden gelöscht. 
            Alle Mitarbeiter, die deine Daten gesehen haben, wurden... 
            umgeschult.
        </p>
        <p style="margin: 0 0 25px 0; color: ${COLORS.mid}; font-size: 14px; line-height: 1.6;">
            Es ist, als hättest du nie existiert.<br>
            Zumindest in unseren Systemen.
        </p>
        <p style="margin: 0; color: ${COLORS.mid}; font-size: 12px; text-align: center; padding-top: 20px; border-top: 1px solid ${COLORS.mid};">
            Art. 17 DSGVO – Recht auf Löschung ("Recht auf Vergessenwerden")<br>
            Erfolgreich ausgeführt. Keine weiteren Aktionen erforderlich.
        </p>
    `;
    return baseTemplate(content);
};

// ============================================================
// TEMPLATE 6: Magic Link anfordern (für login-expired)
// ============================================================
interface MagicLinkRequestedParams {
    firstName: string;
    magicLink: string;
}

export const magicLinkRequestedTemplate = ({ firstName, magicLink }: MagicLinkRequestedParams): string => {
    const content = `
        <h2 style="margin: 0 0 20px 0; color: ${COLORS.light}; font-size: 28px; font-weight: bold;">
            Neues Portal-Ticket.
        </h2>
        <p style="margin: 0 0 15px 0; color: ${COLORS.light}; font-size: 16px; line-height: 1.6;">
            ${firstName},
        </p>
        <p style="margin: 0 0 15px 0; color: ${COLORS.light}; font-size: 16px; line-height: 1.6;">
            Du hast einen neuen Zugang zu deinem Bewerber-Portal angefordert.
            Hier ist dein temporärer Schlüssel.
        </p>
        <p style="margin: 0 0 25px 0; color: ${COLORS.mid}; font-size: 14px; line-height: 1.6;">
            Dieses Ticket verfällt in 60 Minuten. Danach musst du ein neues anfordern.
        </p>
        ${buttonHtml('Zum Bewerber-Portal', magicLink)}
    `;
    return baseTemplate(content);
};
