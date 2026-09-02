const prisma = require('../config/db');
const slugify = require('slugify');

// Generate unique slug
const createUniqueSlug = async (title, currentId = null) => {
  let baseSlug = slugify(title, { lower: true, strict: true }) || 'product';
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || (currentId && existing.id === currentId)) {
      return slug;
    }
    slug = `${baseSlug}-${count}`;
    count++;
  }
};

// @desc    Get all products (with search, garment filters, sorting, pagination)
// @route   GET /api/products
// @access  Public / Admin
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      collection,
      gender,
      fit,
      fabric,
      minPrice,
      maxPrice,
      sort,
      isFeatured,
      isBestseller,
      isNewArrival,
      isActive,
      page = 1,
      limit = 20,
    } = req.query;

    const where = {};

    // Active status filter
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    } else if (!req.query.all) {
      where.isActive = true;
    }

    if (isFeatured === 'true') where.isFeatured = true;
    if (isBestseller === 'true') where.isBestseller = true;
    if (isNewArrival === 'true') where.isNewArrival = true;

    // Search query across title, SKU, brand, fabric, short description
    if (search && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { sku: { contains: q } },
        { brand: { contains: q } },
        { shortDesc: { contains: q } },
        { fabric: { contains: q } },
        { collection: { contains: q } },
      ];
    }

    // Category filter by ID or slug
    if (category) {
      if (category.length === 36 && category.includes('-')) {
        where.categoryId = category;
      } else {
        const foundCat = await prisma.category.findUnique({ where: { slug: category } });
        if (foundCat) {
          where.categoryId = foundCat.id;
        } else {
          where.categoryId = category;
        }
      }
    }

    if (brand) where.brand = brand;
    if (collection) where.collection = { contains: collection };
    if (gender) where.gender = gender;
    if (fit) where.fit = { contains: fit };
    if (fabric) where.fabric = { contains: fabric };

    // Price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Sorting
    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'name_asc') orderBy = { title: 'asc' };
    else if (sort === 'name_desc') orderBy = { title: 'desc' };
    else if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    else if (sort === 'featured') orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
    else if (sort === 'bestseller') orderBy = [{ isBestseller: 'desc' }, { createdAt: 'desc' }];

    const pageNum = parseInt(page);
    const take = parseInt(limit);
    const skip = (pageNum - 1) * take;

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { displayOrder: 'asc' } },
        },
        orderBy,
        skip,
        take,
      }),
    ]);

    // Attach SEO summary for admin queries
    const productIds = products.map((p) => p.id);
    const seoRecords = await prisma.sEO.findMany({
      where: { entityType: 'PRODUCT', entityId: { in: productIds } },
    });
    const seoMap = new Map(seoRecords.map((s) => [s.entityId, s]));

    const formatted = products.map((p) => {
      let parsedSizes = [];
      let parsedColors = [];
      try {
        if (p.sizes) parsedSizes = JSON.parse(p.sizes);
      } catch (e) {}
      try {
        if (p.colors) parsedColors = JSON.parse(p.colors);
      } catch (e) {}

      return {
        ...p,
        sizesList: parsedSizes,
        colorsList: parsedColors,
        seo: seoMap.get(p.id) || null,
      };
    });

    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / take) || 1,
      count: formatted.length,
      products: formatted,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
};

// @desc    Get single product by slug (with full garment details & SEO)
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch SEO record for this product
    const seo = await prisma.sEO.findUnique({
      where: {
        entityType_entityId: {
          entityType: 'PRODUCT',
          entityId: product.id,
        },
      },
    });

    // Parse JSON specs, features, sizes, colors
    let parsedSpecs = {};
    let parsedFeatures = [];
    let parsedSizes = [];
    let parsedColors = [];

    try {
      if (typeof product.specifications === 'string') parsedSpecs = JSON.parse(product.specifications);
      else if (typeof product.specifications === 'object') parsedSpecs = product.specifications || {};
    } catch (e) {}

    try {
      if (typeof product.features === 'string') parsedFeatures = JSON.parse(product.features);
      else if (Array.isArray(product.features)) parsedFeatures = product.features || [];
    } catch (e) {}

    try {
      if (product.sizes) parsedSizes = JSON.parse(product.sizes);
    } catch (e) {}

    try {
      if (product.colors) parsedColors = JSON.parse(product.colors);
    } catch (e) {}

    // Get related products in same category
    let related = [];
    if (product.categoryId) {
      related = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          isActive: true,
        },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { displayOrder: 'asc' } },
        },
        take: 4,
      });
    }

    return res.status(200).json({
      success: true,
      product: {
        ...product,
        specifications: parsedSpecs,
        features: parsedFeatures,
        sizesList: parsedSizes,
        colorsList: parsedColors,
        seo: seo || {
          seoTitle: `${product.title} | Product List`,
          metaDescription: product.shortDesc || `Shop ${product.title} at Product List.`,
          focusKeyword: product.title.toLowerCase(),
          slug: `/products/${product.slug}`,
          canonicalUrl: `https://productlist.com/products/${product.slug}`,
          robotsIndex: true,
          robotsFollow: true,
          ogTitle: product.title,
          ogDescription: product.shortDesc || product.title,
          ogImage: product.images?.[0]?.url || '',
        },
      },
      related,
    });
  } catch (error) {
    console.error('Error getting product by slug:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching product' });
  }
};

