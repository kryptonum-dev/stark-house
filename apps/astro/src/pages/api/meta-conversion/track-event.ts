export type TrackEventProps = {
  event_name: string
  content_name: string
  url: string
  event_id: string
  event_time: number
  name?: string
  email?: string
  phone?: string
}

/**
 * Simple function to track events both in browser (fbq) and server-side (Meta Conversion API)
 * @param eventName - Meta standard event name (e.g. 'CompleteRegistration', 'Lead', etc.)
 * @param data - Essential user data and event information
 */
export async function trackEvent(
  event_name: string,
  data: {
    content_name: string,
    email?: string;
    name?: string;
    phone?: string;
  }
) {
  const event_id = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  const event_time = Math.floor(Date.now() / 1000)

  try {
    if (typeof window.fbq !== 'undefined') {
      fbq('track', event_name, {
        content_name: data.content_name,
        ...(data.email && { email: data.email }),
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
      }, { eventID: event_id });
    }
  } catch (error) {
    console.warn('Failed to track browser event:', error);
  }
  try {
    const payload: TrackEventProps = {
      event_name,
      content_name: data.content_name,
      url: window.location.href,
      event_id,
      event_time,
      name: data.name,
      email: data.email,
      phone: data.phone,
    };
    const response = await fetch('/api/meta-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const responseData = await response.json();
      console.warn('Meta conversion event failed:', responseData.message);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Failed to send Meta conversion event.');
    return false;
  }
}
