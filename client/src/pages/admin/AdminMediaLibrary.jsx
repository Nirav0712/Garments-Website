import { getMediaUrl } from '../../utils/urlHelper';
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  File,
  Filter,
} from 'lucide-react';

const AdminMediaLibrary = () => {
  const { success, error: toastError } = useToast();
  const [media, setMedia] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/media?search=${encodeURIComponent(search)}&limit=50`);
      if (res.data?.success) {
        setMedia(res.data.media || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [search]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    setUploading(true);
    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success) {
        success('Media file(s) uploaded successfully!');
        fetchMedia();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url, id) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    success('Image URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/media/${deleteId}`);
      if (res.data?.success) {
        success('Media item deleted successfully.');
        setDeleteId(null);
        fetchMedia();
      }
    } catch (err) {
      toastError('Failed to delete media item.');
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>
            Media Library & Assets
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Upload, browse, inspect, and organize product photos, hero banners, and brand artwork.
          </p>
        </div>

        <label className="btn btn-primary" style={{ cursor: 'pointer', gap: '8px' }}>
          <Upload size={18} />
          <span>{uploading ? 'Uploading Files...' : 'Upload Media Files'}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Search & Stats Bar */}
      <div className="glass-card" style={{
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748B' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename or alt text..."
            className="input-field"
            style={{ paddingLeft: '38px', height: '40px', fontSize: '0.85rem' }}
          />
        </div>

        <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
          Total Assets: <strong style={{ color: '#FFFFFF' }}>{total}</strong>
        </span>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="skeleton" style={{ height: '220px', borderRadius: '12px' }} />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <ImageIcon size={48} color="#64748B" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', marginBottom: '8px' }}>
            No Media Uploaded
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Upload high-resolution photography or banners to populate your site library.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}>
          {media.map((item) => (
            <div
              key={item.id}
              className="glass-card glass-card-hover"
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {/* Preview Box */}
              <div style={{ paddingTop: '75%', position: 'relative', background: '#0B0F19' }}>
                <img
                  src={getMediaUrl(item.url)}
                  alt={item.altText || item.originalName}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Metadata */}
              <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '2px',
                  }} title={item.originalName}>
                    {item.originalName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                    {formatBytes(item.size)} • {item.mimeType.split('/')[1]?.toUpperCase()}
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '10px',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <button
                    onClick={() => handleCopyUrl(item.url, item.id)}
                    title="Copy URL"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: copiedId === item.id ? '#34D399' : '#818CF8',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                  </button>

                  <button
                    onClick={() => setDeleteId(item.id)}
                    title="Delete Media"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#F87171',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Media Asset"
        message="Are you sure you want to permanently delete this media file from the server?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminMediaLibrary;
