import React from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const { settings, navigation } = useSite();

  const siteName = settings.site_name || 'PRODUCT LIST';
  const footerDesc =
    settings.footer_description ||
    'PRODUCT LIST is a curated showcase dedicated to precision engineered hardware, studio acoustics, titanium chronographs, and minimalist workspace aesthetics.';
  const copyright = settings.footer_copyright || `© ${new Date().getFullYear()} PRODUCT LIST Inc. All rights reserved.`;

  const footerCols = navigation.footerColumns || {};

  return (
    <footer style={{
      backgroundColor: 'var(--color-footer)',
      color: 'var(--color-footer-text)',
      borderTop: '1px solid var(--color-border)',
      paddingTop: '4.5rem',
      paddingBottom: '2.5rem',
      transition: 'background-color 0.2s ease, color 0.2s ease',
    }}>
      <div className="container-custom">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem',
        }}>
          {/* Column 1: Brand & Bio */}
          <div>
            <Link to="/" style={{ display: 'inline-block', textDecoration: 'none', marginBottom: '1.25rem' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.3rem',
                color: 'var(--color-footer-text)',
                letterSpacing: '-0.02em',
              }}>
                {siteName}
              </span>
            </Link>

            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem', opacity: 0.8, color: 'var(--color-footer-text)' }}>
              {footerDesc}
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {settings.social_twitter && (
                <a
                  href={settings.social_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--button-radius)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-footer-text)',
                    transition: 'all 0.2s',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
              {settings.social_instagram && (
                <a
                  href={settings.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--button-radius)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-footer-text)',
                    transition: 'all 0.2s',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              )}
              {settings.social_github && (
                <a
                  href={settings.social_github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--button-radius)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-footer-text)',
                    transition: 'all 0.2s',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Dynamic Navigation Columns */}
          {Object.entries(footerCols).map(([columnName, links]) => (
            <div key={columnName}>
              <h4 style={{
                color: 'var(--color-footer-text)',
                fontSize: '0.9rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}>
                {columnName}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {links.map((link) => (
                  <li key={link.id}>
                    <Link
                      to={link.url}
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-footer-text)',
                        opacity: 0.75,
                        transition: 'opacity 0.2s',
                        display: 'inline-block',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.75')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Concierge & Support */}
          <div>
            <h4 style={{
              color: 'var(--color-footer-text)',
              fontSize: '0.9rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1.25rem',
            }}>
              Concierge
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', opacity: 0.85 }}>
              {settings.contact_email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={15} />
                  <a href={`mailto:${settings.contact_email}`} style={{ color: 'inherit' }}>
                    {settings.contact_email}
                  </a>
                </div>
              )}
              {settings.contact_phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={15} />
                  <a href={`tel:${settings.contact_phone}`} style={{ color: 'inherit' }}>
                    {settings.contact_phone}
                  </a>
                </div>
              )}
              {settings.contact_address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <MapPin size={15} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{settings.contact_address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin link */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          opacity: 0.75,
        }}>
          <div>{copyright}</div>
          <div>
            <Link
              to="/admin/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'inherit',
              }}
            >
              <ShieldCheck size={14} /> Admin Control
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
