const prisma = require('../config/db');

// @desc    Get SEO Dashboard metrics & health audit
// @route   GET /api/seo/dashboard
// @access  Private/Admin
const getSEODashboard = async (req, res) => {
  try {
    const [
      totalProducts,
      totalCategories,
      totalImages,
      totalOffers,
      allSEORecords,
      productsWithImages,
      categoriesList,
      offersList,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.productImage.count(),
      prisma.offer.count({ where: { isActive: true } }),
      prisma.sEO.findMany(),
      prisma.product.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          slug: true,
          images: { select: { id: true, altText: true, url: true } },
        },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true, image: true },
      }),
      prisma.offer.findMany({
        where: { isActive: true },
        select: { id: true, title: true },
      }),
    ]);

    const productSEOs = allSEORecords.filter((s) => s.entityType === 'PRODUCT');
    const categorySEOs = allSEORecords.filter((s) => s.entityType === 'CATEGORY');
    const pageSEOs = allSEORecords.filter((s) => s.entityType === 'PAGE');
    const offerSEOs = allSEORecords.filter((s) => s.entityType === 'OFFER');

    // Calculate product SEO completion
    const productSEOMap = new Map(productSEOs.map((s) => [s.entityId, s]));
    let productsWithGoodSEO = 0;
    const productsMissingSEO = [];
    const imagesMissingAlt = [];

    productsWithImages.forEach((prod) => {
      const seo = productSEOMap.get(prod.id);
      const hasTitle = Boolean(seo?.seoTitle);
      const hasDesc = Boolean(seo?.metaDescription);
      const hasKeyword = Boolean(seo?.focusKeyword);

      if (hasTitle && hasDesc && hasKeyword) {
        productsWithGoodSEO++;
      } else {
        productsMissingSEO.push({
          id: prod.id,
          title: prod.title,
          slug: prod.slug,
          missing: [
            !hasTitle && 'SEO Title',
            !hasDesc && 'Meta Description',
            !hasKeyword && 'Focus Keyword',
          ].filter(Boolean),
        });
      }

      prod.images.forEach((img) => {
        if (!img.altText || img.altText.trim() === '' || img.altText.toLowerCase().endsWith('.jpg') || img.altText.toLowerCase().endsWith('.png')) {
          imagesMissingAlt.push({
            productId: prod.id,
            productTitle: prod.title,
            imageId: img.id,
            imageUrl: img.url,
          });
        }
      });
    });

    // Categories SEO check
    const categorySEOMap = new Map(categorySEOs.map((s) => [s.entityId, s]));
    const categoriesMissingSEO = [];
    let categoriesWithGoodSEO = 0;

    categoriesList.forEach((cat) => {
      const seo = categorySEOMap.get(cat.id);
      if (seo?.seoTitle && seo?.metaDescription && seo?.focusKeyword) {
        categoriesWithGoodSEO++;
      } else {
        categoriesMissingSEO.push({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        });
      }
    });

    // Pages check (6 core pages)
    const corePages = ['home', 'products', 'categories', 'offers', 'about', 'contact'];
    const pageSEOMap = new Map(pageSEOs.map((s) => [s.entityId, s]));
    const pagesMissingSEO = [];
    let pagesWithGoodSEO = 0;

    corePages.forEach((pageKey) => {
      const seo = pageSEOMap.get(pageKey);
      if (seo?.seoTitle && seo?.metaDescription && seo?.focusKeyword) {
        pagesWithGoodSEO++;
      } else {
        pagesMissingSEO.push({
          key: pageKey,
          name: pageKey.charAt(0).toUpperCase() + pageKey.slice(1),
        });
      }
    });

    // Noindex count
    const noindexCount = allSEORecords.filter((s) => s.robotsIndex === false).length;

    // Health Percentages
    const productOptimizationRate = totalProducts > 0 ? Math.round((productsWithGoodSEO / totalProducts) * 100) : 100;
    const categoryOptimizationRate = totalCategories > 0 ? Math.round((categoriesWithGoodSEO / totalCategories) * 100) : 100;
    const pageOptimizationRate = Math.round((pagesWithGoodSEO / corePages.length) * 100);
    const imagesWithAltCount = totalImages - imagesMissingAlt.length;
    const imageOptimizationRate = totalImages > 0 ? Math.round((imagesWithAltCount / totalImages) * 100) : 100;

    // Overall SEO Health Score
    const overallHealthScore = Math.round(
      productOptimizationRate * 0.4 +
      categoryOptimizationRate * 0.25 +
      pageOptimizationRate * 0.2 +
      imageOptimizationRate * 0.15
    );

    // Dynamic Warnings
    const warnings = [];
    if (productsMissingSEO.length > 0) {
      warnings.push(`${productsMissingSEO.length} product(s) missing primary SEO metadata.`);
    }
    if (imagesMissingAlt.length > 0) {
      warnings.push(`${imagesMissingAlt.length} product image(s) missing descriptive Alt Text.`);
    }
    if (categoriesMissingSEO.length > 0) {
      warnings.push(`${categoriesMissingSEO.length} category(ies) missing custom meta tags.`);
    }
    if (pagesMissingSEO.length > 0) {
      warnings.push(`${pagesMissingSEO.length} core page(s) missing search engine optimization.`);
    }

    return res.status(200).json({
      success: true,
      data: {
        overallHealthScore,
        counts: {
          totalProducts,
          productsWithGoodSEO,
          totalCategories,
          categoriesWithGoodSEO,
          totalPages: corePages.length,
          pagesWithGoodSEO,
          totalImages,
          imagesMissingAlt: imagesMissingAlt.length,
          totalOffers,
          noindexCount,
        },
        rates: {
          products: productOptimizationRate,
          categories: categoryOptimizationRate,
          pages: pageOptimizationRate,
          images: imageOptimizationRate,
        },
        warnings,
        missing: {
          products: productsMissingSEO.slice(0, 10),
          categories: categoriesMissingSEO,
          pages: pagesMissingSEO,
          images: imagesMissingAlt.slice(0, 10),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching SEO dashboard data:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching SEO dashboard' });
  }
};

// @desc    Get SEO by entity (PRODUCT, CATEGORY, PAGE, OFFER)
// @route   GET /api/seo/:entityType/:entityId
// @access  Public
const getSEO = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const typeUpper = entityType.toUpperCase();

    let seo = await prisma.sEO.findUnique({
      where: {
        entityType_entityId: {
          entityType: typeUpper,
          entityId,
        },
      },
    });

    // If not found, return sensible defaults
    if (!seo) {
      if (typeUpper === 'PRODUCT') {
        const prod = await prisma.product.findUnique({ where: { id: entityId } });
        if (prod) {
          seo = {
            entityType: 'PRODUCT',
            entityId: prod.id,
            seoTitle: `${prod.title} | Product List`,
            metaDescription: prod.shortDesc || `Buy ${prod.title} online at Product List.`,
            focusKeyword: prod.title.toLowerCase(),
            slug: `/products/${prod.slug}`,
            canonicalUrl: `https://productlist.com/products/${prod.slug}`,
            robotsIndex: true,
            robotsFollow: true,
          };
        }
      } else if (typeUpper === 'CATEGORY') {
        const cat = await prisma.category.findUnique({ where: { id: entityId } });
        if (cat) {
          seo = {
            entityType: 'CATEGORY',
            entityId: cat.id,
            seoTitle: `${cat.name} Online | Product List`,
            metaDescription: cat.description || `Explore ${cat.name} collection at Product List.`,
            focusKeyword: cat.name.toLowerCase(),
            slug: `/category/${cat.slug}`,
            canonicalUrl: `https://productlist.com/category/${cat.slug}`,
            robotsIndex: true,
            robotsFollow: true,
          };
        }
      }
    }

    return res.status(200).json({ success: true, seo });
  } catch (error) {
    console.error('Error fetching SEO record:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching SEO' });
  }
};

