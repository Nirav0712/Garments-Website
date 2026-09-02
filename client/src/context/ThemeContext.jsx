import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const DEFAULT_THEME = {
  primary_color: '#111111',
  secondary_color: '#555555',
  accent_color: '#2563EB',
  background_color: '#FFFFFF',
  surface_color: '#F8F8F8',
  card_background: '#FFFFFF',
  border_color: '#E5E5E5',
  heading_color: '#111111',
  text_color: '#555555',
  button_background: '#111111',
  button_text: '#FFFFFF',
  button_hover: '#333333',
  header_background: '#FFFFFF',
  header_text: '#111111',
  footer_background: '#111111',
  footer_text: '#FFFFFF',
  success_color: '#16A34A',
  warning_color: '#F59E0B',
  error_color: '#DC2626',
  button_radius: '4px',
};

const ThemeContext = createContext();

// Apply CSS variables to :root
export const applyThemeToDocument = (themeObj) => {
  const root = document.documentElement;
  const t = { ...DEFAULT_THEME, ...themeObj };

  root.style.setProperty('--color-primary', t.primary_color);
  root.style.setProperty('--color-secondary', t.secondary_color);
  root.style.setProperty('--color-accent', t.accent_color);
  root.style.setProperty('--color-background', t.background_color);
  root.style.setProperty('--color-surface', t.surface_color);
  root.style.setProperty('--color-card', t.card_background);
  root.style.setProperty('--color-border', t.border_color);
  root.style.setProperty('--color-heading', t.heading_color);
  root.style.setProperty('--color-text', t.text_color);
  root.style.setProperty('--color-button', t.button_background);
  root.style.setProperty('--color-button-text', t.button_text);
  root.style.setProperty('--color-button-hover', t.button_hover);
  root.style.setProperty('--color-header', t.header_background);
  root.style.setProperty('--color-header-text', t.header_text);
  root.style.setProperty('--color-footer', t.footer_background);
  root.style.setProperty('--color-footer-text', t.footer_text);
  root.style.setProperty('--color-success', t.success_color);
  root.style.setProperty('--color-warning', t.warning_color);
  root.style.setProperty('--color-error', t.error_color);
  root.style.setProperty('--button-radius', t.button_radius || '4px');
};

// Calculate color contrast ratio for accessibility
export const getContrastRatio = (hex1, hex2) => {
  const getLuminance = (hex) => {
    if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return 0.5;
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) return 0.5;
    const rgb = [
      parseInt(cleanHex.substr(0, 2), 16) / 255,
      parseInt(cleanHex.substr(2, 2), 16) / 255,
      parseInt(cleanHex.substr(4, 2), 16) / 255,
    ].map((val) => (val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)));

    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return parseFloat(ratio.toFixed(2));
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);

  const fetchTheme = useCallback(async () => {
    try {
      const res = await api.get('/settings/theme');
      if (res.data?.success && res.data.theme) {
        const loadedTheme = { ...DEFAULT_THEME, ...res.data.theme };
        setTheme(loadedTheme);
        applyThemeToDocument(loadedTheme);
      } else {
        applyThemeToDocument(DEFAULT_THEME);
      }
    } catch (err) {
      console.warn('Could not load theme from API, applying default theme');
      applyThemeToDocument(DEFAULT_THEME);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  const updateTheme = async (newThemePayload) => {
    const merged = { ...theme, ...newThemePayload };
    setTheme(merged);
    applyThemeToDocument(merged);
    const res = await api.put('/settings/theme', merged);
    return res.data;
  };

  const resetTheme = async () => {
    setTheme(DEFAULT_THEME);
    applyThemeToDocument(DEFAULT_THEME);
    const res = await api.put('/settings/theme', DEFAULT_THEME);
    return res.data;
  };

  const applyPreview = (previewThemeObj) => {
    applyThemeToDocument(previewThemeObj);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        loading,
        updateTheme,
        resetTheme,
        applyPreview,
        reloadTheme: fetchTheme,
        defaultTheme: DEFAULT_THEME,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
