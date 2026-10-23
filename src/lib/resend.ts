import type { ContactMessage, SendMessage } from './contact';

export const CONTACT_TO = 'hello@brycecampbell.com';
export const CONTACT_FROM = 'Workbench <contact@brycecampbell.com>';
const RESEND_URL = 'https://api.resend.com/emails';
const TIMEOUT_MS = 10_000;

/** Plain text only, so nothing a visitor types is ever rendered as HTML. */
export function contactEmail(message: ContactMessage) {
  return {
    from: CONTACT_FROM,
    to: [CONTACT_TO],
    reply_to: message.email,
    subject: `Contact: ${message.name.replace(/\s+/g, ' ')}`,
    text: [`Name: ${message.name}`, `Email: ${message.email}`, '', message.message].join('\n'),
  };
}

export function resendSender(apiKey: string, fetchFn: typeof fetch = fetch): SendMessage {
  return async (message) => {
    const res = await fetchFn(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(contactEmail(message)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`Resend returned ${res.status}: ${await res.text()}`);
  };
}
