import { getMediaUrl } from '../../utils/urlHelper';
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import MediaPickerModal from '../../components/admin/MediaPickerModal';
import { FolderKanban, Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

const AdminCollections = () => {
  const { success, error: toastError } = useToast();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    badge: '',
    displayOrder: 0,
    isActive: true,
  });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCollections = async () => {
    try {
      const res = await api.get('/collections?all=true');
      if (res.data?.success) {
        setCollections(res.data.collections || []);
      }
    } catch (err) {
      toastError('Error fetching collections list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleOpenCreate = () => {
    setEditingCol(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      badge: '',
      displayOrder: collections.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (col) => {
    setEditingCol(col);
    setFormData({
      name: col.name,
      description: col.description || '',
      image: col.image || '',
      badge: col.badge || '',
      displayOrder: col.displayOrder,
      isActive: col.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toastError('Collection name is required.');
      return;
    }

    try {
      if (editingCol) {
        await api.put(`/collections/${editingCol.id}`, formData);
        success('Collection updated successfully!');
      } else {
        await api.post('/collections', formData);
        success('Collection created successfully!');
      }
      setModalOpen(false);
      fetchCollections();
    } catch (err) {
      toastError(err.response?.data?.message || 'Error saving collection.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/collections/${deleteTarget.id}`);
      success('Collection deleted successfully!');
      setDeleteTarget(null);
      fetchCollections();
    } catch (err) {
      toastError(err.response?.data?.message || 'Error deleting collection.');
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF' }}>
            Fashion Collections Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
            Curate seasonal drops, capsule lookbooks, and fashion edits.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary" style={{ gap: '8px' }}>
          <Plus size={16} /> Add New Collection
        </button>
      </div>

      {/* Grid of Collections */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>Loading collections...</div>
      ) : collections.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
          No collections created yet. Click "Add New Collection" above.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {collections.map((col) => (
            <div
              key={col.id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ width: '100%', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', position: 'relative', backgroundColor: '#0B0F19' }}>
                  <img
                    src={getMediaUrl(col.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800')}
                    alt={col.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {col.badge && (
                    <span className="badge badge-primary" style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.7rem' }}>
                      {col.badge}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
                  {col.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.4, marginBottom: '1rem' }}>
                  {col.description || 'No description provided.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span className={`badge ${col.isActive ? 'badge-success' : 'badge-secondary'}`}>
                  {col.isActive ? 'Active' : 'Draft'}
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleOpenEdit(col)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 10px' }}
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(col)}
                    className="btn btn-sm"
                    style={{ padding: '6px 10px', color: '#F87171', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
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
            maxWidth: '540px',
            width: '100%',
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem' }}>
              {editingCol ? 'Edit Fashion Collection' : 'Create New Collection'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Atelier Summer 2026"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Badge / Pill Text</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. SPRING / SUMMER DROP"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image URL</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="input-field"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="btn btn-secondary btn-sm"
                  >
                    <ImageIcon size={14} /> Library
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Atmospheric summary of fabrics, silhouettes, and inspiration..."
                  className="textarea-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  className="input-field"
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#6366F1' }}
                />
                <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600 }}>Active</span>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCol ? 'Save Changes' : 'Create Collection'}
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
        onSelect={(url) => {
          setFormData((prev) => ({ ...prev, image: url }));
          setMediaPickerOpen(false);
        }}
        title="Select Collection Cover Image"
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Collection"
        message={`Are you sure you want to delete collection "${deleteTarget?.name}"?`}
      />
    </div>
  );
};

export default AdminCollections;
