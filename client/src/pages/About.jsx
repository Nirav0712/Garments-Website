import React from 'react';
import { useSite } from '../context/SiteContext';
import { Link } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import { ShieldCheck, Feather, Scissors, Award, ArrowRight, HeartHandshake } from 'lucide-react';

const About = () => {
  const { content } = useSite();

  const aboutHero = content.about_hero || {
    title: 'Crafting the Intersection of Sustainable Fibers & Modern Silhouette',
    subtitle: 'OUR ATELIER STORY',
    content:
      'PRODUCT LIST was founded on a singular obsession: to eliminate fast-fashion compromise and create enduring garments that marry sculptural aesthetics, certified organic textiles, and artisan tailoring.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80',
  };

  const pillars = [
    {
      icon: <Feather size={22} />,
      title: 'Certified Organic Textiles',
      desc: 'We strictly source 100% organic Supima cotton, Normandy flax linen, and ethically harvested Australian Merino wool.',
    },
    {
      icon: <Scissors size={22} />,
      title: 'Architectural Tailoring',
      desc: 'Every garment is cut for flattering drape and durability—featuring reinforced collars, clean side slits, and French seams.',
    },
    {
      icon: <HeartHandshake size={22} />,
      title: 'Ethical & Fair-Wage Production',
      desc: 'We partner exclusively with certified heritage mills in Portugal, Italy, and master handloom cooperatives across India.',
    },
    {
      icon: <Award size={22} />,
      title: 'Zero Waste & Enduring Longevity',
      desc: 'Our pre-shrunk, bio-enzyme washed garments are engineered to look and feel better with every wash, lasting years in your rotation.',
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '80vh', paddingBottom: '6rem' }}>
      <SEOHead
        title="About Product List Atelier | Sustainable Fashion & Craftsmanship"
        description="Discover Product List Atelier's commitment to certified organic textiles, fair trade manufacturing, and bespoke garments tailoring."
        keywords="sustainable garments, organic supima cotton, atelier tailoring, luxury fashion brand story"
        canonicalUrl="https://productlist.com/about"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About Atelier', url: '/about' },
        ]}
      />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '460px',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `url("${aboutHero.image}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '5rem 0',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 100%)',
        }} />

        <div className="container-custom" style={{ position: 'relative', zIndex: 10, maxWidth: '800px' }}>
          <span style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-button-text)',
            padding: '5px 12px',
            borderRadius: 'var(--button-radius)',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '1rem',
          }}>
            {aboutHero.subtitle}
          </span>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.25rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            color: '#FFFFFF',
            marginBottom: '1.25rem',
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase',
          }}>
            {aboutHero.title}
          </h1>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: 1.6,
            color: '#E5E7EB',
          }}>
            {aboutHero.content}
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 4rem auto' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--color-primary)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '6px',
            }}>
              OUR PILLARS
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              Crafted With Purpose & Integrity
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem',
          }}>
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="store-card"
                style={{
                  padding: '2.25rem',
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--button-radius)',
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--button-radius)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}>
                  {pillar.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px', color: 'var(--color-heading)', fontFamily: 'var(--font-heading)' }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ backgroundColor: 'var(--color-surface)', padding: '5rem 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container-custom" style={{ textAlign: 'center', maxWidth: '640px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
            Discover the Garments Collection
          </h2>
          <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Explore our curated oversized tees, heavyweight hoodies, flax linen shirts, pleated trousers, and artisan kurtas.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            <span>Explore All Garments</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
