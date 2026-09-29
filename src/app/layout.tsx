import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { getSettings } from './lib/settings'
import { THEME_IDS, VISITOR_THEME_KEY, PREVIEW_PARAM } from './lib/themes'
import { SITE_URL } from './lib/site'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif-face',
  display: 'swap',
})

const sans = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans-face',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SHAIS.PK — Beauty, Fashion & Lifestyle',
    template: '%s — SHAIS.PK',
  },
  description: 'SHAIS.PK is a curated space for beauty, fashion and self-expression. Salon experiences, premium cosmetics and timeless ready-made fashion.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'SHAIS.PK',
    url: SITE_URL,
    title: 'SHAIS.PK — Beauty, Fashion & Lifestyle',
    description: 'Salon experiences, premium cosmetics and timeless ready-made fashion.',
    images: [{ url: '/images/hero-portrait.jpg', width: 896, height: 1200, alt: 'SHAIS.PK' }],
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

/*
 * Runs before first paint:
 *  1. theme — admin preview (?preview-theme=, only inside the admin preview frame),
 *     else the visitor's saved choice; otherwise CSS uses data-default-theme.
 *  2. motion — adds `has-motion` so animated elements start hidden (no flash);
 *     skipped for reduced motion and removed if the runtime hasn't started in 4s.
 */
const bootScript = `(function(d){try{var ok=${JSON.stringify(THEME_IDS)},t=null,f=window.self!==window.top,p=new URLSearchParams(location.search).get('${PREVIEW_PARAM}');if(f&&p&&ok.indexOf(p)>-1){sessionStorage.setItem('shais-preview',p);t=p}else if(f){t=sessionStorage.getItem('shais-preview')}if(!t){t=localStorage.getItem('${VISITOR_THEME_KEY}')}if(t&&ok.indexOf(t)>-1)d.setAttribute('data-theme',t)}catch(e){}try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('has-motion');setTimeout(function(){if(!window.__shaisMotion)d.classList.remove('has-motion')},4000)}catch(e){}})(document.documentElement)`

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SHAIS.PK',
    url: SITE_URL,
  }
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      data-default-theme={settings.theme}
      className={`${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
