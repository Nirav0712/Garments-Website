const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const sizeRoutes = require('./sizeRoutes');
const colorRoutes = require('./colorRoutes');
const collectionRoutes = require('./collectionRoutes');
const heroSlideRoutes = require('./heroSlideRoutes');
const offerRoutes = require('./offerRoutes');
const contentRoutes = require('./contentRoutes');
const navigationRoutes = require('./navigationRoutes');
const settingRoutes = require('./settingRoutes');
const seoRoutes = require('./seoRoutes');
const mediaRoutes = require('./mediaRoutes');
const contactRoutes = require('./contactRoutes');
const statsRoutes = require('./statsRoutes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/sizes', sizeRoutes);
router.use('/colors', colorRoutes);
router.use('/collections', collectionRoutes);
router.use('/hero-slides', heroSlideRoutes);
router.use('/offers', offerRoutes);
router.use('/content', contentRoutes);
router.use('/navigation', navigationRoutes);
router.use('/settings', settingRoutes);
router.use('/seo', seoRoutes);
router.use('/media', mediaRoutes);
router.use('/contact', contactRoutes);
router.use('/stats', statsRoutes);

module.exports = router;
