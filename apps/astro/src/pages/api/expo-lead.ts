export const prerender = false

import { REGEX } from "@global/constants";
import { htmlToString } from "@utils/html-to-string";
import { confirmationEmailTemplate, confirmationEmailText } from "../../emails/confirmation-email";
import type { APIRoute } from "astro";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
const MAILERLITE_API_KEY = import.meta.env.MAILERLITE_API_KEY || process.env.MAILERLITE_API_KEY;

type Props = {
  fullname: string
  phone: string
  email: string
  company: string
  position?: string
  legal: boolean
  group_id?: string
}

const adminTemplate = ({ fullname, phone, email, company, position }: { fullname: string, phone: string, email: string, company: string, position?: string }) => `
  <p>Imię i nazwisko: <b>${fullname}</b></p>
  <p>Numer telefonu: <b>${phone}</b></p>
  <p>Adres email: <b>${email}</b></p>
  <p>Nazwa firmy: <b>${company}</b></p>
  ${position ? `<p>Stanowisko: <b>${position}</b></p>` : ''}
`;

async function sendAdminEmail(data: Props): Promise<boolean> {
  try {
    const res = await fetch(`https://api.resend.com/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Stark House Formularz <formularz@send.starkhouse.pl>',
        to: 'biuro@starkhouse.pl',
        reply_to: data.email,
        subject: `Lead z LP Expo – ${data.fullname}`,
        html: adminTemplate(data),
        text: htmlToString(adminTemplate(data)),
      }),
    });
    return res.status === 200;
  } catch (error) {
    console.error('Error sending admin email:', error);
    return false;
  }
}

async function sendConfirmationEmail(email: string): Promise<boolean> {
  try {
    const html = confirmationEmailTemplate('business');
    const text = confirmationEmailText('business');

    const res = await fetch(`https://api.resend.com/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Stark House <potwierdzenie@send.starkhouse.pl>',
        to: email,
        subject: 'Stark House – katalog produktów',
        html,
        text,
        attachments: [
          {
            path: 'https://starkhouse.pl/StarkHouse-katalog-2025.pdf',
            filename: 'StarkHouse-katalog-2025.pdf',
          },
        ],
      }),
    });
    return res.status === 200;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
}

async function subscribeToMailerLite({ name, email, group_id }: { name: string, email: string, group_id: string }): Promise<boolean> {
  try {
    const res = await fetch(`https://api.mailerlite.com/api/v2/groups/${group_id}/subscribers`, {
      method: 'POST',
      headers: {
        'X-MailerLite-ApiKey': MAILERLITE_API_KEY as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        resubscribe: true,
      }),
    });
    return res.status === 200;
  } catch (error) {
    console.error('Error subscribing to MailerLite:', error);
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { fullname, phone, email, company, position, legal, group_id } = await request.json() as Props

    const isValidPhone = REGEX.phone.test(phone);
    const isValidEmail = REGEX.email.test(email);
    const isValidFullname = typeof fullname === 'string' && fullname.trim().length >= 3;
    const isValidCompany = typeof company === 'string' && company.trim().length >= 2;
    const isLegal = !!legal;

    if (!isValidPhone || !isValidEmail || !isValidFullname || !isValidCompany || !isLegal) {
      return new Response(JSON.stringify({ message: "Missing or invalid required fields", success: false }), { status: 400 })
    }

    const adminOk = await sendAdminEmail({ fullname, phone, email, company, position, legal, group_id });
    if (!adminOk) {
      return new Response(JSON.stringify({ message: "Something went wrong", success: false }), { status: 400 })
    }

    // Fire-and-forget confirmation and subscription
    sendConfirmationEmail(email).catch(err => console.error('Confirmation failed', err));
    if (group_id) {
      subscribeToMailerLite({ name: fullname, email, group_id }).catch(err => console.error('MailerLite failed', err));
    }

    return new Response(JSON.stringify({ message: "Lead sent successfully", success: true }), { status: 200 })
  } catch (error) {
    console.error('Error processing expo lead submission:', error);
    return new Response(JSON.stringify({ message: "An error occurred while processing your request", success: false }), { status: 500 })
  }
};


