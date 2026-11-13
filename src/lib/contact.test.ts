import { describe, expect, it, vi } from 'vitest';
import { CONTACT_LIMITS, HONEYPOT_FIELD, MAX_BODY_BYTES, handleContact, type ContactMessage } from './contact';

const valid = { name: 'Ada', email: 'ada@example.com', message: 'Nice keyboard.' };
const quiet = { warn: () => {}, error: () => {} };

function post(fields: Record<string, string>): Request {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return new Request('https://brycecampbell.com/api/contact', { method: 'POST', body: form });
}

async function submit(fields: Record<string, string>, send = vi.fn(async () => {})) {
  const res = await handleContact(post(fields), send, quiet);
  return { status: res.status, body: await res.json(), send };
}

describe('handleContact', () => {
  it('sends a valid message, trimmed', async () => {
    const { status, body, send } = await submit({ ...valid, name: '  Ada  ' });
    expect(status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(send).toHaveBeenCalledWith<[ContactMessage]>(valid);
  });

  it('returns field errors and sends nothing for bad input', async () => {
    const { status, body, send } = await submit({
      name: ' ',
      email: 'not-an-email',
      message: 'x'.repeat(CONTACT_LIMITS.message + 1),
    });
    expect(status).toBe(400);
    expect(body).toEqual({
      ok: false,
      errors: { name: 'required', email: 'invalid_email', message: 'too_long' },
    });
    expect(send).not.toHaveBeenCalled();
  });

  it('treats missing fields as required', async () => {
    const { body } = await submit({});
    expect(body).toEqual({
      ok: false,
      errors: { name: 'required', email: 'required', message: 'required' },
    });
  });

  it('drops a filled honeypot silently, reporting success', async () => {
    const { status, body, send } = await submit({ ...valid, [HONEYPOT_FIELD]: 'https://spam.example' });
    expect(status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it('reports a server error when sending fails, so the visitor knows to email instead', async () => {
    const { status, body } = await submit(valid, vi.fn(async () => Promise.reject(new Error('down'))));
    expect(status).toBe(500);
    expect(body).toEqual({ ok: false, error: 'server' });
  });

  it('rejects a body over the cap even when Content-Length understates it', async () => {
    const send = vi.fn(async () => {});
    const big = new Request('https://brycecampbell.com/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', 'content-length': '10' },
      body: 'message=' + 'x'.repeat(MAX_BODY_BYTES),
    });
    const res = await handleContact(big, send, quiet);
    expect(res.status).toBe(413);
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects a body that is not form data', async () => {
    const res = await handleContact(
      new Request('https://brycecampbell.com/api/contact', { method: 'POST', body: '{"name":"Ada"}' }),
      vi.fn(async () => {}),
      quiet,
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: 'bad_request' });
  });
});