// @desc    Create new garment product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      title,
      slug: customSlug,
      sku,
      brand,
      shortDesc,
      fullDesc,
      price,
      salePrice,
      discount,
      currency,
      stock,
      stockStatus,
      isFeatured,
      isBestseller,
      isNewArrival,
      isActive,
      categoryId,
      collection,
      gender,
      fabric,
      material,
      fit,
      pattern,
      season,
      occasion,
      careInstructions,
      sizes,
      colors,
      hoverImage,
      specifications,
      features,
      images,
      seo,
    } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({ success: false, message: 'Product title and price are required' });
    }

    const slug = customSlug ? await createUniqueSlug(customSlug) : await createUniqueSlug(title);

    let calculatedDiscount = discount;
    if (salePrice && price && (!discount || discount === 0)) {
      calculatedDiscount = parseFloat((((price - salePrice) / price) * 100).toFixed(1));
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
        brand: brand || 'PRODUCT LIST',
        shortDesc: shortDesc || null,
        fullDesc: fullDesc || null,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        discount: calculatedDiscount ? parseFloat(calculatedDiscount) : null,
        currency: currency || 'USD',
        stock: stock !== undefined ? parseInt(stock) : 10,
        stockStatus: stockStatus || (parseInt(stock) > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK'),
        isFeatured: Boolean(isFeatured),
        isBestseller: Boolean(isBestseller),
        isNewArrival: Boolean(isNewArrival),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        categoryId: categoryId || null,
        collection: collection || null,
        gender: gender || 'UNISEX',
        fabric: fabric || null,
        material: material || null,
        fit: fit || null,
        pattern: pattern || null,
        season: season || null,
        occasion: occasion || null,
        careInstructions: careInstructions || null,
        sizes: typeof sizes === 'object' ? JSON.stringify(sizes) : sizes,
        colors: typeof colors === 'object' ? JSON.stringify(colors) : colors,
        hoverImage: hoverImage || null,
        specifications: typeof specifications === 'object' ? JSON.stringify(specifications) : specifications,
        features: typeof features === 'object' ? JSON.stringify(features) : features,
      },
    });

    // Handle images
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: typeof img === 'string' ? img : img.url,
            altText: typeof img === 'object' && img.altText ? img.altText : `${title} image`,
            title: typeof img === 'object' && img.title ? img.title : null,
            caption: typeof img === 'object' && img.caption ? img.caption : null,
            isThumbnail: typeof img === 'object' ? Boolean(img.isThumbnail) : i === 0,
            displayOrder: typeof img === 'object' && img.displayOrder !== undefined ? img.displayOrder : i + 1,
          },
        });
      }
    }

    // Handle SEO
    if (seo && typeof seo === 'object') {
      await prisma.sEO.create({
        data: {
          entityType: 'PRODUCT',
          entityId: product.id,
          seoTitle: seo.seoTitle || `${title} | Product List`,
          metaDescription: seo.metaDescription || shortDesc,
          focusKeyword: seo.focusKeyword || title.toLowerCase(),
          secondaryKeywords: seo.secondaryKeywords || null,
          slug: seo.slug || `/products/${product.slug}`,
          canonicalUrl: seo.canonicalUrl || `https://productlist.com/products/${product.slug}`,
          robotsIndex: seo.robotsIndex !== undefined ? Boolean(seo.robotsIndex) : true,
          robotsFollow: seo.robotsFollow !== undefined ? Boolean(seo.robotsFollow) : true,
          ogTitle: seo.ogTitle || title,
          ogDescription: seo.ogDescription || shortDesc,
          ogImage: seo.ogImage || (images?.[0]?.url || ''),
          twitterTitle: seo.twitterTitle || title,
          twitterDescription: seo.twitterDescription || shortDesc,
          twitterImage: seo.twitterImage || (images?.[0]?.url || ''),
        },
      });
    }

    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Garment product created successfully',
      product: completeProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error creating product' });
  }
};

