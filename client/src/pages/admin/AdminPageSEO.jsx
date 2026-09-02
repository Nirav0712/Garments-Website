import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { FileCode, Edit2, ArrowLeft, Save, X, Globe, ExternalLink } from 'lucide-react';

const AdminPageSEO = () => {
  const { success, error: toastError } = useToast();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [seoForm, setSeoForm] = useState({
    seoTitle: '',
    metaDescription: '',
    focusKeyword: '',
    canonicalUrl: '',
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: '',
    ogDescription: '',
  });
  const [saving, setSaving] = useState(false);

  const corePages = [
    { pageKey: 'home', name: 'Homepage', url: '/' },
    { pageKey: 'products', name: 'Garments Catalog Page', url: '/products' },
    { pageKey: 'categories', name: 'Categories Department Page', url: '/categories' },
    { pageKey: 'offers', name: 'Offers & Capsule Deals Page', url: '/offers' },
    { pageKey: 'about', name: 'About Atelier & Story Page', url: '/about' },
    { pageKey: 'contact', name: 'Contact Concierge Page', url: '/contact' },
  ];

  const fetchPagesSEO = async () => {
    try {
      const results = await Promise.all(
        corePages.map(async (p) => {
          try {
            const res = await api.get(`/seo/page/${p.pageKey}`);
            return {
              ...p,
              seo: res.data?.seo || null,
            };
          } catch (e) {
            return { ...p, seo: null };
          }
        })
      );
      setPages(results);
    } catch (err) {
      toastError('Error fetching pages SEO.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagesSEO();
  }, []);

  const handleOpenEdit = (p) => {
    setEditingPage(p);
    const s = p.seo || {};
    setSeoForm({
      seoTitle: s.seoTitle || `${p.name} | Product List Atelier`,
      metaDescription: s.metaDescription || '',
      focusKeyword: s.focusKeyword || '',
      canonicalUrl: s.canonicalUrl || `https://productlist.com${p.url}`,
      robotsIndex: s.robotsIndex !== false,
      robotsFollow: s.robotsFollow !== false,
      ogTitle: s.ogTitle || '',
      ogDescription: s.ogDescription || '',
    });
    setEditModalOpen(true);
  };

  const handleSaveSEO = async (e) => {
    e.preventDefault();
    if (!editingPage) return;
    setSaving(true);
    try {
      await api.put(`/seo/page/${editingPage.pageKey}`, seoForm);
      success(`${editingPage.name} SEO saved successfully!`);
      setEditModalOpen(false);
      fetchPagesSEO();
    } catch (err) {
      toastError(err.response?.data?.message || 'Error saving page SEO.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/admin/seo-dashboard" className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} /> SEO Dashboard
          </Link>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF' }}>
              Page-Level SEO Management
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Manage individual SEO titles, meta descriptions, and Open Graph tags for all core storefront pages.
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)', color: '#94A3B8' }}>
                <th style={{ padding: '1rem 1.5rem' }}>Page Name</th>
                <th style={{ padding: '1rem 1.5rem' }}>URL Path</th>
                <th style={{ padding: '1rem 1.5rem' }}>SEO Title</th>
                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    Loading core page SEO...
                  </td>
                </tr>
              ) : (
                pages.map((p) => (
                  <tr
                    key={p.pageKey}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      color: '#E2E8F0',
                    }}
                  >
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: '#FFFFFF' }}>
                      {p.name}
                    </td>

                    <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', color: '#818CF8' }}>
                      {p.url}
                    </td>

                    <td style={{ padding: '1rem 1.5rem', color: '#CBD5E1', maxWidth: '280px' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.seo?.seoTitle || 'Default Site SEO Title'}
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className={`badge ${p.seo ? 'badge-success' : 'badge-warning'}`}>
                        {p.seo ? 'Optimized' : 'Needs Setup'}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '6px' }}
                      >
                        <Edit2 size={14} /> Edit SEO
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {editModalOpen && editingPage && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem',
        }}>
          <div style={{
            backgroundColor: '#0F172A',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                  SEO Settings: {editingPage.name}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#818CF8', fontFamily: 'monospace' }}>{editingPage.url}</span>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSEO} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">SEO Page Title *</label>
                <input
                  type="text"
                  required
                  value={seoForm.seoTitle}
                  onChange={(e) => setSeoForm({ ...seoForm, seoTitle: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Meta Description *</label>
                <textarea
                  rows={3}
                  required
                  value={seoForm.metaDescription}
                  onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                  className="textarea-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Focus Keyword</label>
                <input
                  type="text"
                  value={seoForm.focusKeyword}
                  onChange={(e) => setSeoForm({ ...seoForm, focusKeyword: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Canonical URL</label>
                <input
                  type="url"
                  value={seoForm.canonicalUrl}
                  onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* SERP Preview */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '6px', color: '#202124', fontSize: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#202124' }}>https://productlist.com{editingPage.url}</div>
                <div style={{ fontSize: '1.05rem', color: '#1a0dab', fontWeight: 600, margin: '2px 0' }}>
                  {seoForm.seoTitle || editingPage.name}
                </div>
                <div style={{ color: '#4d5156', fontSize: '0.8rem' }}>
                  {seoForm.metaDescription || 'No description entered.'}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ gap: '6px' }}>
                  <Save size={15} /> {saving ? 'Saving...' : 'Save Page SEO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPageSEO;
