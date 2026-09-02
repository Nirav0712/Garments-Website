import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMediaUrl } from '../utils/urlHelper';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/common/ProductCard';
import SEOHead from '../components/common/SEOHead';
import {
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Send,
  X,
  Share2,
  HelpCircle,
  Scissors,
  CheckCircle2,
  Copy,
} from 'lucide-react';

const ProductDetail = () => {
  const { slug } = useParams();
  const { success, error: toastError } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Modals & UI States
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'garment_details', 'care', 'shipping'
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data?.success) {
          const prod = res.data.product;
          setProduct(prod);
          setRelated(res.data.related || []);

          const primary =
            prod.images?.find((img) => img.isThumbnail)?.url ||
            prod.images?.[0]?.url ||
            '';
          setSelectedImage(primary);

          // Set default color & size
          if (prod.colorsList?.length > 0) {
            setSelectedColor(prod.colorsList[0]);
          }
          if (prod.sizesList?.length > 0) {
            const firstInStock = prod.sizesList.find((s) => s.inStock !== false) || prod.sizesList[0];
            setSelectedSize(firstInStock);
          }

          // Manage recently viewed products in localStorage
          try {
            const viewedRaw = localStorage.getItem('productlist_recently_viewed');
            let viewed = viewedRaw ? JSON.parse(viewedRaw) : [];
            viewed = viewed.filter((item) => item.id !== prod.id);
            viewed.unshift({
              id: prod.id,
              title: prod.title,
              slug: prod.slug,
              price: prod.price,
              salePrice: prod.salePrice,
              images: prod.images,
              category: prod.category,
              fabric: prod.fabric,
            });
            localStorage.setItem('productlist_recently_viewed', JSON.stringify(viewed.slice(0, 4)));
            setRecentlyViewed(viewed.slice(1, 5));
          } catch (e) { }
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    try {
      const res = await api.post('/contact', {
        name: inquiryForm.name,
        email: inquiryForm.email,
        phone: inquiryForm.phone,
        subject: `Garment Sizing / Bespoke Inquiry: ${product?.title} (SKU: ${product?.sku})`,
        message: `Inquiry for size ${selectedSize?.name || 'N/A'}, color ${selectedColor?.name || 'N/A'}.\n\nMessage: ${inquiryForm.message}`,
      });

      if (res.data?.success) {
        success('Your inquiry has been submitted! Our concierge team will reach out shortly.');
        setInquiryOpen(false);
        setInquiryForm({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Error submitting inquiry.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toastError('Please select a garment size first.');
      return;
    }
    success(`Added ${quantity}x ${product.title} (Size: ${selectedSize.name}, Color: ${selectedColor?.name || 'Standard'}) to shopping bag!`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Product link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="container-custom" style={{ padding: '6rem 1.5rem', minHeight: '80vh' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3.5rem' }}>
          <div className="skeleton" style={{ height: '540px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="skeleton" style={{ height: '30px', width: '40%' }} />
            <div className="skeleton" style={{ height: '50px', width: '90%' }} />
            <div className="skeleton" style={{ height: '100px' }} />
            <div className="skeleton" style={{ height: '50px', width: '50%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom" style={{ padding: '6rem 1.5rem', textAlign: 'center', minHeight: '70vh' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Garment Not Found</h2>
        <p style={{ color: 'var(--color-text)', marginBottom: '2rem' }}>
          The garment you are looking for might have been moved or is no longer available.
        </p>
        <Link to="/products" className="btn btn-primary">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const images = product.images || [];
  const specifications = product.specifications || {};
  const features = product.features || [];
  const sizes = product.sizesList || [];
  const colors = product.colorsList || [];

  const seo = product.seo || {};
  const pageTitle = seo.seoTitle || `${product.title} | Product List Atelier`;
  const metaDesc = seo.metaDescription || product.shortDesc || `Buy ${product.title} online at Product List.`;
  const focusKeyword = seo.focusKeyword || product.title.toLowerCase();

  return (
    <div style={{ backgroundColor: 'var(--color-background)', padding: '2.5rem 0 6rem 0' }}>
      {/* 0. Dynamic SEO & Schema.org JSON-LD */}
      <SEOHead
        title={pageTitle}
        description={metaDesc}
        keywords={seo.secondaryKeywords || focusKeyword}
        canonicalUrl={seo.canonicalUrl || `https://productlist.com/products/${product.slug}`}
        robotsIndex={seo.robotsIndex !== false}
        robotsFollow={seo.robotsFollow !== false}
        ogTitle={seo.ogTitle || product.title}
        ogDescription={seo.ogDescription || product.shortDesc}
        ogImage={seo.ogImage || selectedImage}
        ogType="product"
        productSchema={product}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Catalog', url: '/products' },
          ...(product.category ? [{ name: product.category.name, url: `/products?category=${product.category.slug}` }] : []),
          { name: product.title, url: `/products/${product.slug}` },
        ]}
      />

      <div className="container-custom">
        {/* Breadcrumb Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem',
          color: 'var(--color-secondary)',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
        }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ color: 'inherit', textDecoration: 'none' }}>Catalog</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/products?category=${product.category.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span style={{ color: 'var(--color-heading)', fontWeight: 600 }}>{product.title}</span>
        </nav>

        {/* Top Garment Showcase Grid (Left: Image Gallery, Right: Details) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(320px, 1fr)',
          gap: '4rem',
          alignItems: 'start',
          marginBottom: '5rem',
        }}>
          {/* LEFT: Multi-Image High-Fashion Gallery */}
          <div>
            {/* Primary Large Image */}
            <div style={{
              position: 'relative',
              borderRadius: 'var(--button-radius)',
              overflow: 'hidden',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              paddingTop: '125%', // 4:5 fashion aspect ratio
              marginBottom: '1rem',
            }}>
              <img
                src={getMediaUrl(selectedImage || images[0]?.url)}
                alt={images.find((img) => img.url === selectedImage)?.altText || `${product.title} main view`}
                title={images.find((img) => img.url === selectedImage)?.title || product.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease',
                }}
              />

              {/* Status Badges */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 5 }}>
                {hasDiscount && (
                  <span style={{
                    backgroundColor: 'var(--color-error)',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '2px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                  }}>
                    -{discountPercent}% OFF
                  </span>
                )}
                {product.isNewArrival && !hasDiscount && (
                  <span style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-button-text)',
                    padding: '4px 10px',
                    borderRadius: '2px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                  }}>
                    NEW SEASON
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.url)}
                    style={{
                      padding: 0,
                      border: selectedImage === img.url ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      borderRadius: 'var(--button-radius)',
                      overflow: 'hidden',
                      position: 'relative',
                      paddingTop: '100%',
                      backgroundColor: 'var(--color-surface)',
                      cursor: 'pointer',
                      opacity: selectedImage === img.url ? 1 : 0.7,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <img
                      src={getMediaUrl(img.url)}
                      alt={img.altText || `${product.title} angle ${idx + 1}`}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Metadata & Purchasing Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Brand & Collection */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--color-primary)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                {product.brand || 'PRODUCT LIST ATELIER'} {product.collection ? `• ${product.collection}` : ''}
              </span>

              {product.sku && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontFamily: 'monospace' }}>
                  SKU: {product.sku}
                </span>
              )}
            </div>

            {/* Product Title (H1) */}
            <h1 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              color: 'var(--color-heading)',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
            }}>
              {product.title}
            </h1>

            {/* Price & Discounts */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
              <span style={{
                fontSize: '1.8rem',
                fontWeight: 900,
                color: 'var(--color-heading)',
                fontFamily: 'var(--font-heading)',
              }}>
                ${hasDiscount ? product.salePrice.toFixed(2) : product.price.toFixed(2)}
              </span>

              {hasDiscount && (
                <span style={{
                  fontSize: '1.15rem',
                  color: 'var(--color-secondary)',
                  textDecoration: 'line-through',
                }}>
                  ${product.price.toFixed(2)}
                </span>
              )}

              <span className={`badge ${product.stockStatus === 'OUT_OF_STOCK' || product.stock === 0 ? 'badge-error' : 'badge-success'}`} style={{ marginLeft: 'auto' }}>
                {product.stockStatus === 'OUT_OF_STOCK' || product.stock === 0 ? 'Out of Stock' : 'In Stock & Ready to Ship'}
              </span>
            </div>

            {/* Short Description */}
            {product.shortDesc && (
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--color-text)',
                lineHeight: 1.6,
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--color-border)',
              }}>
                {product.shortDesc}
              </p>
            )}

            {/* Color Variant Selector */}
            {colors.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-heading)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Color: <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>{selectedColor?.name || colors[0]?.name}</span>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {colors.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(col)}
                      title={col.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: col.hex || '#111111',
                        border: selectedColor?.name === col.name ? '3px solid var(--color-primary)' : '1px solid rgba(0,0,0,0.2)',
                        boxShadow: selectedColor?.name === col.name ? '0 0 0 2px var(--color-background)' : 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                        transform: selectedColor?.name === col.name ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Variant Selector */}
            {sizes.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-heading)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Size: <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>{selectedSize?.name || 'Select Size'}</span>
                  </span>

                  {/* Size Guide Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-primary)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Scissors size={13} /> Size Guide
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {sizes.map((s, idx) => {
                    const isSelected = selectedSize?.name === s.name;
                    const isAvailable = s.inStock !== false;

                    return (
                      <button
                        key={idx}
                        onClick={() => isAvailable && setSelectedSize(s)}
                        disabled={!isAvailable}
                        style={{
                          minWidth: '46px',
                          height: '42px',
                          padding: '0 12px',
                          borderRadius: 'var(--button-radius)',
                          border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                          backgroundColor: isSelected
                            ? 'var(--color-primary)'
                            : (isAvailable ? 'var(--color-background)' : 'var(--color-surface)'),
                          color: isSelected
                            ? 'var(--color-button-text)'
                            : (isAvailable ? 'var(--color-heading)' : 'var(--color-secondary)'),
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          textDecoration: isAvailable ? 'none' : 'line-through',
                          opacity: isAvailable ? 1 : 0.5,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & CTA Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--button-radius)',
                backgroundColor: 'var(--color-background)',
                height: '48px',
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '38px',
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-heading)',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                  }}
                >
                  -
                </button>
                <span style={{ padding: '0 12px', fontWeight: 700, fontSize: '0.95rem' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: '38px',
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-heading)',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stockStatus === 'OUT_OF_STOCK' || product.stock === 0}
                className="btn btn-primary btn-lg"
                style={{
                  flex: '2 1 180px',
                  height: '48px',
                  justifyContent: 'center',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                }}
              >
                Add to Shopping Bag
              </button>

              <button
                onClick={() => setInquiryOpen(true)}
                className="btn btn-secondary btn-lg"
                style={{
                  flex: '1 1 140px',
                  height: '48px',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                Enquire Now
              </button>
            </div>

            {/* Social Share & Copy Link */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid var(--color-border)',
              marginTop: '0.5rem',
            }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Share2 size={14} /> Share Garment:
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${product.title} - ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.title} from Product List Atelier`)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  X
                </a>
                <button
                  onClick={handleCopyLink}
                  className="btn btn-sm btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Copy size={12} /> Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Garment Information Tabs & Accordions */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--button-radius)',
          padding: '2.5rem',
          marginBottom: '5rem',
        }}>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '2rem',
            overflowX: 'auto',
          }}>
            {[
              { key: 'description', label: 'Description & Styling' },
              { key: 'garment_details', label: 'Garment & Fabric Specifications' },
              { key: 'care', label: 'Care & Washing Guide' },
              { key: 'shipping', label: 'Complimentary Shipping & Returns' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '0.75rem 0',
                  fontSize: '0.9rem',
                  fontWeight: activeTab === tab.key ? 800 : 500,
                  color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-secondary)',
                  borderBottom: activeTab === tab.key ? '2px solid var(--color-primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content 1: Description */}
          {activeTab === 'description' && (
            <div style={{ maxWidth: '840px', color: 'var(--color-text)', lineHeight: 1.75, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
                {product.fullDesc || product.shortDesc}
              </p>

              {features.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '0.75rem' }}>
                    Key Features & Design Attributes:
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {features.map((f, i) => (
                      <li key={i}>{typeof f === 'string' ? f : f.text}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tab Content 2: Garment & Fabric Specifications */}
          {activeTab === 'garment_details' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--button-radius)', padding: '1.25rem', backgroundColor: 'var(--color-background)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '1rem' }}>
                  Textile & Construction
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                  <div><strong>Fabric:</strong> {product.fabric || 'Premium Certified Knit'}</div>
                  <div><strong>Material:</strong> {product.material || 'Organic Fiber'}</div>
                  <div><strong>Fit:</strong> {product.fit || 'Regular'}</div>
                  <div><strong>Pattern:</strong> {product.pattern || 'Solid'}</div>
                  <div><strong>Department:</strong> {product.gender || 'Unisex'}</div>
                  <div><strong>Season:</strong> {product.season || 'All Season'}</div>
                  <div><strong>Occasion:</strong> {product.occasion || 'Everyday'}</div>
                </div>
              </div>

              {Object.keys(specifications).length > 0 && (
                <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--button-radius)', padding: '1.25rem', backgroundColor: 'var(--color-background)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '1rem' }}>
                    Technical Specifications
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                    {Object.entries(specifications).map(([k, v]) => (
                      <div key={k}><strong>{k}:</strong> {v}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Content 3: Care Instructions */}
          {activeTab === 'care' && (
            <div style={{ maxWidth: '780px', color: 'var(--color-text)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '0.75rem' }}>
                How to Preserve & Care for Your Garment
              </h4>
              <p style={{ marginBottom: '1rem' }}>
                {product.careInstructions || 'Machine wash cold with similar colors. Line dry in shade. Do not bleach. Cool iron if necessary.'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--button-radius)' }}>
                  <strong>Wash Temperature:</strong> Cold Water (30°C / 86°F)
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--button-radius)' }}>
                  <strong>Drying:</strong> Line Dry in Shade (Avoid Tumble Dryer)
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--button-radius)' }}>
                  <strong>Ironing:</strong> Warm Iron on Reverse
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 4: Shipping & Returns */}
          {activeTab === 'shipping' && (
            <div style={{ maxWidth: '780px', color: 'var(--color-text)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '0.75rem' }}>
                Complimentary Worldwide Shipping & Returns
              </h4>
              <p style={{ marginBottom: '1rem' }}>
                All orders are prepared with plastic-free, recyclable luxury packaging. Orders over $150 qualify for complimentary DHL Express Worldwide shipping (delivered in 2-4 business days).
              </p>
              <p>
                We offer a 30-day evaluation window. If you require a different size or fit, our concierge will arrange a seamless pickup and exchange at zero cost.
              </p>
            </div>
          )}
        </div>

        {/* Related Garments */}
        {related.length > 0 && (
          <section style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  MATCHING PIECES
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  You May Also Like
                </h2>
              </div>
              <Link to={`/products?category=${product.category?.slug}`} className="btn btn-secondary btn-sm">
                View All in {product.category?.name}
              </Link>
            </div>

            <div className="grid-products">
              {related.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section>
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                YOUR BROWSING HISTORY
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                Recently Viewed
              </h2>
            </div>

            <div className="grid-products">
              {recentlyViewed.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem',
        }}>
          <div style={{
            backgroundColor: 'var(--color-background)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--button-radius)',
            padding: '2.5rem',
            maxWidth: '680px',
            width: '100%',
            position: 'relative',
          }}>
            <button
              onClick={() => setSizeGuideOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--color-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              Garment Measurement Chart (Inches / CM)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>
              Measurements are taken with the garment laid flat. For an oversized fit, select your true size. For a tailored slim fit, size down.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-heading)' }}>
                    <th style={{ padding: '8px' }}>Size</th>
                    <th style={{ padding: '8px' }}>Chest (in)</th>
                    <th style={{ padding: '8px' }}>Length (in)</th>
                    <th style={{ padding: '8px' }}>Shoulder (in)</th>
                    <th style={{ padding: '8px' }}>Sleeve (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: 'XS', chest: '38"', length: '27"', shoulder: '18.5"', sleeve: '8.5"' },
                    { size: 'S', chest: '40"', length: '28"', shoulder: '19.5"', sleeve: '9.0"' },
                    { size: 'M', chest: '42"', length: '29"', shoulder: '20.5"', sleeve: '9.5"' },
                    { size: 'L', chest: '44"', length: '30"', shoulder: '21.5"', sleeve: '10.0"' },
                    { size: 'XL', chest: '46"', length: '31"', shoulder: '22.5"', sleeve: '10.5"' },
                    { size: 'XXL', chest: '48"', length: '32"', shoulder: '23.5"', sleeve: '11.0"' },
                    { size: '3XL', chest: '50"', length: '33"', shoulder: '24.5"', sleeve: '11.5"' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '8px', fontWeight: 700 }}>{row.size}</td>
                      <td style={{ padding: '8px' }}>{row.chest}</td>
                      <td style={{ padding: '8px' }}>{row.length}</td>
                      <td style={{ padding: '8px' }}>{row.shoulder}</td>
                      <td style={{ padding: '8px' }}>{row.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button onClick={() => setSizeGuideOpen(false)} className="btn btn-primary btn-sm">
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bespoke Inquiry Modal */}
      {inquiryOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem',
        }}>
          <div style={{
            backgroundColor: 'var(--color-background)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--button-radius)',
            padding: '2.5rem',
            maxWidth: '540px',
            width: '100%',
            position: 'relative',
          }}>
            <button
              onClick={() => setInquiryOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--color-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              Concierge Garment Inquiry
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>
              Have questions about fabric certifications, custom sleeve lengths, or bulk ordering? Send a message directly to our atelier team.
            </p>

            <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  placeholder="e.g. Julian Vance"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                  placeholder="e.g. julian@atelier.com"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Questions / Notes *</label>
                <textarea
                  rows={3}
                  required
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  placeholder="Inquire about fit, availability, or custom tailoring..."
                  className="textarea-field"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setInquiryOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submittingInquiry} className="btn btn-primary" style={{ gap: '6px' }}>
                  <Send size={15} /> {submittingInquiry ? 'Sending...' : 'Send Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
