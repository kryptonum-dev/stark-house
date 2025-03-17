export const prerender = false

import type { APIRoute } from 'astro'
import { hash } from '@utils/hash'
import sanityFetch from '@utils/sanity.fetch';
import type { TrackEventProps } from './track-event';

const { metaPixelId, metaConversionToken } = await sanityFetch<{
  metaPixelId: string;
  metaConversionToken: string;
}>({
  query: `*[_type == "global"][0].analytics {
    metaPixelId,
    metaConversionToken
  }`,
})


export const POST: APIRoute = async ({ request }) => {
  try {
    const {
      event_name,
      content_name,
      url,
      event_id,
      event_time,
      name,
      email,
      phone,
    } = (await request.json()) as TrackEventProps

    const getCookie = (name: string) => {
      const cookie = request.headers.get('cookie')?.split(';').find(cookie => cookie.trim().split('=')[0] === name);
      return cookie ? cookie.trim().split('=')[1] : '';
    };

    if (!metaConversionToken) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Analytics credentials not found',
      }), { status: 400 })
    }

    const cookieConsent = JSON.parse(decodeURIComponent(getCookie('cookie-consent')))
    if (!cookieConsent) {
      return new Response(JSON.stringify({
        success: false,
        message: 'No cookie consent found',
      }), { status: 400 })
    }

    if (cookieConsent.conversion_api !== 'granted') {
      return new Response(JSON.stringify({
        success: false,
        message: 'Conversion API consent not granted',
      }), { status: 400 })
    }

    const client_ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const client_user_agent = request.headers.get('user-agent')
    const referer = request.headers.get('referer')

    const fbc = getCookie('_fbc')
    const fbp = getCookie('_fbp')

    const userData_prepared: Record<'client_ip_address' | 'client_user_agent' | 'em' | 'fn' | 'ph' | 'fbc' | 'fbp', string | null> = {
      client_ip_address: client_ip_address,
      client_user_agent: client_user_agent,
      em: null,
      fn: null,
      ph: null,
      fbc: null,
      fbp: null,
    }

    const advancedMatchingConsent = cookieConsent.advanced_matching || 'denied'
    if (advancedMatchingConsent === 'granted') {
      if (email) userData_prepared.em = await hash(email)
      if (name) userData_prepared.fn = await hash(name)
      if (phone) userData_prepared.ph = await hash(phone)
      if (fbc) userData_prepared.fbc = fbc
      if (fbp) userData_prepared.fbp = fbp
    }

    const response = await fetch(`https://graph.facebook.com/v21.0/${metaPixelId}/events?access_token=${metaConversionToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          {
            event_name: event_name,
            content_name: content_name,
            event_source_url: url,
            event_id,
            event_time,
            action_source: 'website',
            referrer_url: referer,
            user_data: {
              ...userData_prepared,
            },
            custom_data: {
              advanced_matching_consent: advancedMatchingConsent,
            },
          },
        ],
      }),
    })

    if (!response.ok) {
      return new Response(JSON.stringify({
        success: false,
        message: `Failed to send conversion event to Meta (Status: ${response.status})`,
      }), { status: response.status })
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Successfully sent conversion event to Meta',
    }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Error processing conversion event',
    }), { status: 500 })
  }
}
