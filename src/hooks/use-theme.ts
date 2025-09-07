import { useKV } from '@github/spark/hooks';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useKV<Theme>('theme', 'system');
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Monitor system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateSystemTheme = () => {
      const newSystemTheme = mediaQuery.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
    };

    // Set initial system theme
    updateSystemTheme();

    // Listen for changes
    mediaQuery.addEventListener('change', updateSystemTheme);

    return () => {
      mediaQuery.removeEventListener('change', updateSystemTheme);
    };
  }, []);

  // Update resolved theme when theme or system theme changes
  useEffect(() => {
    const newResolvedTheme = theme === 'system' ? systemTheme : theme;
    setResolvedTheme(newResolvedTheme);

    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newResolvedTheme);
    
    // Also set data attribute for better CSS targeting
    root.setAttribute('data-theme', newResolvedTheme);
  }, [theme, systemTheme]);

  return {
    theme,
    resolvedTheme,
    systemTheme,
    setTheme,
    isSystemTheme: theme === 'system'
  };
}