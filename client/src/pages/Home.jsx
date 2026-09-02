import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useSite } from '../context/SiteContext';
import HeroSlider from '../components/common/HeroSlider';
import ProductCard from '../components/common/ProductCard';
import CategoryCard from '../components/common/CategoryCard';
import OfferCard from '../components/common/OfferCard';
import SEOHead from '../components/common/SEOHead';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Scissors,
  Feather,
  Mail,
  CheckCircle2,
} from 'lucide-react';

const Home = () => {
  const { content, settings } = useSite();
  const [heroSlides, setHeroSlides] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [slidesRes, featRes, newRes, bestRes, catsRes, offersRes, seoRes] = await Promise.all([
          api.get('/hero-slides'),
          api.get('/products?isFeatured=true&limit=4'),
          api.get('/products?isNewArrival=true&limit=4'),
          api.get('/products?isBestseller=true&limit=4'),
          api.get('/categories'),
          api.get('/offers?limit=3'),
          api.get('/seo/page/home').catch(() => ({ data: { seo: null } })),
        ]);

        if (slidesRes.data?.success) setHeroSlides(slidesRes.data.slides || []);
        if (featRes.data?.success) setFeaturedProducts(featRes.data.products || []);
        if (newRes.data?.success) setNewArrivals(newRes.data.products || []);
        if (bestRes.data?.success) setBestsellers(bestRes.data.products || []);
        if (catsRes.data?.success) setCategories(catsRes.data.categories || []);
        if (offersRes.data?.success) setOffers(offersRes.data.offers || []);
        if (seoRes.data?.success) setSeoData(seoRes.data.seo);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
    }
  };

  const featuredCMS = content.home_featured_heading || {
    title: 'Signature Garments Collection',
    subtitle: 'HANDCRAFTED ATELIER ESSENTIALS',
    content: 'Meticulously engineered garments made from 240 GSM organic Supima cotton, Normandy flax linen, and Japanese selvedge denim.',
  };

  const categoriesCMS = content.home_categories_heading || {
    title: 'Shop by Garment Category',
    subtitle: 'EXPLORE COLLECTIONS',
    content: 'Browse our specialized departments curated for timeless everyday elegance and modern streetwear drape.',
  };

  const offersCMS = content.home_offers_heading || {
    title: 'Curated Offers & Seasonal Drops',
    subtitle: 'EXCLUSIVE ALLOCATIONS',
    content: 'Limited-quantity introductory releases and capsule wardrobe bundle savings.',
  };

  const ctaBannerCMS = content.home_cta_banner || {
    title: 'Sustainable Elegance & Master Tailoring',
    subtitle: 'THE ATELIER MANIFESTO',
    content: 'We believe clothing should be enduring, tactile, and ethically crafted. Every garment is cut from GOTS-certified organic fibers and finished with bespoke artisanal precision.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80',
    meta: { buttonText: 'Explore New Season Drops', buttonUrl: '/products' },
  };

  const aboutBrandCMS = content.home_about_brand || {
    title: 'Rooted in Craftsmanship & Sustainable Fibers',
    subtitle: 'ABOUT PRODUCT LIST ATELIER',
    content: 'Founded on the philosophy that modern fashion should marry sculptural aesthetics with uncompromising textile integrity. Our materials are traceable from certified organic cotton mills in Portugal to handloom silk weavers in India.',
  };

  const seoSectionCMS = content.home_seo_content || {
    title: 'Premium Garments & Sustainable Fashion Collection',
    subtitle: 'THE ART OF LUXURY DRESSING',
    content: `Welcome to PRODUCT LIST, your premier destination for luxury garments, sustainable fashion, and bespoke wardrobe essentials. Our design studio merges architectural minimalist silhouettes with ethically sourced, high-grade textiles.

Whether you are looking for heavyweight 240 GSM organic Supima cotton T-shirts, structured 450 GSM French terry hoodies, breezy Normandy flax linen shirts, double-pleated tailored trousers, or handcrafted silk-cotton ethnic kurtas, our curated collection is engineered to offer unmatched longevity, breathability, and poise.

Every garment features detailed sizing charts, size-wise inventory availability, authentic color swatches, and transparent fabric care instructions. We adhere to rigorous fair-wage labor standards and use non-toxic, eco-friendly dye processes to ensure our clothing is gentle on your skin and conscious of the planet. Experience seamless online ordering with fast worldwide express delivery and hassle-free returns.`,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 0. Universal Dynamic SEO for Homepage */}
      <SEOHead
        title={seoData?.seoTitle || settings.seo_site_title || 'PRODUCT LIST | Garments & Sustainable Fashion Atelier'}
        description={seoData?.metaDescription || settings.seo_meta_description}
        keywords={seoData?.focusKeyword || settings.seo_keywords}
        canonicalUrl={seoData?.canonicalUrl}
        robotsIndex={seoData?.robotsIndex !== false}
        robotsFollow={seoData?.robotsFollow !== false}
        ogTitle={seoData?.ogTitle}
        ogDescription={seoData?.ogDescription}
        ogImage={seoData?.ogImage}
      />

      {/* 1. 6-Slide Dynamic Fashion Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* 2. Value Proposition Strip for Garments */}
      <section style={{
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        padding: '2rem 0',
      }}>
        <div className="container-custom">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--button-radius)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
                flexShrink: 0,
              }}>
                <Truck size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-heading)' }}>
                  Complimentary Express Shipping
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
                  On all global orders over $150
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--button-radius)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
                flexShrink: 0,
              }}>
                <Feather size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-heading)' }}>
                  Certified Organic Fibers
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
                  Supima cotton, French linen & Merino wool
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--button-radius)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
                flexShrink: 0,
              }}>
                <Scissors size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-heading)' }}>
                  Bespoke Atelier Tailoring
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
                  Architectural cuts & reinforced seams
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--button-radius)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
                flexShrink: 0,
              }}>
                <RotateCcw size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-heading)' }}>
                  30-Day Easy Returns
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
                  Hassle-free size exchanges & refunds
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Garment Category Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-custom">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              {categoriesCMS.subtitle && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}>
                  {categoriesCMS.subtitle}
                </span>
              )}
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                {categoriesCMS.title}
              </h2>
              {categoriesCMS.content && (
                <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', marginTop: '6px', maxWidth: '600px' }}>
                  {categoriesCMS.content}
                </p>
              )}
            </div>

            <Link
              to="/categories"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>All Departments</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-categories">
            {loading
              ? [1, 2, 3, 4].map((n) => (
                  <div key={n} className="skeleton" style={{ height: '260px' }} />
                ))
              : categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Collection Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-background)' }}>
        <div className="container-custom">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              {featuredCMS.subtitle && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}>
                  {featuredCMS.subtitle}
                </span>
              )}
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                {featuredCMS.title}
              </h2>
              {featuredCMS.content && (
                <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', marginTop: '6px', maxWidth: '600px' }}>
                  {featuredCMS.content}
                </p>
              )}
            </div>

            <Link
              to="/products?isFeatured=true"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>View Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-products">
            {loading
              ? [1, 2, 3, 4].map((n) => (
                  <div key={n} className="skeleton" style={{ height: '400px' }} />
                ))
              : featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* 5. New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section style={{
          padding: '5rem 0',
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div className="container-custom">
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}>
                  SPRING / SUMMER 2026
                </span>
                <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  New Season Arrivals
                </h2>
                <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', marginTop: '6px' }}>
                  Fresh drops tailored in breathable flax linen, supima cotton, and lightweight blends.
                </p>
              </div>

              <Link
                to="/products?isNewArrival=true"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>View All New Drops</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid-products">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Best Sellers Section */}
      {bestsellers.length > 0 && (
        <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-background)' }}>
          <div className="container-custom">
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}>
                  TIMELESS ROTATION
                </span>
                <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  Customer Favorites & Bestsellers
                </h2>
                <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', marginTop: '6px' }}>
                  Our most coveted pieces engineered for repeat wear and enduring comfort.
                </p>
              </div>

              <Link
                to="/products?isBestseller=true"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Shop Bestsellers</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid-products">
              {bestsellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Curated Offers Section */}
      {offers.length > 0 && (
        <section style={{
          padding: '5rem 0',
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
        }}>
          <div className="container-custom">
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                {offersCMS.subtitle && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '6px',
                  }}>
                    {offersCMS.subtitle}
                  </span>
                )}
                <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  {offersCMS.title}
                </h2>
                {offersCMS.content && (
                  <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', marginTop: '6px', maxWidth: '600px' }}>
                    {offersCMS.content}
                  </p>
                )}
              </div>

              <Link
                to="/offers"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>All Offers</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid-offers">
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Editorial Fashion Promotional Banner */}
      <section style={{
        padding: '6rem 0',
        backgroundColor: 'var(--color-background)',
        borderTop: '1px solid var(--color-border)',
      }}>
        <div className="container-custom">
          <div style={{
            position: 'relative',
            borderRadius: 'var(--button-radius)',
            overflow: 'hidden',
            minHeight: '420px',
            display: 'flex',
            alignItems: 'center',
            padding: '4rem 3rem',
            backgroundImage: `url("${ctaBannerCMS.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600'}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid var(--color-border)',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.3) 100%)',
            }} />

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '580px', color: '#FFFFFF' }}>
              {ctaBannerCMS.subtitle && (
                <span style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-button-text)',
                  padding: '5px 12px',
                  borderRadius: 'var(--button-radius)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: '1rem',
                }}>
                  {ctaBannerCMS.subtitle}
                </span>
              )}

              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#FFFFFF',
                marginBottom: '1.25rem',
                fontFamily: 'var(--font-heading)',
              }}>
                {ctaBannerCMS.title}
              </h2>

              <p style={{
                fontSize: '1rem',
                color: '#E5E7EB',
                lineHeight: 1.6,
                marginBottom: '2rem',
              }}>
                {ctaBannerCMS.content}
              </p>

              <Link
                to={ctaBannerCMS.meta?.buttonUrl || '/products'}
                className="btn btn-lg"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                  fontWeight: 800,
                  border: 'none',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  padding: '0.85rem 2rem',
                }}
              >
                <span>{ctaBannerCMS.meta?.buttonText || 'Shop New Season'}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. About Brand & Sustainable Craftsmanship Section */}
      <section style={{
        padding: '5rem 0',
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container-custom">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}>
            <div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '6px',
              }}>
                {aboutBrandCMS.subtitle}
              </span>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 800,
                marginBottom: '1.25rem',
                fontFamily: 'var(--font-heading)',
              }}>
                {aboutBrandCMS.title}
              </h2>
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--color-text)',
                lineHeight: 1.7,
                marginBottom: '1.75rem',
              }}>
                {aboutBrandCMS.content}
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-heading)' }}>100%</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>Traceable Organic Fibers</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-heading)' }}>240+</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>GSM Heavyweight Drapes</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-heading)' }}>Zero</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>Toxic Dye Waste</div>
                </div>
              </div>
            </div>

            <div style={{
              borderRadius: 'var(--button-radius)',
              overflow: 'hidden',
              height: '380px',
              position: 'relative',
              border: '1px solid var(--color-border)',
            }}>
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80"
                alt="Product List Garments Atelier Craftsmanship"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 10. Dedicated SEO Content Section (Requirement #15) */}
      <section style={{
        padding: '5rem 0',
        backgroundColor: 'var(--color-background)',
      }}>
        <div className="container-custom" style={{ maxWidth: '980px' }}>
          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--button-radius)',
            padding: '3rem 2.5rem',
            backgroundColor: 'var(--color-surface)',
          }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--color-primary)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px',
            }}>
              {seoSectionCMS.subtitle || 'THE ART OF LUXURY DRESSING'}
            </span>

            <h2 style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              fontWeight: 800,
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-heading)',
            }}>
              {seoSectionCMS.title}
            </h2>

            <div style={{
              fontSize: '0.92rem',
              color: 'var(--color-text)',
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
            }}>
              {seoSectionCMS.content}
            </div>

            {/* Quick Internal Links to Main Garment Departments */}
            <div style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-heading)', alignSelf: 'center' }}>
                Explore Departments:
              </span>
              <Link to="/products?category=t-shirts-polos" className="badge badge-secondary" style={{ textDecoration: 'none', padding: '5px 10px' }}>
                Oversized T-Shirts
              </Link>
              <Link to="/products?category=hoodies-sweatshirts" className="badge badge-secondary" style={{ textDecoration: 'none', padding: '5px 10px' }}>
                French Terry Hoodies
              </Link>
              <Link to="/products?category=shirts" className="badge badge-secondary" style={{ textDecoration: 'none', padding: '5px 10px' }}>
                Pure Linen Shirts
              </Link>
              <Link to="/products?category=denim-trousers" className="badge badge-secondary" style={{ textDecoration: 'none', padding: '5px 10px' }}>
                Pleated Trousers
              </Link>
              <Link to="/products?category=ethnic-kurtas" className="badge badge-secondary" style={{ textDecoration: 'none', padding: '5px 10px' }}>
                Silk-Cotton Kurtas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. VIP Newsletter & Concierge CTA */}
      <section style={{
        padding: '4.5rem 0',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-button-text)',
      }}>
        <div className="container-custom" style={{ maxWidth: '680px', textAlign: 'center' }}>
          <Mail size={32} style={{ margin: '0 auto 1rem auto', opacity: 0.9 }} />
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.75rem', color: 'inherit', fontFamily: 'var(--font-heading)' }}>
            Join the Atelier Private Access
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#E2E8F0', lineHeight: 1.5, marginBottom: '2rem' }}>
            Receive priority notifications for limited-run garment allocations, private sale invitations, and seasonal lookbooks.
          </p>

          {newsletterSubscribed ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '10px 20px',
              borderRadius: 'var(--button-radius)',
              color: '#FFFFFF',
              fontWeight: 600,
            }}>
              <CheckCircle2 size={18} />
              <span>Thank you for subscribing. Welcome to the Atelier.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '480px', margin: '0 auto', flexWrap: 'wrap' }}>
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '12px 16px',
                  borderRadius: 'var(--button-radius)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                  border: 'none',
                  borderRadius: 'var(--button-radius)',
                  padding: '12px 24px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
