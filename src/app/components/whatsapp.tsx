'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Cta } from './primitives';
import { useSiteSettings } from './site-settings';
import { waHref, waMessage } from '../lib/whatsapp';

export const WhatsAppGlyph = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35M12.05 21.78h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.83 9.83 0 0 1 9.88 9.89c0 5.45-4.43 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41" />
  </svg>
);

/**
 * WhatsApp enquiry button. If the business number isn't configured yet it renders
 * the fallback (a working link, e.g. to /contact) — or nothing — rather than a dead button.
 */
export function WhatsAppCta({
  message, label, variant = 'outline', fallback, id, className,
}: {
  message: string;
  label: string;
  variant?: 'outline' | 'text';
  fallback?: { href: string; label: string };
  id?: string;
  className?: string;
}) {
  const { whatsapp } = useSiteSettings();
  const href = waHref(whatsapp, message);
  if (!href) {
    return fallback ? <Cta href={fallback.href} variant={variant} id={id} className={className}>{fallback.label}</Cta> : null;
  }
  return (
    <Cta href={href} external variant={variant} id={id} className={`cta--wa${className ? ` ${className}` : ''}`}>
      {label}
    </Cta>
  );
}

/** Floating chat button on every public page (hidden until a number is configured). */
export function WhatsAppFloat() {
  const { whatsapp } = useSiteSettings();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const context =
    pathname.startsWith('/salon') ? waMessage.salon()
      : pathname.startsWith('/cosmetics') ? 'Hello SHAIS.PK, I have a question about your cosmetics.'
        : pathname.startsWith('/boutique') ? 'Hello SHAIS.PK, I have a question about your boutique.'
          : waMessage.general();
  const href = waHref(whatsapp, context);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`wa-float${ready ? ' is-ready' : ''}`}
      aria-label="Chat with SHAIS.PK on WhatsApp (opens WhatsApp)"
    >
      <span className="wa-float__label" aria-hidden="true">Chat on WhatsApp</span>
      <span className="wa-float__icon">
        <WhatsAppGlyph size={22} />
      </span>
    </a>
  );
}
