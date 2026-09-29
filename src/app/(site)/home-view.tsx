'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMotion, gsap, ScrollTrigger } from '../lib/motion';
import { ALL_OFFERINGS, type Division } from '../lib/content';
import { Cta, Label, Lines, Media, Words, pad } from '../components/primitives';

/* Hero slides map onto the four keywords that were already on the right edge. */
const SLIDES = [
  { keyword: 'Beauty', src: '/images/hero-portrait.jpg', alt: 'Black-and-white portrait of a woman in a dark jacket', pos: 'center 15%' },
  { keyword: 'Fashion', src: '/images/boutique-panel.jpg', alt: 'A woman in a flowing gown, caught mid-movement', pos: '52% 30%' },
  { keyword: 'Confidence', src: '/images/salon-editorial-portrait.jpg', alt: 'Portrait of a woman in a high-neck top and statement earrings', pos: 'center 22%' },
  { keyword: 'You', src: '/images/featured-2.jpg', alt: 'Makeup being applied with a soft brush', pos: 'center 30%' },
];
const SLIDE_MS = 6500;

const DIVISIONS = [
  { href: '/salon', title: 'Salon', subtitle: 'Expert Care', desc: 'For your natural beauty', src: '/images/salon-panel.jpg', alt: 'A facial treatment in progress', mask: 'left' as const },
  { href: '/cosmetics', title: 'Cosmetics', subtitle: 'Authentic Brands', desc: 'For every version of you', src: '/images/cosmetics-panel.jpg', alt: 'A perfume bottle beside a gold bracelet', mask: 'up' as const },
  { href: '/boutique', title: 'Boutique', subtitle: 'Ready-Made Fashion', desc: 'For every occasion', src: '/images/boutique-panel.jpg', alt: 'A woman in a flowing evening gown', mask: 'right' as const },
];

const FILTERS: ('ALL' | Division)[] = ['ALL', 'SALON', 'COSMETICS', 'BOUTIQUE'];

