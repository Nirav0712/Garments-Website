import { getMediaUrl } from '../../utils/urlHelper';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import {
  Plus,
  Search,
  Filter,
  Copy,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  Flame,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const AdminProducts = () => {
  const { success, error: toastError } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('all', 'true'); // Return all products (active & inactive)
      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter !== '') params.append('isActive', statusFilter);
      params.append('page', page.toString());
      params.append('limit', '15');

      const res = await api.get(`/products?${params.toString()}`);
      if (res.data?.success) {
        setProducts(res.data.products || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories?all=true');
        if (res.data?.success) {
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleToggle = async (id, field) => {
    try {
      const res = await api.patch(`/products/${id}/toggle`, { field });
      if (res.data?.success) {
        success(`${field} status updated.`);
        fetchProducts();
      }
    } catch (err) {
      toastError('Failed to update status.');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await api.post(`/products/${id}/duplicate`);
      if (res.data?.success) {
        success('Product duplicated successfully as draft!');
        fetchProducts();
      }
    } catch (err) {
      toastError('Failed to duplicate product.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/products/${deleteId}`);
      if (res.data?.success) {
        success('Product deleted successfully.');
        setDeleteId(null);
        fetchProducts();
      }
    } catch (err) {
      toastError('Failed to delete product.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Product Catalog
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Manage product listings, specifications, prices, multi-image galleries, and visibility status.
          </p>
        </div>

        <Link to="/admin/products/new" className="btn btn-primary">
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{
        padding: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: '10px', flex: '1 1 300px', maxWidth: '400px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748B' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by title, SKU, brand..."
              className="input-field"
              style={{ paddingLeft: '38px', height: '40px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="select-field"
            style={{ width: '180px', height: '40px', fontSize: '0.85rem' }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="select-field"
            style={{ width: '140px', height: '40px', fontSize: '0.85rem' }}
          >
            <option value="">All Statuses</option>
            <option value="true">Published</option>
            <option value="false">Draft / Hidden</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Badges / Features</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const thumbnail =
                    p.images?.find((img) => img.isThumbnail)?.url ||
                    p.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200';

                  return (
                    <tr key={p.id}>
                      {/* Product Thumbnail & Title */}
                      <td style={{ minWidth: '240px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={getMediaUrl(thumbnail)}
                            alt={p.title}
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              background: '#0B0F19',
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.925rem' }}>
                              {p.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                              SKU: {p.sku || 'N/A'} • {p.brand || 'No Brand'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#818CF8', fontWeight: 600 }}>
                          {p.category?.name || '—'}
                        </span>
                      </td>

                      {/* Price */}
                      <td>
                        <div>
                          {p.salePrice ? (
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                              <span style={{ fontWeight: 800, color: '#34D399', fontFamily: 'var(--font-mono)' }}>
                                ${Number(p.salePrice).toFixed(2)}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#64748B', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>
                                ${Number(p.price).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                              ${Number(p.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: p.stockStatus === 'IN_STOCK' ? '#34D399' : p.stockStatus === 'LOW_STOCK' ? '#FBBF24' : '#F87171',
                        }}>
                          {p.stock} ({p.stockStatus === 'IN_STOCK' ? 'In Stock' : p.stockStatus === 'LOW_STOCK' ? 'Low' : 'Out'})
                        </span>
                      </td>

                      {/* Badges Toggles */}
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleToggle(p.id, 'isFeatured')}
                            title="Toggle Featured"
                            style={{
                              background: p.isFeatured ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.05)',
                              border: p.isFeatured ? '1px solid #6366F1' : '1px solid rgba(255,255,255,0.1)',
                              color: p.isFeatured ? '#A5B4FC' : '#64748B',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.7rem',
                              cursor: 'pointer',
                            }}
                          >
                            <Star size={12} />
                          </button>

                          <button
                            onClick={() => handleToggle(p.id, 'isBestseller')}
                            title="Toggle Bestseller"
                            style={{
                              background: p.isBestseller ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.05)',
                              border: p.isBestseller ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.1)',
                              color: p.isBestseller ? '#FBBF24' : '#64748B',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.7rem',
                              cursor: 'pointer',
                            }}
                          >
                            <Flame size={12} />
                          </button>

                          <button
                            onClick={() => handleToggle(p.id, 'isNewArrival')}
                            title="Toggle New Arrival"
                            style={{
                              background: p.isNewArrival ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.05)',
                              border: p.isNewArrival ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.1)',
                              color: p.isNewArrival ? '#34D399' : '#64748B',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.7rem',
                              cursor: 'pointer',
                            }}
                          >
                            <Sparkles size={12} />
                          </button>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td>
                        <button
                          onClick={() => handleToggle(p.id, 'isActive')}
                          style={{
                            background: p.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            border: p.isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                            color: p.isActive ? '#34D399' : '#F87171',
                            borderRadius: '20px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {p.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {p.isActive ? 'Active' : 'Draft'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <Link
                            to={`/products/${p.slug}`}
                            target="_blank"
                            title="Preview on Storefront"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#CBD5E1',
                            }}
                          >
                            <ExternalLink size={14} />
                          </Link>

                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            title="Edit Product"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              background: 'rgba(99, 102, 241, 0.15)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#818CF8',
                            }}
                          >
                            <Edit2 size={14} />
                          </Link>

                          <button
                            onClick={() => handleDuplicate(p.id)}
                            title="Duplicate as Draft"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              background: 'rgba(59, 130, 246, 0.15)',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#60A5FA',
                              cursor: 'pointer',
                            }}
                          >
                            <Copy size={14} />
                          </button>

                          <button
                            onClick={() => setDeleteId(p.id)}
                            title="Delete Product"
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to permanently delete this product and its image references?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminProducts;
