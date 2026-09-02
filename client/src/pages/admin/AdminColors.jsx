import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { Paintbrush, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

const AdminColors = () => {
  const { success, error: toastError } = useToast();
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    hexCode: '#111111',
    displayOrder: 0,
    isActive: true,
  });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchColors = async () => {
    try {
      const res = await api.get('/colors?all=true');
      if (res.data?.success) {
        setColors(res.data.colors || []);
      }
    } catch (err) {
      toastError('Error fetching colors list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleOpenCreate = () => {
    setEditingColor(null);
    setFormData({
      name: '',
      hexCode: '#111111',
      displayOrder: colors.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (color) => {
    setEditingColor(color);
    setFormData({
      name: color.name,
      hexCode: color.hexCode,
      displayOrder: color.displayOrder,
      isActive: color.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.hexCode) {
      toastError('Color name and HEX code are required.');
      return;
    }

    try {
      if (editingColor) {
        await api.put(`/colors/${editingColor.id}`, formData);
        success('Color updated successfully!');
      } else {
        await api.post('/colors', formData);
        success('Color created successfully!');
      }
      setModalOpen(false);
      fetchColors();
    } catch (err) {
      toastError(err.response?.data?.message || 'Error saving color.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/colors/${deleteTarget.id}`);
      success('Color deleted successfully!');
      setDeleteTarget(null);
      fetchColors();
    } catch (err) {
      toastError(err.response?.data?.message || 'Error deleting color.');
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF' }}>
            Color Swatches Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
            Manage garment color palettes and HEX codes used for storefront swatch previews.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary" style={{ gap: '8px' }}>
          <Plus size={16} /> Add New Color
        </button>
      </div>

      {/* Colors Grid & Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)', color: '#94A3B8' }}>
                <th style={{ padding: '1rem 1.5rem' }}>Color Preview</th>
                <th style={{ padding: '1rem 1.5rem' }}>Color Name</th>
                <th style={{ padding: '1rem 1.5rem' }}>HEX Code</th>
                <th style={{ padding: '1rem 1.5rem' }}>Display Order</th>
                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    Loading colors...
                  </td>
                </tr>
              ) : colors.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    No colors created yet. Click "Add New Color" above.
                  </td>
                </tr>
              ) : (
                colors.map((c) => (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      color: '#E2E8F0',
                    }}
                  >
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: c.hexCode,
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      }} />
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: '#FFFFFF' }}>
                      {c.name}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', color: '#818CF8' }}>
                      {c.hexCode}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#94A3B8' }}>
                      {c.displayOrder}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className={`badge ${c.isActive ? 'badge-success' : 'badge-secondary'}`}>
                        {c.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px 10px' }}
                          title="Edit Color"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(c)}
                          className="btn btn-sm"
                          style={{ padding: '6px 10px', color: '#F87171', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                          title="Delete Color"
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

      {/* Create / Edit Modal */}
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
            maxWidth: '480px',
            width: '100%',
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem' }}>
              {editingColor ? 'Edit Color' : 'Add New Color Variant'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Color Name * (e.g. Midnight Black, Sage Olive)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Midnight Black"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">HEX Color Code *</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.hexCode}
                    onChange={(e) => setFormData({ ...formData, hexCode: e.target.value })}
                    style={{ width: '48px', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                  />
                  <input
                    type="text"
                    required
                    value={formData.hexCode}
                    onChange={(e) => setFormData({ ...formData, hexCode: e.target.value })}
                    placeholder="#111111"
                    className="input-field"
                    style={{ flex: 1, fontFamily: 'monospace' }}
                  />
                </div>
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

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '4px' }}>
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
                  {editingColor ? 'Save Changes' : 'Create Color'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Color"
        message={`Are you sure you want to delete color "${deleteTarget?.name}"?`}
      />
    </div>
  );
};

export default AdminColors;
