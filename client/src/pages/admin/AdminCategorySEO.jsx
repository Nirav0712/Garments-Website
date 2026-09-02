import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { FolderTree, Edit2, ArrowLeft, Save, X, Globe } from 'lucide-react';

const AdminCategorySEO = () => {
  const { success, error: toastError } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [seoForm, setSeoForm] = useState({
    seoTitle: '',
    metaDescription: '',
    focusKeyword: '',
    canonicalUrl: '',
    robotsIndex: true,
    robotsFollow: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories?all=true');
      if (res.data?.success) {
        setCategories(res.data.categories || []);
      }
    } catch (err) {
      toastError('Error fetching categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenEdit = async (cat) => {
    setEditingCategory(cat);
    try {
      const res = await api.get(`/seo/category/${cat.id}`);
      const s = res.data?.seo || {};
      setSeoForm({
        seoTitle: s.seoTitle || `${cat.name} Collection | Luxury Garments | Product List`,
        metaDescription: s.metaDescription || cat.description || `Explore our luxury collection of ${cat.name}.`,
        focusKeyword: s.focusKeyword || cat.name.toLowerCase(),
        canonicalUrl: s.canonicalUrl || `https://productlist.com/products?category=${cat.slug}`,
        robotsIndex: s.robotsIndex !== false,
        robotsFollow: s.robotsFollow !== false,
      });
    } catch (e) {
      setSeoForm({
        seoTitle: `${cat.name} Collection | Luxury Garments | Product List`,
        metaDescription: cat.description || `Explore our luxury collection of ${cat.name}.`,
        focusKeyword: cat.name.toLowerCase(),
        canonicalUrl: `https://productlist.com/products?category=${cat.slug}`,
        robotsIndex: true,
        robotsFollow: true,
      });
    }
    setEditModalOpen(true);
  };

  const handleSaveSEO = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    setSaving(true);
    try {
      await api.put(`/seo/category/${editingCategory.id}`, seoForm);
      success('Category SEO saved successfully!');
      setEditModalOpen(false);
      fetchCategories();
    } catch (err) {
      toastError(err.response?.data?.message || 'Error saving category SEO.');
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
              Category SEO Management
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Configure search engine titles, meta descriptions, and indexing directives for clothing departments.
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
                <th style={{ padding: '1rem 1.5rem' }}>Category</th>
                <th style={{ padding: '1rem 1.5rem' }}>SEO Title</th>
                <th style={{ padding: '1rem 1.5rem' }}>Focus Keyword</th>
                <th style={{ padding: '1rem 1.5rem' }}>Robots</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    Loading category SEO...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => {
                  const seo = cat.seo || {};
                  return (
                    <tr
                      key={cat.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        color: '#E2E8F0',
                      }}
                    >
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{cat.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>/products?category={cat.slug}</div>
                      </td>

                      <td style={{ padding: '1rem 1.5rem', color: '#CBD5E1', maxWidth: '300px' }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {seo.seoTitle || `${cat.name} Collection | Product List`}
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1.5rem' }}>
                        {seo.focusKeyword ? (
                          <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                            {seo.focusKeyword}
                          </span>
                        ) : (
                          <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                            Missing
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                          index, follow
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '6px' }}
                        >
                          <Edit2 size={14} /> Edit SEO
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {editModalOpen && editingCategory && (
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
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                Category SEO: {editingCategory.name}
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSEO} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">SEO Title *</label>
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
                <div style={{ fontSize: '0.75rem', color: '#202124' }}>https://productlist.com › products?category={editingCategory.slug}</div>
                <div style={{ fontSize: '1.05rem', color: '#1a0dab', fontWeight: 600, margin: '2px 0' }}>
                  {seoForm.seoTitle || editingCategory.name}
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
                  <Save size={15} /> {saving ? 'Saving...' : 'Save SEO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategorySEO;
