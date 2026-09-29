'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useMotion, gsap } from '../../lib/motion';
import { SALON_SERVICES } from '../../lib/content';
import { waMessage } from '../../lib/whatsapp';
import { WhatsAppCta } from '../../components/whatsapp';
import { useSiteSettings } from '../../components/site-settings';
import { Cta, Label, Lines, Media, pad } from '../../components/primitives';

const PROCESS = [
  { step: '01', title: 'Consultation', desc: 'We begin by understanding your vision, lifestyle and preferences.' },
  { step: '02', title: 'Design', desc: 'Our experts craft a personalised plan tailored to you.' },
  { step: '03', title: 'Transform', desc: 'Sit back and enjoy as we bring your look to life.' },
  { step: '04', title: 'Aftercare', desc: 'Leave with expert tips to maintain your look at home.' },
];

export default function SalonView() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const [prevShown, setPrevShown] = useState<number | null>(null);
  const shown = preview ?? active;
  const [lastShown, setLastShown] = useState(shown);
  if (lastShown !== shown) {
    setPrevShown(lastShown);
    setLastShown(shown);
  }
  const { whatsapp } = useSiteSettings();
  // only name a service in the enquiry once the visitor has actually chosen one
  const [chosen, setChosen] = useState(false);
  const chosenService = chosen ? SALON_SERVICES[active] : null;

  useMotion(root, ({ q, desktop }) => {
    /* ---- Hero: portrait drifts, copy lifts away ---- */
    const hero = q('.salon-hero')[0];
    gsap
      .timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 } })
      .to(q('.salon-hero__portrait .media__inner'), { yPercent: desktop ? 10 : 6, ease: 'none' }, 0)
      .to(q('.salon-hero__content'), { y: desktop ? -80 : -30, opacity: 0, ease: 'none' }, 0)
      .to(q('.salon-hero__side-label'), { opacity: 0, ease: 'none', duration: 0.4 }, 0);

    /* ---- Philosophy: pinned; frame opens, then the statement rises ---- */
    const panel = q('#salon-editorial-panel-1')[0];
    const lines = q('.salon-editorial__panel-heading .ln-i');
    if (desktop) {
      gsap
        .timeline({ scrollTrigger: { trigger: panel, start: 'top top', end: '+=120%', scrub: 1, pin: true, anticipatePin: 1 } })
        .fromTo(q('.salon-editorial__panel-img-wrap'), { clipPath: 'inset(14% 24% 14% 24%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power2.inOut' }, 0)
        .fromTo(q('.salon-editorial__panel-img-wrap .media__inner'), { scale: 1.4 }, { scale: 1, duration: 0.6, ease: 'power2.out' }, 0)
        .fromTo(q('.salon-editorial__panel-overlay'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.25)
        .fromTo(q('.salon-editorial__panel-label'), { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.42)
        .fromTo(lines, { yPercent: 115, y: 0 }, { yPercent: 0, duration: 0.3, stagger: 0.07, ease: 'power3.out' }, 0.45)
        .to({}, { duration: 0.2 });
    } else {
      gsap.fromTo(lines, { yPercent: 115, y: 0 }, {
        yPercent: 0, duration: 1.2, stagger: 0.09, ease: 'expo.out',
        scrollTrigger: { trigger: panel, start: 'top 60%', once: true },
      });
      gsap.fromTo(q('.salon-editorial__panel-label'), { opacity: 0 }, { opacity: 1, scrollTrigger: { trigger: panel, start: 'top 60%', once: true } });
    }

    /* ---- The space: frame expands to full width as it crosses the viewport ---- */
    const showcase = q('.salon-experience__showcase')[0];
    gsap
      .timeline({ scrollTrigger: { trigger: showcase, start: 'top 90%', end: 'center 45%', scrub: 1 } })
      .fromTo(showcase, { clipPath: desktop ? 'inset(0% 14% 0% 14%)' : 'inset(0% 6% 0% 6%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0)
      .fromTo(q('.salon-experience__showcase .media__inner'), { scale: 1.25 }, { scale: 1, ease: 'none' }, 0);

    /* ---- Appointment: background settles ---- */
    const cta = q('#salon-cta')[0];
    gsap.fromTo(q('.salon-cta__bg-inner'), { scale: 1.25, yPercent: -5 }, {
      scale: 1, yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: cta, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  return (
    <div ref={root}>
      {/* ============ HERO ============ */}
      <section className="salon-hero" id="salon-hero">
        <Media
          src="/images/salon-editorial-portrait.jpg"
          alt="Black-and-white portrait of a woman in a high-neck top and statement earrings"
          sizes="(max-width: 768px) 100vw, 55vw"
          className="salon-hero__portrait"
          mask="left"
          load
          preload
          imgClassName="salon-hero__portrait-img"
        />

        <div className="salon-hero__content" id="salon-hero-content">
          <Label tone="light" className="salon-hero__label">SHAIS.PK Salon</Label>

          <Lines
            as="h1"
            className="salon-hero__title"
            id="salon-hero-title"
            reveal="load"
            delay={0.45}
            lines={['The Art', 'Of Being', <em key="b">Beautiful</em>]}
          />

          <p className="salon-hero__intro" id="salon-hero-intro" data-fade data-load data-delay={0.95}>
            A sanctuary where expert artisans and refined elegance converge — transforming the everyday into the
            extraordinary.
          </p>

          <div data-fade data-load data-delay={1.1}>
            <Cta href="/contact" tone="light" id="salon-hero-cta">Book an Appointment</Cta>
          </div>
        </div>

        <span className="salon-hero__side-label" aria-hidden="true">SHAIS.PK · Salon</span>
        <span className="scroll-cue scroll-cue--light" aria-hidden="true">
          <span className="scroll-cue__text">Scroll</span>
          <span className="scroll-cue__line" />
        </span>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="salon-services" id="services">
        <div className="salon-services__header">
          <Label>What We Offer</Label>
          <Lines className="salon-services__heading" lines={['Our', 'Services']} />
        </div>

        <div className="salon-services__split">
          <div className="salon-services__visual" id="salon-services-visual" data-mask="up">
            {SALON_SERVICES.map((service, i) => (
              <div
                className={`salon-services__img-wrap${i === shown ? ' is-active' : i === prevShown ? ' is-prev' : ''}`}
                key={service.id}
              >
                <Image
                  src={service.image}
                  alt={i === shown ? `${service.title} — ${service.subtitle}` : ''}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="salon-services__img"
                />
              </div>
            ))}
            <div className="salon-services__counter" aria-hidden="true">
              <span className="salon-services__counter-current" key={shown}>{pad(shown + 1)}</span>
              <span className="salon-services__counter-divider" />
              <span className="salon-services__counter-total">{pad(SALON_SERVICES.length)}</span>
            </div>
            <span className="salon-services__caption" aria-hidden="true" key={`c${shown}`}>
              {SALON_SERVICES[shown].title}
            </span>
          </div>

          <ul className="salon-services__list" id="salon-services-list" onPointerLeave={() => setPreview(null)}>
            {SALON_SERVICES.map((service, i) => {
              const open = i === active;
              return (
                <li
                  className={`salon-services__item${open ? ' active' : ''}${i === shown ? ' is-shown' : ''}`}
                  key={service.id}
                  id={service.id}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setPreview(i)}
                  data-fade
                  data-delay={i * 0.08}
                >
                  <h3 className="salon-services__item-heading">
                    <button
                      type="button"
                      className="salon-services__item-header"
                      aria-expanded={open}
                      aria-controls={`${service.id}-panel`}
                      onClick={() => {
                        setActive(i);
                        setChosen(true);
                      }}
                    >
                      <span className="salon-services__item-number">{pad(i + 1)}</span>
                      <span className="salon-services__item-title">{service.title}</span>
                      <span className="salon-services__item-toggle" aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
                          <path d="M6 0v12M0 6h12" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div className="salon-services__item-body" id={`${service.id}-panel`} role="region" aria-label={service.title}>
                    <div className="salon-services__item-body-inner">
                      <span className="salon-services__item-subtitle">{service.subtitle}</span>
                      <p className="salon-services__item-desc">{service.description}</p>
                      <WhatsAppCta
                        variant="text"
                        className="salon-services__item-cta"
                        message={waMessage.salon(`${service.title} (${service.subtitle})`)}
                        label={`Enquire about ${service.title}`}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ============ PHILOSOPHY (pinned) ============ */}
      <section className="salon-editorial" id="salon-editorial">
        <div className="salon-editorial__panel" id="salon-editorial-panel-1">
          <Media
            src="/images/salon-detail-treatment.jpg"
            alt="Hands resting on a client's face during a facial treatment"
            sizes="100vw"
            className="salon-editorial__panel-img-wrap"
          />
          <div className="salon-editorial__panel-overlay" />
          <div className="salon-editorial__panel-text">
            <span className="salon-editorial__panel-label">Our Philosophy</span>
            <Lines
              className="salon-editorial__panel-heading"
              reveal={false}
              lines={['Beauty is', 'not a look.', <em key="f">It&rsquo;s a feeling.</em>]}
            />
          </div>
        </div>

        <div className="salon-editorial__duo" id="salon-editorial-duo">
          <Media
            src="/images/salon-service-2.jpg"
            alt="A makeup artist applying eyeshadow"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="salon-editorial__duo-img-wrap"
            mask="left"
            parallax={0.16}
            cursor="Makeup"
          />
          <div className="salon-editorial__duo-content">
            <Label>The Craft</Label>
            <Lines as="h3" className="salon-editorial__duo-heading" lines={['Every Detail,', 'Intentional']} />
            <p className="salon-editorial__duo-text" data-fade data-delay={0.2}>
              Our team brings together years of expertise and a genuine passion for their craft. We use only premium
              products and stay at the forefront of beauty to deliver results that exceed expectations.
            </p>
            <p className="salon-editorial__duo-text" data-fade data-delay={0.35}>
              From the moment you walk in, you&rsquo;re enveloped in an atmosphere of refined elegance and care.
            </p>
          </div>
        </div>
      </section>

      {/* ============ THE SPACE ============ */}
      <section className="salon-experience" id="salon-experience">
        <div className="salon-experience__header">
          <div>
            <Label>The Space</Label>
            <Lines className="salon-experience__heading" lines={['An Atmosphere', 'Of Refinement']} />
          </div>
          <p className="salon-experience__text" data-fade data-delay={0.3}>
            Designed with intention — every element of our space exists to make you feel valued, heard, and beautifully
            at ease.
          </p>
        </div>

        <Media
          src="/images/salon-atmosphere.jpg"
          alt="A softly lit salon interior with arched mirrors"
          sizes="100vw"
          className="salon-experience__showcase"
        />

        <ol className="salon-experience__process" id="salon-experience-process">
          {PROCESS.map((p, i) => (
            <li className="salon-experience__step" key={p.step}>
              <span className="salon-experience__step-rule" data-rule data-delay={i * 0.12} />
              <span className="salon-experience__step-num" data-fade data-delay={0.1 + i * 0.12}>{p.step}</span>
              <h4 className="salon-experience__step-title" data-fade data-delay={0.2 + i * 0.12}>{p.title}</h4>
              <p className="salon-experience__step-desc" data-fade data-delay={0.3 + i * 0.12}>{p.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ============ APPOINTMENT ============ */}
      <section className="salon-cta" id="salon-cta">
        <div className="salon-cta__bg-wrap" aria-hidden="true">
          <div className="salon-cta__bg-inner">
            <Image src="/images/salon-hero.jpg" alt="" fill sizes="100vw" className="salon-cta__bg" />
          </div>
        </div>
        <div className="salon-cta__overlay" />
        <div className="salon-cta__content" id="salon-cta-content">
          <span className="salon-cta__label" data-fade>Ready?</span>
          <Lines className="salon-cta__heading" lines={['Your', 'Transformation', <em key="a">Awaits</em>]} />
          <p className="salon-cta__text" data-fade data-delay={0.4}>
            Book your appointment and let our experts craft your perfect look.
          </p>
          <div className="salon-cta__actions" data-fade data-delay={0.55}>
            <WhatsAppCta
              id="salon-book-btn"
              message={waMessage.salon(chosenService ? `${chosenService.title} (${chosenService.subtitle})` : undefined)}
              label={chosenService ? `Enquire about ${chosenService.title}` : 'Enquire on WhatsApp'}
              fallback={{ href: '/contact', label: 'Book an Appointment' }}
            />
            {whatsapp && <Cta href="/contact" variant="text">Other ways to reach us</Cta>}
          </div>
          {whatsapp && (
            <p className="salon-cta__note" data-fade data-delay={0.7}>
              Opens WhatsApp with your enquiry. We&rsquo;ll reply to confirm availability.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
