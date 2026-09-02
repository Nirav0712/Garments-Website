const express = require('express');
const router = express.Router();
const { getColors, createColor, updateColor, deleteColor } = require('../controllers/colorController');
const { protect } = require('../middleware/auth');

router.get('/', getColors);
router.post('/', protect, createColor);
router.put('/:id', protect, updateColor);
router.delete('/:id', protect, deleteColor);

module.exports = router;
