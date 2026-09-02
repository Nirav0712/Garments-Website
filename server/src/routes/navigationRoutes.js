const express = require('express');
const router = express.Router();
const {
  getNavigation,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
} = require('../controllers/navigationController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getNavigation)
  .post(protect, adminOnly, createNavigationItem);

router.route('/:id')
  .put(protect, adminOnly, updateNavigationItem)
  .delete(protect, adminOnly, deleteNavigationItem);

module.exports = router;
