import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import {
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  Archive,
  Phone,
  Calendar,
  X,
} from 'lucide-react';

const AdminInquiries = () => {
  const { success, error: toastError } = useToast();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [activeMessage, setActiveMessage] = useState(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const res = await api.get(`/contact/inquiries${params}`);
      if (res.data?.success) {
        setInquiries(res.data.inquiries || []);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/contact/inquiries/${id}`, { status });
      if (res.data?.success) {
        success(`Status updated to ${status}`);
        fetchInquiries();
        if (activeMessage && activeMessage.id === id) {
          setActiveMessage((prev) => ({ ...prev, status }));
        }
      }
    } catch (err) {
      toastError('Failed to update status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/contact/inquiries/${deleteId}`);
      if (res.data?.success) {
        success('Inquiry deleted.');
        setDeleteId(null);
        if (activeMessage && activeMessage.id === deleteId) {
          setActiveMessage(null);
        }
        fetchInquiries();
      }
    } catch (err) {
      toastError('Failed to delete inquiry.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>
            Customer Inquiries & Inbox
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            View and respond to customer questions and direct product inquiry submissions.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select-field"
          style={{ width: '180px', height: '40px' }}
        >
          <option value="">All Statuses</option>
          <option value="UNREAD">Unread Only</option>
          <option value="READ">Read</option>
          <option value="REPLIED">Replied</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: activeMessage ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Inquiries Table / List */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Subject / Summary</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                      Loading inquiries...
                    </td>
                  </tr>
                ) : inquiries.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                      No inquiries found.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inq) => (
                    <tr
                      key={inq.id}
                      onClick={() => {
                        setActiveMessage(inq);
                        if (inq.status === 'UNREAD') handleUpdateStatus(inq.id, 'READ');
                      }}
                      style={{
                        cursor: 'pointer',
                        background: activeMessage?.id === inq.id ? 'rgba(99, 102, 241, 0.1)' : undefined,
                      }}
                    >
                      <td>
                        <div style={{ fontWeight: inq.status === 'UNREAD' ? 800 : 600, color: '#FFFFFF' }}>
                          {inq.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#818CF8' }}>{inq.email}</div>
                      </td>

                      <td style={{ maxWidth: '280px' }}>
                        <div style={{ fontWeight: 600, color: '#CBD5E1', fontSize: '0.85rem' }}>
                          {inq.subject || 'No Subject'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {inq.message}
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td>
                        <span className={`badge ${inq.status === 'UNREAD' ? 'badge-primary' : inq.status === 'REPLIED' ? 'badge-emerald' : 'badge-dark'}`} style={{ fontSize: '0.7rem' }}>
                          {inq.status}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setDeleteId(inq.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#F87171',
                            padding: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Message Detail View Box */}
        {activeMessage && (
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '6px' }}>{activeMessage.status}</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {activeMessage.subject || 'Product Inquiry'}
                </h3>
              </div>
              <button
                onClick={() => setActiveMessage(null)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
              padding: '1rem',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              color: '#CBD5E1',
            }}>
              <div>From: <strong style={{ color: '#FFFFFF' }}>{activeMessage.name}</strong> ({activeMessage.email})</div>
              {activeMessage.phone && <div>Phone: <strong style={{ color: '#FFFFFF' }}>{activeMessage.phone}</strong></div>}
              <div>Date: {new Date(activeMessage.createdAt).toLocaleString()}</div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Message Body:</label>
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '10px',
                padding: '1.25rem',
                color: '#FFFFFF',
                lineHeight: 1.6,
                fontSize: '0.95rem',
                whiteSpace: 'pre-wrap',
                minHeight: '140px',
              }}>
                {activeMessage.message}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: 'auto' }}>
              <a
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject || 'Inquiry')}`}
                className="btn btn-primary btn-sm"
                onClick={() => handleUpdateStatus(activeMessage.id, 'REPLIED')}
              >
                <Mail size={14} /> Reply via Email
              </a>

              <button
                onClick={() => handleUpdateStatus(activeMessage.id, activeMessage.status === 'ARCHIVED' ? 'READ' : 'ARCHIVED')}
                className="btn btn-secondary btn-sm"
              >
                <Archive size={14} /> {activeMessage.status === 'ARCHIVED' ? 'Unarchive' : 'Archive'}
              </button>

              <button
                onClick={() => setDeleteId(activeMessage.id)}
                className="btn btn-danger btn-sm"
                style={{ marginLeft: 'auto' }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Customer Inquiry"
        message="Are you sure you want to permanently delete this inquiry?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminInquiries;
