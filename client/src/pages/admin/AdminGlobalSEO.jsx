import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { Globe, Save, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

const AdminGlobalSEO = () => {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    seo_site_title: 'PRODUCT LIST | Luxury Garments & Sustainable Fashion Atelier',
    seo_meta_description: 'Discover luxury garments crafted from organic Supima cotton, French linen, and Merino wool. Sustainable fashion, architectural tailoring, and timeless elegance.',
    seo_keywords: 'garments, luxury fashion, organic supima cotton, french linen shirts, tailored trousers, sustainable clothing',
    site_url: 'https://productlist.com',
    google_search_console_code: '',
    bing_webmaster_code: '',
    google_analytics_id: '',
    custom_head_scripts: '',
    custom_body_scripts: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data?.success) {
          setFormData((prev) => ({
            ...prev,
            ...res.data.settings,
          }));
        }
      } catch (err) {
        toastError('Error loading global SEO settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', formData);
      success('Global SEO settings updated successfully!');
    } catch (err) {
      toastError(err.response?.data?.message || 'Error saving global SEO.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', color: '#94A3B8', textAlign: 'center' }}>Loading SEO settings...</div>;
  }

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/admin/seo-dashboard" className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} /> SEO Dashboard
          </Link>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF' }}>
              Global SEO & Verification Settings
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Configure domain canonicalization, search engine webmaster tags, and default fallback metadata.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="btn btn-primary"
          style={{ gap: '8px', padding: '0.65rem 1.5rem', fontWeight: 700 }}
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Defaults & Fallbacks */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem' }}>
            Site-Wide Default Metadata
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Default Site Title *</label>
              <input
                type="text"
                required
                value={formData.seo_site_title}
                onChange={(e) => setFormData({ ...formData, seo_site_title: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Default Meta Description *</label>
              <textarea
                rows={3}
                required
                value={formData.seo_meta_description}
                onChange={(e) => setFormData({ ...formData, seo_meta_description: e.target.value })}
                className="textarea-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Default Focus Keywords (Comma separated)</label>
              <input
                type="text"
                value={formData.seo_keywords}
                onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Canonical Storefront Base URL *</label>
              <input
                type="url"
                required
                value={formData.site_url}
                onChange={(e) => setFormData({ ...formData, site_url: e.target.value })}
                placeholder="https://productlist.com"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Webmaster Verifications */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem' }}>
            Search Engine Verification Codes
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Google Search Console Verification Tag</label>
              <input
                type="text"
                value={formData.google_search_console_code || ''}
                onChange={(e) => setFormData({ ...formData, google_search_console_code: e.target.value })}
                placeholder="e.g. google-site-verification=abc123xyz"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bing Webmaster Tools Verification Tag</label>
              <input
                type="text"
                value={formData.bing_webmaster_code || ''}
                onChange={(e) => setFormData({ ...formData, bing_webmaster_code: e.target.value })}
                placeholder="e.g. msvalidate.01=abc123xyz"
                className="input-field"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Google Analytics 4 Measurement ID</label>
              <input
                type="text"
                value={formData.google_analytics_id || ''}
                onChange={(e) => setFormData({ ...formData, google_analytics_id: e.target.value })}
                placeholder="e.g. G-XXXXXXXXXX"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Custom Header & Footer Injection */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem' }}>
            Custom Code Injection (Advanced)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Custom Header Scripts (Injected inside &lt;head&gt;)</label>
              <textarea
                rows={4}
                value={formData.custom_head_scripts || ''}
                onChange={(e) => setFormData({ ...formData, custom_head_scripts: e.target.value })}
                placeholder="<!-- Custom analytics, meta tags, or pixels -->"
                className="textarea-field"
                style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Custom Body Scripts (Injected before &lt;/body&gt;)</label>
              <textarea
                rows={4}
                value={formData.custom_body_scripts || ''}
                onChange={(e) => setFormData({ ...formData, custom_body_scripts: e.target.value })}
                placeholder="<!-- Live chat widgets, tracking snippets -->"
                className="textarea-field"
                style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="submit" disabled={saving} className="btn btn-primary btn-lg" style={{ fontWeight: 700 }}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Global SEO Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminGlobalSEO;
