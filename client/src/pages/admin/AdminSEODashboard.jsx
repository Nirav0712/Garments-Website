import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  BarChart3,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FolderTree,
  Image as ImageIcon,
  Globe,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

const AdminSEODashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/seo/dashboard');
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Error loading SEO dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <div style={{ padding: '3rem', color: '#94A3B8', textAlign: 'center' }}>Running SEO Health Audit...</div>;
  }

  const { overallHealthScore = 0, counts = {}, rates = {}, warnings = [], missing = {} } = data || {};

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>
            SEO Health & Optimization Dashboard
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
            Comprehensive real-time website audit for products, garment categories, core pages, and image alt tags.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchDashboard} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            <RefreshCw size={14} /> Re-audit
          </button>
          <a
            href={`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000'}/sitemap.xml`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
          >
            <Globe size={14} /> View Live Sitemap
          </a>
        </div>
      </div>

      {/* Main Health Card */}
      <div className="glass-card" style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem',
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#818CF8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            OVERALL STORE OPTIMIZATION INDEX
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginTop: '6px' }}>
            <span style={{
              fontSize: '3.5rem',
              fontWeight: 900,
              color: overallHealthScore >= 80 ? '#4ADE80' : (overallHealthScore >= 60 ? '#FBBF24' : '#F87171'),
              fontFamily: 'var(--font-heading)',
              lineHeight: 1,
            }}>
              {overallHealthScore}%
            </span>
            <div>
              <span className={`badge ${overallHealthScore >= 80 ? 'badge-success' : (overallHealthScore >= 60 ? 'badge-warning' : 'badge-error')}`} style={{ fontSize: '0.8rem' }}>
                {overallHealthScore >= 80 ? 'SEARCH READY' : 'OPTIMIZATION NEEDED'}
              </span>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '4px' }}>
                {overallHealthScore >= 80 ? 'Your storefront is well optimized for Google and Bing indexing.' : 'Follow the action items below to maximize your organic rankings.'}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>{counts.totalProducts || 0}</div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Active Products</div>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>{counts.totalCategories || 0}</div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Categories</div>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>{counts.totalImages || 0}</div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase' }}>Gallery Images</div>
          </div>
        </div>
      </div>

      {/* 4 Health Breakdown Gauges (Requirement #25) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {/* Products Health */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>Products SEO</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: rates.products >= 80 ? '#4ADE80' : '#FBBF24' }}>
              {rates.products}%
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
            <div style={{ width: `${rates.products}%`, height: '100%', backgroundColor: rates.products >= 80 ? '#16A34A' : '#F59E0B' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94A3B8' }}>
            <span>{counts.productsWithGoodSEO} of {counts.totalProducts} optimized</span>
            <Link to="/admin/seo-products" style={{ color: '#818CF8', fontWeight: 600 }}>Manage</Link>
          </div>
        </div>

        {/* Categories Health */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>Categories SEO</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: rates.categories >= 80 ? '#4ADE80' : '#FBBF24' }}>
              {rates.categories}%
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
            <div style={{ width: `${rates.categories}%`, height: '100%', backgroundColor: rates.categories >= 80 ? '#16A34A' : '#F59E0B' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94A3B8' }}>
            <span>{counts.categoriesWithGoodSEO} of {counts.totalCategories} optimized</span>
            <Link to="/admin/seo-categories" style={{ color: '#818CF8', fontWeight: 600 }}>Manage</Link>
          </div>
        </div>

        {/* Pages Health */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>Core Pages SEO</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: rates.pages >= 80 ? '#4ADE80' : '#FBBF24' }}>
              {rates.pages}%
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
            <div style={{ width: `${rates.pages}%`, height: '100%', backgroundColor: rates.pages >= 80 ? '#16A34A' : '#F59E0B' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94A3B8' }}>
            <span>{counts.pagesWithGoodSEO} of {counts.totalPages} optimized</span>
            <Link to="/admin/seo-pages" style={{ color: '#818CF8', fontWeight: 600 }}>Manage</Link>
          </div>
        </div>

        {/* Images Alt Text Health */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>Image Alt Tags</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: rates.images >= 80 ? '#4ADE80' : '#FBBF24' }}>
              {rates.images}%
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
            <div style={{ width: `${rates.images}%`, height: '100%', backgroundColor: rates.images >= 80 ? '#16A34A' : '#F59E0B' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94A3B8' }}>
            <span>{counts.totalImages - counts.imagesMissingAlt} with alt text</span>
            <span style={{ color: counts.imagesMissingAlt > 0 ? '#F87171' : '#4ADE80' }}>
              {counts.imagesMissingAlt} missing
            </span>
          </div>
        </div>
      </div>

      {/* Warnings & Attention Needed */}
      {warnings.length > 0 && (
        <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '4px solid #F59E0B' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FBBF24', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> Critical SEO Action Items
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {warnings.map((warn, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#E2E8F0' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FBBF24' }} />
                <span>{warn}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Access SEO Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <Link to="/admin/seo-products" className="glass-card" style={{ padding: '1.75rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Search size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
              Product SEO Manager
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Edit SEO titles, focus keywords, meta descriptions, canonical links, and preview Google SERP snippets for each garment.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818CF8', fontWeight: 700, fontSize: '0.85rem', marginTop: '1.25rem' }}>
            <span>Manage Product SEO</span>
            <ArrowRight size={14} />
          </div>
        </Link>

        <Link to="/admin/seo-categories" className="glass-card" style={{ padding: '1.75rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <FolderTree size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
              Category SEO Manager
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Fine-tune search titles, meta descriptions, slugs, and Open Graph cards for every clothing department.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818CF8', fontWeight: 700, fontSize: '0.85rem', marginTop: '1.25rem' }}>
            <span>Manage Category SEO</span>
            <ArrowRight size={14} />
          </div>
        </Link>

        <Link to="/admin/seo-pages" className="glass-card" style={{ padding: '1.75rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <FileText size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
              Page-Level SEO
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Control metadata for Home, Catalog, Categories, Offers, About, and Contact pages.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818CF8', fontWeight: 700, fontSize: '0.85rem', marginTop: '1.25rem' }}>
            <span>Manage Page SEO</span>
            <ArrowRight size={14} />
          </div>
        </Link>

        <Link to="/admin/seo-settings" className="glass-card" style={{ padding: '1.75rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Globe size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
              Global SEO & Verification
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Configure canonical base URL, Google Search Console tag, Bing Webmaster verification, and default OG image.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818CF8', fontWeight: 700, fontSize: '0.85rem', marginTop: '1.25rem' }}>
            <span>Global Settings</span>
            <ArrowRight size={14} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminSEODashboard;
