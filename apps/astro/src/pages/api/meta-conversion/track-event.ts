/**
 * Simple function to track events both in browser (fbq) and server-side (Meta Conversion API)
 * @param eventName - Meta standard event name (e.g. 'CompleteRegistration', 'Lead', etc.)
 * @param data - Essential user data and event information
 */
export async function trackEvent(
  eventName: string,
  data: {
    email?: string;
    name?: string;
    phone?: string;
    slug: string;
  }
) {
  const event_id = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  const event_time = Math.floor(Date.now() / 1000)

  try {
    if (typeof window.fbq !== 'undefined') {
      fbq('track', eventName, {
        ...(data.email && { email: data.email }),
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
      }, { eventID: event_id });
    }
  } catch (error) {
    console.warn('Failed to track browser event:', error);
  }
  try {
    const userData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
    };

    const response = await fetch('/api/meta-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...userData,
        eventName,
        slug: data.slug,
        event_id,
        event_time,
      }),
    });

    if (!response.ok) {
      const responseData = await response.json();
      console.warn('Meta conversion event failed:', responseData.message);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Failed to send Meta conversion event:', error);
    return false;
  }
}
