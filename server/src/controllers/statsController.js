const prisma = require('../config/db');

// @desc    Get dashboard metrics & activity statistics
// @route   GET /api/stats/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      featuredProducts,
      bestsellerProducts,
      lowStockProducts,
      totalCategories,
      totalHeroSlides,
      activeOffers,
      totalMedia,
      unreadInquiries,
      recentProducts,
      recentInquiries,
      categoriesDistribution,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isFeatured: true, isActive: true } }),
      prisma.product.count({ where: { isBestseller: true, isActive: true } }),
      prisma.product.count({ where: { stock: { lte: 10 } } }),
      prisma.category.count(),
      prisma.heroSlide.count({ where: { isActive: true } }),
      prisma.offer.count({ where: { isActive: true } }),
      prisma.media.count(),
      prisma.contactSubmission.count({ where: { status: 'UNREAD' } }),
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true } },
          images: { where: { isThumbnail: true }, take: 1 },
        },
      }),
      prisma.contactSubmission.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { products: true } },
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        featuredProducts,
        bestsellerProducts,
        lowStockProducts,
        totalCategories,
        totalHeroSlides,
        activeOffers,
        totalMedia,
        unreadInquiries,
      },
      recentProducts,
      recentInquiries,
      categoriesDistribution: categoriesDistribution.map((c) => ({
        name: c.name,
        count: c._count.products,
      })),
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching statistics' });
  }
};

module.exports = { getDashboardStats };
