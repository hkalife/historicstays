/** Strips angle brackets so raw HTML/script tags can never be typed or stored. */
export function sanitizeText(value: string): string {
  return value.replace(/[<>]/g, '');
}
