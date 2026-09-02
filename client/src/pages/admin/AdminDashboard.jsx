import { getMediaUrl } from '../../utils/urlHelper';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  Package,
  FolderTree,
  Tag,
  Sliders,
  Sparkles,
  Mail,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Plus,
  Eye,
  CheckCircle2,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [categoriesDistribution, setCategoriesDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/stats/dashboard');
        if (res.data?.success) {
          setStats(res.data.stats);
          setRecentProducts(res.data.recentProducts || []);
          setRecentInquiries(res.data.recentInquiries || []);
          setCategoriesDistribution(res.data.categoriesDistribution || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '14px' }} />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: <Package size={22} color="#818CF8" />, bg: 'rgba(99, 102, 241, 0.15)', link: '/admin/products' },
    { label: 'Active Products', value: stats?.activeProducts || 0, icon: <CheckCircle2 size={22} color="#34D399" />, bg: 'rgba(16, 185, 129, 0.15)', link: '/admin/products' },
    { label: 'Categories', value: stats?.totalCategories || 0, icon: <FolderTree size={22} color="#60A5FA" />, bg: 'rgba(59, 130, 246, 0.15)', link: '/admin/categories' },
    { label: 'Active Offers', value: stats?.activeOffers || 0, icon: <Tag size={22} color="#FBBF24" />, bg: 'rgba(245, 158, 11, 0.15)', link: '/admin/offers' },
    { label: 'Hero Slides', value: stats?.totalHeroSlides || 0, icon: <Sliders size={22} color="#A78BFA" />, bg: 'rgba(167, 139, 250, 0.15)', link: '/admin/hero-slider' },
    { label: 'Unread Inquiries', value: stats?.unreadInquiries || 0, icon: <Mail size={22} color="#F472B6" />, bg: 'rgba(236, 72, 153, 0.15)', link: '/admin/inquiries' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Top Banner & Quick Action Buttons */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            System Dashboard
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
            Live overview of products, active campaigns, media assets, and customer inquiries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/admin/products/new" className="btn btn-primary btn-sm">
            <Plus size={16} /> Add Product
          </Link>
          <Link to="/admin/hero-slider" className="btn btn-secondary btn-sm">
            <Sliders size={16} /> Manage Slides (6)
          </Link>
          <Link to="/admin/homepage-cms" className="btn btn-outline btn-sm">
            Edit CMS Content
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.25rem',
      }}>
        {statCards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            className="glass-card glass-card-hover"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8' }}>{card.label}</span>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: card.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {card.icon}
              </div>
            </div>
            <div style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: '#FFFFFF',
              lineHeight: 1,
            }}>
              {card.value}
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid: Recent Products & Inquiries */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2rem',
      }}>
        {/* Recent Products */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} color="#818CF8" /> Recently Added Products
            </h3>
            <Link to="/admin/products" style={{ fontSize: '0.85rem', color: '#818CF8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentProducts.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={getMediaUrl(getMediaUrl(p.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'))}
                    alt={p.title}
                    style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>{p.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#818CF8' }}>{p.category?.name || 'Uncategorized'}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                    ${Number(p.price).toFixed(2)}
                  </div>
                  <Link to={`/admin/products/${p.id}/edit`} style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'underline' }}>
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries Inbox */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={18} color="#F472B6" /> Customer Inquiries
            </h3>
            <Link to="/admin/inquiries" style={{ fontSize: '0.85rem', color: '#818CF8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View Inbox <ArrowRight size={14} />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
              No inquiries yet. Submissions from the contact form and product inquiry modals will appear here.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentInquiries.map((inq) => (
                <div
                  key={inq.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#FFFFFF' }}>{inq.name}</strong>
                    <span className={`badge ${inq.status === 'UNREAD' ? 'badge-primary' : 'badge-emerald'}`} style={{ fontSize: '0.7rem' }}>
                      {inq.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: '#94A3B8', margin: '4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inq.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {new Date(inq.createdAt).toLocaleDateString()} • {inq.email}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FolderTree size={18} color="#60A5FA" /> Category Distribution
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          {categoriesDistribution.map((cat, idx) => (
            <div
              key={idx}
              style={{
                padding: '1rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 600, marginBottom: '6px' }}>
                {cat.name}
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818CF8', fontFamily: 'var(--font-mono)' }}>
                {cat.count} <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 400 }}>items</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
