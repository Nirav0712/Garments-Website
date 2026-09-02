import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/common/ProductCard';
import SEOHead from '../components/common/SEOHead';
import { Search, X, ArrowUpDown, Filter, Sparkles } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const search = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category') || '';
  const gender = searchParams.get('gender') || '';
  const collection = searchParams.get('collection') || '';
  const isNewArrival = searchParams.get('isNewArrival') || '';
  const isFeatured = searchParams.get('isFeatured') || '';
  const isBestseller = searchParams.get('isBestseller') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.success) {
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (categorySlug) params.append('category', categorySlug);
        if (gender) params.append('gender', gender);
        if (collection) params.append('collection', collection);
        if (isNewArrival) params.append('isNewArrival', 'true');
        if (isFeatured) params.append('isFeatured', 'true');
        if (isBestseller) params.append('isBestseller', 'true');
        if (sort) params.append('sort', sort);
        params.append('page', page);
        params.append('limit', 12);

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data?.success) {
          setProducts(res.data.products || []);
          setTotal(res.data.total || 0);
          setPages(res.data.totalPages || 1);
        }
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, categorySlug, gender, collection, isNewArrival, isFeatured, isBestseller, sort, page]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const currentCategory = categories.find((c) => c.slug === categorySlug);
  const pageTitle = currentCategory
    ? `${currentCategory.name} Online | Luxury Fashion Collection`
    : collection
    ? `${collection} Collection | Luxury Garments`
    : isNewArrival
    ? 'New Season Arrivals | Garments & Apparel'
    : 'Garments & Fashion Catalog | Product List';

  const pageDesc = currentCategory?.description || 'Explore our complete catalog of luxury garments, organic cotton t-shirts, french terry hoodies, linen shirts, and tailored trousers.';

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '85vh', padding: '3.5rem 0 6rem 0' }}>
      {/* Dynamic SEO Tagging */}
      <SEOHead
        title={pageTitle}
        description={pageDesc}
        keywords={currentCategory ? `${currentCategory.name.toLowerCase()}, garments, clothing` : 'garments, luxury fashion, clothing online'}
        canonicalUrl={`https://productlist.com/products${categorySlug ? `?category=${categorySlug}` : ''}`}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Catalog', url: '/products' },
          ...(currentCategory ? [{ name: currentCategory.name, url: `/products?category=${currentCategory.slug}` }] : []),
        ]}
      />

      <div className="container-custom">
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'var(--color-primary)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '6px',
          }}>
            ATELIER SHOWCASE
          </span>
          <h1 style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            fontWeight: 900,
            marginBottom: '8px',
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
          }}>
            {currentCategory ? currentCategory.name : (collection || (isNewArrival ? 'New Season Arrivals' : 'All Garments'))}
          </h1>
          <p style={{ color: 'var(--color-text)', fontSize: '0.95rem' }}>
            Showing {total} luxury handcrafted {total === 1 ? 'garment' : 'garments'}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--button-radius)',
          padding: '1.25rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          {/* Row 1: Search & Sort */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: '1 1 280px', maxWidth: '440px' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--color-secondary)' }} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by garment, fabric, SKU, or style..."
                  className="input-field"
                  style={{ paddingLeft: '40px', height: '40px', fontSize: '0.85rem', backgroundColor: 'var(--color-background)' }}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0 18px', height: '40px' }}>
                Search
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUpDown size={14} /> Sort:
              </span>
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="select-field"
                style={{ width: '190px', height: '40px', fontSize: '0.85rem', backgroundColor: 'var(--color-background)' }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="featured">Featured First</option>
                <option value="bestseller">Bestsellers</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Row 2: Gender Filters */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--color-border)',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '6px' }}>
              Department:
            </span>
            {['', 'MENS', 'WOMENS', 'UNISEX', 'KIDS'].map((g) => (
              <button
                key={g}
                onClick={() => updateParam('gender', g)}
                className="btn btn-sm"
                style={{
                  backgroundColor: gender === g ? 'var(--color-primary)' : 'var(--color-background)',
                  color: gender === g ? 'var(--color-button-text)' : 'var(--color-heading)',
                  border: '1px solid var(--color-border)',
                  padding: '4px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                {g === '' ? 'ALL' : g}
              </button>
            ))}
          </div>

          {/* Row 3: Category Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--color-border)',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '6px' }}>
              Categories:
            </span>

            <button
              onClick={() => updateParam('category', '')}
              className="btn btn-sm"
              style={{
                backgroundColor: !categorySlug ? 'var(--color-primary)' : 'var(--color-background)',
                color: !categorySlug ? 'var(--color-button-text)' : 'var(--color-heading)',
                border: '1px solid var(--color-border)',
                padding: '4px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              All Garments
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParam('category', cat.slug)}
                className="btn btn-sm"
                style={{
                  backgroundColor: categorySlug === cat.slug ? 'var(--color-primary)' : 'var(--color-background)',
                  color: categorySlug === cat.slug ? 'var(--color-button-text)' : 'var(--color-heading)',
                  border: '1px solid var(--color-border)',
                  padding: '4px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                {cat.name}
              </button>
            ))}

            {(search || categorySlug || gender || collection || isNewArrival || isFeatured || isBestseller || sort !== 'newest') && (
              <button
                onClick={handleClearFilters}
                className="btn btn-sm btn-outline"
                style={{
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <X size={13} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Garments Product Grid */}
        {loading ? (
          <div className="grid-products">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="skeleton" style={{ height: '420px' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{
            padding: '5rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--button-radius)',
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '8px' }}>
              No matching garments found
            </h3>
            <p style={{ color: 'var(--color-text)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Try adjusting your category, department, or search filters.
            </p>
            <button onClick={handleClearFilters} className="btn btn-primary btn-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid-products">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '3.5rem',
          }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => updateParam('page', p.toString())}
                className="btn btn-sm"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  backgroundColor: p === page ? 'var(--color-primary)' : 'var(--color-background)',
                  color: p === page ? 'var(--color-button-text)' : 'var(--color-heading)',
                  border: '1px solid var(--color-border)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
