const express = require('express');
const router = express.Router();
const { getCollections, createCollection, updateCollection, deleteCollection } = require('../controllers/collectionController');
const { protect } = require('../middleware/auth');

router.get('/', getCollections);
router.post('/', protect, createCollection);
router.put('/:id', protect, updateCollection);
router.delete('/:id', protect, deleteCollection);

module.exports = router;
