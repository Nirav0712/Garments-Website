import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@productlist.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      success('Logged in successfully to Product List Admin Portal.');
      navigate('/admin');
    } catch (err) {
      toastError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(ellipse at top, #1E1B4B 0%, #0B0F19 70%)',
    }}>
      <div className="glass-card" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '3rem 2.5rem',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), var(--accent-glow)',
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            margin: '0 auto 1.25rem auto',
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.5)',
          }}>
            <ShieldCheck size={28} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Admin Portal
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            Sign in to manage products, hero slider, and CMS content
          </p>
        </div>

        {/* Demo Credentials Alert Box */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '0.825rem',
          color: '#CBD5E1',
          marginBottom: '1.75rem',
        }}>
          <strong style={{ color: '#A5B4FC' }}>Pre-filled Demo Credentials:</strong><br />
          Email: <span style={{ fontFamily: 'var(--font-mono)' }}>admin@productlist.com</span><br />
          Password: <span style={{ fontFamily: 'var(--font-mono)' }}>admin123</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#64748B' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@productlist.com"
                className="input-field"
                style={{ paddingLeft: '42px', height: '46px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#64748B' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                style={{ paddingLeft: '42px', height: '46px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1.5rem', gap: '8px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
