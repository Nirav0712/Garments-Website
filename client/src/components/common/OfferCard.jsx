import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';

const OfferCard = ({ offer }) => {
  if (!offer) return null;

  return (
    <div
      className="store-card"
      style={{
        position: 'relative',
        minHeight: '280px',
        borderRadius: 'var(--button-radius)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '2rem',
        backgroundImage: `url("${offer.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Minimal Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, color: '#FFFFFF' }}>
        {offer.discountBadge && (
          <span style={{
            display: 'inline-block',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-button-text)',
            padding: '4px 10px',
            borderRadius: 'var(--button-radius)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            marginBottom: '8px',
          }}>
            {offer.discountBadge}
          </span>
        )}

        <h3 style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          color: '#FFFFFF',
          lineHeight: 1.25,
          marginBottom: '6px',
        }}>
          {offer.title}
        </h3>

        {offer.description && (
          <p style={{
            fontSize: '0.85rem',
            color: '#E5E7EB',
            lineHeight: 1.45,
            marginBottom: '1rem',
            maxWidth: '380px',
          }}>
            {offer.description}
          </p>
        )}

        <Link
          to={offer.buttonUrl || '/products'}
          className="btn btn-sm"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#111111',
            fontWeight: 700,
            border: 'none',
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>{offer.buttonText || 'Shop Collection'}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default OfferCard;
