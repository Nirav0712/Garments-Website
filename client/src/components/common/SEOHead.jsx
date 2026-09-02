import React, { useEffect } from 'react';
import { useSite } from '../../context/SiteContext';

/**
 * Universal SEO & Structured Data (JSON-LD) Component
 * Dynamically controls document <title>, <meta>, canonical tags, Open Graph, Twitter Cards, and Schema.org scripts.
 */
const SEOHead = ({
  title,
  description,
  keywords,
  canonicalUrl,
  robotsIndex = true,
  robotsFollow = true,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  twitterTitle,
  twitterDescription,
  twitterImage,
  productSchema = null,
  breadcrumbs = null,
}) => {
  const { settings } = useSite();

  const siteName = settings.site_name || 'PRODUCT LIST';
  const defaultDesc = settings.seo_meta_description || 'Luxury garments and sustainable fashion atelier.';
  const defaultImage = settings.seo_default_og_image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200';
  const baseUrl = (settings.seo_canonical_base_url || window.location.origin).replace(/\/+$/, '');

  const finalTitle = title ? (title.includes('|') ? title : `${title} | ${siteName}`) : siteName;
  const finalDesc = description || defaultDesc;
  const finalImage = ogImage || defaultImage;
  const finalCanonical = canonicalUrl || `${baseUrl}${window.location.pathname}`;
  const robotsValue = `${robotsIndex ? 'index' : 'noindex'}, ${robotsFollow ? 'follow' : 'nofollow'}`;

  useEffect(() => {
    // 1. Update Title
    document.title = finalTitle;

    // Helper to create or update meta tags
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to create or update link tags (canonical)
    const setLinkTag = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Helper to create or update JSON-LD script tags
    const setJsonLd = (id, dataObj) => {
      let script = document.getElementById(id);
      if (!dataObj) {
        if (script) script.remove();
        return;
      }
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(dataObj);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', finalDesc);
    if (keywords) setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', robotsValue);
    setLinkTag('canonical', finalCanonical);

    // Google & Bing site verifications from site settings
    if (settings.seo_google_verification) {
      setMetaTag('name', 'google-site-verification', settings.seo_google_verification.replace(/^google-site-verification=/, ''));
    }
    if (settings.seo_bing_verification) {
      setMetaTag('name', 'msvalidate.01', settings.seo_bing_verification.replace(/^bing-verification=/, ''));
    }

    // 3. Open Graph Tags
    setMetaTag('property', 'og:title', ogTitle || finalTitle);
    setMetaTag('property', 'og:description', ogDescription || finalDesc);
    setMetaTag('property', 'og:image', finalImage);
    setMetaTag('property', 'og:url', finalCanonical);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', siteName);

    // 4. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', twitterTitle || ogTitle || finalTitle);
    setMetaTag('name', 'twitter:description', twitterDescription || ogDescription || finalDesc);
    setMetaTag('name', 'twitter:image', twitterImage || finalImage);

    // 5. Global Organization Schema
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteName,
      url: baseUrl,
      logo: defaultImage,
      description: defaultDesc,
      email: settings.contact_email || 'concierge@productlist.com',
      telephone: settings.contact_phone || '+1-800-555-FASHION',
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.contact_address || '540 Atelier Blvd',
        addressCountry: 'US',
      },
    };
    setJsonLd('jsonld-organization', organizationSchema);

    // 6. WebSite Schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/products?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
    setJsonLd('jsonld-website', websiteSchema);

    // 7. Breadcrumb Schema (if provided)
    if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.url.startsWith('http') ? b.url : `${baseUrl}${b.url}`,
        })),
      };
      setJsonLd('jsonld-breadcrumbs', breadcrumbSchema);
    } else {
      setJsonLd('jsonld-breadcrumbs', null);
    }

    // 8. Product Schema (if on product detail page)
    if (productSchema) {
      const pSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productSchema.title,
        image: productSchema.images?.map((img) => img.url) || [finalImage],
        description: productSchema.shortDesc || productSchema.fullDesc || finalDesc,
        sku: productSchema.sku || `SKU-${productSchema.id}`,
        brand: {
          '@type': 'Brand',
          name: productSchema.brand || siteName,
        },
        offers: {
          '@type': 'Offer',
          url: finalCanonical,
          priceCurrency: productSchema.currency || 'USD',
          price: productSchema.salePrice ? productSchema.salePrice : productSchema.price,
          itemCondition: 'https://schema.org/NewCondition',
          availability: productSchema.stockStatus === 'OUT_OF_STOCK' || productSchema.stock === 0
            ? 'https://schema.org/OutOfStock'
            : 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: siteName,
          },
        },
      };
      setJsonLd('jsonld-product', pSchema);
    } else {
      setJsonLd('jsonld-product', null);
    }

    return () => {
      // Cleanup product-specific schema on leave
      const prodScript = document.getElementById('jsonld-product');
      if (prodScript) prodScript.remove();
      const breadScript = document.getElementById('jsonld-breadcrumbs');
      if (breadScript) breadScript.remove();
    };
  }, [
    finalTitle,
    finalDesc,
    keywords,
    finalCanonical,
    robotsValue,
    ogTitle,
    ogDescription,
    finalImage,
    ogType,
    twitterTitle,
    twitterDescription,
    twitterImage,
    productSchema,
    breadcrumbs,
    settings,
    siteName,
    baseUrl,
  ]);

  return null;
};

export default SEOHead;
