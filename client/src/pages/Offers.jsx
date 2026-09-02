import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import OfferCard from '../components/common/OfferCard';
import SEOHead from '../components/common/SEOHead';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await api.get('/offers');
        if (res.data?.success) {
          setOffers(res.data.offers || []);
        }
      } catch (err) {
        console.error('Error loading offers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '80vh', padding: '4rem 0 6rem 0' }}>
      <SEOHead
        title="Special Offers & Capsule Wardrobe Deals | Product List"
        description="Access exclusive seasonal garment specials, introductory capsule wardrobe bundles, and limited-time savings on luxury clothing."
        keywords="garments offers, fashion sale, capsule wardrobe bundle discount"
        canonicalUrl="https://productlist.com/offers"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Offers', url: '/offers' },
        ]}
      />

      <div className="container-custom">
        <div style={{ marginBottom: '3rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'var(--color-primary)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '6px',
          }}>
            EXCLUSIVE ALLOCATIONS
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, marginBottom: '8px', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
            Curated Offers & Seasonal Specials
          </h1>
          <p style={{ color: 'var(--color-text)', fontSize: '0.95rem' }}>
            Exclusive capsule wardrobe bundle savings and time-sensitive introductory allocations on luxury garments.
          </p>
        </div>

        {loading ? (
          <div className="grid-offers">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="skeleton" style={{ height: '280px' }} />
            ))}
          </div>
        ) : (
          <div className="grid-offers">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
