/**
 * Normalizes and hashes user data for Meta Pixel Conversion API
 * @param value The value to hash
 * @returns The normalized and hashed value
 */
export async function hash(value: string): Promise<string> {
  const normalized = value.toLowerCase().trim();

  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}
