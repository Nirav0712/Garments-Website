import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { useSite } from '../../context/SiteContext';
import MediaPickerModal from '../../components/admin/MediaPickerModal';
import {
  Layers,
  Save,
  Sparkles,
  Image as ImageIcon,
  Plus,
  Trash2,
} from 'lucide-react';

const AdminPagesCMS = () => {
  const { success, error: toastError } = useToast();
  const { refreshSiteData } = useSite();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const [aboutHero, setAboutHero] = useState({
    sectionKey: 'about_hero',
    page: 'about',
    title: 'Crafting the Intersection of Form & Performance',
    subtitle: 'OUR PHILOSOPHY & STORY',
    content: 'Product List was founded on a singular obsession: to eliminate unnecessary complexity and curate hardware and products that inspire focus, elevate aesthetics, and endure through decades of daily use.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80',
  });

  const [contactHeader, setContactHeader] = useState({
    sectionKey: 'contact_page_header',
    page: 'contact',
    title: 'Get in Touch with Our Team',
    subtitle: 'WE ARE HERE TO HELP',
    content: 'Have a question regarding product specifications, enterprise allocations, or bespoke setups? Our specialist team is ready to assist you.',
  });

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await api.get('/content');
        if (res.data?.success && res.data.data) {
          if (res.data.data['about_hero']) setAboutHero(res.data.data['about_hero']);
          if (res.data.data['contact_page_header']) setContactHeader(res.data.data['contact_page_header']);
        }
      } catch (err) {
        console.error('Error loading pages CMS:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/content/bulk', {
        sections: [aboutHero, contactHeader],
      });
      success('Page content updated successfully!');
      refreshSiteData();
    } catch (err) {
      toastError('Failed to save pages content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', color: '#94A3B8', textAlign: 'center' }}>Loading Pages CMS...</div>;
  }

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>
            Pages Content CMS (About & Contact)
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Customize headings, stories, narrative blocks, and backgrounds for About Us and Contact pages.
          </p>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          <Save size={18} /> {saving ? 'Saving...' : 'Save Page Content'}
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* About Page Hero */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#818CF8" /> About Page: Hero & Story Banner
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Subtitle / Badge</label>
              <input
                type="text"
                value={aboutHero.subtitle || ''}
                onChange={(e) => setAboutHero({ ...aboutHero, subtitle: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Main Heading</label>
              <input
                type="text"
                value={aboutHero.title || ''}
                onChange={(e) => setAboutHero({ ...aboutHero, title: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Story Narrative Content</label>
            <textarea
              rows={4}
              value={aboutHero.content || ''}
              onChange={(e) => setAboutHero({ ...aboutHero, content: e.target.value })}
              className="textarea-field"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hero Background Image</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="url"
                value={aboutHero.image || ''}
                onChange={(e) => setAboutHero({ ...aboutHero, image: e.target.value })}
                className="input-field"
              />
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="btn btn-secondary btn-sm"
              >
                <ImageIcon size={16} /> Media
              </button>
            </div>
          </div>
        </div>

        {/* Contact Page Header */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#34D399" /> Contact Page: Intro Header
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Badge Text</label>
              <input
                type="text"
                value={contactHeader.subtitle || ''}
                onChange={(e) => setContactHeader({ ...contactHeader, subtitle: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Main Heading</label>
              <input
                type="text"
                value={contactHeader.title || ''}
                onChange={(e) => setContactHeader({ ...contactHeader, title: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Intro Description</label>
            <textarea
              rows={3}
              value={contactHeader.content || ''}
              onChange={(e) => setContactHeader({ ...contactHeader, content: e.target.value })}
              className="textarea-field"
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
            <Save size={18} /> {saving ? 'Saving...' : 'Save Pages Content'}
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setAboutHero((prev) => ({ ...prev, image: url }))}
        title="Select About Hero Background"
      />
    </div>
  );
};

export default AdminPagesCMS;
