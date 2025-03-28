export const prerender = false

import type { APIRoute } from 'astro'
import sanityFetch from '@utils/sanity.fetch';
import { hash } from '@utils/hash'
import { getCookie } from '@utils/get-cookie'
import { getFirstName } from '@utils/name-parser'

export type Props = {
  event_name: string;
  content_name: string;
  url: string;
  event_id: string;
  event_time: number;
  name?: string;
  email?: string;
  phone?: string;
}

const { meta_pixel_id, meta_conversion_token } = await sanityFetch<{
  meta_pixel_id: string;
  meta_conversion_token: string;
}>({
  query: `*[_type == "global"][0].analytics {
    meta_pixel_id,
    meta_conversion_token
  }`,
})

export const POST: APIRoute = async ({ request }) => {
  if (!meta_pixel_id || !meta_conversion_token) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Meta Pixel ID or/and conversion token not configured'
    }), { status: 400 })
  }

  const {
    event_name,
    content_name,
    url,
    event_id,
    event_time,
    name,
    email,
    phone,
  } = (await request.json()) as Props

  const cookie_consent = JSON.parse(getCookie('cookie-consent', request.headers) || '{}');
  if (cookie_consent.conversion_api !== 'granted') {
    return new Response(JSON.stringify({
      success: false,
      message: 'Conversion API tracking not permitted by user'
    }), { status: 403 })
  }

  try {
    const client_ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const client_user_agent = request.headers.get('user-agent')
    const referer = request.headers.get('referer')
    const fbc = getCookie('_fbc')
    const fbp = getCookie('_fbp')


    const user_data: Record<'client_ip_address' | 'client_user_agent' | 'em' | 'fn' | 'ph' | 'fbc' | 'fbp', string | null> = {
      client_ip_address: client_ip_address,
      client_user_agent: client_user_agent,
      em: null,
      fn: null,
      ph: null,
      fbc: null,
      fbp: null,
    }

    const advanced_matching_consent = cookie_consent.advanced_matching || 'denied'
    if (advanced_matching_consent === 'granted') {
      if (email) user_data.em = await hash(email)
      if (name) user_data.fn = await hash(getFirstName(name))
      if (phone) user_data.ph = await hash(phone)
      if (fbc) user_data.fbc = fbc
      if (fbp) user_data.fbp = fbp
    }

    const response = await fetch(`https://graph.facebook.com/v21.0/${meta_pixel_id}/events?access_token=${meta_conversion_token}`, {
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
              ...user_data,
            },
            custom_data: {
              advanced_matching_consent: advanced_matching_consent,
            },
          },
        ],
      }),
    })
    if (!response.ok) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Meta API error occurred'
      }), { status: response.status })
    }
    return new Response(JSON.stringify({
      success: true,
      message: 'Event sent to Meta'
    }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error processing conversion event'
    }), { status: 500 })
  }
}
