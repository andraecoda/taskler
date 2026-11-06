'use client';

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'kobo-theme';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function subscribeToThemeClass(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

function getThemeSnapshot(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getServerThemeSnapshot(): Theme {
  return 'light';
}

/**
 * Only affects pages built on the new premium (light/dark) design tokens — the dashboard and its
 * legacy `ink`/`paper` tokens are static, unaffected by the `dark` class this toggles.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Tracks the `dark` class on <html> as an external store, so the pre-hydration script's DOM
  // change (see THEME_INIT_SCRIPT) is picked up correctly without a hydration mismatch.
  const theme = useSyncExternalStore(subscribeToThemeClass, getThemeSnapshot, getServerThemeSnapshot);

  const toggleTheme = useCallback(() => {
    const next: Theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing / storage disabled — theme just won't persist across visits.
    }
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

/** Inline, pre-hydration script that applies the saved/OS theme before first paint (no flash). */
export const THEME_INIT_SCRIPT = `
try {
  var t = localStorage.getItem('${STORAGE_KEY}');
  var isDark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) document.documentElement.classList.add('dark');
} catch (e) {}
`;
