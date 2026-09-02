import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { useSite } from '../../context/SiteContext';
import { useAuth } from '../../context/AuthContext';
import MediaPickerModal from '../../components/admin/MediaPickerModal';
import {
  Settings,
  Save,
  Sparkles,
  Shield,
  Mail,
  Phone,
  MapPin,
  Globe,
  Lock,
  User,
  Image as ImageIcon,
} from 'lucide-react';

const AdminSettings = () => {
  const { success, error: toastError } = useToast();
  const { refreshSiteData } = useSite();
  const { user, updateProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    site_name: 'PRODUCT LIST',
    site_tagline: 'Precision Engineered Hardware & Minimalist Essentials',
    site_logo_text: 'PRODUCT LIST',
    site_logo_url: '',
    announcement_active: true,
    announcement_text: '✨ Summer Special: Complimentary Worldwide Express Shipping on all orders over $150',
    announcement_link: '/offers',
    contact_email: 'concierge@productlist.com',
    contact_phone: '+1 (800) 555-0199',
    contact_address: '742 Evergreen Terrace, Suite 500, San Francisco, CA 94107',
    contact_hours: 'Monday – Friday: 9:00 AM – 6:00 PM PST',
    footer_description: 'PRODUCT LIST is an independent product showcase dedicated to the design, curation, and appreciation of ultra-premium hardware, optics, and workspace aesthetics.',
    footer_copyright: '© 2026 PRODUCT LIST Inc. All rights reserved. Precision engineered.',
    social_twitter: 'https://twitter.com',
    social_instagram: 'https://instagram.com',
    social_github: 'https://github.com',
    social_linkedin: 'https://linkedin.com',
  });

  // Admin Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data?.success && res.data.settings) {
          setSettings((prev) => ({
            ...prev,
            ...res.data.settings,
          }));
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await api.put('/settings', settings);
      if (res.data?.success) {
        success('Site settings saved successfully! Changes are immediately active.');
        refreshSiteData();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Error updating settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toastError('New passwords do not match.');
      return;
    }

    setSavingProfile(true);
    try {
      await updateProfile({
        name: profileData.name,
        email: profileData.email,
        currentPassword: profileData.currentPassword || undefined,
        newPassword: profileData.newPassword || undefined,
      });
      success('Admin profile credentials updated successfully!');
      setProfileData((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      toastError(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', color: '#94A3B8', textAlign: 'center' }}>Loading site settings...</div>;
  }

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Top Title */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>
          Global Settings & Branding
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
          Customize website name, header announcement bar, contact info, social links, and admin credentials.
        </p>
      </div>

      {/* Global Branding & Announcement Settings Form */}
      <form onSubmit={handleSettingsSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Card 1: Branding & Header Announcement */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#818CF8" /> Brand Identity & Header
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Website / Brand Name *</label>
              <input
                type="text"
                required
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tagline</label>
              <input
                type="text"
                value={settings.site_tagline}
                onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Announcement Bar Settings */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.announcement_active !== false}
                onChange={(e) => setSettings({ ...settings, announcement_active: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#6366F1' }}
              />
              <span style={{ fontSize: '0.95rem', color: '#FFFFFF', fontWeight: 700 }}>
                Enable Header Top Announcement Bar
              </span>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Announcement Message</label>
                <input
                  type="text"
                  value={settings.announcement_text}
                  onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
                  placeholder="e.g. Free Worldwide Shipping on Orders Over $150"
                  className="input-field"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Announcement Link</label>
                <input
                  type="text"
                  value={settings.announcement_link}
                  onChange={(e) => setSettings({ ...settings, announcement_link: e.target.value })}
                  placeholder="/offers"
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Contact Information & Hours */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={18} color="#34D399" /> Contact Information & Concierge
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Physical Address</label>
              <input
                type="text"
                value={settings.contact_address}
                onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Working / Support Hours</label>
              <input
                type="text"
                value={settings.contact_hours}
                onChange={(e) => setSettings({ ...settings, contact_hours: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Footer & Social Media */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="#FBBF24" /> Footer & Social Profiles
          </h3>

          <div className="form-group">
            <label className="form-label">Footer Brand Bio / Description</label>
            <textarea
              rows={3}
              value={settings.footer_description}
              onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
              className="textarea-field"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Footer Copyright Notice</label>
            <input
              type="text"
              value={settings.footer_copyright}
              onChange={(e) => setSettings({ ...settings, footer_copyright: e.target.value })}
              className="input-field"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Twitter / X URL</label>
              <input
                type="url"
                value={settings.social_twitter}
                onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Instagram URL</label>
              <input
                type="url"
                value={settings.social_instagram}
                onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                type="url"
                value={settings.social_github}
                onChange={(e) => setSettings({ ...settings, social_github: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input
                type="url"
                value={settings.social_linkedin}
                onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={savingSettings} className="btn btn-primary btn-lg">
            <Save size={18} /> {savingSettings ? 'Saving Settings...' : 'Save Site Settings'}
          </button>
        </div>
      </form>

      {/* Card 4: Admin Credentials / Profile */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={18} color="#EC4899" /> Admin Account Credentials
        </h3>

        <form onSubmit={handleProfileSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Admin Name</label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                required
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Password (To Change Password)</label>
              <input
                type="password"
                value={profileData.currentPassword}
                onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                placeholder="Current password"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                value={profileData.newPassword}
                onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                placeholder="New password (leave blank to keep)"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                value={profileData.confirmPassword}
                onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" disabled={savingProfile} className="btn btn-secondary">
              <Save size={16} /> {savingProfile ? 'Updating...' : 'Update Admin Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
