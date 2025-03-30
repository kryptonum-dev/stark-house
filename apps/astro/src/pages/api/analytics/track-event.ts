import type { Props as MetaConversionProps } from './meta-conversion'
import type { Props as LinkedinConversionProps } from './linkedin-conversion'
import type { Props as TikTokConversionProps } from './tiktok-conversion'
import { hash } from '@utils/hash'

type Props = {
  user_data?: {
    email?: string;
    name?: string;
    phone?: string;
  };
  meta?: {
    event_name: string;
    content_name: string;
  };
  linkedin?: {
    pixel_conversion_id: number;
    direct_api_conversion_id: number;
  };
  tiktok?: {
    event_name: string;
  };
}

/**
 * Tracks analytics events for Meta, LinkedIn, and TikTok platforms
 *
 * This function handles both client-side tracking (via fbq/lintrk/ttq) and server-side
 * conversion API tracking for Meta, LinkedIn, and TikTok. It generates a unique event ID
 * and handles user data appropriately for each platform.
 *
 * @param {Object} params - The tracking parameters
 * @param {Object} [params.user_data] - Optional user data for personalized tracking
 * @param {string} [params.user_data.email] - User's email address
 * @param {string} [params.user_data.name] - User's name
 * @param {string} [params.user_data.phone] - User's phone number
 * @param {Object} [params.meta] - Meta (Facebook) tracking configuration
 * @param {string} params.meta.event_name - Name of the event to track in Meta
 * @param {string} params.meta.content_name - Name of the content associated with the event
 * @param {Object} [params.linkedin] - LinkedIn tracking configuration
 * @param {number} params.linkedin.pixel_conversion_id - LinkedIn pixel conversion ID
 * @param {number} params.linkedin.direct_api_conversion_id - LinkedIn API conversion ID
 * @param {Object} [params.tiktok] - TikTok tracking configuration
 * @param {string} params.tiktok.event_name - Name of the event to track in TikTok
 */
export async function trackEvent({
  user_data,
  meta,
  linkedin,
  tiktok,
}: Props) {
  const event_time = {
    milliseconds: Date.now(),
    seconds: Math.floor(Date.now() / 1000)
  }
  const event_id = `${event_time.milliseconds}${Math.random().toString(36).substring(2, 15)}`;
  const url = window.location.href

  if (meta) {
    try {
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', meta.event_name, {
          content_name: meta.content_name,
          ...(user_data?.email && { email: user_data.email }),
          ...(user_data?.name && { name: user_data.name }),
          ...(user_data?.phone && { phone: user_data.phone }),
        }, { eventID: event_id });
      }
    } catch {
      console.warn('Failed to track client-side fbq function')
    }
    try {
      const payload: MetaConversionProps = {
        event_name: meta.event_name,
        content_name: meta.content_name,
        url,
        event_id,
        event_time: event_time.seconds,
        name: user_data?.name,
        email: user_data?.email,
        phone: user_data?.phone,
      };
      const response = await fetch('/api/analytics/meta-conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) console.warn('Meta conversion event failed: Unable to process conversion event');
    } catch {
      console.warn('Failed to send Meta conversion event');
    }
  }

  if (linkedin) {
    try {
      if (typeof window.lintrk !== 'undefined' && linkedin.pixel_conversion_id) {
        window.lintrk('track', {
          conversion_id: linkedin.pixel_conversion_id,
          event_id,
        });
      }
    } catch {
      console.warn('Failed to track client-side lintrk function');
    }
    try {
      const payload: LinkedinConversionProps = {
        direct_api_conversion_id: linkedin?.direct_api_conversion_id,
        event_id,
        event_time: event_time.milliseconds,
        email: user_data?.email,
        name: user_data?.name,
      };
      const response = await fetch('/api/analytics/linkedin-conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) console.warn('LinkedIn conversion event failed: Unable to process conversion event');
    } catch {
      console.warn('Failed to send LinkedIn conversion event');
    }
  }

  if (tiktok) {
    try {
      if (typeof window.ttq !== 'undefined') {
        window.ttq.track(tiktok.event_name, {
          ...(user_data?.email && { email: await hash(user_data.email) }),
          ...(user_data?.phone && { phone_number: await hash(user_data.phone) }),
        }, { event_id });
      }
    } catch {
      console.warn('Failed to track client-side ttq function');
    }
    try {
      const payload: TikTokConversionProps = {
        event_name: tiktok.event_name,
        url,
        event_id,
        event_time: event_time.seconds,
        email: user_data?.email,
        phone: user_data?.phone,
      };
      const response = await fetch('/api/analytics/tiktok-conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) console.warn('TikTok conversion event failed: Unable to process conversion event');
    } catch {
      console.warn('Failed to send TikTok conversion event');
    }
  }
}

declare global {
  interface Window {
    fbq: (method: string, ...args: any[]) => void;
    lintrk: (method: string, data: any) => void;
    ttq: {
      track: (event: string, data: any, options?: any) => void;
    };
  }
}
