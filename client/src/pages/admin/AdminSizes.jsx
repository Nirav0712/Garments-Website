import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { Ruler, Plus, Edit2, Trash2, Check, X, ArrowUpDown } from 'lucide-react';

const AdminSizes = () => {
  const { success, error: toastError } = useToast();
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSize, setEditingSize] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    displayOrder: 0,
    isActive: true,
  });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchSizes = async () => {
    try {
      const res = await api.get('/sizes?all=true');
      if (res.data?.success) {
        setSizes(res.data.sizes || []);
      }
    } catch (err) {
      toastError('Error fetching sizes list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleOpenCreate = () => {
    setEditingSize(null);
    setFormData({
      name: '',
      code: '',
      displayOrder: sizes.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (size) => {
    setEditingSize(size);
    setFormData({
      name: size.name,
      code: size.code || size.name,
      displayOrder: size.displayOrder,
      isActive: size.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toastError('Size name is required (e.g. S, M, L, XL).');
      return;
    }

    try {
      if (editingSize) {
        await api.put(`/sizes/${editingSize.id}`, formData);
        success('Size updated successfully!');
      } else {
        await api.post('/sizes', formData);
        success('Size created successfully!');
      }
      setModalOpen(false);
      fetchSizes();
    } catch (err) {
      toastError(err.response?.data?.message || 'Error saving size.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/sizes/${deleteTarget.id}`);
      success('Size deleted successfully!');
      setDeleteTarget(null);
      fetchSizes();
    } catch (err) {
      toastError(err.response?.data?.message || 'Error deleting size.');
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF' }}>
            Size Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
            Manage clothing sizes available across the garments catalog (e.g. XS, S, M, L, XL, XXL, 3XL).
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary" style={{ gap: '8px' }}>
          <Plus size={16} /> Add New Size
        </button>
      </div>

      {/* Sizes Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)', color: '#94A3B8' }}>
                <th style={{ padding: '1rem 1.5rem' }}>Size Name</th>
                <th style={{ padding: '1rem 1.5rem' }}>Code</th>
                <th style={{ padding: '1rem 1.5rem' }}>Display Order</th>
                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    Loading sizes...
                  </td>
                </tr>
              ) : sizes.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    No sizes created yet. Click "Add New Size" above.
                  </td>
                </tr>
              ) : (
                sizes.map((s) => (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      color: '#E2E8F0',
                    }}
                  >
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: '#FFFFFF' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        background: 'rgba(99, 102, 241, 0.2)',
                        border: '1px solid rgba(99, 102, 241, 0.4)',
                        color: '#FFFFFF',
                        minWidth: '38px',
                        textAlign: 'center',
                      }}>
                        {s.name}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#94A3B8' }}>
                      {s.code || s.name}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#94A3B8' }}>
                      {s.displayOrder}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className={`badge ${s.isActive ? 'badge-success' : 'badge-secondary'}`}>
                        {s.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px 10px' }}
                          title="Edit Size"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="btn btn-sm"
                          style={{ padding: '6px 10px', color: '#F87171', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                          title="Delete Size"
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
              {editingSize ? 'Edit Size' : 'Add New Garment Size'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Size Name * (e.g. S, M, L, XL, XXL, Custom)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                  placeholder="e.g. XL"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. XL"
                  className="input-field"
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
                  {editingSize ? 'Save Changes' : 'Create Size'}
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
        title="Delete Size"
        message={`Are you sure you want to delete size "${deleteTarget?.name}"?`}
      />
    </div>
  );
};

export default AdminSizes;
