export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'agro_theme_preference';

/**
 * Get stored theme preference or default to system
 */
export const getStoredTheme = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch (e) {
    console.warn('Unable to access localStorage for theme preference:', e);
  }
  return 'system';
};

/**
 * Apply theme mode to root document class list
 */
export const applyTheme = (theme: ThemeMode): void => {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.warn('Failed to persist theme:', e);
  }
};
