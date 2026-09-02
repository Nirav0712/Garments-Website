const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for GARMENTS / FASHION SHOWCASE...');

  // 1. Clean existing records
  await prisma.sEO.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.media.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.navigationItem.deleteMany();
  await prisma.pageContent.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.heroSlide.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.size.deleteMany();
  await prisma.color.deleteMany();
  await prisma.user.deleteMany();

  // 2. Admin User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@productlist.com',
      password: hashedPassword,
      name: 'Fashion Director',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 3. Master Sizes
  const sizesData = [
    { name: 'XS', code: 'XS', displayOrder: 1, isActive: true },
    { name: 'S', code: 'S', displayOrder: 2, isActive: true },
    { name: 'M', code: 'M', displayOrder: 3, isActive: true },
    { name: 'L', code: 'L', displayOrder: 4, isActive: true },
    { name: 'XL', code: 'XL', displayOrder: 5, isActive: true },
    { name: 'XXL', code: 'XXL', displayOrder: 6, isActive: true },
    { name: '3XL', code: '3XL', displayOrder: 7, isActive: true },
  ];
  for (const s of sizesData) {
    await prisma.size.create({ data: s });
  }
  console.log('✅ Master Sizes seeded');

  // 4. Master Colors
  const colorsData = [
    { name: 'Midnight Black', hexCode: '#111111', displayOrder: 1, isActive: true },
    { name: 'Optical White', hexCode: '#F8FAFC', displayOrder: 2, isActive: true },
    { name: 'Heather Charcoal', hexCode: '#374151', displayOrder: 3, isActive: true },
    { name: 'Sage Olive', hexCode: '#4B5320', displayOrder: 4, isActive: true },
    { name: 'Royal Navy', hexCode: '#1E3A8A', displayOrder: 5, isActive: true },
    { name: 'Crimson Burgundy', hexCode: '#881337', displayOrder: 6, isActive: true },
    { name: 'Sandstone Beige', hexCode: '#D4B996', displayOrder: 7, isActive: true },
    { name: 'Terracotta Rust', hexCode: '#C2410C', displayOrder: 8, isActive: true },
  ];
  for (const c of colorsData) {
    await prisma.color.create({ data: c });
  }
  console.log('✅ Master Colors seeded');

  // 5. Fashion Collections
  const collectionsData = [
    {
      name: 'Atelier Summer 2026',
      slug: 'atelier-summer-2026',
      description: 'Airy linen silhouettes, breezy supima cottons, and relaxed Mediterranean tailoring.',
      badge: 'SPRING / SUMMER DROP',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Monochrome Essentials',
      slug: 'monochrome-essentials',
      description: 'Curated capsule wardrobe foundational pieces in stark blacks, crisp whites, and deep charcoals.',
      badge: 'TIMELESS CAPSULE',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80',
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'Urban Streetwear Drop',
      slug: 'urban-streetwear',
      description: 'Heavyweight boxy cuts, dropped shoulders, and architectural streetwear drape.',
      badge: 'LIMITED EDITION',
      image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1200&auto=format&fit=crop&q=80',
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'Royal Heritage Ethnic',
      slug: 'royal-heritage-ethnic',
      description: 'Handcrafted artisan kurtas, jacquard bandhgalas, and festive luxury weaves.',
      badge: 'FESTIVE EDIT',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1200&auto=format&fit=crop&q=80',
      displayOrder: 4,
      isActive: true,
    },
  ];
  for (const col of collectionsData) {
    await prisma.collection.create({ data: col });
  }
  console.log('✅ Collections seeded');

  // 6. Garment Categories (8 Categories)
  const categoriesData = [
    {
      name: 'T-Shirts & Polos',
      slug: 't-shirts-polos',
      description: 'Heavyweight 240 GSM organic Supima cotton oversized tees and relaxed pique polos.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Hoodies & Sweatshirts',
      slug: 'hoodies-sweatshirts',
      description: '450 GSM French terry fleece hoodies, brushed crewnecks, and minimalist zip-ups.',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'Shirts & Casuals',
      slug: 'shirts',
      description: 'Tailored European linen, crisp Oxford button-downs, and relaxed camp-collar resort shirts.',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'Trousers & Denim',
      slug: 'denim-trousers',
      description: 'Pleated wide-leg trousers, Japanese selvedge denim, and versatile stretch chinos.',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
      displayOrder: 4,
      isActive: true,
    },
    {
      name: 'Jackets & Outerwear',
      slug: 'jackets-outerwear',
      description: 'Structured wool overcoats, weatherproof bomber jackets, and Harrington overshirts.',
      image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&auto=format&fit=crop&q=80',
      displayOrder: 5,
      isActive: true,
    },
    {
      name: 'Ethnic Wear & Kurtas',
      slug: 'ethnic-kurtas',
      description: 'Modern mandarin collar kurtas, silk-linen blends, and festive bandi jackets.',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
      displayOrder: 6,
      isActive: true,
    },
    {
      name: 'Dresses & Tops',
      slug: 'dresses-tops',
      description: 'Fluid tiered midi dresses, structured poplin blouses, and minimalist linen sets.',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
      displayOrder: 7,
      isActive: true,
    },
    {
      name: 'Knitwear & Sweaters',
      slug: 'knitwear-sweaters',
      description: 'Merino wool cardigans, ribbed turtle-necks, and cashmere blend pullovers.',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80',
      displayOrder: 8,
      isActive: true,
    },
  ];

  const catMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    catMap[cat.slug] = created.id;

    // Seed Category SEO
    await prisma.sEO.create({
      data: {
        entityType: 'CATEGORY',
        entityId: created.id,
        seoTitle: `${cat.name} Online | Luxury Fashion Collection | Product List`,
        metaDescription: `Discover premium ${cat.name.toLowerCase()} at Product List. Handcrafted with sustainable organic fabrics, modern fits, and tailored finishes. Enjoy fast worldwide shipping.`,
        focusKeyword: cat.name.toLowerCase(),
        secondaryKeywords: `${cat.name.toLowerCase()}, garments online, luxury clothing, designer wear`,
        slug: `/category/${cat.slug}`,
        canonicalUrl: `https://productlist.com/category/${cat.slug}`,
        robotsIndex: true,
        robotsFollow: true,
        ogTitle: `${cat.name} - Luxury Garments Collection`,
        ogDescription: `Explore curated ${cat.name.toLowerCase()} designed for modern elegance and superior comfort.`,
        ogImage: cat.image,
      },
    });
  }
  console.log('✅ Categories & Category SEO seeded');

  // 7. Hero Slides (EXACTLY 6 Dynamic Fashion Slides)
  const heroSlidesData = [
    {
      title: 'NEW SEASON ATELIER 2026',
      subtitle: 'ORGANIC SUPIMA COTTONS',
      badge: 'SPRING DROP',
      description: 'Designed for effortless everyday style. Meticulously tailored in 240 GSM organic Supima cotton with relaxed silhouettes.',
      buttonText: 'Shop New Arrivals',
      buttonUrl: '/products?isNewArrival=true',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=85',
      overlayOpacity: 0.4,
      textPosition: 'left',
      displayOrder: 1,
      isActive: true,
    },
    {
      title: 'MINIMALIST LUXURY HOODIES',
      subtitle: '450 GSM HEAVYWEIGHT FRENCH TERRY',
      badge: 'ICONIC SILHOUETTES',
      description: 'Structured drape, double-layered architectural hood, and zero linting. The definitive capsule streetwear layer.',
      buttonText: 'Explore Hoodies',
      buttonUrl: '/products?category=hoodies-sweatshirts',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1920&auto=format&fit=crop&q=85',
      overlayOpacity: 0.45,
      textPosition: 'left',
      displayOrder: 2,
      isActive: true,
    },
    {
      title: 'EUROPEAN LINEN & CRISP OXFORD',
      subtitle: 'BESPOKE RESORT & SMART CASUAL',
      badge: 'BREATHABLE LUXURY',
      description: 'Crafted from 100% Normandy flax linen and double-twisted Egyptian Giza cotton for all-day breathability and poise.',
      buttonText: 'Discover Shirts',
      buttonUrl: '/products?category=shirts',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1920&auto=format&fit=crop&q=85',
      overlayOpacity: 0.45,
      textPosition: 'center',
      displayOrder: 3,
      isActive: true,
    },
    {
      title: 'CONTEMPORARY ETHNIC ATELIER',
      subtitle: 'HANDLOOM SILK-COTTON KURTAS',
      badge: 'FESTIVE LUXE',
      description: 'Rich artisanal weaves paired with clean mandarin collars and modern tailored trousers. Elevate ceremonial elegance.',
      buttonText: 'Shop Ethnic Edit',
      buttonUrl: '/products?category=ethnic-kurtas',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1920&auto=format&fit=crop&q=85',
      overlayOpacity: 0.5,
      textPosition: 'left',
      displayOrder: 4,
      isActive: true,
    },
    {
      title: 'TAILORED TROUSERS & SELVEDGE',
      subtitle: 'RELAXED PLEATS & JAPANESE DENIM',
      badge: 'PERFECT DRAPE',
      description: 'Engineered with double front pleats and heavyweight 14oz Japanese selvedge denim for timeless everyday rotation.',
      buttonText: 'View Bottom Wear',
      buttonUrl: '/products?category=denim-trousers',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1920&auto=format&fit=crop&q=85',
      overlayOpacity: 0.45,
      textPosition: 'right',
      displayOrder: 5,
      isActive: true,
    },
    {
      title: 'SEASONAL PRIVATE SALE',
      subtitle: 'UP TO 40% OFF CURATED WARDROBE ESSENTIALS',
      badge: 'LIMITED TIME ALLOCATION',
      description: 'Access exclusive introductory pricing on signature oversized tees, merino knits, and tailored overcoats.',
      buttonText: 'Shop Private Sale',
      buttonUrl: '/offers',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&auto=format&fit=crop&q=85',
      overlayOpacity: 0.55,
      textPosition: 'center',
      displayOrder: 6,
      isActive: true,
    },
  ];

  for (const slide of heroSlidesData) {
    await prisma.heroSlide.create({ data: slide });
  }
  console.log('✅ 6 Fashion Hero Slides seeded');

  // 8. Garments Products (10 Luxury Products across Categories)
  const productsData = [
    {
      title: 'Heavyweight Oversized Organic Cotton T-Shirt',
      slug: 'heavyweight-oversized-organic-cotton-tshirt',
      sku: 'PL-TSH-240-BLK',
      brand: 'PRODUCT LIST ATELIER',
      categorySlug: 't-shirts-polos',
      collection: 'Monochrome Essentials',
      gender: 'UNISEX',
      fabric: '100% Organic Combed Supima Cotton (240 GSM)',
      material: 'Organic Cotton',
      fit: 'Oversized Boxy Fit',
      pattern: 'Solid Matte',
      season: 'All Season',
      occasion: 'Casual / Streetwear',
      careInstructions: 'Machine wash cold inside out with like colors. Line dry in shade. Do not bleach. Cool iron if needed.',
      shortDesc: 'Ultra-heavyweight 240 GSM organic Supima cotton t-shirt with signature dropped shoulders and reinforced collar.',
      fullDesc: 'Engineered for exceptional drape and enduring softness, our Heavyweight Oversized Tee is crafted from 100% certified organic Supima cotton knitted to a dense 240 GSM weight. Features pre-shrunk construction, ribbed 1.25-inch crewneck collar that maintains shape over hundreds of wears, and a relaxed boxy cut tailored to perfection.',
      price: 68.0,
      salePrice: 54.0,
      discount: 20.5,
      stock: 45,
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isBestseller: true,
      isNewArrival: true,
      isActive: true,
      hoverImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=80',
      sizes: [
        { name: 'XS', inStock: true },
        { name: 'S', inStock: true },
        { name: 'M', inStock: true },
        { name: 'L', inStock: true },
        { name: 'XL', inStock: true },
        { name: 'XXL', inStock: false },
      ],
      colors: [
        { name: 'Midnight Black', hex: '#111111', inStock: true },
        { name: 'Optical White', hex: '#F8FAFC', inStock: true },
        { name: 'Sage Olive', hex: '#4B5320', inStock: true },
      ],
      specifications: {
        'Fabric Composition': '100% Organic Supima Cotton',
        'Fabric Weight': '240 GSM (Heavyweight)',
        'Weave Type': 'Single Jersey Combed',
        'Collar': '1.25" Heavy Ribbed Crewneck',
        'Stitching': 'Twin Needle Reinforced Hem & Sleeves',
        'Pre-shrunk': 'Yes (<2% shrinkage)',
        'Country of Origin': 'Portugal / Ethical Atelier',
      },
      features: [
        'Crafted from 100% long-staple organic Supima cotton for pill resistance',
        'Dense 240 GSM weight provides structured silhouette without transparency',
        'Reinforced ribbed collar maintains shape without stretching',
        'Dropped shoulder cut tailored for flattering streetwear drape',
        'Eco-friendly reactive dye process prevents fading wash after wash',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80',
          altText: 'Black oversized organic cotton t-shirt for men front view',
          title: 'Heavyweight Oversized T-Shirt in Midnight Black',
          caption: 'Model is 6\'1" wearing size Medium',
          isThumbnail: true,
          displayOrder: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=80',
          altText: 'Heavyweight organic cotton t-shirt fabric texture and collar detail',
          title: 'Fabric Texture Detail',
          caption: '240 GSM dense knit detail',
          isThumbnail: false,
          displayOrder: 2,
        },
        {
          url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80',
          altText: 'White oversized cotton t-shirt lifestyle outfit',
          title: 'Oversized Cotton Tee in Optical White',
          caption: 'Styled with pleated trousers',
          isThumbnail: false,
          displayOrder: 3,
        },
      ],
      seo: {
        seoTitle: 'Premium Cotton Oversized T-Shirt | Product List',
        metaDescription: 'Shop premium 240 GSM organic cotton oversized t-shirts from Product List. Explore comfortable, durable, and stylish unisex fashion in multiple sizes and colors.',
        focusKeyword: 'oversized cotton t-shirt',
        secondaryKeywords: 'heavyweight t-shirt, organic supima cotton tee, luxury streetwear t-shirt, men oversized t-shirt',
        slug: '/products/heavyweight-oversized-organic-cotton-tshirt',
        canonicalUrl: 'https://productlist.com/products/heavyweight-oversized-organic-cotton-tshirt',
        robotsIndex: true,
        robotsFollow: true,
        ogTitle: 'Heavyweight Oversized Organic Cotton T-Shirt',
        ogDescription: '100% Organic Supima Cotton 240 GSM. Designed for luxury drape and durability.',
        ogImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80',
      },
    },
    {
      title: 'Architectural French Terry Pullover Hoodie',
      slug: 'architectural-french-terry-pullover-hoodie',
      sku: 'PL-HD-450-CHR',
      brand: 'PRODUCT LIST ATELIER',
      categorySlug: 'hoodies-sweatshirts',
      collection: 'Urban Streetwear',
      gender: 'UNISEX',
      fabric: '100% Combed Cotton French Terry (450 GSM)',
      material: 'Cotton Terry Fleece',
      fit: 'Relaxed Drop Shoulder',
      pattern: 'Solid Matte',
      season: 'Autumn / Winter / Spring',
      occasion: 'Casual / Travel / Streetwear',
      careInstructions: 'Machine wash cold. Do not tumble dry. Reshape while damp and dry flat in shade. Iron on reverse.',
      shortDesc: 'Heavyweight 450 GSM unbrushed French terry hoodie featuring double-layer structured hood and clean kangaroo pocket.',
      fullDesc: 'Our definitive luxury hoodie is constructed from dense 450 GSM loopback French terry. Designed without drawstrings for a streamlined sculptural aesthetic, it features a generous double-walled hood that stands up perfectly, deep ribbed side gussets for mobility, and durable bar-tacked pockets.',
      price: 135.0,
      salePrice: 115.0,
      discount: 14.8,
      stock: 28,
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      isActive: true,
      hoverImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1000&auto=format&fit=crop&q=80',
      sizes: [
        { name: 'S', inStock: true },
        { name: 'M', inStock: true },
        { name: 'L', inStock: true },
        { name: 'XL', inStock: true },
        { name: 'XXL', inStock: true },
      ],
      colors: [
        { name: 'Heather Charcoal', hex: '#374151', inStock: true },
        { name: 'Midnight Black', hex: '#111111', inStock: true },
        { name: 'Sandstone Beige', hex: '#D4B996', inStock: true },
      ],
      specifications: {
        'Fabric Weight': '450 GSM Heavy French Terry',
        'Hood Design': 'Double-layer seamless crossover hood',
        'Ribbing': '2x2 heavyweight elastane rib at hem and cuffs',
        'Gusset': 'Ribbed ergonomic underarm panels',
        'Hardware': 'Minimalist stringless design',
      },
      features: [
        'Dense 450 GSM cotton terry locks in warmth while staying breathable',
        'Stringless crossover hood maintains upright sculptural shape',
        'Ergonomic side rib panels ensure freedom of motion',
        'Pre-washed and shrink-tested for lasting silhouette fidelity',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&auto=format&fit=crop&q=80',
          altText: 'Heather charcoal heavyweight french terry pullover hoodie',
          title: 'French Terry Pullover Hoodie in Charcoal',
          caption: '450 GSM Heavyweight Loopback',
          isThumbnail: true,
          displayOrder: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1000&auto=format&fit=crop&q=80',
          altText: 'Side angle of luxury minimalist hoodie with structured hood',
          title: 'Structured Hood Profile',
          caption: 'Double-walled hood construction',
          isThumbnail: false,
          displayOrder: 2,
        },
      ],
      seo: {
        seoTitle: 'Luxury 450 GSM French Terry Hoodie | Product List',
        metaDescription: 'Shop our signature 450 GSM French terry hoodie. Architectural double-walled hood, stringless minimalist cut, crafted for enduring streetwear style.',
        focusKeyword: 'french terry hoodie',
        secondaryKeywords: 'heavyweight hoodie, luxury black hoodie, 450 gsm sweatshirt, minimalist streetwear hoodie',
        slug: '/products/architectural-french-terry-pullover-hoodie',
        canonicalUrl: 'https://productlist.com/products/architectural-french-terry-pullover-hoodie',
        robotsIndex: true,
        robotsFollow: true,
        ogTitle: 'Architectural French Terry Pullover Hoodie - 450 GSM',
        ogDescription: 'Heavyweight loopback cotton with sculptural double-walled hood.',
        ogImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&auto=format&fit=crop&q=80',
      },
    },
    {
      title: 'Relaxed Fit Normandy Linen Shirt',
      slug: 'relaxed-fit-normandy-linen-shirt',
      sku: 'PL-SHT-LIN-WHT',
      brand: 'PRODUCT LIST ATELIER',
      categorySlug: 'shirts',
      collection: 'Atelier Summer 2026',
      gender: 'MENS',
      fabric: '100% Pure Normandy French Flax Linen (160 GSM)',
      material: 'Pure Linen',
      fit: 'Relaxed Classic Fit',
      pattern: 'Solid Natural Slub',
      season: 'Spring / Summer',
      occasion: 'Resort / Smart Casual / Weekend',
      careInstructions: 'Machine wash delicate cold in laundry bag. Line dry in shade. Warm iron with steam while slightly damp for natural texture.',
      shortDesc: 'Bespoke lightweight French flax linen shirt tailored with genuine mother-of-pearl buttons and breathable open weave.',
      fullDesc: 'Sourced from the historic flax fields of Normandy, this pure linen shirt offers unmatched cooling and tactile luxury. Pre-washed with natural bio-enzymes for immediate softness, it drapes with effortless elegance and features genuine Trocas mother-of-pearl buttons, curved hem, and soft French placket.',
      price: 110.0,
      salePrice: 89.0,
      discount: 19.0,
      stock: 35,
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      isActive: true,
      hoverImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&auto=format&fit=crop&q=80',
      sizes: [
        { name: 'S', inStock: true },
        { name: 'M', inStock: true },
        { name: 'L', inStock: true },
        { name: 'XL', inStock: true },
      ],
      colors: [
        { name: 'Optical White', hex: '#F8FAFC', inStock: true },
        { name: 'Sandstone Beige', hex: '#D4B996', inStock: true },
        { name: 'Sage Olive', hex: '#4B5320', inStock: true },
      ],
      specifications: {
        'Material': '100% Normandy Flax Linen',
        'Buttons': 'Genuine Trocas Mother-of-Pearl',
        'Collar': 'Soft Camp / Spread Hybrid Collar',
        'Yoke': 'Split Back Yoke for Ergonomic Fit',
      },
      features: [
        '100% French flax linen breathes naturally and gets softer with every wash',
        'Pre-washed with bio-enzymes to eliminate stiffness',
        'Equipped with genuine Australian mother-of-pearl buttons',
        'Curved hem allows stylish wear both tucked and untucked',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&auto=format&fit=crop&q=80',
          altText: 'White relaxed fit pure normandy linen shirt for men',
          title: 'Normandy Linen Shirt in Optical White',
          caption: '100% Pure Flax Linen',
          isThumbnail: true,
          displayOrder: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&auto=format&fit=crop&q=80',
          altText: 'Linen shirt mother of pearl buttons and collar stitching detail',
          title: 'Placket & Button Detail',
          caption: 'Trocas pearl buttons',
          isThumbnail: false,
          displayOrder: 2,
        },
      ],
      seo: {
        seoTitle: 'Pure Normandy Linen Shirt for Men | Product List',
        metaDescription: 'Shop our luxury French flax linen shirt. Breathable, pre-washed softness, mother-of-pearl buttons. Ideal for warm seasons and resort wear.',
        focusKeyword: 'linen shirt',
        secondaryKeywords: 'mens linen shirt, white linen casual shirt, summer resort shirt, french flax linen',
        slug: '/products/relaxed-fit-normandy-linen-shirt',
        canonicalUrl: 'https://productlist.com/products/relaxed-fit-normandy-linen-shirt',
        robotsIndex: true,
        robotsFollow: true,
        ogTitle: 'Relaxed Fit Normandy Linen Shirt',
        ogDescription: '100% Normandy Flax Linen with Mother of Pearl buttons.',
        ogImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&auto=format&fit=crop&q=80',
      },
    },
    {
      title: 'Pleated Wide-Leg Tailored Trousers',
      slug: 'pleated-wide-leg-tailored-trousers',
      sku: 'PL-TRS-PLT-BLK',
      brand: 'PRODUCT LIST ATELIER',
      categorySlug: 'denim-trousers',
      collection: 'Monochrome Essentials',
      gender: 'UNISEX',
      fabric: 'Worsted Wool & Lyocell Twill Blend (280 GSM)',
      material: 'Wool Lyocell Blend',
      fit: 'Relaxed Wide Leg with Double Pleats',
      pattern: 'Solid Fine Twill',
      season: 'All Season',
      occasion: 'Smart Casual / Formal / Streetwear',
      careInstructions: 'Dry clean recommended, or hand wash cold gentle. Line dry. Steam press.',
      shortDesc: 'Modern double-pleated trousers engineered with fluid wool-lyocell drape, concealed side tab adjusters, and deep pockets.',
      fullDesc: 'The quintessential modern silhouette: our Pleated Wide-Leg Trouser combines the crisp structure of worsted wool with the silky fluid drape of Tencel Lyocell. Cut with double forward pleats, a high rise, and relaxed straight leg that stacks effortlessly over loafers, boots, or sneakers.',
      price: 145.0,
      salePrice: 125.0,
      discount: 13.8,
      stock: 22,
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      isActive: true,
      hoverImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1000&auto=format&fit=crop&q=80',
      sizes: [
        { name: 'S', inStock: true },
        { name: 'M', inStock: true },
        { name: 'L', inStock: true },
        { name: 'XL', inStock: true },
      ],
      colors: [
        { name: 'Midnight Black', hex: '#111111', inStock: true },
        { name: 'Heather Charcoal', hex: '#374151', inStock: true },
        { name: 'Sandstone Beige', hex: '#D4B996', inStock: true },
      ],
      specifications: {
        'Rise': 'High Rise tailored waist',
        'Pleats': 'Double forward deep pleats',
        'Closure': 'Extended tab with concealed horn button & YKK zip',
        'Adjusters': 'Internal button waistband side adjusters',
      },
      features: [
        'Worsted wool-lyocell twill creates a fluid, wrinkle-resistant drape',
        'Forward pleats add architectural volume through thighs',
        'Side tab adjusters allow a custom fit without needing a belt',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&auto=format&fit=crop&q=80',
          altText: 'Black pleated wide-leg trousers front view with clean break',
          title: 'Pleated Wide-Leg Trousers in Black',
          caption: 'Double forward pleat tailoring',
          isThumbnail: true,
          displayOrder: 1,
        },
      ],
      seo: {
        seoTitle: 'Pleated Wide-Leg Tailored Trousers | Product List',
        metaDescription: 'Shop our luxury pleated wide-leg trousers. Wool-lyocell blend, high rise, double forward pleats for effortless everyday tailoring.',
        focusKeyword: 'pleated trousers',
        secondaryKeywords: 'wide leg trousers, black tailored pants, mens pleated pants, unisex wide trousers',
        slug: '/products/pleated-wide-leg-tailored-trousers',
        canonicalUrl: 'https://productlist.com/products/pleated-wide-leg-tailored-trousers',
        robotsIndex: true,
        robotsFollow: true,
        ogTitle: 'Pleated Wide-Leg Tailored Trousers',
        ogDescription: 'Worsted wool and lyocell blend with double pleats.',
        ogImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&auto=format&fit=crop&q=80',
      },
    },
    {
      title: 'Handloom Silk-Cotton Mandarin Kurta',
      slug: 'handloom-silk-cotton-mandarin-kurta',
      sku: 'PL-ETH-KRT-BUR',
      brand: 'ROYAL HERITAGE EDIT',
      categorySlug: 'ethnic-kurtas',
      collection: 'Royal Heritage Ethnic',
      gender: 'MENS',
      fabric: 'Chanderi Silk-Cotton Handloom (140 GSM)',
      material: 'Silk Cotton Blend',
      fit: 'Tailored Comfort Fit',
      pattern: 'Subtle Woven Jacquard',
      season: 'Festive / All Season',
      occasion: 'Festive / Wedding / Ceremonial',
      careInstructions: 'Dry clean only for initial washes. Gentle hand wash in cold water with mild silk detergent.',
      shortDesc: 'Artisanal handloom silk-cotton kurta with minimal mandarin collar, concealed placket, and side seam pockets.',
      fullDesc: 'Woven by master artisans on traditional handlooms, this festive kurta blends the lustrous sheen of mulberry silk with the breathable comfort of pure cotton. Styled with a crisp 1.5-inch mandarin collar, concealed front button closure, and tailored side slits.',
      price: 120.0,
      salePrice: 98.0,
      discount: 18.3,
      stock: 20,
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      isActive: true,
      hoverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80',
      sizes: [
        { name: 'S', inStock: true },
        { name: 'M', inStock: true },
        { name: 'L', inStock: true },
        { name: 'XL', inStock: true },
        { name: 'XXL', inStock: true },
      ],
      colors: [
        { name: 'Crimson Burgundy', hex: '#881337', inStock: true },
        { name: 'Royal Navy', hex: '#1E3A8A', inStock: true },
        { name: 'Sandstone Beige', hex: '#D4B996', inStock: true },
      ],
      specifications: {
        'Craft': 'Traditional Handloom Weaving',
        'Collar': 'Minimalist Mandarin / Nehru Collar',
        'Pocket': 'Dual side seam deep pockets',
        'Lining': 'Breathable pure cotton half-lining',
      },
      features: [
        'Natural silk-cotton blend provides a subtle royal luster without heaviness',
        'Tailored modern silhouette with clean side slits for ease of movement',
        'Concealed placket creates a minimal, contemporary festive look',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1000&auto=format&fit=crop&q=80',
          altText: 'Burgundy silk-cotton handloom kurta with mandarin collar',
          title: 'Handloom Silk-Cotton Mandarin Kurta',
          caption: 'Royal festive artisan weave',
          isThumbnail: true,
          displayOrder: 1,
        },
      ],
      seo: {
        seoTitle: 'Handloom Silk-Cotton Mens Kurta | Product List',
        metaDescription: 'Shop handcrafted silk-cotton mandarin collar kurtas for men. Contemporary festive tailoring, rich colors, and breathable comfort.',
        focusKeyword: 'mens ethnic kurta',
        secondaryKeywords: 'silk cotton kurta, designer kurta for men, mandarin collar kurta, festive wear kurta',
        slug: '/products/handloom-silk-cotton-mandarin-kurta',
        canonicalUrl: 'https://productlist.com/products/handloom-silk-cotton-mandarin-kurta',
        robotsIndex: true,
        robotsFollow: true,
        ogTitle: 'Handloom Silk-Cotton Mandarin Kurta',
        ogDescription: 'Artisan handloom weave with contemporary mandarin collar.',
        ogImage: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1000&auto=format&fit=crop&q=80',
      },
    },
    {
      title: 'Minimalist Wool Blend Harrington Jacket',
      slug: 'minimalist-wool-blend-harrington-jacket',
      sku: 'PL-JKT-HRN-OLV',
      brand: 'PRODUCT LIST ATELIER',
      categorySlug: 'jackets-outerwear',
      collection: 'Monochrome Essentials',
      gender: 'MENS',
      fabric: 'Double-Faced Wool & Cashmere Blend (380 GSM)',
      material: 'Wool Cashmere Blend',
      fit: 'Tailored Boxy Harrington',
      pattern: 'Solid Matte Finish',
      season: 'Autumn / Winter / Early Spring',
      occasion: 'Smart Casual / Evening / Travel',
      careInstructions: 'Specialist dry clean only. Store on shaped wooden hanger with breathable garment cover.',
      shortDesc: 'Double-faced wool-cashmere blend Harrington jacket with matte metal dual two-way zip and storm collar.',
      fullDesc: 'A modern reimagining of the iconic British Harrington jacket. Constructed from soft double-faced wool enriched with 10% cashmere for exceptional lightweight insulation and wind resistance. Features a two-way brushed gunmetal YKK zipper, internal welt pocket, and discreet elasticated rear waist hem.',
      price: 245.0,
      salePrice: 195.0,
      discount: 20.4,
      stock: 15,
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      isActive: true,
      hoverImage: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=1000&auto=format&fit=crop&q=80',
      sizes: [
        { name: 'S', inStock: true },
        { name: 'M', inStock: true },
        { name: 'L', inStock: true },
        { name: 'XL', inStock: true },
      ],
      colors: [
        { name: 'Sage Olive', hex: '#4B5320', inStock: true },
        { name: 'Midnight Black', hex: '#111111', inStock: true },
        { name: 'Royal Navy', hex: '#1E3A8A', inStock: true },
      ],
      specifications: {
        'Shell': '90% Virgin Wool, 10% Cashmere',
        'Lining': '100% Cupro Japanese breathable lining',
        'Hardware': 'Two-way heavy-gauge YKK metal zipper',
        'Pockets': 'Dual slanted welt exterior pockets + inner chest pocket',
      },
      features: [
        'Wool-cashmere blend offers premium warmth without bulk',
        'Two-way zip allows custom styling and seating comfort',
        'Cupro lining glides smoothly over knitwear and shirts',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=1000&auto=format&fit=crop&q=80',
          altText: 'Olive wool blend harrington jacket with gunmetal two-way zipper',
          title: 'Harrington Jacket in Sage Olive',
          caption: '380 GSM Wool-Cashmere Blend',
          isThumbnail: true,
          displayOrder: 1,
        },
      ],
      seo: {
        seoTitle: 'Wool Blend Harrington Jacket | Product List',
        metaDescription: 'Shop our luxury wool-cashmere Harrington jacket. Wind-resistant, two-way zipper, minimal tailored cut for modern transitional outerwear.',
        focusKeyword: 'wool harrington jacket',
        secondaryKeywords: 'mens wool jacket, minimalist bomber jacket, luxury outerwear, cashmere blend jacket',
        slug: '/products/minimalist-wool-blend-harrington-jacket',
        canonicalUrl: 'https://productlist.com/products/minimalist-wool-blend-harrington-jacket',
        robotsIndex: true,
        robotsFollow: true,
        ogTitle: 'Minimalist Wool Blend Harrington Jacket',
        ogDescription: 'Virgin wool and cashmere blend with Japanese cupro lining.',
        ogImage: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=1000&auto=format&fit=crop&q=80',
      },
    },
    {
      title: 'Tiered Linen Blend Wrap Midi Dress',
      slug: 'tiered-linen-blend-wrap-midi-dress',
      sku: 'PL-DRS-WR-SND',
      brand: 'PRODUCT LIST ATELIER',
      categorySlug: 'dresses-tops',
      collection: 'Atelier Summer 2026',
      gender: 'WOMENS',
      fabric: '70% French Linen, 30% Mulberry Silk (180 GSM)',
      material: 'Linen Silk Blend',
      fit: 'Flattering A-Line Wrap Fit',
      pattern: 'Solid Sandstone Slub',
      season: 'Spring / Summer',
      occasion: 'Resort / Brunch / Casual Elegance',
      careInstructions: 'Hand wash cold or gentle machine cycle in mesh bag. Hang dry in shade. Warm iron.',
      shortDesc: 'Effortless tiered midi wrap dress woven from breathable French linen and mulberry silk with self-tie sash.',
      fullDesc: 'Designed for sun-drenched days and effortless evenings, our Tiered Wrap Midi Dress combines the airy texture of French flax linen with the gentle luster of natural silk. Features a true wrap closure with adjustable waist tie, subtle V-neckline, balloon sleeves with elasticated cuffs, and side slit pockets.',
      price: 160.0,
      salePrice: 135.0,
      discount: 15.6,
      stock: 18,
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      isActive: true,
      hoverImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&auto=format&fit=crop&q=80',
      sizes: [
        { name: 'XS', inStock: true },
        { name: 'S', inStock: true },
        { name: 'M', inStock: true },
        { name: 'L', inStock: true },
      ],
      colors: [
        { name: 'Sandstone Beige', hex: '#D4B996', inStock: true },
        { name: 'Terracotta Rust', hex: '#C2410C', inStock: true },
        { name: 'Optical White', hex: '#F8FAFC', inStock: true },
      ],
      specifications: {
        'Length': 'Midi length (48 inches / 122 cm)',
        'Sleeve': 'Bracelet length soft balloon sleeve',
        'Pockets': 'Dual functional side seam pockets',
        'Closure': 'True wrap with reinforced inner tie and waist sash',
      },
      features: [
        'Linen-silk blend provides cooling airflow with a soft romantic drape',
        'Adjustable wrap waist contours to your unique silhouette',
        'Hidden side pockets ensure everyday convenience',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&auto=format&fit=crop&q=80',
          altText: 'Sandstone beige tiered linen silk wrap midi dress with balloon sleeves',
          title: 'Tiered Linen Wrap Midi Dress',
          caption: 'French linen & mulberry silk blend',
          isThumbnail: true,
          displayOrder: 1,
        },
      ],
      seo: {
        seoTitle: 'Linen Silk Wrap Midi Dress | Product List',
        metaDescription: 'Shop our luxury linen-silk wrap midi dress. Breathable French linen, flattering tiered silhouette, practical side pockets.',
        focusKeyword: 'linen wrap midi dress',
        secondaryKeywords: 'summer wrap dress, womens linen dress, resort midi dress, silk linen clothing',
        slug: '/products/tiered-linen-blend-wrap-midi-dress',
        canonicalUrl: 'https://productlist.com/products/tiered-linen-blend-wrap-midi-dress',
        robotsIndex: true,
        robotsFollow: true,
        ogTitle: 'Tiered Linen Blend Wrap Midi Dress',
        ogDescription: '70% French Linen and 30% Mulberry Silk.',
        ogImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&auto=format&fit=crop&q=80',
      },
    },
    {
      title: 'Extra-Fine Merino Wool Ribbed Turtleneck',
      slug: 'extra-fine-merino-wool-ribbed-turtleneck',
      sku: 'PL-KNT-TTL-BLK',
      brand: 'PRODUCT LIST ATELIER',
      categorySlug: 'knitwear-sweaters',
      collection: 'Monochrome Essentials',
      gender: 'UNISEX',
      fabric: '100% Australian Extra-Fine Merino Wool (19.5 Micron, 12 Gauge)',
      material: 'Merino Wool',
      fit: 'Slim Tailored Base Layer',
      pattern: 'Fine Rib Knit',
      season: 'Autumn / Winter',
      occasion: 'Smart Casual / Layering / Formal',
      careInstructions: 'Hand wash cold with wool detergent. Squeeze gently without twisting. Dry flat on towel away from heat.',
      shortDesc: 'Ultra-soft 19.5 micron Australian Merino wool turtleneck sweater engineered for thermoregulating comfort.',
      fullDesc: 'Spun from sustainably harvested Australian extra-fine Merino wool, this 12-gauge ribbed turtleneck is the ultimate layering essential. Naturally odor-resistant and thermoregulating, it provides warmth without bulk under tailored jackets, overcoats, or overshirts.',
      price: 130.0,
      salePrice: 99.0,
      discount: 23.8,
      stock: 25,
      stockStatus: 'IN_STOCK',
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
      isActive: true,
      hoverImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&auto=format&fit=crop&q=80',
      sizes: [
        { name: 'S', inStock: true },
        { name: 'M', inStock: true },
        { name: 'L', inStock: true },
        { name: 'XL', inStock: true },
      ],
      colors: [
        { name: 'Midnight Black', hex: '#111111', inStock: true },
        { name: 'Heather Charcoal', hex: '#374151', inStock: true },
        { name: 'Crimson Burgundy', hex: '#881337', inStock: true },
      ],
      specifications: {
        'Gauge': '12-Gauge Fine Knit',
        'Fibre Diameter': '19.5 Micron (Non-itch comfort guarantee)',
        'Neck': 'Seamless double-fold high rib neck',
      },
      features: [
        '100% extra-fine Merino wool naturally regulates body temperature',
        'Zero-itch softness verified by 19.5 micron fiber grade',
        'Seamless collar stays snug without constricting',
      ],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1000&auto=format&fit=crop&q=80',
          altText: 'Black extra fine merino wool ribbed turtleneck sweater',
          title: 'Merino Wool Ribbed Turtleneck in Black',
          caption: '19.5 Micron Extra-Fine Australian Merino',
          isThumbnail: true,
          displayOrder: 1,
        },
      ],
      seo: {
        seoTitle: 'Extra-Fine Merino Wool Turtleneck | Product List',
        metaDescription: 'Shop our luxury 19.5 micron Australian Merino wool turtleneck. Thermoregulating, ultra-soft, zero-itch layering sweater.',
        focusKeyword: 'merino wool turtleneck',
        secondaryKeywords: 'black turtleneck sweater, extra fine merino knitwear, luxury roll neck sweater',
        slug: '/products/extra-fine-merino-wool-ribbed-turtleneck',
        canonicalUrl: 'https://productlist.com/products/extra-fine-merino-wool-ribbed-turtleneck',
        robotsIndex: true,
        robotsFollow: true,
        ogTitle: 'Extra-Fine Merino Wool Ribbed Turtleneck',
        ogDescription: '100% Australian Extra-Fine Merino Wool.',
        ogImage: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1000&auto=format&fit=crop&q=80',
      },
    },
  ];

  for (const p of productsData) {
    const createdProduct = await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        sku: p.sku,
        brand: p.brand,
        categoryId: catMap[p.categorySlug] || null,
        collection: p.collection,
        gender: p.gender,
        fabric: p.fabric,
        material: p.material,
        fit: p.fit,
        pattern: p.pattern,
        season: p.season,
        occasion: p.occasion,
        careInstructions: p.careInstructions,
        shortDesc: p.shortDesc,
        fullDesc: p.fullDesc,
        price: p.price,
        salePrice: p.salePrice,
        discount: p.discount,
        currency: 'USD',
        stock: p.stock,
        stockStatus: p.stockStatus,
        isFeatured: p.isFeatured,
        isBestseller: p.isBestseller,
        isNewArrival: p.isNewArrival,
        isActive: p.isActive,
        hoverImage: p.hoverImage,
        sizes: JSON.stringify(p.sizes),
        colors: JSON.stringify(p.colors),
        specifications: JSON.stringify(p.specifications),
        features: JSON.stringify(p.features),
      },
    });

    // Create images
    for (const img of p.images) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: img.url,
          altText: img.altText,
          title: img.title,
          caption: img.caption,
          isThumbnail: img.isThumbnail,
          displayOrder: img.displayOrder,
        },
      });
    }

    // Create Product SEO
    if (p.seo) {
      await prisma.sEO.create({
        data: {
          entityType: 'PRODUCT',
          entityId: createdProduct.id,
          seoTitle: p.seo.seoTitle,
          metaDescription: p.seo.metaDescription,
          focusKeyword: p.seo.focusKeyword,
          secondaryKeywords: p.seo.secondaryKeywords,
          slug: p.seo.slug,
          canonicalUrl: p.seo.canonicalUrl,
          robotsIndex: p.seo.robotsIndex,
          robotsFollow: p.seo.robotsFollow,
          ogTitle: p.seo.ogTitle,
          ogDescription: p.seo.ogDescription,
          ogImage: p.seo.ogImage,
          twitterTitle: p.seo.ogTitle,
          twitterDescription: p.seo.ogDescription,
          twitterImage: p.seo.ogImage,
        },
      });
    }
  }
  console.log('✅ Garment Products, Images & Product SEO seeded');

  // 9. Offers
  const offersData = [
    {
      title: 'Capsule Wardrobe Bundle',
      subtitle: 'BUY 2 TEES + 1 HOODIE & SAVE 25%',
      description: 'Curate your daily luxury monochrome rotation with our signature 240 GSM organic Supima tees and 450 GSM French terry hoodie.',
      discountText: '25% OFF AT CHECKOUT',
      buttonText: 'Shop Essentials Bundle',
      buttonUrl: '/products?collection=Monochrome+Essentials',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      displayOrder: 1,
      isActive: true,
      seo: {
        seoTitle: 'Capsule Wardrobe Bundle Discount | Product List',
        metaDescription: 'Save 25% on our luxury capsule wardrobe bundle. Premium organic tees and heavy hoodies.',
        focusKeyword: 'capsule wardrobe bundle',
        slug: '/offers/capsule-wardrobe-bundle',
      },
    },
    {
      title: 'Summer Linen Allocation',
      subtitle: 'COMPLIMENTARY SHIPPING ON 2+ LINEN SHIRTS',
      description: 'Experience pure Normandy flax linen. Lightweight, breathable, and designed for effortless warm-weather refinement.',
      discountText: 'FREE WORLDWIDE SHIPPING',
      buttonText: 'Explore Linen Edit',
      buttonUrl: '/products?category=shirts',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
      displayOrder: 2,
      isActive: true,
      seo: {
        seoTitle: 'Summer Linen Shirt Offers | Product List',
        metaDescription: 'Discover our seasonal linen shirt specials with complimentary worldwide express shipping.',
        focusKeyword: 'linen shirt offer',
        slug: '/offers/summer-linen-allocation',
      },
    },
    {
      title: 'Festive Heritage Collection Special',
      subtitle: 'UP TO 20% OFF HANDLOOM SILK KURTAS',
      description: 'Celebrate in handcrafted grandeur with traditional silk-cotton weaves and modern tailored mandarin collars.',
      discountText: '20% INTRODUCTORY SAVINGS',
      buttonText: 'Shop Festive Edit',
      buttonUrl: '/products?category=ethnic-kurtas',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
      displayOrder: 3,
      isActive: true,
      seo: {
        seoTitle: 'Festive Ethnic Kurta Special | Product List',
        metaDescription: 'Limited time offers on handloom silk-cotton kurtas and festive garment edits.',
        focusKeyword: 'ethnic kurta offer',
        slug: '/offers/festive-heritage-collection',
      },
    },
  ];

  for (const off of offersData) {
    const createdOffer = await prisma.offer.create({
      data: {
        title: off.title,
        subtitle: off.subtitle,
        description: off.description,
        discountText: off.discountText,
        buttonText: off.buttonText,
        buttonUrl: off.buttonUrl,
        image: off.image,
        displayOrder: off.displayOrder,
        isActive: off.isActive,
      },
    });

    if (off.seo) {
      await prisma.sEO.create({
        data: {
          entityType: 'OFFER',
          entityId: createdOffer.id,
          seoTitle: off.seo.seoTitle,
          metaDescription: off.seo.metaDescription,
          focusKeyword: off.seo.focusKeyword,
          slug: off.seo.slug,
          canonicalUrl: `https://productlist.com${off.seo.slug}`,
          robotsIndex: true,
          robotsFollow: true,
          ogTitle: off.title,
          ogDescription: off.description,
          ogImage: off.image,
        },
      });
    }
  }
  console.log('✅ Offers seeded');

  // 10. Page Content & Dedicated SEO Content Section
  const pageContents = [
    {
      sectionKey: 'home_announcement_bar',
      page: 'home',
      title: 'COMPLIMENTARY WORLDWIDE EXPRESS SHIPPING ON ORDERS OVER $150 • USE CODE ATELIER26',
      subtitle: 'ACTIVE',
      content: 'True',
    },
    {
      sectionKey: 'home_featured_heading',
      page: 'home',
      title: 'Signature Garments Collection',
      subtitle: 'HANDCRAFTED ATELIER ESSENTIALS',
      content: 'Meticulously engineered garments made from 240 GSM organic Supima cotton, Normandy flax linen, and Japanese selvedge denim.',
    },
    {
      sectionKey: 'home_categories_heading',
      page: 'home',
      title: 'Shop by Garment Category',
      subtitle: 'EXPLORE COLLECTIONS',
      content: 'Browse our specialized departments curated for timeless everyday elegance and modern streetwear drape.',
    },
    {
      sectionKey: 'home_offers_heading',
      page: 'home',
      title: 'Curated Offers & Seasonal Drops',
      subtitle: 'EXCLUSIVE ALLOCATIONS',
      content: 'Limited-quantity introductory releases and capsule wardrobe bundle savings.',
    },
    {
      sectionKey: 'home_showcase_heading',
      page: 'home',
      title: 'The Complete Garments Catalog',
      subtitle: 'CURATED WARDROBE',
      content: 'Explore every silhouette with transparent fabric specifications, size availability, and direct color swatches.',
    },
    {
      sectionKey: 'home_cta_banner',
      page: 'home',
      title: 'Sustainable Elegance & Master Tailoring',
      subtitle: 'THE ATELIER MANIFESTO',
      content: 'We believe clothing should be enduring, tactile, and ethically crafted. Every garment is cut from GOTS-certified organic fibers and finished with bespoke artisanal precision.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80',
      meta: JSON.stringify({ buttonText: 'Explore New Season Drops', buttonUrl: '/products' }),
    },
    {
      sectionKey: 'home_about_brand',
      page: 'home',
      title: 'Rooted in Craftsmanship & Sustainable Fibers',
      subtitle: 'ABOUT PRODUCT LIST ATELIER',
      content: 'Founded on the philosophy that modern fashion should marry sculptural aesthetics with uncompromising textile integrity. Our materials are traceable from certified organic cotton mills in Portugal to handloom silk weavers in India.',
    },
    {
      sectionKey: 'home_seo_content',
      page: 'home',
      title: 'Premium Garments & Sustainable Fashion Collection',
      subtitle: 'THE ART OF LUXURY DRESSING',
      content: `Welcome to PRODUCT LIST, your premier destination for luxury garments, sustainable fashion, and bespoke wardrobe essentials. Our design studio merges architectural minimalist silhouettes with ethically sourced, high-grade textiles.

Whether you are looking for heavyweight 240 GSM organic Supima cotton T-shirts, structured 450 GSM French terry hoodies, breezy Normandy flax linen shirts, double-pleated tailored trousers, or handcrafted silk-cotton ethnic kurtas, our curated collection is engineered to offer unmatched longevity, breathability, and poise.

Every garment features detailed sizing charts, size-wise inventory availability, authentic color swatches, and transparent fabric care instructions. We adhere to rigorous fair-wage labor standards and use non-toxic, eco-friendly dye processes to ensure our clothing is gentle on your skin and conscious of the planet. Experience seamless online ordering with fast worldwide express delivery and hassle-free returns.`,
    },
  ];

  for (const pc of pageContents) {
    await prisma.pageContent.create({ data: pc });
  }
  console.log('✅ Page Contents & Homepage SEO Content seeded');

  // 11. Navigation Items
  const navItems = [
    { label: 'New Arrivals', url: '/products?isNewArrival=true', location: 'HEADER', displayOrder: 1, isActive: true },
    { label: 'T-Shirts & Polos', url: '/products?category=t-shirts-polos', location: 'HEADER', displayOrder: 2, isActive: true },
    { label: 'Hoodies', url: '/products?category=hoodies-sweatshirts', location: 'HEADER', displayOrder: 3, isActive: true },
    { label: 'Shirts', url: '/products?category=shirts', location: 'HEADER', displayOrder: 4, isActive: true },
    { label: 'Trousers & Denim', url: '/products?category=denim-trousers', location: 'HEADER', displayOrder: 5, isActive: true },
    { label: 'Ethnic Wear', url: '/products?category=ethnic-kurtas', location: 'HEADER', displayOrder: 6, isActive: true },
    { label: 'Offers', url: '/offers', location: 'HEADER', displayOrder: 7, isActive: true },
    { label: 'About Atelier', url: '/about', location: 'HEADER', displayOrder: 8, isActive: true },
    { label: 'Contact', url: '/contact', location: 'HEADER', displayOrder: 9, isActive: true },

    // Footer items
    { label: 'Oversized T-Shirts', url: '/products?category=t-shirts-polos', location: 'FOOTER', column: 'Shop', displayOrder: 1, isActive: true },
    { label: 'Heavyweight Hoodies', url: '/products?category=hoodies-sweatshirts', location: 'FOOTER', column: 'Shop', displayOrder: 2, isActive: true },
    { label: 'Linen & Oxford Shirts', url: '/products?category=shirts', location: 'FOOTER', column: 'Shop', displayOrder: 3, isActive: true },
    { label: 'Pleated Trousers', url: '/products?category=denim-trousers', location: 'FOOTER', column: 'Shop', displayOrder: 4, isActive: true },
    { label: 'Ethnic Kurtas', url: '/products?category=ethnic-kurtas', location: 'FOOTER', column: 'Shop', displayOrder: 5, isActive: true },

    { label: 'Atelier Summer 2026', url: '/products?collection=Atelier+Summer+2026', location: 'FOOTER', column: 'Collections', displayOrder: 1, isActive: true },
    { label: 'Monochrome Essentials', url: '/products?collection=Monochrome+Essentials', location: 'FOOTER', column: 'Collections', displayOrder: 2, isActive: true },
    { label: 'Urban Streetwear', url: '/products?collection=Urban+Streetwear', location: 'FOOTER', column: 'Collections', displayOrder: 3, isActive: true },
    { label: 'Royal Heritage Edit', url: '/products?collection=Royal+Heritage+Ethnic', location: 'FOOTER', column: 'Collections', displayOrder: 4, isActive: true },

    { label: 'Size & Fit Guide', url: '/about#sizing', location: 'FOOTER', column: 'Support', displayOrder: 1, isActive: true },
    { label: 'Garment Care Guide', url: '/about#care', location: 'FOOTER', column: 'Support', displayOrder: 2, isActive: true },
    { label: 'Shipping & Delivery', url: '/contact#shipping', location: 'FOOTER', column: 'Support', displayOrder: 3, isActive: true },
    { label: 'Returns & Concierge', url: '/contact', location: 'FOOTER', column: 'Support', displayOrder: 4, isActive: true },

    { label: 'Sustainability & Fabric Ethics', url: '/about', location: 'FOOTER', column: 'Legal', displayOrder: 1, isActive: true },
    { label: 'Privacy Policy', url: '/about#privacy', location: 'FOOTER', column: 'Legal', displayOrder: 2, isActive: true },
    { label: 'Terms of Service', url: '/about#terms', location: 'FOOTER', column: 'Legal', displayOrder: 3, isActive: true },
  ];

  for (const n of navItems) {
    await prisma.navigationItem.create({ data: n });
  }
  console.log('✅ Navigation items seeded');

  // 12. Global Site & SEO Settings
  const siteSettings = [
    { key: 'site_name', value: 'PRODUCT LIST | Garments & Fashion Atelier', type: 'text', group: 'general' },
    { key: 'site_tagline', value: 'Luxury Sustainable Garments & Bespoke Everyday Silhouettes', type: 'text', group: 'general' },
    { key: 'site_currency', value: '$', type: 'text', group: 'general' },
    { key: 'contact_email', value: 'concierge@productlist.com', type: 'text', group: 'contact' },
    { key: 'contact_phone', value: '+1 (800) 555-FASHION', type: 'text', group: 'contact' },
    { key: 'contact_address', value: '540 Atelier Boulevard, Fashion District, New York, NY 10018', type: 'text', group: 'contact' },

    // SEO Settings
    { key: 'seo_site_title', value: 'PRODUCT LIST | Luxury Garments & Fashion Showcase', type: 'text', group: 'seo' },
    { key: 'seo_meta_description', value: 'Shop luxury garments, heavyweight organic t-shirts, French terry hoodies, linen shirts, and tailored ethnic wear from Product List. Worldwide shipping.', type: 'text', group: 'seo' },
    { key: 'seo_keywords', value: 'garments, luxury clothing, fashion brand, oversized t-shirts, hoodies, linen shirts, pleated trousers, ethnic kurtas', type: 'text', group: 'seo' },
    { key: 'seo_canonical_base_url', value: 'https://productlist.com', type: 'text', group: 'seo' },
    { key: 'seo_default_og_image', value: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80', type: 'image', group: 'seo' },
    { key: 'seo_google_verification', value: 'google-site-verification=pl_garments_seo_2026_verified', type: 'text', group: 'seo' },
    { key: 'seo_bing_verification', value: 'bing-verification=pl_bing_2026_garments', type: 'text', group: 'seo' },

    // Theme Customizer Colors (Requirement #27)
    { key: 'primary_color', value: '#111111', type: 'color', group: 'appearance' },
    { key: 'secondary_color', value: '#555555', type: 'color', group: 'appearance' },
    { key: 'accent_color', value: '#2563EB', type: 'color', group: 'appearance' },
    { key: 'background_color', value: '#FFFFFF', type: 'color', group: 'appearance' },
    { key: 'surface_color', value: '#F8F8F8', type: 'color', group: 'appearance' },
    { key: 'card_background', value: '#FFFFFF', type: 'color', group: 'appearance' },
    { key: 'border_color', value: '#E5E5E5', type: 'color', group: 'appearance' },
    { key: 'heading_color', value: '#111111', type: 'color', group: 'appearance' },
    { key: 'text_color', value: '#555555', type: 'color', group: 'appearance' },
    { key: 'button_background', value: '#111111', type: 'color', group: 'appearance' },
    { key: 'button_text', value: '#FFFFFF', type: 'color', group: 'appearance' },
    { key: 'button_hover', value: '#333333', type: 'color', group: 'appearance' },
    { key: 'header_background', value: '#FFFFFF', type: 'color', group: 'appearance' },
    { key: 'footer_background', value: '#111111', type: 'color', group: 'appearance' },
    { key: 'footer_text', value: '#FFFFFF', type: 'color', group: 'appearance' },
    { key: 'success_color', value: '#16A34A', type: 'color', group: 'appearance' },
    { key: 'warning_color', value: '#F59E0B', type: 'color', group: 'appearance' },
    { key: 'error_color', value: '#DC2626', type: 'color', group: 'appearance' },
  ];

  for (const s of siteSettings) {
    await prisma.siteSetting.create({ data: s });
  }
  console.log('✅ Site & SEO Settings seeded');

  // 13. Page-Level SEO records (Home, Products, Categories, Offers, About, Contact)
  const pageSEOs = [
    {
      entityType: 'PAGE',
      entityId: 'home',
      seoTitle: 'PRODUCT LIST | Garments & Sustainable Fashion Atelier',
      metaDescription: 'Explore luxury garments, heavyweight organic Supima cotton tees, French terry hoodies, Normandy linen shirts, and modern ethnic kurtas.',
      focusKeyword: 'garments fashion clothing',
      secondaryKeywords: 'luxury garments, sustainable clothing, designer fashion, oversized t-shirts, linen shirts',
      slug: '/',
      canonicalUrl: 'https://productlist.com',
      robotsIndex: true,
      robotsFollow: true,
      ogTitle: 'PRODUCT LIST - Luxury Garments & Fashion Atelier',
      ogDescription: 'Curated fashion collection crafted from certified organic textiles and bespoke tailoring.',
      ogImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
    },
    {
      entityType: 'PAGE',
      entityId: 'products',
      seoTitle: 'Shop All Garments & Clothing Online | Product List',
      metaDescription: 'Browse the entire Product List fashion catalog. Filter by garment category, fabric, size XS-3XL, color swatches, and tailored fits.',
      focusKeyword: 'clothing catalog online',
      secondaryKeywords: 'buy garments online, luxury apparel, streetwear clothing, sustainable fashion shop',
      slug: '/products',
      canonicalUrl: 'https://productlist.com/products',
      robotsIndex: true,
      robotsFollow: true,
      ogTitle: 'All Garments & Fashion Catalog - Product List',
      ogDescription: 'Filter by category, size, color swatch, and premium organic fabrics.',
      ogImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200',
    },
    {
      entityType: 'PAGE',
      entityId: 'categories',
      seoTitle: 'Garment Categories & Fashion Collections | Product List',
      metaDescription: 'Explore all fashion categories: T-Shirts, Hoodies, Linen Shirts, Trousers, Jackets, Ethnic Wear, Dresses, and Knitwear.',
      focusKeyword: 'garment categories',
      secondaryKeywords: 'clothing categories, fashion collections, apparel departments',
      slug: '/categories',
      canonicalUrl: 'https://productlist.com/categories',
      robotsIndex: true,
      robotsFollow: true,
      ogTitle: 'Garment Categories - Product List',
      ogDescription: 'Browse specialized fashion collections engineered for everyday elegance.',
      ogImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200',
    },
    {
      entityType: 'PAGE',
      entityId: 'offers',
      seoTitle: 'Special Offers & Capsule Wardrobe Deals | Product List',
      metaDescription: 'Access time-limited offers, introductory drops, and capsule wardrobe bundle savings on luxury garments.',
      focusKeyword: 'garments offers sale',
      secondaryKeywords: 'clothing discount, fashion sale, capsule bundle discount',
      slug: '/offers',
      canonicalUrl: 'https://productlist.com/offers',
      robotsIndex: true,
      robotsFollow: true,
      ogTitle: 'Seasonal Offers & Fashion Deals - Product List',
      ogDescription: 'Exclusive introductory savings on signature garments.',
      ogImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200',
    },
    {
      entityType: 'PAGE',
      entityId: 'about',
      seoTitle: 'About Product List Atelier | Sustainable Fashion & Craftsmanship',
      metaDescription: 'Learn about Product List’s commitment to sustainable organic fabrics, fair trade atelier manufacturing, and timeless clothing silhouettes.',
      focusKeyword: 'sustainable fashion brand',
      secondaryKeywords: 'about product list, ethical garments, organic supima cotton, artisan tailoring',
      slug: '/about',
      canonicalUrl: 'https://productlist.com/about',
      robotsIndex: true,
      robotsFollow: true,
      ogTitle: 'About Product List Atelier - Sustainable Craftsmanship',
      ogDescription: 'Our journey, ethical fabric certifications, and bespoke garment philosophy.',
      ogImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
    },
    {
      entityType: 'PAGE',
      entityId: 'contact',
      seoTitle: 'Contact Concierge & Customer Care | Product List',
      metaDescription: 'Get in touch with the Product List concierge for custom sizing assistance, garment care advice, order tracking, and bespoke styling.',
      focusKeyword: 'contact fashion concierge',
      secondaryKeywords: 'customer care, garment sizing help, product list support',
      slug: '/contact',
      canonicalUrl: 'https://productlist.com/contact',
      robotsIndex: true,
      robotsFollow: true,
      ogTitle: 'Contact Concierge - Product List',
      ogDescription: 'Reach our dedicated fashion concierge team.',
      ogImage: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=1200',
    },
  ];

  for (const pSEO of pageSEOs) {
    await prisma.sEO.create({ data: pSEO });
  }
  console.log('✅ Page-level SEO records seeded');

  console.log('🎉 GARMENTS & FASHION SHOWCASE database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
