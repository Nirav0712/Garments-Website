import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import CategoryCard from '../components/common/CategoryCard';
import SEOHead from '../components/common/SEOHead';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.success) {
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '80vh', padding: '4rem 0 6rem 0' }}>
      <SEOHead
        title="Garment Categories & Fashion Collections | Product List"
        description="Explore all fashion garment departments: Oversized T-Shirts, French Terry Hoodies, Pure Linen Shirts, Tailored Trousers, Outerwear, and Silk Kurtas."
        keywords="garment categories, clothing collections, fashion departments"
        canonicalUrl="https://productlist.com/categories"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Categories', url: '/categories' },
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
            FASHION DEPARTMENTS
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, marginBottom: '8px', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
            Shop by Garment Category
          </h1>
          <p style={{ color: 'var(--color-text)', fontSize: '0.95rem' }}>
            Explore curated garment collections engineered for timeless everyday elegance and modern streetwear drape.
          </p>
        </div>

        {loading ? (
          <div className="grid-categories">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="skeleton" style={{ height: '260px' }} />
            ))}
          </div>
        ) : (
          <div className="grid-categories">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
