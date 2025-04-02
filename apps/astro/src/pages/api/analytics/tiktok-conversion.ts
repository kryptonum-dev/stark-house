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
    const client_ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
    const client_user_agent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''

    const refererUrl = new URL(referer);
    const refererParams = refererUrl.searchParams;
    const ttclid = refererParams.get('ttclid') || getCookie('ttclid', request.headers);
    const ttp = getCookie('_ttp', request.headers);

    const advanced_matching_consent = cookie_consent.advanced_matching || 'denied'

    type UserDataKey = 'ip' | 'user_agent' | 'email' | 'phone' | 'ttclid' | 'ttp';
    const user_data: Partial<Record<UserDataKey, string>> = {
      ip: client_ip_address || '',
      user_agent: client_user_agent || ''
    }

    if (advanced_matching_consent === 'granted') {
      if (email) user_data.email = await hash(email)
      if (phone) user_data.phone = await hash(phone)
      if (ttclid) user_data.ttclid = ttclid
      if (ttp) user_data.ttp = ttp
    }

    const payload = {
      event_source: 'web',
      event_source_id: tiktok_pixel_id,
      data: [
        {
          event: event_name,
          event_time,
          event_id,
          user: user_data,
          page: {
            url,
            referrer: referer
          }
        }
      ],
    }

    console.log('[TikTok Conversion API] Sending payload:', JSON.stringify(payload, null, 2))

    const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': tiktok_conversion_token,
      },
      body: JSON.stringify(payload),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('[TikTok Conversion API] Error response:', JSON.stringify(responseData, null, 2))
      return new Response(JSON.stringify({
        success: false,
        message: 'TikTok API error occurred'
      }), { status: response.status })
    }

    console.log('[TikTok Conversion API] Success response:', JSON.stringify(responseData, null, 2))
    return new Response(JSON.stringify({
      success: true,
      message: 'Event sent to TikTok'
    }), { status: 200 })
  } catch (error) {
    console.error('[TikTok Conversion API] Server error:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Server error processing conversion event'
    }), { status: 500 })
  }
}
