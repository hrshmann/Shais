'use client';

import { useRef } from 'react';
import { useMotion, gsap } from '../../lib/motion';
import { BOUTIQUE_COLLECTIONS } from '../../lib/content';
import { Label, Lines, Media, pad } from '../../components/primitives';
import { ClosingCta, NumberedList } from '../../components/sections';
import { waMessage } from '../../lib/whatsapp';
import { WhatsAppCta } from '../../components/whatsapp';


const WHY = [
  { title: 'Personal Styling', desc: 'Our in-house stylists help you find pieces that flatter and inspire.' },
  { title: 'Quality Fabrics', desc: 'Every piece is crafted from premium materials built to last.' },
  // TODO(owner): confirm these two claims before launch.
  { title: 'Exclusive Pieces', desc: 'Limited edition designs you won’t find anywhere else.' },
  { title: 'Custom Alterations', desc: 'Perfect fit guaranteed with our tailoring and alteration services.' },
];

export default function BoutiqueView() {
  const root = useRef<HTMLDivElement>(null);

  useMotion(root, ({ q, desktop }) => {
    /* ---- Hero: image settles while the title lines separate at different speeds ---- */
    const hero = q('.bq-hero')[0];
    gsap
      .timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 } })
      .to(q('.bq-hero__media'), { yPercent: 14, ease: 'none' }, 0)
      .to(q('.bq-hero__title .ln:nth-child(1)'), { yPercent: desktop ? -60 : -20, ease: 'none' }, 0)
      .to(q('.bq-hero__title .ln:nth-child(2)'), { yPercent: desktop ? -30 : -10, ease: 'none' }, 0)
      .to(q('.bq-hero__foot'), { opacity: 0, ease: 'none', duration: 0.4 }, 0);

    /* ---- Collections: pinned horizontal sequence on desktop ---- */
    if (desktop) {
      const section = q('.bq-coll')[0];
      const track = q('.bq-coll__track')[0];
      const distance = () => track.scrollWidth - window.innerWidth;
      const move = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      gsap.fromTo(q('.bq-coll__progress span'), { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
      });
      // each panel's image counter-drifts inside its frame while the track moves
      q('.bq-coll__panel').forEach((panel) => {
        gsap.fromTo(panel.querySelector('.media__inner'), { xPercent: -8 }, {
          xPercent: 8, ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
        });
        gsap.fromTo(panel.querySelector('.bq-coll__num'), { xPercent: 60 }, {
          xPercent: -60, ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
        });
      });
    }

    /* ---- Lookbook: the word sits behind and moves against the images ---- */
    gsap.fromTo(q('.bq-look__word'), { xPercent: 8 }, {
      xPercent: -18, ease: 'none',
      scrollTrigger: { trigger: q('.bq-look')[0], start: 'top bottom', end: 'bottom top', scrub: true },
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
      <section className="bq-hero" id="boutique-hero">
        <Media
          src="/images/boutique-panel.jpg"
          alt="A woman in a flowing evening gown, caught mid-movement"
          sizes="100vw"
          className="bq-hero__media"
          mask="up"
          load
          preload
        />
        <div className="bq-hero__shade" />
        <div className="bq-hero__content">
          <Label tone="light">Our Boutique</Label>
          <Lines
            as="h1"
            className="bq-hero__title"
            reveal="load"
            delay={0.5}
            lines={['Ready-Made', 'Fashion for', <em key="o">Every Occasion</em>]}
          />
        </div>
        <div className="bq-hero__foot">
          <p className="bq-hero__sub" data-fade data-load data-delay={1.1}>
            Timeless pieces and contemporary designs curated for the modern woman.
          </p>
          <span className="scroll-cue scroll-cue--light scroll-cue--inline" aria-hidden="true">
            <span className="scroll-cue__text">Scroll</span>
            <span className="scroll-cue__line" />
          </span>
        </div>
      </section>

      {/* ============ PHILOSOPHY ============ */}
      <section className="bq-intro" id="boutique-intro">
        <div className="bq-intro__head">
          <Label>Our Philosophy</Label>
          <Lines className="bq-intro__heading" lines={['Fashion That', <em key="s">Speaks for You</em>]} />
        </div>
        <Media
          src="/images/hero-portrait.jpg"
          alt="Portrait of a woman in a tailored black jacket"
          sizes="(max-width: 768px) 80vw, 28vw"
          className="bq-intro__image"
          mask="up"
          parallax={0.2}
        />
        <div className="bq-intro__body">
          <p className="bq-intro__text" data-fade>
            Our boutique is a carefully curated space where timeless elegance meets contemporary style. Each piece in
            our collection is selected with an eye for quality, fit, and the kind of confidence that comes from
            wearing something truly special.
          </p>
          <p className="bq-intro__text" data-fade data-delay={0.15}>
            From boardroom-ready formals to weekend casual luxe, we believe every woman deserves a wardrobe that makes
            her feel unstoppable. Our in-house stylists are always on hand to help you put together the perfect look.
          </p>
        </div>
      </section>

      {/* ============ COLLECTIONS (horizontal) ============ */}
      <section className="bq-coll" id="collections" aria-label="Collections">
        <div className="bq-coll__track">
          <div className="bq-coll__intro">
            <Label tone="light">Shop the Edit</Label>
            <Lines className="bq-coll__heading" lines={['The', <em key="c">Collections</em>]} />
            <p className="bq-coll__hint" data-fade data-delay={0.4}>
              {pad(BOUTIQUE_COLLECTIONS.length)} edits — Formals to Bridal
            </p>
          </div>
          {BOUTIQUE_COLLECTIONS.map((c, i) => (
            <article className="bq-coll__panel" key={c.id} id={c.id}>
              <span className="bq-coll__num" aria-hidden="true">{pad(i + 1)}</span>
              <Media
                src={c.image}
                alt=""
                sizes="(max-width: 768px) 90vw, 38vw"
                className="bq-coll__media"
                mask="up"
                cursor={c.title}
              />
              <div className="bq-coll__text">
                <h3 className="bq-coll__title">{c.title}</h3>
                <p className="bq-coll__desc">{c.description}</p>
                <WhatsAppCta
                  variant="text"
                  className="bq-coll__cta"
                  message={waMessage.item('Boutique', `the ${c.title} collection`)}
                  label={`Enquire about ${c.title}`}
                />
              </div>
            </article>
          ))}
        </div>
        <div className="bq-coll__progress" aria-hidden="true"><span /></div>
      </section>

      {/* ============ LOOKBOOK ============ */}
      <section className="bq-look" id="boutique-lookbook" aria-labelledby="lookbook-heading">
        <p className="bq-look__word" aria-hidden="true">Lookbook</p>
        <div className="bq-look__head">
          <Label>Editorial</Label>
          <Lines className="bq-look__heading" id="lookbook-heading" lines={['Lookbook']} />
        </div>
        <div className="bq-look__collage">
          <div className="bq-look__cell bq-look__cell--a" data-drift="40">
            <Media src="/images/salon-editorial-portrait.jpg" alt="Portrait of a woman in a high-neck top" sizes="(max-width: 768px) 60vw, 30vw" className="bq-look__media" mask="up" parallax={0.18} />
          </div>
          <div className="bq-look__cell bq-look__cell--b" data-drift="-60">
            <Media src="/images/boutique-hero.jpg" alt="Garments hanging along a dark boutique interior" sizes="(max-width: 768px) 90vw, 44vw" className="bq-look__media" mask="left" delay={0.15} parallax={0.14} />
          </div>
          <div className="bq-look__cell bq-look__cell--c" data-drift="90">
            <Media src="/images/quote-bg.jpg" alt="Detail of a knitted v-neck top" sizes="(max-width: 768px) 60vw, 24vw" className="bq-look__media" mask="up" delay={0.3} parallax={0.2} />
          </div>
        </div>
      </section>

      <NumberedList
        id="boutique-features"
        label="The Boutique Experience"
        heading={['Why Shop', <em key="w">With Us</em>]}
        rows={WHY}
      />

      <ClosingCta
        id="boutique-cta"
        image="/images/boutique-hero.jpg"
        heading={['Find Your', <em key="s">Signature Style</em>]}
        text="Visit our boutique for a personalised styling experience."
        href="/contact"
        action="Visit the Boutique"
        actionId="boutique-visit-btn"
        secondary={<WhatsAppCta variant="text" message={waMessage.item('Boutique', 'your boutique collections')} label="Ask on WhatsApp" />}
      />
    </div>
  );
}
