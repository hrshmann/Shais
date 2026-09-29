'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '../lib/site';
import ThemeSwitcher from './theme-switcher';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  // Close the menu on navigation (render-time reset, keyed on the route).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setHidden(false);
  }

  // Hide while reading downwards, return on any upward scroll.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 160);
        lastY = y;
      }
      setScrolled(y > 8);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menu: lock page scroll, close on Escape, return focus to the toggle.
  useEffect(() => {
    if (!menuOpen) return;
    const html = document.documentElement;
    html.classList.add('menu-open');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      html.classList.remove('menu-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`nav${hidden && !menuOpen ? ' nav--hidden' : ''}${scrolled ? ' nav--scrolled' : ''}`}
        id="main-nav"
        aria-label="Primary"
      >
        <Link href="/" className="nav__logo" aria-label="SHAIS.PK — Home">
          SHAIS.PK
        </Link>

        <div className="nav__links">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav__link${isActive(l.href) ? ' is-active' : ''}`}
              aria-current={isActive(l.href) ? 'page' : undefined}
            >
              <span className="nav__link-roll" data-text={l.label}>
                {l.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="nav__right">
          <ThemeSwitcher />
          <Link href="/contact" className="nav__book">
            Book an Appointment
          </Link>
        </div>

        <button
          ref={toggleRef}
          className={`nav__hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          id="nav-hamburger"
        >
          <span />
          <span />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`nav__mobile-menu${menuOpen ? ' open' : ''}`}
        inert={!menuOpen}
        aria-hidden={!menuOpen}
      >
        <ol className="nav__mobile-list">
          {NAV_LINKS.map((l, i) => (
            <li key={l.href} style={{ '--i': i } as React.CSSProperties}>
              <Link
                href={l.href}
                className={`nav__mobile-link${isActive(l.href) ? ' is-active' : ''}`}
                aria-current={isActive(l.href) ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav__mobile-num">{String(i + 1).padStart(2, '0')}</span>
                {l.label}
              </Link>
            </li>
          ))}
        </ol>
        <div className="nav__mobile-foot">
          <p>Beauty · Fashion · Lifestyle</p>
          <ThemeSwitcher placement="menu" />
        </div>
      </div>
    </>
  );
}
