import type { APIRoute } from 'astro';
import { RESEND_API_KEY } from 'astro:env/server';
import { handleContact } from '../../lib/contact';
import { resendSender } from '../../lib/resend';

export const prerender = false;

const missingKey = async () => {
  throw new Error('RESEND_API_KEY unset');
};

export const POST: APIRoute = ({ request }) =>
  handleContact(request, RESEND_API_KEY ? resendSender(RESEND_API_KEY) : missingKey);
