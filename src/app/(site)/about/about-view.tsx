'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useMotion, gsap } from '../../lib/motion';
import { Label, Lines, Media, Words, pad } from '../../components/primitives';
import { ClosingCta } from '../../components/sections';

/* All copy on this page is drawn from existing SHAIS.PK site text — no history, people or figures are invented. */
const DIVISIONS = [
  { href: '/salon', title: 'Salon', subtitle: 'Expert care', desc: 'For your natural beauty', src: '/images/salon-panel.jpg', alt: 'A facial treatment in progress' },
  { href: '/cosmetics', title: 'Cosmetics', subtitle: 'Authentic brands', desc: 'For every version of you', src: '/images/featured-3.jpg', alt: 'Perfume bottles and makeup on slate' },
  { href: '/boutique', title: 'Boutique', subtitle: 'Ready-made fashion', desc: 'For every occasion', src: '/images/boutique-panel.jpg', alt: 'A woman in a flowing evening gown' },
];

export default function AboutView() {
  const root = useRef<HTMLDivElement>(null);

  useMotion(root, ({ q, desktop }) => {
    /* ---- Hero image grows from a letterbox to full bleed ---- */
    const frame = q('.about-hero__frame')[0];
    gsap
      .timeline({ scrollTrigger: { trigger: frame, start: 'top 85%', end: desktop ? 'top 5%' : 'top 30%', scrub: 1 } })
      .fromTo(frame, { clipPath: desktop ? 'inset(0% 22% 0% 22%)' : 'inset(0% 8% 0% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0)
      .fromTo(q('.about-hero__frame .media__inner'), { scale: 1.3 }, { scale: 1, ease: 'none' }, 0);

    /* ---- Manifesto brightens in reading order ---- */
    gsap.fromTo(q('.about-manifesto .w'), { opacity: 0.14 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: q('.about-manifesto')[0], start: 'top 75%', end: 'bottom 55%', scrub: true },
    });

    gsap.fromTo(q('.closing__bg-inner'), { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: q('.closing')[0], start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  return (
    <div ref={root}>
      <section className="about-hero" id="about-hero">
        <div className="about-hero__head">
          <Label>About SHAIS.PK</Label>
          <Lines as="h1" className="about-hero__title" reveal="load" delay={0.3} lines={['More Than Beauty', <em key="w">A Way of Living</em>]} />
        </div>
        <Media
          src="/images/about-hero.jpg"
          alt="Women gathered in a warmly lit beauty studio"
          sizes="100vw"
          className="about-hero__frame"
          preload
        />
      </section>

      <section className="about-manifesto" aria-label="What we are">
        <span className="about-manifesto__num" aria-hidden="true">(01)</span>
        <Words
          className="about-manifesto__text"
          text="A curated space for beauty, fashion and self-expression. Salon experiences, premium cosmetics and timeless ready-made fashion."
        />
      </section>

      <section className="about-essence">
        <Media
          src="/images/editorial-beauty.jpg"
          alt="Close-up profile of a woman's face in black and white"
          sizes="(max-width: 768px) 100vw, 42vw"
          className="about-essence__image"
          mask="left"
          parallax={0.18}
        />
        <div className="about-essence__body">
          <Label>Our Essence</Label>
          <Lines className="about-essence__heading" lines={['Confidence', 'Looks Good', <em key="y">On You</em>]} />
          <p className="about-essence__text" data-fade data-delay={0.3}>
            At SHAIS.PK, we believe beauty, fashion and self-care are part of the same story — your story.
          </p>
        </div>
      </section>

      <section className="about-divisions" aria-labelledby="about-divisions-heading">
        <div className="about-divisions__head">
          <Label>Three Worlds</Label>
          <Lines className="about-divisions__heading" id="about-divisions-heading" lines={['One', <em key="h">House</em>]} />
        </div>
        <ol className="about-divisions__list">
          {DIVISIONS.map((d, i) => (
            <li className={`about-div about-div--${i % 2 ? 'right' : 'left'}`} key={d.href}>
              <Link href={d.href} className="about-div__link" data-cursor="Enter">
                <Media src={d.src} alt={d.alt} sizes="(max-width: 768px) 100vw, 46vw" className="about-div__media" mask={i % 2 ? 'right' : 'left'} parallax={0.16} />
                <div className="about-div__text">
                  <span className="about-div__num">{pad(i + 1)}</span>
                  <Lines as="h3" className="about-div__title" lines={[d.title]} />
                  <p className="about-div__sub" data-fade data-delay={0.2}>{d.subtitle}</p>
                  <p className="about-div__desc" data-fade data-delay={0.3}>{d.desc}</p>
                  <span className="about-div__more">
                    Explore {d.title}
                    <span className="cta__arrow" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <ClosingCta
        image="/images/quote-bg.jpg"
        heading={['A Curated Blend', <em key="b">of Beauty, Fashion</em>, <em key="l">&amp; Lifestyle</em>]}
        text="Visit us, or get in touch to book an appointment."
        href="/contact"
        action="Get in Touch"
      />
    </div>
  );
}
