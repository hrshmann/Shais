/**
 * Business details for SHAIS.PK.
 *
 * TODO(owner): fill these in. Every empty field is hidden on the site
 * rather than replaced with placeholder text, so nothing invented is shown.
 */
export const SITE_URL = 'https://shais.pk';

type SiteConfig = {
  name: string;
  contact: { phone: string; whatsapp: string; email: string; address: string; hours: string };
  social: { instagram: string; facebook: string };
};

export const SITE: SiteConfig = {
  name: 'SHAIS.PK',
  contact: {
    phone: '',
    /** International format, digits only, e.g. 923001234567 */
    whatsapp: '',
    email: '',
    address: '',
    hours: '',
  },
  social: {
    instagram: '',
    facebook: '',
  },
};

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/salon', label: 'Salon' },
  { href: '/cosmetics', label: 'Cosmetics' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export function socialLinks() {
  return (
    [
      { label: 'Instagram', href: SITE.social.instagram },
      { label: 'Facebook', href: SITE.social.facebook },
    ] as const
  ).filter((s) => s.href);
}
