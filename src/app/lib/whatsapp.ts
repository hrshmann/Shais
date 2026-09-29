/**
 * WhatsApp click-to-chat links. wa.me opens the app on phones and WhatsApp Web /
 * Desktop on computers. The business number comes only from owner settings
 * (see lib/settings.ts) — never hardcode numbers in components.
 */
export function waHref(number: string | null | undefined, text?: string): string | null {
  const digits = (number ?? '').replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

/** Prefilled messages. Enquiries only — opening WhatsApp confirms nothing. */
export const waMessage = {
  general: () => 'Hello SHAIS.PK, I have a question.',
  salon: (service?: string) =>
    service
      ? `Hello SHAIS.PK, I'd like to enquire about a salon appointment for ${service}. Could you let me know which times are available?`
      : `Hello SHAIS.PK, I'd like to enquire about a salon appointment. Could you let me know which times are available?`,
  item: (division: 'Cosmetics' | 'Boutique', name: string, variant?: string) =>
    `Hello SHAIS.PK, I'm interested in ${name}${variant ? ` (${variant})` : ''} from your ${division}. Could you tell me about availability and how to order?`,
};

export function formatWhatsapp(digits: string) {
  return digits ? `+${digits}` : '';
}
