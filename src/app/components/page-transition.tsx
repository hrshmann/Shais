'use client';

import { ViewTransition, type ReactNode } from 'react';

/**
 * Route transition: the outgoing page recedes while the incoming page
 * wipes up over it (see ::view-transition-*(.page) in globals.css).
 * Browsers without the View Transitions API simply swap pages.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <div className="page">{children}</div>
    </ViewTransition>
  );
}
