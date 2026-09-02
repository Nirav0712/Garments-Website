import { getMediaUrl } from '../../utils/urlHelper';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  if (!category) return null;

  const count = category.productsCount !== undefined ? category.productsCount : (category._count?.products || 0);

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="store-card category-card-wrap"
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--button-radius)',
        textDecoration: 'none',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Category Image */}
      <div style={{
        paddingTop: '80%', // 4:3 ratio for fashion categories
        position: 'relative',
        backgroundColor: 'var(--color-surface)',
        overflow: 'hidden',
      }}>
        <img
          src={getMediaUrl(category.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800')}
          alt={`${category.name} collection - Product List`}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="category-img"
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 100%)',
        }} />

        {/* Floating Category Title on Image */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          color: '#FFFFFF',
          zIndex: 5,
        }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '4px',
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
          }}>
            {category.name}
          </h3>
          {category.description && (
            <p style={{
              fontSize: '0.75rem',
              color: '#E2E8F0',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            }}>
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Category Footer Bar */}
      <div style={{
        padding: '0.85rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--color-card)',
        borderTop: '1px solid var(--color-border)',
      }}>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--color-secondary)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {count} {count === 1 ? 'Garment' : 'Garments'}
        </span>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--color-primary)',
        }} className="category-cta">
          <span>Shop Department</span>
          <ArrowRight size={13} />
        </div>
      </div>

      <style>{`
        .category-card-wrap:hover .category-img {
          transform: scale(1.06);
        }
        .category-card-wrap:hover .category-cta {
          text-decoration: underline;
        }
      `}</style>
    </Link>
  );
};

export default CategoryCard;