// @desc    Save/Update SEO record
// @route   PUT /api/seo/:entityType/:entityId
// @access  Private/Admin
const saveSEO = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const typeUpper = entityType.toUpperCase();
    const {
      seoTitle,
      metaDescription,
      focusKeyword,
      secondaryKeywords,
      slug,
      canonicalUrl,
      robotsIndex,
      robotsFollow,
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterImage,
    } = req.body;

    const seo = await prisma.sEO.upsert({
      where: {
        entityType_entityId: {
          entityType: typeUpper,
          entityId,
        },
      },
      update: {
        seoTitle,
        metaDescription,
        focusKeyword,
        secondaryKeywords,
        slug,
        canonicalUrl,
        robotsIndex: robotsIndex !== undefined ? Boolean(robotsIndex) : true,
        robotsFollow: robotsFollow !== undefined ? Boolean(robotsFollow) : true,
        ogTitle,
        ogDescription,
        ogImage,
        twitterTitle,
        twitterDescription,
        twitterImage,
      },
      create: {
        entityType: typeUpper,
        entityId,
        seoTitle,
        metaDescription,
        focusKeyword,
        secondaryKeywords,
        slug,
        canonicalUrl,
        robotsIndex: robotsIndex !== undefined ? Boolean(robotsIndex) : true,
        robotsFollow: robotsFollow !== undefined ? Boolean(robotsFollow) : true,
        ogTitle,
        ogDescription,
        ogImage,
        twitterTitle,
        twitterDescription,
        twitterImage,
      },
    });

    return res.status(200).json({ success: true, message: 'SEO settings updated successfully', seo });
  } catch (error) {
    console.error('Error saving SEO record:', error);
    return res.status(500).json({ success: false, message: 'Server error saving SEO settings' });
  }
};

