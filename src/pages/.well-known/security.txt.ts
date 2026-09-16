import type { APIContext } from 'astro';

/*
 * RFC 9116. Expires is set 11 months from the build (the RFC recommends under a
 * year), so any deploy refreshes it; rebuild at least that often or it goes stale.
 */
export function GET({ site }: APIContext) {
  const expires = new Date();
  expires.setUTCMonth(expires.getUTCMonth() + 11);
  expires.setUTCHours(0, 0, 0, 0);

  const body = [
    'Contact: mailto:contact@faleir0x.com',
    `Expires: ${expires.toISOString()}`,
    'Preferred-Languages: en, pt',
    `Canonical: ${new URL('/.well-known/security.txt', site)}`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
