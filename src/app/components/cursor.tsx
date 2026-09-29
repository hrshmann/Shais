'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '../lib/motion';

/**
 * Desktop-only cursor companion. The native cursor stays visible; this dot
 * trails it and opens into a labelled disc over anything marked [data-cursor].
 * Disabled for touch input and reduced motion.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const label = labelRef.current;
    if (!el || !label) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduce.matches) return;

    el.hidden = false;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' });
    let current: Element | null = null;
    let shown = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.classList.add('is-visible');
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const zone = target?.closest?.('[data-cursor]') ?? null;
      if (zone !== current) {
        current = zone;
        const text = zone?.getAttribute('data-cursor') ?? '';
        label.textContent = text;
        el.classList.toggle('is-media', !!zone);
      }
      el.classList.toggle('is-link', !zone && !!target?.closest?.('a, button, [role="button"]'));
    };

    const onLeave = () => {
      el.classList.remove('is-visible');
      shown = false;
    };
    const onDown = () => el.classList.add('is-down');
    const onUp = () => el.classList.remove('is-down');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      gsap.killTweensOf(el);
      el.hidden = true;
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true" hidden>
      <span className="cursor__disc" />
      <span ref={labelRef} className="cursor__label" />
    </div>
  );
}
