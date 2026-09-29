import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ElementType, ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Lines — a heading split into authored lines, each inside its own    */
/* mask so it can rise into place. Real text, so it reads normally to  */
/* assistive tech; the trailing space keeps words apart when flattened.*/
/* ------------------------------------------------------------------ */
type LinesProps = {
  as?: ElementType;
  lines: ReactNode[];
  className?: string;
  /** 'load' plays immediately; otherwise on scroll into view. `false` renders static lines. */
  reveal?: 'scroll' | 'load' | false;
  delay?: number;
  id?: string;
};

export function Lines({ as: Tag = 'h2', lines, className, reveal = 'scroll', delay, id }: LinesProps) {
  return (
    <Tag
      id={id}
      className={className}
      data-lines={reveal === false ? undefined : reveal}
      data-delay={delay}
    >
      {lines.map((line, i) => (
        <span className="ln" key={i}>
          <span className="ln-i">{line}</span>
          {i < lines.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Words — paragraph split into words for scroll-linked highlighting.  */
/* ------------------------------------------------------------------ */
export function Words({ text, className, as: Tag = 'p' }: { text: string; className?: string; as?: ElementType }) {
  const words = text.split(' ');
  return (
    <Tag className={className}>
      {words.map((w, i) => (
        <span className="w" key={i}>
          {w}
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Media — framed image with optional mask reveal + inner parallax.    */
/* ------------------------------------------------------------------ */
type MediaProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  mask?: 'up' | 'down' | 'left' | 'right' | 'center';
  /** play the mask on mount rather than on scroll */
  load?: boolean;
  delay?: number;
  parallax?: number;
  preload?: boolean;
  cursor?: string;
  imgClassName?: string;
  style?: CSSProperties;
};

export function Media({
  src, alt, sizes, className, mask, load, delay, parallax, preload, cursor, imgClassName, style,
}: MediaProps) {
  const inset = parallax ? `${-(parallax * 50)}% 0` : undefined;
  return (
    <div
      className={`media${className ? ` ${className}` : ''}`}
      data-mask={mask}
      data-load={mask && load ? '' : undefined}
      data-delay={delay}
      data-cursor={cursor}
      style={style}
    >
      <div className="media__inner" data-parallax={parallax} style={inset ? { inset } : undefined}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          className={`media__img${imgClassName ? ` ${imgClassName}` : ''}`}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Label — small tracked caption with a drawn hairline.                */
/* ------------------------------------------------------------------ */
export function Label({ children, className, tone = 'dark' }: { children: ReactNode; className?: string; tone?: 'dark' | 'light' }) {
  return (
    <span className={`label label--${tone}${className ? ` ${className}` : ''}`}>
      <span className="label__rule" data-rule />
      <span data-fade>{children}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Cta — outlined button whose fill wipes up on hover.                 */
/* ------------------------------------------------------------------ */
type CtaProps = {
  href: string;
  children: ReactNode;
  tone?: 'light' | 'dark';
  variant?: 'outline' | 'text';
  external?: boolean;
  className?: string;
  id?: string;
};

export function Cta({ href, children, tone = 'dark', variant = 'outline', external, className, id }: CtaProps) {
  const cls = `cta cta--${variant} cta--${tone}${className ? ` ${className}` : ''}`;
  const inner = (
    <>
      <span className="cta__text">
        <span className="cta__roll" data-text={typeof children === 'string' ? children : undefined}>
          {children}
        </span>
      </span>
      <span className="cta__arrow" aria-hidden="true" />
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} id={id} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} id={id}>
      {inner}
    </Link>
  );
}

export const pad = (n: number) => String(n).padStart(2, '0');
