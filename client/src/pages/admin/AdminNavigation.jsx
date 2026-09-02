import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { useSite } from '../../context/SiteContext';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import {
  Compass,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Save,
  X,
  Layers,
} from 'lucide-react';

const AdminNavigation = () => {
  const { success, error: toastError } = useToast();
  const { refreshSiteData } = useSite();
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    label: '',
    url: '/',
    location: 'HEADER',
    column: 'Explore Products',
    displayOrder: 1,
    isActive: true,
  });

  const fetchNav = async () => {
    setLoading(true);
    try {
      const res = await api.get('/navigation?all=true');
      if (res.data?.success) {
        setNavItems(res.data.items || []);
      }
    } catch (err) {
      console.error('Error fetching navigation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNav();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      label: '',
      url: '/products',
      location: 'HEADER',
      column: 'Explore Products',
      displayOrder: navItems.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      label: item.label,
      url: item.url,
      location: item.location,
      column: item.column || 'Explore Products',
      displayOrder: item.displayOrder || 1,
      isActive: item.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.label || !formData.url) {
      toastError('Label and URL are required.');
      return;
    }

    try {
      let res;
      if (editingId) {
        res = await api.put(`/navigation/${editingId}`, formData);
      } else {
        res = await api.post('/navigation', formData);
      }

      if (res.data?.success) {
        success(editingId ? 'Navigation link updated!' : 'Navigation link created!');
        setModalOpen(false);
        fetchNav();
        refreshSiteData();
      }
    } catch (err) {
      toastError('Failed to save navigation link.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/navigation/${deleteId}`);
      if (res.data?.success) {
        success('Navigation link deleted.');
        setDeleteId(null);
        fetchNav();
        refreshSiteData();
      }
    } catch (err) {
      toastError('Failed to delete navigation link.');
    }
  };

  const headerItems = navItems.filter((i) => i.location === 'HEADER');
  const footerItems = navItems.filter((i) => i.location === 'FOOTER');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>
            Navigation & Menus Management
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Configure main header navigation labels, target links, footer columns, and display ordering.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Add Navigation Link
        </button>
      </div>

      {/* Header Menu Table */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={18} color="#818CF8" /> Desktop & Mobile Header Menu
        </h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Label</th>
              <th>Target URL</th>
              <th>Order</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {headerItems.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 700, color: '#FFFFFF' }}>{item.label}</td>
                <td>
                  <code style={{ fontSize: '0.85rem', color: '#818CF8', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '4px' }}>
                    {item.url}
                  </code>
                </td>
                <td style={{ fontWeight: 700, color: '#CBD5E1', fontFamily: 'var(--font-mono)' }}>{item.displayOrder}</td>
                <td>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.isActive ? '#34D399' : '#F87171' }}>
                    {item.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(item)}
                      style={{ background: 'rgba(99,102,241,0.15)', border: 'none', borderRadius: '6px', color: '#818CF8', padding: '6px', cursor: 'pointer' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      style={{ background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: '6px', color: '#F87171', padding: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Columns Table */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="#60A5FA" /> Footer Columns & Links
        </h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Label</th>
              <th>Footer Column</th>
              <th>Target URL</th>
              <th>Order</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {footerItems.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 700, color: '#FFFFFF' }}>{item.label}</td>
                <td>
                  <span className="badge badge-primary">{item.column || 'General'}</span>
                </td>
                <td>
                  <code style={{ fontSize: '0.85rem', color: '#818CF8', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '4px' }}>
                    {item.url}
                  </code>
                </td>
                <td style={{ fontWeight: 700, color: '#CBD5E1', fontFamily: 'var(--font-mono)' }}>{item.displayOrder}</td>
                <td>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.isActive ? '#34D399' : '#F87171' }}>
                    {item.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(item)}
                      style={{ background: 'rgba(99,102,241,0.15)', border: 'none', borderRadius: '6px', color: '#818CF8', padding: '6px', cursor: 'pointer' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      style={{ background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: '6px', color: '#F87171', padding: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
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
            maxWidth: '500px',
            width: '100%',
            padding: '2rem',
            borderRadius: 'var(--radius-xl)',
            background: '#0F172A',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                {editingId ? 'Edit Navigation Link' : 'Add Navigation Link'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Link Label *</label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. Products, Active Offers"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target URL Path *</label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="e.g. /products, /categories, /contact"
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Menu Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="select-field"
                  >
                    <option value="HEADER">Header Menu</option>
                    <option value="FOOTER">Footer Column</option>
                  </select>
                </div>

                {formData.location === 'FOOTER' && (
                  <div className="form-group">
                    <label className="form-label">Footer Column</label>
                    <input
                      type="text"
                      value={formData.column}
                      onChange={(e) => setFormData({ ...formData, column: e.target.value })}
                      placeholder="e.g. Explore Products, Company, Support"
                      className="input-field"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#6366F1' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600 }}>Active in Menu</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Save size={16} /> Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Navigation Link"
        message="Are you sure you want to remove this navigation item?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminNavigation;
