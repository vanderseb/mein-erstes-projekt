// server/utils/sendEmail.ts
// E-Mail-Versand via Resend API

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

interface SendEmailResult {
    success: boolean;
    id?: string;
    error?: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<SendEmailResult> {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.EMAIL_FROM || 'Dr. Evil & Söhne <noreply@example.com>';

    if (!apiKey) {
        console.error('RESEND_API_KEY nicht konfiguriert');
        return { success: false, error: 'E-Mail-Service nicht konfiguriert' };
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: fromEmail,
                to: [to],
                subject: subject,
                html: html
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Resend API Fehler:', data);
            return {
                success: false,
                error: data.message || `HTTP ${response.status}`
            };
        }

        console.log(`E-Mail gesendet an ${to}: ${data.id}`);
        return { success: true, id: data.id };

    } catch (error: any) {
        console.error('E-Mail-Versand fehlgeschlagen:', error);
        return {
            success: false,
            error: error.message || 'Unbekannter Fehler'
        };
    }
}
