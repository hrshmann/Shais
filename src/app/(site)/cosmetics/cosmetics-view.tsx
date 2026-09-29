'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useMotion, gsap } from '../../lib/motion';
import { CARRIED_BRANDS, COSMETIC_CATEGORIES } from '../../lib/content';
import { Label, Lines, Media, Words, pad } from '../../components/primitives';
import { ClosingCta, NumberedList } from '../../components/sections';
import { waMessage } from '../../lib/whatsapp';
import { WhatsAppCta } from '../../components/whatsapp';


const DIFFERENCE = [
  // TODO(owner): confirm "authorised distributors" and verification claims are accurate.
  { title: '100% Authentic', desc: 'Directly sourced from authorised distributors. Every product verified.' },
  { title: 'Expert Guidance', desc: 'Trained beauty advisors help you find your perfect match.' },
  { title: 'Curated Selection', desc: 'We hand-pick only the finest products from trusted global brands.' },
  { title: 'Luxury Experience', desc: 'Every visit feels like a personal beauty consultation.' },
];

export default function CosmeticsView() {
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(0);
  const [prevHover, setPrevHover] = useState<number | null>(null);

  const show = (i: number) => {
    if (i === hover) return;
    setPrevHover(hover);
    setHover(i);
  };

  useMotion(root, ({ q, desktop }) => {
    /* ---- Hero: the side window opens to full bleed while the title is pushed aside ---- */
    const hero = q('.cos-hero')[0];
    const frame = q('.cos-hero__frame');
    const WINDOW = 'inset(16% 6% 14% 54%)';
    if (desktop) {
      // entrance: the window slides open from the right edge and hands over to the pinned scroll
      gsap.timeline({ delay: 0.1 })
        .fromTo(frame, { clipPath: 'inset(16% 6% 14% 100%)' }, { clipPath: WINDOW, duration: 1.5, ease: 'expo.inOut' })
        .fromTo(q('.cos-hero__frame .media__inner'), { scale: 1.6 }, { scale: 1.3, duration: 2, ease: 'expo.out' }, 0.1);
      gsap
        .timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: '+=110%', scrub: 1, pin: true, anticipatePin: 1 } })
        .fromTo(frame, { clipPath: WINDOW }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', immediateRender: false }, 0)
        .fromTo(q('.cos-hero__frame .media__inner'), { scale: 1.3 }, { scale: 1, ease: 'power1.out', immediateRender: false }, 0)
        .to(q('.cos-hero__title .ln:nth-child(1)'), { xPercent: -12, ease: 'none' }, 0)
        .to(q('.cos-hero__title .ln:nth-child(3)'), { xPercent: 10, ease: 'none' }, 0)
        // once the photograph owns the frame, the title steps aside
        .to(q('.cos-hero__title'), { opacity: 0, duration: 0.35, ease: 'none' }, 0.5)
        .to(q('.cos-hero__sub, .cos-hero__meta'), { opacity: 0, duration: 0.3, ease: 'none' }, 0)
        .fromTo(q('.cos-hero__after'), { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'none' }, 0.7);
    } else {
      gsap.timeline({ delay: 0.1 })
        .fromTo(frame, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' })
        .fromTo(q('.cos-hero__frame .media__inner'), { scale: 1.3 }, { scale: 1, duration: 2, ease: 'expo.out' }, 0.1);
      gsap.to(q('.cos-hero__frame .media__inner'), {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
    }

    /* ---- Promise: statement brightens word by word ---- */
    gsap.fromTo(q('.cos-promise__statement .w'), { opacity: 0.16 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: q('.cos-promise__statement')[0], start: 'top 80%', end: 'bottom 50%', scrub: true },
    });

    /* ---- Brands: rows slide against each other with scroll, on top of the idle drift ---- */
    q('.marquee__row').forEach((row, i) => {
      gsap.fromTo(row, { xPercent: i % 2 ? -6 : 0 }, {
        xPercent: i % 2 ? 0 : -6, ease: 'none',
        scrollTrigger: { trigger: q('.cos-brands')[0], start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    /* ---- Closing background ---- */
    gsap.fromTo(q('.closing__bg-inner'), { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: q('.closing')[0], start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  return (
    <div ref={root}>
      {/* ============ HERO ============ */}
      <section className="cos-hero" id="cosmetics-hero">
        <Media
          src="/images/cosmetics-hero.jpg"
          alt="Lipsticks, foundations and brushes arranged on dark marble"
          sizes="100vw"
          className="cos-hero__frame"
          preload
        />
        <div className="cos-hero__meta">
          <Label>Our Cosmetics</Label>
        </div>
        <Lines
          as="h1"
          className="cos-hero__title"
          reveal="load"
          delay={0.35}
          lines={['Authentic', 'Brands for', <em key="e">Every You</em>]}
        />
        <p className="cos-hero__sub" data-fade data-load data-delay={0.9}>
          Curated collections of premium beauty products from the world&rsquo;s most trusted brands.
        </p>
        <p className="cos-hero__after" aria-hidden="true">Skincare · Makeup · Fragrances · Hair Care</p>
      </section>

      {/* ============ PROMISE ============ */}
      <section className="cos-promise" id="cosmetics-intro">
        <div className="cos-promise__aside">
          <Label>Our Promise</Label>
          <Lines className="cos-promise__heading" lines={['100% Authentic', <em key="a">Always</em>]} />
        </div>
        <div className="cos-promise__body">
          <Words
            className="cos-promise__statement"
            text="At SHAIS.PK, authenticity isn’t a promise — it’s a guarantee. Every product on our shelves is sourced directly from authorised distributors and verified for quality."
          />
          <p className="cos-promise__text" data-fade>
            We believe you deserve nothing less than the real thing. Our beauty experts are trained to help you find
            the perfect products for your skin type, tone, and personal style. Whether you&rsquo;re building a routine
            from scratch or searching for your next holy grail, we&rsquo;re here to guide you.
          </p>
        </div>
      </section>

      {/* ============ COLLECTIONS INDEX ============ */}
      <section className="cos-index" id="collections">
        <div className="cos-index__header">
          <Label>Shop by Category</Label>
          <Lines className="cos-index__heading" lines={['Collections']} />
        </div>

        <div className="cos-index__body">
          <ol className="cos-index__list">
            {COSMETIC_CATEGORIES.map((cat, i) => (
              <li
                key={cat.id}
                id={cat.id}
                className={`cos-index__row${i === hover ? ' is-active' : ''}`}
                onPointerEnter={() => show(i)}
              >
                <span className="cos-index__rule" data-rule data-delay={i * 0.06} />
                <span className="cos-index__num">{pad(i + 1)}</span>
                <h3 className="cos-index__title">
                  <Lines as="span" lines={[cat.title]} delay={0.1 + i * 0.06} />
                </h3>
                <p className="cos-index__desc" data-fade data-delay={0.3 + i * 0.06}>{cat.description}</p>
                <div className="cos-index__action">
                  <WhatsAppCta
                    variant="text"
                    message={waMessage.item('Cosmetics', `${cat.title.toLowerCase()} products`)}
                    label={`Ask about ${cat.title}`}
                  />
                </div>
                <Media src={cat.image} alt="" sizes="100vw" className="cos-index__inline" mask="up" />
              </li>
            ))}
          </ol>

          <div className="cos-index__preview" aria-hidden="true" data-mask="up">
            {COSMETIC_CATEGORIES.map((cat, i) => (
              <div
                key={cat.id}
                className={`cos-index__preview-img${i === hover ? ' is-active' : i === prevHover ? ' is-prev' : ''}`}
              >
                <Image src={cat.image} alt="" fill sizes="34vw" className="media__img" />
              </div>
            ))}
            <span className="cos-index__preview-caption" key={hover}>
              {pad(hover + 1)} — {COSMETIC_CATEGORIES[hover].title}
            </span>
          </div>
        </div>
      </section>

      {/* ============ BRANDS ============ */}
      <section className="cos-brands" id="cosmetics-brands" aria-labelledby="brands-heading">
        <div className="cos-brands__header">
          <Label>We Carry</Label>
          <Lines className="cos-brands__heading" id="brands-heading" lines={['Our Brands']} />
        </div>
        <ul className="sr-only">
          {CARRIED_BRANDS.map((b) => <li key={b}>{b}</li>)}
        </ul>
        <div className="marquee" aria-hidden="true">
          {[0, 1].map((row) => {
            const names = row ? [...CARRIED_BRANDS].reverse() : CARRIED_BRANDS;
            return (
              <div className="marquee__row" key={row}>
                <div className={`marquee__track${row ? ' marquee__track--rev' : ''}`}>
                  {[0, 1].map((dup) => (
                    <span className="marquee__set" key={dup}>
                      {names.map((b) => (
                        <span className="marquee__item" key={b}>
                          {b}
                          <span className="marquee__sep">✦</span>
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ DIFFERENCE ============ */}
      <NumberedList
        id="cosmetics-features"
        label="Why SHAIS.PK"
        heading={['The', <em key="d">Difference</em>]}
        rows={DIFFERENCE}
      />

      <ClosingCta
        id="cosmetics-cta"
        image="/images/cosmetics-panel.jpg"
        heading={['Discover Your', <em key="p">Perfect Products</em>]}
        text="Visit us in store or get in touch for personalised product recommendations."
        href="/contact"
        action="Get in Touch"
        actionId="cosmetics-contact-btn"
        secondary={<WhatsAppCta variant="text" message={waMessage.item('Cosmetics', 'your cosmetics range')} label="Ask on WhatsApp" />}
      />
    </div>
  );
}
