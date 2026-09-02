import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { useSite } from '../../context/SiteContext';
import MediaPickerModal from '../../components/admin/MediaPickerModal';
import {
  FileText,
  Save,
  Sparkles,
  Image as ImageIcon,
  CheckCircle,
  Eye,
  ArrowRight,
  Globe,
  Scissors,
} from 'lucide-react';

const AdminHomepageCMS = () => {
  const { success, error: toastError } = useToast();
  const { refreshSiteData } = useSite();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [targetField, setTargetField] = useState(null);

  const [sections, setSections] = useState({
    home_featured_heading: {
      sectionKey: 'home_featured_heading',
      page: 'home',
      title: 'Signature Garments Collection',
      subtitle: 'HANDCRAFTED ATELIER ESSENTIALS',
      content: 'Meticulously engineered garments made from 240 GSM organic Supima cotton, Normandy flax linen, and Japanese selvedge denim.',
    },
    home_categories_heading: {
      sectionKey: 'home_categories_heading',
      page: 'home',
      title: 'Shop by Garment Category',
      subtitle: 'EXPLORE COLLECTIONS',
      content: 'Browse our specialized departments curated for timeless everyday elegance and modern streetwear drape.',
    },
    home_offers_heading: {
      sectionKey: 'home_offers_heading',
      page: 'home',
      title: 'Curated Offers & Seasonal Drops',
      subtitle: 'EXCLUSIVE ALLOCATIONS',
      content: 'Limited-quantity introductory releases and capsule wardrobe bundle savings.',
    },
    home_cta_banner: {
      sectionKey: 'home_cta_banner',
      page: 'home',
      title: 'Sustainable Elegance & Master Tailoring',
      subtitle: 'THE ATELIER MANIFESTO',
      content: 'We believe clothing should be enduring, tactile, and ethically crafted. Every garment is cut from GOTS-certified organic fibers and finished with bespoke artisanal precision.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80',
      meta: { buttonText: 'Explore New Season Drops', buttonUrl: '/products' },
    },
    home_about_brand: {
      sectionKey: 'home_about_brand',
      page: 'home',
      title: 'Rooted in Craftsmanship & Sustainable Fibers',
      subtitle: 'ABOUT PRODUCT LIST ATELIER',
      content: 'Founded on the philosophy that modern fashion should marry sculptural aesthetics with uncompromising textile integrity. Our materials are traceable from certified organic cotton mills in Portugal to handloom silk weavers in India.',
    },
    home_seo_content: {
      sectionKey: 'home_seo_content',
      page: 'home',
      title: 'Premium Garments & Sustainable Fashion Collection',
      subtitle: 'THE ART OF LUXURY DRESSING',
      content: `Welcome to PRODUCT LIST, your premier destination for luxury garments, sustainable fashion, and bespoke wardrobe essentials. Our design studio merges architectural minimalist silhouettes with ethically sourced, high-grade textiles.

Whether you are looking for heavyweight 240 GSM organic Supima cotton T-shirts, structured 450 GSM French terry hoodies, breezy Normandy flax linen shirts, double-pleated tailored trousers, or handcrafted silk-cotton ethnic kurtas, our curated collection is engineered to offer unmatched longevity, breathability, and poise.

Every garment features detailed sizing charts, size-wise inventory availability, authentic color swatches, and transparent fabric care instructions. We adhere to rigorous fair-wage labor standards and use non-toxic, eco-friendly dye processes to ensure our clothing is gentle on your skin and conscious of the planet. Experience seamless online ordering with fast worldwide express delivery and hassle-free returns.`,
    },
  });

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await api.get('/content?page=home');
        if (res.data?.success && res.data.data) {
          setSections((prev) => ({
            ...prev,
            ...res.data.data,
          }));
        }
      } catch (err) {
        console.error('Error fetching homepage CMS:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCMS();
  }, []);

  const handleChange = (sectionKey, field, value) => {
    setSections((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value,
      },
    }));
  };

  const handleMetaChange = (sectionKey, metaKey, value) => {
    setSections((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        meta: {
          ...(prev[sectionKey].meta || {}),
          [metaKey]: value,
        },
      },
    }));
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = Object.values(sections);
      const res = await api.post('/content/bulk', { sections: payload });
      if (res.data?.success) {
        success('Homepage content sections updated successfully! Instant live reflection on storefront.');
        refreshSiteData();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Error updating homepage content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', color: '#94A3B8', textAlign: 'center' }}>Loading Homepage CMS...</div>;
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>
            Homepage Content Management (CMS)
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Control every heading, garment narrative copy, promotional banner, and the dedicated Homepage SEO Content Section.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="btn btn-primary"
          style={{ gap: '8px', padding: '0.65rem 1.5rem', fontWeight: 700 }}
        >
          <Save size={18} /> {saving ? 'Saving Content...' : 'Publish Content Changes'}
        </button>
      </div>

      <form onSubmit={handleSaveAll} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Section 1: Categories Section Header */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Sparkles size={18} color="#60A5FA" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>
              1. Garment Categories Section Header
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Badge Text</label>
              <input
                type="text"
                value={sections.home_categories_heading?.subtitle || ''}
                onChange={(e) => handleChange('home_categories_heading', 'subtitle', e.target.value)}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Main Heading</label>
              <input
                type="text"
                value={sections.home_categories_heading?.title || ''}
                onChange={(e) => handleChange('home_categories_heading', 'title', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Section Description</label>
            <textarea
              rows={2}
              value={sections.home_categories_heading?.content || ''}
              onChange={(e) => handleChange('home_categories_heading', 'content', e.target.value)}
              className="textarea-field"
            />
          </div>
        </div>

        {/* Section 2: Featured Garments Header */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Sparkles size={18} color="#818CF8" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>
              2. Featured Garments Collection Header
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Badge Text</label>
              <input
                type="text"
                value={sections.home_featured_heading?.subtitle || ''}
                onChange={(e) => handleChange('home_featured_heading', 'subtitle', e.target.value)}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Main Heading</label>
              <input
                type="text"
                value={sections.home_featured_heading?.title || ''}
                onChange={(e) => handleChange('home_featured_heading', 'title', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Section Description</label>
            <textarea
              rows={2}
              value={sections.home_featured_heading?.content || ''}
              onChange={(e) => handleChange('home_featured_heading', 'content', e.target.value)}
              className="textarea-field"
            />
          </div>
        </div>

        {/* Section 3: Offers Header */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Sparkles size={18} color="#FBBF24" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>
              3. Curated Offers & Deals Section Header
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Badge Text</label>
              <input
                type="text"
                value={sections.home_offers_heading?.subtitle || ''}
                onChange={(e) => handleChange('home_offers_heading', 'subtitle', e.target.value)}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Main Heading</label>
              <input
                type="text"
                value={sections.home_offers_heading?.title || ''}
                onChange={(e) => handleChange('home_offers_heading', 'title', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Section Description</label>
            <textarea
              rows={2}
              value={sections.home_offers_heading?.content || ''}
              onChange={(e) => handleChange('home_offers_heading', 'content', e.target.value)}
              className="textarea-field"
            />
          </div>
        </div>

        {/* Section 4: Editorial Promotional CTA Banner */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Sparkles size={18} color="#EC4899" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>
              4. Editorial Fashion Promotional Banner
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Badge Text</label>
              <input
                type="text"
                value={sections.home_cta_banner?.subtitle || ''}
                onChange={(e) => handleChange('home_cta_banner', 'subtitle', e.target.value)}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Main Heading</label>
              <input
                type="text"
                value={sections.home_cta_banner?.title || ''}
                onChange={(e) => handleChange('home_cta_banner', 'title', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description Copy</label>
            <textarea
              rows={2}
              value={sections.home_cta_banner?.content || ''}
              onChange={(e) => handleChange('home_cta_banner', 'content', e.target.value)}
              className="textarea-field"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Background Banner Image URL</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="url"
                value={sections.home_cta_banner?.image || ''}
                onChange={(e) => handleChange('home_cta_banner', 'image', e.target.value)}
                className="input-field"
              />
              <button
                type="button"
                onClick={() => {
                  setTargetField('home_cta_banner');
                  setMediaPickerOpen(true);
                }}
                className="btn btn-secondary btn-sm"
              >
                <ImageIcon size={16} /> Library
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Button Text</label>
              <input
                type="text"
                value={sections.home_cta_banner?.meta?.buttonText || 'Explore New Season Drops'}
                onChange={(e) => handleMetaChange('home_cta_banner', 'buttonText', e.target.value)}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Button Target URL</label>
              <input
                type="text"
                value={sections.home_cta_banner?.meta?.buttonUrl || '/products'}
                onChange={(e) => handleMetaChange('home_cta_banner', 'buttonUrl', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Brand Story & Craftsmanship */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Scissors size={18} color="#A855F7" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>
              5. Sustainable Craftsmanship & Brand Story
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Badge Text</label>
              <input
                type="text"
                value={sections.home_about_brand?.subtitle || ''}
                onChange={(e) => handleChange('home_about_brand', 'subtitle', e.target.value)}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Main Heading</label>
              <input
                type="text"
                value={sections.home_about_brand?.title || ''}
                onChange={(e) => handleChange('home_about_brand', 'title', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Brand Story Copy</label>
            <textarea
              rows={3}
              value={sections.home_about_brand?.content || ''}
              onChange={(e) => handleChange('home_about_brand', 'content', e.target.value)}
              className="textarea-field"
            />
          </div>
        </div>

        {/* Section 6: Dedicated Homepage SEO Content Section (Requirement #15) */}
        <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid #6366F1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Globe size={18} color="#818CF8" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>
                6. Dedicated Homepage SEO Content Section (Requirement #15)
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                Provides long-form crawlable content with targeted keywords and internal links to boost organic rankings.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">SEO Subtitle Badge</label>
              <input
                type="text"
                value={sections.home_seo_content?.subtitle || ''}
                onChange={(e) => handleChange('home_seo_content', 'subtitle', e.target.value)}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Semantic H2 Heading</label>
              <input
                type="text"
                value={sections.home_seo_content?.title || ''}
                onChange={(e) => handleChange('home_seo_content', 'title', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Rich SEO Copywriting & Narrative Content</label>
            <textarea
              rows={8}
              value={sections.home_seo_content?.content || ''}
              onChange={(e) => handleChange('home_seo_content', 'content', e.target.value)}
              className="textarea-field"
              style={{ lineHeight: 1.6 }}
            />
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="submit" disabled={saving} className="btn btn-primary btn-lg" style={{ fontWeight: 700 }}>
            <Save size={18} /> {saving ? 'Publishing...' : 'Save & Publish Homepage CMS'}
          </button>
        </div>
      </form>

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          if (targetField) {
            handleChange(targetField, 'image', url);
          }
        }}
        title="Select Background Image"
      />
    </div>
  );
};

export default AdminHomepageCMS;
