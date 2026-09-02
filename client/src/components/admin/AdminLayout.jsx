import React, { useState } from 'react';
import { Link, NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  Sliders,
  Image as ImageIcon,
  FileText,
  Compass,
  Settings,
  Mail,
  LogOut,
  ExternalLink,
  PlusCircle,
  Menu,
  X,
  Layers,
  Palette,
  Shield,
  Search,
  Globe,
  SlidersHorizontal,
  FolderKanban,
  Ruler,
  Paintbrush,
  UserCheck,
  BarChart3,
  FileCode,
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navSections = [
    {
      title: null,
      items: [
        { label: 'Dashboard', icon: <LayoutDashboard size={17} />, to: '/admin', end: true },
      ],
    },
    {
      title: 'Catalog',
      items: [
        { label: 'Products', icon: <Package size={17} />, to: '/admin/products' },
        { label: 'Add Garment', icon: <PlusCircle size={17} />, to: '/admin/products/new' },
        { label: 'Categories', icon: <FolderTree size={17} />, to: '/admin/categories' },
        { label: 'Collections', icon: <FolderKanban size={17} />, to: '/admin/collections' },
        { label: 'Sizes', icon: <Ruler size={17} />, to: '/admin/sizes' },
        { label: 'Colors', icon: <Paintbrush size={17} />, to: '/admin/colors' },
      ],
    },
    {
      title: 'Sales / Marketing',
      items: [
        { label: 'Offers & Deals', icon: <Tag size={17} />, to: '/admin/offers' },
        { label: 'Hero Slider (6)', icon: <Sliders size={17} />, to: '/admin/hero-slider' },
      ],
    },
    {
      title: 'Content',
      items: [
        { label: 'Homepage CMS', icon: <FileText size={17} />, to: '/admin/homepage-cms' },
        { label: 'Pages CMS', icon: <Layers size={17} />, to: '/admin/pages-cms' },
        { label: 'Navigation', icon: <Compass size={17} />, to: '/admin/navigation' },
        { label: 'Media Library', icon: <ImageIcon size={17} />, to: '/admin/media' },
        { label: 'Inquiries Inbox', icon: <Mail size={17} />, to: '/admin/inquiries' },
      ],
    },
    {
      title: 'SEO Management',
      items: [
        { label: 'SEO Dashboard', icon: <BarChart3 size={17} />, to: '/admin/seo-dashboard' },
        { label: 'Product SEO', icon: <Search size={17} />, to: '/admin/seo-products' },
        { label: 'Category SEO', icon: <FolderTree size={17} />, to: '/admin/seo-categories' },
        { label: 'Page SEO', icon: <FileCode size={17} />, to: '/admin/seo-pages' },
        { label: 'Global SEO Settings', icon: <Globe size={17} />, to: '/admin/seo-settings' },
      ],
    },
    {
      title: 'Appearance',
      items: [
        { label: 'Theme Customizer', icon: <Palette size={17} />, to: '/admin/theme' },
      ],
    },
    {
      title: 'Settings',
      items: [
        { label: 'Site Settings', icon: <Settings size={17} />, to: '/admin/settings' },
        { label: 'Admin Profile', icon: <UserCheck size={17} />, to: '/admin/profile' },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0B0F19' }}>
      {/* Admin Sidebar */}
      <aside
        style={{
          width: '260px',
          background: '#0F172A',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 60,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
        }}
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        {/* Sidebar Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1rem',
            }}>
              PL
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.05rem',
                color: '#FFFFFF',
                display: 'block',
                lineHeight: 1.1,
              }}>
                Fashion Atelier
              </span>
              <span style={{ fontSize: '0.65rem', color: '#818CF8', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
                Control Center
              </span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="sidebar-close-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'none',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Sections */}
        <div style={{
          padding: '1rem 0.75rem',
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {navSections.map((section, idx) => (
            <div key={idx}>
              {section.title && (
                <div style={{
                  padding: '0 0.75rem 0.4rem 0.75rem',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#64748B',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  {section.title}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0.1) 100%)' : 'transparent',
                      borderLeft: isActive ? '3px solid #6366F1' : '3px solid transparent',
                      transition: 'all 0.15s ease',
                      textDecoration: 'none',
                    })}
                  >
                    <span style={{ color: location.pathname === item.to ? '#818CF8' : '#64748B' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer / User Info */}
        <div style={{
          padding: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#6366F1',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                flexShrink: 0,
              }}>
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'Fashion Director'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#818CF8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Administrator
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#F87171',
                borderRadius: '6px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="admin-main-content">
        {/* Admin Top Header */}
        <header style={{
          height: '64px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="admin-menu-toggle"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#CBD5E1',
                cursor: 'pointer',
                display: 'none',
              }}
            >
              <Menu size={24} />
            </button>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
              Garments & SEO Control Center
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#CBD5E1', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <ExternalLink size={14} /> View Storefront
            </Link>
          </div>
        </header>

        {/* Page Content Container */}
        <main style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            transform: translateX(-100%) !important;
          }
          .admin-sidebar.open {
            transform: translateX(0) !important;
          }
          .admin-main-content {
            margin-left: 0 !important;
          }
          .admin-menu-toggle, .sidebar-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
