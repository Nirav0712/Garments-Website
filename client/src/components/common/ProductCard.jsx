import { getMediaUrl } from '../../utils/urlHelper';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const mainImage =
    product.images?.find((img) => img.isThumbnail)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';

  const hoverImg = product.hoverImage || product.images?.[1]?.url || mainImage;
  const mainAltText = product.images?.[0]?.altText || `${product.title} fashion garment`;

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  // Extract parsed colors and sizes if available
  let colors = product.colorsList || [];
  if (colors.length === 0 && typeof product.colors === 'string') {
    try { colors = JSON.parse(product.colors) || []; } catch (e) {}
  }

  let sizes = product.sizesList || [];
  if (sizes.length === 0 && typeof product.sizes === 'string') {
    try { sizes = JSON.parse(product.sizes) || []; } catch (e) {}
  }

  return (
    <div
      className="store-card fashion-product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--button-radius)',
        transition: 'all 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Product Image Container with Hover Swap */}
      <Link
        to={`/products/${product.slug}`}
        style={{
          display: 'block',
          position: 'relative',
          paddingTop: '125%', // 4:5 fashion aspect ratio
          overflow: 'hidden',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <img
          src={getMediaUrl(isHovered && hoverImg !== mainImage ? hoverImg : mainImage)}
          alt={mainAltText}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />

        {/* Minimalist Status Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 5 }}>
          {hasDiscount && (
            <span style={{
              backgroundColor: 'var(--color-error)',
              color: '#FFFFFF',
              padding: '3px 8px',
              borderRadius: '2px',
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
            }}>
              -{discountPercent}%
            </span>
          )}

          {product.isNewArrival && !hasDiscount && (
            <span style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-button-text)',
              padding: '3px 8px',
              borderRadius: '2px',
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              NEW ARRIVAL
            </span>
          )}

          {product.isBestseller && (
            <span style={{
              backgroundColor: '#111111',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '3px 8px',
              borderRadius: '2px',
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              BESTSELLER
            </span>
          )}
        </div>

        {/* Fabric Tag on Image Bottom */}
        {product.fabric && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            color: '#FFFFFF',
            fontSize: '0.65rem',
            padding: '2px 8px',
            borderRadius: '2px',
            letterSpacing: '0.03em',
            fontWeight: 600,
            maxWidth: '90%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {product.fabric.split('(')[0].trim()}
          </div>
        )}
      </Link>

      {/* Product Information Body */}
      <div style={{
        padding: '1.25rem 1rem 1rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
      }}>
        <div>
          {/* Category & Collection */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}>
            <span style={{
              fontSize: '0.72rem',
              color: 'var(--color-secondary)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              {product.category?.name || product.collection || 'ATELIER'}
            </span>

            {/* Color Swatch Dots Preview */}
            {colors.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {colors.slice(0, 4).map((c, i) => (
                  <span
                    key={i}
                    title={c.name}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: c.hex || '#111111',
                      border: '1px solid rgba(0,0,0,0.15)',
                      display: 'inline-block',
                    }}
                  />
                ))}
                {colors.length > 4 && (
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)' }}>
                    +{colors.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Title */}
          <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
            <h3 style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--color-heading)',
              lineHeight: 1.35,
              marginBottom: '6px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontFamily: 'var(--font-heading)',
            }}>
              {product.title}
            </h3>
          </Link>

          {/* Fit & Silhouette tag */}
          {product.fit && (
            <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', marginBottom: '8px' }}>
              Fit: <strong style={{ color: 'var(--color-heading)' }}>{product.fit}</strong>
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            marginBottom: '12px',
            marginTop: '4px',
          }}>
            <span style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--color-heading)',
              fontFamily: 'var(--font-heading)',
            }}>
              ${hasDiscount ? product.salePrice.toFixed(2) : product.price.toFixed(2)}
            </span>

            {hasDiscount && (
              <span style={{
                fontSize: '0.85rem',
                color: 'var(--color-secondary)',
                textDecoration: 'line-through',
              }}>
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Action Button */}
          <Link
            to={`/products/${product.slug}`}
            className="btn btn-primary btn-sm"
            style={{
              width: '100%',
              justifyContent: 'center',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              padding: '0.6rem 1rem',
            }}
          >
            <span>View Garment</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