// @desc    Get Global SEO settings
// @route   GET /api/seo/settings
// @access  Public
const getGlobalSEOSettings = async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { group: 'seo' },
    });

    const formatted = {};
    settings.forEach((s) => {
      formatted[s.key] = s.value;
    });

    return res.status(200).json({ success: true, settings: formatted });
  } catch (error) {
    console.error('Error fetching global SEO settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching global SEO settings' });
  }
};

// @desc    Update Global SEO settings
// @route   PUT /api/seo/settings
// @access  Private/Admin
const updateGlobalSEOSettings = async (req, res) => {
  try {
    const payload = req.body;

    for (const [key, value] of Object.entries(payload)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value), group: 'seo' },
        create: { key, value: String(value), group: 'seo' },
      });
    }

    return res.status(200).json({ success: true, message: 'Global SEO settings updated successfully' });
  } catch (error) {
    console.error('Error updating global SEO settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating global SEO settings' });
  }
};

// @desc    Generate XML Sitemap dynamically
// @route   GET /sitemap.xml or /api/seo/sitemap.xml
// @access  Public
const generateSitemap = async (req, res) => {
  try {
    const baseSetting = await prisma.siteSetting.findUnique({
      where: { key: 'seo_canonical_base_url' },
    });
    const baseUrl = (baseSetting?.value || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');

    const [products, categories, offers, seoRecords] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        select: { id: true, slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: { id: true, slug: true, updatedAt: true },
      }),
      prisma.offer.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true },
      }),
      prisma.sEO.findMany({
        where: { robotsIndex: false },
        select: { entityType: true, entityId: true },
      }),
    ]);

    // Create set of noindex entity IDs
    const noindexSet = new Set(seoRecords.map((s) => `${s.entityType}_${s.entityId}`));

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    const addUrl = (loc, lastmod, changefreq, priority) => {
      xml += `  <url>\n`;
      xml += `    <loc>${loc}</loc>\n`;
      if (lastmod) xml += `    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${changefreq}</changefreq>\n`;
      xml += `    <priority>${priority}</priority>\n`;
      xml += `  </url>\n`;
    };

    // Static core pages
    const today = new Date().toISOString().split('T')[0];
    if (!noindexSet.has('PAGE_home')) addUrl(`${baseUrl}/`, today, 'daily', '1.0');
    if (!noindexSet.has('PAGE_products')) addUrl(`${baseUrl}/products`, today, 'daily', '0.9');
    if (!noindexSet.has('PAGE_categories')) addUrl(`${baseUrl}/categories`, today, 'weekly', '0.8');
    if (!noindexSet.has('PAGE_offers')) addUrl(`${baseUrl}/offers`, today, 'daily', '0.8');
    if (!noindexSet.has('PAGE_about')) addUrl(`${baseUrl}/about`, today, 'monthly', '0.6');
    if (!noindexSet.has('PAGE_contact')) addUrl(`${baseUrl}/contact`, today, 'monthly', '0.6');

    // Products
    products.forEach((p) => {
      if (!noindexSet.has(`PRODUCT_${p.id}`)) {
        addUrl(`${baseUrl}/products/${p.slug}`, p.updatedAt, 'daily', '0.9');
      }
    });

    // Categories
    categories.forEach((c) => {
      if (!noindexSet.has(`CATEGORY_${c.id}`)) {
        addUrl(`${baseUrl}/products?category=${c.slug}`, c.updatedAt, 'weekly', '0.8');
      }
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    return res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return res.status(500).send('Error generating sitemap');
  }
};

// @desc    Serve robots.txt dynamically
// @route   GET /robots.txt or /api/seo/robots.txt
// @access  Public
const generateRobotsTxt = async (req, res) => {
  try {
    const baseSetting = await prisma.siteSetting.findUnique({
      where: { key: 'seo_canonical_base_url' },
    });
    const baseUrl = (baseSetting?.value || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');

    const robotsTxt = `# robots.txt for PRODUCT LIST Garments & Fashion Showcase
User-agent: *
Allow: /
Allow: /products
Allow: /products/*
Allow: /categories
Allow: /offers
Allow: /about
Allow: /contact
Allow: /uploads/

# Disallow Private & Admin Endpoints
Disallow: /admin
Disallow: /admin/*
Disallow: /api/auth/
Disallow: /api/private/

# Sitemap Declaration
Sitemap: ${baseUrl}/sitemap.xml
`;

    res.header('Content-Type', 'text/plain');
    return res.status(200).send(robotsTxt);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    return res.status(500).send('User-agent: *\nDisallow: /admin');
  }
};

module.exports = {
  getSEODashboard,
  getSEO,
  saveSEO,
  getGlobalSEOSettings,
  updateGlobalSEOSettings,
  generateSitemap,
  generateRobotsTxt,
};
