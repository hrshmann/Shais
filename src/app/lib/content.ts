/**
 * Division offerings, shared by the homepage index and the division pages.
 * All copy comes from the existing site; images are editorial mood imagery,
 * not photographs of SHAIS.PK's own premises or stock.
 */

export type Division = 'SALON' | 'COSMETICS' | 'BOUTIQUE';

export type Offering = {
  id: string;
  division: Division;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  href: string;
};

export const SALON_SERVICES: Offering[] = [
  {
    id: 'salon-hair',
    division: 'SALON',
    title: 'Hair',
    subtitle: 'Styling & Treatment',
    description:
      'Precision cuts, editorial styling, keratin treatments and colour — crafted by artisans who understand that your hair is your signature.',
    image: '/images/salon-service-1.jpg',
    href: '/salon#services',
  },
  {
    id: 'salon-makeup',
    division: 'SALON',
    title: 'Makeup',
    subtitle: 'Artistry & Design',
    description:
      'From everyday glow to full editorial looks — designed for your unique features with premium, skin-loving products.',
    image: '/images/salon-service-2.jpg',
    href: '/salon#services',
  },
  {
    id: 'salon-skincare',
    division: 'SALON',
    title: 'Skincare',
    subtitle: 'Facials & Treatments',
    // TODO(owner): original copy said "Clinical-grade facials" — reinstate only if accurate.
    description:
      'Facials and specialised treatments that reveal your skin’s natural radiance and restore its vitality.',
    image: '/images/salon-service-3.jpg',
    href: '/salon#services',
  },
  {
    id: 'salon-nails',
    division: 'SALON',
    title: 'Nails',
    subtitle: 'Luxury Care',
    description:
      'Luxury manicures, gel extensions, pedicures and intricate nail artistry — every detail attended to with care.',
    image: '/images/salon-service-4.jpg',
    href: '/salon#services',
  },
];

export const COSMETIC_CATEGORIES: Offering[] = [
  {
    id: 'cos-skincare',
    division: 'COSMETICS',
    title: 'Skincare',
    description: 'Serums, moisturisers, and treatments that nurture your skin’s natural glow.',
    image: '/images/featured-1.jpg',
    href: '/cosmetics#collections',
  },
  {
    id: 'cos-makeup',
    division: 'COSMETICS',
    title: 'Makeup',
    description: 'Foundations, lipsticks, and palettes from the world’s most coveted brands.',
    image: '/images/featured-2.jpg',
    href: '/cosmetics#collections',
  },
  {
    id: 'cos-fragrance',
    division: 'COSMETICS',
    title: 'Fragrances',
    description: 'Curated scents that leave a lasting impression, from subtle to statement.',
    image: '/images/featured-3.jpg',
    href: '/cosmetics#collections',
  },
  {
    id: 'cos-haircare',
    division: 'COSMETICS',
    title: 'Hair Care',
    description: 'Premium shampoos, treatments, and styling products for salon-quality results.',
    image: '/images/cosmetics-hero.jpg',
    href: '/cosmetics#collections',
  },
];

export const BOUTIQUE_COLLECTIONS: Offering[] = [
  {
    id: 'bq-formals',
    division: 'BOUTIQUE',
    title: 'Formals',
    description: 'Elegant evening wear and occasion pieces crafted for memorable moments.',
    image: '/images/boutique-panel.jpg',
    href: '/boutique#collections',
  },
  {
    id: 'bq-casual',
    division: 'BOUTIQUE',
    title: 'Casual Luxe',
    description: 'Effortlessly chic everyday pieces that elevate your daily wardrobe.',
    image: '/images/quote-bg.jpg',
    href: '/boutique#collections',
  },
  {
    id: 'bq-accessories',
    division: 'BOUTIQUE',
    title: 'Accessories',
    description: 'Statement pieces — bags, jewellery, and scarves to complete your look.',
    image: '/images/cosmetics-panel.jpg',
    href: '/boutique#collections',
  },
  {
    id: 'bq-bridal',
    division: 'BOUTIQUE',
    title: 'Bridal',
    description: 'Curated bridal wear for the most special day of your life.',
    image: '/images/boutique-hero.jpg',
    href: '/boutique#collections',
  },
];

export const ALL_OFFERINGS: Offering[] = [
  ...SALON_SERVICES,
  ...COSMETIC_CATEGORIES,
  ...BOUTIQUE_COLLECTIONS,
];

/**
 * TODO(owner): confirm SHAIS.PK actually stocks every one of these brands
 * (and has the right to list them) before launch. Remove any that are not carried.
 */
export const CARRIED_BRANDS = [
  'Chanel', 'Dior', 'MAC', 'NARS', 'Estée Lauder', 'Charlotte Tilbury',
  'Tom Ford', 'La Mer', 'YSL', 'Clinique', 'Bobbi Brown', 'Lancôme',
];
