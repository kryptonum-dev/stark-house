export const prerender = false

import { REGEX } from "@global/constants";
import { htmlToString } from "@utils/html-to-string";
import type { APIRoute } from "astro";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;

const template = ({ contactType, contactValue, message }: { contactType: string, contactValue: string, message: string }) => `
  <p>${contactType === 'email' ? 'Adres email' : 'Numer telefonu'}: <b>${contactValue}</b></p>
  <br />
  <p>${message.trim().replace(/\n/g, '<br />')}</p>
`;

type Props = {
  contactType: 'email' | 'phone'
  contactValue: string
  message: string
  legal: boolean
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { contactType, contactValue, message, legal } = await request.json() as Props

    // Validate based on contact type
    const isValidContact = contactType === 'email'
      ? REGEX.email.test(contactValue)
      : REGEX.phone.test(contactValue);

    if (!isValidContact || !message || !legal) {
      return new Response(JSON.stringify({
        message: "Missing or invalid required fields",
        success: false
      }), { status: 400 })
    }

    const res = await fetch(`https://api.resend.com/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Stark House Formularz <formularz@send.starkhouse.pl>',
        to: 'biuro@starkhouse.pl',
        reply_to: contactType === 'email' ? contactValue : undefined,
        subject: `Wiadomość z formularza kontaktowego ${contactType === 'email' ? 'wysłana przez ' + contactValue : 'z numerem ' + contactValue}`,
        html: template({ contactType, contactValue, message }),
        text: htmlToString(template({ contactType, contactValue, message })),
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
