const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  duplicateProduct,
  deleteProduct,
  toggleStatus,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

router.post('/:id/duplicate', protect, adminOnly, duplicateProduct);
router.patch('/:id/toggle', protect, adminOnly, toggleStatus);

router.route('/:slug')
  .get(getProductBySlug);

router.route('/:id')
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;
