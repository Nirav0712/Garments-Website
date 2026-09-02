const express = require('express');
const router = express.Router();
const {
  getSEODashboard,
  getSEO,
  saveSEO,
  getGlobalSEOSettings,
  updateGlobalSEOSettings,
  generateSitemap,
  generateRobotsTxt,
} = require('../controllers/seoController');
const { protect } = require('../middleware/auth');

// Public XML Sitemap & Robots endpoints
router.get('/sitemap.xml', generateSitemap);
router.get('/robots.txt', generateRobotsTxt);

// Dashboard audit (Admin only)
router.get('/dashboard', protect, getSEODashboard);

// Global settings
router.get('/settings', getGlobalSEOSettings);
router.put('/settings', protect, updateGlobalSEOSettings);

// Entity-specific SEO (PRODUCT, CATEGORY, PAGE, OFFER)
router.get('/:entityType/:entityId', getSEO);
router.put('/:entityType/:entityId', protect, saveSEO);

module.exports = router;
