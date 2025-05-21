export const prerender = false

import { REGEX } from "@global/constants";
import { htmlToString } from "@utils/html-to-string";
import { confirmationEmailTemplate, confirmationEmailText } from "../../emails/confirmation-email";
import type { APIRoute } from "astro";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;

const template = ({ phone, email, message, fullname, city, clientType, nip, parkingSpaces }: { phone: string, email?: string, message: string, fullname?: string, city?: string, clientType: string, nip?: string, parkingSpaces: string }) => `
  <p>Numer telefonu: <b>${phone}</b></p>
  <p>Adres email: <b>${email || 'Nie podano'}</b></p>
  <p>Imię i nazwisko: <b>${fullname || 'Nie podano'}</b></p>
  <p>Miasto: <b>${city || 'Nie podano'}</b></p>
  <p>Typ klienta: <b>${clientType === 'individual' ? 'Klient indywidualny' : 'Klient biznesowy'}</b></p>
  ${clientType === 'business' && nip ? `<p>NIP: <b>${nip}</b></p>` : ''}
  <p>Liczba miejsc parkingowych: <b>${parkingSpaces === 'less10' ? '< 10' :
    parkingSpaces === '10to50' ? '10-50' :
      '50+'
  }</b></p>
  <br />
  <p>${message.trim().replace(/\n/g, '<br />')}</p>
`;

type Props = {
  phone: string
  email?: string
  message: string
  legal: boolean
  fullname?: string
  city?: string
  clientType: 'individual' | 'business'
  nip?: string
  parkingSpaces: 'less10' | '10to50' | 'more50'
}

/**
 * Sends a confirmation email to the user who submitted the contact form
 */
async function sendConfirmationEmail(email: string, clientType: 'individual' | 'business'): Promise<boolean> {
  try {
    const html = confirmationEmailTemplate(clientType);
    const text = confirmationEmailText(clientType);

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
    const { phone, email, message, legal, fullname, city, clientType, nip, parkingSpaces } = await request.json() as Props

    // Validate phone (required) and email (optional if provided)
    const isValidPhone = REGEX.phone.test(phone);
    const isValidEmail = !email || REGEX.email.test(email);

    if (!isValidPhone || !isValidEmail || !message || !legal || !parkingSpaces) {
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
        reply_to: email,
        subject: `Wiadomość z formularza kontaktowego ${email ? 'wysłana przez ' + email : 'z numerem ' + phone}`,
        html: template({ phone, email, message, fullname, city, clientType, nip, parkingSpaces }),
        text: htmlToString(template({ phone, email, message, fullname, city, clientType, nip, parkingSpaces })),
      }),
    });

    if (res.status !== 200) {
      return new Response(JSON.stringify({ message: "Something went wrong", success: false }), { status: 400 })
    }

    // If the user provided an email, send a confirmation email to them
    if (email) {
      // We send the confirmation email but don't wait for it to complete
      // This way the form submission is not delayed by the confirmation email
      sendConfirmationEmail(email, clientType).catch(error => {
        console.error('Failed to send confirmation email:', error);
      });
    }

    return new Response(JSON.stringify({ message: "Message sent successfully", success: true }), { status: 200 })
  } catch (error) {
    console.error('Error processing contact form submission:', error);
    return new Response(JSON.stringify({ message: "An error occurred while processing your request", success: false }), { status: 500 })
  }
};
