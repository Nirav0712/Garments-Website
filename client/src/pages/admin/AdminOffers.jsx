import { getMediaUrl } from '../../utils/urlHelper';
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import MediaPickerModal from '../../components/admin/MediaPickerModal';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Calendar,
  X,
  Save,
} from 'lucide-react';

const AdminOffers = () => {
  const { success, error: toastError } = useToast();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    discountText: '',
    buttonText: 'Shop Offer',
    buttonUrl: '/products',
    image: '',
    bgImage: '',
    startDate: '',
    endDate: '',
    isActive: true,
    displayOrder: 0,
  });

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/offers?all=true');
      if (res.data?.success) {
        setOffers(res.data.offers || []);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      discountText: 'UP TO 20% OFF',
      buttonText: 'Shop Offer',
      buttonUrl: '/products',
      image: '',
      bgImage: '',
      startDate: '',
      endDate: '',
      isActive: true,
      displayOrder: offers.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (off) => {
    setEditingId(off.id);
    setFormData({
      title: off.title,
      subtitle: off.subtitle || '',
      description: off.description || '',
      discountText: off.discountText || '',
      buttonText: off.buttonText || 'Shop Offer',
      buttonUrl: off.buttonUrl || '/products',
      image: off.image || '',
      bgImage: off.bgImage || '',
      startDate: off.startDate ? new Date(off.startDate).toISOString().split('T')[0] : '',
      endDate: off.endDate ? new Date(off.endDate).toISOString().split('T')[0] : '',
      isActive: off.isActive !== false,
      displayOrder: off.displayOrder || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toastError('Offer title is required.');
      return;
    }

    try {
      let res;
      if (editingId) {
        res = await api.put(`/offers/${editingId}`, formData);
      } else {
        res = await api.post('/offers', formData);
      }

      if (res.data?.success) {
        success(editingId ? 'Offer updated successfully!' : 'Offer created successfully!');
        setModalOpen(false);
        fetchOffers();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Error saving offer.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/offers/${deleteId}`);
      if (res.data?.success) {
        success('Offer deleted successfully.');
        setDeleteId(null);
        fetchOffers();
      }
    } catch (err) {
      toastError('Error deleting offer.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>
            Offer & Promotion Management
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Manage homepage offer banners, seasonal sales, discount tags, and active schedules.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Add New Offer
        </button>
      </div>

      {/* Offers Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Offer Campaign</th>
                <th>Discount Tag</th>
                <th>Button / Target</th>
                <th>Schedule</th>
                <th>Order</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                    Loading offers...
                  </td>
                </tr>
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                    No promotional offers found. Click "Add New Offer" to create one.
                  </td>
                </tr>
              ) : (
                offers.map((off) => (
                  <tr key={off.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={getMediaUrl(off.image || off.bgImage || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200')}
                          alt={off.title}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{off.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#A5B4FC' }}>{off.subtitle || 'No subtitle'}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      {off.discountText ? (
                        <span className="badge badge-amber">{off.discountText}</span>
                      ) : (
                        <span style={{ color: '#64748B' }}>—</span>
                      )}
                    </td>

                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{off.buttonText}</div>
                        <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{off.buttonUrl}</div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                        {off.startDate ? new Date(off.startDate).toLocaleDateString() : 'Immediate'}
                        {' — '}
                        {off.endDate ? new Date(off.endDate).toLocaleDateString() : 'Ongoing'}
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 700, color: '#CBD5E1', fontFamily: 'var(--font-mono)' }}>
                        {off.displayOrder}
                      </span>
                    </td>

                    <td>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: off.isActive ? '#34D399' : '#F87171',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        {off.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {off.isActive ? 'Active' : 'Paused'}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(off)}
                          title="Edit Offer"
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: 'rgba(99, 102, 241, 0.15)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#818CF8',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          onClick={() => setDeleteId(off.id)}
                          title="Delete Offer"
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#F87171',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Offer Modal */}
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
            maxWidth: '640px',
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
                {editingId ? 'Edit Offer Campaign' : 'Create New Offer'}
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
                <label className="form-label">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Summer Audio Showcase"
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Subtitle / Campaign Tag</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. EXCLUSIVE BUNDLE SAVINGS"
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Discount Badge Text</label>
                  <input
                    type="text"
                    value={formData.discountText}
                    onChange={(e) => setFormData({ ...formData, discountText: e.target.value })}
                    placeholder="e.g. UP TO 25% OFF"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Offer Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details of the promotion..."
                  className="textarea-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Banner Image URL</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
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
                    <ImageIcon size={16} /> Library
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
                  <label className="form-label">Button Link URL</label>
                  <input
                    type="text"
                    value={formData.buttonUrl}
                    onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
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
                  <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600 }}>Active Campaign</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Save size={16} /> Save Offer
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
        title="Select Offer Image"
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Offer"
        message="Are you sure you want to permanently delete this offer campaign?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminOffers;
