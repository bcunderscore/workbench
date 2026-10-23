export const CONTACT_LIMITS = { name: 200, email: 320, message: 5000 } as const;

/** Every field at its cap, four UTF-8 bytes per character, still fits with room for multipart framing. */
export const MAX_BODY_BYTES = 64 * 1024;

/** Hidden from people, so only bots fill it in. */
export const HONEYPOT_FIELD = 'website';

export type ContactField = keyof typeof CONTACT_LIMITS;
export type ContactMessage = Record<ContactField, string>;
export type FieldError = 'required' | 'too_long' | 'invalid_email';
export type FieldErrors = Partial<Record<ContactField, FieldError>>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; errors: FieldErrors }
  | { ok: false; error: 'too_large' | 'bad_request' | 'server' };

export type SendMessage = (message: ContactMessage) => Promise<void>;

const FIELDS = Object.keys(CONTACT_LIMITS) as ContactField[];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(
  raw: ContactMessage,
): { ok: true; value: ContactMessage } | { ok: false; errors: FieldErrors } {
  const value = Object.fromEntries(FIELDS.map((f) => [f, raw[f].trim()])) as ContactMessage;
  const errors: FieldErrors = {};
  for (const field of FIELDS) {
    if (value[field].length === 0) errors[field] = 'required';
    else if (value[field].length > CONTACT_LIMITS[field]) errors[field] = 'too_long';
  }
  if (!errors.email && !EMAIL.test(value.email)) errors.email = 'invalid_email';
  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, value };
}

const text = (form: FormData, key: string): string => {
  const value = form.get(key);
  return typeof value === 'string' ? value : '';
};

export function readContactForm(form: FormData): { raw: ContactMessage; honeypot: boolean } {
  return {
    raw: Object.fromEntries(FIELDS.map((f) => [f, text(form, f)])) as ContactMessage,
    honeypot: text(form, HONEYPOT_FIELD).trim() !== '',
  };
}

/** The body's bytes, or `null` once more than `MAX_BODY_BYTES` arrive, whatever `Content-Length` claimed. */
async function readCappedBody(request: Request): Promise<Uint8Array<ArrayBuffer> | null> {
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const chunk = await reader?.read();
    if (!chunk || chunk.done) break;
    size += chunk.value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader?.cancel();
      return null;
    }
    chunks.push(chunk.value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

const respond = (status: number, body: ContactResponse) => Response.json(body, { status });

export async function handleContact(
  request: Request,
  send: SendMessage,
  log: Pick<Console, 'warn' | 'error'> = console,
): Promise<Response> {
  if (Number(request.headers.get('content-length') ?? '0') > MAX_BODY_BYTES)
    return respond(413, { ok: false, error: 'too_large' });

  let form: FormData;
  try {
    const body = await readCappedBody(request);
    if (!body) return respond(413, { ok: false, error: 'too_large' });
    const contentType = request.headers.get('content-type');
    form = await new Response(body, {
      headers: contentType ? { 'content-type': contentType } : {},
    }).formData();
  } catch {
    return respond(400, { ok: false, error: 'bad_request' });
  }

  const { raw, honeypot } = readContactForm(form);
  if (honeypot) {
    log.warn('[contact] honeypot filled; discarded');
    return respond(200, { ok: true });
  }

  const result = validateContact(raw);
  if (!result.ok) return respond(400, { ok: false, errors: result.errors });

  try {
    await send(result.value);
  } catch (err) {
    log.error('[contact] send failed:', err);
    return respond(500, { ok: false, error: 'server' });
  }
  return respond(200, { ok: true });
}
