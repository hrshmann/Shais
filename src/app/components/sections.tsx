import Image from 'next/image';
import type { ReactNode } from 'react';
import { Cta, Label, Lines, pad } from './primitives';

/* ------------------------------------------------------------------ */
/* NumberedList — sticky heading beside hairline-ruled numbered rows.  */
/* Replaces the four-up icon-card grids.                               */
/* ------------------------------------------------------------------ */
type Row = { title: string; desc: string };

export function NumberedList({
  label, heading, rows, id,
}: { label: string; heading: ReactNode[]; rows: Row[]; id?: string }) {
  return (
    <section className="numbered" id={id}>
      <div className="numbered__head">
        <Label>{label}</Label>
        <Lines className="numbered__heading" lines={heading} />
      </div>
      <ol className="numbered__list">
        {rows.map((r, i) => (
          <li className="numbered__row" key={r.title}>
            <span className="numbered__rule" data-rule data-delay={0.05 * i} />
            <span className="numbered__num" data-fade data-delay={0.1}>{pad(i + 1)}</span>
            <h3 className="numbered__title">
              <Lines as="span" lines={[r.title]} delay={0.1} />
            </h3>
            <p className="numbered__desc" data-fade data-delay={0.25}>{r.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* ClosingCta — full-bleed image, heading and one clear action.        */
/* Background scrub lives in the page setup via .closing__bg-inner.    */
/* ------------------------------------------------------------------ */
export function ClosingCta({
  image, heading, text, href, action, id, actionId, secondary,
}: {
  image: string;
  heading: ReactNode[];
  text: string;
  href: string;
  action: string;
  id?: string;
  actionId?: string;
  secondary?: ReactNode;
}) {
  return (
    <section className="closing" id={id}>
      <div className="closing__bg" aria-hidden="true" data-mask="center">
        <div className="closing__bg-inner media__inner">
          <Image src={image} alt="" fill sizes="100vw" className="media__img" />
        </div>
      </div>
      <div className="closing__overlay" />
      <div className="closing__content">
        <Lines className="closing__heading" lines={heading} delay={0.3} />
        <p className="closing__text" data-fade data-delay={0.6}>{text}</p>
        <div className="closing__actions" data-fade data-delay={0.75}>
          <Cta href={href} tone="light" id={actionId}>{action}</Cta>
          {secondary}
        </div>
      </div>
    </section>
  );
}
