const express = require('express');
const router = express.Router();
const { getMedia, uploadMedia, deleteMedia } = require('../controllers/mediaController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(protect, adminOnly, getMedia);

router.post('/upload', protect, adminOnly, upload.array('files', 10), uploadMedia);
router.post('/single', protect, adminOnly, upload.single('file'), uploadMedia);

router.route('/:id')
  .delete(protect, adminOnly, deleteMedia);

module.exports = router;
