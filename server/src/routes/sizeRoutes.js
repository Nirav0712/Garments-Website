const express = require('express');
const router = express.Router();
const { getSizes, createSize, updateSize, deleteSize } = require('../controllers/sizeController');
const { protect } = require('../middleware/auth');

router.get('/', getSizes);
router.post('/', protect, createSize);
router.put('/:id', protect, updateSize);
router.delete('/:id', protect, deleteSize);

module.exports = router;
