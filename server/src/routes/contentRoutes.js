const express = require('express');
const router = express.Router();
const {
  getContent,
  updateContent,
  bulkUpdateContent,
} = require('../controllers/contentController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getContent);

router.post('/bulk', protect, adminOnly, bulkUpdateContent);

router.route('/:sectionKey')
  .put(protect, adminOnly, updateContent);

module.exports = router;
