/**
 * Safely serializes an object for embedding into HTML <script type="application/ld+json"> tags.
 * Escapes `<` to `\u003c` to prevent premature script tag closure / XSS injection,
 * and escapes Unicode line separator `\u2028` and paragraph separator `\u2029`.
 */
export function safeJsonLd(obj: unknown, space?: number): string {
  return JSON.stringify(obj, null, space)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
