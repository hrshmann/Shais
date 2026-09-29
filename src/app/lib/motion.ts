'use client';

import { useEffect, useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const BP_DESKTOP = '(min-width: 769px)';

/** Starting clip for each [data-mask] direction — mirrored in globals.css so there is no flash before JS runs. */
const CLIP_FROM: Record<string, string> = {
  up: 'inset(100% 0% 0% 0%)',
  down: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
  center: 'inset(16% 16% 16% 16%)',
};
const CLIP_OPEN = 'inset(0% 0% 0% 0%)';

export type MotionScope = {
  root: HTMLElement;
  q: (selector: string) => HTMLElement[];
  desktop: boolean;
};

declare global {
  interface Window {
    __shaisMotion?: boolean;
  }
}

const num = (v: string | undefined, fallback = 0) => {
  const n = parseFloat(v ?? '');
  return Number.isFinite(n) ? n : fallback;
};

/**
 * Declarative vocabulary (all scoped to the page root):
 *
 *  data-lines[="load"]   heading built with <Lines>; each line rises out of its own mask
 *  data-mask="up|down|left|right|center"[+ data-load]
 *                        image frame opens via clip-path while its .media__inner settles from 1.3x
 *  data-parallax="0.2"   image layer drifts inside its frame (scrubbed)
 *  data-drift="80"       layer translates +80px → -80px across its pass (layered typography)
 *  data-rule             hairline draws from the left
 *  data-fade             opacity-only entrance for supporting copy
 *  data-delay="0.2"      delay for any entrance above
 */
function applyDeclarative({ q, desktop }: MotionScope) {
  const entrance = (el: HTMLElement, tl: gsap.core.Timeline | gsap.core.Tween) => {
    if (el.hasAttribute('data-load') || el.dataset.lines === 'load') return;
    ScrollTrigger.create({
      trigger: el,
      start: el.dataset.start ?? 'top 88%',
      once: true,
      onEnter: () => tl.play(),
    });
  };

  q('[data-lines]').forEach((el) => {
    const lines = el.querySelectorAll('.ln-i');
    const tween = gsap.fromTo(
      lines,
      { yPercent: 115, y: 0 },
      {
        yPercent: 0,
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.09,
        delay: num(el.dataset.delay),
        paused: el.dataset.lines !== 'load',
      },
    );
    entrance(el, tween);
  });

  q('[data-mask]').forEach((el) => {
    const from = CLIP_FROM[el.dataset.mask ?? 'up'] ?? CLIP_FROM.up;
    const inner = el.querySelector<HTMLElement>('.media__inner');
    const tl = gsap.timeline({ paused: !el.hasAttribute('data-load'), delay: num(el.dataset.delay) });
    tl.fromTo(el, { clipPath: from }, { clipPath: CLIP_OPEN, duration: 1.5, ease: 'expo.inOut' });
    if (inner) tl.fromTo(inner, { scale: 1.3 }, { scale: 1, duration: 2.1, ease: 'expo.out' }, 0.1);
    entrance(el, tl);
  });

  q('[data-rule]').forEach((el) => {
    const tween = gsap.fromTo(
      el,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.4, ease: 'expo.inOut', delay: num(el.dataset.delay), paused: true },
    );
    if (el.hasAttribute('data-load')) tween.play();
    else entrance(el, tween);
  });

  q('[data-fade]').forEach((el) => {
    const tween = gsap.fromTo(
      el,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: 'power2.out', delay: num(el.dataset.delay), paused: true },
    );
    if (el.hasAttribute('data-load')) tween.play();
    else entrance(el, tween);
  });

  q('[data-parallax]').forEach((el) => {
    const frame = el.parentElement;
    if (!frame) return;
    const s = num(el.dataset.parallax, 0.15) * (desktop ? 1 : 0.6);
    gsap.fromTo(
      el,
      { y: () => (-frame.offsetHeight * s) / 2 },
      {
        y: () => (frame.offsetHeight * s) / 2,
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      },
    );
  });

  q('[data-drift]').forEach((el) => {
    const d = num(el.dataset.drift) * (desktop ? 1 : 0.4);
    gsap.fromTo(
      el,
      { y: d },
      { y: -d, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
}

/**
 * Runs the declarative motion vocabulary inside `scope`, plus an optional bespoke
 * `setup` for page-specific timelines. Everything is created inside gsap.matchMedia,
 * so it re-builds when crossing the desktop breakpoint and is fully reverted on unmount.
 * Reduced motion: nothing is created and the CSS resting state is shown.
 */
export function useMotion(
  scope: RefObject<HTMLElement | null>,
  setup?: (s: MotionScope) => void | (() => void),
) {
  useIsoLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    window.__shaisMotion = true;

    const mm = gsap.matchMedia(root);
    mm.add(
      // matchMedia only runs the callback when at least one condition matches,
      // so `mobile` must be listed explicitly even though only `desktop` is read.
      { desktop: BP_DESKTOP, mobile: '(max-width: 768px)', reduce: '(prefers-reduced-motion: reduce)' },
      (ctx) => {
        const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
        if (reduce) {
          document.documentElement.classList.remove('has-motion');
          return;
        }
        document.documentElement.classList.add('has-motion');
        const s: MotionScope = { root, q: gsap.utils.selector(root) as MotionScope['q'], desktop };
        applyDeclarative(s);
        const cleanup = setup?.(s);
        // Declarative triggers are created before any pins in `setup`; sort by start
        // position so pin spacing is accounted for when positions are calculated.
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
        return cleanup;
      },
    );

    // Late layout shifts (web fonts, images without intrinsic size) move trigger positions.
    let cancelled = false;
    document.fonts?.ready.then(() => !cancelled && ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      cancelled = true;
      window.removeEventListener('load', onLoad);
      mm.revert();
    };
    // setup is intentionally captured once per mount
  }, []);
}
