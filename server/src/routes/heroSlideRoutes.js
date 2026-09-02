const express = require('express');
const router = express.Router();
const {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
} = require('../controllers/heroSlideController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getHeroSlides)
  .post(protect, adminOnly, createHeroSlide);

router.put('/reorder', protect, adminOnly, reorderHeroSlides);

router.route('/:id')
  .put(protect, adminOnly, updateHeroSlide)
  .delete(protect, adminOnly, deleteHeroSlide);

module.exports = router;
