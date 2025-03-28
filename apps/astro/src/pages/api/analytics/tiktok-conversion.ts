export const prerender = false

import type { APIRoute } from 'astro'
import sanityFetch from '@utils/sanity.fetch';
import { hash } from '@utils/hash'
import { getCookie } from '@utils/get-cookie'

export type Props = {
  event_name: string;
  url: string;
  event_id: string;
  event_time: number;
  email?: string;
  phone?: string;
}

const { tiktok_pixel_id, tiktok_conversion_token } = await sanityFetch<{
  tiktok_pixel_id: string;
  tiktok_conversion_token: string;
}>({
  query: `*[_type == "global"][0].analytics {
    tiktok_pixel_id,
    tiktok_conversion_token
  }`,
})

export const POST: APIRoute = async ({ request }) => {
  if (!tiktok_pixel_id || !tiktok_conversion_token) {
    return new Response(JSON.stringify({
      success: false,
      message: 'TikTok Pixel ID or/and conversion token not configured'
    }), { status: 400 })
  }

  const {
    event_name,
    url,
    event_id,
    event_time,
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
    const referer = request.headers.get('referer') || ''

    const refererUrl = new URL(referer);
    const refererParams = refererUrl.searchParams;
    const ttclid = refererParams.get('ttclid') || getCookie('ttclid', request.headers.get('cookie') || '');
    const ttp = getCookie('_ttp', request.headers.get('cookie') || '');

    const advanced_matching_consent = cookie_consent.advanced_matching || 'denied'

    type UserDataKey = 'ip' | 'user_agent' | 'email' | 'phone' | 'ttclid' | 'ttp';
    const userData: Partial<Record<UserDataKey, string>> = {
      ip: client_ip_address || '',
      user_agent: client_user_agent || ''
    }

    if (advanced_matching_consent === 'granted') {
      if (email) userData.email = await hash(email)
      if (phone) userData.phone = await hash(phone)
      if (ttclid) userData.ttclid = ttclid
      if (ttp) userData.ttp = ttp
    }

    const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': tiktok_conversion_token,
      },
      body: JSON.stringify({
        event_source: 'web',
        event_source_id: tiktok_pixel_id,
        data: [
          {
            event: event_name,
            event_time: event_time,
            event_id: event_id,
            user: userData,
            page: {
              url: url,
              referrer: referer
            }
          }
        ],
      }),
    })

    if (!response.ok) {
      return new Response(JSON.stringify({
        success: false,
        message: 'TikTok API error occurred'
      }), { status: response.status })
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Event sent to TikTok'
    }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error processing conversion event'
    }), { status: 500 })
  }
}
