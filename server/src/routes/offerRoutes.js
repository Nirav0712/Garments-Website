const express = require('express');
const router = express.Router();
const {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} = require('../controllers/offerController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getOffers)
  .post(protect, adminOnly, createOffer);

router.route('/:id')
  .put(protect, adminOnly, updateOffer)
  .delete(protect, adminOnly, deleteOffer);

module.exports = router;
