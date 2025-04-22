export const prerender = false

import { REGEX } from "@global/constants";
import { htmlToString } from "@utils/html-to-string";
import { confirmationEmailTemplate, confirmationEmailText } from "../../emails/confirmation-email";
import type { APIRoute } from "astro";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;

const template = ({ contactType, contactValue, message, fullname, city, clientType, nip }: { contactType: string, contactValue: string, message: string, fullname?: string, city?: string, clientType: string, nip?: string }) => `
  <p>${contactType === 'email' ? 'Adres email' : 'Numer telefonu'}: <b>${contactValue}</b></p>
  <p>Imię i nazwisko: <b>${fullname || 'Nie podano'}</b></p>
  <p>Miasto: <b>${city || 'Nie podano'}</b></p>
  <p>Typ klienta: <b>${clientType === 'individual' ? 'Klient indywidualny' : 'Klient biznesowy'}</b></p>
  ${clientType === 'business' && nip ? `<p>NIP: <b>${nip}</b></p>` : ''}
  <br />
  <p>${message.trim().replace(/\n/g, '<br />')}</p>
`;

type Props = {
  contactType: 'email' | 'phone'
  contactValue: string
  message: string
  legal: boolean
  fullname?: string
  city?: string
  clientType: 'individual' | 'business'
  nip?: string
}

/**
 * Sends a confirmation email to the user who submitted the contact form
 */
async function sendConfirmationEmail(email: string): Promise<boolean> {
  try {
    const html = confirmationEmailTemplate();
    const text = confirmationEmailText();

    const res = await fetch(`https://api.resend.com/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Stark House <potwierdzenie@send.starkhouse.pl>',
        to: email,
        subject: 'Stark House – oferta carportów i platforma dla partnerów',
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

export const POST: APIRoute = async ({ request }) => {
  try {
    const { contactType, contactValue, message, legal, fullname, city, clientType, nip } = await request.json() as Props

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

    // Send the form data to admin email
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
        html: template({ contactType, contactValue, message, fullname, city, clientType, nip }),
        text: htmlToString(template({ contactType, contactValue, message, fullname, city, clientType, nip })),
      }),
    });

    if (res.status !== 200) {
      return new Response(JSON.stringify({ message: "Something went wrong", success: false }), { status: 400 })
    }

    // If the user provided an email, send a confirmation email to them
    if (contactType === 'email') {
      // We send the confirmation email but don't wait for it to complete
      // This way the form submission is not delayed by the confirmation email
      sendConfirmationEmail(contactValue).catch(error => {
        console.error('Failed to send confirmation email:', error);
      });
    }

    return new Response(JSON.stringify({ message: "Successfully sent message", success: true }), { status: 200 })
  } catch (error) {
    console.error('Error in contact form submission:', error);
    return new Response(JSON.stringify({ message: "An error occurred while sending message", success: false }), { status: 400 })
  }
};
