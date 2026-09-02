import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const Header = () => {
  const { settings, navigation } = useSite();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const siteName = settings.site_name || 'PRODUCT LIST';
  const announcementActive = settings.announcement_active !== false && !!settings.announcement_text;
  const announcementText = settings.announcement_text || '';
  const announcementLink = settings.announcement_link || '/offers';

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      {/* 1. Dynamic Announcement Bar */}
      {announcementActive && (
        <div style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-button-text)',
          padding: '8px 16px',
          fontSize: '0.8rem',
          fontWeight: 500,
          textAlign: 'center',
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}>
          <Sparkles size={13} />
          <span>{announcementText}</span>
          {announcementLink && (
            <Link
              to={announcementLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'underline',
                marginLeft: '6px',
                fontWeight: 600,
                color: 'inherit',
              }}
            >
              Shop Now <ArrowRight size={12} />
            </Link>
          )}
        </div>
      )}

      {/* 2. Main Minimalist Header */}
      <nav style={{
        backgroundColor: 'var(--color-header)',
        color: 'var(--color-header-text)',
        borderBottom: '1px solid var(--color-border)',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}>
        <div className="container-custom" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
        }}>
          {/* Logo / Brand Name */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.35rem',
              letterSpacing: '-0.03em',
              color: 'var(--color-header-text)',
              display: 'block',
              lineHeight: 1,
            }}>
              {siteName}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2.25rem' }}>
            {navigation.header.map((item) => (
              <NavLink
                key={item.id}
                to={item.url}
                style={({ isActive }) => ({
                  color: isActive ? 'var(--color-primary)' : 'var(--color-header-text)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.15s ease',
                  position: 'relative',
                  padding: '6px 0',
                  borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  opacity: isActive ? 1 : 0.85,
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right Action Icons & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle Search"
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--button-radius)',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-header-text)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Search size={17} />
            </button>

            {/* Admin Dashboard / Login shortcut button */}
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="btn btn-sm btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              >
                <ShieldCheck size={15} />
                <span className="hide-mobile">Admin</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="btn btn-sm btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              >
                <ShieldCheck size={14} />
                <span className="hide-mobile">Admin</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-header-text)',
                cursor: 'pointer',
                display: 'none',
                padding: '4px',
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Slide-down Search Bar */}
        {searchOpen && (
          <div style={{
            backgroundColor: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            padding: '16px 0',
          }}>
            <div className="container-custom">
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '13px', color: 'var(--color-secondary)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by product name, SKU, brand, or category..."
                    className="input-field"
                    style={{ paddingLeft: '44px', height: '44px', fontSize: '0.9rem', backgroundColor: 'var(--color-background)' }}
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }}>
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0 14px' }}
                >
                  <X size={18} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Slide-out Drawer */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: 'var(--color-background)',
            borderBottom: '1px solid var(--color-border)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}>
            {navigation.header.map((item) => (
              <NavLink
                key={item.id}
                to={item.url}
                onClick={() => setMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  color: isActive ? 'var(--color-primary)' : 'var(--color-heading)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '1rem',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                })}
              >
                <span>{item.label}</span>
                <ArrowRight size={15} opacity={0.6} />
              </NavLink>
            ))}
            <div style={{ marginTop: '10px' }}>
              <Link
                to={isAuthenticated ? '/admin' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <ShieldCheck size={16} />
                <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
