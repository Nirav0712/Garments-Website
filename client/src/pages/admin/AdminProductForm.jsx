import { getMediaUrl } from '../../utils/urlHelper';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import SpecBuilder from '../../components/admin/SpecBuilder';
import MediaPickerModal from '../../components/admin/MediaPickerModal';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Check,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Eye,
  Scissors,
  Layers,
  Globe,
  Sliders,
} from 'lucide-react';

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [masterSizes, setMasterSizes] = useState([]);
  const [masterColors, setMasterColors] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'garment', 'images', 'sizes_colors', 'seo'

  // Media picker modals
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [hoverMediaPickerOpen, setHoverMediaPickerOpen] = useState(false);

  // Main Form Data
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    sku: '',
    brand: 'PRODUCT LIST ATELIER',
    categoryId: '',
    collection: '',
    gender: 'UNISEX',
    fabric: '',
    material: '',
    fit: '',
    pattern: '',
    season: 'All Season',
    occasion: 'Casual / Everyday',
    careInstructions: 'Machine wash cold with similar colors. Line dry in shade.',
    currency: 'USD',
    price: '',
    salePrice: '',
    discount: '',
    stock: 10,
    stockStatus: 'IN_STOCK',
    shortDesc: '',
    fullDesc: '',
    hoverImage: '',
    isActive: true,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    images: [],
    sizes: [], // Array of { name: 'M', inStock: true }
    colors: [], // Array of { name: 'Black', hex: '#111111', inStock: true }
    specifications: {},
    features: [],
    // SEO fields
    seo: {
      seoTitle: '',
      metaDescription: '',
      focusKeyword: '',
      secondaryKeywords: '',
      slug: '',
      canonicalUrl: '',
      robotsIndex: true,
      robotsFollow: true,
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
    },
  });

  // Fetch Auxiliaries: Categories, Collections, Sizes, Colors
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [catRes, colRes, sizeRes, colrRes] = await Promise.all([
          api.get('/categories?all=true'),
          api.get('/collections?all=true').catch(() => ({ data: { collections: [] } })),
          api.get('/sizes?all=true').catch(() => ({ data: { sizes: [] } })),
          api.get('/colors?all=true').catch(() => ({ data: { colors: [] } })),
        ]);

        if (catRes.data?.success) setCategories(catRes.data.categories || []);
        if (colRes.data?.success) setCollections(colRes.data.collections || []);
        if (sizeRes.data?.success) setMasterSizes(sizeRes.data.sizes || []);
        if (colrRes.data?.success) setMasterColors(colrRes.data.colors || []);
      } catch (err) {
        console.error('Error fetching master catalog data:', err);
      }
    };
    fetchMasterData();
  }, []);

  // Fetch Product Data if editing
  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const res = await api.get('/products?all=true');
          if (res.data?.success) {
            const found = (res.data.products || []).find((p) => p.id === id);
            if (found) {
              let specs = {};
              let feats = [];
              let sizesList = [];
              let colorsList = [];

              try {
                if (typeof found.specifications === 'string') specs = JSON.parse(found.specifications);
                else if (typeof found.specifications === 'object') specs = found.specifications || {};
              } catch (e) {}

              try {
                if (typeof found.features === 'string') feats = JSON.parse(found.features);
                else if (Array.isArray(found.features)) feats = found.features || [];
              } catch (e) {}

              try {
                if (typeof found.sizes === 'string') sizesList = JSON.parse(found.sizes);
                else if (Array.isArray(found.sizes)) sizesList = found.sizes || [];
              } catch (e) {}

              try {
                if (typeof found.colors === 'string') colorsList = JSON.parse(found.colors);
                else if (Array.isArray(found.colors)) colorsList = found.colors || [];
              } catch (e) {}

              // Fetch SEO for product
              let seoObj = {
                seoTitle: `${found.title} | Product List`,
                metaDescription: found.shortDesc || '',
                focusKeyword: found.title.toLowerCase(),
                secondaryKeywords: '',
                slug: `/products/${found.slug}`,
                canonicalUrl: `https://productlist.com/products/${found.slug}`,
                robotsIndex: true,
                robotsFollow: true,
                ogTitle: found.title,
                ogDescription: found.shortDesc || '',
                ogImage: getMediaUrl(found.images?.[0]?.url || ''),
                twitterTitle: found.title,
                twitterDescription: found.shortDesc || '',
                twitterImage: getMediaUrl(found.images?.[0]?.url || ''),
              };

              try {
                const seoRes = await api.get(`/seo/product/${found.id}`);
                if (seoRes.data?.success && seoRes.data.seo) {
                  seoObj = { ...seoObj, ...seoRes.data.seo };
                }
              } catch (e) {}

              setFormData({
                title: found.title || '',
                slug: found.slug || '',
                sku: found.sku || '',
                brand: found.brand || 'PRODUCT LIST ATELIER',
                categoryId: found.categoryId || '',
                collection: found.collection || '',
                gender: found.gender || 'UNISEX',
                fabric: found.fabric || '',
                material: found.material || '',
                fit: found.fit || '',
                pattern: found.pattern || '',
                season: found.season || 'All Season',
                occasion: found.occasion || 'Casual / Everyday',
                careInstructions: found.careInstructions || 'Machine wash cold with similar colors. Line dry in shade.',
                currency: found.currency || 'USD',
                price: found.price !== undefined ? found.price.toString() : '',
                salePrice: found.salePrice !== null && found.salePrice !== undefined ? found.salePrice.toString() : '',
                discount: found.discount !== null && found.discount !== undefined ? found.discount.toString() : '',
                stock: found.stock !== undefined ? found.stock : 10,
                stockStatus: found.stockStatus || 'IN_STOCK',
                shortDesc: found.shortDesc || '',
                fullDesc: found.fullDesc || '',
                hoverImage: found.hoverImage || '',
                isActive: found.isActive !== false,
                isFeatured: Boolean(found.isFeatured),
                isBestseller: Boolean(found.isBestseller),
                isNewArrival: Boolean(found.isNewArrival),
                images: found.images || [],
                sizes: sizesList,
                colors: colorsList,
                specifications: specs,
                features: feats,
                seo: seoObj,
              });
            }
          }
        } catch (err) {
          toastError('Error fetching product for editing.');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  // Handle Image Add
  const handleImageSelected = (url) => {
    const isFirst = formData.images.length === 0;
    const newImage = {
      url,
      altText: `${formData.title || 'Product'} in ${formData.fabric || 'garment'} view`,
      title: `${formData.title || 'Product'} Image`,
      caption: '',
      isThumbnail: isFirst,
      displayOrder: formData.images.length + 1,
    };
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImage],
    }));
  };

  const handleImageMetadataChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, images: updated };
    });
  };

  const handleSetThumbnail = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isThumbnail: i === index,
      })),
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const remaining = prev.images.filter((_, i) => i !== index);
      if (remaining.length > 0 && !remaining.some((img) => img.isThumbnail)) {
        remaining[0].isThumbnail = true;
      }
      return { ...prev, images: remaining };
    });
  };

  // Toggle Size in product
  const handleToggleSize = (sizeName) => {
    setFormData((prev) => {
      const exists = prev.sizes.find((s) => s.name === sizeName);
      if (exists) {
        return { ...prev, sizes: prev.sizes.filter((s) => s.name !== sizeName) };
      } else {
        return { ...prev, sizes: [...prev.sizes, { name: sizeName, inStock: true }] };
      }
    });
  };

  const handleToggleSizeStock = (sizeName) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s) =>
        s.name === sizeName ? { ...s, inStock: !s.inStock } : s
      ),
    }));
  };

  // Toggle Color in product
  const handleToggleColor = (colorObj) => {
    setFormData((prev) => {
      const exists = prev.colors.find((c) => c.name === colorObj.name);
      if (exists) {
        return { ...prev, colors: prev.colors.filter((c) => c.name !== colorObj.name) };
      } else {
        return {
          ...prev,
          colors: [...prev.colors, { name: colorObj.name, hex: colorObj.hexCode, inStock: true }],
        };
      }
    });
  };

  // SEO Score Analyzer Calculation (0 to 100)
  const calculateSEOScore = () => {
    const seo = formData.seo || {};
    const title = seo.seoTitle || formData.title || '';
    const desc = seo.metaDescription || formData.shortDesc || '';
    const keyword = (seo.focusKeyword || '').toLowerCase().trim();
    const fullDesc = (formData.fullDesc || '').toLowerCase();
    const slug = seo.slug || formData.slug || '';

    const checks = [
      { id: 'title_exists', label: 'SEO Title exists', passed: title.length > 0, points: 10 },
      { id: 'title_length', label: 'SEO Title optimal length (30-65 chars)', passed: title.length >= 30 && title.length <= 65, points: 10 },
      { id: 'desc_exists', label: 'Meta Description exists', passed: desc.length > 0, points: 10 },
      { id: 'desc_length', label: 'Meta Description optimal length (70-160 chars)', passed: desc.length >= 70 && desc.length <= 160, points: 10 },
      { id: 'keyword_exists', label: 'Focus Keyword defined', passed: keyword.length > 0, points: 10 },
      { id: 'keyword_in_title', label: 'Focus Keyword appears in Title', passed: keyword.length > 0 && title.toLowerCase().includes(keyword), points: 15 },
      { id: 'keyword_in_desc', label: 'Focus Keyword appears in Meta Description', passed: keyword.length > 0 && desc.toLowerCase().includes(keyword), points: 15 },
      { id: 'keyword_in_content', label: 'Focus Keyword appears in Product Description', passed: keyword.length > 0 && fullDesc.includes(keyword), points: 10 },
      { id: 'slug_friendly', label: 'SEO-friendly URL slug', passed: slug.length > 2 && !slug.includes(' ') && !slug.includes('?'), points: 10 },
      {
        id: 'images_alt',
        label: 'Alt text present for all gallery images',
        passed: formData.images.length > 0 && formData.images.every((img) => img.altText && img.altText.trim().length > 3),
        points: 10,
      },
    ];

    const passedPoints = checks.filter((c) => c.passed).reduce((acc, c) => acc + c.points, 0);
    const totalPoints = checks.reduce((acc, c) => acc + c.points, 0);
    const score = Math.round((passedPoints / totalPoints) * 100);

    const warnings = [];
    if (desc.length > 0 && desc.length < 70) warnings.push('Meta description is too short (recommended: 70-160 characters).');
    if (keyword.length > 0 && !desc.toLowerCase().includes(keyword)) warnings.push('Focus keyword is missing from meta description.');
    if (keyword.length > 0 && !title.toLowerCase().includes(keyword)) warnings.push('Focus keyword is missing from SEO title.');
    if (formData.images.some((img) => !img.altText || img.altText.trim() === '')) warnings.push('Some product images are missing descriptive Alt Text.');

    return { score, checks, warnings };
  };

  const { score: seoScore, checks: seoChecks, warnings: seoWarnings } = calculateSEOScore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || formData.price === '') {
      toastError('Product title and price are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        discount: formData.discount ? parseFloat(formData.discount) : null,
        stock: parseInt(formData.stock) || 0,
        categoryId: formData.categoryId || null,
        collection: formData.collection || null,
      };

      let res;
      if (isEdit) {
        res = await api.put(`/products/${id}`, payload);
      } else {
        res = await api.post('/products', payload);
      }

      if (res.data?.success) {
        success(isEdit ? 'Garment updated successfully!' : 'Garment created successfully!');
        navigate('/admin/products');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Error saving product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', color: '#94A3B8', textAlign: 'center' }}>Loading garment details...</div>;
  }

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/admin/products" className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} /> Back to Catalog
          </Link>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
              {isEdit ? `Edit Garment: ${formData.title}` : 'Create New Garment'}
            </h1>
            <span style={{ fontSize: '0.8rem', color: '#818CF8', fontWeight: 600 }}>
              Fashion Catalog & SEO Management
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="btn btn-primary"
          style={{ gap: '8px', padding: '0.65rem 1.5rem', fontWeight: 700 }}
        >
          <Save size={18} /> {saving ? 'Saving...' : (isEdit ? 'Update Garment' : 'Publish Garment')}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '4px',
        overflowX: 'auto',
      }}>
        {[
          { key: 'basic', label: 'Basic Info & Pricing' },
          { key: 'garment', label: 'Garment Attributes & Fabric' },
          { key: 'sizes_colors', label: 'Sizes & Color Swatches' },
          { key: 'images', label: `Images Gallery (${formData.images.length})` },
          { key: 'seo', label: `SEO & Score (${seoScore}/100)` },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '6px 6px 0 0',
              border: 'none',
              background: activeTab === t.key ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === t.key ? '#FFFFFF' : '#94A3B8',
              fontWeight: activeTab === t.key ? 700 : 500,
              borderBottom: activeTab === t.key ? '2px solid #6366F1' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* TAB 1: BASIC INFORMATION & PRICING */}
        {activeTab === 'basic' && (
          <>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem' }}>
                Basic Information
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Heavyweight Oversized Organic Cotton T-Shirt"
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">SKU (Stock Keeping Unit)</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. PL-TSH-240-BLK"
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Brand / Atelier</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. PRODUCT LIST ATELIER"
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="select-field"
                  >
                    <option value="">Select Garment Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Collection</label>
                  <select
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    className="select-field"
                  >
                    <option value="">Select Collection</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.name}>{col.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-label">Short Description (Card Summary)</label>
                <textarea
                  rows={2}
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="Brief 1-2 sentence overview for product cards and meta tags..."
                  className="textarea-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full In-Depth Description</label>
                <textarea
                  rows={5}
                  value={formData.fullDesc}
                  onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                  placeholder="Comprehensive description, textile story, weave construction, and styling guidelines..."
                  className="textarea-field"
                />
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem' }}>
                Pricing & Inventory
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Regular Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="68.00"
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sale / Offer Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="54.00"
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Status</label>
                  <select
                    value={formData.stockStatus}
                    onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
                    className="select-field"
                  >
                    <option value="IN_STOCK">In Stock</option>
                    <option value="LOW_STOCK">Low Stock</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Visibility & Toggles */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem' }}>
                Publishing & Promotional Flags
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#6366F1' }}
                  />
                  <span style={{ fontSize: '0.95rem', color: '#FFFFFF', fontWeight: 600 }}>
                    Active / Published
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#6366F1' }}
                  />
                  <span style={{ fontSize: '0.95rem', color: '#FFFFFF', fontWeight: 600 }}>
                    Mark as Featured
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#6366F1' }}
                  />
                  <span style={{ fontSize: '0.95rem', color: '#FFFFFF', fontWeight: 600 }}>
                    Mark as Bestseller
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#6366F1' }}
                  />
                  <span style={{ fontSize: '0.95rem', color: '#FFFFFF', fontWeight: 600 }}>
                    Mark as New Arrival
                  </span>
                </label>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: GARMENT ATTRIBUTES & SPECIFICATIONS */}
        {activeTab === 'garment' && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem' }}>
              Garment & Textile Specifications
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Department / Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="select-field"
                >
                  <option value="UNISEX">Unisex</option>
                  <option value="MENS">Men's Wear</option>
                  <option value="WOMENS">Women's Wear</option>
                  <option value="KIDS">Kids' Wear</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fabric Details (GSM & Blend)</label>
                <input
                  type="text"
                  value={formData.fabric}
                  onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                  placeholder="e.g. 100% Organic Supima Cotton (240 GSM)"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Material</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="e.g. Organic Cotton, French Linen, Merino Wool"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fit / Cut</label>
                <input
                  type="text"
                  value={formData.fit}
                  onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                  placeholder="e.g. Oversized Boxy, Relaxed Fit, Tailored Slim"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pattern / Weave</label>
                <input
                  type="text"
                  value={formData.pattern}
                  onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                  placeholder="e.g. Solid Matte, Fine Rib, Woven Slub"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Season</label>
                <input
                  type="text"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  placeholder="e.g. Spring / Summer 2026, All Season"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Occasion</label>
                <input
                  type="text"
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  placeholder="e.g. Casual, Streetwear, Festive, Smart Casual"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Care & Washing Instructions</label>
                <input
                  type="text"
                  value={formData.careInstructions}
                  onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                  placeholder="e.g. Machine wash cold. Line dry in shade."
                  className="input-field"
                />
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
                Dynamic Technical Specifications
              </h4>
              <SpecBuilder
                specs={formData.specifications}
                features={formData.features}
                onChangeSpecs={(specs) => setFormData({ ...formData, specifications: specs })}
                onChangeFeatures={(features) => setFormData({ ...formData, features })}
              />
            </div>
          </div>
        )}

        {/* TAB 3: SIZES & COLOR SWATCHES */}
        {activeTab === 'sizes_colors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Sizes Box */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Available Sizes
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                    Select which sizes are available for this garment and toggle in-stock status.
                  </p>
                </div>
                <Link to="/admin/sizes" className="btn btn-secondary btn-sm">
                  Manage Master Sizes
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {masterSizes.map((ms) => {
                  const isSelected = formData.sizes.some((s) => s.name === ms.name);
                  return (
                    <button
                      key={ms.id}
                      type="button"
                      onClick={() => handleToggleSize(ms.name)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: isSelected ? '2px solid #6366F1' : '1px solid rgba(255,255,255,0.15)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(0,0,0,0.3)',
                        color: isSelected ? '#FFFFFF' : '#94A3B8',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {isSelected && <Check size={14} color="#818CF8" />}
                      <span>{ms.name}</span>
                    </button>
                  );
                })}
              </div>

              {formData.sizes.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
                    Size-wise Inventory Availability:
                  </span>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {formData.sizes.map((s) => (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => handleToggleSizeStock(s.name)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: s.inStock ? '1px solid #16A34A' : '1px solid #DC2626',
                          background: s.inStock ? 'rgba(22, 163, 74, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                          color: s.inStock ? '#4ADE80' : '#F87171',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {s.name}: {s.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Colors Box */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Color Variants & Swatches
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                    Select colors to display on storefront swatches.
                  </p>
                </div>
                <Link to="/admin/colors" className="btn btn-secondary btn-sm">
                  Manage Master Colors
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {masterColors.map((mc) => {
                  const isSelected = formData.colors.some((c) => c.name === mc.name);
                  return (
                    <button
                      key={mc.id}
                      type="button"
                      onClick={() => handleToggleColor(mc)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        border: isSelected ? '2px solid #6366F1' : '1px solid rgba(255,255,255,0.15)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(0,0,0,0.3)',
                        color: isSelected ? '#FFFFFF' : '#94A3B8',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        backgroundColor: mc.hexCode,
                        border: '1px solid rgba(255,255,255,0.3)',
                      }} />
                      <span>{mc.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: IMAGES GALLERY & ALT TEXT */}
        {activeTab === 'images' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Multi-Image Gallery & Alt Text (SEO)
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                    Every image must have descriptive Alt Text for Google Image indexing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="btn btn-secondary btn-sm"
                >
                  <ImageIcon size={16} /> Add Image from Media Library
                </button>
              </div>

              {formData.images.length === 0 ? (
                <div style={{
                  border: '2px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '3rem',
                  textAlign: 'center',
                  color: '#94A3B8',
                }}>
                  <p style={{ marginBottom: '1rem' }}>No gallery images added yet.</p>
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="btn btn-primary btn-sm"
                  >
                    Select Images
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px 1fr auto',
                        gap: '1.5rem',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        border: img.isThumbnail ? '2px solid #6366F1' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '1rem',
                      }}
                    >
                      <div style={{ width: '120px', height: '140px', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                        <img src={getMediaUrl(img.url)} alt={img.altText || 'Product'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {img.isThumbnail && (
                          <span className="badge badge-primary" style={{ position: 'absolute', bottom: '4px', left: '4px', fontSize: '0.65rem' }}>
                            MAIN
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                            Image Alt Text (Crucial for Google SEO) *
                          </label>
                          <input
                            type="text"
                            value={img.altText || ''}
                            onChange={(e) => handleImageMetadataChange(idx, 'altText', e.target.value)}
                            placeholder="e.g. Black oversized organic cotton t-shirt for men"
                            className="input-field"
                            style={{ height: '36px', fontSize: '0.85rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                            Image Title / Tooltip
                          </label>
                          <input
                            type="text"
                            value={img.title || ''}
                            onChange={(e) => handleImageMetadataChange(idx, 'title', e.target.value)}
                            placeholder="e.g. Front Fit Profile"
                            className="input-field"
                            style={{ height: '36px', fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {!img.isThumbnail && (
                          <button
                            type="button"
                            onClick={() => handleSetThumbnail(idx)}
                            className="btn btn-secondary btn-sm"
                          >
                            Set Main
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="btn btn-sm"
                          style={{ color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'transparent' }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hover Alternate Image */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Alternate Hover Image
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
                Displayed automatically when customers hover over the garment card in product grids.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {formData.hoverImage ? (
                  <div style={{ width: '100px', height: '120px', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                    <img src={formData.hoverImage} alt="Hover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: '100px', height: '120px', borderRadius: '6px', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '0.75rem' }}>
                    No Hover Image
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setHoverMediaPickerOpen(true)}
                    className="btn btn-secondary btn-sm"
                  >
                    Select Hover Image
                  </button>
                  {formData.hoverImage && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hoverImage: '' })}
                      className="btn btn-sm"
                      style={{ color: '#F87171' }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PRODUCT SEO & REAL-TIME SCORE ANALYSIS */}
        {activeTab === 'seo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Real-time SEO Score & Analysis Meter (Requirement #10) */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Product SEO Health Score
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                    Internal SEO analysis engine to optimize this garment for search engines.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    fontSize: '1.8rem',
                    fontWeight: 900,
                    color: seoScore >= 80 ? '#4ADE80' : (seoScore >= 50 ? '#FBBF24' : '#F87171'),
                  }}>
                    {seoScore}/100
                  </div>
                  <span className={`badge ${seoScore >= 80 ? 'badge-success' : (seoScore >= 50 ? 'badge-warning' : 'badge-error')}`}>
                    {seoScore >= 80 ? 'EXCELLENT' : (seoScore >= 50 ? 'NEEDS IMPROVEMENT' : 'POOR')}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{
                  width: `${seoScore}%`,
                  height: '100%',
                  backgroundColor: seoScore >= 80 ? '#16A34A' : (seoScore >= 50 ? '#F59E0B' : '#DC2626'),
                  transition: 'width 0.4s ease',
                }} />
              </div>

              {/* Checks Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {seoChecks.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: c.passed ? '#E2E8F0' : '#94A3B8',
                    }}
                  >
                    {c.passed ? (
                      <CheckCircle2 size={16} color="#4ADE80" />
                    ) : (
                      <AlertTriangle size={16} color="#FBBF24" />
                    )}
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>

              {/* Warnings */}
              {seoWarnings.length > 0 && (
                <div style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FBBF24' }}>
                    SEO Optimization Suggestions:
                  </span>
                  {seoWarnings.map((w, idx) => (
                    <div key={idx} style={{ fontSize: '0.82rem', color: '#FDE68A' }}>
                      • {w}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEO Form Inputs */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem' }}>
                Meta Tags & Indexing Directives
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className="form-label">SEO Title *</label>
                    <span style={{ fontSize: '0.75rem', color: (formData.seo?.seoTitle || '').length >= 30 && (formData.seo?.seoTitle || '').length <= 65 ? '#4ADE80' : '#FBBF24' }}>
                      {(formData.seo?.seoTitle || '').length} / 60 recommended characters
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.seo?.seoTitle || ''}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, seoTitle: e.target.value } })}
                    placeholder="e.g. Premium Cotton Oversized T-Shirt | Product List"
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className="form-label">Meta Description *</label>
                    <span style={{ fontSize: '0.75rem', color: (formData.seo?.metaDescription || '').length >= 70 && (formData.seo?.metaDescription || '').length <= 160 ? '#4ADE80' : '#FBBF24' }}>
                      {(formData.seo?.metaDescription || '').length} / 160 recommended characters
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.seo?.metaDescription || ''}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })}
                    placeholder="e.g. Shop premium cotton oversized T-shirts from Product List. Explore comfortable and stylish unisex fashion in multiple sizes and colors."
                    className="textarea-field"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Focus Keyword</label>
                    <input
                      type="text"
                      value={formData.seo?.focusKeyword || ''}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, focusKeyword: e.target.value } })}
                      placeholder="e.g. oversized cotton t-shirt"
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Secondary Keywords</label>
                    <input
                      type="text"
                      value={formData.seo?.secondaryKeywords || ''}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, secondaryKeywords: e.target.value } })}
                      placeholder="e.g. luxury streetwear, 240 gsm tee, organic cotton shirt"
                      className="input-field"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">SEO URL Slug</label>
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value, seo: { ...formData.seo, slug: `/products/${e.target.value}` } })}
                      placeholder="e.g. heavyweight-oversized-organic-cotton-tshirt"
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Canonical URL Override (Optional)</label>
                    <input
                      type="url"
                      value={formData.seo?.canonicalUrl || ''}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, canonicalUrl: e.target.value } })}
                      placeholder="https://productlist.com/products/heavyweight-oversized-organic-cotton-tshirt"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Robots Directive</label>
                  <select
                    value={`${formData.seo?.robotsIndex !== false ? 'index' : 'noindex'},${formData.seo?.robotsFollow !== false ? 'follow' : 'nofollow'}`}
                    onChange={(e) => {
                      const [idx, fol] = e.target.value.split(',');
                      setFormData({
                        ...formData,
                        seo: {
                          ...formData.seo,
                          robotsIndex: idx === 'index',
                          robotsFollow: fol === 'follow',
                        },
                      });
                    }}
                    className="select-field"
                  >
                    <option value="index,follow">Index, Follow (Recommended / Default)</option>
                    <option value="noindex,follow">Noindex, Follow</option>
                    <option value="index,nofollow">Index, Nofollow</option>
                    <option value="noindex,nofollow">Noindex, Nofollow</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Google SERP Snippet Preview */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} /> Google Search SERP Snippet Preview
              </h3>

              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '1.5rem',
                color: '#202124',
                fontFamily: 'Arial, sans-serif',
                maxWidth: '650px',
              }}>
                <div style={{ fontSize: '0.85rem', color: '#202124', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>https://productlist.com</span>
                  <span style={{ color: '#5f6368' }}>› products › {formData.slug || 'garment-name'}</span>
                </div>
                <div style={{ fontSize: '1.25rem', color: '#1a0dab', fontWeight: 400, lineHeight: 1.3, marginBottom: '6px' }}>
                  {formData.seo?.seoTitle || formData.title || 'Product Title | Product List'}
                </div>
                <div style={{ fontSize: '0.88rem', color: '#4d5156', lineHeight: 1.45 }}>
                  {formData.seo?.metaDescription || formData.shortDesc || 'Shop premium garments and luxury sustainable fashion from Product List Atelier.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/admin/products" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-lg"
            style={{ fontWeight: 700 }}
          >
            <Save size={18} /> {saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Publish Garment')}
          </button>
        </div>
      </form>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleImageSelected}
        title="Add Gallery Image"
      />

      {/* Hover Image Media Picker */}
      <MediaPickerModal
        isOpen={hoverMediaPickerOpen}
        onClose={() => setHoverMediaPickerOpen(false)}
        onSelect={(url) => {
          setFormData((prev) => ({ ...prev, hoverImage: url }));
          setHoverMediaPickerOpen(false);
        }}
        title="Select Alternate Hover Image"
      />
    </div>
  );
};

export default AdminProductForm;