export default function HomeView() {
  const root = useRef<HTMLDivElement>(null);

  useMotion(root, ({ q, desktop }) => {
    /* ---- Hero: scroll-out. Wrappers move, children own their entrances, so nothing fights. ---- */
    const hero = q('.hero')[0];
    gsap
      .timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 } })
      .to(q('.hero__media'), { yPercent: desktop ? 12 : 8, scale: 1.08, ease: 'none' }, 0)
      .to(q('.hero__content'), { y: desktop ? -90 : -40, opacity: 0, ease: 'none' }, 0)
      .to(q('.hero__wordmark'), { y: desktop ? -70 : -20, ease: 'none' }, 0)
      .to(q('.hero__keywords, .hero__side-label, .hero__arrows, .hero__nav'), { opacity: 0, ease: 'none', duration: 0.5 }, 0);

    // wordmark letters rise on load
    gsap.fromTo(q('.hero__wordmark .ch'), { yPercent: 110, y: 0 }, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.045, delay: 0.15 });

    /* ---- Editorial: pinned; the frame opens to full bleed while the copy holds ---- */
    const editorial = q('.editorial')[0];
    if (desktop) {
      gsap
        .timeline({
          scrollTrigger: { trigger: editorial, start: 'top top', end: '+=90%', scrub: 1, pin: true, anticipatePin: 1 },
        })
        .fromTo(q('.editorial__frame'), { clipPath: 'inset(16% 20% 16% 20%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut' }, 0)
        .fromTo(q('.editorial__frame .media__inner'), { scale: 1.35 }, { scale: 1, ease: 'power2.out' }, 0)
        .fromTo(q('.editorial__badge-circle'), { rotation: -90 }, { rotation: 180, ease: 'none' }, 0)
        .fromTo(q('.editorial__content-inner'), { y: 40 }, { y: -40, ease: 'none' }, 0);
    } else {
      gsap.timeline({ scrollTrigger: { trigger: editorial, start: 'top 85%', once: true } })
        .fromTo(q('.editorial__frame'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' })
        .fromTo(q('.editorial__frame .media__inner'), { scale: 1.3 }, { scale: 1, duration: 2, ease: 'expo.out' }, 0.1);
      gsap.fromTo(
        q('.editorial__badge-circle'),
        { rotation: -90 },
        { rotation: 120, ease: 'none', scrollTrigger: { trigger: editorial, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    }

    /* ---- Quote: words brighten in reading order as the section crosses the viewport ---- */
    const quote = q('.quote-section')[0];
    gsap.fromTo(
      q('.quote-section .w'),
      { opacity: 0.14 },
      { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: quote, start: 'top 70%', end: 'center 40%', scrub: true } },
    );
    gsap.fromTo(
      q('.quote-section__bg-inner'),
      { scale: 1.3, yPercent: -6 },
      { scale: 1, yPercent: 6, ease: 'none', scrollTrigger: { trigger: quote, start: 'top bottom', end: 'bottom top', scrub: true } },
    );

    /* ---- Cursor depth on the hero portrait (its own wrapper, so it never fights the scroll tween) ---- */
    if (desktop) {
      const shift = q('.hero__shift')[0];
      const xTo = gsap.quickTo(shift, 'x', { duration: 1.2, ease: 'power3' });
      const yTo = gsap.quickTo(shift, 'y', { duration: 1.2, ease: 'power3' });
      const onMove = (e: PointerEvent) => {
        xTo((e.clientX / window.innerWidth - 0.5) * -16);
        yTo((e.clientY / window.innerHeight - 0.5) * -10);
      };
      hero.addEventListener('pointermove', onMove);
      return () => hero.removeEventListener('pointermove', onMove);
    }
  });

  return (
    <div ref={root}>
      <Hero />

      {/* ============ THREE DIVISIONS ============ */}
      <section className="divisions" id="divisions" aria-label="Our divisions">
        {DIVISIONS.map((d, i) => (
          <Link href={d.href} className="division" id={`division-${d.title.toLowerCase()}`} key={d.href} data-cursor="Enter">
            <Media
              src={d.src}
              alt={d.alt}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="division__media"
              mask={d.mask}
              delay={i * 0.12}
              parallax={0.14}
            />
            <div className="division__overlay" />
            <span className="division__index">{pad(i + 1)}</span>
            <div className="division__content">
              <Lines as="h2" className="division__title" lines={[d.title]} delay={0.25 + i * 0.12} />
              <p className="division__subtitle" data-fade data-delay={0.5 + i * 0.12}>{d.subtitle}</p>
              <p className="division__desc" data-fade data-delay={0.6 + i * 0.12}>{d.desc}</p>
              <span className="division__arrow" aria-hidden="true">
                <span className="division__arrow-line" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* ============ EDITORIAL STORY ============ */}
      <section className="editorial" id="editorial">
        <div className="editorial__image-container">
          <Media
            src="/images/editorial-beauty.jpg"
            alt="Close-up profile of a woman's face in black and white"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="editorial__frame"
          />
        </div>
        <div className="editorial__content">
          <div className="editorial__content-inner">
            <Label>Our Essence</Label>
            <Lines className="editorial__heading" lines={['Confidence', 'Looks Good', 'On You']} />
            <p className="editorial__text" data-fade data-delay={0.3}>
              At SHAIS.PK, we believe beauty, fashion and self-care are part of the same story — your story.
            </p>
            <Cta href="/about" variant="text" id="editorial-link">Our Story</Cta>

            <div className="editorial__badge" aria-hidden="true">
              <svg className="editorial__badge-circle" viewBox="0 0 100 100">
                <defs>
                  <path id="circlePath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                </defs>
                <text fontSize="8.5" fontWeight="500" letterSpacing="3.5" fill="currentColor" textAnchor="middle">
                  <textPath href="#circlePath" startOffset="50%">
                    BEAUTY · FASHION · LIFESTYLE ·
                  </textPath>
                </text>
              </svg>
              <span className="editorial__badge-star">✦</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ QUOTE ============ */}
      <section className="quote-section" id="quote">
        <div className="quote-section__bg" aria-hidden="true">
          <div className="quote-section__bg-inner">
            <Image src="/images/quote-bg.jpg" alt="" fill sizes="100vw" className="media__img" />
          </div>
        </div>
        <figure className="quote-section__content">
          <Words as="blockquote" className="quote-section__text" text="“A curated blend of beauty, fashion & lifestyle.”" />
          <figcaption className="quote-section__attribution">
            <span className="quote-section__rule" data-rule />
            SHAIS.PK
          </figcaption>
        </figure>
      </section>

      <Featured />
    </div>
  );
}

/* ================================================================== */
/* HERO — editorial slideshow; arrows, counter and keywords all work.  */
/* ================================================================== */
function Hero() {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<'next' | 'prev'>('next');
  const heroRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const paused = useRef(false);
  const holds = useRef(new Set<string>());

  // Using the controls hands the slideshow to the visitor: autoplay stops for good.
  const [manual, setManual] = useState(false);
  const choose = (to: number, direction?: 'next' | 'prev') => {
    setManual(true);
    go(to, direction);
  };

  const go = (to: number, direction?: 'next' | 'prev') => {
    const n = (to + SLIDES.length) % SLIDES.length;
    if (n === index) return;
    setPrev(index);
    setDir(direction ?? (n > index ? 'next' : 'prev'));
    setIndex(n);
  };
  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  });

  const hold = (key: string, on: boolean) => {
    if (on) holds.current.add(key);
    else holds.current.delete(key);
    paused.current = holds.current.size > 0;
  };

  // pause when off-screen or tab hidden
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => hold('view', !e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    const onVis = () => hold('tab', document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  // autoplay with a progress hairline; restarts on every slide change
  useEffect(() => {
    if (manual) {
      if (barRef.current) barRef.current.style.transform = 'scaleX(0)';
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      if (!paused.current) elapsed += dt;
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(elapsed / SLIDE_MS, 1)})`;
      if (elapsed >= SLIDE_MS) {
        goRef.current(index + 1, 'next');
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, manual]);

  const slideState = (i: number) => (i === index ? 'is-active' : i === prev ? 'is-prev' : '');

  return (
    <section
      className="hero"
      id="hero"
      ref={heroRef}
      aria-roledescription="carousel"
      aria-label="SHAIS.PK"
      onFocus={() => hold('focus', true)}
      onBlur={() => hold('focus', false)}
    >
      <span className="hero__side-label" aria-hidden="true">
        <span data-fade data-load data-delay={1.2}>Scroll</span>
      </span>

      <div className="hero__content">
        <div className="hero__categories" data-fade data-load data-delay={0.1}>
          <span className="hero__category">Beauty</span>
          <span className="hero__category">Fashion</span>
          <span className="hero__category">Lifestyle</span>
        </div>
        <div className="hero__category-line" data-rule data-load data-delay={0.2} />

        <h1 className="hero__wordmark" aria-label="SHAIS.PK">
          <span className="ln" aria-hidden="true">
            {'SHAIS.PK'.split('').map((c, i) => (
              <span className="ch" key={i}>{c}</span>
            ))}
          </span>
        </h1>

        <Lines as="p" className="hero__headline" lines={['More Than Beauty', 'A Way of Living']} reveal="load" delay={0.55} />

        <p className="hero__description" data-fade data-load data-delay={0.9}>
          A curated space for beauty, fashion and self-expression. Salon experiences, premium cosmetics and timeless
          ready-made fashion.
        </p>

        <div data-fade data-load data-delay={1.05}>
          <Cta href="/about" tone="light" id="hero-cta">Explore Our World</Cta>
        </div>

        <div className="hero__nav" aria-live="polite">
          <span className="hero__nav-counter">
            <span className="hero__nav-current" key={index}>{pad(index + 1)}</span>
            <span className="hero__nav-total"> / {pad(SLIDES.length)}</span>
          </span>
          <span className="hero__nav-bar" aria-hidden="true">
            <span ref={barRef} />
          </span>
          <span className="sr-only">{SLIDES[index].keyword}</span>
        </div>
      </div>

      <div
        className="hero__image-container"
        data-mask="up"
        data-load
        data-delay={0.05}
        onPointerEnter={() => hold('hover', true)}
        onPointerLeave={() => hold('hover', false)}
      >
        <div className="hero__media">
          <div className="hero__shift">
            <div className="hero__slides" data-dir={dir}>
              {SLIDES.map((s, i) => (
                <div
                  className={`hero__slide ${slideState(i)}`}
                  key={s.src}
                  aria-hidden={i !== index}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${SLIDES.length}: ${s.keyword}`}
                >
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    preload={i === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="hero__image"
                    style={{ objectPosition: s.pos }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hero__keywords">
        {SLIDES.map((s, i) => (
          <button
            key={s.keyword}
            type="button"
            className={`hero__keyword${i === index ? ' is-active' : ''}`}
            onClick={() => choose(i)}
            aria-label={`Show slide ${i + 1}: ${s.keyword}`}
            aria-current={i === index}
            data-fade
            data-load
            data-delay={0.9 + i * 0.08}
          >
            {s.keyword}
          </button>
        ))}
      </div>

      <div className="hero__arrows">
        <button className="hero__arrow-btn" aria-label="Previous slide" id="hero-prev" onClick={() => choose(index - 1, 'prev')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="hero__arrow-btn" aria-label="Next slide" id="hero-next" onClick={() => choose(index + 1, 'next')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}

/* ================================================================== */
/* FEATURED — filterable horizontal index of every offering.           */
/* ================================================================== */
function Featured() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('ALL');
  const [edges, setEdges] = useState({ start: true, end: false });
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const firstRun = useRef(true);

  const items = filter === 'ALL' ? ALL_OFFERINGS : ALL_OFFERINGS.filter((o) => o.division === filter);
  const count = (f: (typeof FILTERS)[number]) =>
    f === 'ALL' ? ALL_OFFERINGS.length : ALL_OFFERINGS.filter((o) => o.division === f).length;

  const syncEdges = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    if (barRef.current) {
      const visible = t.clientWidth / t.scrollWidth;
      const p = max > 0 ? t.scrollLeft / max : 0;
      barRef.current.style.transform = `translateX(${p * (1 / visible - 1) * 100}%)`;
      barRef.current.style.width = `${visible * 100}%`;
    }
    setEdges({ start: t.scrollLeft <= 2, end: t.scrollLeft >= max - 2 });
  }, []);

  // Card entrances: once on first view, then again whenever the filter changes.
  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;
    track.scrollLeft = 0;
    syncEdges();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const frames = track.querySelectorAll('.featured__item-frame');
      const texts = track.querySelectorAll('.featured__item-text');
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(frames, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut', stagger: 0.07 })
        .fromTo(track.querySelectorAll('.featured__item-frame .media__inner'), { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'expo.out', stagger: 0.07 }, 0.1)
        .fromTo(texts, { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.07 }, 0.5);
      if (firstRun.current) {
        ScrollTrigger.create({ trigger: track, start: 'top 85%', once: true, onEnter: () => tl.play() });
      } else {
        tl.play();
      }
    }, section);
    firstRun.current = false;
    return () => ctx.revert();
  }, [filter, syncEdges]);

  useEffect(() => {
    window.addEventListener('resize', syncEdges);
    return () => window.removeEventListener('resize', syncEdges);
  }, [syncEdges]);

  // Mouse drag-to-scroll (touch and trackpads already scroll natively).
  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = t.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4 && !moved) {
        moved = true;
        t.classList.add('is-dragging');
        t.setPointerCapture(e.pointerId);
      }
      if (moved) t.scrollLeft = startLeft - dx;
    };
    const up = () => {
      dragging = false;
      t.classList.remove('is-dragging');
    };
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    t.addEventListener('pointerdown', down);
    t.addEventListener('pointermove', move);
    t.addEventListener('pointerup', up);
    t.addEventListener('pointercancel', up);
    t.addEventListener('click', click, true);
    return () => {
      t.removeEventListener('pointerdown', down);
      t.removeEventListener('pointermove', move);
      t.removeEventListener('pointerup', up);
      t.removeEventListener('pointercancel', up);
      t.removeEventListener('click', click, true);
    };
  }, []);

  const step = (d: 1 | -1) => {
    const t = trackRef.current;
    const card = t?.querySelector<HTMLElement>('.featured__item');
    if (!t || !card) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    t.scrollBy({ left: d * (card.offsetWidth + 24) * (window.innerWidth > 768 ? 2 : 1), behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section className="featured" id="featured" ref={sectionRef}>
      <div className="featured__header">
        <div className="featured__header-left">
          <Label>Featured</Label>
          <Lines className="featured__title" lines={['Discover More']} />
        </div>
        <div className="featured__header-right">
          <div className="featured__filters" role="group" aria-label="Filter by division">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`featured__filter${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                id={`filter-${f.toLowerCase()}`}
              >
                {f}
                <sup>{pad(count(f))}</sup>
              </button>
            ))}
          </div>
          <div className="featured__nav-arrows">
            <button className="featured__nav-btn" aria-label="Scroll back" id="featured-prev" onClick={() => step(-1)} disabled={edges.start}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="featured__nav-btn" aria-label="Scroll forward" id="featured-next" onClick={() => step(1)} disabled={edges.end}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="featured__track" ref={trackRef} onScroll={syncEdges} role="region" aria-label="Featured offerings" tabIndex={0}>
        {items.map((o, i) => (
          <Link href={o.href} className="featured__item" key={o.id} data-cursor="View" draggable={false}>
            <Media src={o.image} alt="" sizes="(max-width: 768px) 70vw, 24vw" className="featured__item-frame" />
            <div className="featured__item-text">
              <span className="featured__item-meta">
                <span>{pad(i + 1)}</span>
                <span>{o.division}</span>
              </span>
              <h3 className="featured__item-title">{o.title}</h3>
              {o.subtitle && <p className="featured__item-sub">{o.subtitle}</p>}
            </div>
          </Link>
        ))}
      </div>
      <div className="featured__progress" aria-hidden="true">
        <span ref={barRef} />
      </div>
    </section>
  );
}
