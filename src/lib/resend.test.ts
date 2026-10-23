import { describe, expect, it, vi } from 'vitest';
import { CONTACT_TO, resendSender } from './resend';

const message = { name: 'Ada\nLovelace', email: 'ada@example.com', message: '<b>hi</b>' };

describe('resendSender', () => {
  it('posts a plain-text email to hello@ that replies to the visitor', async () => {
    const fetchFn = vi.fn(async () => new Response('{"id":"1"}', { status: 200 }));
    await resendSender('re_test', fetchFn)(message);

    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    expect(new Headers(init.headers).get('authorization')).toBe('Bearer re_test');
    const email = JSON.parse(String(init.body));
    expect(email).toMatchObject({ to: [CONTACT_TO], reply_to: 'ada@example.com', subject: 'Contact: Ada Lovelace' });
    expect(email.html).toBeUndefined();
    expect(email.text).toContain('<b>hi</b>');
  });

  it('throws when Resend rejects the email', async () => {
    const fetchFn = vi.fn(async () => new Response('domain not verified', { status: 403 }));
    await expect(resendSender('re_test', fetchFn)(message)).rejects.toThrow('Resend returned 403: domain not verified');
  });
});
