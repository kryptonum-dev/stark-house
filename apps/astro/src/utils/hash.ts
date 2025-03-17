/**
 * Normalizes and hashes user data for Meta Pixel Conversion API
 * @param value The value to hash
 * @returns The normalized and hashed value
 */
export async function hash(value: string): Promise<string> {
  // Normalize the value (lowercase, trim)
  const normalized = value.toLowerCase().trim();

  // Create a SHA-256 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}
