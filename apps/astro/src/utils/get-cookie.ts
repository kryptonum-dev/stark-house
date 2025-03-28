/**
 * Universal cookie getter that works in both client and server environments
 *
 * @param name - The name of the cookie to retrieve
 * @param serverCookieSource - Optional server cookie string, headers, or request object
 * @returns The cookie value or empty string if not found
 */
export const getCookie = (
  name: string,
  serverCookieSource?: string | Headers | Request
): string => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const cookieString = document.cookie;
    if (!cookieString) return '';
    const cookies = cookieString.split(';').map(cookie => cookie.trim());
    const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
    if (cookie) {
      const cookieValue = cookie.substring(name.length + 1);
      return decodeURIComponent(cookieValue);
    }
    return '';
  }
  if (serverCookieSource) {
    let cookieString = '';
    if (typeof serverCookieSource === 'string') {
      cookieString = serverCookieSource;
    } else if (serverCookieSource instanceof Headers) {
      cookieString = serverCookieSource.get('cookie') || '';
    } else if (serverCookieSource instanceof Request) {
      cookieString = serverCookieSource.headers.get('cookie') || '';
    }
    if (!cookieString) return '';
    const cookies = cookieString.split(';').map(cookie => cookie.trim());
    const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
    if (cookie) {
      const cookieValue = cookie.substring(name.length + 1);
      return decodeURIComponent(cookieValue);
    }
  }
  return '';
};
