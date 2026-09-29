'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useMotion, gsap } from '../../lib/motion';
import { SITE, socialLinks } from '../../lib/site';
import { formatWhatsapp, waMessage } from '../../lib/whatsapp';
import { WhatsAppCta } from '../../components/whatsapp';
import { useSiteSettings } from '../../components/site-settings';
import { Label, Lines, Media, pad } from '../../components/primitives';

const ENQUIRIES = [
  { title: 'Salon', wa: waMessage.salon(), text: 'Book your appointment and let our experts craft your perfect look.', href: '/salon', link: 'Salon services' },
  { title: 'Cosmetics', wa: 'Hello SHAIS.PK, I have a question about your cosmetics.', text: 'Visit us in store or get in touch for personalised product recommendations.', href: '/cosmetics', link: 'Our cosmetics' },
  { title: 'Boutique', wa: 'Hello SHAIS.PK, I have a question about your boutique.', text: 'Visit our boutique for a personalised styling experience.', href: '/boutique', link: 'The boutique' },
];

export default function ContactView() {
  const root = useRef<HTMLDivElement>(null);
  const { phone, email, address, hours } = SITE.contact;
  const { whatsapp } = useSiteSettings();
  const social = socialLinks();
  const details = [
    whatsapp && { label: 'WhatsApp', value: formatWhatsapp(whatsapp) },
    phone && { label: 'Telephone', value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
    email && { label: 'Email', value: email, href: `mailto:${email}` },
    address && { label: 'Visit', value: address },
    hours && { label: 'Hours', value: hours },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  useMotion(root, ({ q }) => {
    gsap.fromTo(q('.contact-hero__media .media__inner'), { yPercent: -4 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: q('.contact-hero')[0], start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  return (
    <div ref={root}>
      <section className="contact-hero" id="contact-hero">
        <div className="contact-hero__text">
          <Label>Contact</Label>
          <Lines as="h1" className="contact-hero__title" reveal="load" delay={0.3} lines={['Get in', <em key="t">Touch</em>]} />
          <p className="contact-hero__sub" data-fade data-load data-delay={0.8}>
            Appointments, product advice and styling — tell us what you&rsquo;re looking for.
          </p>
        </div>
        <Media
          src="/images/contact-hero.jpg"
          alt="An illuminated shopfront entrance at dusk"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="contact-hero__media"
          mask="right"
          load
          preload
          delay={0.1}
        />
      </section>

      <section className="contact-body">
        <div className="contact-details">
          <Label>Reach Us</Label>
          {details.length > 0 || whatsapp || social.length > 0 ? (
            <dl className="contact-details__list">
              {details.map((d) => (
                <div className="contact-details__row" key={d.label}>
                  <dt>{d.label}</dt>
                  <dd>{d.href ? <a href={d.href}>{d.value}</a> : d.value}</dd>
                </div>
              ))}
              {social.map((s) => (
                <div className="contact-details__row" key={s.label}>
                  <dt>{s.label}</dt>
                  <dd><a href={s.href} target="_blank" rel="noopener noreferrer">Follow</a></dd>
                </div>
              ))}
            </dl>
          ) : (
            // TODO(owner): add phone / WhatsApp / email / address in src/app/lib/site.ts — this note disappears automatically.
            <p className="contact-details__pending" data-fade>
              Our contact details will be listed here shortly.
            </p>
          )}
          <WhatsAppCta id="contact-whatsapp" message={waMessage.general()} label="Message us on WhatsApp" />
        </div>

        <ol className="contact-enquiries" aria-label="Enquiries by division">
          {ENQUIRIES.map((e, i) => (
            <li className="contact-enquiry" key={e.title}>
              <span className="contact-enquiry__rule" data-rule data-delay={i * 0.08} />
              <span className="contact-enquiry__num">{pad(i + 1)}</span>
              <Lines as="h2" className="contact-enquiry__title" lines={[e.title]} delay={0.1 + i * 0.08} />
              <p className="contact-enquiry__text" data-fade data-delay={0.25 + i * 0.08}>{e.text}</p>
              <div className="contact-enquiry__links">
                <WhatsAppCta variant="text" message={e.wa} label={`${e.title} on WhatsApp`} />
                <Link href={e.href} className="contact-enquiry__link">
                  {e.link}
                  <span className="cta__arrow" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
