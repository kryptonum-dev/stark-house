export const prerender = false

import type { APIRoute } from 'astro'
import sanityFetch from '@utils/sanity.fetch';
import { hash } from '@utils/hash'
import { getFirstName, getLastName } from '@utils/name-parser'
import { getCookie } from '@utils/get-cookie';

export type Props = {
  direct_api_conversion_id: number;
  event_time: number;
  event_id: string;
  name?: string;
  email?: string;
}

const { linkedin_conversion_token } = await sanityFetch<{
  linkedin_conversion_token: string;
}>({
  query: `*[_type == "global"][0].analytics {
    linkedin_conversion_token
  }`,
})

export const POST: APIRoute = async ({ request }) => {
  if (!linkedin_conversion_token) {
    return new Response(JSON.stringify({
      success: false,
      message: 'LinkedIn conversion API token not configured'
    }), { status: 400 })
  }

  const {
    direct_api_conversion_id,
    event_time,
    event_id,
    name,
    email,
  } = (await request.json()) as Props

  if (!direct_api_conversion_id) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Missing required parameter: direct_api_conversion_id'
    }), { status: 400 })
  }

  const cookie_consent = JSON.parse(getCookie('cookie-consent', request.headers.get('cookie') || '') || '{}');
  if (cookie_consent.conversion_api !== 'granted') {
    return new Response(JSON.stringify({
      success: false,
      message: 'User has not granted consent for conversion tracking'
    }), { status: 403 })
  }

  try {
    const li_fat_id = getCookie('li_fat_id')
    const advanced_matching_consent = cookie_consent.advanced_matching || 'denied'

    const response = await fetch('https://api.linkedin.com/rest/conversionEvents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'LinkedIn-Version': '202503',
        'X-Restli-Protocol-Version': '2.0.0',
        'Authorization': `Bearer ${linkedin_conversion_token}`,
      },
      body: JSON.stringify({
        conversion: `urn:lla:llaPartnerConversion:${direct_api_conversion_id}`,
        conversionHappenedAt: event_time,
        user: {
          userIds: [
            ...(advanced_matching_consent === 'granted' && email ? [{
              idType: 'SHA256_EMAIL',
              idValue: await hash(email),
            }] : []),
            ...(li_fat_id ? [{
              idType: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID',
              idValue: li_fat_id,
            }] : []),
          ],
          ...(advanced_matching_consent === 'granted' && name ? {
            userInfo: {
              firstName: getFirstName(name),
              lastName: getLastName(name)
            }
          } : {})
        },
        eventId: event_id,
      }),
    })

    if (!response.ok) {
      return new Response(JSON.stringify({
        success: false,
        message: 'LinkedIn API error occurred'
      }), { status: response.status })
    }
    return new Response(JSON.stringify({
      success: true,
      message: 'Conversion event tracked successfully'
    }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal server error processing conversion event'
    }), { status: 500 })
  }
}
