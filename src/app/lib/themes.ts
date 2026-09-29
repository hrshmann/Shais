/**
 * Theme registry. Visual tokens live in styles/themes.css — ids must match.
 * Add a theme: add an entry here + a token block in themes.css.
 */
export const THEMES = [
  {
    id: 'obsidian',
    name: 'Obsidian Luxury',
    note: 'Black, white and charcoal. Cinematic monochrome.',
    swatch: ['#000000', '#ffffff', '#1c1c1c'],
  },
  {
    id: 'blush',
    name: 'Blush Atelier',
    note: 'Powder blush, muted rose and rose-toned photography.',
    swatch: ['#ebd5d2', '#fcf7f6', '#96545e'],
  },
  {
    id: 'ivory',
    name: 'Ivory Editorial',
    note: 'Airy white and stone, charcoal type, softened imagery.',
    swatch: ['#e8e7e3', '#fcfcfa', '#1e1e1e'],
  },
  {
    id: 'noir',
    name: 'Noir Rouge',
    note: 'Near-black, deep burgundy scenes, wine-toned photography.',
    swatch: ['#3c0c17', '#110c0d', '#d46874'],
  },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export const DEFAULT_THEME: ThemeId = 'obsidian';

export const THEME_IDS = THEMES.map((t) => t.id) as readonly ThemeId[];

export function isThemeId(v: unknown): v is ThemeId {
  return typeof v === 'string' && (THEME_IDS as readonly string[]).includes(v);
}

export function themeName(id: ThemeId) {
  return THEMES.find((t) => t.id === id)?.name ?? id;
}

/** localStorage key for a visitor's personal preference (never sent to the server). */
export const VISITOR_THEME_KEY = 'shais-theme';
/** Query parameter the admin preview uses; applied for that page view only. */
export const PREVIEW_PARAM = 'preview-theme';
