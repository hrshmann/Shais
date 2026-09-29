'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ThemeId } from '../lib/themes';

type Ctx = { whatsapp: string; defaultTheme: ThemeId };

const SiteSettingsContext = createContext<Ctx>({ whatsapp: '', defaultTheme: 'obsidian' });

export function SiteSettingsProvider({ children, ...value }: Ctx & { children: ReactNode }) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
