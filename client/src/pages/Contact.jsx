import React, { useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { useSite } from '../context/SiteContext';
import SEOHead from '../components/common/SEOHead';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const { success, error: toastError } = useToast();
  const { settings, content } = useSite();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactHeader = content.contact_page_header || {
    title: 'Fashion Concierge & Sizing Assistance',
    subtitle: 'ATELIER CARE & SUPPORT',
    content:
      'Have questions regarding garment sizing, custom tailored lengths, fabric certifications, or order logistics? Our atelier concierge team is ready to assist you.',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/contact', formData);
      if (res.data?.success) {
        setSubmitted(true);
        success('Your message has been sent successfully. Our concierge will be in touch shortly!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Error submitting message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '80vh', padding: '4rem 0 6rem 0' }}>
      <SEOHead
        title="Contact Concierge & Sizing Care | Product List Atelier"
        description="Reach the Product List Fashion Concierge for garment sizing advice, fabric certifications, custom requests, and order assistance."
        keywords="contact garments atelier, fashion concierge, sizing help, customer care"
        canonicalUrl="https://productlist.com/contact"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact Concierge', url: '/contact' },
        ]}
      />

      <div className="container-custom">
        {/* Page Header */}
        <div style={{ maxWidth: '680px', marginBottom: '3.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'var(--color-primary)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '6px',
          }}>
            {contactHeader.subtitle}
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, marginBottom: '1rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
            {contactHeader.title}
          </h1>
          <p style={{ color: 'var(--color-text)', fontSize: '1rem', lineHeight: 1.6 }}>
            {contactHeader.content}
          </p>
        </div>

        {/* 2-Column Contact Info + Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) minmax(320px, 1.4fr)',
          gap: '3.5rem',
        }} className="contact-grid">
          {/* Left Column: Direct Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--button-radius)',
              padding: '2rem',
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-heading)', fontFamily: 'var(--font-heading)' }}>
                Concierge Desk
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--button-radius)',
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Mail size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-heading)', marginBottom: '2px' }}>Direct Concierge Email</div>
                    <a href={`mailto:${settings.contact_email || 'concierge@productlist.com'}`} style={{ color: 'var(--color-text)' }}>
                      {settings.contact_email || 'concierge@productlist.com'}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--button-radius)',
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Phone size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-heading)', marginBottom: '2px' }}>Telephone Inquiries</div>
                    <a href={`tel:${settings.contact_phone || '+1 (800) 555-FASHION'}`} style={{ color: 'var(--color-text)' }}>
                      {settings.contact_phone || '+1 (800) 555-FASHION'}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--button-radius)',
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-heading)', marginBottom: '2px' }}>Design Studio & Atelier</div>
                    <div style={{ color: 'var(--color-text)' }}>
                      {settings.contact_address || '540 Atelier Boulevard, Fashion District, New York, NY 10018'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--button-radius)',
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Clock size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-heading)', marginBottom: '2px' }}>Concierge Hours</div>
                    <div style={{ color: 'var(--color-text)' }}>
                      Monday – Saturday: 9:00 AM – 7:00 PM EST
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--button-radius)',
            padding: '2.5rem',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-heading)', fontFamily: 'var(--font-heading)' }}>
              Send a Direct Message
            </h3>

            {submitted ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--button-radius)',
                border: '1px solid var(--color-border)',
              }}>
                <CheckCircle size={44} color="var(--color-success)" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Inquiry Received</h4>
                <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Thank you for reaching out. An atelier concierge specialist will review your request and reply shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Julian Vance"
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. julian@example.com"
                      className="input-field"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Sizing or bespoke tailoring"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can our atelier team assist you?"
                    className="textarea-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