// @desc    Update garment product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug: customSlug,
      sku,
      brand,
      shortDesc,
      fullDesc,
      price,
      salePrice,
      discount,
      currency,
      stock,
      stockStatus,
      isFeatured,
      isBestseller,
      isNewArrival,
      isActive,
      categoryId,
      collection,
      gender,
      fabric,
      material,
      fit,
      pattern,
      season,
      occasion,
      careInstructions,
      sizes,
      colors,
      hoverImage,
      specifications,
      features,
      images,
      seo,
    } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let slug = existing.slug;
    if (customSlug && customSlug !== existing.slug) {
      slug = await createUniqueSlug(customSlug, id);
    } else if (title && title !== existing.title && !customSlug) {
      slug = await createUniqueSlug(title, id);
    }

    let calculatedDiscount = discount;
    if (salePrice && price && (!discount || discount === 0)) {
      calculatedDiscount = parseFloat((((price - salePrice) / price) * 100).toFixed(1));
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        slug,
        sku: sku !== undefined ? sku : existing.sku,
        brand: brand !== undefined ? brand : existing.brand,
        shortDesc: shortDesc !== undefined ? shortDesc : existing.shortDesc,
        fullDesc: fullDesc !== undefined ? fullDesc : existing.fullDesc,
        price: price !== undefined ? parseFloat(price) : existing.price,
        salePrice: salePrice !== undefined ? (salePrice ? parseFloat(salePrice) : null) : existing.salePrice,
        discount: calculatedDiscount !== undefined ? (calculatedDiscount ? parseFloat(calculatedDiscount) : null) : existing.discount,
        currency: currency !== undefined ? currency : existing.currency,
        stock: stock !== undefined ? parseInt(stock) : existing.stock,
        stockStatus: stockStatus !== undefined ? stockStatus : existing.stockStatus,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        isBestseller: isBestseller !== undefined ? Boolean(isBestseller) : existing.isBestseller,
        isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : existing.isNewArrival,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        categoryId: categoryId !== undefined ? (categoryId || null) : existing.categoryId,
        collection: collection !== undefined ? collection : existing.collection,
        gender: gender !== undefined ? gender : existing.gender,
        fabric: fabric !== undefined ? fabric : existing.fabric,
        material: material !== undefined ? material : existing.material,
        fit: fit !== undefined ? fit : existing.fit,
        pattern: pattern !== undefined ? pattern : existing.pattern,
        season: season !== undefined ? season : existing.season,
        occasion: occasion !== undefined ? occasion : existing.occasion,
        careInstructions: careInstructions !== undefined ? careInstructions : existing.careInstructions,
        sizes: typeof sizes === 'object' ? JSON.stringify(sizes) : (sizes !== undefined ? sizes : existing.sizes),
        colors: typeof colors === 'object' ? JSON.stringify(colors) : (colors !== undefined ? colors : existing.colors),
        hoverImage: hoverImage !== undefined ? hoverImage : existing.hoverImage,
        specifications: typeof specifications === 'object' ? JSON.stringify(specifications) : (specifications !== undefined ? specifications : existing.specifications),
        features: typeof features === 'object' ? JSON.stringify(features) : (features !== undefined ? features : existing.features),
      },
    });

    // Update images if provided
    if (Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await prisma.productImage.create({
          data: {
            productId: id,
            url: typeof img === 'string' ? img : img.url,
            altText: typeof img === 'object' && img.altText ? img.altText : `${updatedProduct.title} image`,
            title: typeof img === 'object' && img.title ? img.title : null,
            caption: typeof img === 'object' && img.caption ? img.caption : null,
            isThumbnail: typeof img === 'object' ? Boolean(img.isThumbnail) : i === 0,
            displayOrder: typeof img === 'object' && img.displayOrder !== undefined ? img.displayOrder : i + 1,
          },
        });
      }
    }

    // Update SEO if provided
    if (seo && typeof seo === 'object') {
      await prisma.sEO.upsert({
        where: {
          entityType_entityId: {
            entityType: 'PRODUCT',
            entityId: id,
          },
        },
        update: {
          seoTitle: seo.seoTitle,
          metaDescription: seo.metaDescription,
          focusKeyword: seo.focusKeyword,
          secondaryKeywords: seo.secondaryKeywords,
          slug: seo.slug || `/products/${slug}`,
          canonicalUrl: seo.canonicalUrl || `https://productlist.com/products/${slug}`,
          robotsIndex: seo.robotsIndex !== undefined ? Boolean(seo.robotsIndex) : true,
          robotsFollow: seo.robotsFollow !== undefined ? Boolean(seo.robotsFollow) : true,
          ogTitle: seo.ogTitle,
          ogDescription: seo.ogDescription,
          ogImage: seo.ogImage,
          twitterTitle: seo.twitterTitle,
          twitterDescription: seo.twitterDescription,
          twitterImage: seo.twitterImage,
        },
        create: {
          entityType: 'PRODUCT',
          entityId: id,
          seoTitle: seo.seoTitle || `${updatedProduct.title} | Product List`,
          metaDescription: seo.metaDescription || updatedProduct.shortDesc,
          focusKeyword: seo.focusKeyword || updatedProduct.title.toLowerCase(),
          secondaryKeywords: seo.secondaryKeywords,
          slug: seo.slug || `/products/${slug}`,
          canonicalUrl: seo.canonicalUrl || `https://productlist.com/products/${slug}`,
          robotsIndex: seo.robotsIndex !== undefined ? Boolean(seo.robotsIndex) : true,
          robotsFollow: seo.robotsFollow !== undefined ? Boolean(seo.robotsFollow) : true,
          ogTitle: seo.ogTitle,
          ogDescription: seo.ogDescription,
          ogImage: seo.ogImage,
          twitterTitle: seo.twitterTitle,
          twitterDescription: seo.twitterDescription,
          twitterImage: seo.twitterImage,
        },
      });
    }

    const completeProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
      },
    });

    const updatedSEO = await prisma.sEO.findUnique({
      where: {
        entityType_entityId: {
          entityType: 'PRODUCT',
          entityId: id,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: {
        ...completeProduct,
        seo: updatedSEO,
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error updating product' });
  }
};

// @desc    Duplicate product
// @route   POST /api/products/:id/duplicate
// @access  Private/Admin
const duplicateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const source = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!source) {
      return res.status(404).json({ success: false, message: 'Source product not found' });
    }

    const newTitle = `${source.title} (Copy)`;
    const newSlug = await createUniqueSlug(newTitle);
    const newSku = `${source.sku ? source.sku : 'SKU'}-COPY-${Date.now().toString().slice(-4)}`;

    const duplicated = await prisma.product.create({
      data: {
        title: newTitle,
        slug: newSlug,
        sku: newSku,
        brand: source.brand,
        shortDesc: source.shortDesc,
        fullDesc: source.fullDesc,
        price: source.price,
        salePrice: source.salePrice,
        discount: source.discount,
        currency: source.currency,
        stock: source.stock,
        stockStatus: source.stockStatus,
        isFeatured: false,
        isBestseller: false,
        isNewArrival: true,
        isActive: false, // Created as draft
        categoryId: source.categoryId,
        collection: source.collection,
        gender: source.gender,
        fabric: source.fabric,
        material: source.material,
        fit: source.fit,
        pattern: source.pattern,
        season: source.season,
        occasion: source.occasion,
        careInstructions: source.careInstructions,
        sizes: source.sizes,
        colors: source.colors,
        hoverImage: source.hoverImage,
        specifications: source.specifications,
        features: source.features,
      },
    });

    // Copy images
    if (source.images && source.images.length > 0) {
      for (const img of source.images) {
        await prisma.productImage.create({
          data: {
            productId: duplicated.id,
            url: img.url,
            altText: img.altText,
            title: img.title,
            caption: img.caption,
            isThumbnail: img.isThumbnail,
            displayOrder: img.displayOrder,
          },
        });
      }
    }

    const complete = await prisma.product.findUnique({
      where: { id: duplicated.id },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Product duplicated successfully as draft',
      product: complete,
    });
  } catch (error) {
    console.error('Error duplicating product:', error);
    return res.status(500).json({ success: false, message: 'Server error duplicating product' });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await prisma.sEO.deleteMany({
      where: { entityType: 'PRODUCT', entityId: id },
    });

    await prisma.product.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting product' });
  }
};

// @desc    Toggle product field status (active, featured, bestseller, newArrival)
// @route   PATCH /api/products/:id/toggle
// @access  Private/Admin
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { field } = req.body;

    const validFields = ['isActive', 'isFeatured', 'isBestseller', 'isNewArrival'];
    if (!validFields.includes(field)) {
      return res.status(400).json({ success: false, message: 'Invalid toggle field' });
    }

    const current = await prisma.product.findUnique({ where: { id } });
    if (!current) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        [field]: !current[field],
      },
    });

    return res.status(200).json({
      success: true,
      message: `${field} updated successfully`,
      product: updated,
    });
  } catch (error) {
    console.error('Error toggling product status:', error);
    return res.status(500).json({ success: false, message: 'Server error updating status' });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  duplicateProduct,
  deleteProduct,
  toggleStatus,
};
