export const prerender = false

import { REGEX } from "@/src/global/constants";
import { htmlToString } from "@/src/utils/html-to-string";
import type { APIRoute } from "astro";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;

const template = ({ email, phone, message }: { email: string, phone?: string, message: string }) => `
  <p>Adres email: <b>${email}</b></p>
  <p>Telefon: <b>${phone || 'Nie podano'}</b></p>
  <br />
  <p>${message.trim().replace(/\n/g, '<br />')}</p>
`;

type Props = {
  email: string
  phone?: string
  message: string
  legal: boolean
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, phone, message, legal } = await request.json() as Props
    if (!REGEX.email.test(email) || (phone && !REGEX.phone.test(phone)) || !message || !legal) {
      return new Response(JSON.stringify({ message: "Missing required fields", success: false }), { status: 400 })
    }
    const res = await fetch(`https://api.resend.com/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Stark House Formularz <formularz@send.starkhouse.pl>',
        to: 'bogumil@kryptonum.eu',
        reply_to: email,
        subject: `Wiadomość z formularza kontaktowego wysłana przez ${email}`,
        html: template({ email, phone, message }),
        text: htmlToString(template({ email, phone, message })),
      }),
    });
    if (res.status !== 200) {
      return new Response(JSON.stringify({ message: "Something went wrong", success: false }), { status: 400 })
    }
    return new Response(JSON.stringify({ message: "Successfully sent message", success: true }), { status: 200 })
  } catch {
    return new Response(JSON.stringify({ message: "An error occurred while sending message", success: false }), { status: 400 })
  }
};
