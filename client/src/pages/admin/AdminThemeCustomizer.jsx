import React, { useState, useEffect } from 'react';
import { useTheme, DEFAULT_THEME, getContrastRatio } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  Palette,
  Save,
  RotateCcw,
  ExternalLink,
  Eye,
  AlertTriangle,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Layers,
  Sliders,
} from 'lucide-react';

const AdminThemeCustomizer = () => {
  const { theme, updateTheme, resetTheme, applyPreview } = useTheme();
  const { success, error: toastError } = useToast();

  const [formTheme, setFormTheme] = useState({ ...DEFAULT_THEME, ...theme });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormTheme({ ...DEFAULT_THEME, ...theme });
  }, [theme]);

  const handleColorChange = (key, value) => {
    const updated = { ...formTheme, [key]: value };
    setFormTheme(updated);
    // Instant live preview
    applyPreview(updated);
  };

  const handleResetField = (key) => {
    handleColorChange(key, DEFAULT_THEME[key]);
  };

  const handleResetAll = async () => {
    try {
      await resetTheme();
      setFormTheme(DEFAULT_THEME);
      success('Theme reset to default neutral palette.');
    } catch (err) {
      toastError('Failed to reset theme.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateTheme(formTheme);
      success('Theme settings saved and activated globally across the entire storefront!');
    } catch (err) {
      toastError('Failed to save theme settings.');
    } finally {
      setSaving(false);
    }
  };

  // Contrast checks
  const bgTextContrast = getContrastRatio(formTheme.background_color, formTheme.text_color);
  const btnContrast = getContrastRatio(formTheme.button_background, formTheme.button_text);
  const headerContrast = getContrastRatio(formTheme.header_background, formTheme.header_text);
  const footerContrast = getContrastRatio(formTheme.footer_background, formTheme.footer_text);

  const hasContrastWarning = bgTextContrast < 3 || btnContrast < 3 || headerContrast < 3 || footerContrast < 3;

  const colorGroups = [
    {
      title: 'Brand Colors',
      description: 'Primary identity, supporting secondary tones, and vibrant accent highlights.',
      fields: [
        { key: 'primary_color', label: 'Primary Brand Color' },
        { key: 'secondary_color', label: 'Secondary Tone' },
        { key: 'accent_color', label: 'Accent Highlight' },
      ],
    },
    {
      title: 'Backgrounds & Surfaces',
      description: 'Main page canvas, content surfaces, card backgrounds, and structural borders.',
      fields: [
        { key: 'background_color', label: 'Page Background' },
        { key: 'surface_color', label: 'Surface Background' },
        { key: 'card_background', label: 'Card Background' },
        { key: 'border_color', label: 'Borders & Dividers' },
      ],
    },
    {
      title: 'Typography Colors',
      description: 'Text colors for main titles, headings, and body reading copy.',
      fields: [
        { key: 'heading_color', label: 'Headings & Titles' },
        { key: 'text_color', label: 'Body Text & Descriptions' },
      ],
    },
    {
      title: 'Buttons & Interactive Elements',
      description: 'Call-to-action button surfaces, label colors, and hover transitions.',
      fields: [
        { key: 'button_background', label: 'Button Background' },
        { key: 'button_text', label: 'Button Label Text' },
        { key: 'button_hover', label: 'Button Hover State' },
      ],
    },
    {
      title: 'Header & Navigation',
      description: 'Main storefront sticky header background and navigation links.',
      fields: [
        { key: 'header_background', label: 'Header Background' },
        { key: 'header_text', label: 'Header Text & Navigation' },
      ],
    },
    {
      title: 'Footer',
      description: 'Storefront bottom footer background and copy text.',
      fields: [
        { key: 'footer_background', label: 'Footer Background' },
        { key: 'footer_text', label: 'Footer Text' },
      ],
    },
    {
      title: 'Status & Feedback Alerts',
      description: 'Badges, success confirmations, warnings, and discount tags.',
      fields: [
        { key: 'success_color', label: 'Success / In Stock' },
        { key: 'warning_color', label: 'Warning / Low Stock' },
        { key: 'error_color', label: 'Sale / Discount / Error' },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Title & Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>
            Storefront Theme Customizer
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Customize your complete storefront color palette with real-time live preview. Zero code edits required.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleResetAll}
            className="btn btn-secondary btn-sm"
          >
            <RotateCcw size={14} /> Reset Theme
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <ExternalLink size={14} /> View Storefront
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ gap: '8px' }}
          >
            <Save size={16} /> {saving ? 'Saving Theme...' : 'Save Theme Changes'}
          </button>
        </div>
      </div>

      {/* Contrast Warning Banner if needed */}
      {hasContrastWarning && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '10px',
          padding: '12px 16px',
          color: '#FBBF24',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>Contrast Advisory:</strong> Some text and background combinations have low contrast (less than 3.0:1 ratio). Ensure text remains easily legible on all devices.
          </div>
        </div>
      )}

      {/* Main Grid: Left Color Controls, Right Live Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(380px, 1.2fr) minmax(400px, 1.8fr)',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* Left Column: Color Pickers by Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {colorGroups.map((group, gIdx) => (
            <div key={gIdx} className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                {group.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
                {group.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {group.fields.map((field) => {
                  const val = formTheme[field.key] || '#000000';
                  return (
                    <div
                      key={field.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', display: 'block' }}>
                          {field.label}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                          var(--color-{field.key.replace('_', '-')})
                        </span>
                      </div>

                      {/* Color Picker & Text Input Pair */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Native Color Picker input styled as swatch */}
                        <div style={{ position: 'relative', width: '34px', height: '34px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                          <input
                            type="color"
                            value={val.startsWith('#') ? val : '#111111'}
                            onChange={(e) => handleColorChange(field.key, e.target.value.toUpperCase())}
                            style={{
                              position: 'absolute',
                              inset: '-8px',
                              width: '50px',
                              height: '50px',
                              cursor: 'pointer',
                              border: 'none',
                              background: 'transparent',
                            }}
                          />
                        </div>

                        {/* HEX Text Input */}
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleColorChange(field.key, e.target.value.toUpperCase())}
                          style={{
                            width: '84px',
                            height: '34px',
                            background: '#0F172A',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '6px',
                            color: '#FFFFFF',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            padding: '0 8px',
                            textTransform: 'uppercase',
                          }}
                        />

                        {/* Reset individual token button */}
                        <button
                          type="button"
                          onClick={() => handleResetField(field.key)}
                          title="Reset to default"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Button Corner Radius Setting */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
              Button Corner Style
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
              Control the border radius of all storefront buttons and pill elements.
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              {['0px', '4px', '8px', '24px'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleColorChange('button_radius', r)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: r,
                    border: formTheme.button_radius === r ? '2px solid #6366F1' : '1px solid rgba(255,255,255,0.1)',
                    background: formTheme.button_radius === r ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {r === '0px' ? 'Sharp' : r === '4px' ? 'Subtle' : r === '8px' ? 'Rounded' : 'Pill'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Storefront Preview */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <div className="glass-card" style={{ overflow: 'hidden', padding: 0, border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            {/* Preview Top Header Bar */}
            <div style={{
              padding: '10px 16px',
              background: '#0F172A',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={16} color="#818CF8" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Live Storefront Preview
                </span>
              </div>
              <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                LIVE PREVIEW
              </span>
            </div>

            {/* Simulated Public Storefront Canvas using formTheme colors */}
            <div style={{
              backgroundColor: formTheme.background_color,
              color: formTheme.text_color,
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
              maxHeight: '760px',
              overflowY: 'auto',
            }}>
              {/* 1. Header Simulation */}
              <div style={{
                backgroundColor: formTheme.header_background,
                color: formTheme.header_text,
                padding: '12px 20px',
                borderBottom: `1px solid ${formTheme.border_color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: formTheme.header_text }}>
                  PRODUCT LIST
                </div>
                <div style={{ display: 'flex', gap: '14px', fontSize: '0.85rem', fontWeight: 500 }}>
                  <span style={{ color: formTheme.header_text }}>Home</span>
                  <span style={{ color: formTheme.header_text, opacity: 0.7 }}>Products</span>
                  <span style={{ color: formTheme.header_text, opacity: 0.7 }}>Offers</span>
                </div>
              </div>

              {/* 2. Hero Section Simulation */}
              <div style={{
                backgroundColor: formTheme.surface_color,
                padding: '2.5rem 1.5rem',
                borderBottom: `1px solid ${formTheme.border_color}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <span style={{
                  display: 'inline-block',
                  alignSelf: 'flex-start',
                  backgroundColor: formTheme.primary_color,
                  color: formTheme.button_text,
                  padding: '3px 8px',
                  borderRadius: formTheme.button_radius || '4px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}>
                  NEW COLLECTION 2026
                </span>
                <h2 style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: formTheme.heading_color,
                  lineHeight: 1.15,
                  margin: 0,
                }}>
                  Minimal Hardware & Acoustics
                </h2>
                <p style={{ fontSize: '0.9rem', color: formTheme.text_color, margin: 0 }}>
                  Precision-engineered tools crafted for focus and uncompromising performance.
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button
                    type="button"
                    style={{
                      backgroundColor: formTheme.button_background,
                      color: formTheme.button_text,
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: formTheme.button_radius || '4px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Explore Products
                  </button>
                  <button
                    type="button"
                    style={{
                      backgroundColor: 'transparent',
                      color: formTheme.heading_color,
                      border: `1px solid ${formTheme.border_color}`,
                      padding: '8px 16px',
                      borderRadius: formTheme.button_radius || '4px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                    }}
                  >
                    Learn More
                  </button>
                </div>
              </div>

              {/* 3. Product Cards Grid Simulation */}
              <div style={{ padding: '1.5rem', backgroundColor: formTheme.background_color }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: formTheme.heading_color, marginBottom: '1rem' }}>
                  Featured Products (Card Style)
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* Card 1 */}
                  <div style={{
                    backgroundColor: formTheme.card_background,
                    border: `1px solid ${formTheme.border_color}`,
                    borderRadius: formTheme.button_radius || '4px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '130px',
                      backgroundColor: formTheme.surface_color,
                      backgroundImage: 'url("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                    }}>
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        backgroundColor: formTheme.error_color,
                        color: '#FFFFFF',
                        padding: '2px 6px',
                        borderRadius: '2px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                      }}>
                        SALE
                      </span>
                    </div>
                    <div style={{ padding: '12px' }}>
                      <div style={{ fontSize: '0.7rem', color: formTheme.secondary_color, textTransform: 'uppercase', fontWeight: 600 }}>
                        Audio & Sound
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: formTheme.heading_color, margin: '2px 0 6px 0' }}>
                        AeroPulse Headphones
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontWeight: 800, color: formTheme.heading_color }}>$299.00</span>
                        <span style={{ fontSize: '0.75rem', color: formTheme.secondary_color, textDecoration: 'line-through' }}>$349.00</span>
                      </div>
                      <button
                        type="button"
                        style={{
                          width: '100%',
                          marginTop: '8px',
                          backgroundColor: formTheme.button_background,
                          color: formTheme.button_text,
                          border: 'none',
                          padding: '6px',
                          borderRadius: formTheme.button_radius || '4px',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div style={{
                    backgroundColor: formTheme.card_background,
                    border: `1px solid ${formTheme.border_color}`,
                    borderRadius: formTheme.button_radius || '4px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '130px',
                      backgroundColor: formTheme.surface_color,
                      backgroundImage: 'url("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                    }}>
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        backgroundColor: formTheme.primary_color,
                        color: formTheme.button_text,
                        padding: '2px 6px',
                        borderRadius: '2px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                      }}>
                        NEW
                      </span>
                    </div>
                    <div style={{ padding: '12px' }}>
                      <div style={{ fontSize: '0.7rem', color: formTheme.secondary_color, textTransform: 'uppercase', fontWeight: 600 }}>
                        Wearables
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: formTheme.heading_color, margin: '2px 0 6px 0' }}>
                        Chronos X Titanium
                      </div>
                      <div style={{ fontWeight: 800, color: formTheme.heading_color }}>
                        $499.00
                      </div>
                      <button
                        type="button"
                        style={{
                          width: '100%',
                          marginTop: '8px',
                          backgroundColor: formTheme.button_background,
                          color: formTheme.button_text,
                          border: 'none',
                          padding: '6px',
                          borderRadius: formTheme.button_radius || '4px',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Footer Simulation */}
              <div style={{
                backgroundColor: formTheme.footer_background,
                color: formTheme.footer_text,
                padding: '1.5rem',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <div style={{ fontWeight: 800, color: formTheme.footer_text }}>
                  PRODUCT LIST
                </div>
                <div style={{ opacity: 0.7, color: formTheme.footer_text }}>
                  Curated minimalist hardware showcase.
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', opacity: 0.6, fontSize: '0.75rem' }}>
                  © 2026 PRODUCT LIST Inc.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminThemeCustomizer;
