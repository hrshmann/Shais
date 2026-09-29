import Link from 'next/link';
import { SITE, socialLinks } from '../lib/site';

export default function Footer() {
  const social = socialLinks();
  const { email, phone } = SITE.contact;

  return (
    <footer className="footer" id="site-footer">
      <div className="footer__top">
        <p className="footer__statement">
          More than beauty.
          <br />
          <em>A way of living.</em>
        </p>
        <div className="footer__columns">
          <div>
            <p className="footer__column-title">Explore</p>
            <ul className="footer__column-links">
              <li><Link href="/salon" className="footer__column-link">Salon</Link></li>
              <li><Link href="/cosmetics" className="footer__column-link">Cosmetics</Link></li>
              <li><Link href="/boutique" className="footer__column-link">Boutique</Link></li>
            </ul>
          </div>
          <div>
            <p className="footer__column-title">Company</p>
            <ul className="footer__column-links">
              <li><Link href="/about" className="footer__column-link">About</Link></li>
              <li><Link href="/contact" className="footer__column-link">Contact</Link></li>
            </ul>
          </div>
          {(social.length > 0 || email || phone) && (
            <div>
              <p className="footer__column-title">Connect</p>
              <ul className="footer__column-links">
                {social.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} className="footer__column-link" target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
                {email && (
                  <li><a href={`mailto:${email}`} className="footer__column-link">{email}</a></li>
                )}
                {phone && (
                  <li><a href={`tel:${phone.replace(/\s/g, '')}`} className="footer__column-link">{phone}</a></li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      <p className="footer__wordmark" aria-hidden="true">
        SHAIS<span>.PK</span>
      </p>

      <div className="footer__bottom">
        <span className="footer__copyright">
          &copy; {new Date().getFullYear()} SHAIS.PK. All rights reserved.
        </span>
        <span className="footer__copyright">Salon · Cosmetics · Boutique</span>
      </div>
    </footer>
  );
}
