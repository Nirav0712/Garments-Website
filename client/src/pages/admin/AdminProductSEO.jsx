import { getMediaUrl } from '../../utils/urlHelper';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { Search, Edit2, CheckCircle2, AlertTriangle, Globe, ArrowLeft, ExternalLink, Save, X } from 'lucide-react';

const AdminProductSEO = () => {
  const { success, error: toastError } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Quick Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [seoForm, setSeoForm] = useState({
    seoTitle: '',
    metaDescription: '',
    focusKeyword: '',
    secondaryKeywords: '',
    slug: '',
    canonicalUrl: '',
    robotsIndex: true,
    robotsFollow: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?all=true');
      if (res.data?.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      toastError('Error fetching products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const calculateScore = (product) => {
    const seo = product.seo || {};
    const title = seo.seoTitle || product.title || '';
    const desc = seo.metaDescription || product.shortDesc || '';
    const keyword = (seo.focusKeyword || '').toLowerCase().trim();

    let score = 0;
    if (title.length >= 20) score += 25;
    if (desc.length >= 50) score += 25;
    if (keyword.length > 0) score += 20;
    if (keyword.length > 0 && title.toLowerCase().includes(keyword)) score += 15;
    if (keyword.length > 0 && desc.toLowerCase().includes(keyword)) score += 15;

    return Math.min(100, score);
  };

  const handleOpenEdit = async (product) => {
    setEditingProduct(product);
    try {
      const res = await api.get(`/seo/product/${product.id}`);
      const s = res.data?.seo || {};
      setSeoForm({
        seoTitle: s.seoTitle || `${product.title} | Product List`,
        metaDescription: s.metaDescription || product.shortDesc || '',
        focusKeyword: s.focusKeyword || product.title.toLowerCase(),
        secondaryKeywords: s.secondaryKeywords || '',
        slug: s.slug || `/products/${product.slug}`,
        canonicalUrl: s.canonicalUrl || `https://productlist.com/products/${product.slug}`,
        robotsIndex: s.robotsIndex !== false,
        robotsFollow: s.robotsFollow !== false,
      });
    } catch (e) {
      setSeoForm({
        seoTitle: `${product.title} | Product List`,
        metaDescription: product.shortDesc || '',
        focusKeyword: product.title.toLowerCase(),
        secondaryKeywords: '',
        slug: `/products/${product.slug}`,
        canonicalUrl: `https://productlist.com/products/${product.slug}`,
        robotsIndex: true,
        robotsFollow: true,
      });
    }
    setEditModalOpen(true);
  };

  const handleSaveSEO = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);
    try {
      await api.put(`/seo/product/${editingProduct.id}`, seoForm);
      success('Product SEO updated successfully!');
      setEditModalOpen(false);
      fetchProducts();
    } catch (err) {
      toastError(err.response?.data?.message || 'Error saving SEO.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/admin/seo-dashboard" className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} /> SEO Dashboard
          </Link>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF' }}>
              Product SEO Management
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Fine-tune focus keywords, meta titles, meta descriptions, and indexing directives for all garments.
            </p>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748B' }} />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search garments..."
            className="input-field"
            style={{ paddingLeft: '38px', height: '40px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)', color: '#94A3B8' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Garment</th>
                <th style={{ padding: '1rem 1.25rem' }}>SEO Title</th>
                <th style={{ padding: '1rem 1.25rem' }}>Focus Keyword</th>
                <th style={{ padding: '1rem 1.25rem' }}>Meta Desc Length</th>
                <th style={{ padding: '1rem 1.25rem' }}>SEO Score</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    Loading product SEO records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    No matching products found.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const score = calculateScore(prod);
                  const seo = prod.seo || {};
                  const descLen = (seo.metaDescription || prod.shortDesc || '').length;

                  return (
                    <tr
                      key={prod.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        color: '#E2E8F0',
                      }}
                    >
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '38px', height: '44px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#0B0F19', flexShrink: 0 }}>
                            <img
                              src={getMediaUrl(getMediaUrl(prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'))}
                              alt={prod.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>{prod.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>/products/{prod.slug}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1.25rem', color: '#CBD5E1', maxWidth: '240px' }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {seo.seoTitle || `${prod.title} | Product List`}
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        {seo.focusKeyword ? (
                          <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                            {seo.focusKeyword}
                          </span>
                        ) : (
                          <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                            Missing
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ color: descLen >= 70 && descLen <= 160 ? '#4ADE80' : '#FBBF24', fontWeight: 600 }}>
                          {descLen} chars {descLen >= 70 && descLen <= 160 ? '✓' : '⚠'}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, color: score >= 80 ? '#4ADE80' : (score >= 50 ? '#FBBF24' : '#F87171') }}>
                            {score}%
                          </span>
                          <div style={{ width: '50px', height: '5px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${score}%`, height: '100%', backgroundColor: score >= 80 ? '#16A34A' : '#F59E0B' }} />
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '6px 10px' }}
                            title="Quick Edit SEO"
                          >
                            <Edit2 size={14} /> Quick SEO
                          </button>
                          <Link
                            to={`/admin/products/${prod.id}/edit`}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '6px 10px' }}
                            title="Full Product Edit"
                          >
                            Full Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Edit SEO Modal */}
      {editModalOpen && editingProduct && (
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
            maxWidth: '640px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Quick SEO: {editingProduct.title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#818CF8' }}>SKU: {editingProduct.sku}</span>
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
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="form-label">SEO Title *</label>
                  <span style={{ fontSize: '0.75rem', color: seoForm.seoTitle.length >= 30 && seoForm.seoTitle.length <= 65 ? '#4ADE80' : '#FBBF24' }}>
                    {seoForm.seoTitle.length} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={seoForm.seoTitle}
                  onChange={(e) => setSeoForm({ ...seoForm, seoTitle: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="form-label">Meta Description *</label>
                  <span style={{ fontSize: '0.75rem', color: seoForm.metaDescription.length >= 70 && seoForm.metaDescription.length <= 160 ? '#4ADE80' : '#FBBF24' }}>
                    {seoForm.metaDescription.length} / 160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={seoForm.metaDescription}
                  onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                  className="textarea-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                  <label className="form-label">Secondary Keywords</label>
                  <input
                    type="text"
                    value={seoForm.secondaryKeywords}
                    onChange={(e) => setSeoForm({ ...seoForm, secondaryKeywords: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Canonical URL</label>
                  <input
                    type="url"
                    value={seoForm.canonicalUrl}
                    onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Robots Directive</label>
                  <select
                    value={`${seoForm.robotsIndex ? 'index' : 'noindex'},${seoForm.robotsFollow ? 'follow' : 'nofollow'}`}
                    onChange={(e) => {
                      const [idx, fol] = e.target.value.split(',');
                      setSeoForm({
                        ...seoForm,
                        robotsIndex: idx === 'index',
                        robotsFollow: fol === 'follow',
                      });
                    }}
                    className="select-field"
                  >
                    <option value="index,follow">Index, Follow</option>
                    <option value="noindex,follow">Noindex, Follow</option>
                    <option value="index,nofollow">Index, Nofollow</option>
                    <option value="noindex,nofollow">Noindex, Nofollow</option>
                  </select>
                </div>
              </div>

              {/* SERP Preview */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '6px', color: '#202124', fontSize: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#202124' }}>https://productlist.com › products › {editingProduct.slug}</div>
                <div style={{ fontSize: '1.05rem', color: '#1a0dab', fontWeight: 600, margin: '2px 0' }}>
                  {seoForm.seoTitle || editingProduct.title}
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

export default AdminProductSEO;
