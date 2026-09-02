import { getMediaUrl } from '../../utils/urlHelper';
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { Upload, Search, Check, X, Image as ImageIcon, Copy } from 'lucide-react';

const MediaPickerModal = ({ isOpen, onClose, onSelect, title = 'Select Media' }) => {
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'upload'
  const [mediaList, setMediaList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('');

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/media?search=${encodeURIComponent(search)}&limit=40`);
      if (res.data?.success) {
        setMediaList(res.data.media || []);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, search]);

  const handleFileUpload = async (e) => {
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
        success('Image(s) uploaded successfully!');
        fetchMedia();
        if (res.data.file?.url) {
          setSelectedUrl(res.data.file.url);
          setActiveTab('browse');
        }
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmSelect = (urlToUse) => {
    const finalUrl = urlToUse || selectedUrl;
    if (!finalUrl) {
      toastError('Please select or upload an image.');
      return;
    }
    onSelect(finalUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem',
    }}>
      <div className="glass-card" style={{
        maxWidth: '840px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: '#0F172A',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        animation: 'fadeIn 0.2s ease',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ImageIcon size={20} color="#818CF8" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>{title}</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Header & Search */}
        <div style={{
          padding: '1rem 1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          background: 'rgba(0, 0, 0, 0.2)',
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('browse')}
              className={`btn btn-sm ${activeTab === 'browse' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Browse Library
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`btn btn-sm ${activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Upload size={14} /> Upload New
            </button>
          </div>

          {activeTab === 'browse' && (
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748B' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search media..."
                className="input-field"
                style={{ paddingLeft: '36px', height: '36px', fontSize: '0.85rem' }}
              />
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 1.75rem', flex: 1, overflowY: 'auto' }}>
          {activeTab === 'upload' ? (
            <div style={{
              border: '2px dashed rgba(99, 102, 241, 0.4)',
              borderRadius: '16px',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              background: 'rgba(99, 102, 241, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}>
              <Upload size={48} color="#818CF8" />
              <h4 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 700 }}>
                {uploading ? 'Uploading Media...' : 'Upload Image Files'}
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', maxWidth: '400px' }}>
                Select high-resolution JPG, PNG, WEBP, or SVG images (Max 10MB each).
              </p>
              <label className="btn btn-primary" style={{ cursor: 'pointer', marginTop: '8px' }}>
                <span>Select Files from Computer</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
              </label>
            </div>
          ) : (
            <div>
              {/* Direct URL Input Option */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Or Enter Direct Image URL:</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    value={selectedUrl}
                    onChange={(e) => setSelectedUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or /uploads/..."
                    className="input-field"
                    style={{ height: '40px', fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleConfirmSelect(selectedUrl)}
                    className="btn btn-primary btn-sm"
                    disabled={!selectedUrl}
                  >
                    Apply URL
                  </button>
                </div>
              </div>

              {/* Media Grid */}
              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div key={n} className="skeleton" style={{ height: '110px', borderRadius: '10px' }} />
                  ))}
                </div>
              ) : mediaList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                  <p>No media files found. Upload images or enter a direct URL above.</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '12px',
                }}>
                  {mediaList.map((item) => {
                    const isSelected = selectedUrl === item.url;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedUrl(item.url)}
                        style={{
                          position: 'relative',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          paddingTop: '100%',
                          cursor: 'pointer',
                          border: isSelected ? '3px solid #6366F1' : '1px solid rgba(255,255,255,0.08)',
                          background: '#0B0F19',
                          transition: 'all 0.2s',
                        }}
                      >
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
                        {isSelected && (
                          <div style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            background: '#6366F1',
                            color: '#FFFFFF',
                            borderRadius: '50%',
                            width: '22px',
                            height: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 3,
                          }}>
                            <Check size={14} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '10px',
          background: 'rgba(0, 0, 0, 0.2)',
        }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button
            onClick={() => handleConfirmSelect(selectedUrl)}
            disabled={!selectedUrl}
            className="btn btn-primary btn-sm"
          >
            Insert Selected Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaPickerModal;
