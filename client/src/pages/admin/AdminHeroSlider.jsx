import { getMediaUrl } from '../../utils/urlHelper';
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import MediaPickerModal from '../../components/admin/MediaPickerModal';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  X,
  Save,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const AdminHeroSlider = () => {
  const { success, error: toastError } = useToast();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Live preview selection
  const [previewSlide, setPreviewSlide] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badge: 'NEW LAUNCH',
    description: '',
    buttonText: 'Explore Products',
    buttonUrl: '/products',
    image: '',
    overlayOpacity: 0.5,
    displayOrder: 1,
    isActive: true,
  });

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await api.get('/hero-slides?all=true');
      if (res.data?.success) {
        setSlides(res.data.slides || []);
        if (res.data.slides?.length > 0 && !previewSlide) {
          setPreviewSlide(res.data.slides[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching hero slides:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: 'FLAGSHIP COLLECTION 2026',
      badge: 'NEW ARRIVAL',
      description: 'Discover the next evolution of precision craftsmanship and minimalist design.',
      buttonText: 'Explore Collection',
      buttonUrl: '/products',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1920&auto=format&fit=crop&q=85',
      overlayOpacity: 0.5,
      displayOrder: slides.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (slide) => {
    setEditingId(slide.id);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || '',
      badge: slide.badge || '',
      description: slide.description || '',
      buttonText: slide.buttonText || 'Explore Products',
      buttonUrl: slide.buttonUrl || '/products',
      image: slide.image,
      overlayOpacity: slide.overlayOpacity !== undefined ? slide.overlayOpacity : 0.5,
      displayOrder: slide.displayOrder || 1,
      isActive: slide.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      toastError('Slide title and background image are required.');
      return;
    }

    try {
      let res;
      if (editingId) {
        res = await api.put(`/hero-slides/${editingId}`, formData);
      } else {
        res = await api.post('/hero-slides', formData);
      }

      if (res.data?.success) {
        success(editingId ? 'Slide updated successfully!' : 'Slide added successfully!');
        setModalOpen(false);
        fetchSlides();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Error saving hero slide.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/hero-slides/${deleteId}`);
      if (res.data?.success) {
        success('Slide deleted successfully.');
        setDeleteId(null);
        fetchSlides();
      }
    } catch (err) {
      toastError('Error deleting hero slide.');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === slides.length - 1)) return;

    const targetIndex = index + direction;
    const reordered = [...slides];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const payload = reordered.map((item, i) => ({
      id: item.id,
      displayOrder: i + 1,
    }));

    try {
      const res = await api.put('/hero-slides/reorder', { slides: payload });
      if (res.data?.success) {
        setSlides(res.data.slides);
        success('Slide order updated.');
      }
    } catch (err) {
      toastError('Failed to update slide order.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>
            Hero Slider Management (6 Dynamic Slides)
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Independently manage all 6 slides on the homepage: background photography, headings, tags, overlay darkness, and CTAs.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Add Hero Slide
        </button>
      </div>

      {/* Live Preview Box */}
      {previewSlide && (
        <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818CF8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Live Slide Preview — Slide #{previewSlide.displayOrder}: {previewSlide.title}
            </span>
            <span className="badge badge-dark">Storefront Scale: 620px</span>
          </div>

          <div style={{
            position: 'relative',
            height: '320px',
            backgroundImage: `url("${previewSlide.image}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            padding: '0 3rem',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, ${previewSlide.overlayOpacity || 0.5}) 60%, rgba(11, 15, 25, 0.8) 100%)`,
            }} />

            <div style={{ position: 'relative', zIndex: 2, maxWidth: '580px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                {previewSlide.badge && <span className="badge badge-primary">{previewSlide.badge}</span>}
                {previewSlide.subtitle && <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A5B4FC', letterSpacing: '0.15em' }}>{previewSlide.subtitle}</span>}
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, marginBottom: '8px' }}>
                {previewSlide.title}
              </h2>
              {previewSlide.description && (
                <p style={{ fontSize: '0.9rem', color: '#CBD5E1', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {previewSlide.description}
                </p>
              )}
              <span className="btn btn-sm btn-primary">
                {previewSlide.buttonText || 'Explore Products'} <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Slides Grid / List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="glass-card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              border: previewSlide?.id === slide.id ? '2px solid #6366F1' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div>
              {/* Image Preview thumbnail */}
              <div style={{
                position: 'relative',
                paddingTop: '50%',
                borderRadius: '10px',
                overflow: 'hidden',
                marginBottom: '1rem',
                backgroundColor: '#0B0F19',
              }}>
                <img
                  src={getMediaUrl(slide.image)}
                  alt={slide.title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '6px' }}>
                  <span className="badge badge-dark">Slide 0{idx + 1}</span>
                  {slide.badge && <span className="badge badge-primary">{slide.badge}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A5B4FC', letterSpacing: '0.1em' }}>
                  {slide.subtitle || 'NO SUBTITLE'}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: slide.isActive ? '#34D399' : '#F87171',
                }}>
                  {slide.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', lineHeight: 1.25 }}>
                {slide.title}
              </h3>

              <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.45, marginBottom: '1rem' }}>
                {slide.description}
              </p>
            </div>

            {/* Button info & Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              {/* Reorder Buttons */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => handleMoveOrder(idx, -1)}
                  disabled={idx === 0}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#CBD5E1',
                    padding: '4px',
                    cursor: 'pointer',
                    opacity: idx === 0 ? 0.3 : 1,
                  }}
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveOrder(idx, 1)}
                  disabled={idx === slides.length - 1}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#CBD5E1',
                    padding: '4px',
                    cursor: 'pointer',
                    opacity: idx === slides.length - 1 ? 0.3 : 1,
                  }}
                >
                  <ArrowDown size={14} />
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setPreviewSlide(slide)}
                  title="Preview Slide"
                  className="btn btn-sm btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                >
                  <Eye size={12} /> Preview
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(slide)}
                  title="Edit Slide"
                  className="btn btn-sm btn-primary"
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                >
                  <Edit2 size={12} /> Edit
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteId(slide.id)}
                  title="Delete Slide"
                  className="btn btn-sm btn-danger"
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Slide Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
        }}>
          <div className="glass-card" style={{
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            borderRadius: 'var(--radius-xl)',
            background: '#0F172A',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            animation: 'fadeIn 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                {editingId ? 'Edit Hero Slide' : 'Add New Hero Slide'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Slide Main Heading *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Acoustic Perfection Redefined"
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Subtitle / Collection Name</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. FLAGSHIP COLLECTION 2026"
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Badge Text</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. NEW LAUNCH, BEST SELLER"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Slide Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Compelling promotional narrative..."
                  className="textarea-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Background Image URL (1920x1080 recommended) *</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or /uploads/..."
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Button Text</label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Button Destination URL</label>
                  <input
                    type="text"
                    value={formData.buttonUrl}
                    onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div className="form-group">
                  <label className="form-label">Overlay Darkness (0.0 to 1.0)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={formData.overlayOpacity}
                    onChange={(e) => setFormData({ ...formData, overlayOpacity: parseFloat(e.target.value) || 0.5 })}
                    className="input-field"
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#6366F1' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600 }}>Active in Slider</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Save size={16} /> Save Hero Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setFormData((prev) => ({ ...prev, image: url }))}
        title="Select Hero Slide Image"
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Hero Slide"
        message="Are you sure you want to remove this hero slide?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminHeroSlider;
