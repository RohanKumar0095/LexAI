import { useEffect, useState } from 'react';
import type { UserSettings } from '../types/user';

type Theme = UserSettings['theme'];

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('lexai-theme') as Theme;
    return saved || 'dark'; // Let's default to dark for the sleek premium AI aesthetic!
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    
    // Helper to apply classes
    const applyTheme = (t: 'light' | 'dark') => {
      if (t === 'dark') {
        root.classList.add('dark');
        body.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        body.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      applyTheme(systemTheme);

      // Listen to system changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyTheme(theme);
    }

    localStorage.setItem('lexai-theme', theme);
  }, [theme]);

  return { theme, setTheme };
};
